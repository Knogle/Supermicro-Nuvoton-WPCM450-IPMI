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
 * SELRecord.h
 * SEL record structures.
 *
 *  Author: Rama Rao Bisa<ramab@ami.com>
 *
 ******************************************************************/
#ifndef SEL_RECORD_H
#define SEL_RECORD_H

#include "IPMI_SEL.h"
#include "OEM_NVR.h"

/*** External Definitions ***/
#define SEL_NUM_FREE_BYTES  SEL_MAX_SIZE
#define VALID_RECORD        0x5A

/**
 * @brief SEL Repository organisation
**/
#define SEL_MAX_SEL_RECORDS  512
/*#define SEL_MAX_SEL_RECORDS ((MAX_SEL_SIZE - (sizeof (INT8U) * 4 + sizeof (INT16U) +\
                                          sizeof (INT16U) + sizeof (INT32U) +   \
                                          sizeof (INT32U))) / sizeof (SELRec_T))
*/

#pragma pack( 1 )

/**
 * @struct SELRec_T
 * @brief SEL Record
**/
typedef struct
{
    INT8U               Valid;
    INT8U               Len;
    SELEventRecord_T    EvtRecord;

} PACKED  SELRec_T;


/**
 * @struct SELRepository_T
 * @brief SEL Repository structure.
**/
typedef struct
{
    INT8U       Signature [4];      /* $SDR */
    INT16U      NumRecords;
    INT16U      Padding;
    INT32U      AddTimeStamp;
    INT32U      EraseTimeStamp;

    SELRec_T    SELRecord [SEL_MAX_SEL_RECORDS];

} PACKED  SELRepository_T;

#pragma pack( )

#endif  /* SEL_RECORD_H */
