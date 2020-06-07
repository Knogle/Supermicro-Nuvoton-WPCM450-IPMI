
/**************************************************************************************
 * Source Name : IPMI_PowerManagementService.h
 * Author Name : Gokula Kannan. S ( gokulakannans@amiindia.co.in )
 * Date        : 23/11/2006
 * Description : This file contains the Includes, Structures and Global Declarations
                 for all the IPMI_<Class Names>.c files.
 *
 * Copyright (c) 2004-2005, AMERICAN MEGATRENDS INDIA (P) LTD. All rights reserved.
****************************************************************************************/
#ifndef _IPMI_INCLUDES_

#define _IPMI_INCLUDES_

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pwd.h>
#include <sys/types.h>
#include <netinet/in.h>

#include "libipmi_session.h"
#include "libipmi_errorcodes.h"


#include "libipmi_AppDevice.h"
#include "libipmi_ChassisDevice.h"
#include "libipmi_StorDevice.h"
#include "libipmi_sensor.h"
#include "libipmi_XportDevice.h"
#include "IPMI_SDRRecord.h"

#define CONF_INIFILE 		CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/IPMI_Conf.ini"

#ifndef IPMI_TIMEOUT
#define IPMI_TIMEOUT 10
#endif


#define MAX_SDR_BUFF_LEN	128
#define MAX_ID_STR_LEN 16
//#define RAW

#define FAILURE 1
#define SUCCESS 0 
#define UNSUPPORTED 7
#define IPMI_FAILURE 100
#define ACCESS_DENIED 2
#define NODE_LEN 32


// Defined for IP interface
#define PARAM_IPADDRSOURCE	4
#define PARAM_MAC		5
#define PARAM_IP		3
#define PARAM_MASK		6
#define PARAM_GATEWAY		12

#define IPADDR_SOURCE_STATIC 	0x01
#define IPADDR_SOURCE_DHCP 	0x02


#endif

