#ifndef _TZ_TABLE_H_

#define _TZ_TABLE_H_

#define TZ_SUCCESS 1
#define TZ_FAILURE  -1
#define TZ_UNSUPPORTED_OFFSET -2

#define TZ_TRUE 1
#define TZ_FALSE 0


#define MAX_TZ_LIMIT   30
#define MAX_DST_LIMIT  13
#define MAX_TZ_DST_ABBR 8

/*
 * External API
 */

int TZ_GetTimeZone();
int TZ_GetDSTSetting();
int TZ_SetTimeZone(int tz_offset);
int TZ_SetDSTSetting(int dst, char *region);

/*
 * internal data type
 */
enum WEEK {FIRST_WEEK=1,SECOND_WEEK,THIRD_WEEK,FOURTH_WEEK,LAST_WEEK};
enum MONTH{JANUARY=1,FEBRUARY,MARCH,APRIL,MAY,JUNE,JULY,AUGEST,SEPTEMBER,OCTOBER,NOVEMBER,DECEMBER};
enum WEEK_DAY{SUNDAY=0,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY};

/*
 * Time zone structure
 */ 

typedef struct
{
	char tz_abbr[MAX_TZ_DST_ABBR]; 	// Ex: EST
	int tz_offset; 					// Ex: -5
	char tz_dst_abbr[MAX_TZ_DST_ABBR];// Ex: EDT
}TIME_ZONE;

/*
 * DST structure
 */ 
typedef struct 
{
	unsigned int start_year;
	unsigned int end_year;

	unsigned int start_hour;
	enum WEEK start_week;
	enum WEEK_DAY start_weekday;
	enum MONTH start_month;
		
	unsigned int end_hour;
	enum WEEK end_week;
	enum WEEK_DAY end_weekday;
	enum MONTH end_month;

	char tz_map[64]; // Map to offset Ex: -9,-8,-7,-6,-5.
					// Mentioned offset are having same DST settings

	char region[64]; // More than one region with comma seperated

}DST_ENTRY;


const TIME_ZONE TIME_ZONE_ENTRY[]=
{
	{"IDLW",720,""},
	{"SST",660,""},
	{"HST",600,""},
	{"AKST",540,"AKDT"},
	{"PST",480,"PDT"},
	{"MST",420,"MDT"},
	{"CST",360,"CDT"},
	{"EST",300,"EDT"},
	{"AST",240,"ADT"},
	{"NST",210,"NDT"},
	{"GST",180,"GDT"},
	{"FST",120,"FDT"},
	{"AZOST",60,"AZODT"},
	{"GMT",0,"GMDT"},
	{"CEST",-60,"CEDT"},
	{"EEST",-120,"EEDT"},
	{"AST",-180,"ADT"},
	{"IRST",-210,"IRDT"},
	{"AMST",-240,""},
	{"AFT",-270,""},
	{"USZST",-300,"USZDT"},
	{"IST",-330,""},
	{"ALMT",-360,""},
	{"THA",-420,""},
	{"BNT",-480,""},
	{"JST",-540,"JDT"},
	{"ACST",-570,"ACDT"},
	{"AEST",-600,"AEDT"},
	{"NCT",-660,""},
	{"NZST",-720,"NZDT"}
};

const DST_ENTRY DST_TABLE[] =
{
    //-----------------------------------------------------------
    // DST_USA:
    //   Alaskan, Pacific, Mountain, Central, Eastern,
    //   Atlantic, Newfoundland
    //-----------------------------------------------------------
    { 
	  1984,2006,	
	  2, FIRST_WEEK,  SUNDAY,    APRIL,
      2, LAST_WEEK,   SUNDAY,    OCTOBER,
   	  "540,480,420,360,300,240,210" ,
	  ""		  
	},
    //-----------------------------------------------------------
    // DST_ESA:
    //   E. South America
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, THIRD_WEEK,  SUNDAY,    OCTOBER,
      2, SECOND_WEEK, SUNDAY,    FEBRUARY,  
	  "180" ,
	  ""
	},
    //-----------------------------------------------------------
    // DST_MID:
    //   Mid-Atlantic
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, LAST_WEEK,   SUNDAY,    MARCH,
      2, LAST_WEEK,   SUNDAY,    SEPTEMBER,
	  "120",
	  ""
	},
    //-----------------------------------------------------------
    // DST_EEC:
    //   Azores, GMT, Romance, Central European, GTB,
    //   W. Europe, Arab, Russian, Ekateinburg, Yakutsk
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, LAST_WEEK,   SUNDAY,    MARCH,
      3, LAST_WEEK,   SUNDAY,    OCTOBER,
      "60,0,-60,-120,-180,-300,-540,-600",
	  "GTB,Vladivostok" 
	},
    //-----------------------------------------------------------
    // DST_EEU:
    //   E. Europe
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  0, LAST_WEEK,   SUNDAY,    MARCH,
      1, LAST_WEEK,   SUNDAY,    SEPTEMBER,
	  "-120",
	  "E.Europe" 
	},
    //-----------------------------------------------------------
    // DST_EGT:
    //   Egypt
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, FIRST_WEEK,  FRIDAY,    MAY,
      2, LAST_WEEK,   WEDNESDAY, SEPTEMBER, 
	  "-120",
	  "Egypt"		  
	},
    //-----------------------------------------------------------
    // DST_FLE:
    //   FLE
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  3, LAST_WEEK,   SUNDAY,    MARCH,
      4, LAST_WEEK,   SUNDAY,    OCTOBER,
      "-120",
	  "FLE"	  
	},
    //-----------------------------------------------------------
    // DST_IRN:
    //   Iran
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, FIRST_WEEK,  SUNDAY,    MARCH,
      2, LAST_WEEK,   TUESDAY,   SEPTEMBER,
	  "-210",
	  ""		  
	},
    //-----------------------------------------------------------
    // DST_AUS:
    //   Cen. Australia, AUS Eastern
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, LAST_WEEK,   SUNDAY,    OCTOBER,
      3, LAST_WEEK,   SUNDAY,    MARCH,     
	  "-570,-600",
	  "AUS.Eastern"
	},
    //-----------------------------------------------------------
    // DST_TAS:
    //   Tasmania
    //-----------------------------------------------------------
    { 
	  1984,2038,	
	  2, FIRST_WEEK,  SUNDAY,    OCTOBER,
      2, LAST_WEEK,   SUNDAY,    MARCH,     
	  "-600",
	  "Tasmania"  
	},
    //-----------------------------------------------------------
    // DST_NWZ: Daylight Time Order from 1990
    //   New Zealand
    //-----------------------------------------------------------
    { 
	  1990,2006,	
	  2, FIRST_WEEK,   SUNDAY,    OCTOBER,
      3, THIRD_WEEK,   SUNDAY,    MARCH,
      "-720",
	  ""	  
	},

    //-----------------------------------------------------------
	// DST_NWZ_2007: for Compliance with the announcement of Minister of Internal Affairs NZ
	// moves the Daylight Saving Time start & stop dates in the New Zealand beginning in 2007
	//   New Zealand
	//-----------------------------------------------------------
	{ 2007,2038,
	  2,  LAST_WEEK, SUNDAY,    SEPTEMBER,
	  3,  FIRST_WEEK,  SUNDAY,    APRIL,   
	  "-720",
      ""	  
	},

	 //-----------------------------------------------------------
	 // DST_USA: the setting for Compliance with the Energy Policy Act of 2005
	 // moves the Daylight Saving Time start & stop dates in the US beginning in 2007
	 //   Alaskan, Pacific, Mountain, Central, Eastern,
	 //   Atlantic, Newfoundland
	 //-----------------------------------------------------------
	 { 
	   2007,2038,	 
	   2, SECOND_WEEK, SUNDAY,    MARCH,
	   2, FIRST_WEEK,  SUNDAY,    NOVEMBER,
   	  "540,480,420,360,300,240,210" ,
	  ""
	 }
};



#endif

