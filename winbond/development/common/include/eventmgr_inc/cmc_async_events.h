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
/** @file   cmc_async_events.h
 *  @author <ramkumars@ami.com>
 *  @brief  describes the packets exchanged between evt manager
 *          library(libevtmgr) and event manager
 *
 *  Revision History
 *  ----------------
 *
 * $Log: $
 *
 ****************************************************************/


#ifndef _CMC_ASYNC_EVENTS_H_
#define _CMC_ASYNC_EVENTS_H_

#include "coreTypes.h"
#include "cel.h"


/*
 * @brief async event packet header
 */
typedef struct
{
	char 	sig [8]; // "CMCASYNC"
	uint32	cmd;
	uint32  data_len;
} __attribute__((packed)) cmc_async_event_hdr_T;

/*
 * @brief async event packet format
 */
typedef struct
{

	cmc_async_event_hdr_T 	hdr; // header
	CELEvent_T				evt; // actual data

} __attribute__((packed)) cmc_async_event_data_T;

#define CMC_CMD_SW_EVENT			(2000)


#endif // _CMC_ASYNC_EVENTS_H_
