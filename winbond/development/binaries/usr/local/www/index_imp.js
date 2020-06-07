var glogout = 0;
var g_userpressedF5 = false;
var gloggedout = 0;
var g_consoleopen = false;
var g_firmwareupload = false;

function doInit() {
	// TODO: add site initialization code
	loadFrames();
}


function application_disconnect(immediatedisconnect)
{
	var stat;
	if (immediatedisconnect==true)
	{
		frames.header.setServer(eLang.getString('common',"STR_GENERAL_NOTCONNECTED"));
		gConnected=false;
		closeConnection();
	}
	else
	{
		if (confirm((g_consoleopen?(eLang.getString('common',"STR_CONSOLE_CONNECTED")+" "):"")+eLang.getString('common',"STR_GENERAL_LOGOUT")+"?"))
		{
			frames.header.setServer(eLang.getString('common',"STR_GENERAL_NOTCONNECTED"));
			gConnected=false;
			closeConnection();
		}
	}
	
	function closeConnection()
	{
		//note that we have to give the full path for the RPC page here since we are still not initialized fully
		xmit.get({url:"/rpc/WEBSES/logout.asp",onrcv:logout_resp, status:''});
	}

	function logout_resp()
	{
		glogout = 1;
		logout_retval = WEBVAR_JSONVAR_WEB_SESSION_LOGOUT.HAPI_STATUS;
		
		if(logout_retval == 0)
		{
			alert(eLang.getString('common',"STR_GENERAL_LOGOUTSUCCESS"));
			document.cookie = "SessionCookie="+"LOGGED_OUT"+";path=/";
			document.location = "/login.asp";
		}
	}
}


function getMethod()
{
	var req;
	if(window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	}else
	{
		if(window.ActiveXObject)
		{
			req = new ActiveXObject('Microsoft.XMLHTTP');
		}else
		{
			req = null;
		}
	}
	return req;
}

var greq = getMethod();

if(greq)
{
	greq.open('get','/rpc/WEBSES/logout.asp');
	greq.setRequestHeader('Content-type','x-www-form-urlencoded');
	greq.onreadystatechange = unload_resp;
}

window.onbeforeunload = function()
{
	if (g_firmwareupload)
	{
		greq.open('get','/rpc/flash_browserclosed.asp');
		greq.setRequestHeader('Content-type','x-www-form-urlencoded');
		greq.onreadystatechange = unload_resp;
		greq.send(null);
		alert("Closing the web session during firmware flash causes device to be restarted.");
	}
	else
	{
		if(!glogout && !g_userpressedF5)
		{
			greq.send(null);
			if (g_consoleopen)
				alert("The current web session and any opened KVM session will be closed");
		}
	}
}

if(navigator.appVersion.indexOf("MSIE 6") !=-1)
{
	window.onunload = function()
	{
		if (g_firmwareupload)
		{
			greq.open('get','/rpc/flash_browserclosed.asp');
			greq.setRequestHeader('Content-type','x-www-form-urlencoded');
			greq.onreadystatechange = unload_resp;
			greq.send(null);
			alert("Closing the web session during firmware flash causes device to be restarted.");
		}
		else
		{
			if(!glogout && !gloggedout && !g_userpressedF5)
			{
				greq.open('get','/rpc/WEBSES/logout.asp');
				greq.setRequestHeader('Content-type','x-www-form-urlencoded');
				greq.onreadystatechange = unload_resp;
				greq.send(null);
				if (g_consoleopen)
					alert("The current web session and any opened KVM session will be closed");
			}
		}
	}
}

function unload_resp()
{
	gloggedout = 1;
}
