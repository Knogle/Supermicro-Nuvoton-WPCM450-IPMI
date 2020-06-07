/************************************************************************
 * **********************************************************************
 * ***																  ***
 * ***		(C)Copyright 2002-2005, American Megatrends Inc.		  ***
 * ***																  ***
 * ***			All Rights Reserved									  ***
 * ***																  ***
 * ***		    6145-F NorthBelt Parkway, Norcross					  ***
 * ***																  ***
 * ***			Georgia-30071, USA									  ***
 * ***																  ***
 * **********************************************************************
 * *********************************************************************/

/************************************************************************
 * $HEADER: $
 *
 * $Revision: 1.0
 *
 * $Date: 09/21/2006
 * **********************************************************************/

/*************************************************************************
 * 	@file		uquery.h
 * 	@author		Venkatesh Ramamurthy
 * 	@brief		uquery contains CEDS generated structures
 *
 * 	Revision History:
 *
 * 	$Log:		Created on 09/21/2006
 *
 *  $Log:       Header file for CEDS DB
 *
 ************************************************************************/
#ifndef _USER_DEFINED_QUERY_H
#define _USER_DEFINED_QUERY_H

#define CMC_DB_NAME		"cmcdb"
#define CMC_DB_ID		1000

#define TABLE_CELDB_ID		1100
#define TABLE_CELDB_NAME	"cel"

typedef struct CELEventDB_S {
	u_int8_t  CEL_SourceID[6];
	u_int8_t  CEL_EventClass;
	u_int8_t  CEL_EventInfo[16];
} __attribute__((packed)) CELEvent_T;


#define TABLE_EDT_USENG_ID		1101
#define TABLE_EDT_USENG_NAME	"edt_useng"

typedef struct CELEDT_s {
	u_int16_t CEL_EventID;
	u_int16_t CEL_EventClass;
	u_int16_t CEL_EventSev;
	u_int16_t CEL_EventParams;
	u_int8_t  CEL_EventStr[64];
} __attribute__((packed)) CELEDT_t;



#define TABLE_CELSTR_ID		1102
#define TABLE_CELSTR_NAME	"celdbstring"

typedef struct CELStringDB_S {
	u_int8_t  CEL_StringRef;
	u_int8_t  CEL_StringLen;
	u_int8_t  CEL_String[256];
} __attribute__((packed)) CELString_T;



#define QUERY_ID_CEL_ALL_SID		100
/*
 * Search CEL DB String table based on Record ID (Primary Key)
 */
#define QUERY_ID_CELDBSTR_RECID		101
/*
 * Search CEL DB String table based on string
 */
#define QUERY_ID_CELDBSTR_SEARCH_STR 102
/*
 * Query ID for deleteing an exact matching CEL Event
 */
#define QUERY_ID_CELEVENT_EXACT_MATCH 103

#endif /* _USER_DEFINED_QUERY_H */
