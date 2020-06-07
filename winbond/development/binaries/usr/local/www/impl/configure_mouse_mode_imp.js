function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_mInfo',
	 			'_absMod',
	 			'_relMod',
	 			'_applyBtn']);
		CheckRole();
		absMod.checked = false;
		relMod.checked = false;
		
		absMod.onclick = onAbsolute;
		relMod.onclick = onRelative;
		
		applyBtn.onclick = doMouseMode;
		
		GetMouseMode();	 

}


var g_isadmin = 0;
function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		g_isadmin = 0;
		alert(eLang.getString('common','STR_APP_STR_244'));
		applyBtn.disabled = true;
	}
	else
	{
		g_isadmin = 1;
	}
}


var gmousemode = -1;



onAbsolute = function()
{
	
    gmousemode = 0;
     absMod.checked = true;
     relMod.checked = false;
}

onRelative = function()
{
    gmousemode = 1;
    
    absMod.checked = false;
    relMod.checked = true;

}


GetMouseMode = function()
{
	showWait(true);
	xmit.get({url:"/rpc/getmousemode.asp",onrcv:GetMouseMode_Res, status:''});
}

GetMouseMode_Res = function (arg)
{
	showWait(false);
	
    var CmdStatus = WEBVAR_JSONVAR_GETMOUSEMODE.HAPI_STATUS;
    var mouseMode;
    

    if( CmdStatus != 0)
    {
	alert(eLang.getString('common','STR_APP_STR_245'));
    }
    
    if(WEBVAR_JSONVAR_GETMOUSEMODE.WEBVAR_STRUCTNAME_GETMOUSEMODE.length==0)
    {
    	alert(eLang.getString('common','STR_APP_STR_248'));
    	return;
    }
    
    mouseMode = WEBVAR_JSONVAR_GETMOUSEMODE.WEBVAR_STRUCTNAME_GETMOUSEMODE[0].GET_MOUSE_MODE;
	//alert (mouseMode);    
    if ( mouseMode == 0 ){
		mInfo.innerHTML=eLang.getString('common','STR_APP_STR_246');
		onAbsolute(); //[Linda]: Check the radio the same as the current status
		//onRelative(); 
    }else if ( mouseMode == 1 ) { 
		mInfo.innerHTML=eLang.getString('common','STR_APP_STR_247');
		onRelative();
		//onAbsolute();
    }else
	alert(eLang.getString('common','STR_APP_STR_248'));


    
}


doMouseMode = function()
{
    if(confirm(eLang.getString('common','STR_APP_STR_249'))){
	    
		RPC_MouseAction = new xmit.getset({url:"/rpc/setmousemode.asp",onrcv:doMouseMode_Res});
		RPC_MouseAction.add("SET_MOUSE_MODE",gmousemode);
		RPC_MouseAction.send();
    }
}



doMouseMode_Res = function()
{
    
    var CmdStatus = WEBVAR_JSONVAR_SETMOUSEMODE.HAPI_STATUS;

    if( CmdStatus != 0)
    {
	alert(eLang.getString('common','STR_APP_STR_250'));
    }else{
	GetMouseMode();
    }

	//location.href ="UI_resetonload.html";
}
