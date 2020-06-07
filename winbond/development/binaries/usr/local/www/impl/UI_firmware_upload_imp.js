function doInit() {
	 // TODO: add page initialization code
	 	exposeElms(['_brwsUpld',
	 				'_uploadBtn',
	 				'_cancelBtn',
	 				'_statusMsg']);
	 
		top.g_firmwareupload = true;
		CheckRole();	 
}

function enableUploadBtn()
{
		showWait(false);
		CmdStatus = WEBVAR_JSONVAR_GETROMFILESIZE.HAPI_STATUS;
		
		if(CmdStatus == 0)
		{
			GetRomFileSize = WEBVAR_JSONVAR_GETROMFILESIZE.WEBVAR_STRUCTNAME_GETROMFILESIZE;
			
			
			brwsUpld.name = GetRomFileSize[0].V_FILE_LOCATION + '?' + 
							GetRomFileSize[0].V_FILE_SIZE;

			brwsUpld.disabled = false;
			uploadBtn.disabled = false;
			
			uploadBtn.onclick=validate;
			cancelBtn.onclick=cancelupload;
		
		}else
		{
			errStr = eLang.getString('common','STR_UPLOAD_ROM_ERROR');
			alert(errStr);
		}
}

function validate()
{
	var filepath = new String(brwsUpld.value);
	if(filepath.length == 0)
	{
		alert(eLang.getString('common','STR_APP_STR_227'));
		brwsUpld.focus();
		return;
	}
	showWait(true);
	xmit.get({url:'/rpc/flashfile_upload_starts.asp', onrcv:flashFileUploadResp, status:''});
}

function flashFileUploadResp()
{
	showWait(false);
	statusMsg.innerHTML = eLang.getString('common','STR_APP_STR_228');
	var form = brwsUpld.form;

	if(form.tagName=='FORM')
	{
		showWait(true);
		UploadfileNoDefChk(form,"UI_fwverify.html");
	}
}


function cancelupload()
{
	if(confirm(eLang.getString('common','STR_APP_STR_229')))
		location.href='UI_resetonload.html';
}



function UploadfileNoDefChk(form, link)
{
	form.action = link;
	form.submit();
}

function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		//alert(eLang.getString('common','STR_APP_STR_315'));
		location.href = 'sys_info.html';
	}
	else
	{
		parent.frames['header'].enabledisableNavBar(0);
		parent.frames['sidebar'].clearMenus();

		showWait(true);

		gs = xmit.getset({url:'/rpc/getromfilesize.asp',status:'',onrcv:enableUploadBtn});
		gs.send();
		
		brwsUpld.disabled = true;
		uploadBtn.disabled = true;
	}
}
