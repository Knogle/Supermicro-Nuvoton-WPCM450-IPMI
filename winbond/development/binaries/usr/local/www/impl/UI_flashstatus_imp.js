var timerid = -1;
var statTable = null;
var tblJSON = {};
//-------------------------------------//
// Implementation Functions
//-------------------------------------//
function doInit()
{
	CheckRole();
	top.g_firmwareupload = false;
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
		exposeElms(['_upgradeProgress',
					'_upgradeTable']);
		showWait(true);
		parent.frames['header'].enabledisableNavBar(0);
		parent.frames['sidebar'].clearMenus();

		vhref=top.document.getElementsByTagName('frameset')[1];
		vcolsa=vhref.cols.split(",");

		loadCustomPageElements();
		timerid = setTimeout("RefreshStatus()",500);
	}
}

function loadCustomPageElements()
{
/*
	statTable = domapi.Listgrid({
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
	
	statTable.style.position = 'relative';
	statTable.style.background = 'transparent';
	statTable.style.overflow = 'none';
	*/
	
	statTable = listgrid({
		w				: '100%',
		h				: '155px',
		doAllowNoSelect : true
	});
	

	upgradeTable.appendChild(statTable.table);
	
/* If there is a listgrid embed in the page,
** please don't use resize event directly
** Use only via lGrid.onpageresize event 
*/
	statTable.onpageresize = function()
	{
		this.table.style.width = '100%';
		this.table.style.width = this.container.header.offsetWidth+'px';
	}
	
	tblJSON = {
				cols:[
				{text:eLang.getString('common',"STR_FLSH_STAT_FW"), fieldName:'fw', w:'33%', textAlign:'center'},
				{text:eLang.getString('common',"STR_FLSH_STAT_ACT"), fieldName:'act', w:'33%', textAlign:'center'},
				{text:eLang.getString('common',"STR_FLSH_STAT_PROG"), fieldName:'prog', w:'34%', textAlign:'center'} 
				]
				};
				
	statTable.loadFromJson(tblJSON);
}


function RefreshStatus()
{
	if(timerid != -1)
		clearTimeout(timerid);
	var p = new xmit.getset({url:'/rpc/flashstatus.asp', onrcv:onReceiveStatus});
	p.send();
}

function onReceiveStatus()
{
	var JSONRows = new Array();
		
    var FlashStates = 
    [
        {'StateDescr':'Currently Doing','Image':"<img src='/res/icons/"+"flash.gif"+"' align='absmiddle'>",'CB':"",'CE':""},
        {'StateDescr':'To be Done','Image':'','CB':"",'CE':""},
        {'StateDescr':'Complete','Image':"<img src='/res/icons/"+"ok-green.gif"+"' align='absmiddle'>",'CB':"",'CE':""},
        {'StateDescr':'Skipped','Image':'','CB':"",'CE':""}
    ]

    if(timerid != -1)
        clearTimeout(timerid);

    var flashstat = WEBVAR_JSONVAR_FLASHPROGRESS.WEBVAR_STRUCTNAME_FLASHPROGRESS;
    statTable.clear();

	var str = '';
	var curstate = flashstat[0]['FLSTATE'];
		
	//get the right image
	SB = FlashStates[curstate]['CB'];EB = FlashStates[curstate]['CE'];
//	str += SB + "RAC-SP" + EB  + "," + SB + flashstat[0]['FLASHSUBACTION'] + EB + "," + SB + flashstat[0]['FLASHPROGRESS'] + EB;

	JSONRows.push({cells:[
					{text:SB + "RAC-SP" + EB,value:SB + "RAC-SP" + EB},
					{text:SB + flashstat[0]['FLASHSUBACTION'] + EB,value:SB + flashstat[0]['FLASHSUBACTION'] + EB},
					{text:SB + flashstat[0]['FLASHPROGRESS'] + EB,value:SB + flashstat[0]['FLASHPROGRESS'] + EB}
					]});

	tblJSON.rows = JSONRows;

	statTable.loadFromJson(tblJSON);

    if(WEBVAR_JSONVAR_FLASHPROGRESS.HAPI_STATUS == 0xff)
    {
        //flash is totally complete now..so we go to the next page
        //window.location=eLang.goLink('/iPages/i_flashcomplete.asp?complete=1');
		location.href='UI_flashcomplete.html';
    }  
    else
    {
    	timerid = setTimeout("RefreshStatus()",2000);
    }
}

