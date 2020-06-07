//==============================================
// DomAPI Imagecheckbox Component
// D. Kadrioski 3/16/2004
// (c) Nebiru Software 2001,2005
//==============================================

domapi.registerComponent("imagecheckbox");
//------------------------------------------------------------------------------
domapi.Imagecheckbox = function(arg){return domapi.comps.imagecheckbox.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox.constructor = function(arg){
  var e = domapi.Component(arg,"imagecheckbox");
  try{
    e.image = domapi.Elm({parent:e, type:"IMG", w:arg["imgW"], h:arg["imgH"]});
    e.text  = domapi.Elm({parent:e, type:"SPAN"});
    e.text.innerHTML = arg.text;
    e.text.className = "DA_IMAGERADIOBUTTON_CAPTION";
    e.style.cursor   = "default";
    var p = domapi._private.imagecheckbox;
    domapi.addEvent(e,"mouseup", p.domouseup);
    e.image.setAttribute("border", "0");
    e.image.src              = domapi.theme.skin.shim.src;
    e.image.style.background = 'url("' + domapi.theme.skin.checkbox.src + '") 0 0 no-repeat';
    e.setState(e.checkedState);

    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox._free = function(){
  this.image = null;
  this.text  = null;
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox._draw = function(){
  this.imagecheckboxDraw();
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox.imagecheckboxDraw = function(){
  this.setBgColor(domapi.theme.fonts.buttonface.bgcolor);
  this.setState(this.checkedState);
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox.setState = function(s){
  this.checkedState = s;
  this.checked      = s == "checked";
  this.grayed       = s == "grayed";
  var i = 0;
  switch(s){
    case "cleared" : i = 0; break;
    case "grayed"  : i = 1; break;
    case "checked" : i = 2; break;
  }
  if(!this.enabled)i += 3;
  this._setIndex(i);

  this.setFormValue(this.checkedState);
  if(this.onchange)this.onchange();
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox._setIndex = function(i){
  i = domapi.rInt(i);
  if(i == this.index)return;
  if(this.orientation == "horizontal")
    this.image.style.backgroundPosition = (-(i) * this["imgW"]) + "px 0px";
  else
    this.image.style.backgroundPosition = "0px " + (-(i) * this["imgW"]) + "px";
  this.index = i;
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox.setAlign = function(v){
  this.align = v;
  switch(v){
    case "left"  : domapi.transferElm(this.text,  this); break;
    case "right" : domapi.transferElm(this.image, this); break
  }
  this.style.textAlign = v;
};
//------------------------------------------------------------------------------
domapi.comps.imagecheckbox.setEnabled = function(b){
  this.enabled = b;
  this._draw();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.imagecheckbox.domouseup = function(E){
  var e = domapi.findTarget(E,"IMAGECHECKBOX");
  try{
    if(!e || !e.enabled)return;
    switch(e.checkedState){
      case "checked" : e.setState("cleared");break;
      case "grayed"  : e.setState("cleared");break;
      case "cleared" : e.setState("checked");break;
    }
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
