//==============================================
// DomAPI Lite Combobox Component
// D. Kadrioski 1/9/2003
// (c) Nebiru Software 2001,2004
//==============================================

domapi.loadUnit("rollover");
domapi.registerComponent("combobox2");
domapi.Combobox2 = function(arg){return domapi.comps.combobox2.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.combobox2.constructor = function(arg){
  var e       = domapi.Component(arg,"combobox2",false);
  var t       = domapi.theme;
  var s       = e.style;
  e.opened = false;
  e.edit   = domapi.Elm({
    parent : e,
    x      : 0,
    y      : 0,
    w      : 100,
    h      : t.skin.metrics.dropdown.h,
    type   : "INPUT"
  });

  e.dropBtn = domapi.Rollover({
    parent : e,
    src    : t.skin.combobox2.src,
    w      : t.skin.metrics.dropdown.w,
    h      : t.skin.metrics.dropdown.h
  });

  e.dropDown   = domapi.Elm({
    x      : 0,
    y      : 0,
    w      : e["dropdownW"],
    h      : e["dropdownH"],
    type   : "SELECT"    
  });

  e.items = e.dropDown.options;
  var d = e.dropDown;
  d.DA_TYPE = "DROPPANEL";
  d.hide();
  d.setAttribute("size", "2");
  d.parent        = e;
  e.setZ(        e.getZ());
  var p = domapi._private.combobox2;
  e.onbeforechange = p.dodropdownbeforechange;
  domapi.addEvent(e.dropBtn, "click", p.doclick);
  domapi.addEvent(d, "change", p.dodropdownchange);
  domapi._finalizeComp(e);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.combobox2._draw = function(){
  this.combobox2Draw();
};
//------------------------------------------------------------------------------
domapi.comps.combobox2._layout = function(w,h){
  var s   = domapi.theme.skin;
  var d   = this.dropDown;
  var b   = this.dropBtn;
  var e   = this.edit;
  var x   = this.getX();
  var y   = this.getY();
  var bb  = domapi.theme.border.width*2;
  var ww  = d.getW();
  //d.setZ(   this.getZ()+1);
  b.moveTo( w - s.metrics.dropdown.w,0);

  w       = w - s.metrics.dropdown.w + 1;

  w = w - this.dropBtn.getW();
  h = s.metrics.dropdown.h;
  e.setP(0);
  w += (domapi.isIE?17:domapi.isStrict?17:19);
  h += (domapi.isIE?0:domapi.isStrict?0:2);
  w += bb*2;
  if(!domapi.isStrict && domapi.isGecko && this.style.position == "relative"){
    w -= 2;
    h -= 2;     
  }      
  e.setSize(w, h);
  b.bringToFront();
  domapi._private.combobox2._placeDropdown(this);
};
//------------------------------------------------------------------------------
domapi.comps.combobox2.combobox2Draw=function(){
  var t               = domapi.theme;
  var f               = t.fonts;
  var b               = t.border;
  var d               = this.dropDown;
  //d.setB(               b.width);
  //d.style.borderColor = b.threed.darkShadow;
  //d.style.borderStyle = b.solid;
  f.window.apply(d);

  var s = domapi.theme.skin;
  this.dropBtn.reset({
    src:s.combobox2.src,
    w:s.metrics.dropdown.w,
    h:s.metrics.dropdown.h});
  //this.dropBtn.draw();
  this.setH(            s.metrics.dropdown.h,true);
  this.setBgColor(      f.buttonface.bgcolor);

  var e               = this.edit;
  e.setP(               2);
  e.setB(               domapi.rInt(b.width,1));
  e.setColor(           f.window.color);
  e.setBgColor(         f.window.bgcolor);
  e.style.font        = f.window.asString();//e.value = "wtf";
  e.style.borderColor = b.getInset();
};
//------------------------------------------------------------------------------
domapi.comps.combobox2.open = function(){
  if(this.opened)return;
  var d = this.dropDown;
  var Z = domapi.getZRange(d);
  d.setZ(Z[1] + 1);
  domapi._private.combobox2._placeDropdown(this);
  d.show();
  this.opened        = true;
  this.dropBtn.title = domapi.getString("DROPDOWN_CLOSE");
  if(this.onopen)this.onopen();
};
//------------------------------------------------------------------------------
domapi.comps.combobox2.close = function(){
  if(!this.opened)return;
  this.dropDown.hide();
  this.opened        = false;
  this.dropDown.setZ(  -1000);
  this.dropBtn.title = domapi.getString("DROPDOWN_OPEN");
  if(this.onclose)this.onclose();
};
//------------------------------------------------------------------------------
domapi.comps.combobox2.setAllowEdit = function(b){
  this.allowEdit = b;
  this.edit.readOnly = !b && this.enabled;
};
//------------------------------------------------------------------------------
domapi.comps.combobox2.setEnabled = function(b){
  this.enabled = b;
  this.setAllowEdit(this.allowEdit);
  this.dropBtn.setEnabled(b);
  this.edit.disabled = !b;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.comps.combobox2.addItem = function(text, value){
  var O = new Option(text, value);
  this.items[this.items.length] = O;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
domapi._private.combobox2.doclick = function(E){
  // fires in scope of the drop button which is a Rollover component
  var e = domapi.findTarget(E,"ROLLOVER");
  var t = e.parentNode;
  if(!t.enabled)return;
  if(t.dropDown.visible()){
    if(e.down)e.onmouseup();
    t.close();
  }else{
    var o = domapi.getTrueOffset(t);//alert([t.offsetParent.offsetLeft,o])
    if(domapi.isIE5Mac){
      // hack alert!  I have no idea why, but getTrueOffset seems to be off by 10,15 on ie5 mac
      o[0] += 10;
      o[1] += 15;
    }
    var xOff = t.getW() - t.dropDown.getW(); // to account for autoWidth in the dropDown being on
    if(t.style.position == "relative")o = [0,0];
    switch(t.direction){
      case "up"   : t.dropDown.moveTo(o[0]+xOff             ,o[1]-t.dropDown.getH()); break;
      case "down" : t.dropDown.moveTo(o[0]+xOff             ,o[1]+t.getH()         ); break;
      case "left" : t.dropDown.moveTo(o[0]-t.dropDown.getW(),o[1]                  ); break;
      case "right": t.dropDown.moveTo(o[0]+t.getW()         ,o[1]                  ); break;
    }
    t.open();
  }
  if(t.onbtnclick)t.onbtnclick(t.opened);
};
//------------------------------------------------------------------------------
// private members
domapi._private.combobox2.dodropdownbeforechange = function(v){ // scope is dropdown
  return true;
};
//------------------------------------------------------------------------------
domapi._private.combobox2.dodropdownchange = function(E){ // scope is dropdown
  var i = this.selectedIndex;
  var v = this.options[i].value;
  var t = this.options[i].text;
  var r             = this.parent;
  if(!r)return;
  if(typeof r.onbeforechange != "function")return;
  if(!r.onbeforechange([v,t]))return;
  r.value           = v;
  r.edit.value      = t;
  if(r.autoClose){
    this.hide();
    r.opened        = false;
    r.dropBtn.title = domapi.getString("DROPDOWN_OPEN");
  }
  r.edit.select();
  r.edit.focus();
  if(i && r.onchange)r.onchange([v,t]);
};//------------------------------------------------------------------------------
domapi._private.combobox2._placeDropdown = function(e){
  var d  = e.dropDown;
  var w  = e.getW();
  var h  = e.getH();
  var x  = e.getX();
  var y  = e.getY();
  var bb = domapi.theme.border.width*2;
  var ww = d.getW();
  d.moveTo(
    x + w - ww,
    y + h
  );
};
//------------------------------------------------------------------------------
