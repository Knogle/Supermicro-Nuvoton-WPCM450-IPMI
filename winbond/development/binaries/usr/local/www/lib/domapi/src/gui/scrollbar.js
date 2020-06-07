//==============================================
// DomAPI Scrollbar Component
// D. Kadrioski 3/1/2004
// (c) Nebiru Software 2001,2004
//==============================================

domapi.registerComponent("scrollbar");
//------------------------------------------------------------------------------
domapi.Scrollbar = function(arg){return domapi.comps.scrollbar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.scrollbar.constructor = function(arg){
  domapi._assert(arg, "orientation", "vertical");
  domapi._assert(arg, "w", 500);
  domapi._assert(arg, "h", 500);
  domapi._assert(arg, "x", 0);
  domapi._assert(arg, "y", 0);
  var e                    = domapi.Component(arg,"scrollbar");
  e._scroll                = domapi.Elm({parent:e,         x:0, y:0, w:10, h:10});
  e.gobo                   = domapi.Elm({parent:e._scroll, x:0, y:0, w:10, h:10});
  e.gobo.innerHTML         = "&nbsp;";
  e.setPosition(             e.position);
  e._scroll.style.overflow = "scroll";
  e.style.overflow         = "hidden";
  e.gobo.style.overflow    = "auto";

  domapi.disallowSelect(e);
  domapi._finalizeComp( e);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar._draw = function(){
  this.scrollbarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar.scrollbarDraw = function(){  
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar._layout = function(w,h){
  if(this.inLayout)return;
  this.inLayout = true;
  var sbw = domapi.scrollBarWidth();
  switch(this.orientation){
    case "horizontal" :
      this._scroll.setSize(w, sbw * 2);
      this._scroll.moveTo( 0, -sbw);
      this.setH(           sbw);
      break;
    case "vertical" :
      this._scroll.setSize(sbw * 2 ,h);
      this._scroll.moveTo( -sbw,0);
      this.setW(           sbw);
      break;
  }
  this.inLayout = false;
};
//------------------------------------------------------------------------------
domapi.comps.scrollbar.setPosition = function(i){
  this.position = i;
  this.gobo.setSize(i, i);
};
//------------------------------------------------------------------------------

