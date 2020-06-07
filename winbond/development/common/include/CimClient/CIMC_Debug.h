/***********************************************************************************************
************************************************************************************************
**                                                                                            **  
**           Copyright (c) 2006-2007, AMERICAN MEGATRENDS Inc.	                              ** 
**                                                                                            **
**                               All Rights Reserved.                                         **
**                                                                                            ** 
**                      6145-F, Northbelt Parkway, Norcross,                                  **
**                                                                                            **
**                  Georgia - 30071, USA, Phone-(770)-246-8600.                               ** 
**                                                                                            **
************************************************************************************************
************************************************************************************************

 * FileName    : CIMC_Debug.h
 * Description : 
 * Author      : Yogeswaran. T
		 Hari .v
 
************************************************************************************************/

#ifndef _CIMC_DEBUG
#define _CIMC_DEBUG

//#ifdef DEBUG
#ifdef CIM_CLIENT_DEBUG
	#define CIMC_Debug printf
#else
	#define CIMC_Debug EmptyPrintf
	int EmptyPrintf(char *s,...);
#endif

#endif
