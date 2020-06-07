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
 *****************************************************************
 ******************************************************************
 *
 * oem_nvr.h
 * NVRAM organization
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 *
 ******************************************************************/
#ifndef OEM_NVR_H
#define OEM_NVR_H
#include "PMConfig.h"

#define MAX_PMCONFIG_SIZE	sizeof (PMConfig_T)
#define MAX_SDR_SIZE		(SDR_DEVICE_SIZE * 1024)
#define MAX_SEL_SIZE		((SEL_DEVICE_SIZE * 1024) - 1)

#endif /* OEM_NVR_H */
