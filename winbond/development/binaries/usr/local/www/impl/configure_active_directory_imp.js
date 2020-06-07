var RG_DATA;
function doInit() {
	 // TODO: add page initialization code
	 exposeElms([
	 		'_adDesc',
	 		'_roleGroupListHolder',
	 		'_lblHeader',
	 		'_addBtn',
	 		'_modBtn',
	 		'_delBtn'
			]);
	CheckRole();

	addBtn.onclick = doAddRoleGroup;
	modBtn.onclick = doModifyRoleGroup;
	delBtn.onclick = doDelRoleGroup;
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
		addBtn.disabled = true;
		modBtn.disabled = true;
		delBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
	xmit.get({url:'/rpc/getactivedircfg.asp',onrcv:getADCfgResp,status:''});
	loadCustomPageElements();
	IPMICMD_HL_GetAllRoleGroupInfo();
}

function loadCustomPageElements()
{
	roleGroupListTable = listgrid({
		w				: '100%',
		h				: '125px',
		doAllowNoSelect : false
	});
	roleGroupListHolder.appendChild(roleGroupListTable.table);
	
/* If there is a listgrid embed in the page,
** please don't use resize event directly
** Use only via lGrid.onpageresize event 
*/
	roleGroupListTable.onpageresize = function()
	{
		this.table.style.width = '100%';
		this.table.style.width = this.container.header.offsetWidth+'px';
	}
	
	try
	{
		tblJSON = {cols:[
			{text:eLang.getString('common',"AD_Strings1"), fieldName:'rg_id', fieldType:2, w:'10%', textAlign:'center'},
			{text:eLang.getString('common',"AD_Strings2"), fieldName:'rg_name', w:'25%', textAlign:'center'},
			{text:eLang.getString('common',"AD_Strings3"), fieldName:'rg_domain', w:'35%', textAlign:'center'} ,
			{text:eLang.getString('common',"AD_Strings4"), fieldName:'rg_priv', w:'30%', textAlign:'center'}
			]};
				
		roleGroupListTable.loadFromJson(tblJSON);
	}catch(e)
	{
		alert(e);
	}

	roleGroupListTable.ontableselect = function ()
	{
		if((g_isadmin) && (WEBVAR_JSONVAR_GETADCONFIG.WEBVAR_STRUCTNAME_GETADCONFIG[0].AD_ENABLE))
		{
			addBtn.disabled=false;
			modBtn.disabled=false;
			delBtn.disabled=false;
		}
	}
}

function IPMICMD_HL_GetAllRoleGroupInfo()
{
	addBtn.disabled=true;
	modBtn.disabled=true;
	delBtn.disabled=true;

	showWait(true);
	xmit.get({url:"/rpc/getallrolegroupcfg.asp",onrcv:IPMICMD_GetAllRoleGroupInfo_Res, status:''});
}

function IPMICMD_GetAllRoleGroupInfo_Res()
{
	var JSONRows = new Array();
	showWait(false);

	var CmdStatus = WEBVAR_JSONVAR_GETALLROLEGROUPCFG.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr =  eLang.getString('common','STR_CONFIG_USER_GETINFO');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		roleGroupListTable.clear();
		RG_DATA = WEBVAR_JSONVAR_GETALLROLEGROUPCFG.WEBVAR_STRUCTNAME_GETALLROLEGROUPCFG;

		var tUsrCnt = 0;
		for (i=0;i<RG_DATA.length;i++)
		{
			// Use ~ char to indicate free slot so it will sort alphabetically
			rgnametodisplay = (RG_DATA[i].ROLEGROUP_NAME == "")?"~":RG_DATA[i].ROLEGROUP_NAME;
			rgdomaintodisplay = (RG_DATA[i].ROLEGROUP_DOMAIN == "")?"~":RG_DATA[i].ROLEGROUP_DOMAIN;
			rgprivtodisplay = (RG_DATA[i].ROLEGROUP_PRIVILEGE)?IPMIPrivileges[RG_DATA[i].ROLEGROUP_PRIVILEGE]:"~";
			if(rgnametodisplay!='~') tUsrCnt++;
	
			try{
				JSONRows.push({cells:[
					{text:RG_DATA[i].ROLEGROUP_ID, value:RG_DATA[i].ROLEGROUP_ID},
					{text:rgnametodisplay, value:rgnametodisplay},
					{text:rgdomaintodisplay, value:rgdomaintodisplay},
					{text:rgprivtodisplay, value:rgprivtodisplay}
					]});
			}
			catch(e)
			{
				alert(e);
			}
		}

		tblJSON.rows = JSONRows;
		roleGroupListTable.loadFromJson(tblJSON);
		lblHeader.innerHTML = eLang.getString('common','STR_ROLE_GROUP_CNT')+tUsrCnt+eLang.getString('common','STR_BLANK');
	}
}

function getADCfgResp()
{
	var cmdstatus,adcfg;
	cmdstatus = WEBVAR_JSONVAR_GETADCONFIG.HAPI_STATUS;
	if (cmdstatus != 0)
	{
		alert ("Error");
	}
	else
	{
		adcfg = WEBVAR_JSONVAR_GETADCONFIG.WEBVAR_STRUCTNAME_GETADCONFIG[0];
		if (adcfg.AD_ENABLE)
		{
			adDesc.innerHTML = eLang.getString('common','STR_CONFIG_ADENABLE_DESC');
		}
		else
		{
			adDesc.innerHTML = eLang.getString('common','STR_CONFIG_ADDISABLE_DESC');
		}
	}
}

function doAddRoleGroup()
{
	if (g_isadmin)
	{
		if (roleGroupListTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_321'));
		}
		else
		{
			selectedid = parseInt(roleGroupListTable.getRow(roleGroupListTable.selected[0]).cells[0].innerHTML);
			selectedname = RG_DATA[selectedid - 1].ROLEGROUP_NAME;
			if (selectedname != "")
			{
				if (confirm(eLang.getString('common','STR_APP_STR_323')))
				{
					desturlargs = "?rgindex=" + selectedid + "&rgname=" + selectedname + "&rgdomain=" + RG_DATA[selectedid - 1].ROLEGROUP_DOMAIN + "&rgpriv=" + RG_DATA[selectedid - 1].ROLEGROUP_PRIVILEGE;
					location.href='activedir_mod_rolegroup.html'+desturlargs;
				}
			}
			else
			{
				desturlargs = "?rgindex=" + selectedid;
				location.href='activedir_add_rolegroup.html'+desturlargs;
			}
		}
	}
	else
		alert (eLang.getString('common','STR_APP_STR_322'));
}

function doModifyRoleGroup()
{
	if (g_isadmin)
	{
		if (roleGroupListTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_321'));
		}
		else
		{
			selectedid = parseInt(roleGroupListTable.getRow(roleGroupListTable.selected[0]).cells[0].innerHTML);
			
			selectedname = RG_DATA[selectedid - 1].ROLEGROUP_NAME;
			if (selectedname == "")
			{
				if (confirm(eLang.getString('common','STR_APP_STR_324')))
				{
					desturlargs = "?rgindex=" + selectedid;
					location.href='activedir_add_rolegroup.html'+desturlargs;
				}
			}
			else
			{
				desturlargs = "?rgindex=" + selectedid + "&rgname=" + selectedname + "&rgdomain=" + RG_DATA[selectedid - 1].ROLEGROUP_DOMAIN + "&rgpriv=" + RG_DATA[selectedid - 1].ROLEGROUP_PRIVILEGE;
				location.href='activedir_mod_rolegroup.html'+desturlargs;
			}
		}
	}
	else
		alert (eLang.getString('common','STR_APP_STR_322'));
}

function doDelRoleGroup()
{
	if (g_isadmin)
	{
		if (roleGroupListTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_321'));
		}
		else
		{
			selectedid = parseInt(roleGroupListTable.getRow(roleGroupListTable.selected[0]).cells[0].innerHTML);
			if (RG_DATA[selectedid - 1].ROLEGROUP_NAME == "")
			{
				alert (eLang.getString('common','STR_APP_STR_325'));
			}
			else
			{
				if (confirm(eLang.getString('common','STR_APP_STR_326')))
				{
					IPMICMD_DeleteRolegroup(selectedid);
				}
			}
		}
	}
	else
		alert (eLang.getString('common','STR_APP_STR_322'));
}

function IPMICMD_DeleteRolegroup(rgid)
{
	showWait(true);
	RPC_DelUser = new xmit.getset({url:"/rpc/delrolegroup.asp",onrcv:IPMICMD_HL_DelUser_Res});
	RPC_DelUser.add("ROLEGROUP_ID",rgid);
	RPC_DelUser.send();
}

function IPMICMD_HL_DelUser_Res()
{
	var CmdStatus = WEBVAR_JSONVAR_DELROLEGROUP.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_ROLEGROUP_DELINFO');
		errstr +=  (eLang.getString('common','STR_IPMI_ERROR') +GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		alert(eLang.getString('common','STR_APP_STR_327'));
		IPMICMD_HL_GetAllRoleGroupInfo();
	}
}
