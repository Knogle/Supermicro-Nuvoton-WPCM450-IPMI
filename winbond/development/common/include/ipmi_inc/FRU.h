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
 * fru.h
 * fru.c extern declarations
 *
 *  Author: Rama Bisa <govindk@ami.com>
 *
 ******************************************************************/

#ifndef FRU_H
#define FRU_H

#include "Types.h"

/**
 * @defgroup fdc FRU Device Command handlers
 * @ingroup storage
 * IPMI Platform Management FRU (Field Replaceable Unit) information storage
 * interface commands. Implemented as per Version 1.0 and Document Rev 1.1.
 * @{
**/
#define  FRU_DEVICE_NOT_FOUND  	0xCB
#define  FRU_NOT_ACCESSIBLE        	0x81
#define  FRU_ACCESSIBLE                  	0x0
#define MAX_PDK_FRU_SUPPORTED 	4 //10

extern int GetFRUAreaInfo (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int ReadFRUData (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int WriteFRUData (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

/**
 * @brief Validates and Initializes FRU.
 * @return 0 if success, -1 if error.
**/
extern int InitFRU (void);

extern int ValidateFRUChecksum (INT8U FRUChksumType, INT8U *Ptr);

#endif /* FRU_H */
