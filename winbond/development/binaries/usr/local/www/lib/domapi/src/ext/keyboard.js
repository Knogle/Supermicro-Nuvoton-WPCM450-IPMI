//------------------------------------------------------------------------------
// DomAPI - Keyboard
// Mark Proctor
// (c) Mark Proctor 2001-2002
//------------------------------------------------------------------------------
// Contributors:
// Mark Proctor
// Peter Howarth
//------------------------------------------------------------------------------
// Created       28/06/2002
// Last Modified 13/08/2002
//------------------------------------------------------------------------------
// History
// 28/06/2002 - First draft created (Phil Mudd)
// 01/07/2002 - Review and general code update (Mark Proctor)
//            - Multiple key presses now allowed (Mark Proctor)
// 03/07/2002 - ie executes its events in reverse to mozilla. To make sure
//              sure a user keyboard event is fired after recordKey and clearKey
//              have created event hooks, that the user adds their function too. (Mark Proctor)
// 05/08/2002 - Fixed the onkeyup issue when alerts happen, by attaching onblue event to the window (Mark Proctor)
//            - Added addEvent and removeEvent to allow functions to executed when a specific key is pressed  (Mark Proctor)
// 13/08/2002 - Marked more functions as inernal with an undersdomapi. (Mark Proctor)
//------------------------------------------------------------------------------
// To Do
// -Keyboard events only fire for a specific key, need to get it to fire for keyboard combinations too
//------------------------------------------------------------------------------

domapi.keyboard	        = {};
domapi.keyboard.keys    = [];
domapi.keyboard.lastKey = null;
domapi.keyboard._shift	= false;
domapi.keyboard._ctrl	  = false;
domapi.keyboard._events = {};


//------------------------------------------------------------------------------
// Registers the keyboard events
//------------------------------------------------------------------------------
domapi.keyboard.on = function () {
  domapi.addEvent(document,"keydown",domapi.keyboard._keyDown,true);
  domapi.addEvent(document,"keyup",domapi.keyboard._keyUp,true);
  domapi.addEvent(window,"blur", domapi.keyboard._clearAllKeys, true);
};

//------------------------------------------------------------------------------
// Called during the keydown event and calls the recordKey function
//------------------------------------------------------------------------------
domapi.keyboard._keyDown = function(e) {
  e = (domapi.isIE) ? window.event : e;
  domapi.keyboard._recordKey(e.keyCode, e.ctrlKey, e.shiftKey, e.metaKey);
  if (domapi.keyboard.onkeydown) domapi.keyboard.onkeydown();
};

//------------------------------------------------------------------------------
// Called during the keyup event and calls the recordKey function
//------------------------------------------------------------------------------
domapi.keyboard._keyUp = function(e) {
  e = (domapi.isIE) ? window.event : e;
  domapi.keyboard._clearKey(e.keyCode, e.ctrlKey, e.shiftKey, e.metaKey);
  if (domapi.keyboard.onkeyup) domapi.keyboard.onkeyup();
};

//------------------------------------------------------------------------------
// Removes the keyboard events
//------------------------------------------------------------------------------
domapi.keyboard.off = function() {
  domapi.removeEvent(document,"keydown",domapi.keyboard._onKeyDown,true);
  domapi.removeEvent(document,"keyup",domapi.keyboard._onKeyUp,true);
};

//------------------------------------------------------------------------------
// Records the current pressed key in an array
//------------------------------------------------------------------------------
domapi.keyboard._recordKey = function(keyCode, ctrlKey, shiftKey, metaKey){
  var c = domapi.keyboard;
  c.shift = shiftKey ? true : false;
  c.ctrl = ctrlKey ? true : false;
  if (keyCode) {
    var exists = false;
    for (var k=0;k<c.keys.length;k++) {
      if (c.keys[k] == keyCode) exists = true;
    }
    if ((!exists)||(c.keys.length == 0)) {
      c.keys[c.keys.length] = keyCode;
      var key = String.fromCharCode(keyCode);
      key = key.toUpperCase();
      c.lastKey = key;
      domapi.keyboard._dispEvents(key);
    }
  }
};

//------------------------------------------------------------------------------
// When a key press is released the key is removed from the array
//------------------------------------------------------------------------------
domapi.keyboard._clearKey = function(keyCode, ctrlKey, shiftKey, metaKey) {
  var c = domapi.keyboard;
  c.shift = shiftKey ? true : false;
  c.ctrl = ctrlKey ? true : false;
  if ((c.keys.length == 1)&&(c.keys[0] == keyCode)) {
    c.keys.deleteItem(0);
  } else {
    for (var k=0;k<c.keys.length;k++) {
      if (c.keys[k] == keyCode) c.keys.deleteItem(k);
    }
  }
};
//------------------------------------------------------------------------------
// When a key press is released the key is removed from the array
//------------------------------------------------------------------------------
domapi.keyboard._clearAllKeys = function() {
  var c = domapi.keyboard;
  for (var i=0;i<c.keys.length;i++) {
    if (domapi.keyboard.onkeyup) domapi.keyboard.onkeyup();
  }
  c.shift = false;
  c.ctrl = false;
  c.keys = new Array();
};
//------------------------------------------------------------------------------
// Attach a function event to a key
//------------------------------------------------------------------------------
domapi.keyboard.addEvent = function(key, func) {
  var c = domapi.keyboard;
  e = c._events[key.toUpperCase()];
  if (e)e[e.length] = func;
  else c._events[key.toUpperCase()] = [func];
};
//------------------------------------------------------------------------------
// Remove a function event from a key
//------------------------------------------------------------------------------
domapi.keyboard.removeEvent = function(key,func){
  var c = domapi.keyboard;
  e = c._events[key.toUpperCase()];
  if(!e)return 0;
  var i = e.indexOf(func);
  if(i==-1)return 0;
  e.deleteItem(i);
  return 1;
};
//------------------------------------------------------------------------------
// Execute all function Events added to a key
//------------------------------------------------------------------------------
domapi.keyboard._dispEvents = function(key){
  var c = domapi.keyboard;
  e = c._events[key];
  if(!e)return;
  //var args = arguments.callee.caller.arguments;
  for(var a=0;a<e.length;a++)
    e[a](key);
};
//------------------------------------------------------------------------------
// isShift
//------------------------------------------------------------------------------
domapi.keyboard.isShift = function() {
	return domapi.keyboard.shift;
};

//------------------------------------------------------------------------------
// isCtrl
//------------------------------------------------------------------------------
domapi.keyboard.isCtrl = function() {
	return domapi.keyboard.ctrl;
};

//------------------------------------------------------------------------------
// isKey
//------------------------------------------------------------------------------
domapi.keyboard.isKey = function(key){
  var c = domapi.keyboard;
  var exists = false;
  for (var k=0;k<c.keys.length;k++) {
    var a = String.fromCharCode(c.keys[k]);
    // keyCode only returns the upper ASCII code for each key press
    if (a.toUpperCase() == key.toUpperCase()) exists = true;
    //alert(true);
  }
	return exists;
};

//------------------------------------------------------------------------------
// Keyboard is turned on by default when starting the application
//------------------------------------------------------------------------------
domapi.keyboard.on();

	