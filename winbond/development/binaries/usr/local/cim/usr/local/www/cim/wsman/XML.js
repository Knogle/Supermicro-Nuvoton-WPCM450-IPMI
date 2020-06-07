var XML = { };

XML.nodeTypes = {
  ELEMENT_NODE                   : 1,
  ATTRIBUTE_NODE                 : 2,
  TEXT_NODE                      : 3,
  CDATA_SECTION_NODE             : 4,
  ENTITY_REFERENCE_NODE          : 5,
  ENTITY_NODE                    : 6,
  PROCESSING_INSTRUCTION_NODE    : 7,
  COMMENT_NODE                   : 8,
  DOCUMENT_NODE                  : 9,
  DOCUMENT_TYPE_NODE             : 10,
  DOCUMENT_FRAGMENT_NODE         : 11,
  NOTATION_NODE                  : 12
};

// namespaces array
var namespaces = { "SOAP-ENV" : "http://www.w3.org/2003/05/soap-envelope",
				   "SOAP-ENC" : "http://schemas.xmlsoap.org/soap/encoding/",
				   "xsi" : "http://www.w3.org/2001/XMLSchema-instance",
				   "xsd" : "http://www.w3.org/2001/XMLSchema",
				   "wsa" : "http://schemas.xmlsoap.org/ws/2004/08/addressing",
				   "wsman" : "http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd",
				   "wse" : "http://schemas.xmlsoap.org/ws/2004/08/eventing",
				   "wsen" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration",
				   "wsdl" : "http://schemas.xmlsoap.org/wsdl/"
				 };


XML.NodeList = function(list)
{
	this.list = list;
	this.length = list.length;
	
	this.item = function(index)
	{
		return list[index];
	}
}

XML.addNodeList = function(list1, list2)
{
	var list = [ ];
	if (list1) {
		for (var i = 0; i < list1.length; i++) {
			list.push(list1.item(i));
		}
	}
	if (list2) {
		for (var i = 0; i < list2.length; i++) {
			list.push(list2.item(i));
		}
	}
	return new XML.NodeList(list);
}

// cross platform XML document object
XML.createXMLDocument = function(xmlText)
{
	var xmlDoc = null;
	
	// blank xml document
	if (xmlText == null)
	{
		// code for IE
		if (isIE)
		{
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		}
		// code for Mozilla, etc.
		else if (document.implementation &&
				 document.implementation.createDocument)
		{
			xmlDoc = document.implementation.createDocument("","",null);
		}
  		return xmlDoc;
	}
	// returning xmlDoc with loaded xml text
	else
	{
		//debugOut("createXMLDocument--- before rem space <textarea rows=30 cols=50>" + xmlText + "</textarea>");
		
		// remove white space
		xmlText = XML.removeWhiteSpace(xmlText);	
		
		//debugOut("createXMLDocument--- after removing whitespace <textarea rows=30 cols=50>" + xmlText +"</textarea>");
		
		// code for IE
		if (isIE)
		{
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.loadXML(xmlText);
			assert(xmlDoc.parseError.errorCode != 0, "Not proper XML: ".concat(xmlDoc.parseError.reason));
		}
		// code for Mozilla, etc.
		else if (document.implementation &&
				 document.implementation.createDocument)
		{
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlText, "text/xml");
			var roottag = xmlDoc.documentElement;
			assert((roottag.tagName == "parserError") ||
		    	   (roottag.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"),
		    	   "Not proper XML: ".concat(roottag.firstChild.nodeValue));
		    xmlDoc.normalize();
		}
  		return xmlDoc;
	}
}

XML.getLocalName = function(node)
{
	if (!node) {
		return "";
	}
	return (isIE) ? node.baseName : node.localName;
}

XML.getAttributeNS = function(node, namespaceURI, localName)
{
	if (isIE) 
	{
		for (var i = 0; i < node.attributes.length; i++) 
		{
			var attr = node.attributes.item(i);
			if (attr.baseName == localName && attr.namespaceURI == namespaceURI)
				return attr.value;
		}
		return null;
	}
	else
		return node.getAttributeNS(namespaceURI, localName);
}


XML.getElementsByTagNameNS = function(node, namespaceURI, localName)
{
	var nodes = [ ];
	
	if (!node.childNodes)
		return new XML.NodeList(nodes);
	
	// IE
	if (isIE)
	{
		// read all child nodes and check their namespaceURI property along with localName
		// if it matches, put in array and create NodeList object
		for (var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes.item(i);

			if (namespaceURI == "*" && localName == "*") 
			{
				nodes.push(childNode);
			}
			else if (namespaceURI == "*" && localName != "*") 
			{
				if (childNode.baseName == localName)
					nodes.push(childNode);
			}
			else if (namespaceURI != "*" && localName == "*") 
			{
				if (childNode.namespaceURI == namespaceURI)
					nodes.push(childNode);
			}
			else 
			{
				if (childNode.baseName == localName && childNode.namespaceURI == namespaceURI)
					nodes.push(childNode);			
			}
		}
		return new XML.NodeList(nodes);
	}
	// firefox
	else
	{
		return node.getElementsByTagNameNS(namespaceURI, localName);
	}
}


// removes whitespace from xml text
XML.removeWhiteSpace = function(str)
{
	return str.replace(/>[\n\r\t ]*</g, "><");
}

XML.makeHTMLDisplayable = function(xml)
{
	return xml.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>").replace(/\t/g,"&nbsp;");
}

XML.getBaseName = function(str)
{
	var strs = str.split(":",2);
	if (strs.length > 1)
		return strs[1];
	else
		return str;
}

// gets the XML text of an xml document (cross-platform)
XML.getDocXMLText = function(xmlDoc, formatted)
{
	if (formatted)
		return XML.getFormattedDocXML(xmlDoc, 0);
	
	var xmlText = null;
	// IE
	if (isIE)
	{
		xmlText = xmlDoc.xml;
	}
	// firefox
	else
	{
		var serializer = new XMLSerializer();
		xmlText = serializer.serializeToString(xmlDoc);
	}
	return xmlText;
	
}

XML.getFormattedDocXML = function(node, depth)
{
	var xml = "";
	var spaceLength = 2, spaceUnit = "", space = "";
	
	// compute spaceunit as "spaceLength" no of spaces
	for (var i = 0; i < spaceLength; i++)
		spaceUnit = spaceUnit.concat(" ");
	
	for (var i = 0; i < depth; i++)
		space = space.concat(spaceUnit);
		
	if (node.nodeType == XML.nodeTypes.TEXT_NODE) {
		return node.nodeValue;
	}
	
	else if (node.nodeType == XML.nodeTypes.ELEMENT_NODE)
	{
		// write start tag <tag
		var tag = "\n".concat(space, "<", node.nodeName);
		
		// write attributes
		var attrs = node.attributes;
		for (var i = 0; i < attrs.length; i++) {
			tag = tag.concat(" ", attrs.item(i).nodeName, "=\"", attrs.item(i).nodeValue, "\"");
		}
		tag = tag.concat(">");
		
		// write children
		var children = node.childNodes;
		for (var i = 0; i < children.length; i++) {
			tag = tag.concat(XML.getFormattedDocXML(children.item(i), depth + 1));
		}
		
		// write end tag </tag>
		if ((node.firstChild && node.firstChild.nodeType == XML.nodeTypes.TEXT_NODE)
			|| !node.firstChild)
			tag = tag.concat("</", node.nodeName, ">");
		else
			tag = tag.concat("\n", space, "</", node.nodeName, ">");
		
		return tag;
	}
}
