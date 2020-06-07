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

 * FileName    : CIMC_GenerateXML.h
 * Description : 
 * Author      : Yogeswaran. T
		 Hari .v
 
************************************************************************************************/

#ifndef _CIMC_GENERATEXML

#define _CIMC_GENERATEXML

//1
int Gen_Value(CIMC_Value *pValue, char **);

//2
int Gen_ValueArray(CIMC_ValueArray *pValueArray,char **);

//3
int Gen_CIMName(CIMC_CIMName *pCIMName,char **);

//4
int Gen_Namespace(CIMC_Namespace *pNamespace,char **);

//5
int Gen_LocalNamespacePath(CIMC_LocalNamespacePath *pLocalNamespacePath,char **);

//6
int Gen_IParamValue(CIMC_IParamValue *pIParamValue,char **);

//7
int Gen_IMethodCall(CIMC_IMethodCall *pIMethodCall,char **);

//8
int Gen_ClassName(CIMC_ClassName *pClassName,char **XML);

//9
int Gen_InstanceName(CIMC_InstanceName *pInstanceName,char **XML);

//10
int Gen_KeyValue(CIMC_KeyValue *pKeyValue,char **XML);

//11
int Gen_ValueReference(CIMC_ValueReference *pValueReference,char **XML);

//12
int Gen_Class(CIMC_Class *pClass,char **XML);

//13
int Gen_Instance(CIMC_Instance *pInstance,char **XML);

//14
int Gen_NamedInstance(CIMC_NamedInstance *pNamedInstance,char **XML);

//15
int Gen_LocalClassPath(CIMC_LocalClassPath *pLocalClassPath,char **XML);

//16
int Gen_InstancePath(CIMC_InstancePath *pInstancePath,char **XML);

//17
int Gen_QualifierDecl(CIMC_QualifierDecl *pQualifierDecl,char **XML);

//18
int Gen_QualifierFlavor(CIMC_QualifierFlavor *pQualifierFlavor,char **XML);

//19
int Gen_KeyBinding(CIMC_KeyBinding *pKeyBinding,char **XML);

//20
int Gen_ClassPath(CIMC_ClassPath *pClassPath,char **XML);

//21
int Gen_LocalInstancePath(CIMC_LocalInstancePath *pLocalInstancePath,char **XML);

//22
int Gen_NamespacePath(CIMC_NamespacePath *pNamespacePath,char **XML);

//23
int Gen_Qualifier(CIMC_Qualifier *pQualifier,char **XML);

//24
int Gen_Property(CIMC_Property *pProperty,char **XML);

//25
int Gen_ClassOrigin(CIMC_ClassOrigin *pClassOrigin, char **XML);

//26
int Gen_CIMType(CIMC_CIMType *pCIMType, char **XML);

//27
int Gen_PropertyArray(CIMC_PropertyArray *pPropertyArray, char **XML);

//28
int Gen_PropertyReference(CIMC_PropertyReference *pPropertyReference,char **XML);

//29
int Gen_ReferenceClass(CIMC_ReferenceClass *pReferenceClass,char **XML);

//30
int Gen_Method(CIMC_Method *pMethod,char **XML);

//31
int Gen_Scope(CIMC_Scope *pScope,char **XML);

//32
int Gen_ParameterArray(CIMC_ParameterArray *pParameterArray,char **XML);

//33
int  Gen_ParameterReference(CIMC_ParameterReference *pParameterReference,char **XML);

//34
int Gen_ParameterRefArray(CIMC_ParameterRefArray *pParameterRefArray,char **XML);

//35
int Gen_Parameter(CIMC_Parameter *pParameter,char **XML);

//36
int Gen_SimpleReq(CIMC_SimpleReq *pSimpleReq,char **XML);

//37
int Gen_Message(CIMC_Message *pMessage,char **XML);

//38
int Gen_CIM(CIMC_CIM *pCIM,char **XML);

//39
int Gen_ResponseDestination(CIMC_ResponseDestination *pResponseDestination,char **XML);

//40
int Gen_Error(CIMC_Error *pError,char **XML);

//41
int Gen_IReturnValue(CIMC_IReturnValue *pIReturnValue , char **XML);

//42
int Gen_IMethodResponse(CIMC_IMethodResponse *pIMethodResponse, char **XML);

//43
int Gen_SimpleRsp(CIMC_SimpleRsp *pSimpleRsp, char **XML);

//44
int Gen_ObjectWithPath(CIMC_ObjectWithPath *pObjectWithPath, char **XML);

//45
int Gen_ObjectWithLocalPath(CIMC_ObjectWithLocalPath *pObjectWithLocalPath, char **XML);

//46
int Gen_Object(CIMC_Object *pObject, char **XML);

//47
int Gen_ObjectPath(CIMC_ObjectPath *pObjectPath, char **XML);

//48
int Gen_Declaration(CIMC_Declaration *pDeclaration, char **XML);

//49
int Gen_DeclGroup(CIMC_DeclGroup *pDeclGroup, char **XML);

//50
int Gen_DeclGroupWithName(CIMC_DeclGroupWithName *pDeclGroupWithName, char **XML);

//51
int Gen_DeclGroupWithPath(CIMC_DeclGroupWithPath *pDeclGroupWithPath, char **XML);

//52
int Gen_ValueRefArray(CIMC_ValueRefArray *pValueRefArray, char **XML);

//53
int Gen_NamedObject(CIMC_NamedObject *pNamedObject, char **XML);

//54
int Gen_ValueNull(CIMC_ValueNull *pValueNull,char **XML);

//55
int Gen_MultiReq(CIMC_MultiReq *pMultiReq, char **XML);

//56
int Gen_MethodCall(CIMC_MethodCall *pMethodCall,char **XML);

//57
int Gen_ParamValue(CIMC_ParamValue *pParamValue,char **XML);

//58
int Gen_MultiRsp(CIMC_MultiRsp *pMultiRsp, char **XML);

//59
int Gen_MethodResponse(CIMC_MethodResponse *pMethodResponse, char **XML);

//60
int Gen_ReturnValue(CIMC_ReturnValue *pReturnValue, char **XML);

#endif 
