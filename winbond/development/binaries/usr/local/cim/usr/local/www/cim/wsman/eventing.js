// eventing.js

/* This file contains the eventing related functionality of the library.
   It is responsible for
   2. Subscription objects
   	  a. creating and parsing SOAP req and resp
   	  b. sending them
*/

wsman.loadFile("soap.js");
wsman.loadFile("Enumeration.js");

/**************** createRenewRequest and createUnsubscribeRequest use EPR's refprops node list
add content to soap header which doesnt work properly. because when one of the nodes in 
the list is added to the header, the list's length property decreases by 1. Dunno why???
In current case, where subs manager EPR will contain only one reference parameter, this
will work.
*****************/


/* -------------------- Subscription class implementation ---------------- */

// Constructor for subscriotion class
wsman.Subscription = function(epr)
{
	this.epr = epr;
	this.completed = true;
	
	// eventBinder property stores the binder for events received after subscribing
	// set this before calling "subscribe"
	this.eventBinder = null;
	
	wsman.Subscription.loadSOAPHandlers();
}
	
wsman.Subscription.prototype = 
{
	/*********************************************************************************
	 *
	 * Name			: subscribe
	 * Parameters	: expiryDuration - object of Duration specifying expiry duration
	 				  frequency - frequency in milliseconds
	 				  eventRecvFunc - callback function to be called when events are received.
	 				  				  it will have DOM NodeList object have list of items
	 				  recvFunc - callback function to be called after subscription is made.
	 				  			 it will have a exception parameter stating
	 				  			 whether subscription was successful or not
	 * Description 	: makes a subscription from the WSMAN server
	 * Returns		: NONE
	***********************************************************************************/
	subscribe : function(expiryDuration, frequency, eventRecvFunc, recvFunc)
	{
		assert(!this.completed, "Cannot subscribe: Subscription not completed");
				
		// duration of the subs; 
		this.expiryDuration = expiryDuration;
		this.frequency = frequency;
		
		// storing current time which will be used later to check for expiry
		this.subsTime = new Date();
		
		// function which will be called once events are received
		this.eventRecvFunc = eventRecvFunc;
		
		// create a subscription request and send it
		var ip = { epr:this.epr, expiryDuration : expiryDuration };
		reqFunc.call(this, ip, wsman.Subscription.createSubscribeRequest, handleSubsResponse, recvFunc);
		
		// handles the subscribe response
		function handleSubsResponse(resp)
		{
			try {
				debugOut("handleSubsResponse--- parsed Subs response");	

				// get the subs epr
				this.subsEPR = resp.subsMgrEPR;
				
				try {
					// try parsing it as WSMAN_EPR if possible
					var eprNode = this.subsEPR.eprNode;
					this.subsEPR = new WSMAN_EPR();
					this.subsEPR.parseWSMAN_EPRNode(eprNode);
				} catch (e) {
					// looks like it doesnt have resource uri. hence we will create WSMAN_EPR 
					// with address already parsed and resource uri of epr stored in the object
					this.subsEPR = new WSMAN_EPR(this.subsEPR.address, this.epr.resourceURI,
												 this.epr.selectorSet);
				}

				// parse and store extra ref param and props other than resourceURI and selectorset
				var epr = this.subsEPR;
				epr.others = [ ];

				var getExtraInfo = function(node) {

					if (node == null) {
						return;
					}
					for (var i = 0; i < node.childNodes.length; i++) {

						var childNode = node.childNodes.item(i);
						if (XML.getLocalName(childNode) == "ResourceURI"
							|| XML.getLocalName(childNode) == "SelectorSet") {
							continue;
						}

						var value = "";
						if (childNode.firstChild) {
							assert(childNode.firstChild.nodeType != XML.nodeTypes.TEXT_NODE,
								   "Subs mgr epr containing complex content. Not supporting");
							value = childNode.firstChild.nodeValue;
						}
						epr.others.push({ name : XML.getLocalName(childNode), 
										  namespaceURI : childNode.namespaceURI,
										  value : value
										});
					}
				}
				getExtraInfo(epr.refParamsNode);
				getExtraInfo(epr.refPropsNode);

				// Now, create Enumeration with received context
				this.subsEnum = new wsman.Enumeration(this.subsEPR, resp.enumCtx);
				this.subsEnum.itemBinder = this.eventBinder;

				// not complete as its starting now
				this.completed = false;

				// start a callback function which will be called every "frequency"
				this.subsTime = new Date();
				this.eventsReceived = true;
				this.pullEventsID = window.setInterval(createMethodReference(this, pullEvents), frequency);
				debugOut("handleSubsResponse--- started event pulling");	
				
			} catch (e) {
				return [e];
			}
			return [true];
		}
		
		// this function will be called frequently to pull events from the server	
		function pullEvents()
		{
			modDebug("pullEvents", "this.subsTime: " + this.subsTime);
			// check whether expiry duration has passed
			if ((new Date().getTime() - this.subsTime.getTime()) >= this.expiryDuration.getTime())
			{
				debugOut("pullEvents---- subs expired");
				this.close();
				// inform the user through call back func
				this.eventRecvFunc([], this.completed);
				return;
			}
			
			// pull events through enumeration only if last pull response has been received
			try {
				if (this.eventsReceived) {
					this.eventsReceived = false;
					this.subsEnum.pullItems(createMethodReference(this, itemRecv));
				}
			} catch (e) {
				this.eventRecvFunc(e);
			}
		}
		
		// function called when events are received
		function itemRecv(data)
		{
			// set to true so that events call be pulled
			this.eventsReceived = true;
			debugger
			// something went wrong while pulling events. hence, close the subs
			if (data.exception) {
				this.close();
			}

			debugOut("pullEvents--- Got events data: " + data);
			//debugOut("pullEvents--- eventRecvFunc: " + this.eventRecvFunc);
			this.eventRecvFunc(data, this.completed);
		}
	},
	
	// closes the subs by setting completed to true and cancelling the event poller
	close : function() {
		this.completed = true;
		window.clearInterval(this.pullEventsID);
	},
	
	/*********************************************************************************
	 *
	 * Name			: unsubscribe
	 * Parameters	: recvFunc - callback function that will be called after 
	 				  			 unsubscription is done. it will have a parameter which 
	 				  			 will be a FaultException if service returns a fault
	 				  			 else will be true or false, based on successful parsing
	 * Description 	: unsubscribe from the server
	 * Returns		: NONE
	***********************************************************************************/
	unsubscribe : function(recvFunc)
	{
		assert(this.completed, "unsubscribe-- Cannot unsubscribe completed subscription");
		
		reqFunc.call(this, {epr:this.subsEPR}, wsman.Subscription.createUnsubscribeRequest, 
					 handleUnsubsResponse, recvFunc);
					 
		// handles unsubscribe response 
		function handleUnsubsResponse(resp)
		{
			debugOut("handleUnsubsResponse--- got unsubs response");	
			this.close();
			debugOut("handleUnsubsResponse---- subs usubscribed");
			return [true];
		}
	},
	
	/*********************************************************************************
	 *
	 * Name			: renew
	 * Parameters	: expiryDuration - new expiry duration as Duration object
	 				  recvFunc - callback function that will be called after subs is
	 				  			 renewed. it will have a success boolean 
	 				  			 parameter stating whether renewing was successful or not
	 * Description 	: renew subscription from the server
	 * Returns		: NONE
	***********************************************************************************/
	renew : function(expiryDuration, recvFunc)
	{
		// cannot renew if subs completed
		assert(this.completed, "renew-- Cannot renew completed subscription");
		
		var ip = {epr:this.subsEPR, expiryDuration:expiryDuration};
		reqFunc.call(this, ip, wsman.Subscription.createRenewRequest, 
					 handleRenewResponse, recvFunc);
		
		// handles renew response 
		function handleRenewResponse(resp)
		{
			debugOut("handleRenewResponse--- got renew response");	
			
			// set expiry duration and set subscribing time to now.
			this.subsTime = new Date();
			this.expiryDuration = ip.expiryDuration; // <TBD> should take from response
			debugOut("handleRenewResponse---- subs renewed successfully");
			return [true];
		}
	}
}

wsman.Subscription.createSubscribeRequest = function(ip) {
	
	var env = new SOAPEnvelope(ip.epr, ActionURIs.Subscribe);
	
	// create Subscribe node 
	env.subsNode = env.doc.createElement("wse:Subscribe");
	env.subsNode.setAttribute("xmlns:wse", namespaces.wse);
	env.bodyNode.appendChild(env.subsNode);

	// Pull Delivery node
	var deliveryNode = env.doc.createElement("wse:Delivery");
	deliveryNode.setAttribute("Mode", "http://schemas.xmlsoap.org/ws/2004/08/eventing/DeliveryModes/Pull");
	env.subsNode.appendChild(deliveryNode);

	// Expires Node
	var expNode = env.doc.createElement("wse:Expires");
	expNode.appendChild(env.doc.createTextNode(ip.expiryDuration.toString()));
	env.subsNode.appendChild(expNode);
	
	return env;
}


wsman.Subscription.createRenewRequest = function(ip) {
	
	var env = new SOAPEnvelope(ip.epr, ActionURIs.Renew);
	wsman.Subscription.createHeader(env, ip.epr);

	// create Renew node 
	env.renewNode = env.doc.createElement("wse:Renew");
	env.renewNode.setAttribute("xmlns:wse", namespaces.wse);
	env.bodyNode.appendChild(renewNode);

	// expiry time node
	var expNode = doc.createElement("wse:Expires");
	expNode.appendChild(doc.createTextNode(this.expiryDuration.toString()));
	env.renewNode.appendChild(expNode);
}

wsman.Subscription.createUnsubscribeRequest = function(ip) {
	
	var env = new SOAPEnvelope(ip.epr, ActionURIs.Unsubscribe);
	wsman.Subscription.createHeader(env, ip.epr);
	
	// create Unsubscribe node 
	env.unsubsNode = env.doc.createElement("wse:Unsubscribe");
	env.unsubsNode.setAttribute("xmlns:wse", namespaces.wse);
	env.bodyNode.appendChild(env.unsubsNode);
}

wsman.Subscription.createHeader = function(env, epr) {
	if (!epr.others) 
		return;
	for (var i = 0; i < epr.others.length; i++) {
		var e = epr.others[i];
		var elem = env.doc.createElement(e.name);
		elem.setAttribute("xmlns", e.namespaceURI);
		elem.appendChild(env.doc.createTextNode(e.value));
		env.headerNode.appendChild(elem);
	}
}

wsman.Subscription.loadSOAPHandlers = function() {

	if (wsman.Subscription.loaded)
		return;
	
	addSOAPHandler(ActionURIs.SubscribeResponse, {
		parseSOAPEnv : function(env) {
		
			env.subsRespNode = env.bodyNode.firstChild;
			assert(XML.getLocalName(env.subsRespNode) != "SubscribeResponse", "body not having SubscribeResponse");
			debugOut("SubsResponseParser--- after subs resp node chck");	

			// Get subs manager EPR
			//debugOut("handleSubsResponse--- subsRespNode.firstChild: " + XML.getLocalName(subsRespNode.firstChild) + ", " + subsRespNode.firstChild.namespaceURI);	
			var subsMgrNodes = XML.getElementsByTagNameNS(env.subsRespNode, namespaces.wse, "SubscriptionManager");
			assert(subsMgrNodes.length != 1, "Not one SubscriptionManager node");
			debugOut("SubsResponseParser--- subs mgr chck");	

			// store epr address using wsman.EPR class
			var epr = new wsman.EPR();
			epr.parseEPRNode(subsMgrNodes.item(0));	
			env.subsMgrEPR = epr;
			debugOut("SubsResponseParser--- after parsing epr");	

			// get enumeration context; <TBD> error checking
			var enumCtxNode = XML.getElementsByTagNameNS(env.subsRespNode, namespaces.wsen, "EnumerationContext").item(0);
			env.enumCtx = enumCtxNode.firstChild.nodeValue;
			debugOut("SubsResponseParser--- after getting enum ctx");	
		}
	});
	
	addSOAPHandler(ActionURIs.RenewResponse, {
		parseSOAPEnv : function(env) {
			// RenewResponse node
			env.renewRespNode = bodyNode.firstChild;
			assert(XML.getLocalName(env.renewRespNode) != "RenewResponse", "body not having RenewResponse");
			debugOut("RenewResponseParser--- after renew resp node chck");	

			// Expires
			var expNode = env.renewRespNode.firstChild;
			assert(XML.getLocalName(expNode) != "Expires", "RenewResponse not having expires");
			env.expires = Duration.fromString(expNode.firstChild.nodeValue);
		}
	});
	wsman.Subscription.loaded = true;
}

/* ------------- Duration class implementation ------ */

// currently not supporting months and years as the code will be complex
wsman.Duration = function(days, hours, minutes, seconds)
{
	if (arguments.length != 4)
		throw "All parameters not specified";
	
	this.days = days;
	this.hours = hours;
	this.minutes = minutes;
	this.seconds = seconds;
	
	/* Currently commenting since server is taking duration in different format */
	// returns the string representation of duration (as per duration in XMLSchema)
	this.toString = function()
	{
		var str = "P" + ((this.days != 0) ? this.days : "");
		 		  
		if (this.hours != 0 || this.minutes != 0 || this.seconds != 0) 
			str += "T";
		else
			return str;
		
		str += (((this.hours != 0) ? (this.hours + "H") : "") +
			    ((this.minutes != 0) ? (this.minutes + "M") : "") +
			    ((this.seconds != 0) ? (this.seconds + "S") : ""));
		
		return str;
	}
		
	/*
	// temp version of toString for WSMAN server
	this.toString = function()
	{
		return (this.hours + ":" + this.minutes + ":" + this.seconds);
	}
	*/
	
	// returns the duration as number of milliseconds
	this.getTime = function()
	{
		return ((this.seconds * 1000) + 
			    (this.minutes * 60 * 1000) +
			    (this.hours * 24 * 60 * 1000) +
			    (this.days * 24 * 24 * 60 * 1000));
	}
	return this;
}

// <TBD> to implement
wsman.Duration.fromString = function(str)
{
	return null;
}

// returns function that will call "method" on "object"
function createMethodReference(object, method) {
    return function () {
        method.apply(object, arguments);
    };
}
