/****************************************************************
 ****************************************************************
 **                                                            **
 **    (C)Copyright 2005-2007, American Megatrends Inc.        **
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
 * Filename : udp.h
 * Author   : Aruna. V (arunav@amiindia.co.in)
 *
 ****************************************************************/
 
#ifndef _UDP_H
#define _UDP_H

#include "netports.h"

#define SNMP_INDEX           0

/*
 * @define      SNMP_INST_NAME
 * @brief       SNMP Service Instance Name
 */
#define SNMP_INST_NAME 		"snmp"

/*
 * @define      NETSTAT_OPTIONS_LISTEN_UDP_NUM_PROC
 * @brief       options to be used for netstat listen command
 */
#define NETSTAT_OPTIONS_LISTEN_UDP_NUM_PROC "-uln"

/*
 * @define      NETSTAT_OPTIONS_ESTABLISHED_UDP_NUM_PROC
 * @brief       options to be used for netstat established command
 */
#define NETSTAT_OPTIONS_ESTABLISHED_UDP_NUM_PROC "-un"

/** Forms the ports list using netstat command **/
int UDP_GetPortsList(Ports_list ** ppPortsList, unsigned long * pulPort);

/** Gets a single particular instance **/
int UDP_GetPortByName(char * pstrName, unsigned long * pUlPort);

#endif /* _UDP_H */
