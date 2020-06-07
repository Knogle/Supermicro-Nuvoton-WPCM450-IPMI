// NOTE --------
// Do not add any more sys_strings, this object is being depracated but the strings must be left here for compatilibilty.
eLang.sys_strings = {};
eLang.sys_strings["STR_OK"]         = "OK";
eLang.sys_strings["STR_APPLY"]      = "Apply";
eLang.sys_strings["STR_RESTORE"]    = "Restore";
eLang.sys_strings["STR_FULLACCESS"] = "Full access";
eLang.sys_strings["STR_READONLY"]   = "Read Only";
eLang.sys_strings["STR_DENIED"]     = "Denied";
eLang.sys_strings["STR_UNDEFINED"]  = "Undefined";
eLang.sys_strings["STR_ENABLED"]    = "Enabled";
eLang.sys_strings["STR_DISABLED"]   = "Disabled";
eLang.sys_strings["STR_SAVE"]       = "Save";
eLang.sys_strings["STR_CLOSE"]      = "Close";
eLang.sys_strings["STR_CANCEL"]     = "Cancel";
eLang.sys_strings["STR_WAIT"]       = "Loading...please wait";
eLang.sys_strings["STR_LOADING"]    = "Loading";
eLang.sys_strings["STR_WAIT2"]      = "Loading, please wait";
eLang.sys_strings["STR_INPUT_ERROR"]= "An input error was detected.  Please correct the marked fields!";
eLang.sys_strings["STR_INPUTREQUIRED_ERROR"]= "A required input was not found.  Please correct the marked fields!";
eLang.sys_strings["STR_UNITS_KB"]   = "KB"
eLang.sys_strings["STR_UNITS_MB"]   = "MB"
eLang.sys_strings["STR_UNITS_GB"]   = "GB"
eLang.sys_strings["STR_MONTH0"]  = "January";
eLang.sys_strings["STR_MONTH1"]  = "February";
eLang.sys_strings["STR_MONTH2"]  = "March";
eLang.sys_strings["STR_MONTH3"]  = "April";
eLang.sys_strings["STR_MONTH4"]  = "May";
eLang.sys_strings["STR_MONTH5"]  = "June";
eLang.sys_strings["STR_MONTH6"]  = "July";
eLang.sys_strings["STR_MONTH7"]  = "August";
eLang.sys_strings["STR_MONTH8"]  = "September";
eLang.sys_strings["STR_MONTH9"]  = "October";
eLang.sys_strings["STR_MONTH10"] = "November";
eLang.sys_strings["STR_MONTH11"] = "December";

eLang.sys_strings["STR_OFF"]       = "Off";
eLang.sys_strings["STR_ON"]       = "On";
eLang.sys_strings["STR_PROCESSING"]       = "Processing...";
eLang.sys_strings["STR_PARSING"]       = "Parsing...";
eLang.sys_strings["STR_CHECKING"]       = "Checking...";
eLang.sys_strings["STR_SORTING"]       = "Sorting...";

// Units
eLang.sys_strings["STR_MINUTES"]       = "Minute(s)";
eLang.sys_strings["STR_SECONDS"]       = "Second(s)";
eLang.sys_strings["STR_HOURS"]       = "Hour(s)";



// Here I duplicate all the sys strings to be in the normal strings array.
// This is so I don't have to figure out what array a string is in.

eLang.common_strings["STR_OK"]                 = eLang.sys_strings["STR_OK"]
eLang.common_strings["STR_APPLY"]              = eLang.sys_strings["STR_APPLY"]
eLang.common_strings["STR_RESTORE"]            = eLang.sys_strings["STR_RESTORE"]
eLang.common_strings["STR_FULLACCESS"]         = eLang.sys_strings["STR_FULLACCESS"]
eLang.common_strings["STR_READONLY"]           = eLang.sys_strings["STR_READONLY"]
eLang.common_strings["STR_DENIED"]             = eLang.sys_strings["STR_DENIED"]
eLang.common_strings["STR_UNDEFINED"]          = eLang.sys_strings["STR_UNDEFINED"]
eLang.common_strings["STR_ENABLED"]            = eLang.sys_strings["STR_ENABLED"]
eLang.common_strings["STR_DISABLED"]           = eLang.sys_strings["STR_DISABLED"]
eLang.common_strings["STR_SAVE"]               = eLang.sys_strings["STR_SAVE"]
eLang.common_strings["STR_CLOSE"]              = eLang.sys_strings["STR_CLOSE"]
eLang.common_strings["STR_CANCEL"]             = eLang.sys_strings["STR_CANCEL"]
eLang.common_strings["STR_WAIT"]               = eLang.sys_strings["STR_WAIT"]
eLang.common_strings["STR_LOADING"]            = eLang.sys_strings["STR_LOADING"]
eLang.common_strings["STR_WAIT2"]              = eLang.sys_strings["STR_WAIT2"]
eLang.common_strings["STR_INPUT_ERROR"]        = eLang.sys_strings["STR_INPUT_ERROR"]
eLang.common_strings["STR_INPUTREQUIRED_ERROR"]= eLang.sys_strings["STR_INPUTREQUIRED_ERROR"]
eLang.common_strings["STR_UNITS_KB"]           = eLang.sys_strings["STR_UNITS_KB"]
eLang.common_strings["STR_UNITS_MB"]           = eLang.sys_strings["STR_UNITS_MB"]
eLang.common_strings["STR_UNITS_GB"]           = eLang.sys_strings["STR_UNITS_GB"]
eLang.common_strings["STR_MONTH0"]             = eLang.sys_strings["STR_MONTH0"]
eLang.common_strings["STR_MONTH1"]             = eLang.sys_strings["STR_MONTH1"]
eLang.common_strings["STR_MONTH2"]             = eLang.sys_strings["STR_MONTH2"]
eLang.common_strings["STR_MONTH3"]             = eLang.sys_strings["STR_MONTH3"]
eLang.common_strings["STR_MONTH4"]             = eLang.sys_strings["STR_MONTH4"]
eLang.common_strings["STR_MONTH5"]             = eLang.sys_strings["STR_MONTH5"]
eLang.common_strings["STR_MONTH6"]             = eLang.sys_strings["STR_MONTH6"]
eLang.common_strings["STR_MONTH7"]             = eLang.sys_strings["STR_MONTH7"]
eLang.common_strings["STR_MONTH8"]             = eLang.sys_strings["STR_MONTH8"]
eLang.common_strings["STR_MONTH9"]             = eLang.sys_strings["STR_MONTH9"]
eLang.common_strings["STR_MONTH10"]            = eLang.sys_strings["STR_MONTH10"]
eLang.common_strings["STR_MONTH11"]            = eLang.sys_strings["STR_MONTH11"]
eLang.common_strings["STR_OFF"]                = eLang.sys_strings["STR_OFF"]
eLang.common_strings["STR_ON"]                 = eLang.sys_strings["STR_ON"]
eLang.common_strings["STR_PROCESSING"]         = eLang.sys_strings["STR_PROCESSING"]
eLang.common_strings["STR_PARSING"]            = eLang.sys_strings["STR_PARSING"]
eLang.common_strings["STR_CHECKING"]           = eLang.sys_strings["STR_CHECKING"]
eLang.common_strings["STR_SORTING"]            = eLang.sys_strings["STR_SORTING"]
eLang.common_strings["STR_MINUTES"]            = eLang.sys_strings["STR_MINUTES"]
eLang.common_strings["STR_SECONDS"]            = eLang.sys_strings["STR_SECONDS"]
eLang.common_strings["STR_HOURS"]              = eLang.sys_strings["STR_HOURS"]