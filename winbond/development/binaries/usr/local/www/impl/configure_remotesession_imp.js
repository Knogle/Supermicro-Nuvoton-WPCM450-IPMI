var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

function doInit() {
	 // TODO: add page initialization code
	 exposeElms([
	 			//'_kvmEncy',
	 			//'_mediaEncy',
	 			'_vmattach',
	 			'_floppyemul',
	 			'_saveBtn']);
	 
	CheckRole();	
		    
	optind = 0;		   
	vmattach.add(new Option('Attach',0),isIE?optind++:null);
	vmattach.add(new Option('Auto Attach',1),isIE?optind++:null);	
	vmattach.add(new Option('Detach',2),isIE?optind++:null); 

	optind = 0;
	floppyemul.add(new Option('ON',0),isIE?optind++:null);
	floppyemul.add(new Option('OFF',1),isIE?optind++:null);
	
	saveBtn.onclick = setDataVMCfg;
}

function getDataVMCfg()
{
	xmit.get ({url:"/rpc/getvmediacfg.asp",onrcv:resp_getDataVMCfg, status:''});
}

function resp_getDataVMCfg(arg)
{
	var VM_CFG = WEBVAR_JSONVAR_GETVMEDIACFG.WEBVAR_STRUCTNAME_GETVMEDIACFG[0];

	if(WEBVAR_JSONVAR_GETVMEDIACFG.HAPI_STATUS != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_REMOTE_SESSION_GETVAL');
		errstr +=(eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		vmattach.value = VM_CFG.V_STR_CDROM_MODE;
		floppyemul.value = parseInt(VM_CFG.V_STR_FLOPPY_EMULATION)?0:1;
	}
}

function setDataVMCfg()
{
	showWait(true);
	var SET_VMCFG = xmit.getset({url:'/rpc/setvmediacfg.asp',onrcv:resp_setDataVMCfg,status:''});
	SET_VMCFG.add('V_STR_ATTACH_MODE',vmattach.value);
	SET_VMCFG.add('V_STR_FLOPPY_EMULATION',((floppyemul.value == 0)?1:0));
	SET_VMCFG.send();
}

function resp_setDataVMCfg(arg)
{
	if(WEBVAR_JSONVAR_SETVMEDIACFG.HAPI_STATUS != 0)
	{
		errstr = eLang.getString('common','STR_CONFIG_REMOTE_SESSION_SETVAL');
		errstr +=(eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
	else
	{
		showWait(false);
		alert(eLang.getString('common','STR_SECURE_SAVE_SUCCESS'));
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
		saveBtn.disabled = true;
	}
	else	
	{
		g_isadmin = 1;
	}	
	getDataVMCfg ();
}

