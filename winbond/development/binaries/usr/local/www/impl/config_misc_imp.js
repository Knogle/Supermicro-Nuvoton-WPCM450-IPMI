
function doInit() {
	 
	// TODO: add page initialization code
	 exposeElms(['_psBtn']);
	getSnoopControl();
}

function getSnoopControl()
{
	showWait(true);
	xmit.get({url:"/rpc/getsnoopcontrol.asp",onrcv:respGetSnoopControl, status:''});	
}

function respGetSnoopControl()
{
	showWait(false);

	var CmdStatus = WEBVAR_JSONVAR_GETSNOOPCONTROL.HAPI_STATUS;
	
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_POST_SNOOPING_ERROR');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		return;
	}
	
	var btnstatus = WEBVAR_JSONVAR_GETSNOOPCONTROL.WEBVAR_STRUCTNAME_GETSNOOPCONTROL[0]['SnoopControl'];
	
	if(btnstatus == 1)
	{
		psBtn.href = "#";
		document.getElementById("_psBtn").style.color="#888888";
		document.getElementById("_psBtn").style.background="#E9E9DC";

	}	
	else if (btnstatus == 0)
	{
		psBtn.href = "../page/post_snooping.html";
		document.getElementById("_psBtn").style.color="#000000";
		document.getElementById("_psBtn").style.background="#FFFFE1";

	}
	else alert('Error: GPIO 81 Return Status Error');




}


