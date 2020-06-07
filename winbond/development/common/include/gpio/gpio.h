#ifndef __GPIO__
#define __GPIO__

/* common  declaritions for gpio library and the driver */
#define GPIO_DIR_OD_OUT 2
#define GPIO_DIR_OUT   1
#define GPIO_DIR_IN    0
#define GPIO_POL_HIGH  1
#define GPIO_POL_LOW   0
#define GPIO_DATA_HIGH 1
#define GPIO_DATA_LOW  0

#include "gpio_pins.h"
#include "intrsensor.h"

/* GPIO Mapping Table */
/***This is an internal table used by the driver******/
typedef struct
{
        unsigned short VirtualPin;
        unsigned short PhysicalPin;
        unsigned char  Direction;
        unsigned char  Value;
}  __attribute__((packed)) GPIO_MAP_TABLE;


/****This is the structure that is passed back and forth between userspace and driver as an ioctl arg*****/
typedef struct 
{
	unsigned short PinNum; /* Not used in case of interrupt sensor data */
	union
	{
		unsigned char  data; /* Direction or Value or Polarity */
		interrupt_sensor_data int_sensor_data;
	};
}  __attribute__((packed)) Gpio_data_t;	


/******This is an internal structure in the driver which is used for maintaining qs******/
typedef struct _pending_interrupt_info
{
	unsigned short gpio;
	unsigned char  state; //use to determine what transition caused the interrupt.State is reading of the pin after the interrupt.
							//THIS HAS TO BE DETERMINED IN THE IRQ ITSELF
	struct _pending_interrupt_info *next;
}  __attribute__((packed)) pending_interrupt_info;


typedef enum {
	GET_MODULE_GPIO_PROPERTIES,
	GET_GPIO_DIRECTION,
	SET_GPIO_DIRECTION,
	GET_GPIO_POLARITY,
	SET_GPIO_POLARITY,
	READ_GPIO,
	WRITE_GPIO,
	SET_GPIO_OD_OUT,
	REGISTER_SENSOR_INTS,
	WAIT_FOR_SENSOR_INT,
	UNREGISTER_SENSOR_INTS,
	REGISTER_CHASSIS_INTS,
	WAIT_FOR_CHASSIS_INT,
	UNREGISTER_CHASSIS_INTS,
        READ_OUTPUT_DATA,
        WRITE_OUTPUT_DATA
}eGpioFunc;

typedef Gpio_data_t gpio_ioctl_data;

#endif // __GPIO__
