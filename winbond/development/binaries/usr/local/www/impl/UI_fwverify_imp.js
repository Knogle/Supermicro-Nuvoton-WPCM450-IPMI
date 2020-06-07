var tblJSON = {};
var fwListTable = null;


function doInit()
{
	CheckRole();
	top.g_firmwareupload = true;
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
		exposeElms(['_fwList',
					'_preConf',
					'_proceedBtn',
					'_cancelBtn']);
					
		vhref=top.document.getElementsByTagName('frameset')[1];
		vcolsa=vhref.cols.split(",");
		loadCustomPageElements();
	}
}

function loadCustomPageElements()
{
/*
	fwListTable = domapi.Listgrid({
	  x				  : 0,
	  y				  : 0,
	  w				  : (parseInt(document.body.clientWidth)-20), //+parseInt(vcolsa[2])),
	  h				  : 50,
	  headerH		  : 25,
	  doLedgerMode    : true,
	  doColMove       : false,
	  doColSort       : true,
	  doDepress       : true,
	  gridlines       : "hori",
	  doAllowEdit     : false,
	  doColResize     : true,
	  linesPerRow     : 1,
	  minColWidth     : 150,
	  doShowHeader    : true,
	  doShowRowbar    : false,
	  doMultiSelect   : false,
	  doVirtualMode   : false,
	  doAllowNoSelect : true,
	  doShowSelection : true 
	});
	
	fwListTable.style.position = 'relative';
	fwListTable.style.background = 'transparent';
*/
	fwListTable = listgrid({
		w				: '100%',
		h				: '155px',
		doAllowNoSelect : false
	});

	
	fwList.appendChild(fwListTable.table);
	
/* If there is a listgrid embed in the page,
** please don't use resize event directly
** Use only via lGrid.onpageresize event 
*/
	fwListTable.onpageresize = function()
	{
		this.table.style.width = '100%';
		this.table.style.width = this.container.header.offsetWidth+'px';
	}
	
	tblJSON = {
				cols:[
				{text:eLang.getString('common',"STR_FW_VER_MDLNAM"), fieldName:'fw_name', w:'33%', textAlign:'center'},
				{text:eLang.getString('common',"STR_FW_VER_EXT_VER"), fieldName:'fw_cver', w:'33%', textAlign:'center'},
				{text:eLang.getString('common',"STR_FW_VER_NEW_VER"), fieldName:'fw_nver', w:'34%', textAlign:'center'} 
				]
				};
				
	fwListTable.loadFromJson(tblJSON);
	
	dofwverify();
}

var full_flash_selected=0;
var ImageSizeChanged = 0;

dofwverify = function()
{
	/* Preserve configuration is turned ON by default */	
	preConf.checked = true;

	SendVerify();
	proceedBtn.onclick =function() {DoStartFlash();}
	cancelBtn.onclick = function() 
	{
		if(confirm(eLang.getString('common','STR_APP_STR_237')))
		location.href ='UI_resetonload.html';
	}
		
}

function SendVerify()
{
	showWait(true);
	
	//Disable upgrade button before firmware verification (Linda)
	proceedBtn.disabled = true;

	var p = new xmit.getset({url:'/rpc/verifyimage.asp', onrcv:onReceiveVerify});
	p.send();
}

function onReceiveVerify (arg) 
{
	var JSONRows = new Array();
	
	showWait(false);
	

	if(WEBVAR_JSONVAR_VERIFYIMAGE.HAPI_STATUS)
	{
		alert(eLang.getString('common','STR_APP_STR_238'));
		location.href ='UI_resetonload.html';
	}
	else
	{
		fwListTable.clear();
		var fwveriinfo = WEBVAR_JSONVAR_VERIFYIMAGE.WEBVAR_STRUCTNAME_VERIFYIMAGE;
		var status = fwveriinfo[0]['IMGCOMPSTATUS'];
		
		JSONRows.push({cells:[
						{text:'RAC-SP', value:'RAC-SP'},
						{text:fwveriinfo[0]['CURIMGVERSION'], value:fwveriinfo[0]['CURIMGVERSION']},
						{text:fwveriinfo[0]['NEWIMGVERSION'], value:fwveriinfo[0]['NEWIMGVERSION']}
						]});
		
		tblJSON.rows = JSONRows;
		
		fwListTable.loadFromJson(tblJSON);
		
		if(getbits(status,0,0))
		{
			if(getbits(status,2,2))
				alert(eLang.getString('common','STR_APP_STR_239'));
			else if(getbits(status,1,1))
				alert(eLang.getString('common','STR_APP_STR_240'));
			
			if(getbits(status,1,1))
				ImageSizeChanged = 1;
		}
		else
			alert(eLang.getString('common','STR_APP_STR_241'));

		//Enable upgrade button after firmware verification is done (Linda)
		proceedBtn.disabled = false;

	}
}

function DoStartFlash()
{
	var flctl_PreserveCfg = 0;

	if(preConf.checked == true)
	{
		if(ImageSizeChanged)
		{
			if(!confirm(eLang.getString('common','STR_APP_STR_242')))
			{
				return;
			}
			flctl_PreserveCfg = 0;
		}
		else
			flctl_PreserveCfg = 1;
	}

	if(!confirm(eLang.getString('common','STR_APP_STR_243')))
	{
		return;
	}
	
	showWait(true);
	
	var startflashcmd = new xmit.getset({url:'/rpc/startflash.asp', onrcv:onReceiveStartFlash});
	startflashcmd.add("WEBVAR_PRESERVECFG",flctl_PreserveCfg);
	startflashcmd.send();

}

function onReceiveStartFlash()
{
	location.href='UI_flashstatus.html';
}
