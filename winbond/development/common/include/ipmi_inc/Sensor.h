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
 * sensor.h
 * Sensor functions.
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 *          
 ******************************************************************/
#ifndef SENSOR_H
#define SENSOR_H

#include "Types.h"
#include "IPMI_Sensor.h"
#include "SDRRecord.h"
#include "SensorMonitor.h"


/*** External Definitions ***/
#define THRESHOLD_SENSOR_CLASS      0x01

#define GET_SETTABLE_SENSOR_BIT(FLAGS)  (FLAGS & 0x80)
#define GET_EVENT_DATA_OP(OP)      ( ((OP) >> 6))
#define GET_ASSERT_EVT_OP(OP)      ( ((OP) >> 4) & 0x03)
#define GET_DEASSERT_EVT_OP(OP)    ( ((OP) >> 2) & 0x03)
#define GET_SETSENSOR_OP(OP)       ( (OP) & 0x03)


#define CLEAR_ASSERT_BITS            0x3
#define SET_ASSERT_BITS              0x2
#define WRITE_ASSERT_BITS            0x1

#define CLEAR_DEASSERT_BITS            0x3
#define SET_DEASSERT_BITS              0x2
#define WRITE_DEASSERT_BITS            0x1


#define WRITE_NO_EVTDATA1             0x02
#define WRITE_EVTDATA1                0x01
#define USE_SM_EVTDATA               0x00

/*** Global definitions ***/
/**
 * @var g_NumThreshSensors
 * @brief Number of Threshold sensors.
**/
extern _FAR_ INT8U  g_NumThreshSensors;

/**
 * @var g_NumNonThreshSensors
 * @brief Number of Non-threshold sensors.
**/
extern _FAR_ INT8U  g_NumNonThreshSensors;


/**
 * @brief Initialize Sensor information.
 * @return 0 if success, -1 if error
**/
extern int InitSensor (void);

/**
 * @brief Get sensor's SDR record.
 * @param SensorNum - Sensor number.
 * @return the sensor's SDR record.
**/
extern _FAR_ SDRRecHdr_T* SR_GetSensorSDR (INT8U SensorNum);    


/**
 * @defgroup sdc Sensor Device Commands
 * @ingroup senevt
 * IPMI Sensor Device interface command handlers. These commands are 
 * used for configuring hysterisis and thresholds and reading
 * sensor values.
 * @{
**/
extern int GetDevSDRInfo (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetDevSDR (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ReserveDevSDRRepository (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSensorType (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorType (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ReArmSensor (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorEventStatus (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSensorHysterisis (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorHysterisis (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSensorThresholds (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorThresholds (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorReadingFactors (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSensorEventEnable (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorEventEnable (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorReading (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSensorReading (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

/**
 * @brief Get Sensor Hysterisis.
 * @param SensorNum - Sensor number.
 * @param Res       - Response data.
 * @return 0 if success, -1 if error.
**/
extern int SR_GetSensorHysterisis  (INT8U SensorNum, _NEAR_ GetSensorHysterisisRes_T* Res);

/**
 * @brief Get Sensor Threshold.
 * @param SensorNum - Sensor number.
 * @param Res       - Response data.
 * @return 0 if success, -1 if error.
**/
extern int SR_GetSensorThreshold   (INT8U SensorNum, _NEAR_ GetSensorThresholdRes_T* Res);

/**
 * @brief Get Sensor Event Enables.
 * @param SensorNum - Sensor number.
 * @param Res       - Response data.
 * @return 0 if success, -1 if error.
**/
extern int SR_GetSensorEventEnable (INT8U  SensorNum, _NEAR_ GetSensorEventEnableRes_T* Res);

/**
 * @brief Get Sensor Reading.
 * @param SensorNum - Sensor number.
 * @return the Sensor reading.
**/
extern INT16U SM_GetSensorReading (INT8U SensorNum, INT16U *pSensorReading);

/**
 * @brief SR_LoadSDRDefaults.
 * @param sr - SDR Record , pSensorInfo - Sensor information.
 * @return none.
**/

extern void SR_LoadSDRDefaults (SDRRecHdr_T* sr, SensorInfo_T* pSensorInfo);


/**
 * @brief SR_FindSDR.
 * @param SensorNum - Finds SDR for this sensor number.
 * @return none.
**/

extern SDRRecHdr_T* SR_FindSDR (INT8U SensorNum);


#endif  /* SENSOR_H */


