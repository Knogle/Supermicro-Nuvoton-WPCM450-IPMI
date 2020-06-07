//------------------------------------------------------------------------------
// DomAPI domapi routines (css)
// D. Kadrioski 10/6/2002
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

if(!document.styleSheets.length) document.write('<style type="text/css"><\/style>');

//------------------------------------------------------------------------------
function TCSS(){
  this.index = 0;
  this.sheet = null;
  this.rules = null;
};
//------------------------------------------------------------------------------
TCSS.prototype.init = function(sheetIndex){
  this.index = domapi.rInt(sheetIndex);
  this.sheet = document.styleSheets[this.index];
  this.rules = this.getRules(this.sheet);
};
//------------------------------------------------------------------------------
TCSS.prototype._free = function(){
  this.rules = null;
  this.sheet = null;
};
//------------------------------------------------------------------------------
TCSS.prototype.getRules = function(sheet){
  return domapi.isIE?sheet.rules:sheet.cssRules;
};
//------------------------------------------------------------------------------
TCSS.prototype.findRule = function(selector){
  for(var a=0;a<this.rules.length;a++)
    if(this.rules[a].selectorText.toUpperCase() == selector.toUpperCase())
      return a;
  return -1;
};
//------------------------------------------------------------------------------
// B. Tudball - modified to accept index
TCSS.prototype.addRule = function(selector,body,overwrite,index){
//dump([selector,body,overwrite,index])
  var i = domapi.rInt(index,-1);
  if(overwrite && i>-1)
    this.removeRule(i);
  else if(overwrite)
    this.removeRule(selector);
  if(domapi.isIE)
    this.sheet.addRule(selector,body,i);
  else
    this.sheet.insertRule(selector + "{" + body + "}",this.rules.length,index);
  return this.rules.length-1;
};
//------------------------------------------------------------------------------
// B. Tudball - modified to pass selector
TCSS.prototype.removeRule = function(selector){
  if(isNaN(selector))
    var i = this.findRule(selector);
  else
    var i = selector;
  if(i<0)return false;
  if(domapi.isIE)
    this.sheet.removeRule(i);
  else
    this.sheet.deleteRule(i);
  return true;
};
//------------------------------------------------------------------------------
TCSS.prototype.modifyRule = function(selector, values){ // values is a standard css string
  var i, j, A;
  if(isNaN(selector))
    i = this.findRule(selector);
  else
    i = selector;
  if(i<0)return false;
  values = values.split(";");
  for(j=0;j<values.length;j++){
    A = values[j].split(":");
    if(A.length == 2)this.rules[i].style[A[0]] = A[1];
  }
};
//------------------------------------------------------------------------------
domapi.css = new TCSS();
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// a collection of routines for manipulating class values containing multiple classNames
// for instance, e.className = "DA_COMPONENT DA_BUTTON"; 
// domapi.css.removeClass(e, "DA_BUTTON");
//------------------------------------------------------------------------------
domapi.css.hasClass = function(e, cname){
  //var re = new RegExp("[^\s]+" + cname + "[$\s]+", "i");
  var re = new RegExp( cname , "i");
  return re.test(e.className);
};
//------------------------------------------------------------------------------
domapi.css.addClass = function(e, cname, optionalBool){
  if(!e || typeof e.className == "undefined")return;  
  this.removeClass(e, cname);
  if(arguments.length == 3 && !optionalBool)return; // just wanted to remove it
//  domapi.dump([domapi.css.hasClass(e, cname), e.className]);
  if(domapi.css.hasClass(e, cname))return; // nothing to add
  var a = String(e.className).split(" ");
  a.push(cname);
  try{
    e.className = String(a.join(" ")).trim();
  }catch(E){ /* safari 1.2 would sometimes choke here */ };
};
//------------------------------------------------------------------------------
domapi.css.removeClass = function(e, cname){
  if(!e || typeof e.className == "undefined")return;
  if(!domapi.css.hasClass(e, cname))return; // nothing to remove
  var a = String(e.className).split(" ");
  a.deleteValue(cname);
  try{
    e.className = String(a.join(" ")).trim();
  }catch(E){ /* safari 1.2 would sometimes choke here */ };
};
//------------------------------------------------------------------------------
domapi.css.replaceClass = function(e, cname1, cname2){
  this.removeClass(e, cname1);
  this.addClass(   e, cname2);
};
//------------------------------------------------------------------------------