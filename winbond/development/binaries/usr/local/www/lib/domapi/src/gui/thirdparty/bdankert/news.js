//-----------
// News Thingy
// Robert Dankert (c) 2002
//
// Direction
//  1=down 2=downright 3=right 4=upright 5=up 6=upleft 7=left 8=downleft
//------------------------------------------------------------------------------
// Additional contributors:
// Alberto Otero García
//------------------------------------------------------------------------------

domapi.loadUnit(          "animate");
domapi.registerComponent( "news");
//------------------------------------------------------------------------------
domapi.News = function(arg){
  w              = domapi.rInt(arg["w"],200);
  h              = domapi.rInt(arg["h"],100);
  arg.w          = w;
  arg.h          = h;
  var e          = domapi.Component(arg,"news");
  try{
    e.obj1         = domapi.Elm({parent:e,x:0,y:0,w:w,h:h});
    e.obj2         = domapi.Elm({parent:e,x:0,y:0,w:w,h:h});
    e.style.cursor = "default";
    e.setOverflow(   "hidden");
   /* e.obj1.setP(     5);
    e.obj2.setP(     5);*/
    e.fromY        = -h;
    e.items        = [];
    e.itemIndex    = -1;
    e.pause        = 7000;
    e.timerH       = null;
    e.isRunning    = false;
    e.speed        = 20;
    e.steps        = 50;
    e.direct       = 1;
    e.fromX        = 0;
  
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.news._free = function(){
  this.obj1  = null;
  this.obj2  = null;
  this.items = [];
  this.items = null;
};
//------------------------------------------------------------------------------
domapi.comps.news._draw = function(){
  this.newsDraw();
};
//------------------------------------------------------------------------------
domapi.comps.news.newsDraw=function(){
  var t = domapi.theme;
  var s = this.style;
  try{
    var doBorder  = this.doBorder && !domapi.doSkin;
    var b         = doBorder?parseInt(t.border.width):0;
    this.setB(      b);
    s.borderStyle = this.doBorder?t.border.solid:"none";
    s.font        = t.fonts.window.asString();
    this.setBgColor((this.doBGFill && !domapi.doSkin)?t.fonts.buttonface.bgcolor:"transparent");
    s.color       = t.fonts.buttonface.color;
  }finally{
    t = null; s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.news._layout = function(w,h){
};
//------------------------------------------------------------------------------
domapi.comps.news.direction=function(direct){
  this.direct=direct;
  switch(direct){
    case 1: this.fromX = 0;            this.fromY = -this.getH(); break;
    case 2: this.fromX = -this.getW(); this.fromY = -this.getH(); break;
    case 3: this.fromX = -this.getW(); this.fromY = 0;            break;
    case 4: this.fromX = -this.getW(); this.fromY = this.getH();  break;
    case 5: this.fromX = 0;            this.fromY = this.getH();  break;
    case 6: this.fromX = this.getW();  this.fromY = this.getH();  break;
    case 7: this.fromX = this.getW();  this.fromY = 0;            break;
    case 8: this.fromX = this.getW();  this.fromY = -this.getH(); break;
  }
};
//------------------------------------------------------------------------------
domapi.comps.news.reset=function(){
  this.stop();
  this.obj1.moveTo(0,0);
  this.obj2.moveTo(this.fromX,this.fromY);
  this.itemIndex = 0;
};
//------------------------------------------------------------------------------
domapi.comps.news.clear = function(){
  this.items = [];
  this.itemIndex = -1;
};
//------------------------------------------------------------------------------
domapi.comps.news.setW = function(w,cancelBubble){
  this.obj1.setW(w);
  this.obj2.setW(w);
  this._setW(w,cancelBubble);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.news.setH = function(h,cancelBubble){
  this.obj1.setH(h);
  this.obj2.setH(h);
  this.fromY = -h;
  this._setH(h,cancelBubble);
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.news.start=function(){
  this.reset();
  if(this.items.length>0)this.obj1.setText(this.items[this.itemIndex]);
  this.isRunning=true;
  this.direction(this.direct);
  if(this.items.length<1)return; // nothing to do
  this.obj1.setZ(0);
  this.obj2.setZ(1);
  this.obj2.setText(this.items[this.itemIndex]);
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  this.timerH = setInterval("domapi.bags.elms["+this.domAPIIndex+"].slide()", this.pause);
};
//------------------------------------------------------------------------------
domapi.comps.news.stop=function(){
  if(this.timerH)clearInterval(this.timerH);
  this.isRunning = false;
};
//------------------------------------------------------------------------------
domapi.comps.news.addItem      = function(sent){this.items[this.items.length]=sent};
//------------------------------------------------------------------------------
domapi.comps.news.slide = function(){
  var elm = domapi.bags.elms[this.domAPIIndex];
  try{
    elm.itemIndex++;                                                  // increases index
    if(elm.itemIndex>(elm.items.length-1))elm.itemIndex=0;            // recycles index
    elm.obj1.setText( elm.obj2.innerHTML);                            // sets 1 to 2 value
    elm.obj2.setText( elm.items[elm.itemIndex]);                      // sets 2 to index value
    elm.obj1.moveTo(  0,0);                                           // moves to right spot for move
    elm.obj2.moveTo(  elm.fromX,elm.fromY);                           // moves to right spot for move
    elm.obj1.glideTo({ endx:0-elm.fromX, endy:0-elm.fromY, type:3, steps:elm.steps, speed:elm.speed}); // glides to spot
    elm.obj2.glideTo({ endx:0, endy:0, type:3, steps:elm.steps, speed:elm.speed});                     // glides to spot
  }finally{
    elm = null;
  }
};
//------------------------------------------------------------------------------
