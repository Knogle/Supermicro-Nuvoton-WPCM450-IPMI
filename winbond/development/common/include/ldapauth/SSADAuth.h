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
*SSADAuth.h														**
*																**
*																**
*																**
*																**
******************************************************************/

#ifndef __SSAD_AUTH__
 #define __SSAD_AUTH__

//header files
#include "Ldap_client.h"
#include "Ldap_errcodes.h"

//defines for group status 
#define GROUP_NOT_CONFIGURED 0
#define GROUP_SID_FOUND      1
#define GROOUP_SID_NOT_FOUND  2 

// define search types
#define DC_SEARCH 0
#define GC_SEARCH 1

//Interface API
unsigned int ADStandardSchemaAuthentication(	char* userName,
														char* password,
														char* userDomainName,
														unsigned int* prv,
														AD_Config_T* Adcfg);

//Internal API
unsigned int SSADAuthenticate(	unsigned char* userName, unsigned char* password,
									unsigned char* userDomainName, unsigned char* DC,
									unsigned char use_gc, unsigned int* priv, 
									SSAD_Config_T* SSADCfg, unsigned char* needgcsearch,
									unsigned char* grpflag);

//checks whether grps configured properly
unsigned int CheckGrpStatus(SSAD_Config_T* SSADCfg, uint8* grpflag );

#endif //__SSAD_AUTH__

