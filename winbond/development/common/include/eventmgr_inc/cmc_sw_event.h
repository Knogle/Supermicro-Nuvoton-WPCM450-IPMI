/***************************************************************
****************************************************************
**                                                            **
**  (C)Copyright 2002 - 2003, American Megatrends Inc.        **
**                                                            **
**            All Rights Reserved.                            **
**                                                            **
**      6145 - F, Northbelt Parkway, Norcross,		          **
**                                                            **
**     Georgia - 30071, USA. Phone -(770) - 246 - 8600.	      **
**                                                            **
****************************************************************
****************************************************************
****************************************************************
/ $Header: $
/
/ $Revision: $
/
/ $Date: 3 - 13 - 2007
/
****************************************************************
****************************************************************/
/** @file   cmc_sw_event.h
 *  @author <ramkumars@ami.com>
 *  @brief  event manager constants and consumer error codes
 *          are defined in this file
 *
 *  Revision History
 *  ----------------
 *
 * $Log: $
 *
 ****************************************************************/

#ifndef _CMC_SW_EVT_H_
#define _CMC_SW_EVT_H_

#include "coreTypes.h"


typedef struct
{
	////Record Header
	uint16  id;   // Unique Id of the Record
	uint8   severity_type;  //Parameter Info / Severity Info
    uint32  timestamp;    ///time Stamp;
	uint16	param_1;
	uint8	param_4;
	uint8	src_id;	// originator ID / module that generated this event
	uint8 	evt_id;
	uint16	param_2;
	uint16  param_3;

} cmc_sw_evt_T; // CMC software events

#define CMC_EVTMGR_PORT (1729)

// event consumers should return an 1 byte code

#define CMC_CODE_CONSUMED		(1) // evt is consumed
#define CMC_CODE_LOG_IN_DB 		(2) // log into database
#define CMC_CODE_NEXT_CONSUMER 	(4) // proceed with next consumer

#endif //_CMC_SW_EVT_H_


