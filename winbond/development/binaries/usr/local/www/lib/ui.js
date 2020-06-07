//----------------------------------------------------------------------------//
// UI.JS include file
//----------------------------------------------------------------------------//
//
// // document.writeln("<script type='text\/javascript' src='../lib/eLang.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/eExt.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/sysfn.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/eGUI.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/security.js'><\/script>");
 document.writeln("<script type='text\/javascript' src='../lib/xmit.js'><\/script>");
//
// document.writeln("<script type='text\/javascript' src='../lib/domapi/src/domapi.js'><\/script>");
//
// // Load global CSS
// document.writeln("<link type='text\/css' rel='stylesheet' href='../style/main.css'><\/script>");

gDebugShowElms=false;

gCXPDebug=false;
// =============================================================================
// Bookmark Jump Tag Table - Use the tags to search for bookmarks in the code
// =============================================================================
// Jump Tags  - Description
// -----------------------------------------------------------------------------
// 1176233654 -  PROC - "addTableRow()"
// 1176238636 -  PROC - "copyProps()"
// 1176238671 -  PROC - "updateTreeSelection()"
// 1176305779 -  PROC - "clearTable()"
//


//----------------------------------------------------------------------------//
// UI.JS include file
//----------------------------------------------------------------------------//

// NOTE:  IE will give a script error about an invalid character if you
// attempt to include a script file that does not exist.
// Paths are included relative to the page loading them, typically in the
// \pages path.

document.writeln("<script type='text\/javascript' src='../lib/eLang.js'><\/script>");
document.writeln("<script type='text\/javascript' src='../lib/eExt.js'><\/script>");

// document.writeln("<script type='text\/javascript' src='../lib/sysfn.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/eGUI.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/security.js'><\/script>");
// document.writeln("<script type='text\/javascript' src='../lib/xmit.js'><\/script>");

// I removed the link to load DOMAPI, and moved it to the frameTree.html file since
// that is the only frame that uses it.  There is no point in taking the load
// performance hit here if we don't need it, but I'll leave the link just in case.
// [BrandonB] 4/10/2007
// document.writeln("<script type='text\/javascript' src='../lib/domapi/src/domapi.js?theme=IBM'><\/script>");

//
// // Load global CSS
//document.writeln("<link type='text\/css' rel='stylesheet' href='../style/main.css'><\/script>");


// Little function to take an array of IDs and expose them
// in the global DOM.  IDs should have a leading underscore,
// and they will be exposed without it, for example an ID of
// _txtStatus will be exposed globally as txtStatus

function exposeElms(array)
{
	validateSession();

	if(array.length){

		for (var i=0;i<array.length;i++)
	    {
			var actualElm=array[i].substr(1);
			eval(actualElm+"=document.getElementById('"+array[i]+"');");
			if (gDebugShowElms)
				{
				eval(actualElm+".style.backgroundColor='#ffdf00';");	// Color the elms with yellow to show where they are
				eval(actualElm+".style.border='1px dashed purple';");	// Color the elms with yellow to show where they are
				eval(actualElm+".title='"+actualElm+"';");	// Show the elms ID on hover
	
				}
	
		}
		
	}
	
	updateHelpSection();
	
	
	chkSidebar();
	//addResizeListener();
}

this.document.onkeydown = function(e)
{
	if(!e) e = window.event;
	if(e.keyCode==116) //F5 Key = 116
	{
		top.g_userpressedF5 = true;
	}
}

function chkSidebar()
{
	if(top.frames["sidebar"].optioncontainer && top.frames["header"].hiliteSub)
	{
		top.frames["header"].hiliteSub();
	}
	else
	{
		setTimeout('chkSidebar()', 50);
	}
}

/*
function addResizeListener()
{
	if(top.mainFrame)
	{
		top.mainFrame.onresize = function()
		{
			var divs = top.mainFrame.document.getElementsByTagName('div');
			
			var listgrid = null;
			
			for(i=0;i<divs.length;i++)
			{
				if(divs[i].id.indexOf('GUID_')!=-1)
				{
					listgrid = divs[i];
					break;
				}
			}
						
			if(listgrid){
				//listgrid.style.width = top.mainFrame.document.body.offsetWidth - 30;
				listgrid.parentNode.removeChild(listgrid);
				top.mainFrame.doInit();
			}
		}
	}else
	{
		setTimeout('addResizeListener()', 100);
	}
}
*/

function updateHelpSection()
{
	if(top.frames["header"].gHelpOpen)
	{
		top.frames["header"].openHelp();
	}
}


function validateSession()
{
	if(window.location.href.indexOf('http')!=-1)
	{
		xmit.get({url:"/rpc/WEBSES/validate.asp",onrcv:validateSessResp, status:''});
	}
}

var validateSessResp = function()
{
	errcod = WEBVAR_JSONVAR_WEB_SESSION_VALIDATE.HAPI_STATUS;
	if(errcod != 0)
	{
		top.glogout = 1;
		top.location.href = "/sessionexpired.asp";
	}
}



//______________________________________________________________________________
//==============================================================================
//                               addTableRow
//------------------------------------------------------------------------------
// Given a reference to a table, and an array of cells to write, this function
// will create a new TR element and fill it with the same number of
// TD elements as the array length.  arg is an object whose properties I may
// need to expand upon as time goes by...
//
//
// Input
// -----
//   rTable - reference to a table
//
//   arCells - array of strings to go into the cells
//
//   oRowProps - object with properties to be applied to TR
//     Ex: {align:'center'}
//
//   arCellProps - array of objects with properties to be applied to each TD
//     Ex1: to add a row that spans 4 columns, you only need one cell entry
//				with a colspan
// 			 [{colspan:4, style:{ textAlign:'left', fontWeight:'bold'}}]
//     Ex2: to add centering and bold to each cell of a 3 column table
// 			[ {style:{ textAlign:'left', fontWeight:'bold'}},
// 			  {style:{ textAlign:'left', fontWeight:'bold'}},
// 			  {style:{ textAlign:'left', fontWeight:'bold'}} ]
// Output
// ------
//    -
//                                                                    Author:BMB
//______________________________________________________________________________
//==============================================================================
// Jump Tag 1176233654 [  PROC - "addTableRow()" ]

function addTableRow(rTable, arCells, arCellProps, oRowProps)
{
	// First get ref to parent for appending rows  - this could be the TABLE
	// or TBODY
	var p=rTable;	// parent container is TABLE
	var tb=rTable.getElementsByTagName("TBODY");
	if (tb.length)
		{
		p=tb[0];	// parent container is TBODY, not TABLE
		}
	var xx=document.createElement("TR");
	if (oRowProps!=undefined)
		{
		copyProps(xx,oRowProps);
		}
	for (var i=0;i<arCells.length;i++)
		{
		var yy=document.createElement("TD");
		yy.noWrap=true;
		var val=(arCells[i]==""?"&nbsp":arCells[i]);

		if (arCellProps!=undefined)
			{
			if (arCellProps[i]!=undefined)
				{
				copyProps(yy, arCellProps[i]);
				}
			}


      yy.innerHTML=val;
		xx.appendChild(yy);

		}
  	p.appendChild(xx);

}

//______________________________________________________________________________
//==============================================================================
//                                clearTable
//------------------------------------------------------------------------------
// Clears a table of all rows.  Used for redrawing the table after a sort
// or filter operation
//
// Input
// -----
//   rTable - reference to table
//
//   offset0Based - first row to start deleting.  All rows below this one will
// 				be clobbered.  Used to preserve table header rows.  Defaults
//					to 1 because typically this function will only be called for
//					dynamically updated tables, which will probably have a header row.
//					Pass 0 to kill all table rows.
//
// Output
// ------
//    -
//
//                                                                    Author:BMB
//______________________________________________________________________________
//==============================================================================
// Jump Tag 1176305779 [  PROC - "clearTable()" ]

function clearTable(rTable, offset0Based)
{
	var firstrow=(offset0Based==undefined?1:offset0Based);
	// First get ref to parent for appending rows  - this could be the TABLE
	// or TBODY
	var p=rTable;	// parent container is TABLE
	var tb=rTable.getElementsByTagName("TBODY");
	if (tb.length)
		{
		p=tb[0];	// parent container is TBODY, not TABLE
		}
	// Get all the TRs (rows)
	var aRows=p.getElementsByTagName("TR");
	var numrows=aRows.length-firstrow;
	for (var i=0;i<numrows;i++)
		{
		// When children are removed, they move down in the array so we keep
		// removing from the same index
		p.removeChild(aRows[firstrow]);
		}

}


//______________________________________________________________________________
//==============================================================================
//                                copyProps
//------------------------------------------------------------------------------
//
// Copies all props of an object to another object.  Only recurses into
// other objects.  Mainly used for copying DOM based styles to other objects
//
// Input
// -----
//   target - target obj/property
//
//   src - source object
//
// Output
// ------
//    -
//
//                                                                    Author:BMB
//______________________________________________________________________________
//==============================================================================
// Jump Tag 1176238636 [  PROC - "copyProps()" ]

function copyProps(target, src)
{
	for (var i in src)
		{
		if (typeof src[i] =='object' )
			{
			copyProps(target[i],src[i]);
			}
		else
			{
			target[i]=src[i];
			}
		}
}




//______________________________________________________________________________
//==============================================================================
//                           updateTreeSelection
//------------------------------------------------------------------------------
// Selects a tree node
//
// Input
// -----
//   node - name of the tree node, as specified by the reference var the node
// was assigned to when instantiated.
//
//   quiet - if true then don't click the node, just select it
//
// Output
// ------
//    -
//
//                                                                    Author:BMB
//______________________________________________________________________________
//==============================================================================
// Jump Tag 1176238671 [  PROC - "updateTreeSelection()" ]

function updateTreeSelection(node, quiet)
{
	var count=20;
	checkTree();
	function checkTree()
	{
		if (count)
			{
			if (top.gFrameTreeLoaded==true)
				{
				top.frames.frameTree.selectTreeNode(node, quiet);
				}
			else
				{
				count--;
				setTimeout(checkTree,200);
				}
			}
		else
			{
			alert("DEVERROR:  Could not wait for tree frame to load");
			}
	}
}

//______________________________________________________________________________
//==============================================================================
//                                 showWait
//------------------------------------------------------------------------------
//
//
// Input
// -----
//   enable -
//
//   text -
//
// Output
// ------
//    -
//
//______________________________________________________________________________
//==============================================================================
// Jump Tag 1119840669 [ Procedure Definition: showWait ]

function showWait(enable, text)
{
	if ((text==undefined)||(text=="") )
		{
		text= eLang.getString('common',"STR_WAIT")
		}
	document.getElementById("wait").innerHTML=enable?text+"&nbsp;<img height=10 style='position:relative;top:1px' src='/res/wait.gif'>":"";

//    wd=parent.headerFrame.document.getElementById("wait");
//    wd.visibility=enable?'visible':'hidden';
//    document.getElementById("wait").innerHTML=+"&nbsp;<img src=/Applications/"+parent.gApplicationName+"/Graphics/wait.gif>":"";

}

function convertToLocale(dateString)
{
	var CardDate = new Date(dateString + " GMT");
	return ( CardDate.toLocaleString() );
}


//______________________________________________________________________________
//==============================================================================
//                                 $
//------------------------------------------------------------------------------
//
//
// Input
// -----
//   HTMLElement ID -
//
// Output
// ------
//   HTMLElement - 
//
//______________________________________________________________________________
//==============================================================================

function $(id)
{
	return document.getElementById(id);
}



//=======================================
if(debugWnd==undefined && gCXPDebug){
var debugWnd = window.open('','debugger','width=640, height=480, scrollbars=yes');
}
function _debug(str)
{
	if(debugWnd == undefined || !gCXPDebug) return;
	debugWnd.document.writeln("<br>===========================================================<br>");
	debugWnd.document.writeln("<br>-----------------------------------------------------------<br>");	
	debugWnd.document.writeln("<br><b style='color:#009900'>Called from : "+window.location.href+"</b><br>");
	debugWnd.document.writeln("<i style='color:#0000CC'>Function Name: "+arguments.caller.name+' <br><br> '+arguments.caller.toString()+"</i>");
	debugWnd.document.writeln("<br>************************************************************<br>");	
	debugWnd.document.writeln("<br>===========================================================<br>");
	debugWnd.document.writeln(nl2br(str));
	debugWnd.document.writeln("<br>===========================================================<br>");
}

function nl2br(str)
{
	return str.replace(/\n/g,"<br>").replace(/\s/g,"&nbsp;");
}

var fnCookie = {
	read: function(name)
	{
		var nameEQ = name + "=";
		var ca = top.document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},
	create: function(name, value)
	{
		top.document.cookie = name+"="+value+"; path=/";
	},
	erase: function(name)
	{
		//set old to delete it
		top.document.cookie = name+"=; expires=Fri, 3 Aug 2001 20:47:11 UTC; path=/";
	}
};