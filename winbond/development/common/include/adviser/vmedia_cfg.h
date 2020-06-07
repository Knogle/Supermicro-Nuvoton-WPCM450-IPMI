#ifndef __VMEDIA_CFG_H__
#define __VMEDIA_CFG_H__


#define VMEDIA_CFG_FILE				"/conf/vmedia.conf"  /** Location of the configuration file */
#define VMEDIA_STUNNEL_CFG_FILE		"/conf/stunnel_vmedia.conf"  /** Location of the configuration file */

#define VMEDIA_SECTION_NAME			"vmedia"

#define STR_VMEDIA_MAX_SESSIONS		"max_sessions"   /** Key string that represents max_sessions */
#define STR_VMEDIA_ACTIVE_SESSIONS	"active_sessions"   /** Key string that represents active_sessions */
#define STR_VMEDIA_SECURE_CHANNEL	"secure_channel"    /** Key string that represents secure channel */
#define STR_VMEDIA_PORT				"port"              /** Key string that represents non-secure port */
#define STR_VMEDIA_SECURE_PORT		"secure_port"       /** Key string that represents secure port */
#define STR_VMEDIA_MODE_CDROM		"cdrom_mode"   /** Attach mode for CDROM */
#define STR_VMEDIA_MODE_FLOPPY		"floppy_mode"   /** Attach mode for floppy */
#define STR_FLOPPY_EMULATION		"floppy_emulation"    /** Key string that represents secure channel */
#define STR_ENABLE_BOOT_ONCE		"boot_once"    /** Key string that represents secure hid port */

#define	MODE_VMEDIA_ATTACH		(0)
#define MODE_VMEDIA_AUTO_ATTACH	(1)
#define MODE_VMEDIA_DETACH		(2)


typedef struct {
    unsigned int max_sessions;              /** Max number of sessions allowed at a time */
    unsigned int active_sessions;              /** Number of sessions active at a time */
    unsigned int secure_channel;   /** Says whether to open secure channel or non-secure channel */
	unsigned int vmedia_port;		/** Port number on which vmedia will be listening for normal connections*/
	unsigned int vmedia_secure_port;	/** Port number on which vmedia will be listening for SSL connections*/
	unsigned int attach_cd;		/** Attach mode for CD */
	unsigned int attach_fd;		/** Attach mode for FD */
	unsigned int floppy_emulation;		/** Says whether to emulate floppy or not */
	unsigned int enable_boot_once;		/** Enable boot once or not */
} VMediaCfg_T;


int GetVMediaCfg(VMediaCfg_T* pVMeiaCfg);
int SetVMediaCfg(VMediaCfg_T* pVMediaCfg);

#endif



