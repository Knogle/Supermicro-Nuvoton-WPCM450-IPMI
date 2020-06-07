var bldtime;

function doInit() {
	exposeElms([/*'_deviceAvailable',*/
 				'_fwRev',
 				'_buildTime']);


	showWait(true);
	xmit.get({url:"/rpc/getbldtime.asp",onrcv:ProcessBldTime, status:''});
}


function ProcessBldTime(arg)
{
	
		
	var CmdStatus = WEBVAR_JSONVAR_BUILD_TIME.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_APP_STR_220');
		errstr +=  (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		
	}
	else
	{	
		bldtime = WEBVAR_JSONVAR_BUILD_TIME.WEBVAR_STRUCTNAME_BUILD_TIME[0]['DATE'] + " " + WEBVAR_JSONVAR_BUILD_TIME.WEBVAR_STRUCTNAME_BUILD_TIME[0]['TIME'];
	}
	

	xmit.get({url:"/rpc/getdeviceid.asp",onrcv:ProcessDIDFunctioncall, status:''});	
}

function bcd_to_decimal(bcd_value)
{
        var lsnibble = bcd_value%16;
        var msnibble = (bcd_value-lsnibble)/16;

        return ( (msnibble*10) + lsnibble);
}

function ProcessDIDFunctioncall(arg)
{
	showWait(false);
	
	
	var CmdStatus = WEBVAR_JSONVAR_GETDEVICEIDRES.HAPI_STATUS;
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_SYS_INFO_DIVID');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		return;
	}

	var _sa = WEBVAR_JSONVAR_GETDEVICEIDRES.WEBVAR_STRUCTNAME_GETDEVICEIDRES[0];
	var ipmirev = "" + getbits(_sa.IPMIVersion,3,0) + "." + getbits(_sa.IPMIVersion,7,4);
	
	// two-digit sub-revison format; Linda modified
	var fwrev;	
	if(bcd_to_decimal(_sa.FirmwareRevision2) < 10)	
		fwrev = "" + getbits(_sa.FirmwareRevision1,6,0) + "." + "0" + bcd_to_decimal(_sa.FirmwareRevision2); //+ "." + _sa.AuxFirmwareRevision;
	else fwrev = "" + getbits(_sa.FirmwareRevision1,6,0) + "." + bcd_to_decimal(_sa.FirmwareRevision2); //+ "." + _sa.AuxFirmwareRevision;
	
	var mfgid = "" + (_sa.DevRevision & 0x0f);

		//Linda removed "Device Power Status" in system information page
		//deviceAvailable.innerHTML = (((_sa.FirmwareRevision1&&0x80) || (_sa.FirmwareRevision2&&0x80))?eLang.getString('common','STR_ON'):eLang.getString('common','STR_OFF'));
		fwRev.innerHTML = fwrev;
		buildTime.innerHTML = bldtime;	
}
