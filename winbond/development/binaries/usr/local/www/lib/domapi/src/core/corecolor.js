//------------------------------------------------------------------------------
// DomAPI domapi routines
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// color stuff
// this is just the base code to support domapi.js
// if you want more color functionallity, loadUnit("color");
//------------------------------------------------------------------------------

domapi.color = {};

domapi.color.hexToInt = function(h){return parseInt(h.substring(1),16)};
//------------------------------------------------------------------------------
domapi.color.intToHex = function(i){
  i=i.toString(16);
  while(i.length<6)i="0"+i;
  return "#"+i;
};
//------------------------------------------------------------------------------
domapi.color.rgbToHex = function(s){
  // takes in an rgb array and returns the hex value
  // the complimentary function, hexToRgb() is located in ext/color_c.js
  var n  = Math.round(s[2]);
      n += Math.round(s[1]) << 8;
      n += Math.round(s[0]) << 16;
  return domapi.color.intToHex(n);
};
//------------------------------------------------------------------------------
domapi.color.makeSureIsHexColor = function(s){
  // netscape 6 seems to return colors in rgb(0,0,0) format, even in you set
  // the color using hex format #FFFFFF.
  // this function will detect that and convert it to hex for use in the other
  // color routines (lightenColor, darkenColor, etc...)
  // - new in 2.07
  // If color_c.js has been included on this page, then this function can attempt
  // to resolve color constants such as "red" into their hex equivalents
  if(s.substring(0,4)=="rgb("){                              // must be ns, of course
    var temp=s.split("rgb(")[1].split(",");                  // pull out rgb values
    for(var i=0;i<temp.length;i++)temp[i]=parseInt(temp[i]); // convert them to integers
    return(domapi.color.rgbToHex(temp));                     // turn it into hex and exit
  }else{
    if(domapi.isNil(s)) return domapi.rColor(s);     // nothing to do    
    // might be a color constant
    if(domapi.unitLoaded("color")){     // looks like color_c.js has been included
      var c = String(s).toLowerCase().trim();
      if(c.charAt(0) == "#")c = c.substr(1, c.length);
      var i=domapi.color.lookupColorNames.indexOf(c); // attempt to lookup color constant
      if(i>0)s="#"+domapi.color.lookupColors[i];      // return the hex value for this constant
    }
    return domapi.rColor(s);
  }
};
//------------------------------------------------------------------------------
domapi.rColor = function(s){
  var i, c;
  s = domapi.rVal(s, "#FFFFFF");
  if(s.charAt(0) != "#")s = "#" + s;
  while(s.length < 7) s += "0"; // pad
  s = s.substr(0, 7); // trim
  // now assert each
  for(i=1;i<7;i++){
    c = s.charAt(i).toUpperCase().charCodeAt(0);
    if(!((c > 47 && c < 58) || (c > 64 && c < 71)))
      s = s.substr(0,i) + "0" + s.substring(i+1, 7);
  }
  return s;
};
//------------------------------------------------------------------------------