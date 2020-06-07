//==============================================
// DomAPI Colorpane Component
// D. Kadrioski 10/18/2004
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("corecolor");
domapi.loadUnit("color");
domapi.loadUnit("drag");
domapi.registerComponent("colorpane");
//------------------------------------------------------------------------------
domapi.Colorpane = function(arg){return domapi.comps.colorpane.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.colorpane.constructor = function(arg){
  var e          = domapi.Component(arg,"colorpane");
  var p          = domapi._private.colorpane;
  var s, _edits;
  e._curtain     = document.createElement("DIV");
  e._swatch      = document.createElement("DIV");
  e._fader       = document.createElement("IMG");
  e._edits       = document.createElement("DIV");
  e.btnOk        = document.createElement("A");
  e.btnCancel    = document.createElement("A");
  e._crosshairs  = domapi.Elm({parent:e._curtain, x:0, y:0, w:arg.crosshairW, h:arg.crosshairH, type:"DIV"});
  e._arrow       = domapi.Elm({parent:e,          x:0, y:0, w:arg.arrowW,     h:arg.arrowH,     type:"DIV"});
  e._crosshairs.innerHTML   = '<IMG src="'+arg.crosshairImg+'">';
  e._arrow.innerHTML        = '<IMG src="'+arg.arrowImg+'">';
  e._arrow.style.cursor     = domapi.cursors.hand;
  e._arrow.title            = domapi.getString("COLORPANE_FADER_HINT");
  e._fader.onclick          = p.dofaderclick;
  e._crosshairs.ondragstart = domapi._nullFunction;
  domapi.disallowSelect(e._curtain);
  domapi.disallowSelect(e._fader);
  domapi.disallowSelect(e._arrow);

  var x = 200 + e.faderW + 4;
  var y = 10 - e.arrowH/2;
  e._arrow.rangeStart = [x, y];
  e._arrow.rangeEnd   = [x, y + e.faderH];
  e._arrow.turnOnDrag( null,domapi.drag.dtCustom,0,null,domapi.drag.dragRange,null);
  e._arrow.onrangechange = p._onarrowrangechange;

  x = -arg.crosshairW/2;
  y = -arg.crosshairH/2;
  e._crosshairs.rangeStart = [x, y];
  e._crosshairs.rangeEnd   = [x + arg.curtainW, y + arg.curtainH];
  e._crosshairs.turnOnDrag( null,domapi.drag.dtCustom,0,null,domapi.drag.dragRange,null);
  e._crosshairs.onrangechange = p._oncrosshairrangechange;

  s              = e._curtain.style;
  s.position     = "absolute";
  s.left         = "10px";
  s.top          = "10px";
  s.width        = arg.curtainW + "px";
  s.height       = arg.curtainH + "px";
  s.background   = 'url("' + arg.curtainImg + '")';
  s.overflow     = "hidden";
  e._curtain.ondragstart = domapi._nullFunction;
  e._curtain.className   = "DA_COLORPANE_CURTAIN";
  e.appendChild(e._curtain);

  s              = e._swatch.style;
  s.position     = "absolute";
  s.left         = "10px";
  s.top          = "210px";
  s.width        = "60px";
  s.height       = "40px";
  s.cursor       = domapi.cursors.hand;
  e._swatch.title     = domapi.getString("ACCEPT");
  e._swatch.innerHTML = "&nbsp;";
  e._swatch.className = "DA_COLORPANE_SWATCH";
  e._swatch.onclick   = p.dookclick;
  e.appendChild(e._swatch);

  s              = e._fader.style;
  s.position     = "absolute";
  s.left         = "200px";
  s.top          = "10px";
  s.width        = arg.faderW + "px";
  s.height       = arg.faderH + "px";
  e._fader.className = "DA_COLORPANE_FADER";
  e._fader.title     = domapi.getString("COLORPANE_FADER_HINT");
  if(domapi.isIE){
    e._fader.src = domapi.theme.skin.shim.src;
    s.filter     = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+arg.faderImg+"', sizingMethod='scale')";
  }else{
    e._fader.src = arg.faderImg;
  }
  e.appendChild(e._fader);

  s              = e._edits.style;
  s.position     = "absolute";
  s.left         = "80px";
  s.top          = "205px";
  s.width        = "135px";
  s.height       = "100px";
  e._edits.innerHTML = p._controls;
  e.appendChild(e._edits);

  s              = e.btnOk.style;
  s.position     = "absolute";
  s.left         = "100px";
  s.top          = "315px";
  e.btnOk.innerHTML = domapi.getString("ACCEPT");
  e.btnOk.href      = "#";
  e.btnOk.className = "DA_COLORPANE_BTNOK";
  e.btnOk.onclick   = p.dookclick;
  e.appendChild(e.btnOk);

  s              = e.btnCancel.style;
  s.position     = "absolute";
  s.left         = "160px";
  s.top          = "315px";
  e.btnCancel.innerHTML = domapi.getString("CANCEL");
  e.btnCancel.href      = "#";
  e.btnCancel.className = "DA_COLORPANE_BTNCANCEL";
  e.btnCancel.onclick   = p.docancelclick;
  e.appendChild(e.btnCancel);

  edits      = e.getElementsByTagName("INPUT");
  e._edits.X = edits[0];
  e._edits.H = edits[1];
  e._edits.R = edits[2];
  e._edits.S = edits[3];
  e._edits.G = edits[4];
  e._edits.L = edits[5];
  e._edits.B = edits[6];
  e._curtain.onmousedown = p.docurtaindown;
  for(var i=0;i<edits.length;i++){
    edits[i].onchange = p.dooneditchange;
    edits[i].className = "DA_COLORPANE_EDIT";
  }

  e.H = 0; e.S = 0; e.L = 120;
  e.R = 0; e.G = 0; e.B = 0;
  e.setHexValue(e.value);

  domapi._finalizeComp(e);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.colorpane._free = function(){
  this._curtain     = null;
  this._swatch      = null;
  this._fader       = null;
  this.btnOk        = null;
  this.btnCancel    = null;
  this._crosshairs  = null;
  this._arrow       = null;
  this._crosshairs  = null;
  if(this._edits){
    this._edits.X     = null;
    this._edits.H     = null;
    this._edits.R     = null;
    this._edits.S     = null;
    this._edits.G     = null;
    this._edits.L     = null;
    this._edits.B     = null;
    this._edits       = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.colorpane._draw = function(){
  this.colorpaneDraw();
};
//------------------------------------------------------------------------------
domapi.comps.colorpane.colorpaneDraw = function(){
  var t = domapi.theme;
  var s = this.style;
  var b         = this.doBorder?t.border.width:0;
  this.setB(      b);
  s.borderStyle = this.doBorder?t.border.solid:"none";
  s.borderColor = t.border.getOutset();
};
//------------------------------------------------------------------------------
domapi.comps.colorpane._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.colorpane.setHslValue = function(v, skipCrosshair){
  this.H =   v[0];
  this.S =   v[1];
  var rgb = domapi.color.hslToRgb(v);
  this.R =   rgb[0];
  this.G =   rgb[1];
  this.B =   rgb[2];
  this.value = domapi.color.rgbToHex(rgb);
  this.update(skipCrosshair);
};
//------------------------------------------------------------------------------
domapi.comps.colorpane.setRgbValue = function(v){
  this.R =   v[0];
  this.G =   v[1];
  this.B =   v[2];
  var hsl = domapi.color.rgbToHsl(v);
  this.H =   hsl[0];
  this.S =   hsl[1];
  this.value = domapi.color.rgbToHex(v);
  this.update();
};
//------------------------------------------------------------------------------
domapi.comps.colorpane.setHexValue = function(v){
  var rgb = domapi.color.hexToRgb(v);
  this.setRgbValue(rgb);
};
//------------------------------------------------------------------------------
domapi.comps.colorpane.update = function(skipCrosshair){
  var xy = this.hsToXy(this.H, this.S);
  this.value = domapi.color.makeSureIsHexColor(this.value);
  this._swatch.style.backgroundColor = this.value;
  this._fader.style.backgroundColor  = domapi.color.rgbToHex(domapi.color.hslToRgb([this.H, this.S, 120])); // median
  this._edits.H.value = parseInt(this.H);
  this._edits.S.value = parseInt(this.S);
  this._edits.L.value = parseInt(this.L);
  this._edits.R.value = parseInt(this.R);
  this._edits.G.value = parseInt(this.G);
  this._edits.B.value = parseInt(this.B);
  this._edits.X.value = this.value.toUpperCase();
  if(!skipCrosshair)
    this._crosshairs.moveTo(xy[0]-this.crosshairW/2, xy[1] - this.crosshairH/2);
  this._arrow.moveTo(
    this._arrow.rangeStart[0],
    this._arrow.rangeEnd[1] - (this.L * this.faderH/ 240)
  );
};
//------------------------------------------------------------------------------
domapi.comps.colorpane.hsToXy = function(h,s){
  return [h / 240 * this.curtainW, this.curtainH - (s / 240 * this.curtainH)];
};
//------------------------------------------------------------------------------
domapi.comps.colorpane.xyToHs = function(x,y){
  return [domapi.rangeInt(x / this.curtainW * 240, 0, 240), domapi.rangeInt((this.curtainH - y) / this.curtainH * 240, 0, 240)];
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
domapi._private.colorpane.docurtaindown = function(E){
  var e = domapi.findTarget(E, "COLORPANE");
  if(domapi.findTarget(E, "DIV") == e._crosshairs)return false;
  var x = domapi.isIE?event.offsetX:E.layerX;
  var y = domapi.isIE?event.offsetY:E.layerY;
  var hs = e.xyToHs(x,y);
  e.setHslValue([hs[0], hs[1], e.L]);
};
//------------------------------------------------------------------------------
domapi._private.colorpane.dofaderclick = function(E){
  var e = domapi.findTarget(E, "COLORPANE");
  var y = domapi.isIE?event.offsetY:E.layerY;
  e.L = domapi.rangeInt(240 - (y / e.faderH * 240), 0, 240);
  e.setHslValue([e.H, e.S, e.L]);
};
//------------------------------------------------------------------------------
domapi._private.colorpane._onarrowrangechange = function(xp,yp){
  if(isNaN(yp))return;
  var e = this.parentNode;
  var y = (yp == 0?0:(e.faderH * (yp/100)));
  e.L = domapi.rangeInt(240 - (y * 240 / e.faderH), 0, 240);
  e.setHslValue([e.H, e.S, e.L]);
};
//------------------------------------------------------------------------------
domapi._private.colorpane._oncrosshairrangechange = function(xp,yp){
  var e = domapi.findParent(this.parentNode, "COLORPANE");
  var x = (xp == 0?0:(e.curtainW * (xp/100)));
  var y = (yp == 0?0:(e.curtainH * (yp/100)));
  var hs = e.xyToHs(x,y);
  e.setHslValue([hs[0], hs[1], e.L], true);
};
//------------------------------------------------------------------------------
domapi._private.colorpane.dooneditchange = function(E){
  var r = domapi.findTarget(E, "COLORPANE");
  var e = domapi.findTarget(E, "INPUT");if(!e)return;
  switch(e){
    case r._edits.H : r.H = domapi.rangeInt(e.value,0,240); break;
    case r._edits.S : r.S = domapi.rangeInt(e.value,0,240); break;
    case r._edits.L : r.L = domapi.rangeInt(e.value,0,240); break;
    case r._edits.R : r.R = domapi.rangeInt(e.value,0,255); break;
    case r._edits.G : r.G = domapi.rangeInt(e.value,0,255); break;
    case r._edits.B : r.B = domapi.rangeInt(e.value,0,255); break;
    case r._edits.X : r.value = domapi.color.makeSureIsHexColor(e.value); break;
  }
  if( e == r._edits.H || e == r._edits.S || e == r._edits.L)r.setHslValue([r.H, r.S, r.L]);
  if( e == r._edits.R || e == r._edits.G || e == r._edits.B)r.setRgbValue([r.R, r.G, r.B]);
  if( e == r._edits.X)r.setHexValue(r.value);
};
//------------------------------------------------------------------------------
domapi._private.colorpane.dookclick = function(E){
  var e = domapi.findTarget(E, "COLORPANE");
  if(e.onokclick)e.onokclick();
  if(e.onchange)e.onchange();
  return false;
};
//------------------------------------------------------------------------------
domapi._private.colorpane.docancelclick = function(E){
  var e = domapi.findTarget(E, "COLORPANE");
  if(e.oncancelclick)e.oncancelclick();
  return false;
};
//------------------------------------------------------------------------------
domapi._private.colorpane._controls = 
  '<table>'+
  '<tr><td>'+domapi.getString("COLORPANE_HEX")+':</td><td colspan="3"><input type="Text" size="8"></td></tr>' +
  '<tr><td>'+domapi.getString("COLORPANE_HUE")+':</td><td><input type="Text" size="4">&nbsp;&nbsp;&nbsp;</td><td>R:</td><td><input type="Text" size="4"></td></tr>' +
  '<tr><td>'+domapi.getString("COLORPANE_SATURATION")+':</td><td><input type="Text" size="4"></td><td>G:</td><td><input type="Text" size="4"></td></tr>' +
  '<tr><td>'+domapi.getString("COLORPANE_LUMINOSITY")+':</td><td><input type="Text" size="4"></td><td>B:</td><td><input type="Text" size="4"></td></tr>' +
  '</table>';
//------------------------------------------------------------------------------