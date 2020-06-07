//------------------------------------------------------------------------------
// DomAPI AJAX debug support
// D. Kadrioski 06/21/2005
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------
// hooks into the ajax framework and provides debug information
//------------------------------------------------------------------------------

domapi.loadUnit("cookie");
domapi.ajaxDebug = {
  _window    : null,
  _dumpstack : []
};
domapi.ajaxDebug._dumpstack.busy = false;

//------------------------------------------------------------------------------
// public members
//------------------------------------------------------------------------------
domapi.ajaxDebug.bringUpConsole = function(){
  var D = domapi.ajaxDebug;
  if(D._window==null || D._window.closed){
    var x = 0; var y = 0; var w = 450; var h = 800;
    try{
      var lastWindowPos = domapi.cookies.getValue("da_ajaxdebug_propsPos",false);
    }catch(E){
      var lastWindowPos = null;
    }
    if (lastWindowPos){
      lastWindowPos = lastWindowPos.split(",");
      x = lastWindowPos[0];
      y = lastWindowPos[1];
      w = lastWindowPos[2];
      h = lastWindowPos[3];
    }
    D._window = open(domapi.libPath + "debug/ajaxdebugger.htm", "_consoleWin", "width="+ w +",height="+ h +",left="+ x +",top="+ y +",screenX="+ x +",screenY="+ y +",scrollbars=yes,resizable=yes");
    if(D._window)
      D._window.onunload = function(){
        if(typeof domapi == "undefined")return;
        var W = domapi.ajaxDebug._window;
        if(W  && !W.closed ){    
          var lastWindowPos = [
            (document.all?W.screenLeft:W.screenX), 
            (document.all?W.screenTop :W.screenY), 
            (document.all?W.document.body.clientWidth :W.innerWidth ),
            (document.all?W.document.body.clientHeight:W.innerHeight)
          ];
          domapi.cookies.setValue("da_ajaxdebug_propsPos",lastWindowPos.join(",")); 
        }
      };
  }
};
//------------------------------------------------------------------------------
domapi.ajaxDebug.clearConsole = function(b){
  var D = domapi.ajaxDebug;
  if(D._window && !D._window.closed)
    D._consoleMain.innerHTML = "";
  if(b)D.dump("Ready.");
};
//------------------------------------------------------------------------------
domapi.ajaxDebug.closeConsole = function(){
  var D = domapi.ajaxDebug;
  var W = D._window;
  if(W && !W.closed ){
    var lastWindowPos = [
      (document.all?W.screenLeft:W.screenX),
      (document.all?W.screenTop :W.screenY),
      (document.all?W.document.body.clientWidth :W.innerWidth ),
      (document.all?W.document.body.clientHeight:W.innerHeight)
    ];
    domapi.cookies.setValue("da_ajaxdebug_propsPos",lastWindowPos.join(","));
    W.close();
  }
};
//------------------------------------------------------------------------------
domapi.ajaxDebug.dump = function(s){
  var D = domapi.ajaxDebug;
  D.bringUpConsole();
  if(D._consoleMain){
    D._dump(s);
  }else{
    if(D._dumpstack.busy){
      setTimeout(function(){domapi.ajaxDebug.dump(s)}, 100); // closure
      return;
    }else{
      D._dumpstack.busy = true;
      try{
        D._dumpstack.push(s);
      }finally{
        D._dumpstack.busy = false;
      }
    }
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi.ajaxDebug._onload = function(){
  var D = domapi.ajaxDebug;

  if(D._dumpstack.busy){
    setTimeout(function(){domapi.ajaxDebug._onload()}, 100);
    return;
  }
  try{
    D._dumpstack.busy = true;
    if(D._dumpstack.length > 0){
      //var s = "";
      for(var i=0;i<D._dumpstack.length;i++)
        //s += D._dumpstack[i];
        setTimeout("domapi.ajaxDebug._dump('"+D._dumpstack[i]+"')", 100);
      //D._dump(D._dumpstack[i]);
      D._dumpstack = [];
    }
  }finally{
    D._dumpstack.busy = false;
    if(D._window && D._window.onresize)D._window.onresize();
  }
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._dump = function(s,b){
  var D = domapi.ajaxDebug;
  var W = D._consoleMain;
  if(!W)return;
  if(s.substr(0,6) == "/*fn*/")
    eval(s);
  else
    W.innerHTML += s; 
  var h = W.scrollHeight;
  W.scrollTop = h;
  if(D._window && D._window.onresize)D._window.onresize();
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Event Handlers
//------------------------------------------------------------------------------
domapi.ajaxDebug._renderAnchor = function(href){
  var basePath = domapi.ajaxDebug._window.opener.location.pathname.split("/");
  basePath.length--;
  basePath = basePath.join("/");
  basePath = basePath + "/" + href;
  return '<a target="_blank" href="'+basePath+'">' + href + '</a>';
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._insertionCode = function(_arg, id){
  var D = domapi.ajaxDebug;
  var W = D._window;
  return '' +
    '/*fn*/ ' +
    'domapi.ajaxDebug._insertionCodeRuntime("' + id + '", "' + _arg["id"] + '");';
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._insertionCodeRuntime = function(id1, id2){
  var e1 = domapi.ajaxDebug._window.document.getElementById(id1);
  var e2 = domapi.ajaxDebug._window.document.getElementById(id2);
  if(!e1 || !e2){
    setTimeout(function(){domapi.ajaxDebug._insertionCodeRuntime(id1, id2)}, 500); // closure
  }else
    domapi.transferElm(e1, e2);
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._metrics = function(){
  return '<div class="metrics"><b>active/queued:</b> ' + domapi.ajax.active.length + '/' + domapi.ajax.queue.length + '</div>';
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._timeDiff = function(_arg){
  var s = new Date().getTime() - _arg.arg._startTime.getTime();
  return "(" + s + "ms)";
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._onrequest = function(_arg){
  var a = _arg.arg;
  var D = domapi.ajaxDebug;
  if(D._dumpstack.busy){
    setTimeout(function(){domapi.ajaxDebug._onrequest(_arg)}, 100); // closure
    return;
  }else{
    try{
      D._dumpstack.busy = true;
      var exists = (D._consoleMain && D._consoleMain.getElementById);
      if(exists)
        exists = (D._consoleMain && D._consoleMain.getElementById(a["id"])) ||
                 (D._dumpstack && D._dumpstack.join().indexOf('id="' + a["id"]  + '"') > -1);
      if(exists)return;
    }finally{
      D._dumpstack.busy = false;
    }
  }
  D.dump(
    '<div class="event request" id="' + a["id"]  + '"><b>' + a["id"] + '</b> ' +
    a._startTime + '<br>' +
    D._renderAnchor(a["url"]) + '<br>' +
    '<table border="0" cellspacing="0" style="float:left">' +
      '<tr><th>method</th><td>:</td><td>' + a["method"] + '</td></tr>' +
      '<tr><th>async</th><td>:</td><td>' + a["async"] + '</td></tr>' +
    '</table><table border="0" cellspacing="0">'+
      '<tr><th>requestType</th><td>:</td><td>' + a["requestType"] + '</td></tr>' +
      '<tr><th>returnType</th><td>:</td><td>' + a["returnType"] + '</td></tr>' +
    '</table>' +
    (a["hint"] != ""?'<p><b><u>' + a["hint"] + '</u></b></p>':"") +
    '</div>'
  );
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._onloaded = function(_arg){
  /*var D = domapi.ajaxDebug;
  D.dump('<div class="event loaded"><b>' + _arg.arg.id + ': Loaded</b> ' + D._renderAnchor(_arg.arg.url) + '</div>');*/
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._onloading = function(_arg){
  var D  = domapi.ajaxDebug;
  var id = domapi.guid();
  D.dump(
    '<div class="event loading" id="' + id + '">' +
    D._metrics() +
    '<b>' + _arg.arg.id + ': Loading...</b> ' + D._timeDiff(_arg) + '<br />' +
    '</div>'
  );
  D.dump(D._insertionCode(_arg.arg, id));
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._onqueueappend = function(_arg){
  var D  = domapi.ajaxDebug;
  var id = domapi.guid();
  //D._onloading(_arg); // start a new block
  D.dump(
    '<div class="event queueappend" id="' + id + '">' +
    domapi.ajaxDebug._metrics() +
    '<b>' + _arg.arg.id + ': Queued...</b> ' + D._timeDiff(_arg) + '<br />' +
    '</div>'
  );
  D.dump(D._insertionCode(_arg.arg, id));
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._onsuccess = function(_arg){
  var D  = domapi.ajaxDebug;
  var id = domapi.guid();
  D.dump(
    '<div class="event success" id="' + id + '">' +
    domapi.ajaxDebug._metrics() +
    '<b>' + _arg.arg.id + ': Complete</b> ' + D._timeDiff(_arg) + '<br />' +
    'Status : ' + _arg.request.status + ' ' + _arg.request.statusText +
    '</div>'
  );
  D.dump(D._insertionCode(_arg.arg, id));
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._ontimeout = function(_arg){
  var D  = domapi.ajaxDebug;
  var id = domapi.guid();
  D.dump(
    '<div class="event timeout" id="' + id + '">' +
    domapi.ajaxDebug._metrics() +
    '<b>' + _arg.arg.id + ': Timed Out</b> ' + D._timeDiff(_arg) + '<br />' +
    /*'Status : ' + _arg.request.status +*/
    '</div>'
  );
  D.dump(D._insertionCode(_arg.arg, id));
};
//------------------------------------------------------------------------------
domapi.ajaxDebug._onerror = function(_arg){
  var D  = domapi.ajaxDebug;
  var id = domapi.guid();
  D.dump(
    '<div class="event error" id="' + id + '">' +
    domapi.ajaxDebug._metrics() +
    '<b>' + _arg.arg.id + ': ERRORED</b> ' + D._timeDiff(_arg) + '<br />' +
    'Status : ' + _arg.request.status +
    '</div>'
  );
  D.dump(D._insertionCode(_arg.arg, id));
};
//------------------------------------------------------------------------------
domapi.regHook("onajaxqueueappend", domapi.ajaxDebug._onqueueappend);
domapi.regHook("onajaxrequest",     domapi.ajaxDebug._onrequest);
domapi.regHook("onajaxloading",     domapi.ajaxDebug._onloading);
domapi.regHook("onajaxloaded",      domapi.ajaxDebug._onloaded );
domapi.regHook("onajaxsuccess",     domapi.ajaxDebug._onsuccess);
domapi.regHook("onajaxtimeout",     domapi.ajaxDebug._ontimeout);
domapi.regHook("onajaxerror",       domapi.ajaxDebug._onerror  );
//------------------------------------------------------------------------------