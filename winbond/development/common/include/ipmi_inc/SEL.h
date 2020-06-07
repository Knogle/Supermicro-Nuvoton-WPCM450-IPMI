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
 ****************************************************************/
/*****************************************************************
 *
 * Sel.h
 * Sel command handler
 *
 * Author: Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef SEL_H
#define SEL_H

#include "Types.h"

/*--------------System Event Record-------------*/
#define SYSTEM_EVT_RECORD                    0x02


/**
 * @var g_SenMonSELFlag
 * @brief SEL flag for Sensor Monitoring
**/
extern _FAR_ INT8U  g_SenMonSELFlag;


/**
 * @defgroup sic SEL Command handlers
 * @ingroup storage
 * IPMI System Event Log interface commands.
 * This set of commands provides read/write access to BMC's SEL.
 * @{
**/
extern int GetSELInfo           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSELAllocationInfo (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ReserveSEL           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ClearSEL             (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSELEntry          (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int AddSELEntry          (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int PartialAddSELEntry   (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int DeleteSELEntry       (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSELTime           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSELTime           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetAuxiliaryLogStatus(_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetAuxiliaryLogStatus(_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int LockedAddSELEntry    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSELTimeUTC_Offset  (_NEAR_ INT8U * pReq, INT8U ReqLen, _NEAR_ INT8U * pRes);
extern int SetSELTimeUTC_Offset   (_NEAR_ INT8U * pReq, INT8U ReqLen, _NEAR_ INT8U * pRes);

/** @} */

/**
 * @brief Get SEL timestamp.
 * @return The timestamp.
**/
extern INT32U GetSelTimeStamp (void);

/**
 * @brief Initialize SEL Device.
 * @return 0 if success, -1 if error
**/
extern int InitSEL (void);

#endif  /* SEL_H */
