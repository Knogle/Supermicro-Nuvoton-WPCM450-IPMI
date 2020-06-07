//------------------------------------------------------------------------------
// DomAPI domapi cookie routines
// D. Kadrioski 2/1/2002
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
domapi.loadUnit("sysutils");

function Cookie(){
  this.name  = "";
  this.value = "";
};
//------------------------------------------------------------------------------
domapi.cookies = [];  // an array of Cookies
domapi.cookies.loaded = false;
//------------------------------------------------------------------------------
domapi.cookies.getValue=function(name,def){
  if(!this.loaded)this.load();
  var i=this.indexOf(name);
  if(i==-1)return def; else return this[i].value;
};
//------------------------------------------------------------------------------
domapi.cookies.setValue=function(name,value,mins,path){ // Simon added 'path'
  if(!this.loaded)this.load();
  var i         = this.indexOf(name);
  if(i==-1)i    = this.length;
  this[i]       = new Cookie();
  this[i].name  = sysutils.trim(name);
  this[i].value = escape(value);
  //-----
  mins=mins?mins:40320; // default is 28 days
  var expires = new Date(sysutils.now().getTime() + mins * 60 * 1000);
  document.cookie=this[i].name+"="+this[i].value+"; expires=" + expires.toGMTString() + ((path)?"; path="+path:"");
};
//------------------------------------------------------------------------------
domapi.cookies.deleteValue=function(name){
  if(!this.loaded)this.load();
  var i=this.indexOf(name);
  if(i>-1)this.setValue(name,null,-1440); // expired one day ago
};
//------------------------------------------------------------------------------
domapi.cookies.indexOf=function(name){
  for(var a=0;a<this.length;a++)
    if(sysutils.trim(this[a].name.toUpperCase())==sysutils.trim(name.toUpperCase()))return a;
  return -1;
};
//------------------------------------------------------------------------------
domapi.cookies.load=function(){
  this.loaded = true;
  var temp,a;
  this.length = 0;
  var list    = sysutils.trim(document.cookie);
  if(list=="")  return;
  list        = list.split("; ");
  for(a=0;a<list.length;a++){
    temp          = list[a].split("=");
    this[a]       = new Cookie;
    this[a].name  = sysutils.trim(temp[0]);
    this[a].value = unescape(temp[1]);
  }
};
//------------------------------------------------------------------------------
domapi.cookies.dump=function(){
	var r = "";
	r += "STORED VALUES\n";
	r += "==============================\n";
	for(var i=0;i<this.length;i++){
		r += this[i].name + " = " + this[i].value + "\n";
	}
	r += "\n";
	r += "RAW\n";
	r += "==============================\n";
	r += document.cookie;
	return r;
};
//------------------------------------------------------------------------------