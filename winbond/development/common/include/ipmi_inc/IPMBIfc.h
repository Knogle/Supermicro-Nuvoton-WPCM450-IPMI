/****************************************************************
 ****************************************************************
 **                                                            **
 **    (C)Copyright 2005-2006, American Megatrends Inc.        **
 **                                                            **
 **            All Rights Reserved.                            **
 **                                                            **
 **        6145-F, Northbelt Parkway, Norcross,                **
 **                                                            **
 **        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 **                                                            **
 ****************************************************************
 *****************************************************************
 *
 * IPMBIFc.H
 * 
 *
 * Author: Rama Bisa <ramab@ami.com> 
 *
 * 
 *****************************************************************/
#ifndef IPMBIFC_H
#define IPMBIFC_H

#include "Types.h"

/*** External Definitions ***/
#define BMC_SLAVE_ADDRESS   0x20
#define BMC_LUN             0x00
#define MAX_IPMB_PKT_SIZE   128

#define IPMB_REQUEST			1
#define IPMB_EVT_MSG_REQUEST	2
#define MIN_IPMB_MSG_LENGTH		7
#define PLATFORM_EVENT_MSG_CMD	0x02

#endif /* IPMBIFC_H	*/
