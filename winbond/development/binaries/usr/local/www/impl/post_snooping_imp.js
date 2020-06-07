/*******************************************************************/
/* Disable the post snooping content when OS takes over the system */
/* Linda modified on 01/23/09                                      */ 
/*******************************************************************/

function doInit() {
	exposeElms(['_msgNotice','_snoopByte','_refreshBtn']);
	getSnoopControl();
/*
	refreshBtn.onclick = getPostSnooping;
	
	showWait(true);
	xmit.get({url:"/rpc/getsnoopbyte.asp",onrcv:ProcessPostSnooping, status:''});
*/
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
		refreshBtn.disabled = true;
		snoopByte.innerHTML = "N/A";
		msgNotice.innerHTML = eLang.getString('post_snooping','STR_POST_SNOOPING_NOTICE');	
	}	
	else if (btnstatus == 0)
	{
		refreshBtn.onclick = getPostSnooping;
	
		showWait(true);
		xmit.get({url:"/rpc/getsnoopbyte.asp",onrcv:ProcessPostSnooping, status:''});
	}
	else alert('Error: GPIO 81 Return Status Error');
}


function getPostSnooping() {
	showWait(true);
	xmit.get({url:"/rpc/getsnoopbyte.asp",onrcv:ProcessPostSnooping, status:''});	
}

function d2h(d) {return d.toString(16);}
function h2d(h) {return parseInt(h,16);} 

function ProcessPostSnooping(arg) {
	showWait(false);
	
	var CmdStatus = WEBVAR_JSONVAR_GETSNOOPBYTE.HAPI_STATUS;
	
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_POST_SNOOPING_ERROR');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		return;
	}
	
	var snoop = WEBVAR_JSONVAR_GETSNOOPBYTE.WEBVAR_STRUCTNAME_GETSNOOPBYTE[0]['SnoopByte'];
	snoop = d2h(snoop);
	
	snoopByte.innerHTML = snoop;
}

