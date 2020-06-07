//==============================================
// DomAPI Tabset Component
// D. Kadrioski 6/25/2002
// (c) Nebiru Software 2001-2004
//==============================================

domapi.registerComponent("tabset");
//------------------------------------------------------------------------------
domapi.Tabset = function(arg){return domapi.comps.tabset.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.tabset.constructor = function(arg){
  var e            = domapi.Component(arg,"tabset");
  try{
    e.onbeforechange   = function(i){return true}; // virtual
    e.onchange         = function(i,value){}; // $custom: (cst) added value
    e.tabs           = [];
    e.index          = -1;
    e.rows           = [];
    e.style.overflow = "hidden";
    e.selectTab      = domapi.rInt(arg["selectTab"],"0"); // $custom: (cst) added

    var p = domapi._private.tabset;
    domapi.addEvent(e,"mouseover",p.domouseover);
    domapi.addEvent(e,"mouseout" ,p.domouseout );

    domapi.disallowSelect( e);
    domapi._finalizeComp(  e);
    domapi.addEvent(e._daTabEdit, "keydown", p.dokeydown);
    return e;
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset._free = function(){
  for(var i=0;i<this.tabs.length;i++)
    this.tabs[i].pane = null;
  this.onbeforechange = null;
  this.onchange       = null;
  this.tabs           = null;
  this.rows           = null;
};
//------------------------------------------------------------------------------
domapi.comps.tabset._draw = function(){
  this.tabsetDraw();
  this._resizeTabs(); // $custom: (cst) new, call the resize function
};
//------------------------------------------------------------------------------
domapi.comps.tabset.tabsetDraw = function(){
if(domapi.trace)dump(this.toString()+'._tabsetDraw()');
  var t         = domapi.theme;
  var s         = this.style;
  s.borderWidth = t.border.width + "px";
  s.borderStyle = this.doBorder?t.border.solid:"none";
  s.borderColor = t.border.getOutset();
  domapi.css.addClass(this, "DA_BUTTONFACE",  this.doBgColor);
  domapi.css.addClass(this, "DA_TABSET_UP",   this.orientation == "top"   );
  domapi.css.addClass(this, "DA_TABSET_DOWN", this.orientation == "bottom");
  this.style.border="0px solid transparent"; // don't ask, just leave it alone
  t = null;s = null;
};
//------------------------------------------------------------------------------
domapi.comps.tabset._layout = function(){
//  if(this._inUpdate)return;
  if(domapi.trace)dump(this.toString()+'._layout()');
  this._layoutTabs();
  this.managePanes();
};
//------------------------------------------------------------------------------
domapi.comps.tabset.setEnabled = function(b, i){
  if(arguments.length == 1){
    this.enabled = b;
  }else{
   var t = this.tabs;
   var n = t.length - 1;
   if(n < 0 || i > n)return;
   t[i].enabled = b;
   domapi.css.addClass(t[i], "DA_TAB_DISABLED", !b);
   t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset.clear = function(){
  var t = this.tabs;
  for(var i=t.length;i>0;i--)
    this.removeTab(i-1);
  this.index = -1;
  this.layout();
  t = null;
};
//------------------------------------------------------------------------------
domapi.comps.tabset.removeTab = function(i){
  var t = this.tabs;
  try{
    var n = t.length - 1;
    if(n < 0 || i > n)return null;
    var e = t[i].parentNode.removeChild(t[i]);
    t.deleteItem(i);
    return e;
  }finally{
    t = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset.setIndex = function(i){
  if(domapi.trace)dump(this.toString()+'.setIndex('+i+')');
  var t = this.tabs;
  try{
    if(i<0 || i>=t.length)return false;
    if(!this.onbeforechange(i))return false;
    if(this.index==i && t[i].selected)return false;  // $custom: (cst) added line, dont select twice a tab 
    domapi.closeAllDropdowns(); // in case we are changing pages in a notebook, and it had dropdowns in it
    this.index = i;
    for(var a=0;a<t.length;a++){
      t[a].selected = i==a;
      domapi.css.addClass(t[a], "DA_TAB_SELECTED",           t[a].selected);
      domapi.css.addClass(t[a], "DA_TAB_SELECTED_LEFTEND",   t[a].selected && t[a].isLeftEnd);
      domapi.css.addClass(t[a], "DA_TAB_SELECTED_RIGHTEND",  t[a].selected && t[a].isRightEnd);
    }
    if(this.onchange)this.onchange(i,t[i].value); // $custom: (cst) added t[i].value to onchange function
    this._layoutTabs();
    this.managePanes();  
    return true;
  }finally{
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset.setTabValue = function(i,value){
  var t = this.tabs;
  try{
    if(i<0 || i>=t.length)return;
    if(domapi.trace)dump(this.toString()+'.setTabValue('+[i,value]+')');
    t[i].getElementsByTagName("SPAN")[0].innerHTML = value;
    this._layoutTabs();
  }finally{
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset.addTab = function(arg){
  if(domapi.trace)dump(this.toString()+'.addTab()');
  //var value;   // $custom: (cst) no longer used
  //if(arg["value"])value = arg["value"];   // $custom: (cst) no longer used
  //if(arg["text" ])value = arg["text" ];   // $custom: (cst) no longer used
  var pane = arg["pane"];
  var e = document.createElement("LI");
  try{
    e.innerHTML    = '<span>' + domapi.rVal(arg["text"]) + '</span>';  // $custom: (cst) was value
    e.value        = domapi.rVal(arg["value"],arg["text"]); // $custom: (cst) was value, setting of value after setting of innerHTML!! (because IE crashes)
    e.DA_TYPE      = "TAB";
    e.className    = "DA_TAB";
    e.selected     = this.tabs.length == this.selectTab;  // $custom: (cst) set this.selectTab was 0
    e.pane         = pane;
    e.enabled      = domapi.rBool(arg["enabled"], true);
    e.onclick      = domapi._private.tabset._dotabonclick;
    domapi.css.addClass(e, "DA_TAB_SELECTED",           e.selected);
    domapi.css.addClass(e, "DA_TAB_SELECTED_LEFTEND",   e.selected && e.isLeftEnd);
    domapi.css.addClass(e, "DA_TAB_SELECTED_RIGHTEND",  e.selected && e.isRightEnd);
    domapi.css.addClass(e, "DA_TAB_DISABLED",           !e.enabled);
    this.tabs.push(  e);  
    this.appendChild(e);
    if(this.tabs.length == 1)this.index = 0;
    if(!this._inUpdate && !this.parentNode._inUpdate)this._layoutTabs();
  }finally{
    pane = null;e = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi.comps.tabset._getMaxW = function(){
  var r = 0;
  var w = 0;
  for(var a=0;a<this.tabs.length;a++){
    w = this.tabs[a].getW();
    if(w>r)r = w;
  }
  return r;
};
//------------------------------------------------------------------------------
// $custom: (cst) new function, workaround for bouncing tabs 
// (the selected tab is wider then the others) !!!
domapi.comps.tabset._resizeTabs = function(){ return; // DK - caused tabs to be too big
  var t = this.tabs;
  for(var a=0;a<this.tabs.length;a++) {
    t[a].getElementsByTagName("SPAN")[0].style.width=t[a].clientWidth+"px";
  }
}; // $custom: (cst) end 
//------------------------------------------------------------------------------
domapi.comps.tabset.managePanes = function(){
  if(domapi.trace)dump(this.toString()+'.managePanes()');
  if(!this.doManage)return;
  var m = this.paneManage;
  var h = (m=="display"?"none":"hidden");
  var v = (m=="display"?""    :"visible");
  var t = null;
  try{
    for(var a=0;a<this.tabs.length;a++){
      t = this.tabs[a];
      if(t.pane){
        t.pane.style[m] = ((a == this.index)?v:h);
        if(a == this.index){
          for(var j=0;j<t.pane.childNodes.length;j++)
            if(t.pane.childNodes[j].drawAndLayout){ // DO NOT call draw() if a pagecontrol with a iframe is in a page
              if(t.pane.childNodes[j].DA_TYPE == 'PAGECONTROL'){
                if(t.pane.childNodes[j].getElementsByTagName("IFRAME").length == 0)
                  t.pane.childNodes[j].draw();
              }else t.pane.childNodes[j].draw();
              t.pane.childNodes[j].layout();
            }
        }
      }
    }
  }finally{
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset._assertRows = function(){
  if(domapi.trace)dump(this.toString()+'._assertRows()');
  var i, hh, e, tab;
  var m     = 0;
  var ww    = this.getW();
  var x     = m;
  var h     = this.tabH;
  var rowH  = this.tabH + m;
  this._currentRow = 0;
  var T = this.tabs;
  try{
    // detach tabs
    for(i=0;i<T.length;i++){
      T[i] = T[i].parentNode.removeChild(T[i]);
      this.appendChild(T[i]);
    }
    // remove current rows
    for(i=0;i<this.rows.length;i++)this.rows[i].parentNode.removeChild(this.rows[i]); //this.rows[i].removeNode(true);
    this.rows = [];
  
    for(i=0;i<T.length;i++){
      e = T[i];//alert(e.offsetWidth)
      e.style.width = "auto";
      if((x + e.offsetWidth + m > ww) || this.rows.length == 0){ // Create a new row      
        r = domapi.Elm({
          parent : this,
          x      : 0,
          y      : 0,
          w      : ww,
          h      : rowH,
          type   : "UL"
        });
        r.className = "DA_ROW";
        this.rows.push(r);   // keep a pointer to it
        x = m;
      }
      domapi.transferElm(e, this.rows[this.rows.length-1]); // add this tab to the current row
      if(i == this.index)this._currentRow = this.rows.length-1;
      x += e.offsetWidth + m;
    }
  
    // rectify widths
    for(i=0;i<this.rows.length;i++){
      r  = this.rows[i];
      for(j=0;j<r.childNodes.length;j++)
        if(r.childNodes[j]){
          tab  = r.childNodes[j];
          tab.isLeftEnd  = (j == 0);
          tab.isRightEnd = (j == r.childNodes.length-1);
          domapi.css.addClass(tab, "DA_TAB_LEFTEND",           tab.isLeftEnd );
          domapi.css.addClass(tab, "DA_TAB_RIGHTEND",          tab.isRightEnd);
          domapi.css.addClass(tab, "DA_TAB_SELECTED_LEFTEND",  tab.selected && tab.isLeftEnd);
          domapi.css.addClass(tab, "DA_TAB_SELECTED_RIGHTEND", tab.selected && tab.isRightEnd);
          domapi.css.addClass(tab, "DA_TAB_FILL",     (this.rows.length > 1 && tab.isRightEnd));
          tab.style.zIndex = (tab.selected?100:j);
          if(this.rows.length > 1 && tab.isRightEnd)
            tab.style.width = ww - tab.offsetLeft - (domapi.isGecko?7:6) + "px";
          //else tab.style.width = "auto";
        }
    }
  }finally{
    T = null;r = null;tab = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tabset._layoutTabs = function(){
  if(domapi.trace)dump(this.toString()+'._layoutTabs()');
  this._assertRows();
  var y, i;
  var R = this.rows;
  try{
    if(R.length){
      var lastRowIndex = (this.orientation == "top"?R.length-1:0);
      var currentRow   = R[this._currentRow];
      var lastRow      = R[lastRowIndex];
      if(currentRow != lastRow)
        R.swap(this._currentRow, lastRowIndex);
      lastRow.bringToFront();
    }
    var rowH  = this.tabH;
    var h     = (R.length * rowH) + this.selFeather;
  
    for(i=0;i<R.length;i++)if(R[i]){
      y = (i*this.tabH) - this.selFeather;
      y -= i * (this.selOffset + this.selFeather);
      if(R.length == 1)y+=1;
      R[i].setY(y);
      R[i].style.zIndex = i;
    }
    if(R.length > 1)h -= ((R.length * this.selOffset) + this.selFeather + (R.length-2));
    if(h > 0)this.setH(h, true);
    if(R.length == 1 && this.tabAlign != "left"){
      var w = 0;
      for(i=0;i<R[0].childNodes.length;i++)
        w += R[0].childNodes[i].offsetWidth;
      w = this.getW() - w; // left over
      if(this.tabAlign == "center") w = w / 2;
      try{
        R[0].style.paddingLeft = parseInt(w) + "px";
      }catch(e){}
    }
  }finally{
    R = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tabset._dotabonclick = function(E){
  var p = domapi.findTarget(E, "TABSET");
  try{
    if(!p || !p.enabled)return;
    var e = domapi.findTarget(E, "TAB"   );if(!e || !e.enabled)return;
    var t = p.tabs;
    if(e.selected)return;
    var ok = true;
    for(var i=0;i<t.length;i++)
      if(t[i] == e)ok = p.onbeforechange(i);
    if(!ok)return;
    for(var i=0;i<t.length;i++){
      domapi.css.removeClass(t[i], "DA_OVER");
      t[i]._over    = false;
      t[i].selected = (t[i] == e);
      if(t[i] == e){
        p.index = i;
        if(p.onchange)p.onchange(i,t[i].value); // $custom: (cst) added t[i].value to onchange function
        if(p["parent"] && p["parent"]._setIndex)p["parent"]._setIndex(i); //propogate to parent container
      }
      domapi.css.addClass(t[i], "DA_TAB_SELECTED",          t[i].selected);
      domapi.css.addClass(t[i], "DA_TAB_SELECTED_LEFTEND",  t[i].selected && t[i].isLeftEnd);
      domapi.css.addClass(t[i], "DA_TAB_SELECTED_RIGHTEND", t[i].selected && t[i].isRightEnd);
    }
    p._layoutTabs();
    p.managePanes();
  }finally{
    p = null;e = null;t = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tabset.domouseover = function(E){
  var p = domapi.findTarget(E, "TABSET");
  try{
    if(!p || !p.enabled)return false;
    var e = domapi.findTarget(E, "TAB"   );if(!e || !e.enabled)return false;
    if(p.doRollover && !e.selected)domapi.css.addClass(e, "DA_OVER");
    e._over = true;
  }finally{
    p = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tabset.domouseout = function(E){
  var p = domapi.findTarget(E, "TABSET");
  try{
    if(!p || !p.enabled)return false;
    var e = domapi.findTarget(E, "TAB"   );if(!e || !e.enabled)return false;
    if(!e._over || domapi.isMouseOver(E, e))return false;
    if(p.doRollover)domapi.css.removeClass(e, "DA_OVER");
    e._over = false;
  }finally{
    p = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tabset.dokeydown = function(E){
  var k = domapi.isIE?event.keyCode:E.which;
  var e = domapi.getTarget(E);
  var r = e._daowner;
  try{
    var eat = false;
    var shiftKey = domapi.isIE?event.shiftKey:E.shiftKey;
    var ctrlKey  = domapi.isIE?event.ctrlKey :E.ctrlKey;
    var i = -1;
    if(k == 37){ // LEFT
      i = r.index - 1;
      if(i < 0)i = r.tabs.length-1;
    }
    if(k == 39){ // RIGHT
      i = r.index + 1;
      if(i >= r.tabs.length)i = 0;
    }
    if(i> -1)r.setIndex(i);
  }finally{
    e = null;r = null;
  }
};
//------------------------------------------------------------------------------