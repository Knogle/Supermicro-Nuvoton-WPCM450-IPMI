var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

function doInit() {
	 // TODO: add page initialization code
	 
	 exposeElms(['_addFrm',
	 			'_userName',
	 			'_passWord',
	 			'_cpassWord',
	 			'_nwPriv',
	 			'_addBtn',
	 			'_cancelBtn']);
	 			
	 CheckRole();			
	 addBtn.onclick = function()
	 {
	 	doadduser();
	 }
	 cancelBtn.onclick = function()
	 {	
	 	location.href = 'configure_user.html';
	 }
	 
	 var optind = 0;
	 
	 nwPriv.add(new Option("Administrator",4),isIE?optind++:null);
	 nwPriv.add(new Option("Operator",3),isIE?optind++:null);
	 nwPriv.add(new Option("User",2),isIE?optind++:null);
	 nwPriv.add(new Option("Callback",1),isIE?optind++:null);
	 nwPriv.add(new Option("No Access",0xf),isIE?optind++:null);
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
		//alert(eLang.getString('common','STR_APP_STR_289'));
		location.href='configure_user.html'
		addBtn.disabled = true;		
		cancelBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
}

function IPMICMD_HL_AddUser_Res()
	{
	var CmdStatus = WEBVAR_JSONVAR_HL_ADDUSER.HAPI_STATUS;
	if (CmdStatus != 0)
		{
		
		
		switch(GET_ERROR_CODE(CmdStatus))
		{
			case 0xcc:
				rErrStr = eLang.getString('common','STR_ERR_USEREXIST');
				alert(rErrStr);
			break;
			default:
			     rErrStr = eLang.getString('common','STR_DEFERR_USERADD');
				rErrStr += (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
				alert(rErrStr);
			break;
		}
		
			}
	else
		{
		alert(eLang.getString('common','STR_APP_STR_286'));
		location.href = 'configure_user.html';
		}
	showWait(false);
	}

function IPMICMD_HL_AddUser()
	{

	RPC_AddUser = new xmit.getset({url:"/rpc/adduser.asp",onrcv:IPMICMD_HL_AddUser_Res});
	userindex = eExt.parseURLvars("userindex");

	RPC_AddUser.add("WEBVAR_USERINDEX",userindex);

	RPC_AddUser.add("WEBVAR_USERNAME",userName.value);
	RPC_AddUser.add("WEBVAR_PASSWD",passWord.value);

	RPC_AddUser.add("WEBVAR_NETWORKPRIV",nwPriv.value);
	RPC_AddUser.add("WEBVAR_SERIALPRIV",nwPriv.value);
	RPC_AddUser.send();


	}

function doadduser()
	{
	if (!eVal.username(userName.value))
		{
		alert(eLang.getString('err',0x01)+eLang.getString('common','STR_APP_STR_HELP'));
		return;
		}

	if (passWord.value!=cpassWord.value)
		{
		alert(eLang.getString('err',0x02));
		return;
		}

	if (!eVal.password(passWord.value))
		{
		alert(eLang.getString('err',0x03)+ eLang.getString('common','STR_APP_STR_412'));
		return;
		}
	showWait(true);
	
	IPMICMD_HL_AddUser();

	}
