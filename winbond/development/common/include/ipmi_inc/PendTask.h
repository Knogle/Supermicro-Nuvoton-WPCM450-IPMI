/****************************************************************
****************************************************************
**                                                            **
**    (C)Copyright 2006-2007, American Megatrends Inc.        **
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
* PendTask.h
*      Any IPMI command operation which requires more
*      response time can be posted to this task.
*
* Author: Vinothkumar S <vinothkumars@ami.com>
*
*****************************************************************/
#ifndef PEND_TASK_H
#define PEND_TASK_H

#include "Types.h"
#include "OSPort.h"
#include "Message.h"
#include "IPMIDefs.h"



/*----------------------------------------------------
 * Pending Task Operation
 *----------------------------------------------------*/
typedef enum
{
	PEND_OP_SET_IP = 0,			/* Set IP Address */
	PEND_OP_SET_SUBNET,			/* Set SubNet Mask */ 
	PEND_OP_SET_GATEWAY,		/* Set Gateway */ 		
	PEND_OP_SET_SOURCE,			/*SET Address source*/
	PEND_OP_SET_DNS,			/*SET DNS Information */
	
 	PEND_OP_DELAYED_COLD_RESET,  /* Delayed Cold Reset */
 	PEND_OP_DELAYED_CR_CONFIG,
 	PEND_OP_SEND_EMAIL_ALERT,
 	PEND_OP_PEND_VM_CONFIG,
 	PEND_OP_PEND_OOB_CONFIG,
	PEND_OP_IFUPDOWN,
	PEND_OP_NIC_ENABLE_DISABLE,
#if SUPPORT_VLAN_IFC ==1	
	PEND_OP_SET_VLANID,
	PEND_OP_CONFIGURE_VLANIFC,
	PEND_OP_DECONFIGURE_VLANIFC,
#endif	
 } PendTaskOperation_E;


/* Function pointer for Pending command handler */
typedef int (*pPendCmdHndlr_T) (INT8U* pData, INT32U ReqLen,INT8U Channel);

/* Pending command handler type definition */
typedef struct
{
	PendTaskOperation_E				Operation;	/* Pending Operation */
	pPendCmdHndlr_T					PendHndlr;	/* Pending handler */
	
} PendCmdHndlrTbl_T;


 

/*----------------------------------------------------
 * Pend Task Handler Queue
 *----------------------------------------------------*/
extern void* PendCmdTask (void *pArg);
extern int PostPendTask (PendTaskOperation_E Operation, INT8U *pData, INT32U DataLen,INT8U Channel);


#endif	/* PEND_TASK_H */
