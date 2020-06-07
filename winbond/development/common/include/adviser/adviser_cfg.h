#ifndef __ADVISER_CFG_H__
#define __ADVISER_CFG_H__


#define ADVISER_CFG_FILE      "/conf/adviserd.conf"  /** Location of the configuration file */
#define STUNNEL_CFG_FILE      "/conf/stunnel_kvm.conf"  /** Location of the configuration file */

#define ADVISER_SECTION_NAME	"adviserd"

#define KVM_ENABLED             "enabled"       /** Key string that represents enabled */
#define MAX_SESSIONS            "max_sessions"   /** Key string that represents max_sessions */
#define ACTIVE_SESSIONS         "active_sessions"   /** Key string that represents active_sessions */
#define STR_PORT                "port"              /** Key string that represents non-secure port */
#define STR_SECURE_PORT         "secure_port"       /** Key string that represents secure port */
#define STR_HID_PORT      		"hid_port"    /** Key string that represents secure hid port */
#define STR_SECURE_CHANNEL      "secure_channel"    /** Key string that represents secure channel */
#define STR_MOUSE_MODE      	"mouse_mode"    /** Key string that represents mouse mode */
#define STR_DISABLE_LOCAL      	"disable_local"    /** Key string that represents local console */

#ifndef CFG_PROJ_VM_CFG_SUPPORT
#define STR_CDSERVER_PORT      	"cdserver_port"    /** Key string that represents mouse mode */
#define STR_FDSERVER_PORT      	"fdserver_port"    /** Key string that represents local console */
#endif

typedef struct {
    unsigned int enabled;              /** Flag that represents whether KVM Redirection is enabled or not*/
    unsigned int max_sessions;              /** Max number of sessions allowed at a time */
    unsigned int active_sessions;              /** Number of sessions active at a time */
    unsigned int port;              /** Port number on which Adviser will be listening */
    unsigned int secure_port;       /** Port number on which stunnel will be listening */
	unsigned int hid_port;			/** Port number on which HID will be listening */
    unsigned int secure_channel;   /** Says whether to open secure channel or non-secure channel */
	unsigned int mouse_mode;   /** Says whether to use Absolute mouse or relative mouse */
	unsigned int disable_local;   /** Says whether to disable local console or not */
#ifndef CFG_PROJ_VM_CFG_SUPPORT
	unsigned int cdserver_port;
	unsigned int fdserver_port;
#endif
} AdviserCfg_T;


int GetAdviserCfg(AdviserCfg_T* pAdviserCfg);
int SetAdviserCfg(AdviserCfg_T* pAdviserCfg);

#endif


