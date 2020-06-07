//------------------------------------------------------------------------------
// DomAPI Menubar Component
// D. Kadrioski 10/05/2001
// (c) Nebiru Software 2001-2003
//------------------------------------------------------------------------------
// additional contributors
// S. Edwards <simon@gx.nl>
//------------------------------------------------------------------------------

domapi.loadUnit(         "popupmenu");
domapi.registerComponent("menubar");
//------------------------------------------------------------------------------
domapi.Menubar = function(arg){return domapi.comps.menubar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.menubar.constructor = function(arg){
  var e              = domapi.Component(arg,"menubar");
  var s              = e.style;
  try{
    e.items            = e.childNodes;
    e.opened           = false;
    e.setZ(              1);
    e.isOpened         = false;
    e.hideAllMenus     = domapi.comps.popupmenu.hideAllMenus;  
    domapi.disallowSelect( e);

    // GX SBE
    e.lastmenupositionx = -1;
    e.lastmenupositiony = -1;

    e.openedItem = null;

    var p = domapi._private.menubar;
    domapi.addEvent(e, "mouseover",  p.domouseover);
    domapi.addEvent(e, "mousedown",  p.domousedown);
    domapi.addEvent(e, "click",      p.doclick    );

    domapi._finalizeComp(e);
    return e;
  }finally{
    s = null;
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.menubar._free = function(){
  for(var i=0;i<this.items.length;i++){
    this.items[i].parent     = null;
    this.items[i].owner      = null;
    this.items[i].childMenu  = null;
    this[this.items[i].name] = null;
  }
  this.owner      = null;
  this.items      = null;
  this.timer      = null;
  this.onselected = null;
  this.openedItem = null;
};
//------------------------------------------------------------------------------
domapi.comps.menubar._draw = function(){
  this.menubarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.menubar._layout = function(){};
//------------------------------------------------------------------------------
domapi.comps.menubar.menubarDraw = function(){
};
//------------------------------------------------------------------------------
domapi.comps.menubar.addItem = function(arg){
  var e = document.createElement("A");
  try{
    e.DA_TYPE   = "DA_MENUBUTTON";
    e.className = "DA_MENUBUTTON";
    domapi._assert(arg, "visible", true);
    domapi._assert(arg, "text", "Menuitem" + this.items.length+1);
    domapi._assert(arg, "name", String("mi " + arg.text).toMixedCase());
    domapi._assert(arg, "enabled", true);
    e.innerHTML = arg.text;
    
    this.appendChild(e);
    if(domapi.isIE)e.href=""; // need to trick it to activate hover
  
    if(!domapi.isKHTML){
      delete(arg["x"]);
      delete(arg["y"]);
      delete(arg["text"]);
    }
    try{
      for(var i in arg)
        e[i] = arg[i];
    }catch(E){
      throw new Error("Error applying '" + i + "=" + arg[i] + "' in domapi.comps.popupmenu.addItem():\n" + E.message);
    }
    if(!this[e.name])this[e.name] = e; //  allows for menu1[menuName] notation
    if(!e.enabled)this.setEnabled(e, false);
    if(!e.visible)this.hideItem(e);
    e.childMenu = domapi.Popupmenu({doShadow:this.doShadow, doImages:this.doImages});
    e.addItem = domapi.comps.popupmenu.closeMenus.addItem;
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.menubar.openItem = function(i){
  var I = domapi._private.popupmenu._getItem(this,i);
  try{
    // GX SBE
    this.closeLastItem();
  
    // GX SBE
    this.openedItem = I; 
    this.positionMenu(I);
    I.className = "DA_MENUBUTTON_ACTIVE";
    this.opened             = true;
    if(this.onselected)this.onselected(I);
  }finally{
    I = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.menubar.closeItems = function(){
  var c = this.items;
  try{
    for(var i=0;i<c.length;i++){
      c[i].childMenu.closeMenus();
      c[i].className = (c[i].enabled?"DA_MENUBUTTON":"DA_MENUBUTTON_DISABLED");
      c[i].childMenu.hide();
    }
    this.opened = false;
  }finally{
    c = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.menubar.closeLastItem = function(){
  if(this.openedItem)try{
    var I = this.openedItem;
    I.childMenu.closeMenus();
    I.className     = (I.enabled?"DA_MENUBUTTON":"DA_MENUBUTTON_DISABLED");
    I.childMenu.hide();
    this.openedItem = null;
    this.opened     = false;
  }finally{
    I = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.menubar.positionMenu = function(i){
  var I = domapi._private.popupmenu._getItem(this,i);
  try{
    var x,y;
    var m = I.childMenu;
    if(!m.added){
      if(!m.parent)m.parent = document.body;
      m.parent.appendChild(m);
      m.added = true;
    }
    m._layout();
    x = I.offsetLeft + (domapi.isIE?0:1) + this.popupX;
    y = this.getH()  - (domapi.isIE?2:2) + this.popupY;
    var o = domapi.getTrueOffset(this);
    x += o[0]; y += o[1];
    m.bringToFront();
    m.moveTo(x,y);
    if(m.doShadow)domapi.shadow._showShadow(m);
  }finally{
    I = null;
    m = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.menubar.setEnabled = function(i,b){
  var I = domapi._private.popupmenu._getItem(this,i);
  try{
    I.disabled  = !b;
    I.enabled   = b;
    I.className = b?"DA_MENUBUTTON":"DA_MENUBUTTON_DISABLED";
    if(I.childNodes[0].setIndex)I.childNodes[0].setIndex(b?0:1);
  }finally{
    I = null;
  }
};
//------------------------------------------------------------------------------
// private members
domapi._private.menubar.domouseover = function(E){
  var e = domapi.findTarget(E,"A");
  try{
    if(!e || !e.enabled)return;
    var r = domapi.findTarget(E,"MENUBAR");
    if(r.opened)
      r.openItem(domapi.getNodeIndex(e));
  }finally{
    e = null; r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.menubar.domousedown = function(E){
  var e = domapi.findTarget(E,"A");
  try{
    if(!e)return;
    if(e.disabled)return;
    var r = domapi.findTarget(E,"MENUBAR");
    if(r.opened)
        // GX SBE
      r.closeLastItem();
    else
      r.openItem(domapi.getNodeIndex(e));
    return false;
  }finally{
    e = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.menubar.doclick = function(E){return false;};
//------------------------------------------------------------------------------
domapi._private.menubar._getItem = function(e, i){
  if(typeof i == "number")return e.items[i];
  else return i;
};
//------------------------------------------------------------------------------
domapi.comps.menubar.loadFromJson = function(J){
  var i, A, j, e;
  try{
    for(i in J){
      if(i == "items"){
        A = J[i];
        for(j=0;j<A.length;j++){
          e = this.addItem(A[j]);
          if(A[j].childMenu)
            e.childMenu.loadFromJson(A[j].childMenu);
        }
      }else this[i] = J[i];
    }
  }finally{
    A = null;e = null;
  }
};
//------------------------------------------------------------------------------