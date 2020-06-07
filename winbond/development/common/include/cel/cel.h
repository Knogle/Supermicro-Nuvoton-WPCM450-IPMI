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
 * 	@file		cel.h
 * 	@author		Venkatesh Ramamurthy
 * 	@brief		CEL Library Implementation
 *
 * 	Revision History:
 *
 * 	$Log:		Created on 09/21/2006
 *
 *  $Log:       Header file for CEL API
 *
 ************************************************************************/
#ifndef _LIB_CEL_H
#define _LIB_CEL_H

#define MAX_EVENTINFO_LEN 16
#define MAX_EVENT_STR_LEN 64

#include "uquery.h"
/* 
 * Public Structures and Definitions
 */

#define MAX_CEL_EVENTS		(1500L)
#define MAX_CELDB_STRINGS	4096

/*
 * CEL String DB length
 */
#define MAX_CELDBSTRING_SIZE 256

/*
 * IPMI SEL (CEL) Severity and 
 * Direct/Indirect flag
 * Bits 0-1 - Severity Level
 * Bits 2-3 - Reserved
 * Bits 4-7 - Direct/Indirect Flag
 */
#define SEV_LEVEL_INFO	0x00
#define SEV_LEVEL_WARN	0x01
#define SEV_LEVEL_CRIT	0x03
#define SEV_LEVEL_MASK	0x03

#define DIND_PARAM1_INDIRECT	0x80		
#define DIND_PARAM2_INDIRECT	0x40
#define DIND_PARAM3_INDIRECT	0x20
#define DIND_PARAM4_INDIRECT	0x10
#define DIND_PARAM_MASK			0xF0



#define CEL_EVENT_CLASS_IPMI 0x01
#define CEL_EVENT_CLASS_SW 	 0x02

typedef enum CELErrorCode {
	CEL_E_SUCCESS,
	CEL_E_INVALID_SOURCE_ID,
	CEL_E_INVALID_EVENT_ID,
	CEL_E_INVALID_INDEX,
	CEL_E_EVENT_LOG_FULL,
	CEL_E_LANGUAGE_NOT_SUPPORTED,
	CEL_E_INVALID_TIME,
	CEL_E_DB_ERROR
} CELStatus_E;

typedef enum cel_sort {
	CELDB_ORDER_BY_NONE = 0,
	CELDB_ORDER_BY_SEV,
	CELDB_ORDER_BY_DATE,
	CELDB_ORDER_BY_EID,
	CELDB_ORDER_BY_SOURCE,
	CELDB_ORDER_BY_RECID
} CELSortFlag_E;

typedef enum cel_dir {
	CELDB_ORDER_AS_ASC = 1,
	CELDB_ORDER_AS_DSC
} CELSortDir_E;

typedef enum cel_query_source {
	CELDB_QUERY_ALL = 1,
	CELDB_QUERY_SOURCE,
	CELDB_QUERY_CLASS,
	CELDB_QUERY_SEV,
	CELDB_QUERY_DATE,
	CELDB_QUERY_EID
} CELQuerySource_E;

typedef struct cel_query {
	CELQuerySource_E	Source;
	CELSortFlag_E		SortFlag;
	CELSortDir_E		SortDir;
} CELQueryFlags_T;


typedef struct ipmi_sel_s {
	u_int16_t	RecordID;
	u_int8_t	SevLvlAndParamInfo;
	u_int32_t	Time;
	u_int16_t	Param1;
	u_int8_t	Param4;
	u_int8_t	Source;
	u_int8_t	EventID;
	u_int16_t	Param2;
	u_int16_t	Param3;
} __attribute__((packed)) IPMI_Sel_T;

/*
 * Private Structures and definitions
 */


/*
 *  Public Methods
 */

CELStatus_E
CELDB_Init();

CELStatus_E
CELDB_Close();

CELStatus_E
CELDB_LogEvent(CELEvent_T *Event);

CELStatus_E
CELDB_DeleteEvents(CELEvent_T *Event);

CELStatus_E
CELDB_ClearEventLog(void);

CELStatus_E
CELDB_GetEDTEntry(u_int16_t EventID, u_int8_t *lang);

CELStatus_E
CELDB_SetMaxEvents(u_int32_t MaxEvents);

CELStatus_E
CELDB_GetMaxEvents(u_int32_t *MaxEvents);

CELStatus_E
CELDB_GetNumberOfEvents(u_int32_t *EventsCount);

CELStatus_E
CEL_GetEventLog(CELEvent_T *Event, CELQueryFlags_T *Flags, 
					u_int16_t Offset, 
					CELEvent_T *EventList, 
					u_int16_t *Count);

CELStatus_E
CEL_StoreString(u_int8_t *String, int Len, u_int16_t *Index);

CELStatus_E
CEL_DeleteStringIndex(u_int16_t Index);

CELStatus_E
CEL_GetString(u_int16_t Index, u_int8_t *String, int *Len);

CELStatus_E
CEL_DeleteString(u_int16_t Index);

#endif /* _LIB_CEL_H */
