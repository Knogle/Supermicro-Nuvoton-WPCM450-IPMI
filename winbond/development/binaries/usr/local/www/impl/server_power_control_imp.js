function doInit()
{
	
	exposeElms(['_statusMsg',
				'_resetSrvr',
				'_iPwrOffSrvr',
				'_oPwrOffSrvr',
				'_pwrOnSrvr',
				'_pwrCycleSrvr',
				'_prfmAction']);
	CheckRole();
	resetSrvr.checked = false;
	iPwrOffSrvr.checked = false;
    oPwrOffSrvr.checked = false;
	pwrOnSrvr.checked = false;
	pwrCycleSrvr.checked = false;
	
	
	
	//first get host power status	
	IPMICMD_GetHostStatus();
	
	resetSrvr.onclick = onreset;
	iPwrOffSrvr.onclick = onpoweroff;
    oPwrOffSrvr.onclick = onsoftpower;
	pwrOnSrvr.onclick = onpoweron;
	pwrCycleSrvr.onclick = onpowercycle;
	
	prfmAction.onclick = IPMICMD_DoPowerAction;
        

}

var current_state;
var action;
var state_to_expect = 0xf; //f is dont care
var MaxRetries = 3;

var UseExternalBMC = 0;
//the rpc name becomes hostctl_bmc 
//for host status we always rely on our PCI 5V detection for now for onload.
//once the user changes it we switch to the appropriate source for now
//laer this will become an auotmatic setting
var hoststatus_rpc_name = "/rpc/hoststatus.asp";
var hostctl_rpc_name = "/rpc/hostctl.asp";

var msgCableChkBMC = eLang.getString('common','STR_APP_STR_404')
var msgCableChkFeature = eLang.getString('common','STR_APP_STR_405')


IPMICMD_GetPowerStatus_Res = function()
{
	showWait(false);
	
	var CmdStatus = WEBVAR_JSONVAR_HL_SYSTEM_STATE.HAPI_STATUS;
	if(CmdStatus != 0)
	{
		alert(eLang.getString('common','STR_APP_STR_406'));
	}
	
	current_state = WEBVAR_JSONVAR_HL_SYSTEM_STATE.WEBVAR_STRUCTNAME_HL_SYSTEM_STATE[0].JF_STATE;
        
       
		
	if(state_to_expect != 0xf)
	{
		if(current_state != state_to_expect)
		{
			
			MaxRetries--;
			showWait(true,eLang.getString('common','STR_APP_STR_201') + MaxRetries);
			if(MaxRetries == 0)
			{
				showWait(false);
				var cblstr = UseExternalBMC ? msgCableChkBMC:msgCableChkFeature;
				if(action == 5)
				{	
					alert(eLang.getString('common','STR_APP_STR_202') + cblstr);
				}
				else
				{
				alert(eLang.getString('common','STR_APP_STR_203') + cblstr);
				}
				return;
			}
			if(action == 5)
				setTimeout("IPMICMD_GetHostStatus()",10000);
			else
				setTimeout("IPMICMD_GetHostStatus()",5000);
			
			return;
		}
	}
		
	if(WEBVAR_JSONVAR_HL_SYSTEM_STATE.WEBVAR_STRUCTNAME_HL_SYSTEM_STATE[0].JF_STATE==0)
	{
		statusMsg.innerHTML = eLang.getString('common','STR_APP_STR_204');
		statusMsg.style.color = '#990000';
		
		resetSrvr.checked = false;
		resetSrvr.disabled = true;
		iPwrOffSrvr.checked = false;
		iPwrOffSrvr.disabled = true;
        oPwrOffSrvr.checked = false;
		oPwrOffSrvr.disabled = true;
		pwrCycleSrvr.checked = false;
		pwrCycleSrvr.disabled = true;
		
		pwrOnSrvr.checked = true;
		pwrOnSrvr.disabled = false;
		action = 1;
		
		MaxRetries = 3;
	}
	else
	{
		statusMsg.innerHTML = eLang.getString('common','STR_APP_STR_205');
		statusMsg.style.color = '#009900';
		resetSrvr.checked = true;
		resetSrvr.disabled = false;
		
		iPwrOffSrvr.checked = false;
		iPwrOffSrvr.disabled = false;
                
        oPwrOffSrvr.checked = false;
		oPwrOffSrvr.disabled = false;
		
		pwrCycleSrvr.checked = false;
		pwrCycleSrvr.disabled = false;
		
		pwrOnSrvr.checked = false;
		pwrOnSrvr.disabled = true;
		
		action = 3;
		
		MaxRetries = 3;
	}
	
	

}

IPMICMD_GetPowerAction_Res = function()
{
	var CmdStatus = WEBVAR_JSONVAR_HL_POWERSTATUS.HAPI_STATUS;
	if(CmdStatus != 0)
	{
		alert(eLang.getString('common','STR_APP_STR_206'));
	}
	else
	{
		                
		showWait(true,eLang.getString('common','STR_APP_STR_207'));
		if(action == 2) 
			inittmout = 20000; //for power cycle we check if host is powered on again after 10 secs
		else if(action == 5)
            inittmout = 30000;
        else
			inittmout = 10000;
		MaxRetries = 3;
                
		setTimeout("IPMICMD_GetHostStatus()",inittmout);
		
	}
}

var action;

IPMICMD_GetHostStatus = function()
{
	
	xmit.get({url:hoststatus_rpc_name,onrcv:IPMICMD_GetPowerStatus_Res, status:''});
}

IPMICMD_DoPowerAction = function()
{

	switch(action)
	{
		case 0:
			state_to_expect = 0;
			break;
		case 1:
			state_to_expect = 1;
			break;
		case 2:
			state_to_expect = 1; //power on after some time I suppose
			break;
		case 3:
			state_to_expect = 1;
			break;
        case 5:
            state_to_expect = 0;
            break;
	}
	
	
	RPC_PowerAction = new xmit.getset({url:hostctl_rpc_name,onrcv:IPMICMD_GetPowerAction_Res});
	RPC_PowerAction.add("WEBVAR_POWER_CMD",action);
	RPC_PowerAction.send();
	
	
}


onreset=function()
{
	action = 3;
	
/*	resetSrvr.checked = true;
	hostctlui.m_elm10.radio().checked = false;
    hostctlui.m_elm3.radio().checked = false;
	hostctlui.m_elm8.radio().checked = false;
	hostctlui.m_elm9.radio().checked = false;
*/
}

onpoweroff = function()
{
	action = 0;
/*	resetSrvr.checked = false;
	hostctlui.m_elm10.radio().checked = true;
    hostctlui.m_elm3.radio().checked = false;
	hostctlui.m_elm8.radio().checked = false;
	hostctlui.m_elm9.radio().checked = false;
*/

}

onsoftpower = function()
{
        action = 5;
/*	resetSrvr.checked = false;
	hostctlui.m_elm10.radio().checked = false;
        hostctlui.m_elm3.radio().checked = true;
	hostctlui.m_elm8.radio().checked = false;
	hostctlui.m_elm9.radio().checked = false;
*/
}

onpoweron =function()
{
	action = 1;
/*	resetSrvr.checked = false;
	hostctlui.m_elm10.radio().checked = false;
        hostctlui.m_elm3.radio().checked = false;
	hostctlui.m_elm8.radio().checked = true;
	hostctlui.m_elm9.radio().checked = false;
*/
}

onpowercycle = function()
{
	action = 2;
/*	resetSrvr.checked = false;
	hostctlui.m_elm10.radio().checked = false;
        hostctlui.m_elm3.radio().checked = false;
	hostctlui.m_elm8.radio().checked = false;
	hostctlui.m_elm9.radio().checked = true;
*/
}






function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if ((WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4) &&
	  (WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 3))   // [Farida] added for Operator access
	{
		g_isadmin = 0;
		alert(eLang.getString('common','STR_APP_STR_315'));
		prfmAction.disabled = true;		
	}
	else
	{
		g_isadmin = 1;
	}
}
