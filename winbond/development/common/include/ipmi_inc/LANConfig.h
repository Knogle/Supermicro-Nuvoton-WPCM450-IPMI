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
 * lanconfig.h
 * Lan configuration command handler
 *
 * Author: Bakka Ravinder Reddy <bakkar@ami.com>
 * 
 *****************************************************************/
#ifndef LANCONFIG_H
#define LANCONFIG_H

#include "Types.h"


/**
 * @defgroup lcc LAN Configuration Command handlers
 * @ingroup devcfg
 * IPMI LAN interface configuration command handlers.
 * Get/Set commands allow retrieval and updation of various LAN parameters.
 * @{
**/
extern int SetLanConfigParam  (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetLanConfigParam  (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SuspendBMCArps (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetIPUDPRMCPStats (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);

/** @} */

/**
 * @brief Initialize LAN Configuration Data.
**/
extern void InitLanConfigData(void);

/**
 * @brief Check invalid subnet mask
**/
extern BOOLEAN CheckSubnetStatus(INT8U*);
/**
 * @brief Update ARP Status information.
 * @param IsTimerRunning - indicates timer state.
**/
extern void UpdateArpStatus   (BOOL IsTimerRunning);

/**
 * @brief Gratuitous ARP generation task. 
**/
extern void GratuitousARPTask (void);

#endif /* LANCONFIG_H */
