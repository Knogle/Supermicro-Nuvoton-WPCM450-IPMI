/*****************************-*- ********-*-********************************/
/* Filename:    libpwmtach.h                                                */
/* Description: Library interface to pwmtach access                         */
/*****************************************************************************/
#ifndef LIBPWMTACH_H
#define LIBPWMTACH_H

#ifdef __cplusplus
extern "C" {
#endif

#include "pwmtach.h"

#define PWMTACH_DEV_FILE   "/dev/pwmtach"

/** \file libpwmtach.h
 *  \brief Public headers for the PWMTACH interface library
 *  
 *  This library contains friendly function call interfaces for setting 
 *  fan control operations.
*/
extern int set_fan_connect ( unsigned char fan_number, unsigned int fanpwm, unsigned int fantach );
extern int enable_fan_control ( unsigned char fan_number );
extern int enable_all_fans_control ( void );
extern int enable_fan_status_read ( unsigned char fan_number );
extern int enable_all_fans_status_read ( void );
extern int set_fan_speed ( unsigned char fan_number, unsigned int rpm_value );
extern int get_fan_speed ( unsigned char fan_number, unsigned int *rpm_value );
extern int disable_fan_control ( unsigned char fan_number );
extern int disable_all_fans_control ( void );
extern int disable_fan_status_read ( unsigned char fan_number );
extern int disable_all_fans_status_read ( void );

#ifdef __cplusplus
}
#endif

#endif
