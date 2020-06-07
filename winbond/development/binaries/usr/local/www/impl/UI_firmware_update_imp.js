var g_isadmin = 0;
function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_updateBtn']);
	CheckRole();
	 updateBtn.onclick = doEnterUpgrade;
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
		//alert(eLang.getString('common','STR_APP_STR_315'));
		updateBtn.disabled = true;		
	}
	else
	{
		g_isadmin = 1;
	}
}


doEnterUpgrade = function()
{
	if (g_isadmin)
	{
		if(!confirm(eLang.getString('common','STR_APP_STR_224')))
			return;
			
		showWait(true);
		updateBtn.disabled = true;
		parent.frames['header'].enabledisableNavBar(0);
		parent.frames['sidebar'].clearMenus();
		updateBtn.onclick = function() {};		
		var p = new xmit.getset({url:'/rpc/prepflash.asp', onrcv:onReceive,timeout:60});
		p.send();
		top.g_firmwareupload = true;
	}
	else
		alert(eLang.getString('common','STR_APP_STR_315'));	
}


function onReceive (arg)
{
	
	showWait(false);
	if(WEBVAR_JSONVAR_PREPAREFLASH.HAPI_STATUS)
	{
		//Display the error code and proper message here...
		switch(WEBVAR_JSONVAR_PREPAREFLASH.HAPI_STATUS)
		{
			case 4:
				alert(eLang.getString('common','STR_APP_STR_414'));
				break;
			default:
				alert(eLang.getString('common','STR_APP_STR_225'));
			break;
		}
		//window.close();
	}
	else
	{
		location.href='UI_firmware_upload.html';
		//location.href='sp_fwverify.htm';
	}
}
