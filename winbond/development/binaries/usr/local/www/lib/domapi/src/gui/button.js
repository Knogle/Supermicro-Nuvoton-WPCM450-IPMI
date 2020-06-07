//==============================================
// DomAPI Button Component
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001,2005
//==============================================

domapi.registerComponent("button");
//------------------------------------------------------------------------------
domapi.Button = function(arg){return domapi.comps.button.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.button.constructor = function(arg){
  var e = domapi.Component(arg,"button");
  e.style.cursor = "default";
  e.innerHTML    = '<div><span class="DA_BUTTONINNER">' + e.text + '</span></div>';
  e.cell         = e.childNodes[0];

  var p = domapi._private.button;
  domapi.addEvent(e,"mouseover",p.domouseover);
  domapi.addEvent(e,"mouseout" ,p.domouseout );
  domapi.addEvent(e,"mouseup"  ,p.domouseup  );
  domapi.addEvent(e,"mousedown",p.domousedown);

  domapi.disallowSelect(e);
  domapi._finalizeComp( e);
  if(!e.enabled)e.setEnabled(false);
  try{ return e }finally{ e = null }
};
//------------------------------------------------------------------------------
domapi.comps.button._free = function(){
  this.cell = null;
};
//------------------------------------------------------------------------------
domapi.comps.button._draw = function(){
  this.buttonDraw();
};
//------------------------------------------------------------------------------
domapi.comps.button.buttonDraw = function(){
  var doBorder  = this.doBorder && !domapi.doSkin;
  var t         = domapi.theme;
  var s         = this.style;
  var b         = doBorder?parseInt(t.border.width):0;
  if(doBorder)this.setB(b);
  s.borderStyle = this.doBorder?t.border.solid:"none";
  t = null;d = null;
};
//------------------------------------------------------------------------------
domapi.comps.button._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.button._setEnabled = function(b){
  domapi.css.addClass(this, "DA_INACTIVEBUTTONFACE", !b);
  this.disabled = !b;
};
//------------------------------------------------------------------------------
domapi.comps.button.setText = function(v){
  this.text           = v;
  this.cell.innerHTML = v;
};
//------------------------------------------------------------------------------
domapi.comps.button.setW = function(w,cancelBubble){
  this._setW(w,cancelBubble);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.button.setH = function(h,cancelBubble){
  this._setH(h,cancelBubble);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.button.setDown = function(b){
  if(b){
    if(this && this.enabled && this.doDepress)
      domapi.css.addClass(this, "DA_BUTTON_DEPRESS");
  }else
    if(!this.down && this && this.doDepress)domapi.css.removeClass(this, "DA_BUTTON_DEPRESS");
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
domapi._private.button.domouseover = function(E){
  var e = domapi.findTarget(E,"BUTTON");
  try{
    if(!e || !e.enabled || e._over)return;
    if(!e.doRollover)return;
    domapi.css.addClass(e, "DA_BUTTON_OVER");
    e._over = true;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.button.domouseout = function(E){
  var e = domapi.findTarget(E,"BUTTON");
  try{
    if(!e || !e.enabled)return;
    if(e.doDepress)domapi.css.removeClass(e, "DA_BUTTON_DEPRESS");
    if(!e._over || domapi.isMouseOver(E, e))return;
    if(e.doRollover)domapi.css.removeClass(e, "DA_BUTTON_OVER");
    e._over = false;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.button.domousedown = function(E){domapi.findTarget(E,"BUTTON").setDown(true)};
//------------------------------------------------------------------------------
domapi._private.button.domouseup = function(E){domapi.findTarget(E,"BUTTON").setDown(false)};
//------------------------------------------------------------------------------
