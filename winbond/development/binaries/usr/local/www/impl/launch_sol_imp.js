function doInit()
{

	exposeElms(['_launchSOL']);

	
	CheckRole();
	
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
		WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 3 )  // [Farida] added for Operator
	{
		alert(eLang.getString('common',"STR_APP_STR_251"));
		launchSOL.disabled=true;
		launchSOL.innerHTML = "";
	}
}


doLaunchJavaSOL = function()
{
	window.open('/page/SOLapplet.html','SOLConsole','toolbar=0,resizable=yes,width=650,height=500,left=350,top=200');
}

