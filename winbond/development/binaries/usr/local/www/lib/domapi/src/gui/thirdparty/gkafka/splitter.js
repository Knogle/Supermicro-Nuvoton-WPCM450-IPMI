//==============================================
// DomAPI Splitter Component
// G. Kafka 13.6.2003
//==============================================

domapi.registerComponent("splitter");
domapi.loadUnit("drag");
domapi.loadUnit("reflow");
//------------------------------------------------------------------------------
domapi.Splitter = function(arg){
  var e  = domapi.Component(arg,"splitter");
  try{
    e.type = domapi.rVal(arg["splitterType"],"h");
    e.minX = domapi.rInt(arg["minX"]);
    e.maxX = domapi.rInt(arg["maxX"],10000);
    e.minY = domapi.rInt(arg["minY"]);
    e.maxY = domapi.rInt(arg["maxY"],10000);
    e.dep = {
      move      : {left:[],right:[],up:[],down:[]},
      grow      : {left:[],right:[],up:[],down:[]},
      preventor : {obj:[],lbl:[],mode:[]}
    };
  
    if(e.type == "h"){
      e.setW(domapi.rInt(arg["w"],10));
      e.setH(arg["h"]);
      e.turnOnDrag(null,domapi.drag.dtCustom,0,e.startD,e.boundH,e.endD);
      e.style.cursor =  domapi.cursors.vertBeam;
    }
    if(e.type == "v"){
      e.setH(domapi.rInt(arg["h"],10));
      e.setW(arg["w"]);
      e.turnOnDrag(null,domapi.drag.dtCustom,0,e.startD,e.boundV,e.endD);
      e.style.cursor =  domapi.cursors.horzBeam;
    }
    domapi._finalizeComp(e);
    e.gMgr = (e.parent && e.parent.packer)?"packer":"reflow";
    if (e.gMgr == "reflow") 
    e.reflowAdd({l:e.getX(),t:e.getY(),w:e.getW(),h:e.getH()});
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitter._free = function(){
  if(this.reflow){
    this.reflow.elm    = null;
    this.reflow._elms  = null;
    this.reflow.parent = null;
    this.reflow.opt    = null;
    this.reflow        = null;
  }
  this.onreflow = null;
  this.dep      = null;
  this.elm = null;
};
//------------------------------------------------------------------------------
domapi.comps.splitter._draw = function(){
  this.splitterDraw();
};
//------------------------------------------------------------------------------
domapi.comps.splitter.splitterDraw = function(){
  this.styleIt("up");
};
//------------------------------------------------------------------------------
domapi.comps.splitter._layout = function(w,h){
};
//------------------------------------------------------------------------------
domapi.comps.splitter.startD = function(){
  var e = this.elm;
  e.bx = e.getX();
  e.by = e.getY();

  if (this.elm.ondragstart) this.elm.ondragstart(); // added - S. Joanou

  if(this.elm.doDepress)this.elm.styleIt("down");
  var l = this.elm.dep.preventor.obj;
  for(var i=0; i < l.length; i++)
  {
    if(!this.elm.dep.preventor.lbl[i])
    {
      var o = domapi.Elm({x:l[i].getX(),y:l[i].getY(),w:l[i].getW(),h:l[i].getH()});
      this.elm.dep.preventor.lbl[i] = o;
      this.elm.dependent({splitterType:this.elm.dep.preventor.mode[i],obj:o});
    }
    else
      this.elm.dep.preventor.lbl[i].bringToFront();
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitter.endD = function(){
  if(this.elm.doDepress)this.elm.styleIt("up");
  var l = this.elm.dep.preventor.lbl;
  for(var i=0; i < l.length; i++)
    l[i].sendToBack();

  if(this.elm.reflow)
    this.elm.reflow.restore() ;

  if(this.elm.gMgr == "packer"){
  //modify origW and origH for next rendering calculation
  if (this.elm.type=="h"){
    aelm = this.elm.dep.grow.left;
    for(i=0;i<aelm.length;i++)
      if (aelm[i].packer) aelm[i].packer.origW = aelm[i].getW();
  }
  if (this.elm.type=="v"){
    aelm = this.elm.dep.grow.up;
    for(i=0;i<aelm.length;i++)
      if (aelm[i].packer) aelm[i].packer.origH = aelm[i].getH();
  }
  domapi.packer.render(this.elm.parent);
}

  if (this.elm.ondragend) this.elm.ondragend(); // added - S. Joanou

  domapi.dragObj.elm = null ;
  //domapi.reflow.render() ;
};
//------------------------------------------------------------------------------
domapi.comps.splitter.styleIt = function(state){
  var t = domapi.theme;
  var b = t.border.width;
  if(!this.doBorder)b = 0;
  var d = t.border.shadow + " ";
  var h = t.border.highlight + " ";
  this.style.borderStyle = t.border.solid;
  this.setBgColor(t.fonts.buttonface.bgcolor);
  this.setB(b);
  if(state == "up")
    this.style.borderColor = h+d+d+h;
  if(state == "down")
    this.style.borderColor = d+h+h+d;
};
//------------------------------------------------------------------------------
domapi.comps.splitter.dependent = function(arg){
  var obj  = arg["obj"];
  var type = arg["splitterType"];

  if(!obj.reflow)
    obj.reflowAdd({l:obj.getX(),t:obj.getY(),w:obj.getW(),h:obj.getH()});

  if(arg["hasIframe"])
  {
    this.dep.preventor.obj.push( obj);
    this.dep.preventor.mode.push(type);
  }
  obj["minX"] = arg["minX"] ? arg["minX"] : obj["minX"] ? obj["minX"] : 10;
  obj["maxX"] = arg["maxX"] ? arg["maxX"] : obj["maxX"] ? obj["maxX"] : 10000;

  obj["minY"] = arg["minY"] ? arg["minY"] : obj["minY"] ? obj["minY"] : 10;
  obj["maxY"] = arg["maxY"] ? arg["maxY"] : obj["maxY"] ? obj["maxY"] : 10000;

  obj["minW"] = arg["minW"] ? arg["minW"] : obj["minW"] ? obj["minW"] : 10;
  obj["minH"] = arg["minH"] ? arg["minH"] : obj["minH"] ? obj["minH"] : 10;

  if(type == "move")
  {
    if(this["type"] == "h")
    {
      if(obj.getX() < this.getX())
      {
        var distX = this.getX() - (obj.getX()+obj.getW());
        this.dep.move.left.push(obj);
        var r = obj.reflow;
        r.moveLeft = this;
        r.padR = distX - this.reflow.padL;
        r.R = function(){return this.moveLeft.getX() ;};
        r.W = obj.getW() + distX;
        r.X = null ;
      }
      if(obj.getX() >= this.getX())
      {
        var distX = obj.getX() - this.getX();
        this.dep.move.right.push(obj);
        var r = obj.reflow;
        r.moveRight = this;
        r.padL = distX + this.reflow.padR;
        r.X = function(){return this.moveRight.getX() ;};
        r.W = obj.getW() + distX;
        r.R = null ;
      }
    }

    if(this["type"] == "v")
    {
      if(obj.getY() < this.getY())
      {
        var distY = this.getY() - (obj.getY()+obj.getH());
        this.dep.move.up.push(obj);
        var r = obj.reflow ;
        r.moveUp = this ;
        r.padB = distY - this.reflow.padT ;
        r.B = function(){return this.moveUp.getY() ;};
        r.H = obj.getH() + distY  ; 
        r.Y = null ;
      }
      if(obj.getY() >= this.getY())
      {
        var distY = obj.getY() - this.getY() ;
        this.dep.move.down.push(obj);
        var r = obj.reflow ;
        r.moveDown = this ;
        r.padT = distY + this.reflow.padT ;
        r.Y = function(){return this.moveDown.getY() ;};
        r.H = obj.getH() + distY  ; 
        r.B = null ;
      }
    }
  }
  
  if(type == "grow")
  {
    if(this["type"] == "h")
    {
      if(obj.getX() < this.getX())
      {
        var distX = this.getX() - (obj.getX()+obj.getW());
        this.dep.grow.left.push(obj);
        this["minX"] = this["minX"] < (obj.getX()+obj["minW"]+distX) ? (obj.getX()+obj["minW"]+distX) : this["minX"];

        var r = obj.reflow ;
        r.growLeft = this ;
    //    r.padR = distX - this.reflow.padL ; // dont know the sense of this anymore
        r.padR = distX ;           // this seems to be much better
        r.R = function(){return r.padL + r.growLeft.getX() ;}; // summed r.padL to the getX-function of splitter
        r.W = null ;
      }

      if(obj.getX() >= this.getX())
      {
        var distX = obj.getX() - this.getX();
        this.dep.grow.right.push(obj);
        this["maxX"] = this["maxX"] > (obj.getX()+obj.getW()-obj["minW"]-distX) ? (obj.getX()+obj.getW()-obj["minW"]-distX) : this["maxX"];

        var r = obj.reflow ;
        r.growRight = this ;
      //  r.padL = distX + this.reflow.padR ;
        r.padL = distX ; 
        r.X = function(){return this.growRight.getX() ;};

        if(!r.R){ // W must be defined
          var ppos = domapi.reflow.getPpos(r.parent);
          if(r.W != parseInt(r.W,10)){ // W is percentual
//            r.R = (((r.getX(ppos) + r.getW(r.getX(ppos),ppos)+ r.padR + r.padL + this.reflow.padR) / ppos.W)*100) + "%" ;
            r.R = (((obj.getX()+obj.getW()+r.padL+r.padR)/ ppos.W)*100) + "%" ;
          }else{
            r.R = obj.getX() + obj.getW() + r.padL + r.padR ;
          }
        }
        r.W = null ;

      }
    }

    if(this["type"] == "v")
    {
      if(obj.getY() < this.getY())
      {
        var distY = this.getY() - (obj.getY()+obj.getH());
        this.dep.grow.up.push(obj);
        this["minY"] = this["minY"] < (obj.getY()+obj["minH"]+distY) ? (obj.getY()+obj["minH"]+distY) : this["minY"];

        var r = obj.reflow ;
        r.growUp = this ;
        r.padB = distY ; //- this.reflow.padT ;
        r.B = function(){return r.padT + this.growUp.getY();};
        r.H = null ;
      }

      if(obj.getY() >= this.getY())
      {
        var distY = obj.getY() - this.getY();
        this.dep.grow.down.push(obj);
        this["maxY"] = this["maxY"] > (obj.getY()+obj.getH()-obj["minH"]-distY) ? (obj.getY()+obj.getH()-obj["minH"]-distY) : this["maxY"];
  
        var r = obj.reflow ;
        r.growDown = this ;
        r.padT = distY ; //+ this.reflow.padB ;
        r.Y = function(){return this.growDown.getY();};

        if(!r.B){
          var ppos = domapi.reflow.getPpos(r.parent);
          if(r.H != parseInt(r.H,10)){ // H is percentual
//            r.B = (((r.getY(ppos) + r.getH(r.getY(ppos),ppos)+ r.padB + r.padT + this.reflow.padB) / ppos.H)*100) + "%" ;
            r.B = (((obj.getY() + obj.getH()+ r.padB + r.padT ) / ppos.H)*100) + "%" ;
          }else{
            r.B = obj.getY() + obj.getH() + r.padT + r.padB ;
          }
        }
        r.H = null ;
      }
    }
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitter.boundH = function(x,y,dX,dY){
  var e = this.elm;
  var x = x < e.minX ? e.minX : x;
  x = x > e.maxX ? e.maxX : x;
  e.moveTo(x,this.elm.by);

  // Handle Moving Objects
  var l = e.dep.move.left;
  for(var i=0; i < l.length; i++){
      domapi.reflow.render(l[i].reflow.parent) ;
  }

  var l = e.dep.move.right;
  for(var i=0; i < l.length; i++)
  {
   domapi.reflow.render(l[i].reflow.parent) ;
  }

  // Handle Growing Objects
  var l = e.dep.grow.left;
  for(var i=0; i < l.length; i++){
      domapi.reflow.render(l[i].reflow.parent) ;
  }

  var l = e.dep.grow.right;
  for(var i=0; i < l.length; i++){
     domapi.reflow.render(l[i].reflow.parent) ;
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitter.boundV = function(x,y,dX,dY){
  var e = this.elm;
  var y = y < e.minY ? e.minY : y;
  y = y > e.maxY ? e.maxY : y;
  e.moveTo(e.bx,y,true);
  // Handle Moving Objects
  var l = e.dep.move.up;
  for(var i=0; i < l.length; i++){
     domapi.reflow.render(l[i].reflow.parent) ;
  }

  var l = e.dep.move.down;
  for(var i=0; i < l.length; i++){
     domapi.reflow.render(l[i].reflow.parent) ;
  }

  // Handle Growing Objects
  var l = e.dep.grow.up;
  for(var i=0; i < l.length; i++){
     domapi.reflow.render(l[i].reflow.parent) ;
  }

  var l = e.dep.grow.down;
  for(var i=0; i < l.length; i++){
     domapi.reflow.render(l[i].reflow.parent) ;
  }
};
//------------------------------------------------------------------------------