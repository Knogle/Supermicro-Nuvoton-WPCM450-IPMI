//==============================================
// DomAPI Spinedit Component
// D. Kadrioski 12/3/2001
// (c) Nebiru Software 2001-2003
//==============================================

domapi.loadUnit(         "rollover");
domapi.loadUnit(         "sysutils");
domapi.registerComponent("spinedit");
//------------------------------------------------------------------------------
domapi.Spinedit = function(arg){return domapi.comps.spinedit.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.spinedit.constructor = function(arg){
  var t = domapi.theme;
  var s = t.skin;
  var e            = domapi.Component(arg,"spinedit");
  try{
    e.edit           = domapi.Elm({parent:e,x:0,y:0,w:100,h:100,type:"INPUT"});
    e.edit.setP(       2);
    e.edit.setB(       t.border.width);
    e.onbeforechange = function(v){return true};
    e.onchange       = function(v){};
    e.edit.value     = e.value;
    e.downBtn        = domapi.Rollover({
                         parent   : e,
                         src      : s.spineditDown.src,                          
                         w        : s.metrics.spinedit.w,
                         h        : s.metrics.spinedit.h});
    e.upBtn          = domapi.Rollover({
                         parent   : e,
                         src      : s.spineditUp.src,                          
                         w        : s.metrics.spinedit.w,
                         h        : s.metrics.spinedit.h});                            
    e._mouseheldTimer    = null;
    e._mouserevolveTimer = null;
    e.upBtn  ._dir       = 1;
    e.downBtn._dir       = -1;
    //------------------------
    var p = domapi._private.spinedit;
    e.upBtn.onfocus   = p._onfocus;
    e.downBtn.onfocus = p._onfocus;
    e.edit.onchange   = p._onchange;
    e.edit.onkeyup    = p._onchange;
  
    domapi.addEvent(e.upBtn  ,"mouseup"  ,p._mouseup  );
    domapi.addEvent(e.upBtn  ,"mousedown",p._mousedown);
    domapi.addEvent(e.upBtn  ,"mouseout", p._mouseout);
    domapi.addEvent(e.downBtn,"mouseup"  ,p._mouseup  );
    domapi.addEvent(e.downBtn,"mousedown",p._mousedown); 
    domapi.addEvent(e.downBtn,"mouseout", p._mouseout); 
    //------------------------
    e.setValue(e.value);
    domapi._finalizeComp(e);
    return e;
  }finally{
    e = null;t = null;s = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.spinedit._free = function(){
  this.onbeforechange     = null;
  this.onchange           = null;
  this.edit               = null;
  this.downBtn            = null;
  this._mouseheldTimer    = null;
  this._mouserevolveTimer = null;
  this.upBtn              = null;
};
//------------------------------------------------------------------------------
domapi.comps.spinedit._draw = function(){
  this.spineditDraw();
};
//------------------------------------------------------------------------------
domapi.comps.spinedit._layout = function(w,h){
  var ww = domapi.theme.skin.metrics.spinedit.w;
  var e  = this.edit;
  var b1 = this.upBtn;
  var b2 = this.downBtn;
  try{
    e.setP(0);
    e.setSize(w - ww*2 + 1, h);
  
    this.downBtn.moveTo(w - ww*2, 0);
    this.upBtn.moveTo(  w - ww,   0);
  }finally{
    e = null;b1 = null;b2 = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.spinedit.spineditDraw = function(){
  var e = this.edit;
  var t = domapi.theme;
  var f = t.fonts;
  var b = t.border;
  try{
    e.setColor(           f.window.color);
    e.setBgColor(         f.window.bgcolor);
    e.style.font        = f.window.asString();
    e.style.borderColor = b.getInset();
  }finally{
    e = null;t = null;f = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.spinedit.setEnabled    = function(b){
  this.enabled = b;
  this.upBtn.setEnabled(b);
  this.downBtn.setEnabled(b);
  this.edit.disabled = !b
};
//------------------------------------------------------------------------------
domapi.comps.spinedit._setValue      = function(i,skip){
  if(!this.edit)return false;
  if(!sysutils.isInteger(i))return false;
  if(this.onbeforechange && !this.onbeforechange(i))return false;
  if(i<this.min || i>this.max){
    if(this.doWarning)alert(domapi.formatGetString("SPINEDIT_WANRING", [this.min, this.max]));
    if(i<this.min)this.edit.value=this.min;
    if(i>this.max)this.edit.value=this.max;
    return false;
  }else{
    this.value = i;
    if(this.edit.value!=i)this.edit.value=i; // need to check to avoid jumping caret
    if(this.hiddenE)this.hiddenE.value = this.value;
    this.onchange(i);
    return true;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.spinedit._onfocus      = function(){this.parentNode.edit.focus()};
//------------------------------------------------------------------------------
domapi._private.spinedit._onchange     = function(){
  if(!sysutils.isInteger(this.value))
    this.value=this.parentNode.value;
  else
    if(!this.parentNode.setValue(this.value))
      this.value=this.parentNode.value;
};
//------------------------------------------------------------------------------
domapi._private.spinedit._mousedown    = function(E){
  var e = domapi.findTarget(E,"ROLLOVER");
  try{
    if(!e)return;
    var p = e.parentNode; if(!p.enabled)return;
  
    var a = parseInt(p.value) + parseInt(p.step) * e._dir;
    if(a>=p.min && a<=p.max)p.setValue(a);
    domapi._private.spinedit._activeControl = p;
    domapi._private.spinedit._activeDir     = e._dir;
    p._mouseheldTimer = setTimeout("domapi._private.spinedit._mouseheld()",p.holdInterval);
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.spinedit._mouseup      = function(E){
  var e = domapi.findTarget(E,"ROLLOVER");
  try{
    if(!e)return;
    var p = e.parentNode; if(!p.enabled)return;
    clearTimeout(p._mouseheldTimer);
    clearTimeout(p._mouserevolveTimer);
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.spinedit._mouseout     = function(E){
  var e = domapi.findTarget(E,"ROLLOVER");
  try{
    if(!e)return;
    var p = e.parentNode;
    clearTimeout(p._mouseheldTimer);
    clearTimeout(p._mouserevolveTimer);
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.spinedit._mouseheld    = function(){
  var p = this._activeControl;
  p._mouserevolveTimer = setInterval("domapi._private.spinedit._mouserevolve()",p.revolveInterval);
  p = null;
};
//------------------------------------------------------------------------------
domapi._private.spinedit._mouserevolve = function(){
  var p    = this._activeControl;
  var _dir = this._activeDir;
  
  var a = parseInt(p.value) + parseInt(p.step) * _dir;
  if(a>=p.min && a<=p.max)p.setValue(a);
  p = null;
};
//------------------------------------------------------------------------------
