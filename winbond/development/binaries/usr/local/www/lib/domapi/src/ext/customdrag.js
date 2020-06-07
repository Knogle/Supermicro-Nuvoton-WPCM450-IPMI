//------------------------------------------------------------------------------
// DomAPI Custom Drag Routines
// D. Kadrioski 2/14/2004
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// This unit is intended as a lightweight alternative to using the full-blown
// drag engine.  It can be used only for completely manual drag operations.
// The most likely consumer will be Components that act as containers for other
// drag-able objects, such as treenodes or listitems.
//------------------------------------------------------------------------------
/*
The following (optional) events are called on the container.  Each one passes an
arg object containing pertinent information.

ondragallow
  Called whenever a child is clicked with the mouse.  Check 'button' and 'elm'
  properties to determine if you want to allow the element to be dragged. Return
  a boolean (required).
  arg contains "E", "cursorX" and "cursorY".  ("E" is the original mouse event)

ondragcancel
  Called when a drag was started, but canceled before completion, usually by you
  calling elm.cancelCustomDrag()

ondragstart
  Called after the drag threshold has been exceeded.  Will not occur unless you
  returned true to ondragallow.
  arg contains "E", "cursorX" and "cursorY".

ondragmove
  Called whenever the mouse is moved during a drag operation.
  arg contains "E", "cursorX" and "cursorY".

ondropallow
  Called on containers whenever the mouse is moved over them.
  arg contains "E", "cursorX" and "cursorY".
  return a boolean

ondragend
  Called when the drop has completed.  Will pass a reference to the container
  that accepted the drop, if any.
  arg contains "E" and "target".  ("target" is accepting element or null)

ondragdrop
  When a drag ends, the engine walks up the tree starting from the last element
  it was over, looking for an ondragdrop event.  If an element is found to have
  one and it returns true, the drag is complete.  If it refuses the drop, the
  engine continues walking until it finds another or hits the root.

ondrop
*/

domapi.customDrag = {
  icons          : {},     // collection of images objects, used for cursor indicator
  inDrag         : false,  // drag is occuring, check anchorReleased for status
  dragThreshold  : 4,      // distance mouse must move in drag until anchorReleased is true
  anchorReleased : false,  // drag does not take place until anchor is released
  elm            : null,   // note, this is not guaranteed to be an Elm
  container      : null,   // instigating component
  button         : "left", // button being used
  cursorStartX   : 0,
  cursorStartY   : 0,
  cursorX        : 0,
  cursorY        : 0,
  _iconCreated   : false,
  doAllowSorting : true,
  insertAbove    : false,
  insertBelow    : false
};
//------------------------------------------------------------------------------
domapi.customDrag.preloadImages = function(){
  var I = this.icons;
  var p = domapi.theme.skin.path + "drag/";
  I["nope"    ] = new Image(); I["nope"    ].src = p + "nope.gif";
  I["text"    ] = new Image(); I["text"    ].src = p + "text.gif";
  I["single"  ] = new Image(); I["single"  ].src = p + "single.gif";
  I["multiple"] = new Image(); I["multiple"].src = p + "multiple.gif";
  I["insert"  ] = new Image(); I["insert"  ].src = p + "insert.gif";
};
domapi.customDrag.preloadImages();
//domapi.customDrag.preloadImages = null;
//------------------------------------------------------------------------------
domapi.customDrag._free = function(){
  _freeObject(this.icons);
  this.dropContainer = null;
  this._icon         = null;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Elm extensions
//------------------------------------------------------------------------------
domapi.elmProto.turnOnCustomDrag = function(arg){
  if(!domapi.customDrag._iconCreated)domapi.customDrag._createIcon();
  domapi._assert(arg, "threshold", 4);
  domapi.customDrag.container = this;
  this._dragMDHandler = function(E){
//    domapi.customDrag.container = this;
    domapi.customDrag._domousedown(E, arg);
  };
  this.dragIcon       = domapi.rVal(this.dragIcon, "text");

  domapi.addEvent(this, "mousedown", this._dragMDHandler);
};
//------------------------------------------------------------------------------
domapi.elmProto.turnOffCustomDrag = function(){
  domapi.removeEvent(this, "mousedown", this._dragMDHandler);
  customDrag.inDrag = false;
};
//------------------------------------------------------------------------------
domapi.elmProto.cancelCustomDrag = function(){
  // stop capturing events
  var t = domapi.customDrag;
  t.inDrag = false;
  domapi.removeEvent(document,"mousemove",t._domousemove);
  domapi.removeEvent(document,"mouseup",  t._domouseup  );
  t._hideIcon();
  if(t.container.ondragcancel)t.container.ondragcancel({});
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// private methods
//------------------------------------------------------------------------------
domapi.customDrag._showIcon = function(){
  if(this.container.dragIcon == "none")return;
  this._icon.src = this.icons[this.container.dragIcon].src;
  this._icon.bringToFront();
  this._icon.show();
  this._moveIcon();
};
//------------------------------------------------------------------------------
domapi.customDrag._moveIcon = function(){
  var m = domapi.theme.skin.metrics.drag;
  this._icon.moveTo(
    this.cursorX + m.iconOffsetX,
    this.cursorY + m.iconOffsetY
  );
};
//------------------------------------------------------------------------------
domapi.customDrag._hideIcon = function(){
  this._icon.hide();
};
//------------------------------------------------------------------------------
domapi.customDrag._findAcceptingContainer = function(O,n){
  if(!n)return null;
  if(n.ondropallow && n.ondropallow(O))return n;
  return this._findAcceptingContainer(O, n.parentNode);
};
//------------------------------------------------------------------------------
domapi.customDrag._createIcon = function(){
  this._icon = domapi.Elm({
    type   : "IMG",
    x      : 0, 
    y      : 0,
    w      : domapi.theme.skin.metrics.drag.iconW,
    h      : domapi.theme.skin.metrics.drag.iconH 
  });
  domapi.customDrag._icon.hide();
};
//------------------------------------------------------------------------------
domapi.customDrag._domousedown = function(E, arg){
  domapi.preventBubble(E);
  var t = domapi.customDrag;
  var e = domapi.getTarget(E);
    try{
    var found = false;
    t.container = null;
    while(e && !found){
      found = (!e.inDrag && e.doAllowDrag);
      if(!found)e = e.parentNode;
    }
    if(!found || !e)return;
    t.container = e;
  
    if(!t.container.doAllowDrag || t.inDrag)return;
    for(var i in arg)t[i] = arg[i];
    if(domapi.isGecko)E.preventDefault();
    t.dragThreshold  = arg["threshold"];
    t.anchorReleased = false;
    t.elm            = domapi.getTarget(E);
    // store which button is being used for the drag
    if(domapi.isIE){
      switch(event.button){
        case 1 : t.button = "left";   break;
        case 2 : t.button = "right";  break;
        case 3 : t.button = "middle"; break;
      }
    }else{
      switch(E.which){
        case 1 : t.button = "left";   break;
        case 2 : t.button = "middle"; break;
        case 3 : t.button = "right";  break;
      }
    }
    t.inDrag       = true; // mouse is down, but anchor not yet released
    // Get cursor position with respect to the page.
    t.cursorStartX = domapi.isIE?event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft:E.clientX + window.scrollX;
    t.cursorStartY = domapi.isIE?event.clientY + document.documentElement.scrollTop  + document.body.scrollTop :E.clientY + window.scrollY;
  
    // Capture mousemove and mouseup events on the page.
    domapi.addEvent(document,"mousemove",t._domousemove);
    domapi.addEvent(document,"mouseup",  t._domouseup  );
    //----------
    var O = {};
    O["E"]       = domapi.isGecko?E:event;
    O["cursorX"] = t.cursorStartX;
    O["cursorY"] = t.cursorStartY;
    if(t.container.ondragallow && !t.container.ondragallow(O))t.container.cancelCustomDrag({});//else dumpProps(t)
  }finally{
    e = null;
    O = null;
  }
};
//------------------------------------------------------------------------------
domapi.customDrag._domousemove = function(E){
  domapi.preventBubble(E);
  var t = domapi.customDrag;

  // Get cursor position with respect to the page.
  if(domapi.isGecko){
    t.cursorX = E.clientX + window.scrollX;
    t.cursorY = E.clientY + window.scrollY;
  }else{
    t.cursorX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
    t.cursorY = event.clientY + document.documentElement.scrollTop  + document.body.scrollTop;
  }
  var dX = t.cursorX - t.cursorStartX; // distance moved from start location
  var dY = t.cursorY - t.cursorStartY;
  var O  = {};
  try{
    O["E"      ] = domapi.isGecko?E:event;
    O["over"   ] = domapi.getTarget(E);
    O["source" ] = t.elm;
    O["cursorX"] = t.cursorX; O["dX"] = dX;
    O["cursorY"] = t.cursorY; O["dY"] = dY;
    if(t.doAllowSorting){
      // figure out if we are within the top or bottom 25% of the node
      var h = O["over"].offsetHeight;
      var _top = domapi.getTrueOffset(O["over"]);
      var y = t.cursorY - _top[1];
      var percentage = parseInt((y/h)*100);
      t.insertAbove  = (percentage <= 20);
      t.insertBelow  = (percentage >= 80);
      if(t.insertAbove && t.container.onallowinsertabove)
        t.insertAbove = t.container.onallowinsertabove(O);
      else t.insertAbove = false;
      if(t.insertBelow && t.container.onallowinsertbelow)
        t.insertBelow = t.container.onallowinsertbelow(O);
      else t.insertBelow = false;
    }
  
    if(!t.anchorReleased)
      if((Math.abs(dX) > t.dragThreshold) || (Math.abs(dY) > t.dragThreshold)){
        t.anchorReleased = true;
        if(t.container.ondragstart)t.container.ondragstart(O);
        t._showIcon();
      }
    if(t.anchorReleased && t.inDrag){
      if(t.container.ondragmove)t.container.ondragmove(O);
      var n = domapi.getTarget(E);
      n = t._findAcceptingContainer(O,n);//dumpProps(O)
      var _icon = n?t.container.dragIcon:"nope";
      if(_icon != "none"){
        var src = t.icons[_icon].src;
        if(t.insertAbove || t.insertBelow)src = t.icons["insert"].src;
        if(t._icon.src != src)t._icon.src = src;
        t._moveIcon();
      }
      return;
    };
  }finally{
    O = null;t = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi.customDrag._domouseup = function(E){
  domapi.preventBubble(E);
  var t = domapi.customDrag;
  var O = {};
  try{
    O["E"     ] = domapi.isGecko?E:event;
    O["over"  ] = domapi.getTarget(E);
    O["source"] = t.elm;
  
    if(t.anchorReleased){  // find out if we have any takers
      var n = domapi.getTarget(E);
      n = t._findAcceptingContainer(O,n);
    }
    if(!t.anchorReleased)t.container.cancelCustomDrag({});
    O["target"] = n;
    O["source"] = t.elm;
    t.inDrag = false;
    t._hideIcon();
    domapi.removeEvent(document,"mousemove",t._domousemove);
    domapi.removeEvent(document,"mouseup",  t._domouseup  );
    if(t.container.ondragend)t.container.ondragend(O);
    if(n && n.ondrop)n.ondrop(O);
    if(t.container.draw)t.container.draw();
  }finally{
    O = null;n = null;
  }
};
//------------------------------------------------------------------------------