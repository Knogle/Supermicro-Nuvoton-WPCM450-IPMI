#ifndef __MISC_IFC_H__
#define __MISC_IFC_H__

/* IOCTL Commands and structure */
typedef enum {
	ENABLE_CHASSIS_INTRUSION,
	WAIT_FOR_CHASSIS_INTRUSION,
	DISABLE_CHASSIS_INTRUSION
}eMiscFunc;

typedef struct miscctrlcmd 
{
	unsigned char data;
} MISCCTRLCMD;

#define MISCCTRL_CTL_FILE	"/dev/miscctrl"

typedef MISCCTRLCMD miscctrl_ioctl_data;

int enable_chassis_intrusion(void);
int disable_chassis_intrusion(void);
int wait_for_chassis_intrusion(void);

#endif
