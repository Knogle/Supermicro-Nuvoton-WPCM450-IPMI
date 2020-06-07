//==============================================
// DomAPI Toolbar Component
// D. Kadrioski 7/25/2001
// (c) Nebiru Software 2001-2003
//==============================================

domapi.loadUnit(         "speedbutton");
domapi.registerComponent("toolbar");
//------------------------------------------------------------------------------
domapi.Toolbar = function(arg){return domapi.comps.toolbar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.toolbar.constructor = function(arg){  
  var e = domapi.Component(arg,"toolbar");
  var t = domapi.comps.toolbar;
  try{
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null; t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.toolbar._draw = function(){
  this.toolbarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.toolbar.toolbarDraw=function(){
  var t = domapi.theme;
  var s = this.style;
  try{
    var b             = this.doBorder?t.border.width:0;
    this.setB(          b);  // set border width *before* border style!!
    s.borderStyle     = this.doBorder?t.border.solid:"none";
    s.borderColor     = t.border.getOutset();
    this.setBgColor(    this.doBGFill?t.fonts.buttonface.bgcolor:"transparent");  
    s.cursor          = "default";
    var e;
    for(a=0;a<this.childNodes.length;a++){
      e = this.childNodes[a];
      if(typeof e.draw=="function"){
        e.draw();
      }
      if(e.DA_TYPE=="TOOLBARSPACER")e.setH(this.getH()-6);
    }
  }finally{
    t = null; s = null; e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.toolbar.spaceControls = function(){
  if(!this.childNodes)return false;
  var x   = this.edgeBorderLeft;
  var t;
  try{
    for(a=0;a<this.childNodes.length;a++){
      t = this.childNodes[a];
      if(t.style.visibility == "hidden")continue;
      t.moveTo( x,(t.DA_TYPE == "TOOLBARSPACER")?3:this.edgeBorderTop);
      if(t.DA_TYPE == "TOOLBARSPACER"){
        t.setH(this.getH()-this.edgeBorderTop*3);
        x += 8;
      }
      x += this.spacing + t.offsetWidth;
    }
  }finally{
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.toolbar.addSpacer = function(){
  var space = domapi.Elm({parent:this});
  try{
   /* var line  = domapi.Elm({parent:space,w:2,h:23});
    with(line.style){
      borderStyle = "groove";
      borderWidth = "0px 0px 0px 2px";
      overflow    = "hidden";
      margin      = "0px 5px";
      if(domapi.isGecko)borderColor = domapi.theme.bdrLight;
    }
    space.style.textAlign = "center";*/
    space.DA_TYPE         = "TOOLBARSPACER";
    space.className       = "DA_TOOLBARSPACER";
  }finally{
    space = null;
  }
};
//------------------------------------------------------------------------------