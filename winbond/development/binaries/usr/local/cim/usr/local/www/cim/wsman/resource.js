wsman.loadFile("soap.js");	// for transfer & other operations
wsman.loadFile("Enumeration.js");

// -------- Resource class -------------

wsman.Resource = function(resURI)
{
	this.resourceURI = resURI;
	
	// resourceBinder is to be set by user to parse the resource instance
	this.resourceBinder = null;
}


wsman.Resource.prototype = 
{
	getOperationByActionURI : function(actionURI)
	{
		for (var i = 0; i < this.operations.length; i++) 
		{
			for (var j=0; j < this.operations[i].actionURIs.length; j++)
			{
				if (actionURI == this.operations[i].actionURIs[j])
					return this.operations[i];
			}
		}
		return null;
	},

	getCustomOperation : function()
	{
		for (var i = 0; i < this.operations.length; i++) {
			if (this.operations[i].wsdlPort 
				|| this.operations[i].wsdlRef 
				|| this.operations[i].wsdlLocation)	
				return this.operations[i];
		}
		return null;
	},
	
	transferOperation : function(epr, instance, actionURI, recv)
	{
		assert(this.callback != null, "Another operation is in use");
		
		if (!epr.resourceURI)
			epr.resourceURI = this.resourceURI;
		assert(epr.resourceURI != this.resourceURI, 
	   		   "Transfer*** epr resource URI should be same as res object resourceURI");
		
		var req = new SOAPEnvelope(epr, actionURI);
		this.currAction = actionURI;
		this.currInst = instance;
		this.callback = recv;
		
		// create the req specific stuff
		this.createSOAPEnv(req);

		sendSOAPEnv(req, "handleTransferResponse", this);
	},
	
	getInstance : function(epr, recv) 
	{
		this.transferOperation(epr, null, ActionURIs.Get, recv);	
	},
	
	putInstance : function(epr, instance, recv)
	{
		this.transferOperation(epr, instance, ActionURIs.Put, recv);	
	},
	
	deleteInstance : function(epr, recv)
	{
		this.transferOperation(epr, null, ActionURIs.Delete, recv);	
	},
	
	createInstance : function(epr, instance, recv)
	{
		this.transferOperation(epr, instance, ActionURIs.Create, recv);	
	},
	handleTransferResponse : function(resp)
	{
		var cb = this.callback,
			param = null;
		
		// parse soap resp specific to the operation
		try {
			this.callback = null;
			if (resp.exception) {
				throw resp;
			}
			this.parseSOAPEnv(resp);
			if (this.currAction == ActionURIs.Get)
				param = this.currInst;
			else if (this.currAction == ActionURIs.Delete || this.currAction == ActionURIs.Put)
				param = true;
			else 
				param = this.createEPR;
		} catch (e) {
			param = e;
		}
		cb(param);
	},
	
	enumerateInstances : function(epr, recv)
	{
		if (!epr.resourceURI)
			epr.resourceURI = this.resourceURI;
		assert(epr.resourceURI != this.resourceURI, 
			   "Enumeration*** epr resource URI should be same as res object resourceURI");
		var enu = new wsman.Enumeration(epr);
		var itemsRecv = new Array();
		var thisObj = this;
		enu.enumerate({ Filter : null, EnumerationMode : null, callback : enumResp });

		// called after receiving enumerate response
		function enumResp(success)
		{
			if (success.exception) {
				recv(success);
				return;
			}

			enu.itemBinder = thisObj.resourceBinder;
			enu.pullItems(pullItemsResp);
		}
		
		// called after receiving pull response
		function pullItemsResp(items, completed)
		{
			var params;
			try {
				if (items.exception) {
					throw items;
				}
				//modDebug("pullItemsResp", "enum=" + enu + "; items length = " + items.length);
				itemsRecv = itemsRecv.concat(items);
				if (completed) {
					params = itemsRecv;
				}
				else {
					enu.pullItems(pullItemsResp);
					return;
				}
			} catch (e) {
				params = e;
			}
			recv(params);
		}
	},
	
	createSOAPEnv : function(env) 
	{ 
		// add resource xml in body for put and create request
		if (this.currAction == ActionURIs.Put || this.currAction == ActionURIs.Create)
		{
			assert(this.resourceBinder == null, "resourceBinder property not set by user");
			env.bodyNode.appendChild(this.resourceBinder.toXMLNode(this.currInst, env.doc));
		}
	},
	
	parseSOAPEnv : function(env)
	{
		// parse resource xml for get response
		if (this.currAction == ActionURIs.Get)
		{
			assert(this.resourceBinder == null, "resourceBinder property not set by user");
			this.currInst = this.resourceBinder.toObject(env.bodyNode.firstChild);
			
		}
		// parse resource epr for create response
		else if (this.currAction == ActionURIs.Create)
		{
			var resCreatedNode = env.bodyNode.firstChild;
			assert(XML.getLocalName(resCreatedNode) != "ResourceCreated" 
				   || resCreatedNode.namespaceURI != NS_TRANSFER,
				   "Body first child is not ResourceCreated");
				   
			this.createdEPR = new WSMAN_EPR().parseWSMAN_EPRNode(resCreatedNode.firstChild);
		}
	}
}
