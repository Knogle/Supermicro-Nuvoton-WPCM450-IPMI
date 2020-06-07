
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

 * FileName    :  cmpimap.h
 * Description :  Function table to CMPI functions
 * Author      :  Hari .v


************************************************************************************************/


#ifndef _CMPIC_H_
#define _CMPIC_H_


#include "cmpidt.h"



typedef struct _CMPIConstClass     CMPIConstClass;



typedef struct _CMPIConstClassFT {


     int ftVersion;

           CMPIStatus (*release)
              (CMPIConstClass* ccls);


     CMPIConstClass* (*clone)
              (CMPIConstClass* ccls, CMPIStatus* rc);

     CMPIString *(*getClassName)
              ( CMPIConstClass * ccls, CMPIStatus * rc );


     CMPIData (*getProperty)
              (CMPIConstClass* ccls, const char *name, CMPIStatus* rc);


     CMPIData (*getPropertyAt)
              (CMPIConstClass* ccls, unsigned int index, CMPIString** name,
	       CMPIStatus* rc);


     unsigned int (*getPropertyCount)
              (CMPIConstClass* ccls, CMPIStatus* rc);


     CMPIData (*getQualifier)
              (CMPIConstClass * ccls,const char *name, CMPIStatus* rc);
     CMPIData (*getQualifierAt)
              (CMPIConstClass * ccls,unsigned int index, CMPIString** name,
	       CMPIStatus* rc);
     unsigned int (*getQualifierCount)
              (CMPIConstClass * ccls,CMPIStatus* rc);


     CMPIData (*getPropertyQualifier)
              (CMPIConstClass * ccls,const char *pname, const char *qname, CMPIStatus* rc);
     CMPIData (*getPropertyQualifierAt)
              (CMPIConstClass * ccls,const char *pname, unsigned int index, CMPIString** name,
	       CMPIStatus* rc);
     unsigned int (*getPropertyQualifierCount)
              (CMPIConstClass * ccls,const char *pname, CMPIStatus* rc);

} CMPIConstClassFT;


struct _CMPIConstClass {
   void *hdl;
   CMPIConstClassFT *ft;
};





struct _CMCIClient;
typedef struct _CMCIClient CMCIClient;

struct _CMCIConnection;
typedef struct _CMCIConnection CMCIConnection;

struct _ClientEnc;
typedef struct _ClientEnc ClientEnc;

typedef struct _CMCIClientFT {


     int ftVersion;


     CMPIStatus (*release)
              (CMCIClient* cl);


     CMCIClient *(*clone) ( CMCIClient * cl, CMPIStatus * st );



     CMPIConstClass* (*getClass)
              (CMCIClient* cl,
              CMPIObjectPath* op, CMPIFlags flags, char** properties, CMPIStatus* rc);




     CMPIEnumeration* (*enumClassNames)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIFlags flags, CMPIStatus* rc);



     CMPIEnumeration* (*enumClasses)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIFlags flags, CMPIStatus* rc);


     CMPIInstance* (*getInstance)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIFlags flags, char** properties, CMPIStatus* rc);


     CMPIObjectPath* (*createInstance)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIInstance* inst, CMPIStatus* rc);


     CMPIStatus (*setInstance)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIInstance* inst, CMPIFlags flags, char ** properties);


     CMPIStatus (*deleteInstance)
                (CMCIClient* cl,
                 CMPIObjectPath* op);


     CMPIEnumeration* (*execQuery)
                (CMCIClient* cl,
                 CMPIObjectPath* op, const char *query, const char *lang, CMPIStatus* rc);


     CMPIEnumeration* (*enumInstanceNames)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIStatus* rc);


     CMPIEnumeration* (*enumInstances)
                (CMCIClient* cl,
                 CMPIObjectPath* op, CMPIFlags flags, char** properties, CMPIStatus* rc);


     CMPIEnumeration* (*associators)
                (CMCIClient* cl,
                 CMPIObjectPath* op, const char *assocClass, const char *resultClass,
		 const char *role, const char *resultRole, CMPIFlags flags,
                 char** properties, CMPIStatus* rc);


     CMPIEnumeration* (*associatorNames)
                (CMCIClient* cl,
                 CMPIObjectPath* op, const char *assocClass, const char *resultClass,
		 const char *role, const char *resultRole, CMPIStatus* rc);


     CMPIEnumeration* (*references)
                (CMCIClient* cl,
                 CMPIObjectPath* op, const char *resultClass ,const char *role ,
		 CMPIFlags flags, char** properties, CMPIStatus* rc);


     CMPIEnumeration* (*referenceNames)
                (CMCIClient* cl,
                 CMPIObjectPath* op, const char *resultClass ,const char *role,
                 CMPIStatus* rc);


     CMPIData (*invokeMethod)
                (CMCIClient* cl,
                 CMPIObjectPath* op,const char *method,
		 CMPIArgs* in, CMPIArgs* out, CMPIStatus* rc);


     CMPIStatus (*setProperty)
                (CMCIClient* cl,
                 CMPIObjectPath* op, const char *name , CMPIValue* value,
                 CMPIType type);


     CMPIData (*getProperty)
                (CMCIClient *cl,
                 CMPIObjectPath *op, const char *name, CMPIStatus *rc);


} CMCIClientFT;


typedef struct clientData {
   char *hostName;
   char *port;
   char *user;
   char *pwd;
   char *scheme;
   int  status;
} CMCIClientData;



typedef struct credentialData {
  int    verifyMode;
  char * trustStore;
  char * certFile;
  char * keyFile;
} CMCICredentialData;

struct _CMCIClient {
   void *hdl;
   CMCIClientFT *ft;
};


#endif
