#ifndef __PORTCFG_H__
#define __PORTCFG_H__

#include "coreTypes.h"


#define SERVICE_NAME_TELNET				"telnet"
#define TELNET_DEFAULT_PORTNUM			23
#define TELNET_DEFAULT_TIMEOUT			300
#define TELNET_DEFAULT_MAXSESSIONS		2
#define TELNET_DEFAULT_ENABLED			0


#define SERVICE_NAME_SSH 				"ssh"
#define SSH_DEFAULT_PORTNUM				22
#define SSH_DEFAULT_TIMEOUT				300
#define SSH_DEFAULT_MAXSESSIONS			2
#define SSH_DEFAULT_ENABLED				1


#define SERVICE_NAME_WEB				"web"
#define WEB_DEFAULT_PORTNUM_HTTP		80
#define WEB_DEFAULT_PORTNUM_HTTPS		443
#define WEB_DEFAULT_TIMEOUT				300 //5 minutes
#define WEB_DEFAULT_MAXSESSIONS			4
#define WEB_DEFAULT_ENABLED				1


#define SERVICE_NAME_VKVM				"vkvm"
#define	VKVM_DEFAULT_PORTNUM_VIDEO		7578
#define	VKVM_DEFAULT_PORTNUM_HID		5678
#define VKVM_DEFAULT_ENABLED			1
#define VKVM_DEFAULT_MAXSESSIONS		2	
#define VKVM_DEFAULT_ECRYPTION			1
#define VKVM_DEFAULT_LOCALVIDEO_DISABLE	0



#define SERVICE_NAME_VMEDIA				"vmedia"
#define VMEDIA_DEFAULT_PORTNUM_CD		5120
#define VMEDIA_DEFAULT_PORTNUM_FD		5123
#define VMEDIA_DEFAULT_PORTNUM_SSL_CD	6111
#define VMEDIA_DEFAULT_ENABLED			1
#define VMEDIA_DEFAULT_FLOPPY_EMULATION	1


#define KEY_COMMON_PORTCFG_ENABLED			"enabled"
#define KEY_COMMON_PORTCFG_MAXSESSIONS		"maxsessions"
#define KEY_COMMON_PORTCFG_ACTIVESESSIONS	"activesessions"
#define KEY_COMMON_PORTCFG_TIMEOUT			"timeout"
#define KEY_COMMON_PORTCFG_PORTNUM			"portnum"

#define KEY_WEB_PORTCFG_PORTNUM_HTTP				"portnum_http"
#define KEY_WEB_PORTCFG_PORTNUM_HTTPS				"portnum_https"

#define PORT_CFG_FILE_BASE "/conf/portcfg_"
#define PORT_CFG_FILE_SERVICE(x) PORT_CFG_FILE_BASE x

#define	PORTCFG_LOCK		"/var/portcfg_lock"

#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif


//we have to have separate structures since all of them are separately configurable
typedef struct portcfg_telnet_t
{
	uint8			Enabled;
	uint8	 		MaxSessions;
	uint8 	 		ActiveSessions;
	uint32			SessionTimeout;
	uint16			PortNum;
	uint8			Telnet7FBackspace;
} PACKED PORT_CFG_TELNET;

typedef struct portcfg_ssh_t
{
	uint8		 Enabled;
	uint8		 MaxSessions;
	uint8	 	 ActiveSessions;
	uint32		 SessionTimeout;
	uint16	 	 PortNum;
} PACKED PORT_CFG_SSH;

typedef struct portcfg_web_t
{
	uint8	 Enabled;
	uint8	 MaxSessions;
	uint8 	 ActiveSessions;
	uint32	 SessionTimeout;
	uint16	 HttpPortNum;
	uint16	 HttpsPortNum;

} PACKED PORT_CFG_WEB;

typedef struct portcfg_redir_t
{
	uint8	 Enabled;
	uint8	 MaxSessions;
	uint8 	 ActiveSessions;
    uint16	 KMPortNum;
	uint8	 CREncryption;
	uint16	 VideoPortNum;
	uint8	 LocalVideoEnabled;
	
} PACKED PORT_CFG_KVM;


typedef struct portcfg_vmedia_t
{
	uint8	 Enabled;
	uint8	 MaxSessions;
	uint8 	 ActiveSessions;
	uint32	 SessionTimeout;
	uint16	 PortNum;
	uint16 	 SSLPortNum;
	//there could be unused fields here baggage from drac. so we will have to translate probably for racadm
	uint8 	 VMFloppyEmulation;
} PACKED PORT_CFG_VMEDIA;

#ifdef __GNUC__
#else
#define PACKED
#pragma pack(  )
#endif


/******************************************function prototypes*********************************************/
int get_port_cfg_telnet(PORT_CFG_TELNET* portcfg);
int set_port_cfg_telnet(PORT_CFG_TELNET* portcfg);
int get_port_cfg_ssh(PORT_CFG_SSH* portcfg);
int set_port_cfg_ssh(PORT_CFG_SSH* portcfg);
int get_port_cfg_web(PORT_CFG_WEB* portcfg);
int set_port_cfg_web(PORT_CFG_WEB* portcfg);


#endif //__PORTCFG_H__
