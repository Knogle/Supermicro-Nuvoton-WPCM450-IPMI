// schema.js

// Contains code to parse XML schema and store elements and types

// Load XML module to parse XML Schema
wsman.loadFile("XML.js");
wsman.loadFile("soap.js");	// for namespaces collection

wsman.XMLSchema = function(schemaNode)
{
	this.schemaNode = schemaNode;
	this.types = { };
	this.elements = { };
	this.unresolvedElements = [ ];
}

// store all standard types
wsman.XMLSchema.standardTypes = [ "string", "int", "integer", "boolean", "decimal", "byte",
					  			  "double", "float", "short", "base64Binary"
								];

wsman.XMLSchema.isStandardType = function(type)
{
	for (var i = 0; i < wsman.XMLSchema.standardTypes.length; i++) {
		if (type == wsman.XMLSchema.standardTypes[i])
			return true;
	}
	return false;
}

wsman.XMLSchema.prototype = 
{
	parseXMLSchema : function(schemaNode)
	{
		this.schemaNode = schemaNode ? schemaNode : this.schemaNode;
		
		// <TBD> should be taken with xsd namespace but when tried with XML.getElementsByTagNameNS(node, ns, *)
		// then it returned all the children (i.e. grandchildren also). Hence, using childNodes
		var elemNodes = this.schemaNode.childNodes;
		var elemNode = null;
		var i = 0;
		for (i = 0; i < elemNodes.length; i++)
		{
			elemNode = elemNodes.item(i)
			// complex type
			if (XML.getLocalName(elemNode) == "complexType") {
				var type = this.parseComplexType(elemNode);
				this.types[type.name] = type;
			}
			// simple type
			else if (XML.getLocalName(elemNode) == "simpleType") {
				var type = this.parseSimpleType(elemNode);
				this.types[type.name] = type;
			}
			// element definition
			else if (XML.getLocalName(elemNode) == "element") {
				var element = this.parseElement(elemNode);
				this.elements[element.name] = element;
			}
		}
		
		// resolve unresolved elements
		for (i = 0; i < this.unresolvedElements.length; i++) {
			var elem = this.unresolvedElements[i];
			elem.type = this.types[elem.type];
			assert(!elem.type, "Schema*** could not find type definition for '" + elem.type + "'");
		}
	},
	
	parseSimpleType : function(simpleNode)
	{
		var name = simpleNode.getAttribute("name");
		name = name ? XML.getBaseName(name) : null;
		return { name : name,  type : "simple" };
	},
	
	parseComplexType : function(complexNode)
	{
		var ctName = complexNode.getAttribute("name");
		ctName = ctName ? XML.getBaseName(ctName) : null;
		
		var ct = { name : ctName, type : "complex", elements : [ ] };
	
		// only supporting "sequence" or "all" in complexType
		if (XML.getLocalName(complexNode.firstChild) != "sequence" 
			&& XML.getLocalName(complexNode.firstChild) != "all")
		{
			throw new WSMANException("XMLSchema*** XML Schema for " + ctName + " is currently not supported by library");
		}
		
		var elementNodes = XML.getElementsByTagNameNS(complexNode.firstChild, namespaces.xsd, "element");
	
		// for each element in complex type
		for (var i = 0; i < elementNodes.length; i++) {
			ct.elements.push(this.parseElement(elementNodes.item(i)));
		}
		
		return ct;
	},
	
	parseElement : function(elemNode)
	{
		var name = XML.getBaseName(elemNode.getAttribute("name"));
		var elem = { name : name, type : null };
		
		// find maxOccurs & minOccurs
		elem.maxOccurs = elemNode.getAttribute("maxOccurs") || 1;
		if (elem.maxOccurs != "unbounded") {
			elem.maxOccurs = parseInt(elem.maxOccurs, 10);
		}
		elem.minOccurs = parseInt(elemNode.getAttribute("minOccurs"), 10);
		elem.minOccurs = isNaN(elem.minOccurs) ? 1 : elem.minOccurs;
	
		// element with no children;
		// i.e. <element name="name" type="type"/>
		if (elemNode.firstChild == null)
		{
			// get its type
			var typeName = XML.getBaseName(elemNode.getAttribute("type"));
	
			// if not standard type then get it from "types"
			elem.type = wsman.XMLSchema.isStandardType(typeName) ? typeName : this.types[typeName];
			
			if (!elem.type) {
				this.unresolvedElements.push(elem);
				elem.type = typeName;
			} 
			
			return elem;
		}
	
		// element with children
		// <element name="sd">
		//	  <complexType>...</complexType>
		// </element>
		// see if element is complex type or simple
		var type = null;
		if (XML.getLocalName(elemNode.firstChild) == "complexType")	{
			type = this.parseComplexType(elemNode.firstChild);
		}
		else if(XML.getLocalName(elemNode.firstChild) == "simpleType") {
			type = this.parseSimpleType(elemNode.firstChild);
		} 
		else {
			throw new WSMANException("XMLSchema*** unsupported tag ".concat(
										XML.getLocalName(elemNode.firstChild),
										" of element '", name, "'")); 
		}
		elem.type = type;
		
		return elem;
	}
}
