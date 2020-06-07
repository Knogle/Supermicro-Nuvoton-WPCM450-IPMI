domapi.theme = new domapi.Theme("system");
// here you would modify your theme to deviate from system
//------------------------------------------------------------------------------
// Preload - this is called after all component preloaders, in response to
// theme.apply().  Use it to deviate from standard component preloaders
//------------------------------------------------------------------------------
domapi.theme.preload = function(){};
//------------------------------------------------------------------------------
domapi.theme.preloadImages.popupmenu = function(){
  var s = domapi.theme.skin;
  var p = s.path + "popupmenu/";
  s.popupmenuNorm   = new Image();s.popupmenuNorm.src   = p + "normal.jpg";
  s.popupmenuFocus  = new Image();s.popupmenuFocus.src  = p + "focus.gif";
  s.popupmenuStates = new Image();s.popupmenuStates.src = p + "states.gif";
};
//------------------------------------------------------------------------------