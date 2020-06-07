//==============================================
// DomAPI Imageradiobutton Component
// D. Kadrioski 3/18/2004
// (c) Nebiru Software 2001,2004
//==============================================

domapi.registerComponent("imageradiobutton");
//------------------------------------------------------------------------------
domapi.Imageradiobutton = function(arg){return domapi.comps.imageradiobutton.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton.constructor = function(arg){
  if(!arg.w)arg.w = domapi.textWidth(arg.text) + 45;
  var e = domapi.Component(arg,"imageradiobutton");
  try{
    e.image = domapi.Elm({parent:e, type:"IMG", w:arg["imgW"], h:arg["imgH"]});
    e.text  = domapi.Elm({parent:e, type:"SPAN"});
    e.text.innerHTML = arg.text;
    e.text.className = "DA_IMAGERADIOBUTTON_CAPTION";
    e.style.cursor   = "default";
    var p = domapi._private.imageradiobutton;
    domapi.addEvent(e,"mouseup", p.domouseup);
    e.image.setAttribute("border", "0");
    e.image.src              = domapi.theme.skin.shim.src;
    e.image.style.background = 'url("' + domapi.theme.skin.radio.src + '") 0 0 no-repeat';
    e.setState(e.checkedState, true);
    e.ondafocus = p._ondafocus;
  
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton._free = function(force){
  this.image = null;
  this.text  = null;
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton._draw = function(force){
  this.imageradiobuttonDraw(force);
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton.imageradiobuttonDraw = function(force){
  this.setBgColor(domapi.theme.fonts.buttonface.bgcolor);
  this.setState(this.checkedState, force);
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton.setState = function(s, force){
  if(this.checkedState == s && !force)return;
  var changed = this.checkedState != s;
  this.checkedState = s;
  this.checked      = s == "checked";
  var i = 0;
  switch(s){
    case "cleared" : i = 0; break;
    case "checked" : i = 1; break;
  }
  if(!this.enabled)i += 2;
  this._setIndex(i);
  
  if(this.checked)try{
    // pop all other items in parent container
    var p = this.parentNode.childNodes;
    for(i=0;i<p.length;i++)
      if(p[i]["isImageradiobutton"] && p[i] != this)p[i].setState("cleared");
  }finally{
    p = null;
  }
  if(changed){
    if(this.onchange)this.onchange();
    if(this._group)this._group._onchange(this);    
  }
  this.setFormValue(this.checkedState);
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton._setIndex = function(i){
  i = domapi.rInt(i);
  if(i == this.index)return;
  if(this.orientation == "horizontal")
    this.image.style.backgroundPosition = (-(i) * this["imgW"]) + "px 0px";
  else
    this.image.style.backgroundPosition = "0px " + (-(i) * this["imgW"]) + "px";
  this.index = i;
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton.setAlign = function(v){
  this.align = v;
  switch(v){
    case "left"  : domapi.transferElm(this.text,  this); break;
    case "right" : domapi.transferElm(this.image, this); break
  }
  this.style.textAlign = v;
};
//------------------------------------------------------------------------------
domapi.comps.imageradiobutton.setEnabled = function(b){
  this.enabled = b;
  this.disabled = !b;
  domapi.css.addClass(this, "DA_IMAGERADIOBUTTON_DISABLED", !b);
  this._draw(true);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.imageradiobutton._ondafocus = function(){
  var e = domapi.findParent(this,"IMAGERADIOGROUP");
  try{
    if(!e)return;
    var i = domapi.getNodeIndex(this);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.imageradiobutton.domouseup = function(E){
  var e = domapi.findTarget(E,"IMAGERADIOBUTTON");
  try{
    if(!e || !e.enabled)return;
    switch(e.checkedState){
      //case "checked" : e.setState("cleared");break;
      case "cleared" : e.setState("checked");break;
    }
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
