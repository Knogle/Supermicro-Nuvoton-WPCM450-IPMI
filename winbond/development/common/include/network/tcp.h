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
 * Filename : tcp.h
 * Author   : Aruna. V (arunav@amiindia.co.in)
 *
 ****************************************************************/
 
#ifndef _TCP_H
#define _TCP_H

#define SSH_CLP_INDEX		0
#define SSH_CLI_INDEX		2
#define TNET_CLP_INDEX		4
#define TNET_CLI_INDEX		6
#define CIM_HTTP_INDEX		8
#define CIM_HTTPS_INDEX		10
#define WEB_HTTP_INDEX		12
#define WEB_HTTPS_INDEX		14

#include "netports.h"

/*
 * @define      NETSTAT_OPTIONS_LISTEN_TCP_NUM_PROC
 * @brief       options to be used for netstat listen command
 */
#define NETSTAT_OPTIONS_LISTEN_TCP_NUM_PROC "-tln"

/*
 * @define      NETSTAT_OPTIONS_ESTABLISHED_TCP_NUM_PROC
 * @brief       options to be used for netstat established command
 */
#define NETSTAT_OPTIONS_ESTABLISHED_TCP_NUM_PROC "-tn"

/** Forms the ports list using netstat command **/
int TCP_GetPortsList(Ports_list ** ppPortsList, unsigned long * pulPort);

/** Gets a single particular instance **/
int TCP_GetPortByName(char * pstrName, unsigned long * pUlPort);

#endif /* _NETPORTS_H */
