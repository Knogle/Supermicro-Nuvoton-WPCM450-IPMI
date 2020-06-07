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
 * LANIfc.h
 * LAN Interface Handler
 *
 * Author: Govind Kothandapani <govindk@ami.com>
 *       : Bakka Ravinder Reddy <bakkar@ami.com>
 *
 *****************************************************************/
#ifndef LANIFC_H
#define LANIFC_H
#include "Types.h"
#include "Message.h"
#include "IPMI_LANIfc.h"


/*** External Definitions ***/
#define LAN_SMB_REQUEST				1
#define LAN_SNMP_REQUEST			2
#define LAN_SM_REQUEST				3
#define LAN_ARP_REQUEST				4
#define GRATUITOUS_ARP_REQUEST		5
#define PCI_RST_INTR				6
#define LAN_SMB_ALERT				6
#define INIT_SMB					7
#define LAN_ICTS_MODE				8
#define VLAN_SMB_REQUEST			9
#define LOOP_BACK_LAN_SMB_REQUEST	10
#define LAN_IFC_READY				11
#if SUPPORT_VLAN_IFC == 1	
#define INIT_VLAN_IFC_SOCKETS		12
#define DE_CONFIG_VLAN_SOCKET	13
#endif


/**
 * This variable is used to define if the packet
 * is from VLAN channel or not 
 */
//extern INT8U	g_IsPktFromVLAN;

/**
 * @defgroup lanifc LAN Interface Module
 * LAN interface functions.
 * @{
**/
extern BOOL	ValidateUDPChkSum	(_NEAR_ UDPPseudoHdr_T* pUDPPseudoHdr, _FAR_ UDPHdr_T* pUDPHdr);
extern BOOL	ValidateIPChkSum	(_FAR_ IPHdr_T* pIPHdr);
extern INT16U CalculateUDPChkSum (_NEAR_ UDPPseudoHdr_T* pUDPPseudoHdr, _FAR_ UDPHdr_T* pUDPHdr);
extern INT16U CalculateIPChkSum	(_FAR_ IPHdr_T* pIPHdr);

//extern int SendSOLPkt  (INT8U* pSOLPkt, INT16U Len);
/** @} */

#endif /* LANIFC_H */
