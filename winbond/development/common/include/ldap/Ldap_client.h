/*****************************************************************
******************************************************************
**																**
**	(C)Copyright 2005-2006, American Megatrends Inc.					**
**																**
**	All Rights Reserved.											**
**																**
**	5555, OakBrook Pkwy, Suite 200,  Norcross,						**
** 																**
**	Georgia-30093, USA. Phone-(770)-246-8600.						**
**									 							**
******************************************************************
******************************************************************
*																**
*Ldap_client.h														**
*																**
*																**
*																**
*																**
******************************************************************/

#ifndef __LDAP_CLIENT_H__
 #define __LDAP_CLIENT_H__

//includes 
#include<ldap.h>

#include"activedir_cfg.h"
#include<stdio.h>
#include<stdlib.h>

//ports for GC search 
#define	GC_PORT			3268
#define	GCS_PORT		3269

//TLS enable and disable macros
#define	LDAP_TLS_ENABLE			1
#define	LDAP_TLS_DISABLE		0

// ldap tiemouts , earlier it was 5 secs.
#define	LDAP_NETWORK_TIMEOUT_SEC		15
#define	LDAP_NETWORK_TIMEOUT_USEC		0

// maximum number of groups supported in SSAD
#define	MAX_GROUPS_SUPPORTED			5


#define CA_CERT_DIR			"/conf"  		
#define CA_CERT_FILE		"/conf/active_dir_ca_file.pem"

//prototpes
//Inteface API
unsigned int ActiveDirectoryAuthenticate(char* userName,
											char* password,
											char* userDomainName,
											unsigned int* prv);


//Internal APIs
unsigned int ADExtendedSchemaAuthentication(char* userName,
													char* password,
													char* userDomainName,
													unsigned int* prv,
													AD_Config_T* AdCfg);



unsigned int ADStandardSchemaAuthentication(char* userName,
													char* password,
													char* userDomainName,
													unsigned int* prv,
													AD_Config_T* AdCfg);

//Ldap Init API
LDAP* Ldap_init_handle(char* host,int port,char bsslEnable);


int ldap_bind_simple(LDAP* ld, char* binddn, char* passwd);



#endif //__LDAP_CLIENT_H__ 


