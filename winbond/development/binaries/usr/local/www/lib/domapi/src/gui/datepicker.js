//==============================================
// DomAPI Datepicker Component
// D. Kadrioski 5/7/2002
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("dropdown");
domapi.loadUnit("calendar");
domapi.registerComponent("datepicker");
domapi.Datepicker = function(arg){return domapi.comps.datepicker.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.datepicker.constructor = function(arg){
  var e = domapi.Component(arg,"datepicker",true);
  domapi._inherit(e,"dropdown");
  e._constructor();
  domapi._inherit(e,"datepicker");

  e.dropDown = domapi.Calendar({
    //parent        : e.parent,
    x              : -1000,
    y              : e.getH(),
    h              : 155,
    w              : 158,
    doMultiSelect  : false,
    mask           : arg["mask"],
    doIframeShield : true
  });
  e.dropDown.parent = e;
  e.dropDown.hide();
  e.dropDown.showTitle = false;

  var p                     = domapi._private.datepicker;
  e.dropDown.onbeforechange = p._dobeforechange;
  e.dropDown.ondaychange    = p._dodaychange;
//  e.dropDown.onchange       = p._dochange;
  e.edit.onchange           = p._doeditchange;
  e.dropDown.setDate(arg.value, 'D');
  e.dropDown.ondaychange();

  domapi._finalizeComp(e);
  domapi._private.dropdown.ensurePositionSet(e);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.datepicker._draw = function(){
  this.dropdownDraw();
  this.datepickerDraw();
};
//------------------------------------------------------------------------------
domapi.comps.datepicker.datepickerDraw = function(){this.edit.setP([2,0,0,2])};
//------------------------------------------------------------------------------
domapi.comps.datepicker._layout = function(w,h){
  this._dropdownLayout(w,h);
  var ie = domapi.isIE;
  var e  = this.edit;

  h = domapi.theme.skin.metrics.dropdown.h;
  e.setSize(w,h);
  this.dropDown.layout(this.dropDown.getW() - 3);
};
//------------------------------------------------------------------------------
domapi.comps.datepicker.setDate = function(D){
  D = sysutils.isDate(D, this.mask);
  this.setValue(D);
};
//------------------------------------------------------------------------------
domapi.comps.datepicker._setValue = function(D){
  if(this.value == D)return false;
  var b = this.dropDown.setDate(D);
  if(b)this.setFormValue(this.getValue());
  return false; // to keep value from being assigned to the form value
};
//------------------------------------------------------------------------------
domapi.comps.datepicker._getValue = function(){
  return sysutils.formatDate(this.value, this.mask);
};
//------------------------------------------------------------------------------
domapi.comps.datepicker.setEnabled = function(b){
  this.enabled          = b;
  this.dropBtn.enabled  = b;
  this.dropDown.enabled = b;
  this.edit.disabled    = !b;
};
//------------------------------------------------------------------------------
domapi.comps.datepicker.setDoAllowEdit = function(b){
  if(domapi.isGecko){
    if(b)this.edit.removeAttribute("readonly");
    else this.edit.setAttribute("readonly", "readonly");
  }else{
    if(b)this.edit.onfocus = null;
    else this.edit.onfocus = function(){this.blur()};
  }
  this.doAllowEdit = b;
};
//------------------------------------------------------------------------------
domapi.comps.datepicker._onchange = function(){
  this.edit.value = this.getValue();
};
//------------------------------------------------------------------------------
domapi.comps.datepicker.setMask = function(m){
  var d     = this.dropDown;
  this.mask = m;
  d.mask    = m;
  d.setValue(d.value);
};
//------------------------------------------------------------------------------
domapi.comps.datepicker._onclose = function(){
  if(this.dropDown.value != this.value)
    this.dropDown.setDate(this.value); // force sync
  if(this.onclose)this.onclose();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.datepicker._dobeforechange=function(v){return this.parent.onbeforechange(v)};
//------------------------------------------------------------------------------
domapi._private.datepicker._dodaychange = function(){
  var r   = this.parent;
  r.value = this.value;
  r.edit.value = r.getValue();
  r.setFormValue(r.edit.value);
  if(r.autoClose && r.opened)r.close();
  if(r.onchange)r.onchange(r.value);
};
//------------------------------------------------------------------------------
domapi._private.datepicker._doeditchange = function(E){
  domapi.preventBubble(E);
  var r  = this.parentNode;
  var nd = sysutils.isDate(domapi.lang.fuzzyDateParse(this.value, r.mask), r.mask);
  if(!nd){
    alert(domapi.formatGetString("VAL_DATE",[this.value, r.mask]));
    this.value = r.getValue();
    this.select();
    return false;
  }
  r.dropDown.setDate(nd, "I");
  r.value = nd;
  r._onchange();
  this.select();
  if(r.onchange)r.onchange(r.value);
};
//------------------------------------------------------------------------------
