//------------------------------------------------------------------------------
// DomAPI Flyover Routines
// D. Kadrioski 1/31/2004
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

domapi.loadUnit("shadow");
domapi.flyoverDelay   = 750;
domapi.flyoverOffsetX = 5;
domapi.flyoverOffsetY = 22;
domapi.addFlyover = function(e,src,doShadow){
  if(!domapi._flyover.elm){
    // create the single instance
    domapi._flyover.elm = domapi.Elm({x:0, y:0, w:0, h:0});
    if(doShadow)domapi.shadow.dropShadow(domapi._flyover.elm);
    domapi.hideFlyover();
    domapi._flyover.elm.style.cursor  = 'default';    
  }
  e.flyover           = src;
  e._flyoverMoveTimer = null;
  e._flyoverOutTimer  = null;
  domapi.addEvent(e, "mousemove", domapi._flyover.domousemove);
  domapi.addEvent(e, "mouseout",  domapi._flyover.domouseout);
  domapi.addEvent(domapi._flyover.elm, "mouseover", domapi._flyover.domouseover);
};
//------------------------------------------------------------------------------
domapi.removeFlyover = function(e){
  domapi.removeEvent(e, "mousemove", domapi._flyover.domousemove);
  domapi.removeEvent(e, "mouseout",  domapi._flyover.domouseout);
};
//------------------------------------------------------------------------------
domapi.hideFlyover = function(){
//  domapi._flyover.elm.style.display = 'none';
  domapi._flyover.elm.hide();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi._flyover     = {};
domapi._flyover.elm = null;
//------------------------------------------------------------------------------
domapi._flyover.domousemove = function(E){
  var e = domapi._flyover;if(!e)return;
  if(e._flyoverMoveTimer)clearTimeout(e._flyoverMoveTimer);
  e.target = domapi.getTarget(E);
  while(!e.target.flyover && e.target.parentNode)
    e.target = e.target.parentNode;
  if(!e.target.flyover)return;
  if(domapi.isGecko)
    e.mouse  = domapi.mousePosition(E);
  else
    e.mouse = [
      event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
      event.clientY + document.documentElement.scrollTop  + document.body.scrollTop
    ];
  e._flyoverMoveTimer = setTimeout("domapi._flyover.domousemovetimer()", domapi.flyoverDelay);
};
//------------------------------------------------------------------------------
domapi._flyover.domouseover = function(E){
  var e = domapi._flyover;if(!e)return;
  if(e._flyoverOutTimer ) clearTimeout(e._flyoverOutTimer );
  if(e._flyoverMoveTimer) clearTimeout(e._flyoverMoveTimer);
};
//------------------------------------------------------------------------------
domapi._flyover.domouseout = function(E){
  var e = domapi._flyover;if(!e)return;
  if(e._flyoverMoveTimer) clearTimeout(e._flyoverMoveTimer);
  e._flyoverOutTimer = setTimeout("domapi.hideFlyover()", 100);
};
//------------------------------------------------------------------------------
domapi._flyover.domousemovetimer = function(){
  var p = domapi.isIE?"0px 2px 0px 2px":"0px 0px 0px 2px";
  var s = domapi._flyover.target.flyover;
  var e = domapi._flyover.elm;
  var f = domapi.theme.fonts.highlight;
  var d = domapi._textDimension(s, f.asString(), p);
  var m = domapi._flyover.mouse;

  f.apply(e);
  e.setSize(d[0] + 2, d[1] + (domapi.isIE?2:2));
  e.moveTo( m[0] + domapi.flyoverOffsetX, m[1] + domapi.flyoverOffsetY);
  e.innerHTML     = s;
  e.style.border  = "1px solid " + f.color;
  e.style.padding = p;
  e.style.zIndex  = domapi.rInt(domapi._flyover.target.style.zIndex) + 1;
//  e.style.display = "";
  e.show();
};
//------------------------------------------------------------------------------