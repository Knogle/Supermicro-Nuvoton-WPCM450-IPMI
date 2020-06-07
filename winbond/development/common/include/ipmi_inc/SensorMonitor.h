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
 * SensorMonitor.h
 * Sensor Monitor 
 *
 * Author: Rama Rao Bisa <ramab@ami.com> 
 * 
 *****************************************************************/
#ifndef SENSOR_MONITOR_H
#define SENSOR_MONITOR_H

#include "gpioifc.h"
#include "internal_sensor.h"

/*** Soft Processor Control functions   ***/    
#define READ_CTRL_FN                                0x01
#define LWR_NON_CRITICAL_GOING_LOW_CTRL_FN          0x02
#define LWR_CRITICAL_GOING_LOW_CTRL_FN              0x03
#define LWR_NON_RECOVERABLE_GOING_LOW_CTRL_FN       0x04
#define UPPER_NON_CRITICAL_GOING_HIGH_CTRL_FN       0x05
#define UPPER_CRITICAL_GOING_HIGH_CTRL_FN           0x06
#define UPPER_NON_RECOVERABLE_GOING_HIGH_CTRL_FN    0x07

#define LWR_NON_CRITICAL_GOING_HIGH_CTRL_FN         0x82
#define LWR_CRITICAL_GOING_HIGH_CTRL_FN             0x83
#define LWR_NON_RECOVERABLE_GOING_HIGH_CTRL_FN      0x84
#define UPPER_NON_CRITICAL_GOING_LOW_CTRL_FN        0x85
#define UPPER_CRITICAL_GOING_LOW_CTRL_FN            0x86
#define UPPER_NON_RECOVERABLE_GOING_LOW_CTRL_FN     0x87

#define GET_NORMAL_VALUE                            0xFE
#define INIT_CTRL_FN                                0xFF

/*** Sensor Event   definitions ***/
#define SENSOR_STATUS_NORMAL                    0x00
#define SENSOR_STATUS_WARNING_HIGH              0x01
#define SENSOR_STATUS_WARNING_LOW               0x02
#define SENSOR_STATUS_CRITICAL_HIGH             0x03
#define SENSOR_STATUS_CRITICAL_LOW              0x04
#define SENSOR_STATUS_NONRECOVERABLE_HIGH       0x05
#define SENSOR_STATUS_NONRECOVERABLE_LOW        0x06
#define SENSOR_STATUS_FATAL                     0x08

#define MAX_SENSORS_ALLOWED                     20
#ifdef SKIPPER
#define MAX_SENSORS                             0x13
#define MAX_FANS                                0x08
#define MAX_VOLTS                               0x08
#define MAX_TEMPS                               0x01
#else
#define MAX_SENSORS                             0x11
#define MAX_FANS                                0x07
#define MAX_VOLTS                               0x08
#define MAX_TEMPS                               0x00
#endif

#define MAX_SENSOR_NUMBERS	    		256	


/*---------------------------------------------------
 * Parameters passed to the sensor monitor handler Q.
 *---------------------------------------------------*/
#define PARAM_REARM_ALL_SENSORS     0x01
#define PARAM_REARM_SENSOR          0x02
#define PARAM_HANDLE_IRQ            0x03
#define PARAM_SENSOR_SCAN           0x04


typedef int (*pPDK_MonitorHook_T) (INT8U SensorNum, INT16U* pSensorReading, INT8U* pReadFlags);
typedef int (*pPDK_SensorInitHook_T) (void *pSensorInfo);
typedef int (*pPDK_MonitorExtHook_T) (void *pSensorInfo, INT8U* pReadFlags);
typedef int (*pPDK_PreEventLogHook_T) (void *pSensorInfo, INT8U* pEventData, INT8U* pReadFlags);

/* Hook Type supported */
typedef enum
{
	HT_INIT_SENSOR,
	HT_PRE_MONITOR,
	HT_POST_MONITOR
	
} HookType_e;

	
#define MAX_PRE_MONITOR_HOOKS        3
#define MAX_POST_MONITOR_HOOKS       3
#define MAX_POST_MONITOR_EXT_HOOKS   3
#define MAX_INIT_SENSOR_HOOKS		 3
#define MAX_PRE_EVENT_LOG_HOOKS      3


/* Sensor Monitor Event Flags */

#define SET_SM_INIT_DONE(FLAGS)			(FLAGS = FLAGS & 0xFE)
#define SET_SM_REINIT(FLAGS)			(FLAGS = FLAGS | 0x01)
#define SET_SM_UNABLE_TO_READ(FLAGS)		(FLAGS = FLAGS | 0x20)
#define SET_SM_CLEAR_UNABLE_TO_READ(FLAGS)	(FLAGS = FLAGS & 0xDF)
#define SET_SM_ENABLE_SCAN(FLAGS)		(FLAGS = FLAGS | 0x40)
#define SET_SM_DISABLE_SCAN(FLAGS)		(FLAGS = FLAGS & 0xBF)
#define SET_SM_ENABLE_EVT(FLAGS)		(FLAGS = FLAGS | 0x80)
#define SET_SM_DISABLE_EVT(FLAGS)		(FLAGS = FLAGS & 0x7F)


#pragma pack (1)

typedef struct 
{ 
	INT8U  MonitorInterval;
	INT8U  MonitorState ;
	INT16U NormalValue;     		
    interrupt_sensor_info IntrSensorInfo;
} PACKED SensorProperties_T; 


typedef struct
{
    INT8U		SensorNum;   	/* Sensor Numbner */	
    INT8U       	HookType;       /* Type of the hook */ 
    pPDK_MonitorHook_T	pHook;          /* Hook */ 

} PACKED PDKSensorHook_T; 
/**
 * @struct SensorInfo_T
 * @brief Sensor Information.
**/
typedef struct
{

    BOOL                IsSensorPresent;  
    INT16U              SensorReading;
    INT8U               SensorNumber;
    INT8U               SensorTypeCode;
    INT8U		EventTypeCode;
    INT8U   		SensorInit;

    // These values are copied from the SDR.
    INT8U           Units1;
    INT8U           Units2;
    INT8U           Units3;

    // Caution !!! Order of these members has to maintained
    // Some of the command implementation needs the order to be maintained 

    // the following set are used in Get Sensor Reading Factors command
    INT8U   		M_LSB;
    INT8U   		M_MSB_Tolerance;
    INT8U   		B_LSB;
    INT8U   		B_MSB_Accuracy;
    INT8U   		Accuracy_MSB_Exp;
    INT8U   		RExp_BExp;

    // the following set are used in Get/Set Sensor Threshold commands
    INT8U               LowerNonCritical;
    INT8U               LowerCritical;
    INT8U               LowerNonRecoverable;
    INT8U               UpperNonCritical;
    INT8U               UpperCritical;
    INT8U               UpperNonRecoverable;
    
    // the following set are used in Get/Set Sensor Hysteresis commands
    INT8U               PosHysteresis;
    INT8U               NegHysteresis;


    // the following set are used in Get/Set Event Enables commands
    INT8U   		EventFlags;
				 /* Event Flags description           */
    				 /* Bit 0 -  Initialization Done      */
				 /* Bit 1 -  Update in Progress       */
				 /* Bit 2 -  reserved                 */
				 /* Bit 3 -  reserved                 */
				 /* Bit 4 -  reserved                 */
				 /* Bit 5 -  Unable to read           */
				 /* Bit 6 -  Sensor Scanning disabled */
				 /* Bit 7 -  Event Message Disabled   */
    INT8U               AssertionEventEnablesByte1;
    INT8U               AssertionEventEnablesByte2;
    INT8U               DeassertionEventEnablesByte1;
    INT8U               DeassertionEventEnablesByte2;


    INT8U               EventLevel;
    INT8U               HealthLevel;    // Added to provide correct Health state
    INT8U               AssertionEventOccuredByte1;
    INT8U               AssertionEventOccuredByte2;
    INT8U               DeassertionEventOccuredByte1;
    INT8U               DeassertionEventOccuredByte2;

    INT16U              SettableThreshMask;
    INT16U		Err;
    INT8U 		SensorMonitorInterval;  // added to effect different sensor monitor intervals.
    INT8U 		SensorState; 
    INT16U		PreviousState;
    INT8U               SensorReadType;

    /* Settable Sensor Fields */
    INT8U   Operation;		
    INT8U   EvtData1;
    INT8U   EvtData2;
    INT8U   EvtData3;


    INT8U		ComparisonStatus;
    INT8U       SensorCaps;              // JM 062306 - Added to support manual re-arm sensors
    INT8U       AssertionHistoryByte1;   // JM 062306 - Added to support manual re-arm sensors
    INT8U       AssertionHistoryByte2;   // JM 062306 - Added to support manual re-arm sensors
    INT8U       DeassertionHistoryByte1; // JM 062306 - Added to support manual re-arm sensors
    INT8U       DeassertionHistoryByte2; // JM 062306 - Added to support manual re-arm sensors

    /* Sensor Monitor Internal Flags 
     * This flags overrides any IPMI SDR settings.
     * 
     * 
     * */  	
    INT8U   		InternalFlags;   
    			 /* Bit 0 -  Enable/Disable scanning - overrides SDR scanning bit      */
				 /* Bit 1 -  reserved                 */
				 /* Bit 2 -  reserved                 */
				 /* Bit 3 -  reserved                 */
				 /* Bit 4 -  reserved                 */
				 /* Bit 5 -  reserved                 */
				 /* Bit 6 -  reserved                 */
				 /* Bit 7 -  reserved                 */
	//<KAMAL>Added to support SensorAveraging ../
    INT8U 	      OEMField;	

    pPDK_MonitorHook_T  pPreMontior [MAX_PRE_MONITOR_HOOKS];
    INT8U				PreMonitorHookCnt;
    pPDK_MonitorHook_T  pPostMontior [MAX_POST_MONITOR_HOOKS];
    INT8U				PostMonitorHookCnt;
    pPDK_SensorInitHook_T pInitSensor [MAX_INIT_SENSOR_HOOKS];
    INT8U				InitSensorHookCnt;
    pPDK_MonitorExtHook_T  	pPostMontiorExt [MAX_POST_MONITOR_EXT_HOOKS];
	INT8U					PostMonitorExtHookCnt;
    pPDK_PreEventLogHook_T 	pPreEventLog [MAX_PRE_EVENT_LOG_HOOKS];
	INT8U					PreEventLogHookCnt;

#if SUPPORT_OPMA == 1 
   /* The offset for the sensor is added for OPMA Support */
   INT8U SenReadingOffset;
   INT8U SensorOwnerLun;
#endif 
} PACKED SensorInfo_T; 


/**
 * @struct SensorSharedMem_T
 * @brief Shared memory for Sensor Information.
**/

typedef struct
{
    SensorInfo_T        SensorInfo [MAX_SENSOR_NUMBERS + 1]; /* Holds all sensor informations */
    INT8U       	GlobalSensorScanningEnable;

} PACKED SensorSharedMem_T;




#pragma pack ()

/*---------------------------------------
 * InitInternalSensors
 *---------------------------------------*/
extern int InitInternalSensors (SensorInfo_T *pSensorInfo);


/**
 * @var g_SensorValues 
 * @brief Global array that holds current sensor values.
**/
extern _FAR_ INT8U  g_SensorValues [];


extern _FAR_  pid_t g_SMPID;

/**
 * @brief Initialize Sensor monitoring.
 * @return 0 if success, -1 if error.
**/
extern int InitSensorMonitor (void);


/**
 * @brief Reset Sensor monitoring.
**/
extern void ResetSensorMonitor (void);


/**
 * @brief Sensor monitoring task.
**/
extern void* SensorMonitorTask (void*);


/**
 * @brief Post an Event message to System Event Log.
**/
extern int PostEventMessage (_NEAR_ INT8U *EventMsg, INT8U size);

/**
 * @brief Returns the current sensor reading
**/
extern INT16U SM_GetSensorReading (INT8U SenNum, INT16U *pSensorReading);

/***
 * @brief Msghandler and Sensormonitor needs to be syncronized so that
 *        all the sensorinitialization are done before msghndler processing
 *        This api acquires a mutex for this syncronization
 **/
 extern void SMSyncMutexAcquire (void);
 	
/***
 * @brief Msghandler and Sensormonitor needs to be syncronized so that
 *        all the sensorinitialization are done before msghndler processing
 *        This api acquires a mutex for this syncronization
 **/
 extern void SMSyncMutexRelease (void);
 	

/*-------------------------------------------
 * GetSensorInfo
 * 
 * This function will be used by the Sensor
 * hook functions to manipulate Sensor information
 * This function DOES NOT lock sensor information
 *------------------------------------------*/
extern SensorInfo_T* GetSensorInfo (INT8U SensorNum);

#endif /* SENSOR_MONITOR_H */
