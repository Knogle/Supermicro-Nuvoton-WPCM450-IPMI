var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

function doInit()
{
	// TODO: add page initialization code

	exposeElms([
			'_rgName',
			'_rgDomain',
			'_rgPriv',
			'_addBtn',
			'_cancelBtn']);

	CheckRole();
	
	var optind = 0;
	rgPriv.add(new Option("Administrator",4),isIE?optind++:null);
	rgPriv.add(new Option("Operator",3),isIE?optind++:null);
	rgPriv.add(new Option("User",2),isIE?optind++:null);
	rgPriv.add(new Option("Callback",1),isIE?optind++:null);
	rgPriv.add(new Option("No Access",0xf),isIE?optind++:null);

	addBtn.onclick = doaddrolegroup;
	cancelBtn.onclick = function()
	{	
		location.href = 'configure_active_directory.html';
	}
	rgName.focus();
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
		location.href='configure_active_directory.html'
	}
	else
	{
		g_isadmin = 1;
	}
}

function IPMICMD_HL_AddRolegroup_Res()
{
	var CmdStatus = WEBVAR_JSONVAR_ADDROLEGROUP.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		switch(GET_ERROR_CODE(CmdStatus))
		{
			case 0xcc:
				rErrStr = eLang.getString('common','STR_APP_STR_328a');
				alert(rErrStr);
			break;
			default:
				rErrStr = eLang.getString('common','STR_CONFIG_ROLEGROUP_ADDINFO');
				rErrStr += (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
				alert(rErrStr);
			break;
		}
	}
	else
	{
		alert(eLang.getString('common','STR_APP_STR_328'));
		location.href = 'configure_active_directory.html';
	}
	showWait(false);
}

function IPMICMD_HL_AddRoleGroup()
{
	showWait(true);
	RPC_AddRG = new xmit.getset({url:"/rpc/addrolegroup.asp",onrcv:IPMICMD_HL_AddRolegroup_Res});

	RPC_AddRG.add("ROLEGROUP_ID",eExt.parseURLvars("rgindex"));
	RPC_AddRG.add("ROLEGROUP_NAME",rgName.value);
	RPC_AddRG.add("ROLEGROUP_DOMAIN",rgDomain.value);
	RPC_AddRG.add("ROLEGROUP_PRIV",rgPriv.value);
	RPC_AddRG.send();
	delete RPC_AddRG;
}

function doaddrolegroup()
{
	if (!eVal.domainname(rgName.value,0))
	{
		alert(eLang.getString('err',0x05)+eLang.getString('common','STR_APP_STR_HELP'));
		return;
	}
	
	if (!eVal.domainname(rgDomain.value,1))
	{
		alert(eLang.getString('err',0x06)+eLang.getString('common','STR_APP_STR_HELP'));
		return;
	}

	IPMICMD_HL_AddRoleGroup();
}
