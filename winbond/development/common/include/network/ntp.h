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
 * filename : ntp.h
 *  Author: gayathril@amiindia.co.in
 *
 ****************************************************************/

#include <sys/types.h>

#include <string.h>
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

#include <stdlib.h>
#include <errno.h>
#include <fcntl.h>
#include <dirent.h>
#include <pwd.h>
#include <syslog.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <netinet/in.h>
/*
 * @define      MAX_LINE_LEN
 * @brief       Maximum length of a line
 */

#define MAX_LINE_LEN   1024

/*
 * @define      SNTP_BIN_PATH
 * @brief       Path of the sntp
 */

#define SNTP_BIN_PATH "/usr/sbin/sntp"

/*
 * @define      SNTP_OPTIONS_A
 * @brief       sntp option to be used
 */

#define SNTP_OPTIONS_A "&"

/*
 * @define      SNTP_OPTIONS
 * @brief       sntp option to be used
 */

#define SNTP_OPTIONS "-x"

#define PS_OPTIONS "ps"

#define PS_X       "-x"

#define GREP_BIN_PATH "/bin/grep"

/** Enabled and Disabled State values **/

#define NTP_ENABLEDSTATE 1
#define NTP_DISABLEDSTATE 0

#define FAILURE 1
#define SUCCESS 0

/** Synchronizes the NTP Clock **/

int NTP_SynchronizeClock(char *IPAddr);

/** Stops the NTP Service **/

int NTP_ServiceDisable(int NTPStateValue, char * IPAddr);

/** Starts the NTP Service **/

int NTP_ServiceEnable(int NTPStateValue, int NTPValue, char * IPAddr);
