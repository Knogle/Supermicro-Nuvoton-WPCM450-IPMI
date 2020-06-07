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
/** @file   event_mgr_ifc.c
 *  @author <ramkumars@ami.com>
 *  @brief  event manager interface
 *
 *  Revision History
 *  ----------------
 *
 * $Log: $
 *
 ****************************************************************/


#ifndef _EVENT_MGR_IFC_H_
#define _EVENT_MGR_IFC_H_

#include <time.h>
#include "coreTypes.h"
#include "cel.h"
#include "cmc_event_error.h"



#define   	CMC_EVENT_ID_1		(0x01)


/*
 * @brief logs software events into database. This function
 *        will be used by applications which want to log events
 *        into the database. This hides the database details from the
 *        user applications
 * @param str1 - string thats needs to be logged into the database
 * @param len1 - length of string str-1
 * @param str2 - string thats needs to be logged into the database
 * @param len2 - length of string str-2
 * @param str3 - string thats needs to be logged into the database
 * @param len3 - length of string str-3
 * @param severity_type - event severity
 * @param src_id - ID of the module that generated the event
 * @param evt_id - event ID
 * @return 0 on success, -1 on failure
 */
int log_sw_event (uint8* str1,
				  uint32 len1,
				  uint8* str2,
				  uint32 len2,
				  uint8* str3,
				  uint32 len3,
				  uint8 severity_type,
				  uint8	src_id,	// originator ID / module that generated this event
				  uint8 evt_id);

/*
 * @brief forms and sends event packets to the event manager
 *        This function will be used by applications which want
 *        to log events, that happen asynchronously, into the database
 * @param CELEvent_T* pointer cel event structure
 * @return 0 on success , -1 on error
 *
 */
int send_async_event_pkt (CELEvent_T* evt);


#endif // _EVENT_MGR_IFC_H_

