function doInit()
{
	exposeElms(['_curMode',
				'_description',
				'_extBMCUnit',
				'_bmcSlaveAddr',
				'_btnSave',
				'_btnChangeMode']);	

	CheckRole();
		

	curMode.disabled = true;
	showWait(true);
	xmit.get({url:"/rpc/getpmcpfilestat.asp",onrcv:ProcessPMCPFileStat,status:''});	
	
	btnSave.onclick = onSave;
	btnChangeMode.onclick = onChangeMode;
	

}



var g_CurMode;
var g_PMCPFilesAlreadyPresent = 0;



onSave = function()
{
	if(g_CurMode == "external_bmc")
	{
		if(confirm(eLang.getString('common','STR_APP_STR_209')))
		{
			//send commands to save things.
			var p = new xmit.getset({url:'/rpc/setextbmccfg.asp', onrcv:SetExtBMC_Res});
			
			p.add("PRESENT", 1);
			p.add("SLAVE_ADDRESS", bmcSlaveAddr.value);
				
			p.send();
			delete p;
		}
		else
		{
			return false;
		}
	}
	else
	{
		if(g_PMCPFilesAlreadyPresent)
		{
			if(confirm(eLang.getString('common','STR_APP_STR_210')))
			{
				document.location = "upload_softproc.html";
			}
			else
			{
				return false;
			}
		}
		else
		{
			document.location = "upload_softproc.html";
		}
	}                                               
}

onChangeMode = function()
{
	if(g_CurMode == "external_bmc")
	{
		if(confirm(eLang.getString('common','STR_APP_STR_211')))
		{
			document.location = "upload_softproc.html";	
		}
		else
		{
			return false;
		}
	}
	else
	{
		//we are currently on direct monitoring
		if(confirm(eLang.getString('common','STR_APP_STR_212')))
		{
			//let us configure the card to go to external BMC and then reload this page
			//send commands to save things.
			var p = new xmit.getset({url:'/rpc/setextbmccfg.asp', onrcv:SetExtBMC_Res});
			
			p.add("PRESENT", 1);
			p.add("SLAVE_ADDRESS", 0x20);
				
			p.send();
			delete p;
			
			
		}
		else
		{
			return false;
		}
		
	}
}


ProcessExtBMCCfg = function()
{
	showWait(false);
	resp = WEBVAR_JSONVAR_EXTERNAL_BMC_CONFIG.WEBVAR_STRUCTNAME_EXTERNAL_BMC_CONFIG[0];
	
	if(resp['PRESENT'] == 0)
	{
		g_CurMode = "pmcp";
		if(g_PMCPFilesAlreadyPresent)
		{
			curMode.innerHTML = eLang.getString('common','STR_APP_STR_213');
			description.innerHTML = eLang.getString('common','STR_APP_STR_401');
			btnSave.value = eLang.getString('common','STR_APP_STR_214');
		}
		else
		{
			curMode.innerHTML = eLang.getString('common','STR_APP_STR_213');
			description.innerHTML = eLang.getString('common','STR_APP_STR_402');
			btnSave.value = eLang.getString('common','STR_APP_STR_214');			
		}
		if(g_isadmin) btnSave.disabled = false;
		extBMCUnit.style.visibility = "hidden";

	}	
	else
	{
		g_CurMode = "external_bmc";
		curMode.innerHTML = eLang.getString('common','STR_APP_STR_215');
		description.innerHTML = eLang.getString('common','STR_APP_STR_403');
		bmcSlaveAddr.value = "0x" +  resp['SLAVE_ADDRESS'].toString( 16 );
		if( g_isadmin) btnSave.disabled = false;
		btnSave.value = "Save";
	}
	
	description.style.width = "550px";
}

ProcessPMCPFileStat = function()
{
	showWait(false);
	pmcpfilestat = WEBVAR_JSONVAR_PMCP_FILE_STATUS.WEBVAR_STRUCTNAME_PMCP_FILE_STATUS[0];
	
	if(!pmcpfilestat['SPBIN_PRESENT'] || !pmcpfilestat['SDRDAT_PRESENT'] || !pmcpfilestat['SPBIN_VALID'] || !pmcpfilestat['SDRDAT_VALID'])
	{
		g_PMCPFilesAlreadyPresent = 0;		
	}
	else
	{
		g_PMCPFilesAlreadyPresent = 1;		
	}
	
	xmit.get({url:"/rpc/getextbmccfg.asp",onrcv:ProcessExtBMCCfg,status:''});
	
}


SetExtBMC_Res = function()
{
	document.location = "monitoring_mode.html";	
}


/***********************Role Checking functions*********************/
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
		alert(eLang.getString('common','STR_APP_STR_216'));
		btnSave.disabled = true;
		btnChangeMode.disabled = true;
		
	}
	else
	{
		g_isadmin = 1;
	}
}