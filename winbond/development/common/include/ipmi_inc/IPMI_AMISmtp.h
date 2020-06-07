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
 * IPMI_AMIsmtp.h
 * AMI specific Smtp  Commands
 * 
 *
 ******************************************************************/

#ifndef __IPMI_AMISMTP_H__ 
#define __IPMI_AMISMTP_H__

#include "IPMI_LANConfig.h"

#define OEM_ENABLE_DISABLE_SMTP 		0
#define OEM_PARAM_SMTP_SERVR_ADDR		1
#define OEM_PARAM_SMTP_USER_NAME		2
#define OEM_PARAM_SMTP_PASSWD			3
#define OEM_PARAM_SMTP_NO_OF_DESTINATIONS    	4
#define OEM_PARAM_SMTP_EMAIL_ADDR		5
#define OEM_PARAM_SMTP_SUBJECT			6
#define OEM_PARAM_SMTP_MSG			7
#define OEM_PARAM_SMTP_SENDER_ADDR          8
#define  OEM_PARAM_SMTP_HOST_NAME             9



#define MAX_EMAIL_ADDR_BLOCKS  2
#define MAX_EMAIL_BLOCK_SIZE   32
#define MAX_SUB_BLOCKS  	2
#define MAX_SUB_BLOCK_SIZE   	16
#define MAX_MSG_BLOCKS  	4
#define MAX_MSG_BLOCK_SIZE   	16
#define MAX_EMAIL_DESTINATIONS    15
#define MAX_SMTP_USERNAME_LEN  16
#define MAX_SMTP_PASSWD_LEN       20



#pragma pack (1)

typedef union
{

  INT8U EnableDisableSMTP;
  INT8U ServerAddr [ IP_ADDR_LEN ];
  INT8U UserName [ MAX_SMTP_USERNAME_LEN ];
  INT8U Passwd   [MAX_SMTP_PASSWD_LEN];
  INT8U NoofDestinations;	
  INT8U RecpEmailAddr [MAX_EMAIL_BLOCK_SIZE ]; 
  INT8U Subject	 [MAX_SUB_BLOCK_SIZE ];
  INT8U Msg	 [MAX_MSG_BLOCK_SIZE ];
  INT8U SenderAddr[MAX_EMAIL_BLOCK_SIZE];
  INT8U  Servername[MAX_EMAIL_BLOCK_SIZE];
} PACKED Smtp_ConfigUn_T; 


typedef struct
{
    INT8U   CompletionCode;

} PACKED  SetSMTPConfigRes_T;

typedef struct 
{
    INT8U   Channel;
    INT8U   ParameterSelect;
    INT8U   SetSelector;
    INT8U   BlockSelector;
    Smtp_ConfigUn_T ConfigData;

} PACKED  SetSMTPConfigReq_T;


typedef struct
{
    INT8U   CompletionCode;
    Smtp_ConfigUn_T ConfigData;

} PACKED  GetSMTPConfigRes_T;



typedef struct 
{
    INT8U   Channel;
    INT8U   ParameterSelect;
    INT8U   SetSelector;
    INT8U   BlockSelector;

} PACKED  GetSMTPConfigReq_T;




typedef struct 
{

  INT8U EnableDisableSMTP;
  INT8U ServerAddr [ IP_ADDR_LEN ];
  INT8U UserName [ MAX_SMTP_USERNAME_LEN ];
  INT8U Passwd   [MAX_SMTP_PASSWD_LEN];
  INT8U NoofDestinations;	
  INT8U RecpEmailAddr [MAX_EMAIL_DESTINATIONS+1][MAX_EMAIL_BLOCK_SIZE * MAX_EMAIL_ADDR_BLOCKS]; 
  INT8U Subject	 [MAX_EMAIL_DESTINATIONS+1][MAX_SUB_BLOCK_SIZE * MAX_SUB_BLOCKS];
  INT8U Msg	 [MAX_EMAIL_DESTINATIONS+1][MAX_MSG_BLOCK_SIZE * MAX_MSG_BLOCKS];
  INT8U SenderAddr[MAX_EMAIL_BLOCK_SIZE ];
  INT8U  Servername[MAX_EMAIL_BLOCK_SIZE];
} PACKED Smtp_Config_T; 



#pragma pack ()


#endif //__IPMI_AMISMTP_H__
