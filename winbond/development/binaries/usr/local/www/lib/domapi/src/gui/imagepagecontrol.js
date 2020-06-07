//------------------------------------------------------------------------------
// DomAPI ImagepageControl Component
// D. Kadrioski 9/3/2004
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------

domapi.loadUnit("imagetabset");
domapi.loadUnit("notebook");
domapi.registerComponent("imagepagecontrol");
//------------------------------------------------------------------------------
domapi.Imagepagecontrol = function(arg){return domapi.comps.imagepagecontrol.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol.constructor = function(arg){
  var e = domapi.Component(arg,"imagepagecontrol");
  try{
    e.index            = -1;
    e.onbeforechange   = function(i){return true};
    e.onchange         = function(i){};
  
    var o = null;
    if(arg["orientation"] == "top"  || arg["orientation"] == "bottom")o = "horizontal";
    if(arg["orientation"] == "left" || arg["orientation"] == "right" )o = "vertical";
    //-----------
    var _arg          = domapi.copyObject(arg);
    _arg.parent       = e;
    _arg.x            = 0;
    _arg.y            = 0;
    _arg.w            = (o == "horizontal"?20:arg["tabH"]);
    _arg.h            = (o == "horizontal"?arg["tabH"]:20);
    _arg.indexRelation= e;
    _arg.orientation  = o;
    e.tabset          = domapi.Imagetabset(_arg);
    //-----------
    _arg              = domapi.copyObject(arg);
    _arg.parent       = e;
    _arg.x            = 0;
    _arg.y            = 0;
    _arg.w            = 20;
    _arg.h            = 20;
    _arg.doManage     = false;
    e.notebook        = domapi.Notebook(_arg);
    //-----------
    e.tabs            = e.tabset.tabs;
    e.pages           = e.notebook.pages;
    e.tabset.doBGFill = false;
  
    domapi._finalizeComp( e);
    return e;
  }finally{
    e    = null;
    _arg = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol._free = function(){
  this.onbeforechange       = null;
  this.onchange             = null;
  this.notebook.parent      = null;
  this.tabset.parent        = null;
  this.tabset.indexRelation = null;
  this.notebook             = null;
  this.tabset               = null;
  this.tabs     = [];
  this.pages    = [];
  this.tabs     = null;  //causes IE to 'splode
  this.pages    = null;
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol._draw = function(){
  this.imagepagecontrolDraw();
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol._layout = function(w,h){
  var t  = this.tabset;
  var n  = this.notebook;
  try{
    t._inLayout = this._inLayout;
    t._inUpdate = this._inUpdate;
    n._inLayout = this._inLayout;
    n._inUpdate = this._inUpdate;
    var th = this.tabH;
    if(th==0)return;
    var nbOffset = -1;
    if(!t.tabs.length){nbOffset = -1}
    switch(this.orientation){
      case "top"    :      
        t.moveTo(0,0);
        n.moveTo(0,th + nbOffset);
        break;
      case "bottom" :    
        t.moveTo(0,h - th);
        n.moveTo(0,0);
        break;
      case "left" :
        t.moveTo(0,0);
        n.moveTo(th + nbOffset, 0);
        break;
      case "right" :
        t.moveTo(w - th,0);
        n.moveTo(0, 0);
        break;
    }
  
    switch(this.orientation){
      case "top"    :
      case "bottom" :
        t.setW(w);
        n.setW(w);
        n.setH(h - th - nbOffset);
        break;
      case "left"   :
      case "right"  :
        t.setH(h);
        n.setH(h);
        n.setW(w - th - nbOffset);
        break;
    }  
    t._layout(w,h);//layout();  
    n.layout(w,h - th - nbOffset);
    t.bringToFront();
    t._inLayout = false;
    t._inUpdate = false;
    n._inLayout = false;
    n._inUpdate = false;
  }finally{
    t = null;
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol.imagepagecontrolDraw = function(){
  var tab = this.tabset;
  try{
    tab.doBGFill       = false;
    tab.doRolloverFill = this.doRolloverFill;
    tab.doRollover     = this.doRollover;
    tab.draw();
    this.notebook.draw();
  }finally{
    tab = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol.addPage = function(arg){
if(domapi.trace)dump(this.toString()+'.addPage()');
  this.tabset._inLayout   = this._inLayout;
  this.tabset._inUpdate   = this._inUpdate;
  this.notebook._inLayout = this._inLayout;
  this.notebook._inUpdate = this._inUpdate;
  var type        = arg["type"];

  var page = this.notebook.addPage(arg);
  try{
    arg.pane = page;
    this.tabset.addTab(arg);
    this.index = this.tabset.index;//keep them synched
    //this.index = this.notebook.index;
    if(this._inLayout || this._inUpdate)this.layout();
  
    return page;
  }finally{
    page = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol.clear = function(){
  this.tabset.clear();
  this.notebook.clearPages();
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol.loadPage = function(i, url, delay){ // BeamGate Added
  if(i<0 || i>=this.pages.length)return;
  if(this.notebook.pages[i].type == "IFRAME")this.notebook.loadPage(i, url,delay);
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol.setIndex = function(i){
 if(domapi.trace)dump(this.toString()+'.setIndex('+i+')');
 var ok = true;
 if(!this.onbeforechange(i))return false;
 ok = this.tabset.setIndex(i);
 try{
   if(ok)this.onchange(i);
   this.index = this.tabset.index; //match the tabset index always
   return ok;
 }finally{
   ok = null;
 }
};
//------------------------------------------------------------------------------
domapi.comps.imagepagecontrol._setIndex = function(i){ //invoked by siblings(via indexRelation prop)
  var ok = this.notebook.setIndex(i);
  try{
    if(ok)this.index = i;
    return ok;
  }finally{
    ok = null;
  }
};
//------------------------------------------------------------------------------
// this will take a given DOMElement and move it into page number toIndex
// if toIndex is null, it appends a new page for it.
// if toIndex is greater that current number of pages, it will add enough blank pages 
// to equal toIndex
// if a caption is supplied, the page at index toIndex will have it's caption changed to it 
domapi.comps.imagepagecontrol.assignElement = function(arg){
  var elmid     = arg["id"       ];
  var index     = arg["index"    ];
  var overwrite = arg["overwrite"];
  var text      = arg["text"     ];

  var original = domapi.getElm(elmid);
  try{
    if(!original)return;
    if(overwrite == null)overwrite = true;
    original.parentNode.removeChild(original); // remove from dom tree
    if(!index && index != 0){ // if no index passed, append a new page for the transfer
      this.addPage({text: text, type:"DIV"});
      index = this.pages.length-1;
    }
    while(this.pages.length <= index)this.addPage({type:"DIV"}); // make sure we have enough pages
    if(overwrite)this.pages[index].innerHTML = "";
    this.pages[index].appendChild(original);  // add it to the component
    if(text)this.tabset.setTabValue(index, text);
    this.layout();
  }finally{
    original = null;
  }
};
//------------------------------------------------------------------------------