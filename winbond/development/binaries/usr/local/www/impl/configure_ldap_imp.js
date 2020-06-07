function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_enableLDAP',
	 			'_port',
	 			'_ipAddr',
	 			'_bindPwd',
	 			'_bindDN',
	 			'_searchBase',
	 			'_saveBtn']);
	 			
 	CheckRole();
	enableLDAP.onclick = onCheck;
	saveBtn.onclick = doSetLDAPCfg;
	showWait(true);
	xmit.get({url:"/rpc/getldapconfig.asp",onrcv:ProcessGetLDAPCfg, status:''});
	 
}


var g_isadmin = 0;
function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		g_isadmin = 0;
		//alert(eLang.getString('common','STR_APP_STR_100'));
		saveBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
}



function ProcessGetLDAPCfg (arg)
{
	showWait(false);

	var CmdStatus = WEBVAR_JSONVAR_HL_GETLDAPCONFIG.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_LDAP_GETVAL');
		errstr +=(eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
		return;
	} 
	else 
	{
		LDAPCFG_DATA = WEBVAR_JSONVAR_HL_GETLDAPCONFIG.WEBVAR_STRUCTNAME_HL_GETLDAPCONFIG;
		if (LDAPCFG_DATA.length > 0)
		{
			if(LDAPCFG_DATA[0].ENABLE)
			{
				enableLDAP.checked = true;
				onEnable();
			}
			else
			{
				enableLDAP.checked = false;
				onDisable();
			}
			
			port.value = LDAPCFG_DATA [0].PORTNUM;
			ipAddr.value = LDAPCFG_DATA [0].IP;
			bindPwd.value = "";
			bindDN.value = LDAPCFG_DATA [0].BINDDN;
			searchBase.value = LDAPCFG_DATA [0].SEARCHBASE;
		}
		else
			alert (eLang.getString('common','STR_APP_STR_102'));
	}
}

SetLDAPCfg_Res = function()
{
	var CmdStatus = WEBVAR_JSONVAR_HL_SETLDAPCONFIG.HAPI_STATUS;
	if(CmdStatus)
	{
		//Display the error code and proper message here...
		//eLang.ErrorAlert(WEBVAR_JSONVAR_HL_SETLDAPCONFIG.HAPI_STATUS,eLang.getString('common','STR_APP_STR_164'));
		errstr =  eLang.getString('common','STR_APP_STR_164');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		alert(eLang.getString('common','STR_APP_STR_103'));
	}
}

function doSetLDAPCfg()
{
	if (g_isadmin)
	{
		//Check validity of all the fields
		if (enableLDAP.checked == true) 
		{
			if(port.value.length == 0)
			{
				alert(eLang.getString('common','STR_APP_STR_104'));
				return;
			}
			if (!eVal.ip(ipAddr.value)) 
			{
				alert(eLang.getString('common','STR_APP_STR_ERRIP')+eLang.getString('common','STR_APP_STR_HELP'));
				return;
			}
			if(bindPwd.value.length < 4)
			{
				alert(eLang.getString('common','STR_APP_STR_106'));
				return;
			}
			if(bindPwd.value.length > 32)
			{
				alert(eLang.getString('common','STR_APP_STR_107'));
				return;
			}
			if(bindDN.value.length == 0)
			{
				alert(eLang.getString('common','STR_APP_STR_108'));
				return;
			}
			if(searchBase.value.length == 0)
			{
				alert(eLang.getString('common','STR_APP_STR_109'));
				return;
			}
		}

		var p = new xmit.getset({url:'/rpc/setldapconfig.asp', onrcv:SetLDAPCfg_Res});

		if (enableLDAP.checked == true)
			p.add("ENABLE", 1);
		else
			p.add("ENABLE", 0);

		p.add("PORTNUM", port.value);
		p.add("IP", ipAddr.value);
		p.add("PASSWORD", bindPwd.value);
		p.add("BINDDN", bindDN.value);
		p.add("SEARCHBASE", searchBase.value);
		
		p.send();
		delete p;
	}
	else
		alert(eLang.getString('common',"STR_APP_STR_100"));
}

function onDisable()
{
	port.disabled = true;
	ipAddr.disabled = true;
	bindPwd.disabled = true;
	bindDN.disabled = true;
	searchBase.disabled = true;
		
	port.enabled = false;
	ipAddr.enabled = false;
	bindPwd.enabled = false;
	bindDN.enabled = false;
	searchBase.enabled = false;
}

function onEnable()
{
	port.disabled = false;
	ipAddr.disabled = false;
	bindPwd.disabled = false;
	bindDN.disabled = false;
	searchBase.disabled = false;
		
	port.enabled = true;
	ipAddr.enabled = true;
	bindPwd.enabled = true;
	bindDN.enabled = true;
	searchBase.enabled = true;

	ipAddr.focus();
}

function onCheck()
{
	if (enableLDAP.checked == true)
		onEnable();
	else
		onDisable();
}
