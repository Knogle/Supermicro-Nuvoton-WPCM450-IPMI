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
************************************************************************************************/
#ifndef _PROVIDERUTILITY_H_
#define _PROVIDERUTILITY_H_

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <Common.h>

#include "cmpidt.h"
#include "cmpift.h"
#include "cmpimacs.h"
#include "libipmi_session.h"
#include "libipmi_errorcodes.h"
#include "libipmi_AppDevice.h"
#include "libipmi_StorDevice.h"
#include "libipmi_sensor.h"
#include "libipmi_XportDevice.h"
#include "libipmi_ChassisDevice.h"
#include "IPMI_SDRRecord.h"
#include "IPMI_ChassisDevice.h"
#include "libipmi_fru.h"
#include "IPMI_Includes.h"
#include "DmiInfo.h"
#include "cel.h"
#include "cmc_sw_event.h"
#include "PetToPem.h"
#include "Porting_Common.h"
#include "SFCB_Specific.h"
#include <syslog.h>

#define REX_KEY_TAB             '\t'
#define REX_KEY_SPACE           ' '

#define TRUE 1
#define FALSE 0

#define FAILURE 1
#define SUCCESS 0
#define UNSUPPORTED 7

#define PROV_LOCK_READ 0
#define PROV_LOCK_WRITE 1

#define PROPLENGTH 64

#ifndef IPMI_TIMEOUT
#define IPMI_TIMEOUT 10
#endif

#define IPMI_FAILURE 100
#define MAX_LINE_LEN   1024
#define IND_NAMESPACE  "root/cimv2"

#define SNMP_INDEX           0

#define CONF_INIFILE 		CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/IPMI_Conf.ini"
#define SENSOR_INIFILE         	CFG_PROJ_TEMP_CONFIG_PATH"/etc/Providers/IPMI_Sensor_Profile.ini"
#define ASSOCIATION_INIFILE		CFG_PROJ_TEMP_CONFIG_PATH"/etc/Providers/Profiles.ini"

#define REQ_ST_INIFILE		CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/RequestedStates.ini"

//!***************** SNMP Configuration Files for SNMP LOCKS ***************************
#define SNMPCONF		CFG_PROJ_PERM_CONFIG_PATH "etc/snmpd.conf"
#define VAR_SNMPCONF	"/var/lib/net-snmp/snmpd.conf"
#define PRVCYPWDCONF	CFG_PROJ_PERM_CONFIG_PATH"SnmpPasswd.conf"
#define SNMPCMTYINI		CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/SNMPCommunityString.ini" 
//!**************************************************************************************

#define PROV_STRNCPY(dest, source, size) \
	{ \
		strncpy(dest, source, size-1);\
		dest[size-1] = '\0';\
	}

#define SET_ACCESS_ERROR(broker, rc, username) \
	{ \
		char err[256]; \
		_DEBUG_MSG(1, "%s not authorized for this operation\n", username); \
		sprintf(err, "User ID %s does not have proper privileges", username); \
		CMSetStatusWithChars( broker, rc, CMPI_RC_ERR_ACCESS_DENIED, err); \
	}


/*
 * @define      CONFFILE
 * @brief       Path of snmps config file
 */
#define CONFSNMPFILE         CFG_PROJ_PERM_CONFIG_PATH"etc/snmpd.conf"
#define TEMPSNMPFILE         CFG_PROJ_PERM_CONFIG_PATH"snmpdT.conf"

#define COMMENT "#@!"
#define TRAPPORT "#AMI-SNMPTrap"
#define ENABLEDVERSIONS "#AMI-EnabledSNMPVersions"

#define VERSION3 3

/*
 * @define      CURRENTPORT_CONFIGFILE
 * @brief       Path of CIM_SSH config file
 */
#define CURRENTPORT_CONFIGFILE          CFG_PROJ_PERM_CONFIG_PATH"/etc/Providers/CurrentPorts.conf"

int ConvertMessage(const CMPIBroker * shared_broker,
                        const CMPIContext * shared_Context,
                        PEMEvent_T  * pemEvt,
                        CELEvent_T *celEvt);

#ifndef CORE_TYPES_H

typedef unsigned char  uint8;
typedef char  BOOL;

// IPMI coreTypes.h
typedef unsigned short  uint16;
typedef unsigned long   uint32;

#endif

typedef char * string;
typedef int sint32;
typedef char  boolean;
typedef long uint64;
typedef unsigned long long datetime;

typedef struct {
	char * providerName;
	int lock;
}Prov_Init_T;

typedef struct
{
        char * Name;
        char * ip;
        int portNo;
        char * userName;
        char * passWd;
        int clientAddr;
        int BMCAddr;
        int Auth_Type;
        int Privilege;
	int ConnectionProtocol;
	int OSShutDownMaxTime;
}Session_T;




#define SDR_READING_UNSIGNED    ( (u8)0 )
#define SDR_READING_1SCOMP      ( (u8)1 )
#define SDR_READING_2SCOMP      ( (u8)2 )
#define SDR_READING_NONANALOG   ( (u8)3 )
#define s8 char
#define MAX_NUMERIC_STR 16
#define SENSOR_DEVICEID_LEN 4
#define SENSOR_DEVICEID_SERVERNAME_LEN 32
#define NAMESPACE "root/cimv2"
#define DEVICECOUNT 16
#define ISCOMPSYSTEM    1
#define ISSENSOR        2
#define ISLOGICALDEVICE 3
#define ISPHYSICALDEVICE 4
#define ISRECORDLOG     5
#define ISNOTMAPPED     6
#define ISMANAGEDELEMENT 7
#define ISMANAGEDSYSTEMELEMENT 8
#define ISACCOUNT       9
#define ISREDUNDANCYSET 10
#define DEFAULT_SHUTDOWNTIME 60
typedef struct Sensor
{
 	char MaxReading[MAX_NUMERIC_STR]; /** MaxRedable property of Sensor instance **/
 	char MinReading[MAX_NUMERIC_STR]; /** MinRedable property of Sensor instance **/
 	char Resolution[MAX_NUMERIC_STR]; /** resolution property of Sensor instance **/
 	char UnitModifier[MAX_NUMERIC_STR]; /** UnitModifier property of Sensor instance **/
 	char Tolerance[MAX_NUMERIC_STR]; /** Tolerance property of Sensor instance **/
 	char Accuracy[MAX_NUMERIC_STR]; /** Accuracy property of Sensor instance **/
 	
}Sensor_T;


typedef struct {
        char SensorType[SENSOR_DEVICEID_LEN];
        char SensorNumber[SENSOR_DEVICEID_LEN];
        char OwnerLUN[SENSOR_DEVICEID_LEN];
        char OwnerID[SENSOR_DEVICEID_LEN];
        char EventType[SENSOR_DEVICEID_LEN];
        char Offset[SENSOR_DEVICEID_LEN];
        char ServerName[SENSOR_DEVICEID_SERVERNAME_LEN];
}ParsedSensorDeviceID_T;

typedef struct {
        char * Name;
        int Value;

}DeviceType;

/* Wbemuri Parser */

typedef enum  {

    WBEMURI_TYPEDNAMESPACEPATH,
    WBEMURI_TYPEDCLASSPATH,
    WBEMURI_TYPEDINSTANCEPATH,
    WBEMURI_TYPEDQUALIFIERTYPEPATH,
    WBEMURI_UNTYPEDNAMESPACEPATH,
    WBEMURI_UNTYPEDCLASSPATH,
    WBEMURI_UNTYPEDINSTANCEPATH

} WbemuriType_T;

typedef struct {

    char Property[256];
    char Value[256];

} ObjKey_T;

typedef struct {

    WbemuriType_T Type;
    char namespaceType[256];
    char authority[256];
    char namespaceName[256];
    char className[256];
    ObjKey_T key_value_pairs[5];
    int keyCount;

}WBEMURI_T;

#ifdef DMTF_BootControl
/** The following Macros are used in Boot Control Profile **/
/** Refer IPMI Specification - Table for "Boot Option Parameters" **/

#define BD_NONE (0x00)
#define BD_PXE (0x04)
#define BD_HARDDRIVE (0x08)
#define BD_HARDDRIVE_SAFEMODE (0x0C)
#define BD_DIAG (0x10)
#define BD_CD_DVD (0x14)
#define BD_BIOS (0x18)
#define BD_FLOPPY_USB (0x3C)
#define BD_ALL (BD_NONE | BD_PXE | BD_HARDDRIVE | BD_HARDDRIVE_SAFEMODE | BD_DIAG | BD_CD_DVD | BD_BIOS | BD_FLOPPY_USB)
#define BD_INVALID -1

#endif //DMTF_BootControl

/*****************/


int GetArrayCount(char * value, char *** resStrings, uint16 * Count);
char * ExtractValue(char *line);
char * RexSkipWhiteSpaces(char *Str);
char * RexSkipTrailingWhiteSpaces(char *Str);

int CreateSession(IPMI20_SESSION_T *hSession, Session_T session);
int GetSDRCount(IPMI20_SESSION_T *hSession,int *maxSdrLen, int * sdrCount);
int Get_Session_List(Session_T ** session_List, int * Session_Count);
int FillSessionStruct(Session_T * sptr, char * key, char * value);
int free_Session_List(int Session_Count, Session_T * session_List);

/** Gets SEL Event Description **/
int GetSELEvtDescription(SELEventRecord_T *selEvtRecord,char *EvtDescription);

int IpmiSensorReadingConversion( int x, u8 L, int M, int B,int K1, int K2, float *y );

int GetSensorUnitString(int BaseUnits,int UnitModifier,char *UnitString);

int GetSensorTypeFromSDR(int SensorNum,int OwnerLUN,int OwnerID,int *Type);

int rename_local(char *temp,char *perm);
long GetTimeInSeconds();
int SetTimeInSeconds(long seconds,long useconds);
int GetLineFromFile(FILE * fd, char * line);
int PROV_ProcessIniFile
        (char * FileName, char * ClassName,
         void * listPtr,
         int (*FillValue)(void *, char *, char *),
         int (*Append_list)(void *, void *));

int GetKeyValue(char * line, char ** key, char ** value);

int GetSMBIOSInfo(int nType, int *pInsCount, char *strDmi, int **ppIndex,smb_info_T **ppSmbInfo);
int ConvertReading(Sensor_T *sensorReadings, char *rawValue, float *converted_value );
float power( int base, int power );
int GetCurrentCimPowerState(char * systemName, unsigned int *PowerState, char *OtherPowerState);
int CreateInstModification(const CMPIBroker * _broker,
                     const CMPIContext * ctx,
                     CMPIInstance * PrevInst,
                     CMPIInstance * SourceInst,
                     CMPIStatus * rc);
int PROV_FillValue(char ** Name, char * value);
int GetUserForAuthentication(const CMPIBroker * _broker,
                       const CMPIContext * ctx,
                       char ** username);

int GetPortFromLine(char * pStrLine, char * pStrKey,
                    unsigned long * pulPort);

int ConvertStrToIP(char * ip, unsigned char * ipnum);

void ConvertIPorMACnumToStr(unsigned char *var,
                            int len, char *string,
                            char *sep);

int GetMACAddress(char *mac_str, uint8_t *mac_addr);

void ConvertMACNumToMACFormatStr(unsigned char *var, char *string);

int ConvertStrToMAC(char * MAC, unsigned char * out);

extern int IsUserAccountManagementPermitted(char *username);

int IsDeepInheritanceTrue(const CMPIContext * ctx);

CMPIInstance * CreateCMPIInstance(const CMPIBroker * broker, const char * NameSpace,
		                  const char * ClassName, CMPIStatus * rc);

int CheckForValidObjectPath(const CMPIBroker * _broker,
			const CMPIObjectPath * cop,
                        char ** ppKeyName, 
			CMPIString ** value,
                        int nPropCount, CMPIStatus * rc);

// Checks for valid string without junk data
int CheckForAscii(char * pValue, int nLen);

int ReturnParsedSensorDeviceID (char * SensorDeviceID,
	ParsedSensorDeviceID_T * pSenDevID);

int GetComputerSystemPropertyVal(const CMPIBroker * shared_broker,
                const CMPIContext * shared_Context,char * strProperty, 
		char * strPropertyValue, char * strAlertingManagedElement);
int GetSensorPropertyValue (const CMPIBroker * shared_broker,
                const CMPIContext * shared_Context,
                CMPIInstance * inst, char * strProperty,
                char * strPropertyValue,  char * strAlertingManagedElement);
int GetDevicePropertyValue(const CMPIBroker * shared_broker,
        const CMPIContext * shared_Context,
        CMPIObjectPath * op, char * strProperty,
        char * strPropertyValue, char * strResultClass, 
	char * strAlertingManagedElement);

int GetDynamicElementName(const CMPIBroker * shared_broker,
          const CMPIContext * shared_Context, int SensorNumber, CMPIInstance * inst,
        char * strClassName_Property, char * strElementName,  
	char * strAlertingManagedElement);

int ReturnElementName(CMPIInstance * ci, char * strProperty,
            char * strElementName);

int GetSensorInstance(const CMPIBroker * shared_broker,
        const CMPIContext * shared_Context,INT8U nSensorNumber,
        CMPIInstance ** inst, CMPIObjectPath ** op,
        int nType);

int GetRecordLogPropertyValue(const CMPIBroker * shared_broker,
        const CMPIContext * shared_Context, char * strProperty,
        char * strPropertyValue,  char * strAlertingManagedElement);

CMPIInstance * GetSpecificEventSensorObjectInstances (int SensorNumber, CMPIEnumeration * pTempSensorObjectPaths);

int IsEventingSensor(char * SensorDeviceID, int SensorNumber);
CMPIEnumeration * CacheSensorInstances(const CMPIBroker * shared_broker,
        const CMPIContext * shared_Context);

int GetRedundancySetPropertyValue (const CMPIBroker * shared_broker,
        const CMPIContext * shared_Context, CMPIInstance * ci,
        char * strProperty, char * strPropertyValue, char * strAlertingManagedElemen);

int ReturnRedundancySetSensorNumber (char * RSet_DeviceID);

uint16 ReadRequestedState(char * pFileName, char * pRecordName);

int WriteRequestedState(int reqState, char * pFileName, char * pRecordName);

/* WBEMURI Parser */

int WbemuriParser(char * wbemuri, WBEMURI_T * parsedURI, char ** msg);

int ConvertActualToRawReading(Sensor_T *sensorReadings, float convertedValue, int * rawvalue);
int IpmiRawReadingConversion( int * x, u8 L, int M, int B,int K1, int K2, float y );


#ifdef DMTF_BootControl

int GetBootDevice(char * systemName, int *bootdevice);

#endif //DMTF_BootControl

//!**************************DB_Utility - APIs*******************************
/*
#define SUCCESS 0
#define FAILURE 1
#define TRUE 1
#define FALSE 0
*/
 
#define DB_UINT16 0
#define DB_UINT32 1
#define DB_UINT64 2
#define DB_STRING 3
#define DB_BOOLEAN 4
#define DB_UINT16A 5
#define DB_STRINGA 6
#define DB_UINT8A 7

/*
typedef unsigned char  uint8;
typedef char  BOOL;

// IPMI coreTypes.h
typedef unsigned short  uint16;
typedef unsigned long   uint32;

typedef char * string;
typedef int sint32;
typedef long uint64;
typedef char boolean;
typedef unsigned long long datetime;
*/

//!This API Loads the db and returns the handle.
void * LoadDB(char * dbName);
//! This Unloads the DB(INI file).
void UnLoadDB(void * handle);
//!This API Gives the record count for the given type(classname).
int GetDBRecordTypeCount(void * handle, char * type);
//! Returns the value for the given key and the property. The allocation will be performed in the provider side Utility has to just fill the value, so size is needed [2] is for 2 dimensional value.
uint16 GetValueByName(void * handle, char * key, int index, char * strName, int nType, void * value, int * nSize);
//! Sets the value in the handle for the given key and its property.
int SetValueByName(void * handle, char * key, int index, char * strName, int nType, void * value, int * nSize);
//! This writes the Modified content in the DB.
int CommitDB(void * handle, char * dbName);
//! This looks for the given key values in the DB and returns the index.
boolean IsRecordExist(void * handle, char ** name, void * value, int nSize, 
	char * strType, int Prop_Val_Count, int * index);
//! This Deletes the whole record and move the last record into the deleted index. Finally delete the last record.
int DeleteRecordByKey(void * handle, char * key, int index, char ** PropertyList, int Property_Count);
//! This Reloads the DataBase.
void * ReloadDB(char * dbName, void * handle);

int GetDBRecordCount(void * handle);

//! This returns the section name for the given indexed record in the DB
char * GetDBRecordName(void * handle, int nIndex);

//! Returns the value from the given record and property
uint16 GetValueByRecordKey(void * handle, char * key, char * strName, char * value, int nSize);

//! Sets the value in the handle for the given key and its property.
int SetValueByRecordKey(void * handle, char * key, char * strPropertyName, char * propertyValue, int nSize);

//!**********************************************************************************

/******************   Semaphore.h *****************/

int ProviderInitialize(Prov_Init_T * initstruct);
int ProviderClean(Prov_Init_T * initstruct);

int GetFileLock(char * file, char nLockType);
int ReleaseFileLock(char * file, char nLockType);

//! Check for type validation on CMPI data, return code >0 means its valid
int IsValidType(char *strVal,CMPIType type);

int MakeErrorString(char **errorDescription,char *errorString );
int ReturnErrorCode(int errorCode);

int GetBladeName(char * systemName, char ** bladeName);

int GetSNMPLocks();

int ReleaseSNMPLocks();

int email_validation(char *email);

int GetIPMISession(char *pstrSystemName, IPMI20_SESSION_T **ppIPMI_Session);

uint16 GetFRUData(IPMI20_SESSION_T *pSession,
			u8 fru_device_id,
			u32* p_fru_size,
			FRUData_T* fru_data,
			int timeout);

int FreeFRUData(FRUData_T fru_data);

int ValidateDate(int year, int month, int day, char ** err);
int ValidateTime(int hour, int min, int sec, char ** err);

//! Checks for Valid IP Address
int IsValidIP(char * pIPAddress);

/****************** logDevHealthState.h ******************************/

//! Initialize by fetching all device associated sensors
int InitAssociatedSensors(char * pClassName);

int GetLogicalDeviceState(const CMPIBroker * _broker,
					const CMPIContext * ctx,
					const CMPIObjectPath * cop,
					uint16_t * nHealthState,
					uint16_t * nOperationalStatus);

int AssociatedSensorsCleanup();

/**********************************************************************/
int ExistsInList(const char **properties, char* property);

#define Dup_string_Array(broker, count, strarr) ({\
	CMPIArray *a = NULL;\
	if (sizeof(*(strarr)) != sizeof(char *))\
		a = Dup_const_string_Array((_broker),(count),(char **)(strarr),sizeof(*(strarr)));\
	else \
		a =Dup_variable_string_Array((_broker),(count),(char **)(strarr));\
	a;\
})

CMPIArray* Dup_variable_string_Array(const CMPIBroker * _broker, int count, char **src);

CMPIArray* Dup_uint16_Array(const CMPIBroker * _broker, int count, uint16 *src);

CMPIArray* Dup_const_string_Array(const CMPIBroker * _broker, int count, char **src, int len);

#endif



