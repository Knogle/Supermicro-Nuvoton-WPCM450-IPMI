// catalog.js

/* This file is responsible to
	1. retreive catalog entries
	2. parse and store them in a data structure
	3. provide API's to user to retrive catalog entries
*/
/* Structure of resource data
	Resource
		uri
		notes
		vendoe
		displayname
		selectorset[]
		operations[]
			wsdlPort
			wsdlRef
			wsdlLocation
			actionuri[]
			schemaRef (point to one of allElements array)
			filter
			del mode
			selec set (points to one of above selectorset element)
selSets = { "ByDrive" : [ { "name" : "Drive", "Type" : "string", "description" : "drive letter" },
						  { "name" : "onemore", "Type" : "string", "description" : "one more selector" }
						]
			"ByName" : [ { "name" : "Name", "Type" : "string", "description" : "drive name" } ]
		  }
*/

wsman.loadFile("XML.js");		// for XML parsing
wsman.loadFile("soap.js");	// for resource transfer operations
wsman.loadFile("Enumeration.js"); // for enumerating resources
wsman.loadFile("resource.js"); // to create resources

var CATALOG_RESURI = "wsman:system/catalog/2005/06/Catalog";
var SCHEMA_RESURI = "wsman:system/catalog/2005/06/XMLSchema";
var NS_CATALOG = "http://schemas.xmlsoap.org/ws/2005/06/wsmancat";
var NS_TRANSFER = "http://schemas.xmlsoap.org/ws/2004/09/transfer";

// gets all the catalog entries using enumeration
wsman.getCatalogEntries = function(uri, recvFunc)
{
	wsman.uri = uri;
	var resources = [ ];
	var epr = new WSMAN_EPR(uri, CATALOG_RESURI);
	var catEnum = new wsman.Enumeration(epr);
	catEnum.enumerate({ Filter : null, EnumerationMode : null, callback : enumResp });

	// called after receiving enumerate response
	function enumResp(success)
	{
		if (success.exception) {
			recvFunc(success);
			return;
		}

		catEnum.itemBinder = {
			toObject : function(itemNode) {
				return parseResource(itemNode);
			}
		}
		catEnum.pullItems(pullItemsResp);
	}

	// called after receiving pull response
	function pullItemsResp(items, completed)
	{
		if (items.exception) {
			recvFunc(items);
			return;
		}

		try {
			// append received items to resources array
			resources = resources.concat(items);
			if (completed) {
				recvFunc(resources);
			}
			else {
				catEnum.pullItems(pullItemsResp);
			}
		} catch (e) {
			recvFunc(e);
		}
	}
}

function parseResource(resNode)
{
	var resURINodes = XML.getElementsByTagNameNS(resNode, NS_CATALOG, "ResourceURI");
	assert(resURINodes.length != 1, "Not one ResourceURI node");

	// <TBD> error checking

	// create Resource object with resourceURI
	var resource = new wsman.Resource(resURINodes.item(0).firstChild.nodeValue);
	debugOut("parseResource--- created res object with resuri: " + resource.resourceURI);

	// Notes; <TBD> error checking
	var notesNodes = XML.getElementsByTagNameNS(resNode, NS_CATALOG, "Notes");
	resource.notes = (notesNodes.length == 1) ? notesNodes.item(0).firstChild.nodeValue : null;
	debugOut("parseResource--- got notes");

	// DisplayName; <TBD> error checking
	var displayNodes = XML.getElementsByTagNameNS(resNode, NS_CATALOG, "DisplayName");
	resource.displayName = (displayNodes.length == 1) ? displayNodes.item(0).firstChild.nodeValue : null;
	debugOut("parseResource--- got display name");

	// get Access node which is compliant with WSMAN
	var accessNodes = XML.getElementsByTagNameNS(resNode, NS_CATALOG, "Access");
	assert(accessNodes.length == 0, "No Access nodes");

	var accessNode = null;
	for (var i = 0; i < accessNodes.length; i++)
	{
		accessNode = accessNodes.item(i);

		var complianceNodes = XML.getElementsByTagNameNS(accessNode, NS_CATALOG, "Compliance");
		assert(complianceNodes.length != 1, "Not proper compliance node");
		var complianceNode = complianceNodes.item(0);
		//debugger
		//assert(complianceNode.firstChild.nodeType != complianceNode.firstChild.TEXT_NODE, "Compliance node is not simple");

		if (complianceNode.firstChild.nodeValue == namespaces.wsman)
			break;

		accessNode = null;
	}

	assert(accessNode == null, "No WSMAN compliance access. Should be compliant with " +
							   namespaces.wsman);
	debugOut("parseResource--- got wsman compilant access");

	// parse SelectorSets
	var ssNodes = XML.getElementsByTagNameNS(accessNode, NS_CATALOG, "SelectorSet");
	resource.selectorSets = { };

	// for each SelectorSet node
	for (i = 0; i < ssNodes.length; i++)
	{
		var ssNode = ssNodes.item(i);
		var selectors = [ ];

		// get name of SelectorSet
		var ssName = ssNode.getAttribute("Name");

		// get Selectors
		var selectorNodes = XML.getElementsByTagNameNS(ssNode, NS_CATALOG, "Selector");

		// for each Selector Node in SelectorSet
		for (var j = 0; j < selectorNodes.length; j++)
		{
			var selNode = selectorNodes.item(j);

			var selObj = { };	// selector object
			selObj.name = selNode.getAttribute("Name");
			selObj.type = selNode.getAttribute("Type");
			selObj.description = selNode.firstChild.nodeValue;
			selectors.push(selObj);
		}

		resource.selectorSets[ssName] = selectors;
	}
	debugOut("parseResource--- got selector sets");

	// parse operations
	resource.operations = [ ];

	var oprNodes = XML.getElementsByTagNameNS(accessNode, NS_CATALOG, "Operation");
	assert(oprNodes.length == 0, "No Operation Node");

	// for each operation node, create Operation object and store it resource.operations array
	for (i = 0; i < oprNodes.length; i++)
	{
		resource.operations[i] = parseOperation(resource, oprNodes.item(i));
	}
	debugOut("parseResource--- got operations");

	return resource;

}

// parse operation node and return its object
function parseOperation(resource, operNode)
{
	var operation = new Operation(resource);

	// get wsdlPort, wsdlRef, wsdlLocation
	operation.wsdlPort = operNode.getAttribute("WsdlPort");
	operation.wsdlRef = operNode.getAttribute("WsdlRef");
	operation.wsdlLocation = operNode.getAttribute("WsdlLocation");

	// parse action URI's
	var actionNodes = XML.getElementsByTagNameNS(operNode, NS_CATALOG, "Action");
	assert(actionNodes.length == 0, "No Action node in Operation");
	operation.actionURIs = [ ];
	for (var i = 0; i < actionNodes.length; i++) {
		operation.actionURIs[i] = actionNodes.item(i).firstChild.nodeValue;
	}
	debugOut("parseOperation--- got acrion uris: " +  operation.actionURIs);

	// get SelectorSetRef
	var ssRefNodes = XML.getElementsByTagNameNS(operNode, NS_CATALOG, "SelectorSetRef");
	operation.selectorSets = [ ];
	for (i = 0; i < ssRefNodes.length; i++)	{
		operation.selectorSets[i] = resource.selectorSets[ssRefNodes.item(i).getAttribute("Name")];
	}
	debugOut("parseOperation--- got SelectorSetRef");
		
	// <TBD> to be tested
	// currently not parsing and retreiving schema as server is not supporting it
	/*
	// get SchemaRef
	var schemaRefNodes = XML.getElementsByTagNameNS(operNode, NS_CATALOG, "SchemaRef");
	if (schemaRefNodes.length == 1)
		parseSchemaRef(schemaRefNodes.item(0), operation);
	*/

	// get FilterDialect
	var fdNodes = XML.getElementsByTagNameNS(operNode, NS_CATALOG, "FilterDialect");
	operation.filterDialect =  (fdNodes.length == 1) ? fdNodes.item(0).firstChild.nodeValue : null;
	debugOut("parseOperation--- got FilterDialect");

	// Delivery Mode
	var deliveryNodes = XML.getElementsByTagNameNS(operNode, NS_CATALOG, "DeliveryMode");
	operation.deliveryMode =  (deliveryNodes.length == 1) ? deliveryNodes.item(0).firstChild.nodeValue : null;
	debugOut("parseOperation--- got Delivery Mode");

	return operation;
}

function parseSchemaRef(schemaRefNode, operation)
{
	// <TBD> should be done properly
	/**************
	schemaRefNode's text child will contain the qualified name of element from the schema
	whose namespace is declared normally in this node's attribute as this is only place where
	it is actually used. But it can be declared anywhere else also. 
	
	Currently, for simplicity the code blindly takes the namespace as first attribute's value
	***********/
	
	var elementNS = schemaRefNode.attributes.item(0).nodeValue;
	var elementName = XML.getBaseName(schemaRefNode.firstChild.nodeValue);
	getSchemaFromNS(elementNS, schemaRecv);
	
	function schemaRecv(schemaNode)
	{
		if (schemaNode instanceof WSMANException) {
			alert("JSLibrary*** Could not retreive or parse schema for an operation");
			return;
		}
		
		try {
			wsman.parseXMLSchema(schemaNode);
			operation.element = allElements[elementName];
			operation.element.name = elementName;
			operation.element.ns = elementNS;
		}
		catch (e) {
			alert("JSLibrary*** Could not retreive or parse schema for an operation");
		}
	}
}

// get XML schema from namespaceURI using Transfer GET.
// returns the schema node asynchronously
function getSchemaFromNS(ns, recvFunc)
{
	// create soap envelope with WS-Transfer GET as action URI and 
	// "wsman:system/catalog/2005/06/XMLSchema" as resourceURI
	var selectorSet = [ { name : "XMLSchema", value : ns } ];
	var soap = XML.createSOAPEnv(SCHEMA_RESURI, ActionURIs.Get, selectorSet);
	var soapText = XML.getDocXMLText(soap.document);

	SendPOSTRequest(wsman.uri, soapText, recv);
	debugOut("getSchemaFromNS---- sent req", soapText);
	
	function recv(respText)
	{
		try {
			// get XML schema from the SOAP envelope
			var response = XML.parseSOAPEnv(respText);
			var schemaNodes = XML.getElementsByTagNameNS(response.bodyNode, namespaces.xsd, "schema");
			assert(schemaNodes.length != 1, "getSchemaFromNS*** Not 1 schema node");
			recvFunc(schemaNodes.item(0));
		}
		catch (e) {
			recvFunc(e);			
		}
	}
}


// -------- Operation class -------------

function Operation(resource)
{
	this.resource = resource;
	
	var thisObj = this;
	
	this.getSampleObj = function()
	{
		var obj = { };
		assert(!this.element, "getSampleObj*** no schema information");
		
		for (var i = 0; i < this.element.elements.length; i++)
		{
			obj[this.element.elements.element] = this.element.elements.type;
		}
		return obj;
	}
	
	this.isActionURI = function(actionURI)
	{
		for (var i in this.actionURIs)
		{
			if (actionURI == this.actionURIs[i])
				return true;
		}
		return false;
	}
}