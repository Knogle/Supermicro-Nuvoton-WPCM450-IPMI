var DEBUG = false;
//var DEBUG = alert;
var debugWnd = null;

if (DEBUG == true) {
	//debugWnd = window.showModelessDialog("javascript:document.writeln('<h1>Debug Window</h1><br/>')");
	//debugWnd = window.showModelessDialog("debug.html",null,"resizable:yes;scroll:yes;center:no;dialogLeft:800;dialogTop:100;dialogHeight:20;dialogWidth:15");
	
	if (window.opener)
		debugWnd = window.opener.debugWnd;
	/*
	alert(window.top.frames.length);
	for (var i = 0; i < window.top.frames.length; i++)
	{
		var wnd = window.top.frames[i];
		if (wnd.document.title == "Debug Window") {
			debugWnd = wnd;
		}
	}
	*/
	
	if (debugWnd == null)
		debugWnd = window.open(wsman.path + "debug.html", null,
							  "height=600,width=700,resizable=yes," + 
							  "status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes");
    window.focus();
} 

function debugOut(str, xmlText)
{
	if (DEBUG == alert)
	{
		alert(str);
		return;
	}
	
	/*
	var funcText = debugOut.caller.toString();
	var index = funcText.indexOf("(");
	var funcName = funcText.substring(9, index);
	*/
	
	// make xmlText displayable; thanks to Brandon :-)
	if (xmlText)
		xmlText = xmlText.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>").replace(/\t/g,"&nbsp;");
	
	try {
		var op = (xmlText) ? (str + "<pre>" + xmlText + "</pre>") : str;
		debugWnd.document.writeln(op + '</br>');
		debugWnd.scrollTo(0, debugWnd.document.body.scrollHeight);
	} catch(e) {
		//alert("debugOut --- Error occured");
	}
}

function debugSOAPRequest(request)
{
	try {
		request = request.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>").replace(/\t/g,"&nbsp;");
		var id = "resp" + new Date().getTime().toString();
		var html = "<table border=1 width='750px'>" + 
				   "<tr><td valign=top nowrap=no style='overflow:scroll;width:200px'><pre>" + 
				   request + "</pre></td><td valign=top width='200px' nowrap=no id='" + 
				   id + "'></td></tr></table>";
		debugWnd.document.writeln(html);
		debugWnd.scrollTo(0, debugWnd.document.body.scrollHeight);
		return id;
	}
	catch (e) {
		// dont do anything
	}
}

function debugSOAPResponse(id, response)
{
	try {
		var td = debugWnd.document.getElementById(id);
		response = response.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>").replace(/\t/g,"&nbsp;");
		td.innerHTML = "<pre>" + response + "</pre>";
		debugWnd.scrollTo(0, debugWnd.document.body.scrollHeight);
	}
	catch (e) {
		// dont do anything
	}
}


function modDebug(module, str, xmlText)
{
	if (DEBUG == alert)
	{
		alert(str);
		return;
	}
	
	try {
		if (xmlText)
			xmlText = xmlText.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>").replace(/\t/g,"&nbsp;");
		var op = (xmlText) ? (str + "<pre>" + xmlText + "</pre>") : str;
		debugWnd.document.writeln(module + "--- " + op + '</br>');
		debugWnd.scrollTo(0, debugWnd.document.body.scrollHeight);
	} catch(e) {
		//alert("debugOut --- Error occured");
	}
}
