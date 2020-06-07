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
 *
 * ipmi_kcs.h
 * KCS specific IPMI structures.
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 ******************************************************************/
#ifndef IPMI_KCS_H
#define IPMI_KCS_H
#include "Types.h"
#include "miscifc.h"

#pragma pack( 1 )

/* KCS Request Structure */
typedef struct
{
	INT8U	NetFnLUN;
	INT8U	Cmd;

} PACKED  KCSReq_T;
#pragma pack( )


/**
 * @def SET_SMS_ATN
 * @brief Macro to set the SMS Attention bit.
**/
#define SET_SMS_ATN(KCSIFC_NUM) PDK_SetSMSAttn(KCSIFC_NUM)

/**
 * @def CLEAR_SMS_ATN
 * @brief Macro to reset the SMS attention bit.
**/
#define CLEAR_SMS_ATN(KCSIFC_NUM)	PDK_ClearSMSAttn(KCSIFC_NUM)


#endif	/* IPMI_KCS_H */

