//initialize the global variables
var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

var sensorResultsTable;
var showThresholds;
var SENSORINFO_DATA;
var tblJSON;
var gCurSensor = 0x00;

function doInit() {
	 // TODO: add page initialization code
 
	exposeElms(['_sensorType',
 				'_sensorDisplay',
 				'_lblHeader',
 				'_refreshView',
 				'_thresholds',
 				'_intrusionReset']);
 	
 	
	loadCustomPageElements();
	

	 
	 
}


function loadCustomPageElements()
{
	 //Initialize ListGrid
	sensorResultsTable = listgrid({
		w				: '100%',
		h				: '350px', //[Linda]
		doAllowNoSelect : true
	});
	

	sensorDisplay.appendChild(sensorResultsTable.table);
	
	//check the urlvars
	var sensorView=eExt.parseURLvars('view');
	if (sensorView==null)
		{
		sensorView='normal'
		};

/* If there is a listgrid embed in the page,
** please don't use resize event directly
** Use only via lGrid.onpageresize event 
*/
	sensorResultsTable.onpageresize = function()
	{
		this.table.style.width = '100%';
		this.table.style.width = this.container.header.offsetWidth+'px';
	}


	
	doSensors(sensorView);
	
}

function doTable(n)
{
	sensorResultsTable.clear();
	
	if(n==1)
	{
		
		
		tblJSON = {
					cols:[
						{text:eLang.getString('common',"STR_APP_STR_171"), fieldName:'name', w:'5%'},
						{text:eLang.getString('common',"STR_APP_STR_172"), fieldName:'status', w:'20%'},
						{text:eLang.getString('common',"STR_APP_STR_173"), fieldName:'reading', w:'15%'},
						{text:eLang.getString('common',"STR_APP_STR_174"), fieldName:'lowNR', w:'10%'},
						{text:eLang.getString('common',"STR_APP_STR_175"), fieldName:'lowCT', w:'10%'},
						{text:eLang.getString('common',"STR_APP_STR_176"), fieldName:'lowNC', w:'10%'},
						{text:eLang.getString('common',"STR_APP_STR_177"), fieldName:'highNC', w:'10%'},
						{text:eLang.getString('common',"STR_APP_STR_178"), fieldName:'highCT', w:'10%'},
						{text:eLang.getString('common',"STR_APP_STR_179"), fieldName:'highNR', w:'10%'}
						]
						};
		
		sensorResultsTable.loadFromJson(tblJSON);
		
		setTimeout(function(){
				var vhref=top.document.getElementsByTagName('frameset')[1];
				var	vcolsa=vhref.cols.split(",");
				sensorResultsTable.table.style.width = (document.body.scrollWidth+parseInt(vcolsa[2])-10)+'px';
			}, 30);
		
		showThresholds = 1;
		/* Change button title to hide thresholds */
		thresholds.value = eLang.getString('common',"STR_APP_STR_165");
	}else
	{
	
		
		tblJSON = {
					cols:[
						{text:eLang.getString('common',"STR_APP_STR_171"), fieldName:'name', w:'25%'},
						{text:eLang.getString('common',"STR_APP_STR_172"), fieldName:'status', w:'49%'},
						{text:eLang.getString('common',"STR_APP_STR_173"), fieldName:'reading', w:'25%'}
						]
						};
		
		sensorResultsTable.loadFromJson(tblJSON);
		
		sensorResultsTable.table.style.width = "100%";
		
		showThresholds = 0;
		/* Change button title back to show thresholds */
		thresholds.value = eLang.getString('common',"STR_APP_STR_166");
	}
	
}


function doSensors(showTH)
{
	showThresholds = showTH;
	doTable(showThresholds);
	
	sensorType.onchange = function()
	{
		gCurSensor = sensorType.options.selectedIndex;
		RefreshSensors();
	}
	
	refreshView.onclick = IPMICMD_HL_GetSensorsInfo;
	thresholds.onclick = IPMICMD_HL_ShowThresholds;
	intrusionReset.onclick = resetChassisIntrusion;
	
	setTimeout(IPMICMD_HL_GetSensorsInfo, 750);
}


function IPMICMD_HL_ShowThresholds()
	{
	if (showThresholds == 0)
		{
		doTable(1);
		RefreshSensors();
		
		
		}
	else
		{
		doTable(0);
		RefreshSensors();
		
		}
	}
	
function RefreshSensors()
{
	var count = 0;
	var j = 0;
	var unitstr="";
	var state="";
	var SensorReading;
	
	var JSONRows = new Array();
	tblJSON.rows = new Array();

	sensorResultsTable.clear();
	for(j=0;j<SENSORINFO_DATA.length;j++)
	{
		if((SENSORINFO_DATA[j].SensorType == sensorType.value) || (sensorType.value == 0))
		{
			if(SENSORINFO_DATA[j].SensorAccessibleFlags == 0xD5)
			{
				unitstr = "";
				//SensorReading = eLang.getString('common',"STR_APP_STR_167");
				SensorReading = "No Reading";
			}
			else
			{
				if(SENSORINFO_DATA[j].SensorType == 0x08){
					if(((SENSORINFO_DATA[j].SensorReading)/1000) == 0) {
						unitstr = "";
						SensorReading = "OK";
					} else if(((SENSORINFO_DATA[j].SensorReading)/1000) == 2) {
						unitstr = "";
						SensorReading = "Failure";	
					} else if(((SENSORINFO_DATA[j].SensorReading)/1000) == 1) {
						unitstr = "";
						SensorReading = "Failure";	
					}
				} else if(SENSORINFO_DATA[j].SensorType == 0x05){
					if(((SENSORINFO_DATA[j].SensorReading)/1000) == 0) {
						unitstr = "";
						SensorReading = "OK";			
					}  else if(((SENSORINFO_DATA[j].SensorReading)/1000) == 1) {
						unitstr = "";
						SensorReading = "Detected";	
					}
				} else if(SENSORINFO_DATA[j].SensorType == 0xC0){  //[Farida] added
					unitstr = "";
					SensorReading = (SENSORINFO_DATA[j].SensorReading)/1000;
					
					// [Linda] modified CPU Temp status
					if (SensorReading == 0) {
						//state = eLang.getString('cpu_temp',"CPU_LOW_TEMP");
						state = "Normal";
						SensorReading = eLang.getString('cpu_temp',"CPU_LOW_TEMP");
					} else if (SensorReading == 1) {
						//state = eLang.getString('cpu_temp',"CPU_MEDIUM_TEMP");
						state = "Normal";
						SensorReading = eLang.getString('cpu_temp',"CPU_MEDIUM_TEMP");
					} else if (SensorReading == 2) {
						//state = eLang.getString('cpu_temp',"CPU_HIGH_TEMP");
						state = "Normal";
						SensorReading = eLang.getString('cpu_temp',"CPU_HIGH_TEMP");
					} else if (SensorReading == 4) {
						//state = eLang.getString('cpu_temp',"CPU_OVER_HEAT");
						state = "Abnormal";
						SensorReading = eLang.getString('cpu_temp',"CPU_OVER_HEAT");
					} 	
					//SensorReading = "";
				} else {
					unitstr = eLang.getString('unittype',SENSORINFO_DATA[j].SensorUnit2);
					SensorReading = (SENSORINFO_DATA[j].SensorReading)/1000;
				}
			}

			if(SENSORINFO_DATA[j].SensorState)
			{
				state = "";
				for (whichbit = 0; whichbit <= 7; ++whichbit)
				{
					if (SENSORINFO_DATA[j].SensorState & (0x01 << whichbit))
					{
						state = state + eLang.getString('threshstate',(0x01 << whichbit)) + " ";
					}
				}
			}
			else
			{
				DiscreteSensorReading = SensorReading;
				if ((SENSORINFO_DATA[j].DiscreteState >= 0x02) && (SENSORINFO_DATA[j].DiscreteState <= 0x0C))
				{
					state = "";
					for(whichbit = 0;whichbit <= 7 && DiscreteSensorReading;whichbit++)		
					{
						if(DiscreteSensorReading & 0x01)
						{
							state = state + eLang.getString('event',SENSORINFO_DATA[j].SensorType,whichbit) + " ";
						}
						DiscreteSensorReading = DiscreteSensorReading >> 1;
					}

				}
				else if (0x6F == SENSORINFO_DATA[j].DiscreteState)
				{
					state = "";
					for(whichbit = 0;whichbit <= 7 && DiscreteSensorReading;whichbit++)		
					{
						if(DiscreteSensorReading & 0x01)
						{
							state = state + eLang.getString('sensor_specific_event',SENSORINFO_DATA[j].SensorType,whichbit) + " ";
						}
						DiscreteSensorReading = DiscreteSensorReading >> 1;
					}
				}
			}

			if(SENSORINFO_DATA[j].SensorAccessibleFlags == 0xD5)
			{
				state = eLang.getString('common',"STR_APP_STR_167");
			}
			else
			{
				/*if (SENSORINFO_DATA[j].SensorType == 0x05 || SENSORINFO_DATA[j].SensorType == 0x08) {
					if (!state) 
						state = eLang.getString('common',"STR_APP_STR_167");
					state = SensorReading;
					SensorReading = ""; 
					state = "";
				}*/			
			}
									
			// [Farida] added for -12V
			if (SENSORINFO_DATA[j].SensorType == 0x02) {
				if (SensorReading == -47.5) {
					SensorReading = 0;
				}
			}	

			if (SENSORINFO_DATA[j].SensorType == 0x05 || SENSORINFO_DATA[j].SensorType == 0x08) {
				state = "";
			}			
			
			if(showThresholds == 1)
			{
				if (SENSORINFO_DATA[j].SensorState)
				{
					
				JSONRows.push({cells:[
							{text:SENSORINFO_DATA[j].SensorName, value:SENSORINFO_DATA[j].SensorName},
							{text:state, value:state},
							{text:((SensorReading))+" "+unitstr, value:((SensorReading))+" "+unitstr},
							{text:((SENSORINFO_DATA[j].LowNRThresh)/1000)+" "+unitstr, value:((SENSORINFO_DATA[j].LowNRThresh)/1000)+" "+unitstr},
							{text:(SENSORINFO_DATA[j].LowCTThresh/1000)+" "+unitstr, value:(SENSORINFO_DATA[j].LowCTThresh/1000)+" "+unitstr},
							{text:(SENSORINFO_DATA[j].LowNCThresh/1000)+" "+unitstr, value:(SENSORINFO_DATA[j].LowNCThresh/1000)+" "+unitstr},
							{text:(SENSORINFO_DATA[j].HighNCThresh/1000)+" "+unitstr, value:(SENSORINFO_DATA[j].HighNCThresh/1000)+" "+unitstr},
							{text:(SENSORINFO_DATA[j].HighCTThresh/1000)+" "+unitstr, value:(SENSORINFO_DATA[j].HighCTThresh/1000)+" "+unitstr},
							{text:(SENSORINFO_DATA[j].HighNRThresh/1000)+" "+unitstr, value:(SENSORINFO_DATA[j].HighNRThresh/1000)+" "+unitstr}
							]});
				}
				else
				{
					JSONRows.push({cells:[
							{text:SENSORINFO_DATA[j].SensorName, value:SENSORINFO_DATA[j].SensorName},
							{text:state, value:state},
							{text:((SensorReading))+" "+unitstr, value:((SensorReading))+" "+unitstr},
							{text:"N/A"+" "+unitstr, value:"N/A"+" "+unitstr},
							{text:"N/A"+" "+unitstr, value:"N/A"+" "+unitstr},
							{text:"N/A"+" "+unitstr, value:"N/A"+" "+unitstr},
							{text:"N/A"+" "+unitstr, value:"N/A"+" "+unitstr},
							{text:"N/A"+" "+unitstr, value:"N/A"+" "+unitstr},
							{text:"N/A"+" "+unitstr, value:"N/A"+" "+unitstr}
							 ]});
				}
			}
			else
			{
				
				 JSONRows.push({cells:[
				 		{text:SENSORINFO_DATA[j].SensorName, value:SENSORINFO_DATA[j].SensorName},
						{text:state, value:state},
						{text:(SensorReading)+" "+unitstr, value:(SensorReading)+" "+unitstr}
						]
						});

			}
			
			count++;
		}
	}
	

	tblJSON.rows = JSONRows;
	
	
	sensorResultsTable.loadFromJson(tblJSON);

	lblHeader.innerHTML = eLang.getString('common',"STR_APP_STR_168")+count+eLang.getString('common',"STR_APP_STR_169");
	


	refreshView.onclick = IPMICMD_HL_GetSensorsInfo;

	intrusionReset.onclick = resetChassisIntrusion;
	thresholds.onclick = IPMICMD_HL_ShowThresholds;

}



function IPMICMD_GetSensors_Res(arg)
{
	showWait(false);


	var CmdStatus = WEBVAR_JSONVAR_HL_GETALLSENSORS.HAPI_STATUS;
	if (CmdStatus == 0)
	{
		SENSORINFO_DATA = WEBVAR_JSONVAR_HL_GETALLSENSORS.WEBVAR_STRUCTNAME_HL_GETALLSENSORS;
		if (!SENSORINFO_DATA.length)
		{
			alert(eLang.getString('common',"NO_SENSOR_STRING"));
			lblHeader.innerHTML = eLang.getString('common',"STR_APP_STR_168")+(SENSORINFO_DATA.length)+eLang.getString('common',"STR_APP_STR_169");
			return;
		}
		
		optind = 0;
		
		sensorType.innerHTML = '';
		
	   	for(i in gSensorTypeCodes)
    	{
	     if(sensorExists(i) || i==0x00)
	     sensorType.add(new Option(gSensorTypeCodes[i],i),isIE?optind++:null);
	    }

		sensorType.options[gCurSensor].selected = true;
		
		setIntrusionResetVisibility();

		RefreshSensors();
	}
	else
	{
		errstr = eLang.getString('common',"STR_SENSOR_GETVAL")
		errstr +=  (eLang.getString('common','STR_IPMI_ERROR')+GET_ERROR_CODE(CmdStatus));
		alert(errstr);
	}
}


function IPMICMD_HL_GetSensorsInfo()
	{

	showWait(true);
	//xmit.get({url:"/rpc/getextbmccfg.asp",onrcv:ProcessExtBMCCfg,status:''});

	xmit.get({url:"/rpc/getallsensors.asp",onrcv:IPMICMD_GetSensors_Res, status:'',timeout:120,ontimeout:TimedOut});
	}

function TimedOut()
{
	alert(eLang.getString('common', "STR_APP_STR_170"));
	showWait(false);
}


function dosort(i,dir)
	{
	sensorResultsTable.sortCol(i,dir);
	showWait(false);


	}

function SortWithWaitMsg(i,dir)
	{

	document.getElementById("wait").style.visibility='visible';
	showWait(true, eLang.getString('common',"STR_SORTING"));


	setTimeout("dosort("+i+","+dir+")",1000);
	}
	
function sensorExists(i)
{
  for(_ex=0; _ex<SENSORINFO_DATA.length; _ex++)
  {
    if(SENSORINFO_DATA[_ex].SensorType == i)
      return true;
  }
  return false;
}

function setIntrusionResetVisibility()
{
  for(_ex=0; _ex<SENSORINFO_DATA.length; _ex++)
  {
	if(SENSORINFO_DATA[_ex].SensorType == 0x05){
		if((SENSORINFO_DATA[_ex].SensorReading) == 0x00) {
			document.getElementById('_intrusionReset').style.visibility='hidden';
			
		} else {
			document.getElementById('_intrusionReset').style.visibility='visible';	
		}
		break;
	}
  }
}

function resetChassisIntrusion() {
	showWait(true);	
	xmit.get({url:"/rpc/intrusionreset.asp",onrcv:ProcessResetChassisIntrusion, status:'',timeout:120,ontimeout:TimedOut});
}

function ProcessResetChassisIntrusion(arg) {
	showWait(false);
	
	var CmdStatus = WEBVAR_JSONVAR_RESETSTATUS.HAPI_STATUS;
	
	if (CmdStatus != 0)
	{
		errstr = eLang.getString('common','STR_INTRUSION_RESET_ERROR');
		errstr += (eLang.getString('common','STR_IPMI_ERROR') + GET_ERROR_CODE(CmdStatus));
		alert (errstr);
		return;
	}
	IPMICMD_HL_GetSensorsInfo();
}
	
gSensorTypeCodes = [];
gSensorTypeCodes[0x00] = "All Sensors";
gSensorTypeCodes[0x01] = "Temperature Sensors";
gSensorTypeCodes[0x02] = "Voltage Sensors";
gSensorTypeCodes[0x03] = "Current Sensors";
gSensorTypeCodes[0x04] = "Fan Sensors";
gSensorTypeCodes[0x05] = "Physical Security";
gSensorTypeCodes[0x06] = "Platform Security Violation Attempt";
gSensorTypeCodes[0x07] = "Processor";
gSensorTypeCodes[0x08] = "Power Supply";
gSensorTypeCodes[0x09] = "Power Unit";
gSensorTypeCodes[0x0A] = "Cooling Device";
gSensorTypeCodes[0x0B] = "Other Units-based Sensor";
gSensorTypeCodes[0x0C] = "Memory";
gSensorTypeCodes[0x0D] = "Drive Slot";
gSensorTypeCodes[0x0E] = "POST Memory Resize";
gSensorTypeCodes[0x0F] = "System Firmware Progress";
gSensorTypeCodes[0x10] = "Event Logging Disabled";
gSensorTypeCodes[0x11] = "Watchdog 1";
gSensorTypeCodes[0x12] = "System Event";
gSensorTypeCodes[0x13] = "Critical Interrupt";
gSensorTypeCodes[0x14] = "Button / Switch";
gSensorTypeCodes[0x15] = "Module / Board";
gSensorTypeCodes[0x16] = "Microcontroller / Coprocessor";
gSensorTypeCodes[0x17] = "Add-in Card";
gSensorTypeCodes[0x18] = "Chassis";
gSensorTypeCodes[0x19] = "Chip Set";
gSensorTypeCodes[0x1A] = "Other FRU";
gSensorTypeCodes[0x1B] = "Cable / Interconnect";
gSensorTypeCodes[0x1C] = "Terminator";
gSensorTypeCodes[0x1D] = "System Boot Initiated";
gSensorTypeCodes[0x1E] = "Boot Error";
gSensorTypeCodes[0x1F] = "OS Boot";
gSensorTypeCodes[0x20] = "OS Critical Stop";
gSensorTypeCodes[0x21] = "Slot / Connector";
gSensorTypeCodes[0x22] = "System ACPI Power State";
gSensorTypeCodes[0x23] = "Watchdog 2";
gSensorTypeCodes[0x24] = "Platform Alert";
gSensorTypeCodes[0x25] = "Entity Presence";
gSensorTypeCodes[0x26] = "Monitor ASIC / IC";
gSensorTypeCodes[0x27] = "LAN";
gSensorTypeCodes[0x28] = "Management Subsystem Health";
gSensorTypeCodes[0x29] = "Battery";
gSensorTypeCodes[0x2A] = "Session Audit";
gSensorTypeCodes[0x2B] = "Version Change";
gSensorTypeCodes[0x2C] = "FRU State";
gSensorTypeCodes[0xC0] = "OEM reserved";
//if more add here

