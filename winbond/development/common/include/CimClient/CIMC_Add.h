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

 * FileName    : CIMC_Add.h
 * Description : 
 * Author      : Yogeswaran. T
		 Hari .v
 
************************************************************************************************/

#ifndef _CIMC_ADD

#define _CIMC_ADD

#include "CIMC_Include.h"

//XML Parser include files
#include "tree.h"
#include "include.h"
#include "sparser.h"


struct stack CreatePropertyArray(xmlNode *CIMnode,void *ParentAddr);//1
struct stack CreateProperty(xmlNode *CIMnode,void *ParentAddr);//2
struct stack CreateValue(xmlNode *CIMnode,void *ParentAddr);//3
struct stack CreateValueArray(xmlNode *CIMnode,void *ParentAddr);//4
struct stack CreateClass(xmlNode *CIMnode,void *ParentAddr);//5
struct stack CreateIReturnValue(xmlNode *CIMnode,void *ParentAddr);//6
struct stack CreateIMethodResponse(xmlNode *CIMnode,void *ParentAddr);//7
struct stack CreateSimpleRsp(xmlNode *CIMnode,void *ParentAddr);//8
struct stack CreateMessage(xmlNode *CIMnode,void *ParentAddr);//9
struct stack CreateCIM(xmlNode *CIMnode,void *ParentAddr);//10
struct stack CreateQualifier(xmlNode *CIMnode,void *ParentAddr);//11
struct stack CreateClassName(xmlNode *CIMnode,void *ParentAddr);//12
struct stack CreateNamespace(xmlNode *CIMnode,void *ParentAddr);//13
struct stack CreateLocalNamespacePath(xmlNode *CIMnode,void *ParentAddr);//14
struct stack CreateNamespacePath(xmlNode *CIMnode,void *ParentAddr);//15
struct stack CreateClassPath(xmlNode *CIMnode,void *ParentAddr);//16
struct stack CreateLocalClassPath(xmlNode *CIMnode,void *ParentAddr);//17
struct stack CreateKeyValue(xmlNode *CIMnode,void *ParentAddr);//18
struct stack CreateKeyBinding(xmlNode *CIMnode,void *ParentAddr);//19
struct stack CreateInstanceName(xmlNode *CIMnode,void *ParentAddr);//20
struct stack CreateInstancePath(xmlNode *CIMnode,void *ParentAddr);//21
struct stack CreateLocalInstancePath(xmlNode *CIMnode,void *ParentAddr);//22
struct stack CreateValueReference(xmlNode *CIMnode,void *ParentAddr);//23
struct stack CreatePropertyReference(xmlNode *CIMnode,void *ParentAddr);//24
struct stack CreateParameter(xmlNode *CIMnode,void *ParentAddr);//25
struct stack CreateParameterReference(xmlNode *CIMnode,void *ParentAddr);//26
struct stack CreateParameterArray(xmlNode *CIMnode,void *ParentAddr);//27
struct stack CreateParameterRefArray(xmlNode *CIMnode,void *ParentAddr);//28
struct stack CreateMethod(xmlNode *CIMnode,void *ParentAddr);//29
struct stack CreateQualifierDecl(xmlNode *CIMnode,void *ParentAddr);//30
struct stack CreateInstance(xmlNode *CIMnode,void *ParentAddr);//31
struct stack CreateNamedInstance(xmlNode *CIMnode,void *ParentAddr);//32
struct stack CreateIParamValue(xmlNode *CIMnode,void *ParentAddr);//33
struct stack CreateResponseDestination(xmlNode *CIMnode,void *ParentAddr);//34
struct stack CreateIMethodCall(xmlNode *CIMnode,void *ParentAddr);//35
struct stack CreateSimpleReq(xmlNode *CIMnode,void *ParentAddr);//36
struct stack CreateError(xmlNode *CIMnode,void *ParentAddr);//37
struct stack CreateObjectWithPath(xmlNode *CIMnode,void *ParentAddr);//38
struct stack CreateObjectWithLocalPath(xmlNode *CIMnode,void *ParentAddr);//39
struct stack CreateObject(xmlNode *CIMnode,void *ParentAddr);//40
struct stack CreateObjectPath(xmlNode *CIMnode,void *ParentAddr);//41
struct stack CreateDeclaration(xmlNode *CIMnode,void *ParentAddr);//42
struct stack CreateDeclGroup(xmlNode *CIMnode,void *ParentAddr);//43
struct stack CreateDeclGroupWithName(xmlNode *CIMnode,void *ParentAddr);//44
struct stack CreateDeclGroupWithPath(xmlNode *CIMnode,void *ParentAddr);//45
struct stack CreateValueRefArray(xmlNode *CIMnode,void *ParentAddr);//46
struct stack CreateNamedObject(xmlNode *CIMnode,void *ParentAddr);//47
struct stack CreateValueNull(xmlNode *CIMnode,void *ParentAddr);//48
struct stack CreateTableCellDecl(xmlNode *CIMnode,void *ParentAddr);//49
struct stack CreateTableCellReference(xmlNode *CIMnode,void *ParentAddr);//50
struct stack CreateTableRowDecl(xmlNode *CIMnode,void *ParentAddr);//51
struct stack CreateTable(xmlNode *CIMnode,void *ParentAddr);//52
struct stack CreateTableRow(xmlNode *CIMnode,void *ParentAddr);//53
struct stack CreateMultiReq(xmlNode *CIMnode,void *ParentAddr);//54
struct stack CreateMethodCall(xmlNode *CIMnode,void *ParentAddr);//55
struct stack CreateParamValue(xmlNode *CIMnode,void *ParentAddr);//56
struct stack CreateMultiRsp(xmlNode *CIMnode,void *ParentAddr);//57
struct stack CreateMethodResponse(xmlNode *CIMnode,void *ParentAddr);//58
struct stack CreateReturnValue(xmlNode *CIMnode,void *ParentAddr);//59
struct stack CreateMultiExpReq(xmlNode *CIMnode,void *ParentAddr);//60
struct stack CreateSimpleExpReq(xmlNode *CIMnode,void *ParentAddr);//61
struct stack CreateExpMethodCall(xmlNode *CIMnode,void *ParentAddr);//62
struct stack CreateMultiExpRsp(xmlNode *CIMnode,void *ParentAddr);//63
struct stack CreateSimpleExpRsp(xmlNode *CIMnode,void *ParentAddr);//64
struct stack CreateExpMethodResponse(xmlNode *CIMnode,void *ParentAddr);//65
struct stack CreateExpParamValue(xmlNode *CIMnode,void *ParentAddr);//66
struct stack CreateSimpleReqAck(xmlNode *CIMnode,void *ParentAddr);//67
struct stack CreateHost(xmlNode *CIMnode,void *ParentAddr);//68
int ParseCDataContent(char *xmlString,CIMC_Instance **pInstanceNode);

#endif

