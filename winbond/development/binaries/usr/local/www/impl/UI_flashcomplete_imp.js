function doInit() {
	showWait(false);

	 // TODO: add page initialization code
	 CheckRole();
	top.g_firmwareupload = false;
	setTimeout('goToLogin()',50000);  // [Farida]
}

function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		//alert(eLang.getString('common','STR_APP_STR_315'));
		location.href = 'sys_info.html';
	}
	else
	{
		parent.frames['header'].enabledisableNavBar(0);
		parent.frames['sidebar'].clearMenus();

		var postflashreset = new xmit.getset({url:"/rpc/postflashreset.asp",onrcv:onreboot});		
		postflashreset.send() ;

	}
}

function goToLogin(){        // [Farida]
    top.location = "login.html";
}

onreboot = function()
{
	//shouldnt come here at all
}