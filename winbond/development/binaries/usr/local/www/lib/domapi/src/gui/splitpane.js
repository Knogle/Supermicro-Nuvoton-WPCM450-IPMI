//==============================================
// Splitpane Component
// D. Kadrioski 6/25/2003
// (c) Nebiru Software 2001,2004
//==============================================

domapi.loadUnit("drag");
domapi.registerComponent("splitpane");
//------------------------------------------------------------------------------
domapi.Splitpane = function(arg){return domapi.comps.splitpane.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.splitpane.constructor = function(arg){
  var e = domapi.Component(arg,"splitpane");
  try{
    e._maxZ = 100; // for setZ in elm.js
    var i, p, r, s;
    var ref1  = arg["ref1" ];
    var ref2  = arg["ref2" ];
    var id1   = arg["id1"  ];
    var id2   = arg["id2"  ];
    var type1 = arg["type1"];
    var type2 = arg["type2"];
    var src1  = arg["src1" ];
    var src2  = arg["src2" ];
    //-----------------------------------------------
    if(src1 && type1 != "IMG")type1 = "IFRAME";  if(id1)ref1 = domapi.getElm(id1);
    if(src2 && type2 != "IMG")type2 = "IFRAME";  if(id2)ref2 = domapi.getElm(id2);

    if(ref1 && ref1.DA_TYPE) e.pane1 = ref1;
    else e.pane1 = domapi.Elm({parent:e,ref:ref1,type:type1,x:0,y:0,w:10,h:10,preserveContent:true});

    if(ref2 && ref2.DA_TYPE) e.pane2 = ref2;
    else e.pane2 = domapi.Elm({parent:e,ref:ref2,type:type2,x:0,y:0,w:10,h:10,preserveContent:true});

    for(i=0;i<2;i++){
      p = i==0?e.pane1 : e.pane2;
      r = i==0?   ref1 : ref2;
      s = i==0?   src1 : src2;
      //-----------------------------------------------
      if(r)domapi.transferElm(p,e);
      if(s)domapi.loadIframe(p,s,false);
      if(p.tagName == "IFRAME"){
        p.border                = 0;
        p.frameBorder           = 0;      
        p.style.overflow        = "auto";
        p.style.backgroundColor = "window";
        if(domapi.isIE) // ie will not display any iframe contents until the iframe is resized
          p.onreadystatechange = function(){
            if(this.readyState == "complete"){
              this.setSize(0,0);
              var t = this;
              setTimeout(function(){domapi.findParent(t,"SPLITPANE").layout()},10); // must happen in a new thread
            }
          };
      }
      if(p.isComponent)p.doBorder = p.doBorder && !p.isSplitpane;
      else{
        p.setB(1);
        p.style.borderStyle = "solid";
        p.style.borderColor = domapi.theme.border.threed.darkShadow;
      }
      p.style.visibility = "visible";
      p = null; r = null;
    }
    //-----------------------------------------------
    e.splitter         = domapi.Elm({ parent:e,x:0,y:0,w:e.splitterW,h:e.splitterW,bgcolor:e.splitterBG});
    e.splitter.DA_TYPE = "SPLITTER";
    e.shield           = domapi.Elm({parent:e,x:0,y:0,w:1,h:1,bgcolor:"blue"});
    if(e.manageShield)e.shield.setAlpha(0);
    e.shield.hide();

    e.pane1   .sendToBack();
    e.pane2   .sendToBack();
    e.shield  .bringToFront();
    e.splitter.bringToFront();
    //-----------------------------------------------
    var p = domapi._private.splitpane;
    domapi.addEvent(e.splitter,"mouseover",p.dosplittermouseover);
    domapi.addEvent(e.splitter,"mouseout" ,p.dosplittermouseout );
    //-----------------------------------------------

    domapi._finalizeComp( e);
    e._turnOnDrag();
    //alert(e.pane1.offsetWidth - e.pane1.clientWidth)
    e.draw(); // needed to finish layout of the splitter

    switch(e.orientation){
      case "vertical"   : e.moveSplitter(domapi.rInt( arg["moveSplitterTo"],e.getH()/2)); break;
      case "horizontal" : e.moveSplitter(domapi.rInt( arg["moveSplitterTo"],e.getW()/2)); break;
    }
    return e;
  }finally{
    e    = null;
    p    = null;
    r    = null;
    ref1 = null;
    ref2 = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitpane._free = function(){
  this.pane1    = null;
  this.pane2    = null;
  this.shield   = null;
  this.splitter = null;
};
//------------------------------------------------------------------------------
domapi.comps.splitpane._draw = function(){
  if(domapi.trace)dump(this.toString()+'._draw()');
  this.splitpaneDraw();
};
//------------------------------------------------------------------------------
domapi.comps.splitpane.splitpaneDraw = function(){
  if(domapi.trace)dump(this.toString()+'.splitpaneDraw()');
  var t         = domapi.theme;
  var s         = this.style;
  var b         = this.doBorder?t.border.width:0;
  try{
    if(this.pane1.draw)this.pane1.draw();
    if(this.pane2.draw)this.pane2.draw();
    this.setB(b);
    s.borderColor = t.border.getInset();
    s.borderStyle = this.doBorder?t.border.solid:"none";
    this.setBgColor(this.doBGFill?t.fonts.buttonface.bgcolor:"transparent");
  }finally{
    t = null; s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitpane._layout = function(w,h){
  if(domapi.trace)dump(this.toString()+'._layout('+[w,h]+')');
  var sp  = this.splitter;
  var p1  = this.pane1;
  var p2  = this.pane2;
  var sw  = this.splitterW;
  try{
    p1.style.position = "absolute";
    p2.style.position = "absolute";
    switch(this.orientation){
      case "vertical":
        sp.setSize(w-0, sw);
        //sp.moveTo( 0,   p1.getH()+1);
        sp.style.cursor = this.enabled?domapi.cursors.horzBeam:"default";
        break;
      case "horizontal":
        sp.setSize(sw,  h-0 );
        //sp.moveTo( p1.getW()+1, 0);
        sp.style.cursor = this.enabled?domapi.cursors.vertBeam:"default";
        break;
    };
    domapi._private.splitpane._sizePanes(this, sp.getX(), sp.getY(), w-0, h-0);
  }finally{
    sp = null;p1 = null;p2 = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.splitpane.moveSplitter = function(v){
  if(domapi.trace)dump(this.toString()+'.moveSplitter() ID:'+this.id);
  v  = v>this.min?v:this.min;
  switch(this.orientation){
    case "vertical":
      this.splitter.setY(v);
      break;
    case "horizontal":
      this.splitter.setX(v);
      break;
  }  
  var w = this.getW();
  var h = this.getH();
  if(!this._inLayout)domapi._private.splitpane._sizePanes(this,v,v,w,h);
  if(this.onresize)this.onresize();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// SETTERS
//------------------------------------------------------------------------------
domapi.comps.splitpane._setEnabled = function(b){
  this.enabled = b;
  this._turnOnDrag();
};
//------------------------------------------------------------------------------
domapi.comps.splitpane.setEnabled = function(b){
  this._setEnabled(b);
};
//------------------------------------------------------------------------------
domapi.comps.splitpane._turnOnDrag = function(){
  if(this.enabled)
    this.splitter.turnOnDrag(
      null,
      domapi.drag.dtCustom,
      0,
      domapi._private.splitpane.moveDragStart,
      domapi._private.splitpane.moveDragMove,
      domapi._private.splitpane.moveDragEnd
    );
  else
    this.splitter.turnOffDrag();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.splitpane.moveDragStart = function(){
  var e = this.elm;
  var p = e.parentNode;
  try{
    if(!e || !e.getW)return;
    e.setBgColor(domapi.theme.border.threed.darkShadow);
    with(p.shield){
      bringToFront();
      setSize(p.getW(),p.getH());
      show();
    }
    if(p.onresizestart)p.onresizestart();
    if(p.doHideOnDrag)domapi._private.splitpane._hidePanes(p);
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane.moveDragMove = function(eX,eY,dX,dY){
  var e = this.elm;
  var p = e.parentNode;
  try{
    if(!e || !p.enabled)return;
    var priv = domapi._private.splitpane;
    
    switch(p.orientation){
      case "vertical":
        var h = p.getH();
        if(eY < p.min || eY > h - p.min - p.splitterW)return;
        e.setY(eY);
        if(p.doThumbTrack)priv._sizePanes(p,eX,eY,0,h);
        break;
      case "horizontal":
        var w = p.getW();
        if(eX < p.min || eX > w - p.min - p.splitterW)return;
        e.setX(eX);
        if(p.doThumbTrack)priv._sizePanes(p,eX,eY,w,0);
        break;
    };
    if(p.doRollover)e.setBgColor(domapi.theme.border.threed.darkShadow);
    if(p.onresizing)p.onresizing(eX,eY,dX,dY);
  }finally{
    e = null;p = null;priv = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane.moveDragEnd = function(){
  var e = this.elm;
  var p = e.parentNode;
  try{
    if(!e || !p.enabled)return;
    if(domapi.trace)dump(e.toString()+'.moveDragEnd()  parent:'+p.toString());
    var eX = p.splitter.getX();
    var eY = p.splitter.getY();
    var w  = p.getW();
    var h  = p.getH();
    p.shield.hide();
    e.setBgColor(p.splitterBG);
    var priv = domapi._private.splitpane;
    priv._sizePanes(p, eX , eY , w, h);
    if(p.doHideOnDrag)priv._showPanes(p);
    if(p.onresizeend)p.onresizeend();
  }finally{
    e = null;p = null;priv = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane.dosplittermouseover = function(E){
  var e = domapi.findTarget(E,"SPLITTER");
  try{
    if(!e)return;
    var p = e.parentNode;
    if(!p.doRollover || !p.enabled || domapi.dragObj.inDrag)return;
    var f = domapi.theme.fonts.highlight;
    if(p.doRolloverFill && p.doBGFill)e.style.backgroundColor = f.bgcolor;
  }finally{
    e = null;p = null;f = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane.dosplittermouseout = function(E){
  var e = domapi.findTarget(E,"SPLITTER");
  try{
    if(!e)return;
    var p = e.parentNode;
    if(!p.doRollover || !p.enabled)return;
    var f = domapi.theme.fonts.buttonface;
    if(p.doRolloverFill && p.doBGFill)e.style.backgroundColor = f.bgcolor;
  }finally{
    e = null;p = null;f = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane._sizePanes = function(e,eX,eY,w,h){
  if(domapi.trace)dump(e.toString()+'._sizePanes() ID:'+e.id);
    
  var vb = e.doBorder?parseInt(domapi.theme.border.width * 1):0;
  var hb = vb;
  //if(!domapi.needsBoxFix)vb = 2;hb = 2;
  var p1 = e.pane1;
  var p2 = e.pane2;
  var sw = e.splitterW;
  try{
    var p1w, p2w, p1x, p1y, p1h, p2h, p2x, p2y, p1b, p2b;
    p1b = 0;
    p2b = 0;
    switch(e.orientation){
      case "vertical":
        p1x = 0 + hb ;
        p1y = 0 + vb ;
        p1w = w  - (hb*2);
        p1h = eY-  vb;
        p2y = eY + sw ;
        p2h = h - eY - sw - 2 - vb;
        p2x = p1x;
        p2w = p1w;
        break;
      case "horizontal":
        p1x = 0 + hb ;
        p1y = 0 + vb ;
        p1w = eX ;
        p1h = h - (vb *2);
        p2x = eX + sw + 1;
        p2y = 0 + vb;
        p2w = w - p2x - hb -1;
        p2h = p1h;
        if(p2.tagName == "IFRAME")p2w += (sw+hb);
        break;
    };
    if(!domapi.needsBoxFix){  // (!) is not a typo, need to inverse the setW method
      var O1 = domapi.completeBoxValuesOut(p1);
      var O2 = domapi.completeBoxValuesOut(p2);
      p1w -= (O1.padding[1] + O1.padding[3] + O1.margin[1] + O1.margin[3] + O1.border[1] + O1.border[3]);
      p2w -= (O2.padding[1] + O2.padding[3] + O2.margin[1] + O2.margin[3] + O2.border[1] + O2.border[3]);
      p1h -= (O1.padding[0] + O1.padding[2] + O1.margin[0] + O1.margin[2] + O1.border[0] + O1.border[2]);
      p2h -= (O2.padding[0] + O2.padding[2] + O2.margin[0] + O2.margin[2] + O2.border[0] + O2.border[2]);
    }
    p1._inLayout = false;p2._inLayout = false;
    if(domapi.trace)dump(e.toString()+'._sizePanes()'+': setting new metrics for pane 1:' + [p1.id,p1w,p1h]);
    p1.moveTo( p1x, p1y);p1.setSize(p1w, p1h);
    if(domapi.trace)dump(e.toString()+'._sizePanes()'+': setting new metrics for pane 2:'+[p2.id,p2w,p2h]);
    p2.moveTo( p2x, p2y);p2.setSize(p2w, p2h);
    if(domapi.trace)dump(e.toString()+'._sizePanes() Done for ID:'+e.id);
    //if(p.onresize)p.onresize();
    if(e.onchange)
      e.onchange(e.orientation=="vertical"?p1h:p1w);
  }finally{
    p1 = null; p2 = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane._hidePanes = function(e){
  if(domapi.trace)dump(e.toString()+'.hidePanes()');
  var p1 = e.pane1;
  var p2 = e.pane2;
  try{
    p1._didHide = (p1.style.visibility != "hidden");
    p2._didHide = (p2.style.visibility != "hidden");
    p1.hide();
    p2.hide();
  }finally{
    p1 = null; p2 = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.splitpane._showPanes = function(e){
  if(domapi.trace)dump(e.toString()+'._showPanes()');
  var p1 = e.pane1;
  var p2 = e.pane2;
  try{
    if(p1._didHide)p1.show();
    if(p2._didHide)p2.show();
  }finally{
    p1 = null; p2 = null;
  }
};
//------------------------------------------------------------------------------
