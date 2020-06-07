/***********************************************************************************************
************************************************************************************************
**                                                                                            **
**           Copyright (c) 2004-2005, AMERICAN MEGATRENDS Inc.                                **
**                                                                                            **
**                               All Rights Reserved.                                         **
**                                                                                            **
**                      6145-F, Northbelt Parkway, Norcross,                                  **
**                                                                                            **
**                  Georgia - 30071, USA, Phone-(770)-246-8600.                               **
**                                                                                            **
************************************************************************************************
************************************************************************************************

 * FileName    : Porting_ComputerSystem.h 
 * Description : Header file for Porting_ComputerSystem.c
 * Author      : Vinodhini.J (vinodhinij@amiindia.co.in)
 *
************************************************************************************************/
#include "Porting_Common.h"
#include "propertyListHandler.h"

#define CPL_SNMPCONFFILE CFG_PROJ_PERM_CONFIG_PATH "etc/snmpd.conf" 
#define CPL_SNMPTEMPFILE CFG_PROJ_TEMP_CONFIG_PATH"snmpdT.conf"

#define IBMC_CONFIG_TEMP       CFG_PROJ_TEMP_CONFIG_PATH"/etc/Providers/iBMCInfo_temp"
#define IBMC_CONFIG         CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/iBMCInfo"
#define INIFILE_IBMC         CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/IBM_iBMC.ini"

#define SNMPTRAPCOMMENT "#AMI-TrapsEnabled"
#define ENABLEDVERSIONS "#AMI-EnabledSNMPVersions"
#define COMMENT "#@!"

#define NEWENTRY "NewTextEntry"
CPL_Status_T CPL_ModifyIBMCInfo(char * strValue);

CPL_Status_T CPL_ModifySNMPConfigurationFile(char * strLookFor, 
	char * strModifiedValue, char isLockNeeded);

CPL_Status_T CPL_GetINIValues(char * ElementName, char * Name, char * Contact, char * Location, int IsLocation);

CPL_Status_T CPL_FillValues_porting(char *key, char *value,
                                    char *instancename,
                                    PropertyList **headNode);
