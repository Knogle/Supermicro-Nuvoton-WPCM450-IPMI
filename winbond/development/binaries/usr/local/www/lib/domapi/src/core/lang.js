//------------------------------------------------------------------------------
// DomAPI multilingual routines
// D. Kadrioski 5/4/2002
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.loadLang = function(s){
  domapi.loadUnit("../lang/" + s, 1);
};
//------------------------------------------------------------------------------
domapi.lang = {};
//------------------------------------------------------------------------------
domapi.getString = function(key){
  var s = domapi.lang[key];
  if(typeof s == "undefined")s = key;
  return s;
};
//------------------------------------------------------------------------------
domapi.formatGetString = function(key,p){
  domapi.assertUnit("sysutils");
  return sysutils.formatString(domapi.getString(key),p);
};
//------------------------------------------------------------------------------
// english, overwrite values in separate language files
domapi.lang["DATE_FORMAT"         ] = "mm/dd/yyyy";
domapi.lang["STATECODES"          ] = "AK,AL,AR,AS,AZ,CA,CO,CT,DC,DE,FL,GA,GU,HI,IA,ID,IL,IN,KS,KY,"+
                                      "LA,MA,MD,ME,MI,MN,MO,MP,MS,MT,NC,ND,NE,NH,NJ,NM,NV,NY,OH,OK,"+
                                      "OR,PA,PR,RI,SC,SD,TN,TX,UT,VA,VI,VT,WA,WI,WV,WY".split(",");
domapi.lang["WEEKDAYS"            ] = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");
domapi.lang["SHORTWEEKDAYS"       ] = "Su,Mo,Tu,We,Th,Fr,Sa".split(",");
domapi.lang["STARTOFWEEK"         ] = 0; // sunday
domapi.lang["TODAYSTR"            ] = "Today";
domapi.lang["MONTHS"              ] = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
domapi.lang["SHORTMONTHS"         ] = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");
domapi.lang["DROPDOWN_OPEN"       ] = "Click to open";
domapi.lang["DROPDOWN_CLOSE"      ] = "Click to close";
domapi.lang["HANDLER_NO_ATTACH"   ] = "Handler could not be attached.";
domapi.lang["HANDLER_NO_DETACH"   ] = "Handler could not be removed.";
domapi.lang["COLORPICKER_SAFE"    ] = "Safe";
domapi.lang["COLORPICKER_CUSTOM"  ] = "Custom";
domapi.lang["COLORPICKER_SELECT"  ] = "Click to select";
domapi.lang["LISTGRID_SORT"       ] = "Click to sort";
domapi.lang["LISTGRID_RESIZE"     ] = "Drag to resize";
domapi.lang["VAL_DOLLAR"          ] = "Please enter a valid dollar amount.";
domapi.lang["VAL_STATE"           ] = "Invalid state code. Please enter 2-letter state abbreviation.";
domapi.lang["VAL_STRING"          ] = "You must provide a %1";
domapi.lang["VAL_STRING_LEN"      ] = "%1 must be at least %2 character%3 long.";
domapi.lang["VAL_ZIP"             ] = "Invalid zip code. Please enter 5-digit or 9-digit zip code.";
domapi.lang["VAL_NUMBER"          ] = "You must provide a valid %1";
domapi.lang["VAL_DATE"            ] = "%1 is not a valid date.  Please use %2 format.";
domapi.lang["WINDOW_NOT_IFRAME"   ] = "Cannot load a URL into a window without an IFRAME.";
domapi.lang["WINDOW_MINIMIZE"     ] = "Minimize";
domapi.lang["WINDOW_MAXIMIZE"     ] = "Maximize";
domapi.lang["WINDOW_RESTORE"      ] = "Restore";
domapi.lang["WINDOW_HELP"         ] = "Help";
domapi.lang["WINDOW_CLOSE"        ] = "Close";
domapi.lang["GRID_CTRL_SEL"       ] = "Control row (0) cannot be selected.";
domapi.lang["GRID_CTRL_SWP"       ] = "Control row (0) cannot be swapped.";
domapi.lang["GRID_CTRL_DEL"       ] = "Control row (0) cannot be deleted.";
domapi.lang["GRID_NO_SEL"         ] = "Grid does not allow there to be no selection (doAllowNoSelect=false)";
domapi.lang["RPC_DEF_STATUS"      ] = "Loading";
domapi.lang["RPC_TIMED_OUT"       ] = "Packet which already timed out finally received.";
domapi.lang["RPC_NO_HEAD1"        ] = "No HEAD tag found! Document is not well-formed. Could not cleanup response.";
domapi.lang["RPC_NO_HEAD2"        ] = "No HEAD tag found! Document is not well-formed. Could not dispatch request.";
domapi.lang["RPC_NO_SCRIPT"       ] = "No SCRIPT tag found! Could not cleanup response.";
domapi.lang["TREE_NO_PARENT"      ] = "Node cannot be created without specifying parent.";
domapi.lang["TREE_NO_NODE"        ] = 'No node sent to Tree method "%1()"';
domapi.lang["ERR_GET_CONTENT"     ] = "Error in getContent: ";
domapi.lang["ERR_POST_CONTENT"    ] = "Error in postContent: ";
domapi.lang["ERR_AJAX_REQUEST"    ] = "Error in AJAX request (last action - %1): %2";
domapi.lang["ERR_AJAX_ASSERT"     ] = "Error asserting AJAX request arguments: ";
domapi.lang["ERR_AJAX_OUTFIT"     ] = "Error outfitting AJAX packet: ";
domapi.lang["ERR_AJAX_ORSC"       ] = "Error during AJAX onreadystatechange: ";
domapi.lang["ERR_EVAL_JSON"       ] = "Error occured deserializing JSON string: ";
domapi.lang["INCREMENT_MONTH"     ] = "Increment month";
domapi.lang["DECREMENT_MONTH"     ] = "Decrement month";
domapi.lang["ERR_NO_MS_XMLHTTP"   ] = "No valid XML parser was found.";
domapi.lang["ERR_CSV_FINAL_STATE" ] = "Error, CSV data is not well formed.";
domapi.lang["ERR_MISSING_XML_ROOT"] = "Error, missing XML root node: '%1'";
domapi.lang["ACCEPT"              ] = "Accept";
domapi.lang["CANCEL"              ] = "Cancel";
domapi.lang["COLORPANE_FADER_HINT"] = "Adjust luminosity";
domapi.lang["COLORPANE_HEX"       ] = "Hex";
domapi.lang["COLORPANE_HUE"       ] = "Hue";
domapi.lang["COLORPANE_SATURATION"] = "Sat";
domapi.lang["COLORPANE_LUMINOSITY"] = "Lum";
domapi.lang["DIALOG_WARNING"      ] = "Warning";
domapi.lang["DIALOG_ERROR"        ] = "Error";
domapi.lang["DIALOG_INFORMATION"  ] = "Information";
domapi.lang["DIALOG_CONFIRMATION" ] = "Confirmation";
domapi.lang["DIALOG_YES"          ] = "Yes";
domapi.lang["DIALOG_NO"           ] = "No";
domapi.lang["DIALOG_OK"           ] = "OK";
domapi.lang["DIALOG_CANCEL"       ] = "Cancel";
domapi.lang["DIALOG_ABORT"        ] = "Abort";
domapi.lang["DIALOG_RETRY"        ] = "Retry";
domapi.lang["DIALOG_IGNORE"       ] = "Ignore";
domapi.lang["DIALOG_ALL"          ] = "All";
domapi.lang["DIALOG_NO_TO_ALL"    ] = "No to all";
domapi.lang["DIALOG_YES_TO_ALL"   ] = "Yes to all";
domapi.lang["DIALOG_HELP"         ] = "Help";
domapi.lang["SPINEDIT_WANRING"    ] = "Range must be between %1 and %2.";
domapi.lang["ERR_HTTP_SEND"       ] = "Error Sending Content: ";
domapi.lang["ERR_HTTP_OPEN"       ] = "Error Opening Url: '%1' for operation: '%2'";
domapi.lang["ERR_HTTP_NOTOPEN"    ] = "Successful OPEN operation has not yet occurred.";
domapi.lang["ERR_HTTP_MIMEOVERRIDE"] = "Error setting MimeType: '%1'";
domapi.lang["ERR_HTTP_OP_FAILED"  ] = "Operation Failed: ";
domapi.lang["ERR_HTTP_NOOBJ"      ] = "Your Browser '%1' Does NOT Support the XMLHTTPRequest Object.";
domapi.lang["LOAD_IFRAME"         ] = "An error occured while loading an IFRAME.  Most likely you are using cross-site scripting.";
domapi.lang["DATEPICKER2_DROPDOWN"] = "Show calendar picker";
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// This method returns an array of [day,title] elements for the current month
// and year. Overwrite this method with your own localized holidays.  The 
// defaults are for North America.
//------------------------------------------------------------------------------
domapi.lang.calculateHolidays = function(m,y){ // month is 0..11
  var r = [];
  switch(m){
    case 0 :
      r.push([1,"New Years Day"]);
      r.push([sysutils.findFirstDay(3, 1, 0, y), "Martin Luther King Day"]);
      break;
    case 1 :
      r.push([sysutils.findFirstDay(3, 1, 1, y), "Presidents Day"]);
      break;
    case 2,3 :
      var t = sysutils.easterSunday(y);
      if(t[0] == m){
        r.push([t[1],  "Easter Sunday"]);
        r.push([t[1]-2,"Good Friday"]);
      }
      break;
    case 4 :
      r.push([sysutils.findFirstDay(-1, 1, 5, y), "Victoria Day"]);
      r.push([sysutils.findFirstDay( 0, 1, 5, y), "Memorial Day"]);
      break;
    case 5 :      
      break;
    case 6 :
      r.push([1, "Canada Day"]);
      r.push([4, "Independance Day"]);
      break;
    case 7 :      
      break;
    case 8 :
      r.push([sysutils.findFirstDay(1, 1, 8, y), "Labor Day"]);      
      break;
    case 9 :
      r.push([sysutils.findFirstDay(2, 1, 9, y), "Canadian Thanksgiving"]);
      r.push([sysutils.findFirstDay(2, 1, 9, y), "Columbus Day"]);
      r.push([31, "Halloween"]);
      break;
    case 10 :
      r.push([11, "Veterans Day"]);
      r.push([sysutils.findFirstDay(1, 1, 10, y)+1, "Election Day"]);
      r.push([sysutils.findFirstDay(4, 4, 10, y), "Thanksgiving Day"]);
      break;
    case 11 :
      r.push([25, "Christmas Day"]);
      r.push([26, "Boxing Day"]);
      break;
  }
  return r;
};
//------------------------------------------------------------------------------
domapi.lang._firstDay = function(n,d,m,y){
  // finds to nth day (d) in month and year - days are 0..6, s..s
  var startday  = sysutils.getStartDay(m, y);
};
//------------------------------------------------------------------------------
domapi.lang.dayOfMonthStr = function(i){
  if(parseInt(i) < 1)return i;
  i = String(i);
  var e = i.charAt(i.length-1);
  var p = "";
  switch(e){
    case  "1" : p = "st"; break;
    case  "2" : p = "nd"; break;
    case  "3" : p = "rd"; break;
    default   : p = "th"; break;
  }
  return i + p;
};
//------------------------------------------------------------------------------
domapi.lang.fuzzyDateParse = function(v, M){
  var A;
  var now = sysutils.now();
  var currentDay = now.getDay();
  function nextDay(i){
    var r = i - currentDay;
    if(r < 1)r = 7 + r;
    return sysutils.addDaysToDate(now, r);
  };

  v = String(v).toUpperCase().trim();
  switch(v){
    case "TODAY"      : return sysutils.formatDate(now,                             M); break;
    case "YESTERDAY"  : return sysutils.formatDate(sysutils.addDaysToDate(now, -1), M); break;
    case "TOMORROW"   : return sysutils.formatDate(sysutils.addDaysToDate(now,  1), M); break;
    case "SUNDAY"     : return sysutils.formatDate(nextDay(0), M); break;
    case "MONDAY"     : return sysutils.formatDate(nextDay(1), M); break;
    case "TUESDAY"    : return sysutils.formatDate(nextDay(2), M); break;
    case "WEDNESDAY"  : return sysutils.formatDate(nextDay(3), M); break;
    case "THURSDAY"   : return sysutils.formatDate(nextDay(4), M); break;
    case "FRIDAY"     : return sysutils.formatDate(nextDay(5), M); break;
    case "SATURDAY"   : return sysutils.formatDate(nextDay(6), M); break;
    case "LAST MONTH" : return sysutils.formatDate(sysutils.addMonthsToDate(now, -1), M); break;
    case "NEXT MONTH" : return sysutils.formatDate(sysutils.addMonthsToDate(now,  1), M); break;
    /*todo 
      FIRST QUARTER
      SECOND QUARTER
      THIRD QUARTER
      FOURTH QUARTER
      LAST QUARTER
      NEXT QUARTER
    */
  }
  if(v.charAt(0) == "+" || v.charAt(0) == "-")return sysutils.formatDate(sysutils.addDaysToDate(now, parseInt(v)), M);
  
  A = v.split("MONTHS");
  if(A.length > 1)return sysutils.formatDate(sysutils.addMonthsToDate(now, parseInt(A[0])), M);
  return v;
};
//------------------------------------------------------------------------------