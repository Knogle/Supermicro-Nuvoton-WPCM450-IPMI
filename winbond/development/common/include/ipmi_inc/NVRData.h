/*****************************************************************
 *****************************************************************
 ***                                                            **
 ***    (C)Copyright 2005-2006, American Megatrends Inc.        **
 ***                                                            **
 ***            All Rights Reserved.                            **
 ***                                                            **
 ***        6145-F, Northbelt Parkway, Norcross,                **
 ***                                                            **
 ***        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 ***                                                            **
 *****************************************************************
 ******************************************************************
 * 
 * nvrdata.h
 * NVRAM Data
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 *
 ******************************************************************/
#ifndef NVR_DATA_H
#define NVR_DATA_H

//#include "SDRRecord.h"
//#include "SELRecord.h"
#include "OEM_NVR.h"
#include "PMConfig.h"
//#include "hwconfig.h"

/**
 * NVRAM Handles
**/
#define MAX_PMC_SIZE	sizeof(PMConfig_T)

#define NVRH_PMCONFIG	0
#define NVRH_SDR		MAX_PMC_SIZE
#define NVRH_SEL		MAX_PMC_SIZE + MAX_SDR_SIZE

#define NVRRAM_SIZE     MAX_PMC_SIZE + MAX_SDR_SIZE + MAX_SEL_SIZE

/* Soft Processor Image size */
#define MAX_SP_IMAGE_SIZE		0x8A0

#pragma pack( 1 )

/*** Type Definitions ***/
/* NVRHandle_T */
typedef INT16U NVRHandle_T;

/* NVRHdr_T */
typedef struct
{
	INT8U	Signature [4];
	INT16U	Size;

} PACKED  NVRHdr_T;

/* SPImage_T */
typedef struct
{
	INT8U	Signature [4];
	INT8U	Image [MAX_SP_IMAGE_SIZE];

} PACKED  SPImage_T;

#pragma pack( )

/*** Extern Definitions ***/
extern _FAR_ const PMConfig_T		g_pmconfig;
//extern _FAR_ const HWConfig_T		g_HWConfig;
extern _FAR_ const SPImage_T		g_SPImage;
//extern _FAR_ const PMConfig_T		g_pmconfigClone;

#endif	/* NVR_DATA_H */


