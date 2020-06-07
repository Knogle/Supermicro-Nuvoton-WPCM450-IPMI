// cimenum.js

// This file provides functionality to cimenum.html file

// find wsmanuri based on URL and put it in text box
document.getElementById("txtWSMANURI").value = 
		/https?:\/\/[^\/]*\//.exec(document.URL)[0] + "wsman";

// display xml in the textaread
function displayItems(items)
{
	for (var i = 0; i < items.length; i++) {
		items[i] = XML.makeHTMLDisplayable(items[i]);
		$("xml").innerHTML = $("xml").innerHTML.concat("<br/>=======================================<br/>",
											   items[i]);
	}
}

// wait while getting data from server
function showWait(enable, text)
{
	if(document.getElementById('WaitDiv') != undefined)
	{
		if(enable)
		{
			document.getElementById('WaitDiv').style.visibility="visible";
			document.getElementById("WaitMsg").innerHTML=text || "Retrieving data... Please wait...";
			//window.scrollTo(0, 0);	// scroll window to top so that retreiving part is visible
		}
		else
		{
			document.getElementById('WaitDiv').style.visibility="hidden";		
						
		}
	}

}

function $(id) {
	return document.getElementById(id);
}

function getUserData()
{
	var userdata = { uri: null, enumClassName : null, instance : { className : null, properties : { } },
					 associationClassName : null, role : null, resultClassName : null, resultRole : null,
					 enumMode : null };
	
	userdata.uri = $("txtWSMANURI").value;
	userdata.enumClassName = $("txtClassName").value;
	userdata.instance.className = $("txtInsClassName").value;
	
	for (var i = 1; i <= 8; i++) {
		var propName = $("txtPropName" + i).value;
		if (propName && propName != "")
			userdata.instance.properties[propName] = $("txtPropValue" + i).value;
	}
	
	userdata.associationClassName = $("txtAssociationClassName").value;
	userdata.role = $("txtRole").value;
	userdata.resultClassName = $("txtResultClassName").value;
	userdata.resultRole = $("txtResultRole").value;
	
	userdata.enumMode = $("txtEnumMode").value;
	
	return userdata;
}

function clearItems() {
	$("xml").innerHTML = "";
}

// ----------------- WS Man functions --------------- //

var enumeration = null;
wsman.loadFile("xml_json.js");
wsman.loadFile("Enumeration.js");

function startEnum()
{
	try {
	
		// get info entered by user
		var userdata = getUserData();
		
		wsman.uri = userdata.uri;
		var resURIStart = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/";
		var resURI = resURIStart + userdata.enumClassName;
		
		enumeration = new wsman.Enumeration( { address : wsman.uri, resourceURI : resURI } );
		enumeration.itemBinder = {
			toObject : function(node) {
				return XML.getDocXMLText(node, true);
			}
		}
		
		var cimFilter = null;
		
		if (userdata.instance.className)
		{
			var selSet = [ ];
						for (var propName in userdata.instance.properties) {
							selSet.push( { name : propName, value : userdata.instance.properties[propName] } );
			}
			cimFilter = new wsman.AssocInstFilter(new WSMAN_EPR(wsman.uri, resURIStart + userdata.instance.className, selSet),
											userdata.associationClassName,
											userdata.role,
											userdata.resultClassName,
											userdata.resultRole);
		}
		
		enumeration.enumerate({ EnumerationMode : userdata.enumMode, Filter : cimFilter, callback : enumRecv });
		clearItems();
		showWait(true, "Please wait while it is getting enumerated...");
	} 
	catch (e) {
		alert("could not enumerate : " + e.message);
	}
}

function enumRecv(e)
{
	if (e.exception) {
		alert("could not enumerate: " + e.message);
		return;
	}
	alert("enumerated successfully");
	showWait(true, "Please wait while getting data...");
	try {
		enumeration.pullItems(itemsRecv);
	} catch (e) {
		alert("error pulling: " + e.message);
	}
}

function itemsRecv(data, completed)
{
	if (data.exception) {
		alert("Could not receive items: " + data.message);
		return;
	}
	
	try {
		displayItems(data);
		if (completed) {
			showWait(false);
			alert("Enumeration completed");
		}
		else
			enumeration.pullItems(itemsRecv);
	} 
	catch (e) {
		alert("Could not receive items: " + e.message);
	}
}
