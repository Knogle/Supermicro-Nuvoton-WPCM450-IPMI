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
 *****************************************************************
 *
 * IPMI_SOLCmds.c
 * Serial Over Lan interface structures.
 *
 *  Author: Ravinder Reddy <bakkar@ami.com>
 *          Basavaraj Astekar <basavaraja@ami.com>
 ****************************************************************/
#ifndef IPMI_SOL_H
#define IPMI_SOL_H

#include "Types.h"

#pragma pack( 1 )

/* SOLActivatingReq_T */
typedef struct
{
    INT8U   SessState;
    INT8U   PayldInst;
    INT8U   FmtVerMj;
    INT8U   FmtVerMn;

} PACKED  SOLActivatingReq_T;

/* SetSOLConfigReq_T */
typedef struct
{
    INT8U   ChannelNum;
    INT8U   ParamSel;

} PACKED  SetSOLConfigReq_T;

/* GetSOLConfigReq_T */
typedef struct
{
    INT8U   ChannelNum;
    INT8U   ParamSel;
    INT8U   SetSel;
    INT8U   BlkSEl;

} PACKED  GetSOLConfigReq_T;

/* GetSOLConfigRes_T */
typedef struct
{
    INT8U   CompletionCode;
    INT8U   ParamRev;

} PACKED  GetSOLConfigRes_T;

#pragma pack( )

#endif /* IPMI_SOL_H */
