/*****************************************************************
 *****************************************************************
 ***                                                            **
 ***    (C)Copyright 2005-2006, American Megatrends Inc.        **
 ***                                                            **
 ***            All Rights Reserved.                            **
 ***                                                            **
 ***        6145-F, Northbelt Parkway, Norcross,                **
 ***                                                            **
 ***        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 ***                                                            **
 *****************************************************************
 *****************************************************************
 ******************************************************************
 *
 * message.h
 * Inter task messaging functions.
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 ******************************************************************/
#ifndef MESSAGE_H
#define MESSAGE_H
#include "Types.h"
#include "OSPort.h"

#pragma pack( 1 )

#define IP_ADDR_LEN 4

/*-----------------------------------
 * Definitions
 *-----------------------------------*/
#define MSG_PAYLOAD_SIZE	1024 * 60
#define PIPE_NAME_LEN       	20

/*-----------------------------------
 * Type definitions
 *-----------------------------------*/
typedef struct
{
	INT32U			Param;			        /* Parameter                         */
	INT8U			Channel;		        /* Originator's channel number 		 */
	INT8U			SrcQ [PIPE_NAME_LEN];	/* Originator Queue 				 */
	INT8U			Cmd;			        /* Command that needs to be processed*/
	INT8U			NetFnLUN;		        /* Net function and LUN of command   */
	INT8U			Privilege;		        /* Current privilege level			 */
	INT32U			SessionID;		        /* Session ID if any				 */
	INT8U			IPAddr [IP_ADDR_LEN];   /* IP Address                        */
	INT16U			UDPPort;                /* UDP Port Number                   */
	INT16U			Socket;                 /* socket handle                     */
	INT32U			Size;			        /* Size of the data 				 */
	INT8U			Data [MSG_PAYLOAD_SIZE];/* Data						         */

} PACKED MsgPkt_T;


#pragma pack( )

/**
 * @brief Initialisation
 * @return   0 if success, -1 if failed.
**/
extern int InitMsg (void);

/**
 * @brief Post a message to the destination task.
 * @param MsgPkt   - Message to be posted.
 * @param Queue	   - Queue to post this message to.
 * @return   0 if success, -1 if failed.
**/
extern int PostMsg (_FAR_ MsgPkt_T* MsgPkt, HQueue_T Queue);

/**
 * @brief Post a message to the destination task without blocking.
 * @param MsgPkt   - Message to be posted.
 * @param Queue	   - Queue to post this message to.
 * @return   0 if success, -1 if failed.
**/
extern int PostMsgNonBlock (_FAR_ MsgPkt_T* MsgPkt, HQueue_T Queue);

/**
 * @brief Post a message to the destination queue .
 * @param MsgPkt   - Message to be posted.
 * @param Queue	   - Queue to post this message to.
 * @return   0 if success, -1 if failed.
**/
extern int PostToNamedQ (_FAR_ MsgPkt_T* pMsgPkt, INT8U* pQueue);



/**
 * @brief Gets the message posted to this task.
 * @param MsgPkt   - Pointer to the buffer to hold the message packet.
 * @param Queue    - Queue to fetch the message from.
 * @param NumMs    - Number of milli-seconds to wait.
 *  				 WAIT_NONE     - If the function has to return immediately.
 *					 WAIT_INFINITE - If the function has to wait infinitely.
 * NOTE :
 * @return   0 if success, -1 if failed.
**/
extern int GetMsg ( _FAR_ MsgPkt_T*  MsgPkt, HQueue_T Queue, INT16S NumMs);

/**
 * @brief Gets the message posted to this task.
 * @param MsgPkt   - Pointer to the buffer to hold the message packet.
 * @param Queue    - Queue to fetch the message from.
 * @param NumMs    - Number of milli-seconds to wait.
 *  				 WAIT_NONE     - If the function has to return immediately.
 *					 WAIT_INFINITE - If the function has to wait infinitely.
 * NOTE :
 * @return   0 if success, -1 if failed.
**/
extern int GetMsgInMsec ( _FAR_ MsgPkt_T*  MsgPkt, HQueue_T Queue, INT16S NumMs);

/**
 * @brief Returns the number of messages in the Queue.
 * @param Queue Queue.
**/
extern int NumMsg (HQueue_T Queue);

#endif	/* MESSAGE_H */
