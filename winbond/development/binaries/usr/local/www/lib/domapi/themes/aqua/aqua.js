domapi.theme = new domapi.Theme("aqua");
with(domapi.theme){ // overwrite any properties of the default system Theme
  with(fonts){
    window.color            = "black";
    buttonface.color        = "black";
    application.color       = "black";
    selection.color         = "white";
    highlight.color         = "white";
    menu.color              = "black";
    desktop.color           = "white";
    activecaption.color     = "black";
    inactivecaption.color   = "#585858";

    window.bgcolor          = "white";
    buttonface.bgcolor      = "#EFEFEF";
    application.bgcolor     = "#7392E7";
    desktop.bgcolor         = "#004D9C";
    selection.bgcolor       = "#3169C6";
    highlight.bgcolor       = "#2963BD";
    menu.bgcolor            = "white";
    activecaption.bgcolor   = "#CFCFCF";
    inactivecaption.bgcolor = "#F0F0F0";
  }
  //--------
  ledgerBg1 = "#CCCCCC";
  ledgerBg2 = "#EEEEEE";
  //--------
  with(border){

  }
  //--------
  skin.buttonface.src = skin.path + "buttonface.jpg";
  with(skin.metrics){
    button.endW       = 11; // width of end pieces, not the whole
    button.h          = 23;
    checkbox.w        = 14;
    checkbox.h        = 13;
    tab.endW          = 4;
    tab.h             = 22;
    dropdown.w        = 21;
    dropdown.h        = 21;
    menubar.h         = 21;
    sidebar.rolloverW = 14;
    sidebar.rolloverH = 14;
    spinedit.w        = 19;
    spinedit.h        = 21;    
    window.controlsAlign = "left";
    window.captionAlign  = "center";
  }
}
domapi.Theme.prototype.preDefaults.imagecheckbox = function(arg){
  arg.doBorder = false;
  arg["src"  ] = domapi.theme.skin.checkbox.src;
  domapi._assert(arg, "imgW", 15);
  domapi._assert(arg, "imgH", 16);
  domapi._assert(arg, "w",    200);
  domapi._assert(arg, "h",    16);
  domapi._assert(arg, "checkedState", "grayed");
  domapi._assert(arg, "orientation",  "horizontal");
  domapi._assert(arg, "index",        0);
  domapi._assert(arg, "tabIndex",     1);
  domapi._assert(arg, "text",         "Checkbox" + (domapi.bags.imagecheckbox.length+1));
};
domapi.Theme.prototype.preDefaults.imageradiobutton = function(arg){
  arg.doBorder = false;
  domapi._assert(arg, "imgW", 14);
  domapi._assert(arg, "imgH", 15);
  //domapi._assert(arg, "w",    200);
  domapi._assert(arg, "h",    15);
  domapi._assert(arg, "checkedState", "cleared");
  domapi._assert(arg, "orientation",  "horizontal");
  domapi._assert(arg, "index",        0);
  domapi._assert(arg, "tabIndex",     1);
  domapi._assert(arg, "text",         "Radiobutton" + (domapi.bags.imageradiobutton.length+1));
};
domapi.Theme.prototype.postDefaults.pagecontrol = function(arg){
  domapi._assert(arg, "orientation",  "top" );
  domapi._assert(arg, "tabsetOffset", 10    );
};
domapi.Theme.prototype.preDefaults.popupmenu = function(arg){
  domapi._assert(arg, "doIframeShield", true);
  domapi.comps.popupmenu._draw = function(){
    this.setAlpha(90);
    this.popupmenuDraw();
  };
};
domapi.Theme.prototype.postDefaults.popupmenu = function(arg){
  domapi._assert(arg, "doShadow",    true);
  domapi._assert(arg, "doImages",    true);
  domapi._assert(arg, "chevron",     '&#9658;');   
};
domapi.Theme.prototype.preDefaults.progressbar = function(arg){
  domapi._assert(arg, "orientation", "horizontal");
  if(arg.orientation=="vertical"){
    domapi._assert(arg, "w",  18);
    domapi._assert(arg, "h", 143);
  }else{
    domapi._assert(arg, "w", 143);
    domapi._assert(arg, "h",  18);
  }
  domapi._assert(arg, "progress", 0);
  domapi._assert(arg, "max",    100);
  domapi._assert(arg, "quanta",   1);
  arg._paddingCorrection = 0;
};
domapi.Theme.prototype.preDefaults.resizegrip = function(arg){  
  domapi._assert(arg, "w",    13);
  domapi._assert(arg, "h",    13);
  domapi._assert(arg, "imgW", 11);
  domapi._assert(arg, "imgH", 11);
  domapi._assert(arg, "minW", 24);
  domapi._assert(arg, "minH", 24);
  domapi._assert(arg, "margin",2);
};
domapi.Theme.prototype.preDefaults.slider = function(arg){
  var s = domapi.theme.skin;
  domapi._assert(arg, "w",        150);
  domapi._assert(arg, "h",        37);
  domapi._assert(arg, "thumbW",   15);
  domapi._assert(arg, "thumbH",   16);
  domapi._assert(arg, "mode",     "basin");
  domapi._assert(arg, "reversed", false);
  domapi._assert(arg, "bgImg",    s.path + "slider/horz_bg.gif");
  domapi._assert(arg, "thumbImg", s.path + "slider/horz_thumb.gif");
  if(!arg["basins"])arg["basins"] = [ [9,9], [15,9], [21,9], [27,9], [33,9], [39,9], [45,9], [51,9], [57,9], [63,9], 
                                      [69,9], [75,9], [81,9], [87,9], [93,9], [99,9], [105,9], [111,9], [117,9], [123,9],
                                      [129,9] ];
};
domapi.Theme.prototype.preDefaults.tabset = function(arg){
  domapi._assert(arg, "selOffset",  1);
  domapi._assert(arg, "selFeather", 0);
  domapi._assert(arg, "tabH",       22);
  domapi._assert(arg, "tabIndex",   1);
  domapi._assert(arg, "tabAlign",   "center");
};
//------------------------------------------------------------------------------

domapi.theme.preload = function(){};
