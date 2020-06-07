//==============================================
// DomAPI Statusbar Component
// (c) Ben Tudball - 30 October 2002
//==============================================
// Adapted to v4.0 by D. Kadrioski
//----------------------------------------------

ptStretch = 1;
ptFixed   = 2;
domapi.loadUnit("label");
domapi.registerComponent("statusbar");
//------------------------------------------------------------------------------
domapi.Statusbar = function(arg){return domapi.comps.statusbar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.statusbar.constructor = function(arg){
  var e    = domapi.Component(arg,"statusbar");
  try{
    e.style.overflow = "hidden";
    if (arg.parent){ // Default statusbar to bottom and width of parent
      e.setX(e.gap);
      e.setY(arg.parent.getH()-e.getH()-e.margin);
      e.setW(arg.parent.getW()-e.margin-e.gap);
    }
    if (arg.panels){ // Create default panels
      for (var a=0;a<arg.panels;a++){
        e.addPanel();
        e.doResize();
      }
    }
    e.panels = e.childNodes;
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.statusbar._free = function(){

};
//------------------------------------------------------------------------------
domapi.comps.statusbar._draw = function(){this.statusbarDraw()};
//------------------------------------------------------------------------------
domapi.comps.statusbar.statusbarDraw = function(){
  this.setB(                   0);
  this.style.borderColor     = domapi.theme.border.getOutset();
  this.style.backgroundColor = domapi.theme.fonts.buttonface.bgcolor;
  this.style.borderStyle     = domapi.theme.border.solid;
  this.style.cursor          = "default";  
};
//------------------------------------------------------------------------------
domapi.comps.statusbar._layout = function(w,h){
  var t, i;
  try{
    this.doResize();
    for(i=0;i<this.childNodes.length;i++){
      t = this.childNodes[i];
      if(typeof t.draw=="function")t.draw();
    }
  }finally{
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.statusbar.addPanel = function(arg){//minW,type,text,textAlign,verticalAlign
  var minW   = domapi.rInt(arg["minW"],         50);
  var t      = domapi.rInt(arg["type"],         ptStretch);  
  var text   = domapi.rVal(arg["text"],         " ");
  var tAlign = domapi.rVal(arg["textAlign"],    "left");
  var panel = domapi.Elm({
    parent:this,
    x:0,y:0,
    w:minW,
    h:this.getH()
  });
  try{
    panel.setText(text);
    panel.setB(1);
    panel.setP([0,0,0,2]);
    with(panel.style){
      borderStyle = "solid";
      borderColor = domapi.theme.border.getInset();
      whiteSpace = "nowrap";
      textOverflow = "ellipsis";
      textAlign = tAlign;
    }
    panel.type    = t; // t - 1:stretch or 2:fixed
    panel.minW    = minW;  
    panel.DA_TYPE = "STATUSBARPANEL";

    this.layout();
    return panel;
  }finally{
    panel = null;
  }
};
//------------------------------------------------------------------------------
// doResize() - This function is as complex as you would want to get. All this
// just for a little statusbar. Thankfully the end result is more than rewarding.
// Causes major speed problems in Mozilla (what doesn't). Still not 100% pixel
// accurate, but usable enough for the time being.
//------------------------------------------------------------------------------
domapi.comps.statusbar.doResize = function(){
  var n  = this.childNodes;
  try{
    var nl = n.length;
    var w  = this.getW();
    var g  = this.gap;
    var fw = 0;
    var fc = 0;
    var sc = 0;
    if(!nl)return false;
  
    if (nl==1){
      n[0].setX(0);
      n[0].setW(w);
    }else{
      n[0].setX(0);
      if (n[0].type==1){
        //n[0].setW(w/nl-g);
        sc++;
      }else{
        n[0].setW(n[0].minW);
        fw=n[0].getW();
        fc++;
      }
      for(var a=1;a<nl;a++){
        if (n[a].type==1){
          sc++;
        }else{
          n[a].setW(n[a].minW);
          fw=fw+n[a].getW();
          fc++;
        }
    }
  
      for(var a=0;a<nl;a++){
        if (n[a].type==1){
        if (w/nl-g<n[a].minW){
            n[a].setW(n[a].minW);
          }else{
            n[a].setW((w-fw)/sc-g);
          }
        }
        //if (n[a].type==1) n[a].setW(w/nl-g);
        var c = 0;
        for(var b=0;b<a;b++){
          c=c+n[b].getW()+g;
        }
        n[a].setX(c);
      }
      if (n[a-1].type==1) n[a-1].setW(w-n[a-1].getX());
      else n[a-1].setW(n[a-1].minW-g); // not pixel perfect but will do for now
    }
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------

