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
 * ipmi_hal.h
 * This header file chooses either softprocessor apis or hal apis
 * for hardware 
 *
 * Author: Vinothkumar S <vinothkumars@ami.com> 
 * 
 *****************************************************************/
#ifndef IPMI_HAL_H
#define IPMI_HAL_H
 
#include "sp_api.h"
#include "hal_api.h"

#ifdef DEVICE_ABSTRACTION_TYPE_USE_SOFTPROC

#define    IPMI_HAL_INIT(FILE)        		InitSoftProc (FILE)
#define    IPMI_HAL_INIT_SENSOR()     		sp_init_sensor_tbl()
#define    IPMI_HAL_INIT_DEVICES()    		sp_init_device()
#define    IPMI_HAL_GET_SENSOR_PROPERTIES(SEN_NUM, PROP) sp_get_sensor_properties(SEN_NUM, PROP)
#define    IPMI_HAL_GET_SENSOR_READING(SEN_NUM, READING)  sp_get_sensor_reading(SEN_NUM, READING)

#endif //type soft proc

#ifdef DEVICE_ABSTRACTION_TYPE_USE_C /* Using C based HAL APIS */
#define    IPMI_HAL_INIT(FILE)        		hal_init ()
#define    IPMI_HAL_INIT_SENSOR()     		hal_init_sensor_tbl()
#define    IPMI_HAL_INIT_DEVICES()    		hal_init_device()
#define    IPMI_HAL_GET_SENSOR_PROPERTIES(SEN_NUM, PROP) hal_get_sensor_properties(SEN_NUM, (sensor_properties_t*)PROP)
#define    IPMI_HAL_GET_SENSOR_READING(SEN_NUM, READING)  hal_get_sensor_reading(SEN_NUM, READING)

#endif  //#ifndef DEVICE_ABSTRACTION_TYPE_USE_C

#if !defined( DEVICE_ABSTRACTION_TYPE_USE_SOFTPROC ) && !defined (  DEVICE_ABSTRACTION_TYPE_USE_C )
#error "YOU MUST SPECIFY ONE OF THE DEVICE_ABSTRACTION_TYPES. C IS PREFERRED. PLEASE LOOK AT Configs.make.ipmi IN THE OEM AREA FOR THIS"
#endif


#endif //IPMI_HAL_H

