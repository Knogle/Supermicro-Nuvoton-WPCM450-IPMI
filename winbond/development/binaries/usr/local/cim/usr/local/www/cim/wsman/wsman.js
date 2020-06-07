// wsman.js

// Main file of wsman JS library which needs to be include in the page using this
// library.

var wsman = { }; // act as a namespace for all functions of this lib

// detect browser
var isFF = false;
var isIE = false;
if (navigator.userAgent.search("Firefox") > -1) {
	isFF = true;
	//alert("FF");
}
else if (navigator.userAgent.search("MSIE") > -1) {
	isIE = true;
	//alert("IE");
}
else
	alert("WSMAN Library could not be loaded: Unsupported browser. " +
		  "Please use later versions of Firefox or Internet Explorer 5+");


wsman.findPath = function() {

	// NOTE:  This function will fail if wsman.js is included with a
	// document.writeln from another file, such as ui.js.  In that case,
	// the src parameter in the script object below will be the path to ui.js.
	// Since this is a fixed application, let's just force it to be
	// the same directory.
	// [BrandonB] 3/30/2007

// 	var scripts = document.getElementsByTagName("script");
// 	for (var i = 0; i < scripts.length; i++) {
// 		var script = scripts.item(i);
// 		var li = script.src.lastIndexOf("wsman.js");
// 		if (li + "wsman.js".length == script.src.length) {
// 			wsman.path = script.src.substring(0, li);
			// wsman lib is loaded. hence, load other modules
// 			wsman.loadOtherFiles();
// 			return true;
// 		}
// 	}
// 	window.setTimeout(wsman.findPath, 100);
// 	return false;
//
// 	wsman.path=location.protocol+"//"+location.host+"/lib/wsman/";
	wsman.path="wsman/";
	wsman.loadOtherFiles();
	wsman.loaded = true;
}

// include helper function to include other files
var filesIncluded = [];


wsman.loadFile = function(filename)
{
	for (var i = 0; i < filesIncluded.length; i++) {
		if (filename == filesIncluded[i])
			return;
	}
	var filePath = wsman.path + filename;
	filesIncluded.push(filename);

	// try loading by DOM
	try {
		var script = document.createElement("script");
		script.setAttribute("src", filePath);
		document.body.appendChild(script);
		//console.debug(filename + " loaded");
	} catch (e) {
		// try the crude way
		try {
			//alert("couldnt load " + filePath + " thru dom; " + e);
			document.writeln('<script type="text/javascript" src="' + filePath + '"></script>');
			//console.debug(filename + " loaded " + new Date().getTime());
		} catch(e2) {
			alert("couldnt load page: " + filePath + "; " + e2);
		}
	}
}

// adding exception attr to add kinds of errors so that it is in sync with our exceptions
Error.prototype.exception = true;

// WSMANException
function WSMANException(message)
{
	this.message = message;
	this.exception = true;

	this.toString = function()
	{
		return this.message;
	}
}

// FaultException: contains fault information like code and details
function FaultException(code, subcode, reason, detail)
{
	this.code = code;
	this.subcode = subcode;
	this.reason = reason;
	this.detail = detail;
	this.exception = true;

	this.message = "SOAP Fault: ".concat(this.code, " (", this.subcode, "), ", this.reason, " (", this.detail, ")");

	this.toString = function()
	{
		return this.message;
	}
}

// assert function: to be called during error condition
function assert(condition, message)
{
	if (condition)
		throw new WSMANException(message);
}

/*----- Following are template funcs used in Enumeration and Subscription class
It fits in situation where a class func does this:
func(userip) {
	// put all user input in ip
	// create soap req using ip
	// check this.callback for another operation currently running
	this.callback = userip.usercallback;
	// send request
	function handleResponse(resp) {
		get specific data from resp, do stuff with this obj & return
		array of values to be passed as arguments to this.callback
	}
}
*/
// creates the soap response handler func with check for exception and callback
// handler should return array of parameters to be passed to callback func
function respHandler(obj, handler) {
	return function(resp) {
		var params;
		try {
			if (resp.exception) {
				throw resp;
			}
			params = handler.apply(obj, [resp]);
		} catch (e) {
			params = [e];
		}
		var cb = obj.callback;
		obj.callback = null;
		cb.apply(null, params);
	}
}

// request function to be called when a soap request is to be generated and sent
function reqFunc(ip, reqCreateFunc, reqHandler, callback) {

	var req = reqCreateFunc(ip);

	// check callback
	assert(this.callback != null, "Please invoke this later. Another operation is in progress");
	this.callback = callback;

	sendSOAPEnv(req, respHandler(this, reqHandler));
}

// include other files
wsman.loadOtherFiles = function() {
	wsman.loadFile("debug.js");
	wsman.loadFile("wsdl.js");
}

wsman.findPath();

//console.debug("wsman.js loading end; " + new Date().getTime());
