// Submitted by:
// Patrice Fricard <pfricard@wanadoo.fr>
// 09/04 Added border calculation during rendering
// 09/04 Added layout call after resize during rendering
// 09/04 Added a 'pos' argument to indicate rendering order
//extend domapi API
domapi.packer = new Object();
domapi.packer._elms = [];

var alNone   = 0;
var alTop    = 1;
var alRight  = 2;
var alBottom = 3;
var alLeft   = 4;
var alClient = 5;
//--------------------------------------------------------------------------------
domapi.packer._free = function(){
  this._elms = [];
  this._elms = null;
};
//--------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
//need to extends core, as it can act as a parent and needs to emulate an elm
domapi.getX = function() { return 0};
domapi.getY = function() { return 0};
domapi.getW = domapi.bodyWidth;
domapi.getH = domapi.bodyHeight;
domapi.getB = function() { var a = new Array(0,0,0,0);return a};
//--------------------------------------------------------------------------------
// domapi.packer.on
// -Turns packer on and add resize Event
//--------------------------------------------------------------------------------
domapi.packer.on = function(){
  domapi.addEvent(window,"resize",this._windowResized,true);
  domapi.packerStatus = true;
};
//--------------------------------------------------------------------------------
// domapi.packer.off
// -Turns packer off and removes all events
//--------------------------------------------------------------------------------
domapi.packer.off = function(){
  domapi.removeEvent(window,"resize",this._windowResized,true);
  domapi.packerStatus = false;
};

//------------------------------------------------------------------------------
// Calculate position for each element
//------------------------------------------------------------------------------
domapi.packer.render = function(p){
  if(!p) p = domapi;
  var e, opt;
  var elms = p.packer._elms;
  try{
    p.packer.X = p.getX();
    p.packer.Y = p.getY();
  
    var bdrs = p.getB();
    p.packer.W = p.getW()-bdrs[1]-bdrs[3];
    p.packer.H = p.getH()-bdrs[0]-bdrs[2];
  
    //------------------------------------------------------------------------------
    // scan all managed elm to figure out the total amount of space needed.
    //------------------------------------------------------------------------------
    var width = maxWidth = mw =  0;
    var height = maxHeight = mh =  0;
    
    for(var a=0;a<elms.length;a++) {
      e = elms[a];
      if (e.style.display != "none"){
      opt = e.packer.opt;
      if (opt.side == "top" || opt.side  == "bottom"){
        tmp = e.packer.origW + (2*opt.padX) + (2*opt.ipadX)+opt.padLeft+opt.padRight+width;
        maxWidth = tmp > maxWidth?tmp:maxWidth;
        height += e.packer.origH + (2*opt.padY) + (2*opt.ipadY)+opt.padTop+opt.padBottom;
      } else {
        tmp = e.packer.origH + (2*opt.padY) + (2*opt.ipadY) + height+opt.padTop+opt.padBottom;
        maxHeight = tmp > maxHeight?tmp:maxHeight;
        width += e.packer.origW + (2*opt.padX) + (2*opt.ipadX)+opt.padLeft+opt.padRight;
      }
      }
    }
  
    maxWidth = width > maxWidth?width:maxWidth;
    maxHeight = height > maxHeight?height:maxHeight;
  
    //------------------------------------------------------------------------------
    // scan all managed elm to set size.
    //------------------------------------------------------------------------------
    
    var cavX = x = 0;
    var cavY = y = 0;
    var cavW = p.packer.W > maxWidth?p.packer.W:maxWidth;
    var cavH = p.packer.H > maxHeight?p.packer.H:maxHeight;
    var robj = {width:cavW,height:cavH};
  
    var pOpt =p.packer.opt;
    if(pOpt) {
      if(pOpt.marginTop) {cavY = Y = pOpt.marginTop;}
      if(pOpt.marginBottom) {cavH = cavH - pOpt.marginBottom;}
    }
    
    for(var a=0;a<elms.length  ;a++) {
        
      e = elms[a];
        if( e.style.display!= "none"){
      opt = e.packer.opt;
      if (opt.side == "top" || opt.side  == "bottom"){
         frameW = cavW;
    
         frameH = e.packer.origH + (2*opt.padY) + (2*opt.ipadY)+opt.padTop+opt.padBottom;
         if (opt.expand || opt.expand == "yes"){
              //YExpansion
            frameH += domapi.packer.yexpansion(elms,a,cavH);
         }
      
         cavH -= frameH;
         
         if (cavH < 0) {
             frameH += cavH;
            cavH =0;
         }
         frameX = cavX;
         if (opt.side == "top"){
             frameY = cavY;
            cavY += frameH;
         } else {
            frameY = cavY + cavH;
         }
      } else {
        frameH = cavH;
        frameW = e.packer.origW + (2*opt.padX) + (2*opt.ipadX)+opt.padLeft+opt.padRight;
         if (opt.expand || opt.expand == "yes"){
            //XExpansion call
           frameW += domapi.packer.xexpansion(elms,a,cavW);
         }
         cavW -= frameW;
         if (cavW < 0) {
             frameW += cavW;
            cavW =0;
         }
         frameY = cavY;
         if (opt.side == "left"){
             frameX = cavX;
            cavX += frameW;
         } else {
            frameX = cavX + cavW;
         }
      }
    
    width=e.packer.origW + (2*opt.ipadX);
    if ((opt.fill=="x") || (opt.fill=="both") || (width == frameW))  width = frameW - (2*opt.padX)-opt.padLeft-opt.padRight-opt.ipadX;
    height=e.packer.origH + (2*opt.ipadY);
    
    if ((opt.fill=="y") || (opt.fill=="both") || (height == frameH))  height = frameH - (2*opt.padY)-opt.padTop-opt.padBottom-opt.ipadY;
    
      //manage anchor to move elm in the good position inside allocated frame
      if (!opt.anchor) opt.anchor = "center";
      var gpadx =  (2*opt.padX)+opt.padLeft +opt.padRight;
      var gpady =  (2*opt.padY)+opt.padTop +opt.padBottom;
    
      switch(opt.anchor){
      case "n":
        x=frameX + (frameW - width)/2;
        y= frameY + opt.padY + opt.padTop;
        break;
      case "ne":
        x=frameX + frameW - width - gpadx;
        y= frameY + opt.padY + opt.padTop;
        break;
      case "e":
        x=frameX + frameW - width - gpadx;
        y= frameY + ( frameH - height)/2;
        break;
      case "se":
        x=frameX + frameW - width - gpadx;
        y= frameY + frameH - height - gpady;
        break;
      case "s":
        x=frameX + (frameW - width)/2;
        y= frameY+ frameH - height - gpady;
        break;
      case "sw":
        x=frameX + opt.padX+opt.padLeft;
        y= frameY+ frameH - height - gpady;
        break;
      case "w":
        x=frameX + opt.padX+opt.padLeft;
        y= frameY + ( frameH - height)/2;
        break;
      case "nw":
        x=frameX+ opt.padX+opt.padLeft;
        y= frameY+ opt.padY+opt.padTop;
        break;
      case "center":
      default:
    
        x = frameX + ( frameW - width  - gpadx)/2+opt.padLeft+opt.padX;
        y = frameY + ( frameH - height - gpady)/2 +opt.padTop+opt.padY;
      }
      e.moveTo(x,y);
      e.setSize(width,height);
    }
    }
  
  
  
    //propagate rezizing to "sub" packers
    for(var a = 0 ; a<elms.length;a++){
     e = elms[a];
     if(e.style.display!='none')
      if (e.packerChildren)  domapi.packer.render(e);
    }
  
    return robj;
  }finally{
    e    = null;
    elms = null;
    opt  = null;
    robj = null;
    pOpt = null;
  }
};

//--------------------------------------------------------------------------------
// domapi.packer.xexpansion - domapi.packer.yexpansion
// manage expand capabilities
//--------------------------------------------------------------------------------
domapi.packer.xexpansion = function(elms,i,cavW){
  var minExp = cavW;
  var numExpX = 0;
  var childW, curExp, e, opt;
  try{
    for(var a=i;a<elms.length;a++){
      e = elms[a];
      if(e.style.display!='none'){
        opt = e.packer.opt;
        childW = e.packer.origW + (2*opt.padX) + (2*opt.ipadX)+opt.padLeft+opt.padRight;
        if (opt.side == "top" || opt.side == "bottom") {
          curExp = numExpX == 0 ?cavW:(cavW - childW)/numExpX;
          minExp = curExp < minExp?curExp:minExp;
        }else{
          cavW -= childW;
          numExpX = (opt.expand || opt.expand == "yes")? opt.xweight + numExpX:numExpX;
        }
      }
    }
  
    curExp = (cavW / numExpX)*elms[i].packer.opt.xweight;
    minExp = curExp < minExp?curExp:minExp;
    return minExp<0?0:minExp;
  }finally{
    e = null; opt = null;
  }
};

//--------------------------------------------------------------------------------
domapi.packer.yexpansion = function(elms,i,cavH,debug){
  var minExp = cavH;
  var numExp = 0;
  var childH, curExp, e, opt;
  try{
    for(var a=i;a<elms.length && elms[a].style.display!='none';a++){
      e = elms[a];
      if(e.style.display!='none'){
        opt = e.packer.opt; 
        childH = e.packer.origH + (2*opt.padY) + (2*opt.ipadY)+opt.padTop+opt.padBottom;
        if (opt.side == "left" || opt.side == "right") {
          curExp = numExp == 0 ?cavH:(cavH - childH)/numExp;
          minExp = curExp < minExp?curExp:minExp;
        }else{
          cavH -= childH;
          numExp = (opt.expand || opt.expand == "yes")?opt.yweight +numExp:numExp;
        }
      }
    }
    curExp = (cavH / numExp)*elms[i].packer.opt.yweight;
    minExp = curExp < minExp?curExp:minExp;
    yexp = minExp<0?0:minExp;
    return yexp;
  }finally{
    e = null; opt = null;
  }
};

//--------------------------------------------------------------------------------
// domapi.elmProto.packerOn
// -Initialises an elm for packer, and attaches it to the parent which is a window or another elm
//--------------------------------------------------------------------------------
domapi.elmProto.packerOn = function(opt) {
  this.packerStatus = true;
  var elms;
  var p = this.parentNode;
  try{
    if(p.tagName == "BODY")p = domapi;
    if (!p.packer)p.packer = new Object();
    if (!p.packer._elms) p.packer._elms = [];
    p.packerChildren = true;
    if (!opt) opt = new Object();
    if (!opt.side) opt.side="top";
    if (!opt.fill) opt.fill="none";
    if (!opt.padX) opt.padX=0;
    if (!opt.padY) opt.padY=0;
    if (!opt.ipadX) opt.ipadX=0;
    if (!opt.ipadY) opt.ipadY=0;
    if (!opt.padTop) opt.padTop=0;
    if (!opt.padLeft) opt.padLeft=0;
    if (!opt.padBottom) opt.padBottom=0;
    if (!opt.padRight) opt.padRight=0;
    if (!opt.xweight) opt.xweight=1;
    if (!opt.yweight) opt.yweight=1;
    if (opt.xweight < 1) opt.xweight=1;
    if (opt.yweight < 1) opt.yweight=1;
    opt.pos = domapi.rInt(opt.pos,-1);
  
    if(!this.packer){this.packer = new Object();
    var r = this.packer;
    r.X = this.getX();
    r.Y = this.getY();
    r.W = this.getW();
    r.H = this.getH();
    r.origX = r.X;
    r.origY = r.Y;
    r.origW = this.getW();
    r.origH = this.getH();
    r.parent = p;
  
    //option
    r.opt = opt;
    
    //add it in the elms of packer at the end if no position have been specified
    if(opt.pos>=0){p.packer._elms.insert(opt.pos,this);}  
    else {opt.pos = p.packer._elms.length; p.packer._elms[p.packer._elms.length] = this;}
    }else{
      var cr = this.packer;
      if (cr.opt){
      if(cr.opt.pos != opt.pos){
      elms =p.packer._elms; 
      elms.deleteItem(cr.opt.pos);
      elms.insert(opt.pos,this);
      for(i=0;i<elms.length;i++)
        elms[i].packer.opt.pos = i;  
      }
      cr.opt = null;
      cr.opt = opt;
      }
      
    }
  }finally{
    p = null; r = null; cr = null; elms = null;
  }  
};

domapi.elmProto.packerOff= function(){
  if(!this.packerStatus) return;
  this.packerStatus = false;
  var p = this.parentNode;
  try{
    if(p.tagName == "BODY")p = domapi;
    p.packer._elms.deleteItem(this.packer.opt.pos);
    var r = this.packer;
    this.setW(r.origW);
    this.setX(r.origX);
    this.setY(r.origY);
    this.setH(r.origH);
  }finally{
    p = null; r = null;
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.setAlign = function(a){
  switch(a){
    case alTop :
      this.packerOn({side:"top",fill:"x"});
      break;
    case alRight :
      this.packerOn({side:"right", expand:"yes", fill:"y"});
      break;
    case alBottom :
      this.packerOn({side:"bottom", expand:"yes", fill:"x"});
      break;
    case alLeft :
      this.packerOn({side:"left", expand:"yes", fill:"y"});
      break;
    case alClient :
      this.packerOn({side:"top", expand:"yes", fill:"both", anchor:"center"});
      break;
    case alNone :
      this.packerOff();
      break;
  }
};
//------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
// domapi.elmProto.windowResized
// -The event that is called when the window is resized - resizes attached elms
//--------------------------------------------------------------------------------
domapi.packer._windowResized = function(){
  var elms=domapi.packer._elms;
  domapi.packer.render();
};

//--------------------------------------------------------------------------------
// initialises elms to packer off and turns on packer for the app by default
//--------------------------------------------------------------------------------
domapi.elmProto.packerStatus = false;
domapi.elmProto.packerChildren = false;
domapi.packer.on();