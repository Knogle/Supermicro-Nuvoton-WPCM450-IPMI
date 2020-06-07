var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_modFrm',
	 			'_alertType',
	 			'_eventSeverity',
	 			'_destIP',
	 			'_emailAdd',
	 			'_subject',
	 			'_message',	 			
	 			'_saveBtn',
	 			'_cancelBtn']);
	 			
	 
	CheckRole();	
	doModAlert();
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
		alert(eLang.getString('common','STR_APP_STR_315'));
		saveBtn.disabled = true;
		cancelBtn.disabled = true;		
	}
	else
	{
		g_isadmin = 1;
	}
}

function IPMICMD_SetAlertEntry_Res()
	{
	var CmdStatus = WEBVAR_JSONVAR_HL_SETALERTENTRY.HAPI_STATUS;

	showWait(false);
	if (CmdStatus == 0)
		{
		alert(eLang.getString('common',"STR_ALERT_MOD_ALERTMODSUCCESS"));
		location.href="configure_alerts.html";

		}
	else
		{
		rErrStr = eLang.getString('common','STR_ALERT_MOD_ALERTMODFAILURE');
		rErrStr +=(eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));

		alert(rErrStr);
		}

	}


function IPMICMD_GetLANAlertDests_Res (arg)
{
	var CmdStatus = WEBVAR_JSONVAR_HL_GETLANALERTDESTS.HAPI_STATUS;

	if (CmdStatus == 0)
	{
		LANALERTDESTS_DATA = WEBVAR_JSONVAR_HL_GETLANALERTDESTS.WEBVAR_STRUCTNAME_HL_GETLANALERTDESTS;
		if (LANALERTDESTS_DATA.length == 1)
			alert(eLang.getString('common',"NO_LANALERTDESTS_STRING"));
		

	index =  parseInt(eExt.parseURLvars("id")); //initialize the received values of current alert
	level = eExt.parseURLvars("level");
	IP = eExt.parseURLvars("ip");

	for(i in LANALERTDESTS_DATA)
	{
		if(LANALERTDESTS_DATA[i].SetSel==index) 
			break;
	}
    
	eventSeverity.value = level;
	subject.value = LANALERTDESTS_DATA[i].Subject;
	message.value = LANALERTDESTS_DATA[i].Msg;
	if(LANALERTDESTS_DATA[i].DestType == 0)
	{
		alertType.value = 0;
		emailAdd.disabled = true ;  //email address
		subject.disabled = true ;  //subject
		message.disabled = true ;  //message
		destIP.disabled = false ;  //destination IP
		destIP.value = IP;
	}
	else
	{
		alertType.value = 1;
		emailAdd.disabled = false;  //email address
		subject.disabled = false ;  //subject
		message.disabled = false ;  //message
		destIP.disabled = true ;  //destination IP
		emailAdd.value = IP;
	}
    
	}
	else
	{
		errstr = eLang.getString('common','STR_ALERT_MOD_GETALERTMODVAL');
		errstr = (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	showWait(false);
}


function IPMICMD_HL_GetLANAlertDests()
	{
	xmit.get({url:"/rpc/getlanalertdests.asp",onrcv:IPMICMD_GetLANAlertDests_Res, status:''});
	}


function dosavealert()
{


	var i;
	var selset;


	if(alertType.value == 0)
	{
		if (!eVal.ip(destIP.value))
		{
			alert(eLang.getString('common',"STR_ALERT_MOD_ERRIP"));
			return;
		}
	}
	else
	{
		if (!eVal.email(emailAdd.value))
		{
			alert(eLang.getString('common',"STR_ALERT_MOD_ERREMAIL"));
			return;
		}
	}
	showWait(true, eLang.getString('common',"STR_PROCESSINGWAIT"));

	RPC_SetAlertEntry = new xmit.getset({url:"/rpc/setalertentry.asp",onrcv:IPMICMD_SetAlertEntry_Res});

	RPC_SetAlertEntry.add("WEBVAR_ALERTINDEX",index);


	RPC_SetAlertEntry.add("WEBVAR_ALERTLEVEL",eventSeverity.value);

	selset = 0x10 | index;

	if(alertType.value == 0)
		RPC_SetAlertEntry.add("WEBVAR_DESTADDR",destIP.value);
	else
		RPC_SetAlertEntry.add("WEBVAR_DESTADDR",emailAdd.value);

	RPC_SetAlertEntry.add("WEBVAR_ALERTTYPE",alertType.value);
	RPC_SetAlertEntry.add("WEBVAR_SUBJECT",subject.value);
	RPC_SetAlertEntry.add("WEBVAR_MSG",message.value);


	RPC_SetAlertEntry.send();
}


function RefreshAlertData()
{
	level = eExt.parseURLvars("level");
	IP = eExt.parseURLvars("ip");

	if (level == "Disable All")
		eventSeverity.value = 0;
	if (level == "Informational")
		eventSeverity.value = 1;
	if (level == "Warning")
		eventSeverity.value = 2;
	if (level == "Critical")
		eventSeverity.value = 3;
	if (level == "Non-recoverable")
		eventSeverity.value = 4;

	destIP.value = IP;
}



var index;
var level;
var IP;
var Subject;
var Msg;
var Type;
var _tmpIP;
var _tmpEmail;
var _tmpSubject;
var _tmpMsg;

function doModAlert()
	{
    showWait(true);

	optind = 0;
	eventSeverity.add(new Option(eLang.getString('common',"STR_ALERT_MOD_DISABLE"),0),isIE?optind++:null);
	eventSeverity.add(new Option(eLang.getString('common',"STR_ALERT_MOD_INFO"),1),isIE?optind++:null);
	eventSeverity.add(new Option(eLang.getString('common',"STR_ALERT_MOD_WARN"),2),isIE?optind++:null);
	eventSeverity.add(new Option(eLang.getString('common',"STR_ALERT_MOD_CRITICAL"),3),isIE?optind++:null);
	eventSeverity.add(new Option(eLang.getString('common',"STR_ALERT_MOD_NONRECV"),4),isIE?optind++:null);

	optind = 0;
	alertType.add(new Option(eLang.getString('common',"STR_ALERT_MOD_SNMPTRAP"),0),isIE?optind++:null);
	alertType.add(new Option(eLang.getString('common',"STR_ALERT_MOD_EMAIL"),1),isIE?optind++:null);
	alertType.onchange=function(){
			if(this.value == 0){

        //backup
        _tmpEmail = emailAdd.value;
        _tmpSubject = subject.value;
        _tmpMsg = message.value;
        
        //clear fields
        emailAdd.value = '';
        subject.value = '';
        message.value = '';
        
        if(_tmpIP!='' && _tmpIP!=undefined)
        {
          destIP.value = _tmpIP;
        }

        //disable fields
				emailAdd.disabled = true ;  //email address
				subject.disabled = true ;  //subject
				message.disabled = true ;  //message
				destIP.disabled = false ;  //destination IP
			}else{
        //backup
        _tmpIP = destIP.value;
        
        //clear fields
        destIP.value = '';
        
        //reload previous data
        if(_tmpEmail!='' && _tmpEmail!=undefined)
        {
          emailAdd.value = _tmpEmail;
          subject.value = _tmpSubject;
          message.value = _tmpMsg;
        }
        
        //disable fields
				emailAdd.disabled = false ;  //email address
				subject.disabled = false ;  //subject
				message.disabled = false ;  //message
				destIP.disabled = true ;  //destination IP
			}
	};


	saveBtn.onclick = dosavealert;
	cancelBtn.onclick = function()
		{
		location.href="configure_alerts.html";
		};


    IPMICMD_HL_GetLANAlertDests();
	

}
