//------------------------------------------------------------------------------
// DomAPI Drag Routines
// D. Kadrioski 12/15/2001
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// Additional Contributors Include:
// E. Heidingsfeld
// S. Edwards <simon@gx.nl>
//------------------------------------------------------------------------------

domapi.drag = {};
//------------------------------------------------------------------------------
domapi.drag.dtNormal     = 1;  // allow the system to handle all the details
domapi.drag.dtDragDrop   = 5;  // element can only be dropped on a container that accepts it.
domapi.drag.dtCustom     = 6;  // system only surfaces drag events, up to user to respond.
domapi.drag.scrollthresh = 16;

domapi.dragObj = { // currently dragged object
  elm            : null,  // pointer to element being dragged
  trueElm        : null,  // if target is different than dragged elm, this is the real elm, not the target
  DragStart      : null,  // optional startdrag handler
  DragMove       : null,  // optional ondrag handler
  DragEnd        : null,  // optional enddrag handler
  cursorStartX   : 0,     // starting x local - for rollbacks
  cursorStartY   : 0,     // starting y local - for rollbacks
  k              : 1,     // kind of drag - see below
  inDrag         : false, // whether or not we are in a drag operation

  source         : null,  // source and sourcePosition are passed to insertElement() to return the
  sourcePosition : null,  // dragged object to where it came from in the event of a rollback/cancel.
  
  dest           : null,  // page element we are currently over
  infront        : true,  // Should the object be dropped infront on .dest or after?
  destContainer  : null,  // 
  index          : -1,    // elements sibling index - for rollbacks
  anchorReleased : false, // when type is dtDragDrop, this let's you know the threshold has been broken
  tag            : 0,
  dragThreshold  : 0,     // amount the user must drag an item before it is detached from it's parent
  DA_TYPE       : "DRAG"  // useful for figuring out scope of callbacks
};
//------------------------------------------------------------------------------
domapi.drag._free = function(){
  domapi.drag.dropContainers = [];
  _freeObject(domapi.dragObj);
};
//------------------------------------------------------------------------------
domapi.drag.dropContainers = [];
//------------------------------------------------------------------------------
// Every container element that can accept drops needs to be registered with
// this function.
domapi.drag.registerDropContainer = function(e,targetindicator) {
  domapi.drag.dropContainers.push(e);
  
    // GX SBE
  e._targetIndicator = targetindicator;
};
//------------------------------------------------------------------------------
domapi.elmProto.turnOnDrag = function(t,k,thresh,fDragStart,fDragMove,fDragEnd){
  // "t" is an optional target of the drag operation.  In other words, dragging on one
  // element can be made to effect another elm.  Think of a window component, in which
  // dragging the titlebar actually moves the entire window.  The drag occurs on the
  // titlebar, but the target element is it's parent in actuality.
  //
  // "k" is the drag kind.  Valid entries are:
  // 1 (default) standard "no frills" drag mode
  // 2 bounded drag - "opt" contains array(x1,y1,x2,y2) of bound coords
  // 3 object is physically moved to another parent.  Parent *must* accept drop to complete operation, else rollback.
  // thresh is the drag threshhold amount

  // GX SBE
  this._dragTarget  = t;
  k                 = domapi.rInt(k,domapi.drag.dtNormal);
  //thresh            = domapi.rInt(thresh,(k==domapi.drag.dtNormal)?0:4);
  thresh            = domapi.rInt(thresh,4);
  this._dragMDHandler = function(E){
   // if(!domapi.dragObj.elm._dragMDHandler)
   //dumpProps(domapi.dragObj)
   //dumpProps(domapi.getTarget(E));
   //if(domapi.getTarget(E) == domapi.dragObj)
      domapi.drag.dragStart(E,t,k,thresh,fDragStart,fDragMove,fDragEnd);
  };
  domapi.addEvent(this, "mousedown", this._dragMDHandler);
};
//------------------------------------------------------------------------------
domapi.elmProto.turnOffDrag=function(){
  domapi.removeEvent(this, "mousedown", this._dragMDHandler);
  domapi.dragObj.inDrag   = false;
};

//------------------------------------------------------------------------------
// GX SBE
domapi.elmProto._dragTarget = null;
domapi.elmProto._dragProxy = null;
domapi.elmProto.setDragProxy=function(elmobj) {
  if(this._dragTarget==null) {
    this._dragProxy = elmobj;
  } else {
    this._dragTarget._dragProxy = elmobj;
  }
};

//------------------------------------------------------------------------------
domapi.elmProto.cancelDrag=function(){
  // stop capturing events
  domapi.dragObj.inDrag = false;
  domapi.dragObj.tag        = 0;
  domapi.removeEvent(document,"mousemove",domapi.drag.dragGo  );
  domapi.removeEvent(document,"mouseup",  domapi.drag.dragStop);

  if(domapi.dragObj.k==domapi.drag.dtDragDrop){
    if(domapi.dragObj.elm._dragProxy==null) {
      // return to whence you came
      domapi.insertElm(this,domapi.dragObj.source,domapi.dragObj.sourcePosition);
      // GX SBE
      if(domapi.dragObj.originalPosition!=null) {
        domapi.dragObj.elm.setPosition(domapi.dragObj.originalPosition);
        domapi.dragObj.originalPosition = null;
      }
    } else {
      // Just hide the drag proxy.
      domapi.dragObj.elm._dragProxy.hide();
    }
    
      // Hide the target indicator.
    if(domapi.dragObj.destContainer!=null && domapi.dragObj.destContainer._targetIndicator!=null) {
      domapi.dragObj.destContainer._targetIndicator.hide();
    }

    if(domapi.dragObj.dest){if(typeof domapi.dragObj.dest.draw == "function")domapi.dragObj.dest.draw()}
  }
};
//------------------------------------------------------------------------------
domapi.drag.dragStart = function(e,t,k,thresh,fDragStart,fDragMove,fDragEnd){
  if(domapi.dragObj.inDrag)return;
  
  domapi.dragObj.k              = k;
  domapi.dragObj.dragThreshold  = thresh;
  domapi.dragObj.DragStart      = fDragStart;
  domapi.dragObj.DragMove       = fDragMove;
  domapi.dragObj.DragEnd        = fDragEnd;
  domapi.dragObj.dest           = null;
  domapi.dragObj.destContainer  = null;
  domapi.dragObj.anchorReleased = false;
  domapi.dragObj.trueElm        = domapi.getTarget(e);
  // store which button is being used for the drag
  if(domapi.isIE){
    switch(e.button){
      case 1 : domapi.dragObj.button = 'left';   break;     
      case 2 : domapi.dragObj.button = 'right';  break;
      case 3 : domapi.dragObj.button = 'middle'; break;
    }
  }else{
    switch(e.which){
      case 1 : domapi.dragObj.button = 'left';   break;
      case 2 : domapi.dragObj.button = 'middle'; break;
      case 3 : domapi.dragObj.button = 'right';  break;
    }
  }
  if(t)domapi.dragObj.elm       = t; // If an element was given, use it. Otherwise use the element the event occured on
  else{
    domapi.dragObj.elm=domapi.getTarget(e);
    // If this is a text or img node, use its parent element.
    if(domapi.dragObj.elm.nodeType == 3||domapi.dragObj.elm.nodeName == "IMG")domapi.dragObj.elm = domapi.dragObj.elm.parentNode;
  }
  if(typeof domapi.dragObj.elm.getX !="function")return;
  if(domapi.dragObj.elm.notDraggable || domapi.dragObj.trueElm.notDraggable)return;
  domapi.dragObj.inDrag           = true; // no backing out now
  domapi.preventBubble(e);
  if(domapi.isGecko)e.preventDefault(); // M. Proctor's super fix!
  // Get cursor position with respect to the page.
  domapi.dragObj.cursorStartX     = domapi.isIE?event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft:e.clientX + window.scrollX;
  domapi.dragObj.cursorStartY     = domapi.isIE?event.clientY + document.documentElement.scrollTop  + document.body.scrollTop :e.clientY + window.scrollY;
  domapi.dragObj.index            = domapi.getNodeIndex(domapi.dragObj.elm);

  if(domapi.dragObj.elm.previousSibling!=null) {
    domapi.dragObj.source = domapi.dragObj.elm.previousSibling;
    domapi.dragObj.sourcePosition = "afterEnd";
  } else {
    domapi.dragObj.source = domapi.dragObj.elm.parentNode;
    domapi.dragObj.sourcePosition = "afterBegin";
  }//dump([domapi.dragObj.cursorStartY , domapi.rInt(domapi.dragObj.elm.getAbsY())])

  domapi.dragObj.elStartLeft      = domapi.rInt(domapi.dragObj.elm.getAbsX());
  domapi.dragObj.elStartTop       = domapi.rInt(domapi.dragObj.elm.getAbsY());
  domapi.dragObj.elm.inDrag       = false;

//  domapi.dragObj.cursorStartX = domapi.dragObj.elStartLeft + (domapi.isIE?event.clientX:e.clientX) - 10;
//  domapi.dragObj.cursorStartY = domapi.dragObj.elStartTop  + 2;

  // GX SBE
  if(domapi.dragObj.elm._dragProxy==null) {
    domapi.dragObj.elm.bringToFront();
  }

  domapi.dragObj.originalPosition = null;

  // Capture mousemove and mouseup events on the page.
  domapi.addEvent(document,"mousemove",domapi.drag.dragGo  );
  domapi.addEvent(document,"mouseup",  domapi.drag.dragStop);
  //----------
  if(domapi.dragObj.DragStart)domapi.dragObj.DragStart(domapi.dragObj.cursorStartX,domapi.dragObj.cursorStartY);
};
//------------------------------------------------------------------------------
domapi.drag.dragGo = function(e){
  domapi.preventBubble(e);
  var i,j,x,y,t,con,elm,infront;

  // Get cursor position with respect to the page.
  var cX = domapi.isIE?event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft:e.clientX + window.scrollX;
  var cY = domapi.isIE?event.clientY + document.documentElement.scrollTop  + document.body.scrollTop :e.clientY + window.scrollY;
  // element location
  var eX = domapi.dragObj.elStartLeft + cX - domapi.dragObj.cursorStartX;
  var eY = domapi.dragObj.elStartTop  + cY - domapi.dragObj.cursorStartY;
  var dX = cX - domapi.dragObj.cursorStartX; // distance moved from start location
  var dY = cY - domapi.dragObj.cursorStartY;  // distance moved from start location

  var olddestcontainer = domapi.dragObj.destContainer;

    // Check all of the containers and find the right position.
  domapi.dragObj.dest = null;
  domapi.dragObj.destContainer = null;
  var firstnode;
  for(j=0; j<domapi.drag.dropContainers.length; j++){
    con = domapi.drag.dropContainers[j];
    
    // Is the point even inside this container?
    x = domapi.getAbsX(con); if(domapi.isKHTML)x += document.body.scrollLeft;
    if(cX>=x && cX<(x+con.offsetWidth)) {
      y = domapi.getAbsY(con); if(domapi.isKHTML)y += document.body.scrollTop;
      if(cY >= y && cY<(y+con.offsetHeight)) {
        domapi.dragObj.destContainer = con;
        
        // Loop over the contents of the container and work out which one the pointer
        // is hovering over. This code assumes that the objects are stacked vertically.
        firstnode = true;
        for(i=0; i<con.childNodes.length; i++) {
          elm = con.childNodes[i];
          if(domapi.dragObj.elm!=elm) {
            if(typeof elm.getAbsY=='function') {
              y = elm.getAbsY(); if(domapi.isKHTML)y += document.body.scrollTop;
              if(firstnode) { // Handle the special case of the pointer being infront of the first node.
                domapi.dragObj.dest = elm;
                domapi.dragObj.infront = true;
                firstnode = false;
              }
              if(cY > (y+elm.getH()/2)) {
                domapi.dragObj.dest = elm;
                domapi.dragObj.infront = false;
              }
            }
          }
        }
      }
    }
  }
  con = null;

  if(!domapi.dragObj.anchorReleased){
    /*if(domapi.dragObj.k == domapi.drag.dtNormal){
      domapi.dragObj.anchorReleased=true;
      if(domapi.useElmHooks && domapi.dragObj.elm._dispHook)domapi.dragObj.elm._dispHook("dragStart",arguments);
    }else */if((Math.abs(dX)>domapi.dragObj.dragThreshold)||(Math.abs(dY)>domapi.dragObj.dragThreshold)){
      domapi.dragObj.anchorReleased=true;
      if(domapi.useElmHooks && domapi.dragObj.elm._dispHook)domapi.dragObj.elm._dispHook("dragStart",arguments);
      if(domapi.dragObj.k==domapi.drag.dtDragDrop){ // anchors away
          // Drag the object on screen.
        if(domapi.dragObj.elm._dragProxy==null) { // GX SBE      
          domapi.insertElm(domapi.dragObj.elm,domapi.bodyElm(),"beforeEnd");
          domapi.dragObj.originalPosition = domapi.dragObj.elm.getPosition();
          domapi.dragObj.elm.setPosition("absolute");
        } else {
            // Use the drag proxy. Show it and position it.
          domapi.dragObj.elm._dragProxy.show();
        }
      }
    } else return;
    if(domapi.dragObj.anchorReleased){
     
    }
  }

  if(domapi.dragObj.anchorReleased && domapi.dragObj.DragMove) {domapi.dragObj.DragMove(eX,eY,dX,dY);return;};

  // Auto page scroll stuff.
  if(e.clientY<domapi.drag.scrollthresh) {
    var sy = domapi.scrollTop()-domapi.drag.scrollthresh;
    if(sy<0) {
      sy = 0;
    }
    try{
      domapi.setScrollTop(sy);
    }catch(E){} // FF can puke on this
  } else {
    if(e.clientY > (domapi.bodyHeight()-domapi.drag.scrollthresh)) {
      domapi.setScrollTop(domapi.scrollTop()+domapi.drag.scrollthresh);
    }
  }
  if(e.clientX<domapi.drag.scrollthresh) {
    var sx = domapi.scrollLeft()-domapi.drag.scrollthresh;
    if(sx<0) {
      sx = 0;
    }
    try{
      domapi.setScrollLeft(sx);
    }catch(E){} // FF can puke on this
  } else {
    if(e.clientX > (domapi.bodyWidth()-domapi.drag.scrollthresh)) {
      domapi.setScrollTop(domapi.scrollLeft()+domapi.drag.scrollthresh);
    }
  }

  // Move drag element by the same amount the cursor has moved.
  if(domapi.dragObj.k==domapi.drag.dtDragDrop) {
    if(domapi.dragObj.elm._dragProxy==null) { // GX SBE
      domapi.dragObj.elm.moveTo(eX,eY);
    } else {
        // Move the drapproxy.
      domapi.dragObj.elm._dragProxy.moveTo(cX,cY);
    }
    
      // GX SBE
    if(domapi.dragObj.destContainer!=null) {
    
      if(domapi.dragObj.destContainer._targetIndicator!=null) {
          // Update the drop indicator for current dropcontainer.

          // There is a current dropindicator on screen, then think about hiding it.
          // (But only if we won't be needing it.)
        if(olddestcontainer!=null && olddestcontainer._targetIndicator!=null &&
            olddestcontainer._targetIndicator!=domapi.dragObj.destContainer._targetIndicator) {
          olddestcontainer._targetIndicator.hide();
        }
      
        if(domapi.dragObj.dest==null) {
          // If there is no dest element, then the dropcontainer must be empty.
          domapi.dragObj.destContainer._targetIndicator.moveTo(domapi.getAbsX(domapi.dragObj.destContainer),domapi.getAbsY(domapi.dragObj.destContainer));
          domapi.dragObj.destContainer._targetIndicator.bringToFront();
          domapi.dragObj.destContainer._targetIndicator.show();
        } else {
          var topelm=null,bottomelm=null;
          var sib;
          
          if(domapi.dragObj.infront) {
          
              // Find the first "previous sibling" that is also a DIV. (skip #text and trash etc).
            sib = domapi.dragObj.dest.previousSibling;
            while(sib!=null) {
              if(sib.nodeName=="DIV") {
                break;
              }
              sib = sib.previousSibling;
            }

            if(sib==null) {
              // We are targeted just in front of the first element.
              var sx,dix,diy; // I hope I got my geometry right.
              sx = Math.floor(domapi.dragObj.dest.getX() + domapi.dragObj.dest.getW()/2);
              dix = sx - (domapi.dragObj.destContainer._targetIndicator.getW()/2);
              diy = domapi.dragObj.dest.getY() - (domapi.dragObj.destContainer._targetIndicator.getH()/2);
              domapi.dragObj.destContainer._targetIndicator.moveTo(dix,diy);
              domapi.dragObj.destContainer._targetIndicator.bringToFront();
              domapi.dragObj.destContainer._targetIndicator.show();
            } else {
              topelm = sib;
              bottomelm = domapi.dragObj.dest;
                // see below.
            }
          
          } else {
          
              // Find the first "next sibling" that is also a DIV. (skip #text and trash etc).
            sib = domapi.dragObj.dest.nextSibling;
            while(sib!=null) {
              if(sib.nodeName=="DIV") {
                break;
              }
              sib = sib.nextSibling;
            }
          
            if(sib==null) {
              // We are targeted just after the last element.

              // We are targeted just in front of the first element.
              var sx,dix,diy; // I hope I got my geometry right.
              sx = Math.floor(domapi.dragObj.dest.getX() + domapi.dragObj.dest.getW()/2);
              dix = sx - (domapi.dragObj.destContainer._targetIndicator.getW()/2);
              diy = domapi.dragObj.dest.getY()+domapi.dragObj.dest.getH() - (domapi.dragObj.destContainer._targetIndicator.getH()/2);
              domapi.dragObj.destContainer._targetIndicator.moveTo(dix,diy);
              domapi.dragObj.destContainer._targetIndicator.bringToFront();
              domapi.dragObj.destContainer._targetIndicator.show();
            } else {
              topelm = domapi.dragObj.dest;
              bottomelm = sib;
                // see just below.
            }
          }
        
          if(topelm!=null) {
            // OK, we are targetted inbetween two elements.
            // Position the dropindicator neatly centered in the space between the two elements.
            var sx,sy,dix,diy; // I hope I got my geometry right.
            sx = Math.floor((2*topelm.getX()+topelm.getW() + 2*bottomelm.getX()+bottomelm.getW()) / 4);
            sy = Math.floor((topelm.getY()+topelm.getH() + bottomelm.getY()) / 2);
            dix = sx - (domapi.dragObj.destContainer._targetIndicator.getW()/2);
            diy = sy - (domapi.dragObj.destContainer._targetIndicator.getH()/2);
            domapi.dragObj.destContainer._targetIndicator.moveTo(dix,diy);
            domapi.dragObj.destContainer._targetIndicator.bringToFront();
            domapi.dragObj.destContainer._targetIndicator.show();
          }
        
        }
      
      }
    
    } else {
        // Hide any previous dropindicator.
      if(olddestcontainer!=null && olddestcontainer._targetIndicator!=null) {
        olddestcontainer._targetIndicator.hide();
      }
    }
    olddestcontainer = null;
    topelm           = null;
    bottomelm        = null;
    sib              = null;
    return;
  }
  
  if(domapi.dragObj.k==domapi.drag.dtNormal  ) {domapi.dragObj.elm.moveTo(eX,eY);return;};
};
//------------------------------------------------------------------------------
domapi.drag.dragStop = function(e){
  domapi.preventBubble(e);

  domapi.dragObj.inDrag = false;
  domapi.removeEvent(document,"mousemove",domapi.drag.dragGo);
  domapi.removeEvent(document,"mouseup",  domapi.drag.dragStop);
  //-----
  var t = null;
  //if reflow or resize is on they need to have their values reset
  if (domapi.dragObj.elm.resizeStatus) domapi.resize._resetControls(domapi.dragObj.elm);
  if (domapi.dragObj.elm.reflowStatus) domapi.reflow.initValues(domapi.dragObj.elm);
  if(domapi.dragObj.k==domapi.drag.dtDragDrop||domapi.dragObj.k==domapi.drag.dtCustom){
    // find out if drop target accepts drops
    // if not, check it's parent becuase we may have dropped it on one of it's children
    // if we dropped on a childnode, childIndex is it's index and we use the parentNode as the target
    // we always insert the drop ahead of the child to support ordering of elements with the mouse
    if(!domapi.dragObj.anchorReleased){
      if(domapi.dragObj.DragEnd)domapi.dragObj.DragEnd(false,-1);
      return; // nothing to do
    }
    if(domapi.dragObj.destContainer) {
      domapi.dragObj._accept = domapi.dragObj.destContainer.ondragdrop(domapi.dragObj.elm);
    } else {
      domapi.dragObj._accept = false;
    }
    if(!domapi.dragObj._accept){//alert('cancel')
      domapi.dragObj.elm.cancelDrag();
      if(domapi.dragObj.DragEnd)domapi.dragObj.DragEnd(false,-1);
      return;
    } // rollback and kick out
  }
  if(domapi.dragObj.k==domapi.drag.dtDragDrop){ // insert the dragged element into the target
    if(domapi.dragObj.dest!=null) {
      if(domapi.dragObj.infront) {
        domapi.insertElm(domapi.dragObj.elm,domapi.dragObj.dest,"beforeBegin");
      } else {
        domapi.insertElm(domapi.dragObj.elm,domapi.dragObj.dest,"afterEnd");
      }
    } else {
      // Just insert the object into the container. There are no sibling elements.
      domapi.insertElm(domapi.dragObj.elm,domapi.dragObj.destContainer,"beforeEnd");
    }

    // GX SBE
    if(domapi.dragObj.elm._dragProxy==null) {
      if(domapi.dragObj.originalPosition!=null) {
        domapi.dragObj.elm.setPosition(domapi.dragObj.originalPosition);
        domapi.dragObj.originalPosition = null;
      }
    } else {
        // Using a drag proxy. Hide it now.
      domapi.dragObj.elm._dragProxy.hide();
    }

      // Hide the target indicator.
    if(domapi.dragObj.destContainer!=null && domapi.dragObj.destContainer._targetIndicator!=null) {
      domapi.dragObj.destContainer._targetIndicator.hide();
    }

    // let's give components a hand here and draw() them (assuming they support it)
    if(t){if(typeof t.draw == "function")t.draw()}
    else if(domapi.dragObj.dest){if(typeof domapi.dragObj.dest.draw == "function")domapi.dragObj.dest.draw()}
    if(domapi.dragObj.src && (typeof domapi.dragObj.src.draw == "function"))domapi.dragObj.src.draw();
  }
  if(domapi.dragObj.DragEnd)domapi.dragObj.DragEnd(true,null);
  //we only want to fire this if an actual drag took place
  if(domapi.dragObj.anchorReleased && domapi.useElmHooks && domapi.dragObj.elm._dispHook)domapi.dragObj.elm._dispHook("dragStop",arguments);
};
//------------------------------------------------------------------------------
// drag extensions *************************************************************
//------------------------------------------------------------------------------
// custom onDragMove event - useful for sliders and such, where you have preset areas an elm can be dragged to
domapi.drag.dragBasin = function(x,y,dX,dY){
  var c = [];
  for(var f=0;f<this.elm.basins.length;f++){
    c[f]=Math.abs(this.elm.basins[f][0]-x)+Math.abs(this.elm.basins[f][1]-y);
  }
  var d=0;
  for(f=1;f<c.length;f++)if(c[f]<c[d])d=f;
  //-----
  this.elm.moveTo(this.elm.basins[d][0],this.elm.basins[d][1]);
  if(d!=this.elm.basinIndex){
    this.elm.basinIndex=d;
    if(this.elm.onbasinchange)this.elm.onbasinchange(d);
  }
};
//------------------------------------------------------------------------------
// custom onDragMove event - useful for sliders and such, where you have a smooth range of values
domapi.drag.dragRange = function(x,y,dX,dY){
  var e = this.elm;
  if(x < e.rangeStart[0])x = e.rangeStart[0];
  if(y < e.rangeStart[1])y = e.rangeStart[1];
  if(x > e.rangeEnd[  0])x = e.rangeEnd[  0];
  if(y > e.rangeEnd[  1])y = e.rangeEnd[  1];
  e.moveTo(x,y);
  var xp = parseInt(( (x-e.rangeStart[0]) / (e.rangeEnd[0]-e.rangeStart[0]) )*100);
  var yp = parseInt(( (y-e.rangeStart[1]) / (e.rangeEnd[1]-e.rangeStart[1]) )*100);
  if(this.elm.onrangechange)this.elm.onrangechange(xp,yp);
  e = null;
};
//------------------------------------------------------------------------------
