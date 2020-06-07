//------------------------------------------------------------------------------
// DomAPI Arrow Scrollbox Component
// P. Fricard
//------------------------------------------------------------------------------
domapi.loadUnit("scrollbutton");
domapi.registerComponent("arrowscrollbox");
//------------------------------------------------------------------------------
domapi.ArrowScrollBox = function(arg){return domapi.comps.arrowscrollbox.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.arrowscrollbox.constructor = function(arg){
  arg["doBorder"] = domapi.rBool(arg["doBorder"],true);
  arg["align"]=domapi.rVal(arg["align"],"center");
  var e = domapi.Component(arg,"arrowscrollbox");
  try{
    e.style.overflow  = "hidden";
    e.arrowup = domapi.Scrollbutton({parent:e,y:0,x:0,direction:"top",doBorder:arg["doBorder"],doOnOver:true});
    e.arrowup.setZ(10);
    e.arrowup.hide();
    e.content = domapi.Elm({parent:e,y:0,x:0,align:arg["align"]});
    e.content.setZ(5);
    e.arrowdown = domapi.Scrollbutton({parent:e,y:0,x:0,direction:"bottom",doBorder:arg["doBorder"],control:e.content,doOnOver:true});
    e.arrowdown.setZ(10);
    e.arrowdown.hide();
    e.arrowup.setControl(e.content);
    e.appendChild = domapi._private.arrowscrollbox.appendChild;
    domapi._finalizeComp(e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.arrowscrollbox.appendChild=function(n){
  this.content.appendChild(n);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.arrowscrollbox._free = function(){
  this.arrowup   = null;
  this.content   = null;
  this.arrowdown = null;
};
//------------------------------------------------------------------------------
domapi.comps.arrowscrollbox._draw = function(){this.arrowscrollboxDraw()};
//------------------------------------------------------------------------------
domapi.comps.arrowscrollbox._layout = function(w,h){
  var e = this;
  var t  = domapi.theme;
  var scrollbuttonHeight = e.arrowup.getH();
  var b  = e.doBorder?t.border.width:0;
  var c = e.content;

  if  (h < c.scrollHeight){
  e.arrowup.show();
  e.arrowdown.show();
  
  c.setH(h-2*scrollbuttonHeight-2*b);
  c.setW(w-(4*b));
  c.setY(scrollbuttonHeight+b);
  
  e.arrowup.setW(w-(4*b));
  e.arrowdown.setW(w-(4*b));
  
  e.arrowup.setY(0);
  e.arrowdown.setY(h-scrollbuttonHeight-2*b);
  
  e.arrowup.setEnabled(c.scrollTop>0);
  e.arrowdown.setEnabled((c.scrollTop+c.getH())<c.scrollHeight);
  
  }else{
  e.arrowup.hide();
  e.arrowdown.hide();

  c.setY(0);
  c.setH(h-(2*b));
  }
  c.scrollTop = 0;
  e = null;t = null;c = null;
};
//------------------------------------------------------------------------------
domapi.comps.arrowscrollbox.arrowscrollboxDraw = function(){
  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  var b                = this.doBorder?parseInt(t.border.width):0;
  this.setB(b); 
  s.borderStyle        = this.doBorder?t.border.solid:"none";
  s.borderColor        = t.border.getInset();
  s.cursor             = "default";
  this.arrowup.doBorder=this.doBorder;this.arrowup.draw();
  this.arrowdown.doBorder=this.doBorder;this.arrowdown.draw();
  t = null;f = null;s = null;
};
//------------------------------------------------------------------------------