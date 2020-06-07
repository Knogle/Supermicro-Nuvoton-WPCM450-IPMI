wsman.loadFile("soap.js");
wsman.loadFile("xml_json.js");

function WSDLOperation(wsdl, name)
{
	this.wsdl = wsdl;
	this.name = name;
	
	this.style = null;
	this.actionURI = null;
	this.soapAction = null;
	this.bodyUser = null;
	this.bodyEncStyle = null;
	this.bodyNs = null;
	
	this.ipMsgFormat = null;
	this.opMsgFormat = null;
}

WSDLOperation.prototype =
{
	invoke : function(resourceURI, selectorSet, userinput, recvFunc)
	{
		if (!(this.style == "rpc" && this.bodyUse == "encoded"))
			throw new WSMANException("WSDLOperation** not supporting other than rpc/encoded soap envelope");
			
		//assert(this.callback != null, "WSDLOPeration** another oper in use");
		this.userinput = userinput;
		var epr = new WSMAN_EPR(this.wsdl.serviceEndpoint, resourceURI, selectorSet);
			
		// Create the SOAP envelope
		var soapEnv = new SOAPEnvelope(epr, this.actionURI);
		
		// add operation node
		var opNode = soapEnv.doc.createElement(this.name);
		if (this.bodyNs && this.bodyNs != null) {
			opNode.setAttribute("xmlns", this.bodyNs);
		}
		// add schema ns
		opNode.setAttribute("xmlns:xsi", namespaces.xsi);
		opNode.setAttribute("xmlns:xsd", namespaces.xsd);
		soapEnv.bodyNode.appendChild(opNode);
	
		/* creates node of element or part with given schema type 
		   doc - envelope document 
		   schemaType - schema's simple or complex type
		   name - name of the node
		   ip - input got from user
		*/
		function CreateComplexNode(doc, schemaType, name, ip)
		{
			var complexNode = doc.createElement(name);
			var times = 1, j = 0;

			// simple type
			if (schemaType.type == "simple") {
				complexNode.appendChild(doc.createTextNode(ip));
				return complexNode;
			}

			// complex type
			for (var i = 0; i < schemaType.elements.length; i++) {
				var elem = schemaType.elements[i];
				var elemNode = null;
				var createElemNode = null;	// function to create element node

				// element content from user input
				var userElem = ip[elem.name];
				if (userElem == undefined) {
					throw new WSMANException("Invalid request object: Expected property \"" +
									elem.name + "\" not found");
				}
				// an extermely horrible way of checking if userElem is an Array
				// but unfortunately, when input object is sent from different window
				// (userElem instanceof Array) returns false even if it is true
				function isArray(ar) {
					return (ar.length != undefined 		// ar.length is there
							&& typeof ar.length == "number"	// and its a number
							&& ar[ar.length - 1] != undefined);	// and its last element exists
				}
				if (elem.maxOccurs > 1 
					&& !isArray(userElem)) {
					throw new WSMANException("Invalid request object: Expected property \"" +
										elem.name + "\" value must be an array");
				}

				// primitive type
				if (typeof elem.type == "string") {
					createElemNode = function(elemIp) {
						elemNode = doc.createElement(elem.name);
						elemNode.setAttribute("xsi:type", "xsd:" + elem.type);
						elemNode.appendChild(doc.createTextNode(elemIp));		
						complexNode.appendChild(elemNode);
					}
				}
				// complex element
				else if (elem.type.type == "complex") {
					createElemNode = function(elemIp) {
						elemNode = CreateComplexNode(doc, elem.type, elem.name, elemIp);
						complexNode.appendChild(elemNode);
					}
				}
				// something wrong
				else {
					throw new WSMANException("CreateComplexNode*** unknown type");
				}
				
				// create the element node
				if (elem.maxOccurs == 1) {
					userElem = [ userElem ];
				}
				for (j = 0; j < userElem.length; j++) {
					createElemNode(userElem[j]);
				}
				complexNode.appendChild(elemNode); 
			}
			return complexNode;
		}	
		
		// adding parts
		for (var i = 0; i < this.ipMsgFormat.parts.length; i++)
		{
			var currPart = this.ipMsgFormat.parts[i];
			var currPartNode = null;

			// complex parameter (part)
			if (typeof(currPart.type) == "object")
				currPartNode = CreateComplexNode(soapEnv.doc, currPart.type, 
											currPart.name, this.userinput[currPart.name]);
			// simple parameter (part)
			else {
				currPartNode = soapEnv.doc.createElement(currPart.name);
				// create type attribute
				currPartNode.setAttribute("xsi:type", "xsd:" + currPart.type);
				currPartNode.appendChild(soapEnv.doc.createTextNode(this.userinput[currPart.name]));
			}
			opNode.appendChild(currPartNode);
		}

		//debugger
		// <TBD> add headers 
		/*
		var headers = [ ];
		if (this.soapAction)
			headers.push( { "name" : "SOAPAction", "value" : this.soapAction } );
		*/
		sendSOAPEnv(soapEnv, func);
		debugOut("invoke--- this.wsdl.serviceEndpoint " + this.wsdl.serviceEndpoint);

		// storing ref to operations's "this" obj as this in "func" refers to window's this object
		var thisObj = this;
		function func(resp)
		{
			var param = null;
			
			try {
				if (resp.exception) {
					throw resp;
				}
				// parse it into json obj and call recvFunc with that as a parameter
				param = thisObj.parseRPCEncodedSOAPEnv(resp.bodyNode);
			}
			catch (e) {
				param = e;
			}
			recvFunc(param);
		}
	},
	
	parseRPCEncodedSOAPEnv : function(bodyNode)
	{
		var opNode = null,
			respObj = { },
			part = null, 
			partNode = null, partNodes = null,
			value = null;
			
		// parse soap body
		opNode = bodyNode.firstChild;
		//return XML_JSON.parseXML2JSON(opNode);
		
		// <TBD> check for operation name
		//assert(XML.getLocalName(opNode) != this.name,	
		//	  "WSDL*** soap response is not having proper operation name");
		
		partNodes = opNode.childNodes;
		debugOut("parseRPCEncodedSOAPEnv--- partlength = " + partNodes.length + 
				 "; expected : " + this.opMsgFormat.parts.length);
		assert(partNodes.length != this.opMsgFormat.parts.length, 
			   "parseRPCEncodedSOAPEnv*** number of parts not same as in WSDL");

		/* parses given node based on its schema type & returns an obj */
		function parseNode(node, schemaType)
		{
			var i = 0, j = 0,
				element = null,
				obj = { },
				childNode = node.firstChild;
			
			// primtive or simple type; will be a text node
			if (typeof schemaType == "string" || schemaType.type == "simple") {
				if (!childNode) {
					return "";
				}
				assert(childNode.nodeType != XML.nodeTypes.TEXT_NODE,
					   "Invalid Response, \"" + node.nodeName + "\" child must be text node");
				return childNode.nodeValue;
			}
			// complex type; validation based on "sequence" elements
			// <TBD> validation based on "all" elements
			else if (schemaType.type == "complex") {
				// for each element, get its associated child node
				for (i = 0; i < schemaType.elements.length; i++) {
					element = schemaType.elements[i]; // schema element

					// make an array if element can occur more than once
					if (element.maxOccurs == "unbounded" || element.maxOccurs > 1) {
						obj[element.name] = [ ];
					}

					// check whether element is really there 
					if (element.minOccurs == 0) {
						if (!childNode || XML.getLocalName(childNode) != element.name) {
							continue;
						}
					}
					// element must be there
					else {
						assert(!childNode || XML.getLocalName(childNode) != element.name,
							   "Invalid Response, expected child node: \"" + element.name + 
							   "\" of parent \"" + XML.getLocalName(node) + "\"");
					}
					// keep getting this child if maxOccurs is there
					// <TBD> validate maxOccurs
					if (element.maxOccurs == "unbounded" || element.maxOccurs > 1) {
						while (childNode && (XML.getLocalName(childNode) == element.name)) {
							obj[element.name].push(parseNode(childNode, element.type)); 
							childNode = childNode.nextSibling;
						}
						
						// check if within range (minOccurs & maxOccurs)
						element.maxOccurs = 
							(element.maxOccurs === "unbounded") ? 
							4294967296 : 	// 2 power 32: largest array length
							element.maxOccurs;
						if (!(obj[element.name].length >= element.minOccurs
							  && obj[element.name].length <= element.maxOccurs)) {
							throw new WSMANException("Element \"" + element.name + 
									"\" has occured outside range. Must be between " +
									element.minOccurs + " and " + element.maxOccurs);
						}
					}
					else {
						obj[element.name] = parseNode(childNode, element.type);
						childNode = childNode.nextSibling;
					}
				}
				return obj;
			}
			else {
				throw new WSMANException("Unknown schema type while parsing response");
			}
		}
		
		// for each part there will be a child element
		for (i = 0; i < this.opMsgFormat.parts.length; i++)
		{
			part = this.opMsgFormat.parts[i];
			partNode = partNodes.item(i);
			value = null;
			
			//var name = XML.getLocalName(partNode);
			assert(part.name != XML.getLocalName(partNode), "Invalid response, unexpected part: " + part.name);
			value = parseNode(partNode, part.type);
			respObj[part.name] = value;
		}
		return respObj;
		
	},
	
	// gets sample input object which should be inputted to invoke
	// blankData - if true, then property values will be blank string ""
	//			   instead of its type; NOT IMPLEMENTED YET
	getSampleInputObject : function(blankData)
	{
		if (this.style == "rpc" && this.bodyUse == "encoded") {
			return this.getMessageObj(this.ipMsgFormat);
		}
		// will support doc/literal in next release
		/*
		else if (this.style == "document" && this.bodyUse == "literal")
		{
			for (var i = 0; i < this.ipMsgFormat.parts.length; i++)
			{
				var currPart = this.ipMsgFormat.parts[i]
				var currPartElem = allElements[currPart.element];
				jsonObj[currPart.name] = getComplexJSON(currPartElem);
			}
		}
		*/
		else {
			throw new WSMANException("WSDL*** not supporting other than rpc/encoded");
		}
	},
	
	getSampleOutputObject : function()
	{
		assert(this.style == "document" && this.bodyUse == "literal",
			   "getJSONOutputObject*** Currently not giving json response object for doc/literal");

		return this.getMessageObj(this.opMsgFormat);
	},

	
	getMessageObj : function(msgFormat) 
	{
		/* returns json object based on its schema type */
		function getComplexJSON(schemaType)
		{
			var jsonObj = { }, i = 0,
				element = null, o = null;
			
			if (schemaType.type == "simple") {
				return "string";
			}
			
			if (schemaType.type == "complex") {
				for (i = 0; i < schemaType.elements.length; i++) {
					element = schemaType.elements[i];
					if (typeof(element.type) == "object") {
						o = getComplexJSON(element.type);
						jsonObj[element.name] = element.maxOccurs ? [o] : o;
					}
					else
						jsonObj[element.name] = element.maxOccurs ? [element.type] : element.type;
				}
				return jsonObj;
			}
		}

		var jsonObj = { }, i = 0, part = null;
		
		for (i = 0; i < msgFormat.parts.length; i++) {
			part = msgFormat.parts[i];
			if (typeof(part.type) == "object")
				jsonObj[part.name] = getComplexJSON(part.type);
			else 
				jsonObj[part.name] = part.type;				
		}
		return jsonObj;
	}
}



/*
// doc/literal
function CreateDocLiteralSOAPBodyFunc(ip)
{
	//debugger
	for (var i = 0; i < this.ipMsgFormat.parts.length; i++)
	{
		var currPart = this.ipMsgFormat.parts[i]
		var currPartElem = allElements[currPart.element];
		var currPartNode = this.CreateComplexNode(currPartElem, currPart.element, ip[currPart.name]);
		if (this.bodyNs && this.bodyNs != null) {
			currPartNode.setAttribute("xmlns", this.bodyNs);
		}
		this.bodyNode.appendChild(currPartNode)
	}
}
*/

