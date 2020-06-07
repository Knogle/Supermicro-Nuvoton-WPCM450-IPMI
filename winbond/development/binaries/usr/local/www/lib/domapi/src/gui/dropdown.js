//==============================================
// DomAPI Dropdown Component
// D. Kadrioski 8/17/2001
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit(         "rollover");
domapi.registerComponent("dropdown");
//--------------------------
domapi.Dropdown = function(arg){
  var e = domapi.Component(arg,"dropdown");
  try{
    e._constructor();
    domapi._finalizeComp(e);
    domapi._private.dropdown.ensurePositionSet(e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._constructor = function(){
  var p = domapi._private.dropdown;
  if(!domapi.bags.dropdown.indexOf(this))domapi.bags.dropdown.push(this);
  if(!p._documentEventAdded){
    domapi.addEvent(document, "click", p.dodocumentclick);
    p._documentEventAdded = true;
  }

  var t = domapi.theme;
  var s = this.style;
  try{
    this.edit = domapi.Elm({
      parent  : this,
      x       : 0,
      y       : 0,
      w       : 100,
      h       : t.skin.metrics.dropdown.h,
      type    : "INPUT",
      skipAdd : false
    });
    this.edit.setP(          2);
    this.edit.setB(          t.border.width);
    this.edit.tabIndex     = -1;
  //  this.edit.style["mozUserFocus"] = "none";
//    this.edit.onfocus      = function(){if(["function", "object"].contains(typeof this.select))this.select()};
    this.edit.onclick      = function(){this.parentNode.dropDown.hide();};
    this.opened            = false;
    this.autoClose         = true;
    this.direction         = "down";
    this.onchange          = function(v){};
    this.onbeforechange    = function(v){  return true};
    this._onchange         = function(v){ this.onchange(v)};
    this.onbtnclick        = function(b){};
    this.rootSetEnabled    = this.setEnabled;
    this.rootSetDoRollover = this.setDoRollover;
    s.borderStyle          = "none";
    s.cursor               = "default";
    s.fontSize             = "8pt";
    this.setOverflow(        "visible");
    //this.edit.setSize(       this.getW(),this.getH()+2);
    //-----
    this.dropBtn = domapi.Rollover({
      parent : this,
      src    : t.skin.dropdown.src,
      w      : t.skin.metrics.dropdown.w,
      h      : t.skin.metrics.dropdown.h,x:0,y:0
    });
    domapi.addEvent(this.dropBtn,"click",domapi._private.dropdown.doclick);
    //-----
    this.dropDown   = domapi.Elm({
      //parent  : this.parent,
      x       : 0,
      y       : 0,
      w       : 100,
      h       : 140,
      skipAdd : false,
      doIframeShield : true
    });
    t           = this.dropDown;
    t.DA_TYPE   = "DROPPANEL";
    t.hide      = function(){this.setX(-500);};
    t.hide();
    t.setOverflow("hidden");
    t.parent    = this;  
    this.setZ(    this.getZ());
  }finally{
    t = null; s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.dropdown.setEnabled = function(b){
  this.enabled         = b;
  this.dropBtn.enabled = b;
  this.edit.disabled   = !b;
  this.dropBtn.setEnabled(b);
};
//------------------------------------------------------------------------------
domapi.comps.dropdown.setDoRollover = function(b){  this.doRollover=b; this.dropBtn.doRollover=b};
domapi.comps.dropdown._eonkeypress  = function(){   return this.onbeforechange()};
domapi.comps.dropdown._eonchange    = function(){   this.parentNode._onchange(this.value)};
domapi.comps.dropdown.setZ          = function(z){  z = domapi.rInt(z);this.style.zIndex = z;this.dropDown.style.zIndex = z};
//------------------------------------------------------------------------------
domapi.comps.dropdown._ondafocus = function(){
  try{
    this.edit.focus();
    //if(domapi.focusedElm != this)
    this.edit.select();
  }catch(E){}
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._draw = function(){
  this.dropdownDraw();
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._free = function(){
  this._dropdownFree();  
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._dropdownFree = function(){
  this.onchange          = null;
  this.onbeforechange    = null;
  this._onchange         = null;
  this.onbtnclick        = null;
  this.edit.onclick      = null;
  this.edit              = null;
  this.dropDown.parent   = null;
  this.dropBtn           = null;
  this.dropDown.hide     = null;
  this.dropDown          = null;
  this.hide              = null;
  this.rootSetEnabled    = null;
  this.rootSetDoRollover = null;
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._layout = function(w,h){
  this._dropdownLayout(w,h);
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._dropdownLayout = function(w,h){
  var s = domapi.theme.skin;
  var d = this.dropDown;
  var b = this.dropBtn;
  var e = this.edit;
  try{
    var bb  = domapi.theme.border.width*2;
    //d.setW(               w);
    d.setZ(   this.getZ());
    b.moveTo( w - s.metrics.dropdown.w,0);

    w = w - s.metrics.dropdown.w+1;
    if(!domapi.isStrict)  h += bb;
    e.setP(0);
    e.setSize(w, h);

    b.bringToFront();
  }finally{
    b = null;
    s = null;
    d = null;
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.dropdown.dropdownDraw=function(){
  var t = domapi.theme;
  var f = t.fonts;
  var b = t.border;
  var d = this.dropDown;
  try{
    d.setB(               b.width);
    d.style.borderColor = b.threed.darkShadow;
    d.style.borderStyle = b.inset;
    d.setBgColor(         f.buttonface.bgcolor);

    var s = domapi.theme.skin;
    this.setBgColor(      f.buttonface.bgcolor);

    var e               = this.edit;
    e.setColor(           f.window.color);
    e.setBgColor(         f.window.bgcolor);
    e.style.font        = f.window.asString();
    e.style.borderColor = b.getInset();
  }finally{
    t = null;
    f = null;
    d = null;
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.dropdown.open = function(){
  if(this.opened)return;
//  var o = [this.getX(),this.getY()]; //replace getTrueOffset
  var o = domapi.getTrueOffset(this);
  var xOff = this.getW() - this.dropDown.getW(); // to account for autoWidth in the dropDown being on
  switch(this.direction){
    case "up"   : this.dropDown.moveTo(o[0]+xOff                ,o[1]-this.dropDown.getH()); break;
    case "down" : this.dropDown.moveTo(o[0]+xOff                ,o[1]+domapi.theme.skin.metrics.dropdown.h); break;
    case "left" : this.dropDown.moveTo(o[0]-this.dropDown.getW(),o[1]); break;
    case "right": this.dropDown.moveTo(o[0]+this.getW()         ,o[1]); break;
  }
  // close any other dropdowns that are open
  domapi.closeAllDropdowns();
  var Z = domapi.getZRange(this.dropDown);
  this.dropDown.setZ(Z[1] + 1);
  this.dropDown.parent = this;
  this.dropDown.show();
  this.dropDown.bringToFront();
  this.opened        = true;
  this.dropBtn.title = domapi.getString("DROPDOWN_CLOSE");
  this._onopen();
};
//------------------------------------------------------------------------------
domapi.comps.dropdown.close = function(){
  if(!this.opened)return;
  this.dropDown.hide();
  this.opened        = false;
  this.dropDown.setZ(  -1000);
  this.dropBtn.title = domapi.getString("DROPDOWN_OPEN");
  this._onclose();
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._onopen = function(){
  if(this.onopen)this.onopen();
};
//------------------------------------------------------------------------------
domapi.comps.dropdown._onclose = function(){
  if(this.onclose)this.onclose();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
domapi._private.dropdown.doclick = function(E){
  // fires in scope of the drop button which is a Rollover component
  var e = domapi.findTarget(E,"ROLLOVER");
  var t = e.parentNode;
  try{
    if(!t.enabled)return;
    if(t.opened){
      if(e.down)e.onmouseup();
      t.close();
    }else
      t.open();
    t.onbtnclick(t.opened);
  }finally{
    e = null;
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.dropdown.dodocumentclick = function(E){
  // any clicks on the page close all dropdowns
  // this also serves a purpose for dropdowns that share a global instance
  var b,i,j,s,e;
  try{
    // ignore clicks on actual dropdown buttons
    for(i=0;i<domapi.dropdowns.length;i++){
      s = domapi.dropdowns[i].toUpperCase();
      e = domapi.findTarget(E,s);
      if(e){
        // clicked on a dropdown, check which part
        if(domapi.findTarget(E,"ROLLOVER"))return; // clicked the button
        if(domapi.findTarget(E,"INPUT"))return; // clicked the edit
        if(e.allowEdit)return; // clicked on an active edit
      }
    }
  
    // make sure we didn't click on the dropDown pane
    e = domapi.getTarget(E);
    while(e){
      if(e.parent && e.parent.DA_TYPE && domapi.dropdowns.indexOf(e.parent.DA_TYPE.toLowerCase()) > -1)return;
      e = e.parentNode;
    }
  
    for(var i=0;i<domapi.dropdowns.length;i++){
      b = domapi.bags[domapi.dropdowns[i]];
      if(b)
        for(var j=0;j<b.length;j++)
          b[j].close();
    }
  }finally{
    e = null;
    b = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.dropdown.ensurePositionSet = function(e){
  try{
    while(e && e != document.body){
      if(e.style.position == "" || e.style.position == "undefined")
        e.style.position = "relative";
      e = e.parentNode;
    }
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------