//==============================================
// DomAPI Rollover Component
// D. Kadrioski 2/4/2002
// (c) Nebiru Software 2001-2005
//==============================================

domapi.loadUnit(         "imagelistlite");
domapi.registerComponent("rollover");
//------------------------------------------------------------------------------
domapi.Rollover = function(arg){return domapi.comps.rollover.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.rollover.constructor = function(arg){
  var e  = domapi.Component(arg,"rollover");
  try{
    var ww = arg["w"];
    var hh = arg["h"];
    if(domapi.isGecko){ //  WTF ?!
     arg["w"] += 2;
     arg["h"] += 2;   
    }
    e.img = domapi.Imagelistlite({parent:e,src:arg["src"],count:arg["count"],w:ww,h:hh,orientation:arg["orientation"]});
    var t = e.img.style;
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.rollover._free = function(){
  this.img = null;
};
//------------------------------------------------------------------------------
domapi.comps.rollover._draw = function(){};
//------------------------------------------------------------------------------
domapi.comps.rollover.onmouseover = function(){
  if(this.doRollover&&this.enabled)this.img.setIndex(1);
};
//------------------------------------------------------------------------------
domapi.comps.rollover.onmouseout = function(){
  if(this.enabled)this.img.setIndex(0);
};
//------------------------------------------------------------------------------
domapi.comps.rollover.onmousedown = function(){
  if(this.doDepress&&this.enabled)this.img.setIndex(2);
};
//------------------------------------------------------------------------------
domapi.comps.rollover.onmouseup = function(){
  if(this.enabled)this.img.setIndex((this.doRollover)?1:0);
};
//------------------------------------------------------------------------------
domapi.comps.rollover.reset = function(arg){
  this.setSize(arg["w"],arg["h"]);
};
//------------------------------------------------------------------------------
domapi.comps.rollover.setSrc = function(src){
  this.img.setSrc(src);
};
//------------------------------------------------------------------------------
domapi.comps.rollover.setEnabled = function(b){
  this.enabled = b;
  this.img.setIndex(b?0:3);
};
//------------------------------------------------------------------------------
