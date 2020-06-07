//------------------------------------------------------------------------------
// DomAPI Notebook Component
// D. Kadrioski 7/19/2003
// (c) Nebiru Software 2001-2003
//------------------------------------------------------------------------------
// Additional contributors where noted
//------------------------------------------------------------------------------

domapi.registerComponent("notebook");
//------------------------------------------------------------------------------
domapi.Notebook = function(arg){return domapi.comps.notebook.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.notebook.constructor = function(arg){
  var e              = domapi.Component(arg,"notebook");
  e.index            = -1;
  e.onbeforechange   = function(i){return true}; // virtual
  e.onchange         = function(i){}; // virtual
  e.pages            = e.childNodes;

  domapi._finalizeComp( e);
  //return e;
  try{ return e }finally{ e = null };
};
//------------------------------------------------------------------------------
domapi.comps.notebook._draw = function(){
  if(domapi.trace)dump(this.toString()+'._draw()');
  this.notebookDraw();
};
//------------------------------------------------------------------------------
domapi.comps.notebook._free = function(){
  this.onbeforechange = null;
  this.onchange       = null;
  this.pages          = null;
};
//------------------------------------------------------------------------------
domapi.comps.notebook._layout = function(w,h){
  if(domapi.trace)dump(this.toString()+'._layout()');
  var i,j,A,t;
  var p = this.pages;
  try{
    for(i=0;i<p.length;i++){
      t = p[i];
      if(this.index == i){
        t.style.width  = "100%";
        t.style.height = "100%";
        if(t.tagName == "IFRAME")
          t.setM(0);
        A = t.getElementsByTagName("DIV");
        for(j=0;j<A.length;j++)
          if(typeof A[j].layout != "undefined")
            A[j].layout();
      }else{
        t.setSize(0,0);
      }
    }
  }finally{
    t = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.notebook.notebookDraw = function(){
 if(domapi.trace)dump(this.toString()+'.notebookDraw()');
  var t = domapi.theme;
  var s = this.style;
  var b = this.doBorder?t.border.width:0;
  var f = domapi.theme.fonts.buttonface;
  var i;
  var p = this.pages;
  var m = this.paneManage;
  var h = (m=="display"?"none":"hidden");
  var v = (m=="display"?""    :"visible");
  try{
    this.setB(b);
    s.borderStyle = this.doBorder?t.border.solid:"none";
    s.borderColor = t.border.getOutset();

    // apply style to pages
    /*if(this.doManage)
      for(i=0;i<p.length;i++)
        p[i].style[m] = this.index==i?v:h;*/
    /*if(domapi.isGecko)
      for(i=0;i<p.length;i++)
        if(i == this.index && p[i].tagName == "IFRAME"){
          //p[i].style.visibility = "hidden";
          //setTimeout("document.getElementById('"+p[i].id+"').style.visibility='visible'",500);
        }*/
  }finally{
    t = null; s = null; f = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.notebook.addPage = function(arg){ // note: url only applies to type IFRAME // RH: Changed
  if(domapi.trace)dump(this.toString()+'.addPage()');
  domapi._assert(arg, "type", "DIV");
  domapi._assert(arg, "doCacheBuster", false);
  var controlType   = arg["type"];
  var url           = arg["url"];
  var delayLoad     = arg["delayLoad"];
  var refreshPage   = arg["refreshPage"];
  var doCacheBuster = arg["doCacheBuster"];
  var e = null;
  try{
    switch(controlType){
      case "DIV":
      case "IFRAME":
      case "TEXTAREA":
      case "P":
        e = 
          domapi.Elm({
            parent:this,
            x:0,y:0,
            w:100,h:100,
            type:controlType,
            frameBorder:0
          });
        break;
    }
    if(!e)return;
    
    e.controlType = controlType;         // RH: Added (now we know what type of content is in the page)
    e.DA_TYPE     = "PAGECONTROLPAGE";
    e.className   = "DA_NOTEBOOKPAGE";
    if(controlType=="IFRAME"){
      e.url               = url;         // RH: Added (Now we later knows the url to ask for)
      e.delayLoad         = delayLoad;   // RH: Added (Supports delaying loading the IFRAME until it is activated)
      e.refreshPage       = refreshPage; // RH: Added (Supports refreshing the IFRAME every time it is activated, good for dynamic content in the iframe)
      e.loaded            = false;       // RH: Added (Tells whether this page is loaded or not (actually; src has been set or not))
      e.doCacheBuster     = doCacheBuster;
      /*if(domapi.isIE)
        e.onreadystatechange = function(){if(this.readyState == "complete")alert(this.readyState)};
      else
        e.onload = function(){alert(1)};*/
      if (!e.delayLoad){                 // RH: Added
        domapi.loadIframe(e, url, doCacheBuster);
        e.loaded = true;                 // RH: Added
      }                                   // RH: Added
      e.frameBorder       = "0";
      e.style.margin      = "2px";
      e.style.overflow    = "auto";
    }
    if(this.pages.length == 1)this.index = 0;
    //----------
    if(!this._inUpdate && !this.parentNode._inUpdate)this.layout();
    this.draw(); // sets the styles and positions the objects
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.notebook.removePage = function(i){
  var n = this.pages.length - 1;
  if(n < 0 || i > n)return null;
  return this.pages[i].parentNode.removeChild(this.pages[i]);
};
//------------------------------------------------------------------------------
domapi.comps.notebook.setIndex = function(i){
  if(domapi.trace)dump(this.toString()+'.setIndex('+i+' of '+(this.pages.length-1)+')');
  var n = this.pages.length - 1;
  if(!this.enabled || n<0 || i>n)return false;
  if(!this.onbeforechange(i))return false;
  domapi.closeAllDropdowns();
  var p = this.pages[i];
  try{
    if (p.tagName == "IFRAME" && (p.refreshPage || (p.delayLoad && !p.loaded))){
      p.loaded = true;
      domapi.loadIframe(p,p.url,p.doCacheBuster);
      if(domapi.trace)dump(this.toString()+' RefreshDelayLoading:'+p.url);
    }
    this.index = i;
    this.onchange(i);
    this._draw();
    this.layout();
  }catch(E){
    
  }finally{
    p = null;
    return true;
  }
};
//------------------------------------------------------------------------------
// RH: Load the URL (default if url is not sent in, URL if sent) into the given
// pageNo in the pagecontrol.
// BeamGate:  Added delay mode and index tracking
domapi.comps.notebook.loadPage = function(i,url,delay,doCacheBuster){
  var p = this.pages;
  if(i<0 || i>=p.length)return;
  var page=p[i];
  delay         = domapi.rBool(delay,         false);
  doCacheBuster = domapi.rBool(doCacheBuster, false);
  if(page.controlType != "IFRAME")return;
  url= url?url:page.url;
  page.loaded = false;
  if(!delay){
    domapi.loadIframe(page, url, doCacheBuster);
    page.loaded = true;
  }else{
   page.delayLoad = true;
  }
  page.doCacheBuster = doCacheBuster;
  page.url           = url; //keep url insynch with changes
  if(domapi.trace)dump(this.toString()+".loadPage("+i+",'"+url+"',"+delay+")");
  p = null; page = null;
};

//------------------------------------------------------------------------------
// this will take a given DOMElement and move it into page number toIndex
// if toIndex is null, it appends a new page for it.
// if toIndex is greater that current number of pages, it will add enough blank pages 
// to equal toIndex
domapi.comps.notebook.assignElement=function(arg){
  if(domapi.trace)dump(this.toString()+'.assignElement()');
  var elmid     = arg["id"       ];
  var index     = arg["index"    ];
  var overwrite = arg["overwrite"];
  var original  = domapi.getElm(elmid);
  if(!original)return;
  if(overwrite == null)overwrite = true;
  original.parentNode.removeChild(original); // remove from dom tree
  if(!index && index != 0){ // if no index passed, append a new page for the transfer
    this.addPage({});
    index = this.pages.length-1;
  }
  while(this.pages.length<index+1)this.addPage({}); // make sure we have enough pages
  if(overwrite)this.pages[index].innerHTML = "";
  this.pages[index].appendChild(original);  // add it to the component
  original = null;
};
//------------------------------------------------------------------------------
// this clears all pages
domapi.comps.notebook.clearPages = function(){
  var p = this.pages;
  for(var i=p.length;i>0;i--){ this.removePage(i-1);}
  this.index = -1;
  this.draw();
  p = null;
};

//------------------------------------------------------------------------------
domapi.comps.notebook.setEnabled = function(b, i){
  if(arguments.length == 1){
    this.enabled = b;
  }else{
     var p = this.pages;
     var n = p.length - 1;
     if(n < 0 || i > n){p = null;return;}
     p[i].enabled=b;
  }
  p = null;
};
//------------------------------------------------------------------------------
domapi.comps.notebook.next = function(){
  var n = this.pages.length - 1;
  if(n<0)return false;
  return this.setIndex((this.index < n)?this.index + 1:0);
};
//------------------------------------------------------------------------------
domapi.comps.notebook.previous = function(){
  var n = this.pages.length - 1;
  if(n<0)return false;
  return this.setIndex((this.index > 0)?this.index - 1:n);
};
//------------------------------------------------------------------------------