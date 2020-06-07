var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

function doInit()
	{

	exposeElms(['_enableSerial',
				'_baudRate',
				'_btnSave']);

	CheckRole();
	butSave=btnSave;
	cmbBaud=baudRate;
	chkEnableSOL=enableSerial;

	optInd=0;
	

	cmbBaud.add(new Option('9600','9600'),isIE?optInd++:null);
	cmbBaud.add(new Option('19200','19200'),isIE?optInd++:null);
	cmbBaud.add(new Option('38400','38400'),isIE?optInd++:null);
	cmbBaud.add(new Option('57600','57600'),isIE?optInd++:null);
	cmbBaud.add(new Option('115200','115200'),isIE?optInd++:null);

	//-------------------------------------//
	// Set handlers
	//-------------------------------------//
	butSave.onclick=butSave_onclick;


	//-------------------------------------//
	// Code init
	//-------------------------------------//
	xmit.get ({url:"/rpc/getserialcfg_sol.asp",onrcv:resp_getSOLData, status:''});
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
		btnSave.disabled = true;		
	}
	else
	{
		g_isadmin = 1;
	}
}



function resp_getSOLData(arg)
{
	serial_data = WEBVAR_JSONVAR_SERIALPORTCFG_SOL.WEBVAR_STRUCTNAME_SERIALPORTCFG_SOL[0];
	var CmdStatus = arg.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_SOL_GETVAL');
			errstr +=  (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		return;
	}
	//fill stuff
	//the baud rate dropdown
	for(i=0; i<cmbBaud.options.length; i++)
	{
		if(cmbBaud.options[i].value == serial_data.BAUDRATE)
		{
			cmbBaud.options[i].selected = true;
			break;
		}
	}
	if(serial_data.SOLENABLED)
		chkEnableSOL.checked = true;
	else
		chkEnableSOL.checked = false;
}


function SetRes(arg)
{
	var CmdStatus = arg.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_SOL_SETVAL');
			errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		return;
	}
	alert(eLang.getString('common','STR_APP_STR_311'));
}



function butSave_onclick(evt)
{
	var evt=(evt)?evt:((event)?event:null);
	if (!butSave.disabled)
		{
		if(!confirm(eLang.getString('common','STR_APP_STR_312')))
			return false;
		//first off we construct the user modification stuff
		RPC_ModSerial = new xmit.getset({url:"/rpc/setserialcfg_sol.asp",onrcv:SetRes});
		RPC_ModSerial.add("BAUDRATE1",cmbBaud.value);
		if(chkEnableSOL.checked)
			RPC_ModSerial.add("SOL_ENABLED",1);
		else
			RPC_ModSerial.add("SOL_ENABLED",0);
		RPC_ModSerial.send();
		}
}

