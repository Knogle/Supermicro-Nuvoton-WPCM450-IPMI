//==============================================
// DomAPI Colorpicker Component
// D. Kadrioski 10/24/2001
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("dropdown");
domapi.loadUnit("colorpane");
domapi.registerComponent("colorpicker");
domapi.dropdowns.push(   "colorpicker");
//------------------------------------------------------------------------------
domapi.Colorpicker = function(arg){return domapi.comps.colorpicker.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.colorpicker.constructor = function(arg){
  var p = domapi._private.colorpicker;
  if(!domapi.bags.colorpicker.length){
    // global colorpane - shared by all instances
    p._globalColorpane = domapi.Colorpane({x:10,y:10,doIframeShield:true});
    p._globalColorpane.setZ(2000);
    p._globalColorpane.showing = false;
    p._globalColorpane.hide();
  }
  var e = domapi.Component(arg,"colorpicker", true);
  try{
    domapi._inherit(e,"dropdown");
    e._constructor();
    domapi._inherit(e,"colorpicker");
    e.dropDown    = p._globalColorpane;
    e._outer      = domapi.Elm({parent:e,x:0,y:0,w:10,h:10});
    e._swatch     = document.createElement("IMG");
    e._swatch.src = domapi.theme.skin.shim.src;
    var s         = e._swatch.style;
    s.position    = "absolute";
    s.left        = "3px";
    s.top         = "3px";
    s.width       = "10px";
    s.height      = "10px";
    s.border      = "1px solid black";
    e._outer.appendChild(e._swatch);
    domapi.transferElm(e.edit, e._outer);
    e.edit.value  = e.value;
    e.edit.style.borderStyle = "none";
  
    e.dropDown.onokclick     = p._dookclick;
    e.dropDown.oncancelclick = p._docancelclick;
    e.edit.onchange          = p._doeditchange;
    e.edit.onkeydown         = p._dokeydown;
  
    domapi._finalizeComp( e);
    domapi._private.dropdown.ensurePositionSet(e);
    return e;
  }finally{
    e = null; s = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._free = function(){
  this._dropdownFree();
  this._outer  = null;
  this._swatch = null;
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._draw = function(){
  this.dropdownDraw();
  this.colorpickerDraw();
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker.colorpickerDraw = function(){
  var t = domapi.theme;
  var b = this.doBorder?t.border.width:0;
  var e = this._outer;
  e.setBgColor(domapi.theme.fonts.window.bgcolor);
  e.setB(1);
  e.style.borderStyle = this.doBorder?t.border.solid:"none";
  e.style.borderColor = t.border.getOutset();
  e.style.borderColor = domapi.theme.border.getInset();
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._layout = function(w,h){
  this._dropdownLayout(w,h);
  h = domapi.theme.skin.metrics.dropdown.h;
  this._outer.setSize(w,h);
  this.edit.setSize(w-20,h);
  this.edit.moveTo(20,1);
  this.dropDown.layout(this.dropDown.getW() - 3);
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker.setEnabled = function(b){
  this.enabled          = b;
  this.dropBtn.enabled  = b;
  this.dropDown.enabled = b;
  this.edit.disabled    = !b;
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker.setDoAllowEdit = function(b){
  if(domapi.isGecko){
    if(b)this.edit.removeAttribute("readonly");
    else this.edit.setAttribute("readonly", "readonly");
  }else{
    //this.edit.readonly = !b;
    if(b)this.edit.onfocus = null;
    else this.edit.onfocus = function(){this.blur()};
  }
  this.doAllowEdit = b;
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._onchange = function(){
  if(this.hiddenE)this.hiddenE.value = this.value;
  if(this.onchange)this.onchange(this.value);
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._setValue = function(v){
  this.dropDown.setHexValue(v);
  this.value      = this.dropDown.value.toUpperCase();
  this.edit.value = this.value;
  this._swatch.style.backgroundColor = this.value;
  this._onchange();
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._onclose = function(){
  this.dropDown.setHexValue(this.value); // force sync
  if(this.onclose)this.onclose();
};
//------------------------------------------------------------------------------
domapi.comps.colorpicker._onopen = function(){
  this.dropDown.setHexValue(this.value); // force sync
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// private members
domapi._private.colorpicker._globalColorpane = null;
//------------------------------------------------------------------------------
domapi._private.colorpicker._dookclick = function(){
  this.parent._setValue(this.value);
  if(this.parent.autoClose)this.parent.close();
};
//------------------------------------------------------------------------------
domapi._private.colorpicker._docancelclick = function(){
  this.parent.close();
};
//------------------------------------------------------------------------------
domapi._private.colorpicker._dokeydown = function(){
  var k = domapi.isIE?event.keyCode:E.which;
  if(k == 13){
    domapi._private.colorpicker._doeditchange.apply(this);
    this.select();
  }
};
//------------------------------------------------------------------------------
domapi._private.colorpicker._doeditchange = function(){
  var r = this.parentNode.parentNode;
  if(!r.doAllowEdit){
    this.value = r.value;
    return false;
  }
  r._setValue(domapi.color.makeSureIsHexColor(this.value.trim()).toUpperCase());
};
//------------------------------------------------------------------------------