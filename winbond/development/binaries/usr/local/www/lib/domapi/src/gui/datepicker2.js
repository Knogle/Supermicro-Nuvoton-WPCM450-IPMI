//==============================================
// DomAPI Datepicker2 Component
// D. Kadrioski 9/6/2005
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("calendar");
domapi.registerComponent("datepicker2");
//------------------------------------------------------------------------------
domapi.Datepicker2 = function(arg){return domapi.comps.datepicker2.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.datepicker2.constructor = function(arg){
  var e = domapi.Component(arg,"datepicker2");
  try{
    e.edit               = document.createElement("INPUT");
    e.img                = document.createElement("IMG");
    e.calendar           = domapi.Calendar({
      mode           : "compact",
      //position       : "absolute",
      x              : 0,
      y              : 0,
      w              : 135,
      h              : 130,
      doMultiSelect  : false,
      mask           : arg["mask"],
      doIframeShield : true
    });
    e.img.style.position = "relative";
    e.img.width          = arg["imgW"];
    e.img.height         = arg["imgH"];
    e.img.src            = arg["src"];
    e.img.align          = "absmiddle";
    e.img.style.cursor   = domapi.cursors.hand;
    e.img.title          = arg["hint"];
    e.appendChild(e.edit);
    e.appendChild(e.img);
    e.style.whiteSpace   = "nowrap";
    e.style.overflow     = "hidden";
    e.edit.style.marginRight = "3px";
    e.calendar.hide();
    e.calendar.parent    = e;
    e.opened             = false;
    e.edit.style.height  = "100%";
    e.img.DA_TYPE        = "DATEPICKER2_IMG";

    var p = domapi._private.datepicker2;
    domapi.addEvent(e.edit, "focus", p.doeditfocus);
    domapi.addEvent(e.img,  "click", p.doimgclick);
    e.calendar.onbeforechange = p._dobeforechange;
    e.calendar.ondaychange    = p._dodaychange;
    e.edit.onchange           = p._doeditchange;
    e.calendar.setDate(arg.value, 'D');
    e.calendar.ondaychange();
    domapi._finalizeComp( e);
    if(!e.enabled)e.setEnabled(false);
    e.setZ(e.getZ());
    
    if(!p._documentEventAdded){
      domapi.addEvent(document, "click", p.dodocumentclick);
      p._documentEventAdded = true;
    }
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._free = function(){
  this.edit = null;
  this.img  = null;
  this.calendar.parent = null;
  this.calendar = null;
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._draw = function(){
  this.datepicker2Draw();
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2.datepicker2Draw = function(){
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._layout = function(w,h){
  this.edit.style.width = w - this["imgW"] - (domapi.isIE?9:5) + "px";
  this.calendar.setZ(this.getZ());
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2.setZ = function(z){  z = domapi.rInt(z);this.style.zIndex = z;this.calendar.style.zIndex = z};
domapi.comps.datepicker2.setDate = function(D){
  D = sysutils.isDate(D, this.mask);
  this.setValue(D);
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._setValue = function(D){
  if(this.value == D)return false;
  this.value = D;
  var b = this.calendar.setDate(D);
  var v = this.getValue();
  if(b)this.setFormValue(v);
  this.edit.value = v;
  return false; // to keep value from being assigned to the form value
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._getValue = function(){
  return sysutils.formatDate(this.value, this.mask);
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._setEnabled = function(b){
  domapi.css.addClass(this, "DA_INACTIVEBUTTONFACE", !b);
  this.disabled = !b;
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2._onchange = function(){
  this.edit.value = this.getValue();
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2.open = function(){
  var p = domapi.getTrueOffset(this);
  this.calendar.moveTo(p[0], p[1] + this.getH());
  this.calendar.show();
  this.opened = true;
  this.calendar.bringToFront();
};
//------------------------------------------------------------------------------
domapi.comps.datepicker2.close = function(){
  this.calendar.hide();
  this.opened = false;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.datepicker2.doeditfocus = function(E){domapi.findTarget(E,"DATEPICKER2").edit.select()};
//------------------------------------------------------------------------------
domapi._private.datepicker2.doimgclick = function(E){
  var e = domapi.findTarget(E,"DATEPICKER2");
  try{
    if(e.opened)
      e.close();
    else
      e.open();
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.datepicker2._dobeforechange=function(v){return this.parent.onbeforechange(v)};
//------------------------------------------------------------------------------
domapi._private.datepicker2._dodaychange = function(){
  var r   = this.parent;
  r.value = this.value;
  r.edit.value = r.getValue();
  r.setFormValue(r.edit.value);
  if(r.autoClose && r.opened)r.close();
  if(r.onchange)r.onchange(r.value);
};
//------------------------------------------------------------------------------
domapi._private.datepicker2._doeditchange = function(E){
  domapi.preventBubble(E);
  var r  = this.parentNode;
  var nd = sysutils.isDate(domapi.lang.fuzzyDateParse(this.value, r.mask), r.mask);
  if(!nd){
    alert(domapi.formatGetString("VAL_DATE",[this.value, r.mask]));
    this.value = r.getValue();
    this.select();
    return false;
  }
  r.calendar.setDate(nd, "I");
  r.value = nd;
  r._onchange();
  this.select();
  if(r.onchange)r.onchange(r.value);
};
//------------------------------------------------------------------------------
domapi._private.datepicker2.dodocumentclick = function(E){
  var e = domapi.getTarget(E);
  try{
    if(e.DA_TYPE == "DATEPICKER2_IMG")return; // ignore clicks to image button
    var c = domapi.findParent(e, "CALENDAR");
    if(c && c.parent && c.parent.DA_TYPE == "DATEPICKER2")return; // ignore clicks to calendar
    var B = domapi.bags.datepicker2;
    var i;
    // close all datepickers
    for(i=0;i<B.length;i++)
      B[i].close();
  }finally{
    e = null; c = null;
  }
};
//------------------------------------------------------------------------------