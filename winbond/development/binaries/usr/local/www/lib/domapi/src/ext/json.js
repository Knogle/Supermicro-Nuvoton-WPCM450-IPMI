//------------------------------------------------------------------------------
// DomAPI JSON Routines
// D. Kadrioski 9/27/2003
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
// See http://json.org for originator and info
// function jsonToString() adapted from stringify() at http://json.org
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.urlToJson = function(url){
  return domapi.stringToJson(domapi.getContent(url));
};
//------------------------------------------------------------------------------
domapi.stringToJson = function(s){
  try{
    s = "this.__r = " + s;
    eval(s);
    return this["__r"];
  }catch(e){
    throw new Error(domapi.getString("ERR_EVAL_JSON") + e.message);
    return {};
  }  
};
//------------------------------------------------------------------------------
domapi.jsonToString = function(arg){
  function isUndefined(a){
    return typeof a == 'undefined';
  };
  //------
  function quote(s){
    var r = s;
    var R = new RegExp('"',"g");
    return '"' + r.replace(R,'\\"') + '"';
  };
  //------
  var i, o, v;
  switch(typeof arg){
    case 'object':
      if(arg){
        if(arg.constructor == Array){
          o = '[';
          for(i = 0; i < arg.length; ++i){
            v = domapi.jsonToString(arg[i]);
            if (v != 'function' && !isUndefined(v))
              o += (o != '[' ? ',' : '') + v;
            else
              o += ',';
          }
          return o + ']';
        }else if(typeof arg.toString != 'undefined'){
          if(arg.toJsonString) return arg.toJsonString();
          o = '{';
          for (i in arg){
            v = domapi.jsonToString(arg[i]);
            if (v != 'function' && !isUndefined(v))
              o += (o != '{' ? ',' : '') + quote(i) + ':' + v;
          }
          return o + '}';
        } else return;
      }
      return 'null';
    case 'unknown'   :
    case 'undefined' : return;
    case 'string'    : return quote(arg);
    case 'function'  : return 'function';
    default          : return String(arg);
  }
};
//------------------------------------------------------------------------------
domapi.jsonToXml = function(arg,nm,pretty){
  domapi._prettyXmlDepth = 0;
  return domapi._jsonToXml(arg,nm,'',pretty);
};
//------------------------------------------------------------------------------
domapi._jsonToXml = function(arg,nm,pnm,pretty){
  function isUndefined(a){
    return typeof a == 'undefined';
  };
  //------
  function quote(s){
    var r = String(s);
    var R = new RegExp('"',"g");
    return '"' + r.replace(R,'\\"') + '"';
  };
  function notags(s){
    var r = String(s);
    var R1 = new RegExp('<',"g");
    var R2 = new RegExp('>',"g");
    return r.replace(R1,'&lt;').replace(R2,'&gt;');
  };
  function hasSubObjects(O){
    var r = 0;
    for(var i in O)if(typeof O[i] == 'object')r++;
    return r>0;
  };
  function indent(){
    var r='';
    for(i=0;i<domapi._prettyXmlDepth;i++)r += "  ";
    return r;
  };
  //------
  var i, o, v, hso;
  var br = pretty?"\n":"";
  // if name is a numeric index and parent name appears to be plural, replace with its singular
  if(nm == parseInt(nm,10))
    if((pnm.length) && (pnm.charAt(pnm.length-1).toUpperCase() == 'S'))
      nm = pnm.substring(0,pnm.length-1);
    else nm = 'Node' + nm;
  switch(typeof arg){
    case 'object':
      if(arg){
        if(typeof arg.toString != 'undefined'){
          hso = hasSubObjects(arg);
          o = '';
          if(pretty)o += indent();
          o += '<' + nm;
          for (i in arg){  // first process primitives, include as attributes
            switch(typeof arg[i]){
              case 'unknown'   :
              case 'undefined' : 
              case 'function'  :
              case 'object'    : break;
              case 'string'    :
              default          : o += " " + i + '=' + notags(quote(arg[i]));break;
            }
          }
          if(hso){
            o += ">"+br;
            // now process sub objects
            for (i in arg){
              if(typeof arg[i] == 'object'){
                domapi._prettyXmlDepth++;
                o += domapi._jsonToXml(arg[i],i,nm,pretty);
              }
            }
            o += (pretty?indent():"") + '</'+nm+'>'+br;
            domapi._prettyXmlDepth--;
            return o;
          }else{
            domapi._prettyXmlDepth--;
            return o + ' />'+br;
          }
        }else{
          domapi._prettyXmlDepth--;
          return;
        }
      }
      return 'null';
      domapi._prettyXmlDepth--;
  }
};
//------------------------------------------------------------------------------
domapi.xmlUrlToJson = function(url, nodeNm){ // requires the xmlcore.js unit
  var xmlObj   = domapi.xml.getDomDocument();
  xmlObj.async = false;
  xmlObj.load(   url);  
  return domapi.xmlToJson(xmlObj, nodeNm);
};
//------------------------------------------------------------------------------
domapi.xmlToJson = function(xmlObj, nodeNm){ // requires the xmlcore.js unit
  var C = xmlObj.documentElement.selectNodes("//" + nodeNm);
  if(C.length != 1){
    throw new Error(domapi.formatGetString('ERR_MISSING_XML_ROOT', [nodeNm]));
    return {};
  }
  return domapi.xmlNodeToJson(C[0]);
};
//------------------------------------------------------------------------------
domapi.xmlNodeToJson = function(N){ // requires the xmlcore.js unit
  var i, j, R, C;
  C = N.childNodes;
  R = {};
  domapi.xml.applyAttributes(N, R);
  for(i=0;i<C.length;i++){
    if(C[i].nodeType != 1)continue;//dump(C[i].nodeName)
    if(!C[i].childNodes.length)
      R[C[i].nodeName] = domapi.xmlNodeToJson(C[i]);
    else{
      R[C[i].nodeName] = [];
      for(j=0;j<C[i].childNodes.length;j++)
        if(C[i].childNodes[j].nodeType == 1)
          R[C[i].nodeName].push(domapi.xmlNodeToJson(C[i].childNodes[j]));
    }
  }
  //-------
  return R;
};
//------------------------------------------------------------------------------