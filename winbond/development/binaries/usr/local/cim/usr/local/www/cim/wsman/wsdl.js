// wsdl.js

// Contains code to parse wsdl and store information from it

wsman.loadFile("WSDLOperation.js");	// Load operation module to store WSDL Operations
wsman.loadFile("XML.js");				// for WSDL Parsing
wsman.loadFile("schema.js"); 			// for parsing schema inside WSDL
wsman.loadFile("soap.js"); 			// for sending and receiving soap packets
wsman.loadFile("resource.js"); 			// for wsman.getWSDLFromURI using transfer get

var WSMAN_RES_URI = "wsman:system/catalog/2005/06/WSDL1.1";
var NS_SOAP_BINDING = "http://schemas.xmlsoap.org/wsdl/soap/";
var HTTP_TRANSPORT_URI= "http://schemas.xmlsoap.org/soap/http";


// gets the WSDL file from the server using transfer get and give its definition
// node as parameter to "func" function
wsman.getWSDLFromURI = function(wsdlURI, wsmanURI, func)
{
	// create soap envelope with WS-Transfer get as action URI and 
	// "wsman:system/catalog/2005/06/WSDL1.1" as resourceURI
	var res = new wsman.Resource(WSMAN_RES_URI);
	res.resourceBinder = { 
		toObject : function(node) {
			return node;
		}
	};
	
	var selectorSet = [ { name : "WSDL1.1", value : wsdlURI } ];
	var epr = new WSMAN_EPR(wsmanURI ? wsmanURI : wsman.uri,
							WSMAN_RES_URI, selectorSet);
	
	res.getInstance(epr, func);
}


// gets the WSDL file from specified physical location and passes
// text as a parameter to "func" function
wsman.getWSDLFromLocation = function(location, func)
{
	SendGETRequest(location, func);
}

// WSDL class
// Constructor takes either a wsdl text or wsdlNode as a parameter
wsman.WSDL = function(wsdl) {
	this.operations = [ ];
	this.serviceEndpoint = null;
	
	this.wsdlNode = (typeof wsdl == "string") ? XML.createXMLDocument(wsdl).documentElement
											  : wsdl;
}

wsman.WSDL.prototype =
{
	parse : function()
	{
		// parse XML schema
		var typesNodes = XML.getElementsByTagNameNS(this.wsdlNode,
													namespaces["wsdl"],
													"types");
		// parse xml schema inside types tag
		if (typesNodes.length > 0) {
			var schemaNodes = XML.getElementsByTagNameNS(typesNodes.item(0), namespaces.xsd, "schema");
			if (schemaNodes.length == 1) {
				this.schema = new wsman.XMLSchema(schemaNodes.item(0));
				this.schema.parseXMLSchema();
			}
		}
	
		// reading binding info and see if soap binding is supported. If so,
		// get operations supported and create their associated WSDLOperation objs
		var bindNodes = XML.getElementsByTagNameNS(this.wsdlNode, namespaces["wsdl"], "binding");
		assert(bindNodes.length == 0, "WSDL*** No binding info in WSDL file");
	
		this.parseBindingInfo(bindNodes);
	},
	
	parseBindingInfo : function(bindingNodes)
	{
		var soapBindNode = null;
		var portType = null;

		// find the binding node which binds SOAP through HTTP
		for (var i = 0; i < bindingNodes.length; i++)
		{
			//debugOut("ParseBindingInfo--- bind node: " + bindingNodes.item(i).localName);
			/*
			var soapBindNodes = XML.getElementsByTagNameNS(bindingNodes.item(i), NS_SOAP_BINDING, "binding");
			if (soapBindNodes.length == 0)
				continue;
			else
				soapBindNode = soapBindNodes.item(0);
			*/
			//debugOut("ParseBindingInfo---  soapBindNode " + soapBindNode["nodeName"] + " ; " +
			//		 XML.getLocalName(soapBindNode) + "; " + soapBindNode.namespaceURI);

			soapBindNode = bindingNodes.item(i).firstChild;

			if (XML.getLocalName(soapBindNode) == "binding" && soapBindNode.namespaceURI == NS_SOAP_BINDING)
				break;
			soapBindNode = null;
		}
		assert(soapBindNode == null, "WSDL*** The WSDL doesnt provide SOAP binding");

		var bindName = XML.getBaseName(soapBindNode.parentNode.getAttribute("name"));

		// find assoc portType and its node
		portType = XML.getBaseName(soapBindNode.parentNode.getAttribute("type"));
		var portTypeNode = null;
		var ptNodes = XML.getElementsByTagNameNS(this.wsdlNode, namespaces["wsdl"], "portType");
		for (i = 0; i < ptNodes.length; i++) {
			if (XML.getBaseName(ptNodes.item(i).getAttribute("name")) == portType) {
				portTypeNode = ptNodes.item(i);
				break;
			}
		}
		assert(portTypeNode == null, "WSDL*** The WSDL SOAP binding port type was not found");

		// operation nodes in port type node
		var ptOpNodes = XML.getElementsByTagNameNS(portTypeNode, namespaces["wsdl"], "operation");

		// get binding style and transport
		var style = soapBindNode.getAttribute("style");
		var transport = soapBindNode.getAttribute("transport");

		// check if HTTP is protocol for comm
		assert(transport != HTTP_TRANSPORT_URI, "WSDL*** The WSDL SOAP binding is not through HTTP protocol");

		// for each operation goto assoc porttype->operation->message and create a WSDLOperation object
		// which will store ip and op message format along with binding info
		var bindOperNodes = XML.getElementsByTagNameNS(soapBindNode.parentNode, namespaces["wsdl"], "operation");
		for (i = 0; i < bindOperNodes.length; i++)
		{
			// get operation name
			var opName = XML.getBaseName(bindOperNodes.item(i).getAttribute("name"));

			// create WSDLOperation object
			var op = new WSDLOperation(this, opName);

			// get soapAction and style
			/*
			var soapOpNodes = XML.getElementsByTagNameNS(bindOperNodes.item(i), NS_SOAP_BINDING, "operation");
			if (soapOpNodes.length == 0)
			{
				alert("JSLibrary*** There is no operation node for SOAP binding");
				return false;
			}
			var soapOpNode = soapOpNodes.item(0);
			*/

			var soapOpNode = bindOperNodes.item(i).firstChild;
			op.soapAction = soapOpNode.getAttribute("soapAction");
			/*
			if (op.soapAction == null)
			{
				alert("JSLibrary*** There is no SOAPAction in SOAP binding");
				return false;
			}
			*/
			var opStyle = soapOpNode.getAttribute("style");
			if (opStyle == null)
				op.style = style;
			else
				op.style = opStyle;

			// get soap body use and encodingStyle (if there is)
			// the lib is assuming that input and output binding info for the operation is same
			// <TBD> check if bindOperNodes.item(i).childNodes.item(1).firstChild exists
			var soapBodyNode = bindOperNodes.item(i).childNodes.item(1).firstChild;
			op.bodyUse = soapBodyNode.getAttribute("use");
			op.bodyEncStyle = soapBodyNode.getAttribute("encodingStyle");
			op.bodyNs = soapBodyNode.getAttribute("namespace");

			// goto operation node in portType
			var ptOpNode = null;
			for (var j = 0; j < ptOpNodes.length; j++) {
				if (XML.getBaseName(ptOpNodes.item(j).getAttribute("name")) == opName) {
					ptOpNode = ptOpNodes.item(j);
					break;
				}
			}

			// find input and output message node
			// <TBD> check if item(0) exists
			var ipNode = XML.getElementsByTagNameNS(ptOpNode, namespaces["wsdl"], "input").item(0);
			var opNode = XML.getElementsByTagNameNS(ptOpNode, namespaces["wsdl"], "output").item(0);

			op.actionURI = XML.getAttributeNS(ipNode, namespaces.wsa, "Action");

			var ipMsgName = XML.getBaseName(ipNode.getAttribute("message"));
			var opMsgName = XML.getBaseName(opNode.getAttribute("message"));
			var ipMsgNode = this.getMessageNode(ipMsgName);
			var opMsgNode = this.getMessageNode(opMsgName);
			assert(ipMsgNode == null || opMsgNode == null, 
				   "WSDL*** No message element for " + ipMsgName + " or " + opMsgName);

			op.ipMsgFormat = this.parseMessageNode(ipMsgNode);
			op.opMsgFormat = this.parseMessageNode(opMsgNode);

			this.operations.push(op);	
		}
		
		//debugger
		// get service endpoint
		var serviceNodes = XML.getElementsByTagNameNS(this.wsdlNode, namespaces["wsdl"], "service");
		var br = false;
		for (i = 0; i < serviceNodes.length; i++)
		{
			var portNodes = XML.getElementsByTagNameNS(serviceNodes.item(i), namespaces["wsdl"], "port");
			for (j = 0; j < portNodes.length; j++)
			{
				if (XML.getBaseName(portNodes.item(j).getAttribute("binding")) == bindName)
				{
					// get soap address
					var addNode = XML.getElementsByTagNameNS(portNodes.item(j), NS_SOAP_BINDING, "address").item(0);
					this.serviceEndpoint = addNode.getAttribute("location");
					br = true;
					break;
				}
			}
			if (br)
				break;
		}
	},
	
	getOperation : function(name)
	{
		for (var i = 0; i < this.operations.length; i++)
		{
			if (name == this.operations[i].name)
				return this.operations[i];
		}
		return null;
	},

	getAllOperations : function()
	{
		return this.operations;
	},
	
	getMessageNode : function(msgName)
	{
		var msgNodes = XML.getElementsByTagNameNS(this.wsdlNode, namespaces["wsdl"], "message");
		for (var i = 0; i < msgNodes.length; i++) {
			if (XML.getBaseName(msgNodes.item(i).getAttribute("name")) == msgName)
				return msgNodes.item(i);
		}
		return null;
	},
	
	// returns message data as json object
	parseMessageNode : function(msgNode)
	{
		var msgObj = { parts : [ ] };	
		var partNodes = XML.getElementsByTagNameNS(msgNode, namespaces["wsdl"], "part");
	
		// for each part node, parse it
		for (var i = 0; i < partNodes.length; i++)
		{
			var partNode = partNodes.item(i);
			var part = { };
			
			// get part name
			part.name = partNode.getAttribute("name");
			
			// get part type
			part.type = partNode.getAttribute("type");
			part.type = part.type ? XML.getBaseName(part.type) : null;
			if (part.type && !wsman.XMLSchema.isStandardType(part.type)) {
				part.type = this.schema.types[part.type];
			}
			
			// get part element
			part.element = partNode.getAttribute("element");
			part.element = part.element ? XML.getBaseName(part.element) : null;
			part.element = part.element ? this.schema.elements[part.element] : null;
			
			msgObj.parts.push(part);
		}
		
		return msgObj;
	}

}




