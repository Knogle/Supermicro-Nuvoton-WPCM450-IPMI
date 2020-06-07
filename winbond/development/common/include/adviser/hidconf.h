#ifndef __HID_CONF_H__
#define __HID_CONF_H__

#define HID_CONF					"/etc/hid.conf"
#define MAX_BUFF_LEN				32

typedef struct hid_cfg_tag
{
    char dev_access_mode [MAX_BUFF_LEN];
    char dev_type [MAX_BUFF_LEN];
    char mouse_mode[MAX_BUFF_LEN];
    
}hid_cfg_T;

/************* FUNCTION PROTOTYPES *************/
int GetHidCfgParam (hid_cfg_T* p);
int SetHidCfgParam (hid_cfg_T* p);
int CreateHidCfg (hid_cfg_T* p);

#endif //__HIDD_CONF_H__


