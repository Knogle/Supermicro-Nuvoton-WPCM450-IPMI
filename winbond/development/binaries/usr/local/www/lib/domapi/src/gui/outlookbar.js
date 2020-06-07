//------------------------------------------------------------------------------
// DomAPI Outlook Bar Component
// D. Kadrioski 10/31/2003
// (c) Nebiru Software 2001-2003
//------------------------------------------------------------------------------

domapi.registerComponent("outlookbar");
//------------------------------------------------------------------------------
domapi.Outlookbar = function(arg){return domapi.comps.outlookbar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.outlookbar.constructor = function(arg){
  var e             = domapi.Component(arg,"outlookbar");
  try{
    e.onbeforechange  = function(i){return true};
    e.onchange        = function(i){};
    e.tabs            = [];
    e.pages           = [];
    e.index           = -1;
    e.style.overflow  = "hidden";
  
    var p = domapi._private.outlookbar;
    domapi.addEvent(e,"mouseover",p.domouseover);
    domapi.addEvent(e,"mouseout" ,p.domouseout );
    domapi.addEvent(e,"mouseup"  ,p.domouseup  );
    domapi.addEvent(e,"mousedown",p.domousedown);
  
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar._free = function(){
  this.onbeforechange = null;
  this.onchange       = null;
  this.tabs           = null;
  this.pages          = null;
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar._draw = function(){this.outlookbarDraw()};
//------------------------------------------------------------------------------
domapi.comps.outlookbar._layout = function(w,h){
  if(this.index < 0 || this.tabs.length < 1 || this._inUpdate)return;
  try{
    var i, heightOfAllTabs;
    var t  = domapi.theme;
    var s  = t.skin;
    var ts = this.tabs;
    var ps = this.pages;
    var b  = this.doBorder?t.border.width:0;
    // remove all items
    for(i=0;i<ts.length;i++){
      if(ts[i].added)ts[i] = ts[i].parentNode.removeChild(ts[i]);ts[i].added = false;
      if(ps[i].added)ps[i] = ps[i].parentNode.removeChild(ps[i]);ps[i].added = false;
      ps[i].style.position = "relative";
    }
   // alert([this.index  , this.tabs.length  , this._inUpdate, this.childNodes.length])
    if(this.valign == "bottom"){
      this.appendChild(ps[this.index]);
      ps[this.index].added = true;
    }
  
    heightOfAllTabs = 0;
    for(i=0;i<ts.length;i++){
      domapi.css.addClass(ts[i], "DA_OB_TAB_BOTHLINES",(this.valign == "bottom" && i == 0));
      this.appendChild(ts[i]);
      ts[i].added = true;
      heightOfAllTabs += ts[i].offsetHeight;
      if(this.valign == "justify" && this.index == i){
        this.appendChild(ps[i]);
        ps[i].added = true;
      }
    }
    if(this.valign == "justify" && ts.length > (this.index+1))domapi.css.addClass(ts[this.index+1], "DA_OB_TAB_BOTHLINES");
  
    if(this.valign == "top"){
      this.appendChild(ps[this.index]);
      ps[this.index].added = true;
    }
    //------
    ps[this.index].setH(h - heightOfAllTabs - (b*2) - (this.valign == "bottom"?0:1));
    ps[this.index].setW(w - (b*2));
  }finally{
    t  = null;
    s  = null;
    ts = null;
    ps = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar.outlookbarDraw = function(){  
  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  try{
    var b                = this.doBorder?parseInt(t.border.width):0;
    this.setB(             b);  // set border width *before* border style!!
    s.borderStyle        = this.doBorder?t.border.solid:"none";
    s.borderColor        = t.border.getInset();
    s.cursor             = "default";
  }finally{
    t = null;f = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar.addPage = function(arg){
  var t = document.createElement("DIV");
  try{
    t.style.position = "relative";
    this.tabs.push(t);
    t.innerHTML = domapi.rVal(arg["text"], "Page " + this.tabs.length);
    t.className = "DA_OB_TAB";
    t.DA_TYPE   = "OB_TAB";
    var p;
    if(arg["ref"])p = arg["ref"];
    else if(arg["id"])p = domapi.getElm(arg["id"]);
    else p = domapi.Elm({parent:this});
    this.pages.push(p);
    if(!p.isElm)domapi.Elm({ref:p});
    domapi.css.addClass(p, "DA_OB_PAGE");
    t.added = false; p.added = true;
    if(this.index < 0)this.index = 0;
    t.enabled = domapi.rBool(arg["enabled"], true);
    if(!t.enabled)this.setEnabled(false, this.tabs.length-1);
    if(this.tabs.length == 1)this.setIndex(0);
  }finally{
    t = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar.removePage = function(i){
  this.pages.deleteItem(i);
  this.tabs.deleteItem( i);
  if(!this._inUpdate){
    this.draw();
    this.layout();
  }
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar.setIndex = function(i){
  this.index = i;
  if(!this._inUpdate){
    this.draw();
    this.layout();
  }
  for(var j=0;j<this.tabs.length;j++)
    domapi.css.addClass(this.tabs[j], "DA_OB_TAB_SELECTED", i==j);
  if(this.onchange)this.onchange(i);
};
//------------------------------------------------------------------------------
domapi.comps.outlookbar.setEnabled = function(b, i){
  if(arguments.length == 1)
    this.enabled = b;
  else{
    this.tabs[i].enabled  = b;
    this.tabs[i].disabled = !b;
    domapi.css.addClass(this.tabs[i], "DA_OB_TAB_DISABLED", !b);
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
domapi._private.outlookbar.domouseover = function(E){
  var r = domapi.findTarget(E,"OUTLOOKBAR");
  try{
    var e = domapi.findTarget(E,"OB_TAB"); if(!e || !e.enabled || !r.enabled)return false;
    if(r.doRollover && !e.selected)domapi.css.addClass(e, "DA_OB_TAB_OVER");
    e._over = true;
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.outlookbar.domouseout = function(E){
  var r = domapi.findTarget(E,"OUTLOOKBAR");
  try{
    var e = domapi.findTarget(E,"OB_TAB"); if(!e)return false;
    if(!e._over || domapi.isMouseOver(E, e))return false;
    if(r.doRollover)domapi.css.removeClass(e, "DA_OB_TAB_OVER");
    e._over = false;
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.outlookbar.domousedown = function(E){
  var r = domapi.findTarget(E,"OUTLOOKBAR");
  try{
    var e = domapi.findTarget(E,"OB_TAB"); if(!e)return false;
    if(!r.enabled || !e.enabled)return false;
    if(e.enabled && r.doDepress){
      domapi.css.addClass(e, "DA_OB_TAB_DEPRESS");
      if(r.doRollover)domapi.css.removeClass(e, "DA_OB_TAB_OVER");
    }
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.outlookbar.domouseup = function(E){  
  var r = domapi.findTarget(E,"OUTLOOKBAR");
  try{
    var e = domapi.findTarget(E,"OB_TAB"); if(!e)return false;
    if(!r.enabled || !e.enabled)return false;
    var i = r.tabs.indexOf(e); if(i < 0)return;
    r.setIndex(i);
    if(!e.down && r.doDepress)domapi.css.removeClass(e, "DA_OB_TAB_DEPRESS");
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------