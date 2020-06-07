//--------------------------------------------
// DomAPI acceleration routines
// Robert Dankert 11/23/2001
// (c) Casper & Co Software 2001-2002
//--------------------------------------------
// type=1 slow-to-fast
// type=2 fast-to-slow
// type=3 linear
// type=4 curve  (Ben Tudball - 14 December 2002 - Additional x1,y1,x2,y2,x3,y3 to .glideTo() .glideBy() functions)
//--------------------------------------------

domapi.animate = new Object();

domapi.elmProto.glideTo = function(arg){// endx,endy,glideType,steps,speed,fn,x1,y1,x2,y2,x3,y3
  if(this.isPath)return;
  var endx      = arg["endx"]; var endy = arg["endy"];
  var glideType = domapi.rInt(arg["type" ],3);  // Default is for slow-to-fast
  var steps     = domapi.rInt(arg["steps"],50);
  var speed     = domapi.rInt(arg["speed"],20);
  var fn        = arg["fn"];
  var x1        = arg["x1"];   var y1   = arg["y1"];
  var x2        = arg["x2"];   var y2   = arg["y2"];
  var x3        = arg["x3"];   var y3   = arg["y3"];  
  if(this.isGlide)clearTimeout(this.fly);
 // if(endx = null)endx = this.getX(); // If no endx is set, default to no move in x
 // if(endy = null)endy = this.getY(); // If no endy is set, default to no move in y
  endx             = Math.round(endx);
  endy             = Math.round(endy);            
  this.vSlidex     = this.getX();                                     // set vSlidex to the current x positioning
  this.vSlidey     = this.getY();                                     // set vSlidey to the current y positioning
  var distx        = endx-this.vSlidex;                               // set distx to the x-distance needed to travel
  var disty        = endy-this.vSlidey;                               // set disty to the y-distance needed to travel
  var scalex       = distx/((Math.pow(steps,2)+2*steps+1)/(4*steps)); // set the x-scaler component
  var scaley       = disty/((Math.pow(steps,2)+2*steps+1)/(4*steps)); // set the y-scaler component
  this.isGlide     = true;
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  domapi.animate._GlideDomElm(this.domAPIIndex,glideType,distx,disty,scalex,scaley,endx,endy,steps,1,speed,fn,x1,y1,x2,y2,x3,y3);
};
//------------------------------------------------------------------------------
domapi.elmProto.glideBy = function(arg){
  arg["endx"] = this.getX() + arg["distx"]; // Find the new ending point-x
  arg["endy"] = this.getY() + arg["disty"]; // Find the new ending point-y
  this.glideTo(arg);
};
//------------------------------------------------------------------------------
domapi.animate._GlideDomElm = function(elmIndex,type,distx,disty,scalex,scaley,endx,endy,steps,count,speed,fn,x1,y1,x2,y2,x3,y3){
  var s;
  var elm=domapi.bags.elms[elmIndex];                                          // get the elm definition
  var sv=count/steps;                                                      // Ben Tudball curve addition
  if(count<=steps) {                                                     // make sure the loop isnt completed
    switch(domapi.rInt(type,1)){
      case 1:
        elm.vSlidex+=scalex*Math.pow(sv,3);
        elm.vSlidey+=scaley*Math.pow(sv,3);
        break;
      case 2:
        elm.vSlidex+=scalex*Math.pow(((steps-count)+1)/steps,3);
        elm.vSlidey+=scaley*Math.pow(((steps-count)+1)/steps,3);
        if(Math.round(elm.vSlidex)==endx && Math.round(elm.vSlidey)==endy)count=steps;
        break;
      case 3:
        elm.vSlidex+=distx/steps;
        elm.vSlidey+=disty/steps;
	    break;
      case 4:  // Ben Tudball curve addition
        elm.vSlidex = endx * Math.pow(sv,3) + x1 * 3 * Math.pow(sv,2) * (1-sv) + x2 * 3 * sv * Math.pow(1-sv,2) + x3 * Math.pow(1-sv,3);
        elm.vSlidey = endy * Math.pow(sv,3) + y1 * 3 * Math.pow(sv,2) * (1-sv) + y2 * 3 * sv * Math.pow(1-sv,2) + y3 * Math.pow(1-sv,3);
        break;
    }
    elm.moveTo(Math.round(elm.vSlidex),Math.round(elm.vSlidey));         // move to the new point
    count++;   // Increase the count
    if(fn)fn = fn.replace(new RegExp('"' , "g"),'\\"');
    elm.fly = setTimeout("domapi.animate._GlideDomElm(\""+elmIndex+"\","+
      type+","+distx+","+disty+","+scalex+","+scaley+","+endx+","+endy+","+
      steps+","+count+","+speed+",\""+fn+"\","+x1+","+y1+","+x2+","+y2+","+
      x3+","+y3+")",speed);   // Set the timeout for the next run
  }else{
    elm.isGlide=false;
    elm.moveTo(endx,endy);                                               // Make sure it ends in proper spot
    if(typeof fn!="undefined" && fn!="undefined")eval(fn);                                         // Evaluate whatever function you want evaluated
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.sizeTo = function(arg){ // endw,endh,growType,steps,speed,fn
  var endw     = arg["endw"];
  var endh     = arg["endh"];
  var growType = domapi.rInt(arg["type" ], 3);  // Default is for slow-to-fast
  var steps    = domapi.rInt(arg["steps"], 50);
  var speed    = domapi.rInt(arg["speed"], 20);
  var fn       = arg["fn"];
  if(this.isGrow)clearTimeout(this.fly);
//  if(endw = null)endw = this.getW();
//  if(endh = null)endh = this.getH();
  endw             = Math.round(endw);
  endh             = Math.round(endh);
  this.vGroww      = this.getW();
  this.vGrowh      = this.getH();
  var distw        = endw-this.vGroww;
  var disth        = endh-this.vGrowh;
  var scalew       = distw/((Math.pow(steps,2)+2*steps+1)/(4*steps));   // set the x-scaler component
  var scaleh       = disth/((Math.pow(steps,2)+2*steps+1)/(4*steps));   // set the y-scaler component
  this.isGrow      = true;
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  domapi.animate._sizeDomElm(this.domAPIIndex,growType,distw,disth,scalew,scaleh,endw,endh,steps,1,speed,fn);
};
//------------------------------------------------------------------------------
domapi.elmProto.sizeBy = function(arg){
  arg["endw"] = this.getW() + arg["distw"];
  arg["endh"] = this.getH() + arg["disth"];
  this.sizeTo(arg);
};
//------------------------------------------------------------------------------
domapi.animate._sizeDomElm = function(elmIndex,type,distw,disth,scalew,scaleh,endw,endh,steps,count,speed,fn){
  var s;
  var elm=domapi.bags.elms[elmIndex];
  if(count<steps){
   switch(parseInt(type)){
      case 1:
        elm.vGroww+=scalew*Math.pow(count/steps,3);
        elm.vGrowh+=scaleh*Math.pow(count/steps,3);
        break;
      case 2:
        elm.vGroww+=scalew*Math.pow(((steps-count)+1)/steps,3);
        elm.vGrowh+=scaleh*Math.pow(((steps-count)+1)/steps,3);
        if(Math.round(elm.vGroww)==endw && Math.round(elm.vGrowh)==endh)count=steps;
        break;
      case 3:
        elm.vGroww+=distw/steps;
        elm.vGrowh+=disth/steps;
      break;
    }
    elm.setSize(Math.round(elm.vGroww),Math.round(elm.vGrowh));
    count++;
    elm.fly=setTimeout("domapi.animate._sizeDomElm(\""+elmIndex+"\","+type+","+distw+","+disth+","+scalew+","+scaleh+","+endw+","+endh+","+steps+","+count+","+speed+",\""+fn+"\")",speed);
  }else{
    elm.isGrow=false;
    elm.setSize(endw,endh);
    if(typeof fn!="undefined" && fn!="undefined")eval(fn);
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.clipTo = function(arg){ // endt,endr,endb,endl,growType,steps,speed,fn
  var endt     = arg["endt"];
  var endr     = arg["endr"];
  var endb     = arg["endb"];
  var endl     = arg["endl"];
  var growType = domapi.rInt(arg["type" ], 3);
  var steps    = domapi.rInt(arg["steps"], 50);
  var speed    = domapi.rInt(arg["speed"], 20);
  var fn       = arg["fn"];
  var h = this.getH(); var w = this.getW();
  if(this.isClip)clearTimeout(this.fly);
  if(this.style.clip=="")this.setClip(0,this.getW(),this.getH(),0);
  var clipVals=this.style.clip.split("rect(")[1].split(" ");
  for (var i=0;i<clipVals.length;i++)clipVals[i]=parseInt(clipVals[i]);
  if(!endt || endt<0)endt = 0;
  domapi.rInt(endr);
  domapi.rInt(endb);
  if(!endl || endl<0)endl = 0;
  if(endr > w)endr = w;
  if(endb > h)endb = h;
  if(endt > (h/2))endt = h/2;
  if(endr < (w/2))endr = w/2;
  if(endb < (h/2))endb = h/2;
  if(endl > (w/2))endl = w/2;
  endt=Math.round(endt);
  endr=Math.round(endr);
  endb=Math.round(endb);
  endl=Math.round(endl);
  this.vClipt  = clipVals[0];
  this.vClipr  = clipVals[1];
  this.vClipb  = clipVals[2];
  this.vClipl  = clipVals[3];
  var distt    = endt-this.vClipt;
  var distr    = this.vClipr-endr;
  var distb    = this.vClipb-endb;
  var distl    = endl-this.vClipl;
  var factor   = ((Math.pow(steps,2)+2*steps+1)/(4*steps));
  var scalet   = distt/factor;
  var scaler   = distr/factor;
  var scaleb   = distb/factor;
  var scalel   = distl/factor;
  this.isClip  = true;
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  domapi.animate._clipDomElm(this.domAPIIndex,growType,distt,distr,distb,distl,scalet,scaler,scaleb,scalel,endt,endr,endb,endl,steps,1,speed,fn);
};
//------------------------------------------------------------------------------
domapi.elmProto.clipBy = function(arg){
  if(this.style.clip=="")this.setClip(0,this.getW(),this.getH(),0);
  var clipVals=this.style.clip.split("rect(")[1].split(" ");
  for (var i=0;i<clipVals.length;i++)clipVals[i]=parseInt(clipVals[i]);
  arg["endt"] = clipVals[0] + arg["distt"];
  arg["endr"] = clipVals[1] + arg["distr"];
  arg["endb"] = clipVals[2] + arg["distb"];
  arg["endl"] = clipVals[3] + arg["distl"];
  this.clipTo(arg);
};
//------------------------------------------------------------------------------
domapi.animate._clipDomElm = function(elmIndex,type,distt,distr,distb,distl,scalet,scaler,scaleb,scalel,endt,endr,endb,endl,steps,count,speed,fn){
  var s;
  var elm=domapi.bags.elms[elmIndex];
  if(count<steps){
   switch(parseInt(type)){
      case 1:
        var fact=Math.pow(count/steps,3);
        elm.vClipt+=scalet*fact;
        elm.vClipr-=scaler*fact;
        elm.vClipb-=scaleb*fact;
        elm.vClipl+=scalel*fact;
        break;
      case 2:
        var fact=Math.pow(((steps-count)+1)/steps,3);
        elm.vClipt+=scalet*fact;
        elm.vClipr-=scaler*fact;
        elm.vClipb-=scaleb*fact;
        elm.vClipl+=scalel*fact;
        if(Math.round(elm.vClipt)==endt && Math.round(elm.vClipr)==endr && Math.round(elm.vClipb)==endb && Math.round(elm.vClipl)==endl)count=steps;
        break;
      case 3:
        elm.vClipt+=distt/steps;
        elm.vClipr-=distr/steps;
        elm.vClipb-=distb/steps;
        elm.vClipl+=distl/steps;
      break;
    }
    elm.setClip(Math.round(elm.vClipt),Math.round(elm.vClipr),Math.round(elm.vClipb),Math.round(elm.vClipl));
    count++;
    elm.fly=setTimeout("domapi.animate._clipDomElm(\""+elmIndex+"\","+type+","+distt+","+distr+","+distb+","+distl+","+scalet+","+scaler+","+scaleb+","+scalel+","+endt+","+endr+","+endb+","+endl+","+steps+","+count+","+speed+",\""+fn+"\")",speed);
  }else{
    elm.isClip=false;
    elm.setClip(endt,endr,endb,endl);
    if(typeof fn!="undefined" && fn!="undefined")eval(fn);
  }
};
//------------------------------------------------------------------------------
domapi.elmProto.pathSlide = function(arg){ // listX,listY,start,steps,speed
  var listX = arg["listx"];
  var listY = arg["listy"];
  var start = domapi.rInt(arg["start"]);
  var steps = domapi.rInt(arg["steps"], 5);
  var speed = domapi.rInt(arg["speed"], 20);  
  if(listX.length!=listY.length || !listX || this.isGlide || start > listX.length || this.isPath)return;
  this.listX  = listX;
  this.listY  = listY;
  this.pCount = start;
  this.isPath = true;
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  domapi.animate._pathDomElm(this.domAPIIndex,steps,speed);
};
//------------------------------------------------------------------------------
domapi.animate._pathDomElm = function(elmIndex,steps,speed){
  var elm=domapi.bags.elms[elmIndex];
  if(elm.pCount<elm.listX.length){
    endx=elm.listX[elm.pCount];
    endy=elm.listY[elm.pCount];
    elm.vSlidex = elm.getX();
    elm.vSlidey = elm.getY();
    distx=elm.listX[elm.pCount] - elm.vSlidex;
    disty=elm.listY[elm.pCount] - elm.vSlidey;
    elm.pCount++;
    domapi.animate._pathGlideDomElm(elmIndex,distx,disty,endx,endy,steps,1,speed,"domapi.animate._pathDomElm(elmIndex,steps,speed)");
  }else{
    elm.isPath=false;
  }
};
//------------------------------------------------------------------------------
domapi.animate._pathGlideDomElm = function(elmIndex,distx,disty,endx,endy,steps,count,speed,fn){
  var s;
  var elm=domapi.bags.elms[elmIndex];                                          // get the elm definition
  if(count<=steps){                                                      // make sure the loop isnt completed
    elm.vSlidex+=distx/steps;
    elm.vSlidey+=disty/steps;
    elm.moveTo(Math.round(elm.vSlidex),Math.round(elm.vSlidey));         // move to the new point
    count++;                                                             // Increase the count
    elm.fly=setTimeout("domapi.animate._pathGlideDomElm(\""+elmIndex+"\","+distx+","+disty+","+endx+","+endy+","+steps+","+count+","+speed+",\""+fn+"\")",speed);   // Set the timeout for the next run
  }else{
    elm.moveTo(endx,endy);                                               // Make sure it ends in proper spot
    if(typeof fn == "function")fn();
    else if(typeof fn!="undefined" && fn!="undefined")eval(fn);
  }
};
//------------------------------------------------------------------------------
