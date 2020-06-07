var alertTable;
var tblJSON;

function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_lblHeader',
	 			'_alertDisplay',
	 			'_modAlert',
	 			'_testAlert',
	 			'_delAlert']);

	vhref=top.document.getElementsByTagName('frameset')[1];
	vcolsa=vhref.cols.split(",");

	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
	
	modAlert.disabled = true;
	testAlert.disabled = true;
	delAlert.disabled = true;

	modAlert.onclick = modifyAlert;
	testAlert.onclick = sendTestAlert;
	delAlert.onclick = doDelAlert;
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		g_isadmin = 0;
		//alert(eLang.getString('common',"STR_APP_STR_110"));
		modAlert.disabled = true;
		testAlert.disabled = true;
		delAlert.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
	loadCustomPageElements();
}

function loadCustomPageElements()
{
/*	alertTable = domapi.Listgrid({
	  x				  : 0,
	  y				  : 0,
	  w				  : (parseInt(document.body.clientWidth)-20), //+parseInt(vcolsa[2])
	  h				  : (parseInt(document.body.clientHeight)-175),
	  headerH		  : 25,
	  doLedgerMode    : false,
	  doColMove       : false,
	  doColSort       : true,
	  doDepress       : true,
	  gridlines       : "both",
	  doAllowEdit     : false,
	  doColResize     : true,
	  linesPerRow     : 1,
	  minColWidth     : 50,
	  doShowHeader    : true,
	  doShowRowbar    : false,
	  doMultiSelect   : false,
	  doVirtualMode   : false,
	  doAllowNoSelect : true,
	  doShowSelection : true 
	});
	
	alertTable.style.position = 'relative';
	//alertTable.style.width = (parseInt(document.body.clientWidth)-20-top.helpFrame.document.body.offsetWidth)+'px';
	
	alertTable.style.background = 'transparent';
	*/
	
	alertTable = listgrid({
		w				: '100%',
		h				: '215px',
		doAllowNoSelect : false
	});
	
	alertDisplay.appendChild(alertTable.table);
	
/* If there is a listgrid embed in the page,
** please don't use resize event directly
** Use only via lGrid.onpageresize event 
*/
	alertTable.onpageresize = function()
	{
		this.table.style.width = '100%';
		this.table.style.width = this.container.header.offsetWidth+'px';
	}
	
	
	tblJSON = {
				cols:[
				{text:eLang.getString('common',"STR_CONF_ALERT_HEAD1"), fieldName:'alertNo', fieldType:2, w:'15%', textAlign:'center'},
				{text:eLang.getString('common',"STR_CONF_ALERT_HEAD2"), fieldName:'alertLevel', w:'35%', textAlign:'center'},
				{text:eLang.getString('common',"STR_CONF_ALERT_HEAD3"), fieldName:'destAddr', w:'47%', textAlign:'center'} 
				]
				};
				
	alertTable.loadFromJson(tblJSON);
	
	alertTable.ontableselect = function()
	{
		if(g_isadmin)
		{
			modAlert.disabled = false;
			testAlert.disabled = false;
			delAlert.disabled = false;
		}
	}
	IPMICMD_HL_GetAllAlertLevels();
	
}

var selectedid = 0;

function IPMICMD_GetLANAlertDests_Res (arg)
{
	showWait(false);
	WEBVAR_JSONVAR_HL_GETLANALERTDESTS.LANALERTDESTARRAY = WEBVAR_JSONVAR_HL_GETLANALERTDESTS.WEBVAR_STRUCTNAME_HL_GETLANALERTDESTS;
	
	var CmdStatus = WEBVAR_JSONVAR_HL_GETLANALERTDESTS.HAPI_STATUS;

	if (CmdStatus == 0)
	{
		LANALERTDESTS_DATA = WEBVAR_JSONVAR_HL_GETLANALERTDESTS.LANALERTDESTARRAY;
		if (LANALERTDESTS_DATA.length == 0)
			alert(eLang.getString('common',"NO_LANALERTDESTS_STRING"));
		//alert("Inside LAN Alert Res");
		RefreshAlertTable();
	}
	else
	{
		errstr = eLang.getString('common','STR_CONFIG_ALERT')
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
}

function IPMICMD_HL_GetLANAlertDests()
{
	RPC_GetLANAlertDests = new xmit.getset({url:"/rpc/getlanalertdests.asp",onrcv:IPMICMD_GetLANAlertDests_Res});
	RPC_GetLANAlertDests.send();
}

function IPMICMD_GetAlertTable_Res()
{
	showWait(false);
	WEBVAR_JSONVAR_HL_GETALERTLEVELS.ALERTLEVELSARRAY = WEBVAR_JSONVAR_HL_GETALERTLEVELS.WEBVAR_STRUCTNAME_HL_GETALERTLEVELS;
	
	var CmdStatus = WEBVAR_JSONVAR_HL_GETALERTLEVELS.HAPI_STATUS;

	if (CmdStatus == 0)
	{
		ALERTTABLE_DATA = WEBVAR_JSONVAR_HL_GETALERTLEVELS.ALERTLEVELSARRAY;
		if (ALERTTABLE_DATA.length == 0)
			alert (eLang.getString('common',"NO_ALERTENTRY_STRING"));
		
		IPMICMD_HL_GetLANAlertDests ();
	}
	else if (GET_ERROR_CODE(CmdStatus) == 0xD4)	//Insufficient privilege level
	{
		alert (eLang.getString('common',"STR_USER_PRIVILEGE"));
		location.href = 'config_nav.html';
	}
	else
	{
		errstr = eLang.getString('common','STR_CONFIG_ALERT_GETVAL')
		errstr += (eLang.getString('common','STR_IPMI_ERROR')+ GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
}

function IPMICMD_HL_GetAllAlertLevels()
	{
	showWait(true);
	RPC_GetAlertTable = new xmit.getset({url:"/rpc/getalertlevels.asp",onrcv:IPMICMD_GetAlertTable_Res});
	RPC_GetAlertTable.send();
	}

function GetAlertLevelStr()
	{
	alertlevelstr="";

	if (alertlevel == 0)
		alertlevelstr = eLang.getString('common','STR_APP_STR_111');
	else if (alertlevel == 1)
		alertlevelstr = eLang.getString('common','STR_APP_STR_112');
	else if (alertlevel == 2)
		alertlevelstr = eLang.getString('common','STR_APP_STR_113');
	else if (alertlevel == 3)
		alertlevelstr = eLang.getString('common','STR_APP_STR_114');
	else if (alertlevel == 4)
		alertlevelstr = eLang.getString('common','STR_APP_STR_115');
	else if (alertlevel == 5)
		alertlevelstr = eLang.getString('common','STR_APP_STR_116');
	}

function RefreshAlertTable()
{
	var j = 0;
	var destIP = 0;
	var JSONRows = new Array();

	alertTable.clear();
	/* Read Alert table now */
	for (j=0;j<ALERTTABLE_DATA.length;j++)
	{
		destIP = eLang.getString('common','STR_APP_STR_117');

		/* Get the destination Selector now */
		destsel = getbits(ALERTTABLE_DATA[j].ChannelDestSel,3,0);
		/* Look for this destination selector in LANALERTDESTS_DATA to get IP */
		for (var k=0;k<LANALERTDESTS_DATA.length;k++)
			{
			if (LANALERTDESTS_DATA[k].SetSel == destsel)
				{
				destIP = LANALERTDESTS_DATA[k].DestAddr;
				if (destIP == "0.0.0.0")
					destIP = eLang.getString('common','STR_APP_STR_117');
				break;
				}
			}

		/* We got the IP. Now work on getting alert level */
		/* Check if this alert policy entry is enabled or not */
		alertlevel = ALERTTABLE_DATA[j].AlertLevel;
		//		if(getbits(ALERTTABLE_DATA[j].AlertNum,3,3) == 0)
		//			alertlevel = 0; /* Alert disabled */
		//		else
		//			alertlevel = getbitsval(ALERTTABLE_DATA[j].AlertNum,7,4);


		GetAlertLevelStr();
		/* Write data to the web page */
		var t=j+1;
		//alertui.m_elm1.addRow("," + t+","+alertlevelstr+","+destIP);
		JSONRows.push({cells:[
						{text:t, value:t},
						{text:alertlevelstr, value:alertlevelstr},
						{text:destIP, value:destIP}
						]});
						

		}

		tblJSON.rows = JSONRows;
		alertTable.loadFromJson(tblJSON);

	lblHeader.innerHTML = eLang.getString('common','STR_APP_STR_118')+(ALERTTABLE_DATA.length)+eLang.getString('common','STR_APP_STR_119');

	//alertui.m_elm1.sortCol(0,0); /* (Column number, Direction) */


	//alert("selectedid = "+selectedid);
	//alertui.m_elm1.selectRow(m_elm1.rows[selectedid]);
	}


function IPMICMDTestAlertResp()
  {
	alert(eLang.getString('common','STR_APP_STR_123'));
  }

function doDelAlert()
{
	if (g_isadmin)
	{
		if (alertTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_125'));
			return;
		}

		if (alertTable.getRow(alertTable.selected[0]).cells[2].innerHTML.indexOf(eLang.getString('common','STR_APP_STR_117'))!=-1)
		{
			alert(eLang.getString('common','STR_APP_STR_125_WARN'));
			return;
		}

		if(!confirm(eLang.getString('common','STR_APP_STR_125_ALERT')))
		{
			return;
		}

		selectedid = parseInt(alertTable.getRow(alertTable.selected[0]).cells[0].innerHTML);

		RPC_Delete = new xmit.getset({url:"/rpc/setalertentry.asp",onrcv:function(){
		alert(eLang.getString('common','STR_APP_STR_125_DELETED'));
		location.reload();
		}});

		RPC_Delete.add("WEBVAR_ALERTINDEX",selectedid);
		RPC_Delete.add("WEBVAR_ALERTLEVEL",'');
		RPC_Delete.add("WEBVAR_DESTADDR",'0.0.0.0');
		RPC_Delete.add("WEBVAR_ALERTTYPE",'');
		RPC_Delete.add("WEBVAR_SUBJECT",'');
		RPC_Delete.add("WEBVAR_MSG",'');
		RPC_Delete.send();
	}
	else
		alert(eLang.getString('common',"STR_APP_STR_110"));
}


function sendTestAlert()
{
	if (g_isadmin)
	{
		if (alertTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_124'));
			return;
		}

		if (alertTable.getRow(alertTable.selected[0]).cells[2].innerHTML.indexOf(eLang.getString('common','STR_APP_STR_117'))!=-1)
		{
			alert(eLang.getString('common','STR_APP_STR_125_WARN'));
			return;
		}

		if (alertTable.getRow(alertTable.selected[0]).cells[1].innerHTML.indexOf(eLang.getString('common','STR_APP_STR_111'))!=-1)
		{
			alert(eLang.getString('common','STR_APP_STR_125_DISABLE'));
			return;
		}

		selectedid = parseInt(alertTable.getRow(alertTable.selected[0]).cells[0].innerHTML);

		RPC_TestAlert = new xmit.getset({url:"/rpc/testalert.asp",onrcv:IPMICMDTestAlertResp});
		RPC_TestAlert.add("WEBVAR_DSTSEL",selectedid);
		RPC_TestAlert.send();
	}
	else
		alert(eLang.getString('common',"STR_APP_STR_110"));
}

function modifyAlert()
{
	if (g_isadmin)
	{
		if (alertTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_125'));
			return;
		}
		else
		{
			selectedid = parseInt(alertTable.getRow(alertTable.selected[0]).cells[0].innerHTML);
			selectedlevel = alertTable.getRow(alertTable.selected[0]).cells[1].innerHTML;
			selectedIP = alertTable.getRow(alertTable.selected[0]).cells[2].innerHTML;
			desturlargs = "?id=" + selectedid + "&level=" + ALERTTABLE_DATA[selectedid-1].AlertLevel + "&ip=" + selectedIP;

			location.href='alert_mod.html'+desturlargs;
		}
	}
	else
	alert(eLang.getString('common',"STR_APP_STR_110"));
}
