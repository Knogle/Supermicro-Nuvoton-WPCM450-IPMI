// network.js

// Provides cross-platform networking functions through XMLHttpRequest object

var STATE_COMPLETE = 4;
var STATUS_OK = 200;

/*
  Currently, hard coding timeout feature as a global param which needs
  to be manually modified by a user
*/
var timeout = 1 * 3600 * 1000;		// 1 minutes (in milliseconds)

function SendPOSTRequest(uri, content, headers, func)
{
	var xmlObj = null;
	var completed = false, id;

	function processChange()
	{
		//debugOut("onreadystatechange---- inside");
		// if response was received properly
		if (xmlObj.readyState == STATE_COMPLETE) 
		{
			if (!completed) {
				completed = true;
				clearTimeout(id);
				debugOut("timeout cleared");
			}
			else {
				return;
			}
			
			//debugOut("SendPOSTRequest---- got resp: " + xmlObj.responseText);
			if (xmlObj.status == STATUS_OK) 
			{
				func(xmlObj.responseText);
			}
			else
			{
				func(new WSMANException("Network: couldn't receive response: " + xmlObj.statusText));
			}
		}
		
	}

	try {
		xmlObj = CreateXMLHttpObject(processChange);
	} catch (e) {
		throw new WSMANException("Network: Couldnt create XMLHttpRequest Object: " + e.message);
	}
	debugOut("SendPOSTRequest--- sending to uri: " + uri);
	xmlObj.open("POST", uri, true);

	// add extra headers
	for (var i = 0; i < headers.length; i++) {
		xmlObj.setRequestHeader(headers[i].name, headers[i].value);
	}
	
	// set timeout callback
	id = setTimeout(function() {
		if (!completed) {
			completed = true;
			xmlObj.abort();
			debugOut("timeout occured");
			func(new WSMANException("Network: Request timed out"));
		}
	}, timeout);

	xmlObj.send(content);
	debugOut("SendPOSTRequest--- sent to uri: " + uri);
}

function SendGETRequest(uri, func)
{
	var xmlObj = null;

	function processChange()
	{
		//debugOut("onreadystatechange---- inside");
		// if response was received properly
		if (xmlObj.readyState == STATE_COMPLETE) 
		{
			if (xmlObj.status == STATUS_OK) 
			{
				//debugOut("onreadystatechange---- got file <textarea cols=50 rows=20>" + xmlObj.responseText + "</textarea>");
				func(xmlObj.responseText);
			}
			else
			{
				//alert("SendGETRequest***** couldn't receive response");
				func(new WSMANException("SendGETRequest*** couldn't receive response: " + xmlObj.statusText));
			}
		}
	}

	try {
		xmlObj = CreateXMLHttpObject(processChange);
	} catch (e) {
		throw new WSMANException("SendPOSTRequest*** Couldnt create XMLHttpRequest Object: " + e.message);
	}
	
	xmlObj.open("GET", uri + "?" + new Date().getTime().toString(), true);
	xmlObj.send("");
	modDebug("SendGETRequest", "sent req to uri: " + uri);
}

// cross platform XMLHttpRequest object
function CreateXMLHttpObject(reqChangeFunc)
{
	var req = null;
	
	// branch for IE/Windows ActiveX version
	if (isIE) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
			req.onreadystatechange = reqChangeFunc;
		} catch(e) {
			req = new ActiveXObject("Microsoft.XMLHTTP");
			req.onreadystatechange = reqChangeFunc;
		}
	}
	// firefox
	else if (isFF) {
		req = new XMLHttpRequest();
		req.onload = reqChangeFunc;
		//req.overrideMimeType('text/xml');
	}

	return req;
}

