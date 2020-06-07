//------------------------------------------------------------------------------
// DomAPI Httprequest
// Doug Hendricks
// (c) Active Group, Inc. 2004
//------------------------------------------------------------------------------
/*
  Cross-Browser HTTP Request object
  
  Events:                      NOTES
    onreadystatechange(state)  (if asynch is true when calling get,post)
    ontimeout()
    onerror(lastError)
    onreceive(status)         always fired when the response has been received (readyState == httprsCompleted)
                               
                               * BOTH events are fired at the end of each get or post operation if
                               (readyState == httprsCompleted) whether successful or not.  
                               Check the status (200 == 'OK') to decide how to handle the response
    
  Properties:
    noCache      = set during the open method,  controls whether the request headers
                   'Pragma: no-cache', and 'Cache-Control: no-cache' are set prior to 
                   send() operation. (default is false)
    provider     = an interface to the underlying request object.
    responseText = the contents of the HTTP reply
    responseXML  = a DOMDocument object returned if the request implied an XML document.
    readyState   = the current readyState of the provider
    status       = HTTP status code (100, 200, etc)
    statusText   = like 'OK' returned by the provider.
    mimeTypeOverride = allows override of returned mimeType (like 'text/xml') if supported by server.
    
    
  Methods:                                      Notes
    bool = getContent(url [,asynch])            (wraps the open, send method for you, default headers assumed)
    bool = postContent(url,content [,asynch])   (wraps the open, send method for you, default headers assumed)
    bool = open(method,url [,asynch])
    bool = send(content)
    bool = setRequestHeader(name, value)
    str = getAllResponseHeaders()
    str = getResponseHeader(name)
    bool = setMimeType('text/plain')
    
 Safari Note: It is essential that the data returned from the server be sent with a Content-Type set 
 to text/xml. Content that is sent as text/plain or text/html is not accepted by the instance of the 
 request object.
    
*/

/* ready states */
httprsNoInit    = 0;
httprsLoading   = 1;
httprsLoaded    = 2;
httprsInteractive = 3;
httprsCompleted  = 4;

domapi._private.Httprequest = {};

domapi._private.Httprequest._thandlers   = []; // optional timeout handler

domapi._private.Httprequest._fireEvent = function(eventHandler,params){
if(eventHandler=="undefined")return false; // defined & not null
var obj    = null;
var fn     = eventHandler;
if(!params)params = [];  // must be array

if(typeof(eventHandler) == "object"){ // valid object
  obj    = eventHandler.obj;  // pointer to object. (null means anonymous (non-OO))
  fn     = eventHandler.fn;  // the function to call
  if(eventHandler.params)params = params.concat(eventHandler.params);  // add additional params to the array
}
if(this.doDebug)dump('HTTPRequest._fireEvent('+ [obj,params]+')');

fn.apply(obj, params);  // Do the actual handler-call

return true;
};

domapi._private.Httprequest._timeoutHandler = function(guid){
if(this.doDebug)dump('._timeoutHandler()'+[guid]);
with(this){
 for(var b=0;b<_thandlers.length;b++)
 if(_thandlers[b][0]==guid && _thandlers[b][2] == true){  //request is pending if true
     _fireEvent( _thandlers[b][1]);
     _thandlers[b][2] = false;
     if(_thandlers[b][3])_thandlers[b][3]._setCursor(false); //the parent
     break;
  }
  
}
};

if(domapi.lang){
  domapi.lang["ERR_HTTP_SEND"] = "Error Sending Content: ";
  domapi.lang["ERR_HTTP_OPEN"] = "Error Opening Url: '%1' for operation: '%2'";
  domapi.lang["ERR_NOT_OPEN"] = "Successful OPEN operation has not yet occurred.";
  domapi.lang["ERR_HTTP_MIMEOVERRIDE"] = "Error setting MimeType: '%1'";
  domapi.lang["ERR_HTTP_OP_FAILED"] = "Operation Failed: ";
  domapi.lang["ERR_NOHTTP_OBJ"] = "Your Browser '%1' Does NOT Support the XMLHTTPRequest Object.";
  
  }
domapi.Httprequest = function(arg) {return domapi.Httprequest.constructor(arg);};
domapi.Httprequest.create = function(arg) {return domapi.Httprequest.constructor(arg);};
//------------------------------------------------------------------------------
domapi.Httprequest.constructor = function(arg){
  var handler = {};
  var httpreq=null;
  handler.doDebug  = domapi.rBool(arg["doDebug"],false);
  try{ 
          var prots = domapi.Httprequest.prototype;       
          for(var p in prots)handler[p] = prots[p];
       }catch(E){
         throw new Error('Error applying domapi.Httprequest.prototype: '+proto+
          "\non "+navigator.userAgent+
          "\n\nPlease notify support@domapi.com of this problem: \n\n"+E.message);
  }
  handler.onerror    = function(lastError){
                           alert(lastError);
                           if(this.doDebug)dump(this.toString()+' Default error Handler '+ lastError);
                           };
  var priv           = domapi._private.Httprequest;  
  handler._private   = priv;
  priv.parent        = handler;
  priv.doDebug       = handler.doDebug ;
  handler.id       = domapi.guid();
  try{ 
    if(domapi.isGecko){
     httpreq =new XMLHttpRequest();
     // some older versions of Moz did not support the readyState property
     // and the onreadystatechange event so we patch it!
     if (httpreq && httpreq.readyState == null) {
                 httpreq.readyState = httprsLoading;
                 httpreq.addEventListener("load", function () {
                    httpreq.readyState = httprsCompleted;
                    if (typeof httpreq.onreadystatechange == "function")
                       httpreq.onreadystatechange();
                 }, false);
         }
     
     
    }else if(domapi.isIE){
        var idHttpList = ["MSXML2.XMLHTTP.5.0",
                          "MSXML2.XMLHTTP.4.0",
                          "MSXML2.XMLHTTP.3.0",
                          "MSXML2.XMLHTTP",
                          "MICROSOFT.XMLHTTP.1.0", 
                          "MICROSOFT.XMLHTTP.1",
                          "MICROSOFT.XMLHTTP"];
                          
       var httpFound = false;
       for (var i=0; i < idHttpList.length && !httpFound; i++){
           try{
             var oDoc = new ActiveXObject(idHttpList[i]);
             httpFound = true;
             domapi.msXmlValidProgId = idHttpList[i]; //In case existing downstream modules need this.
             
             break;
           }catch(e){}
       }
       httpreq= new ActiveXObject(idHttpList[i]);
     }
     
     
    }catch(e){}
    
    if(httpreq ==null){
      handler._error( domapi.formatGetString("ERR_HTTP_NOOBJ",[domapi._bt[domapi.browser]]),null,false );
      return null;
    }
    handler.provider = httpreq;
    handler.onerror    = domapi.rVal(arg["onerror"], handler.onerror);
    handler._asynch  = handler.asynch=  domapi.rBool(arg["asynch"],false);
    
    handler.url      ='about:blank';
    handler.readyState  = -1;
    handler.responseText = '';
    handler.responseXML = null;
    handler.responseBody = new Array();
    
    handler.statusText = "OK";
    handler.status     = 0;
    handler._aborted   = false;
    handler._received  = false;
    handler.timeout    = domapi.rInt(arg["timeout"  ],10000); //ms
    handler.manageCursor = domapi.rBool(arg["manageCursor"],true);
    handler._cursorR   = null;
    handler.ontimeout  = function(){if(this.doDebug)dump(this.toString()+' Default timeout Handler '+ this.status);};
    handler.onreadystatechange = function(readyState){if(this.doDebug)dump(this.toString()+' Default readyState Handler '+ readyState);};
    handler.onreceive  = function(status){if(this.doDebug)dump(this.toString()+' Default onreceive Handler '+ status);};
            
      
    handler.onreadystatechange = domapi.rVal(arg["onreadystatechange"],{obj:handler,fn:handler.onreadystatechange});
    handler.onreceive = domapi.rVal(arg["onreceive"],{obj:handler,fn:handler.onreceive});
    
    handler._timerIndex = -1;
    var timeoutH = domapi.rVal(arg["ontimeout"],{obj:handler,fn:handler.ontimeout});
    if(timeoutH){
       priv._thandlers.push([handler.id,timeoutH,false]);
       handler._timerIndex=priv._thandlers.length-1;
    }
    handler.method     = '';
    handler.lastError  = ''; 
    handler.mimeTypeOverride = null;
    handler._isOpen     = false;
    handler.noCache    = domapi.rBool(arg["noCache"],false);
    
    if(handler.provider){
      handler.refresh();
      
    }
    return handler;
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype._setCursor = function(busy){
  var s = domapi.bodyElm().style;
  var t = this;
  if(t.manageCursor){
     if(busy)t._cursorR = s.cursor;
     s.cursor = busy?"wait":t._cursorR;
     
     }
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.setRequestHeader = function(header,value){
 if(!this.provider || domapi.isNil(header) || domapi.isNil(value))return false;
 return this.provider.setRequestHeader(header,value);
 };
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.getAllResponseHeaders = function(){
 if(!this.provider)return '';
 var H='';  //gecko Will throw exception if headers are not avail.
 try{ if(typeof this.provider.getAllResponseHeaders =='function')H = this.provider.getAllResponseHeaders();
  }catch(e){}
 return H;
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.getResponseHeader = function(header){
 if(!this.provider || domapi.isNil(header) ) return '';
 var res='';
 if(this.provider && header)
 try{ //gecko may throw exception if header is not defined.
   if(typeof this.provider.getResponseHeader=='function')
      res = this.provider.getResponseHeader(header);
   }catch(e){}
   
   return res;
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.toString = function(){return '[object Httprequest '+this.id+']';};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.abort = function(){
 if(this.provider){
   this._aborted = this.provider.abort();
   this.refresh();
   return this._aborted;
   }
 return false;
};

//------------------------------------------------------------------------------
domapi.Httprequest.prototype.setMimeType = function(mimetype){
if(this.provider){
 try{
  if(domapi.isGecko && typeof this.provider.overrideMimeType=='function'){
    this.provider.overrideMimeType(mimetype);return true;
  } else return true; //IE ?
  }catch(e){this._error(domapi.formatGetString('ERR_HTTP_MIMEOVERRIDE', [mimetype]) + e.message);}
 }
 return false;
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.send = function(contents){
 if(this.doDebug)dump(this.toString()+'.send()');
 if(this.provider){
  with(this){
   if(!domapi.isNil(mimeTypeOverride) && !setMimeType(mimeTypeOverride)) return false;
   if(!this._isOpen){
     this._error(null,'ERR_HTTP_NOTOPEN');
     return false;
     }
   try{
       _aborted = false;
       _setCursor(true);
       if(noCache==true){
         setRequestHeader('Pragma','no-cache'); //HTTP 1.1   
         setRequestHeader('Cache-Control','no-cache'); //HTTP 1.0
       }
       _setTimer;
       if(this.doDebug)dump(this.toString()+'provider.send() start.'+url+', asynch='+_asynch);
       _received = false;       
       provider.send(contents);
              
       if(this.doDebug)dump(this.toString()+'provider.send() complete.'+url+', asynch='+_asynch);
              
       if(!_received){
          _raiseEvents(); _setCursor(false);}
       
       return true;
      }
   catch(e){
    refresh();
    _setCursor(false);
    this._error(e,"ERR_HTTP_SEND");return false;}
  }
 }else return false;
};

//------------------------------------------------------------------------------
domapi.Httprequest.prototype.open = function(arg){ //hmethod,surl,asynch){
  var url = this.url =domapi.rVal(arg['url'],this.url);
  this._asynch = domapi.rBool(arg['asynch'],this.asynch);//use constructor default
  var Hmethod   = this.method = domapi.rVal(arg['method'],'GET');
  var uName = domapi.rVal(arg['userName'],null);
  var uPass = domapi.rVal(arg['password'],null);
  this.noCache    = domapi.rBool(arg["noCache"],this.noCache);
  
  if(this.doDebug)dump(this.toString()+'.open('+[Hmethod,url,this._asynch]+')');
  this._aborted   = this._isOpen     = false;
  if(this.provider) with(this.provider){         
        try{
         open(Hmethod,url,this._asynch,uName,uPass);
         if(this._asynch){var parent = this;onreadystatechange=_onstatechanges;};         
         this._isOpen     = true;
         return true;       
        }catch(e){
           
           this._error(domapi.formatGetString('ERR_HTTP_OPEN', [Hmethod,url]) + ' reason:' + e,null,false);
           this.status = 0;
           
           return false;
         }
     }
  
  return false;
  
  
  function _onstatechanges(){  //event handler needs be local scope
      try{
        
         if(parent)with(parent){
           if(doDebug)dump(toString()+" _onstatechanges() "+[provider.readyState,' asynch='+ _asynch,'abort='+_aborted,'debug='+doDebug] );
           if(readyState != provider.readystate && !_aborted) _raiseEvents();
          }
        
       }catch(e){dump('     statechange error :' + e.message?e.message:e);}
  };
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.refresh = function(){

 with(this){ 
   readyState = provider.readyState;
  
     try{responseText = provider.responseText;}catch(e){if(doDebug)dump(' refresh error :' + e.message?e.message:e);}finally{};
     try{responseXML = (provider.responseXML)?provider.responseXML:null }catch(e){responseXML=null;if(doDebug)dump(' refresh error :' + e.message?e.message:e);}finally{};
     try{statusText = provider.statusText; }catch(e){if(doDebug)dump(' refresh error :' + e.message?e.message:e);}finally{};
     try{status = provider.status; }catch(e){if(doDebug)dump(' refresh error :' + e.message?e.message:e);}finally{};
    
  }
  
};
domapi.Httprequest.prototype._setTimer= function(){
with(this){
if( _timerIndex>-1 && _private._thandlers[_timerIndex]){
  _private._thandlers[_timerIndex][2]= timeout>0; //request is pending if timeout specified
  _private._thandlers[_timerIndex][3]= this; //in case callbacks are needed
  if(timeout>0)setTimeout("domapi._private.Httprequest._timeoutHandler('"+id+"')",timeout);
   }
 }
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype._killTimer= function(){
with(this)if(_timerIndex>-1)_private._thandlers[_timerIndex][2]=false; //request no longer pending
};

//------------------------------------------------------------------------------
domapi.Httprequest.prototype._raiseEvents= function(){
   with(this){
    try{ 
    refresh();
    if(doDebug)dump(this.toString()+'._raiseEvents() state='+[readyState]);
    if(onreadystatechange && provider.readyState != httprsCompleted)_private._fireEvent(onreadystatechange,[readyState]);
    
    if( !_received && provider.readyState == httprsCompleted){
       _received = true;
       _killTimer;
       _setCursor(false);
       if(onreadystatechange)_private._fireEvent(onreadystatechange,[readyState]);//final state change
       
       if(status && status != 200)_error(url+' : with Status '+status+': '+statusText,'ERR_HTTP_OP_FAILED',false);
       else if(onreceive)_private._fireEvent(onreceive,[status]);
       
     }
    
    
    }catch(e){
      _setCursor(false);
      this._error(e,null,true);
    }
   }
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.getContent = function(surl,asynch,uName,uPassword){
 asynch=domapi.rBool(asynch,false);
 if(this.doDebug)dump(this.toString()+'.getContent('+[surl,asynch]+')');
 
 if(this.open({method:"GET",url:surl,asynch:asynch,userName:uName,password:uPassword}))return this.send(null);
 else return false;
  
};
//------------------------------------------------------------------------------
domapi.Httprequest.prototype.postContent = function(url,content,asynch,uName,uPassword){
  
  content=domapi.rVal(content,"");
  asynch=domapi.rBool(asynch,false);
  if(this.doDebug)dump(this.toString()+'.postContent('+[surl,asynch]+')');
  
  if(this.open({method:"POST",url:url,asynch:asynch,userName:uName,password:uPassword}))return this.send(content);
  else return false;
  
};

//------------------------------------------------------------------------------
domapi.Httprequest.prototype._error = function( msg, msgk, throwit){
   if(domapi.isNil(msg))return this.lastError;
   throwit=domapi.rBool(throwit,true);
   
   msg = typeof msg=='object'?msg.message:msg;
   
   if(typeof msgk!='object' && domapi.lang[msgk])   msg = domapi.getString(msgk) + ' ' + msg;
   
   if(this.doDebug)dump(this.toString()+'._error = '+msg);
   this.lastError = msg;
   if(this.onerror)this._private._fireEvent(this.onerror,[msg]);
      
   return msg;
};
