/*****************************************************************
******************************************************************
**                                                            							**
**    (C)Copyright 2005-2006, American Megatrends Inc.        				**
**                                                            							**
**            All Rights Reserved.                            						**
**                                                            							**
**        5555, OakBrook Pkwy, Suite 200,  Norcross,                			**
**                                                            							**
**        Georgia - 30093, USA. Phone-(770)-246-8600.         				**
**                                                            							**
******************************************************************
******************************************************************
*																**
* Ldap_utils.h														**
*																**			
*       											 				**	
*																**	
*																**
*****************************************************************/


#ifndef __LDAP_UTIL_H__
 #define __LDAP_UTIL_H__

#include "activedir_cfg.h"



#define TYPE_DC  1
#define TYPE_GC  2

 

int  GetDomainFromDN(char * dn, char * domain);
int  GetBaseDNFromDomain(char * dn, char * domain);
uint8* GetDCFilter(AD_Config_T * ADCfg,int index);


#endif //__LDAP_UTIL_H__
