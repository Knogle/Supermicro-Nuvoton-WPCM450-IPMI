
function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_uidInfo', '_onMod', '_offMod', '_applyBtn']);
	 //CheckRole();
	 GetUIDStatus();

	 onMod.checked = false;
	 offMod.checked = false;
		
	 onMod.onclick = onUID;
	 offMod.onclick = offUID;
	 applyBtn.onclick = doUIDStatus;
}


GetUIDStatus = function()
{
    showWait(true);
    xmit.get({url:"/rpc/getuidstatus.asp",onrcv:GetUIDStatus_Res, status:''});
}

GetUIDStatus_Res = function (arg)
{
    showWait(false);
    var CmdStatus = WEBVAR_JSONVAR_GETUIDSTATUS.HAPI_STATUS;
    var uidStatus;
    

    if( CmdStatus != 0)
    {
	errstr = eLang.getString('common','STR_UID_ERROR');
	errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
	alert (errstr);
	return;
    }
    uidStatus = WEBVAR_JSONVAR_GETUIDSTATUS.WEBVAR_STRUCTNAME_GETUIDSTATUS[0]['UIDStatus'];
    
    if(uidStatus == 1)
    {
    	uidInfo.innerHTML = eLang.getString('common','STR_APP_STR_415'); //on
	onUID();
    }
    else if (uidStatus == 0)
    {
	uidInfo.innerHTML = eLang.getString('common','STR_APP_STR_416'); //off
	offUID();
    }
    else
	alert('Error: uidStatus is not 0 or 1');
}


var setuid = -1;
onUID = function()
{
    setuid = 1;
    onMod.checked = true;
    offMod.checked = false;
}

offUID = function()
{
    setuid = 0;
    onMod.checked = false;
    offMod.checked = true;
}

doUIDStatus = function()
{
     if(confirm(eLang.getString('common','STR_APP_STR_417'))){

	if(setuid == 1)
	{
		xmit.get({url:"/rpc/enableuid.asp",onrcv:doUIDStatus_Res, status:''});	    

	}
	else if(setuid == 0)
	{
		xmit.get({url:"/rpc/disableuid.asp",onrcv:doUIDStatus_Res, status:''});

	}
	else {
		//setuid = -1 means did not check on or off UID
	}
    
    }
}

doUIDStatus_Res = function()
{

    var CmdStatus;

    if(setuid == 1)
    {
	CmdStatus = WEBVAR_JSONVAR_ENABLEUID.HAPI_STATUS;
    }
    else if (setuid == 0)
    {
	CmdStatus = WEBVAR_JSONVAR_DISABLEUID.HAPI_STATUS;
    }

    if( CmdStatus != 0)
    {
	//Error in setting UID
	errstr = eLang.getString('common','STR_UID_ERROR');
	errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
	alert (errstr);
	return;

    }else{
        //alert('doUID_Res(): CmdSt==0 Sucess');
	GetUIDStatus();
    }
}

/*
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
		//alert(eLang.getString('common','STR_APP_STR_'));
		applyBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
}
*/
