// soap.js

// Contains functions to create, parse, send & receive SOAP packets

wsman.loadFile("network.js");	// send and receive soap packets
wsman.loadFile("XML.js");

//console.debug("soap.js loading start; " + new Date().getTime());

// all Action URIs
var ActionURIs = 
		{ 
		  "Get" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/Get",
		  "GetResponse" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse",
		  "Put" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/Put",
		  "PutResponse" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/PutResponse",
		  "Create" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/Create",
		  "CreateResponse" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/CreateResponse",
		  "Delete" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete",
		  "DeleteResponse" : "http://schemas.xmlsoap.org/ws/2004/09/transfer/DeleteResponse",
		  "Enumerate" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate",
		  "EnumerateResponse" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration/EnumerateResponse",
		  "Pull" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull",
		  "PullResponse" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration/PullResponse",
		  "Release" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration/Release",
		  "ReleaseResponse" : "http://schemas.xmlsoap.org/ws/2004/09/enumeration/ReleaseResponse",
		  "Subscribe" : "http://schemas.xmlsoap.org/ws/2004/08/eventing/Subscribe",
		  "SubscribeResponse" : "http://schemas.xmlsoap.org/ws/2004/08/eventing/SubscribeResponse",
		  "Unsubscribe" : "http://xmlsoap.org/ws/2004/08/eventing/Unsubscribe",
		  "UnsubscribeResponse" : "http://xmlsoap.org/ws/2004/08/eventing/UnsubscribeResponse",
		  "Renew" : "http://schemas.xmlsoap.org/ws/2004/08/eventing/Renew",
		  "RenewResponse" : "http://schemas.xmlsoap.org/ws/2004/08/eventing/RenewResponse"
		 };
		 
var soapHandlers = { };

function addSOAPHandler(actionURI, handler)
{
	soapHandlers[actionURI] = handler;
}

function removeSOAPHandler(actionURI)
{
	delete soapHandlers[actionURI];
}

/*
var cbName = null;
var cbObj = null;
*/

/* sends a SOAP envelope to its specified epr
   soapEnv - soap envelope object
   methodName - name of method that needs to be called after response is received
   object - object on which is method to be invoked (optional) 
*/
function sendSOAPEnv(soapEnv, methodName, obj)
{
	// general soap xml
	var xmlText = XML.getDocXMLText(soapEnv.envNode, true);
	
	// send request
	var headers = [ { name : "Content-Type", value : "text/xml" } ];
	
	// adding only to unit test eventing
	//debugOut("sendSOAP--- sending req: ", xmlText);
	//if (soapEnv.actionURI == ActionURIs.Subscribe)
	//	SendGETRequest("SubscribePullResp.xml", handleSOAPResponse);
	//else if (soapEnv.actionURI == ActionURIs.Pull)
	//	SendGETRequest("PullResp.xml", handleSOAPResponse);
	
	
	// comment following 2 lines to do unit testing; 
	// uncomment when normal behaviour is required
	SendPOSTRequest(soapEnv.epr.address, xmlText, headers, handleSOAPResponse);
	//debugOut("sendSOAP--- sent req: ", xmlText);
	var debugid = debugSOAPRequest(xmlText);
	
	function handleSOAPResponse(soapText)
	{
		var env = new SOAPEnvelope();
		 
		if (soapText.exception) {
			debugOut("SOAP--- could not get response: " + soapText);
			if (typeof methodName == "string")
				obj[methodName](soapText);
			else if (typeof methodName == "function")
				methodName(soapText);
			return;
		}
		
		try {
			//debugger
			// parse the soap envelope into SOAPEnvelope object
			env.parseSOAPEnv(soapText);
			//debugOut("SOAP--- got resp: ", XML.getDocXMLText(env.envNode, true));
			debugSOAPResponse(debugid, XML.getDocXMLText(env.envNode, true));
		}
		catch (e) {
			if (env.envNode) {
				//debugOut("SOAP--- got resp: ", XML.getDocXMLText(env.envNode, true));			
				debugSOAPResponse(debugid, XML.getDocXMLText(env.envNode, true));
			} else {
				debugSOAPResponse(debugid, soapText);
			}
			
			if (typeof methodName == "string")
				obj[methodName](e);
			else if (typeof methodName == "function")
				methodName(e);
			return;
		}
		
		// call the callback function on the object
		if (typeof methodName == "string")
			obj[methodName](env);
		else if (typeof methodName == "function")
			methodName(env);
	}
}


/* Empty XMLBinder definition. Mainly used for reference for its implementors
   XMLBinder is implemented by those who need to give their specific XML in SOAP envelopes
   For example, Enumeration needs this implementation to parse items xml returned while pulling
*/
wsman.XMLBinder = function() { }
wsman.XMLBinder.prototype =
{
	/* generates a xml node from given object and returns it
	   obj - object whose data needs to be converted to xml
	   		 if null, then use data from "this" object
	   doc - DOM document to create children and attributes
	   node (optional) - the DOM node already created. implementor needs to append 
	   					  children to this and return this node
	*/
	toXMLNode : function(obj, doc, node) { },
	
	/* generates a JS object from given DOM node and returns it
	   node - given node
	*/
	toObject : function(node) { }
}

/*
This is a generic SOAP module which lets user create SOAP envelope and parse them.
The user can register response parsers based on actionURI using addSOAPHandler 
the parser registered will be object having function parseSOAPEnv which will get
a SOAPEnvelope object after parsing the basic stuff
*/

/*
Each module using this might have createXXXRequest(ip) functions for creating specific
requests. These functions will return soapEnv object with all the necessary header & body
nodes created along with extra nodes stored
*/

// SOAP Envelope class that stores WSMAN_EPR referring to selected resource
function SOAPEnvelope(epr, actionURI)
{
	this.epr = epr ? epr : null;
	this.actionURI = actionURI ? actionURI : null;
	
	// XML nodes	
	this.doc = null;
	this.envNode = null;
	this.headerNode = null;
	this.bodyNode = null;
	
	if (this.epr)
		this.generateXML();
}

SOAPEnvelope.prototype = {

	generateXML : function() {
	
		assert(this.epr == null, "generateXML** cannot create XML without epr");
		
		this.doc = XML.createXMLDocument();
		this.envNode = this.doc.createElement("SOAP-ENV:Envelope");
		
		// create frequent xmlns attributes
		// SOAP-ENV, wsa & wsman
		var frequent = [ "SOAP-ENV" , "wsa", "wsman" ];
		for (var i = 0; i < frequent.length; i++) {
			var ns = frequent[i];
			this.envNode.setAttribute("xmlns:" + ns, namespaces[ns]);
		}
		
		this.doc.appendChild(this.envNode);
	
		// header
		this.headerNode = this.doc.createElement("SOAP-ENV:Header");
		this.envNode.appendChild(this.headerNode);
		
		// To tag
		var toNode = this.doc.createElement("wsa:To");
		toNode.appendChild(this.doc.createTextNode(this.epr.address));
		this.headerNode.appendChild(toNode);
	
		// ReplyTo
		var replyToTag = this.doc.createElement("wsa:ReplyTo");
		var addrTag = this.doc.createElement("wsa:Address");
		addrTag.appendChild(this.doc.createTextNode("http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous"));
		replyToTag.appendChild(addrTag);
		this.headerNode.appendChild(replyToTag);
	
		// ResourceURI
		assert(this.epr.resourceURI == null, "generateXML** cannot create XML without resourceURI");
		var resURINode = this.doc.createElement("wsman:ResourceURI");
		resURINode.appendChild(this.doc.createTextNode(this.epr.resourceURI));
		this.headerNode.appendChild(resURINode);
		
		// SelectorSet
		if (this.epr.selectorSet)
			this.headerNode.appendChild(getSelectorSetNode(this.doc, this.epr.selectorSet));
		
		// Action field
		if (this.actionURI) {
			var actionURINode = this.doc.createElement("wsa:Action");
			actionURINode.appendChild(this.doc.createTextNode(this.actionURI));
			this.headerNode.appendChild(actionURINode);
		}
		
		// MessageID
		var msgID = "dt:" + new Date().getTime().toString();
		var msgIDNode = this.doc.createElement("wsa:MessageID");
		msgIDNode.appendChild(this.doc.createTextNode(msgID));
		this.headerNode.appendChild(msgIDNode);
	
		// body
		this.bodyNode = this.doc.createElement("SOAP-ENV:Body");
		this.envNode.appendChild(this.bodyNode);
		
		var soapHandler = soapHandlers[this.actionURI];
		if (soapHandler && soapHandler.createSOAPEnv)
			soapHandler.createSOAPEnv(this);
	},
	
	parseSOAPEnv : function(soapText)
	{
		assert(!soapText, "No soap response");
	
		// check XML
		this.doc = XML.createXMLDocument(soapText);
		assert(XML.getLocalName(this.doc.documentElement) != "Envelope", "Not SOAP envelope");
		this.envNode = this.doc.documentElement;
		
		// get body
		var bodyNodes = XML.getElementsByTagNameNS(this.doc.documentElement, namespaces["SOAP-ENV"], "Body");
		assert(bodyNodes.length != 1, "Not proper body");
		this.bodyNode = bodyNodes.item(0);

		// checks wheather the envelope is fault or not;
		if (XML.getLocalName(this.bodyNode.firstChild) == "Fault" 
			&& this.bodyNode.firstChild.namespaceURI == namespaces["SOAP-ENV"])
		{
			var faultNode = this.bodyNode.firstChild;
			
			// Code
			var codeNode = XML.getElementsByTagNameNS(faultNode, namespaces["SOAP-ENV"], "Code").item(0);
			var valNode = XML.getElementsByTagNameNS(codeNode, namespaces["SOAP-ENV"], "Value").item(0);
			var code = valNode.firstChild.nodeValue;
			
			// Sub code
			var subcode = "";
			var subcodeNodes = XML.getElementsByTagNameNS(codeNode, namespaces["SOAP-ENV"], "Subcode");
			if (subcodeNodes.length == 1) {
				var subcodeNode = subcodeNodes.item(0);
				valNode = XML.getElementsByTagNameNS(subcodeNode, namespaces["SOAP-ENV"], "Value").item(0);
				subcode = valNode.firstChild.nodeValue;
			}
			
			var reasonNode = XML.getElementsByTagNameNS(faultNode, namespaces["SOAP-ENV"], "Reason").item(0);
			var textNode = XML.getElementsByTagNameNS(reasonNode, namespaces["SOAP-ENV"], "Text").item(0);
			var reason = textNode.firstChild.nodeValue;
			
			// Detail
			var detail = "";
			var detailNodes = XML.getElementsByTagNameNS(faultNode, namespaces["SOAP-ENV"], "Detail");
			if (detailNodes.length == 1) {
				var detailNode = detailNodes.item(0);
				detail = detailNode.firstChild.nodeValue;
			}
			
			//debugOut("parseSOAPEnv--- throwing " + reason);
			throw new FaultException(code, subcode, reason, detail);
			//debugOut("parseSOAPEnv--- threw");
		}
			
		// get action URI
		var headerNodes = XML.getElementsByTagNameNS(this.doc.documentElement, namespaces["SOAP-ENV"], "Header");
		assert(headerNodes.length != 1, "Not proper header");
		var headerNode = headerNodes.item(0);
		var actionURINode = XML.getElementsByTagNameNS(headerNode, namespaces["wsa"], "Action").item(0);
		this.actionURI = actionURINode.firstChild.nodeValue;
		
		// parse the message using the handler if it exists
		var soapHandler = soapHandlers[this.actionURI];
		if (soapHandler && soapHandler.parseSOAPEnv)
			soapHandler.parseSOAPEnv(this);
	}

}


/* WSMAN_EPR is a class of data that stores WSMAN EPRs 
   It includes address, resourceURI and selectorSet
   selectorSet is array of Selectors where each selector has a name and value
   the value could be a string or another WSMAN_EPR
*/

function WSMAN_EPR(address, resourceURI, selSet)
{
	var epr = new wsman.EPR(address);
	for (var p in epr) {
		this[p] = epr[p];
	}
	this.toEprXMLNode = this.toXMLNode;
	
	this.resourceURI = resourceURI;
	this.selectorSet = selSet;

	this.toXMLNode = function(doc, name)
	{
		this.toEprXMLNode(doc, name);
		
		// resource uri
		var resURINode = doc.createElement("wsman:ResourceURI");
		resURINode.appendChild(doc.createTextNode(this.resourceURI));
		this.refParamsNode.appendChild(resURINode);
			
		// selector set
		if (this.selectorSet)
			this.refParamsNode.appendChild(getSelectorSetNode(doc, this.selectorSet));
			
		return this.eprNode;
	};
	
	this.parseWSMAN_EPRNode = function(eprNode)
	{
		this.parseEPRNode(eprNode);

		var resURINodes = XML.getElementsByTagNameNS(this.refParamsNode, namespaces.wsman, "ResourceURI");
		assert(resURINodes.length != 1, "Not 1 ResourceURI node");
		this.resourceURI = resURINodes.item(0).firstChild.nodeValue;
		
		var ssNodes = XML.getElementsByTagNameNS(this.refParamsNode, namespaces.wsman, "SelectorSet");
		if (ssNodes.length == 0)
			return;
		
		assert(ssNodes.length != 1, "SelectorSet node not proper");
		this.selectorSet = parseSelectorSetNode(ssNodes.item(0));
	};
}

function parseSelectorSetNode(selSetNode)
{
	var selNodes = selSetNode.childNodes;
	
	var selectorSet = [ ];
	for (var i = 0; selNodes.length; i++) 
	{
		var selNode = selNodes.item(i);
		
		// name
		var selector = { name : null, value : null };
		selector.name = selNode.getAttribute("name");
		
		// simple value
		if (selNode.firstChild.nodeType == XML.nodeTypes.TEXT_NODE)
			selector.value = selNode.firstChild.nodeValue
		// complex value; another epr
		else if (selNode.firstChild.nodeType == XML.nodeTypes.ELEMENT_NODE)
			selector.value = new WSMAN_EPR().parseWSMAN_EPRNode(selNode.firstChild);
		else
			throw new WSMANException("WSMAN EPR Selector value is not proper");
		
		selectorSet.push(selector);
	}
	
	return selectorSet;
}

function getSelectorSetNode(doc, selectorSet)
{
	var selSetNode = doc.createElement("wsman:SelectorSet");
	for (var i = 0; i < selectorSet.length; i++)
	{
		var selector = selectorSet[i];

		// selector node
		var selNode = doc.createElement("wsman:Selector");
		selNode.setAttribute("name", selector.name);
		selSetNode.appendChild(selNode);

		// selector value is simple text
		if (typeof selector.value == "string")
			selNode.appendChild(doc.createTextNode(selector.value));

		// selector value is another epr
		else if (typeof selector.value == "object")
			selNode.appendChild(selector.value.toXMLNode(doc));

		else
			assert(true, "WSMAN_EPR.toXMLNode** selector value is unknown");
	}
	
	return selSetNode;
}

wsman.EPR = function(address) {
	this.address = address;
}

wsman.EPR.prototype = {
	parseEPRNode : function(eprNode) {
		this.eprNode = eprNode;
		var addNode = eprNode.firstChild;
		assert(XML.getLocalName(addNode) != "Address", "EPR XML doesn't have address");
		this.address = addNode.firstChild.nodeValue;

		// store ref param and prop nodes in case they are required 
		var refParamsNodes = XML.getElementsByTagNameNS(eprNode, namespaces.wsa, "ReferenceParameters");
		this.refParamsNode = (refParamsNodes.length > 0) ? refParamsNodes.item(0) : null;
		var refPropsNodes = XML.getElementsByTagNameNS(eprNode, namespaces.wsa, "ReferenceProperties");
		this.refPropsNode = (refPropsNodes.length > 0) ? refPropsNodes.item(0) : null;
	},
	
	toXMLNode : function(doc, name) {
		assert(!doc, "EPR.toXMLNode** document is null");
		this.eprNode = doc.createElement(name || "wsa:EndPointReference");

		// address
		var addNode = doc.createElement("wsa:Address");
		addNode.appendChild(doc.createTextNode(this.address));
		this.eprNode.appendChild(addNode);

		// reference parameters 
		this.refParamsNode = doc.createElement("wsa:ReferenceParameters");
		this.eprNode.appendChild(this.refParamsNode);
		
		return this.eprNode;
	}
}
