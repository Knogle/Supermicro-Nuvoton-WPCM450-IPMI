//------------------------------------------------------------------------------
// DomAPI domapi RPC routines
// D. Kadrioski 11/01/2002
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// based on a work by Danne Lundqvist
//------------------------------------------------------------------------------
// Additional Contributors Include:
// R. Hanssen ronnyh@thilde.org
//------------------------------------------------------------------------------

domapi.loadUnit("rpcpacket");
//------------------------------------------------------------------------------
domapi.rpc              = {};
domapi.rpc.charset      = "ISO-8859-1";
domapi.rpc.doDebug      = false;
domapi.rpc.manageCursor = true;
domapi.rpc.timeout      = 30000;
domapi.rpc.lastError    = ""; // read lastError for message text
domapi.rpc.lastUrl      = ""; // useful for debugging, contains last request sent
// start private members
domapi.rpc._handlers    = [];
domapi.rpc._thandlers   = []; // optional timeout handler
domapi.rpc._inMotion    = [];
domapi.rpc._cursorR     = "default"; // used to restore cursor to previous state
domapi.rpc._id          = "domapi_rpc_dispatch";
domapi.headTag          = null;

domapi.rpc.onsend       = function(packet){}; // virtual
domapi.rpc.onreceive    = function(packet){}; // virtual
domapi.rpc.ontimeout    = function(packet){}; // virtual
//------------------------------------------------------------------------------
// RH: Changed args: Moved recvObj & timeoutObj inside the recvHandler and the timeoutHandler args.
//     This is like it was originally. If recvHandler and timeoutHandler are objects, then they can then bring with them
//     the needed properties to make this work nicely.
//     An object-handler is defined as follows:
//       var objHandler = {obj: MyObject , fn: MyObject.myFunction , params: [param1, "Send me along", 100]}
//     MyObject is the object that has the handling-function (myFunction) defined. the param must be an array of params to pass
//     In effect this would be the resulting action of the above definition - if the handler was triggered:
//       MyObject.myFunction(param1, "Send me along", 100);
//------------------------------------------------------------------------------
domapi.rpc.setCursor = function(busy){
  var s = domapi.bodyElm().style;
  var t = this;
  if(busy)t._cursorR = s.cursor;
  if(t.manageCursor)s.cursor = busy?"wait":t._cursorR;
};
//------------------------------------------------------------------------------
domapi.rpc.sendPacket = function(arg){ // return: 1=success -1=error -2=nothing to do
  try{
    var p        = arg["packet"   ];
    var recvH    = arg["onreceive"];
    var timeout  = arg["timeout"  ];
    var timeoutH = arg["ontimeout"];
    if(this.doDebug)alert("Sending packet " + p.guid);
    // RH: Changes start (Back to original. We push the function/object-handlers onto the stack. We don't care what it is, only that it exists)
    if(recvH)
      this._handlers.push([p.guid,recvH]);
    if(timeoutH)
      this._thandlers.push([p.guid,timeoutH]);
    // RH: Changes end
    this.setCursor(1);
    if(p.method == mtGet )return this._dispatchAsGet( p,timeout);
    if(p.method == mtPost)return this._dispatchAsPost(p,timeout);
    return -2;
  }catch(E){
    if(this.doDebug)alert("Error in sendPacket:" + E.message);
    this.lastError = E.message;
    return -1;
  }
};
//------------------------------------------------------------------------------
// RH: Added support for object-oriented handlers in addition to the old functional handler.
domapi.rpc.receivePacket = function(packet){ // return: 1=success -1=error -2=timed out packet recieved
  try{
    if(this.doDebug)alert("Receiving packet "+packet.guid);

    if(this.dispatcher != null){
      if(domapi.isIE5)this.dispatcher.location.replace('about:blank');
      else if(domapi.isIE)this.dispatcher.contentWindow.location.replace('about:blank');
    }

    var method;
    var found = false;
    for(var a=0;a<this._inMotion.length;a++)
      if(this._inMotion[a].guid == packet.guid){
        method = this._inMotion[a].method;
        this._inMotion.deleteItem(a);
        found = true;
      }

    if(!found){
      this.lastError = domapi.getString("RPC_TIMED_OUT");
      if(this.doDebug)alert(this.lastError);
      if(this._inMotion.length==0)this.setCursor(0);
      return -2;
    }

    this.onreceive(packet);

    if(this.doDebug)alert("_handlers="+this._handlers);
    for(a=0;a<this._handlers.length;a++) // search for optional handler
      if(this._handlers[a][0]==packet.guid){ // based on the packet guid
        if(this.doDebug)alert("Handler found for packet "+packet.guid);
        var recvHandler = this._handlers[a][1];
        // RH: Changes start (Treat differently depending on whether the supplied handler is a function or an object.)
        if(recvHandler && recvHandler!="undefined"){ // defined & not null
          var obj    = null;
          var fn     = recvHandler;
          var params = [packet];  // must be array
          if(typeof(recvHandler) == "object"){ // valid object
            obj    = recvHandler.obj;  // pointer to object. (null means anonymous (non-OO))
            fn     = recvHandler.fn;  // the function to call
            params = params.concat(recvHandler.params);  // add additional params to the array
            if(this.doDebug)
              if (obj) alert("OO with object, obj: " + obj + "\nfn:\n" + fn + "\nparams: " + params.toString());
              else alert("OO with null-object, obj: " + obj + "\nfn:\n" + fn + "\nparams: " + params.toString());
          } else if(this.doDebug) alert("Non-OO, obj: " + obj + "\nfn:\n" + fn + "\nparams: " + params.toString());

          fn.apply(obj, params);  // Do the actual handler-call
        }
        // RH: Changes end
        this._handlers.deleteItem(a);        // remove it from the list, guid's are not reused
        break;
      }
    status = defaultStatus;

    if(method == mtGet){
      var t  = document.getElementById(packet.guid); // remove the script tag
      if(t){
        if(this.headTag)this.headTag.removeChild(t);
        else throw({message:domapi.getString("RPC_NO_HEAD1")});
      }else  throw({message:domapi.getString("RPC_NO_SCRIPT")});
    }
    if(this._inMotion.length==0)this.setCursor(0);
    return 1;
  }catch(E){
    if(this.doDebug)alert("Error in receivePacket:"+E.message);
    this.lastError = E.message;
    return -1;
  }
};
//------------------------------------------------------------------------------
domapi.rpc._dispatchAsGet = function(p,timeout){ // return: 1=success -1=error -2=nothing to do
  try{
    if(!p)return -2;

    var d   = p.data;
    var url = p.url;
    url    += ((p.url.indexOf("?")!=-1)?"&":"?") +
              "guid=" + p.guid +
              "&ds=" + new Date().getTime() +
              "&method=GET" +
              "&" + d.saveToURL("&","=",true); // $custom: (cst) was saveToString

    if(this.doDebug){alert("Dispatching: "+url);window.open(url,null,"status=yes,toolbar=yes,",null);}

    var scriptTag     = document.createElement("SCRIPT");
    scriptTag.charset = this.charset;
    scriptTag.src     = url;
    scriptTag.type    = "text/javascript";
    scriptTag.defer   = true;
    scriptTag.id      = p.guid;
    this.lastUrl      = url;

    if(!this.headTag)this.headTag = this._getHeadTag();
    if(!this.headTag)throw({message:domapi.getString("RPC_NO_HEAD2")});

    status = p.statusText;

    this._inMotion.push(      p);
    this.headTag.appendChild( scriptTag);

    setTimeout("domapi.rpc._timeoutHandler('"+p.guid+"')",timeout==null?this.timeout:timeout*1000);
    this.onsend(p);

    return 1;
  }catch(E){
    if(this.doDebug)alert("Error in _dispatchAsGet:"+E.message);
    this.lastError = E.message;
    return -1;
  }
};
//------------------------------------------------------------------------------
domapi.rpc._dispatchAsPost = function(p,timeout){ // return: 1=success -1=error -2=nothing to do
  // rather than send all the packet data as url parameters, we instead always
  // post the data in a form.  This overcomes any limitations in url length
  try{
    if(!p)return -2;
    this._createDispatcher();

    if(domapi.isIE5)var doc = this.dispatcher.document;
    else var doc = domapi.isIE?this.dispatcher.contentWindow.document:this.dispatcher.contentDocument;

    var d   = p.data;
    var url = p.url +=
              ((p.url.indexOf("?")!=-1)?"&":"?") +
              "guid=" + p.guid +
              "&ds=" + new Date().getTime() +
              "&method=POST";

    if(this.doDebug){alert("Dispatching: "+url);window.open(url,"debugwin","status=yes,toolbar=yes,",null);} // $custom: (cst) added name "debugwin" for debugging rpc in a new window
    var temp = '<html><body>'+
               '<form name="rpcForm" method="post" target="" action="' + url + '">';
    for(var a=0;a<d.names.length;a++)
      temp  += '<input type="hidden" name="' + d.names[a] + '" value="' + encodeURI(d.values[a]) + '">'; // §todo: (cst) use encodeURI instead of escape
    temp    += '</form></body></html>';

    doc.open(); doc.write(temp); doc.close();

    status = p.statusText;

    this._inMotion.push(      p);
    doc.forms['rpcForm'].submit();

	if(this.doDebug){ doc.forms['rpcForm'].target="debugwin"; doc.forms['rpcForm'].submit(); } // $custom: (cst) send also the parameter by post to the debug window
	
    setTimeout("domapi.rpc._timeoutHandler('"+p.guid+"')",timeout==null?this.timeout:timeout*1000);
    this.onsend(p);

    return 1;
  }catch(E){
    if(this.doDebug)alert("Error in _dispatchAsPost:"+E.message);
    this.lastError = E.message;
    return -1;
  }
};
//------------------------------------------------------------------------------
domapi.rpc._getHeadTag = function(){
  var h = document.getElementsByTagName("HEAD");
  return (h.length>0)?h[0]:null;
};
//------------------------------------------------------------------------------
// RH: Added support for object-oriented handlers in addition to the old functional handler.
domapi.rpc._timeoutHandler = function(guid){
  var found_thandler = false;

  for(var a=0;a<this._inMotion.length;a++)
    if(this._inMotion[a].guid == guid){

      for(var b=0;b<this._thandlers.length;b++)
        if(this._thandlers[b][0]==guid){
          found_thandler = true;
          this._inMotion.deleteItem(a);
          var timeoutHandler = this._thandlers[b][1];
        // RH: Changes start (Treat differently depending on whether the supplied handler is a function or an object.)
          if(timeoutHandler && timeoutHandler!="undefined"){ // defined & not null
            var obj    = null;
            var fn     = timeoutHandler;
            var params = [];  // must be array
            if(typeof(timeoutHandler) == "object"){ // valid object
              obj    = timeoutHandler.obj;  // pointer to object. (null means anonymous (non-OO))
              fn     = timeoutHandler.fn;  // the function to call
              params = params.concat(timeoutHandler.params);  // add additional params to the array
              if(this.doDebug)
                if (obj) alert("OO with object, obj: " + obj + "\nfn:\n" + fn + "\nparams: " + params.toString());
                else alert("OO with null-object, obj: " + obj + "\nfn:\n" + fn + "\nparams: " + params.toString());
            } else if(this.doDebug) alert("Non-OO, obj: " + obj + "\nfn:\n" + fn + "\nparams: " + params.toString());

            fn.apply(obj, params);  // Do the actual handler-call
          }
          // RH: Changes end
          this._thandlers.deleteItem(b);
          break;
        }

      if (! found_thandler){
        this.ontimeout(this._inMotion[a]);
        this._inMotion.deleteItem(a);
      }
   }
};
//------------------------------------------------------------------------------
domapi.rpc._createDispatcher = function(){
  if(this.dispatcher)
  		if(domapi.isIE&&!domapi.isIE5&&typeof(this.dispatcher.contentWindow.document.namespaces)!="object") // $custom: (cst) added if statement for IE6 and dispatcher corrupt			
			document.body.removeChild(this.dispatcher); // $custom: (cst) remove iframe / dispatcher and create a new one
  		else return; // already have one
    this.dispatcher = domapi.createIFrame(this._id);
    document.body.appendChild(this.dispatcher);
    if(!this.debugMode)this.dispatcher.style.display = "none";
    if(domapi.isIE5     )this.dispatcher = window.frames[this._id];
};
//------------------------------------------------------------------------------