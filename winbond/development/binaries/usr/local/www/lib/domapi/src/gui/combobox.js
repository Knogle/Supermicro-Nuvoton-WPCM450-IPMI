//==============================================
// DomAPI Combobox Component
// D. Kadrioski 11/13/2001
// (c) Nebiru Software 2001,2003
//==============================================
// additional contributors:
// Dostick
//==============================================

domapi.loadUnit(         "dropdown");
domapi.loadUnit(         "listbox" );
domapi.registerComponent("combobox");
//------------------------------------------------------------------------------
domapi.Combobox = function(arg){return domapi.comps.combobox.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.combobox.constructor = function(arg){
  var e = domapi.Component(arg,"combobox",false);
  try{
    e._constructor = domapi.comps.combobox._constructor;
    e._constructor(  arg);
    domapi._finalizeComp(e);
    domapi._private.dropdown.ensurePositionSet(e);
    e._draw(); //toddfx had a sample that needed this line if the combo was in a parent...
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.combobox._constructor = function(arg){
  var w = arg["w"]; var h = arg["h"];
  domapi._inherit(               this,"dropdown");
  this._constructor();
  domapi._inherit(               this,"combobox");
  this.value                   = domapi.rVal(arg["value"]);
  this.edit.value              = this.value;
  this.dropDown                = domapi.Listbox({
                                   parent      : this.parent,
                                   x           : 0,
                                   y           : h,
                                   w           : null,
                                   h           : domapi.rInt( arg["dropdownH"  ], 100 ),
                                   doAutoWidth : domapi.rBool(arg["doAutoWidth"], true),
                                   minWidth    : domapi.rInt( arg["minWidth"   ], 50),
                                   doAllowNoSelect : true,
                                   doIframeShield  : true
                                 });
  this.dropDown.doHLines       = arg["doLines"];
  this.dropDown.hide           = function(){this.style.visibility = "hidden";this.setX(-500);};
  var p                        = domapi._private.combobox;
  this.dropDown.onbeforechange = p.dodropdownbeforechange;
  this.dropDown.onchange       = p.dodropdownchange;
  domapi.addEvent(this,     "keydown", p.dokeydown   );
  domapi.addEvent(this,     "click",   p.doclick     );
  domapi.addEvent(this.edit,"change",  p.doeditchange);
  this.dropDown.parent         = this;
  this.dropDown.hide();
  this.dropDown.allowNoSelect  = true;
  this.setDoAutoComplete(this.doAutoComplete);
};
//------------------------------------------------------------------------------
domapi.comps.combobox._draw = function(){
  this.dropdownDraw();
  this.comboboxDraw();
};
//------------------------------------------------------------------------------
domapi.comps.combobox._free = function(){
  this.dropDown.hide           = null;
  this.dropDown.onbeforechange = null;
  this.dropDown.onchange       = null;
  this.dropDown.parent         = null;
  this._dropdownFree();
};
//------------------------------------------------------------------------------
domapi.comps.combobox.comboboxDraw = function(){this.dropDown.draw()};
//------------------------------------------------------------------------------
domapi.comps.combobox._layout = function(w,h){
  var e = this.edit;
  try{
    this._dropdownLayout(w,h);
    h = domapi.theme.skin.metrics.dropdown.h;
    e.setSize(w,h);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
// overwrite setEnabled and setDoRollover - these were defined in dropdown, but we need to add some stuff
domapi.comps.combobox.setEnabled = function(b){
  this.enabled          = b;
  this.dropBtn.enabled  = b;
  this.dropDown.enabled = b;
  this.edit.disabled    = !b;
  this.dropBtn.setEnabled(b);
};
//------------------------------------------------------------------------------
domapi.comps.combobox.setDoRollover = function(b){
  this.doRollover          = b;
  this.dropBtn.doRollover  = b;
  this.dropDown.doRollover = b;
};
//------------------------------------------------------------------------------
domapi.comps.combobox.setDoAllowEdit = function(b){
  if(domapi.isGecko){
    if(b)this.edit.removeAttribute("readonly");
    else this.edit.setAttribute("readonly", "readonly");
  }else{
    if(b)this.edit.onfocus = null;
    else this.edit.onfocus = function(){this.blur()};
  }
  if(!b && domapi.isNil(this.value) && (this.dropDown.items.length>0)){ // no items selected, select one
    this.dropDown.selectItem(0,true);
    this.close();
  }
  this.doAllowEdit = b;
};
//------------------------------------------------------------------------------
domapi.comps.combobox.setDoAutoComplete = function(b){
  domapi.assertUnit("form");
  this.doAutoComplete = b;
  if(b)
    domapi.form.autocompleteOn(this.edit,[]);
  else
    domapi.form.autocompleteOff(this.edit,[]);
  this.edit.oncomplete = domapi._private.combobox.oncomplete;
};
//------------------------------------------------------------------------------
domapi.comps.combobox.addItem = function(t,v){
  if(typeof v == "undefined")v = t;
  this.dropDown.addItem({text:t,value:v});
};
//------------------------------------------------------------------------------
domapi.comps.combobox.selectItem = function(i){
  if(domapi.trace)dump(this.toString() + '.combobox.selectItem()<--');
  var d = this.dropDown;
  try{
    i = domapi.rInt(i);
    if(i<0 || i>=d.items.length){
      if(domapi.trace)dump(this.toString() + '.combobox.selectItem() EARLY-->');
      return;
    }
    //d.selectNone();
    //HT:uncommented
    d.selectItem(i,true);
    if(domapi.trace)dump(this.toString() + '.combobox.selectItem()-->');
  }finally{
    d = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.combobox.selectItemByValue = function(i){ //Dostick
  this.dropDown.selectNone();
  this.dropDown.selectItemByValue(i,true);
};
//------------------------------------------------------------------------------
domapi.comps.combobox.setValue = function(v){
  if(domapi.trace)dump(this.toString() + '.combobox.setValue()<--');
//  v = this.getValue();
  this.value = v;
  domapi._setFormElementValue(this._formElement, String(v));
  if(this.onchange)this.onchange(this.value);
  if(domapi.trace)dump(this.toString() + '.combobox.setValue()-->');
};
//------------------------------------------------------------------------------
domapi.comps.combobox.addItems = function (s, hint) {
  //HT: added partly for autoComplete, need to have a way to intercept
  //    the changes and update _autocompleteList, there is limitation for
  //    keeping in perfect sync, but without changing a lot of listbox code, this will be best way. (hint:listbox2 is overdue)
  var isArray = s.constructor == Array;
  var isString = s.constructor == String;
  var isStringArray = isArray && (s.length > 0) && (s[0].constructor == String);
  if (isString) {
    hint = domapi.rVal(hint, ",");
    // default delimiter is comma
    this.dropDown.delimitedText(s, hint);
    if (this.doAutoComplete)
      this.edit._autocompleteList = s.split(hint).sort();
  }
  else {
    var acList = this.doAutoComplete ? this.edit._autocompleteList : false;
    for (var i = 0; i < s.length; i++) {
      if (isStringArray)
        this.addItem(s[i]);
      else 
        this.addItem(s[i].text, s[i].value);
      if (acList) 
        if (isStringArray)
          acList.push(s[i]);
        else
          acList.push(s[i].text);
    }
    if (acList) {
      acList.sort();
      acList = null;
    }
  }
};
//------------------------------------------------------------------------------
domapi.comps.combobox.clearItems = function(){
	 this.dropDown.clearItems();
   if (this.doAutoComplete)
      this.edit._autocompleteList = [];
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// private members
domapi._private.combobox.dodropdownbeforechange = function(v){ // scope is dropdown  
  return this.parent.onbeforechange(v?v.value:"");
};
//------------------------------------------------------------------------------
domapi._private.combobox.dodropdownchange = function(i){ // scope is dropdown
  var r = this.parent;
  try{
    if(!r)return;
    i = domapi.rInt(i, -1);
    if(i == -1){r = null;return;}
    var v             = i>-1?this.items[i].innerHTML:"";
    var vv            = i>-1?this.items[i].value:"";		// line added by Dostick  
    if(typeof r.onbeforechange != "function")return;
    if(!r.onbeforechange(vv)){r = null;return;}
    if(domapi.trace)dump(this.toString() + '.combobox.dodropdownchange()<--');  
    r.setValue(    vv);
    r.edit.value = v;
    if(r.autoClose && this.visible){
      this.hide();
      r.opened        = false;
      r.dropBtn.title = domapi.getString("DROPDOWN_OPEN");
    }
    if(r.doAllowEdit){
      r._ignoreChange = true;
      r.edit.select();
      r.edit.focus();
      r._ignoreChange = false;
    }
  //  r._onchange(vv);
    if(domapi.trace)dump(this.toString() + '.combobox.dodropdownchange()-->');
  }finally{
    r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.combobox.doeditchange = function(E){ // scope is edit
  var e = domapi.findTarget(E,"INPUT");
  try{
    domapi.preventBubble(E);
    if(!e)return;
    var p = e.parentNode;
    if(p._ignoreChange)return;
    if(!p.onbeforechange(e.value)){
      e.value = p.value;
      return;
    }
    p.setValue(e.value);
    //  p._onchange(e.value);
  }finally{
    e = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.combobox.doclick = function(E){
  var r = domapi.findTarget(E,"COMBOBOX");
  try{
    if(!r || !r.enabled)return;
    var e = domapi.findTarget(E,"INPUT");
    if(e && !r.doAllowEdit)r.open();
    if(r.focus)r.focus();
  }finally{
    e = null; r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.combobox.dokeydown = function(E){
  if (!E) E = window.event;
  var k = domapi.isIE?E.keyCode:E.which;
  var altKey  = E.altKey;
  var ctrlKey  = E.ctrlKey;
  if(domapi.trace)dump('domapi._private.combobox.dokeydown<-- ' + k + " alt: " + altKey);
  var r = domapi.findTarget(E,"COMBOBOX");
  try{
    if(!r || !r.enabled)return;
    var d = r.dropDown;
    //HT:wire up more stuff and add else to speed up
    //pass the fake event to the listbox if it is opened
    if(r.opened && !altKey && (k == 38 || k == 40) ) {
      //HT: this block could become cloneEvent in the core; or protoype.clone
      var E2 ={};
      if (domapi.isIE) {
        E2.srcElement = r.dropDown;
        E2.keyCode=k;
      } else {
        E2.target = r.dropDown._daTabEdit;
        E2.which=k;
    }
      domapi._private.listbox.dokeydown(E2);
      r.edit.focus();
    }
    //add support of alt down 
    else if (k==40 && altKey) {
      if (r.opened)
       r.close();
      else
        r.open();
    }
    //close is ok, not sure if firing change is need,
    //the onchange is not the same between windows control, html and domapi, in general should
    //follow html.
    else if (k==13) {
     if (r.opened) 
      r.close();
     //else
     // domapi._private.combobox.doeditchange(E);
    } else if (r.doAutoComplete && !(ctrlKey|| altKey) && !domapi.form.isSpecialKey(k) ){
      //domapi.form._autocompleteKey(E);
    }
    //this list will growth
    if(k == 38 || k == 40){
      if(E && E.preventDefault)E.preventDefault();
      return false;
    }  
  }finally{
    r = null; d = null;
  }
};
//------------------------------------------------------------------------------ 
domapi._private.combobox.oncomplete = function(i){
  var r = domapi.findParent(this, "COMBOBOX");
  if (1 >=0) {
  	r.setValue(this._autocompleteList[i]);
    if (r.opened) {
      //HT:want a slience way to do this, but listbox code need a major update to enable this
      //   this is a dirty way for now
      r.dropDown.onchange = function(i){};
      r.selectItemByValue(this._autocompleteList[i]);
      r.dropDown.onchange = domapi._private.combobox.dodropdownchange;
    }
  }
  //need to settle on what to send out later on.
  if (r.oncomplete) r.oncomplete(i);
};
//------------------------------------------------------------------------------ 

