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
 ****************************************************************/
/*****************************************************************
 *
 * Events.h
 * Event processing commands handler
 *
 * Author: Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef EVENTS_H
#define EVENTS_H

#include "Types.h"


/**
 * @defgroup eic Event Commands
 * @ingroup senevt
 * IPMI Event interface command handlers. These commands are used for 
 * setting/getting event receivers and sending event messages.
 * @{
**/
extern int SetEventReceiver (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetEventReceiver (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int PlatformEventMessage (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

#endif  /* EVENTS_H */
