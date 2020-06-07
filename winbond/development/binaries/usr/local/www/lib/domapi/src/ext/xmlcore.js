//----------------------------------------------
// Author: Patrice Fricard <pfricard@wanadoo.fr>
//----------------------------------------------
// 29-09 Add transformNode / transformNodeToObject
//       Add getXmHttpRequest (including xmlhttp progid detection)
// 23/12 Add diff functionality 
//       diff function receive too DomDocument and return an xml describing differences
//       the xml currently use my own syntax (I plan to get an xupdate script)
//       node:
//             addsubtree: to insert new node
//                        contains xml fragment to insert
//             attributes:
//                 xpathparent: xpath of the parent to include
//                insertOrder: location of insertion
//            delsubtree: to delete a node
//             attributes:
//                xpath: xpath to delete
//            changeattr: to change attributes value
//                        contains a node attribute with the newvalue and attribute name
//            changedata: to change value of a text node
//             attributes:
//                 xpath: xpath to be updated
//                newvalue: value to set
//                oldvalue: no comment
// 15/03 Add Xupdate support (third parameters of constructor)
// 21/09/04 Separate Xdiff in an external unit xdiff is only useful in few cases
domapi.xml = {
  namespaceCnt : 0,
  msDomId      : null
};
//------------------------------------------------------------------------------ 
if(domapi.isIE){
  var idXmlList     = ["Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XmlDom"];
  var idXmlHttpList = ["Msxml2.XMLHTTP.4.0",     "MSXML2.XMLHTTP.3.0",     "MSXML2.XMLHTTP"];
  var xmlFound = false;
  try{
    for (var i=0; i < idXmlList.length && !xmlFound; i++){
      try{
        var oDoc = new ActiveXObject(idXmlList[i]);
        xmlFound = true;
        break;
      }catch (e){}
    }
    domapi.xml.msDomId = xmlFound ?idXmlList[i]:null;
  
    var xmlhttpFound = false;
    for (var i=0; i < idXmlHttpList.length && !xmlhttpFound; i++){
      try{
        var oDoc = new ActiveXObject(idXmlHttpList[i]);
        xmlhttpFound = true;
        break;
      }catch (e){}
    }
    domapi.xml.msDomId_XMLHTTP = xmlhttpFound ?idXmlHttpList[i]:null;
  }finally{
    oDoc = null
  }
};
//------------------------------------------------------------------------------
domapi.xml.getXmlHttpRequest = function(){
  var xmlhttp;
  try{
    try{ xmlhttp = domapi.isGecko?new XMLHttpRequest():new ActiveXObject(domapi.xml.msDomId_XMLHTTP);}catch(e){xmlhttp=null;}
    return xmlhttp;
  }finally{
    xmlhttp = null;
  }
};
//------------------------------------------------------------------------------
domapi.xml.getDomDocument = function(uri,name,forcedNS){
  var xmldoc=null;
  try{
    if(domapi.isIE){
      xmldoc = new ActiveXObject(domapi.xml.msDomId);
      if (name){
        if (uri){
          if (forcedNS)
            xmldoc.loadXML("<"+forcedNS+":"+ name + " xmlns:" + forcedNS + "=\"" + uri + "\" />");
          else{
            xmldoc.loadXML("<a" + domapi.xml.namespaceCnt + ":" + name + " xmlns:a" + domapi.xml.namespaceCnt + "=\"" + uri + "\" />");
            ++this.namespaceCnt;
          }
        }
        else xmldoc.loadXML("<" + name + "/>");
      }
    }else if (domapi.isGecko){
      if(document.implementation && document.implementation.createDocument){
        var xmldoc = document.implementation.createDocument(uri,name, null);
        xmldoc.async = true;
        if (xmldoc.readyState == null){
          xmldoc.readyState = 1;
          xmldoc.addEventListener("load", function(){
            xmldoc.readyState = 4;
            if (typeof xmldoc.onreadystatechange == "function")xmldoc.onreadystatechange();
          }, false);
        }
      }
    }
    return xmldoc;
  }finally{
    xmldoc = null;
  }
};
//------------------------------------------------------------------------------
if(domapi.isGecko && !domapi.isKHTML){  // what will do about Safari?  
// rumour has it that Safari supports XMLHTTPRequest, but it certainly has no Document object to prototype
  Document.prototype.loadXML = function (strXml){
    var xmldoc_tmp = (new DOMParser()).parseFromString(strXml, "text/xml");
    while (this.hasChildNodes())
      this.removeChild(this.lastChild);
    for (var i = 0; i < xmldoc_tmp.childNodes.length; i++)
      this.appendChild(this.importNode(xmldoc_tmp.childNodes[i], true));
  };
  Document.prototype.__defineGetter__("xml", function(){return (new XMLSerializer()).serializeToString(this)});
  Element.prototype.__defineGetter__("xml", function(){return (new XMLSerializer()).serializeToString(this)});
  Element.prototype.__defineSetter__("xml", function (){});
  Element.prototype.selectSingleNode = function(xpath){
    var xpathResult = this.ownerDocument.evaluate(xpath, this, null, "ORDERED_NODE_ITERATOR_TYPE", null);
    var xmlNode = xpathResult.iterateNext();
    return xmlNode;
  };

  Element.prototype.selectNodes = function(xpath){
    var xmlNodes = [];
    var xpathResult = this.ownerDocument.evaluate(xpath, this, null, "ORDERED_NODE_ITERATOR_TYPE", null);
    while (item = xpathResult.iterateNext()) xmlNodes[xmlNodes.length] = item;
    return xmlNodes;
  };

  Element.prototype.__defineSetter__("innerText", function (sText){
      var s = "" + sText;
      this.innerHTML = s.replace(new RegExp("\\&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;").replace(new RegExp(">", "g"), "&gt;");
    }
  );

  Element.prototype.__defineGetter__("innerText", function(){
      function scrapTextNodes(oElem){
        var s = "";
        for(i=0;i<oElem.childNodes.length;i++){
          var oNode = oElem.childNodes[i];
          if(oNode.nodeType == 3)
            s += oNode.nodeValue;
          else if(oNode.nodeType == 1)
            s += "\n" + scrapTextNodes(oNode);
        }
        return s;
      };
      return scrapTextNodes(this);
    }
  );

  XMLDocument.prototype.transformNodeToObject=function(oXSL,oXMLOUT){
    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.transformDocument(this, oXSL, oXMLOUT, null);
  };

  XMLDocument.prototype.transformNode=function(oXSL){
    oXMLOUT = domapi.xml.getDomDocument();
    this.transformNodeToObject(oXSL, oXMLOUT);
    return oXMLOUT.xml;
  };

  XMLDocument.prototype.domapi_load =  XMLDocument.prototype.load;
  XMLDocument.prototype.load = function(sURI, method){
    if (this.async){
      this.domapi_load(sURI);
    }else{
      var tmp = new XMLHttpRequest();
       tmp.open(domapi.rVal(method, "GET"), sURI, false);
       tmp.overrideMimeType("text/xml");
       tmp.send(null);
       this.loadXML(tmp.responseXML.xml);
    }
  }
};
//------------------------------------------------------------------------------
domapi.xml.view = function(xmldoc){
  if (domapi.isGecko) strTmp = (new XMLSerializer()).serializeToString(xmldoc);
  else strTmp = xmldoc.xml;
  return strTmp.replace(new RegExp("\\&", "g"), "&amp;").replace(new RegExp("\\<", "g"), "&lt;").replace(new RegExp("\\>", "g"), "&gt;").replace(new RegExp("\\t", "g"), "&nbsp;&nbsp;&nbsp;").replace(new RegExp("\\n", "g"), "<br />");
};
//------------------------------------------------------------------------------
//require xmldiff
domapi.xml.diff = function(xmlOrig, xmlChanged, useXpath, check){
  var d =new domapi.xDiff(xmlOrig, xmlChanged, useXpath, check);
  try{
    //xmlDiff.appendChild(diffRoot);
    return d.xmlDiff;
  }finally{
    d = null;
  }
};
//------------------------------------------------------------------------------
domapi.xml.generateXPath=function(n){
  if(n)try{
    var count, nl;
    var run  = n;
    var path = "";
    while (run != null && run.nodeType != 9){
      if (run.parentNode == null || run.parentNode.nodeType == 9)
        path = "/"+ run.nodeName + path;
      else{
        if(run.nodeType == 3)
          path="/text()[1]"+path;
        else{
          count = 1;
          nl = run.parentNode.childNodes;
          for(i=0;i<nl.length;i++){
            if (nl.item(i).nodeName == run.nodeName){
              if(nl.item(i).xml == run.xml) break;
              else count++ ;
            }
          }
          path = "/"+run.nodeName+"["+(count-1)+"]"+path;
        }
      }
      run = run.parentNode;
    }
    return path;
  }finally{run = null;nl = null;}else return "";
};
//------------------------------------------------------------------------------
domapi.xml.findOrder=function(nl,n){
  var i;
  o = 0;
  for(i=0;i<nl.length;i++)
    if(nl.item(i).xml==n.xml){o=i;break;}
  if(o == nl.length) o = -1;
  return o;
};
//------------------------------------------------------------------------------
domapi.xml.applyAttributes = function(N,O){
  // DK - applies all attributes of a node to an object
  var i, A, v;
  try{
    A = N.attributes;
    for(i=0;i<A.length;i++){
    	//PF - if Attributes is style use cssText to set it
    	if(A[i].name == "style"){
    		O.style.cssText = A[i].value;
    	}else{
    	//PF - Check if value is a number and force conversion
    		v = A[i].value;
    		O[A[i].name] = isNaN(v) ? v : Number(v);
    	}
  	}
  }finally{
    A = null;
  }
};
//------------------------------------------------------------------------------
domapi.xml.xmlFromDataIsland = function(dataId){
  return domapi.xml.xmlFromDomObj(document.getElementById(dataId));
};
//------------------------------------------------------------------------------
// dom to xml
domapi.xml.xmlFromDomObj = function(domObj){
  //create mainnode
	var xdoc = domapi.xml.getDomDocument("","xml");
  try{
  	var root = xdoc.documentElement;
  	//recurse node
  	domapi.xml.copyDomNodes(xdoc,domObj,root);
  	
    return xdoc;
  }finally{
    xdoc = null; root = null;
  }
};
//------------------------------------------------------------------------------
domapi.xml.copyDomNodes = function(xdoc,domNode,xmlNode){
  var dnode,i;
  var newnode;
  try{
    domapi.xml.copyDomAttributes(xdoc,domNode,xmlNode);
    for(i=0;i<domNode.childNodes.length;i++){
    	
    	dnode = domNode.childNodes[i];
    	switch(dnode.nodeType){
      	case 1: newnode = xdoc.createElement(dnode.tagName);
      		domapi.xml.copyDomNodes(xdoc,dnode,newnode);break;
        case 3: if (dnode.nodeValue) 
        	if (dnode.nodeValue != "" &&
        	   dnode.nodeValue != " " &&
        	   dnode.nodeValue !=  String.fromCharCode(13) &&
        	   dnode.nodeValue !=  String.fromCharCode(10)
           )newnode = xdoc.createTextNode(dnode.nodeValue);break;
    	}
      //append result
      if (newnode)	xmlNode.appendChild(newnode);
  	}
  }finally{
    dnode = null; newnode = null;
  }
};
//------------------------------------------------------------------------------
domapi.xml.copyDomAttributes = function(xdoc,N,O){
  // DK - applies all attributes of a node to an object
  var i, A, v, att;
  try{
    A = N.attributes;
  	if(A)
    for(i=0;i<A.length;i++){
  	  if (A[i].name != "_moz-userdefined"){
  	    att = xdoc.createAttribute(A[i].name);
  	    v = A[i].nodeValue;
    	  att.value = v ? v : "" ;
  	    O.attributes.setNamedItem( att );
      }
    }
  }finally{
    A = null;
  }
};