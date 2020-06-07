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
 * sp_api.h
 * Softprocessor executer API functions
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_API_H
#define SP_API_H
 
#include "sp_types.h"
#include "sp_debug.h"
#include "sp_main.h"
#include "SensorMonitor.h"


extern int InitSoftProc 		(char* sp_bin);
extern u16 get_sensor_addr 		(u16 sensor, int ctrlfn);
extern int sp_init_sensor_tbl 	(void);
extern int sp_init_device 		(void);
extern u16 sp_get_sensor_reading (u16 sensor_num, u16 *p_reading);
extern int sp_get_sensor_properties  (u16 sensor_num, SensorProperties_T* sensorproperties);
extern int sp_api_exec_label (char* label);
extern int sp_api_io_access ( u16* Offset ,u16 Func, u16* val);

extern u16 sp_get_Module_properties  (u16* offset, void** pModuleprop);

extern int  sp_device_init (u16 device_id, u16 device_instance);
extern int  sp_device_write  (u16 deviceid , u16 deviceinstance, u8* pwritebuf, u8 writelen);
extern int  sp_device_read  (u16 deviceid , u16 deviceinstance, u8* preadbuf, u8* preadlen);
extern int  sp_device_get_properties  (u16 deviceid , u16 deviceinstance, u8* properties, u8* plen);
extern int  sp_device_sensor_num  (u16 deviceid , u16 deviceinstance, u8* psensornum);
extern int  sp_check_device_presence  (u16 deviceid , u16 deviceinstance);


#endif //#define SP_API_H

