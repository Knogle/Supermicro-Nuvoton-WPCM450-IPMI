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
 * rmcp.h
 * RMCP Packet Handler
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 * 
 *****************************************************************/
#ifndef RMCP_PLUS_H
#define RMCP_PLUS_H
#include "Types.h"
#include "IPMI_RMCP.h"
#include "IPMI_RMCP+.h"
#include "RMCP.h"


/*** External Definitions *****/
#define MAX_ALGORITHMS              2
#define HMAC_SHA1_96_LEN            12
#define HMAC_MD5_LEN				16
#define MD5_LEN						16
#define MAX_CIPHER_SUITES_BYTES     80

#define USER_ROLE_LOOKUP 			0
#define NAME_ONLY_LOOKUP 			1

#pragma pack( 1 )

/**
 * @var g_CipherRec
 * @brief Cipher suite record.
**/
extern const INT8U  g_CipherRec[MAX_CIPHER_SUITES_BYTES];



#pragma pack( )

/**
 * @defgroup rmcp RMCP+ Session Establishment
 * A set of pre-session messages as per RMCP+ specifiation.
 * These messages negotiate integrity and confidentiality algorithms and develop
 * keys for encoding/decoding furthur messages.
 * @{
**/
extern int  RSSPOpenSessionReq (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes, MiscParams_T *pParams,INT8U Channel);
extern int  RAKPMsg1           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes, MiscParams_T *pParams,INT8U Channel);
extern int  RAKPMsg3           (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes, MiscParams_T *pParams,INT8U Channel);
/** @} */

#endif /* RMCP_PLUS_H */
