function doInit() {
	 // TODO: add page initialization code
	//first check what the reason is for us to be in the login page
	var validate_prevlogin = xmit.get({url:"/rpc/WEBSES/validate.asp",onrcv:validate_prevlogin_resp, status:''});
	document.getElementById('login_username').focus();
	
	//clear previous lastpage cookies
	
	fnCookie.erase('lastNav');
	fnCookie.erase('lastPage');
	fnCookie.erase('lItem');
	fnCookie.erase('lastHiLit');
}

var errorcodes = new Array();
errorcodes[9] = eLang.getString('common','STR_LOGINERRORCODE_9'); //fresh browser window
errorcodes[8] = eLang.getString('common','STR_LOGINERRORCODE_8'); //logged out properly and cookie is set to logged out
errorcodes[7] = eLang.getString('common','STR_LOGINERRORCODE_7');
errorcodes[6] = errorcodes[5] = errorcodes[4] = eLang.getString('common','STR_LOGINERRORCODE_4');
errorcodes[3] = eLang.getString('common','STR_LOGINERRORCODE_3');
errorcodes[2] = eLang.getString('common','STR_LOGINERRORCODE_2');
errorcodes[1] = eLang.getString('common','STR_LOGINERRORCODE_1');





var DoLogin = function()
{
	//note that we have to give the full path for the RPC page here since we are still not initialized fully
	var login_rpc = xmit.getset({url:"/rpc/WEBSES/create.asp",onrcv:login_resp, status:'',timeout:60});
	login_rpc.add("WEBVAR_USERNAME",document.getElementById('login_username').value);
	login_rpc.add("WEBVAR_PASSWORD",document.getElementById('login_password').value);
	login_rpc.send();
	return false;

}

var login_resp = function()
{

	login_retval = WEBVAR_JSONVAR_WEB_SESSION.HAPI_STATUS;

	if(login_retval != 0)
	{
		document.getElementById('msglbl').innerHTML = eLang.getString('common','STR_LOGINERRORCODE_7');
		//document.getElementById('login_username').value = "";
		document.getElementById('login_password').value = "";
		document.getElementById('login_password').focus();

		return;
	}
	login_cookie = WEBVAR_JSONVAR_WEB_SESSION.WEBVAR_STRUCTNAME_WEB_SESSION[0].SESSION_COOKIE;
	document.cookie = "SessionCookie="+login_cookie+";path=/";
	document.cookie = "Username=" + document.getElementById('login_username').value + ";path=/";
	document.location = "/index.html";


}


var validate_prevlogin_resp = function()
{

	errcod = WEBVAR_JSONVAR_WEB_SESSION_VALIDATE.HAPI_STATUS;
	if(errcod != 0 || errorcodes[errcod] != undefined)
	{
		//alert(errcod + " " + errorcodes[errcod]);
		document.getElementById('msglbl').innerHTML = errorcodes[errcod];
	}
}

document.onkeypress = function(e)
{
	if(!e) e = window.event;
	
	if(e.keyCode==13)
	{
		DoLogin();
	}
}
