//------------------------------------------------------------------------------
// DomAPI form routines
// D. Kadrioski 9/17/2003
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// Auto-complete routines inspired by a work by Nicholas C. Zakas
// http://www.sitepoint.com/article/1220
//------------------------------------------------------------------------------

domapi.form = {};

//------------------------------------------------------------------------------
// helper routines
//------------------------------------------------------------------------------
domapi.form.selectedRadio = function(f){
  for(var a=0;a<f.length;a++)
    if(f[a].checked)return a;
  return -1;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Autocomplete
//------------------------------------------------------------------------------
domapi.form.autocompleteOn = function(e,L){
  e._autocompleteList = L;
  domapi.addEvent(e,"keypress",domapi.form._autocompleteKey,false);
};
//------------------------------------------------------------------------------
domapi.form.autocompleteOff = function(e){
  e._autocompleteList = null;
  domapi.removeEvent(e,"keypress",domapi.form._autocompleteKey,true);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Masked edit
//------------------------------------------------------------------------------
/*  working notes:

 _ = wild
 a = alpha
 A = alphanumeric
 9 = digit
 
 all others are taken literally
 
 phone = (999)999-9999 = '(   )   -    '
 soc   = 999-99-9999   = '   -  -    '
 date  = 99/99/9999    = '  /  /    ' 
*/
domapi.form.maskededitOn = function(e,mask){
  e.editmask   = mask;
  e.value      = domapi.form._maskededitFormatMask(mask);
  e.isComplete = domapi.form._isComplete;
  domapi.addEvent(e,"keypress",domapi.form._maskededitKeypress,false);
  domapi.addEvent(e,"keyup",   domapi.form._maskededitKeyup,   false);
  domapi.addEvent(e,"focus",   domapi.form._maskededitEnter,   false);
};
//------------------------------------------------------------------------------
domapi.form.maskededitOff = function(e){
  e.editmask = null;
  domapi.removeEvent(e,"keypress",domapi.form._maskededitKeypress,false);
  domapi.removeEvent(e,"keyup",   domapi.form._maskededitKeyup,   false);
  domapi.removeEvent(e,"focus",   domapi.form._maskededitEnter,   false);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Selection manipulation
//------------------------------------------------------------------------------
// will select from i to j characters in control e
domapi.form.inputSelectRange = function (e, i, j){
  i = domapi.rInt(i,1);
  j = domapi.rInt(j,e.value.length);
  if(domapi.isIE){
    var oRange = e.createTextRange();
    oRange.moveStart("character", i);
    oRange.moveEnd(  "character", -e.value.length + j);
    oRange.select();
  }else e.setSelectionRange(i, j);
  e.focus();
};
//------------------------------------------------------------------------------
// will replace selected characters in control e
domapi.form.inputReplaceSelection = function(e, v){
  if(domapi.isIE){
    var r  = document.selection.createRange();
    r.text = v;
    r.collapse(true);
    r.select();
  }else{
    var i   = e.selectionStart;
    e.value = e.value.substring(0, i) + v + e.value.substring(e.selectionEnd, e.value.length);
    e.setSelectionRange(i + v.length, i + v.length);
  }
  e.focus();
};
//------------------------------------------------------------------------------
domapi.form.caretPos = function(e){
  if(domapi.isIE){
    var i = e.value.length + 1;
    if(e.createTextRange){
      var theCaret = document.selection.createRange().duplicate();
      while (theCaret.parentElement() == e && theCaret.move("character",1)==1) --i;
    }
    return i == (e.value.length + 1)?-1:i-1;
  }else
    return e.selectionStart;
};
//------------------------------------------------------------------------------
//-- HT: made public. seem useful to move to core.
domapi.form.isSpecialKey = function(k){
  switch(k){
    case  0 : // unknown (null)
    case  8 : // backspace
    case  9 : // tab    
    case 13 : // enter
    case 16 : // shift
    case 17 : // ctrl
    case 18 : // alt
    case 20 : // caps lock
    case 27 : // esc
    case 33 : // page up
    case 34 : // page down
    case 35 : // end
    case 36 : // home
    case 37 : // left arrow
    case 38 : // up arrow
    case 39 : // right arrow
    case 40 : // down arrow
    case 46 : // delete
      return true;
    default :
      return false;
  }
};
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi.form._autocompleteKey = function(E){
  var e = domapi.findTarget(E,"INPUT");
  var k = domapi.isIE?event.keyCode:E.which;//E.charCode;
  //HT: add support for control-space
  var cs = (k==32)&&event.ctrlKey; //Control-Space
  var ctrlKey = domapi.isIE?(event.ctrlKey):(E.ctrlKey || E.altKey);
  if(domapi.form.isSpecialKey(k) || (ctrlKey && !cs))return true; // take no action, let the keystroke surface

  if (!cs)
    domapi.form.inputReplaceSelection(e, String.fromCharCode(k));
  var len = e.value.length;
  var m   = domapi.form._autocompleteMatch(e.value, e._autocompleteList, e.casesensitive);
  if(m>=0){
    e.value = e._autocompleteList[m];
    domapi.form.inputSelectRange(e, len, e.value.length);
  }
  //HT, trigger oncomplete even it is not found
  if(e.oncomplete) e.oncomplete(m); // returns index in list
  if(E && E.preventDefault)E.preventDefault(); // for moz
  return false; // for non moz
};
//------------------------------------------------------------------------------
domapi.form._autocompleteMatch = function(v, L, cS){
  for (var i=0; i<L.length; i++){
    if(cS){
      var s1 = L[i];
      var s2 = v;
    }else{
      var s1 = L[i].toLowerCase();
      var s2 = v.toLowerCase();
    }
    if(s1.indexOf(s2) == 0)return i;
  }
  return -1;
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
domapi.form._maskededitFormatMask = function(m){ // filter non display characters
  var r = m;
  r = m.replace(new RegExp("[A9_]", "gi"), " ");
  return r;
};
//------------------------------------------------------------------------------
domapi.form._maskExclude = function(s){
  return (s == "9") || (s == "A") || (s == "a") || (s == "_");
};
//------------------------------------------------------------------------------
domapi.form._maskededitSelect = function(e, i){
  // starts selecting from i until first non map char found
  // doesn't start counting until after first non map item
  var i1, i2, mC, j;
  var v = e.value;
  var m = e.editmask;
  
  for(j=i;j<v.length;j++){
    mC = m.charAt(j);//out(mC)
    i1 = j;
    if(domapi.form._maskExclude(mC))
      break;
  }
  for(j=i1;j<v.length;j++){
    mC = m.charAt(j);
    i2 = j;
    if(!domapi.form._maskExclude(mC))
      break;
  }
  domapi.form.inputSelectRange(e, i1, i2);
};
//------------------------------------------------------------------------------
domapi.form._validChar = function(vC, M, i){
  function isAlpha(s){       return String(s).match(new RegExp("[a-z]{1}",   "i"))};
  function isDigit(s){       return String(s).match(new RegExp("\\d{1}",     "i"))};
  function isAlphaNumeric(s){return String(s).match(new RegExp("[a-z0-9]{1}","i"))};

  var mC = M.charAt(i);
  switch(mC){
    case "_" : if(vC != ' '         )return true; break; // match
    case "9" : if(isDigit(vC)       )return true; break; // match
    case "a" : if(isAlpha(vC)       )return true; break; // match
    case "A" : if(isAlphaNumeric(vC))return true; break; // match
    default  : if(vC == mC)          return true; break; // match
  }
  return false;
};
//------------------------------------------------------------------------------
domapi.form._isComplete = function(){
  if(this.value.length != this.editmask.length)return false;
  for(var i=0;i<this.editmask.length;i++)
    if(!domapi.form._validChar(this.value.charAt(i), this.editmask, i))return false;
  return true;
};
//------------------------------------------------------------------------------
domapi.form._maskededitEnter = function(E){
  // select everything after the first non mask char
  var e = domapi.findTarget(E,"INPUT");
  domapi.form._maskededitSelect(e, 0);
};
//------------------------------------------------------------------------------
function out(s){
  domapi.getElm("test").innerHTML += s + "<br />";
};
//------------------------------------------------------------------------------
domapi.form._maskededitKeyup = function(E){
  var e = domapi.findTarget(E,"INPUT");
  var k = domapi.isIE?event.keyCode:E.which;
  var ctrlKey = domapi.isIE?(event.ctrlKey):(E.ctrlKey || E.altKey);
  if(domapi.form.isSpecialKey(k) || ctrlKey){
    if(e.isComplete()){
      if(e.oncomplete)e.oncomplete();
    }else if(e.onincomplete)e.onincomplete();
  }
};
//------------------------------------------------------------------------------
domapi.form._maskededitKeypress = function(E){
  var e = domapi.findTarget(E,"INPUT");
  var k = domapi.isIE?event.keyCode:E.which;
  var ctrlKey = domapi.isIE?(event.ctrlKey):(E.ctrlKey || E.altKey);
  if(domapi.form.isSpecialKey(k) || ctrlKey)return true; // take no action, let the keystroke surface

  // clear from caret to end, we need to remove all characters past caret
  var i = domapi.form.caretPos(e);//out(i)
  while(i < e.editmask.length && !domapi.form._maskExclude(e.editmask.charAt(i))){
    domapi.form.inputSelectRange(e,i,1);
    domapi.form.inputReplaceSelection(e, e.editmask.charAt(i));
    i++;
  }
  if(domapi.form._validChar(String.fromCharCode(k), e.editmask, i)){
    domapi.form.inputSelectRange(e,i,e.value.length);
    domapi.form.inputReplaceSelection(e, String.fromCharCode(k));
    
    var M = domapi.form._maskededitFormatMask(e.editmask);
    // put back the mask past the caret
    e.value += M.substr(i+1, M.length);
    // select the next portion
    domapi.form._maskededitSelect(e, i+1);
  }
  if(e.isComplete()){
    e.select();
    if(e.oncomplete)e.oncomplete();
  }else if(e.onincomplete)e.onincomplete();
  if(E && E.preventDefault)E.preventDefault(); // for moz
  return false; // for non moz
};
//------------------------------------------------------------------------------