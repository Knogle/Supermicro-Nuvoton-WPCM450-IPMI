//==============================================
// DomAPI Collapse Tree Component
// D. Kadrioski, R. Dankert 2/20/2002
// (c) Nebiru Software 2001,2002
//==============================================
domapi.loadUnit(         "animate");
domapi.registerComponent("collapsetree");
//------------------------------------------------------------------------------
function Collapsetree(arg){
  var e        = domapi.Component(arg,"collapsetree");
  e.speed      = 1;     // This is a geometric ratio controlling the speed of the animation
  e.animate    = true;  // This determines whether or not to animate the opening or not
  e.type       = 1;     // sets animation type.  1 for slow-to-fast, 2 for fast-to-slow, 3 for linear
  e.indent     = 15;
  e.setP(        5);
  e.setOverflow( "auto");
  domapi.disallowSelect(e);
  e.reDraw();
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.reDraw = function(){
  this.collapsetreeReDraw();
  this.onredraw();
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.collapsetreeReDraw=function(){
  var t                  = this.theme;
  this.setB(               t.bdrWidth);
  this.style.borderStyle = this.doBorder?t.bdrSolid:"none";
  this.style.borderColor = t.getInset();
  this.reDrawItem(this); 
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.itemHeight = function(n){
  // recursively walks down a node, tallying heights of all children
  var r = 0;
  for(var a=1;a<n.childNodes.length;a++){
    if(n.childNodes[a].getH)r += n.childNodes[a].getH();
    r += this.itemHeight(n.childNodes[a]);
  } 
  return r;
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.itemClick = function(e){
  if(this.DA_TYPE!='COLLAPSETREE_ITEM')return;
  domapi.preventBubble(e);
  var p = domapi.findTarget(e,"COLLAPSETREE");
  //alert(p.itemHeight(this));
  if(this.childNodes.length>1 && p.enabled){    // This verifies that there is something to do
    if(!this.childNodes[1].visible){            // If it needs to expand
      this.expanded+=this.childNodes.length-1;  // Reference to know how many children are expanded
      if(!this.isRoot){                         // If not the root element, see what else must be done
        var r=this;                             // a reference to the object, to be added on to go through the Node tree
        for(var a=0;a<this.depth;a++){          // this makes sure you go through every level of the heirarchy
          r=r.parentElement;                    // this assigns the current working object to the parent of the prior working object (var r)
          if(!r)break;
          r.expanded+=this.expanded;            // this assigns the expanded of the parent to its current value, plus the number expanded in the children
          if(p.animate)r.sizeTo(r.getW(),r.baseH*(r.expanded+1),p.type,Math.round(this.baseH*(this.expanded+1)*0.1*p.speed),50);
          else r.setSize(r.getW(),r.baseH*(r.expanded+1));
        }
      }
      if(p.animate)this.sizeTo(this.getW(),this.baseH*(this.expanded+1),p.type,Math.round(this.baseH*(this.expanded+1)*0.1*p.speed),50);
      else this.setSize(this.getW(),this.baseH*(this.expanded+1));
      this.childNodes[1].visible=true;
    }else{                                      // If it needs to collapse
      if(p.animate)this.sizeTo(this.getW(),this.baseH,p.type,Math.round(this.baseH*(this.expanded+1)*0.1*p.speed),50);
      else this.setSize(this.getW(),this.baseH);
      if(!this.isRoot){
        var r=this;
        for(var a=0;a<this.depth;a++){
          r=r.parentElement;
          if(!r)break;
          r.expanded-=this.expanded;
          if(p.animate)r.sizeTo(r.getW(),r.baseH*(r.expanded+1),p.type,Math.round(this.baseH*(this.expanded+1)*0.1*p.speed),50);
          else r.setSize(r.getW(),r.baseH*(r.expanded+1));
        }
      }
      this.expanded-=(this.childNodes.length-1);
      this.childNodes[1].visible=false;
    }
  }else{
    if(this.fn){
      if(this.target){
        switch(this.target){
          case "_blank" : open(this.fn);             break;
          case "_self"  : document.location=this.fn; break;
          default       : eval(this.target+".document.location='"+this.fn+"'");
        }
      }else eval(this.fn);
    }
  }
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.reDrawItem=function(e){
  var t       = this.theme;
  var s       = e.style;
  s.font      = t.font;
  e.baseH     = e.getH();
  e.setBgColor( this.doBGFill?t.bgColor:"transparent");
  e.setColor(   t.fgColor); 
  if(!this.doBGFill){
    s.marginTop    = "1px";
    s.marginBottom = "1px";
  }
  if(e!=this)s.borderColor = s.backgroundColor;
  if(e!=this&&!this.doBGFill)s.borderStyle="none";
  for(var a=0;a<e.childNodes.length;a++)
    if(e.childNodes[a].DA_TYPE!=null)
      this.reDrawItem(e.childNodes[a]);
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.onmouseover=function(E){
  if(!this.doRollover||!this.enabled)return;
  var e=domapi.findTarget(E,"COLLAPSETREE_CAPTION");
  if(!e)return;
  var s = e.style;
  s.marginTop       = "0px"; 
  s.marginBottom    = "0px";
  if(!this.doBGFill)s.paddingLeft = "2px";
  s.borderStyle     = "solid";
  s.backgroundColor = this.theme.ctrlBgColor;
  s.borderColor     = this.theme.appBgColor;
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.onmouseout=function(E){
  var e=domapi.findTarget(E,"COLLAPSETREE_CAPTION");
  if(!e)return;
  var s = e.style;
  s.backgroundColor = this.doBGFill?this.style.backgroundColor:"transparent";
  s.borderColor     = this.doBGFill?this.style.backgroundColor:"transparent";
  if(!this.doBGFill){
    s.borderStyle   = "none";
    s.marginTop     = "1px"; 
    s.marginBottom  = "1px"; 
    s.paddingLeft   = "3px";
  }
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.addPath=function(p,fn,target,del){
  var a,b,found,e,s,last;
  var r = this;
  p     = p.split(domapi.rVal(del,"|"));
  for(a=0;a<p.length;a++){
    found = false;
    for(b=0;b<r.childNodes.length;b++){
      s = r.childNodes[b];if(s.getText)
      if(s.getText && s.getText()==p[a]){
        r     = r.childNodes[b];
        found = true;
        break;
      }
    }
    if(!found){ // create one
      last = a == (p.length-1);
      r    = this.add(r,p[a],last?fn:null,last?target:null);
    }
  }
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.add=function(p,c,fn,target){
  var e               = domapi.createElm(p);
  e.setBgColor(         this.style.backgroundColor);
  e.setText(            "<div>"+c+"</div>"); // childNode 0 is the caption 
  e.text              = c; // note: we keep the caption instead of releying on innerHTML because <img> src becomes fully qualified in IE!
  var n               = e.childNodes[0];
  domapi.Elm2(            n);
  n.DA_TYPE     = "COLLAPSETREE_CAPTION";
  n.style.padding     = "1px 3px";
  n.style.border      = "1px solid " + this.style.backgroundColor;
  e.isRoot            = p == this;
  e.depth             = this.getLevel(e);    // The depth of the object in the heirarhy
  if(e.depth>0)e.setM(  [0,0,0,this.indent]);
  e.style.cursor      = domapi.cursors.hand;
  e.setOverflow(        "hidden");
  e.DA_TYPE           = "COLLAPSETREE_ITEM";
  e.visible           = e.isRoot;
  e.baseH             = e.getH();            // So we know the basic height of one item, needs to be updated with reDraw
  e.setSize(            e.getW(),e.baseH);
  e.expanded          = 0;                   // The number currently expanded
  e.fn                = fn;
  e.target            = target;
  var t               = domapi.comps.collapsetree;
  e.setText           = t._nodesetText;
  e.getText           = t._nodegetText;
  e.getPath           = t.getPath;
  e.onclick           = t.itemClick;
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.getPath = function(d){
  // walks back up the tree building the path
  d     = domapi.rVal(d,"/");
  var r = d+this.getText();
  var p = this.parentNode;
  if(!p)return r;
  while(true)
    if(p.DA_TYPE=="COLLAPSETREE")return r;
    else{
      r = d+p.getText()+r;
      p = p.parentNode;
    }
  return null;
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree.getLevel = function(n){ // walks back up the tree counting indents
  if(!n||!n.parentNode)return 0;
  var r = 0;
  var p = n.parentNode;
  while(p){
    if(p.DA_TYPE=="COLLAPSETREE")return r;
    else{ 
      if(p.DA_TYPE=="COLLAPSETREE_ITEM")r++;
      p=p.parentNode;
    }
  }
  return r;
};
//------------------------------------------------------------------------------
domapi.comps.collapsetree._nodesetText = function(c){this.text=c;this.childNodes[0].innerHTML=c};
//------------------------------------------------------------------------------
domapi.comps.collapsetree._nodegetText = function( ){return this.text};
//------------------------------------------------------------------------------