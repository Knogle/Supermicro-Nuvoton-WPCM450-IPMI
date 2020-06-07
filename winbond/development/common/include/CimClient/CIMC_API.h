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

 * FileName    : CIMC_API.h
 * Description :
 * Author      : Yogeswaran. T
		 Hari .v

************************************************************************************************/

#ifndef _CIMC_API
#define _CIMC_API

#include "CIMC_Include.h"

/*
void *client_Configuration(char* setIPAddress,
						 int setPortNumber,
						 char* setNamespace1,
						 char* setNamespace2,
						 int CIMC_Timeout,
						 char *UseraName,
						 char* Password);
			*/

// Size of string storing cim datetime including NULL
// buffer passed to CIMC_ConvertDatetimeToString and CIMC_IntervalToString must be of this size
#define CIM_DATETIME_TEXT_LEN				(25 + 1)


void *client_Configuration(char* setIPAddress,
				int setPortNumber,
				char* setNamespace,
				int CIMC_Timeout,
				char *getUserName,
				char*getPassword
				);

int CIMC_SetNamespace(void *handle, char *_namespace);
int CIMC_GetNamespace(void *handle, char *_namespace, int nslen);

CIMC_Class * CIM_GetClass(void *client_config,CIMC_ClassName *pClassName,
						  int localOnly,
						  int includeQualifiers,
						  int includeClassOrigin,
						  char* PropertyList,
						  CIMC_Error **pError	);

CIMC_Class * CIM_EnumerateClasses(void *client_config,CIMC_ClassName *pClassName,
								int deepInheritance,
								int localOnly,
								int includeQualifiers,
								int includeClassOrigin,
								CIMC_Error **pError);

CIMC_NamedInstance * EnumerateInstances(void *client_config,CIMC_ClassName *pClassName,
								int localOnly,
								int deepInheritance,
								int includeQualifiers,
								int includeClassOrigin,
								char* PropertyList,
								CIMC_Error **pError);

CIMC_ClassName *EnumerateClassNames(void *client_config,CIMC_ClassName *pClassName,
								int deepInheritance,
								CIMC_Error **pError);

CIMC_Instance *GetInstance(void *client_config,CIMC_InstanceName *instanceName,
						   int localOnly,
						   int includeQualifiers,
						   int includeClassOrigin,
						   char* propertyList,
						   CIMC_Error **error);

CIMC_InstanceName *EnumerateInstanceNames(void *client_config,CIMC_ClassName *pClassName,
							CIMC_Error **error);

CIMC_ObjectWithPath * Associators(void *client_config,CIMC_ObjectName *pObjectName,
								  CIMC_ClassName *pAssocClass,
								  CIMC_ClassName *pResultClass,
								  char *Role,
								  char *ResultRole,
								  int includeQualifiers,
								  int includeClassOrigin,
								  char* PropertyList,
								  CIMC_Error **pError);

CIMC_ObjectPath * AssociatorNames(void *client_config,CIMC_ObjectName *pObjectName,
								  CIMC_ClassName *pAssocClass,
								  CIMC_ClassName *pResultClass,
								  char *Role,
								  char *ResultRole,
								  CIMC_Error **pError);

CIMC_ObjectWithPath * References(void *client_config,CIMC_ObjectName *pObjectName,
								 CIMC_ClassName *pResultClass,
								 char *Role,
								 int includeQualifiers,
								 int includeClassOrigin,
								 char* PropertyList,
								 CIMC_Error **pError);

CIMC_ObjectPath * ReferenceNames(void *client_config,CIMC_ObjectName *pObjectName,
								 CIMC_ClassName *pResultClass,
								 char *Role,
								 CIMC_Error **pError);

CIMC_InstanceName *CIM_CreateInstance(void *client_config,CIMC_Instance *pInstance,
							 CIMC_Error **pError);

void ModifyInstance(void *client_config,CIMC_NamedInstance *pNamedInstance,
					int includeQualifiers,
					char *propertyList,
					CIMC_Error **pError);

void DeleteInstance(void *client_config,CIMC_InstanceName *pInstanceName,
					 CIMC_Error **pError);

int invokeMethod(void *client_config,CIMC_InstanceName *pInstanceName,char *methodCallName,CIMC_ParamValue *pParamValues,CIMC_ParamValue **pOutputParamValue,CIMC_Error **pError);

CIMC_ObjectWithPath *ExecQuery(void *client_config,char *QueryLanguage,
			char *Query,
			CIMC_Error **pError
			);

int CIMC_GetUserNameFromHandle(void *client_handle,char *Username);

int CIMC_GetPassWordFromHandle(void *client_handle,char *password);

// Converts given CIMC_DateTime to string and puts it in cimValue;
// cimValue MUST BE of size CIM_DATETIME_TEXT_LEN
int CIMC_ConvertDateTimeToString(CIMC_DateTime *pDateTime, char *cimValue);

// Converts given CIMC_Interval to string and puts it in cimValue;
// cimValue MUST BE of size CIM_DATETIME_TEXT_LEN
int CIMC_ConvertIntervalToString(CIMC_Interval *pInterval, char *cimValue);

#endif
