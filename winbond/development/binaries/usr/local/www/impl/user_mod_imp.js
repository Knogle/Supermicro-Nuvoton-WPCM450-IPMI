var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);
var IsPwdChange;
var g_isadmin = 0;

function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_userName',
	 			'_changePwd',
	 			'_passWord',
	 			'_cpassWord',
	 			'_nwPriv',
	 			'_modBtn',
	 			'_cancelBtn']);
	 
	 CheckRole();
	 modBtn.onclick = domoduser;
	 cancelBtn.onclick = function()
	 {
	 	location.href = 'configure_user.html';
	 }
	 
	 
	 userName.value = eExt.parseURLvars('username');
	 userName.readOnly = true;
	 
	 optind = 0;
	 nwPriv.add(new Option('Administrator',4), isIE?optind++:null);
	 nwPriv.add(new Option('Operator',3), isIE?optind++:null);
	 nwPriv.add(new Option("User",2),isIE?optind++:null);
	 nwPriv.add(new Option("Callback",1),isIE?optind++:null);
	 nwPriv.add(new Option('No Access',0xf), isIE?optind++:null);
	 
	 
	 changePwd.onclick = PwdChange;
	 IsPwdChange = 1;
	 
	 nwPriv.value = eExt.parseURLvars("nwpriv") * 1;
	 
	 if(userName.value == 'root')
	 {
	 	nwPriv.disabled = true;
	 }
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
		location.href='configure_user.html'
		//alert(eLang.getString('common','STR_APP_STR_289'));
		modBtn.disabled = true;		
		cancelBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
}
//-------------------------------------//
function IPMICMD_HL_ModUser_Res()
	{
	showWait(false);
	var CmdStatus = WEBVAR_JSONVAR_HL_MODUSER.HAPI_STATUS;
	if (CmdStatus != 0)
		{
		if (GET_ERROR_CODE(CmdStatus) == 0xCC)
			{

			if (userName.value == "root")
			{
				alert(eLang.getString('common','STR_APP_STR_288'));
			}else
			{
				alert(eLang.getString('common','STR_ERR_USEREXIST'));
			}
				location.href='configure_user.html';
			        return 0;
			}
		errstr = eLang.getString('common','STR_MOD_USER');
		errstr +=  (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(errstr);

		}
	else
		{
		alert(eLang.getString('common','STR_APP_STR_288'));
		location.href='configure_user.html';
		}
	}
//-------------------------------------//

function IPMICMD_HL_ModUser()
	{

	RPC_ModUser = new xmit.getset({url:"/rpc/moduser.asp",onrcv:IPMICMD_HL_ModUser_Res});
	userindex = eExt.parseURLvars("userindex");

	RPC_ModUser.add("WEBVAR_USERINDEX",userindex);

	RPC_ModUser.add("WEBVAR_USERNAME",userName.value);
	RPC_ModUser.add("WEBVAR_PASSWD",passWord.value);
	if (IsPwdChange)
		RPC_ModUser.add("WEBVAR_ISPWDCHANGE",1);
	else
		RPC_ModUser.add("WEBVAR_ISPWDCHANGE",0);

	RPC_ModUser.add("WEBVAR_NETWORKPRIV",nwPriv.value);
	RPC_ModUser.add("WEBVAR_SERIALPRIV",nwPriv.value);
	RPC_ModUser.send();


	}

//-------------------------------------//
function domoduser()
	{

	if (IsPwdChange)
		{
		if ( passWord.value!= cpassWord.value)
			{
			alert(eLang.getString('err',0x02));
			return (false);
			}

		if (!eVal.password(passWord.value))
			{
			alert(eLang.getString('err',0x03)+ eLang.getString('common','STR_APP_STR_412'));
			return (false);
			}
		}
	showWait(true);
	IPMICMD_HL_ModUser();

	}

//-------------------------------------//
function PwdChange()
	{

	IsPwdChange = this.checked;
	passWord.disabled = !(this.checked);
	cpassWord.disabled = !(this.checked);
	}
