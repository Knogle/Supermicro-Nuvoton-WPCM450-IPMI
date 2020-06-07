/***********************************************************************************************
************************************************************************************************
**                                                                                            **
**           Copyright (c) 2006-2007, AMERICAN MEGATRENDS Inc.                                **
**                                                                                            **
**                               All Rights Reserved.                                         **
**                                                                                            **
**                      6145-F, Northbelt Parkway, Norcross,                                  **
**                                                                                            **
**                  Georgia - 30071, USA, Phone-(770)-246-8600.                               **
**                                                                                            **
************************************************************************************************
************************************************************************************************/
#ifndef _PROP_LIST_HANDLER_H_
#define _PROP_LIST_HANDLER_H_

#include "Common.h"

#define PORTING_PROP_NAME	64
#define PORTING_PROP_TYPE	16

typedef struct portinglist
{
	char name[PORTING_PROP_NAME];
	char *value;
	char type[PORTING_PROP_TYPE];
	struct portinglist *pNext;
} PropertyList;

/** Gets the OEM Specific properties **/
int getOEMProperties(char *classname,
		char *filename,
		CPL_Status_T (*Add_Values)(char *,char *,char *,PropertyList **),
		PropertyList **headNode);

/** Calls CMSetProperty to fill up the instance **/
int fillInstancevalues(CMPIInstance *ci, PropertyList * headNode,
			const CMPIBroker * _broker, const char **propertylist);

/** Frees the PropertyList strcuture **/
int freePropertyList(PropertyList *headNode);

/** Modifies the OEM Specific properties **/
int modifyInstanceHandler(const CMPIInstance * ci,
                    PropertyList *headNode, char **errorDescription,
                    CPL_Status_T (*SetProperties)(PropertyList * headNode, 
				char * pName, char * pValue, char * pKeyValue,char **errorDescription),
		    const char ** ppPropertiesList, char * pUnqKey);

/** Forms a list with OEM property name, value and type **/
int makePropertylist(PropertyList **startNode, char *key,
			char*type, char *value);

/** Edit the file pointer with OEM properties **/
int EditFpForOEMProp(PropertyList * headNode, FILE * fp,
			char * pKeyName, char * pKeyValue);

/** Frees and Allocates memory for property value **/
int ReallocateMemory(char ** ppOrigValue, char * pValue);

CPL_Status_T ListPropertyValues(char *key,char* value,char *classname,PropertyList **propList);

#endif

