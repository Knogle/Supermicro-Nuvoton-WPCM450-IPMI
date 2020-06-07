//------------------------------------------------------------------------------
// DomAPI domapi routines (debug)
// D. Kadrioski 3/1/2001
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------
// Additional Contributors include: 
// S. Gilligan <simon.gilligan@level11.com.au>
//------------------------------------------------------------------------------

domapi.loadUnit("cookie");
domapi.loadUnit("more_css");
domapi.debug = {
  _window         : null,
  _propWin        : null,
  _consoleMain    : null,
  _debugstack     : null,
  _dumpstack      : [],
  _dumppropstack  : null,
  _prevdebugstack : null,
  _profileStartTime : null,
  _orgPropObj     : null,
  _baseDiv        : [],
  _baseElm        : [],
  _baseComp       : [],
  _basesBuilt     : false,
  _doDiv          : true,
  _doElm          : true,
  _doComp         : true
};
//------------------------------------------------------------------------------
// public members
//------------------------------------------------------------------------------
domapi.debug.bringUpConsole = function(){
  if(this._window==null || this._window.closed){
    var x = 0; var y = 0; var w = 450; var h = 800;
    try{
      var lastWindowPos = domapi.cookies.getValue("da_debug_propsPos",false);
    }catch(E){
      var lastWindowPos = null;
    }
    if (lastWindowPos){
      lastWindowPos = lastWindowPos.split(",");
      x = lastWindowPos[0];
      y = lastWindowPos[1];
      w = lastWindowPos[2];
      h = lastWindowPos[3];
    }
    this._window = open(domapi.libPath + "debug/debugger.htm", "_consoleWin", "width="+ w +",height="+ h +",left="+ x +",top="+ y +",screenX="+ x +",screenY="+ y +",scrollbars=yes,resizable=yes");
    if(this._window)
      this._window.onunload = function(){
        if(typeof domapi == "undefined")return;
        var W = domapi.debug._window;
        if(W  && !W.closed ){    
          var lastWindowPos = [
            (document.all?W.screenLeft:W.screenX), 
            (document.all?W.screenTop :W.screenY), 
            (document.all?W.document.body.clientWidth :W.innerWidth ),
            (document.all?W.document.body.clientHeight:W.innerHeight)
          ];
          domapi.cookies.setValue("da_debug_propsPos",lastWindowPos.join(",")); 
        }
      };
  }
};
//------------------------------------------------------------------------------
domapi.debug.clearConsole = function(b){
  if(this._window && !this._window.closed)
    this._consoleMain.innerHTML = "";
  if(b)this.dumpVar("Ready.");
};
//------------------------------------------------------------------------------
domapi.debug.closeConsole = function(){
  var W = this._window;
  if(W && !W.closed ){
    var lastWindowPos = [
      (document.all?W.screenLeft:W.screenX),
      (document.all?W.screenTop :W.screenY),
      (document.all?W.document.body.clientWidth :W.innerWidth ),
      (document.all?W.document.body.clientHeight:W.innerHeight)
    ];
    domapi.cookies.setValue("da_debug_consolePos",lastWindowPos.join(","));
    W.close();
  }
};
//------------------------------------------------------------------------------
domapi.debug.dump = function(obj,dump){ 
  // sometimes NS won't dumpProps an object, especially Events.  This method can
  // get around it.  Pass true for dump to have it go straight to the debug window
  // otherwise it returns you a string suitable for alerting
  var mem = [];
  for(var a in obj)
    //try{mem.push("<b>"+a+"</b>="+obj[a]);}catch(e){} //some members might be protected
    mem.push("<b>"+a+"</b>="+obj[a]);
  mem.sort();
  if(dump)
    this.dumpVar(mem.toString().replace(new RegExp("\\,", "g"),"<br />"));
  mem = mem.toString().replace(new RegExp("\\,", "g"),"\n");
  return mem;
};
//------------------------------------------------------------------------------
domapi.debug.dumpVar = function(s,b){
  this.bringUpConsole();
  if(this._consoleMain){
    this._dumpVar(s,b);
    domapi.debug._window.doTabClick(0);
  }else{
    this._dumpstack.push(s);//'domapi.debug._dumpVar(domapi.debug._dumpvarstack);';//domapi.debug._window.doTabClick(0)';
//    this._dumpvarstack = s;
  }
};
dump = domapi.dump = function(v){domapi.debug.dumpVar(v)}; // for lazy typers, like me
//------------------------------------------------------------------------------
domapi.debug.dumpProps = function(obj){
  this.bringUpConsole();
  if(this._explorerMain){
    this._dumpProps(obj);
    domapi.debug._window.doTabClick(1);
  }else{
    this._dumppropstack = 'domapi.debug._dumpProps(domapi.debug._dumpvarstack);domapi.debug._window.doTabClick(1)';
    this._dumpvarstack  = obj;
  }
};
dumpProps = domapi.dumpProps = function(obj){domapi.debug.dumpProps(obj);};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi.debug._onload = function(){
  if(this._dumppropstack)eval(this._dumppropstack);
  this._dumppropstack = null;

  if(this._dumpstack.length > 0){
    var s = "";
    for(var i=0;i<this._dumpstack.length;i++)
      s += "]" + this._dumpstack[i] + "<br />";
    if(s.length)s = s.slice(1);
    this._dumpVar(s);
    this._dumpstack = [];
    domapi.debug._window.doTabClick(0);
  }
  if(this._window && this._window.onresize)this._window.onresize();
};
//------------------------------------------------------------------------------
domapi.debug._dumpVar = function(s,b){
  var W = this._consoleMain;
  if(!W)return;
  W.innerHTML += "]" + s + "<br />"; 
  var h = W.scrollHeight;
  W.scrollTop = h;
  if(b)this._dumpVar("Ready.");
  if(this._window && this._window.onresize)this._window.onresize();
};
//------------------------------------------------------------------------------
domapi.debug._dumpProps = function(obj){
  if(!obj)return;
  var W = this._window;
  try{
    obj.copyright = domapi.copyright;
  }catch(E){} // some objects are read-only
  if(this._orgPropObj==null)this._orgPropObj = obj;

  var filters = domapi.cookies.getValue("da_debug_propsFilters","true,true,true");
  filters = filters.split("c");
  this._doDiv  = filters[0]=="true";
  this._doElm  = filters[1]=="true";
  this._doComp = filters[2]=="true";
  try{
    W.document.getElementById("divs").checked = this._doDiv;
    W.document.getElementById("elms").checked = this._doElm;
    W.document.getElementById("comp").checked = this._doComp;
  }catch(E){};


  this._buildBases();
  this._prevdebugstack = this._debugstack; // _debugstack is null first time through
  this._debugstack     = obj;
  this._dump_debug_bot();
};
//------------------------------------------------------------------------------
domapi.debug._buildBases = function(){
  if(this._basesBuilt)return;
  this.basesBuilt = true;

  d1 = document.createElement("DIV");
  for(var i in d1)this._baseDiv.push(i);
  this._baseDiv.sort();

  d2 = domapi.Elm();
  for(var i in d2)
    if(this._baseDiv.indexOf(i)==-1)this._baseElm.push(i);
  this._baseElm.sort();

  domapi.registerComponent("dummy");
  d2 = domapi.Component({x:0,y:0,w:1,h:1},"dummy",true);
  for(var i in d2)
    if((this._baseDiv.indexOf(i)==-1) && (this._baseElm.indexOf(i)==-1))
      this._baseComp.push(i);
  this._baseComp.sort();
};
//------------------------------------------------------------------------------
domapi.debug._viewBase = function(){
  var t,a,d;
  var W = this._window;
  this._doDiv  = W.document.getElementById("divs").checked;
  this._doElm  = W.document.getElementById("elms").checked;
  this._doComp = W.document.getElementById("comp").checked;
  var filters = [this._doDiv, this._doElm, this._doComp];
  domapi.cookies.setValue("da_debug_propsFilters",filters.join("c"));
  this._dumpProps(this._dumpvarstack);
};
//------------------------------------------------------------------------------
domapi.debug._propSelAll = function(f,b){
  f.divs.checked = b;
  f.elms.checked = b;
  f.comp.checked = b;
  this._viewBase(f);
};
//------------------------------------------------------------------------------
domapi.debug._dump_debug_bot = function(){
  var hasValues  = '<table cellpadding="0" cellspacing="0" border="0" id="has">';
  var noValues   = '<table cellpadding="0" cellspacing="0" border="0" id="hasnot">';
  var properties = [];
  var i, O, classname, text, display, isDiv, isElm, isComp;
  try{
    for(i in this._debugstack)
      try{
        properties.push(i);
      }catch(E){}
  }catch(E){}
  properties.sort();
  for(i=0;i<properties.length;i++){
    O = properties[i];
    //-------------------------------------
    isDiv  = domapi.debug._baseDiv.indexOf( O);
    isElm  = domapi.debug._baseElm.indexOf( O);
    isComp = domapi.debug._baseComp.indexOf(O);
    //-------------------------------------
         if(isDiv >-1 && !this._doDiv )display = "none";
    else if(isElm >-1 && !this._doElm )display = "none";
    else if(isComp>-1 && !this._doComp)display = "none";
    else display = "";
    //-------------------------------------
         if(isDiv >-1)classname = "isDiv";
    else if(isElm >-1)classname = "isElm";
    else if(isComp>-1)classname = "isComp";
    else classname = "";
    //-------------------------------------
    try{
      text = domapi.trim(String(this._debugstack[O]));
    }catch(E){}
    
    if(text != "" && text != "null"){
      text = this._htmlEscape(O, text);
      if(text.slice(0,8) == "function" || text.slice(0,9) == "[function"){
        text = '<a href="" title="Toggle display" onclick="_toggleDisplay(this.nextSibling);return false">function &#9660;</a>' +
               '<div style="display:none">' + text + '</div>';
      }      
      hasValues += '<tr class="' + classname + '" style="display:' + display + '"><th>' + O + 
                   '</th><td>' + text + '</td></tr>';
    }else
      noValues +=  '<tr class="' + classname + '" style="display:' + display + '"><th>' + O +
                   '</th><td>' + text + '&nbsp;</td></tr>';
  }
  hasValues += '</table>';
  noValues  += '</table>';
  var result = hasValues + '<hr /><h3 style="margin:0px">Empty Properties</h3>' + noValues;
  this._explorerMain.innerHTML = result;
};
//------------------------------------------------------------------------------
domapi.debug._htmlEscape = function(name,text){
  // makes property text safe for display
  // also link any child objects so we can drill down
  //if(name=="outerHTML" || name=="innerHTML")
  if(name != "copyright")
    text = text.replace(new RegExp("<","g"), "&lt;").replace(new RegExp(">","g"), "&gt;");
//dump(text.substr(0,8))  
  if((text.substr(0,7)=="[object") && isNaN(name))
    text = '<a href="#" title="Explore..." onclick="domapi.debug.dumpProps('+
           'domapi.debug._debugstack.'+name+')">'+text+' &#9654;</a>';
  else if(name != "copyright"){
    text = text.replace(new RegExp("\\n","g"), "<br />");
    text = text.replace(new RegExp("\\s", "g"), "&nbsp;");
  }
  return text;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// misc. routines
//------------------------------------------------------------------------------
// profiling 
// note, these are only simple functions for timing how long a piece of code
// takes to run.  For more advanced profiling, see S.Schwarz's profile unit 
// in /src (use domapi.loadUnit("profile") to include them on your page)
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.debug.startProfile = function(s,d){
  this._profileStartTime = new Date().getTime();
  if(d)this.dumpVar("Starting "+s);
};
//------------------------------------------------------------------------------
domapi.debug.endProfile = function(s,d,cont){
  this._profileStartTime = new Date().getTime() - this._profileStartTime;
  if(d)this.dumpVar("Ending "+s+" "+this._profileStartTime+" ms");
  if(cont)this.startProfile(s);
  if(!d)return this._profileStartTime;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// routines for dumping commonly needed runtime information (RTI)
//------------------------------------------------------------------------------
domapi.debug.showLibs = function(){
  function b(s){return '<b style="color:navy">' + s + "</b>"};
  domapi.debug.dumpVar('START "DUMP LOADED UNITS"');
  var src = [];
  var ext = [];
  var gui = [];
  var cr  = "<br>";
  var hr  = "]--------------------------" + cr;
  var tb  = "]&nbsp;&nbsp;&nbsp;";
  var t   = "";
  t += "--------------------------" + cr + "]Compression: "+b(domapi.compressed?"ON":"OFF") + cr;
  var l = domapi.libs;
  for(var a=0;a<l.length;a++)
    if(     l.coreDir.indexOf(l[a]) > -1)src[src.length]=l[a];
    else if(l.extDir.indexOf( l[a]) > -1)ext[ext.length]=l[a];
    else gui[gui.length]=l[a];

  if(src.length>0){ 
    t += hr + "]" + b("src/") + cr + hr;
    for(a=0;a<src.length;a++)t += tb + src[a] + cr;
  }

  if(ext.length>0){
    t += hr + "]" + b("src/ext/") + cr + hr;
    for(a=0;a<ext.length;a++)t += tb + ext[a] + cr;
  }

  if(gui.length>0){
    t += hr + "]" + b("src/gui/") + cr + hr;
    for(a=0;a<gui.length;a++)t += tb + gui[a] + cr;
  }

  t += hr + ']END "DUMP LOADED UNITS"' + cr + cr + "]Ready.";

  domapi.debug.dumpVar(t);
};
//------------------------------------------------------------------------------
domapi.debug.sniffy = function(){
  function b(s){if(s)return '<b style="color:navy">' + s + "</b>";return false};
  var c  = domapi;
  var d  = c.debug.dumpVar;
  var cr = "<br>";
  var s  = function(i){
    var r = "";
    for(var a=0;a<i;a++)r+="&nbsp;";
    return r;
  };
  var u = navigator.userAgent + '</span>';
  var t =
    cr+
    "]DomAPI sees your browser as follows:" + cr +
    "]" + cr +
    '<span style="white-space:nowrap">' +
    "]agent"    + s(3) + " = " + u                    + cr +
    "]Platform" + s(0) + " = " + b(c._pt[c.platform]) + cr +
    "]Browser"  + s(1) + " = " + b(c._bt[c.browser])  + cr +
    "]Major v"  + s(1) + ' = <b style="color:navy">'  + c.major + "</b>" + cr +
    "]Minor v"  + s(1) + ' = <b style="color:navy">'  + c.minor + "</b>" + cr +
    "]" + cr +
    "]Shortcuts:" + cr +
    "]isGecko"  + s(1) + " = " + b(c.isGecko)         + cr +
    "]isKHTML"  + s(1) + " = " + b(c.isKHTML)         + cr +
    "]isIE"     + s(4) + " = " + b(c.isIE)            + cr +
    "]isNS"     + s(4) + " = " + b(c.isNS)            + cr +
    "]isIEMac"  + s(1) + " = " + b(c.isIEMac)         + cr +
    "]isIE5Mac" + s(0) + " = " + b(c.isIE5Mac)        + cr + cr +
    "]Ready."  + cr;
  this.dumpVar(t);
};
//------------------------------------------------------------------------------
domapi.debug.dumpSource = function(e){
  // This proc was based off some code Brandon Burrell sent me.
  if(!e)e = document.body;
  var src;
  src = e.innerHTML;
  src = src.replace(new RegExp("<", "ig"),       '&lt;');
  src = src.replace(new RegExp(">", "ig"),       '&gt;');
  src = src.replace(new RegExp("\\x0d\\x0a", "ig"),'<br />');
  src = src.replace(new RegExp("&gt;&lt;(?!\\/script)", "gi"),'&gt;<br />&lt;');
  src = src.replace(new RegExp("(&lt;script[^&]*&gt;)([^&]*)(&lt;\\/script[^&]*&gt;)", "gi"),
    '<span style="color:maroon">$1</span><span style="color:blue">$2</span><span style="color:maroon">$3</span>');
  src = '<pre style="font-size:8pt">' + src + '<\/pre>';

  if(this._winDump && !this._winDump.closed)this._winDump.close();
  this._winDump = window.open("","","height=600,width=1000,resizable=yes,scrollbars=yes");

  var t = 'True Source for ' + document.title;
  var tt = domapi.rVal(e.DA_TYPE, 'unknown');
  var s = 
    '<html><head>' +
    '<title>' + t + '<\/title>' +
    '<\/head><body style="font:9pt sans-serif;color:black;background-color:white">' +
    '<h2>' + t + '<\/h2>' +
    domapi.debug._dumpCSS() +
    '<hr />' +
    '<h3>' + t + ', including DHTML<\/h3><h4>Starting from ' + e.tagName + 
    ' [id =\'' + e.id + '\'] [DA_TYPE=\'' + tt +'\']</h4>' +
    '<p>'+src+'<\/p>' +
    '<\/body><\/html>';
  if(this._winDump){
    var d = this._winDump.document;
    d.open();
    d.write(s);
    d.close();
  }
};
domapi.dumpSource = function(e){domapi.debug.dumpSource(e)};
//------------------------------------------------------------------------------
domapi.debug._dumpCSS = function(sheet){
  sheet = domapi.rInt(sheet);
  var i, j, s;
  var desc = " for sheet " + sheet;
  domapi.css.process("111110"); // process styleSheet variable arrays
  s = '';
  s += '<h3>Selectors'+desc+'</h3><ol type="i">';
  for (var i=0;i<domapi.css.selectors[sheet].length;i++)
    s += '<li><a href="#da_css_'+i+'">'+domapi.css.selectors[sheet][i] + '</a></li>';
  s += '</ol><br /><hr noshade><br />';
  s += domapi.css.format[0];
  return s;
};
//------------------------------------------------------------------------------
domapi.debug.dumpCSS = function(sheet){
  var s = domapi.debug._dumpCSS(sheet);
  var t = 'True CSS for ' + document.title;
  var s = 
    '<html><head>' +
    '<title>' + t + '<\/title>' +
    '<\/head><body style="font:9pt sans-serif;color:black;background-color:white">' +
    '<p>'+s+'<\/p>' +
    '<\/body><\/html>';
  if(this._winDump && !this._winDump.closed)this._winDump.close();
  this._winDump = window.open("","","height=600,width=1000,resizable=yes,scrollbars=yes");
  if(this._winDump){
    var d = this._winDump.document;
    d.open();
    d.write(s);
    d.close();
  }
};
domapi.dumpCSS = function(i){domapi.debug.dumpCSS(i)};
//------------------------------------------------------------------------------
