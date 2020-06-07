
/******************* SFCB_Specific.h *****************/
#ifndef __SFCB_SPECIFIC__

#define __SFCB_SPECIFIC__

#include "providerUtility.h"


CMPIArray * GetAllChildClasses(const CMPIBroker * _broker, 
	const CMPIContext * ctx,
	const char * parent, 
	const char * namespace);
CMPIObjectPath * ConvertStringToObjectPath(char *path, char **msg);
int CompareObjectPath(const CMPIObjectPath *cop1, const CMPIObjectPath *cop2);
CMPIEnumeration * ConvertArrayToEnumeration(CMPIArray * ar, CMPIStatus * rc);
void ConvertDateTimeToChars(CMPIDateTime * dt, CMPIStatus * rc, char *str_time);

void * CIMMarkHeap();
void CIMReleaseHeap(void * hc);
CMPIArray * ConvertResult2Array(CMPIResult * result);

#endif
