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
 * AmiSmtp.h
 * AMI smtp commands Macros
 *
 * Author: shivaranjanic <shivaranjanic@amiindia.co.in>
 *
 ******************************************************************/
#ifndef __AMISMTP_H__ 
#define __AMISMTP_H__

#include "Types.h"
#include "smtpclient.h"


extern int  SetSMTPConfigParams (_NEAR_ INT8U* pReq, INT32U ReqLen, _NEAR_ INT8U* pRes);
extern int  GetSMTPConfigParams (_NEAR_ INT8U* pReq, INT32U ReqLen, _NEAR_ INT8U* pRes);


#endif // __AMISMTP_H__ 
