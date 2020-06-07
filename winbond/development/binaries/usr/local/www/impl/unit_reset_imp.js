function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_statusMsg','_resetBtn']);
	
	resetBtn.onclick = doReset;
	CheckRole();
}

function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		resetBtn.disabled = true;
		resetBtn.onclick = function() {};
		alert(eLang.getString('unit_reset',"STR_UNIT_RESET_MESG"));
	}
}

function doReset() {
		showWait(true);
		resetBtn.disabled = true;
		var RPC_DoUnitReset = new xmit.getset({url:"/rpc/rebootcard.asp",onrcv:doUnitReset_Res,timeout:10000});
		
		statusMsg.innerHTML = eLang.getString('common','STR_APP_STR_418');
		setTimeout('goToLogin()',50000);
		RPC_DoUnitReset.send();
}

function goToLogin(){
    top.location = "login.html";
}

function doUnitReset_Res(){
	showWait(false);
	var CmdStatus = WEBVAR_JSONVAR_REBOOTSTATUS.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common',"STR_APP_STR_413");
		alert(errstr);
		return;
	} 	
}
	
