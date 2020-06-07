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
 * hal_hw.h
 * HAL hardware  functions
 *
 * Author: Vinoth kumar S <vinothkumars@ami.com> 
 * 
 *****************************************************************/
#ifndef HAL_HW_H
#define HAL_HW_H
 
#include "Types.h"
#include "hal_defs.h"
#include "Debug.h"


extern int i2c_read_reg (hal_t *phal);
extern int i2c_write_reg (hal_t *phal);
extern int i2c_write_read (hal_t *phal);
extern int gpio_read (hal_t *phal);
extern int gpio_write (hal_t *phal);
extern int mmap_read (hal_t *phal);
extern int mmap_write (hal_t *phal);
extern int adc_read (hal_t *phal);
extern int fan_speed_read (hal_t *phal);  
extern int fan_speed_set (hal_t *phal);  
extern int peci_read_temp(hal_t *phal);
extern u8* get_i2c_bus_name(int bus_num);  //[Farida] add 


#endif //#define HAL_HW_H

