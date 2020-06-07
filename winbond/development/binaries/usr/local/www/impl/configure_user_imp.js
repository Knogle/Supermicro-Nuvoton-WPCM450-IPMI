var usrListTable;
var tblJSON;
var str = '';
var level = 0;
var g_loggedin_user_delerror = 0x846;

function doInit() {
	 // TODO: add page initialization code
	 
	 exposeElms(['_usrListHolder',
	 			'_addUser',
	 			'_modUser',
	 			'_delUser',
	 			'_lblHeader']);
	 			
	 vhref=top.document.getElementsByTagName('frameset')[1];
	 vcolsa=vhref.cols.split(",");
	 
	 CheckRole();
	 
	 addUser.onclick = doAddUser;
	 modUser.onclick = doModifyUser;
	 delUser.onclick = doDelUser;
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
		//alert(eLang.getString('common','STR_APP_STR_315'));
		addUser.disabled = true;
		modUser.disabled = true;
		delUser.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
	loadCustomPageElements();
	IPMICMD_HL_GetAllUserInfo();
}


function loadCustomPageElements()
{
/*	usrListTable = domapi.Listgrid({
	  x				  : 0,
	  y				  : 0,
	  w				  : (parseInt(document.body.clientWidth)-20), //+parseInt(vcolsa[2])
	  h				  : (parseInt(document.body.clientHeight)-180),
	  headerH		  : 25,
	  doLedgerMode    : false,
	  doColMove       : false,
	  doColSort       : true,
	  doDepress       : true,
	  gridlines       : "both",
	  doAllowEdit     : false,
	  doColResize     : true,
	  linesPerRow     : 1,
	  minColWidth     : 150,
	  doShowHeader    : true,
	  doShowRowbar    : false,
	  doMultiSelect   : false,
	  doVirtualMode   : false,
	  doAllowNoSelect : true,
	  doShowSelection : true 
	});
	
	usrListTable.style.position = 'relative';
	//usrListTable.style.width = (parseInt(document.body.clientWidth)-20+parseInt(top.helpFrame.document.body.offsetWidth))+'px';
	
	usrListTable.style.background = 'transparent';
	*/
	
	usrListTable = listgrid({
		w				: '100%',
		h				: '215px',
		doAllowNoSelect : false
	});
	usrListHolder.appendChild(usrListTable.table);
	
/* If there is a listgrid embed in the page,
** please don't use resize event directly
** Use only via lGrid.onpageresize event 
*/
	usrListTable.onpageresize = function()
	{
		this.table.style.width = '100%';
		this.table.style.width = this.container.header.offsetWidth+'px';
	}
	
	try{
	
	tblJSON = {
				cols:[
				{text:eLang.getString('common',"eLanguage_Strings4"), fieldName:'user_id', fieldType:2, w:'15%', textAlign:'center'},
				{text:eLang.getString('common',"eLanguage_Strings5"), fieldName:'user_name', w:'45%', textAlign:'center'},
				{text:eLang.getString('common',"eLanguage_Strings6"), fieldName:'nw_priv', w:'39%', textAlign:'center'} /*,
				{text:eLang.getString('common',"eLanguage_Strings7"), fieldName:'srl_priv'}*/
				]
				};
				
	usrListTable.loadFromJson(tblJSON);
	}catch(e)
	{
		alert(e);
	}

	usrListTable.ontableselect = function ()
	{
		if(g_isadmin)
		{
			addUser.disabled=false;
			modUser.disabled=false;
			delUser.disabled=false;
			if(this.selected.length)
			{
				selectedid = parseInt(usrListTable.getRow(usrListTable.selected[0]).cells[0].innerHTML);
				selusername = this.getRow(this.selected[0]).cells[1].innerHTML.replace('&nbsp;','').replace(' ','');
				if((fnCookie.read("Username") == selusername) || (1 == selectedid) || (2 == selectedid))
					delUser.disabled = true;
			}
		}
	}
}


function IPMICMD_HL_GetAllUserInfo()
{
	addUser.disabled=true;
	modUser.disabled=true;
	delUser.disabled=true;

	showWait(true);
	xmit.get({url:"/rpc/getalluserinfo.asp",onrcv:IPMICMD_GetAllUserInfo_Res, status:''});
}

function IPMICMD_GetAllUserInfo_Res (arg)
{
	var JSONRows = new Array();
	
	showWait(false);
	WEBVAR_JSONVAR_HL_GETALLUSERINFO.USERINFOARRAY = WEBVAR_JSONVAR_HL_GETALLUSERINFO.WEBVAR_STRUCTNAME_HL_GETALLUSERINFO;	
	
	var CmdStatus = WEBVAR_JSONVAR_HL_GETALLUSERINFO.HAPI_STATUS;
	if (GET_ERROR_CODE(CmdStatus) == 0xD4)	//Insufficient privilege level
	{
		alert (eLang.getString('common',"STR_USER_PRIVILEGE"));
		location.href = 'config_nav.html';
	}
	else if (CmdStatus != 0)
	{
		errstr =  eLang.getString('common','STR_CONFIG_USER_GETINFO');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		usrListTable.clear();
		ALLUSERINFO_DATA = WEBVAR_JSONVAR_HL_GETALLUSERINFO.USERINFOARRAY;
		
		var tUsrCnt = 0;
		
		for (i=0;i<ALLUSERINFO_DATA.length;i++)
		{
			// Use ~ char to indicate free slot so it will sort alphabetically
			usernametodisplay = (ALLUSERINFO_DATA[i].UserName == "")?"~":ALLUSERINFO_DATA[i].UserName;
	
			if(usernametodisplay!='~') tUsrCnt++;
	
			try{
			JSONRows.push({cells:[
						{text:(i+1), value:(i+1)},
						{text:usernametodisplay, value:usernametodisplay},
						{text:InterpretPrivileges(ALLUSERINFO_DATA[i].PrivLimit_Network), value:InterpretPrivileges(ALLUSERINFO_DATA[i].PrivLimit_Network)}/*,
						{text:InterpretPrivileges(ALLUSERINFO_DATA[i].PrivLimit_Serial), value:InterpretPrivileges(ALLUSERINFO_DATA[i].PrivLimit_Serial)}*/
						]});
			}catch(e)
			{
				alert(e);
			}
		}
		
		tblJSON.rows = JSONRows;
		
		usrListTable.loadFromJson(tblJSON);
		
		lblHeader.innerHTML = eLang.getString('common','STR_USR_MGMT_CNT')+tUsrCnt+eLang.getString('common','STR_USR_MGMT_SFX');
	}
	
}

function InterpretPrivileges(privbyte)
{
	var privlevel = getbits(privbyte,3,0);
	if (privbyte==0xf) {
		// Use ~ char to indicate free slot so it will sort alphabetically
		return "~";
	} else {
		return IPMIPrivileges[privlevel];
	}
}


function doModifyUser()
{
	if (g_isadmin)
	{
		if (usrListTable.selected.length != 1) {
			alert(eLang.getString('common','STR_APP_STR_290'));
			return;
		} else {
			//we need to get the exact value of user id
			selectedid = parseInt(usrListTable.getRow(usrListTable.selected[0]).cells[0].innerHTML);
			selectedname = usrListTable.getRow(usrListTable.selected[0]).cells[1].innerHTML;
			selectednwpriv = getbits(ALLUSERINFO_DATA[selectedid-1].PrivLimit_Network,3,0);
			selectedserialpriv = getbits(ALLUSERINFO_DATA[selectedid-1].PrivLimit_Serial,3,0);

			if (ALLUSERINFO_DATA[selectedid-1].UserName == "") {
				if (confirm(eLang.getString('common','STR_APP_STR_291'))) {
					desturlargs = "?userindex=" + selectedid;
					location.href='user_add.html'+desturlargs;
				}
			} else {
				desturlargs = "?userindex=" + selectedid +"&username=" + selectedname + "&nwpriv=" + selectednwpriv + "&serialpriv=" + selectedserialpriv;;
				location.href='user_mod.html'+desturlargs;
			}
		}
	}
	else
		alert(eLang.getString('common','STR_APP_STR_289'));
}

function doAddUser()
{
	if (g_isadmin)
	{
		if (usrListTable.selected.length != 1) {
			alert(eLang.getString('common','STR_APP_STR_292'));
		} else {
			//we need to get the exact value of user id
			selectedid = parseInt(usrListTable.getRow(usrListTable.selected[0]).cells[0].innerHTML);
			selectedname = usrListTable.getRow(usrListTable.selected[0]).cells[1].innerHTML;
			selectednwpriv = usrListTable.getRow(usrListTable.selected[0]).cells[2].innerHTML;
			selectedserialpriv = usrListTable.getRow(usrListTable.selected[0]).cells[2].innerHTML;

			if (ALLUSERINFO_DATA[selectedid-1].UserName != "") {
				if (confirm(eLang.getString('common','STR_APP_STR_293'))) {
					selectednwpriv = getbits(ALLUSERINFO_DATA[selectedid-1].PrivLimit_Network,3,0);
					selectedserialpriv = getbits(ALLUSERINFO_DATA[selectedid-1].PrivLimit_Serial,3,0);
					desturlargs = "?userindex=" + selectedid +"&username=" + selectedname + "&nwpriv=" + selectednwpriv + "&serialpriv=" + selectedserialpriv;
					location.href='user_mod.html'+desturlargs;
				}
			} else {
				desturlargs = "?userindex=" + selectedid;
				location.href='user_add.html'+desturlargs;
			}
		}
	}
	else
		alert(eLang.getString('common','STR_APP_STR_289'));
}


function doDelUser()
{
	if (g_isadmin)
	{
		if (usrListTable.selected.length != 1)
		{
			alert(eLang.getString('common','STR_APP_STR_294'));
		}
		else
		{
			//we need to get the exact value of user id
			selectedid = parseInt(usrListTable.getRow(usrListTable.selected[0]).cells[0].innerHTML);
			selectedname = usrListTable.getRow(usrListTable.selected[0]).cells[1].innerHTML.replace('&nbsp;','').replace(' ','');

			if (ALLUSERINFO_DATA[selectedid-1].UserName == "")
			{
				alert(eLang.getString('common','STR_APP_STR_296'));
			}
			else
			{
				if (confirm(eLang.getString('common','STR_APP_STR_297')))
				{
					showWait(true);
					IPMICMD_HL_DelUser(selectedid,selectedname);
				}
			}
		}
	}
	else
		alert(eLang.getString('common','STR_APP_STR_289'));
}



function IPMICMD_HL_DelUser(userid, username)
{
	RPC_DelUser = new xmit.getset({url:"/rpc/deluser.asp",onrcv:IPMICMD_HL_DelUser_Res});

	RPC_DelUser.add("WEBVAR_USERINDEX",userid);
	RPC_DelUser.add("WEBVAR_USERNAME",username);
	RPC_DelUser.send();
	delete RPC_DelUser;
}

function IPMICMD_HL_DelUser_Res()
{
	var CmdStatus = WEBVAR_JSONVAR_HL_DELUSER.HAPI_STATUS;
	showWait(false);
	if (CmdStatus == g_loggedin_user_delerror)
	{
		alert(eLang.getString('common','STR_APP_STR_295a'));
	}
	else if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_USER_DELINFO');
		errstr +=  (eLang.getString('common','STR_IPMI_ERROR') +GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		alert(eLang.getString('common','STR_APP_STR_298'));
		//refresh the parent window list of users
		//location.href='usermgmt.htm';
		IPMICMD_HL_GetAllUserInfo();
	}
}


/* custom function to show the childs of an object */

function getAllThings(obj)
{
	for(i in obj)
	{
		str += i+"="+obj[i]+"\n";	
		/*if(obj[i].length)
		{
			if(level++<15)
			getAllThings(obj[i]);
			else{
			level--;
			return '';
			}
		}*/
	}
	return str;
}

/* end the custom function */
