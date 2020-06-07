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
 * SysIfc.h
 * SYSTEM Interface.
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 ******************************************************************/
#ifndef SYS_IFC_H
#define SYS_IFC_H
#include "Types.h"
#include "Support.h"
#include "IPMI_KCS.h"

/*--------------------------------------------------------------------------*
 * SYSTEM INTERFACE - DEFINED BASED ON INTERFACE CHOOSEN IN Support.h		*
 *--------------------------------------------------------------------------*/

/*--------------- KCS INTERFACE	-----------------------*/
#if (SUPPORT_KCS1_IFC == 1) || (SUPPORT_KCS2_IFC == 1) || (SUPPORT_KCS3_IFC == 1)
#define SUPPORT_KCS_IFC		1
#else
#define SUPPORT_KCS_IFC		0
#endif

/*--------------- SYSTEM INTERFACE -------------------------------------------*/
#if (SUPPORT_KCS_IFC == 1)
#define SUPPORT_SYS_IFC		1
#else
#define SUPPORT_SYS_IFC		0
#endif

#if (SUPPORT_VLAN_IFC == 1)

#if (SUPPORT_LAN_IFC == 0)
#error	"VLAN Ifc is enabled and so LAN Ifc must be enabled"
#endif

#endif /* SUPPORT_VLAN_IFC == 1 */

/*--------------------- System Interface support ---------------------------*/
#if SUPPORT_SYS_IFC == 1

#if (SYS_IFC_IS_KCS1 == 1) && (SUPPORT_KCS1_IFC != 1)
#error	"System Ifc is defined as KCS1_IFC but KCS1_IFC not defined"
#endif

#if (SYS_IFC_IS_KCS2 == 1) && (SUPPORT_KCS2_IFC != 1)
#error	"System Ifc is defined as KCS2_IFC but KCS2_IFC not defined"
#endif

#if (SYS_IFC_IS_KCS3 == 1) && (SUPPORT_KCS3_IFC != 1)
#error	"System Ifc is defined as KCS3_IFC but KCS3_IFC not defined"
#endif

/*-------------- Choose the System Interface Queue -------------------------*/
#if SYS_IFC_IS_KCS1	== 1
	#define hSysIfc_Q	hKCS1Res_Q
#elif SYS_IFC_IS_KCS2 == 1
	#define hSysIfc_Q	hKCS2Res_Q
#elif SYS_IFC_IS_KCS3 == 1
	#define hSysIfc_Q	hKCS3Res_Q
#elif SYS_IFC_IS_BT == 1
	#define hSysIfc_Q	hBTRes_Q
#else
	#error "SYSTEM INTERFACE NOT DEFINED"
#endif

#endif	/*SUPPORT_SYS_IFC == 1*/


#endif	/* SYS_IFC_H */

/*----------------------------------------------------------------------------------*
 * If System interface is not defined remove the system interface commands.			*
 *----------------------------------------------------------------------------------*/
#if SUPPORT_SYS_IFC != 1

#undef	SET_BMC_GBL_ENABLES
#undef	GET_BMC_GBL_ENABLES
#undef	CLR_MSG_FLAGS
#undef	GET_MSG_FLAGS
#undef	ENBL_MSG_CH_RCV
#undef	GET_MSG
#undef	READ_EVT_MSG_BUFFER

#define SET_BMC_GBL_ENABLES		UNIMPLEMENTED
#define GET_BMC_GBL_ENABLES		UNIMPLEMENTED
#define CLR_MSG_FLAGS			UNIMPLEMENTED
#define GET_MSG_FLAGS			UNIMPLEMENTED
#define ENBL_MSG_CH_RCV			UNIMPLEMENTED
#define GET_MSG					UNIMPLEMENTED
#define READ_EVT_MSG_BUFFER		UNIMPLEMENTED

#endif

