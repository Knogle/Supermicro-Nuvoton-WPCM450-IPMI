//------------------------------------------------------------------------------
// DomAPI scrollbutton component
// Patrice Fricard (pfricard@wanadoo.fr) 17/10/2004
//------------------------------------------------------------------------------
domapi.loadUnit("imagelistlite");
domapi.registerComponent("scrollbutton");

//------------------------------------------------------------------------------
domapi.Scrollbutton = function(arg){return domapi.comps.scrollbutton.constructor(arg)};
//------------------------------------------------------------------------------
domapi.scrolltimer = null;

domapi.comps.scrollbutton.constructor = function(arg){
  arg["align"]=domapi.rVal(arg["align"],"center");
	var e = domapi.Component(arg,"scrollbutton");
  try{
  	e._constructor = domapi.comps.scrollbutton._constructor;
    e._constructor(arg);
  	e.direction = domapi.rVal(arg["direction"],"top");
  	e.step = domapi.rInt(arg["step"],10);
  	if (e.control) {
      e.control.style.overflow = "hidden";
      e.control["scrollbutton_"+e.direction]=e;
      }
  	e._orientation();
    
    //set a specific class depending on the direction
    domapi.css.addClass(e, "DA_SCROLLBUTTON_"+e.direction);  
    
    domapi._finalizeComp(e);
  	e.setEnabled(false);
  	if (e.direction == "right" && e.control.scrollWidth > 0)	e.setEnabled(true);
  	if (e.direction == "bottom" && e.control.scrollHeight > 0)	e.setEnabled(true);
  	if(!e.enabled)e.setEnabled(false);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.scrollbutton._free = function(){
  this._constructor = null;
  this.control["scrollbutton_" + this.direction] = null;
  this.control      = null;
  this.img          = null;
};
//------------------------------------------------------------------------------
domapi.comps.scrollbutton._draw = function(){
  var t = domapi.theme;
  var s = this.style;
  var b                = this.doBorder?parseInt(t.border.width):0;
  this.setB(             b);  // set border width *before* border style!!
  s.borderStyle        = this.doBorder?t.border.solid:"none";
  s.borderColor        = t.border.getOutset();
  s.cursor             = "default";
  t = null;s = null;
};
//------------------------------------------------------------------------------
domapi.comps.scrollbutton._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.scrollbutton._constructor = function(arg){
	this.img = domapi.Imagelistlite({parent:this,w:10,h:10,src:domapi.theme.skin.scrollbutton.src});
	var p = domapi._private.scrollbutton;
	if(this.doOnOver){
	domapi.addEvent(this,"mouseover",p.domousedown);
	domapi.addEvent(this,"mouseout",p.domouseup);
	}else{
	domapi.addEvent(this,"mousedown",p.domousedown);
	domapi.addEvent(this,"mouseup",p.domouseup);
	}
};

domapi.comps.scrollbutton._orientation=function(){
var c = this.control; 
switch(this.direction){
case "top": this.index = 0;break;
case "left":this.index = 3;break;
case "bottom":this.index = 2;break;
case "right":this.index = 1;break;
default:this.index = 0;
}
this.img.setIndex(this.index);
  c = null;
};

domapi.comps.scrollbutton.setControl= function(control){
var e = this;
e.control = control;
e.control.style.overflow="hidden";
e.control["scrollbutton_"+e.direction]=e;
  e = null;
};

domapi._private.scrollbutton.domousedown = function(E){
//start scroll
 var e = domapi.findTarget(E,"SCROLLBUTTON");
 try{
    e.down = true;
    if(!e || !e.enabled)return;
  	e._scroll();
 }finally{
   e = null;
 }
};

domapi.comps.scrollbutton._scroll = function(){
  var e = this;
  try{
    if(!e.down) return;
    var c = e.control;
    var bReturn = c.scrollBy(e.direction,e.step);
    var reverseCtl;
    switch(e.direction){
    case "top":reverseCtl="bottom"; break;
    case "left":reverseCtl="right";break;
    case "bottom":reverseCtl="top";break;
    case "right":reverseCtl="left";break;
    default:break;
    }
    if(c["scrollbutton_"+reverseCtl])c["scrollbutton_"+reverseCtl].setEnabled(true);
    if (bReturn){
    if (e.down)
    domapi.scrolltimer = setTimeout("document.getElementById('"+e.id+"')._scroll()",100);
    }else{
    if (c["scrollbutton_"+e.direction])c["scrollbutton_"+e.direction].setEnabled(false);
    e.down=false;
    clearTimeout(domapi.scrolltimer );
    }
  } finally {
    e = null; c = null;
  }
};
domapi.comps.scrollbutton._setEnabled = function(b){

 	if(this.disabled && b ) this.index = this.index -4;
	if(!this.disabled && !b )this.index = this.index +4;
  this.disabled = !b;
	this.img.setIndex(this.index);
};

domapi._private.scrollbutton.domouseup = function(E){
//end scroll
  var e = domapi.findTarget(E,"SCROLLBUTTON");
  try{
    if(!e || !e.enabled)return;
    e.down = false;
    clearTimeout(e.timer);
  }finally{
    e = null;
  }
};
domapi._private.scrollbutton.domouseover=domapi._private.scrollbutton.domousedown;
domapi._private.scrollbutton.domouseout=domapi._private.scrollbutton.domouseup;


//------------------------------------------------------------------------------
// scroll element using scrollLeft/scrollTop properties. return true if scroll is done
// return false if scroll is not doable or if element can't be scrolled more in the
// specified direction.
//------------------------------------------------------------------------------
domapi.elmProto.scrollBy = function(dir,step){
  var bScroll = false;
  var c = this;
  try{
    
    if (c.style.overflow != "hidden") return bScroll;
    
    
    var scLeft = c.scrollLeft;
    var scTop = c.scrollTop;
    switch(dir){
    	case "top":
        scTop -= step;
        scTop = Math.max( scTop, 0);
        bScroll = !(scTop == 0);
        break;
    	case "bottom":
        scTop += step;
        if ((scTop+c.getH()) > c.scrollHeight){
            scTop = c.scrollHeight-c.getH();
            bScroll=false;
          }
          else{
            bScroll = true;
          }
        break;
    	case "left":
        scLeft -= step;
        scLeft = Math.max( scLeft, 0);
        bScroll = !(scLeft == 0);
        break;
    	case "right":
        scLeft += step;
        if ((scLeft+c.getW()) > c.scrollWidth){
            scLeft = c.scrollWidth-c.getW();
            bScroll=false;
          }
          else{
            bScroll = true;
          }
        break;
      }   
    c.scrollLeft = scLeft;
    c.scrollTop = scTop;
    if(domapi.isIE){
    c.hide();
    c.show();
    }
    return bScroll;
  }finally{
    c = null;
  }
};