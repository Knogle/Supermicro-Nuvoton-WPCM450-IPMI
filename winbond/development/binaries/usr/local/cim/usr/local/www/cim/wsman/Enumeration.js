// Enumeration.js

/* This file represents the Enumeration class which has the following responsibilities
		1. Manage enumeration protocol by maintaining enumeration context
		2. Creating enumeration SOAP requests and parsing SOAP responses
			a. Create Enumerate, Pull and Release request
		3. Sending and receiving the above SOAP requests and responses
*/

wsman.loadFile("XML.js");
wsman.loadFile("soap.js");
//console.debug("Enumeration.js loading start; " + new Date().getTime());

/*
 * This class provides XMLBinder interface implementation for Associated instance filter.
 * Use this class's object in enumerate() function's input parameter
*/
wsman.AssocInstFilter = function(object, associationClassName, role, resultClassName, resultRole)
{
	this.object = object;
	this.associationClassName = associationClassName;
	this.role = role;
	this.resultClassName = resultClassName;
	this.resultRole = resultRole;
}

wsman.AssocInstFilter.prototype = 
{
	toXMLNode : function(obj, doc, node) 
	{ 
		var filNode = doc.createElement("wsman:Filter");
		filNode.setAttribute("Dialect", "http://schemas.dmtf.org/wbem/wsman/1/cimbinding/associationFilter");
		filNode.setAttribute("xmlns:wsmb", "http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd");
		
		var assocInsNode = doc.createElement("wsmb:AssociatedInstances");
		
		// Object
		var objNode = this.object.toXMLNode(doc, "wsmb:Object");
		assocInsNode.appendChild(objNode);
		
		// assciation class name
		var acnNode = doc.createElement("wsmb:AssociationClassName");
		acnNode.appendChild(doc.createTextNode(this.associationClassName));
		assocInsNode.appendChild(acnNode);
		
		// Role
		var roleNode = doc.createElement("wsmb:Role");
		roleNode.appendChild(doc.createTextNode(this.role));
		assocInsNode.appendChild(roleNode);
		
		// Result class name
		var resultClassNode = doc.createElement("wsmb:ResultClassName");
		resultClassNode.appendChild(doc.createTextNode(this.resultClassName));
		assocInsNode.appendChild(resultClassNode);
		
		// Result Role
		var resultRoleNode = doc.createElement("wsmb:ResultRole");
		resultRoleNode.appendChild(doc.createTextNode(this.resultRole));
		assocInsNode.appendChild(resultRoleNode);
		
		// Include result property <TBD>
		assocInsNode.appendChild(doc.createElement("wsmb:IncludeResultProperty"));
		
		filNode.appendChild(assocInsNode);
		
		return filNode;
	}
}


// Constructor: Creates an Enumeration with epr and optionally with enumeration context
wsman.Enumeration = function(epr, context)
{
	this.epr = epr;
	if (context)
		this.enumContext = context;
		
	// It has itemBinder property to be set by user to parse the items
	this.itemBinder = null;
	
	wsman.Enumeration.loadSOAPHandlers();
}	
	
wsman.Enumeration.prototype = 
{
	// Enumerate request
	/* ip - a JS object having 
	   		Filter - filter object implementing XMLBinder
	   		EnumerationMode - enumeration mode
	   		callback - function to be called after completion
	*/
	enumerate : function(ip /*filter, enumMode, recvFunc*/)
	{
		this.completed = false;
		
		reqFunc.call(this, {epr:this.epr, Filter:ip.Filter, EnumerationMode:ip.EnumerationMode},
				wsman.Enumeration.createEnumRequest, handleEnumerateResponse, ip.callback);
		
		// handles enumerate response function by storing enumeration context
		function handleEnumerateResponse(resp)
		{
			this.enumContext = resp.enumContext;
			return [ true ];
		}
	},
	
	// pull Items from the enumeration 
	pullItems : function(recv)
	{
		reqFunc.call(this,{epr:this.epr, enumContext:this.enumContext}, 
				wsman.Enumeration.createPullRequest, handlePullResponse, recv);
				
		// handles the Pull request's response
		function handlePullResponse(soapEnv)
		{
			try {
			
				// guess it should check for invalidEnumContext fault & set 
				// this.completed true, but not doing that now as the respHandler
				// function taking care of all faults. It is user's responsibility
				// to handle the fault.

				modDebug("handlePullResponse", "got pull response");

				this.completed = soapEnv.eos;
				modDebug("handlePullResponse", "completed is " + this.completed);

				// parse items
				assert(!this.itemBinder, "No item binder to parse items");
				var items = [ ];
				for (var i = 0; i < soapEnv.itemNodes.length; i++)
				{
					var itemNode = soapEnv.itemNodes.item(i);
					var item = this.itemBinder.toObject(itemNode);
					items.push(item);
				}
			} catch (e) {
				items = e;
			}
			modDebug("handlePullResponse", "after parsing items: " + items);
			return [items, this.completed];
		}
	},

	// release from the enumeration 
	release : function(recv)
	{
		assert(this.completed, "release*** The enumeration is already completed");
		reqFunc.call(this, {epr:this.epr, enumContext:this.enumContext}, 
				wsman.Enumeration.createReleaseRequest, handleReleaseResponse, recv);
	
		// handles the Release request's response
		function handleReleaseResponse(resp)
		{
			// parse ReleaseResponse
			this.completed = true;
			return [true];
		}
	}
}

wsman.Enumeration.createEnumRequest = function(ip) {
	var env = new SOAPEnvelope(ip.epr, ActionURIs.Enumerate);
	env.enumNode  = env.doc.createElement("wsen:Enumerate");
	env.enumNode.setAttribute("xmlns:wsen", namespaces.wsen);
	env.bodyNode.appendChild(env.enumNode);

	if (ip.Filter) {
		env.enumNode.appendChild(ip.Filter.toXMLNode(null, env.doc));
	}

	if (ip.EnumerationMode) {
		var emNode = env.doc.createElement("wsman:EnumerationMode");
		emNode.appendChild(env.doc.createTextNode(ip.EnumerationMode));
		env.enumNode.appendChild(emNode);
	}
	return env;
}

wsman.Enumeration.createPullRequest = function(ip) { 
	
	var env = new SOAPEnvelope(ip.epr, ActionURIs.Pull);
	
	// create Pull node 
	env.pullNode = env.doc.createElement("wsen:Pull");
	env.pullNode.setAttribute("xmlns:wsen", namespaces.wsen);
	env.bodyNode.appendChild(env.pullNode);

	// EnumerationContext node
	var ecNode = env.doc.createElement("wsen:EnumerationContext");
	ecNode.appendChild(env.doc.createTextNode(ip.enumContext));
	env.pullNode.appendChild(ecNode);
	
	return env;
}

wsman.Enumeration.createReleaseRequest = function(ip) { 

	var env = new SOAPEnvelope(ip.epr, ActionURIs.Release);
	
	// create Release node 
	env.releaseNode = env.doc.createElement("wsen:Release");
	env.releaseNode.setAttribute("xmlns:wsen", namespaces.wsen);
	env.bodyNode.appendChild(env.releaseNode);

	// EnumerationContext node
	var ecNode = env.doc.createElement("wsen:EnumerationContext");
	ecNode.appendChild(env.doc.createTextNode(ip.enumContext));
	env.releaseNode.appendChild(ecNode);
	
	return env;
}


wsman.Enumeration.loadSOAPHandlers = function() {
	
	if (wsman.Enumeration.loaded) {
		return;
	}
	
	addSOAPHandler(ActionURIs.EnumerateResponse, {
		parseSOAPEnv : function(env) {
	
			assert(XML.getLocalName(env.bodyNode.firstChild) != "EnumerateResponse", 
					   "Not proper body");
			debugOut("handleEnumerateResponse--- after resp check");
	
			var enumCtxNodes = XML.getElementsByTagNameNS(env.bodyNode.firstChild, namespaces.wsen, "EnumerationContext");
			assert(enumCtxNodes.length != 1, "Not one EnumerationContext node");
			debugOut("handleEnumerateResponse--- after context check");
	
			var enumCtxNode = enumCtxNodes.item(0);
			assert(enumCtxNode.firstChild.nodeType == enumCtxNode.ELEMENT_NODE, 
				   "Not supporting complex EnumerationContext");
			env.enumContext = enumCtxNode.firstChild.nodeValue;
			debugOut("handleEnumerateResponse--- enum context " + env.enumContext);	
		}
	});
	
	addSOAPHandler(ActionURIs.PullResponse, {
		parseSOAPEnv : function(env) {
			env.pullRespNode = env.bodyNode.firstChild;
			assert(XML.getLocalName(env.pullRespNode) != "PullResponse", "Not proper body");
			debugOut("parsePullResponse--- after pull resp check");
			
			// <TBD> error checking
			var itemsNode = XML.getElementsByTagNameNS(env.pullRespNode, namespaces.wsen, "Items").item(0); 
			env.itemNodes = itemsNode.childNodes;
			debugOut("parsePullResponse--- after getting item nodes");
	
			var eosNodes = XML.getElementsByTagNameNS(env.pullRespNode, namespaces.wsen, "EndOfSequence");
			env.eos = (eosNodes.length == 1) ? true : false;
			debugOut("parsePullResponse--- eos is " + env.eos);
		}
	});
	
	wsman.Enumeration.loaded = true;
}



//console.debug("Enumeration.js loading end; " + new Date().getTime());