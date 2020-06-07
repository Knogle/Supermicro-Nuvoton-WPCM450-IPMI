//------------------------------------------------------------------------------
// DomAPI Billboard Component
// D. Kadrioski 9/17/2001
// (c) Nebiru Software 2001,2002
//------------------------------------------------------------------------------

domapi.registerComponent("billboard");
//------------------------------------------------------------------------------
domapi.Billboard = function(arg){return domapi.comps.billboard.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.billboard.constructor = function(arg){
  arg.w         = domapi.rInt(arg["w"],450);
  arg.h         = domapi.rInt(arg["h"],80);
  var e         = domapi.Component(arg,"billboard");
  e.pauseLength = domapi.rInt(arg["pauseLength"],10000);
  e.isRandom    = domapi.rInt(arg["isRandom"]);
  e.items       = [];
  e.selIndex    = -1;
  e.doFade      = true;
  e.timer       = null;

  domapi.disallowSelect(e);
  domapi._finalizeComp( e);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.billboard._draw   = function(){
  this.billboardDraw();
};
//------------------------------------------------------------------------------
domapi.comps.billboard.billboardDraw = function(){
  var s      = this.style;
  s.cursor   = "default";
  s.margin   = "0px";
  s.padding  = "0px";
  s.overflow = "hidden";
//  s.backgroundColor = "silver";
};
//------------------------------------------------------------------------------
domapi.comps.billboard._layout = function(w,h){};
//------------------------------------------------------------------------------
domapi.comps.billboard.add=function(ppath,ptitle,phref,ptarget){
  this.items[this.items.length] = new Image();
  var t=this.items[this.items.length-1];
  t.src    = domapi.rVal(ppath);
  t.title  = domapi.rVal(ptitle);
  t.name   = domapi.rVal(phref,"#"); // i'm overloading "name" to hold the href, expando didn't seem to work
  t.target = domapi.rVal(ptarget,"_self");
  if(this.items.length==1)this.change(); // start timer after first img added
};
//------------------------------------------------------------------------------
domapi.comps.billboard.stop =function(reset){clearInterval(this.timer);if(reset==true){this.selIndex=-1;this.change(true)}};
//------------------------------------------------------------------------------
domapi.comps.billboard.start=function(){this.timer=setTimeout("document.getElementById('"+this.id+"').change()",this.pauseLength);};
//------------------------------------------------------------------------------
domapi.comps.billboard.onchange=function(){}; //user can override this function
//------------------------------------------------------------------------------
domapi.comps.billboard.change=function(stopping){
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  if(this.items.length>0){
    this.oSelIndex=this.selIndex;
    if(this.isRandom){
      this.selIndex=Math.floor(Math.random()*this.items.length);
    }else{
      this.selIndex++;
      if(this.selIndex>(this.items.length-1))this.selIndex=0;
    }
    if(this.doFade){
      if(this.oSelIndex>-1){
        var temp =  '<a href="'+this.items[this.selIndex].name+'" target="'+this.items[this.selIndex].target+'" title="'+this.items[this.selIndex].title+'">'+
                    '<img src="'+this.items[this.oSelIndex].src+'" border="0" name="da_old'+this.domAPIIndex+'" style="z-index:1;position:absolute;top:0px;left:0px;" />'+
                    '<img src="'+this.items[this.selIndex].src+'" border="0" name="da_new'+this.domAPIIndex+'" style="z-index:2;position:absolute;top:0px;left:0px;" />'+
                    '</a>';
        this.fadeAmt=100;
      }else{
        var temp =  '<a href="'+this.items[this.selIndex].name+'" target="'+this.items[this.selIndex].target+'" title="'+this.items[this.selIndex].title+'">'+
                    '<img src="'+this.items[this.selIndex].src+'" border="0" name="da_new'+this.domAPIIndex+'" style="z-index:2;position:absolute;top:0px;left:0px;" />'+
                    '</a>';
        this.fadeAmt=100;
      }
    } else {
      var t=this.items[this.selIndex];
      var temp =  '<a href="'+t.name+'" target="'+t.target+'" title="'+t.title+'">'+
                  '<img src="'+t.src+'" border="0" />'+
                  '</a>';
    }
    this.setText(temp);    
    domapi.comps.billboard._doFadeHelper(this.domAPIIndex);
    this.onchange();
  }
  if(!stopping)this.timer=setTimeout("document.getElementById('"+this.id+"').change()",this.pauseLength)
};
//------------------------------------------------------------------------------
domapi.comps.billboard._doFadeHelper = function(elmIndex){
  var elm = domapi.bags.elms[elmIndex];
  if(!elm.doFade||elm.oSelIndex<0)return;
  elm.fadeAmt=elm.fadeAmt-5;
  if(elm.fadeAmt>-1){
    if(domapi.isIE){
      document["da_old"+elmIndex].style.filter="alpha(opacity="+elm.fadeAmt+")";
      document["da_new"+elmIndex].style.filter="alpha(opacity="+(100-elm.fadeAmt)+")";
    }else{
      document["da_old"+elmIndex].style.MozOpacity = 0 + '%';
      document["da_old"+elmIndex].style.MozOpacity=elm.fadeAmt+'%';
      document["da_new"+elmIndex].style.MozOpacity = 0 + '%';
      document["da_new"+elmIndex].style.MozOpacity=(100-elm.fadeAmt)+'%';
    }
  setTimeout("domapi.comps.billboard._doFadeHelper(\""+elmIndex+"\")",50);
  }
};
//------------------------------------------------------------------------------
