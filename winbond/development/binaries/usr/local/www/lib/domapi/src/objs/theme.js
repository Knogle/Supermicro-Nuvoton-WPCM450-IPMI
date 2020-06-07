//------------------------------------------------------------------------------
// DomAPI theme routines
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------
// Objects contained within this unit:
// domapi.Theme()
// domapi.Border()
// domapi.Font()
// domapi.Skin()
// A Theme object contains (1) Border object called 'border', (1) Skin Object
// called 'skin' and numerous Font Objects in a collection called 'fonts'
//------------------------------------------------------------------------------
// The system Theme is automatically loaded.  Access it through domapi.theme
// i.e. alert(domapi.Theme.border.width);
// To add additional themes at runtime, use domapi.loadTheme()
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Font object
//------------------------------------------------------------------------------
domapi.Font = function(weight,size,family,color,bgcolor,unit){
  this.weight  = domapi.rVal(weight  ,"");
  this.size    = domapi.rInt(size    ,10) + domapi.rVal(unit,"pt");
  this.family  = domapi.rVal(family  ,'"MS Sans Serif",Geneva,sans-serif');
  this.color   = domapi.rVal(color   ,"buttonface");
  this.bgcolor = domapi.rVal(bgcolor ,"transparent");
};
//------------------------------------------------------------------------------
domapi.Font.prototype.cssColor = function(force){
  if(force)force = " !important;";else force = ";";
  return "color:"            + this.color   + force +
         "background-color:" + this.bgcolor + force;
};
//------------------------------------------------------------------------------
domapi.Font.prototype.cssFont = function(force){
  if(force)force = " !important;";else force = ";";
  var r = new RegExp('"', "g");
  return "font:" +
         this.weight + " " +
         this.size   + " " +
         this.family.replace(r,'\\"') + force;
};
//------------------------------------------------------------------------------
domapi.Font.prototype.asCSS = function(force){
  return this.cssColor(force) +
         this.cssFont(force);
};
//------------------------------------------------------------------------------
domapi.Font.prototype.asString = function(){
  return this.weight + " " +
         this.size   + " " +
         this.family;
};
//------------------------------------------------------------------------------
domapi.Font.prototype.apply = function(e, doBGFill){
  doBGFill = domapi.rBool(doBGFill,true);
  e.style.color           = this.color;
  if(doBGFill)
    e.style.backgroundColor = this.bgcolor;
  e.style.font            = this.asString();
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Border object
//------------------------------------------------------------------------------
domapi.Border = function(){  
  this.width     = 1;
  this.outset    = "outset"; // what to use for outset
  this.inset     = "inset";  // what to use for inset
  this.solid     = "solid";  // what to use for solid border
  this.frame     = "groove";
  //-------
  if(domapi.isKHTML){
    this.active    = "activeborder";
    this.inactive  = "buttonface";
    this.highlight = "#FFFFFF";
    this.shadow    = "#808080";
    this.threed    = {
      face        : "threedface",
      shadow      : "#808080",
      lightShadow : "threedlightshadow",
      darkShadow  : "threeddarkshadow",
      highlight   : "#FFFFFF"
    };
  }else{
    this.active    = "activeborder";
    this.inactive  = "inactiveborder";
    this.highlight = "buttonhighlight";
    this.shadow    = "buttonshadow";
    this.threed    = {
      face        : "threedface",
      shadow      : "threedshadow",
      lightShadow : "threedlightshadow",
      darkShadow  : "threeddarkshadow",
      highlight   : "threedhighlight"
    };
  }
};
//------------------------------------------------------------------------------
domapi.Border.prototype.getOutset = function(){
  return this.threed.highlight + " " +
         this.threed.shadow    + " " +
         this.threed.shadow    + " " +
         this.threed.highlight;
};
//------------------------------------------------------------------------------
domapi.Border.prototype.getInset = function(){
  return this.threed.shadow    + " " +
         this.threed.highlight + " " +
         this.threed.highlight + " " +
         this.threed.shadow;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Skin object
//------------------------------------------------------------------------------
domapi.Skin = function(nm){
  nm              = domapi.rVal(nm,"system");
  this.path       = domapi.themePath + nm + "/";
  this.preloaded  = [];  // array of classnames that have been preloaded for this skin
  this.built      = [];  // array of classnames that have had their css built for this skin
  //----------
  this.shim       = {src : domapi.themePath + "shim.gif"};
  this.buttonface = {src : this.path        + "buttonface.gif"};
  this.shadow     = {src : this.path        + "shadow.png"};
  //----------
  // theme specific layout settings
  this.metrics = { 
    button      : {endW: 8, h: 23},
    checkbox    : {w:13, h:13},
    drag        : { iconW      : 18, iconH      : 18, 
                    iconOffsetX:  1, iconOffsetY: 15
                  },
    dropdown    : {w: 16,   h: 20},
    headerbar   : {h: 16},
    menubar     : {h: 25},
    rowbar      : {w: 8},
    sidebar     : { rolloverW : 17, 
                    rolloverH : 17,
                    padding   : 20
                  },
    scrollbar   : { // values, as written, for vertical bar - will inverse for horizontal
                    btnW: 13, btnH: 16,
                    endH       : 18, // size of "thumb dock" - osx
                    thumbH     : 7,  // stubby ends of the thumb
                    btnPos     : 2,  // 0 = top and bottom (win), 1 = grouped at top, 2 = grouped at bottom (mac)
                    thumbMargin: 12  // amount thumb can come into ends (dock)
                  },
    speedbutton : {w: 27,   h: 23},
    spinedit    : {w: 16,   h: 20},
    splitter    : {w: 3},
    tab         : {endW: 3, h: 23},
    viewbar     : {smallH: 17, largeH: 31},    
    window      : {
      resizeBdr       : 20,
      minH            : 40,
      minW            : 120,
      minimizedW      : 150,
      visibleButtons  : 1+2+8, // 1=min 2=max/res 4=hlp 8=cls
      doCreateButtons : true,
      btnW            : 16,
      btnH            : 14,
      titleBarHeight  : 20,
      controlsAlign   : "right",
      captionAlign    : "left",
      titlePadding    : 2,
      separatorW      : 2
    }
  };
  this.shadowColor = '#707070';
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// theme stuff
// you can include new themes by placing
// constructors in an external file
// see src/themes/aqua for an example of this
//------------------------------------------------------------------------------
// Theme object
//------------------------------------------------------------------------------
domapi.Theme = function(nm){
  var face             = 'Arial,Geneva,sans-serif';
  nm                   = domapi.rVal(nm,"system");
  this.name            = nm;
  this.applied         = false;
  this.guid            = domapi.guid();
  this.border          = new domapi.Border();
  this.skin            = new domapi.Skin(nm);
  //--------
  this.fonts           = {};
  var f                = this.fonts;
  if(domapi.isKHTML){
    f.window             = new domapi.Font("",9,face,"windowtext"         ,"window");
    f.buttonface         = new domapi.Font("",9,face,"buttontext"         ,"buttonface");
    f.inactivebuttonface = new domapi.Font("",9,face,"#808080"            ,"buttonface");
    f.application        = new domapi.Font("",9,face,"buttontext"         ,"#808080");
    f.selection          = new domapi.Font("",9,face,"highlighttext"      ,"#0A246A");
    f.highlight          = new domapi.Font("",9,face,"buttontext"         ,"#C6D3EF");
    f.menu               = new domapi.Font("",9,face,"buttontext"         ,"buttonface");
    f.desktop            = new domapi.Font("",9,face,"highlighttext"      ,"#3A6EA5");
    f.activecaption      = new domapi.Font("",9,face,"#FFFFFF"            ,"#0A246A");
    f.inactivecaption    = new domapi.Font("",9,face,"inactivecaptiontext","#808080");  
  }else{
    f.window             = new domapi.Font("",9,face,"windowtext"         ,"window");
    f.buttonface         = new domapi.Font("",9,face,"buttontext"         ,"buttonface");
    f.inactivebuttonface = new domapi.Font("",9,face,"graytext"           ,"buttonface");
    f.application        = new domapi.Font("",9,face,"buttontext"         ,"appworkspace");
    f.selection          = new domapi.Font("",9,face,"highlighttext"      ,"highlight");
    f.highlight          = new domapi.Font("",9,face,"buttontext"         ,"#C6D3EF");
    f.menu               = new domapi.Font("",9,face,"menutext"           ,"menu");
    f.desktop            = new domapi.Font("",9,face,"highlighttext"      ,"background");
    f.activecaption      = new domapi.Font("",9,face,"captiontext"        ,"activecaption");
    f.inactivecaption    = new domapi.Font("",9,face,"inactivecaptiontext","inactivecaption");
  }
  //--------
  this.scrollbar       = "scrollbar";
  this.windowframe     = "windowframe";
  //--------
  this.colorFadeInc    = 10; // for components that support color fading
  this.colorFadeSpeed  = 10; // for components that support color fading
  //--------
  this.ledgerBg1       = "#FFFFDB";
  this.ledgerBg2       = "#EFFFEF";
  this.ledgerFg1       = "windowtext";
  this.ledgerFg2       = "windowtext";
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.clone = function(){
  var r = new Theme();
  for(var a in this)
    if(typeof this[a] == "string" || typeof this[a] == "number")r[a] = this[a];
  r.guid = domapi.guid(); // never clone the guid, get another instead
  return r;
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.apply = function(k){
  domapi.theme = this;  
  if(domapi.doStyleBody){
    var s;
    var t  = this;
    if(!t.fonts){
      if(k)
        setTimeout("this.apply('"+k+"')",100);
      else
        setTimeout("this.apply()",100);
      return;
    }
    k = domapi.rVal(k,"buttonface");
    k = String(k).toLowerCase();
    var B  = domapi.bodyElm();
    if(B)s = B.style;
    var f = t.fonts.buttonface;
    switch(k){
      case "window" :
        f = t.fonts.window;
        break;
      case "application" :
        f = t.fonts.application;
        break;
      case "buttonface" :
        f = t.fonts.buttonface;
        if(s)
          s.backgroundImage = domapi.doSkin?"url(" + t.skin.buttonface.src + ")" : "none";
        break;
    }
    if(s){
      s.color           = f.color;
      s.backgroundColor = f.bgcolor;
      s.font            = f.asString();
    }
  }
  // apply to any components
  var b = domapi.bags.elms;
  var l = b.length;
  var c;
  for(var i=l;i>0;i--){
    c = b[i-1];
    if(c.isComponent){
      c.draw();
      if(c.refresh)c.refresh();
      // HACK ALERT!!! descendants of DROPDOWN behave badly when applying theme
      if(domapi.isGecko && c.DA_TYPE == "COMBOBOX" || c.DA_TYPE == "DATEPICKER"){
        var bb = this.border.width*2;
        c.layout(c.getW()-bb,c.getH()-bb);
      }else
        c.layout();
    }
  }

  this.preload(); // fire off user-defined preloader; for overrides
  domapi.theme.applied = true;
};
//------------------------------------------------------------------------------
domapi.themes = {}; // theme collection - use domapi.loadTheme() to add to it
//------------------------------------------------------------------------------
domapi.rTheme = function(t){
  t = t?t:domapi.theme; // default to current theme if not specified
  return t.clone();
};
//------------------------------------------------------------------------------
domapi._assert = function(arg,nm,val){
  if(typeof val == "number" )arg[nm] = domapi.rInt( arg[nm],val);else
  if(typeof val == "boolean")arg[nm] = domapi.rBool(arg[nm],val);else
  arg[nm] = domapi.rVal( arg[nm],val);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages = {};
domapi.Theme.prototype.preDefaults   = {};
domapi.Theme.prototype.postDefaults  = {};
domapi.Theme.prototype.toString = function(){return "[object Theme]"};
//------------------------------------------------------------------------------














// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************

/*

  End of formal code for this unit.  What follows are component specific
  definitions for all the components that ship with DomAPI.
  Every theme inherits these defaults, and they are free to alter or add to them
  in that theme's own definition file.

  For every component, there can be any of these optional function types:
  preloadImages, preDefaults, postDefaults
  These are all optional and are not required by the Theme engine to be present.
  Thirdparty components can add these functions, if needed, in their  own definition
  files.

  There is no need to alter this unit, neither for adding new themes or
  adding new components.

*/

// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************














//------------------------------------------------------------------------------
// Button
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.button = function(arg){
  domapi._assert(arg, "h",        domapi.theme.skin.metrics.button.h);
  domapi._assert(arg, "text",     "Button" + (domapi.bags.button.length+1));
  domapi._assert(arg, "tabIndex", 1);
  if(!arg["w"])arg["w"] = domapi.textWidth(arg["text"]) + 30;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Calendar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.calendar = function(arg){
  domapi._assert(arg, "w",             155);
  domapi._assert(arg, "h",             158);
  domapi._assert(arg, "value",         sysutils.now());
  domapi._assert(arg, "mask",          sysutils.defaultDateMask);
  domapi._assert(arg, "doMultiSelect", false);  
  domapi._assert(arg, "mode",          "normal");  // or "compact"
  // i tried and tried to get moz to behave, but i can't control the size of it
  // if doborder is allowed to be changed.  it's always 3 off, plus it shrinks
  if(domapi.isGecko){
    arg["w"] += 3;
    arg["h"] += 3;
  }
  domapi._assert(arg, "doShowControls", true);
  domapi._assert(arg, "doShowTitle",    true);
  domapi._assert(arg, "doShowDays",     true);
  if(arg["mode"] == "compact"){
    arg["doShowTitle"   ] = false;
    arg["doShowControls"] = false;
    arg["doShowDays"    ] = false;
  }
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.calendar = function(arg){
  domapi._assert(arg, "doShowToday",    true);
  domapi._assert(arg, "doShowHolidays", true);
  domapi._assert(arg, "tabIndex",       1   );
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.calendar = function(){
  var s = domapi.theme.skin;
  s.calendarLeft  = new Image();s.calendarLeft.src  = s.path + "calendar/left.gif";
  s.calendarRight = new Image();s.calendarRight.src = s.path + "calendar/right.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Colorpane
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.colorpane = function(arg){
  domapi._assert(arg, "w",         225);
  domapi._assert(arg, "h",         350);
  domapi._assert(arg, "value",     "#FFFFFF");
  arg.curtainImg   = domapi.theme.skin.path + "colorpicker/curtain.png";
  arg.faderImg     = domapi.theme.skin.path + "colorpicker/fader.png";
  arg.crosshairImg = domapi.theme.skin.path + "colorpicker/cursor.gif";
  arg.arrowImg     = domapi.theme.skin.path + "colorpicker/arrow.gif";
  arg.curtainW     = 175;
  arg.curtainH     = 187;
  arg.faderW       = 10;
  arg.faderH       = 187;
  arg.crosshairW   = 19;
  arg.crosshairH   = 19;
  arg.arrowW       = 5;
  arg.arrowH       = 9;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Colorpicker
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.colorpicker = function(arg){
  domapi._assert(arg, "w",           150);
  domapi._assert(arg, "h",           domapi.theme.skin.metrics.dropdown.h);
  domapi._assert(arg, "value",       "#FFFFFF");
  domapi._assert(arg, "autoClose",   true);
  domapi._assert(arg, "doAllowEdit", true);
  domapi._assert(arg, "tabIndex",    1);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Combobox
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.combobox = function(arg){
  domapi._assert(arg, "w", 150);
  domapi._assert(arg, "h", domapi.theme.skin.metrics.dropdown.h);
  domapi._assert(arg, "doAllowEdit",    true);
  domapi._assert(arg, "doAutoComplete", false);
  domapi._assert(arg, "tabIndex",       1);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Combobox2
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.combobox2 = function(arg){
  domapi._assert(arg, "w", 150);
  domapi._assert(arg, "autoClose", true);
  domapi._assert(arg, "h", domapi.theme.skin.metrics.dropdown.h);
  domapi._assert(arg, "dropdownW", 130);
  domapi._assert(arg, "dropdownH", 150);
  domapi._assert(arg, "allowEdit", true);
  //if(domapi.isGecko)arg["w"] += domapi.theme.border.width * 2;
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.combobox2 = function(){
  var s = domapi.theme.skin;
  s.combobox2 = new Image();s.combobox2.src = s.path + "dropdown/button.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Datepicker
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.datepicker = function(arg){
  domapi._assert(arg, "w",         150);
  domapi._assert(arg, "h",         domapi.theme.skin.metrics.dropdown.h);
  domapi._assert(arg, "value",     sysutils.now());
  domapi._assert(arg, "mask",      sysutils.defaultDateMask);
  domapi._assert(arg, "allowEdit", true);
  domapi._assert(arg, "tabIndex",  1);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Datepicker2
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.datepicker2 = function(arg){
//  domapi._assert(arg, "position",  "relative");
  domapi._assert(arg, "w",         120);
  domapi._assert(arg, "imgW",      16);
  domapi._assert(arg, "imgH",      16);
  domapi._assert(arg, "autoClose", true);
  domapi._assert(arg, "src",       domapi.theme.skin.path + "datepicker2/picker.gif");
  domapi._assert(arg, "value",     sysutils.now());
  domapi._assert(arg, "mask",      sysutils.defaultDateMask);
  domapi._assert(arg, "allowEdit", true);
  domapi._assert(arg, "hint",      domapi.getString("DATEPICKER2_DROPDOWN"));
};

//------------------------------------------------------------------------------
// Dropdown
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.dropdown = function(arg){
  domapi._assert(arg, "w", 130);
  domapi._assert(arg, "h", domapi.theme.skin.metrics.dropdown.h);
  domapi._assert(arg, "tabIndex", 1);
  if(domapi.isGecko)arg["w"] += domapi.theme.border.width * 2;
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.dropdown = function(){
  var s = domapi.theme.skin;
  s.dropdown = new Image();s.dropdown.src = s.path + "form/dropdown.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Icon
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.icon = function(arg){
  domapi._assert(arg, "doAllowMove", true);
  domapi._assert(arg, "doDepress",   false);
  domapi._assert(arg, "doRollover",  false);  
};

//------------------------------------------------------------------------------
// Imagecheckbox
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.imagecheckbox = function(arg){
  var m = domapi.theme.skin.metrics.checkbox;
  arg.doBorder = false;
  arg["src"  ] = domapi.theme.skin.checkbox.src;
  domapi._assert(arg, "imgW", m.w);
  domapi._assert(arg, "imgH", m.h);
  domapi._assert(arg, "w",    120);
  domapi._assert(arg, "h",    m.h);
  domapi._assert(arg, "checkedState", "grayed");
  domapi._assert(arg, "orientation",  "horizontal");
  domapi._assert(arg, "index",        0);
  domapi._assert(arg, "tabIndex",     1);
  domapi._assert(arg, "text",         "Checkbox" + (domapi.bags.imagecheckbox.length+1));
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.imagecheckbox = function(){
  var s = domapi.theme.skin;
  s["checkbox"] = new Image();s["checkbox"].src = s.path + "form/checkbox.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Imagelist
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.imagelist = function(arg){
  domapi._assert(arg, "w", 16);
  domapi._assert(arg, "h", 16);
  domapi._assert(arg, "orientation", "horizontal");
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Imagepagecontrol
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.imagepagecontrol = function(arg){
  domapi._assert(arg, "orientation", "top" );
  domapi._assert(arg, "overlap",     0);
  domapi._assert(arg, "paneManage",  "visibility"); // or display; your choice
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Imageradiobutton
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.imageradiobutton = function(arg){
  arg.doBorder = false;
  domapi._assert(arg, "imgW", 12);
  domapi._assert(arg, "imgH", 12);
  //domapi._assert(arg, "w",    120);  autocalc in unit file
  domapi._assert(arg, "h",    12);
  domapi._assert(arg, "checkedState", "cleared");
  domapi._assert(arg, "orientation",  "horizontal");
  domapi._assert(arg, "tabIndex",     1);
  domapi._assert(arg, "text",         "Radiobutton" + (domapi.bags.imageradiobutton.length+1));
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.imageradiobutton = function(){
  var s = domapi.theme.skin;
  s["radio"] = new Image();s["radio"].src = s.path + "form/radio.gif";    
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Imageradiogroup
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.imageradiogroup = function(arg){
  domapi._assert(arg, "w",         200);
  domapi._assert(arg, "h",         200);
  domapi._assert(arg, "itemIndex", -1);
  domapi._assert(arg, "text",      "Radiogroup" + (domapi.bags.imageradiogroup.length+1));
  domapi._assert(arg, "cols",      1);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Imagetabset
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.imagetabset = function(arg){
  arg.doBorder = false;
  domapi._assert(arg, "orientation", "horizontal");
  domapi._assert(arg, "overlap",     0);
  domapi._assert(arg, "paneManage",  "visibility"); // or display; your choice
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Label
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.label = function(arg){
  domapi._assert(arg, "doBGFill", false);
  domapi._assert(arg, "doBorder", false);
  domapi._assert(arg, "text",     "Label"+(domapi.bags.label.length + 1));
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Listbox
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.listbox = function(arg){
  domapi._assert(arg, "doHLines",        true );
  domapi._assert(arg, "doAllowNoSelect", false);
  domapi._assert(arg, "doShowSelection", true );
  domapi._assert(arg, "doLedger",        false);
  domapi._assert(arg, "doAutoWidth",     false);
  domapi._assert(arg, "minWidth",        50   );
  domapi._assert(arg, "doMultiSelect",   false);
  domapi._assert(arg, "tabIndex",        1    );
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Listgrid
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.listgrid = function(arg){  
  var t = domapi.theme;
  domapi._assert(arg, "doLedger",           false);
  domapi._assert(arg, "gridlines",          'both');
  domapi._assert(arg, "doShowRowbar",       true );
  domapi._assert(arg, "doShowHeader",       true );
  domapi._assert(arg, "doMultiSelect",      false);
  domapi._assert(arg, "doShowSelection",    true );
  domapi._assert(arg, "doAllowNoSelect",    false);
  domapi._assert(arg, "doAllowEdit",        true );
  domapi._assert(arg, "doColResize",        true );
  domapi._assert(arg, "doColMove",          true );
  domapi._assert(arg, "doColSort",          true );
  domapi._assert(arg, "doDepress",          true );
  domapi._assert(arg, "resizeBdr",          10);
  domapi._assert(arg, "minColWidth",        20);
  domapi._assert(arg, "headerH",            t.skin.metrics.headerbar.h);
  domapi._assert(arg, "rowbarW",            10);
  domapi._assert(arg, "selectMode",         "row");
  domapi._assert(arg, "tabIndex",           1);
  domapi._assert(arg, "doVirtualMode",      false); // cannot be changed after creation
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.listgrid = function(){
  var s = domapi.theme.skin;
  s.lg_rowindicator = new Image();s.lg_rowindicator.src = s.path + "listgrid/rowindicator.gif";
  s.lg_rowedit      = new Image();s.lg_rowedit.src      = s.path + "listgrid/rowedit.gif";
  s.lg_sortup       = new Image();s.lg_sortup.src       = s.path + "listgrid/sortup.gif";
  s.lg_sortdown     = new Image();s.lg_sortdown.src     = s.path + "listgrid/sortdown.gif";
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Menubar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.menubar = function(arg){
  domapi._assert(arg, "h", 20);
  domapi._assert(arg, "popupX", 0);
  domapi._assert(arg, "popupY", 0);
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.menubar = function(arg){
  domapi._assert(arg, "doShadow", true);
  domapi._assert(arg, "doImages", true);
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.menubar = function(){
  var s = domapi.theme.skin;
  s.menubarBG = new Image();s.menubarBG.src = s.path + "popupmenu/normal.jpg";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Notebook
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.notebook = function(arg){
  domapi._assert(arg, "paneManage", "display"); // or visibility; your choice
  domapi._assert(arg, "doManage",   true);      // some parents may take over management
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Outlookbar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.outlookbar = function(arg){
  domapi._assert(arg, "valign", "justify");
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.outlookbar = function(){
  var s = domapi.theme.skin;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Pagecontrol
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.pagecontrol = function(arg){
  domapi._assert(arg, "orientation",  "top" );
  domapi._assert(arg, "tabsetOffset", 0     );
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Popupmenu
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.popupmenu = function(arg){
  domapi._assert(arg, "doIframeShield", true);
  domapi._assert(arg, "mouseButton",    1);
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.popupmenu = function(arg){
  domapi._assert(arg, "doShadow",    true);
  domapi._assert(arg, "doImages",    true);
  domapi._assert(arg, "chevron",     domapi.isIE?"&#9658;":"&#9654;");
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.popupmenu = function(){
  var s = domapi.theme.skin;
  var p = s.path + "popupmenu/";
  s.popupmenuNorm   = new Image();s.popupmenuNorm.src   = p + "normal.gif";
  s.popupmenuFocus  = new Image();s.popupmenuFocus.src  = p + "focus.gif";
  s.popupmenuStates = new Image();s.popupmenuStates.src = p + "states.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Progressbar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.progressbar = function(arg){
  domapi._assert(arg, "orientation", "horizontal");
  if(arg.orientation=="vertical"){
    domapi._assert(arg, "w",  16);
    domapi._assert(arg, "h", 143);
  }else{
    domapi._assert(arg, "w", 143);
    domapi._assert(arg, "h",  16);
  }
  domapi._assert(arg, "progress", 0);
  domapi._assert(arg, "max",    100);
  domapi._assert(arg, "quanta",   1);
  arg._paddingCorrection = 6;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Resizegrip
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.resizegrip = function(arg){  
  domapi._assert(arg, "w",    14);
  domapi._assert(arg, "h",    14);
  domapi._assert(arg, "imgW", 12);
  domapi._assert(arg, "imgH", 12);
  domapi._assert(arg, "minW", 24);
  domapi._assert(arg, "minH", 24);
  domapi._assert(arg, "margin",2);
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.resizegrip = function(){
  var s = domapi.theme.skin;
  s.resizegrip = s.path + "resizegrip/resizegrip.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Rollover
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.rollover = function(arg){
  domapi._assert(arg, "src",   "");
  domapi._assert(arg, "w",     80);
  domapi._assert(arg, "h",     23);
  domapi._assert(arg, "count", 3);
  domapi._assert(arg, "orientation", "horizontal");
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Scrollbar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.scrollbar = function(){
  var s = domapi.theme.skin;
  //----------
  s.sb_v_base_bot = new Image();s.sb_v_base_bot.src = s.path + "sb_v_base_bot.gif";
  s.sb_v_base_mid = new Image();s.sb_v_base_mid.src = s.path + "sb_v_base_mid.gif";
  s.sb_v_base_top = new Image();s.sb_v_base_top.src = s.path + "sb_v_base_top.gif";
  s.sb_v_btn_dwn  = new Image();s.sb_v_btn_dwn.src  = s.path + "sb_v_btn_dwn.gif";
  s.sb_v_btn_up   = new Image();s.sb_v_btn_up.src   = s.path + "sb_v_btn_up.gif";
  s.sb_v_th_bot   = new Image();s.sb_v_th_bot.src   = s.path + "sb_v_th_bot.gif";
  s.sb_v_th_mid   = new Image();s.sb_v_th_mid.src   = s.path + "sb_v_th_mid.gif";
  s.sb_v_th_top   = new Image();s.sb_v_th_top.src   = s.path + "sb_v_th_top.gif";
  //----------
  s.sb_h_base_bot = new Image();s.sb_h_base_bot.src = s.path + "sb_h_base_bot.gif";
  s.sb_h_base_mid = new Image();s.sb_h_base_mid.src = s.path + "sb_h_base_mid.gif";
  s.sb_h_base_top = new Image();s.sb_h_base_top.src = s.path + "sb_h_base_top.gif";
  s.sb_h_btn_dwn  = new Image();s.sb_h_btn_dwn.src  = s.path + "sb_h_btn_dwn.gif";
  s.sb_h_btn_up   = new Image();s.sb_h_btn_up.src   = s.path + "sb_h_btn_up.gif";
  s.sb_h_th_bot   = new Image();s.sb_h_th_bot.src   = s.path + "sb_h_th_bot.gif";
  s.sb_h_th_mid   = new Image();s.sb_h_th_mid.src   = s.path + "sb_h_th_mid.gif";
  s.sb_h_th_top   = new Image();s.sb_h_th_top.src   = s.path + "sb_h_th_top.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Scrollbutton
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.scrollbutton = function(arg){
  domapi._assert(arg, "w",         12);
  domapi._assert(arg, "h",         12);
  domapi._assert(arg, "index",     0);
  domapi._assert(arg, "direction", "top");
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.scrollbutton = function(){
  var s = domapi.theme.skin;
  s["scrollbutton"] = new Image();s["scrollbutton"].src = s.path + "scrollbutton/scrollbutton.gif";    
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Sidebar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.sidebar = function(arg){
  domapi._assert(arg, "doBorder",                 false);
  domapi._assert(arg, "doAllowAllOpen",           true);
  domapi._assert(arg, "doAllowClosing",           true);
  domapi._assert(arg, "doAllowHeaderClick",       false);
  domapi._assert(arg, "doAllowHeaderDoubleClick", true);
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.sidebar = function(){
  var s = domapi.theme.skin;
  s.sidebarOpen  = new Image();s.sidebarOpen.src  = s.path + "sidebar/open.gif";
  s.sidebarClose = new Image();s.sidebarClose.src = s.path + "sidebar/close.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Simplegrid
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.simplegrid = function(arg){
  domapi._assert(arg, "doBorder",                 true);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Slider
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.slider = function(arg){
  var s = domapi.theme.skin;
  domapi._assert(arg, "w",        150);
  domapi._assert(arg, "h",        37);
  domapi._assert(arg, "thumbW",   11);
  domapi._assert(arg, "thumbH",   21);
  domapi._assert(arg, "mode",     "basin");
  domapi._assert(arg, "reversed", false);
  domapi._assert(arg, "bgImg",    s.path + "slider/horz_bg.gif");
  domapi._assert(arg, "thumbImg", s.path + "slider/horz_thumb.gif");
  if(!arg["basins"])arg["basins"] = [ [9,6], [15,6], [21,6], [27,6], [33,6], [39,6], [45,6], [51,6], [57,6], [63,6], 
                                      [69,6], [75,6], [81,6], [87,6], [93,6], [99,6], [105,6], [111,6], [117,6], [123,6],
                                      [129,6] ];
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Speedbutton
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.speedbutton = function(arg){
  domapi._assert(arg, "enabled",     true);
  domapi._assert(arg, "text",        "");
  domapi._assert(arg, "hint",        arg["text"]);
  domapi._assert(arg, "orientation", "horizontal");
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.speedbutton = function(arg){
  domapi._assert(arg, "radioGroup",       0);
  // we'll assume the image is 32x16 if not specified.
  // when clipping, the left 16x16 is the normal state, and the right 16x16 is the disabled state.
  // in between are over and down states
  domapi._assert(arg, "imgW",           16);
  domapi._assert(arg, "imgH",           16);
  domapi._assert(arg, "imgOrientation", "horizontal");
  domapi._assert(arg, "doAllowAllUp",   false);
  domapi._assert(arg, "down",           false);
  domapi._assert(arg, "kind",           "button");
  domapi._assert(arg, "dropdownArrow",  "&#9660;");
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Spinedit
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.spinedit = function(arg){
  domapi._assert(arg, "w",               130);
  domapi._assert(arg, "h",               domapi.theme.skin.metrics.spinedit.h);  
  domapi._assert(arg, "step",            1);
  domapi._assert(arg, "value",           0);
  domapi._assert(arg, "min",             0);
  domapi._assert(arg, "max",             1000);
  domapi._assert(arg, "doWarning",       true);
  domapi._assert(arg, "holdInterval",    500);
  domapi._assert(arg, "revolveInterval", 100);
  if(domapi.isGecko){
    arg["w"] += domapi.theme.border.width * 2;
    arg["h"] += domapi.theme.border.width * 2;
  }
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.spinedit = function(){
  var s = domapi.theme.skin;
  s.spineditUp   = new Image();s.spineditUp.src   = s.path + "form/spinup.gif";
  s.spineditDown = new Image();s.spineditDown.src = s.path + "form/spindown.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Splitpane
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.splitpane = function(arg){
  domapi._assert(arg, "w",                   200);
  domapi._assert(arg, "h",                   200);
  domapi._assert(arg, "min",                 20);
  domapi._assert(arg, "manageShield",        true);
  domapi._assert(arg, "orientation",         "horizontal");
  domapi._assert(arg, "doHideOnDrag",        false);
  domapi._assert(arg, "doBorder",            false);
  domapi._assert(arg, "doRollover",          false);
  domapi._assert(arg, "doThumbTrack",        false);    
  domapi._assert(arg, "splitterBG",          domapi.theme.fonts.buttonface.bgcolor);
  domapi._assert(arg, "splitterBorderStyle", domapi.theme.border.none);
  domapi._assert(arg, "splitterW",           domapi.theme.skin.metrics.splitter.w);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Statusbar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.statusbar = function(arg){  
  domapi._assert(arg, "h",     18);
  domapi._assert(arg, "margin",2);
  domapi._assert(arg, "gap",   2);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tabset
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.tabset = function(arg){
  domapi._assert(arg, "selOffset",  1);
  domapi._assert(arg, "selFeather", 1);
  domapi._assert(arg, "tabIndex",   1);
  domapi._assert(arg, "tabH",       domapi.theme.skin.metrics.tab.h);
  arg["h"] = arg["tabH"] + arg["selOffset"] + 0;
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.tabset = function(arg){
  domapi._assert(arg, "tabAlign",    "left"   );
  domapi._assert(arg, "orientation", "top"    );
  domapi._assert(arg, "doManage",    true     );
  domapi._assert(arg, "paneManage",  "display"); // or visibility; your choice
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.tabset = function(){
  var s = domapi.theme.skin;
  var p = s.path + "tab/";
  s.tab_TNL = new Image(); s.tab_TNL.src = p + "top_norm_left.gif";
  s.tab_TNR = new Image(); s.tab_TNR.src = p + "top_norm_right.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Toolbar
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.toolbar = function(arg){
  domapi._assert(arg, "h",              26);
  domapi._assert(arg, "edgeBorderTop",  3 );
  domapi._assert(arg, "edgeBorderLeft", 3 );
  domapi._assert(arg, "spacing",        2 );
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Tree
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.tree = function(arg){
  domapi._assert(arg, "w",        150);
  domapi._assert(arg, "h",        200);
  domapi._assert(arg, "tabIndex", 1  );
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.tree = function(arg){
  domapi._assert(arg, "delimiter",              "/"  );
  domapi._assert(arg, "doShowLines",            false);
  domapi._assert(arg, "doFolderExpands",        true );  // expand nodes on folder click too
  domapi._assert(arg, "doFolderSelects",        true );  // select nodes on folder click too
  domapi._assert(arg, "doTextExpands",          false);  // expand nodes on text click too
  domapi._assert(arg, "doDblClickTextExpands",  true );  // expand node on text double-click
  domapi._assert(arg, "doDblClickFolderExpands",false);  // expand node on folder double-click
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.tree = function(){
  var s = domapi.theme.skin;
  var p = s.path + "tree/";
  s.tree_blank           = p + "blank.gif";
  s.tree_folder_opened   = p + "folder_opened.gif";
  s.tree_folder_closed   = p + "folder_closed.gif";
  //----------
  s.tree_noline_i        = p + "noline_i.gif";
  s.tree_noline_l        = p + "noline_l.gif";
  s.tree_noline_t        = p + "noline_t.gif";
  s.tree_noline_b        = p + "noline_b.gif";

  s.tree_noline_l_opened = p + "noline_l_opened.gif";
  s.tree_noline_r_opened = p + "noline_r_opened.gif";
  s.tree_noline_t_opened = p + "noline_t_opened.gif";
  s.tree_noline_b_opened = p + "noline_b_opened.gif";

  s.tree_noline_l_closed = p + "noline_l_closed.gif";
  s.tree_noline_r_closed = p + "noline_r_closed.gif";
  s.tree_noline_t_closed = p + "noline_t_closed.gif";
  s.tree_noline_b_closed = p + "noline_b_closed.gif";
  //----------
  s.tree_lines_i         = p + "lines_i.gif";
  s.tree_lines_l         = p + "lines_l.gif";
  s.tree_lines_t         = p + "lines_t.gif";
  s.tree_lines_b         = p + "lines_b.gif";

  s.tree_lines_l_opened  = p + "lines_l_opened.gif";
  s.tree_lines_r_opened  = p + "lines_r_opened.gif";
  s.tree_lines_t_opened  = p + "lines_t_opened.gif";
  s.tree_lines_b_opened  = p + "lines_b_opened.gif";

  s.tree_lines_l_closed  = p + "lines_l_closed.gif";
  s.tree_lines_r_closed  = p + "lines_r_closed.gif";
  s.tree_lines_t_closed  = p + "lines_t_closed.gif";
  s.tree_lines_b_closed  = p + "lines_b_closed.gif";
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Viewbar
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.viewbar = function(arg){
  domapi._assert(arg, "doShowSelection", true );
  domapi._assert(arg, "exclusive",       true);
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Window
//------------------------------------------------------------------------------
domapi.Theme.prototype.preDefaults.window = function(arg){  
  var m = domapi.theme.skin.metrics.window;
  domapi._assert(arg, "resizeBdr",       m.resizeBdr);
  domapi._assert(arg, "minH",            m.minH);
  domapi._assert(arg, "minW",            m.minW);
  domapi._assert(arg, "minimizedW",      m.minimizedW);
  domapi._assert(arg, "visibleButtons",  m.visibleButtons);
  domapi._assert(arg, "doCreateButtons", m.doCreateButtons);
  domapi._assert(arg, "btnW",            m.btnW);
  domapi._assert(arg, "btnH",            m.btnH);
  domapi._assert(arg, "titleBarHeight",  m.titleBarHeight);
  domapi._assert(arg, "controlsAlign",   m.controlsAlign);
  domapi._assert(arg, "captionAlign",    m.captionAlign);
  domapi._assert(arg, "titlePadding",    m.titlePadding);
  domapi._assert(arg, "separatorW",      m.separatorW);
  domapi._assert(arg, "doManageFocus",             true   );
  domapi._assert(arg, "destroyOnClose",            true   );
  domapi._assert(arg, "showContentsWhileDragging", false  );
  domapi._assert(arg, "w",                         arg["minW"]);
  domapi._assert(arg, "h",                         arg["minW"]); // not a typo
  domapi._assert(arg, "doAllowMove",               true   );
  domapi._assert(arg, "doAllowResize",             true   );
  domapi._assert(arg, "doManageShield",            true   );
  domapi._assert(arg, "doModal",                   false  );
  domapi._assert(arg, "doIframeShield",            true   );
  if(!arg["x"] && !arg["y"])
    domapi._assert(arg, "position", "relative");
};
//------------------------------------------------------------------------------
domapi.Theme.prototype.postDefaults.window = function(arg){

};
//------------------------------------------------------------------------------
domapi.Theme.prototype.preloadImages.window = function(){
  var s = domapi.theme.skin;
  var p = s.path + "window/";
  s.window_minimize = p + "minimize.gif";
  s.window_maximize = p + "maximize.gif";
  s.window_restore  = p + "restore.gif";
  s.window_close    = p + "close.gif";
  s.window_help     = p + "help.gif";
};
//------------------------------------------------------------------------------