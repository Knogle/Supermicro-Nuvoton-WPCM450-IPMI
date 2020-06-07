//==============================================
// DomAPI Speedbutton Component
// D. Kadrioski 7/24/2001
// (c) Nebiru Software 2001-2005
//==============================================

domapi.loadUnit(         "imagelistlite");
domapi.registerComponent("speedbutton");
var daSbNormal   = 0;
var daSbOver     = 1;
var daSbDown     = 2;
var daSbDisabled = 3;
//------------------------------------------------------------------------------
domapi.Speedbutton = function(arg){return domapi.comps.speedbutton.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.speedbutton.constructor = function(arg){
  var e = domapi.Component(arg,"speedbutton");
  try{
    var p = domapi._private.speedbutton;
    p._createSimpleBtn(e,arg);

    domapi.addEvent(e,"mouseout" ,p.domouseout );
    domapi.addEvent(e,"mouseup"  ,p.domouseup  );
    domapi.addEvent(e,"mousedown",p.domousedown);
    domapi.addEvent(e,"mouseover",p.domouseover);
    domapi.addEvent(e,"mouseout" ,p.domouseout);

    if(!e.enabled)e.setEnabled(false);
    domapi.disallowSelect(e);
    domapi._finalizeComp( e);
    //HT: seem it init the button properly, fix the mouseover lost the down status.
    domapi._private.speedbutton._pop(e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.speedbutton._free = function(){
  this.image    = null;
  this.dropDown = null;
};
//------------------------------------------------------------------------------
domapi.comps.speedbutton._setEnabled = function(b){
  domapi.css.addClass(this, "DA_SPEEDBUTTON_DISABLED", !b);
  if (this.image)
    this.image.setIndex(b?daSbNormal:daSbDisabled);
  this.disabled = !b;
};
//------------------------------------------------------------------------------
domapi.comps.speedbutton.setDown = function(b){
  if(b){
    if(this && this.enabled && this.doDepress){
      domapi.css.addClass(this, "DA_SPEEDBUTTON_DEPRESS");
       if (this.image) this.image.setIndex(daSbDown);
    }
  }else{
    domapi._private.speedbutton._pop(this);
    if(!this.down){
      if(this && this.doDepress)domapi.css.removeClass(this, "DA_SPEEDBUTTON_DEPRESS");
      if(this.doRollover && this.enabled && this.image)this.image.setIndex(daSbOver);
    }
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.speedbutton._createSimpleBtn = function(p, arg){
  try{
    if(!arg["src"])arg["imgW"]=0;
    if(arg["src"])
      p.image = domapi.Imagelistlite({
        parent      : p,
        src         : arg["src"],
        w           : domapi.rInt(arg["imgW"], 16),
        h           : domapi.rInt(arg["imgH"], 16),
        orientation : arg["imgOrientation"]
      });
    if(domapi.isIE)
      if (p.image) p.image.align = "middle";
    else
      p.style.lineHeight = domapi.rInt(arg["imgH"], 16) + "px";
    p.title        = arg["hint"];
    p.style.cursor = "default";  
    if(arg["text"] != ""){
      if(arg["orientation"] == "vertical")
        p.appendChild(document.createElement("BR"));
      var oTxt          = document.createElement("SPAN");
    //HT: when there is no image, do not add the padding-left
      if(arg["orientation"] == "horizontal" && !domapi.isNil(p.src))oTxt.style.paddingLeft = "6px";
      oTxt.innerHTML    = arg["text"];
      p.appendChild(oTxt);
    }
    if(arg["kind"] == "dropdown"){
      var mTxt               = document.createElement("SPAN");
      mTxt.style.paddingLeft = "3px";
      mTxt.innerHTML         = arg["dropdownArrow"];
      p.appendChild(mTxt);
    }
  }finally{
    oTxt = null; mTxt = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.speedbutton._popGroup = function(e){
  var p = e.parentNode;
  try{
    for(var a=0;a<p.childNodes.length;a++){
      var t = p.childNodes[a];
      if(t.DA_TYPE && (t.DA_TYPE == "SPEEDBUTTON"))
        if(t.radioGroup == e.radioGroup && t.id != e.id){
          t.down = false;
          domapi.css.removeClass(t, "DA_SPEEDBUTTON_DEPRESS");
        }
    }
  }finally{
    p = null;t = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.speedbutton._pop = function(e){
  if(!e.enabled)return;
  if(e.radioGroup>0){
    domapi._private.speedbutton._popGroup(e);
    if(!e.down)
      e.down = true;
    else if(e.doAllowAllUp)
      e.down = false;
  }
};
//------------------------------------------------------------------------------
domapi._private.speedbutton.domouseover = function(E){
  var e = domapi.findTarget(E,"SPEEDBUTTON");
  try{
    if(!e || !e.enabled || e._over)return;
    if(!e.doRollover || e.down)return;
    if (e.image) e.image.setIndex(daSbOver);
    domapi.css.addClass(e, "DA_HIGHLIGHT");
    e._over = true;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.speedbutton.domouseout = function(E){
  var e = domapi.findTarget(E,"SPEEDBUTTON");
  try{
    if(!e || !e.enabled)return;
    if(e.doDepress && !e.down)domapi.css.removeClass(e, "DA_SPEEDBUTTON_DEPRESS");
  //  if(!e._over || domapi.isMouseOver(E, e))return;  when enabled, status highlight can 'stick' sometimes
    if (e.image) e.image.setIndex(daSbNormal);
    if(e.doRollover)domapi.css.removeClass(e, "DA_HIGHLIGHT");
    e._over = false;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.speedbutton.domousedown = function(E){
  var e = domapi.findTarget(E,"SPEEDBUTTON");
  try{
    e.setDown(true);
    if(e.enabled && e.kind == "dropdown" && e.dropDown){
      var m = e.dropDown;
      var p = domapi._private.popupmenu;
      p._ensureAdded(m);
      p._ignoreNextDocumentClick = true;
      if(m.showing)m.hide();
      else {
        var a = domapi.getTrueOffset(e);
        m.show(a[0], a[1] + e.getH());
      }
    }
  }finally{
    e = null;m = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.speedbutton.domouseup = function(E){
  var e = domapi.findTarget(E,"SPEEDBUTTON");
  if(e && e.enabled)e.setDown(false);
  e = null;
};
//------------------------------------------------------------------------------