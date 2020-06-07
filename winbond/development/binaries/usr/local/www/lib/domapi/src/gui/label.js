//==============================================
// DomAPI Label Component
// D. Kadrioski 5/7/2002
// (c) Nebiru Software 2001,2003
//==============================================

domapi.registerComponent("label");
domapi.Label = function(arg){return domapi.comps.label.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.label.constructor = function(arg){
  arg["type"] =  "TABLE";
  var e       =  domapi.Component(arg,"label");
  try{
    var t       =  document.createElement("TBODY");
    var r       =  document.createElement("TR");
    e.cell      =  document.createElement("TD");
    r.appendChild( e.cell);
    t.appendChild( r);
    e.appendChild( t);
    e.setAttribute("border"     ,"0");
    e.setAttribute("cellpadding","0");
    e.setAttribute("cellspacing","0");
  
    e.setText(e.text);
    e.setVerticalAlign( "top");  
  
    domapi._finalizeComp(e);
    return e;
  }finally{
    e = null; r = null; t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.label._free = function(){
  this.cell = null;
};
//------------------------------------------------------------------------------
domapi.comps.label._layout = function(w,h){
  var c = 0; // correction value, IE seems to ignore cellPadding
  if(domapi.isIE){
    c = domapi.isStrict?8:4;
  }
  this.cell.width  = w;
  this.cell.height = h - c;
};
//------------------------------------------------------------------------------
domapi.comps.label._draw = function(){
  this.labelDraw();
};
//------------------------------------------------------------------------------
domapi.comps.label.labelDraw = function(){
  //this.setBgColor(this.doBGFill?(this.parentNode&&this.parentNode.style?this.parentNode.style.backgroundColor:"transparent"):"transparent");
};
//------------------------------------------------------------------------------
domapi.comps.label.setW = function(w,cancelBubble){
  this._setW(w,cancelBubble);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.label.setH = function(h,cancelBubble){
  this._setH(h,cancelBubble);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.label.setText = function(s){
  this.text           = s;
  this.cell.innerHTML = s;
};
//------------------------------------------------------------------------------
domapi.comps.label.setTextAlign = function(s){
  this.cell.style.textAlign = s;
};
//------------------------------------------------------------------------------
domapi.comps.label.setVerticalAlign = function(s){
  this.cell.style.verticalAlign = s;
};
//------------------------------------------------------------------------------
domapi.comps.label.setBgColor = function(c){
  this.cell.style.backgroundColor = c;
  this.style.backgroundColor      = c;
};
//------------------------------------------------------------------------------
domapi.comps.label.setColor = function(c){
  this.cell.style.color = c;
  this.style.color      = c;
};
//------------------------------------------------------------------------------
domapi.comps.label._setEnabled = function(b){
  if(b)
    domapi.css.removeClass(this, "DA_LABEL_DISABLED");
  else
    domapi.css.addClass(this, "DA_LABEL_DISABLED");
};
//------------------------------------------------------------------------------