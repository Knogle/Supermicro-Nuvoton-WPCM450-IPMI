// cimprofile.js

// this file provides implementation for cimprofile page

// load domapi's tree control
domapi.loadUnit("tree");

// load wsman libs
wsman.loadFile("xml_json.js");
wsman.loadFile("resource.js");

var CIM_RES_URI = "http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/";
var wsmanURI = null;

var profiles = { Sensor : "Profiles/SensorProfile.xml",
				 Log : "Profiles/LogProfile.xml",
				 Network : "Profiles/NetworkProfile.xml",
				 Fan : "Profiles/FanProfile.xml",
				 Power : "Profiles/PowerStateManagementProfile.xml",
				BaseServerprofile : "Profiles/BaseServerprofile.xml",
				BootControlProfile : "Profiles/BootControlProfile.xml",
				ChassisManagerProfile : "Profiles/ChassisManagerProfile.xml",
				DHCPClient : "Profiles/DHCPClient.xml",
				DNSClientProfile : "Profiles/DNSClientProfile.xml",
				IndicationsProfile : "Profiles/IndicationsProfile.xml",
				IndicatorLED : "Profiles/IndicatorLED.xml",
				IPInterface : "Profiles/IPInterface.xml",
				PhysicalAssetProfile : "Profiles/PhysicalAssetProfile.xml",
				PlatformWatchdogServiceProfile : "Profiles/PlatformWatchdogServiceProfile.xml",
				powersupply : "Profiles/powersupply.xml",
				RoleBasedAuthorizationProfile : "Profiles/RoleBasedAuthorizationProfile.xml",
				SimpleIdentityManagementProfile : "Profiles/SimpleIdentityManagementProfile.xml",
				SMASHCollectionsProfile : "Profiles/SMASHCollectionsProfile.xml",
				SoftwareInventoryProfile : "Profiles/SoftwareInventoryProfile.xml",
				SoftwareUpdateProfile : "Profiles/SoftwareUpdateProfile.xml",
				SSHServiceProfile : "Profiles/SSHServiceProfile.xml",
				TelnetServiceProfile : "Profiles/TelnetServiceProfile.xml",
				TextConsoleRedirectionProfile : "Profiles/TextConsoleRedirectionProfile.xml"
		};

// classnames belonging to root/interop namespace
var g_interops = [ 
					"CIM_RegisteredProfile"
				 ];
			   
// current profile info
var profile = null;
var profName = null;
			   
// store tree info globally
var profTree = null;
var regNode = null;
var assocNode = null;

// find wsmanuri based on URL and put it in text box
document.getElementById("txtWSMANURI").value = 
		/^https?:\/\/[^\/]*\//.exec(document.URL)[0] + "wsman";

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

function addTree()
{
	profTree = domapi.Tree({parent:document.getElementById("treeParent"), w:300, h:500, doShowLines:true});
	profTree.onchange = treeNodeSelected;
	//loadProfile("LogProfile.xml");
}
//alert('addTree loaded');

function clearUI()
{
	// clear tree
	profTree.clear();
	profTree.init();
	
	// property table  
	var table = document.getElementById("tblProperties");
	while (table.rows.length > 1) {
		table.deleteRow(table.rows.length - 1);
	}
	
	// instance name text
	var txt = document.getElementById("txtInstName");
	txt.value = "";
}

function displayInstance(instance)
{
	/*
	<tr>
		<td valign="top" class="tddatalight" width=190px height=4px> aaa</td>
		<td valign="top" class="tddatalight" height=6px> 1</td>
		<td valign="top" class="tddatalight" height=6px> 1</td>
	</tr>
	*/
	
	// display instance name
	var txt = document.getElementById("txtInstName");
	txt.value = getInstanceName(instance);
	
	// display properties in the table
	var table = document.getElementById("tblProperties");
	
	// remove all rows except the title row
	while (table.rows.length > 1) {
		table.deleteRow(table.rows.length - 1);
	}

	for (var prop in instance)
	{
		if (typeof instance[prop] == "function"
			|| prop.charAt(0) == '$'
			|| prop.charAt(0) == '@')
			continue;
		
		var row = table.insertRow(-1);

		var propCell = row.insertCell(-1);
		propCell.vAlign = "top";
		propCell.className = "tddatalight";
		propCell.width = "190px";
		propCell.height = "4px";
		propCell.innerHTML = prop;

		var valueCell = row.insertCell(-1);
		valueCell.vAlign = "top";
		valueCell.className = "tddatalight";
		valueCell.height = "6px";
		valueCell.innerHTML = instance[prop];
		
		var typeCell = row.insertCell(-1);
		typeCell.vAlign = "top";
		typeCell.className = "tddatalight";
		typeCell.height = "6px";
	}
}

function loadProfile(file)
{
	try {
		debugOut("loadProfile : " + file);
		clearUI();

		// take WSMAN URI
		wsmanURI = document.getElementById("txtWSMANURI").value;
		if (wsmanURI == "") {
			alert("Please enter WSMAN URI and then select a profile");
			return;
		}

		profTree.init(); 

		SendGETRequest(file, recv);
		modDebug("loadProfile", "sent requst to get profile file: " + file); 
	} catch (e) {
		alert("error loading profile before getting file: " + e);
		return;
	}
	
	function recv(profText)
	{
		try {
			if (profText.exception)
				throw profText;
				
			modDebug("loadProfile", "receveived profile file ", profText);
			var doc = XML.createXMLDocument(profText);
			profName = doc.documentElement.getAttribute("name");
			profile = XML_JSON.parseXML2JSON(doc.documentElement);
			
			// create profile name node
			var profNameNode = profTree.addNode( { text : profName } );
			
			regNode  = profTree.addNode({text:"Regular Classes", parent:profNameNode});
			assocNode = profTree.addNode({text:"Association Classes", parent:profNameNode});
	
			// add regular classes to the tree
			for (var i = 0; i < profile["class"].length; i++) {
				var rNode = profTree.addNode( { text : profile["class"][i]["@name"], parent : regNode, 
												img : "images/class_obj.gif",
												cimtype : "regular class" } );
				// get its associated classes
				var acNode = profTree.addNode({text:"Associated Classes",parent:rNode,
												img:"images/walk_assoc_obj.gif"});
				var asoctedClasses = getAssociatedClasses(profile, profile["class"][i]["@name"]);
				for (var j = 0; j < asoctedClasses.length; j++) {
					profTree.addNode( { text : asoctedClasses[j], parent : acNode,
										img : "images/class_obj.gif" } );
				}
			}
			
			// add association classes to the tree
			for (var i = 0; i < profile.association.length; i++) {
				var assoc = profile.association[i];
				var aNode = profTree.addNode( { text : assoc["@classname"], parent : assocNode,
												img : "images/assocclass16.gif" } );
				// append classes it associates
				for (var j = 0; j < assoc["class"].length; j++) {
					profTree.addNode( { text : assoc["class"][j]["@name"], parent : aNode,
										img : "images/class_obj.gif"} );
				}
			}
			
			profTree.init(); 
			modDebug("loadProfile", "tree loaded with " + profName);
			
			// set profile name in other UI
			document.title = "CIM Profile - ".concat(profName);
			document.getElementById("lblProfileName").innerHTML = "Profile Name: \"" + profName + "\"";
		} catch (e) {
			alert("error loading tree : " + e);
		}
	}
}

function treeNodeSelected()
{
	// if regular cim class is selected, enum its instances
	modDebug("treeNodeSelected","inside");
	if (profTree.selected.cimtype && profTree.selected.cimtype == "regular class") {
		if (profTree.selected.nodes.length == 1) {
			enumInstances(profTree.selected);
		}
	}
	else if (profTree.selected.cimobject) {
		displayInstance(profTree.selected.cimobject);
	}
}

function enumInstances(classNode)
{
	var className = classNode.text;
	try {
		var classRes = new wsman.Resource(CIM_RES_URI + className);

		var parsed = false;
		classRes.resourceBinder = { 
			toObject : function(node) {
				var o = XML_JSON.parseXML2JSON(node);

				// storing the classname also in instance with $ prefix
				o.$className = node.nodeName;

				return o;
			}
		}
		var epr = new WSMAN_EPR(wsmanURI);
		// add __cimnamespace to root/interop if this class belongs to that namespace
		for (var i = 0; i < g_interops.length; i++) {
			if (g_interops[i] == className) {
				epr.selectorSet = [{name:"__cimnamespace",value:"root/interop"}];
			}
		}
		classRes.enumerateInstances(epr, enumResp);
		showWait(true, "Please wait while enumerating instances of " + className + "...");
		//alert(enumResp);
		
	} catch (e) {
		alert("couldnt enum instances of " + className + "; " + e);
	}
	
	function enumResp(instances)
	{
		showWait(false);
		if (instances.exception) {
			alert("could not enum instances of " + className + "; " + instances);
			return;
		}

		for (var i = 0; i < instances.length; i++) {
			var instance = instances[i];
			var name = getInstanceName(instance);
			profTree.addNode( { text : name, parent : classNode, cimobject : instance,
								img : "images/instance_obj.gif"} );
			modDebug("enuminstances", "added " + name + "to " + classNode.text);
		}
		profTree.init(classNode);
		profTree.expandNode(classNode);
		modDebug("enuminstances", "called init");
	}
		
}

function getInstanceName(instance) 
{
	var name = null;
	if (instance.Caption && instance.Caption != "")
		name = instance.Caption;
	else if (instance.Name && instance.Name != "")
		name = instance.Name;
	else if (instance.DeviceID && instance.DeviceID != "")
		name = instance.DeviceID;
	else
		name = instance.$className;
	
	return name;
}

function getAssociatedClasses(p, cName)
{
	// for each association class
	var actedCls = [ ];
	
	for (var i = 0; i < profile.association.length; i++) {
		var assoc = profile.association[i];
		var others = new Array();
		var add = false;
		
		// get its classes and see if it has "cName" class
		for (var j = 0; j < assoc["class"].length; j++) {
			var cl = assoc["class"][j];
			if (cl["@name"] == cName)
				add = true;
			else
				others.push(cl["@name"]);
		}
		if (add)
			actedCls = actedCls.concat(others);
	}
	
	return actedCls;
}
