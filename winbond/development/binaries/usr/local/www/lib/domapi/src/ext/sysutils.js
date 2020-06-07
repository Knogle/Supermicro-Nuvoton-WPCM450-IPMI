//------------------------------------------------------------------------------
// DomAPI sysutils
// D. Kadrioski 3/7/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------


//==============================================================================
// Global Vars =================================================================
//==============================================================================

if(typeof sysutils!="Object")sysutils = {};

sysutils.now             = function(){return new Date()};
//------------------------------------------------------------------------------
sysutils.monthLength     = [31,28,31,30,31,30,31,31,30,31,30,31];
sysutils.defaultDateMask = domapi.getString("DATE_FORMAT");
//------------------------------------------------------------------------------

//==============================================================================
// Validation Routines =========================================================
//==============================================================================

//------------------------------------------------------------------------------
sysutils.isInteger = function(s){return s==parseInt(s,10)};
//------------------------------------------------------------------------------
sysutils.isFloat = function(s){
  if(domapi.isNil(s))return false;
  //return s == String(s).match(/\d*\.{0,1}\d*/)[0];
  return s == String(s).match(new RegExp("[+-]{0,1}\\d*\\.{0,1}\\d*"))[0]; // S. Joanou
};
//------------------------------------------------------------------------------
sysutils.isMoney = function(s){
  if(domapi.isNil(s))return false;
  return s == String(s).match(new RegExp("^\\${0,1}\\d*\\.{0,1}\\d{0,2}"))[0];
};
//------------------------------------------------------------------------------
sysutils.isStateCode = function(s){return domapi.lang["STATECODES"].indexOf(String(s).toUpperCase())>-1};
//------------------------------------------------------------------------------
sysutils.isEmail = function(s){
  if(domapi.isNil(s))return false;
  return s == String(s).match(new RegExp("\\S+@([-\\w]+\\.)+\\w+", "g"));
};
//------------------------------------------------------------------------------
sysutils.isURL = function(s){
  if(domapi.isNil(s))return false;
  return s == String(s).match(new RegExp("\\w{2,}:\\/{2}([-\\w]+\\.)+\\w+\\S*", "g"));
};
//------------------------------------------------------------------------------
sysutils.isTelephone = function(s){ // telephone, with area code + opt prefixes
  if(domapi.isNil(s))return false;
  var r = String(s).replace(new RegExp("\\D+", "g"), '-');
  r = r.match(new RegExp("(\\d+-?)*(\\d{3}-?){2}\\d{4}", "g"));
  return !domapi.isNil(r);
};
//------------------------------------------------------------------------------
sysutils.isCreditCardNumber = function(s){
  if(domapi.isNil(s))return false;
  s = s.replace(new RegExp("\\D+", "g"), '');
  return this._ccChecksum(s);
};
//------------------------------------------------------------------------------

//==============================================================================
// string routines =============================================================
//==============================================================================

//------------------------------------------------------------------------------
String.prototype.trim = function(){
  var s = this.replace(new RegExp("^\\s+", "g"),"");
  return s.replace(new RegExp("\\s+$", "g"),"");
};
//------------------------------------------------------------------------------
sysutils.trim = function(s){
  if(domapi.isNil(s))return s;
  s = String(s).replace(new RegExp("^\\s+", "g"),"");
  return s.replace(new RegExp("\\s+$", "g"),"");
};
//------------------------------------------------------------------------------
sysutils.rightStr = function(s,n){
  s=String(s);
  return s.substr(s.length-n,n);
};
//------------------------------------------------------------------------------
sysutils.filterChars = function(s,c){return String(s).split(c).join("")};
//------------------------------------------------------------------------------
sysutils.filterCharsNoCase = function(s,c){
  return String(s).split(String(c).toLowerCase()).join("").split(String(c).toUpperCase()).join("");
};
//------------------------------------------------------------------------------
sysutils.formatString = function(s,p){
  if(!p||!p.length)return s;
  var r = s;
  var re;
  for(var a=0;a<p.length;a++){
    re = new RegExp("%"+(a+1),"g");
    r  = r.replace(re,p[a]);
  }
  return r;
};
//------------------------------------------------------------------------------
sysutils.filterNonDigits = function(s){return String(s).replace(new RegExp("[^\\d\\.]", "g"),"")};
//------------------------------------------------------------------------------
sysutils.padZeros = function(s,n){
  s = String(s);
  while(s.length<n)s="0"+s;
  return s;
};
//------------------------------------------------------------------------------
sysutils.dayOfMonthStr = function(i){return domapi.lang.dayOfMonthStr(i)};
//------------------------------------------------------------------------------

//==============================================================================
// number routines =============================================================
//==============================================================================

//------------------------------------------------------------------------------
if(typeof Number.prototype.toFixed != "undefined")
  sysutils.roundTo = function(s,d){
    return Number(s).toFixed(d);
  };
else
  sysutils.roundTo = function(s,d){
    var r,i,a,b,c;
    r = s * Math.pow(10,d);
    r = Math.round(r);
    c = String(r).length;
    r = String(r / Math.pow(10,d));
    if(isNaN(r))return r;
    i = r.indexOf(".");
    if(i<1){
      r += ".";
      for(a=0;a<d;a++)r += "0";
    }else{
      b = r.length - i - 1;
      for(a=0;a<d-b;a++)r += "0";
      r = r.substr(0,c+1+d);
    }
    return r;
  };
//------------------------------------------------------------------------------
sysutils.bintodec = function(s){return parseInt(s,2)};
//------------------------------------------------------------------------------
sysutils.dectobin = function(i){return parseInt(i).toString(2)};
//------------------------------------------------------------------------------
// from http://www.codelib.net/home/jkm/checksum.js
sysutils._ccChecksum = function(s){
  var p=0, e=8, t=0, c=[], r=0, l=0, i;
  if(s.length != 16){
    t = 1;
    e = s.length == 13 && 6 || s.length == 15 && 7;
  }
  for (i=p; i<e; i++)
    r += (c[i] = s.charAt(i*2+t) * 2) > 9? Math.floor(c[i]/10 + c[i]%10): c[i];
  for (i=p; i<e+t; i++) l += s.charAt(i*2+1-t)-0;
  l += r;
  return e && l%10 == 0;
};
//------------------------------------------------------------------------------

//==============================================================================
// date routines ===============================================================
//==============================================================================

//------------------------------------------------------------------------------
sysutils.makeFourDigitYear = function(s){ // takes yy and tries to output yyyy
  if(domapi.isNil(s)){
    throw new Error("sysutils.makeFourDigitYear called with empty param!");
    return this.now().getFullYear();
  }
  if(String(s).length>2) return s;
  if(parseInt(s)<50) return "20"+sysutils.padZeros(s,2);
  else return "19"+s;
};
//------------------------------------------------------------------------------
sysutils.getMonthLength = function(m,y){ // 0=jan
  y=sysutils.makeFourDigitYear(y);  // year must be yyyy
  m=parseInt(m,10);
  if(m==1) // check for leap year - any year divisible by 4 or 400 - add one day to february
     if(y/4==Math.floor(y/4) || y/400==Math.floor(y/400)) return 29;
  return sysutils.monthLength[m];
};
//------------------------------------------------------------------------------
sysutils.addDaysToDate = function(d,n){return d.setDate(d.getDate() + parseInt(n))};
//------------------------------------------------------------------------------
sysutils.addMonthsToDate = function(d,n){
  var day = d.getDate();
  d.setMonth(d.getMonth() + n);
  if(d.getDate() < day) {
    d.setDate(1);
    d.setDate(d.getDate() - 1);
  }
  return d;
};
//------------------------------------------------------------------------------
sysutils.formatDate = function(d,f){
  // find the delimiter used (note: only one can be used at a time!!)
  f=domapi.rVal(f,sysutils.defaultDateMask);
  var del=null;
  if(f.indexOf("/")>-1)del="/";else
  if(f.indexOf("-")>-1)del="-";else
  if(f.indexOf(".")>-1)del=".";
  if(!del)return;
  //---------------
  // breakout the parts of the format string
  f=f.split(del);
  d=new Date(d);
  for(var a=0;a<f.length;a++){
    f[a]=sysutils.trim(f[a].toUpperCase());
    if(f[a].charAt(0)=="M")f[a]=sysutils.padZeros(d.getMonth()+1,f[a].length);
    if(f[a].charAt(0)=="D")f[a]=sysutils.padZeros(d.getDate(),f[a].length);
    if(f[a].charAt(0)=="Y")f[a]=sysutils.padZeros(sysutils.rightStr(d.getFullYear(),f[a].length));
  }
  var r=f[0];
  for(a=1;a<f.length;a++)r+=del+f[a];
  return r;
};
//------------------------------------------------------------------------------
sysutils.isDate = function(d, f){ // returns false if not a date or returns the date as a Date object
  // find the delimiter used (note: only one can be used at a time!!)
  if(d !== d.toString())return d;
  d       = String(d).trim();
  f       = domapi.rVal(f,sysutils.defaultDateMask);
  var del = null;
  if(f.indexOf("/")>-1)del = "/";else
  if(f.indexOf("-")>-1)del = "-";else
  if(f.indexOf(".")>-1)del = ".";
  if(!del)return false;
  //---------------
  f = f.split(del);
  d = d.split(del);
  if(d.length!=f.length)return false;
  var mo = null;var da = null; var yr = null;
  for(var a=0;a<f.length;a++){
    f[a] = f[a].toUpperCase().trim();
    if(d[a].trim() == "")return false;
    if(f[a].charAt(0)=="M")mo = sysutils.padZeros(d[a],f[a].length);
    if(f[a].charAt(0)=="D")da = sysutils.padZeros(d[a],f[a].length);
    if(f[a].charAt(0)=="Y")yr = parseInt(d[a]);
  }
  yr = sysutils.makeFourDigitYear(yr);
  //if(debugMode)dump_var([mo,da,yr]);
  if(!sysutils.isInteger(mo)||!sysutils.isInteger(da)||!sysutils.isInteger(yr))return false;  
  if((mo<1)||(mo>12))return false;
  if((da<1)||(da>sysutils.getMonthLength(mo-1,yr)))return false; // K. Alm
  
  mo = parseInt(mo,10)-1;
  da = parseInt(da,10);
  yr = parseInt(yr,10);
  if(yr < 1972)return false;
  return new Date(yr,mo,da);
};
//------------------------------------------------------------------------------
sysutils.getStartDay = function(m,y){ // returns day of week the first day of the month falls on
  var tempdate= new Date();
  tempdate.setDate(1);
  tempdate.setMonth(m);
  tempdate.setFullYear(y);
  return tempdate.getDay(); //0 to 6
};
//------------------------------------------------------------------------------
sysutils.getWeekOfMonth = function(m,d,y){
  var startDay = this.getStartDay(m,y);
  return parseInt((startDay + d - 1) / 7) + 1;
};
//------------------------------------------------------------------------------
sysutils.createDate = function(m,d,y){
  return new Date(parseInt(y,10),parseInt(m,10),parseInt(d,10));
};
//------------------------------------------------------------------------------
sysutils.daysSince = function(d1,d2){
  return Math.abs(Math.floor((d1 - d2)/86400000));
};
//------------------------------------------------------------------------------
sysutils.findFirstDay = function(n, d, m, y){
  // finds to nth day (d) in month and year - days are 0..6, s..s, month is 0..11
  var D = new Date(y, m, 1);
  D.setDate((7 * n) - 6 + (7 + d - D.getDay()) % 7);
  return D.getDate();
};
//------------------------------------------------------------------------------
// it is common in holiday calculations to know what days monday falls on
sysutils.nextMonday = function(d, m, y){
  var D = new Date(y, m, d).getDay();
  return +d + (D==0 ? +1 : D==6 ? +2 : 0);
};
//------------------------------------------------------------------------------
sysutils.easterSunday = function(y){ // returns [m,d]
  var AA = Math.floor(y / 100);
  var BB = AA - Math.floor(AA / 4);
  var CC = y % 19;
  var DD =
    (15 + 19*CC + BB - Math.floor((AA + 1 - Math.floor((AA+8) / 25)) / 3)) % 30;
  var EE = DD - Math.floor((CC+11*DD) / 319);
  var S = 22 + EE + (140004 - (y + Math.floor(y / 4))%7 + BB - EE) % 7;
  if(S > 31)
    return[3, S - 31];
  else
    return[2, S];
};
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// utility functions 
//------------------------------------------------------------------------------
sysutils.removeTags = function(s, intWorkFlow){ // Jóhann Haukur Gunnarsson joi@innn.is
  // TODO - verify conversion and test output
  var result    = s;
  var re        = new RegExp();
  re.ignoreCase = true;
  re.global     = true;
  if(intWorkFlow != 1){
    re.Pattern = "<[^>]*>";
    result     = re.Replace(result, "");
  }
	if(intWorkFlow > 0 && intWorkFlow < 3){
    re.Pattern = "[<]";
    result     = re.Replace(result, "<");
    re.Pattern = "[>]";
    result     = re.Replace(result, ">");
  }
  re = null;
  return result;
};
//------------------------------------------------------------------------------