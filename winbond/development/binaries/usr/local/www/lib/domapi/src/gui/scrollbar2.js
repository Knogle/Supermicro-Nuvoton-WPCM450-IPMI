//==============================================
// DomAPI Scrollbar Component
// D. Kadrioski 9/19/2003
// (c) Nebiru Software 2001,2003
//==============================================


var sbVert = "vert";
var sbHorz = "horz";
domapi.registerComponent("scrollbar");
//------------------------------------------------------------------------------
domapi.Scrollbar = function(arg){return domapi.comps.scrollbar2.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.scrollbar2.constructor = function(arg){
  var e = domapi.Component(arg,"scrollbar");

  e.kind      = domapi.rVal(arg["kind"],      sbVert);
  e.min       = domapi.rInt(arg["min"],       0);
  e.max       = domapi.rInt(arg["max"],       100);
  e.smallJump = domapi.rInt(arg["smallJump"], 1);
  e.bigJump   = domapi.rInt(arg["bigJump"],   10);
  e.position  = domapi.rInt(arg["position"],  e.min);

  e.btn1       = domapi.Elm({parent:e,x:0,y:0 });
  e.btn2       = domapi.Elm({parent:e,x:0,y:18});
  e.end1       = domapi.Elm({parent:e,x:0,y:0,w:50,h:50 });
  e.end2       = domapi.Elm({parent:e,x:0,y:18});
  e.thumb      = domapi.Elm({parent:e,x:0,y:0,w:50,h:50});
  e.thumb.end1 = domapi.Elm({parent:e.thumb,x:0,y:0});
  e.thumb.mid  = domapi.Elm({parent:e.thumb,x:0,y:0});
  e.thumb.end2 = domapi.Elm({parent:e.thumb,x:0,y:0});

  domapi._finalizeComp( e);
  e.setPosition(e.position);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar._draw = function(){
  this.scrollbarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar.scrollbarDraw = function(){
  var s = domapi.theme.skin.scrollbar;
  switch(this.kind){
    case sbVert :
      this.setW(s.metrics.endH + 2,true); // for border
      this.className      = "sbVBack";
      this.btn1.className = "sbVBtn1";
      this.btn2.className = "sbVBtn2";
      this.end1.className = "sbVEnd1";
      this.end2.className = "sbVEnd2";
      this.thumb.end1.className = "sbVThumbEnd1";
      this.thumb.mid.className  = "sbVThumbMid";
      this.thumb.end2.className = "sbVThumbEnd2";
      break;
    case sbHorz :
      this.setH(s.metrics.endW + 2,true); // for border
      this.className      = "sbHBack";
      this.btn1.className = "sbHBtn1";
      this.btn2.className = "sbHBtn2";
      this.end1.className = "sbHEnd1";
      this.end2.className = "sbHEnd2";
      this.thumb.end1.className = "sbHThumbEnd1";
      this.thumb.mid.className  = "sbHThumbMid";
      this.thumb.end2.className = "sbHThumbEnd2";
      break;
  }
  //-----------------

  var t         = domapi.theme;
  var s         = this.style;
  this.setB(      0);
  s.borderStyle = this.doBorder?t.border.solid:"none";
  this.setBgColor("transparent");
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar._layout = function(w,h){
  var s  = domapi.theme.skin.scrollbar;
  var b1 = this.btn1;
  var b2 = this.btn2;
  var e1 = this.end1;
  var e2 = this.end2;
  var t  = this.thumb;
  switch(this.kind){
    case sbVert :
      b1.setSize(s.metrics.endH, s.metrics.btnH);
      b2.setSize(s.metrics.endH, s.metrics.btnH);
      e1.setSize(s.metrics.endH, s.metrics.btnH);
      e2.setSize(s.metrics.endH, s.metrics.btnH);
      t.setW(s.btnW);
      t.end1.setSize(s.metrics.endH,s.metrics.thumbH);
      t.mid.setSize(s.metrics.btnW,t.getH()-s.metrics.thumbH*2);
      t.end2.setSize(s.metrics.btnW,s.metrics.thumbH);
      t.end1.moveTo(0,0);
      t.mid.moveTo(0,s.metrics.thumbH);
      t.end2.moveTo(0,t.getH()-s.metrics.thumbH);      
      switch(s.btnPos){
        case 0 :
          b1.moveTo(1,0);
          b2.moveTo(1,h - s.metrics.btnH);
          e1.moveTo(1,s.metrics.btnH);
          e2.moveTo(1,h - s.metrics.btnH - s.metrics.endH);
          t.min = s.metrics.btnH + s.metrics.endH - s.metrics.thumbMargin;
          t.max = h - s.metrics.btnH - s.metrics.endH + s.metrics.thumbMargin;
          break;
        case 1 :
          b1.moveTo(1,0);
          b2.moveTo(1,s.metrics.btnH+1);
          e1.moveTo(1,s.metrics.btnH*2+1);
          e2.moveTo(1,h - s.metrics.endH);
          t.min = s.metrics.btnH*2 + s.metrics.endH - s.metrics.thumbMargin;
          t.max = h - s.metrics.endH + s.metrics.thumbMargin;
          break;
        case 2 :
          b1.moveTo(1,h - s.metrics.btnH*2);
          b2.moveTo(1,h - s.metrics.btnH);
          e1.moveTo(1,0);
          e2.moveTo(1,h - s.metrics.btnH*2 - s.metrics.endH);
          t.min = s.metrics.endH - s.metrics.thumbMargin;
          t.max = h - s.metrics.endH - s.metrics.btnH*2 + s.metrics.thumbMargin;
          break;
      }
      break;
    case sbHorz :
      b1.setSize(s.metrics.btnH, s.metrics.btnW);
      b2.setSize(s.metrics.btnH, s.metrics.btnW);
      e1.setSize(s.metrics.btnH, s.metrics.btnW);
      e2.setSize(s.metrics.btnH, s.metrics.btnW);
      t.setH(s.metrics.btnW);      
      t.end1.moveTo(0,0);
      t.mid.moveTo(s.metrics.thumbH,0);
      t.end2.moveTo(t.getW()-s.metrics.thumbH,0);
      t.end1.setSize(s.metrics.thumbH,s.metrics.btnW);
      t.mid.setSize(t.getW()-s.metrics.thumbH*2,s.metrics.btnW);
      t.end2.setSize(s.metrics.thumbH,s.metrics.btnW);
      switch(s.btnPos){
        case 0 :
          b1.moveTo(0,1);
          b2.moveTo(w - s.metrics.btnH,1);
          e1.moveTo(s.metrics.btnH,1);
          e2.moveTo(w - s.metrics.btnH - s.metrics.endH,1);
          t.min = s.metrics.btnH + s.metrics.endH - s.metrics.thumbMargin;
          t.max = w - s.metrics.btnH - s.metrics.endH + s.metrics.thumbMargin;
          break;
        case 1 :
          b1.moveTo(0,1);
          b2.moveTo(s.metrics.btnH+1,1);
          e1.moveTo(s.metrics.btnH*2,1);
          e2.moveTo(w - s.metrics.endH,1);
          t.min = s.metrics.btnH*2 + s.metrics.endH - s.metrics.thumbMargin;
          t.max = w - s.metrics.endH + s.metrics.thumbMargin;
          break;
        case 2 :
          b1.moveTo(w - s.metrics.btnH*2,1);
          b2.moveTo(w - s.metrics.btnH,1);
          e1.moveTo(0,1);
          e2.moveTo(w - s.metrics.btnH*2 - s.metrics.endH + 1,1);
          t.min = s.metrics.endH - s.metrics.thumbMargin;
          t.max = w - s.metrics.endH - s.metrics.btnH*2 + s.metrics.thumbMargin;
          break;
      }
      break;
  }  
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar.setPosition = function(v){
  this.position = v;
  var t = this.thumb;
  var Tr = t.max - t.min;  // thumb range
  var q = this.max / Tr; // quanta
  
  var p = Math.round(v * q) + t.min; // pixels
  
  if(this.kind == sbVert)
    t.moveTo(1,p);
  else
    t.moveTo(p,1);
};
//------------------------------------------------------------------------------
