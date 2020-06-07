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
 * internal_sensor.h
 * Hanlders for Internal Sensors.
 *
 *  Author: Vinothkumar S <vinothkumars@ami.com>
 *          
 ******************************************************************/
#ifndef INTERNAL_SENSOR_H
#define INTERNAL_SENSOR_H

#include "Types.h"
#include "IPMI_Sensor.h"
#include "SDRRecord.h"


/*** External Definitions ***/

/*** Global definitions ***/

/* SEL Sensor */
#define EVENT_LOG_AREA_RESET					0x2
#define EVENT_SEL_ALMOST_FULL					0x5
#define EVENT_SEL_IS_FULL					0x4	



/* Watchdog Sensor */
#define EVENT_TIMER_EXPIRED					0x00
#define EVENT_HARD_RESET					0x01
#define EVENT_POWER_DOWN					0x02
#define EVENT_POWER_CYCLE					0x03
#define EVENT_TIMER_INT						0x08

/*-----------------------------------------
 * GetSELFullPercentage
 *-----------------------------------------*/
extern INT8U  GetSELFullPercentage(void);
	
/**
 * @brief GetSensorNumFromSensorType.
 * @param  SensorType       - Sensor Type of the sensor.
 * @return SensorInfo if success, 0xFF if error.
**/
extern void* GetSensorInfoFromSensorType(INT8U SensorType);


/**
 * @brief SetSELSensorReading.
 * @param Res       - Sensor reading to be set.
 * @return 0 if success, -1 if error.
**/
extern int  SetSELSensorReading (INT16U Reading);

/**
 * @brief SetWD2SensorReading.
 * @param Res       - Sensor reading to be set.
 * @return 0 if success, -1 if error.
**/
extern int  SetWD2SensorReading (INT16U Reading, INT8U u8TmrUse, INT8U u8TmrActions); 

extern int  RestartWD2Sensor(void);

extern int  WD2SELLog (INT8U Action);


#endif  /* INTERNAL_SENSOR_H */


