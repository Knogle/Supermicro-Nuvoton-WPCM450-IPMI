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
 * SharedMem.h
 * Memory shared by different tasks
 *
 * Author: Govind Kothandapani <govindk@ami.com>
 *       : Rama Bisa <ramab@ami.com>
 *       : Basavaraj Astekar <basavaraja@ami.com>
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef SHARED_MEM_H
#define SHARED_MEM_H
#include "Types.h"
#include "OSPort.h"
#include "MsgHndlr.h"
#include "IPMI_Main.h"
#include "PMConfig.h"
#include "Session.h"
#include "BridgeMgmt.h"
#include "BridgeEvt.h"
#include "SerialModem.h"
#include "Terminal.h"
#include "PEFTmr.h"
#include "IPMI_LANConfig.h"
#include "NVRAccess.h"
#include "PDKHooks.h"
#include "Indicators.h"
#include "Debug.h"
#include "SensorMonitor.h"
#ifdef CFG_PROJ_IPMC_SUPPORT_YES
#include "FRUState.h"
#endif
#include "ChassisDevice.h"

#pragma pack( 1 )

#define DISABLED_EVENT_RECEIVER 0xFF

/**
 * @struct BMCSharedMem_T
 * @brief Structure of memory shared between different tasks.
**/
typedef struct
{
    INT8U               EvRcv_SlaveAddr;			/**< Event receiver slave address.  */
    INT8U               EvRcv_LUN;				/**< Event receiver LUN.            */
    INT8U               MsgFlags;				/**< Message flags.                 */
    INT8U               GlobalEnables;				/**< Global enables.                */
    UserInfo_T          UserInfo [MAX_NUM_USERS];   /**< User information.              */
    ChannelInfo_T       ChannelInfo [MAX_NUM_CHANNELS]; /**< Channel information.       */
    SessionTblInfo_T    SessionTblInfo;				/**< Session information table.     */
    AlertStringTbl_T    AlertStringEntry;			/**< Alert strings.                 */
    LANDestType_T       VolLANDestType[MAX_LAN_CHANNELS];				/**< Volatile lan destination type. */
    LANDestAddr_T       VolLANDest[MAX_LAN_CHANNELS];					/**< Volatile lan destination address.*/
    INT8U               LANAlertStatus[MAX_LAN_CHANNELS];				/**< Lan alert stuatus.             */
    INT8U               GratArpStatus;				/**< Gratuitous arp status.         */
    VLANDestTags_T      VLANDestTag;				/**< VLAN Destination tags.         */
    INT8U               SOLBitRate[MAX_LAN_CHANNELS];					/**< SOL bit rate.                  */
    SMConfig_T          SMConfig;					/**< Serial modem configuration.    */
    INT8U               SerialMuxSetting;			/**< Serial mux setting.            */
    BOOL                SerialSessionActive;		/**< Session active status.         */
    BOOL                SerialModemMode;			/**< Modem mode.                    */
    TAPResCode_T        TAPRes;
    BridgeMgmtSHM_T     BridgeMgmt;					/**< Bridge management information. */
    BridgeEvt_T         BridgeEvt;					/**< Bridge event.                  */
    HealthState_T       HealthState;
    INT32U              SOLSessID;					/**< SOL session id.                */
    INT8U               SessionHandle;				/**< Session handle.                */
    PETAckTimeOutMgr_T  PETAckMgr [MAX_PET_ACK];	/**< PET Acknowledge Informations   */
    HTaskID_T           MsgHndlrID;                 /**< Message handler Task ID        */
    MsgHndlrTbl_T*      pMsgHndlrTbl;               /**< Pointer to Message Handler Table*/
    INT8U               MsgHndlrTblSize;            /**< Message handler Table Size      */
    INT8U               NumRcvMsg[3];                  /**< Number of message in RcvMsg_Q  */
    INT8U               NumEvtMsg;                  /**< Number of message in EvtMsg_Q  */
    INT8U               DeviceGUID [16];            /**< BMC GUID                       */
    INT8U               SystemGUID [16];            /**< System GUID                    */

    IndicatorInfo_T	    LEDInfo[MAX_LED_NUM];       /**< LED Info **/
    IndicatorInfo_T	    BeepInfo;                   /**< Beep Info **/

    PDK_SharedMem_T     PDKSharedMem;               /**< PKD Shared memory              */

    INT8U            	SerialMUXMode;             /**< Current Mux setting specfic for OEM */

    INT8U       		OSName[MAX_OS_NAME_SELECTOR][MAX_BLOCK_SIZE] ;
    INT8U       		m_SetInProgress;
    INT8U				m_ACPISysPwrState;			/**<	ACPISys Power State */
    INT8U				m_ACPIDevPwrState;			/**<	ACPIDev Power State */
    INT16U                    m_LastRecID;				/**<  Added to handle via SMM Channel */

	/*  Watch dog timer Info Since KCS -SMM  and Msg Hndlr using WatchDog Timer Variables */	
  INT8U		               IsWDTPresent	;
   INT8U  			  	 IsWDTRunning    ;

   /* System Event Sensor Number used for PEFAction Event logging in PEF task */
   INT8U               SysEvent_SensorNo;
#ifdef CFG_PROJ_IPMC_SUPPORT_YES
    INT8U               IPMB0Addr;                  /**< IPMB-0 Address    */
    INT8U               IPMB0Status;                /**< IPMB-0 Bus Status */
    INT8U               IPMBAState;                 /**< IPMB-A Bus State  */
    INT8U               IPMBBState;                 /**< IPMB-B Bus State  */
																							
    FRUDeviceInfo_T     FRUDeviceInfo[MAX_FRU_DEVICES];   /**< FRU Device Information */
																							
#if (SUPPORT_IPMBL_IFC == 1)
    INT8U            IPMBLAddr;                     /**< IPMB-L Address */
#endif /* #if (SUPPORT_IPMBL_IFC == 1) */

#endif /* CFG_PROJ_IPMC_SUPPORT_YES */
 
	BootOptions_T       sBootOptions;      			/* semi-volatile Boot Options */
	INT8U		IsValidBootflagSet;
	INT8U             SysRestartCaused;
    INT8U               u8MadeChange;               /* indicate the restart reason changed */
    #ifdef CONFIGURABLE_SESSION_TIME_OUT
    int 		uSessionTimeout;					/* configurable session timeout */
    #endif
	int 		gIPUDPRMCPStats;							/* Valid RMCP Packets counter */
    INT8U        InitSELDone;
} PACKED  BMCSharedMem_T;

#pragma pack( )

/**
 * @var SHMH_BMC
 * @brief Shared memory handle.
**/
extern  _FAR_ HSharedMem_T hBMCSharedMem;

/**
 * @def BMC_CREATE_SHARED_MEM()
 * @brief Create shared memory.
**/
#define BMC_CREATE_SHARED_MEM() \
    (OS_CREATE_SHARED_MEM (SHMH_BMC, sizeof (BMCSharedMem_T)))

/**
 * @def BMC_GET_SHARED_MEM()
 * @brief Get shared memory access.
**/
#define BMC_GET_SHARED_MEM() ((_FAR_ BMCSharedMem_T*)hBMCSharedMem)

//    ((_FAR_ BMCSharedMem_T*) OS_GET_SHARED_MEM (SHMH_BMC))


/*Shared memory time out in seconds */
#define SHARED_MEM_TIMEOUT        15

/**
 * @var hSharedMemMutex
 * @brief Shared memory mutex.
**/
extern _FAR_ Mutex_T*    hSharedMemMutex;

/**
 * @def LOCK_BMC_SHARED_MEM ()
 * @brief lock BMC shared memory
**/
#define LOCK_BMC_SHARED_MEM() OS_ACQUIRE_MUTEX(hSharedMemMutex, SHARED_MEM_TIMEOUT)

/**
 * @def UNLOCK_BMC_SHARED_MEM ()
 * @brief unlock BMC shared memory
**/
#define UNLOCK_BMC_SHARED_MEM() OS_RELEASE_MUTEX(hSharedMemMutex)

/**
 * @def LOCK_BMC_SHARED_MEM () for PEF Task only
 * @brief lock BMC shared memory
**/
#define LOCK_BMC_SHARED_MEM_FOR_PEF() OS_ACQUIRE_MUTEX(hPEFSharedMemMutex, SHARED_MEM_TIMEOUT)

/**
 * @def UNLOCK_BMC_SHARED_MEM () for PEF Task only
 * @brief unlock BMC shared memory
**/
#define UNLOCK_BMC_SHARED_MEM_FOR_PEF() OS_RELEASE_MUTEX(hPEFSharedMemMutex)


/**
 * @brief Initialize Shared memory.
 * @return 0 if success, -1 if error.
**/
extern int InitBMCSharedMem (void);

#endif  /* SHARED_MEM_H */
