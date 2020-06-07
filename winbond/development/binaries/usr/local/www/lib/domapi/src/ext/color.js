//------------------------------------------------------------------------------
// DomAPI color routines
// D. Kadrioski 8/24/2001
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// Alpha Filter Routines
// Robert Dankert 1/5/2002
// (c) Casper & Co Software 2001-2002
//------------------------------------------------------------------------------
// requires corecolor.js
//------------------------------------------------------------------------------
// this unit frequently converts colors from hex into RGB arrays and passes them
// around.  The go betweens are hexToRgb() and rgbToHex().
// rgbToHex() is located in domapi.js because Elm() needs it to deal with Mozilla
// which surfaces all color properties as rgb(), not hex
//------------------------------------------------------------------------------

// color object defined in corecolor.js
if(!domapi.color)domapi.color = {};

domapi.color.lookupColors     = "F0F8FF,FAEBD7,00FFFF,7FFFD4,F0FFFF,"+
                              "F5F5DC,FFE4C4,000000,FFEBCD,0000FF,"+
                              "8A2BE2,A52A2A,DEB887,5F9EA0,7FFF00,"+
                              "D2691E,FF7F50,6495ED,FFF8DC,DC143C,"+
                              "00FFFF,00008B,008B8B,B8860B,A9A9A9,"+
                              "006400,BDB76B,8B008B,556B2F,FF8C00,"+
                              "9932CC,8B0000,E9967A,8FBC8B,1E90FF,"+
                              "228B22,848484,008200,CD5C5C,E6E6FA,"+
                              "FFFACD,D3D3D3,20B2AA,00FF00,FF00FF,"+
                              "840000,7B68EE,000080,FFA500,FF0000,"+
                              "FA8072,C6C6C6,6A5ACD,008284,FFFF00,"+
                              "9ACD32,FFFFFF";
domapi.color.lookupColorNames = "aliceblue,antiquewhite,aqua,aquamarine,azure,"+
                              "beige,bisque,black,blanchedalmond,blue,"+
                              "blueviolet,brown,burlywood,cadetblue,chartreuse,"+
                              "chocolate,coral,cornflowerblue,cornsilk,crimson,"+
                              "cyan,darkblue,darkcyan,darkgoldenrod,darkgray,"+
                              "darkgreen,darkkhaki,darkmagenta,darkolivegreen,darkorange,"+
                              "darkorchid,darkred,darksalmon,darkseagreen,dodgerblue,"+
                              "forestgreen,gray,green,indianred,lavender,"+
                              "lemonchiffon,lightgrey,lightseagreen,lime,magenta,"+
                              "maroon,mediumslateblue,navy,orange,red,"+
                              "salmon,silver,slateblue,teal,yellow,"+
                              "yellowgreen,white";

domapi.color.lookupColors     = domapi.color.lookupColors.split(    ",");
domapi.color.lookupColorNames = domapi.color.lookupColorNames.split(",");
domapi.color.debug = false;
//------------------------------------------------------------------------------
domapi.color.setColor = function(id,c,kind){
  // quick and dirty painter function
  kind  = domapi.rVal(kind,"bg");
  c     = domapi.rVal(c,"#FFFFFF");
  switch(kind){
    case "bg":domapi.getElm(id).style.backgroundColor = c; break;
    case "fg":domapi.getElm(id).style.color           = c; break;
  }
};
//------------------------------------------------------------------------------
domapi.color.hexToRgb = function(sent){
  // takes in a hex color and returns an array of rgb values
  if(sent.charAt(0)!="#")sent = "#"+sent;
  return new Array( parseInt(sent.substring(1,3),16),
                    parseInt(sent.substring(3,5),16),
                    parseInt(sent.substring(5,7),16));
};
//------------------------------------------------------------------------------
domapi.color.rgbToHsl = function(sent){
  // adapted from http://astronomy.swin.edu.au/~pbourke/colour/hsl/
  var R = [0,0,0];
  var T = [0,0,0];
  var r = sent[0];
  var g = sent[1];
  var b = sent[2];
  var theMin, theMax, delta, sum;

  theMin = Math.min(r,Math.min(g,b));
  theMax = Math.max(r,Math.max(g,b));
  delta  = theMax - theMin;
  sum    = theMax + theMin;
  R[0]   = 0;
  R[2]   = sum / 510;
  R[1]   = (R[2] <= 0.5) ? delta / sum : delta / (510 - delta);
  T[0]   = (theMax-r) / delta;
  T[1]   = (theMax-g) / delta;
  T[2]   = (theMax-b) / delta;

  if(r == theMax && T[2] == 1) R[0] = ((g == theMin && b > g) ? 0.5+T[2] : 1-T[1]);
  else if(g == theMax) R[0] = ((b == theMin) ? 1 + T[0] : 3 - T[2]);
  else if(b == theMax) R[0] = ((r == theMin) ? 3 + T[1] : 5 - T[0]);
  else if(b > 0) R[0] = 5 + T[2];
  if(isNaN(R[0]))R[0] = 0;
  if(isNaN(R[1]))R[1] = 0;
  if(isNaN(R[2]))R[2] = 0;
  R[0] = R[0] / 6;
  R[0] = parseInt(R[0] * 240); R[1] = parseInt(R[1] * 240); R[2] = parseInt(R[2] * 240);
  return R;
};
//------------------------------------------------------------------------------
domapi.color.hslToRgb = function(sent){
  // based on a six segment curtain - hue across, saturation down
  var i,j,k,weight;
  var h = sent[0] / 240;
  var s = sent[1] / 240;
  var l = sent[2] / 240;
  var R = [0,0,0];
  weight = (l <= 0.5) ? (l * (1 + s)):(l + s - l * s);

  if(h == 1)h = 0;
  h = h * 6;
  i = l*2 - weight;
  j = i + (weight - i) * (h - parseInt(h));
  k = weight - (weight - i) * (h - parseInt(h));
  switch(parseInt(h)){
    case 0: R[0] = weight; R[1] = j;      R[2] = i;      break;
    case 1: R[0] = k;      R[1] = weight; R[2] = i;      break;
    case 2: R[0] = i;      R[1] = weight; R[2] = j;      break;
    case 3: R[0] = i;      R[1] = k;      R[2] = weight; break;
    case 4: R[0] = j;      R[1] = i;      R[2] = weight; break;
    case 5: R[0] = weight; R[1] = i;      R[2] = k;      break;
  }
  R[0] = parseInt(R[0] * 255 + 0.5);
  R[1] = parseInt(R[1] * 255 + 0.5);
  R[2] = parseInt(R[2] * 255 + 0.5);
  return R;
};
//------------------------------------------------------------------------------
domapi.color.alterColor = function(sent,percentage){
  // given a hex color and a percentage, returns a brighter version.
  // Use negative values to darken
  var rgb = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(sent));
  for(var i=0;i<rgb.length;i++){
    if(rgb[i]==0 )rgb[i] = 1;
    rgb[i] = Math.floor(rgb[i])+Math.floor((rgb[i]*percentage)/100);
    if(rgb[i]>255)rgb[i] = 255;
    if(rgb[i]<0  )rgb[i] = 0;
  }
  return domapi.color.rgbToHex(rgb);
};
//------------------------------------------------------------------------------
domapi.color.mergeColor = function(color1,color2,mergeMethod){
  var a;
  var rgb1 = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(color1));
  var rgb2 = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(color2));
  switch(mergeMethod){
    case "and":     for(a=0;a<rgb1.length;a++)rgb1[a] = rgb1[a] & rgb2[a];break;
    case "or":      for(a=0;a<rgb1.length;a++)rgb1[a] = rgb1[a] | rgb2[a];break;
    case "xor":     for(a=0;a<rgb1.length;a++)rgb1[a] = rgb1[a] ^ rgb2[a];break;
    case "not":     for(a=0;a<rgb1.length;a++)rgb1[a] =         ~ rgb1[a];break;
    case "add":     for(a=0;a<rgb1.length;a++)rgb1[a] = rgb1[a] + rgb2[a];break;
    case "subtract":for(a=0;a<rgb1.length;a++)rgb1[a] = rgb1[a] - rgb2[a];break;
    case "blend":   for(a=0;a<rgb1.length;a++)rgb1[a] = Math.floor((rgb1[a] + rgb2[a])/2);break;
    case "floor":
      var avg = Math.floor((rgb1[0]+rgb1[1]+rgb1[2])/3);
      if(avg>128)for(a=0;a<rgb1.length;a++)rgb1[a] = 0;
      else       for(a=0;a<rgb1.length;a++)rgb1[a] = 255;
      break;
  }
  for(a=0;a<rgb1.length;a++){if(rgb1[a]<0)rgb1[a] = 0;if(rgb1[a]>255)rgb1[a] = 255}
  return domapi.color.rgbToHex(rgb1);
};
//------------------------------------------------------------------------------
domapi.elmProto.fadeToColor = function(kind,hexColor,inc,speed,fn){domapi.color.fadeToColor(this.id,kind,hexColor,inc,speed,fn)};
//------------------------------------------------------------------------------
domapi.color.fadeToColor = function (elmID,kind,hexColor,inc,speed,fn){
  var a;
  if(domapi.color.debug)domapi.debug.dump_var("fadeToColor('"+elmID+"','"+kind+"','"+hexColor+"',"+inc+","+speed+",'"+fn+"')");
  // moves closer to a final color until a match is made
  hexColor = domapi.rVal(hexColor,"#000000"); // assume fade to black
  kind     = domapi.rVal(kind,"bg");
  inc      = domapi.rVal(inc,10);
  speed    = domapi.rVal(speed,10);
  var elm  = domapi.getElm(elmID);
  if(!elm)return;
  switch(kind){
    case "bg":
      elm.fadeRGB1b = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(elm.style.backgroundColor));
      elm.fadeRGB2b = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(hexColor));
      // we need to correct for when system colors are used
      if(isNaN(elm.fadeRGB1b[0]))for(a=0;a<elm.fadeRGB1b.length;a++)elm.fadeRGB1b[a] = 255;
      if(isNaN(elm.fadeRGB2b[0]))for(a=0;a<elm.fadeRGB2b.length;a++)elm.fadeRGB2b[a] = 255;
      break;
    case "fg":
      elm.fadeRGB1f = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(elm.style.color));
      elm.fadeRGB2f = domapi.color.hexToRgb(domapi.color.makeSureIsHexColor(hexColor));
      // we need to correct for when system colors are used 
      if(isNaN(elm.fadeRGB1f[0]))for(a=0;a<elm.fadeRGB1f.length;a++)elm.fadeRGB1f[a] = 0;
      if(isNaN(elm.fadeRGB2f[0]))for(a=0;a<elm.fadeRGB2f.length;a++)elm.fadeRGB2f[a] = 0;
      break;
    default:return; // undefined kind
  }
  domapi.color._fadeToColorHelper(elmID,kind,inc,speed,fn);
};
//------------------------------------------------------------------------------
domapi.color._fadeToColorHelper = function(elmID,kind,inc,speed,fn){
  //if(domapi.color.debug)domapi.debug.dump_var("_fadeToColorHelper('"+elmID+"','"+kind+"','"+inc+"','"+speed+"','"+fn+"')");
  var elm  = domapi.getElm(elmID);
  var done = 0; // how many of rgb have reached dest color, quit when done==3
  var delta,c1,c2,temp;
  switch(kind){
    case "bg":var a1 = elm.fadeRGB1b; var a2 = elm.fadeRGB2b; break;
    case "fg":var a1 = elm.fadeRGB1f; var a2 = elm.fadeRGB2f; break;
  }

  if(domapi.color.debug)var db = " current="+a1+" target="+a2;

  for(var a=0;a<a1.length;a++){
    c1 = a1[a]; c2 = a2[a]; delta = 0;
    if(c1!=c2){
      temp = c2-c1;
      if(!isNaN(temp)){
        delta = Math.floor((temp)*inc/100);
        c1 = parseInt(c1)+delta;
      }else delta=100;
    };
    //domapi.debug.dump_var(delta)
    if(Math.abs(delta)<1){done++; c1 = c2}
    a1[a]=c1;
  }

  if(domapi.color.debug)domapi.debug.dump_var(db+" done="+done);

  switch(kind){
    case "bg":elm.style.backgroundColor = domapi.color.rgbToHex(a1); break;
    case "fg":elm.style.color           = domapi.color.rgbToHex(a1); break;
  }
  if(done!=3)setTimeout("domapi.color._fadeToColorHelper(\""+elmID+"\",\""+kind+"\","+inc+","+speed+",\""+fn+"\")",speed);
  else if(typeof fn!="undefined" && fn!="undefined")eval(fn);
};
//------------------------------------------------------------------------------
domapi.elmProto.alphaTo=function(endA,glideType,steps,speed,fn){
  if(this.isAlpha)return;
  domapi.rInt(           endA,this.getAlpha()); // If no endA is set, default to no change in Alpha
  endA               = Math.round(endA);
  domapi.rInt(steps,     50);                   // If no steps exist, default is for 50
  domapi.rInt(speed,     20);                   // If no speed is defined, default is 20
  domapi.rInt(glideType, 3);                    // Default is for slow-to-fast
  this.vSlideA  = this.getAlpha();                                   // set vSlideA to the current alpha
  var distA     = endA-this.vSlideA;                                 // set distA to the alpha change total
  var scaleA    = distA/((Math.pow(steps,2)+2*steps+1)/(4*steps));   // set the alpha-scaler component
  this.isAlpha  = true;
  this.domAPIIndex = domapi.bags.elms.indexOf(this);
  domapi.color._alphaDomElm(this.domAPIIndex,glideType,distA,scaleA,endA,steps,1,speed,fn);
};
//------------------------------------------------------------------------------
domapi.color._alphaDomElm = function(elmIndex,type,distA,scaleA,endA,steps,count,speed,fn){
  var elm=domapi.bags.elms[elmIndex];           // get the elm definition
  if(count<=steps) {                          // make sure the loop isnt completed
   switch(parseInt(type)){
      case 1:
        elm.vSlideA+=scaleA*Math.pow(count/steps,3);
        break;
      case 2:
        elm.vSlideA+=scaleA*Math.pow(((steps-count)+1)/steps,3);
        if(Math.round(elm.vSlideA)==endA)count=steps;
        break;
      case 3:
        elm.vSlideA+=distA/steps;
      break;
    }
    elm.setAlpha(Math.round(elm.vSlideA));    // move to the new alpha
    count++;                                  // Increase the count
    setTimeout("domapi.color._alphaDomElm(\""+elmIndex+"\","+type+","+distA+","+scaleA+","+endA+","+steps+","+count+","+speed+",\""+fn+"\")",speed); // Set the timeout for the next run
  }else{
    elm.isAlpha=false;
    elm.setAlpha(endA);                       // Make sure it ends in proper spot
    if(typeof fn!="undefined" && fn!="undefined")eval(fn);              // Evaluate whatever function you want evaluated
  }
};
//------------------------------------------------------------------------------