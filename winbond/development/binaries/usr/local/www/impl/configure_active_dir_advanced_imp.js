function doInit() {
	 // TODO: add page initialization code
	 exposeElms([
	 		'_enableAD',
	 		'_domainname',
	 		'_timeout',
	 		'_domainaddr1',
	 		'_domainaddr2',
	 		'_domainaddr3',
	 		'_adFileBrowse',
	 		'_adCertStatus',
	 		'_adCertInfo',
	 		'_saveBtn',
	 		'_cancelBtn'
			]);
	CheckRole();
	enableAD.onclick = enableADOptions;
	saveBtn.onclick = doValidateADCfg;
	adFileBrowse.name = "/etc/adcert.pem?16384";

	cancelBtn.onclick = function ()
	{
		location.href = 'configure_active_directory.html';
	}

	document.forms[0].onsubmit = function()
	{
		//alert (adFileBrowse.value);
		return false;
	}
	
	adFileBrowse.onkeydown = function(e)
	{
		if(!e) e = window.event;

		if(e.keyCode!=13 && e.keyCode!=9)
		{
			return false;
		}
	}
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
		saveBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
	xmit.get({url:'/rpc/getactivedircfg.asp', onrcv:getADCfgResp,status:''});
	xmit.get({url:'/rpc/getadcert.asp',onrcv:getADCertResp,status:''});
}

function enableADOptions()
{
	optenable = !enableAD.checked;

	domainname.disabled = optenable;
	timeout.disabled = optenable;
	domainaddr1.disabled = optenable;
	domainaddr2.disabled = optenable;
	domainaddr3.disabled = optenable;
	adFileBrowse.disabled = optenable;

	if (!enableAD.checked)
	{
		domainname.value = adcfg.AD_DOMAINNAME;
		timeout.value = adcfg.AD_TIMEOUT;
		domainaddr1.value = adcfg.AD_DOMAINSRVR1;
		domainaddr2.value = adcfg.AD_DOMAINSRVR2;
		domainaddr3.value = adcfg.AD_DOMAINSRVR3;
		adFileBrowse.value = "";
	}
}

function getADCfgResp()
{
	var cmdstatus;
	cmdstatus = WEBVAR_JSONVAR_GETADCONFIG.HAPI_STATUS;
	if (cmdstatus != 0)
	{
		errstr =  eLang.getString('common','STR_CONFIG_AD_GETINFO');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		adcfg = WEBVAR_JSONVAR_GETADCONFIG.WEBVAR_STRUCTNAME_GETADCONFIG[0];
		enableAD.checked = adcfg.AD_ENABLE?true:false;
		enableADOptions();
		domainname.value = adcfg.AD_DOMAINNAME;
		timeout.value = adcfg.AD_TIMEOUT;
		domainaddr1.value = adcfg.AD_DOMAINSRVR1;
		domainaddr2.value = adcfg.AD_DOMAINSRVR2;
		domainaddr3.value = adcfg.AD_DOMAINSRVR3;
	}
}

var certexists = false;
var certinfo = eLang.getString('common','STR_APP_STR_271');
function getADCertResp()
{
	var adcertcfg = WEBVAR_JSONVAR_GETADCERT.WEBVAR_STRUCTNAME_GETADCERT[0];
	if(WEBVAR_JSONVAR_GETADCERT.HAPI_STATUS == 0)
	{
		if(adcertcfg.CERT_EXISTS == 1)		//New AD Certificate
		{
			certexists = true;
			adCertStatus.innerHTML = eLang.getString("common","STR_APP_STR_339");
			certinfo = convertToLocale(adcertcfg.CERT_INFO);
		}
		else if(adcertcfg.CERT_EXISTS == 2)		//Default AD Certificate
		{
			certexists = false;
			adCertStatus.innerHTML = eLang.getString("common","STR_APP_STR_338");
			certinfo = convertToLocale(adcertcfg.CERT_INFO);
		}
	}
	adCertInfo.innerHTML = certinfo;
}

function doSetADCfg()
{
	showWait(true);
	if (g_isadmin)
	{
		var rpc_adcfg = new xmit.getset({url:'/rpc/setactivedircfg.asp', onrcv:doSetADCfgResp,status:''});

		rpc_adcfg.add("AD_ENABLE", enableAD.checked?1:0);
		rpc_adcfg.add("AD_DOMAINNAME", domainname.value);
		rpc_adcfg.add("AD_TIMEOUT", timeout.value);
		rpc_adcfg.add("AD_DOMAINSRVR1", domainaddr1.value);
		rpc_adcfg.add("AD_DOMAINSRVR2", domainaddr2.value);
		rpc_adcfg.add("AD_DOMAINSRVR3", domainaddr3.value);
		rpc_adcfg.send();
		delete rpc_adcfg;
	}
	else
		alert(eLang.getString('common',"STR_APP_STR_330"));
}

function doSetADCfgResp()
{
	showWait(false);
	var CmdStatus = WEBVAR_JSONVAR_SETADCONFIG.HAPI_STATUS;
	if(CmdStatus)
	{
		errstr =  eLang.getString('common','STR_CONFIG_AD_SETINFO');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		if (!doSetADCert())
		{
			alert(eLang.getString('common','STR_APP_STR_331'));
			location.href = 'configure_active_directory.html';
		}
	}
}

function doSetADCert()
{
	if (g_isadmin)
	{
		if (adFileBrowse.value.length == 0)
			return false;

		if(certexists)
		{
			if(!confirm(eLang.getString('common','STR_APP_STR_340')))
				return;
		}

		var form = adFileBrowse.form;
		if (form.tagName == 'FORM')
		{
			form.action = 'configure_active_directory.html';
			alert(eLang.getString('common','STR_APP_STR_331'));
			form.submit();
		}
	}
	else
		alert(eLang.getString('common',"STR_APP_STR_330"));
	return true;
}

function doValidateADCfg()
{
	if(enableAD.checked)
	{
		if(!eVal.domainname(domainname.value,1))
		{
			alert(eLang.getString('common','STR_APP_STR_332') + eLang.getString('common','STR_APP_STR_HELP'));
			domainname.focus();
			return false;
		}
		timoutval = parseInt(timeout.value);
		if(!eVal.isnumstr(timeout.value) || (timoutval < 15) || (timoutval > 300))
		{
			alert(eLang.getString('common','STR_APP_STR_333') + eLang.getString('common','STR_APP_STR_HELP'));
			timeout.focus();
			return false;
		}

		if ((domainaddr1.value == "") && (domainaddr2.value == "") && (domainaddr3.value == ""))
		{
			alert(eLang.getString('common','STR_APP_STR_337'));
			domainaddr1.focus();
			return false;
		}
		if (domainaddr1.value != "")
		{
			if (!eVal.ip(domainaddr1.value))
			{
				alert(eLang.getString('common','STR_APP_STR_334') + eLang.getString('common','STR_APP_STR_HELP'));
				domainaddr1.focus();
				return false;
			}
		}
		if (domainaddr2.value != "")
		{
			if (!eVal.ip(domainaddr2.value))
			{
				alert(eLang.getString('common','STR_APP_STR_335') + eLang.getString('common','STR_APP_STR_HELP'));
				domainaddr2.focus();
				return false;
			}
		}
		if (domainaddr3.value != "")
		{
			if (!eVal.ip(domainaddr3.value))
			{
				alert(eLang.getString('common','STR_APP_STR_336') + eLang.getString('common','STR_APP_STR_HELP'));
				domainaddr3.focus();
				return false;
			}
		}
		if( !eVal.endsWith(adFileBrowse.value, ".pem") && (adFileBrowse.value.length != 0))
		{
			alert(eLang.getString('common','STR_APP_STR_306'));
			return false;
		}
	}
	doSetADCfg();
	return true;
}
