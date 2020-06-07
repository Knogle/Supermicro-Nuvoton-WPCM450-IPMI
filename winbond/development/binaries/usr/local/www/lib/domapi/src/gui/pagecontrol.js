//------------------------------------------------------------------------------
// DomAPI PageControl Component
// D. Kadrioski 9/1/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------

domapi.loadUnit("tabset");
domapi.loadUnit("notebook");
domapi.registerComponent("pagecontrol");
//------------------------------------------------------------------------------
domapi.Pagecontrol = function(arg){return domapi.comps.pagecontrol.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.constructor = function(arg){
  var e              = domapi.Component(arg,"pagecontrol");
  try{
    e.onbeforechange   = function(i){return true};
    e.onchange         = function(i){};
    //-----------
    var _arg           = domapi.copyObject(arg);
    _arg.parent        = e;
    _arg.indexRelation = e;
    _arg.x             = 0;
    _arg.y             = 0;
    _arg.w             = 20;
    _arg.doManage      = false;
    e._tabset          = domapi.Tabset(_arg);
    with(e._tabset){    //divert callbacks to pagecontrol(this)
      onbeforechange   = function(i){
                          if(!this.parentNode.onbeforechange(i))return false;
                          return this.parentNode._setIndex(i);
                          };
      onchange         = function(i){this.parentNode.onchange(i);};
    }
    //-----------
    _arg               = domapi.copyObject(arg);
    _arg.parent        = e;
    _arg.x             = 0;
    _arg.y             = 0;
    _arg.w             = 20;
    _arg.h             = 20;
    //_arg.doManage      = false;
    e._notebook        = domapi.Notebook(_arg);
    //-----------
    e.tabs             = e._tabset.tabs;
    e.pages            = e._notebook.pages;
    e._tabset.doBGFill = false;
    e.tabIndex         = e._tabset.index; //tabset is the event driver here
  
    //dump(e.tabsetOffset );
    domapi._finalizeComp( e);
    return e;
  }finally{
    e    = null;
    _arg = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol._free = function(){
  this.onbeforechange         = null;
  this.onchange               = null;
  /* !! NOTICE !!
    With these following lines commented out, this control will leak a small amount
    of memory in IE.  The trade off is that it will not crash onunload if you have
    nested pagecontrols (see issue #job000220).
    If you are not using nested pagecontrols and are concerned about the memory
    being leaked (roughly two references per pagecontrol) then feel free to uncomment
    these next four lines.
  */
  /*this.tabs                   = [];
  this.pages                  = [];
  this.tabs                   = null;
  this.pages                  = null;*/
  this._tabset.parent         = null;
  this._tabset.indexRelation  = null;
  this._tabset.onbeforechange = null;
  this._tabset.onchange       = null;
  this._tabset                = null;
  this._notebook.parent       = null;
  this._notebook              = null;
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol._draw = function(){
  this.pagecontrolDraw();
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol._layout = function(w,h){
  if(domapi.trace)dump(this.toString()+'._layout()');
  var t  = this._tabset;
  var n  = this._notebook;
  try{
    var th = t.getH();
    if(th==0)return;
    var nbOffset = -2;
    if(!t.tabs.length){nbOffset = -1}
    switch(this.orientation){
      case "top"    :
        t.moveTo(0,0);
        n.moveTo(0,th + nbOffset + 0 - this.tabsetOffset);
        break;
      case "bottom" :
        t.moveTo(0,h - th);
        n.moveTo(0,0);
        break;
    }
  
    var tsOffset = domapi.doSkin?(domapi.isIE?3:3):(domapi.isIE?2:1);
    switch(this.orientation){
      case "top"    :
        t.setW(w + tsOffset, true);
        n.setW(w, true);
        n.setH(h - th - nbOffset + this.tabsetOffset, true);
        break;
      case "bottom" :
        t.setW(w + tsOffset, true);
        n.setW(w, true);
        n.setH(h - th - nbOffset + (t.rows.length == 1?1:0) - this.tabsetOffset, true);
        break;
    }
    n.layout(w,h - th - nbOffset);
    t.layout();
    t.bringToFront();
  }finally{
    t = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.setEnabled = function(b, i){
  if(arguments.length == 1){
    this.enabled = b;
    this._tabset.setEnabled(b);
    this._notebook.setEnabled(b);
  }else try{
    var t = this.tabs;
    var n = t.length - 1;
    if(n < 0 || i > n)return;
    this._tabset  .setEnabled(b,i);
    this._notebook.setEnabled(b,i);
  }finally{
    t = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.pagecontrolDraw = function(){
  if(domapi.trace)dump(this.toString()+'.pagecontrolDraw()');
  var tab = this._tabset;
  try{
    tab.orientation    = this.orientation;
    tab.doBGFill       = false;
    tab.doRolloverFill = this.doRolloverFill;
    tab.doRollover     = this.doRollover;
    this._tabset.draw();
    this._notebook.draw();
  }finally{
    tab = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.addPage = function(arg){
  if(domapi.trace)dump(this.toString()+'.addPage()');
  try{
    var value;
    if(arg["value"])value = arg["value"];
    if(arg["text" ])value = arg["text" ];
    value = domapi.rVal(value, "Page " + (this.pages.length + 1));
    var page = this._notebook.addPage(arg);
    this._tabset.addTab({text:value, pane:page});
    this.tabIndex        = this._tabset.index;
    this._notebook.index = this.tabIndex; //keep them synched
    if(!this._inUpdate)this.layout();
    return page;
  }finally{
    page = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.removePage = function(i){
  return {
    page : this._notebook.removePage(i),
    tab  : this._tabset.  removeTab( i)
  };
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.clear = function(){
  if(domapi.trace)dump(this.toString()+'.clear()');
  this._tabset.clear();
  this._notebook.clearPages();
  this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.setTabValue = function(i,value){
  if(domapi.trace)dump(this.toString()+'.setTabValue()');
  this._tabset.setTabValue(i,value);
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.loadPage = function(i,url,delay){ // BeamGate Added
  delay  = domapi.rBool(delay,false);
  if(domapi.trace)dump(this.toString()+'.loadPage('+[i,url,delay]+')');
  if(i<0 || i>=this.pages.length)return;

  if(!delay && i != this.tabIndex)this.setIndex(i);//url might self.focus, so switch tabs if !delay
  this._notebook.loadPage(i,url,delay);
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol.setIndex = function(i){
 //Goal here is to simulate a click on the tabset, who fires pagecontrol.onbeforechange 
 if(domapi.trace)dump(this.toString()+'.setIndex('+i+')');
 return this._tabset.setIndex(i);    // let the pane manager show it
};
//------------------------------------------------------------------------------
domapi.comps.pagecontrol._setIndex = function(i){
 //Invoked by indexRelation members only
 //to Update the notebook, view.  If all goes well, then this.tabIndex will (eventually)
 //equal tabset index (if approved by siblings). [BeamGate]
 if(domapi.trace)dump(this.toString()+'._setIndex('+i+')');
 //this._notebook.style.display="none";
 var ok= this._notebook.setIndex(i);
 //setTimeout("document.getElementById('"+this._notebook.id+"').style.display=''",1000);
 if(ok)this.tabIndex=i;
 return ok;
};
//------------------------------------------------------------------------------
// this will take a given DOMElement and move it into page number toIndex
// if toIndex is null, it appends a new page for it.
// if toIndex is greater that current number of pages, it will add enough blank pages 
// to equal toIndex
// if a caption is supplied, the page at index toIndex will have it's caption changed to it 
domapi.comps.pagecontrol.assignElement = function(arg){
  if(domapi.trace)dump(this.toString()+'.assignElement()');
  var elmid     = arg["id"       ];
  var index     = arg["index"    ];
  var overwrite = arg["overwrite"];
  var aText     = arg["text"     ];
  if(arg["value"])aText = arg["value"];
  var ie6hack   = false;
  try{
    this.beginUpdate();
    try{
      if(domapi.isIE){
        // hack - IE6 will throw a stack overflow error if an IFRAME is present on any page
        var iframes = this.getElementsByTagName("IFRAME");
        ie6hack = (iframes.length > 0) && (this.style.display != 'none');
        if(ie6hack)this.style.display = 'none';
      }
      var original = domapi.getElm(elmid);
      if(!original)return;
      if(overwrite == null)overwrite = true;
      original.parentNode.removeChild(original); // remove from dom tree
      if(!index && index != 0){ // if no index passed, append a new page for the transfer
        this.addPage({text: aText});
        index = this.pages.length-1;
      }
      while(this.pages.length <= index)this.addPage({text:'Page '+this.pages.length+1,type:"DIV"}); // make sure we have enough pages
      if(overwrite)this.pages[index].innerHTML = "";
      this.pages[index].appendChild(original);  // add it to the component
      if(aText)this._tabset.setTabValue(index, aText);
    }finally{
      this.endUpdate();
      if(ie6hack)this.style.display = '';
    }
    if(ie6hack)setTimeout('document.getElementById("'+this.id+'").layout()', 10);
    else this.layout();
  }finally{
    iframes  = null;
    original = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.pagecontrol._dotabonclick = function(E){
  var pc = domapi.findTarget(E, "PAGECONTROL");
  try{
    if(!pc || !pc.enabled)return false;
    var p = domapi.findTarget(E, "TABSET");if(!p || !p.enabled)return false;
    var e = domapi.findTarget(E, "TAB"   );if(!e || !e.enabled)return false;
    if(domapi.trace)dump(pc.toString()+'._dotabonclick()');
    if(e.selected)return;
    pc.setIndex(domapi.getNodeIndex(e));
    return true;
  }finally{
    pc = null;p = null;e = null;
  }
};
//------------------------------------------------------------------------------