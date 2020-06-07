var G_SUPPORT_VLAN_IFC;

//var g_lanlbl = ['eth0', 'eth1'];	//multilan support
var LANCFG_DATA;
function doInit() {
	// TODO: add page initialization code

	exposeElms([//'_lanChannel',			//multilan support
	 			'_macAddress',
	 			'_optDHCP',
	 			'_optStatic',
	 			'_ipAddress',
	 			'_subnetMask',
	 			'_gateway',
	 			'_primaryDNS',
	 			'_secondDNS',
	 			'_vlanenablerow',
				'_vlanenable',
				'_vlantagrow',
				'_vlantag',
	 			'_save']);
	 			
	CheckRole();		
	optDHCP.onclick = onDHCP;
	optStatic.onclick = onStatic;
	save.onclick = doSetLANCfg;

	showWait(true);
	xmit.get({url:'/rpc/getvlansupport.asp',onrcv:GetVLANSupportRes,status:''});
	//lanChannel.onchange =	IPMICMD_HL_GetNetworkInfo;	//multilan support
	//IPMICMD_HL_GetLanChannel ();				//multilan support
	IPMICMD_HL_GetNetworkInfo();
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
		//alert(eLang.getString('common','STR_APP_STR_137'));
		save.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
}

function ProcessNWFunctioncall (arg)
{
	onDisableControls ();

	var CmdStatus = WEBVAR_JSONVAR_HL_GETLANCONFIG.HAPI_STATUS;
	if (GET_ERROR_CODE(CmdStatus) == 0xD4)	//Insufficient privilege level
	{
		alert (eLang.getString('common',"STR_USER_PRIVILEGE"));
		location.href = 'config_nav.html';
	}
	else if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_NW_GETVAL');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
		return;
	}
	else
	{
		LANCFG_DATA = WEBVAR_JSONVAR_HL_GETLANCONFIG.WEBVAR_STRUCTNAME_HL_GETLANCONFIG;
		if (LANCFG_DATA.length > 0)
		{
			macAddress.value = LANCFG_DATA [0].MAC;
			ipAddress.value = LANCFG_DATA [0].IP;
			subnetMask.value = LANCFG_DATA [0].Mask;
			gateway.value = LANCFG_DATA [0].Gateway;
			primaryDNS.value = LANCFG_DATA [0].PrimaryDNS;
			secondDNS.value = LANCFG_DATA [0].SecondaryDNS;
			if (G_SUPPORT_VLAN_IFC)
			{
				if (LANCFG_DATA [0].VLanEnable)
				{
					vlanenable.checked = true;
					vlantag.value = LANCFG_DATA [0].VLANID;
				}
				else
				{
					vlanenable.checked = false;
					if(LANCFG_DATA [0].VLANID)
						vlantag.value = LANCFG_DATA [0].VLANID;
					else						
					vlantag.value = '';
				}
				doEnablevlan();
			}

			if (getbits (LANCFG_DATA[0].IPAddrSource,3,0) == 0x01)		// Static
			{
				onStatic();
			}
			else if (getbits (LANCFG_DATA[0].IPAddrSource,3,0) == 0x02)	//DHCP
			{
				onDHCP();
			}
		}
		else
			alert (eLang.getString('common','STR_APP_STR_138'));
	}
	showWait(false);
}

function IPMICMD_SetLANCfg_Res()
{
	var CmdStatus = WEBVAR_JSONVAR_HL_SETLANCONFIG.HAPI_STATUS;
	if(CmdStatus==0xDE)
	{
		alert(eLang.getString('common','STR_CONF_NETWORK_INVALID_GATEWAY'));
		save.disabled=false;
		return;
	}
	if(CmdStatus)
	{
		errstr =  eLang.getString('common','STR_CONFIG_NW_GETVAL');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		alert(eLang.getString('common','STR_APP_STR_139'));
	}
	save.disabled = false;
}

function Timedout()
{
	alert(eLang.getString('common','STR_APP_STR_140'));
	save.disabled = false;
}

function doSetLANCfg()
{
	if (g_isadmin)
	{
		var err = 0;
		var str = '';
		//Check validity of all the fields
		if (optDHCP.checked == false)
		{
			if (!eVal.ip(ipAddress.value))
			{
				err = 1; 
				str += '\n- '+eLang.getString('common','STR_APP_STR_143');
			}
			if (!eVal.ip(subnetMask.value))
			{
				err = 1; 
				str += '\n- '+eLang.getString('common','STR_APP_STR_144');
			}
			var ipv = (new String(gateway.value)).split(".");
			if (!((ipv.length == 4)&&(ipv[0]==0)&&(ipv[1]==0)&&(ipv[2]==0)&&(ipv[3]==0)))
			{
				if (!eVal.ip(gateway.value))
				{
					err = 1; 
					str += '\n- '+eLang.getString('common','STR_APP_STR_145');
				}
			}
			if ((primaryDNS.value != "" ) && (!eVal.ip(primaryDNS.value)))
			{
				err = 1; 
				str += '\n- '+eLang.getString('common','STR_APP_STR_145a');
			}
			if ((secondDNS.value != "" ) && (!eVal.ip(secondDNS.value)))
			{
				err = 1; 
				str += '\n- '+eLang.getString('common','STR_APP_STR_145b');
			}
			if (err)
			{
				alert(eLang.getString('common','STR_APP_STR_141')+str+'\n'+eLang.getString('common','STR_APP_STR_HELP'));
				save.disabled = false;
				return;
			}
		}
		if (G_SUPPORT_VLAN_IFC)
		{
			if (vlanenable.checked)
			{
				if ((vlantag.value == "") || (!eVal.isnumstr(vlantag.value)) || (parseInt(vlantag.value) < 2) || (parseInt(vlantag.value) > 4095))
				{
					alert (eLang.getString('common','STR_APP_STR_VLAN_ERR') +"\n" + eLang.getString('common','STR_APP_STR_HELP'));
					return;
				}
			}
			else
			{
				if ((vlantag.value != "") && (!eVal.isnumstr(vlantag.value)) || (parseInt(vlantag.value) < 2) || (parseInt(vlantag.value) > 4095))
				{
					alert (eLang.getString('common','STR_APP_STR_VLAN_ERR') +"\n" + eLang.getString('common','STR_APP_STR_HELP'));
					return;
				}
			}
		}

		if (((ipAddress.value != LANCFG_DATA[0].IP)&&(optDHCP.checked == false))||(optDHCP.checked == true))
		{
			if (confirm(eLang.getString('common','STR_APP_STR_400'))==false)
			{
				save.disabled = false;
				return;
			}
		}

		/* Disable the button here till the request is served */
		save.disabled=true;

		var p = new xmit.getset({url:'/rpc/setnwconfig.asp', onrcv:IPMICMD_SetLANCfg_Res, ontimeout:Timedout});
		//p.add("Channel", lanChannel.value);		//multilan support

		if (G_SUPPORT_VLAN_IFC)
		{
			if (vlanenable.checked)
			{
				p.add("EnableVLAN",1);
				p.add("VLANTag",vlantag.value);
			}
			else
			{
				p.add("EnableVLAN",0);
				if (vlantag.value != "")
					p.add("VLANTag",vlantag.value);
				else
				p.add("VLANTag",0);
			}
		}

		if (optDHCP.checked == true)		// DHCP
		{
			p.add("IPAddrSource", 0x02);
		}
		else					//Static
		{
			p.add("IPAddrSource", 0x01);
			p.add("IP", ipAddress.value);
			p.add("Mask", subnetMask.value);
			p.add("Gateway", gateway.value);
			p.add("PrimaryDNS",primaryDNS.value);
			p.add("SecondaryDNS",secondDNS.value);
		}
		p.send();
		delete p;
	}
	else
		alert(eLang.getString('common','STR_APP_STR_137'));
}

function onDHCP()
{
	optDHCP.checked = true;
	optStatic.checked = false;

	ipAddress.disabled = true;
	subnetMask.disabled = true;
	gateway.disabled = true;
	primaryDNS.disabled = true;
	secondDNS.disabled = true;
}

function onStatic()
{
	optDHCP.checked = false;
	optStatic.checked = true;

	ipAddress.disabled = false;
	subnetMask.disabled = false;
/*	if(G_SUPPORT_VLAN_IFC)
	{
		if (vlanenable.checked)
		{
			gateway.value = '0.0.0.0';
			gateway.disabled = true;
		}
		else
		{
			gateway.value = LANCFG_DATA[0].Gateway;
			gateway.disabled = false;
		}
	}
	else
*/
	gateway.disabled = false;
	primaryDNS.disabled = false;
	secondDNS.disabled = false;
}

function onDisableControls ()
{
	optDHCP.checked = true;
	optStatic.checked = false;

	ipAddress.disabled = true;
	subnetMask.disabled = true;
	gateway.disabled = true;
	primaryDNS.disabled = true;
	secondDNS.disabled = true;
}

function doEnablevlan()
{
	if(G_SUPPORT_VLAN_IFC)
	{
		vlantag.disabled = (!vlanenable.checked);
		if (optStatic.checked)
			onStatic();
	}
}

/*
//multilan support
function IPMICMD_HL_GetLanChannel()
{
	showWait(true);
	xmit.get({url:'/rpc/getlanchannelinfo.asp',onrcv:IPMICMD_GetLanChannelRes,status:''});
}

function IPMICMD_GetLanChannelRes()
{
	var CmdStatus = WEBVAR_JSONVAR_GETLANCHANNELINFO.HAPI_STATUS;
	var j=0;
	if(CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_APP_STR_101');
		errstr += GET_ERROR_CODE_STR(CmdStatus);
		alert(errstr);
	}
	else
	{
		LANCHANNELINFO = WEBVAR_JSONVAR_GETLANCHANNELINFO.WEBVAR_STRUCTNAME_GETLANCHANNELINFO;
		optind = 0;				
		for (i=0;i<LANCHANNELINFO.length;i++)
		{
			if(!LANCHANNELINFO[i].CHANNEL_NUM)
				continue;
			lanChannel.add(new Option(g_lanlbl[j++],LANCHANNELINFO[i].CHANNEL_NUM), window.ActiveXObject?optind++:null);
		}
		IPMICMD_HL_GetNetworkInfo();
	}
}
*/

function GetVLANSupportRes()
{
	var CmdStatus = WEBVAR_JSONVAR_GETVLANSUPPORT.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_NW_GETVLANSUPPORT');
		errstr += GET_ERROR_CODE_STR(CmdStatus);
		alert (errstr);
	}
	else
	{
		G_SUPPORT_VLAN_IFC = WEBVAR_JSONVAR_GETVLANSUPPORT.WEBVAR_STRUCTNAME_GETVLANSUPPORT[0].VLAN_SUPPORT;
		if (G_SUPPORT_VLAN_IFC)
		{
			vlanenablerow.style.display = "";
			vlantagrow.style.display = "";
			vlanenable.onclick = doEnablevlan;
		}
		else
		{
			vlanenablerow.style.display = "none";
			vlantagrow.style.display = "none";
		}
	}
}

function IPMICMD_HL_GetNetworkInfo()
{
	showWait(true);
	RPC_GetNetworkInfo = new xmit.getset({url:"/rpc/getnwconfig.asp",onrcv:ProcessNWFunctioncall});
//	RPC_GetNetworkInfo.add("CHANNEL_NUM",lanChannel.value);		//multilan support
	RPC_GetNetworkInfo.send();
	delete RPC_GetNetworkInfo;
}
