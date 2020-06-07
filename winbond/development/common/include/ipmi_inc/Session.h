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
 * Session.h
 *
 *
 * Author: Govind Kothandapani <govindk@ami.com>
 * 		 : Rama Bisa <ramab@ami.com>
 *       : Basavaraj Astekar <basavaraja@ami.com>
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef SESSION_H
#define SESSION_H
#include "Types.h"
#include "IPMI_LANIfc.h"
#include "IPMI_RMCP+.h"
#include "PMConfig.h"

//#pragma pack( 1 )

/* Macros */
#define		SESSION_ID_INFO							1
#define		SESSION_HANDLE_INFO						2
#define		SESSION_INDEX_INFO						3
#define		SESSION_CHANNEL_INFO					4
#define		MGD_SYS_SESSION_ID_INFO					5
#define		SESSION_PAYLOAD_INFO					6
#define		SESSION_REMOTE_INFO					7
#define		MAX_INST_SUPPORTED						2
#define		SESSIONLESS_CHANNEL						0x00
#define		SINGLE_SESSION_CHANNEL					0x01
#define		MULTI_SESSION_CHANNEL					0x02
#define		SESSION_BASED_CHANNEL					0x03
#define		HASH_DATA_LENGTH						16
#define		MAX_USER_SESSIONS						TOTAL_MAX_SESSION
#define		NULL_USER_ID							1

/* SessPayloadInfo_T */
typedef struct
{
	INT8U	Type;
	INT8U	OemPldIANA [3];
	INT8U	OemPldID [2];
	INT8U	Version;
	INT16U	PortNum;
	INT16U	ActivatedInst;
	INT8U	AuxConfig [4];

} PACKED  SessPayloadInfo_T;


/*	structure to  keep track the information about a session.	*/
/* SessionInfo_T */
typedef struct
{
	INT8U			Used; /* Flag to indicate the slot used or not */
	INT32U			SessionID;
	INT8U			Activated;
	INT8U			Channel;
	INT8U			AuthType;
	INT8U			Privilege;
	INT8U			MaxPrivilege;
	INT32U			InboundSeq;
	INT32U			OutboundSeq;
	INT32U			TimeOutValue;
	INT8U			Password[MAX_PASSWORD_LEN];
	INT8U			UserId;
	INT8U			SessionHandle;
	INT8U			ChallengeString[CHALLENGE_STR_LEN];
	LANRMCPPkt_T	LANRMCPPkt;
	SOCKET			hSocket;
	BOOL			SerialModemMode;
	INT32U 			Time;
#if (IPMI20_SUPPORT == 1)
	INT8U				Lookup;
	INT32U				RemConSessionID;
	INT8U				RemConRandomNo [16];
	INT8U				MgdSysRandomNo [16];
	INT8U				AuthAlgorithm;
	INT8U				IntegrityAlgorithm;
	INT8U				ConfidentialityAlgorithm;
	INT8U				Key1 [HASH_KEY1_SIZE];
	INT8U				Key2 [HASH_KEY2_SIZE];
	SessPayloadInfo_T	SessPyldInfo [MAX_PYLDS_SUPPORT];
#endif
       INT32U                   InitialInboundSeq;
       INT32U                   InboundTrac[SIXTEEN_COUNT_WINDOW_LEN];
       INT16U                   InboundRecv;
	INT8U 			IsLoopBack;
} PACKED  SessionInfo_T;

/* SessionTblInfo_T */
typedef	struct
{
	INT16U			Count;
	SessionInfo_T	SessionTbl[TOTAL_MAX_SESSION + 1]; //1 extra for get session challenge
} PACKED  SessionTblInfo_T;


typedef struct
{
	INT32U Time;
	INT8U  Index;
}PACKED  OldSessionInfo_T;


//#pragma pack( )

/*--------------------------
 * Extern Declarations
 *--------------------------*/
extern		 void				SessionTimerTask (void);
extern _FAR_ ChannelInfo_T*		getChannelInfo (INT8U ch);
extern _FAR_ ChannelUserInfo_T* getChUserIdInfo (INT8U userId, _NEAR_ INT8U *index, _FAR_ ChannelUserInfo_T* pChUserInfo);
extern _FAR_ SessionInfo_T*		getSessionInfo (INT8U Arg, _FAR_ void *Session);
extern _FAR_ ChannelUserInfo_T* getChUserPrivInfo (_NEAR_ char *userName, _NEAR_ INT8U Role, _NEAR_ INT8U* chIndex, _FAR_ ChannelUserInfo_T *pChUserInfo);
extern _FAR_ ChannelUserInfo_T*	getChUserInfo (_NEAR_ char *userName, _NEAR_ INT8U* chIndex, _FAR_ ChannelUserInfo_T *pChUserInfo);
extern _FAR_ UserInfo_T*		getUserIdInfo (INT8U userId);
extern _FAR_ ChannelUserInfo_T*	AddChUser (_FAR_ ChannelUserInfo_T*	pChUserInfo, _NEAR_ INT8U*	Index);
extern		 INT8U				disableUser (INT8U UserId);
extern		 INT8U				GetNumOfActiveSessions (void);
extern		 INT8U				GetNumOfUsedSessions (void);
extern 		 void 				DeleteSession (_FAR_ SessionInfo_T*	pSessionInfo);
extern		 void				AddSession (_NEAR_ SessionInfo_T* pSessionInfo);
extern 		INT8U 			 CleanSession(void);
extern _FAR_ INT16U				getPayloadActiveInst (INT8U PayloadType);
extern _FAR_ INT32U				getPayloadInstInfo (INT8U PayloadType, INT16U PayloadInst);
extern		 void				PasswordViolation (void);

#endif	/* SESSION_H */
