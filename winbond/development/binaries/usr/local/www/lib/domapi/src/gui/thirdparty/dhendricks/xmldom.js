//------------------------------------------------------------------------------
// DomAPI xmlDOM, DomDocument, DOMNode and DOMIterator Objects
// Doug Hendricks
// (c) Active Group, Inc. 2004
//------------------------------------------------------------------------------
/*
  Super small/fast Non-Recursive DOM Parser - based on RegEx (Regular Expressions)
    
  Support all of W3C DOM Level 1 members plus some Level 2 members and most common
  Microsoft XML extensions.
  
  Current Limitations 
    Will only decode FROM 'UTF-8' if declared in the ProcessInstuct "<?xml encoding="utf-8" ?>
    Will only encode TO   'UTF-8' if the DOMDocument.encoding property is set to "utf-8" prior
       to calling the save method.
    
    Schema is NOT supported.
    
    Will parse the !DOCTYPE headers but, DTD's are NOT loaded, thus:
      1) the document will not be validated
      2) the notion of 'default' attribute values are not supported.
      3) Entities and Entity References are not supported at this time.
      4) Namespace support is limited to basic support for parsing of the Node.prefix property.
  
  //Events -------------------------------------------------------------------------------------  
  
   when the DOMDocuments parseWithEvents property is set to 'true' the following events
   are fired as each nodetype (only during parsing of the document) during a loadXML operation:
   
   simply set: xmldoc.parseWithEvents  = true;
               xmldoc.registerNodeHandler(1, myElementNodeHandler);
               xmldoc.registerNodeHandler(3, 'tree.loadTextNode(N)');
               xmldoc.loadXML(myXML);
               
  If the specified handler is a function the created node is passed as the first parameter
  of the function call.
    
    eg: myElementNodeHandler(N);
  
  You can then use the Nodes properties/methods to determine how the handle the incoming content.
      
  
  // DOMIterator ----------------------------------------------------------------------------------
  
  The DOMIterator object provides a linear structure for traversing XML documents
  without recursion.   It's easy to iterate tree structures with recursion, but costly. Avoiding 
  recursion saves valuable time.
  
  Iterator results (node lists) are live. Any changes to them are immediately reflect in the DOM tree.
  
  Since the Iterator and Node objects share the same interfaces, changes to the nodes referenced
  by the Iterator through other DOMNode methods are reflected in the Iterator references and visa versa.
  
  Custom Iterators can be created to support traversal of the tree at any level and for a specific 
  nodeType (Element is the default).
  
  For example, to Iterate all nodes of type CDATA:
  
      var domIter = new domapi.DOM.DOMIterator({node:mydoc.documentElement,nodeType:xmlntCdata,andChildren:true});
      for (var i=0; i<domIter.childNodes.length; i++) 
        with(domIter.childNodes[i]) dump([nodeName,nodeType]+ 'CDATA Contents:'+nodeValue());
          
      dump('All Done');
      
  One may also set the DOMDocument's documentIterator property prior to a load() or loadXML() operation
  and the Iterator is automatically refreshed once parsing is completed:
  
   To Iterate all nodes of type Comment throughout the tree after the load, use: 
   
      var domdoc = domapi.DOM.DOMDocument({uri:"tests/bin/xmlcore.xml',asynch:true, onreadystatechange : myStateChange,
                                                                       ondataavailable:myDataIsHere});
      if(domdoc){
        domdoc.documentIterator = new domapi.DOM.DOMIterator({node:domdoc.documentElement,
                                                      nodeType:xmlntComment,andChildren:true});
                                                      
        function myStateChange(state){
          if(state == xmlrsCompleted){ //display results.
            
            var node = this.documentIterator.nextNode();
            while(node){
              with(node) dump([nodeName,nodeType]+ ' Contents:'+nodeValue());
              node = this.documentIterator.nextNode();
              }
            dump(' Done.");     
            
         } else if(state == xmlrsFailure){        
                 dump(' Something is Wrong...");
                 
         } else  dump(' Still Loading...");
         
        };
  
        function myDataIsHere() { dump(' Download of ' + this.uri + ' is complete.');};
      
        domdoc.load();
      }
      
  Other methods that return Iterators:
    
    DOMDocument.getElementsByTagName(tagName); //Full DOM search where tagName = [sometext,'*']
    DOMNode.getElementsByTagName(tagName); //the nodes descendants only
  
  // XPath ------------------------------------------------------------------------------------------
  
  A subset of the XPath query specification is currently supported:
  
  var nodelist = node.selectNodes(query);
  
  where query = 
  
  //element                           Search from Document Root
  .//element                          Search from current Nodes children and grandchildren
  ./element                           Search current Nodes children 
  element/[@attribname]               Search current Nodes children where attribname is defined
  element/[@attribname = "value"]     Search current Nodes children where attribname = value
  //*[@name]                          Search all descendants where the 'name' attribute is defined.
  //bookstore/books[@price]/authors   Search for authors who want to make $$
  
  // Metrics ----------------------------------------------------------------------------------------
  
  parsing Metrics(Avg):   131k XML File(UTF-8 encoded)
  IE 6       ~ 10 secs
  Mozilla    < 2 secs
  FireFox    < 2 secs
  
  Asynch/Synchronous HttpRequests are supported for IE and Gecko Browsers.
  
  Node types supported:
    xmlntIterator  = 0; (Internal Use only)
    xmlntElement   = 1;
    xmlntAttrib    = 2;
    xmlntText      = 3;
    xmlntCdata     = 4;
    xmlntPI        = 7;
    xmlntComment   = 8;
    xmlntDocument  = 9;
    xmlntDocType   = 10;

*/
//------------------------------------------------------------------------------

if(!domapi.unitLoaded("thirdparty/dhendricks/httprequest") && !domapi.unitLoaded("httprequest"))
    domapi.loadUnit("thirdparty/dhendricks/httprequest");

String.prototype._repeat = function(num){
 if(!num || num <1)return '';
 var t=this;
 for(var i=1; i<num; i++) t += this;
 return t;
};

String.prototype._encoding = function(dtype,fn){
  if(!dtype || !this.length || typeof fn != 'function')return this;
  switch (dtype.toLowerCase()){
    case 'utf-8':
    case 'utf8':
     try{return fn(this,dtype);} catch(e){ 
      if(domapi.trace)dump(e.message);
      return this;};
     break;
    default: return this;
    }
};

String.prototype._prefix = function(delim){
 return this.indexOf(delim)>-1?this.split(delim)[0].trim():'';
};

String.prototype._suffix = function(delim){
 var d=this.indexOf(delim);
 return d>-1?this.substr(d+delim.length,this.length):'';
};


// node types

xmlntIterator  = 0;
xmlntElement   = 1;
xmlntAttrib    = 2;
xmlntText      = 3;
xmlntCdata     = 4;
xmlntEntityRef = 5;
xmlntEntity    = 6;
xmlntPI        = 7;
xmlntComment   = 8;
xmlntDocument  = 9;
xmlntDocType   = 10;
xmlntFragment  = 11;
xmlntNotation  = 12;

//------------------------------------------------------------------------------
// ready states
xmlrsNoInit    = 0;
xmlrsLoading   = 1;
xmlrsLoaded    = 2;
xmlrsInteractive = 3;
xmlrsCompleted  = 4;
xmlrsFailure    = 5;

//domapi.trace=true;
domapi.DOM={ancestor:domapi};

domapi.DOMImplementation = {};
var UTFdigits ="0123456789abcdef";
domapi.DOMImplementation.UTFhex = new Array( 256 );
for( var idx = 0; idx < 256; idx++ )
     domapi.DOMImplementation.UTFhex[ idx ] = "%" + UTFdigits.charAt( idx >> 4 ) + UTFdigits.charAt( idx & 0xf );

domapi.DOMImplementation.doLeveling = true;
domapi.DOMImplementation.hasFeature = function(feature,version){return true};
domapi.DOMImplementation._inherit = function(obj,dclass){
  var protos = domapi.DOM[dclass].prototype;
    
  try{ for(var a in protos)obj[a] = protos[a];
  
  }catch(E){alert("Error in domapi.DOMImplementation._inherit:\n\n" + E.message);}
  finally{obj.ancestor = dclass}
};
domapi.DOMImplementation.encode = function(s,dtype){
if(!dtype || !s.length)return this;
 
  switch (dtype.toLowerCase()){
   case 'utf-8':
   case 'utf8':
    if(encodeURIComponent){try{ return encodeURIComponent(s);} catch(e){
       if(domapi.trace)dump(e.message);
      }
    }
    
    var sbuf = '';
    var UTFhex = domapi.DOMImplementation.UTFhex;
    var len = s.length;
    var ch;
    var chre = new RegExp("[A-Za-z0-9-_.!~*'()]");
    
    for( var i = 0; i < len; i++ ) {
       ch = s.charAt(i);
       if( chre.test( ch ) ) {
           sbuf += ch;
       } else{
           var cc = s.charCodeAt(i);
           if (cc <= 0x007f) {          // other ASCII
                sbuf += UTFhex[cc];
           } else if (cc <= 0x07FF) {          // non-ASCII <= 0x7FF
                sbuf += UTFhex[0xc0 | (cc >> 6)]
                + UTFhex[0x80 | (cc & 0x3F)];
           } else {                         // 0x7FF < ch <= 0xFFFF
                sbuf += UTFhex[0xe0 | (cc >> 12)]
                     + UTFhex[0x80 | ((cc >> 6) & 0x3F)]
                     + UTFhex[0x80 | (cc & 0x3F)];
           }
       }
    }
    return "!"+sbuf;

    break;
    default: return s;
    }
};

domapi.DOMImplementation.decode = function(s,dtype){
  if(!dtype || !s.length)return s;
  switch (dtype.toLowerCase()){
    case 'utf-8':
    case 'utf8':
     try{return decodeURIComponent(s);} catch(e){ return s;};
     break;
    default: return this;
    }
};

//------------------------------------------------------------------------------
//DOM Level 2 function parameters ( namespaceURI, qualifiedName, doctype )

domapi.DOMImplementation.createDocument = function(args){
  
  var arg= args && typeof args =='object'?args:{};
  if(!arguments.length) return domapi.DOM.DOMDocument(arg);
  if(arguments[0])arg['namespaceURI' ]=arguments[0];
  if(arguments[1])arg['qualifiedName']=arguments[1];
  if(arguments[2])arg['doctype'      ]=arguments[2];
  
  return domapi.DOM.DOMDocument(arg);
  };
//------------------------------------------------------------------------------
domapi.DOMImplementation.viewNode = function(node,pretty){
  if(!node) return;
  return node.xml(pretty).replace(new RegExp("\\&", "g"), "&amp;").replace(new RegExp("\\<", "g"), "&lt;").replace(new RegExp("\\>", "g"), "&gt;").replace(new RegExp("\\t", "g"), "&nbsp;&nbsp;&nbsp;").replace(new RegExp("\\n", "g"), "<br />");
};

//------------------------------------------------------------------------------
domapi.DOMImplementation.create = domapi.DOMImplementation.createDocument;
domapi.DOM.DOMDocument = function(arg){return domapi.DOM.DOMDocument.constructor(arg)};
domapi.DOM.DOMDocument.constructor = function(arg){
  var D={};
  
  for(var i in arg)D[i] = arg[i];
  
  D.documentElement = null;
  D.doctype         = domapi.rVal(arg['doctype'],null);;
  D.ownerDocument   = D;
  D.childNodes      = new Array();
  D.parentNode      = null;
  D.length          = D.childNodes.length;
  D.encoding        =  domapi.rVal(arg['encoding'],null);
  D.parsedEncoding  = null;
  D.namespaces      =  [];
  D.preserveWhiteSpace = domapi.rBool(arg['preserveWhiteSpace'],false);
  D.uri             =  domapi.rVal(arg['uri'],'');
  D.asynch          =  domapi.rBool(arg['asynch'],false);
  D.parseError      = {reason:'',errorCode:0,url:'',line:'',linepos:0,filepos:0}; //TODO
  D.doDebug         = domapi.rBool(arg["doDebug"],false);
  D.nodeType        = xmlntDocument;
  D.readyState      = xmlrsNoInit;
  D.documentIterator  =  null;
  D.implementation  = domapi.DOMImplementation;
  D.resolveExternals = false;
  D.schemas         = null;
  D.SelectionLanguage='XPath';
  D.noCache         = domapi.rBool(arg["noCache"],false);
  D.ondataavailable = domapi.rVal(arg['ondataavailable'],function(){});
  D.onreadystatechange = domapi.rVal(arg['onreadystatechange'],function(){}); //if(domapi.trace)dump(this.toString()+'.onreadystatechange() readyState='+this.readyState);};
  
  D.parseWithEvents = domapi.rBool(arg['parseWithEvents'],false);
  D.validateOnParse = false;
  //character encoding handlers
  D.encodeFN = domapi.rVal(arg['encodeFN'],domapi.DOMImplementation.encode);
  D.decodeFN = domapi.rVal(arg['decodeFN'],domapi.DOMImplementation.decode);
  
  D._id              = domapi.guid();
  D._HTTP            = null;
  D._abort          = false;
  D._xml            =  '';
  D._parsed         =  false;
  D._inParse        =  false;
  D._level          = 0;
  D._index          = 0;
  D._nodeHandlers   = {};  
  
  D.implementation._inherit(D,'DOMNode'); //inherit DOMNode Interface 
  D.implementation._inherit(D,'DOMDocument'); //inherit DOMNode Interface
  D.formatParseError = function(){
    return "" +
      "reason:"    + this.parseError.reason    + "\n" +
      "errorCode:" + this.parseError.errorCode + "\n" +
      "url:"       + this.parseError.url       + "\n" +
      "line:"      + this.parseError.line      + "\n" +
      "linepos:"   + this.parseError.linepos   + "\n" +
      "filepos:"   + this.parseError.filepos;
  };
  
  return D;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// DOMDocument object
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.abort = function() {this._abort=true;};
domapi.DOM.DOMDocument.prototype.setProperty = function(prop,val) {if(prop)this[prop] = val;};
domapi.DOM.DOMDocument.prototype.getProperty = function(prop) {return prop && this[prop]?this[prop]:null;};
domapi.DOM.DOMDocument.prototype.text = function() {
  return this.documentElement?this.documentElement.text():"";
};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.createElement = function(name){return domapi.DOM.DOMNode({nodeType:xmlntElement,tagName:name?name:'Element'});};
domapi.DOM.DOMDocument.prototype.createDocumentFragment = function(){return domapi.DOM.DOMNode({nodeType:xmlntFragment});};
domapi.DOM.DOMDocument.prototype.createTextNode = function(data){return domapi.DOM.DOMNode({nodeType:xmlntText,data:data});};
domapi.DOM.DOMDocument.prototype.createComment = function(data){return  domapi.DOM.DOMNode({nodeType:xmlntComment,data:data});};
domapi.DOM.DOMDocument.prototype.createCDATASection = function(data){return  domapi.DOM.DOMNode({nodeType:xmlntCdata,data:data});};
domapi.DOM.DOMDocument.prototype.createProcessingInstruction = function(target,data){return  domapi.DOM.DOMNode({nodeType:xmlntPI,tagName:target,data:data});};
domapi.DOM.DOMDocument.prototype.createAttribute = function(name){return new domapi.DOM.DOMAttribute({name:name});};
domapi.DOM.DOMDocument.prototype.createEntityReference = function(name){return domapi.DOM.DOMNode({nodeType:xmlntEntityRef,tagName:target});};
//------------------------------------------------------------------------------

domapi.DOM.DOMDocument.prototype.importNode = function(inNode,deep){
  var node = domapi.DOM.DOMNode({nodeType:inNode.nodeType,
     attributes:inNode.nodeType==xmlntElement?inNode.attributeString:'',
     ownerDocument:this,
     parentNode:null,
     data:inNode.getValue(),
     tagName:inNode.tagName,
     prefix:inNode.prefix
     });
  if(node && deep && inNode.hasChildNodes()){
    with(inNode){
     for (var i=0; i<childNodes.length; i++)
        node._addNode(childNodes[i].cloneNode(deep));
    }
  }
  return node;
};

domapi.DOM.DOMDocument.prototype._onerror = function(LE){
   with(this){
   if (doDebug)dump(this.toString()+' '+LE );
   _abort = true;
   readyState = xmlrsFailure;
   parseError.reason = LE;
   parseError.errorCode=(_HTTP)?_HTTP.status:0;
   parseError.url=uri;
   if(onreadystatechange) try{onreadystatechange();}catch(e){}
   
   }
};
domapi.DOM.DOMDocument.prototype._ontimeout = function(){
   if(this.doDebug)dump(this.toString()+' timed out! ' );
};

domapi.DOM.DOMDocument.prototype._onreceive = function(statuscode){ 
   with(this._HTTP){
   if (this.doDebug)
      dump(this.toString()+' .onreceive('+statuscode+') : ' + [responseText.length,status,statusText]);
      
    
    if(readyState == httprsCompleted){
      switch(parseInt(statuscode)){
       case 0:
        if(!responseText.length) break; //maybe local file system
       case 200:
        
       this.loadXML(responseText.replace(new RegExp("[\\r\\n]+", "g")," ")); 
       break;
      default:
       
      }
     }
   }
};
//-- Handle ABORT process ------------------------------------------------------
domapi.DOM.DOMDocument.prototype._HTTPstatechange = function(state){ 
with(this){ 
   if (this.doDebug)dump(this.toString()+'._HTTPstatechange('+state+') ' +_HTTP.status);
   
   if(_abort && !_HTTP._aborted)_HTTP.abort();
    
   }
   return true;
};   

//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.load = function(sURI,bAsynch,userName,password){
  
  bAsynch = domapi.rBool(bAsynch,this.asynch);
  this.clear();
  if(this._HTTP==null)
     this._HTTP = domapi.Httprequest({ontimeout:{obj:this,fn:this._ontimeout},
       onreceive:{obj:this,fn:this._onreceive },
       onerror:{obj:this,fn:this._onerror},
       onreadystatechange:{obj:this,fn:this._HTTPstatechange },
       asynch:bAsynch,
       noCache:this.noCache,doDebug:this.doDebug});
  
  if(this._HTTP == null)return false;
  
  this._abort = false;
  
  this.uri = domapi.rVal(sURI,this.uri);
  if(!this.uri.length)return false;
  if(this.doDebug)dump(this.toString()+'.load('+[this.uri,bAsynch]+')');
  this.readyState = xmlrsLoading;
  try{
    this.onreadystatechange();
  }catch(E){alert("Error in onreadystatechange:\n\n" + E.message)}
    
  with(this._HTTP){
      //mimeTypeOverride ="text/xml";
   try{
     getContent(this.uri, bAsynch,userName,password);
   }catch(E){alert("Error in getContent:\n\n" + E.message)}
 }     
   return true;
   
};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.registerNodeHandler = function(nodeType,fn) {
if(!this._nodeHandlers)this._nodeHandlers={};
 this._nodeHandlers[nodeType] = fn;
 return true; 
 
};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.unRegisterNodeHandler = function(nodeType) {
if(!this._nodeHandlers)return false;
 with(this){
   if(_nodeHandlers[nodeType]){
      delete _nodeHandlers[nodeType];
      return true;
   }else return false;
  }
};


//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.asString = function(pretty) {
 return this.xml(pretty).replace(new RegExp("\\&", "g"), "&amp;").replace(new RegExp("\\<", "g"), "&lt;").replace(new RegExp("\\>", "g"), "&gt;").replace(new RegExp("\\t", "g"), "&nbsp;&nbsp;&nbsp;").replace(new RegExp("\\n", "g"), "<br />");
};

//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.loadXML = function(strin){
  if(domapi.trace)dump(this.toString()+'.loadXML()');
  with(this){
    try{
      _xml = strin;
      if(_xml.length){
         readyState = xmlrsLoaded;
         if(ondataavailable)ondataavailable();
         if(onreadystatechange)onreadystatechange();
         readyState = xmlrsInteractive;
         if(onreadystatechange)onreadystatechange();
         readyState = _parse()?xmlrsCompleted:xmlrsFailure;
      } else readyState=xmlrsCompleted;
      if(readyState == xmlrsFailure){
        this.parseError.reason = "failed parse() -" + this.reason + "- in loadXML('" + this.asString(strin) + "')";
      }
      if(onreadystatechange)onreadystatechange();
    }catch(e){
      readyState = xmlrsFailure;
      parseError.reason = e.message;
      if(domapi.trace)dump('onreadystatechange event Error:'+e.message);
      if(onreadystatechange) try{onreadystatechange();}catch(e){}
    }
    return (readyState==xmlrsCompleted);
  }
};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.reset = function(){
 
 this.clear();
 this.uri              = '';
 this.readyState    =xmlrsNoInit;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.clear = function(){
  this.documentElement  = null;
  this.documentIterator =  null;
  this.doctype          =  null;
  this.childNodes       = [];
  this.namespaces       = [];
  this.length           = 0;
  this._xml             = '';
  
  this._parsed          = false;
};
//------------------------------------------------------------------------------
//domapi.DOM.DOMDocument.prototype.getElementsByTagName= function(tagName){return new domapi.DOM.DOMIterator({nodeType:xmlntElement,node:this,filter:tagName,andChildren:true});};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.toString = function(){return "[object DOMDocument]";};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.viewIt = function() {
  // as DOMDoc
  return this.xml().replace(new RegExp("\\&","g"), "&amp;").replace(new RegExp("\\<","g"), "&lt;").replace(new RegExp("\\>","g"), "&gt;").replace(new RegExp("\\t","g"), "&nbsp;&nbsp;&nbsp;").replace(new RegExp("\\n","g"), "<br />")+'DONE';
};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype.assert = function(){};
//------------------------------------------------------------------------------
domapi.DOM.DOMDocument.prototype._parse = function(){
if(domapi.trace)dump(this.toString()+'._parse()'+this.readyState);
this._parsed = this._abort = false;
this._inParse       = true;
var reTag = new RegExp("<([^>/ ]*)([^>]*)>","g"); // matches that tag name $1 and attribute string $2
var reTagText = new RegExp("<([^>/ ]*)([^>]*)>([^<]*)","g"); // matches tag name $1, attribute string $2, and text $3
var elmType = 0;
var docencoding = null;
var strTag = "";
var strText = "";
var strAttributes = "";
var strOpen = "";
var strClose = "";
var iElements = 0;
var xmleLastElement = this;
if(this._xml.length == 0){
  this.reason = "zero length";
  return false;
}
if(domapi.trace)dump( 'start: '+new Date());
var arrElementsUnparsed = this._xml.match(reTag);
var arrElementsUnparsedText = this._xml.match(reTagText);
var i=0;
if (arrElementsUnparsed[i].replace(reTag, "$1") == "?xml"){ //parse the encoding=""
  this._addNode( domapi.DOM.DOMNode({nodeType:xmlntPI,
  parentNode:this,
  tagName:arrElementsUnparsed[i].replace(reTag,"$1").replace('?',''),
  attributes:arrElementsUnparsed[i].replace(reTag,"$2"),
  ownerDocument:this}));
  docencoding  = null; 
  i++;
} 
if (arrElementsUnparsed[i].replace(reTag, "$1") == "!DOCTYPE"){ //parse the doctype
  this.doctype =  domapi.DOM.DOMNode({nodeType:xmlntDocType,
    parentNode:null,
    tagName:arrElementsUnparsedText[i].split(' ')[1],
    data:arrElementsUnparsed[i].replace(reTag,"$2"),
   ownerDocument:this});
   if(this.doctype)this._addNode(this.doctype);
   i++;
}
try{
for (; i<arrElementsUnparsed.length; i++) {
        if(this._abort){break;}
        strTag = arrElementsUnparsed[i].replace(reTag,"$1");
        strAttributes = arrElementsUnparsed[i].replace(reTag,"$2");
        strText = arrElementsUnparsedText[i].replace(reTagText,"$3").replace(new RegExp("[\\r\\n\\t ]+","g"), " "); 
        strClose = "";
        
        if (strTag.indexOf("![CDATA[") == 0) {
                strOpen = "<![CDATA[";
                strClose = "]]>";
                elmType = xmlntCdata;
        } else if (strTag.indexOf("!--") == 0) {
                strOpen = "<!--";
                strClose = "-->";
                elmType = xmlntComment;
        } else if (strTag.indexOf("?") == 0) {
                strTag = strTag.replace('?','');
                strOpen = "<?";
                strClose = "?>";
                elmType = xmlntPI;
        
        } else elmType = xmlntElement;
        
        var nodeparms = {nodeType:elmType,
        ownerDocument:this,
        tagName:strTag,
        attributes:strAttributes,
        parentNode:null,
        data:'',
        encoding:docencoding};
        
        if (strClose != "") {
                strText = "";
                if (arrElementsUnparsedText[i].indexOf(strClose) > -1) strText = arrElementsUnparsedText[i].trim();
                else {
                  for (; i<arrElementsUnparsed.length && arrElementsUnparsedText[i].indexOf(strClose) == -1; i++) {
                     strText += arrElementsUnparsedText[i].trim();
                  }
                  strText += arrElementsUnparsedText[i].trim();
                }
                
                if (strText.substring(strOpen.length, strText.indexOf(strClose)).trim() != "") {
                  with(nodeparms){data=strText.substring(strOpen.length, strText.indexOf(strClose));
                  
                  }
                  xmleLastElement.appendChild( domapi.DOM.DOMNode(nodeparms));
                }
                
                if (strText.indexOf(strClose)+ strClose.length < strText.length) {
                  with(nodeparms){nodeType=xmlntText;data=strText.substring(strText.indexOf(strClose)+ strClose.length, strText.length);}
                  xmleLastElement.appendChild( domapi.DOM.DOMNode(nodeparms));
                }
                continue;
        }
        if (strText.replace(new RegExp(" *"), "") == "") strText = "";
        if(domapi.trace)dump('---------------parsing ----> '+[elmType,strTag,strText]);
        if (arrElementsUnparsed[i].substring(1,2) != "/") {
                if (iElements == 0) {
                  xmleLastElement = this.documentElement = this._addNode( domapi.DOM.DOMNode(nodeparms));
                  iElements++;
                  if (strText != ""){
                     with(nodeparms){tagName='';data=strText;nodeType=xmlntText;}
                     xmleLastElement.appendChild(domapi.DOM.DOMNode(nodeparms));
                    }
                } else if (arrElementsUnparsed[i].substring(arrElementsUnparsed[i].length-2,arrElementsUnparsed[i].length-1) != "/") {
                  xmleLastElement = xmleLastElement.appendChild(  domapi.DOM.DOMNode(nodeparms));
                  iElements++;
                  if (strText != "") {
                     with(nodeparms){tagName='';data=strText;nodeType=xmlntText;}
                     xmleLastElement.appendChild( domapi.DOM.DOMNode(nodeparms));
                        }
                } else {
                  xmleLastElement.appendChild( domapi.DOM.DOMNode(nodeparms));
                  if (strText != ""){ 
                     with(nodeparms){tagName='';data=strText;nodeType=xmlntText;}
                     xmleLastElement.appendChild( domapi.DOM.DOMNode(nodeparms));}
                }
        }  else {
                xmleLastElement = xmleLastElement.parentNode;
                iElements--;
                if(xmleLastElement && strText != ""){
                  with(nodeparms){data=strText;nodeType=xmlntText;}
                  xmleLastElement.appendChild( domapi.DOM.DOMNode(nodeparms)); 
                }
        }
     if (i % 100 == 0)try{this.onreadystatechange();}catch(e){
       if(domapi.trace)dump('onreadystatechange event Error:'+e.message);
       else throw e;
       };
        
}//eo for
}catch(e){
  this.reason = '-----parse() Error :' + e.message + '\n-----parsing ----> '+[elmType,strTag,strText];
  if(domapi.trace)dump(this.reason);
  return false;}
  finally{this._inParse = false;
  }
if(this._abort){this.clear();this.reason = "abort";return false;}
this._parsed =true;
if(this.documentIterator)this.documentIterator.refresh();
return true;
};
//Node Constructor ---------------------------------------------------------
domapi.DOM.DOMNode = function(arg){return domapi.DOM.DOMNode.constructor(arg)}; 
domapi.DOM.DOMNode.constructor =function(arg){
 var N= {};
 
 N.nodeType         = domapi.rInt(arg['nodeType'],xmlntElement);
 N._level           = domapi.rInt(arg['level'],0);
 N.attributeString  = domapi.rVal(arg['attributes'],''); //no decoding here handled by attrib parser.
 N._text            = domapi.rVal(arg['data'],''); // text of element
  
 if(arg["data"])arg["data"]=null; //delete(arg["data"]);
 if(arg['text'])arg["text"]=null; //delete(arg["text"]);
 
 for(var i in arg)N[i] = arg[i];
 N.attributes       = null;
 N.ownerDocument    = domapi.rVal(arg['ownerDocument'],null);
 N.parentNode       = domapi.rVal(arg['parentNode'],null);
 N.encoding         = domapi.rVal(arg['encoding'],N.ownerDocument?N.ownerDocument.encoding:null);
 N.nodeName         = N.tagName = domapi.rVal(arg['tagName'],'').trim();
 N._id               = domapi.guid();
 domapi.DOMImplementation._inherit(N,'DOMNode'); 
 with(N){  
   _parseAttributes();
   switch(nodeType){
     case xmlntCdata :    nodeName= '#cdata-section';  N.data = _text;  break;
     case xmlntComment   :  nodeName= '#comment'; tagName='';N.data = _text;break;
     case xmlntDocument  : nodeName= '#document'; break;
     case xmlntDocType   : nodeName=  N.name = tagName;  break;
     case xmlntFragment   : nodeName= '#document-fragment'; break;
     case xmlntText  :   nodeName= '#text'; tagName='';  N.data = _text;  break;
     case xmlntPI    :
        
        if(ownerDocument && !ownerDocument.parsedEncoding){ //only set once for doc!
          ownerDocument.parsedEncoding = domapi.rVal(getAttribute('encoding'),null);
          if(ownerDocument.parsedEncoding)removeAttribute('encoding');
          N.encoding = null;  
        }
        
        attributeString ='';
        N.target = tagName;
        break;
     case xmlntElement : N._text='';break;
     default:
   }
 }
   N.childNodes       = new Array();
   N.length           = N.childNodes.length;
   N.namespaceURI     = domapi.rVal(arg['namespaceURI'],'');
   N.prefix           = N.tagName._prefix(':');  //namespace prefix
   N.baseName         = N.tagName.indexOf(':')>-1?N.tagName._suffix(':'):N.tagName;  
   N._Iterator        =  null; 
   N.preserveWhiteSpace = domapi.rBool(arg['preserveWhiteSpace'],(N.ownerDocument?N.ownerDocument.preserveWhiteSpace:false));
   N.specified        = true;
   N.parsed           = false;

   N._index           = -1;
   N._hasChildText    = false;
   
   if(N.data)domapi.DOMImplementation._inherit(N,'DOMData');
      
   if(N.ownerDocument && N.ownerDocument.parseWithEvents && N.ownerDocument._inParse){
       var H = N.ownerDocument._nodeHandlers;
       if(H && H[N.nodeType]){
             if(typeof H[N.nodeType] == 'function') H[N.nodeType](N);
             else eval(H[N.nodeType]);
       }
       if(H && N.hasAttributes() && H[xmlntAttrib] )
         for( var a=0;a <N.attributes.length;a++){
           var A = N.attributes[a];
           if(typeof H[xmlntAttrib] == 'function') H[xmlntAttrib](A);
           else eval(H[xmlntAttrib]);
         }
   }
   return N;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.selectSingleNode= function(query){
var Iter = this.selectNodes(query);
if(Iter && Iter.length)return Iter.childNodes[0];
return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.selectNodes= function(query){

var C = query.match(new RegExp("^[.\\/]*"));
if(C)C=C.join(''); else C='';
var node = (!C.length || /[.]+/.test(C)?this:this.ownerDocument);//context
var depth = new RegExp("\\/\\/+").test(C);
var tagNames=query.substr(C.length,query.length);
//dump('Setup:'+[node,depth,C,C.length,tagNames]);
var tagName = tagNames._prefix('/');
if(!tagName.length)tagName = tagNames;
 var node = new domapi.DOM.DOMIterator({nodeType:xmlntElement,node:node,filter:tagName,andChildren:depth});
// dump('Query for:' + [tagName,tagNames,node,depth,C]+' got :'+node.length);
 if(node.length && tagNames._suffix('/').length)node = node.selectNodes('.//'+tagNames._suffix('/'));
 
return node;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.getElementsByTagName= function(tagName){return new domapi.DOM.DOMIterator({nodeType:xmlntElement,node:this,filter:tagName,andChildren:true});};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.setData = function(v){with(this)if(data)data = _text = v;};
domapi.DOM.DOMNode.prototype.getData = function(){with(this)return data?data:'';};
domapi.DOM.DOMNode.prototype.hasAttributes = function(){return (this.attributes && this.attributes.length);};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._setLevel = function(level){
 if(!domapi.DOMImplementation.doLeveling)return;
 with(this){
   this._level = level?level:( parentNode?parentNode._level+1:-1);
   if(hasChildNodes()) for( var i=0 ; i<childNodes.length; i++)childNodes[i]._setLevel();
 }
};
//------------------------------------------------------------------------------
// make sure the node._index property matches its actual parent.childNodes[index]
domapi.DOM.DOMNode.prototype._assertIndex = function(node){
 if(!node)node=this; //assert self then.
 
 if(typeof node != 'object' || !node.parentNode)return -1;
 with(node.parentNode){
 if(childNodes.indexOf(node)==node._index) return node._index;
   else {if(domapi.trace)dump(node.toString()+'--> Index Assertion Failure '+ [childNodes.indexOf(node),node._index] );
     throw new Error ( 'Internal Node Index Mismatch'+ [childNodes.indexOf(node),node._index] );
    }
 }
 if(domapi.trace)with(node)dump(node.toString()+'.assertIndex() Failed:'+[_id,nodeType,tagName,nodeName,_index,nodeValue(),parentNode.childNodes.indexOf(node)]);
 return -1;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._removeNode = function(node){
  with(this){
   if(!hasChildNodes())return null;
   try{
           var index = _assertIndex(node); 
           
           if(index>-1 && index < childNodes.length){
              childNodes.deleteItem(index);
           
              if(this._nodePtr != 'undefined' && index == this._nodePtr)_nodePtr = childNodes.length; 
              length=  childNodes.length;
              for( var i=index ; i<childNodes.length; i++)childNodes[i]._index = i;
           } else node = null;
   }catch(e){
      node=null;if(domapi.trace)dump(this.toString()+'_removeNode() error :' + e.message);
   }finally{
   
   return node;
   }
 }
  
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._addNode = function(node,atIndex){
   if(node.nodeType){
    try{ 
      with(node){
             if(parentNode)parentNode._removeNode(node);  //possibly the same parent
             parentNode       = this;
             ownerDocument    = this.ownerDocument;
             _index = 0;
      }
      atIndex = domapi.rInt(atIndex,-1);  
      if(atIndex>-1 && atIndex <= this.childNodes.length){
        this.childNodes.insert(atIndex,node); 
        //node._index = atIndex;
        for( var i=atIndex ; i<this.childNodes.length; i++)this.childNodes[i]._index = i;
      }else{
         this.childNodes.push(node);
         node._index = this.childNodes.length-1;
      }
      this.length= this.childNodes.length;
      node._setLevel(this._level+1);
      this._hasChildText = (node._index==0 && node.data && node.data.length>0)
    } catch(e){if(domapi.trace)dump(this.toString()+'_addNode() error :' + e.message);
               return null; }
     if(node && domapi.trace)with(node)dump('AddNode  :'+[_id,nodeType,tagName,nodeName,parentNode.tagName,_level,_index,_text]);
     return node;
   } else return null;
};
// retrieve a child node its ID attribute -------------------------------------
domapi.DOM.DOMNode.prototype.nodeFromID = domapi.DOM.DOMNode.prototype._childElemById;
domapi.DOM.DOMNode.prototype._childElemById = function(nodeid){
if(!nodeid)return null;
with(this)return selectSingleNode('./[@ID = "'+nodeid.trim()+'"]');
};
// retrieve a child node by name or index. -------------------------------------
domapi.DOM.DOMNode.prototype._childElem = function(nodeidx){
if(domapi.trace)dump(this.toString()+ "_childElem('"+nodeidx+"')");
var iFind = -1;
if(!nodeidx)return null;

with(this){
 if(!hasChildNodes)return null;
 for (var i=_index+1; i<childNodes.length; i++) {
   if (childNodes[i]._level == this._level+1) {
        iFind++;
        try{if (iFind == nodeidx|| childNodes[i].tagName == nodeidx) return childNodes[i];}
        catch(e){}
   } else if (childNodes[i]._level <= _level) break;
 }
}
return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.appendChild = function(node){
if(node.nodeType==xmlntFragment){
  with(node)if(hasChildNodes())for(var i=0; i<childNodes.length; i++)this._addNode(childNodes[i].cloneNode(true));
}else return this._addNode(node);
};
domapi.DOM.DOMNode.prototype.removeChild = function(node){return this._removeNode(node);};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.nodeValue = function(){
 var nvalue=null;
 with(this){
  switch(nodeType){
    case xmlntText  :
    case xmlntCdata :
    case xmlntComment:
        if(data)nvalue = data;
        break;
    case xmlntAttrib:
        nvalue = value;
        break;
    default:
   }
 }
return nvalue;
};

domapi.DOM.DOMNode.prototype.asString = function(pretty,bHeader) {
 return this.xml(pretty,bHeader).replace(new RegExp("\\&","g"), "&amp;").replace(new RegExp("\\<","g"), "&lt;").replace(new RegExp("\\>","g"), "&gt;").replace(new RegExp("\\t","g"), "&nbsp;&nbsp;&nbsp;").replace(new RegExp("\\n","g"), "<br />");
};

//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.text = function(){
if(domapi.trace)dump(this.toString()+ ".text()"); 
 var txtout='';
 with(this){
 switch(nodeType){
    case xmlntDocument:
    case xmlntElement :
    case xmlntFragment:
    
    case xmlntIterator:
    case xmlntEntity  :
     if (hasChildNodes()) {
       var L = '',txt;
       for (var i=0; i<childNodes.length; i++) {
            txt = childNodes[i].text();
            if(txt.trim().length>0)L += txt ;
        }
       txtout = ' ' + L.trim();
     } else return "";
     break;
    case xmlntCdata :
     txtout = nodeValue();
     break;
    case xmlntText  :
    
     txtout = ' ' + (preserveWhiteSpace == true?nodeValue().trim():nodeValue().trim().replace(new RegExp("[\\r\\n\\t ]+","g")," ").replace(new RegExp("  +","g"),' '));
     break;
    default:
     
    }
   }
   return txtout;
 };
//--This method always returns a UNICODE string (from UTF-8 only)(except for CDATA)-------
domapi.DOM.DOMNode.prototype.xml = function(pretty, bHeader){ return this._output(false,pretty,bHeader);};

//--This method always returns an encoded version of the Document--------
// IF the DOMDocument.encoding property is set to something other than null ------
domapi.DOM.DOMNode.prototype.save = function(pretty, bHeader){ return this._output(true,pretty,bHeader);};

//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._output = function(forSave,pretty,bHeader){
var nv, strXML='',arrXML = new Array();
var encodefn = null;
var encodeIt = null;
try{
with(this){
 if(ownerDocument){
   encodeIt    = forSave?ownerDocument.encoding:ownerDocument.parsedEncoding;
   encodingfn  = forSave?ownerDocument.encodeFN:ownerDocument.decodeFN;
   }
   if (bHeader){
     strXML += '<?xml version="1.0" '+ (forSave && encodeIt?'encoding="'+encodeIt+'"':'') + '?>\n';
     if(ownerDocument && ownerDocument.doctype)strXML += ownerDocument.doctype.xml();
     }
   
   arrXML.push(strXML + _renderOpen(encodeIt,encodingfn,pretty));
   
   nv=nodeValue();
   if(nv && nv.length)arrXML.push(nv._encoding(nodeType==xmlntCdata?null:encodeIt, encodingfn) ); 
   
   arrXML.push(_renderClose(encodeIt,pretty)); 
   if(hasChildNodes()) for (var i=0; i<childNodes.length; i++)arrXML.push( childNodes[i]._output(forSave,pretty));
    
   arrXML.push( _renderFinal(encodeIt, pretty));
 }
 
 }catch(e){dump(this.toString()+'._output() Error : '+e.message); }
 finally{
 return arrXML.join('');}
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._renderOpen = function(encoding,encodingfn,pretty){
var doAttribs = false;
with(this){
   var t=pretty && nodeType == xmlntElement?'\t'._repeat(_level -1):'';
   switch(nodeType){
     case xmlntCdata : t+='<![CDATA[';break;
     case xmlntComment   :
       t +='<!--';break;
     
     case xmlntPI    : 
      doAttribs = true;
      t +='<?'+tagName;break;
     case xmlntDocType  :t +='<!DOCTYPE';break;
     case xmlntElement  :
     case xmlntIterator :
      doAttribs = true;
      t += '<'+tagName;
      
      break;
     default:
      t='';
     }
     if(doAttribs){
       if(attributes && attributes.length){ 
             for (var j=0; j<attributes.length; j++)
               if(attributes[j])t += ' ' + attributes[j].nodeName + '="' + attributes[j].value._encoding(encoding,encodingfn) + '"';
               
       } else if(attributeString.length)t += ' ' + attributeString.replace(new RegExp("[\\/>]$","gi"), "");
       //debugging// t += ' _index="'+_index+'" _level="'+_level+'"';
     }
    } 
    return t;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._renderClose = function(encoding,pretty){
with(this){
   var t=pretty && nodeType == xmlntElement?'\t'._repeat(_level -1):'\n';
   switch(nodeType){
     case xmlntCdata    : t =']]>' ;  break;
     case xmlntComment   :  t ='-->' + t; break;
     case xmlntPI    :     t ='?>' + t;   break;
     case xmlntDocType  :t ='>' + t;break;
     case xmlntElement  :
     case xmlntIterator :
        t= hasChildNodes()?'>':'/>' ;
        t += _hasChildText?'':'\n' ;
        break;
     default: t='';
     }
   }
   return t;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._renderFinal = function(encoding,pretty){
  with(this){
  var t=pretty && nodeType == xmlntElement && !_hasChildText?'\t'._repeat(_level -1):'';
  return ((nodeType== xmlntElement || nodeType== xmlntIterator) && (_hasChildText || hasChildNodes())?t + '</'+tagName+'>\n':'');
  }
};
//------------------------------------------------------------------------------ 
domapi.DOM.DOMNode.prototype.hasChildNodes= function() { return (this.childNodes && this.childNodes.length>0);};
//------------------------------------------------------------------------------ 
domapi.DOM.DOMNode.prototype.previousSibling= function() {
with(this){
 
   switch(nodeType){
    case xmlntAttrib :
    case xmlntDocument   :
    case xmlntFragment    :  break;
    default:
    if(parentNode && parentNode.hasChildNodes()) return _index>0?parentNode.childNodes[_index-1]:null; 
    }
 }
 return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.nextSibling= function() {
with(this){
 
   switch(nodeType){
    case xmlntAttrib :
    case xmlntDocument   :
    case xmlntFragment    :
       break;
    default:
    if(parentNode && parentNode.hasChildNodes()) return _index<parentNode.childNodes.length?parentNode.childNodes[_index+1]:null; 
    }
 }
 return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.insertBefore = function(newNode,refNode) {
if(typeof newNode != 'object')return null;
if(newNode.nodeType==xmlntFragment){
  var copyNode;
  with(newNode){
   if(hasChildNodes()){
     for(var i=0; i<childNodes.length; i++){
       copyNode = childNodes[i].cloneNode(true);
       if(copyNode){
         copyNode.parentNode = null;
         if(typeof refNode == 'object')this._addNode(copyNode,refNode._index);
         else this._addNode(copyNode);
       }
     }
   }
  }
}else return typeof refNode == 'object'?this._addNode(newNode,refNode._index):this._addNode(newNode);
};

// returns the oldNode if successfull. -----------------------------------------
domapi.DOM.DOMNode.prototype.replaceChild = function(withNode,oldNode) {
if(typeof withNode != 'object')return null;
var index = oldNode._assertIndex();
if(domapi.trace)dump(this.toString()+'.replaceChild() asserted: '+ index);
if(index<0)return null; //not in children or mismatch?
var node = this._removeNode(oldNode);

if(node && withNode){
  var noderef = this._addNode(withNode,index);
  if(!noderef || this._assertIndex(noderef) != index) return null; //should be the same
  
  }
return node;
};

//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.firstChild = function() {
with(this){
 if(hasChildNodes()) 
   switch(nodeType){
    case xmlntCdata :
    case xmlntComment   :
    case xmlntPI    : 
    case xmlntNotation  :
    case xmlntText  :
     break;
    default:
      return childNodes[0]; 
    }
 }
 return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.lastChild = function() {
 with(this){
   if(hasChildNodes()) 
    switch(nodeType){
     case xmlntCdata :
     case xmlntComment   :
     case xmlntPI    : 
     case xmlntNotation  :
     case xmlntText  :
      break;
     default:
       return childNodes[childNodes.length-1]; 
    }
  }
 return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.cloneNode = function(deep){
  var node = domapi.DOM.DOMNode({nodeType:this.nodeType,
     attributes:this.nodeType==xmlntElement?this.attributeString:'',
     ownerDocument:this.ownerDocument,
     parentNode:this.parentNode,
     data:this.nodeValue(),
     tagName:this.tagName,
     nodeName:this.nodeName
     });
  if(node && deep){
    with(node){
     for (var i=0; i<this.childNodes.length; i++)
        _addNode(this.childNodes[i].cloneNode(deep));
    }
  }
  return node;
};
//------ ** Unsupported **------------------------------------------------------
domapi.DOM.DOMNode.prototype.transformNode= function(){return null;};
domapi.DOM.DOMNode.prototype.transformNodeToObject= function(){return null;};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.childNodeIsDefined = function(strElementName) {
return (this.childNode(strElementName) != null);
};

// Return a childELement with a given tagName: strElementName
domapi.DOM.DOMNode.prototype.childNode = function(strElementName) {
with(this)for(var i=0; i<childNodes.length; i++) if(childNodes[i].tagName == strElementName) return childNodes[i];
return null;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.attributeIsDefined = function(strAttributeName) {
with(this)return (getAttribute(strAttributeName) != null);
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.nodeTypeString = function() {
var strtype='';
switch(this.nodeType){
   case xmlntElement:strtype='element'; break;
   case xmlntAttrib:strtype='attribute'; break;
   case xmlntText:   strtype='text'; break;
   case xmlntCdata:  strtype='cdata'; break;
   case xmlntPI:     strtype='processinstruction'; break;
   case xmlntDocument:strtype='document'; break;
   case xmlntDocType:strtype='documenttype'; break;
   case xmlntFragment:strtype='fragment'; break;
   case xmlntNotation:strtype='notation'; break;
   case xmlntEntity:strtype='entity'; break;
   case xmlntEntityRef:strtype='entityref'; break;
   case xmlntComment:strtype='comment'; break;
   case xmlntIterator:strtype='iterator'; break;
   default:  strtype='unknown';
}
return strtype;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype._parseAttributes = function() {
  
  switch(this.nodeType){
   case xmlntIterator :
   case xmlntElement :
   case xmlntEntity    :
   case xmlntPI        : //Only these permit attributes
   case xmlntComment   :
   case xmlntDocType   :
   case xmlntNotation  : break;
   default:
     this.attributes = null;
     return;
  }
 
 function _ParseAttribute(str,Attribute) {
   var str = str +  ">";
   if (str.indexOf(Attribute + "='")>-1) var Attr = new RegExp(".*" + Attribute + "='([^']*)'.*>");
   else if (str.indexOf(Attribute + '="')>-1) var Attr = new RegExp(".*" + Attribute + '="([^"]*)".*>');
   return str.replace(Attr, "$1");
  };
 
  var reAttributes = new RegExp(" ([^= ]*)=","gi"); // matches attributes
  var val,nname;
  with(this){
  if (attributeString.match(reAttributes) && attributeString.match(reAttributes).length) {
    var arrAttributes = attributeString.match(reAttributes);
    if (!arrAttributes.length) arrAttributes = new Array();
    else for (var j=0; j<arrAttributes.length; j++) {
          arrAttributes[j] = new domapi.DOM.DOMAttribute({name:(arrAttributes[j]+"").replace(new RegExp("[= ]","gi"),""),
                ownerElement:this,
                value:_ParseAttribute(attributeString, (arrAttributes[j]+"").replace(new RegExp("[= ]","gi"),"")) });
          if(arrAttributes[j].nodeName == "ID")ID = arrAttributes[j].value;
          
      }
    attributes = arrAttributes;
  }
  }
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.setAttributeNode = function(attrib){
if(typeof attrib != 'object')return null;
if(attrib.ownerElement)return null; //raise except, attrib must not be used elsewhere.
if(!attributes)_parseAttributes();
var node=null;
with(this){
 if(attributeIsDefined(attrib.name)) node = removeAttributeNode(attrib.name);
 
 attributes.push(attrib);
 attrib.ownerElement = this;
 attrib.specified = true;
}
return node;
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.removeAttributeNode = domapi.DOM.DOMNode.prototype.removeAttribute;
// Remove an ELement's attribute by name: strAttributeName-----------------------
domapi.DOM.DOMNode.prototype.removeAttribute = function(strAttributeName) {
with(this){
  if(!attributes)_parseAttributes();
     
   for (var i=0; i<attributes.length; i++){
      if(attributes[i].nodeName == strAttributeName){
        var node=attributes[i];
        attributes.deleteItem(i); 
        return node;
       }
   }    
}
};
// Sets an ELement's attribute value by a given tagName: strAttributeName----------
domapi.DOM.DOMNode.prototype.setAttribute = function(strAttributeName,strValue) {
if(!this.attributes)this.attributes=[];
with(this){
 if(hasAttributes()){
   for (var i=0; i<attributes.length; i++)
      with(attributes[i])if(nodeName == strAttributeName){value = strValue.trim(); return;}
      
 }
 // not found, so add it.  
 var attrib = new domapi.DOM.DOMAttribute({name:strAttributeName, value:strValue.trim()});
 if(attrib)setAttributeNode(attrib);
} 
};
// Return an ELement's attribute value by a given tagName: strAttributeName
domapi.DOM.DOMNode.prototype.getAttribute = function(strAttributeName) {
with(this){
if (!attributes)this._parseAttributes();
if (attributes.length) for (var i=0; i<attributes.length; i++) if (attributes[i].name == strAttributeName) return attributes[i].value;
return null;
}
};
//------------------------------------------------------------------------------
domapi.DOM.DOMNode.prototype.toString = function(){return '[object DOMNode id='+this._id + ' type:' + this.nodeTypeString()+']';};
//------------------------------------------------------------------------------

domapi.DOM.DOMAttribute = function(arg){

 this.nodeType          = xmlntAttrib;
 this._id               = domapi.guid();
 this.nodeName  = this.name=  domapi.rVal(arg['name'],'attrib-'+this._id);
 this.ownerElement      = domapi.rVal(arg['ownerElement'],null);
 this.value             = domapi.rVal(arg['value'],null);
 this.specified         = domapi.rBool(arg['specified'],true);
 this.parentNode        = null;
 this.prefix            = this.nodeName._prefix(':'); 
 
 domapi.DOMImplementation._inherit(this,'DOMNode'); //inherit DOMNode Interface
  
};
domapi.DOM.DOMData=function(){this.ancestor = null;};
//------------------------------------------------------------------------------
domapi.DOM.DOMData.prototype.appendData = function(newdata){if(newdata)this.data += newdata;};
//------------------------------------------------------------------------------
domapi.DOM.DOMData.prototype.substringData = function(offset,count){
 offset = parseInt(offset);
 count = parseInt(count);
 if( offset <= this.data.length)with(this)return data.substr(offset,count);
};
//------------------------------------------------------------------------------
domapi.DOM.DOMData.prototype.insertData = function(offset,newdata){
 if(newdata && newdata.length && offset < this.data.length)with(this)data = data.substr(0,offset) + newdata + data.substr(offset);
};
//------------------------------------------------------------------------------
domapi.DOM.DOMData.prototype.deleteData = function(offset,count){
 with(this){
   offset = parseInt(offset);
   count = parseInt(count);
   if(data && data.length && offset <= data.length)with(this)data = data.substr(0,offset) + data.substr(offset+count);
 }
};
//------------------------------------------------------------------------------
domapi.DOM.DOMData.prototype.replaceData = function(offset,count,newdata){
 with(this){
   offset = parseInt(offset);
   count = parseInt(count);
   var arr = data.split('');
   for (var i=0; i+offset<arr.length && i<count && i<newdata.length; i++)
      arr[offset+i]=newdata.charAt(i);
   
   data = arr.join('');
 }

};
//------------------------------------------------------------------------------

domapi.DOM.DOMIterator = function(arg) {

 this.startnode      = domapi.rVal(arg['node'],null);
 this.nodeSearchType = domapi.rInt(arg['nodeType'],xmlntElement); 
 
  //if(this.filter=="" && this.nodeSearchType==xmlntElement)this.filter='*';
 
 domapi.DOMImplementation._inherit(this,'DOMIterator'); 
  
 this.filter         = this._filterObj(domapi.rVal(arg['filter'],''));
 
 var _node           = domapi.DOM.DOMNode({nodeType:xmlntIterator,tagName:"Iteration-Results"});
 if(_node)try{ 
  for (var pp in _node)this[pp] = _node[pp];
  //domapi.DOMImplementation._inherit(this,_node); //inherit from DOMNode instance(yes props too!)
  delete(this._node);
 }catch(E){alert("Error in domapi.DOM.DOMIterator:\n\n" + E.message);}
 
 this.toString       = domapi.DOM.DOMIterator.prototype.toString;
 this.andChildren    = domapi.rBool(arg['andChildren'],false);
 this.attributeString = ' ID="'+this._id+'" type="'+this.nodeSearchType+'" ';
 this._parseAttributes();
 
 this.childNodes     = new Array(0); 
 this.length         = 0; 
 this._nodePtr       = -1;
 if(this.startnode)this.build(this.startnode);
 
};
//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype._filterObj = function(filter) {
var o={},re;

o.tagName =filter.replace(new RegExp("(.?)([\\[\\/]).*"),'$1');
//o.tagFilter=filter.match(/[^]+/gi);
//o.tagFilterString = o.tagFilter.replace(/.*\"(.*?)\".*/ ,'$1');
re =  new RegExp(".*\\[@{1}(.*?)([ =\\]]).*");  o.attribFilter = filter.search(re)>-1?filter.replace(re,'$1'):'';
re =  new RegExp('.*\\"(.*?)\\".*');      o.attribFilterString = filter.search(re)>-1?filter.replace(re,'$1'):'';

return o; //.tagName.length?o:null;
};

//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype.toString = function() {return '[object DOMIterator id='+this._id+']';};
domapi.DOM.DOMIterator.prototype.refresh = function() {with(this){childNodes = new Array(0);build(this.startnode);}};
domapi.DOM.DOMIterator.prototype.build = function(node) {
  if(!node )return;
  with(node){
     
     if(!hasChildNodes())return;
     var child,selected,elemCompare,compare,attribCompare;
     
     try{
       for (var i=0; i<childNodes.length; i++){
        child=childNodes[i];
        with(child){
          selected =(nodeType==this.nodeSearchType);
          if(selected && this.filter){
            //dump('Searching '+[nodeType,tagName,this.filter.tagName,this.filter.attribFilter,this.filter.attribFilterString]);
            selected=false; 
            elemCompare=attribCompare=null;
            switch(nodeType){
             case xmlntElement :  
                selected = (tagName == this.filter.tagName || this.filter.tagName =='*');
                if(selected && this.filter.attribFilter.length){
                  selected= attributeIsDefined(this.filter.attribFilter);
                  if(selected && this.filter.attribFilterString.length)
                    selected = (getAttribute(this.filter.attribFilter) == this.filter.attribFilterString);
                }       
                break;
             case xmlntText :
             case xmlntCdata:
                if(data)compare=data;
                break;
             default:
             }
             //if(elemCompare)selected = (compare == this.filter.tagName || this.filter.tagName =='*')
           }
         if(selected)this.childNodes.push(child);
         if(this.andChildren && hasChildNodes()) this.build(child); 
        }//ewith
       }  //efor
     }  catch(e){if(domapi.trace)dump(e.message + ' occurred');}
   }//enode
   if(node==this.startnode)this.reset();
};
//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype.reset = function(){with(this)_nodePtr=-1;this.length=this.childNodes.length;};
//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype.nextNode = function(){
with(this){
  if(!childNodes.length)return null;
  if(_nodePtr<childNodes.length)_nodePtr++; else return null;
  return childNodes[_nodePtr];
}
};
//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype.previousNode = function() {
with(this){
  if(!childNodes.length)return null;
  if(_nodePtr > 0)_nodePtr--; else return null;
  return childNodes[_nodePtr];
}
};
//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype.item = function(index) {
with(this){
  if(!childNodes.length || index >= childNodes.length)return null;
  return childNodes[index];
}
};
//------------------------------------------------------------------------------
domapi.DOM.DOMIterator.prototype.matches = function(node){
with(this)return childNodes.indexOf(node)>-1;
};