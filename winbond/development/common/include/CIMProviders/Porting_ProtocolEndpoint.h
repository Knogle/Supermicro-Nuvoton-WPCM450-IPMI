/****************************************************************
*****************************************************************
**                                                             **
**   Copyright (c) 2004-2005, AMERICAN MEGATRENDS Inc.         **
**                                                             **
**                    All Rights Reserved.                     **
**                                                             **
**            6145-F, Northbelt Parkway, Norcross,             **
**                                                             **
**         Georgia - 30071, USA, Phone-(770)-246-8600.         **
**                                                             **
*****************************************************************
*****************************************************************
*****************************************************************
 * Source Name : Porting_ProtocolEndpoint.h
 * Date        : 27/06/2008
 * Author      : Aruna. V (arunav@amiindia.co.in)
*****************************************************************/

#include "Porting_Common.h"

typedef enum {
	PROT_IF_TYPE_Unknown=0, PROT_IF_TYPE_Other, PROT_IF_TYPE_HTTP=4402,
	PROT_IF_TYPE_SMTP=4403, PROT_IF_TYPE_HTTPS=4406,
	PROT_IF_TYPE_DMTFReserved=4407, PROT_IF_TYPE_VendorReserved=32768
} CPL_ProtocolIFType_T;

/*!--------------------------------------------------------------
 * Structure Name : PEPInfo_T
 * Description    : This structure is used for maintaining the 
		    details of all the interfaces as a list.
 * Copyright (c) 2004-2005, AMERICAN MEGATRENDS INDIA (P) LTD.
   All rights reserved.
 *----------------------------------------------------------------
 */
typedef struct PEPInfo {
	char strName[CPL_MAX_STR_LEN];
	CPL_ProtocolIFType_T ProtocolIFType;
	char strOtherTypeDescription[CPL_MIN_STR_LEN];
	char strElementName[CPL_MAX_STR_LEN];
	char strNameFormat[CPL_MAX_STR_LEN];
	struct PEPInfo * next;
} PEPInfo_T;

/** Gets the details for CIM_ProtocolEndpoint sessions **/
CPL_Status_T CPL_GetAllPEPInfo(PEPInfo_T ** ppPEPInfo);

/** Deletes a particular ProtocolEndpoint instance**/
CPL_Status_T CPL_DeletePEP(char * pName);

/** Frees the PEPInfo List **/
void CPL_free_PEPInfo_list(PEPInfo_T * pPEPInfo);

//CPL_Status_T CPL_GetCLIPortsList(unsigned long * pulPort);

/** Get the list of all TCP ports from related Config files **/
CPL_Status_T CPL_ProcessTCPConfigFiles(unsigned long * pulPort);

/** Get the Configured instance for TCPProtocolEndpoint **/
CPL_Status_T CPL_GetConfiguredInstance(char * pstrService,
                              unsigned long * pUlPort);

/** Get the list of all UDP ports from related Config files **/
CPL_Status_T CPL_ProcessUDPConfigFiles(unsigned long * pulPort);

/** Change the snmp config file on Modify Instance **/
CPL_Status_T CPL_ChangeUDPTextInFile(char * FileName, char * keySearch,
                     char * NewText, int ChangeFlag);

CPL_Status_T CPL_GetValueForKey(char * strFileName, char * strKey,
		       char * strValue);

/** Get the lists of all Currently used TCP ports **/
CPL_Status_T CPL_ProcessCurrentPortConfigFile(unsigned long * pUlSshClpPort,
				 unsigned long * pUlSshCliPort,
				 unsigned long * pUlTnetClpPort,
				 unsigned long * pUlTnetCliPort,
				 unsigned long * pUlCimxmlHttpPort,
				 unsigned long * pUlCimxmlHttpsPort,
				 unsigned long * pUlWebHttpPort,
				 unsigned long * pUlWebHttpsPort);

