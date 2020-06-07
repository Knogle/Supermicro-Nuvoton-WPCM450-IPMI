//------------------------------------------------------------------------------
// DomAPI domapi routines
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi._guidCounter = -1;
domapi.guid = function(){return "GUID_" + domapi._guidCounter++};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// array extensions
//------------------------------------------------------------------------------
Array.prototype.deleteValue = function(v){
  for(var i=this.length-1; i>=0; i--)
    if(this[i] == v)this.deleteItem(i);
};
//------------------------------------------------------------------------------
if(!Array.prototype.push)Array.prototype.push = function(v){
  this[this.length] = v;
};
//------------------------------------------------------------------------------
if(!Array.prototype.pop)Array.prototype.pop = function(){
  if(this.length<1)return null;
  var result = this[this.length-1];
  this.deleteItem(this.length-1);
  return result;
};
//------------------------------------------------------------------------------
Array.prototype.insert = function(i,v){
  if (i>-1)this.splice(i,0,v);
  else this.push(v);
};
//------------------------------------------------------------------------------
Array.prototype.swap = function(i,j){
  var t   = [this[i], this[j]];
  this[j] = t[0];
  this[i] = t[1];
};
//------------------------------------------------------------------------------
domapi.arraySortCompare_Integer = function(a,b){
  var aa = parseInt(a); var bb = parseInt(b);
  return(aa == bb)?0:(aa > bb)?1:-1;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Object extensions
//------------------------------------------------------------------------------
Object.prototype.asString = function(){
  var r = "";
  for(var i in this)
    if(i!="asString")
    r += i + ":"+typeof this[i]+" = "+this[i]+"\n";
  return r;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// String extensions
//------------------------------------------------------------------------------
String.prototype.toMixedCase = function(){return domapi.toMixedCase(this)};
domapi.toMixedCase = function(S){
  if(domapi.isKHTML){
    var a = S.split(" ");
    var r = a[0];
    for(var i=1;i<a.length;i++)
      r = r + a[i].charAt(0).toUpperCase() + a[i].substring(1);
    return r.replace(new RegExp("\\W", "g"), ""); // remove any non-alphas
  }else{
    function toUpper(sChar,s){return s.toUpperCase().trim();};
    return S.toLowerCase().replace(new RegExp("\\s(\\S)", "g"), toUpper
      ).replace(new RegExp("\\W", "g"), ""); // remove any non-alphas
  }
};
//------------------------------------------------------------------------------
String.prototype.trim = function(){return domapi.trim(this)};
domapi.trim = function(S){
  var s = S.replace(new RegExp("^\\s+", "g"), "");
  return s.replace(new RegExp("\\s+$", "g"), "");
};
//------------------------------------------------------------------------------
String.prototype.addUrlParam = function(n,v){return domapi.addUrlParam(this,n,v)};
domapi.addUrlParam = function(S,n,v){
  var i = S.indexOf("?")+1;
  return S + (i?"&":"?") + n + "=" + v;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// utility functions
//------------------------------------------------------------------------------
domapi.isNil = function(s)  {return s==null || !String(s).length};  // value is null or blank
//------------------------------------------------------------------------------
domapi.rInt  = function(s,d){   // return value if integer else default
  //var i = parseInt(s);
  //if(typeof s == "number")return s;else return d;
 
  // seems to be the fastest method
  s = parseInt(s);
  if(!isNaN(s))return s;
  return isNaN(d)?0:d;
 
  //if(String(s).match(new RegExp("/d+")))return parseInt(s);else return d;
  //return(domapi.isNil(s)||isNaN(s))?((domapi.isNil(d)||isNaN(d))?0:d):parseInt(s);
};
domapi.rVal  = function(s,d){return(domapi.isNil(s)?(domapi.isNil(d)?"":d):s)}; // return value if not nil else default
domapi.rBool = function(v,d){return domapi.isNil(v)?d:v};
//------------------------------------------------------------------------------
domapi.rangeInt = function(s,l,u){ // ensures that a value is an integer within a given range
  s = domapi.rInt(s);
  if(s < l)s = l;
  if(s > u)s = u;
  return s;
};
//------------------------------------------------------------------------------
domapi.copyObject = function(a){ // makes a copy of an object and returns it. - keeps references intact
  var r = {};
  for(var i in a)r[i] = a[i];
  return r;
};
//------------------------------------------------------------------------------
domapi.cursors          = {};
domapi.cursors.hand     = (domapi.isIE && domapi.major==5)?"hand":"pointer";
domapi.cursors.vertBeam = domapi.isIE?(domapi.major==5?"move":"col-resize"):"move";
domapi.cursors.horzBeam = domapi.isIE?(domapi.major==5?"move":"row-resize"):"move";
//------------------------------------------------------------------------------
domapi.bodyElm          = function(){return document.body};
domapi.bodyWidth        = function(){return parseInt(domapi.isIE?(!domapi.isStrict?document.body.clientWidth: document.documentElement.clientWidth ):window.innerWidth)};
domapi.bodyHeight       = function(){return parseInt(domapi.isIE?(!domapi.isStrict?document.body.clientHeight:document.documentElement.clientHeight):window.innerHeight)};
//------------------------------------------------------------------------------
//domapi.scrollTop     = function(){return domapi.isIE?document.body.scrollTop :pageYOffset};
//domapi.scrollLeft    = function(){return domapi.isIE?document.body.scrollLeft:pageXOffset};
/* Modified by B. Tudball for strict mode */
domapi.scrollTop     = function(){return domapi.isIE?(domapi.isStrict?document.documentElement.scrollTop :document.body.scrollTop ):pageYOffset};
domapi.scrollLeft    = function(){return domapi.isIE?(domapi.isStrict?document.documentElement.scrollLeft:document.body.scrollLeft):pageXOffset};

//------------------------------------------------------------------------------
// GX SBE
domapi.setScrollTop = function(t) {
  if(domapi.isIE) {
    if(domapi.isStrict) {
      document.documentElement.scrollTop = t;
    } else {
      document.body.scrollTop = t;
    }
  } else {
    pageYOffset = t;
  }
};
//------------------------------------------------------------------------------
// GX SBE
domapi.setScrollLeft = function(t) {
  if(domapi.isIE) {
    if(domapi.isStrict) {
      document.documentElement.scrollLeft = t;
    } else {
      document.body.scrollLeft = t;
    }
  } else {
    pageXOffset = t;
  }
};
//------------------------------------------------------------------------------
domapi.mousePosition = function(E){
  if(domapi.isIE)return[event.clientX,event.clientY];
  else         return[E.pageX,E.pageY];
};
//------------------------------------------------------------------------------
domapi.isMouseOver = function(E, e, f){  
  f = domapi.rInt(f,3); // fudge factor - for fast mousers
  var m = domapi.mousePosition(E);
  if(m[0]<(e.offsetLeft+f))return false;
  if(m[1]<(e.offsetTop +f))return false;
  if(m[0]>(e.offsetLeft + e.offsetWidth -f))return false;  
  if(m[1]>(e.offsetTop  + e.offsetHeight-f))return false;
  return true;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// base utility functions used by components
//------------------------------------------------------------------------------
domapi.getElm = function(i){return document.getElementById(i)}; // getElm() is simply shorthand to document.getElementById()
//------------------------------------------------------------------------------
// resolves the target obj of an event
domapi.getTarget = function(E){return domapi.isGecko?E.target:event.srcElement};
//------------------------------------------------------------------------------
// based on the target node of the event passed, searches up the tree for a particular node type (k)
domapi.findTarget = function(E,k){return domapi.findParent(domapi.getTarget(E),k)};
//------------------------------------------------------------------------------
// search up the DOM event tree for a specific node and returns it (or null if not exists)
// k can be tagname (in all caps), a DA_TYPE or an actual node reference
domapi.findParent = function(n,k){
  try{
    while(n){
      if(n.nodeName == k)return n;
      if(n.DA_TYPE  == k)return n;
      if(n          == k)return n;
      n = n.parentNode;
    }
    return null;
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
// similar to findParent, but returns the child that led to the found parent
domapi.findChildOfParent = function(n,k){
  var _p;
  var _n = n;
  try{
    while(_n){
      _p = _n.parentNode;
      if(!_p)return null;
      if(_p.nodeName == k)return _n;
      if(_p.DA_TYPE  == k)return _n;
      if(_p          == k)return _n;
      _n = _p;
    }
    return null;
  }finally{
    _n = null; _p = null;
  }
};
//------------------------------------------------------------------------------
domapi.getChildElms = function(p, _datype, _type, _recurse){
  var R = [];
  var i;
  var A = p.getElementsByTagName(domapi.rVal(_type, "DIV"));
  try{
    _datype = domapi.rVal(_datype, "ELM");
    for(i=0;i<A.length;i++)
      if(A[i].DA_TYPE && A[i].DA_TYPE == _datype && (_recurse || A[i].parentNode == p))
        R.push(A[i]);

    return R;
  }finally{
    A = []; A = null;
    R = []; R = null;
  }
};
//------------------------------------------------------------------------------
domapi.getNodeIndex = function(n){
  // returns the index of a childnode in relation to it's siblings
  if(!n)return null;
  r = 0;
  var t = n.previousSibling;
  while(t){
    r++;
    t = t.previousSibling;
  }
  t = null;
  return r;
};
//------------------------------------------------------------------------------
domapi.transferElm = function(e,t){
  var temp = e.parentNode.removeChild(e);
  if(domapi.isKHTML)
    t.insertAdjacentElement = insert__Adj;  
  t.insertAdjacentElement("beforeEnd",temp);
};
//------------------------------------------------------------------------------
domapi.insertElm = function(e,t,w){
  // valid "where" values are beforeBegin, afterBegin, beforeEnd and afterEnd
  // this function removes the elm from the page and re-inserts it at the specified target
  if(!e)return;
  e.moveTo();
  e.setPosition("relative");
  if(!t)return;
  if(domapi.isIE5Mac || domapi.isKHTML){
    t.insertAdjacentElement = insertAdj_El;
    t.insert__Adj           = insert__Adj;
  }
  t.insertAdjacentElement(domapi.rVal(w,"afterBegin"),e);
};
//------------------------------------------------------------------------------
domapi.swapNodes = function(n1,n2){
  //n1.parentNode.insertBefore(n2.parentNode.removeChild(n2),n1);
  
  var p = n1.parentNode;
  var s = n1.nextSibling;
  n2.parentNode.replaceChild(n1, n2);
  p.insertBefore(n2, s);
};
//------------------------------------------------------------------------------
domapi.getTrueOffset = function(e){
  var x=0; var y=0;
  if(!e)return [x,y];
  while(e !=null && e !=document.body){
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return [x,y];
};
//------------------------------------------------------------------------------
domapi.getZRange = function(e){
  var z;
  var hi = 0; var lo = 0;
  if(!e)return [lo,hi];
  while(e && e.style){
    z = parseInt(e.style.zIndex);
    if(z < lo)lo = z;
    if(z > hi)hi = z;
    e = e.parentNode;
  }
  return [lo,hi];
};
//------------------------------------------------------------------------------
// See http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/unselectable.asp
// GX SBE
domapi.setUnselectable = function(element){
  var i;
  if(element.nodeType==1) {
    element.unselectable="on";
    for(i=0; i<element.childNodes.length; i++) {
      domapi.setUnselectable(element.childNodes[i]);
    }
  }
};
//------------------------------------------------------------------------------
domapi.disallowSelect = function(e){
  domapi.addEvent(e, "selectstart", domapi._nullFunction);
  domapi.addEvent(e, "mousedown",   domapi._nullFunction);
  domapi.addEvent(e, "mousemove",   domapi._nullFunction);
  e.style.userSelect = "none";
  if(domapi.isIE)domapi.setUnselectable(e);
};
//------------------------------------------------------------------------------
domapi._nullFunction = function(E){
  if(domapi.isGecko)E.preventDefault();
  return false;
};
//------------------------------------------------------------------------------
domapi.loadIframe = function(I,url,doCacheBuster){
  try{
    doCacheBuster = domapi.rBool(doCacheBuster, false);
    var _url = (doCacheBuster?url.addUrlParam("dacb",new Date().getTime() + Math.random()*1000):url);
    setTimeout(function(){
      try{
        var D = domapi.__iframeGetDocument(I);
        if(D)
          D.location.replace(_url);
        else
          I.src = _url;
      }catch(E){
        throw new Error(domapi.getString("LOAD_IFRAME") + "\n(1):" + E.message + "\n" + url); 
      }finally{
        D = null;
      }
    },20); // closure
  }catch(E){
    throw new Error(domapi.getString("LOAD_IFRAME") + "\n(2):" + E.message + "\n" + url);
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// box methods - these handle taking in optional arrays for setting box properties
// such as margin, padding and borders
// they also ensure a 4 element array is *always* returned when reading these properties
//------------------------------------------------------------------------------
/*domapi.boxValuesOut = function(s){
  if(domapi.isNil(s) || isNaN(parseInt(s)))return [0,0,0,0];
  var a=s.split(" ");
  for(var i=0;i<a.length;i++)a[i]=parseInt(a[i]);
  switch(a.length){
    case 1:a[1]=a[0];a[2]=a[0];a[3]=a[0];break;
    case 2:a[2]=a[0];a[3]=a[1];break;
    case 3:a[3]=a[1];break;
  }
  return a;
};*/
//------------------------------------------------------------------------------
domapi.boxValuesOut = function(s,pre,post){
  var r = [];
    //GX SBE Bugfixed for Moz.
  post = domapi.rVal(post,"");
  var st = pre + "Top"    + post;
  var sr = pre + "Right"  + post;
  var sb = pre + "Bottom" + post;
  var sl = pre + "Left"   + post;
  r[0] = (typeof s[st] != "undefined") ? domapi.rInt(s[st]) : 0;
  r[1] = (typeof s[sr] != "undefined") ? domapi.rInt(s[sr]) : 0;
  r[2] = (typeof s[sb] != "undefined") ? domapi.rInt(s[sb]) : 0;
  r[3] = (typeof s[st] != "undefined") ? domapi.rInt(s[st]) : 0;
  return r;
};
//------------------------------------------------------------------------------
domapi.completeBoxValuesOut = function(e){
  // this is not as efficient as boxValuesOut, but it also returns implicit values, from
  // class names.  Does all box values at once to save you calling it too often.  Returns
  // an object containing all the box arrays
  function add(a1,a2){
    // merges one array into another
    for(var i=0;i<a1.length;i++)a1[i] += a2[i];
  };

  var A, i, j;
  var S = e.style;
  var C = domapi.css;
  var O = {
    padding : domapi.boxValuesOut(S,"padding"),
    margin  : domapi.boxValuesOut(S,"margin"),
    border  : domapi.boxValuesOut(S,"border","Width")
  };
  try{
    A = e.className.split(" ");
    for(j=0;j<A.length;j++){
      i = C.findRule("." + A[j]);
      if(i > -1){
        S = C.rules[i].style;
        add(O.padding, domapi.boxValuesOut(S,"padding"));
        add(O.margin,  domapi.boxValuesOut(S,"margin"));
        add(O.border,  domapi.boxValuesOut(S,"border","Width"));
      }
    }
    return O;
  }finally{S = null;}
};
//------------------------------------------------------------------------------
domapi._boxValuesIn = function(t,r,b,l){
  if(typeof(t)=="object" && t.length){r=t[1];b=t[2];l=t[3];t=t[0]} // in mozilla an array is always passed as 1 argument
  t=domapi.rInt(t);
  if(domapi.isNil(l)){
    if(domapi.isNil(b)){
      if(domapi.isNil(r)) {r=t; b=t; l=t} // 1 arg: t     -> t t t t
      else{b=t; l=r}                    // 2 arg: t r   -> t r t r
    }else{
      r=rInt(r);
      l=r;                              // 3 arg: t r b -> t r b r
    }
  }
  return [t,r,b,l];
};
//------------------------------------------------------------------------------
domapi.boxValuesIn = function(t,r,b,l){
  var a = domapi._boxValuesIn(t,r,b,l);
  var px="px ";
  return a[0] + px + a[1] + px + a[2] + px + a[3] +"px";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// textWidth() and textHeight()
// these methods calculate the size in pixels that a given string will take up.
// pass in the font the string would be rendered in, or leave it blank.
// default font will be the font of the page body
//------------------------------------------------------------------------------
domapi._textDimension = function(text,font,p){
  if(!domapi._tdSpan){
    domapi._tdSpan = document.createElement("SPAN");
    with(domapi._tdSpan.style){
      position   = "absolute";
      visibility = "hidden";
      whiteSpace = "nowrap";
      lineHeight = "1";
      padding    = "0px";
    }
    document.body.appendChild(domapi._tdSpan);
  }
  var e                = domapi._tdSpan;
  e.innerHTML          = "";
  if(font)e.style.font = font;
  if(p)e.style.padding = p;
  e.innerHTML          = text;//.replace(/\s/g, "&nbsp;");
  var w = e.offsetWidth;
  var h = e.offsetHeight;
  e = null;
  return [w, h];
};
//------------------------------------------------------------------------------
domapi.textWidth  = function(text,font){return domapi._textDimension(text,font)[0]};
//------------------------------------------------------------------------------
domapi.textHeight = function(text,font){return domapi._textDimension(text,font)[1]};
//------------------------------------------------------------------------------
domapi.scrollBarWidth = function(){
  if(typeof domapi._sbw != "undefined")return domapi._sbw;
  var e1        = document.createElement("DIV");
  var s1        = e1.style;
  s1.overflow   = "scroll";
  s1.width      = "300px";
  s1.height     = "100px";
  s1.visibility = "hidden";
  document.body.appendChild(e1);
  domapi._sbw     = parseInt(300 - e1.scrollWidth);
  //e1.removeNode(  true);
  e1.parentNode.removeChild(e1);
  s1 = null; e1 = null;
  return domapi._sbw;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// event support (addEvent() and removeEvent() from D. Battini)
//------------------------------------------------------------------------------
domapi.addEvent = function(o,t,fn,useCapture){
  /* start M. Proctor's additions */
  if((t == "scroll")&&(!domapi.isIE)){
    if(!domapi.scrollEvents)domapi.scrollEvents = [];
    var e = domapi.scrollEvents;
    if(e.indexOf(fn) == -1)e[e.length] = fn;
    if(!this.onScrollTimer && domapi.reflow){
      domapi.oldPageYOffset = pageYOffset;
      domapi.oldPageXOffset = pageXOffset;
      domapi.onfiltered     = setInterval(
        "if((domapi.reflow.oldPageYOffset!=pageYOffset)||(domapi.reflow.oldPageXOffset!=pageXOffset))" +
        "{for(var i=0;i<domapi.scrollEvents.length;i++)domapi.scrollEvents[i]();" +
        "domapi.reflow.oldPageYOffset=pageYOffset;domapi.reflow.oldPageXOffset=pageXOffset;};",25);
    }
    return;
  }
  /* end M. Proctor's additions */
  __domapiEventCache.add(o,t,fn,useCapture); // hkl
  if(o.addEventListener){   // NS/MOZ DOMs evt
    o.addEventListener(t,fn, useCapture);
    return true;
  }else if(o.attachEvent){  // IEs DOMs evt
    var _addEvnRt = o.attachEvent("on"+t,fn);
    return _addEvnRt;
  }else if(domapi.isIE5Mac){ // IEs/IE5/51+ MacOS
    o["on"+t] = fn;
  }else
    throw new Error(domapi.getString("HANDLER_NO_ATTACH"));
};
//------------------------------------------------------------------------------
domapi.removeEvent = function(o,t,fn,useCapture){
  /* start M. Proctor's additions */
  if((t == "scroll")&&(!domapi.isIE)){
    var e = domapi.scrollEvents;
    var i = e.indexOf(fn);
    if(i!=-1)e.deleteItem(i);
    return;
  }
  /* end M. Proctor's additions */
  if(typeof fn == "undefined")return;
  if(o.removeEventListener){ // NS/MOZ DOMs evt
    o.removeEventListener(t,fn, useCapture);
    return true;
  }else if(o.detachEvent){   // IEs DOMs evt
    var remEvnRt = o.detachEvent("on"+t,fn);
    return remEvnRt;
  }else if(domapi.isIE5Mac){ // IEs/IE5/51+ MacOS
    o["on"+t] = null;
  }else
    throw new Error(domapi.getString("HANDLER_NO_DETACH"));
};
//------------------------------------------------------------------------------
// hkl - event caching mechanisms
__domapiEventCacheProto = function(){
  this.listEvents = [];
};
__domapiEventCacheProto.prototype.add = function(node, sEventName, fHandler, bCapture){
  this.listEvents.push(arguments)
};
__domapiEventCacheProto.prototype.flush = function(){
  var i, item;
  for(i = this.listEvents.length - 1; i >= 0; i = i - 1){
    item = this.listEvents[i];
    if(item[0].removeEventListener)
      item[0].removeEventListener(item[1], item[2], item[3]);
    /* From this point on we need the event names to be prefixed with 'on" */
    if(item[1].substring(0, 2) != "on") item[1] = "on" + item[1];
    if(item[0].detachEvent) item[0].detachEvent(item[1], item[2]);
    item[0][item[1]] = null;
    item = null;
  }
  this.listEvents = [];
};
__domapiEventCache = new __domapiEventCacheProto();
//------------------------------------------------------------------------------
domapi.preventBubble = function(E){
  if(domapi.isIE){
    event.cancelBubble = true;
    event.returnValue  = false;
  }else{
    if(E.stopPropagation)E.stopPropagation();
    else E.preventBubble();
    // GX SBE
    if(E.preventDefault)E.preventDefault();
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.createHttpRequest = function(){
  if(domapi.isIE   )return new ActiveXObject(domapi.msXmlValidProgId);
  else if(domapi.isGecko)return new XMLHttpRequest();
  else if(domapi.isKHTML)return new XMLHttpRequest();
  else return null;
};
//------------------------------------------------------------------------------
domapi.getContent = function(url){
  // adapted from The JavaScript Junkyard
  // copyright 2001 scott andrew lepera
  try{
    var req;
    var _url = url + ((url.indexOf("?")!=-1)?"&":"?") + "ds=" + new Date().getTime();
    req = domapi.createHttpRequest();
    req.open("GET",_url,false);
    req.send(null);
    var r = req.responseText;
    req = null; delete req;
    return r;
  }catch(e){
    throw new Error(domapi.getString("ERR_GET_CONTENT") + e.message);
    return "";
  }
};
//------------------------------------------------------------------------------
domapi.postContent = function(url,obj){
  try{
    var req;
    var s = domapi.jsonToString(obj);
    var _url = url + ((url.indexOf("?")!=-1)?"&":"?") + "ds=" + new Date().getTime();
    req = domapi.createHttpRequest();
    req.open("POST",_url,false);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    req.send("json=" + s);
    var r = req.responseText;
    req = null; delete req;
    return r;
  }catch(e){
    throw new Error(domapi.getString("ERR_POST_CONTENT") + e.message);
    return "";
  }
};
//------------------------------------------------------------------------------
// GX SBE
domapi.getAbsX=function(element){
  var x = 0;
  try{
    while(element!=null && element!=document.body) {
      x += element.offsetLeft;
      if(element.style.position=='absolute') break;
      element = element.offsetParent;
    }
  }catch(e){x = 0}
  return x;
};
//------------------------------------------------------------------------------
// GX SBE
domapi.getAbsY=function(element) {
  var y = 0;
  try{
    while(element!=null && element!=document.body) {
      y += element.offsetTop;
      if(element.style.position=='absolute') break;
      element = element.offsetParent;
    }
  }catch(e){y = 0}
  return y;
};
//------------------------------------------------------------------------------