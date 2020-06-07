var g_isadmin = 0;
var SMTPCFG_DATA;
function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_mailServerIP',
	 			'_saveBtn']);

	CheckRole();
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
		//alert(eLang.getString('common',"STR_APP_STR_217"));
		saveBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
	doSMTP();
}

function doSMTP()
{
	getSMTPCfg();
	saveBtn.onclick = function()
	{
		if (g_isadmin)
		{
			setSMTPCfg();
		}
		else
			alert(eLang.getString('common',"STR_APP_STR_217"));
	}
}

function getSMTPCfg()
{
	showWait(true);
	RPC_GetSMTP = new xmit.getset({url:"/rpc/getsmtpcfg.asp",onrcv:getSMTPCfg_Res,timeout:10000});
	RPC_GetSMTP.send();
}

function getSMTPCfg_Res()
{
	showWait(false);
	var CmdStatus = WEBVAR_JSONVAR_GETSMTPCFG.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common',"STR_CONFIG_SMTP_GETVAL");
		errstr +=(eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
		return;
	}
	else
	{
		SMTPCFG_DATA = WEBVAR_JSONVAR_GETSMTPCFG.WEBVAR_STRUCTNAME_GETSMTPCFG;
		getSMTP();
	}
}

function getSMTP()
{/*
	if (SMTPCFG_DATA [0].SERVER_IP.indexOf("0.0.0.0") != -1)
		mailServerIP.value = "";
	else
*/
		mailServerIP.value = SMTPCFG_DATA [0].SERVER_IP;
}

function setSMTPCfg()
{
	showWait(true, eLang.getString('common',"STR_PROCESSINGWAIT"));

	if (mailServerIP.value == "" )
	{
		if(confirm(eLang.getString("common","STR_APP_STR_218a")))
		{
			setSMTP("0.0.0.0");
		}
		else
		{
			showWait(false);
			getSMTP();
		}
		return;
	}

	if (!eVal.ip(mailServerIP.value) && mailServerIP.value != "0.0.0.0")
	{
		alert(eLang.getString('common',"STR_APP_STR_ERRIP")+eLang.getString('common','STR_APP_STR_HELP'));
		showWait(false);
		return;
	}
	setSMTP(mailServerIP.value);
}

function setSMTP(SMTPserver)
{
	var p = new xmit.getset({url:'/rpc/setsmtpcfg.asp', onrcv:setSMTPCfg_Res, timeout:10000});
	p.add("SERVER_IP", SMTPserver);
	p.send();
	delete p;
}

function setSMTPCfg_Res()
{
	showWait(false);
	var CmdStatus = WEBVAR_JSONVAR_SETSMTPCFG.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common',"STR_CONFIG_SMTP_SETVAL");
		errstr += (eLang.getString('common','STR_IPMI_ERROR') +GET_ERROR_CODE(CmdStatus));
		alert(errstr);
		return;
	}
	else
	{
		alert(eLang.getString('common',"STR_APP_STR_218"));
	}
}
