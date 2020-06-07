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

 * FileName    : CIMC_Include.h
 * Description :
 * Author      : Yogeswaran. T
		 Hari .v

************************************************************************************************/

#ifndef _CIMC_INCLUDE

//#include "cmpimap.h"

#define _CIMC_INCLUDE




#define SUCCESS 	0
#define FAILURE 	-1

#define TRUE		1
#define FALSE		0

/*----------------------------Structures-----------------------------------*/

typedef char CIMC_CIMName;
typedef char CIMC_CIMType;
typedef short CIMC_Propagated;
typedef char CIMC_ClassOrigin;
typedef int CIMC_ArraySize;
typedef char CIMC_Host;
typedef char CIMC_PCData;
typedef char CIMC_ValueType;
typedef char CIMC_ReferenceClass;
typedef char CIMC_SuperClass;
typedef short CIMC_IsArray;
typedef char CIMC_ID;
typedef char CIMC_ProtocolVer;
typedef char CIMC_CIMVersion;
typedef char CIMC_DTDVersion;
typedef char CIMC_ErrorCode;
typedef char CIMC_Description;
typedef char CIMC_ParamType;
typedef short CIMC_CellPos;
typedef short CIMC_SortPos;
typedef short CIMC_SortDir;
typedef char CIMC_InstanceID;
typedef int CIMC_CDATA_FLAG;

struct CIMC_QualifierFlavor;
struct CIMC_Scope;
struct CIMC_Value;
struct CIMC_ValueArray;
struct CIMC_Qualifier;
struct CIMC_Property;
struct CIMC_PropertyArray;
struct CIMC_ClassName;
struct CIMC_Namespace;
struct CIMC_LocalNamespacePath;
struct CIMC_NamespacePath;
struct CIMC_ClassPath;
struct CIMC_LocalClassPath;
struct CIMC_KeyValue;
struct CIMC_KeyBinding;
struct CIMC_InstanceName;
struct CIMC_InstancePath;
struct CIMC_LocalInstancePath;
struct CIMC_ValueReference;
struct CIMC_PropertyReference;
struct CIMC_Parameter;
struct CIMC_ParameterReference;
struct CIMC_ParameterArray;
struct CIMC_ParameterRefArray;
struct CIMC_Method;
struct CIMC_QualifierDecl;
struct CIMC_Class;
struct CIMC_Instance;
struct CIMC_NamedInstance;
struct CIMC_IParamValue;
struct CIMC_ResponseDestination;
struct CIMC_IMethodCall;
struct CIMC_SimpleReq;
struct CIMC_Message;
struct CIMC_CIM;
struct CIMC_Error;
struct CIMC_IReturnValue;
struct CIMC_IMethodResponse;
struct CIMC_SimpleRsp;
struct CIMC_ObjectWithPath;
struct CIMC_ObjectWithLocalPath;
struct CIMC_Object;
struct CIMC_ObjectPath;
struct CIMC_Declaration;
struct CIMC_DeclGroup;
struct CIMC_DeclGroupWithName;
struct CIMC_DeclGroupWithPath;
struct CIMC_ValueRefArray;
struct CIMC_NamedObject;
struct CIMC_ValueNull;
struct CIMC_TableCellDecl;
struct CIMC_TableCellReference;
struct CIMC_TableRowDecl;
struct CIMC_Table;
struct CIMC_TableRow;
struct CIMC_MultiReq;
struct CIMC_MethodCall;
struct CIMC_ParamValue;
struct CIMC_MultiRsp;
struct CIMC_MethodResponse;
struct CIMC_ReturnValue;
struct CIMC_MultiExpReq;
struct CIMC_SimpleExpReq;
struct CIMC_ExpMethodCall;
struct CIMC_MultiExpRsp;
struct CIMC_SimpleExpRsp;
struct CIMC_ExpMethodResponse;
struct CIMC_ExpParamValue;
struct CIMC_SimpleReqAck;



typedef struct CIMC_QualifierFlavor
{
	short Overridable;
	short ToSubClass;
	short ToInstance;
	short Translatable;

}CIMC_QualifierFlavor;

typedef struct CIMC_Scope
{
	short Class;
	short Association;
	short Reference;
	short Property;
	short Method;
	short Parameter;
	short Indication;
}CIMC_Scope;

typedef struct CIMC_Value
{
	char *value;

	//Added to include embedded instance (CDATA section)
	struct CIMC_Instance *pInstance;
	int CDATAFlag;

	struct CIMC_Value *pNext;
}CIMC_Value;


typedef struct CIMC_ValueArray
{
	CIMC_Value *pValue;

	struct CIMC_ValueArray *pNext;
}CIMC_ValueArray;


typedef struct CIMC_Qualifier
{

	CIMC_Value *pValue;
	CIMC_ValueArray *pValueArray;

	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_Propagated propagated;
	CIMC_QualifierFlavor *pQualifierFlavor;
	struct CIMC_Qualifier *pNext;

}CIMC_Qualifier;


typedef struct CIMC_Property
{
	CIMC_Qualifier *pQualifier;
	CIMC_Value *pValue;
	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_ClassOrigin *pClassOrigin;
	CIMC_Propagated propagated;
	struct CIMC_Property *pNext;

}CIMC_Property;

typedef struct CIMC_PropertyArray
{
	CIMC_Qualifier *pQualifier;
	CIMC_ValueArray *pValueArray;
	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_ArraySize arraySize;
	CIMC_ClassOrigin *pClassOrigin;
	CIMC_Propagated propagated;
	struct CIMC_PropertyArray *pNext;

}CIMC_PropertyArray;

typedef struct CIMC_ClassName
{
	CIMC_CIMName *pCIMName;
	struct CIMC_ClassName *pNext;

}CIMC_ClassName;

typedef struct CIMC_Namespace
{
	CIMC_CIMName *pCIMName;
	struct CIMC_Namespace *pNext;

}CIMC_Namespace;

typedef struct CIMC_LocalNamespacePath
{
	CIMC_Namespace *pNamespace;

}CIMC_LocalNamespacePath;

typedef struct CIMC_NamespacePath
{
	CIMC_Host *pHost;
	CIMC_LocalNamespacePath *pLocalNamespacePath;

}CIMC_NamespacePath;

typedef struct CIMC_ClassPath
{
	CIMC_NamespacePath *pNamespacePath;
	CIMC_ClassName *pClassName;

}CIMC_ClassPath;


typedef struct CIMC_LocalClassPath
{
	CIMC_LocalNamespacePath *pLocalNamespacePath;
	CIMC_ClassName *pClassName;

}CIMC_LocalClassPath;

typedef struct CIMC_KeyValue
{
	CIMC_PCData *pPCData;
	CIMC_ValueType *pValueType;
	CIMC_CIMType *pCIMType;

}CIMC_KeyValue;


typedef struct CIMC_KeyBinding
{
		CIMC_KeyValue *pKeyValue;
		struct CIMC_ValueReference *pValueReference;
		CIMC_CIMName *pCIMName;
		struct CIMC_KeyBinding *pNext;

}CIMC_KeyBinding;

typedef struct CIMC_InstanceName
{
	CIMC_KeyBinding *pKeyBinding;
	CIMC_KeyValue *pKeyValue;
	struct CIMC_ValueReference *pValueReference;
	CIMC_ClassName *pClassName;
	struct CIMC_InstanceName *pNext;

}CIMC_InstanceName;

typedef struct CIMC_InstancePath
{
	CIMC_NamespacePath *pNamespacePath;
	CIMC_InstanceName *pInstanceName;

}CIMC_InstancePath;

typedef struct CIMC_LocalInstancePath
{
	CIMC_LocalNamespacePath *pLocalNamespacePath;
	CIMC_InstanceName *pInstanceName;

}CIMC_LocalInstancePath;

typedef struct CIMC_ValueReference
{
	CIMC_ClassPath *pClassPath;
	CIMC_LocalClassPath *pLocalClassPath;
	CIMC_ClassName *pClassName;
	CIMC_InstancePath *pInstancePath;
	CIMC_LocalInstancePath *pLocalInstancePath;
	CIMC_InstanceName *pInstanceName;
	struct CIMC_ValueReference *pNext;

}CIMC_ValueReference;

typedef struct CIMC_PropertyReference
{
	CIMC_Qualifier *pQualifier;
	CIMC_ValueReference *pValueReference;
	CIMC_CIMName *pCIMName;
	CIMC_ReferenceClass *pReferenceClass;
	CIMC_ClassOrigin *pClassOrigin;
	CIMC_Propagated propagated;
	struct CIMC_PropertyReference *pNext;

}CIMC_PropertyReference;

typedef struct CIMC_Parameter
{
	CIMC_Qualifier *pQualifier;
	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	struct CIMC_Parameter *pNext;

}CIMC_Parameter;

typedef struct CIMC_ParameterReference
{
	CIMC_Qualifier *pQualifier;
	CIMC_CIMName *pCIMName;
	CIMC_ReferenceClass *pReferenceClass;
	struct CIMC_ParameterReference *pNext;

}CIMC_ParameterReference;

typedef struct CIMC_ParameterArray
{
	CIMC_Qualifier *pQualifier;
	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_ArraySize arraySize;
	struct CIMC_ParameterArray *pNext;

}CIMC_ParameterArray;

typedef struct CIMC_ParameterRefArray
{
	CIMC_Qualifier *pQualifier;
	CIMC_CIMName *pCIMName;
	CIMC_ReferenceClass *pReferenceClass;
	CIMC_ArraySize arraySize;
	struct CIMC_ParameterRefArray *pNext;

}CIMC_ParameterRefArray;

typedef struct CIMC_Method
{
	CIMC_Qualifier *pQualifier;

	CIMC_Parameter *pParameter;
	CIMC_ParameterReference *pParameterReference;
	CIMC_ParameterArray *pParameterArray;
	CIMC_ParameterRefArray *pParameterRefArray;

	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_ClassOrigin *pClassOrigin;
	CIMC_Propagated propagated;
	struct CIMC_Method *pNext;

}CIMC_Method;

typedef struct CIMC_QualifierDecl
{
	CIMC_Scope *pScope;

	CIMC_Value *pValue;
	CIMC_ValueArray *pValueArray;

	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_IsArray isArray;
	CIMC_ArraySize arraySize;
	CIMC_QualifierFlavor *pQualifierFlavor;

	struct CIMC_QualifierDecl *pNext;

}CIMC_QualifierDecl;


typedef struct CIMC_Class
{
	CIMC_Qualifier *pQualifier;

	CIMC_Property *pProperty;
	CIMC_PropertyArray *pPropertyArray;
	CIMC_PropertyReference *pPropertyReference;

	CIMC_Method *pMethod;
	CIMC_CIMName *pCIMName;
	CIMC_SuperClass *pSuperClass;

	struct CIMC_Class *pNext;

}CIMC_Class;

typedef struct CIMC_Instance
{
	CIMC_Qualifier *pQualifier;
	CIMC_ClassName *pClassName;

	CIMC_Property *pProperty;
	CIMC_PropertyArray *pPropertyArray;
	CIMC_PropertyReference *pPropertyReference;

	struct CIMC_Instance *pNext;

}CIMC_Instance;

typedef struct CIMC_NamedInstance
{
	CIMC_InstanceName *pInstanceName;
	CIMC_Instance *pInstance;

	struct CIMC_NamedInstance *pNext;
}CIMC_NamedInstance;


typedef struct CIMC_IParamValue
{
	CIMC_CIMName *pCIMName;

	CIMC_Value *pValue;
	CIMC_ValueArray *pValueArray;
	CIMC_ValueReference *pValueReference;
	CIMC_ClassName *pClassName;
	CIMC_InstanceName *pInstanceName;
	CIMC_QualifierDecl *pQualifierDecl;
	CIMC_Class *pClass;
	CIMC_Instance *pInstance;
	CIMC_NamedInstance *pNamedInstance;

	struct CIMC_IParamValue *pNext;

}CIMC_IParamValue;

typedef struct CIMC_ResponseDestination
{
	CIMC_Instance *pInstance;

}CIMC_ResponseDestination;

typedef struct CIMC_IMethodCall
{
	CIMC_LocalNamespacePath *pLocalNamespacePath;
	CIMC_IParamValue *pIParamValue;
	CIMC_ResponseDestination *pResponseDestination;
	CIMC_CIMName *pCIMName;

}CIMC_IMethodCall;

typedef struct CIMC_SimpleReq
{
	CIMC_IMethodCall *pIMethodCall;
	struct CIMC_MethodCall *pMethodCall;
	struct CIMC_SimpleReq *pNext;

}CIMC_SimpleReq;

typedef struct CIMC_Message
{
	CIMC_ID *pID;
	CIMC_ProtocolVer *pProtocolVer;

	CIMC_SimpleReq *pSimpleReq;
	struct CIMC_MultiReq *pMultiReq;
	struct CIMC_SimpleRsp *pSimpleRsp;
	struct CIMC_MultiRsp *pMultiRsp;

	struct CIMC_SimpleExpReq *pSimpleExpReq;
	struct CIMC_MultiExpReq *pMultiExpReq;
	struct CIMC_SimpleExpRsp *pSimpleExpRsp;
	struct CIMC_MultiExpRsp *pMultiExpRsp;

}CIMC_Message;

typedef struct CIMC_CIM
{
	CIMC_Message *pMessage;
	struct CIMC_Declaration *pDeclaration;
	CIMC_CIMVersion *pCIMVersion;
	CIMC_DTDVersion *pDTDVersion;

}CIMC_CIM;

typedef struct CIMC_Error
{
	CIMC_Instance *pInstance;
	CIMC_ErrorCode *pErrorCode;
	CIMC_Description *pDescription;

}CIMC_Error;

typedef struct CIMC_IReturnValue
{
	CIMC_ClassName *pClassName;
	CIMC_InstanceName *pInstanceName;
	CIMC_Value *pValue;
	struct CIMC_ObjectWithPath *pObjectWithPath;
	struct CIMC_ObjectWithLocalPath *pObjectWithLocalPath;
	struct CIMC_Object *pObject;
	struct CIMC_ObjectPath *pObjectPath;
	CIMC_QualifierDecl *pQualifierDecl;
	CIMC_ValueArray *pValueArray;
	CIMC_ValueReference *pValueReference;
	CIMC_Class *pClass;
	CIMC_Instance *pInstance;
	CIMC_NamedInstance *pNamedInstance;

}CIMC_IReturnValue;

typedef struct CIMC_IMethodResponse
{
	CIMC_CIMName *pCIMName;
	CIMC_Error *pError;
	CIMC_IReturnValue *pIReturnValue;

}CIMC_IMethodResponse;

typedef struct CIMC_SimpleRsp
{
	struct CIMC_MethodResponse *pMethodResponse;
	CIMC_IMethodResponse *pIMethodResponse;
	struct CIMC_SimpleReqAck *pSimpleReqAck;

	struct CIMC_SimpleRsp *pNext;
}CIMC_SimpleRsp;



 typedef struct CIMC_ObjectWithPath
 {
	CIMC_ClassPath *pClassPath;
	CIMC_Class * pClass;
	CIMC_InstancePath *pInstancePath;
	CIMC_Instance *pInstance;

	struct CIMC_ObjectWithPath *pNext;

 }CIMC_ObjectWithPath;

typedef struct CIMC_ObjectWithLocalPath
{
	CIMC_LocalClassPath *pLocalClassPath;
	CIMC_Class *pClass;
	CIMC_LocalInstancePath *pLocalInstancePath;
	CIMC_Instance *pInstance;

	struct CIMC_ObjectWithLocalPath *pNext;

}CIMC_ObjectWithLocalPath;

typedef struct CIMC_Object
{
	CIMC_Class *pClass;
	CIMC_Instance *pInstance;
	struct CIMC_Object *pNext;

}CIMC_Object;

typedef struct CIMC_ObjectPath
{
	CIMC_InstancePath *pInstancePath;
	CIMC_ClassPath *pClassPath;

	struct CIMC_ObjectPath *pNext;

}CIMC_ObjectPath;


typedef struct CIMC_Declaration
{
	struct CIMC_DeclGroup *pDeclGroup;
	struct CIMC_DeclGroupWithName *pDeclGroupWithName;
	struct CIMC_DeclGroupWithPath *pDeclGroupWithPath;

}CIMC_Declaration;

typedef struct CIMC_DeclGroup
{
	CIMC_LocalNamespacePath *pLocalNamespacePath;
	CIMC_NamespacePath *pNamespacePath;
	CIMC_QualifierDecl *pQualifierDecl;
	CIMC_Object *pObject;

}CIMC_DeclGroup;

typedef struct CIMC_DeclGroupWithName
{
	CIMC_LocalNamespacePath *pLocalNamespacePath;
	CIMC_NamespacePath *pNamespacePath;
	CIMC_QualifierDecl *pQualifierDecl;
	struct CIMC_NamedObject *pNamedObject;

}CIMC_DeclGroupWithName;

typedef struct CIMC_DeclGroupWithPath
{
	CIMC_ObjectWithPath *pObjectWithPath;
	CIMC_ObjectWithLocalPath *pObjectWithLocalPath;

}CIMC_DeclGroupWithPath;

typedef struct CIMC_ValueRefArray
{
	CIMC_ValueReference *pValueReference;
	struct CIMC_ValueRefArray *pNext;

}CIMC_ValueRefArray;

typedef struct CIMC_NamedObject
{
	CIMC_Class *pClass;
	CIMC_InstanceName *pInstanceName;
	CIMC_Instance *pInstance;
	struct CIMC_NamedObject *pNext;

}CIMC_NamedObject;

typedef struct CIMC_ValueNull
{
	char *value;
	struct CIMC_ValueNull *pNext;
}CIMC_ValueNull;

typedef struct CIMC_TableCellDecl
{
	CIMC_CIMName *pCIMName;
	CIMC_CIMType *pCIMType;
	CIMC_IsArray isArray;
	CIMC_ArraySize arraySize;
	CIMC_CellPos cellPos;
	CIMC_SortPos sortPos;
	CIMC_SortDir sortDir;

	struct CIMC_TableCellDecl *pNext;
}CIMC_TableCellDecl;

typedef struct CIMC_TableCellReference
{
	CIMC_CIMName *pCIMName;
	CIMC_ReferenceClass *pReferenceClass;
	CIMC_IsArray isArray;
	CIMC_ArraySize arraySize;
	CIMC_CellPos cellPos;
	CIMC_SortPos sortPos;
	CIMC_SortDir sortDir;

	struct CIMC_TableCellReference *pNext;

}CIMC_TableCellReference;

typedef struct CIMC_TableRowDecl
{
	CIMC_TableCellDecl *pTableCellDecl;
	CIMC_TableCellReference *pTableCellReference;

}CIMC_TableRowDecl;

typedef struct CIMC_Table
{
	CIMC_TableRowDecl *pTableRowDecl;
	struct CIMC_TableRow *pTableRow;

}CIMC_Table;

typedef struct CIMC_TableRow
{
	CIMC_Value *pValue;
	CIMC_ValueArray *pValueArray;
	CIMC_ValueReference *pValueReference;
	CIMC_ValueRefArray *pValueRefArray;
	struct CIMC_ValueNull *pValueNull;

	struct CIMC_TableRow *pNext;

}CIMC_TableRow;

typedef struct CIMC_MultiReq
{
	CIMC_SimpleReq *pSimpleReq;

}CIMC_MultiReq;

typedef struct CIMC_MethodCall
{
	CIMC_CIMName *pCIMName;

	CIMC_LocalClassPath *pLocalClassPath;
	CIMC_LocalInstancePath *pLocalInstancePath;
 	struct CIMC_ParamValue *pParamValue;
	CIMC_ResponseDestination *pResponseDestination;

}CIMC_MethodCall;

typedef struct CIMC_ParamValue
{
	CIMC_CIMName *pCIMName;
	CIMC_ParamType *pParamType;
	CIMC_Value *pValue;
	CIMC_ValueReference *pValueReference;
	CIMC_ValueArray *pValueArray;
	CIMC_ValueRefArray *pValueRefArray;


	struct CIMC_ParamValue *pNext;
}CIMC_ParamValue;

typedef struct CIMC_MultiRsp
{
	CIMC_SimpleRsp *pSimpleRsp ;

}CIMC_MultiRsp;

typedef struct CIMC_MethodResponse
{
	CIMC_CIMName *pCIMName;

	CIMC_Error *pError;
	struct CIMC_ReturnValue *pReturnValue;
	CIMC_ParamValue *pParamValue;

}CIMC_MethodResponse;

typedef struct CIMC_ReturnValue
{
	CIMC_Value *pValue;
	CIMC_ValueReference *pValueReference;
	CIMC_ParamType *pParamType;

}CIMC_ReturnValue;

typedef struct CIMC_MultiExpReq
{
	struct CIMC_SimpleExpReq *pSimpleExpReq;

}CIMC_MultiExpReq;

typedef struct CIMC_SimpleExpReq
{
	struct CIMC_ExpMethodCall *pExpMethodCall;

	struct CIMC_SimpleExpReq *pNext;
}CIMC_SimpleExpReq;

typedef struct CIMC_ExpMethodCall
{
	CIMC_CIMName *pCIMName;
	struct CIMC_ExpParamValue *pExpParamValue;

}CIMC_ExpMethodCall;

typedef struct CIMC_MultiExpRsp
{
	struct CIMC_SimpleExpRsp *pSimpleExpRsp;

}CIMC_MultiExpRsp;

typedef struct CIMC_SimpleExpRsp
{
	struct CIMC_ExpMethodResponse *pExpMethodResponse;
	struct CIMC_SimpleExpRsp *pNext;

}CIMC_SimpleExpRsp;

typedef struct CIMC_ExpMethodResponse
{
	CIMC_CIMName *pCIMName;
	CIMC_Error *pError;
	CIMC_IReturnValue *pIReturnValue;

}CIMC_ExpMethodResponse;

typedef struct CIMC_ExpParamValue
{
	CIMC_CIMName *pCIMName;

	CIMC_Instance *pInstance;
	CIMC_Value *pValue;
	CIMC_MethodResponse *pMethodResponse;
	CIMC_IMethodResponse *pIMethodResponse;

	struct CIMC_ExpParamValue *pNext;

}CIMC_ExpParamValue;

typedef struct CIMC_SimpleReqAck
{
	CIMC_Error *pError;
	CIMC_InstanceID *instanceID;

}CIMC_SimpleReqAck;

/* Added on 27-NOV-06 as needed in the API */

typedef struct CIMC_ObjectName
{
	CIMC_ClassName *pClassName;
	CIMC_InstanceName *pInstanceName;

}CIMC_ObjectName;

typedef struct CIMC_PropertyValue
{
	CIMC_Value *pValue;
	CIMC_ValueArray *pValueArray;
	CIMC_ValueReference *pValueReference;

}CIMC_PropertyValue;

typedef struct CIMC_ObjectParam
{
	CIMC_Object *pObject;
	CIMC_ObjectWithLocalPath *pObjectWithLocalPath;
	CIMC_ObjectWithPath *pObjectWithPath;
	struct CIMC_ObjectParam *pNext;

}CIMC_ObjectParam;

typedef struct CIMC_InstanceValue
{
	CIMC_Instance *pInstance;
	CIMC_InstanceName *pInstanceName;

}CIMC_InstanceValue;

typedef struct CIMC_AsyncResponse
{
	CIMC_MethodResponse *pMethodResponse;
	CIMC_IMethodResponse *pIMethodResponse;

}CIMC_AsyncResponse;


typedef struct CIMC_ClientConfiguration
{
	char *IPAddress;
	int PortNumber;
	char *Namespace;
	int Timeout;
	char *UserName;
	char *Password;
	int binary_flag;
	//CMCIClient *cc;
	void *cc;

}CIMC_ClientConfiguration;

typedef struct CIMC_DateTime
{
	int year;
	int month;
	int day;
	int hour;
	int min;
	int sec;
	int microsecond;
	int utc;
}CIMC_DateTime;

typedef struct CIMC_Interval
{
	int days;
	int hours;
	int mins;
	int secs;
	int microseconds;
}CIMC_Interval;

#endif

