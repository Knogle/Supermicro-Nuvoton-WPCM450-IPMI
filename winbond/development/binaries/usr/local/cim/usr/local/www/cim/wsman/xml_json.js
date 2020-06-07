// xml_json.js

// this file contains routines to convert from xml to js object and vice versa

// parses individual item without having its schema

wsman.loadFile("XML.js");

var XML_JSON = {

	parseXML2JSON : function(node)
	{
		var obj = { $text : null, $texts : [] };
		
		// store attributes
		var attrs = node.attributes;
		for (var i = 0; i < attrs.length; i++) {
			obj["@".concat(attrs.item(i).nodeName)] = attrs.item(i).nodeValue;
		}
		
		for (var i = 0; i < node.childNodes.length; i++)
		{
			var childNode = node.childNodes.item(i);
			if (childNode.nodeType == XML.nodeTypes.ELEMENT_NODE)
			{		
				var prop = XML.getLocalName(childNode);

				// already there, hence, create an array of this
				if (obj[prop]) {
					
					// if not already an array, create an array 
					if (!(obj[prop] instanceof Array))
						obj[prop] = [ obj[prop] ];
					obj[prop].push(XML_JSON.parseXML2JSON(childNode));
				}
				else
					obj[prop] = XML_JSON.parseXML2JSON(childNode);
			}
			else if (childNode.nodeType == XML.nodeTypes.TEXT_NODE)
			{
				/*
				 * Stores text node using property "$text"
				*/
				if (!obj.$text) 
					obj.$text = childNode.nodeValue;
				obj.$texts.push(childNode.nodeValue);
			}
		}
		
		obj.toString = function() { return this.$text ? this.$text : ""; }
		obj.text = function() { return this.$texts; }
		
		return obj;
	},
	
	// XMLBinder implementation using XML2JSON
	binder : {
		toObject : function(node) {
			return XML_JSON.parseXML2JSON(node);
		}
	}
	
	/*
	JSON2XMLNodeList : function(obj)
	{
		for (var prop in obj)
		{
			if (typeof obj[prop] != "object")
		}
	}
	*/
}


