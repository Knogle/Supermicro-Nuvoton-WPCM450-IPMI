//==============================================
// DomAPI Component Template
// D. Kadrioski 6/21/2003
// (c) Nebiru Software 2001,2003
//==============================================

/*
  This is intended as a starting point for creating your own components.
  Save a copy of this template off in a file named after your component.
  Replace all occurances of "compname" with your component name.
  Pay attention to case.  The constructor function will have the first
  letter in uppercase, all other instances are lower.
  For the constructor, only the first letter should be upper case, do
  not include any others such as CompName.
  
  Each instance automatically inherits all the Elm and Component members.
  You should make yourself familiar with them to harness the full power
  of the component model.
*/

domapi.registerComponent("compname");
//------------------------------------------------------------------------------
domapi.Compname = function(arg){return domapi.comps.compname.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.compname.constructor = function(arg){
  // enforce any mandatory values.  replace with defaults if missing
  arg["w"] = domapi.rInt(arg["w"],80);

  // create the component instance and assign to local variable "e"
  var e = domapi.Component(arg,"compname");
  
  // create any child elements, etc...
  e.someChild = document.createElement("DIV");
  
  // apply any styling, properties, etc....  
  e.someChild.style.cursor = "default";
  
  // attach any child elements we created
  r.appendChild( e.someChild);

  // attach any event handlers
  var p = domapi._private.compname;
  domapi.addEvent(e,"mouseover",p.domouseover);
  domapi.addEvent(e,"mouseout" ,p.domouseout );

  // finalize the component and return the instance
  domapi._finalizeComp( e);
  return e;
};
//------------------------------------------------------------------------------
/* every component should have a _draw method that points to another method
   named compnameDraw.  This is done so that someone could subclass this 
   component and still be able to call it's ancestors draw method.  */
domapi.comps.compname._draw = function(){
  this.compnameDraw();
};
//------------------------------------------------------------------------------
/* compnameDraw is responsible for all rendering of the component */
domapi.comps.compname.compnameDraw = function(){
  var t         = domapi.theme;
  var s         = this.style;
  var b         = this.doBorder?parseInt(t.border.width):0;
  this.setB(      b);
  s.borderStyle = this.doBorder?t.border.solid:"none";
  this.setBgColor((this.doBGFill && !domapi.doSkin)?t.fonts.buttonface.bgcolor:"transparent");
};
//------------------------------------------------------------------------------
/* Every component should have a _layout method.  This method should be used to
   position any child elements.  Do not place any code that positions elements 
   into the draw method, but instead put them in here.  This separation helps
   optimize performance. */
domapi.comps.compname._layout = function(w,h){
  var b = domapi.isNS?(domapi.theme.border.width*4):0;
  var ww   = domapi.theme.skin.s.metrics.button.endW;

  this.cellL.style.width = ww - 1 + "px";
  this.cell.style.width  = w - (ww*2) - b + "px";
  this.cellR.style.width = ww - 1 + "px";
};
//------------------------------------------------------------------------------
/* Here is an example of a class member, you'll likely create many more.  
   Every member placed in the domapi.comps collection under this compname is 
   automatically assigned to each new instance. */
domapi.comps.compname.setValue = function(v){
  this.value = v;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
/* all event handlers should be stored in the _private container.  You can also
   store any class members that you don't want automatically assigned to each
   instance.  Any that you want automatically assigned should go in the
   domapi.comps collection instead. */
domapi._private.compname.domouseover = function(E){
  var e = domapi.findTarget(E,"COMPNAME");
  if(!e)return;
  if(!e.doRollover || !e.enabled)return;
  var f = domapi.theme.fonts.highlight;
  if(e.doRolloverFill && e.doBGFill)e.setBgColor(f.bgcolor);
  e.setColor(f.color);
};
//------------------------------------------------------------------------------
domapi._private.compname.domouseout = function(E){
  var e = domapi.findTarget(E,"COMPNAME");
  if(!e)return;
  if(!e.doRollover || !e.enabled)return;
  var f = domapi.theme.fonts.buttonface;
  if(e.doRolloverFill && e.doBGFill)e.setBgColor(f.bgcolor);
  e.setColor(f.color);
};
//------------------------------------------------------------------------------
