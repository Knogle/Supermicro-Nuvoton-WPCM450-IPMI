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
 * OPMACommands.h
 * Header file for OPMACommands.c
 *
 *  Author: Shivaranjani Chelladurai <shivaranjanic@ami.com>
 *
 ******************************************************************/

#ifndef __OPMA__H__
#define __OPMA__H__

#include "MsgHndlr.h"


/* OPMA Commands Handler */
extern const CmdHndlrMap_T  g_OPMA_CmdHndlr1 [];
extern const CmdHndlrMap_T  g_OPMA_CmdHndlr2 [];




extern int SetSensorReadingOffset     (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSensorReadingOffset     (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSystemTypeIdentifier    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSystemTypeIdentifier    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetmCardCapabilities       (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ClearCMOS                  (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetLocalAccessLockOutState (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetLocalAccessLockOutState (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSupportedHostIDs        (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);

#endif //__OPMA_COMMANDS_H__
