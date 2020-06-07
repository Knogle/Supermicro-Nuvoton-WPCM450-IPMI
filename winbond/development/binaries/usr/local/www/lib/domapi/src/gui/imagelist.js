//------------------------------------------------------------------------------
// DomAPI Imagelist Component
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// ImageList allows you to flip through images of the same size arranged in a stack
// excellent for rollovers or storing many image states at once
//------------------------------------------------------------------------------

//--------------------------
domapi.bags.imagelist             = [];
domapi.bags.imagelist.isComponent = false;
domapi.comps.imagelist            = {};
//--------------------------
domapi.Imagelist = function(arg){return domapi.comps.imagelist.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.imagelist.constructor = function(arg){
  domapi.theme.preDefaults["imagelist"](arg);
  var p              = arg["parent"];
  var i              = arg["src"];
  var w              = arg["w"];
  var h              = arg["h"];
  var e              = domapi.Elm({parent:p,x:null,y:null,w:w,h:h,type:"IMG"});
  e.w = w; e.h = h;
  e.orientation      = domapi.rVal(arg["orientation"], "horizontal");
  e.style.position   = "relative";
  e.style.display    = "inline";
  e.border           = 0;
  e.src              = domapi.theme.skin.shim.src;
  e.style.background = 'url("'+i+'") 0 0 no-repeat';
  e.setIndex         = domapi.comps.imagelist._setIndex;
  e.setIndex();
  e.DA_TYPE          = "IMAGELIST";
  domapi.bags.imagelist[domapi.bags.imagelist.length] = e;
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.imagelist._setIndex = function(i){
  i = domapi.rInt(i);
  if(i == this.index)return;
  if(this.orientation == "horizontal")
    this.style.backgroundPosition = (-(i) * this.w) + "px 0px";
  else
    this.style.backgroundPosition = "0px " + (-(i) * this.h) + "px";
  this.index = i;
};
//------------------------------------------------------------------------------