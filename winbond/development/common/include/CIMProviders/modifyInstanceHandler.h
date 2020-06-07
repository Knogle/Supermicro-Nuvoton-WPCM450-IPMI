#ifndef _MOD_INST_HANDLER_H_
#define _MOD_INST_HANDLER_H_

#include "cmpidt.h"
#include "cmpift.h"
#include "cmpimacs.h"

#include "Common.h"

#define MAX_LEN 256

typedef struct  {
	char propertyName[MAX_LEN];
	CMPIData data; 
	
}CMPI_Property;


typedef struct prop_list {
	CMPI_Property properties[MAX_LEN];
	int length;
	
} CMPI_PropertyList;

int getModifiableProperties(const CMPIInstance *mi,
				const CMPIInstance *ci,
				const char **propertyList,
				CMPI_PropertyList *defaults,
				CMPI_PropertyList *modifiableProperties,
				char *error);

int Check_Capabilities(const CMPIBroker * _broker,
			const CMPIContext * ctx,
			const CMPIObjectPath * cop,
			const char * assocclass,
			const char * resultclass,
			char **prop_value,
			char *propertyName,
			CMPIStatus * rc);

void AddTo_DefaultList(CMPI_PropertyList *defaults, char * propName, int count);

#endif

