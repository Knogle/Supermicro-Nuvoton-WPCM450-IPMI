//------------------------------------------------------------------------------
// DomAPI domapi routines
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------
// additional contributors:
// O. Conradi <conradi@cs.utwente.nl>
// B. Dankert
// M. Proctor
// R. Halldearn
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi._addElmProtos = function(e){
  var p = domapi.elmProto;
  var a;
  try{
    if(e.tagName=="IFRAME" && domapi.isIE5){
      for(a in p)if(a!="visible")e[a] = p[a];
    }else for(a in p)e[a] = p[a];
  }catch(E){
    throw new Error('Error applying "elmProto.'+a+'"to a(n) '+e.tagName+
      "\non "+navigator.userAgent+
      "\n\nPlease notify support@domapi.com of this problem");
  }
};
//------------------------------------------------------------------------------
domapi.Elm = function(arg){
  /*
  If arg.ref is passed, uses that, if arg.id is passed uses that, else creates a
  new element.
  If creating a new element, arg.skipAdd will not add it to the document, otherwise
  adds to arg.parent if present or document.body if not.
  arg.skipStyle skips the code that applies color, size and what not.  This may
  be handy for speeding up component construction.
  arg.skipPosition skips the moveTo and any possible setPosition calls.
  */

  /*
  If this is the very first elm created, and the theme was not manaully applied,
  apply it now before creating any more elms
  */
  if(!domapi.theme.applied && domapi.loaded){
    domapi.theme.applied = true;
    domapi.theme.apply("buttonface");
  }

  var e;
  try{
    var created = false; // if we need to create one, delay to the end to add it
    if(!arg)arg = {}; // we always need an arg object, even if it's blank
    if(arg["id"])arg["ref"] = document.getElementById(arg["id"]); // by assigning to ref, we can resue the same code
    if(arg["ref"]){
      // make an Elm out of an existing element
      e = arg["ref"];
      // if skipStyle and skipPosition are not defined, we will default them to true when
      // using a reference.  this is opposite from the logic for creating a brand new TElm
      // reason being that we don't want to upset any existing items
      if(arg["skipStyle"]    == null)arg["skipStyle"]    = true;
      if(arg["skipPosition"] == null)arg["skipPosition"] = true;
      if(!domapi.rBool(arg["preserveContent"],true))e.innerHTML = "";
    }else{ // create an elm from scratch
      var t = domapi.rVal(arg["type"],"DIV"); // default to DIV if type is missing
      try{
        e = (t=="IFRAME")?domapi.createIFrame(arg):document.createElement(t); // IFRAMEs need special treatment
      }catch(E){
        throw new Error("Error creating element in domapi.Elm()." +
              "\nType: " + t +
              "\nError: " + E.message);
      }
      e.id    = domapi.guid();
      created = true;
    }
    if(arg["doIframeShield"] && domapi.isIE)
      e._iframeShield = domapi.createIFrameShield();
    domapi._addElmProtos(e);
    e.toString = e._toString;
    e.DA_TYPE = "ELM";
    e.added = false;
    e.hooks = {};
  
    if(!arg["skipStyle"]){
      // apply any properties sent
      var c  = arg["color"];
      var bg = arg["bgcolor"];
      //if(!domapi.isNil(c) )this.setColor(c);
      if(c  != null)e.setColor(  c);
      if(bg != null)e.setBgColor(bg);
    }
    if(!arg["skipPosition"]){
      // legacy positioning code
      var x = arg["x"];
      var y = arg["y"];
      var w = arg["w"];
      var h = arg["h"];
      if(w!=null && h!=null){
        e.setSize(w,h);
        e.setOverflow("hidden");// ie5.5 won't allow height smaller than font height
      }else{
        if(w!=null)e.setW(w,true);
        if(h!=null)e.setH(h,true);
      }

      /*if(x==null&&y==null)
        e.setPosition("relative");
      else{
        //alert(arg.asString()); // debug
        e.moveTo(domapi.rInt(x),domapi.rInt(y));
      }*/
      if(x!=null || y!=null)e.moveTo(domapi.rInt(x),domapi.rInt(y));
      if(arg["position"])e.style.position = arg["position"];
    }
    e.freed = false;
    e.fixed = false;    
    e.isElm = true;
    domapi.bags.elms.push(e);
    // note, domAPIIndex is deprecated and is no longer stored in the Elms
    // if you were to delete or free an Elm in the middle of the array, all indexes were then bogus
    // instead, use domapi.bags.elms.indexOf(this) to find it dynamically when you need it

    if(created && !arg["skipAdd"]){ // adding it to the page is optional
      if(!arg["parent"])arg["parent"] = document.body;
      if(arg["parent"].appendChild){
  //alert("elm.js add!!! : " + (arg["parent"].id));
        arg["parent"].appendChild(e);//alert(arg.doCreateButtons)
        if(e._iframeShield)arg["parent"].appendChild(e._iframeShield);
        e.added = true;
      }else throw new Error(domapi.getString("INVALID_PARENT")+"\narg:\n "+arg.asString());
    }
    // every iframe needs a name
    if(arg["type"] == "IFRAME" && !e.name)
      e.setAttribute("name", "F" + domapi.guid());

    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------

// enable this for backwards compatability
// domapi.createElm is actually deprecated, use domapi.Elm instead
/*domapi.createElm = function(p,x,y,w,h,bg,c,t){
  return domapi.Elm({
    parent  : p,
    x       : x,
    y       : y,
    w       : w,
    h       : h,
    bg      : bg,
    c       : c,
    type    : t,
    skipAdd : true
  });
};*/

//------------------------------------------------------------------------------
domapi.createScrollbar = function(arg){
  domapi._assert(arg, "orientation", "vertical");
  domapi._assert(arg, "w", 500);
  domapi._assert(arg, "h", 500);
  domapi._assert(arg, "x", 0);
  domapi._assert(arg, "y", 0);
  var e   = domapi.Elm(arg);
  try{
    var sbw = domapi.scrollBarWidth();
    switch(arg["orientation"]){
      case "horizontal" :
        e.setH(sbw);
        e.style.overflowX = "scroll";
        e.style.overflowY = "hidden";
        break;
      case "vertical" :
        e.setW(sbw);
        e.style.overflowX = "hidden";
        e.style.overflowY = "scroll";
        break;
    }e.scrollHeight = 600;
    e.style.backgroundColor = "buttonface";
    
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.createIFrame = function(arg){
  var n = domapi.rVal(arg["frameName"],'frame_' + (domapi.bags.elms.length));
  var b = arg["frameBorder"];
  try{
    if(domapi.isIE && domapi.major==5){
      var e       = document.createElement("DIV");
      e.innerHTML = '<iframe name="' + n + '" src=""></iframe>';
      e           = e.removeChild(e.children[0]);
    }else
      var e       = document.createElement("IFRAME");
    e.getDocument = domapi._iframeGetDocument;
    e.Hide        = function(){
      if(domapi.isIE && domapi.major==5)this.style.display = "none";
      else{
        this.style.visibility = "hidden";
        this.width            = 0;
        this.height           = 0;
      }
    };
    if(typeof b != "undefined")e.frameBorder = b;
    e.name = n;
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._iframeGetDocument = function(){
  return domapi.__iframeGetDocument(this);  
};
//------------------------------------------------------------------------------
domapi.__iframeGetDocument = function(e){
  try{
    if(domapi.isIE && domapi.major==5)return e.document;
    else return (domapi.isIE?e.contentWindow.document:e.contentDocument);
  }catch(E){
  }
};
//------------------------------------------------------------------------------
domapi.createIFrameShield = function(){
  var e = document.createElement("IFRAME");
  try{
    e.style.position = "absolute";
    e.style.left     = "0px"; 
    e.style.top      = "0px";
    e.style.width    = "100px";
    e.style.height   = "100px";
//    e.src            = "javascript:document.writeln('Shouldnt see this shield')";
    e.frameBorder    = "0";
    e.scrolling      = "no";
    if(domapi.isKHTML){
      e.style.setProperty("opacity", 0, "");
    }else if(domapi.isGecko)e.style.setProperty("-moz-opacity", 0, "");
    else if(domapi.isIE)e.style.filter = "alpha(opacity=0)";

    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._freeElm = function(e){    // Modified by Krister ...
  if(e && !e.freed){
    try{
      e.getDocument = null;
      if(!(domapi.browser == btFirefox && e.DA_TYPE == "WINDOW")){
        // FF crashes violently when trying to remove Window components from the DOM
        if(e.parentNode && e.parentNode.removeChild)e.parentNode.removeChild(e);
        else e.removeNode(true);return false;
      }
      if(e._iframeShield){
        e._iframeShield.removeNode(true);
        e._iframeShield  = null;
      }
      if(e.shadowElm && domapi.shadow)domapi.shadow.freeShadow(e);
      e._dragMDHandler = null;
      e._dragTarget    = null;
      e.popupmenu      = null;
      e.oncontextmenu  = null;
      e.Hide           = null;
      e.getDocument    = null;
      e._daowner       = null;
      e.packer         = null;
      e.reflow         = null;
    }catch(E){
      throw new Error('error in _freeElm - ' + E.message);
    }finally{
      e.freed = true;
    }
  }
};
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// everything from here down is the Elm() class
// use /examples/elm to test
//------------------------------------------------------------------------------
domapi.elmProto           = {};
domapi.hooks              = {};
domapi.useElmHooks        = false;  // use of hooks *may* hamper performance
//------------------------------------------------------------------------------
domapi.regHook   = function(nm,func){
  var h = this.hooks[nm];
  if(h)h[h.length] = func;
  else this.hooks[nm] = [func];
};
//------------------------------------------------------------------------------
domapi.unRegHook = function(nm,func){ // M. Proctor
  // darin - added: returns 1 for success, 0 for error
  var h = this.hooks[nm]; if(!h)return 0;
  var i = h.indexOf(func);
  if(i==-1)return 0;
  h.deleteItem(i);
  return 1;
};
//------------------------------------------------------------------------------
domapi._dispHook = function(nm,args){
  var H = domapi.hooks[nm];
  if(H)for(var i=0;i<H.length;i++)H[i](args);
};
//------------------------------------------------------------------------------
domapi.elmProto._dispHook = function(nm,args){
  // global
  var H = domapi.hooks[nm];
  if(H)for(var i=0;i<H.length;i++)H[i](this, args);
  // local
  var h = this.hooks[nm];
  if(h)for(var i=0;i<h.length;i++)h[i](this, args);
};
//------------------------------------------------------------------------------
domapi.elmProto.regHook = domapi.regHook;
domapi.elmProto.unRegHook = domapi.unRegHook;
//------------------------------------------------------------------------------
domapi.elmProto.getX        = function(){if(domapi.useElmHooks)this._dispHook("getX",arguments);       return this.offsetLeft};
domapi.elmProto.getY        = function(){if(domapi.useElmHooks)this._dispHook("getY",arguments);       return this.offsetTop};
domapi.elmProto.getW        = function(){if(domapi.useElmHooks)this._dispHook("getW",arguments);       return this.offsetWidth};
domapi.elmProto.getH        = function(){if(domapi.useElmHooks)this._dispHook("getH",arguments);       return this.offsetHeight};
domapi.elmProto.getP        = function(){if(domapi.useElmHooks)this._dispHook("getP",arguments);       return domapi.boxValuesOut(this.style,"padding")};
domapi.elmProto.getM        = function(){if(domapi.useElmHooks)this._dispHook("getM",arguments);       return domapi.boxValuesOut(this.style,"margin")};
domapi.elmProto.getB        = function(){if(domapi.useElmHooks)this._dispHook("getB",arguments);       return domapi.boxValuesOut(this.style,"border","Width")};
domapi.elmProto.getZ        = function(){if(domapi.useElmHooks)this._dispHook("getZ",arguments);       return domapi.rInt(this.style.zIndex)};
domapi.elmProto.getColor    = function(){if(domapi.useElmHooks)this._dispHook("getColor",arguments);   return domapi.color.makeSureIsHexColor(this.style.color)};
domapi.elmProto.getBgColor  = function(){if(domapi.useElmHooks)this._dispHook("getBgColor",arguments); return domapi.color.makeSureIsHexColor(this.style.backgroundColor)};
domapi.elmProto.getOverflow = function(){if(domapi.useElmHooks)this._dispHook("getOverflow",arguments);return this.style.overflow};
domapi.elmProto.getPosition = function(){if(domapi.useElmHooks)this._dispHook("getPosition",arguments);return(!this.fixed)?this.style.position:"fixed"}; // M. Proctor - added "fixed"
domapi.elmProto.getText     = function(){if(domapi.useElmHooks)this._dispHook("getText",arguments);    return this.innerHTML};

// GX SBE
domapi.elmProto.getAbsX=function() { return domapi.getAbsX(this)};
// GX SBE
domapi.elmProto.getAbsY=function() { return domapi.getAbsY(this)};

//------------------------------------------------------------------------------
domapi.elmProto.getClip     = function(){
  if(domapi.useElmHooks)this._dispHook("getClip",arguments);
  if(domapi.isNil(this.style.clip)||this.style.clip=="auto")return [0,this.getW(),this.getH(),0];
  var c=this.style.clip.split("rect(")[1].split(" ");
  for(var i=0;i<c.length;i++) c[i]=parseInt(c[i]);
  return c;
};
//------------------------------------------------------------------------------
domapi.elmProto._setX       = function(x,cancelBubble){
  var raiseOnmove=(!cancelBubble && typeof this.onmove=="function");
  if(raiseOnmove)var oldX = this.getX();
  this.style.left = domapi.rInt(x)+"px";
  if(this._iframeShield)this._iframeShield.style.left = this.style.left;
  if(!cancelBubble){
    if(domapi.useElmHooks)this._dispHook("setX",arguments);
    if(raiseOnmove)this.onmove(    oldX,null,x,null);
  }
};
//------------------------------------------------------------------------------
domapi.elmProto._setY       = function(y,cancelBubble){
  var raiseOnmove=(!cancelBubble && typeof this.onmove=="function");
  if(raiseOnmove)var oldY = this.getY();
  this.style.top  = domapi.rInt(y)+"px";
  if(this._iframeShield)this._iframeShield.style.top = this.style.top;
  if(!cancelBubble){
    if(domapi.useElmHooks)this._dispHook("setY",arguments);
    if(raiseOnmove)this.onmove(    null,oldY,null,y);
  }
};
//------------------------------------------------------------------------------
domapi.elmProto._setW       = function(w,cancelBubble){
//if(domapi.trace)dump('_setW('+this.DA_TYPE+')');
  w=domapi.rInt(w); if(w<0)return false;
  var raiseOnresize = (!cancelBubble && typeof this.onresize=="function");
  if(raiseOnresize)var oldW = this.getW();
  // following line is a major bottle neck in moz
  if(!domapi.needsBoxFix){var b=this.getB(); var p=this.getP(); w -= b[1]+b[3]+p[1]+p[3]; if(w<0)w=0}
  this.style.width = w+"px";
  if(this._iframeShield)this._iframeShield.style.width = this.getW() + 2 + "px"; // top account for box model
  if(!cancelBubble){
    if(domapi.useElmHooks)this._dispHook("setW",arguments);
    if(raiseOnresize)this.onresize(oldW,null,w,null);
    if(typeof this.layout  =="function")this.layout();
  }
};
//------------------------------------------------------------------------------
domapi.elmProto._setH       = function(h,cancelBubble){
//if(domapi.trace)dump('_setH('+this.DA_TYPE+')');
  h=domapi.rInt(h); if(h<0)return false;
  var raiseOnresize = (!cancelBubble && typeof this.onresize=="function");
  if(raiseOnresize)var oldH = this.getH();
  // following line is a major bottle neck in moz
  if(!domapi.needsBoxFix){var b=this.getB(); var p=this.getP(); h -= b[0]+b[2]+p[0]+p[2]; if(h<0)h=0}
  this.style.height = h+"px";
  if(this._iframeShield)this._iframeShield.style.height = this.getH() + 2 + "px"; // top account for box model
  if(!cancelBubble){
    if(domapi.useElmHooks)this._dispHook("setH",arguments);
    if(raiseOnresize)this.onresize(null,oldH,null,h);
    if(typeof this.layout  =="function")this.layout();
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.setX        = function(x,cancelBubble){this._setX(x,cancelBubble)};
domapi.elmProto.setY        = function(y,cancelBubble){this._setY(y,cancelBubble)};
domapi.elmProto.setW        = function(w,cancelBubble){this._setW(w,cancelBubble)};
domapi.elmProto.setH        = function(h,cancelBubble){this._setH(h,cancelBubble)};
//------------------------------------------------------------------------------
domapi.elmProto.setP        = function(t,r,b,l){
  if(!domapi.needsBoxFix){var w=this.getW(); var h=this.getH()}
  this.style.padding = domapi.boxValuesIn(t,r,b,l);
  if(!domapi.needsBoxFix){this.setW(w,true); this.setH(h,true)}
  if(domapi.useElmHooks)this._dispHook("setP",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.setB        = function(t,r,b,l){
  if(!domapi.needsBoxFix){var w=this.getW(); var h=this.getH()}
  this.style.borderWidth = domapi.boxValuesIn(t,r,b,l);
  //alert(domapi.needsBoxFix)
  if(!domapi.needsBoxFix && this.tagName!="TABLE"){
    if(w>0)this.setW(w,true);
    if(h>0)this.setH(h,true);
  }
  if(domapi.useElmHooks)this._dispHook("setB",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.setM        = function(t,r,b,l){this.style.margin = domapi.boxValuesIn(t,r,b,l)};
//------------------------------------------------------------------------------
domapi.elmProto.setZ        = function(z){
  z                   = domapi.rInt(z);
  this.style.zIndex   = z;
  if(this._iframeShield)this._iframeShield.style.zIndex = z-1;
  var p               = this.parentNode;
  try{
    if(p){
      if(z>domapi.rInt(p._maxZ,1))p._maxZ  = z;
      if(z<domapi.rInt(p._minZ,1))p._minZ  = z;
    }
    if(domapi.useElmHooks)this._dispHook("setZ",arguments);
  }finally{
    p= null;
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.setColor    = function(c){this.style.color           = c};
domapi.elmProto.setBgColor  = function(c){this.style.backgroundColor = c};
domapi.elmProto.setOverflow = function(f){this.style.overflow        = domapi.rVal(f,"")};
//------------------------------------------------------------------------------
domapi.elmProto.setClip     = function(t,r,b,l){
  if(typeof(t)=="object" && t.length){r=t[1];b=t[2];l=t[3];t=t[0]}   // an array is always passed as 1 argument
  this.style.clip= "rect("+domapi.rInt(t)+"px "+domapi.rInt(r,this.getW())+"px "+domapi.rInt(b,this.getH())+"px "+domapi.rInt(l)+"px)";
  if(domapi.useElmHooks)this._dispHook("setClip",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.setSize     = function(w,h,cancelBubble){
  var raiseOnresize = (!cancelBubble && typeof this.onresize=="function");
  if(raiseOnresize){
    var oldH = this.getH();
    var oldW = this.getW();
  }
  if(domapi.trace)dump(this.toString()+'.setSize('+[w,h,cancelBubble]+')');
  w=domapi.rInt(w); h=domapi.rInt(h); if(w<0 || h<0)return false;
  if(!domapi.needsBoxFix){
    var b=this.getB(); var p=this.getP();
    w -= b[1]+b[3]+p[1]+p[3]; if(w<0)w=0;
    h -= b[0]+b[2]+p[0]+p[2]; if(h<0)h=0;
  }
  this.style.width  = w+"px";
  this.style.height = h+"px";
  if(this._iframeShield){
    this._iframeShield.style.width  = this.style.width;
    this._iframeShield.style.height = this.style.height;
  }
  if(!cancelBubble){
    if(domapi.useElmHooks){
      this._dispHook("setW",arguments);
      this._dispHook("setH",arguments);
      this._dispHook("setSize",arguments);
    }
    if(raiseOnresize)this.onresize(oldW,oldH,w,h);
    if(typeof this.layout  =="function"){
      if(domapi.trace)dump(this.toString()+' Calling layout() for '+this.id);
      this.layout();}
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.setSizeBy   = function(w,h,cancelBubble){
  this.setSize(this.getW()+parseInt(w),this.getH()+parseInt(h),cancelBubble);
  this._dispHook("setSizeBy",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.moveTo      = function(x,y,cancelBubble){
  this.setPosition();
  /*if(typeof this.onmove=="function"){
    var oldX = this.getX();
    var oldY = this.getY();
  }*/
  this.setX(x,cancelBubble);
  this.setY(y,cancelBubble);
  if(domapi.useElmHooks)this._dispHook("moveTo",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.moveBy      = function(x,y,cancelBubble){
  this.moveTo( this.getX()+parseInt(x),this.getY()+parseInt(y),cancelBubble);
  if(domapi.useElmHooks)this._dispHook("moveBy",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.moveToElm   = function(e,cancelBubble){
  this.moveTo(e.getX(),e.getY(),cancelBubble);
  if(domapi.useElmHooks)this._dispHook("moveToElm",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.sizeToElm   = function(e,cancelBubble){
  this.setSize(e.getW(),e.getH(),cancelBubble);
  if(domapi.useElmHooks)this._dispHook("sizeToElm",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.setText     = function(s){
  this.innerHTML = s;
  if(domapi.useElmHooks)this._dispHook("setText",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.hide        = function(){
  this.style.visibility = "hidden";
  if(this._iframeShield)this._iframeShield.style.display = "none";
  if(domapi.useElmHooks)this._dispHook("hide",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.show        = function(){
  this.style.visibility = "visible";
  if(this._iframeShield)this._iframeShield.style.display = "block";
  if(domapi.useElmHooks)this._dispHook("show",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.visible     = function(){
  if(domapi.useElmHooks)this._dispHook("visible",arguments);
  return this.style.visibility=="visible"?true:false;
};
//------------------------------------------------------------------------------
/*domapi.elmProto.buttonDown  = function(w){
  var d=this.theme?this.theme.bdrDark :domapi.themes.system.bdrDark ;
  var h=this.theme?this.theme.bdrLight:domapi.themes.system.bdrLight;
  this.style.borderColor=d+" "+h+" "+h+" "+d;
  this.setB(domapi.rInt(w,this.theme?this.theme.bdrWidth:domapi.themes.system.bdrWidth));
  if(domapi.useElmHooks)this._dispHook("buttonDown",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.buttonUp    = function(w){
  var d=this.theme?this.theme.bdrDark :domapi.themes.system.bdrDark ;
  var h=this.theme?this.theme.bdrLight:domapi.themes.system.bdrLight;
  this.style.borderColor=h+" "+d+" "+d+" "+h;
  this.setB(domapi.rInt(w,this.theme?this.theme.bdrWidth:domapi.themes.system.bdrWidth));
  if(domapi.useElmHooks)this._dispHook("buttonUp",arguments);
};*/
//------------------------------------------------------------------------------
domapi.elmProto.setClipBy   = function(t,r,b,l){
  if(typeof(t)=="object" && t.length){r=t[1];b=t[2];l=t[3];t=t[0]} // an array is always passed as 1 argument
  var c=this.getClip();
  c[0] += domapi.rInt(t);
  c[1] += domapi.rInt(r);
  c[2] += domapi.rInt(b);
  c[3] += domapi.rInt(l);
  this.setClip(c);
  if(domapi.useElmHooks)this._dispHook("setClipBy",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.setAlpha    = function(a){ // B. Dankert
  if(domapi.useElmHooks)this._dispHook("setAlpha",arguments);
  if(domapi.isIEMac)return; // darin - ie on mac has no alpha
  if(!String(a).indexOf("%"))a=parseInt(a)*100;
  a=parseInt(a);
  if(a<0)a=0; if(a>100)a=100;
  if(domapi.isKHTML){
    if(a == 100)a = 99; // safari 1.2 can't handle opacity=1, 0.99 is darn close though
    this.style.setProperty("opacity", a / 100, "");
  }else if(domapi.isGecko)this.style.setProperty("-moz-opacity", a / 100, ""); // M. Proctor - moz1 fix
  else if(domapi.isIE)this.style.filter = "alpha(opacity="+a+")";
};
//------------------------------------------------------------------------------
domapi.elmProto.getAlpha    = function(){ // B. Dankert
  if(domapi.useElmHooks)this._dispHook("getAlpha",arguments);
  if(domapi.isIEMac)return 100; // darin - ie on mac has no alpha
  if(domapi.isGecko){
    if(domapi.isKHTML)
      var a = this.style.opacity;
    else
      var a = this.style.getPropertyValue("-moz-opacity"); // M. Proctor - moz1 fix
    if(domapi.isNil(a))return 100; // darin - property is null by default
    return parseInt(a*100);
  }
  if(domapi.isIE)return domapi.rInt(parseInt(this.style.filter.split("=")[1]),100);
};
//------------------------------------------------------------------------------
domapi.elmProto.setPosition = function(p){ // Modified by M. Proctor to support "fixed"
  p = domapi.rVal(p,"absolute");
  if(p==this.getPosition())return; // nothing to do

  if(p!="fixed" && !this.fixed)
    this.style.position = p;
  else
    if(p!="fixed" && !domapi.isGecko){ //was previously fixed, so remove from array
      domapi.fixedElms.deleteItem(this.fixedIndex);
      this.fixed = false;
      //no more fixed elms remove the event.
      if(domapi.fixedElms.length == 0){
        domapi.removeEvent(window, "scroll", domapi.fixElms);
        domapi.removeEvent(window, "resize", domapi.fixElms);
        domapi.fixElm = false;
      }
      this.style.position = domapi.rVal(p,"absolute");
    }else if(domapi.isGecko){ //moz supports fixed
      this.style.position = "fixed";
    }else{
      //initialise the array of fixedElms and the function to fix the elms
      if(!domapi.isGecko){
        if(!domapi.fixedElms)domapi.fixedElms = [];
        if(!domapi.fixElm){
          domapi.fixElms = function(){
            var elms = domapi.fixedElms;
            for(var a=0;a<elms.length;a++){
              elms[a].setY(domapi.scrollTop()  + elms[a].fixedY);
              elms[a].setX(domapi.scrollLeft() + elms[a].fixedX);
            }
          };
          domapi.addEvent(window, "scroll", domapi.fixElms, true);
          domapi.addEvent(window, "resize", domapi.fixElms, true);
        }
        this.style.position = "absolute";
        this.fixedX = this.getX();
        this.fixedY = this.getY();
        this.fixed  = true;
        domapi.fixedElms[domapi.fixedElms.length] = this;
        //record index value, to allow deletion at a later date.
        this.fixedIndex = domapi.fixedElms.length-1;
      }
    }
  if(domapi.useElmHooks)this._dispHook("setPosition",arguments);
};
//------------------------------------------------------------------------------
domapi.elmProto.remove = function(){ // R. Halldearn
  var c = domapi.bags.elms;
  c.deleteItem(c.indexOf(this));
  // components
  var bag = domapi.bags[this.DA_TYPE.toLowerCase()];
  if(typeof bag!="undefined")bag.deleteItem(bag.indexOf(this));
  //groups
  if(domapi.groups){
    var g = this.inGroups();
    for(var i=0;i<g.length;i++)this.removeFromGroup(g[i]);
  }
  var parent = this.parentNode;
  return parent.removeChild(this);
};
//------------------------------------------------------------------------------
domapi.elmProto.bringToFront = function(){this.setZ(domapi.rInt(this.parentNode._maxZ,100)+1)};
//------------------------------------------------------------------------------
domapi.elmProto.sendToBack   = function(){this.setZ(domapi.rInt(this.parentNode._minZ,100)-1)};
//------------------------------------------------------------------------------
domapi.elmProto._toString = function(){ // Developer could overide this
  return '[object '+this.DA_TYPE+', id='+this.id+']';
};
//------------------------------------------------------------------------------