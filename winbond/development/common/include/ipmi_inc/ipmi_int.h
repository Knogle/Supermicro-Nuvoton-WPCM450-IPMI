/*****************************************************************
 *****************************************************************
 ***                                                            **
 ***    (C)Copyright 2006-2007, American Megatrends Inc.        **
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
 * interrupt.h
 * IPMI based interrupt handling.
 *
 *  Author: Vinothkumar S <vinothkumars@ami.com>
 ******************************************************************/

#ifndef _INTTERRUPT_H_
#define _INTTERRUPT_H_

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <fcntl.h>
#include <ctype.h>
#include <unistd.h>
#include <sys/select.h>
#include <sys/ioctl.h>
#include <sys/poll.h>
#include <sys/time.h>
#include <stdint.h>
#include <dbgout.h>

#include "Types.h"



/* Interrupt Trigger Type */
typedef enum  {
	IPMI_INT_TRIGGER_EDGE,
	IPMI_INT_TRIGGER_LEVEL

}  IPMI_INTTrig_type_E;

/* Interrupt Trigger Method */
typedef enum {
	IPMI_INT_RISING_EDGE,
	IPMI_INT_FALLING_EDGE,
	IPMI_INT_HIGH_LEVEL,
	IPMI_INT_LOW_LEVEL,
	IPMI_INT_BOTH_EDGES 

}  IPMI_INTTrig_method_E;


/* Interrupt Source */
typedef enum 
{	
	INT_SENSOR = 0,		/* Interrupt occured for any Sensor monitoring */
	INT_CHASSIS,		/* Interrupt for any chassis releated */
	INT_LPC_RESET,		/* Interrupt for LPC reset */
	INT_REG_HNDLR		/* Interrupt handled by registered handler */
	
} IPMI_INTSource_E;



/* Registered interrupt information */
typedef struct {

	void					*pint_hndlr;		/* interrupt handler for this routine */	
	int						int_num;		/* interrupt number for this handler */
	IPMI_INTSource_E		Source;			/* Interrupt source */
	INT8U					SensorNum;		/* Used only for Sensor monitoring */
	INT8U					SensorType;		/* Used only for Sensor monitoring */
	IPMI_INTTrig_method_E	TriggerMethod;		/* Interrupt trigger method */
	IPMI_INTTrig_type_E		TriggerType;		/* Interrupt trigger type */
	INT8U					reading_on_assertion;
		
} IPMI_INTInfo_T;


/* pointer to the handler which handles the interrupt after comming out of 
 * the interrutp
 *  
 * */
typedef int (*pINTHndlr_T)    (IPMI_INTInfo_T*);



/*** Global definitions ***/
#define IPMI_MAX_INT_FDS 		10
#define WAIT_FOR_IPMI_INT       	0x10

/* Declaration for Interrupt task  */
void* InterruptTask (void *pArg);

/***
 * @brief Msghandler and Interrupt Task needs to be syncronized so that
 *        all the Interrupt initialization are done before msghndler processing
 *        This api acquires a mutex for this syncronization
 **/
 extern void INTSyncMutexAcquire (void);
 	
/***
 * @brief Msghandler and Interrupt Task needs to be syncronized so that
 *        all the Interrupt initialization are done before msghndler processing
 *        This api releases a mutex for this syncronization
 **/
 extern void INTSyncMutexRelease (void);


#endif //  _INTTERRUPT_H_

