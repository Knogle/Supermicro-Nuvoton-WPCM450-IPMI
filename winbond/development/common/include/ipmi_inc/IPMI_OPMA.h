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

#ifndef __OPMA_COMMANDS_H__
#define __OPMA_COMMANDS_H__

#include "Types.h"

/*OPMA specific definitions */
#define OPMA_VERSION 0x0120

#define M1_CLASS_LAN_SUPP 0x01
#define M2_CLASS_LAN_SUPP 0x02
#define M3_CLASS_LAN_SUPP 0x03

#define OUT_OF_BAND_SUPP_ENABLED  0x01
#define OUT_OF_BAND_SUPP_DISABLED 0x02

#define TERMINAL_MODE_SUPPORT_ENABLED  0x01
#define TERMINAL_MODE_SUPPORT_DISABLED 0x02

#define SENSOR_SCANNING_ACTIVE   0x01
#define SENSOR_SCANNING_INACTIVE 0x02

#define VIRTUAL_COMM1_SUPPORTED      0x01
#define VIRTUAL_COMM1_NOT_SUPPORTED  0x02

#define VIRTUAL_FLOPPY_SUPPORTED      0x01
#define VIRTUAL_FLOPPY_NOT_SUPPORTED  0x02

#define CC_SUPP_FP_LOCK_NOT_SUPP 	0xC1

#define MAX_ID_PAIRS 7


#define  CMD_OPMA_SET_SENSOR_RD_OFFSET      0x04
#define  CMD_OPMA_GET_SENSOR_RD_OFFSET      0x05
#define  CMD_OPMA_SET_SYS_TYPE_ID           0xA0
#define  CMD_OPMA_GET_SYS_TYPE_ID           0xA1
#define  CMD_OPMA_GET_MCARD_CAP             0xA2
#define  CMD_OPMA_CLR_CMOS                  0xA3
#define  CMD_OPMA_SET_LOCAL_LOCKOUT         0xA4
#define  CMD_OPMA_GET_LOCAL_LOCKOUT         0xA5
#define  CMD_OPMA_GET_SUPPORTED_HOST_IDS    0xA6


#pragma pack(1)


/*
* SensorOffsetInfo_T Structure
*/
typedef struct {

    INT8U SensorLUN;
    INT8U SensorNo;
    INT8S Offset;
    INT8U valid;

} PACKED SensorOffsetInfo_T;


/*
* OPMA_IDPair_T Structure
*/
typedef struct
{
    INT16U OemId;
    INT16U ImplementationId;

} PACKED OPMA_IDPair_T;


/*
 * OPMA Config Structure
 * The OPMA specific Data are stored in this Structure
 */
typedef struct
{
    SensorOffsetInfo_T SensorOffsetInfo [256];
    INT8U         SupportedSysCount;
    OPMA_IDPair_T OPMA_IdPairs [ MAX_ID_PAIRS ];
    OPMA_IDPair_T SystemIdentifier ;
    INT8U SysLocalAccessLockout;
    INT16U OPMASpecComplaince;

} PACKED OPMA_Config_T;


/* Structures for OPMA comamnds request and response */


/*
* SystemTypeIdentifier Structure
*/
typedef struct
{
    INT16U OemId;
    INT16U ImplemenationId;
    INT16U OPMASpecComplaince;

} PACKED SystemTypeIdentifier_T;


/*
*SetSensorReadingOffsetReq_T
*/
typedef struct
 {
    INT8U SensorLUN;
    INT8U SensorNo;
    INT8S Offset;

 } PACKED SetSensorReadingOffsetReq_T;


/*
*SetSensorReadingOffsetRes_T
*/
typedef struct
{
    INT8U CompletionCode;

} PACKED SetSensorReadingOffsetRes_T;


/*
* GetSensorReadingOffsetReq_T
*/
typedef struct
{
    INT8U SensorLUN;
    INT8U SensorNo;

} PACKED GetSensorReadingOffsetReq_T;


/*
 * GetSensorReadingOffsetRes_T
 */
typedef struct
{
    INT8U CompletionCode;
    INT8S Offset;

} PACKED GetSensorReadingOffsetRes_T;


/*
 * SetSystemTypeIdentifierReq_T
 */
typedef SystemTypeIdentifier_T SetSystemTypeIdentifierReq_T;


/*
 * SetSystemTypeIdentifierRes_T
 */
typedef struct
{
    INT8U CompletionCode;

} PACKED SetSystemTypeIdentifierRes_T;


/*
 * GetSystemTypeIdentifierRes_T
 */
typedef struct
{
    INT8U CompletionCode;
    INT16U OemId;
    INT16U ImplemenationId;
    INT16U OPMASpecComplaince;

} PACKED GetSystemTypeIdentifierRes_T;


/*
 * GetmCardCapabilitiesRes_T
 */
typedef struct
{
    INT8U  CompletionCode;
    INT16U SubsysSpecComp;
    INT8U  LanSupportType;
    INT8U  LanSupportStatus;
    INT8U  TerSupportStatus;
    INT8U  IPMIInterfaceSupport;
    INT8U  SensorScanStatus;
    INT8U  VirtualPort1;
    INT8U  VirtualFloppyInterface;

} PACKED GetmCardCapabilitiesRes_T;


/*
 * SetSystemTypeIdentifierRes_T
 */
typedef struct
{
    INT8U CompletionCode;
} PACKED ClearCMOSRes_T;


/*
 * SetLocalAccessLockOutStateReq_T
 */
typedef struct
{
    INT8U  LockState;
} PACKED SetLocalAccessLockOutStateReq_T;


/*
 * SetLocalAccessLockOutStateRes_T
 */
typedef struct
{
    INT8U CompletionCode;
} PACKED SetLocalAccessLockOutStateRes_T;


/*
 * GetLocalAccessLockOutStateRes_T
 */
typedef struct
{
    INT8U CompletionCode;
    INT8U  LockState;
} PACKED GetLocalAccessLockOutStateRes_T;


/*
 * GetSupportedHostIDsRes_T
 */
typedef struct
{
    INT8U CompletionCode;
    INT8U SupportedSysCount;
    OPMA_IDPair_T IDPairs [MAX_ID_PAIRS];
} PACKED GetSupportedHostIDsRes_T;


#pragma pack()


#endif //__OPMA_COMMANDS_H__
