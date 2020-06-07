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
 * SDR.h
 * SDR functions.
 *
 *  Author: Rama Bisa <ramab@ami.com>
 *
 ******************************************************************/
#ifndef SDR_H
#define SDR_H

#include "Types.h"
#include "IPMI_SDR.h"
#include "SDRRecord.h"

#pragma pack( 1 )

/**
 * @struct E2ROMHdr_T
 * @brief EEROM Header.
**/
typedef struct
{
    INT8U Valid;
    INT8U Len;

} PACKED  E2ROMHdr_T;

#pragma pack( )

/**
 * @var g_SDRRAM
 * @brief SDR Repository.
**/
extern _FAR_ SDRRepository_T*   _FAR_   g_SDRRAM;

#ifdef CFG_PROJ_IPMC_SUPPORT_YES
/**
 * @var g_HotSwapSensorNum
 * @brief Hot Swap Sensor Number.
**/
extern _FAR_ INT8U  g_HotSwapSensorNum;

/**
 * @var g_IPMB0SensorNum
 * @brief IPMB-0 Sensor Number.
**/
extern _FAR_ INT8U  g_IPMB0SensorNum;

/**
 * @var g_DeviceLocatorRec
 * @brief Device Locator Records.
**/
extern _FAR_ INT16U  g_DeviceLocatorRec [MAX_FRU_DEVICES];
#endif /* #ifdef CFG_PROJ_IPMC_SUPPORT_YES */

/**
 * @defgroup src SDR Repository Command handlers
 * @ingroup storage
 * IPMI Sensor Data Records Repository interface commands.
 * These commands provide read/write access to BMC's SDR repository.
 * @{
**/
extern int GetSDRRepositoryInfo      (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSDRRepositoryAllocInfo (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ReserveSDRRepository      (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSDR                    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int AddSDR                    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int PartialAddSDR             (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int DeleteSDR                 (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ClearSDRRepository        (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSDRRepositoryTime      (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int EnterSDRUpdateMode        (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ExitSDRUpdateMode         (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int RunInitializationAgent    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

/**
 * @brief Get the next SDR record ID.
 * @param RecID - Current SDR record ID.
 * @return the next SDR record ID.
**/
extern INT16U   SDR_GetNextSDRId     (INT16U RecID);

/**
 * @brief Reads SDR Repository contents.
 * @param pSDRRec - Current SDR Record header.
 * @return the next SDR Record header.
**/
extern _FAR_ SDRRecHdr_T*   ReadSDRRepository (_FAR_ SDRRecHdr_T* pSDRRec);

/**
 * @brief Write into SDR Repository.
 * @param pSDRRec - Record to be written.
 * @param Offset  - Write offset.
 * @param Size    - Size of write.
 * @return the SDR Record header.
**/
extern void WriteSDRRepository (_FAR_ SDRRecHdr_T* pSDRRec, INT8U Offset, INT8U Size);

/**
 * @brief Get the SDR Record.
 * @param RecID - SDR Record ID.
 * @return the SDR Record.
**/
extern _FAR_ SDRRecHdr_T* GetSDRRec  (INT16U RecID);

/**
 * @brief Initialize SDR Repository.
 * @return 0 if success, -1 if error
**/
extern  int  InitSDR (void);

#ifdef CFG_PROJ_IPMC_SUPPORT_YES
#if (SUPPORT_CIPMC == 1)
#define ATCA 1
#endif  /* #if (SUPPORT_CIPMC == 1) */
#else   
#ifdef CFG_PROJ_SHMC_SUPPORT_YES
#define ATCA 1
#endif  /* #ifdef CFG_PROJ_SHMC_SUPPORT_YES */
#endif  /* #ifdef CFG_PROJ_IPMC_SUPPORT_YES */

#if (ATCA == 1)
/**
 * @brief  Enables/Disables access to Dynamic SDR Repository.
 * @param  EnbDisb - Enable or Disable the access.
 * @return void
**/
extern void AccessDynamicSDRRepository (BOOL EnbDisb);

/**
 * @brief  Invalidates the Dynamic SDR Repository's Reservation ID (if any).
 * @param  void
 * @return  void
**/
extern void InvalidateReservationID (void);

/**
 * @brief Reads Dynamic SDR Repository contents.
 * @param pSDRRec - Current SDR Record header.
 * @return the next SDR Record header.
**/
extern _FAR_ SDRRecHdr_T*   ReadDynamicSDRRepository (_FAR_ SDRRecHdr_T* pSDRRec);
#endif  /* #if (ATCA == 1) */

#endif /* SDR_H */
