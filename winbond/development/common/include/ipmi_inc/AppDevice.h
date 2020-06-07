/****************************************************************
 ****************************************************************
 **                                                            **
 **    (C)Copyright 2005-2006, American Megatrends Inc.        **
 **                                                            **
 **            All Rights Reserved.                            **
 **                                                            **
 **        6145-F, Northbelt Parkway, Norcross,                **
 **                                                            **
 **        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 **                                                            **
 ****************************************************************
 ****************************************************************
 *
 * AppDevice.h
 * AppDevice Commands Handler
 *
 * Author: Govind Kothandapani <govindk@ami.com>
 *       : Rama Bisa <ramab@ami.com>
 *       : Basavaraj Astekar <basavaraja@ami.com>
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef APPDEVICE_H
#define APPDEVICE_H

#include "Types.h"
#include "OSPort.h"

#define EVT_MSG_BUF_SIZE    1  /**<Event Message maximum Buffer size */
#define USER_ID             (((INT32U)'U'<< 24) | ((INT32U)'S'<< 16) | ('E'<<8) | 'R')
#define IPMI_ROOT_USER      ( 2 )
#define TWENTY_BYTE_PWD  0x80

/*** Extern Declaration ***/
/**
 * @var _FAR_ INT8U TmrRunning
 * @brief Flag indicates whether IPMI Watchdog timer running or not
 * @warning Should not be accessed from task other than Message Handler
 **/
extern _FAR_    INT8U       g_TmrRunning;

/*** Function Prototypes ***/
/**
 * @defgroup apcf2 BMC Watchdog Timer Commands
 * @ingroup apcf
 * IPMI BMC Watchdog Timer Command Handlers. Invoked by the message handler
 * @{
 **/
extern int      ResetWDT            (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SetWDT              (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetWDT              (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

/**
 * @defgroup apcf3 BMC Device and Messaging Commands
 * @ingroup apcf
 * IPMI BMC Device and Messaging Command Handlers. Invoked by the message handler
 * @{
 **/
extern int      SetBMCGlobalEnables (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetBMCGlobalEnables (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      ClrMsgFlags         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetMsgFlags         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      EnblMsgChannelRcv   (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetMessage          (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SendMessage         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      ReadEvtMsgBuffer    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetBTIfcCap         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetSystemGUID       (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetChAuthCap        (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetSessionChallenge (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      ActivateSession     (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SetSessionPrivLevel (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      CloseSession        (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetSessionInfo      (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetAuthCode         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SetChAccess         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetChAccess         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetChInfo           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SetUserAccess       (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetUserAccess       (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SetUserName         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      GetUserName         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      SetUserPassword     (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int      MasterWriteRead     (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int		SetSystemInfoParam  (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int 		GetSystemInfoParam  (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

#endif  /* APPDEVICE_H */

