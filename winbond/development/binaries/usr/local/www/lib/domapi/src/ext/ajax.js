//------------------------------------------------------------------------------
// DomAPI AJAX routines
// D. Kadrioski 06/21/2005
// (c) Nebiru Software 2001-2005
/* -----------------------------------------------------------------------------
REFERENCE MATERIAL
readyStates: 
http://msdn.microsoft.com/library/en-us/xmlsdk/html/0e6a34e4-f90c-489d-acff-cb44242fafc6.asp?frame=true
0 (UNINITIALIZED)
 The object has been created, but not initialized (the open method has not been called).
 
(1) LOADING
 The object has been created, but the send method has not been called.
 
(2) LOADED
 The send method has been called, but the status and headers are not yet available.
 
(3) INTERACTIVE
 Some data has been received. Calling the responseBody and responseText properties 
 at this state to obtain partial results will return an error, because status and 
 response headers are not fully available.
 
(4) COMPLETED

response codes: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
----------------------------------------------------------------------------- */

//------------------------------------------------------------------------------
daRsUninitialized = 0;
daRsLoading       = 1;
daRsLoaded        = 2;
daRsInteractive   = 3;
daRsCompleted     = 4;

domapi.ajax              = {};
domapi.ajax.active       = [];
domapi.ajax.queue        = [];
domapi.ajax.requestCount = 0;
domapi.ajax.singletonStrobe       = 100;
domapi.ajax.active.busy           = false;
domapi.ajax.queue .busy           = false;
domapi.ajax.maxConcurrentRequests = 50;
domapi.ajax.maxRetryOnTimeout     = 1;
domapi.ajax.doRetryOnTimeout      = true;
//------------------------------------------------------------------------------
domapi.ajax.request = function(arg){
  try{
    var _lastAction = "create request";
    var _req        = domapi.createHttpRequest();
    arg._content    = "";
    _lastAction = "assert input";
    domapi.ajax._assertInputArg(arg);
    _lastAction = "open request";
    _req.open(arg["method"], arg["url"], arg["async"], arg["username"], arg["password"]);
    _lastAction = "set headers";
    _req.setRequestHeader('content-type', arg["contentType"]);
    _lastAction = "outfit request";
    domapi.ajax._outfitRequest(_req, arg);
    switch(arg.requestType){
      case "string"  :
      case "integer" :
      case "float"   :
      case "boolean" :
      case "xml"     :
        arg._content = arg["request"];
        break;
      case "json"    :
      case "object"  :
        arg._content = domapi.jsonToString(arg["request"]);
        break;
    }

    _lastAction = "dispatch hook1";
    if(arg["onrequest"])arg["onrequest"](_req, arg);
    domapi._dispHook("onajaxrequest",{request:_req, arg:arg});

    _lastAction = "dispatch hook2";
    domapi.ajax._dispatch({_req:_req, _arg:arg});
    if(arg["async"]){
      return _req;
    }else{
      return _req;//.responseText;
      // we'll just return the request and let the user decide what response field they
      // are interested in
    }
  }catch(E){
    var msg = E.message;
    if(typeof msg == "undefined")
      msg = "no specific error -- are you attempting cross-site scripting?";
    throw new Error(domapi.formatGetString("ERR_AJAX_REQUEST", [_lastAction, msg]));
    return null;
  }
};
//------------------------------------------------------------------------------
domapi.ajax.nodeText = function (n){
  if (n.childNodes.length > 1)
    return n.childNodes[1].nodeValue;
  else
    return n.firstChild.nodeValue;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi.ajax._assertInputArg = function(arg){
  try{
    domapi._assert(arg, "url",           "about:blank");
    domapi._assert(arg, "hint",          "");
    domapi._assert(arg, "doCacheBuster", true);
    domapi._assert(arg, "method",        "GET");
    domapi._assert(arg, "async",         true);
    domapi._assert(arg, "username",      "");
    domapi._assert(arg, "password",      "");
    domapi._assert(arg, "request",       "");
    domapi._assert(arg, "requestType",   "string");
    domapi._assert(arg, "returnType",    "string");
    if(typeof arg["id"] == "undefined")arg["id"] = "request_" + ++domapi.ajax.requestCount; // TODO: not threadsafe
    if(typeof arg["requestHeaders"] == "undefined")
      arg["requestHeaders"] = {};
    if(["xml"].contains(arg["requestType"]))
      domapi._assert(arg, "contentType", "text/xml");
    else
      domapi._assert(arg, "contentType", "application/x-www-form-urlencoded");
    arg._startTime = new Date();
    if(arg.doCacheBuster)
      arg.url += ((arg.url.indexOf("?")!=-1)?"&":"?") +
        "dacb=" +
        parseInt(arg._startTime.getTime() + Math.random()*1000) + "." + domapi.ajax.requestCount;
  }catch(E){
    throw new Error(domapi.getString("ERR_AJAX_ASSERT") + E.message);
  }
};
//------------------------------------------------------------------------------
domapi.ajax._outfitRequest = function(_req, arg){
  try{
    _req.onreadystatechange = function(){domapi.ajax.onreadystatechange(_req, arg)}; // closure
    // TODO - make sure this doesn't leak any ram in IE
    var A = arg["requestHeaders"];
    for(var i in A)
      if(typeof A[i] != "function")
      _req.setRequestHeader(i, A[i]);
  }catch(E){
    throw new Error(domapi.getString("ERR_AJAX_OUTFIT") + E.message);
  }
};
//------------------------------------------------------------------------------
domapi.ajax.onreadystatechange = function(_req, _arg){
  try{
    switch(_req.readyState){
      case daRsUninitialized : break;
      case daRsLoading       :
        if(_arg["onloading"])_arg["onloading"](_req, _arg);
        domapi._dispHook("onajaxloading",{request:_req, arg:_arg});
        break;
      case daRsLoaded        :
        if(_arg["onloaded"])_arg["onloaded"](_req, _arg);
        domapi._dispHook("onajaxloaded",{request:_req, arg:_arg});
        break;
      case daRsInteractive   : break;
      case daRsCompleted     :
        var _status = parseInt(_req.status);//alert([_status,_arg.url])
        if(_status > 199 && _status < 300 || _status == 304){
          if(_arg["onsuccess"])_arg["onsuccess"](_req, _arg);
          domapi._dispHook("onajaxsuccess",{request:_req, arg:_arg});
        }else if([408, 504].contains(_status)){
          if(_arg["ontimeout"])_arg["ontimeout"](_req, _arg);
          domapi._dispHook("onajaxtimeout",{request:_req, arg:_arg});
        }else{
          if(_arg["onerror"])_arg["onerror"](_req, _arg);
          domapi._dispHook("onajaxerror",{request:_req, arg:_arg});
        }
        domapi.ajax.active.deleteValue(_req); // delete it from the active list
        break;
    }
  }catch(E){
    throw new Error(domapi.getString("ERR_AJAX_ORSC") + E.message);
  }finally{
    domapi.ajax._processQueue();
  }
};
//------------------------------------------------------------------------------
domapi.ajax._overriddenArrayDeleteValue = function(v){
  if(this.busy){
    setTimeout(function(){this.deleteValue(v)}, domapi.ajax.singletonStrobe); // closure
    return;
  }
  this.busy = true;
  try{
    for(var i=this.length-1; i>=0; i--)
      if(this[i]._req == v)this.deleteItem(i);
  }finally{
    this.busy = false;
  }
};
//------------------------------------------------------------------------------
domapi.ajax._processQueue = function(){
  if(this.queue.busy || this.active.busy){
    setTimeout(function(){domapi.ajax._processQueue()}, domapi.ajax.singletonStrobe);
    return;
  }
  this.queue.busy = true;
  try{
    if(!this.queue.length || this.active.length >= this.maxConcurrentRequests)return;
    var _obj = this.queue[0];
    try{
      if(_obj._arg["onqueuepop"])_obj._arg["onqueuepop"](_obj._req, _obj._arg);
      domapi._dispHook("onajaxqueuepop",{request:_obj._req, arg:_obj._arg});
    }finally{
      _obj = null;
    }
    this._dispatch(this.queue.pop(0));
  }finally{
    this.queue.busy = false;
  }
};
//------------------------------------------------------------------------------
domapi.ajax._dispatch = function(_obj){
  if(this.active.length >= this.maxConcurrentRequests){
    if(this.queue.busy){
      setTimeout(function(){domapi.ajax._dispatch(_obj)}, domapi.ajax.singletonStrobe); // closure
      return;
    }
    this.queue.busy = true;
    try{
      this.queue.push(_obj);
      if(_obj._arg["onqueueappend"])_obj._arg["onqueueappend"](_obj._req, _obj._arg);
      domapi._dispHook("onajaxqueueappend",{request:_obj._req, arg:_obj._arg});
    }finally{
      this.queue.busy = false;
    }
  }else{
    if(this.active.busy){
      setTimeout(function(){domapi.ajax._dispatch(_obj)}, domapi.ajax.singletonStrobe); // closure
      return;
    }
    this.active.busy = true;
    try{
      this.active.push(_obj);
    }finally{
      this.active.busy = false;
    }
    if(_obj._arg["ondispatch"])_obj._arg["ondispatch"](_obj._req, _obj._arg);
    domapi._dispHook("onajaxdispatch",{request:_obj._req, arg:_obj._arg});
    _obj._req.send(_obj._arg._content);
  }
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
domapi.ajax.active.deleteValue = domapi.ajax._overriddenArrayDeleteValue;
domapi.ajax.queue .deleteValue = domapi.ajax._overriddenArrayDeleteValue;
//------------------------------------------------------------------------------