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
 * IPMI_Main.h
 * IPMI_Main external declarations.
 *
 * Author: Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef IPMI_MAIN_H
#define IPMI_MAIN_H

#include "Types.h"
#include "Support.h"
#include "OSPort.h"

#pragma pack( 1 )

#define AMI_BIN_PATH        "/usr/local/bin/"
#define MSG_PIPES_PATH      "/var/"
#define NV_DIR_PATH			"/conf/"
#define SP_BIN_PATH         "/conf/"
#define MUTEX_PATH          "/var/"
#define DEFAULT_CONFIG_PATH	"/etc/defconfig/"

/* Task ID */

#define MSG_HNDLR_TASK_ID       1
#define CHASSIS_CTRL_TASK_ID    2
#define CHASSIS_TIMER_TASK_ID   3
#define KCS_IFC_TASK_ID         4
#define LAN_IFC_TASK_ID         5
#define SERIAL_IFC_TASK_ID      6
#define IPMB_IFC_TASK_ID        7
#define SOL_IFC_TASK_ID         8
#define TERMINAL_IFC_TASK_ID    9
#define PEF_TASK_ID             10
#define TIMER_TASK_ID           11


/* Task Path    */

#define TIMER_TASK          AMI_BIN_PATH "Timer"
#define MSGHNDLR_TASK       AMI_BIN_PATH "MsgHndlr"
#define PEF_TASK            AMI_BIN_PATH "PEF"
#define KCS_IFC_TASK        AMI_BIN_PATH "KCS"
#define IPMB_IFC_TASK       AMI_BIN_PATH "IPMB"
#define LAN_IFC_TASK        AMI_BIN_PATH "LAN"
#define SERIAL_IFC_TASK     AMI_BIN_PATH "Serial"
#define CHASSIS_CTRL_TASK   AMI_BIN_PATH "ChassisCtrl"
#define CHASSIS_TIMER_TASK  AMI_BIN_PATH "ChassisTimer"
#define SOL_IFC_TASK        AMI_BIN_PATH "SOL"
#define TERMINAL_IFC_TASK   AMI_BIN_PATH "Terminal"
#define USB_IFC_TASK        AMI_BIN_PATH "USB"

/*Messaging pipes path*/

#define MSG_HNDLR_Q         MSG_PIPES_PATH "MsgHndlrQ"
#define RCV_MSG_Q_01        MSG_PIPES_PATH "RcvMsgQ01"
#define RCV_MSG_Q_10        MSG_PIPES_PATH "RcvMsgQ10"
#define RCV_MSG_Q_11        MSG_PIPES_PATH "RcvMsgQ11"
#define EVT_MSG_Q           MSG_PIPES_PATH "EvtMsgQ"
#define PEF_RES_Q           MSG_PIPES_PATH "PEFResQ"
#define PEF_TASK_Q          MSG_PIPES_PATH "PEFTaskQ"
#define PEND_TASK_Q          MSG_PIPES_PATH "PendTaskQ"


#define KCS1_RES_Q          MSG_PIPES_PATH "KCS1ResQ"
#define KCS2_RES_Q          MSG_PIPES_PATH "KCS2ResQ"
#define KCS3_RES_Q          MSG_PIPES_PATH "KCS3ResQ"
#define IPMB_IFC_Q          MSG_PIPES_PATH "IPMBIfcQ"
#define IPMB_RES_Q          MSG_PIPES_PATH "IPMBResQ"
#define ICMB_IFC_Q          MSG_PIPES_PATH "ICMBIfcQ"
#define ICMB_RES_Q          MSG_PIPES_PATH "ICMBResQ"
#define LAN_IFC_Q           MSG_PIPES_PATH "LANIfcQ"
#define LAN_RES_Q           MSG_PIPES_PATH "LANResQ"
#define SERIAL_IFC_Q        MSG_PIPES_PATH "SerialIfcQ"
#define SERIAL_RES_Q        MSG_PIPES_PATH "SerialResQ"
#define SOL_IFC_Q           MSG_PIPES_PATH "SOLIfcQ"
#define CHASSIS_CTRL_Q      MSG_PIPES_PATH "ChassisCtrlQ"
#define PDK_API_Q           MSG_PIPES_PATH "PDKAPIQ"
#define USB_RES_Q           MSG_PIPES_PATH "USBResQ"
#define IPMB0_Recv_Q        MSG_PIPES_PATH "IPMB0RecvQ"

#define SM_HNDLR_Q		MSG_PIPES_PATH "SM_Hndlr_Q"
#define VLAN_INFO_NOTIFY_Q		MSG_PIPES_PATH "VLAN_Info_Notify_Q"
#ifdef ENABLE_NODE_MANAGER_SUPPORT
	// support for NodeManager private 
	#define IPMB_SMLINK_IFC_Q          MSG_PIPES_PATH "IPMBSMLinkIfcQ"
	#define IPMB_SMLINK_RES_Q          MSG_PIPES_PATH "IPMBSMLinkResQ"
	
	/**
	 * @var _FAR_ HQueue_T hIPMBSMLinkIfc_Q
	 * @brief IPMB on SMLink interface request queue.
	**/
	extern _FAR_ HQueue_T hIPMBSMLinkIfc_Q;
	
	/**
	 * @var _FAR_ HQueue_T hIPMBSMLinkBRes_Q
	 * @brief IPMB on SMLink interface response queue.
	**/
	extern _FAR_ HQueue_T hIPMBSMLinkRes_Q;
	
	#define SMLINK_IPMB_CHANNEL	0x06
#endif // ENABLE_NODE_MANAGER_SUPPORT
/* Mutex paths	*/
#define SHARED_MEM_MUTEX	MUTEX_PATH "SharedMemMutex"
#define SENSOR_SHARED_MEM_MUTEX	MUTEX_PATH "SensorSharedMemMutex"
#define SEL_MUTEX           MUTEX_PATH "SELMutex"
#define MSG_TRACK_MUTEX     MUTEX_PATH "MsgTrackMutex"

/* Softprocessor binary image file */
#define SP_BIN_FILE         SP_BIN_PATH "SP.bin"

/**
 * Shared memory access key.
**/
#define BMC_SHARED_MEM              0x01
#define NVR_SHARED_MEM              0x02
#define SENSOR_SHARED_MEM           0x05

/**
 * Semaphore access Key
**/
#define PET_ACK_MANAGER_SEM_KEY     0x01

/**
 * @defgroup qs IPMI Message Queues
 * IPMI message queues constitute the communication model between
 * various tasks in the software.
 * @{
**/

/**
 * @var _FAR_ HQueue_T hSensorMonitor_Q
 * @brief Sensor monitoring task queue.
**/
extern _FAR_ HQueue_T hSensorMonitor_Q;

/**
 * @var _FAR_ HQueue_T hMsgHndlr_Q
 * @brief Message Handler task queue.
**/
extern _FAR_ HQueue_T hMsgHndlr_Q;

/**
 * @var _FAR_ HQueue_T hPEFTask_Q
 * @brief Platform Event Filtering task request queue.
**/
extern _FAR_ HQueue_T hPEFTask_Q;

/**
 * @var _FAR_ HQueue_T hPEFRes_Q
 * @brief Platform Event Filtering task response queue.
**/
extern _FAR_ HQueue_T hPEFRes_Q;

#ifdef APP_DEVICE
/**
 * @var _FAR_ HQueue_T hRcvMsg_Q
 * @brief Receive Message queue.
**/
//extern _FAR_ HQueue_T hRcvMsg_Q;
 
#if SUPPORT_KCS1_IFC == 1
 extern _FAR_ HQueue_T hRcvMsg_Q_01;
#endif
#if SUPPORT_KCS2_IFC == 1
 extern _FAR_ HQueue_T hRcvMsg_Q_10;
#endif
#if SUPPORT_KCS3_IFC == 1
 extern _FAR_ HQueue_T hRcvMsg_Q_11;
#endif

/**
 * @var _FAR_ HQueue_T hEvtMsg_Q
 * @brief Event Message queue.
**/
extern _FAR_ HQueue_T hEvtMsg_Q;
#endif

#if SUPPORT_KCS1_IFC == 1
/**
 * @var _FAR_ HQueue_T hKCS1Res_Q
 * @brief KCS interface - 1 response queue.
**/
extern _FAR_ HQueue_T hKCS1Res_Q;
#endif

#if SUPPORT_KCS2_IFC == 1
/**
 * @var _FAR_ HQueue_T hKCS2Res_Q
 * @brief KCS interface - 2 response queue.
**/
extern _FAR_ HQueue_T hKCS2Res_Q;
#endif

#if SUPPORT_KCS3_IFC == 1
/**
 * @var _FAR_ HQueue_T hKCS3Res_Q
 * @brief KCS interface - 3 response queue.
**/
extern _FAR_ HQueue_T hKCS3Res_Q;
#endif

#if SUPPORT_LAN_IFC == 1
/**
 * @var _FAR_ HQueue_T hLANIfc_Q
 * @brief LAN interface request queue.
**/
extern _FAR_ HQueue_T hLANIfc_Q;

/**
 * @var _FAR_ HQueue_T hLANRes_Q
 * @brief LAN interface response queue.
**/
extern _FAR_ HQueue_T hLANRes_Q;
#endif

#if SUPPORT_SERIAL_IFC == 1
/**
 * @var _FAR_ HQueue_T hSerialIfc_Q
 * @brief Serial interface request queue.
**/
extern _FAR_ HQueue_T hSerialIfc_Q;

/**
 * @var _FAR_ HQueue_T hSerialRes_Q
 * @brief Serial interface response queue.
**/
extern _FAR_ HQueue_T hSerialRes_Q;
#endif

#if SUPPORT_ICMB_IFC == 1
/**
 * @var _FAR_ HQueue_T hICMBIfc_Q
 * @brief ICMB interface request queue.
**/
extern _FAR_ HQueue_T hICMBIfc_Q;

/**
 * @var _FAR_ HQueue_T hICMBRes_Q
 * @brief ICMB interface response queue.
**/
extern _FAR_ HQueue_T hICMBRes_Q;
#endif

#if SUPPORT_IPMB_IFC == 1
/**
 * @var _FAR_ HQueue_T hIPMBIfc_Q
 * @brief IPMB interface request queue.
**/
extern _FAR_ HQueue_T hIPMBIfc_Q;

/**
 * @var _FAR_ HQueue_T hIPMBRes_Q
 * @brief IPMB interface response queue.
**/
extern _FAR_ HQueue_T hIPMBRes_Q;
#endif

#if SUPPORT_SMBUS_IFC == 1
/**
 * @var _FAR_ HQueue_T hSMBusIfc_Q
 * @brief SM Bus interface request queue.
**/
extern _FAR_ HQueue_T hSMBusIfc_Q;

/**
 * @var _FAR_ HQueue_T hSMBusRes_Q
 * @brief SM Bus interface response queue.
**/
extern _FAR_ HQueue_T hSMBusRes_Q;
#endif

#if SUPPORT_CHASSIS_CTRL_TASK == 1
/**
 * @var _FAR_ HQueue_T hChassis_Q
 * @brief Chassis queue.
**/
extern _FAR_ HQueue_T hChassisCtrl_Q;
#endif

#if SUPPORT_SOL_IFC == 1
/**
 * @var _FAR_ HQueue_T hSOLIfc_Q
 * @brief Serial Over LAN queue.
**/
extern _FAR_ HQueue_T hSOLIfc_Q;
#endif

#if SUPPORT_IPMB0_IFC == 1
/**
 * @var _FAR_ HQueue_T hIPMBFaultRecov_Q
 * @brief IPMB Fault recovery queue.
**/
extern _FAR_ HQueue_T      hIPMBFaultRecov_Q;
#endif

/**
 * @brief Chassis control Task when used as a thread.
**/
extern  void* ChassisTask (void *pArg);
/**
 * @brief Chassi Timer Task when used as a thread.
**/
extern  void* ChassisTimer (void *pArg);



#pragma pack( )

/** @} */

#endif /* IPMI_MAIN_H */
