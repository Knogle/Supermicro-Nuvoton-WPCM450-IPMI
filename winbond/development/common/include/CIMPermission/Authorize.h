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
#include "libipmi_AppDevice.h"

#define CP_IPMI_RESERVER        (0x0)
#define CP_IPMI_CALLBACK        (0x1)
#define CP_IPMI_USER            (0x2)
#define CP_IPMI_OPERATOR        (0x3)
#define CP_IPMI_ADMINISTRATOR   (0x4)
#define CP_IPMI_OEM             (0x5)
#define CP_IPMI_NOACCESS        (0xF)

int CP_GetIPMIPrivilege(char *name, INT8U *priv);

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
