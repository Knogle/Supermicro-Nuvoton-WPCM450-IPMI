//==============================================
// DomAPI Progressbar Component
// D. Kadrioski 1/8/2002
// (c) Nebiru Software 2001-2005
//==============================================

domapi.registerComponent("progressbar");
//------------------------------------------------------------------------------
domapi.Progressbar = function(arg){return domapi.comps.progressbar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.progressbar.constructor = function(arg){
  var e = domapi.Component(arg,"progressbar");
  e.innerHTML = '<div><div class="DA_BAR">&nbsp;</div></div>';
  e.bar = e.childNodes[0].childNodes[0];
  e._setValue = e.setProgress;
  domapi.disallowSelect(e);
  domapi._finalizeComp( e);
  domapi.css.addClass(e, e.orientation == "horizontal"?"DA_HORZ":"DA_VERT");
  if(!e.enabled)e.setEnabled(false);
  e.setProgress(e.progress);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.progressbar._draw = function(){this.progressbarDraw()};
//------------------------------------------------------------------------------
domapi.comps.progressbar._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.progressbar.progressbarDraw = function(){};
//------------------------------------------------------------------------------
domapi.comps.progressbar.setProgress = function(p, timeout){
  var s;
  var w         = this.getW();
  var h         = this.getH();
  var v         = (this.orientation == "horizontal"?w:h);
  this.progress = p;
  p             = Math.round((domapi.rInt(p)/this.max)*100);  
  v             = v*(p/100);
  v             = this.quantize(v,this.quanta);
  if(this.orientation == "horizontal"){
    s = "rect(0px,"+v+"px,"+(h-this._paddingCorrection)+"px,0px)";
  }else
    s = "rect("+(h-v)+"px,"+w+"px,"+(h-this._paddingCorrection)+"px,0px)";
  if(!timeout)
    this.bar.style.clip = s;
  else{
    if(this._timer)clearTimeout(this._timer);
    this._timer = setTimeout("document.getElementById('" + this.id + "')._setProgressHelper('" + s + "')", timeout);
  }
};
//------------------------------------------------------------------------------
domapi.comps.progressbar._setProgressHelper = function(s){
  this.bar.style.clip = s;
};
//------------------------------------------------------------------------------
domapi.comps.progressbar.setImage = function(s){
  this.bar.style.backgroundImage  = "url(" + domapi.rVal(s) + ")";
};
//------------------------------------------------------------------------------
domapi.comps.progressbar.quantize = function(x,q){return Math.ceil(x/q)*q};
//------------------------------------------------------------------------------