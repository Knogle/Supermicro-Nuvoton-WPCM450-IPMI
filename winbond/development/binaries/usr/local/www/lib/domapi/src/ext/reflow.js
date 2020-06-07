//=================================================
// Position Manager
// G. Kafka georg@solution-x.com
// 6/22/2003
//
// Based on a work by M. Proctor mproctor@cisco.com
// and P. Fricard pfricard@wanadoo.fr
// Additional contributors include:
//   D. Kadrioski
//=================================================

//------------------------------------------------------------------------------
domapi.reflow          = {};
domapi._private.reflow = {};
domapi.reflow._elms    = [];
var alNone   = 0;
var alTop    = 1;
var alRight  = 2;
var alBottom = 3;
var alLeft   = 4;
var alClient = 5;
//------------------------------------------------------------------------------
domapi.reflow._free = function(){
  this._elms = [];
  this._elms = [];
};
//------------------------------------------------------------------------------
domapi.reflow.getPx = function(pval,val){//dump("getPx")
  var pm = 1;
  if(val != parseInt(val,10)){
    val = val.substr(0,val.length-1);
    if(val < 0){
      pm  = -1;
      val = Math.abs(val);
    }
    val = (pval/100) * val;
  }
  return val * pm;
};
//------------------------------------------------------------------------------
domapi.reflow.getPpos = function(p){//dump("getPpos")
  var ppos = {};
  ppos.X   = p.getX();
  ppos.Y   = p.getY();
  var bdrs = p.getB();
  ppos.W   = p.getW()-bdrs[1]-bdrs[3];
  ppos.H   = p.getH()-bdrs[0]-bdrs[2];
  return ppos;
};
//------------------------------------------------------------------------------
//need to extend domapi, as it can act as a parent and needs to emulate an Elm
domapi.getX = function(){return 0};
domapi.getY = function(){return 0};
domapi.getW = domapi.bodyWidth;
domapi.getH = domapi.bodyHeight;
domapi.getB = function(){return [0,0,0,0]};
//------------------------------------------------------------------------------
// domapi.reflow.on - Turns reflow on and adds resize Event
//------------------------------------------------------------------------------
domapi.reflow.on = function(){ domapi.addEvent(window,"resize",this._windowResized,true);};
//------------------------------------------------------------------------------
// domapi.reflow.off - Turns reflow off and removes all events
//------------------------------------------------------------------------------
domapi.reflow.off = function(){ domapi.removeEvent(window,"resize",this._windowResized,true);};
//------------------------------------------------------------------------------
// Calculate position for each element
//------------------------------------------------------------------------------
domapi.reflow.render = function(p){
  if(this._inRender)return;
  this._inRender = true;
  try{
    try{
      this._passSession = domapi.guid();
      if(domapi.trace)dump( [p?p.toString():'null','reflow elm:'+this.id+'.reflow.render() Start Reflow Task: '+this._passSession]);
      this._render(p);
    }catch(E){if(domapi.trace){dump(' render() Error :'+ E.message);throw(E)}};
  }finally{
    this._inRender = false;
    if(domapi.trace)dump(this.toString()+'.reflow.Render() End Reflow Task: '+this._passSession);
  }
};
//------------------------------------------------------------------------------
domapi.reflow._render = function(p){
  if(!p)p = domapi;
  if(p._passSession == domapi.reflow._passSession)return;  // to prevent loopbacks
  p._passSession = domapi.reflow._passSession;
  var ppos = {X:0, Y:0, W:0, H:0};
  var elms = p.reflow._elms;
  var reflowself;
  try{
    if(p.beginUpdate)p.beginUpdate();
    if(domapi.trace)dump(p.toString()+'.reflow._render() ElemSession='+p._passSession+', Children=='+elms.length);
    ppos = domapi.reflow.getPpos(p);  
    var e, i, pos, x, y, w, h;
    // cycle trough reflow elements
    for(i=0;i<elms.length;i++){
      try{
       e = elms[i];
        if(((typeof domapi.dragObj != "undefined") && (e == domapi.dragObj.elm))  || e.tagName == "IFRAME" )continue;
        pos = e.reflow; 
        x = pos.getX(ppos);
        y = pos.getY(ppos);
        w = pos.getW(x,ppos);
        h = pos.getH(y,ppos);
        // if pos.reflowSelf==true then the component/elm's onreflow() member 
        // is called to rendering itself and its descendants.   [BeamGate]
        reflowself=(pos.reflowSelf && (typeof e.onreflow=='function'));
        if(reflowself)e.onreflow(p,ppos,x,y,w,h);
        else{
         if(domapi.trace)dump('Reflowing Child:'+e.toString());
         // if(e.isComponent)e.beginUpdate();
         e.moveTo(x,y);
         e.setSize(w,h);
         if(e.reflow)domapi.reflow._render(e); //has descendants?
         // if(e.isComponent)setTimeout("document.getElementById('"+e.id+"').endUpdate()",100);
        }
      }catch(e){
        if(domapi.trace){dump('reflow._render() Error :'+ e.message);throw(e);}
        throw new Error('reflow._render() Error :'+ e.message);
        continue;
      }finally{}
    }
  }finally{
    elms       = null;
    e          = null;
    pos        = null;
    reflowself = null;
    if(p.endUpdate)p.endUpdate();
  }
};
//------------------------------------------------------------------------------
domapi.reflow.getParent = function(e){
  var p = e.parentNode;
  try{
    if(p.tagName == "BODY")p = domapi;
    return p;
  }finally{
    p = null;
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.setAlign = function(a){
  var p    = domapi.reflow.getParent(this);
  var h    = this.getH();
  var w    = this.getW();
  try{
    p.top    = domapi.rInt(p.top);
    p.left   = domapi.rInt(p.left);
    p.right  = domapi.rInt(p.right);
    p.bottom = domapi.rInt(p.bottom);
    //this.align = a;  apparently align is a reserved word in IE
    switch(a){
      case alTop :
        this.reflowAdd({t:0,padT:p.top,h:(h+p.top),l:0,padL:p.left,r:"100%",padR:p.right});
        p.top += h;
        break;
      case alRight :
        this.reflowAdd({t:0,padT:p.top,h:"100%",padB:p.bottom,r:"100%",padR:p.right,w:(w+p.right)});
        p.right += w;
        break;
      case alBottom :
        this.reflowAdd({b:"100%",padB:p.bottom,h:(h+p.bottom),l:0,padL:p.left,r:"100%",padR:p.right});
        p.bottom += h;
        break;
      case alLeft :
        this.reflowAdd({t:0,padT:p.top,h:"100%",padB:p.bottom,l:0,padL:p.left,w:(w+p.left)});
        p.left += w;
        break;
      case alClient :
        this.reflowAdd({t:0,l:0,w:"100%",h:"100%",padL:p.left,padR:p.right,padT:p.top,padB:p.bottom});
        break;
    }
  }finally{
    p = null;
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.reflowAdd = function(opt){
  var p = domapi.reflow.getParent(this);
  try{
    if(!p.reflow      )p.reflow       = {};
    if(!p.reflow._elms)p.reflow._elms = [];
    if(!this.reflow   )this.reflow    = {};
    var r = this.reflow;
    if(domapi.trace)r.toString = function(){return this.elm.toString()+':ReflowObj';};
    r.elm = this ;
    r._elms = [];
    r.X     = opt["l"];
    r.Y     = opt["t"];
    r.C     = opt["c"];
    r.M     = opt["m"];
    r.R     = opt["r"];
    r.B     = opt["b"];
    r.W     = opt["w"];
    r.H     = opt["h"];
    r.reflowSelf  = domapi.rBool(opt['reflowSelf'],false);
    
    if(r.reflowSelf)this.onreflow=function(parent,parentcoords_obj,x,y,w,h){return;}; //Added to support custom rendering
    
    if(opt["anchor"]){
      var a = opt["anchor"] ;
      r.W = r.W ? r.W : this.getW();
      r.H = r.H ? r.H : this.getH();
      switch(a){
        case "lt": r.X = 0;     r.Y = 0;     break ;
        case "ct": r.C = "50%"; r.Y = 0;     break ;
        case "rt": r.R = "-0";  r.Y = 0;     break ;
        case "lc": r.X = 0;     r.M = "50%"; break ;
        case "cc": r.C = "50%"; r.M = "50%"; break ;
        case "rc": r.R = "-0";  r.M = "50%"; break ;
        case "lb": r.X = 0;     r.B = "-0";  break ;
        case "cb": r.C = "50%"; r.B = "-0";  break ;
        case "rb": r.R = "-0";  r.B = "-0";  break ;
      }
    }
  
    r.padL  = r.padR = r.padT = r.padB = 0;
    if(opt["pad"]) r.padL = r.padR = r.padT = r.padB = opt["pad"];
    if(opt["padX"])r.padL = r.padR = opt["padX"];
    if(opt["padY"])r.padT = r.padB = opt["padY"];
    r.padL   = domapi.rInt(opt["padL"],r.padL);
    r.padR   = domapi.rInt(opt["padR"],r.padR);
    r.padT   = domapi.rInt(opt["padT"],r.padT);
    r.padB   = domapi.rInt(opt["padB"],r.padB);
    r.parent = p;
  
    //option
    r.opt = opt;
  
    // define the necessary functions (only needs to be done once)
    if(!r.restore){
      r.getPx   = domapi.reflow.getPx;
      var proto = domapi._private.reflow;
      r.getX    = proto.getX;
      r.getY    = proto.getY;
      r.getW    = proto.getW;
      r.getH    = proto.getH;
      r.restore = proto.restore;
    }
  
    //add it in the elms of reflow at the end if no position have been specified
  
    p.reflow._elms.deleteValue(this) ;
    if(opt.pos>=0){p.reflow._elms.insert(opt.pos,this);}
    else {p.reflow._elms.push( this);}
    
    if(domapi.trace)dump(this.toString()+'.reflow.reflowAdd() parent elmCount='+p.reflow._elms.length);
  }finally{
    p = null; r = null;
  }
};
//------------------------------------------------------------------------------
// domapi.elmProto.windowResized
// -The event that is called when the window is resized - resizes attached elms
//------------------------------------------------------------------------------
domapi.reflow._windowResized = function(){
  if(domapi.trace)dump(this.toString()+'._windowResized()');
  domapi.reflow.render();
};
//------------------------------------------------------------------------------
// initializes elms to reflow off and turns on reflow for the app by default
//------------------------------------------------------------------------------
domapi.reflow.on();
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.reflow.restore = function(){
if(domapi.trace)dump(this.toString()+' restore()');
  var ppos = domapi.reflow.getPpos(this.parent);

  if(this.elm.type == "h"){
    if((typeof this.X != "undefined") && (typeof(this.X) != "function")){
      var x = this.elm.getX();
      if(this.X != parseInt(this.X,10))           // X is percentual
        x = ((x/ppos.W) * 100) + "%";
      if(this.X < 0)x = this.X;
      this.X = x;
      this.W = this.elm.getW();
      this.padL = 0;
      this.padR = 0;
    }

    if((typeof this.C != "undefined")&& (typeof(this.C) != "function")){
      var c = this.elm.getX() + (this.elm.getW()/2);
      if(this.C != parseInt(this.C,10))           // C is percentual
        c = ((c/ppos.W) * 100) + "%";
      if(this.C < 0)c = this.C;
      this.C = c ;
      this.W = this.elm.getW();
      this.padL = 0;
      this.padR = 0;
    }

    if((typeof this.R != "undefined") && (typeof(this.R) != "function")){
      var r = this.elm.getX() + this.elm.getW();
      if(this.R != parseInt(this.R,10))           // R is percentual
        r = ((r/ppos.W) * 100) + "%";
      if(this.R < 0)r = this.R;
      this.R = r;
      this.W = this.elm.getW();
      this.padL = 0;
      this.padR = 0;
    }
  }

  if(this.elm.type == "v"){
    if((typeof this.Y != "undefined") && (typeof(this.Y) != "function")){
      var y = this.elm.getY();
      if(this.Y != parseInt(this.Y,10))           // Y is percentual
        y = ((y/ppos.H) * 100) + "%";
      if(this.Y < 0)y = this.Y;
      this.Y = y;
      this.H = this.elm.getH();
      this.padT = 0;
      this.padB = 0;
    }
    if((typeof this.M != "undefined") && (typeof(this.M) != "function")){
      var m = this.elm.getY() + (this.elm.getH()/2) ;
      if(this.M != parseInt(this.M,10))           // M is percentual
        m = ((m/ppos.H) * 100) + "%";
      if(this.M < 0)m = this.M;
      this.M = m;
      this.H = this.elm.getH();
      this.padT = 0;
      this.padB = 0;
    }
    if((typeof this.B != "undefined") && (typeof(this.B) != "function")){
      var b = this.elm.getY() + this.elm.getH() ;
      if(this.B != parseInt(this.B,10))           // B is percentual
        b = ((b/ppos.H) * 100) + "%";
      if(this.B < 0)b = this.B;
      this.B = b;
      this.H = this.elm.getH();
      this.padT = 0;
      this.padB = 0;
    }
  }
};
//------------------------------------------------------------------------------
domapi._private.reflow.getX = function(ppos){
if(domapi.trace)dump(this.toString()+' getX('+[ppos]+')');
  if(this.X || this.X==parseInt(this.X,10)){ // X is defined
    if(typeof(this.X) == "function")
      return this.X()+ this.padL;
    var x = this.getPx(ppos.W,this.X);      // for positive/negative intvals and percents
    if((this.X + "_").substr(0,1) == '-')  // X is negative or -0 
      x = ppos.W - Math.abs(x);
  }else{                                    // X is undefined --> W and (R or C) must be defined
    if(this.R){                             // R is defined
      if(typeof(this.R) == "function")
        var r = this.R();
      else{
        var r = this.getPx(ppos.W,this.R);
        if((this.R + "_").substr(0,1) == '-') r = ppos.W - Math.abs(r);
      }
      var x = r - this.getPx(ppos.W,this.W);
    }else{                                  // C is deifined
      var c = this.getPx(ppos.W,this.C);
      if((this.C + "_").substr(0,1) == '-') c = ppos.W - Math.abs(c);
      var x = c - (this.getPx(ppos.W,this.W)/2);
    }
  }
  return x + this.padL;
};
//------------------------------------------------------------------------------
domapi._private.reflow.getY = function(ppos){
if(domapi.trace)dump(this.toString()+' getY('+[ppos,this.Y,this.B,this.H,this.M]+')');
  if(this.Y || this.Y==parseInt(this.Y,10)){ // Y is defined
    if(typeof(this.Y) == "function")
      return this.Y() + this.padT ;
    var y = this.getPx(ppos.H,this.Y);      // for positive/negative intvals and percents
    if((this.Y + "_").substr(0,1) == '-')  // Y is negative or -0 
      y = ppos.H - Math.abs(y);
  }else{                                    // Y is undefined --> H and (B or M) must be defined
    if(this.B){                             // B is defined
      if(typeof(this.B) == "function") var b = this.B() ;
      else{
        var b = this.getPx(ppos.H,this.B);
        if((this.B + "_").substr(0,1) == '-') b = ppos.H - Math.abs(b);
      }
      var y = b - this.getPx(ppos.H,this.H);
    }else{                                  // M is deifined
      var m = this.getPx(ppos.H,this.M);
      if((this.M + "_").substr(0,1) == '-') m = ppos.H - Math.abs(m);
      var y = m - (this.getPx(ppos.H,this.H)/2);
    }
  }
  return y + this.padT;
};
//------------------------------------------------------------------------------
domapi._private.reflow.getW = function(x,ppos){
if(domapi.trace)dump(this.toString()+' getW('+[x,ppos]+')');
  if(this.W)                               // W is defined
    var w = this.getPx(ppos.W,this.W);
  else{                                    // W is undefined --> R must be defined
    if(typeof(this.R) == "function")
      var r = this.R();
    else{
      var r = this.getPx(ppos.W,this.R);
      if((this.R + "_").substr(0,1) == '-') r = ppos.W - Math.abs(r);
    }
    var w = r - x;
  }
  return w - this.padL - this.padR;
};
//------------------------------------------------------------------------------
domapi._private.reflow.getH = function(y,ppos){
if(domapi.trace)dump(this.toString()+' getH('+[y,ppos,this.H,this.B]+')');
  if(this.H)                               // H is defined
    var h = this.getPx(ppos.H,this.H);
  else{                                    // H is undefined --> B must be defined
    if(typeof(this.B) == "function")
      var b = this.B() ;
    else{
      var b = this.getPx(ppos.H,this.B);
      if((this.B + "_").substr(0,1) == '-') b = ppos.H - Math.abs(b);
    }
    var h = b - y;
  }
  return h - this.padT - this.padB;
};
//------------------------------------------------------------------------------