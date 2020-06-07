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
 * PEFTmr.h
 * 
 * 
 * Author: Govind Kothandapani <govindk@ami.com> 
 *       : Rama Bisa <ramab@ami.com>
 *       : Basavaraj Astekar <basavaraja@ami.com>
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 * 
 *****************************************************************/
#ifndef PEFTMRMGR_H
#define PEFTMRMGR_H

#include "Types.h"
#include "SELRecord.h"
#include "Message.h"

/*** Macro Definitions ***/
/**
 * @def MAX_PET_ACK     
 * @brief Maximum number of PET acknowledgements 
 **/
#define MAX_PET_ACK     5 

#pragma pack( 1 )

/*** Type definitions ***/

/**
 * @struct  PEFTmrMgr_T
 * @brief   PEF Timer table
**/
typedef struct
{
    INT8U   TmrArmed;       /**< Flag to indicate Timer is armed or not */
    INT8U   StartTmr;       /**< Flag to indicate Timer started or not */
    INT8U   TmrInterval;    /**< Timeout interval */
    INT8U   InitCountDown;  /**< Initial Count down value */
    INT8U   TakePEFAction;  /**< Action to be taken on timeout */

} PACKED  PEFTmrMgr_T;

/**
 * @struct  PETAckTimeOutMgr_T
 * @brief   PET Acknowledgement Timer table
**/
typedef struct
{
    INT8U               Present ;   /**< Flag to indicate Timer is armed or not */
    INT8U               AckTimeOut; /**< Acknowledgement time out value */
    INT8U              RetryInterval;  /* Initial Retry interval value ,we have to use for each retry PEF Traps*/
    INT8U               Retries;    /**< Number of retries */
    INT16U              SequenceNum;/**< Sequence No from PET */
    INT32U              Timestamp;  /**< Timestamp from PET */
    INT8U               DestSel;    /**< Destination Selector from PET */
     INT8U              Channel;   /* Since we are supporting the mulit LAN channel  we have to maintain the LAN channel */
    SELEventRecord_T    EvtRecord;  /**< Event record from PET */

} PACKED  PETAckTimeOutMgr_T;

#pragma pack( )

/* Global Variable */
extern _FAR_ PEFTmrMgr_T        g_PEFTmrMgr;  /**< Contains PEF Timer information */


/**
 * @brief This function takes an action on PEF timeout depending on the actions specified.
 **/
extern void PEFTimerTask (void);

/**
 * @brief This function re sends the alert on PET Acnowledgement timeout
 **/
extern void PETAckTimerTask (void);

#endif /* PEFTMRMGR_H */
