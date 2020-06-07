//------------------------------------------------------------------------------
// DomAPI List Object
// D. Kadrioski 7/25/2002
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.List = function(){
  this.clear();
};
//------------------------------------------------------------------------------
domapi.List.prototype.getLength = function(){return this.names.length};
//------------------------------------------------------------------------------
domapi.List.prototype.clear = function(){
  this.names  = [];
  this.values = [];
};
//------------------------------------------------------------------------------
domapi.List.prototype.rPair = function(n,v){  
  // this ensures we get both a name and a value.  returns them both in an array.
  // if we only got the name, it's also used for the value, unless the one we got
  // has an equal sign in it, in which case we split it and return those.
  if(typeof v != "undefined")return [n,v]; // both are present
  var t = n.split("=");
  if(t.length!=2)return [n,n]; // only passed one
  return [t[0],t[1]];          // passed name=value
};
//------------------------------------------------------------------------------
domapi.List.prototype.add = function(n,v){
  var t = this.rPair(n,v);
  this.names.push( t[0]);
  this.values.push(t[1]);
};
//------------------------------------------------------------------------------
domapi.List.prototype.insert = function(i,n,v){
  var t = this.rPair(n,v);
  this.names.insert( i,t[0]);
  this.values.insert(i,t[1]);
};
//------------------------------------------------------------------------------
domapi.List.prototype.deleteItem = function(i){
  this.names.deleteItem( i);
  this.values.deleteItem(i);
};
//------------------------------------------------------------------------------
domapi.List.prototype.reverse = function(){
  this.names.reverse();
  this.values.reverse();
};
//------------------------------------------------------------------------------
domapi.List.prototype.swapItems = function(i,j){
  var t;
  t              = this.names[i];
  this.names[i]  = this.names[j];
  this.names[j]  = t;
  //-----
  t              = this.values[i];
  this.values[i] = this.values[j];
  this.values[j] = t;
};
//------------------------------------------------------------------------------
domapi.List.prototype.sortByName = function(){
  this._sort(0);
};
//------------------------------------------------------------------------------
domapi.List.prototype.sortByValue = function(){
  this._sort(1);
};
//------------------------------------------------------------------------------
domapi.List.prototype._sort = function(k){
  var b,n1,n2;
  for(var a=0;a<this.names.length-1;a++)
    for(b=a+1;b<this.names.length;b++){
      n1 = k?this.values[a]:this.names[a];
      n2 = k?this.values[b]:this.names[b];
      if(n1>n2)this.swapItems(a,b);
    }
};
//------------------------------------------------------------------------------
domapi.List.prototype.findNameByValue = function(s){
  var i = this.values.indexOf(s);
  return i==-1?null:this.names[i];
};
//------------------------------------------------------------------------------
domapi.List.prototype.findValueByName = function(s){
  var i = this.names.indexOf(s);
  return i==-1?null:this.values[i];
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// String Serialization
//------------------------------------------------------------------------------
domapi.List.prototype.loadFromString = function(s,d1,d2,append){
  d1 = domapi.rVal(d1,"\n");
  d2 = domapi.rVal(d2,"=" );
  var t;
  var lines = s.split(d1);
  if(!append)this.clear();
  for(var a=0;a<lines.length;a++){
    t = lines[a].split(d2);
    this.add(t[0],t[1]);
  };
};
//------------------------------------------------------------------------------
domapi.List.prototype.saveToString = function(d1,d2,doEscape){
  d1 = domapi.rVal(d1,"\n");
  d2 = domapi.rVal(d2,"=" );
  var r = "";
  for(var a=0;a<this.names.length;a++){
    if(r!="")r+=d1;
    r += 
      (doEscape?escape(this.names[a]):this.names[a])+
      d2+
      (doEscape?escape(this.values[a]):this.values[a]);
  }
  return r;
};
//------------------------------------------------------------------------------
domapi.List.prototype.saveToURL = function(d1,d2,doEscape){   // $custom: (cst) added function for rpc
  d1 = domapi.rVal(d1,"\n");
  d2 = domapi.rVal(d2,"=" );
  var r = "";
  for(var a=0;a<this.names.length;a++){
    if(r!="")r+=d1;
    r += 
      (doEscape?encodeURI(this.names[a]):this.names[a])+
      d2+
      (doEscape?encodeURI(this.values[a]):this.values[a]);
  }
  return r;
};
//------------------------------------------------------------------------------
domapi.List.prototype.toString = function(d1,d2,doEscape){
  return this.saveToString(d1,d2,doEscape);
};

//------------------------------------------------------------------------------
// <select> serialization
//------------------------------------------------------------------------------
domapi.List.prototype.saveToSelect = function(s,append){
  var o = s.options;
  if(!append)o.length = 0;
  var i = o.length;
  for(var a=0;a<this.names.length;a++){
    o[a+i] = new Option(this.names[a],this.values[a]);
  }
};
//------------------------------------------------------------------------------
domapi.List.prototype.loadFromSelect = function(s,append){
  if(!append)this.clear();
  var o = s.options;
  for(var a=0;a<s.length;a++)
    this.add(s[a].text,s[a].value);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// url param serialization
//------------------------------------------------------------------------------
domapi.List.prototype.loadFromURLParams = function(append){
  if(!append)this.clear();
  var s = location.search.split("?");
  if(s.length<2)return;
  var p = s[1].split("&");
  for(var a=0;a<p.length;a++)this.add(p[a]);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// form serialization
//------------------------------------------------------------------------------
domapi.List.prototype.loadFromForm = function(f,append){
  if(!append)this.clear();
  var e = f.elements;
  var b,o;
  for(var a=0;a<e.length;a++)
    if(e[a].name != null && e[a].name != ""){
      if(e[a].type.toUpperCase()=="SELECT"){
        o = e[a].options;
        for(var b=0;b<o.length;b++)
          if(o[b].selected)
            this.add(e[a].name,o[b].value);
      }else this.add(e[a].name,e[a].value);
    }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// xml serialization
//------------------------------------------------------------------------------
// EXTREMELY BETA!! Subject to change
//------------------------------------------------------------------------------
domapi.List.prototype.saveToXML = function(root,pretty){
  root = domapi.rVal(root,"List");
  pretty = pretty?"\n":"";
  var r = '<'+root+' length="'+this.names.length+'">'+pretty;
  for(var a=0;a<this.names.length;a++){
    r+= '<item>'+pretty+
        '<name>' +this.names[a] +'</name>'+pretty+
        '<value>'+this.values[a]+'</value>'+pretty+
        '</item>'+pretty;
  }
  return r+'</'+root+'>';
};
//------------------------------------------------------------------------------