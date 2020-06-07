/***********************************************************************************************
************************************************************************************************
**                                                                                            **  
**           Copyright (c) 2006-2007, AMERICAN MEGATRENDS Inc.	                              ** 
**                                                                                            **
**                               All Rights Reserved.                                         **
**                                                                                            ** 
**                      6145-F, Northbelt Parkway, Norcross,                                  **
**                                                                                            **
**                  Georgia - 30071, USA, Phone-(770)-246-8600.                               ** 
**                                                                                            **
************************************************************************************************
************************************************************************************************

 * FileName    : CIMC_SendRequest.h
 * Description : 
 * Author      : Yogeswaran. T
		 Hari .v
 
************************************************************************************************/

#ifndef _CIMC_SENDREQ

#define _CIMC_SENDREQ

#define STR_LEN 4096*4
#define MAX_WAIT_COUNT 128
#define send(s,d,l,f) write(s,d,l)
#define SOCKET_ERROR -1
typedef int SOCKET_T;
extern int replace_apos(char *string,char **replace_str);
extern int replace_quot(char *string,char **replace_str);
extern int replace_lt(char *string,char **replace_str);
extern int replace_gt(char *string,char **replace_str);
int CreateStdHttpHeaders(char* URI, int contLen, char* str, int length,char *Username,char *Password);
int  CIMSendRequest(char* cimRequest, char **cimResponse, char * IP,int portNum,char*username,char*password,int timeout);
SOCKET_T TcpConnect(char* server, int port);
//extern int Timeout;
#endif
