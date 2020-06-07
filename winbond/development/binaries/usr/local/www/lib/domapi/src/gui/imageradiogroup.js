//==============================================
// DomAPI Imageradiogroup Component
// D. Kadrioski 3/19/2004
// (c) Nebiru Software 2001,2004
//==============================================

domapi.loadUnit(         "imageradiobutton");
domapi.registerComponent("imageradiogroup" );
//------------------------------------------------------------------------------
domapi.Imageradiogroup = function(arg){return domapi.comps.imageradiogroup.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup.constructor = function(arg){
  var e = domapi.Component(arg,"imageradiogroup", false , "FIELDSET");
  try{
    e.items = [];
    e.text  = domapi.Elm({parent:e, type:"LEGEND"});
    e.text.innerHTML  = arg.text;
    e.text.className  = "DA_IMAGERADIOGROUP_CAPTION";
    e._editBox        = domapi.Elm({parent:e,type:"INPUT",x:0,y:0,w:0,h:20});
    e._editBox.hide();
    e._editBox.setAttribute("TYPE","TEXT");
    e._editBox.setZ(-11);
    e.style.cursor    = "default";
    
    var p = domapi._private.imageradiogroup;
    domapi.addEvent(e, "keydown",   p.dokeydown);
    domapi.addEvent(e, "click",     p.doclick  );
    
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
    p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup._free = function(){
  for(var i=0;i<this.items.length;i++)
    this.items[i]._group = null;
  this.items    = [];
  this.items    = null;
  this.text     = null;
  this._editBox = null;
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup._draw = function(){
  this.imageradiogroupDraw();
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup.imageradiogroupDraw = function(){
  this.setItemIndex(this.itemIndex);
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup._layout = function(w,h){
  var rows = Math.ceil(this.items.length / this.cols);
  var i,j,ii;
  var x = Math.round((w-20) / this.cols);
  var y = Math.round((h-10) / rows);
  var xx = domapi.isIE?10:2;
  var yy = domapi.isIE?30:10;
  ii = -1;
  for(i=0;i<this.cols;i++)
    for(j=0;j<rows;j++){
      ii++;
      if(ii < this.items.length)
        this.items[ii].moveTo(xx + x*i, yy + y*j);
    }
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup.addItem = function(arg){
  arg.parent = this;
  var e = domapi.Imageradiobutton(arg);
  try{
    e._group = this;
    this.items.push(e);
    this.layout();
    if(this.items.length == 1)this.setItemIndex(0);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup._onchange = function(e){
  for(var i=0;i<this.items.length;i++)
    if(this.items[i] == e) this.setItemIndex(i); // to fire off onchange
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup.setItemIndex = function(i){
  if(this.itemIndex == i)return;
  if(i >= this.items.length)return;
  this.items[i].setState("checked");
  this.items[i].setFocus();
  this.itemIndex = i;
  if(this.onchange)this.onchange(this.itemIndex);
  this.setValue(i);
};
//------------------------------------------------------------------------------
domapi.comps.imageradiogroup.setEnabled = function(b){
  for(var i=0;i<this.items.length;i++)
    this.items[i].setEnabled(b);
  this.enabled = b;
  domapi.css.addClass(this, "DA_IMAGERADIOBUTTON_DISABLED", !b);
  this._draw();this.disabled = !b;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.imageradiogroup.doclick = function(E){
  var e = domapi.findTarget(E,"IMAGERADIOGROUP");
  try{
    if(!e || !e.enabled)return;
    if(e.focus)e.focus();
    if(domapi.isGecko)e._editBox.focus(); // workaround for moz focus/keystroke failings
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.imageradiogroup.dokeydown = function(E){
  var k = domapi.isIE?event.keyCode:E.which;
  var e = domapi.findTarget(E,"IMAGERADIOGROUP");
  try{
    if(k == 38 && e.itemIndex>0){  // UP
      e.setItemIndex(e.itemIndex-1);
    }
    if(k == 40 && e.itemIndex<e.items.length-1){// DOWN
      e.setItemIndex(e.itemIndex+1);
    }
    if(E && E.preventDefault)E.preventDefault();
    return false;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
