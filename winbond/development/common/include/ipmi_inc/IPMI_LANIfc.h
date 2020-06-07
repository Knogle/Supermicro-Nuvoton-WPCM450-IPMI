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
 *
 * ipmi_LANIfc.h
 * LAN Interface structures
 *
 * Author: Govind Kothandapani <govindk@ami.com>
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef IPMI_LANIFC_H
#define IPMI_LANIFC_H
#include "Types.h"
#include "IPMI_RMCP.h"

#pragma pack( 1 )

/*** External Definitions ***/
#define MAC_ADDR_LEN            6
#define IP_ADDR_LEN             4
#define MAX_AUTH_PARAM_SIZE     128

/**
 * @struct MACHdr_T
 * @brief MAC header of LAN interface packet.
**/
typedef struct 
{
    INT8U   DestAddr [MAC_ADDR_LEN];
    INT8U   SrcAddr [MAC_ADDR_LEN];

} PACKED  MACHdr_T;


/**
 * @struct IPHdr_T
 * @brief IP Header of LAN interface packet.
**/
typedef struct 
{
    INT8U   Ver_HdrLen;
    INT8U   Prec_SerType;
    INT16U  TotalLen;
    INT16U  Id;
    INT16U  Flags_FragOffset;
    INT8U   TTL;
    INT8U   Protocol;
    INT16U  IPHdrChecksum;
    INT8U   SrcAddr [IP_ADDR_LEN];
    INT8U   DestAddr [IP_ADDR_LEN];

} PACKED  IPHdr_T;


/**
 * @struct UDPHdr_T 
 * @brief UDP header of LAN interface packet.
**/
typedef struct 
{
    INT16U  SrcPort;
    INT16U  DestPort;
    INT16U  UDPLen;
    INT16U  UDPChecksum;

} PACKED  UDPHdr_T;


/**
 * @struct LANRMCPPkt_T
 * @brief LAN RMCP packet format.
**/
typedef struct 
{
    MACHdr_T    MACHdr;
    INT16U      FrameType;
    IPHdr_T     IPHdr;
    UDPHdr_T    UDPHdr;
    RMCPHdr_T   RMCPHdr;

} PACKED  LANRMCPPkt_T;


/**
 * @struct LANARPData_T
 * @brief ARP Request/Reply 
**/
typedef struct
{
    INT16U  HardType;
    INT16U  ProtType;
    INT8U   HardSize;
    INT8U   ProtSize;
    INT16U  Op;
    INT8U   SenderMACAddr [MAC_ADDR_LEN];
    INT8U   SenderIPAddr [IP_ADDR_LEN];
    INT8U   TargetMACAddr [MAC_ADDR_LEN];
    INT8U   TargetIPAddr [IP_ADDR_LEN];
    INT8U   PAD [18];

} PACKED  LANARPData_T;


/**
 * @struct LANARPPkt_T
 * @brief LAN ARP Packet 
**/
typedef struct 
{
    MACHdr_T        MACHdr;
    INT16U          FrameType;
    LANARPData_T    LANARPHdr;

} PACKED  LANARPPkt_T;


/**
 * @struct UDPPseudoHdr_T
 * @brief UDP Pseudo header - used in udp checksum calculation.
**/
typedef struct
{
    INT8U   Protocol;
    INT8U   SrcAddr  [IP_ADDR_LEN];
    INT8U   DestAddr [IP_ADDR_LEN];
    INT16U  UDPLen;

} PACKED  UDPPseudoHdr_T;

#pragma pack( )

#endif /* IPMI_LANIFC_H */
