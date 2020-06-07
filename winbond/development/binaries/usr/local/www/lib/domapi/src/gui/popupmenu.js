//------------------------------------------------------------------------------
// DomAPI Menu Component
// D. Kadrioski 7/30/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------

/*
  NOTES:
  If you are support IE5.0, you must include "w", it will not autosize.  For all
  other browsers, do not specify w,h,x,y
*/

domapi.loadUnit("shadow");
domapi.loadUnit("imagelistlite");
//--------------------------
domapi.registerComponent("popupmenu");
//------------------------------------------------------------------------------
domapi.Popupmenu = function(arg){return domapi.comps.popupmenu.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.constructor = function(arg){
  arg.w          = domapi.rInt(arg["desiredW"],100);
  arg.h          = 10;
  var p          = arg["parent"];
  arg.parent     = null;
  var e          = domapi.Component(arg,"popupmenu");
  try{
    e.items        = e.childNodes;
    e.setP(          1);
    e.setM(          1);
    e.setZ(          p?p.style.zIndex:10);
    e.style.cursor = "default";
    e.timer        = null;
    e.setZ(          16383);

    if(e.doShadow)domapi.shadow.dropShadow(e);
    var p = domapi._private.popupmenu;
    domapi.addEvent(e, "mouseover", p.domouseover);
    domapi.addEvent(e, "mouseout",  p.domouseout);
    domapi.addEvent(e, "click",     p.doclick);
    if(domapi.bags.popupmenu.length == 1)
      domapi.addEvent(document, "click", p.dodocumentclick);

    e.hide();

    domapi.disallowSelect(e);
    e.skipAdd = true;
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu._free = function(){
  for(var i=0;i<this.items.length;i++){
    if(this.items[i].childMenu){
      this.items[i].childMenu.owner = null;
      this.items[i].childMenu       = null;
      this.items[i]._iframeShield   = null;
    }
    if(this.items[i].popupmenu){
      this.items[i].popupmenu.owner = null;
      this.items[i].popupmenu       = null;
    }
    this.items[i].parent          = null;
    this.items[i].oncontextmenu   = null;
    this.items[i].radioGroup      = null;
    this.items[i].setIndex        = null;
    this.items[i].setChecked      = null;
    this.items[i].onselected      = null;
    this.items[i].owner           = null;
    this[this.items[i].name]      = null;
    if(this.items[i]._free)this.items[i]._free();
  }
  this.owner         = null;
  this.items         = null;
  this.timer         = null;
  this.onselected    = null;
//  if(this.doShadow)domapi.shadow.freeShadow(this);
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu._draw = function(){
  this.popupmenuDraw();
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu._layout = function(w,h){
  domapi._private.popupmenu._adjustWidth( this);
  domapi._private.popupmenu._adjustHeight(this);
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.popupmenuDraw = function(){};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.hide = function(){
  this.prevX = this.getAbsX();
  this.prevY = this.getAbsY();
  this.moveTo(-10000,0);
  this.showing = false;
  if(domapi.useElmHooks)this._dispHook("hide",arguments);
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.show = function(x,y){
  this.showing = true;
  if(arguments.length == 2)this.moveTo(x,y);
  else this.moveTo(this.prevX, this.prevY);
  if(this.doShadow)domapi.shadow._moveShadow(this);
  if(domapi.useElmHooks)this._dispHook("show",arguments);
  if(this.onpopup)this.onpopup();
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.addItem = function(arg){
  if(arg["type"] == "separator")return this.addSeparator(arg);
  try{
    var e = document.createElement("A");
    e.DA_TYPE   = "MENUITEM";
    e.className = "DA_MENUITEM";
    domapi._assert(arg, "img", domapi.theme.skin.popupmenuStates.src);
    domapi._assert(arg, "visible", true);
    domapi._assert(arg, "text", "Menuitem" + this.items.length+1);
    domapi._assert(arg, "name", String("mi " + arg.text).toMixedCase());
    domapi._assert(arg, "enabled", true);
    domapi.Imagelistlite({parent:e, src:arg["img"], w:domapi.rInt(arg.imgW, 16), h:domapi.rInt(arg.imgH, 16)});
    var ee = document.createElement("SPAN");
    ee.innerHTML = arg.text;
    e.appendChild(ee);
    var eee = document.createElement("SPAN");
    eee.className = "DA_MENUITEM_CHEVRON";
    e.appendChild(eee);
    
    this.appendChild(e);
    if(domapi.isIE)e.href=""; // need to trick it to activate hover
  
    if(!domapi.isKHTML){
      delete(arg["x"]);
      delete(arg["y"]);
      delete(arg["text"]);//e.onselected = arg.onselected
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
    if(!this._inUpdate){
      domapi._private.popupmenu._adjustHeight(this);
      domapi._private.popupmenu._adjustWidth( this);
    }
    if(e.checked)this.setChecked(e, true);
    return e;
  }finally{
    e = null;ee = null; eee = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.addChildMenu = function(arg){
  if(typeof arg.parent == "undefined")arg.parent = 0;
  var i = domapi._private.popupmenu._getItem(this, arg.parent);
  try{
    if(domapi.isKHTML)arg.parent = null;
    else delete(arg.parent);
    var e = domapi.Popupmenu({doShadow:this.doShadow,doImages:this.doImages});
    var A = i.getElementsByTagName("SPAN");
    A[A.length-1].innerHTML = this.chevron;
    try{
      for(var j in arg)e[j] = arg[j];
    }catch(E){
      throw new Error("Error applying '" + j + "=" + arg[j] + "' in domapi.comps.popupmenu.addChildMenu():\n" + E.message);
    }
    i.childMenu = e;
    return i.childMenu;
  }finally{
    i = null;e = null;A = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.setImage = function(i,src){
  i = domapi._private.popupmenu._getItem(this,i);
  i.childNodes[0].style.background = 'url("' + arg["src"] + '") 0 0 no-repeat';
  i = null;
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.addSeparator = function(){
  var e = document.createElement("DIV");
  try{
    e.className = "DA_MENUITEMSEP";
    e.DA_TYPE   = "MENUITEMSEP";
    this.appendChild(e);
    if(!this._inUpdate){
      domapi._private.popupmenu._adjustWidth( this);
      domapi._private.popupmenu._adjustHeight(this);
    }
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.removeItem = function(i){
  i = domapi._private.popupmenu._getItem(this,i);
  try{
    if(typeof i == "undefined" || !i)return null;
    var e = i.parentNode.removeChild(i);
    this.layout();
    return e;
  }finally{
    i = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.clear = function(){
  this.beginUpdate();
  try{
    for(var i=this.items.length;i>-1;i--)
      this.removeItem(i);
  }finally{
    this.endUpdate();
  }
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.getText = function(i){
  try{
    i = domapi._private.popupmenu._getItem(this,i);
    return i.childNodes[1].innerHTML;
  }finally{i = null}
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.setText = function(i,c){
  try{
    i = domapi._private.popupmenu._getItem(this,i);
    i.childNodes[1].innerHTML = c;
  }finally{i = null}
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.closeMenus = function(){
  var t;
  try{
    for(var i=0;i<this.items.length;i++){
      t = this.items[i];
      if(t.childMenu){
        t.childMenu.hide();
        t.isOpened = false;
        t.childMenu.closeMenus();
      }
    }
  }finally{
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.attach = function(e){
  e.popupmenu = this;
  switch(this.mouseButton){ // 1 = right, 2 = left, 3 = either
    case 1: e.oncontextmenu = domapi._private.popupmenu._popup; break;
    case 2: e.onclick = domapi._private.popupmenu._popup; break;
    case 3: e.onclick = domapi._private.popupmenu._popup; 
            e.oncontextmenu = domapi._private.popupmenu._popup; break;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.setEnabled = function(i,b){ // i is either item or item index
  var I = domapi._private.popupmenu._getItem(this,i);
  try{
    if(I.DA_TYPE != "MENUITEM")return;
    I.disabled  = !b;
    I.enabled   = b;
    I.className = b?"DA_MENUITEM":"DA_MENUITEM_DISABLED";
    I.childNodes[0].setIndex(b?0:1);
  }finally{
    I = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.setChecked = function(i,b){ // i is either item or item index
  var I = domapi._private.popupmenu._getItem(this,i);
  try{
    var j;
    i = 0;
    if(typeof I.radioGroup != "undefined" && b){
      i = (b?6:4);
      // uncheck all others
      for(j=0;j<this.items.length;j++)
        if(this.items[j].radioGroup == I.radioGroup){
          this.items[j].checked = false;
          if(this.items[j].childNodes[0])
            this.items[j].childNodes[0].setIndex(4);
        }
    }else{
      i = (b?2:0);
    }
    if(!I.enabled)i++;
    I.checked = b;
    I.childNodes[0].setIndex(i);
  }finally{
    I = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.hideItem = function(i,p){ // i is either item or item index
  i = domapi._private.popupmenu._getItem(this,i);
  try{
    if(p || p > -1)this.items[p].childMenu[i.name].hide();
    else i.style.display = "none";
    domapi._private.popupmenu._adjustWidth( this);
    domapi._private.popupmenu._adjustHeight(this);
  }finally{
    i = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.showItem = function(i,p){ // i is either item or item index
  i = domapi._private.popupmenu._getItem(this,i);
  try{
    if(p || p > -1)this.items[p].childMenu[i.name].style.display = "";
    else i.style.display = "";
    domapi._private.popupmenu._adjustWidth( this);
    domapi._private.popupmenu._adjustHeight(this);
  }finally{
    i = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.popupmenu.loadFromJson = function(J){
  var i, j, k, A, e, m, O;
  try{
    for(i in J){
      if(i == "items"){
        A = J[i];
        for(j=0;j<A.length;j++){
          if(A[j].type && A[j].type == "separator")
            this.addSeparator();
          else{
            e = this.addItem(A[j]);
            if(A[j].childMenu){
              O = {};
              for(k in A[j].childMenu)
                if(k != "items")O[k] = A[j].childMenu[k];
              O.parent = e;
              m = this.addChildMenu(O);
              m.loadFromJson(A[j].childMenu);
            }
          }
        }
      }else this[i] = J[i];
    }
  }finally{
    A = null;e = null;O = null;m = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
domapi._private.popupmenu.domouseover = function(E){
  var e = domapi.findTarget(E,"A");
  try{
    if(!e)return;
    var r = domapi.findTarget(E,"POPUPMENU");
    if(e.DA_TYPE == "MENUITEMSEP" || e.disabled)return;
    if(r.timer)clearTimeout(r.timer);
  
    domapi._private.popupmenu._closeSiblings(e);
    if(e.childMenu && e.childMenu.moveTo){
      domapi._private.popupmenu._ensureAdded(e.childMenu);
      if(r.parentNode)
        r.parentNode.isOpen = true;
      e.childMenu.setZ(r.getZ() + 10);
      e.childMenu.show(
        r.getX() + r.getW()    - 2,
        r.getY() + e.offsetTop - 2
      );
      if(e.childMenu.doShadow)
        domapi.shadow._moveShadow(e.childMenu);
    }
  }finally{
    e = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu.domouseout = function(E){
  var e = domapi.findTarget(E,"A");
  try{
    if(!e)return;
    if(e.DA_TYPE == "MENUITEMSEP" || e.disabled)return;
  
    if(e.childMenu){
      if(e.childMenu.timer)clearTimeout(e.childMenu.timer);
      var i = domapi.bags.elms.indexOf(e.childMenu);
      e.childMenu.timer = setTimeout("domapi.bags.elms[" + i + "].hide()",400);
    }
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu.doclick = function(E){
  var e = domapi.findTarget(E,"MENUITEM");
  try{
    if(!e)return;
    var r = domapi.findTarget(E,"POPUPMENU");
    var m = r;
    if(e.DA_TYPE == "MENUITEMSEP" || e.disabled)return false;
  //dumpProps(e)
    // if there is not a child menu to open, close all the menus
    if(!e.childMenu)
      domapi._private.popupmenu._closeMenuBars();
    if(e.onselected){
      if(typeof e.onselected == "function")e.onselected(e);
      else eval(e.onselected);
    }
    if(typeof e.radioGroup != "undefined")
      r.setChecked(e, true);
    if(e.autoCheck)
      r.setChecked(e, !e.checked);
    if(r.onselected)
      r.onselected(r,domapi.getNodeIndex(e));
    return false;
  }finally{
    e = null;r = null;m = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu.dodocumentclick = function(E){
  // any clicks on the page close all menus, except on menus
  var e = domapi.findTarget(E,"POPUPMENU" );
  try{
    if(e)return;
    var e = domapi.findTarget(E,"MENUITEM"  );if(e)return;
    var e = domapi.findTarget(E,"MENUBUTTON");if(e)return;
    var e = domapi.findTarget(E,"MENUBAR"   );if(e)return;
    var p = domapi._private.popupmenu;
    if(p._ignoreNextDocumentClick){
      p._ignoreNextDocumentClick = false;
      return false;
    }
    p._closeMenuBars();
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._closeMenuBars = function(){
  var b = domapi.bags.popupmenu;
  for(var i=0;i<b.length;i++)
    b[i].hide();
  var b = domapi.bags.menubar;
  if(b)
    for(i=0;i<b.length;i++)b[i].closeItems();
  b = null;
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._popup = function(E){
  domapi._private.popupmenu._closeMenuBars();// $todo: added functionality, closes all open popupmenus
  domapi.preventBubble(E);
  var m = this.popupmenu;
  try{
    domapi._private.popupmenu._ensureAdded(m);
    m.owner = this;
    if(m.onbeforepopup && !m.onbeforepopup())return false;
    m.hide();
    if(domapi.isIE)// $todo: (hkl) added scroll values, was event.clientX, event.clientY
      m.moveTo(event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, event.clientY + document.documentElement.scrollTop + document.body.scrollTop);
    else
      m.moveTo(E.clientX + window.scrollX, E.clientY + window.scrollY);
    m.setZ(domapi.rInt(m.owner.style.zIndex) + 1);
    m.style.display = "";
    if(m.doShadow)domapi.shadow._showShadow(m);
    if(m.onpopup)m.onpopup();
    return false;
  }finally{
    m = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._closeSiblings = function(e){
  e = e.parentNode.childNodes;
  try{
    for(var i=0;i<e.length;i++)
      if(e[i].childMenu){
        if(e[i].childMenu.timer)clearTimeout(e[i].childMenu.timer);
        e[i].childMenu.hide();
      }
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._adjustWidth = function(e){
  // find max width of visible items
  var i, I, w, maxW;
  try{
    maxW = 0;
    for(i=0;i<e.items.length;i++){
      I = e.items[i];
      if(I.style.display != "none" && I.DA_TYPE != "MENUITEMSEP"){
        w = e.items[i].childNodes[1].offsetWidth;
        if(w > maxW)maxW = w;
      }
    }
    e.setW(maxW + 16*4); // +image +chevron +padding
    // align chevron to right
    for(i=0;i<e.items.length;i++){
      I = e.items[i];
      if(I.childMenu){
        w = I.childNodes[1].offsetWidth;
        w = maxW - w + 16;
        if(w < 0)w = 0;
        I.childNodes[I.childNodes.length-1].style.paddingLeft = w + "px";
      }
    }
  }finally{
    I = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._adjustHeight = function(e){
  for(var i=e.items.length-1;i>-1;i--)
    if(e.items[i].style.display != "none"){
      e.setH(
        e.items[i].offsetTop +
        e.items[i].offsetHeight +
        (e.getP()[0]*2) +
        (domapi.isIE?3:-1)
      );
      break;
    }
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._getItem = function(e, i){
  if(typeof i == "number")return e.items[i];
  else return i;
};
//------------------------------------------------------------------------------
domapi._private.popupmenu._ensureAdded = function(e){
  if(!e.added){
    if(typeof e.parent == "undefined" || !e.parent || !e.parent.appendChild)e.parent = document.body;
    try{
      e.parent.appendChild(e);
      if(e._iframeShield)e.parent.appendChild(e._iframeShield);
    }catch(E){
      document.body.appendChild(e);
      if(e._iframeShield)document.body.appendChild(e._iframeShield);
    }
    e.added = true;
    e._layout();
  }
};
//------------------------------------------------------------------------------
