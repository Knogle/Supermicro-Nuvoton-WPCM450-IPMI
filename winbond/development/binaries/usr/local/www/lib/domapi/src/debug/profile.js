// Copyright 2003 Steve Schwarz
// I grant this to the public domain
//
// Simple JavaScript Execution Profiler
//
// Supports calculating the elapsed time between multiple named profiling points
// and reporting those times in a number of ways. The profiling points can
// overlap and separate times are stored for each pass through the points.
// - Minimal error checking is peformed: always call prof.start() before
//   prof.end() or prof.dump()
//
// Usage:
// Surround code sections to be timed with prof.start() and prof.end()
// calls using the same string for both function's "where" arguments.
// Execute the code sections of interests any number of times to record
// the time spent in each section each time the code is executed.
// Call any of the dump functions anytime afterwards to get the time spent 
// between the prof.start() and prof.end() calls.
//

var prof=new Object();		// put everything into its own "namespace"
prof.debT=new Object();	// named arrays of time counts
prof.names=new Array();	// names of each counter for reset/remove

// store each "where" measurement point in it's own location so we can have 
// multiple separate (and nested) timing locations and so we can count
// how many times each area is accessed and dump stats on each measurement.
prof.start=function(where){
    if (prof.debT[where]==null || prof.debT[where].length==0){
	prof.debT[where]=new Array();		// create array to store times
	prof.names[prof.names.length]=where;	// store name for later deleting
    }
    var startTime=new Date();			// current time in last location
    var times=prof.debT[where];
    times[times.length]=startTime.getTime();
};

// record the time difference since prof.start(where) was called
prof.end=function(where){
    endTime=new Date();
    var times=prof.debT[where];
    // the start time is in the last location in the array so subtract current
    // time to get the delta in milliseconds
    times[times.length-1]=endTime.getTime()-times[times.length-1];
};

// dump elapsed times for a specific named profile
prof.reset=function(where){
    if (prof.debT[where] != null){
	prof.debT[where].length = 0;
    }
};

// dump elapsed times for all named profiles
prof.resetAll=function(){
    for (var i=0;i<prof.names.length;i++){
	prof.reset(prof.names[i]);
    }
};

// remove name and elapsed time for a named profile
prof.remove=function(where){
    if (prof.debT[where] != null){
	prof.debT[where].length=0;
	for (var i=0;i<prof.names.length;i++){
	    if (prof.names[i] == where)
		prof.names.splice(i,1);
	}
    }
};

prof.removeAll=function(){
    for (var i=prof.names.length-1;i>=0;i--)
	prof.remove(prof.names[i]);
};

// outputs number of times a named code segment was accessed thus far
// and the average of the times recorded
prof.dumpAvg=function(where){
    var t=0;
    var times=prof.debT[where];
    for (var i=0;i<times.length;i++)
	t+=times[i];
    if (times.length>0){
        return where+' accessed: '+times.length+' avg time: '+(t/times.length);
    }
    else {
        return "";
    }
};

// outputs same info as dumpAvg() but for all named code segments
prof.dumpAvgAll=function(where, delim){
    delim=(delim==null)?'<BR>':delim;	// default delimiter between lines as HTML <BR>
    var str="";
    for (var i=0; i<prof.names.length;i++)
        str+=prof.dumpAvg(prof.names[i])+delim;
    return str;
};

// return raw values as an array
prof.dump=function(where){
    return prof.debT[where].toString();
};

// outputs same info as dump() but for all named code segments
prof.dumpAll=function(where, delim){
    delim=(delim==null)?'<BR>':delim;	// default delimiter between lines as HTML <BR>
    var str="";
    for (var i=0; i<prof.names.length;i++)
        str+=prof.names[i]+','+prof.dump(prof.names[i])+delim;
    return str;
};
