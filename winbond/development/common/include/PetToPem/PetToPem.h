/***************************************************************
****************************************************************
**                                                            **
**  (C)Copyright 2002 - 2003, American Megatrends Inc.        **
**                                                            **
**            All Rights Reserved.                            **
**                                                            **
**      6145 - F, Northbelt Parkway, Norcross,		      **
**                                                            **
**     Georgia - 30071, USA. Phone -(770) - 246 - 8600.	      **
**                                                            **
****************************************************************
****************************************************************
****************************************************************
/ $Header: $
/
/ $Revision: $
/
/ $Date: 07 - 01 - 2007
/
****************************************************************
****************************************************************/
/** @file   PetToPem.h
 *  @author <rajibs@ami.com>
 *  @brief  Maps PET (IPMI) Events to PEM (DMTF) Events.
 *
 *  Revision History
 *  ----------------
 *
 * $Log: $
 *
 ****************************************************************/

#ifndef _PET_TO_PEM_
#define _PET_TO_PEM_

#include <stdlib.h>

#include "cel.h"
#include "cmc_sw_event.h"
#include "IPMI_SEL.h"

#define PEM_EVT_STR_LEN		256
#define MAX_NO_ACTION		5
#define MESSAGEID_LEN		20
#define MESSAGE_LEN		1024
#define PROP_LEN		256
#define MESSAGE_ARG_COUNT	3
#define MESSAGE_ARG_LEN		128
#define PETTOPEMINIFILE CFG_PROJ_PERM_CONFIG_PATH"/etc/PetToPem.ini"

#define SUCCESS 0
#define FAILURE 1 


typedef struct
{
	char Description[PEM_EVT_STR_LEN*2];
	char AlertingManagedElement[MESSAGE_LEN];
	unsigned int AlertingElementFormat;
	char OtherAlertingElementFormat[PEM_EVT_STR_LEN];
	unsigned int AlertType;
	char OtherAlertType[PEM_EVT_STR_LEN];
	unsigned int PerceivedSeverity;
	unsigned int ProbableCause;
	char ProbableCauseDescription[PEM_EVT_STR_LEN];
	unsigned int Trending;
	char RecommendedActions[MAX_NO_ACTION][PEM_EVT_STR_LEN];
	char EventID[PEM_EVT_STR_LEN];
	char EventTime[PEM_EVT_STR_LEN];
	char SystemCreationClassName[PROP_LEN]; //will be filled by provider
	char SystemName[PROP_LEN];	//will be filled by provider
	char ProviderName[PROP_LEN];
	char OwningEntity[64];
	unsigned long IndicationTime;
	char MessageID[MESSAGEID_LEN];
	char Message[MESSAGE_LEN];
	char MessageArguments[MESSAGE_ARG_COUNT][MESSAGE_ARG_LEN];
	char DynamicElement[MESSAGE_ARG_LEN];
}PEMEvent_T;


typedef struct{
	int SensorTypeCode;
	int SensorSpecificOffset;
	int AssertionBit;
	char Description[PEM_EVT_STR_LEN*2];
	unsigned int AlertType;
	unsigned int PerceivedSeverity;
	char SystemCreationClassName[256]; //will be filled by provider
	char SystemName[256];	//will be filled by provider
	char ProviderName[256];
	char MessageID[MESSAGEID_LEN];
	char Message[MESSAGE_LEN*2];
	char OwningEntity[64];
}PET_TO_PEM_MAPPING;

#define NO_OF_PET_TO_PEM1		230
#define NO_OF_PET_TO_PEM2		49+4

/** converts PET events to PEM event format **/
int PetToPem (CELEvent_T* evt,PEMEvent_T *pemEvt);

/** Checks if the Sensor Type code is discrete **/
int IsDiscreteSensor(int SensorTypeCode);

int GetCatagoryOfEvents(int EventTypeCode);

int SearchRelatedDeassertEvt(int index,int tableindex);

int SearchDeassertedEntry(SELEventRecord_T *selEvt);

int InitializePem();

int CleanUpPem();

#endif // _PET_TO_PEM_
