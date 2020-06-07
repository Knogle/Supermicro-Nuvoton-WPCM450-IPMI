//==============================================
// DomAPI Slider Component
// D. Kadrioski 1/24/2002
// (c) Nebiru Software 2001-2003
//==============================================

domapi.loadUnit(         "drag");
domapi.loadUnit(         "rollover");
domapi.registerComponent("slider");
//------------------------------------------------------------------------------
domapi.Slider = function(arg){return domapi.comps.slider.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.slider.constructor = function(arg){
  var e                 = domapi.Component(arg,"slider");
  var p                 = domapi._private.slider;
  try{
    e.style.background    = 'url("' + arg["bgImg"] + '") 0 0 no-repeat';
    e.onchange            = function(i){};
    e.thumb               = domapi.Rollover({
                              parent : e,
                              src    : arg["thumbImg"],
                              w      : arg["thumbW"],
                              h      : arg["thumbH"]
                            });  
    if(arg.mode == "basin"){
      e.thumb.basins        = arg["basins"].slice(0);
      e.thumb.turnOnDrag(     null,domapi.drag.dtCustom,0,
                              function(){if(!this.elm.parentNode.enabled)this.elm.cancelDrag()},
                              domapi.drag.dragBasin,null);
      
      e.thumb.onbasinchange = function(i){this.parentNode.setValue(i);this.parentNode.onchange(i)};
      e._setValue           = p._setBasinValue;
      e.setValue(0);
    }
  
    if(arg.mode == "range"){
      e.value               = {x:0, y:0};
      e.thumb.turnOnDrag(     null,domapi.drag.dtCustom,0,
                              function(){if(!this.elm.parentNode.enabled)this.elm.cancelDrag()},
                              domapi.drag.dragRange,null);
      e.thumb.onrangechange = p._onRangeChange;
      e._setValue           = p._setRangeValue;
      e.setRange(arg.range);
    }
  
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.slider._free = function(){
  this.onchange            = null;
  this.thumb.basins        = null;
  this.thumb.onbasinchange = null;
  this.thumb.onrangechange = null;
  this.thumb               = null;
  this._setValue           = null;
};
//------------------------------------------------------------------------------
domapi.comps.slider._draw = function(){
  this.sliderDraw();
};
//------------------------------------------------------------------------------
domapi.comps.slider._layout = function(w,h){
};
//------------------------------------------------------------------------------
domapi.comps.slider.sliderDraw = function(){
  var f = domapi.theme.fonts.buttonface;
  this.style.fontFamily = f.family;
  if(this.doBGFill && !domapi.doSkin)this.setBgColor(f.bgcolor);
  this.setColor(f.color);
  f = null;
};
//------------------------------------------------------------------------------
domapi.comps.slider.setEnabled = function(b){
  this.enabled = b;
  this.thumb.setEnabled(b);
};
//------------------------------------------------------------------------------
domapi.comps.slider.addBasin = function(x,y){
  this.thumb.basins.push([x, y]);
  if(this.thumb.basins.length == 1)this.setValue(0);
};
//------------------------------------------------------------------------------
domapi.comps.slider.setRange = function(a){
  var x_1 = Math.min(a[0],a[2]); 
  var x_2 = Math.max(a[0],a[2]); 
  var y_1 = Math.min(a[1],a[3]); 
  var y_2 = Math.max(a[1],a[3]); 
  this.thumb.rangeStart = [x_1,y_1];
  this.thumb.rangeEnd   = [x_2,y_2];
  if(this.reversed)this.thumb.moveTo(x_2,y_2);
  else             this.thumb.moveTo(x_1,y_1);
  this.range = a.slice(0);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.slider._setBasinValue = function(i){
  var t = this.thumb;
  if(t.basins.length && i < t.basins.length){
    t.moveTo(t.basins[i][0], t.basins[i][1]);
    this.value = i;
  }
  t = null;
};
//------------------------------------------------------------------------------
domapi._private.slider._setRangeValue = function(arr){
  var xp     = arr[0];
  var yp     = arr[1];
  var bubble = arr[2];
  var rs = this.thumb.rangeStart;
  var re = this.thumb.rangeEnd;
  var x  = Math.floor((re[0]-rs[0])*(xp/100));
  var y  = Math.floor((re[1]-rs[1])*(yp/100));
  if(this.reversed){
    x = (re[0]-rs[0])-x;
    y = (re[1]-rs[1])-y;
  }
  this.thumb.moveTo(rs[0]+x,rs[1]+y);
  this.value = {x:xp, y:yp};
  if(bubble)this.onchange(xp,yp);
};
//------------------------------------------------------------------------------
domapi._private.slider._onRangeChange = function(xp,yp){
  var e = this.parentNode;
  if(e.reversed){
    xp = 100 - xp;
    yp = 100 - yp;
  }
  e.value = {x:xp, y:yp};
  e.onchange(xp,yp);
  e = null;
};
//------------------------------------------------------------------------------