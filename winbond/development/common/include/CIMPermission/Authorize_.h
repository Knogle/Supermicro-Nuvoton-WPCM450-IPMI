/************************************************************
 * Source Name : Authorize.h
 * Author Name : Aruna. V (arunav@amiindia.co.in )
 * Date        : 15/02/08
 * Description : This file contains the Includes,
                 for authorizing users using CIM Permission
 * Copyright (c) 2007-2008, AMERICAN MEGATRENDS INDIA (P) LTD.
 * All rights reserved.
**************************************************************/

/************************************************************
 * $Log:       Created on 15/02/2008
 * $Log:       Header file for CIM Permission
*************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>

#define NOT_DEFINED			100

#define SUPERVISOR			0x0001
#define READ_ONLY			0x0002

#define ACCOUNT_MANAGEMENT_BIT		0x0004
#define REMOTE_CONSOLE_ACCESS		0x0008
#define REMOTE_CONSOLE_AND_DISK_ACCESS	0x0010
#define POWER_CONTROL			0x0020
#define CLEAR_LOG_BIT			0x0040
#define ADAPTER_CONF_BASIC		0x0080
#define ADAPTER_CONF_NETWORK_SECURITY	0x0100
#define ADAPTER_CONF_ADVANCED		0x0200
#define NOACCESS			0x0400


#define USER_BITMAP_DB			CFG_PROJ_PERM_CONFIG_PATH"/etc/userbitmap.ini"
#define REMOTE_USER_BITMAP_DB		"/tmp/userbitmap.ini"

#define INBAND_USERID_SIZE 8
#define IN_BAND_AUTH_FILE "/tmp/cim-account"

/** Fetches ldap permission bit map for the given username **/ 
int GetLDAPBitMap(char *username, int *bitMap);

int GetBitMap(char *username);

int GetLocalAccountBitMap(char *username,int *bitMap);

int GetRemoteAccountBitMap(char *username,char *pw,int *bitMap);

int SaveInfile(char *username,char *pw,int localflag,int bitMap);

int GetBitMapFromFile(char *username);

int GetPermissionBitMap(char *username,char *pw,int localflag,int *bitMap);

int IsSuperVisor(char *username);

int IsReadonly(char *username);

int IsUserAccountManagementPermitted(char *username);

int IsRemoteConsoleAccessPermitted(char *username);

int IsRemoteConsoleDiskAccessPermitted(char *username);

int IsPowerControlPermitted(char *username);

int IsClearLogPermitted(char *username);

int IsAdapterBasicPermitted(char *username);

int IsAdapterNetworkingPermitted(char *username);

int IsAdapterAdvancedPermitted(char *username);

int IsNoAccess(char *username);
