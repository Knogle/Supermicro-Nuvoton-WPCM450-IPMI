//------------------------------------------------------------------------------
// DomAPI resize elm routines
// Mark Proctor 25/4/2002
// (c) Mark Proctor 2001-2002
//-----------------------------------------------------------------------------
// Contributors:
// Mark Proctor
// Richard Halldearn
//------------------------------------------------------------------------------
// Created       25/04/2002
// Last Modified 04/08/2002
//------------------------------------------------------------------------------
// History
// 25/04/2002 - Developed initial resize.js module
//            - Remove instance parameter, but retained the possibility in the code to use it at a later date
//            - Moved the module from having 8 properties of resize for each control to a single array
// 04/08/2002 - Major rewrite, moved control code to selection and made rewrite play nice with selection.js
// 30/08/2002 - Added hooks to call _resetControls on dimension setters
//            - Added resizeStatus flags to make sure that resetControls is called at the correct times (Mark Proctor)
//            - Added call to drag.js to call resize._resetControls on dragStop (Mark Proctor)
// 06/09/2002 - Added hooks to drag.js to reset the resize stored values at the end of the drag
// 07/09/2002 - removed eval statatements (Mark Proctor)
//            - Added fix to allow turned off controls to work.
//------------------------------------------------------------------------------
// To Do:
// -Optimise domapi.selection._positionControls to move minimum amount of controls - at the moment
//  _moveControlLeftTop causes each control to be redrawn 4 times
domapi.loadUnit("selection");
domapi.loadUnit("drag");
domapi.loadUnit("groups");
domapi.resize = new Object();
//--------------------------------------------------------------------------------
// domapi.resize.on
// - Turn resize on
//--------------------------------------------------------------------------------
domapi.resize.on = function(group) {
  if (group) {
      domapi.groups.callFunction(group, "resizeOn()")
  } else {
    this.resizeStatus = true;
  }
  var r = domapi.resize._resetControls;
  domapi.regHook('setX',    r);
  domapi.regHook('setX',    r);
  domapi.regHook('setY',    r);
  domapi.regHook('setY',    r);
  domapi.regHook('setW',    r);
  domapi.regHook('setH',    r);
  domapi.regHook('moveTo',  r);
  domapi.regHook('dragEnd', r);
};
//--------------------------------------------------------------------------------
// domapi.resize.off
// - Turn resize off
//--------------------------------------------------------------------------------
domapi.resize.off = function(group) {
  if (group) {
      domapi.groups.callFunction(group, "resizeOff()")
  } else {
    domapi.resize._deselect(this); //this is needed to turn off drag for a currently selected elm
    this.resizeStatus = false;
  }

  domapi.elmProto.unRegHook('setX', domapi.resize._resetControls);
  domapi.elmProto.unRegHook('setX', domapi.resize._resetControls);
  domapi.elmProto.unRegHook('setY', domapi.resize._resetControls);
  domapi.elmProto.unRegHook('setY',domapi.resize._resetControls);
  domapi.elmProto.unRegHook('setW', domapi.resize._resetControls);
  domapi.elmProto.unRegHook('setH', domapi.resize._resetControls);
  domapi.elmProto.unRegHook('moveTo', domapi.resize._resetControls);
  domapi.elmProto.unRegHook('dragEnd', domapi.resize._resetControls);
};
//--------------------------------------------------------------------------------
// domapi.resize._select
// - An elm has been selected, initialises it for resize
//--------------------------------------------------------------------------------
domapi.resize._select = function(e) {
  //assign alias, to reduce code size

  e.resize = new Object();
  var er = e.resize;
  var csc = domapi.selection.controls;

  er.originalX = e.getX();
  er.originalY = e.getY();
  er.originalW = e.getW();
  er.originalH = e.getH();

  //initialise values needed for the resize
  er.minX = 0;
  er.minY = 0;
  er.minH = (csc.offset < csc.size) ? (csc.size*2)-(csc.offset*2) : 1;
  er.minW = (csc.offset < csc.size) ? (csc.size*2)-(csc.offset*2) : 1;
  er.maxX = (e.parentNode == document.body) ? domapi.bodyWidth() : e.parentNode.getW();
  er.maxY = (e.parentNode == document.body) ? domapi.bodyHeight() : e.parentNode.getH();

  var c = e.selection.controls;
  l = domapi.selection.lookupControls;
  for (var i=0;i<8;i++) {
   //eval ("c[i].turnOnDrag(null,domapi.drag.dtCustom, 0, null, domapi.resize._moveControl" + l[i].charAt(0).toUpperCase() + l[i].substr(1) + ", domapi.resize._resetControls)");
   if (c[i]) c[i].turnOnDrag(null,domapi.drag.dtCustom, 0, null, domapi.resize["_moveControl"+l[i].charAt(0).toUpperCase()+l[i].substr(1)], domapi.resize._resetControls);
  }
  e.resizeStatus = "go";
};
//--------------------------------------------------------------------------------
// domapi.resize._deselect
// - remove unnesseary code as its not needed
//--------------------------------------------------------------------------------
domapi.resize._deselect = function(e) {
  if (!e.resizeStatus) return; //make sure resize (drag) is on first, before we turn it off
  var c = e.selection.controls;
  l = domapi.selection.lookupControls;
  for (var i=0;i<8;i++) {
    if (c[i])  c[i].turnOffDrag();
  }
  e.resizeStatus = true;
  e.resize = null;
};
//--------------------------------------------------------------------------------
// domapi.resize._deselect
// - An elm has been moved, re inialise its values
//--------------------------------------------------------------------------------
domapi.resize._resetControls = function(e) {
  var parent = (!e) ? this.elm.parent : e;
  if ((!parent.resizeStatus)||(!parent.resize)||(parent.resizeStatus == 'go')) return;

  //if ((!parent.resizeStatus)||((parent.resizeStatus == 'go')||(parent.selectedStatus))) return;
  //alert(parent.resizeStatus+":"+(!parent.resizeStatus)+":"+(parent.resizeStatus == 'go'));
  var pr = parent.resize;

  pr.originalX = parent.getX();
  pr.originalY = parent.getY();
  pr.originalW = parent.getW();
  pr.originalH = parent.getH();
  //alert((parent.reflowStatus)+":"+(reflow));
  if (parent.reflowStatus) domapi.reflow.initValues(parent);

  parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlLeftTop
// -Event for Left Top control
//------------------------------------------------------------------------------
domapi.resize._moveControlLeftTop = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalX + dX <= pr.minX) {
    dX = pr.minX - pr.originalX;
   } else if (pr.originalX + dX >= pr.originalX + pr.originalW - pr.minW){
    dX = pr.originalW - pr.minW;
   }

   if (pr.originalY + dY <= pr.minY) {
     dY = pr.minY - pr.originalY;
   } else if (pr.originalY + dY >= pr.originalY +  pr.originalH - pr.minH){
     dY = pr.originalH - pr.minH;
   }

   var x = pr.originalX + dX;
   var w = pr.originalW - dX;
   var y = pr.originalY + dY;
   var h = pr.originalH - dY;

   parent.setX(x);
   parent.setW(w);
   parent.setY(y);
   parent.setH(h);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlLeftMiddle
// -Event for Left Middle
//------------------------------------------------------------------------------
domapi.resize._moveControlLeftMiddle = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalX + dX <= pr.minX) {
    dX = pr.minX - pr.originalX;
   } else if (pr.originalX + dX >= pr.originalX + pr.originalW - pr.minW){
    dX = pr.originalW - pr.minW;
   }

   var x = pr.originalX + dX;
   var w = pr.originalW - dX;

   parent.setX(x);
   parent.setW(w);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlLeftBottom
// -Event for Left Bottom
//------------------------------------------------------------------------------
domapi.resize._moveControlLeftBottom = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalX + dX <= pr.minX) {
    dX = pr.minX - pr.originalX;
   } else if (pr.originalX + dX >= pr.originalX + pr.originalW - pr.minW){
    dX = pr.originalW - pr.minW;
   }

   if (pr.originalH + dY <= pr.minH) {
     dY =  0 - pr.originalH + pr.minH;
   } else if (pr.originalY + dY + pr.originalH >=  pr.maxY){
     dY = pr.maxY - (pr.originalY + pr.originalH);
   }

   var h = pr.originalH + dY;
   var x = pr.originalX + dX;
   var w = pr.originalW - dX;

   parent.setX(x);
   parent.setW(w);
   parent.setH(h);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// Event for Centre Top
// -domapi.resize._moveControlCentreTop
//------------------------------------------------------------------------------
domapi.resize._moveControlCentreTop = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalY + dY <= pr.minY) {
     dY = pr.minY - pr.originalY;
   } else if (pr.originalY + dY >= pr.originalY +  pr.originalH - pr.minH){
     dY = pr.originalH - pr.minH;
   }

   var y = pr.originalY + dY;
   var h = pr.originalH - dY;

   parent.setY(y);
   parent.setH(h);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlCentreBottom
// -Event for Centre Bottom
//------------------------------------------------------------------------------
domapi.resize._moveControlCentreBottom = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalH + dY <= pr.minH) {
     dY =  0 - pr.originalH + pr.minH;
   } else if (pr.originalY + dY + pr.originalH >=  pr.maxY){
     dY = pr.maxY - (pr.originalY + pr.originalH);
   }

   var h = pr.originalH + dY;
   parent.setH(h);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlRightTop
// -Event for Right Top
//------------------------------------------------------------------------------
domapi.resize._moveControlRightTop = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalX + pr.originalW + dX >= pr.maxX) {
    dX = pr.maxX - pr.originalX - pr.originalW;
   } else if (dX < (0 - pr.originalW + pr.minW)){
    dX = 0 - pr.originalW + pr.minH;
   }

   if (pr.originalY + dY <= pr.minY) {
     dY = pr.minY - pr.originalY;
   } else if (pr.originalY + dY >= pr.originalY +  pr.originalH - pr.minH){
     dY = pr.originalH - pr.minH;
   }

   var y = pr.originalY + dY;
   var w = pr.originalW + dX;
   var h =  pr.originalH - dY;
   parent.setW(w);
   parent.setY(y);
   parent.setH(h);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlRightMiddle
// -Event for Right Middle
//------------------------------------------------------------------------------
domapi.resize._moveControlRightMiddle = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalX + pr.originalW + dX >= pr.maxX) {
    dX = pr.maxX - pr.originalX - pr.originalW;
   } else if (dX < (0-pr.originalW+pr.minW)){
    dX = 0 - pr.originalW + pr.minW;
   }

   var w = pr.originalW + dX;
   parent.setW(w);
   parent.resizeStatus = true;
};
//------------------------------------------------------------------------------
// domapi.resize._moveControlRightBottom
// -Event for Right Bottom
//------------------------------------------------------------------------------
domapi.resize._moveControlRightBottom = function (x,y,dX,dY){
   var parent = this.elm.parent;
   var pr = parent.resize;
   parent.resizeStatus = "go";

   if (pr.originalX + pr.originalW + dX >= pr.maxX) {
    dX = pr.maxX - pr.originalX - pr.originalW;
   } else if (dX < (0-pr.originalW+pr.minW)){
    dX = 0 - pr.originalW + pr.minW;
   }

   if (pr.originalH + dY <= pr.minH) {
     dY =  0 - pr.originalH + pr.minH;
   } else if (pr.originalY + dY + pr.originalH >=  pr.maxY){
     dY = pr.maxY - (pr.originalY + pr.originalH);
   }

   var h = pr.originalH + dY;
   var w = pr.originalW + dX;

   parent.setW(w);
   parent.setH(h);
   parent.resizeStatus = true;
};
//domapi.elmProto.resizeInit = domapi.resize.init;
domapi.elmProto.resizeOn = domapi.resize.on;
domapi.elmProto.resizeOff = domapi.resize.off;
domapi.elmProto.resizeStatus = false;
