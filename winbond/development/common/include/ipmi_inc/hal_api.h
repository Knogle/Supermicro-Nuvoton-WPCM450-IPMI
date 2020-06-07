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
 * hal_api.h
 * HAL API functions
 *
 * Author: Vinoth kumar S <vinothkumars@ami.com> 
 * 
 *****************************************************************/
#ifndef HAL_API_H
#define HAL_API_H
 
#include "Types.h"
#include "hal_defs.h"
#include "Debug.h"

#define DEVICE_NOT_PRESENT      0xFFFF
#define INVALID_HANDLE          -1



/* Platform Access Routines Library macros */
#define HAL_PAR_LIB          		libpar.so

/* Platform Access Routines Library API macros */
#define HAL_GET_TOTAL_SENSORS_API  	hal_get_total_sensors
#define HAL_GET_SENSOR_TBL_ENTRY_API  	hal_get_sensor_table_entry
#define HAL_GET_TOTAL_DEVICES_API  	hal_get_total_devices
#define HAL_GET_DEVICE_TBL_ENTRY_API  	hal_get_device_table_entry
#define HAL_GET_DEVICE_INIT_ENTRY_API  	hal_get_device_init_entry







extern device_tbl_t* get_sensor_table (u16 sensor);

extern int hal_init (void);

extern int hal_init_sensor_tbl (void);

extern int hal_init_device (void);

extern int hal_get_sensor_reading (u16 sensor_num, u16 *p_reading);

extern int  hal_get_sensor_properties (u16 sensor_num,  sensor_properties_t* psensor_properties);

extern int hal_write_sensor (u16 sensor_num, u8* pwritebuf, u8 writelen);

extern int hal_init_sensor (u16 sensor_num);

extern int hal_get_device_handle (INT16U deviceid);

extern device_tbl_t* get_device_table (int handle);

extern int hal_device_read  (int handle, u8* preadbuf, int* preadlen);

extern int hal_device_write  (int handle , u8* pwritebuf, u8 writelen);

extern int hal_device_init  (int handle);

extern int hal_device_get_properties  (int handle , u8* properties);

extern int handle_check_device_presence  (u16 deviceid );

extern int hal_device_sensor_num  (int handle , u8* psensornum);

extern int hal_gpio_get_dir  (int handle , u8* dir);

extern int hal_gpio_set_dir  (int handle, u8 dir);

extern int hal_gpio_get_pol  (int handle, u8* pol);

extern int hal_gpio_set_pol  (int handle, u8 pol);

extern int hal_rw_i2c  (int handle, u8* preadbuf, u8 readlen, u8* pwritebuf, u8 writelen);

extern int hal_get_next_device_handle (int prev_handle, INT16U device_id);

extern int hal_gpio_set_output_reg  (int handle, u8 val);


extern int hal_get_total_sensors (void);
extern device_tbl_t* hal_get_sensor_table_entry (int table_index);
extern int hal_get_total_devices (void);
extern device_tbl_t* hal_get_device_table_entry (int table_index);
extern phal_hndlr_t hal_get_device_init_entry (int table_index);


#endif //#define HAL_API_H

