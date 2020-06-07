#ifndef _SERVERINFO_H
#define _SERVERINFO_H

#define SERVERINFO_CFG_FILE		"/etc/serverinfo"

#define SERVERNAME_MAX_LEN	64
#define SERVEROS_MAX_LEN	64
#define SERVERDESC_MAX_LEN	512

/* Above file MUST have the information in the following way.
	SERVER_NAME=<server name string>
	OPERATING_SYSTEM=<operating system string>
	SERVER_DESC=<server description>
*/

typedef struct {
	char ServerName[64];
	char OperatingSystem[64];
	char ServerDesc[512];
} SERVERINFO_STRUCT;

int GetManagedServerInfo(SERVERINFO_STRUCT *srvrInfo);
int SetManagedServerInfo(SERVERINFO_STRUCT *srvrInfo);

#endif 
	
	
