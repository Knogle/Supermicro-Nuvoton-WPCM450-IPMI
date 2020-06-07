function doInit() {
	exposeElms(['_launchJava', '_launchSOL']);
	
	CheckRole();
	launchJava.onclick = doLaunchJava;
	launchSOL.onclick = doLaunchJavaSOL;
	
	return;
}

function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4 &&
		WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 3)   // [Farida] added for Operator access
	{
		g_isadmin = 0;
		alert(eLang.getString('common',"STR_APP_STR_251"));
		launchJava.disabled=true;
		launchSOL.disabled=true;
		document.getElementById("_launchJava").style.color="#888888";
		document.getElementById("_launchJava").style.background="#E9E9DC";
		document.getElementById("_launchSOL").style.color="#888888";
		document.getElementById("_launchSOL").style.background="#E9E9DC";
	}
	else
	{
		g_isadmin = 1;
	}
}

doLaunchJava = function()
{
	window.open('/Java/jviewer.jnlp','RemoteConsole','toolbar=0,resizable=yes,width=400,height=110,left=350,top=300');
}

doLaunchJavaSOL = function()
{
	window.open('/page/SOLapplet.html','SOLConsole','toolbar=0,resizable=yes,width=650,height=500,left=350,top=200');
}

