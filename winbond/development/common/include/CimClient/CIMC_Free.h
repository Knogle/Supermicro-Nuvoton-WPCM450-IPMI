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

 * FileName    : CIMC_Free.h
 * Description : 
 * Author      : Yogeswaran. T
		 Hari .v
 
************************************************************************************************/

#ifndef _CIMC_FREE

#define _CIMC_FREE

#include "CIMC_Include.h"

extern char *IPAddress; 
extern char *Namespace1; 
extern char *Namespace2;
extern char *UserName;
extern char *Password;

//1
int Free_QualifierFlavor(CIMC_QualifierFlavor *fpQualifierFlavor);

//2
int Free_Scope(CIMC_Scope *fpScope);

//3
int Free_Value(CIMC_Value *fpValue);

//4
int Free_ValueArray(CIMC_ValueArray *fpValueArray);

//5
int Free_Qualifier(CIMC_Qualifier *fpQualifier);

//6
int Free_CIMName(CIMC_CIMName *fpCIMName);

//7
int Free_CIMType(CIMC_CIMType *fpCIMType);

//8
int Free_ClassOrigin(CIMC_ClassOrigin *fpClassOrigin);

//9
int Free_Property(CIMC_Property *fpProperty);

//10
int Free_PropertyArray(CIMC_PropertyArray *fpPropertyArray);

//11
int Free_ClassName(CIMC_ClassName *fpClassName);

//12
int Free_Namespace(CIMC_Namespace *fpNamespace);

//13
int Free_LocalNamespacePath(CIMC_LocalNamespacePath *fpLocalNamespacePath);

//14
int Free_NamespacePath(CIMC_NamespacePath *fpNamespacePath);

//15
int Free_ClassPath(CIMC_ClassPath *fpClassPath);	

//16
int Free_LocalClassPath(CIMC_LocalClassPath *fpLocalClassPath);

//17
int Free_KeyValue(CIMC_KeyValue *fpKeyValue);

//18
int Free_KeyBinding(CIMC_KeyBinding *fpKeyBinding);

//19
int Free_ValueReference(CIMC_ValueReference *fpValueReference);

//20
int Free_InstancePath(CIMC_InstancePath *fpInstancePath);

//21
int Free_InstanceName(CIMC_InstanceName *fpInstanceName);

//22
int Free_LocalInstancePath(CIMC_LocalInstancePath *fpLocalInstancePath);

//23
int Free_PropertyReference(CIMC_PropertyReference *fpPropertyReference);

//24
int Free_ReferenceClass(CIMC_ReferenceClass *fpReferenceClass);

//25
int Free_Parameter(CIMC_Parameter *fpParameter);

//26
int  Free_ParameterReference(CIMC_ParameterReference *fpParameterReference);

//27
int Free_ParameterArray(CIMC_ParameterArray *fpParameterArray);

//28
int Free_ParameterRefArray(CIMC_ParameterRefArray *fpParameterRefArray);

//29
int Free_Method(CIMC_Method *fpMethod);

//30
int Free_QualifierDecl(CIMC_QualifierDecl *fpQualifierDecl);

//31
int Free_Class(CIMC_Class *fpClass);

//32
int Free_Instance(CIMC_Instance *fpInstance);

//33
int Free_NamedInstance(CIMC_NamedInstance *fpNamedInstance);

//34
int Free_IParamValue(CIMC_IParamValue *fpIParamValue);

//35
int Free_ResponseDestination(CIMC_ResponseDestination *fpResponseDestination);

//36
int Free_IMethodCall(CIMC_IMethodCall *fpIMethodCall);

//37
int Free_SimpleReq(CIMC_SimpleReq *fpSimpleReq);

//38
int Free_Message(CIMC_Message *fpMessage);

//39
int Free_CIM(CIMC_CIM *fpCIM);

//40
int Free_IReturnValue(CIMC_IReturnValue *fpIReturnValue);

//41
int Free_IMethodResponse(CIMC_IMethodResponse *fpIMethodResponse);

//42
int Free_SimpleRsp(CIMC_SimpleRsp *fpSimpleRsp);

//43
int Free_Error(CIMC_Error *fpError);

//44
int Free_ObjectWithPath(CIMC_ObjectWithPath *fpObjectWithPath);

//45
int Free_ObjectWithLocalPath(CIMC_ObjectWithLocalPath *fpObjectWithLocalPath);

//46
int Free_Object(CIMC_Object *fpObject);

//47
int Free_ObjectPath(CIMC_ObjectPath *fpObjectPath);

//48
int Free_Declaration(CIMC_Declaration *fpDeclaration);

//49
int Free_DeclGroup(CIMC_DeclGroup *fpDeclGroup);

//50
int Free_DeclGroupWithName(CIMC_DeclGroupWithName *fpDeclGroupWithName);

//51
int Free_DeclGroupWithPath(CIMC_DeclGroupWithPath *fpDeclGroupWithPath);

//52
int Free_ValueRefArray(CIMC_ValueRefArray *fpValueRefArray);

//53
int Free_NamedObject(CIMC_NamedObject *fpNamedObject);

//54
int Free_ValueNull(CIMC_ValueNull *fpValueNull);

//55
int Free_TableCellDecl(CIMC_TableCellDecl *fpTableCellDecl);

//56
int Free_TableCellReference(CIMC_TableCellReference *fpTableCellReference);

//57
int Free_TableRowDecl(CIMC_TableRowDecl *fpTableRowDecl);

//58
int Free_Table(CIMC_Table *fpTable);

//59
int Free_TableRow(CIMC_TableRow *fpTableRow);

//60
int Free_MultiReq(CIMC_MultiReq *fpMultiReq);

//61
int Free_MethodCall(CIMC_MethodCall *fpMethodCall);

//62
int Free_ParamValue(CIMC_ParamValue *fpParamValue);

//63
int Free_MultiRsp(CIMC_MultiRsp *fpMultiRsp);

//64
int Free_MethodResponse(CIMC_MethodResponse *fpMethodResponse);

//65
int Free_ReturnValue(CIMC_ReturnValue *fpReturnValue);

//66
int Free_MultiExpReq(CIMC_MultiExpReq *fpMultiExpReq);

//67
int Free_ParamType(CIMC_ParamType *fpParamType);

//68
int Free_SimpleExpReq(CIMC_SimpleExpReq *fpSimpleExpReq);

//69
int Free_ExpMethodCall(CIMC_ExpMethodCall *fpExpMethodCall);

//70
int Free_MultiExpRsp(CIMC_MultiExpRsp *fpMultiExpRsp);

//71
int Free_SimpleExpRsp(CIMC_SimpleExpRsp *fpSimpleExpRsp);

//72
int Free_ExpMethodResponse(CIMC_ExpMethodResponse *fpExpMethodResponse);

//73
int Free_ExpParamValue(CIMC_ExpParamValue *fpExpParamValue);

//74
int Free_SimpleReqAck(CIMC_SimpleReqAck *fpSimpleReqAck);

//75
int Free_Header(CIMC_CIM *fpCIM);

//76
int Free_ObjectName(CIMC_ObjectName *fpObjectName);

/* 77 */
int Free_client_Configuration(void *client_config);

//added by balaji
int Free_IParamValue_New(CIMC_IParamValue *fpIParamValue);

/* Frees only the specified node */
int Free_InstanceName_New(CIMC_InstanceName *fpInstanceName);

#endif 


