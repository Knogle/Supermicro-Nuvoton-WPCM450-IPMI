/*****************************-*- ********-*-********************************/
/* Filename:    gpioifc.h                                                    */
/* Description: Library interface to gpio access                             */
/*****************************************************************************/

#ifndef GPIOIFC_H
#define GPIOIFC_H

#ifdef __cplusplus
extern "C" {
#endif

#include "gpio.h"

#define GPIO_CTL_FILE   "/dev/gpio0"

/** \file gpioifc.h
 *  \brief Public headers for the gpio interface library
 *  
 *  This library contains friendly function call interfaces for setting 
 *  gpio directions and data.  It hides all the details of playing with
 *  gpios through the gpio manager (opening the device file, calling ioctl,
 *  etc.)
*/
	extern int get_gpio_dir ( unsigned short gpio_number );
	extern int set_gpio_dir_input ( unsigned short gpio_number );
	extern int set_gpio_dir_output ( unsigned short gpio_number );
	extern int get_gpio_pol ( unsigned short gpio_number );
	extern int set_gpio_pol_high ( unsigned short gpio_number );
	extern int set_gpio_pol_low ( unsigned short gpio_number );
	extern int get_gpio_data ( unsigned short gpio_number );
	extern int set_gpio_data_high  ( unsigned short gpio_number );
	extern int set_gpio_data_low ( unsigned short gpio_number ); 
	extern int set_gpio_od_output_high( unsigned short gpio_number );
	extern int set_gpio_od_output_low( unsigned short gpio_number );
        extern int get_gpio_output_data( unsigned short gpio_number );
        extern int set_gpio_output_data( unsigned short gpio_number, unsigned char gpio_data );


/********************************************************************************/
/* The following APIs deal with GPIO interrupts and must be used accordingly.
	An application that wishes to register for GPIO interrupts must call these
	APIs in the following manner.

	The application should first call register_gpio_interrupts().
	The application should then call wait_for_gpio_interrupts() using the fd
	that was given by the register_gpio_interrupts() call.
	The application should call unregister_gpio_interrupts() in the end. */
/********************************************************************************/
	extern int register_sensor_interrupts(interrupt_sensor_info *sensors_data,unsigned int num_sensors,int fd);
	extern int wait_for_sensor_interrupts(int fd, interrupt_sensor_info *sensor_data);
	//extern int unregister_sensor_interrupts(int fd, interrupt_sensor_info *sensor_data);
	extern int unregister_sensor_interrupts(int fd);
	extern int register_chassis_interrupts(interrupt_sensor_info *sensors_data,unsigned int num_sensors,int fd);
	extern int wait_for_chassis_interrupts(int fd, interrupt_sensor_info *sensor_data);
	extern int unregister_chassis_interrupts(int fd);

#ifdef __cplusplus
}
#endif

#endif
