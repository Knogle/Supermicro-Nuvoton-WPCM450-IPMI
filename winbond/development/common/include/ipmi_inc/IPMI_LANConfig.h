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
 ****************************************************************
 ****************************************************************
 *
 * ipmi_lanconfig.h
 * Lan configuration command handler
 *
 * Author: Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef IPMI_LANCONFIG_H
#define IPMI_LANCONFIG_H

#include "Types.h"

/*** External Definitions ***/
#define IP_ADDR_LEN             4
#define MAC_ADDR_LEN            6
#define MAX_COMM_STRING_SIZE    18
#define MAX_NUM_CIPHER_SUITE_PRIV_LEVELS    9

/**
 * @struct AuthTypeEnables_T
 * @brief Authentication Type Enables
**/
#pragma pack(1)
typedef struct
{
    INT8U   AuthTypeCallBack;
    INT8U   AuthTypeUser;
    INT8U   AuthTypeOperator;
    INT8U   AuthTypeAdmin;
    INT8U   AuthTypeOem;

} PACKED  AuthTypeEnables_T;

/**
 * @struct LANDestType_T
 * @brief LAN Destination Type
**/
typedef struct
{
    INT8U   SetSelect;
    INT8U   DestType;
    INT8U   AlertAckTimeout;
    INT8U   Retries;

} PACKED  LANDestType_T;


/**
 * @struct LANDestAddr_T
 * @brief LAN Destination Address
**/
typedef struct
{
    INT8U   SetSelect;
    INT8U   AddrFormat;
    INT8U   GateWayUse;
    INT8U   IPAddr  [IP_ADDR_LEN];
    INT8U   MACAddr [MAC_ADDR_LEN];

} PACKED  LANDestAddr_T;


/**
 * @struct IPv4HdrParams_T
 * @brief IPv4 Header Parameters
**/
typedef struct
{
    INT8U   TimeToLive;
    INT8U   IpHeaderFlags;
    INT8U   TypeOfService;

} PACKED  IPv4HdrParams_T;


/**
 * @struct LANConfigUn_T
 * @brief LAN Configuration Parameters.
**/
typedef union {

    INT8U               SetInProgress;
    INT8U               AuthTypeSupport;
    AuthTypeEnables_T   AuthTypeEnables;
    INT8U               IPAddr [4];
    INT8U               IPAddrSrc;
    INT8U               MACAddr [6];
    INT8U               SubNetMask [4];
    IPv4HdrParams_T     Ipv4HdrParam;
    INT16U              PrimaryRMCPPort;
    INT16U              SecondaryPort;
    INT8U               BMCGeneratedARPControl;
    INT8U               GratitousARPInterval;
    INT8U               DefaultGatewayIPAddr [IP_ADDR_LEN];
    INT8U               DefaultGatewayMACAddr [MAC_ADDR_LEN];
    INT8U               BackupGatewayIPAddr [IP_ADDR_LEN];
    INT8U               BackupGatewayMACAddr [MAC_ADDR_LEN];
    INT8U               CommunityStr [MAX_COMM_STRING_SIZE];
    INT8U               NumDest;
    LANDestType_T       DestType;
    LANDestAddr_T       DestAddr;
    INT16U              VLANID;
    INT8U               VLANPriority;
    INT8U               CipherSuiteSup;
    INT8U               CipherSuiteEntries [17];
    INT8U               CipherSuitePrivLevels [MAX_NUM_CIPHER_SUITE_PRIV_LEVELS];

} LANConfigUn_T;


/* GetLanCCRev_T */
typedef struct
{
    INT8U   CompletionCode;
    INT8U   ParamRevision;

} PACKED  GetLanCCRev_T;


/* GetLanConfigReq_T */
typedef struct 
{
    INT8U   ChannelNum;
    INT8U   ParameterSelect;
    INT8U   SetSelect;
    INT8U   BlockSelect;

} PACKED  GetLanConfigReq_T;


/* GetLanConfigRes_T */
typedef struct
{
    GetLanCCRev_T   CCParamRev;
    LANConfigUn_T   ConfigData;

} PACKED  GetLanConfigRes_T;


/* SetLanConfigReq_T */
typedef struct 
{
    INT8U           ChannelNum;
    INT8U           ParameterSelect;
    LANConfigUn_T   ConfigData;

} PACKED  SetLanConfigReq_T;


/* SetLanConfigRes_T */
typedef struct 
{
    INT8U   CompletionCode;

} PACKED  SetLanConfigRes_T;


/* SuspendBMCArpsReq_T */
typedef struct 
{
    INT8U   ChannelNo;
    INT8U   ArpSuspend;

} PACKED  SuspendBMCArpsReq_T;


/* SuspendBMCArpsRes_T  */
typedef struct 
{
    INT8U   CompletionCode;
    INT8U   ArpSuspendStatus;

} PACKED  SuspendBMCArpsRes_T;


/* GetIPUDPRMCPStatsReq_T */
typedef struct 
{
    INT8U   ChannelNo;
    INT8U   ClearStatus;

} PACKED  GetIPUDPRMCPStatsReq_T;

/* GetIPUDPRMCPStatsRes_T  */
typedef struct 
{
    INT8U   CompletionCode;
	INT16U 	IPPacketsRecv;
	INT16U	IPHeaderErr;
	INT16U	IPAddrErr;
	INT16U	FragIPPacketsRecv;
	INT16U	IPPacketsTrans;
	INT16U	UDPPacketsRecv;
	INT16U	ValidRMCPPackets;

} PACKED  GetIPUDPRMCPStatsRes_T;

#pragma pack()
#endif /* IPMI_LANCONFIG_H */
