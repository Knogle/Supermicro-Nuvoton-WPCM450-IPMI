//------------------------------------------------------------------------------
// DomAPI Selection
// Mark Proctor
// (c) Mark Proctor 2001-2002
//------------------------------------------------------------------------------
// Contributors:
// Mark Proctor
// Peter Howarth
//------------------------------------------------------------------------------
// Created       28/06/2002
// Last Modified 23/07/2002
//------------------------------------------------------------------------------
// History
// 28/06/2002 - First draft created (Peter Howarth)
// 01/07/2002 - Review and general code update (Mark Proctor)
//            - Changed to allow multiple selection with shift key (Mark Proctor)
//            - Created getELM, to traverse DOM hierarchical to allow ELM selection, even when clicking nested elements (Mark Proctor)
// 05/07/2002 - Added "allowed" to enable exclusion of elms from selection (Peter Howarth)
// 23/07/2002 - Added event hooks for onSelect and onDeSelect (Mark Proctor)
// 25/07/2002 - Added event hook for onClearSelection ie when all are deselect(Philip Mudd)
// 04/08/2002 - Moved Controls from resize and placed in here, with hooks to keep controls
//              aligned with the elm (Mark Proctor)
//            - Modified AddAllowed to accept multple elms (Mark Proctor)
// 30/08/2002 - Added fix in removeAllowed to exit if allowed is not yet defined (Mark Proctor)
// 06/09/2002 - Added hooks into drag.js and new parameter for setControls to determine behavior of controls (Mark Proctor)
//              during a drag - do the controls deselect on drag or stay present, default is to deselect
//            - Added the ability to turn off controls by using null in the image array,
//              the image array can be reset by assigning "false"
// 22/09/2002 - Added bringToFront to make sure that resized elms and controls are always on top
//------------------------------------------------------------------------------
// To Do
// -Implement better zIndex control
// -Controls are still left behind on nested elms when the parent is dragged
// -If you register a nested elm with its parents, a change in DOM currently puts this out of sync
//------------------------------------------------------------------------------
// modified for 4.0 by D. Kadrioski
//------------------------------------------------------------------------------
domapi.loadUnit("keyboard");
domapi.loadUnit("groups");
domapi.selection          = {};
domapi.selection.elms     = null;  // this variable is used for the array of elms
domapi.selection.allowed  = null;
domapi.selection.controls = {};

//lookup values for the array
domapi.selection.lookupControls    = [];
domapi.selection.lookupControls[0] = 'leftTop';
domapi.selection.lookupControls[1] = 'centreTop';
domapi.selection.lookupControls[2] = 'rightTop';
domapi.selection.lookupControls[3] = 'rightMiddle';
domapi.selection.lookupControls[4] = 'rightBottom';
domapi.selection.lookupControls[5] = 'centreBottom';
domapi.selection.lookupControls[6] = 'leftBottom';
domapi.selection.lookupControls[7] = 'leftMiddle';
//------------------------------------------------------------------------------
// domapi.selection._createControls
// -Creates controls
//------------------------------------------------------------------------------
domapi.selection._createControls = function(e) {
  var c = e.selection.controls;
  l = domapi.selection.lookupControls;

  for (var i=0;i<8;i++) {
    if ((typeof domapi.selection.controls.image != 'object')||(domapi.selection.controls.image[i] != null)) {
      c[i] = domapi.Elm({x:0,y:0});
      c[i].DA_TYPE = "control";
      c[i].bringToFront();
    } else {
      c[i] = null;
    }
  }
};
//------------------------------------------------------------------------------
// domapi.selection._initControls
// -Initialises the look and feel of the controls
//------------------------------------------------------------------------------
domapi.selection._initControls = function(e) {
  var c = e.selection.controls;
  for (var a=0;a<c.length;a++) {
    if (c[a]) {
      c[a].setW(domapi.selection.controls.size);
      c[a].setH(domapi.selection.controls.size);
      c[a].setBgColor(domapi.selection.controls.color);
      c[a].parent = e;
      if (typeof domapi.selection.controls.image == "object" && typeof domapi.selection.controls.image[a] == 'string'){
          c[a].innerHTML = '<img src="'+ domapi.selection.controls.image[a] + '" width=' + (domapi.selection.controls.size) + ' height=' + (domapi.selection.controls.size) + '>';
        }else{c[a].innerHTML ='';}
      }
  }
};
//------------------------------------------------------------------------------
// domapi.selection._positionControls
// Position controls relevant to elms position
//------------------------------------------------------------------------------
domapi.selection._positionControls = function _positionControls(e) {
  //alert(e.selectionStatus);
  if ((!e.selectionStatus)||((domapi.selection._deselectOnDrag)&&(e.selectionDrag))) return;
  var size = domapi.selection.controls.size;
  var offset = domapi.selection.controls.offset;
  var c = e.selection.controls;

  var trueOffset = domapi.getTrueOffset(e);
  var x = trueOffset[0];
  var y = trueOffset[1];
  if(e.getW){
    if (c[0]) {
      c[0].setX(x - offset, true);
      c[0].setY(y - offset, true);
    };
    if (c[1]) {
      c[1].setX(x + (e.getW()/2)  - (size/2), true);
      c[1].setY(y - offset, true);
    };
    if (c[2]) {
      c[2].setX(x + e.getW() - size + offset, true);
      c[2].setY(y - offset, true);
    };
    if (c[3]) {
      c[3].setX(x + e.getW() - size + offset, true);
      c[3].setY(y + (e.getH()/2) - (size/2), true);
    };
    if (c[4]) {
      c[4].setX(x + e.getW() - size + offset, true);
      c[4].setY(y + e.getH() - size + offset, true);
    };
    if (c[5]) {
      c[5].setX(x + (e.getW()/2) - (size/2), true);
      c[5].setY(y + e.getH() - size + offset, true);
    };
    if (c[6]) {
      c[6].setX(x - offset, true);
      c[6].setY(y + e.getH() - size + offset, true);
    };
    if (c[7]) {
      c[7].setX(x - offset, true);
      c[7].setY(y + (e.getH()/2) - (size/2), true);
    };
  }else{
    // hide the nubs
    for(var a=0;a<8;a++)
      if(c[a])c[a].setY(-10);
  }
};
//------------------------------------------------------------------------------
// domapi.selection.on
// -Initiliases the array and on the onClick event
//------------------------------------------------------------------------------
domapi.selection.on = function() {
  if (domapi.selection.status) return;
	domapi.selection.elms = [];
	domapi.addEvent(document, "click", domapi.selection._selectElm);
  domapi.selection.status = true;
};
//------------------------------------------------------------------------------
// domapi.selection.off
// -Removes events and clears the array
//------------------------------------------------------------------------------
domapi.selection.off = function() {
	cs = domapi.selection;
	domapi.removeEvent(document, "click", cs.selectElm);
	cs.elms = null;
  domapi.selection.status = false;
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// domapi.selection.setControls
// -Sets the look and feel of the controls
//------------------------------------------------------------------------------
domapi.selection.setControls = function(deselectOnDrag, size, color, offset, image) {
  var cs = domapi.selection;
  var ep = domapi.elmProto;
  cs.deselectOnDrag = domapi.rVal(deselectOnDrag, cs.deselectOnDrag);
  //check for boolean, because we don't want to execute this if its null
  if (cs.deselectOnDrag != null) {
    if (cs.deselectOnDrag == true) {
      if (cs.deselectOnDragOn == false) {
        cs.deselectOnDragOn = true;
        domapi.unRegHook('dragStart', cs._showControlsOnDrag);
        domapi.regHook('dragStart', cs._removeControlsOnDrag);
      }
    } else if (cs.deselectOnDrag == false){
      if (cs.deselectOnDragOn == true) {
        cs.deselectOnDragOn = false;
        domapi.unRegHook('dragStart', cs._removeControlsOnDrag);
        domapi.regHook('dragStart', cs._showControlsOnDrag);
      }
    }
  }
  var csc = domapi.selection.controls;
  //set defaults for nulled parameters
  csc.size = domapi.rInt(size,csc.size);
  //if they are not specifying an offset, the size must odd to allow proper alignment
  if ((offset==null)&&(!csc.size % 2)) csc.size++;
  csc.offset = domapi.rInt(offset,(csc.size+1)/2);
  csc.color = domapi.rVal(color,csc.color);
  //check if there is one image, an array of 8 images, or no images
  if (image != null) csc.image = (typeof image == "string") ? new Array(image,image,image,image,image,image,image,image) : image;

};

domapi.selection._removeControlsOnDrag = function(e) {
  domapi.selection._deselect(e);
  e.selectionDrag = true;
};
domapi.selection._showControlsOnDrag = function(e) {
  e.selectionDrag = true;
};
//------------------------------------------------------------------------------
// domapi.selection._regParent
// -Registers an elm with all parents
//------------------------------------------------------------------------------
domapi.selection._regParent = function(e, elm) {
  var p = e.parentNode;
  if (!p.DA_TYPE) return false;
  if (!p.nestedSelectedElms) p.nestedSelectedElms = [];
  p.nestedSelectedElms[p.nestedSelectedElms.length] = elm;
  domapi.selection._regParent(p, elm)
};
//------------------------------------------------------------------------------
// domapi.selection._unRegParent
// -Unregisters an elm with all parents
//------------------------------------------------------------------------------
domapi.selection._unRegParent = function(e, elm) {
  var p = e.parentNode;
  if (!p.DA_TYPE) return false;
  if (p.nestedSelectedElms) p.nestedSelectedElms.deleteItem(p.nestedSelectedElms.indexOf(elm));
  domapi.selection._unRegParent(p, elm)
};
//------------------------------------------------------------------------------
// domapi.selection._positionChildrenControls
// -Determins if an elm has nested children and makes sure their controls are in sync
//------------------------------------------------------------------------------
domapi.selection._positionChildrenControls = function(e) {
  if (!e.nestedSelectedElms) return;
  for (var i=0;i<e.nestedSelectedElms.length;i++) {
    domapi.selection._positionControls(e.nestedSelectedElms[i]);
    domapi.selection._positionChildrenControls(e.nestedSelectedElms[i]);
  }
};
//------------------------------------------------------------------------------
// domapi.selection._select
// -Create elm controls
//------------------------------------------------------------------------------
domapi.selection._select = function(e) {
  if(typeof e.bringToFront != "undefined")e.bringToFront();
  //assign alias, to reduce code size
  var cs = domapi.selection;
  e.selection = {};
  var es = e.selection;
  //assign controls object
  es.controls = [];
  e.selectionStatus = 'init';

  cs._createControls(e);
  cs._initControls(e);
  if (e.resizeStatus) domapi.resize._select(e);
  cs._positionControls(e);
  domapi.selection._regParent(e, e);
  e.selectionStatus = true;
	cs.elms[cs.elms.length] = e;
	if (cs.onselected) cs.onselected(e);
};
//------------------------------------------------------------------------------
// domapi.selection._deselect
// -removes highlights from elm
//------------------------------------------------------------------------------
domapi.selection._deselect = function(e){
  if (!e.selectionStatus) return;
  var c = e.selection.controls;
  var cs = domapi.selection;
  for (var a=0;a<c.length;a++) {
    if (c[a]) c[a].removeNode(true);
  }
  e.selectionStatus = false;
  if (e.resizeStatus) domapi.resize._deselect(e);
  cs._unRegParent(e, e);
  delete e.selection.controls;
	cs.elms.deleteItem(cs.elms.indexOf(e));
	if (cs.ondeselected) cs.ondeselected(e);
};
//------------------------------------------------------------------------------
// domapi.selection._deselectAll
// -removes all highlights
//------------------------------------------------------------------------------
domapi.selection._deselectAll = function(){
  var i;
  var elms = domapi.selection.elms;
  for(i=elms.length-1;i>=0;i--)
    domapi.selection._deselect(elms[i]);
};
//------------------------------------------------------------------------------
// domapi.selection._getElm
// -Traverse the DOM hierarchy until it reaches an elm, else returns null
//------------------------------------------------------------------------------
domapi.selection._getElm = function(o) {
	if (o==null) {
		return null;
	} else if (o.DA_TYPE) {
	  if ((domapi.selection._isAllowed(o))&&(o.DA_TYPE != 'control')) return o; else return "notAllowed";
	} else if ((o.nodeName !=  'HTML')&&(o.nodeName !=  'BODY')&&(o.parentNode.nodeName != 'BODY')) {
	  return domapi.selection._getElm(o.parentNode);
	}else {
	  return null;
	}
};
//------------------------------------------------------------------------------
// domapi.selection._isAllowed
// -Check if the target object is in the allowed array
//------------------------------------------------------------------------------
domapi.selection._isAllowed = function(o){
	var a = domapi.selection.allowed;
	if (!a){
		return true;
	}
	else {
		for (var i=0; i<a.length; i++){
			if(a[i]==o) {return true;}
			else if (domapi.groups.groupExists(a[i])){
				if (o.isInGroup(a[i]))
					{return true;}
				}
			}
	return false;
	}
};
//------------------------------------------------------------------------------
// domapi.selection.addAllowed
// -Add target object to allowed array, create array if needed
//------------------------------------------------------------------------------
domapi.selection.addAllowed = function(){
  for (var i=0;i<arguments.length;i++) {
    o = arguments[i];
	  if (!o.DA_TYPE && !domapi.groups.groupExists(o)) return;
	  if(!domapi.selection.allowed){
		  domapi.selection.allowed = [];
	  }
	  domapi.selection.allowed.push(o);
	}
};
//------------------------------------------------------------------------------
// domapi.selection.removeAllowed
// -Remove target object from allowed array
//------------------------------------------------------------------------------
domapi.selection.removeAllowed = function(){
	var a = domapi.selection.allowed;
	if (!a) return; //no elms have been added to allowed yet, thus allowed is still null
  for (var i=0;i<arguments.length;i++) {
    o = arguments[i];
	  a.deleteItem(a.indexOf(o));
	}
};
//------------------------------------------------------------------------------
// domapi.selection._selectElm
// -Executed when document is clicked, and records any select elms
//------------------------------------------------------------------------------
domapi.selection._selectElm = function(e){
	cs = domapi.selection;
	var select = cs._getElm(domapi.getTarget(e));
	if (select == "notAllowed")return;
	if (select) {
    //false alert the click was generated by a drag event
    if (select.selectionDrag) {
      select.selectionDrag = false;
      return;
    }
		if (!cs.elms)cs.elms = [];
		var index = cs.elms.indexOf(select);

		//if (((index != -1)&&(!domapi.keyboard.isShift())) || (!domapi.keyboard.isShift())) {
		if (!domapi.keyboard.isShift()) {
			cs._deselectAll();
			cs.elms = [];
      domapi.regHook('setX', domapi.selection._positionControls);
      domapi.regHook('setX', domapi.selection._positionChildrenControls);
      domapi.regHook('setY', domapi.selection._positionControls);
      domapi.regHook('setY', domapi.selection._positionChildrenControls);
      domapi.regHook('setW', domapi.selection._positionControls);
      domapi.regHook('setH', domapi.selection._positionControls);
      if (index != -1) return;
		}

		if (index == -1) cs._select(select); else cs._deselect(select);
  } else {
		cs = domapi.selection;
		if (cs.elms){
			cs._deselectAll();
			cs.elms = null;
			if (domapi.selection.onclearselection) domapi.selection.onclearselection();
      domapi.unRegHook('setX', domapi.selection._positionControls);
      domapi.unRegHook('setX', domapi.selection._positionChildrenControls);
      domapi.unRegHook('setY', domapi.selection._positionControls);
      domapi.unRegHook('setY', domapi.selection._positionChildrenControls);
      domapi.unRegHook('setW', domapi.selection._positionControls);
      domapi.unRegHook('setH', domapi.selection._positionControls);
		}
		return;
	}
};

domapi.selection.on();
//set default values for setControls;
 //set defaults for nulled parameters
 //domapi.selection.controls.size = domapi.rInt(size,5);;
 //csc.color = domapi.rVal(color,"green");
 //csc.offset = domapi.rInt(offset,csc.size/2);
domapi.selection.deselectOnDragOn=false;
domapi.selection.setControls(true, 5, "green");
domapi.elmProto.selectionStatus = false;

