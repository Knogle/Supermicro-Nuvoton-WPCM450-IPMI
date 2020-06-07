function doInit() {
	exposeElms(['_optioncontainer',
 				'_refreshlinktd',
 				'_refreshlink',
 				'_optionlogout']);
}

function disconnect()
{
	// Code to disconnect from current server
	var chkActiveConsole = xmit.get({url:"/rpc/getactiveconsolestatus.asp",onrcv:function(arg)
	{
		if(arg.HAPI_STATUS==0)
		{
			top.g_consoleopen = WEBVAR_JSONVAR_CONSOLE_STATUS.WEBVAR_STRUCTNAME_CONSOLE_STATUS[0].ConsoleStatus;
		}
		parent.application_disconnect(false);	// In index_imp.js
		fnCookie.erase('loadPage');
	}});
}


function clearMenus()
{
	optioncontainer.innerHTML = '';
	refreshlinktd.innerHTML = '';
	optionlogout.innerHTML = '';
}
