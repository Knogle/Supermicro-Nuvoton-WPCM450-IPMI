//------------------------------------------------------------------------------
// DomAPI domapi routines
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// this unit runs after the entire domapi is loaded
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.css.init();
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
if(domapi.doSplash){  // remove it
  domapi.splashSlide = function(){
    var e = domapi.getElm("domapi_splash");
    var y = parseInt(e.offsetTop );
    var x = parseInt(e.offsetLeft);
    if(domapi.browser == btSafari)y = -30;
    if(y>-30){
      e.style.top = (y-1)+"px";
      if(domapi.isIE){
        e.style.left  = x + "px";
        e.style.right = "0px";
      }
      setTimeout("domapi.splashSlide()",10);
    }else e.style.visibility="hidden";
  };
  setTimeout("domapi.splashSlide()",2000);
}
//------------------------------------------------------------------------------
domapi._load = function(){
  var e = document.body;
  if(domapi.isStrict)domapi.css.addClass(e, "DA_STRICT" );
  if(domapi.doSkin  )domapi.css.addClass(e, "DA_SKINNED");
  if(domapi.isIE5   )domapi.css.addClass(e, "DA_IE5"    );

  switch(domapi.browser){
    case btIExplore  : domapi.css.addClass(e, "DA_IE"   ); break;
    case btNetscape  : domapi.css.addClass(e, "DA_GECKO"); break;
    case btMozilla   : domapi.css.addClass(e, "DA_GECKO"); break;
    case btChimera   : domapi.css.addClass(e, "DA_GECKO"); break;
    case btFirefox   : domapi.css.addClass(e, "DA_GECKO"); break;
    case btOpera     : domapi.css.addClass(e, "DA_OPERA"); break;
    case btSafari    : domapi.css.addClass(e, "DA_KONQ" ); break;
    case btKonqueror : domapi.css.addClass(e, "DA_KONQ" ); break;
  }

  switch(domapi.platform){
    case ptWindows   : domapi.css.addClass(e, "DA_WIN"  ); break;
    case ptMacintosh : domapi.css.addClass(e, "DA_MAC"  ); break;
    case ptLinux     : domapi.css.addClass(e, "DA_NIX"  ); break;
    case ptUnix      : domapi.css.addClass(e, "DA_NIX"  ); break;
  }
  domapi.pageLoaded = true;
  if(domapi.onload)domapi.onload();
};
//------------------------------------------------------------------------------
domapi._unload = function(){
  // adapted from youngpup.net - remove explicit handlers
  var i,j,el;
  // most common - 'fast'
  if(domapi.clearElementPropsLevel == 1)
    var clearElementProps =
        ["data","onmouseover","onmouseout","onmousedown","onmouseup","ondblclick",
         "onclick","onselectstart","ncontextmenu","onchange","onkeyup","onkeydown","onkeypress"];
  if(domapi.clearElementPropsLevel == 2)
    var clearElementProps =
      ["data","onabort","onactivate","onafterprint","onafterupdate","onbeforeactivate","onbeforecopy",
       "onbeforecut","onbeforedeativate","onbeforeeditfocus","onbeforepaste","onbeforeprint","onbeforeunload",
       "onbeforeupdate","onblur","onbounce","oncellchange","onchange","onclick","oncontextmenu","oncontrolselect",
       "oncopy","oncut","ondataavailable","ondatasetchanged","ondatasetcomplete","ondblclick","ondeactivate",
       "ondrag","ondragdrop","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop",
       "onerror","onerrorupdate","onfilterchange","onfinish","onfocus","onfocusin","onfocusout","onhelp",
       "onkeydown","onkeypress","onkeyup","onlayoutcomplete","onload","onlosecapture","onmousedown","onmouseenter",
       "onmouseleave","onmousemove","onmouseout","onmouseover","onmouseup","onmousewheel","onmove","onmoveend",
       "onmovestart","onpaste","onpropertychange","onreadystatechange","onreset","onresize","onresizeend",
       "onresizestart","onrowenter","onrowexit","onrowsdelete","onrowsinserted","onscroll","onselect",
       "onselectstart","onstart","onstop","onsubmit","onunload"];

  if(domapi.clearElementPropsLevel == 1 || domapi.clearElementPropsLevel == 2)
    if(document.all)
      for(i=document.all.length-1;i>=0;i--){
        el = document.all[i];
      for(j=clearElementProps.length-1;j>=0;j--)
        el[clearElementProps[j]] = null;
      }
  // hkl - flush event cache
  if(domapi.doClearEventCache) __domapiEventCache.flush();

  if(typeof domapi != "undefined"){
    if(typeof domapi.debug != "undefined"){
      domapi.debug.closeConsole();
      var w = domapi.debug._winDump;
      if(w && !w.closed)w.close();
    }
    if(typeof domapi.ajaxDebug != "undefined"){
      domapi.ajaxDebug.closeConsole();
      var w = domapi.ajaxDebug._window;
      if(w && !w.closed)w.close();
    }
    for(var i=0;i<domapi.unloadHooks.length;i++)
      domapi.unloadHooks[i]();
    domapi._freeAll();
  }

  if(typeof CollectGarbage != "undefined")CollectGarbage();
};
//------------------------------------------------------------------------------
domapi.addEvent(window, "unload", domapi._unload, true);
//------------------------------------------------------------------------------
if(domapi.browser == btKonqueror)domapi._load(); // http://bugs.kde.org/show_bug.cgi?id=57913
else domapi.addEvent(window, "load", domapi._load, true);
// had a race condition, in which the document.body.className was blank during component creation
//domapi._load();
//------------------------------------------------------------------------------
if(domapi._defLang != "eng")
  domapi.loadLang(domapi._defLang);
delete domapi._defLang;
//------------------------------------------------------------------------------
domapi.loaded = true;
//------------------------------------------------------------------------------