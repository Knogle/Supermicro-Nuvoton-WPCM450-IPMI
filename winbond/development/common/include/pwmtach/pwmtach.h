#ifndef __PWMTACH__
#define __PWMTACH__

typedef struct 
{
	unsigned char fannumber;
	unsigned int rpmvalue;
	unsigned int fanpwm;
	unsigned int fantach;
	unsigned int freqvalue;
}  __attribute__((packed)) pwmtach_data_t;

typedef enum {
	GET_MODULE_PROPERTIES,
	SET_FAN_CONNECT,
	ENABLE_PWM,
	ENABLE_ALL_PWM,
	ENABLE_TACH,
	ENABLE_ALL_TACH,
	SET_PWM_VALUE,
	GET_TACH_VALUE,
	DISABLE_PWM,
	DISABLE_ALL_PWM,
	DISABLE_TACH,
	DISABLE_ALL_TACH,
	END_OF_FUNC_TABLE	
}ePwmTachFunc;

typedef pwmtach_data_t pwmtach_ioctl_data;

#endif // __PWMTACH__
