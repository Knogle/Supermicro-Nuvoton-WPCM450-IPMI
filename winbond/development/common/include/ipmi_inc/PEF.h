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
 * Pef.h
 * PEF Task.
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef PEF_H
#define PEF_H

#include "Types.h"

/*** Macro Definitions ***/

/**
 * @def PARAM_RETRY_ALERT                           
 * @brief Message param for retrying alert 
 **/
#define PARAM_RETRY_ALERT                           0 
/**
 * @def PARAM_ALERT_IMM                             
 * @brief Message param for sending alert immediately 
 **/
#define PARAM_ALERT_IMM                             1 
/**
 * @def PARAM_PET_ACK                               
 * @brief Message param for acknoledgements 
 **/
#define PARAM_PET_ACK                               2 
/**
 * @def PARAM_SENSOR_EVT_MSG                        
 * @brief Message param for events from sensor monitor 
 **/
#define PARAM_SENSOR_EVT_MSG                        3 
/**
 * @def PARAM_PLATFORM_EVT_MSG                      
 * @brief Message param for retrying alert 
 **/
#define PARAM_PLATFORM_EVT_MSG                      4 

/*** Extern declarations ***/

/**
 * @var _FAR_ INT8U g_MatchedEventSeverity
 * @brief Contains the Event severity after matching event data with
 *                                          PEF event filters
 * @warning Should be used from Message Handler task
 **/
extern _FAR_ INT8U g_MatchedEventSeverity;

/**
 * @var _FAR_ INT8U Semaphore_T   hPETAckSem;
 * @brief Semaphore handle to lock PET Ack Manager
**/
extern _FAR_ Semaphore_T   hPETAckSem;


#define     ALERT_IMM_NO_STATUS         0
#define     ALERT_IMM_NORMAL_END        1
#define     ALERT_IMM_CALL_RETRY_FAILED 2
#define     ALERT_IMM_TIMEOUT_FAILURE   3
#define     ALERT_IMM_IN_PROGRESS       0xFF


/**
 * @def PEFTask
 * @brief  PEF Task
 **/
void* PEFTask (void *pArg);

#endif /* PEF_H */
