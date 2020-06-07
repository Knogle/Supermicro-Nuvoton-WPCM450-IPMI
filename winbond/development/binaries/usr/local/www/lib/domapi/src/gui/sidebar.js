//==============================================
// DomAPI Sidebar Component
// D. Kadrioski 12/9/2004
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("rollover");
domapi.registerComponent("sidebar");
//------------------------------------------------------------------------------
domapi.Sidebar = function(arg){return domapi.comps.sidebar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.sidebar.constructor = function(arg){
  var e = domapi.Component(arg,"sidebar");
  try{
    e.panels = e.childNodes;
  
    var p = domapi._private.sidebar;
    domapi.addEvent(e,"click",    p.doheaderclick);
    domapi.addEvent(e,"dblclick", p.doheaderdoubleclick);
  
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    if(!e.enabled)e.setEnabled(false);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.sidebar._free = function(){
  for(var i=0;i<this.panels.length;i++){
    this.panels[i].rollover = null;
    this.panels[i].header   = null;
    this.panels[i].body     = null;
    this.panels[i].caption  = null;
  }
  this.panels = null;
};
//------------------------------------------------------------------------------
domapi.comps.sidebar._draw = function(){
  this.sidebarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.sidebar.sidebarDraw = function(){
  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  var b = this.doBorder?t.border.width:0;
  try{
    this.setB(             b);  // set border width *before* border style!!  
    s.borderStyle        = this.doBorder?"groove":"none";
  //  s.borderColor        = t.border.getInset();
    s.overflow           = "auto";
  }finally{
    s = null;t = null;f = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.sidebar._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.sidebar.addPanel = function(arg){
  var skin = domapi.theme.skin;
  try{
    domapi._assert(arg, "caption", "Panel " + (this.panels.length + 1));
    domapi._assert(arg, "enabled", true);
    domapi._assert(arg, "opened",  true);
    domapi._assert(arg, "doAllowClosing", true);
    var panel       = document.createElement("DIV");
    var panelHeader = document.createElement("DIV");
    var panelBody   = document.createElement("DIV");
    panel      .DA_TYPE   = "SIDEBAR_PANEL";
    panelBody  .DA_TYPE   = "SIDEBAR_PANEL_BODY";
    panel      .className = "DA_SIDEBAR_PANEL";
    panelHeader.className = "DA_SIDEBAR_PANELHEADER";
    panelBody  .className = "DA_SIDEBAR_PANELBODY";
    panel      .enabled   = arg["enabled"];
    panel      .opened    = arg["opened"];
  
    panelHeader.innerHTML = 
      '<div><table border="0" cellpadding="0" cellspacing="0"><tr><td width="100%">' +
      arg["caption"] +
      '</td><td align="right"></td></tr></table></div>';
    panel.rollover = domapi.Rollover({
      parent : panelHeader.getElementsByTagName("TD")[1],
      w      : skin.metrics.sidebar.rolloverW,
      h      : skin.metrics.sidebar.rolloverH,
      src    : skin.sidebarClose.src,
      count  : 4
    });  
    panel.rollover.style.padding = "0px";
    panel.rollover.onclick       = domapi._private.sidebar.dorolloverclick;
    if(!this.doAllowClosing || !arg["doAllowClosing"])panel.rollover.style.display = "none";
    
    if(arg["element"])domapi.transferElm(arg["element"], panelBody);
  
    panel.appendChild(panelHeader);
    panel.appendChild(panelBody);
    this.appendChild(panel);
    panel.header = panel.childNodes[0];
    panel.body   = panel.childNodes[1];
    panel.caption = panelHeader.getElementsByTagName("TD")[0];
    if((!this.doAllowAllOpen && this.panels.length > 1) || !panel.opened)
      this.closePanel(this.panels.length-1);
    if(!panel.enabled || !this.enabled)this.setEnabled(false, this.panels.length-1);
    return panel;
  }finally{
    skin        = null;
    panel       = null;
    panelHeader = null;
    panelBody   = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.sidebar.openPanel = function(i){
  var panel = this.panels[i];
  try{
    if(!panel)return;
    panel.opened = true;
    panel.rollover.setSrc(domapi.theme.skin.sidebarClose.src);
    panel.body.style.display = "";
    if(!this.doAllowAllOpen)for(var j=0;j<this.panels.length;j++)
      if(i != j)this.closePanel(j);
    if(!this.enabled || !panel.enabled){
      // imagelist is smart enough to not do anything if index did not change, force toggle
      panel.rollover.setEnabled(true);
      panel.rollover.setEnabled(false);
    }
  }finally{
    panel = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.sidebar.closePanel = function(i){
  var panel = this.panels[i];
  try{
    if(!panel)return;
    panel.opened = false;
    panel.rollover.setSrc(domapi.theme.skin.sidebarOpen.src);
    panel.body.style.display = "none";
    if(!this.enabled || !panel.enabled){
      // imagelist is smart enough to not do anything if index did not change, force toggle
      panel.rollover.setEnabled(true);
      panel.rollover.setEnabled(false);
    }
  }finally{
    panel = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.sidebar.setEnabled = function(b, i){
  var j;
  var p = this.panels;
  try{
    if(arguments.length == 1)i = -1;  
    for(j=0;j<p.length;j++){    
      if(i == j || i == -1){      
        p[j].enabled = b;
        p[j].caption.disabled = !b;
        p[j].rollover.setEnabled(b);
        domapi.css.addClass(p[j], "DA_SIDEBAR_DISABLED", !b);
      }
    }
    if(i == -1)this.enabled = b;
  }finally{
    p = null;
  }
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
domapi._private.sidebar.dorolloverclick = function(E){
  var r = domapi.findTarget(E,"SIDEBAR");
  var e = domapi.findTarget(E,"SIDEBAR_PANEL");
  var i = domapi.getNodeIndex(e);
  try{
    if(!e || !r || !e.enabled || !r.enabled)return;
    if(e.opened)r.closePanel(i);
    else r.openPanel(i);
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.sidebar.doheaderclick = function(E){
  var r = domapi.findTarget(E,"SIDEBAR");
  var R = domapi.findTarget(E,"ROLLOVER");
  var b = domapi.findTarget(E,"SIDEBAR_PANEL_BODY");
  var e = domapi.findTarget(E,"SIDEBAR_PANEL");
  try{
    var i = domapi.getNodeIndex(e);
    if(!e || !r || !e.enabled || !r.enabled || b || R || !r.doAllowHeaderClick)return;
    if(e.opened)r.closePanel(i);
    else r.openPanel(i);
  }finally{
    r = null;R = null;b = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.sidebar.doheaderdoubleclick = function(E){
  var r = domapi.findTarget(E,"SIDEBAR");
  var R = domapi.findTarget(E,"ROLLOVER");
  var b = domapi.findTarget(E,"SIDEBAR_PANEL_BODY");
  var e = domapi.findTarget(E,"SIDEBAR_PANEL");
  try{
    var i = domapi.getNodeIndex(e);
    if(!e || !r || !e.enabled || !r.enabled || b || R || !r.doAllowHeaderDoubleClick)return;
    if(e.opened)r.closePanel(i);
    else r.openPanel(i);
  }finally{
    r = null;R = null;b = null;e = null;
  }
};
//------------------------------------------------------------------------------