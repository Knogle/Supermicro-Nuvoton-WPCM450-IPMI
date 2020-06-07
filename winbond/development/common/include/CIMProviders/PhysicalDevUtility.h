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
**************************************************************************************
 * Source Name : PhysicalDevUtility.h
 * Author      : Aruna. V   (arunav@amiindia.co.in)
 * Date        : 18/10/2008
****************************************************************************************/

#ifndef __PHY_DEV_UTIL_H__
#define __PHY_DEV_UTIL_H__

#include "iniparser.h"
#include "Common.h"
#include "IPMI_Config.h"
#include "IPMI_Includes.h"

int check_presence_sensor(IPMI20_SESSION_T * pSession, 
			void * pHandle, int fruEntityIns, 
			int fruEntityID);

/*!--------------------------------------------------------------
 * Structure Name : PhysicalDevInfo_T
 * Description    : This structure is used for maintaining the
		    details of all the present physical devices.
 * Copyright (c) 2004-2005, AMERICAN MEGATRENDS INDIA (P) LTD.
   All rights reserved.
 *----------------------------------------------------------------
 */
typedef struct PhysicalDevInfo {
	char Manufacturer[CPL_MAX_STR_LEN];
	char PartNumber[CPL_MAX_STR_LEN];
	char SerialNumber[CPL_MAX_STR_LEN];
	char Model[CPL_MAX_STR_LEN];
	char UUID[CPL_MAX_STR_LEN];
} PhysicalDevInfo_T;

/** Gets the FRU details of all the physical elements **/
CPL_Status_T CPL_GetPhysicalDevInfo(int nFruSlaveAddress,
			PhysicalDevInfo_T * pPhysicalDevInfo);

int GetChassisFRUValues(char * pDataTag, 
				PhysicalDevInfo_T * pPhysicalDevInfo,
				CPL_Status_T (*GetPhyDevInfo)(int, PhysicalDevInfo_T *));

int GetDynamicFRUValues(void * pHandle, 
			char * pDataTag, int FRUSlaveAddr,  
			char * pManufacturer, char * pSerialNum, 
			char * pPartNum, 
			CPL_Status_T (*GetPhyDevInfo)(int, PhysicalDevInfo_T *));

#endif
