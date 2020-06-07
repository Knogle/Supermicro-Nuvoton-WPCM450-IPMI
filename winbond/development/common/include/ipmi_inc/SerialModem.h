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
 * SerialModem.c
 * Serial/Modem configuration , Callback &  MUX
 *
 *  Author: Govindarajan <govindarajann@amiindia.co.in>
 *          Vinoth Kumar <vinothkumars@amiindia.co.in>
 ****************************************************************/
#ifndef SERIAL_MODEM_H
#define SERIAL_MODEM_H

#include "Types.h"
#include "IPMI_SerialModem.h"
#include "IPMI_LANConfig.h"

#pragma pack( 1 )

/*** External Definitions ***/
#define CHANNEL_ALWAYS_AVAILABLE                2
#define MAX_MODEM_INIT_STR_BLOCKS               4
#define MAX_MODEM_INIT_STR_BLOCK_SIZE           16
#define MAX_MODEM_ESC_SEQ_SIZE                  5
#define MAX_MODEM_HANG_UP_SEQ_SIZE              8
#define MAX_MODEM_DIAL_CMD_SIZE                 8
#define MAX_SERIAL_ALERT_DESTINATIONS           5
#define MAX_MODEM_DIAL_STRS                     5
#define MAX_MODEM_DIAL_STR_BLOCKS               3
#define MAX_MODEM_DIAL_STR_BLOCK_SIZE           16
#define MAX_MODEM_ALERT_DEST_IP_ADDRS           5
#define MAX_MODEM_TAP_ACCOUNTS                  3
#define TAP_SERVICE_TYPE_FIELD_SIZE             3
#define TAP_PASSWORD_SIZE                       7
#define TAP_PAGER_ID_STRING_SIZE                13
#define MAX_MODEM_CHAP_NAME_SIZE                16
#define MAX_MODEM_PPP_ACCOUNTS                  3
#define PPP_ACC_USER_NAME_DOMAIN_PASSWD_SIZE    16
#define MAX_COMM_STRING_SIZE                    18
#define MODEM_CFG_DEST_INFO_DEST_TYPE_MASK      0x0f

/* Bit field constants for configuration Data1 & Data2*/
#define TC_SET_DATA_MASK                    0xC0
#define TC_LINE_EDIT_ENABLE_MASK            0x20
#define TC_CHECKSUM_REQ_MASK                0x10
#define TC_DELETE_CTRL_MASK                 0x0C
#define TC_ECHO_MASK                        0x02
#define TC_HAND_SHAKE_MASK                  0x1
#define TC_OUT_TERMINATION_SEQ_MASK         0xF0
#define TC_IN_TERMINATION_SEQ_MASK          0x0F

/**
 * @struct AuthTypeEnable_T
 * @brief Authentication Enables.
**/
typedef struct
{
   INT8U Callback;
   INT8U User;
   INT8U Operator;
   INT8U Admin;
   INT8U oem;

} PACKED  AuthTypeEnable_T;


/**
 * @struct ChannelCallbackCtrl_T
 * @brief Channel Callback Control.
**/
typedef struct 
{
    INT8U CallBackEnable;
    INT8U CBCPnegopt;
    INT8U CallBackDes1;
    INT8U CallBackDes2;
    INT8U CallBackDes3;

} PACKED  ChannelCallbackCtrl_T;


/**
 * @struct IpmiMsgCommSettings_T
 * @brief Communication Settings.
**/
typedef struct 
{
     INT8U  FlowCtrl;
     INT8U  BitRate;

} PACKED  IpmiMsgCommSettings_T;


/** 
 * @struct MuxSwitchCtrl_T
 * @brief MUX Switch Control.
**/
typedef struct 
{
    INT8U Data1;
    INT8U Data2;

} PACKED  MuxSwitchCtrl_T;


/**
 * @struct ModemRingTime_T
 * @brief Modem Ring Time.
**/
typedef struct 
{
    INT8U RingDuration;
    INT8U RingDeadTime;

} PACKED  ModemRingTime_T;


/**
 * @struct DestInfo_T
 * @brief Destination Information.
**/
typedef struct 
{
    INT8U DesType;
    INT8U AlertAckTimeout;
    INT8U Retries;
    INT8U DesTypeSpecific;

} PACKED  DestInfo_T;


/**
 * @struct ModemDestCommSettings_T
 * @brief Modem Destination Communication Settings.
**/
typedef struct 
{
    INT8U FlowControl;
    INT8U BitRate;

} PACKED  ModemDestCommSettings_T;


/**
 * @struct DestIPAddr_T
 * @brief Destination IP Address.
**/
typedef struct 
{
    INT8U ip [IP_ADDR_LEN];

} PACKED  DestIPAddr_T;


/**
 * @struct TAPServiceSettings_T
 * @brief TAP Service Settings.
**/
typedef struct 
{
    INT8U   TAPConfirmation;
    INT8U   TAPServiceTypeChars [TAP_SERVICE_TYPE_FIELD_SIZE];
    INT32U  TAPCtrlESCMask;
    INT8U   TimeOutParam1;
    INT8U   TimeOutParam2;
    INT8U   TimeOutParam3;
    INT8U   RetryParam1;
    INT8U   RetryParam2;

} PACKED  TAPServiceSettings_T;


/**
 * @struct TermConfig_T
 * @brief Terminal Configuration Data.
**/
typedef struct 
{
    INT8U Data1;    /* Config Data1 deals with feature configuration */
    INT8U Data2;    /* Config Data2 deals with i/o termination sequence */

} PACKED  TermConfig_T;


/**
 * @struct PPPProtocolOptions_T
 * @brief PPP Protocol Options.
**/
typedef struct 
{
    INT8U  SnoopControl;
    INT8U  NegControl;
    INT8U  NegConfig;

} PACKED  PPPProtocolOptions_T;


/**
 * @struct PPPAccm_T
 * @brief PPP ACCM.
**/
typedef struct 
{
    INT32U  ReceiveACCM;
    INT32U  TransmitACCM;

} PACKED  PPPAccm_T;


/**
 * @struct PPPSnoopAccm_T
 * @brief PPP Snoop ACCM
**/
typedef struct 
{
    INT32U  ReceiveACCM;

} PACKED  PPPSnoopAccm_T;


/**
 * @struct PPPUDPProxyIPHeaderData_T
 * @brief PPP UDP Proxy Header Data.
**/
typedef struct 
{
    INT8U SrcIPAddress [IP_ADDR_LEN];
    INT8U DestIPAddress [IP_ADDR_LEN];

} PACKED  PPPUDPProxyIPHeaderData_T;


/**
 * @struct SMConfig_T
 * @brief Serial/Modem Configuration.
**/
typedef struct
{
    INT8U                       SetInProgress;
    INT8U                       AuthTypeSupport;
    AuthTypeEnable_T            AuthTypeEnable;
    INT8U                       ConnectionMode;
    INT8U                       SessionInactivity;
    ChannelCallbackCtrl_T       ChannelCallBackCtrl;
    INT8U                       SessionTermination;
    IpmiMsgCommSettings_T       IpmiMsgCommSet;
    MuxSwitchCtrl_T             MUXSwitchCtrl;
    ModemRingTime_T             RingTime;
    INT8U                       ModemInitString [MAX_MODEM_INIT_STR_BLOCKS] [MAX_MODEM_INIT_STR_BLOCK_SIZE];
    INT8U                       ModemEscapeSeq [MAX_MODEM_ESC_SEQ_SIZE + 1];   /*+1 for NULL Termination when */
    INT8U                       ModemHangup [MAX_MODEM_HANG_UP_SEQ_SIZE + 1];  /*full non null chars are provided*/
    INT8U                       ModemDialCmd [MAX_MODEM_DIAL_CMD_SIZE + 1];
    INT8U                       PageBlockOut;
    INT8U                       CommunityString [MAX_COMM_STRING_SIZE + 1];
    INT8U                       TotalAlertDest;
    DestInfo_T                  DestinationInfo [MAX_SERIAL_ALERT_DESTINATIONS];
    INT8U                       CallRetryInterval;
    ModemDestCommSettings_T     DestComSet [MAX_SERIAL_ALERT_DESTINATIONS];
    INT8U                       TotalDialStr;
    INT8U                       DestDialStrings [MAX_MODEM_DIAL_STRS] [MAX_MODEM_DIAL_STR_BLOCKS] [MAX_MODEM_DIAL_STR_BLOCK_SIZE];
    INT8U                       TotalDestIP;
    DestIPAddr_T                DestAddr [MAX_MODEM_ALERT_DEST_IP_ADDRS];
    INT8U                       TotalTAPAcc;
    INT8U                       TAPAccountSelector [MAX_MODEM_TAP_ACCOUNTS];
    INT8U                       TAPPasswd [MAX_MODEM_TAP_ACCOUNTS] [TAP_PASSWORD_SIZE + 1];
    INT8U                       TAPPagerIDStrings [MAX_MODEM_TAP_ACCOUNTS] [TAP_PAGER_ID_STRING_SIZE + 1];
    TAPServiceSettings_T        TAPServiceSettings [MAX_MODEM_TAP_ACCOUNTS];
    TermConfig_T                Termconfig;
    PPPProtocolOptions_T        PPPProtocolOptions;
    INT16U                      PPPPrimaryRMCPPort;
    INT16U                      PPPSecondaryRMCPPort;
    INT8U                       PPPLinkAuth;
    INT8U                       CHAPName [MAX_MODEM_CHAP_NAME_SIZE];
    PPPAccm_T                   PPPACCM;
    PPPSnoopAccm_T              PPPSnoopACCM;
    INT8U                       TotalPPPAcc;
    INT8U                       PPPAccDialStrSel [MAX_MODEM_PPP_ACCOUNTS];
    INT8U                       PPPAccIPAddress [MAX_MODEM_PPP_ACCOUNTS] [IP_ADDR_LEN];
    INT8U                       PPPAccUserNames [MAX_MODEM_PPP_ACCOUNTS] [PPP_ACC_USER_NAME_DOMAIN_PASSWD_SIZE + 1 ];
    INT8U                       PPPAccUserDomain [MAX_MODEM_PPP_ACCOUNTS] [PPP_ACC_USER_NAME_DOMAIN_PASSWD_SIZE + 1];
    INT8U                       PPPAccUserPasswd [MAX_MODEM_PPP_ACCOUNTS] [PPP_ACC_USER_NAME_DOMAIN_PASSWD_SIZE + 1];
    INT8U                       PPPAccAuthSettings [MAX_MODEM_PPP_ACCOUNTS];
    INT8U                       PPPAccConnHoldTimes [MAX_MODEM_PPP_ACCOUNTS];
    PPPUDPProxyIPHeaderData_T   PPPUDPProxyIPHeadData;
    INT16U                      PPPUDPProxyTransmitBuffSize;
    INT16U                      PPPUDPProxyReceiveBuffSize;
    INT8U                       PPPRemoteConsoleIPAdd [IP_ADDR_LEN];

} PACKED  SMConfig_T;

#pragma pack( )

/**
 * @defgroup smc Serial/Modem Command handlers
 * @ingroup devcfg
 * IPMI Serial/Modem configuration interface command handlers.
 * Set/Get configuration commands allow retrieval and updation of various
 * Serial/Modem, Terminal and PPP parameters.
 * @{
**/
extern int SetSerialModemConfig   (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetSerialModemConfig   (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int CallBack               (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetUserCallBackOptions (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetUserCallBackOptions (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SetSerialModemMUX      (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int SerialModemConnectActive (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
extern int GetTAPResponseCodes    (_NEAR_ INT8U* pReq, INT8U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

/**
 * @brief Task function to generate Serial/Modem Ping message.
**/
extern void SerialModemPingTask ( void );

#endif  /* SERIAL_MODEM_H */
