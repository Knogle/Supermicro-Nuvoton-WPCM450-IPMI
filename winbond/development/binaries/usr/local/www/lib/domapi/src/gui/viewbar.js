//==============================================
// DomAPI Viewbar Component
// D. Kadrioski 7/27/2001
// (c) Nebiru Software 2001-2003
//==============================================
domapi.registerComponent("viewbar");

domapi.comps.viewbar.defDelimter = "/";
//------------------------------------------------------------------------------
domapi.Viewbar = function(arg){return domapi.comps.viewbar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.viewbar.constructor = function(arg){
  var e = domapi.Component(arg,"viewbar");
  try{
    e.selected          = null;
    e.selectedGroup     = null;
    e.onchange          = function(){};
    e.onbeforechange    = function(){return true};
    e.setOverflow(        "auto");
    e.groups            = [];
    e.groups.parentNode = e;
    e.groups.add        = domapi._private.viewbar._addGroup;
    //------------------------
    domapi.disallowSelect(  e);
    e.ondrawitem        = function(n){};
    domapi._finalizeComp(e);
    e.setValue("");
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar._free = function(){
  var i,j;
  for(i=0;i<this.groups.length;i++){
    for(j=0;j<this.groups[i].childNodes.length;j++)
      this.groups[i].childNodes[j].fn = null;
    this.groups[i].add      = null;
    this.groups[i].collapse = null;
    this.groups[i].expand   = null;
  }
  this.selected          = null;
  this.selectedGroup     = null;
  this.onchange          = null;
  this.onbeforechange    = null;
  this.groups.parentNode = null;
  this.groups.add        = null;
  this.groups            = [];
  this.groups            = null;
  this.ondrawitem        = null;
};
//------------------------------------------------------------------------------
domapi.comps.viewbar._draw = function(){
  this.viewbarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.viewbarDraw=function(){
  var t                = domapi.theme;
  var f                = t.fonts;
  var s                = this.style;
  try{
    this.setB(             t.border.width);
    s.borderStyle        = this.doBorder?t.border.solid:"none";
    this.setBgColor(       this.doBGFill?f.window.bgcolor:"transparent");
    s.borderColor        = t.border.getInset();
    s.font               = f.window.asString();
    for(var a=0;a<this.groups.length;a++)
      this.drawGroup(this.groups[a]);
  }finally{
    t = null;f = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.drawGroup = function(g){
  for(var a=0;a<g.childNodes.length;a++)
    this.drawItem(g.childNodes[a]);
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.drawItem = function(n){
  var t = domapi.theme;
  var f = t.fonts;
  var s = n.style;
  try{
    if(n.isHeader)
      n.className = "DA_BUTTONFACE DA_VIEWBAR_HEADER";
    else if(n.selected && this.doShowSelection)
      n.className = "DA_VIEWBAR_ITEM DA_SELECTION";
    else
      n.className = "DA_VIEWBAR_ITEM";
    this.ondrawitem(n);
  }finally{
    t = null;f = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.selectItem = function(n){
  if(!this.onbeforechange(n))return false;
  this.selected      = n;
  this.selectedGroup = n.parentNode;
  var g              = this.groups;
  try{
    // deselect all nodes in all groups
    for(var b=0;b<g.length;b++)
      for (var a=0;a<g[b].childNodes.length;a++)
        if(g[b].childNodes[a].selected){
          g[b].childNodes[a].selected = false;
          this.drawItem(g[b].childNodes[a]);
        }
    n.selected = true;
    if(n.fn){
        if(typeof n.fn == "function")n.fn(n);
        else eval(n.fn);
     }
    this.drawItem(n);
    this.setFormValue();
    this.onchange();
  }finally{
    g = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.deleteGroup = function(i){
  var n = this.groups[i];
  try{
    if(!n)return;
    n.removeNode(true);
    this.groups.deleteItem(i);
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.setExclusive = function(b){
  this.exclusive = b;
  if(b && this.selectedGroup){
    for(var a=0;a<this.groups.length;a++)
      if(this.groups[a]!=this.selectedGroup)
        this.groups[a].collapse();
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.onmouseover = function(e){
  if(!this.doRollover||!this.enabled)return;
  var n = domapi.findTarget(e,"VIEWBARITEM");
  try{
    if(!n||(n.selected && this.doShowSelection)||n.isHeader)return;
    n.className = "DA_VIEWBAR_ITEM DA_HIGHLIGHT";
    this.ondrawitem(n);
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.onmouseout = function(e){
  if (!this.doRollover||!this.enabled)return;
  var n = domapi.findTarget(e,"VIEWBARITEM");
  try{
    if(n)this.drawItem(n);
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.onmousedown = function(e){
  if(!this.enabled)return;
  var n = domapi.findTarget(e,"VIEWBARITEM");
  try{
    if(n && this.doDepress)
      n.className = "DA_VIEWBAR_ITEM DA_VIEWBAR_DEPRESS" + (n.isHeader?"_H":"");
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.onmouseup = function(e){
  if(!this.enabled)return;
  var n = domapi.findTarget(e,"VIEWBARITEM");
  try{
    if(!n)return;
    var g = n.parentNode;
    //----
    if(!n.isHeader)this.selectItem(n);
    else{ //header selected
      if(g.isCollapsed)g.expand();
      else g.collapse();
    }
    this.drawItem(n);
  }finally{
    n = null;g = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.viewbar.setFormValue = function(){
  var t   = "";
  var s   = this.selected;
  try{
    if(!s)return;
    var r   = s.value;
    if(!r)r = s.innerHTML;
    r = domapi.findParent(s,"VIEWBARGROUP").value +
        domapi.comps.viewbar.defDelimter + 
        r;
    domapi._setFormElementValue(this._formElement, r);
  }finally{
    s = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// non-inherited methods.  mostly assigned to the groups property
//------------------------------------------------------------------------------
domapi._private.viewbar._addGroup = function(arg){
  var g = document.createElement("DIV");
  try{
    g.id        = this.parentNode.id+"_GROUP_"+this.parentNode.childNodes.length;
    g.DA_TYPE   = "VIEWBARGROUP";
    g.value     = domapi.rVal(arg["value"], arg["text"]);
    var s       = g.style;
    s.margin    = "0px";
    s.listStyle = "none";
    s.overflow  = "hidden";
    if(domapi.isGecko)s.paddingLeft = "0px"; 
    this[this.length] = g;  // add the new group to the array
    this.parentNode.appendChild( g); // visually add it to the control
    var t         = domapi._private.viewbar;
    g.add         = t._addToGroup;
    g.collapse    = t._collapse;
    g.expand      = t._expand;
    g.isCollapsed = true;
    g.add({text:arg["text"], isHeader:true});
    this.parentNode.ondrawitem(this[this.length-1]);
    return this[this.length-1];
  }finally{
    s = null;g = null;t = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.viewbar._addToGroup = function(arg){
  var e = document.createElement("DIV");
  try{
    e.id        = this.id+"_"+this.childNodes.length;
    e.DA_TYPE   = "VIEWBARITEM";
    e.innerHTML = domapi.rVal(arg["value"], arg["text"]);
    e.value     = arg["value"];
    e.fn        = arg["onselect"];
    e.isHeader  = arg["isHeader"];
    e.selected  = false;
    var t       = e.style;
    t.position  = "relative";
    if(!e.isHeader){
      t.display   = "none";
      t.cursor    = "default";
    }
    //---------
    this.appendChild(e);
    this.parentNode.drawItem(e);
    return e;
  }finally{
    t = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.viewbar._collapse = function(){
  var p = this.parentNode;
  var c = this.childNodes;
  try{
    if(!c)return;
    this.isCollapsed=true;
    for(var a=1;a<c.length;a++)
      c[a].style.display="none";
    if(p.oncollapse)p.oncollapse(this);
    if(this.oncollapse)this.oncollapse();
  }finally{
    p = null;c = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.viewbar._expand = function(){
  var p = this.parentNode;
  var c = this.childNodes;
  try{
    if(p.exclusive)
      for(var a=0;a<p.groups.length;a++)
        p.groups[a].collapse();
    this.isCollapsed=false;
    for(a=1;a<c.length;a++)
      c[a].style.display="block";
    if(p.onexpand)p.onexpand(this);
    if(this.onexpand)this.onexpand();
  }finally{
    p = null;c = null;
  }
};
//------------------------------------------------------------------------------