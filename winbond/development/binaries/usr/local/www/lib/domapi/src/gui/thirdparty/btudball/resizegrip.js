//==============================================
// DomAPI Resizegrip Component
// (c) Ben Tudball - 28 October 2002
//==============================================

domapi.loadUnit(         "label");
domapi.loadUnit(         "drag" );
domapi.registerComponent("resizegrip");
domapi.Theme.prototype.preloadImages.resizegrip();
//------------------------------------------------------------------------------
domapi.Resizegrip = function(arg){return domapi.comps.resizegrip.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.resizegrip.constructor = function(arg){
  domapi.Theme.prototype.preDefaults.resizegrip(arg);
  var e = domapi.Label(arg);
  try{
    domapi._inherit(e,"resizegrip");
    e.DA_TYPE = "RESIZEGRIP";  
    var img           = domapi.theme.skin.resizegrip;
    var text          = '<img src="'+img+
                        '" width="' +arg.imgW+
                        '" height="'+arg.imgH+
                        '" border="0" />';
    e.setText(          text);
    e.setVerticalAlign( "top");
    e.setTextAlign(     "left");
    
    var p = e.parentNode;  // parent value required, parent MUST be an Elm
    e.setX(             p.getW()-e.getW()-e.margin);
    e.setY(             p.getH()-e.getH()-e.margin);  
    e.maxW            = arg.maxW;
    e.maxH            = arg.maxH;
    e.fStart          = arg.fStart;
    e.fMove           = arg.fMove;
    e.fEnd            = arg.fEnd;
    e.setPosition(      "absolute");
    e.on();
  
    return e;
  }finally{
    e = null; p = null; img = null; text = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.resizegrip._free = function(){
  this.cell = null;
};
//------------------------------------------------------------------------------
domapi.comps.resizegrip._draw = function(){this.resizegripDraw()};
//------------------------------------------------------------------------------
domapi.comps.resizegrip.resizegripDraw = function(){};
//------------------------------------------------------------------------------
domapi.comps.resizegrip.onmouseover = function(){if(this.enabled)this.cell.style.cursor="se-resize"};
//------------------------------------------------------------------------------
domapi.comps.resizegrip.onmouseout = function(){this.cell.style.cursor="default"};
//------------------------------------------------------------------------------
domapi.comps.resizegrip.on = function(){
  var p = domapi._private.resizegrip;
  if(this.enabled){
    this.turnOnDrag(this,null,0,p._dragStart,p._dragMove,p._dragEnd);
    if(this.fMove){
      if(typeof this.fMove == "function")this.fMove(this);
      else eval(this.fMove);
    }
  }
};
//------------------------------------------------------------------------------
domapi.comps.resizegrip.off = function(){this.turnOffDrag()};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.resizegrip._dragStart = function(e){
  var d  = domapi.dragObj.elm;
  var ds = d.parentNode;
  try{
    if (d.enabled){
      d.startW  = ds.getW();  // set initial size values
      d.startH  = ds.getH();
      if(d.fStart){
        if(typeof d.fStart == "function")d.fStart(d);
        else eval(d.fStart);
      }
    }
  }finally{
    d = null; ds = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.resizegrip._dragMove = function(x,y,dX,dY){
  var d  = domapi.dragObj.elm;
  try{
    if(d.DA_TYPE != "RESIZEGRIP")return;
    var ds = d.parentNode;
    if (d.enabled){
      ds.setSize(d.startW+dX,d.startH+dY);
      if (ds.getW()<d.minW && ds.getW()>-d.minW)ds.setW(d.minW);  // detect constraints including negative
      if (ds.getH()<d.minH && ds.getH()>-d.minH)ds.setH(d.minH);
      if (ds.getW()>d.maxW)ds.setW(d.maxW);
      if (ds.getH()>d.maxH)ds.setH(d.maxH);
      d.moveTo(ds.getW()-d.getW()-d.margin,ds.getH()-d.getH()-d.margin);
      if(d.fMove){
        if(typeof d.fMove == "function")d.fMove(d);
        else eval(d.fMove);
      }
    }
  }finally{
    d = null; ds = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.resizegrip._dragEnd = function(e){
  var d  = domapi.dragObj.elm;
  try{
    if (d.enabled){
      if(d.fEnd){
        if(typeof d.fEnd == "function")d.fEnd(d);
        else eval(d.fEnd);
      }
    }
  }finally{
    d = null;
  }
};
//------------------------------------------------------------------------------
