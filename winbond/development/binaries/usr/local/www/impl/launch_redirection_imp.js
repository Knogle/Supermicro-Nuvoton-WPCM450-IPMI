var g_isadmin = 0;
function doInit()
{
//	exposeElms(['_launchActivex',
//				'_launchJava']);
	exposeElms(['_launchJava']);

	CheckRole();
//	launchActivex.onclick = doLaunchOCX;
}

function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		g_isadmin = 0;
		launchJava.disabled=true;
	}
	else
	{
		g_isadmin = 1;
		launchJava.onclick = doLaunchJava;
	}
}

doLaunchJava = function()
{
	xmit.get({url:"/rpc/WEBSES/validate.asp",onrcv:function(arg)
	{
		if(arg.HAPI_STATUS==0)
		{
			if (g_isadmin)
			{
				top.g_consoleopen = true;
				window.open('/Java/jviewer.jnlp','RemoteConsole','toolbar=0,resizable=yes,width=400,height=110,left=350,top=300')
			}
			else
			{
				alert(eLang.getString('common',"STR_APP_STR_251"));
			}
		}else
		{
			top.gLogout = 1;
			top.location.href = "/sessionexpired.asp";
		}
	},evalit:false});
}
