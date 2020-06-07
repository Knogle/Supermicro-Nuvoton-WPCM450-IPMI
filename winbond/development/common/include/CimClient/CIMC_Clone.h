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
***********************************************************************************************/

/*!@file CIMC_Clone.h
 * @brief Declares the Clone_* API
 *
 * This file contains all the Clone_* function declarations and the necessary macros to use them
 * 
 * @author Jinesh K J <jineshkj@amiindia.co.in>
 * @date Created on Nov 14, 2007
 * @warning It is not adviced to use functions declared in this file directly. Instead, use the Clone() macro for calling these functions.
*/

#ifndef _CIMC_CLONE
#define _CIMC_CLONE

#include <CIMC_Include.h>

/*! @brief Clone a CIMC_* object
 *
 * This macro is used to clone an entire CIMC_ object. The macro calls the correct Clone_XXX() function to do the job
 *
 * @param type The type of object. For ex, for CIMC_Value, type should be written as Value
 * @param[in] pObj Pointer to the original object
 * @return Upon success the macro returns the address of newly created object and otherwise @b NULL
*/
#define Clone(type, pObj) ({ \
	typeof(pObj) pNewObj = NULL; \
	if(Clone_##type(pObj, &pNewObj) == FAILURE) { \
		Free_##type(pNewObj); \
		pNewObj = NULL; \
	} \
	pNewObj; \
})

int Clone_Value(CIMC_Value *pValue, CIMC_Value **ppValue);

int Clone_ValueArray(CIMC_ValueArray *pValArr, CIMC_ValueArray **ppValArrClone);

int Clone_CIMName(CIMC_CIMName *pName, CIMC_CIMName **ppNameClone);

int Clone_CIMType(CIMC_CIMType *pType, CIMC_CIMType **ppTypeClone);

int Clone_QualifierFlavor(CIMC_QualifierFlavor *pQualFlav,
                          CIMC_QualifierFlavor **ppQualFlavClone);

int Clone_Qualifier(CIMC_Qualifier *pQual, CIMC_Qualifier **ppQual);

int Clone_ClassName(CIMC_ClassName *pName, CIMC_ClassName **ppNameClone);

int Clone_ClassOrigin(CIMC_ClassOrigin *pClassOrigin,
                      CIMC_ClassOrigin **ppClassOriginClone);
 
int Clone_Property(CIMC_Property *pProp, CIMC_Property **ppPropClone);

int Clone_PropertyArray(CIMC_PropertyArray *pPropArr,
                        CIMC_PropertyArray  **ppPropArrClone);

int Clone_Host(CIMC_Host *pHost, CIMC_Host **ppHostClone);

int Clone_Namespace(CIMC_Namespace *pNameSpc, CIMC_Namespace **ppNameSpcClone);

int Clone_LocalNamespacePath(CIMC_LocalNamespacePath *pLocNameSpace,
                             CIMC_LocalNamespacePath **ppLocNameSpaceClone);

int Clone_NamespacePath(CIMC_NamespacePath *pNameSpace, 
                        CIMC_NamespacePath **ppNameSpaceClone);

int Clone_ClassPath(CIMC_ClassPath *pClassPath,
                    CIMC_ClassPath **ppClassPathClone);


int Clone_LocalClassPath(CIMC_LocalClassPath *pLocClassPath,
                         CIMC_LocalClassPath **ppLocClassPathClone);

int Clone_InstancePath(CIMC_InstancePath *pInstPath,
                       CIMC_InstancePath **ppInstPathClone);

int Clone_LocalInstancePath(CIMC_LocalInstancePath *pInstPath,
                            CIMC_LocalInstancePath **ppInstPathClone);

int Clone_KeyBinding(CIMC_KeyBinding *pKey,
                 CIMC_KeyBinding **ppKeyClone);

int Clone_PCData(CIMC_PCData *pCData, CIMC_PCData **ppCDataClone);

int Clone_ValueType(CIMC_ValueType *pValType, CIMC_ValueType **ppValTypeClone);

int Clone_KeyValue(CIMC_KeyValue *pKeyVal,
                   CIMC_KeyValue **ppKeyValClone);

int Clone_InstanceName(CIMC_InstanceName *pInstName,
                       CIMC_InstanceName **ppInstNameClone);

int Clone_ValueReference(CIMC_ValueReference *pValRef, 
                         CIMC_ValueReference **ppValRefClone);

int Clone_ReferenceClass(CIMC_ReferenceClass *pReferenceClass,
			 CIMC_ReferenceClass **ppReferenceClassClone);

int Clone_PropertyReference(CIMC_PropertyReference *pPropRef,
                            CIMC_PropertyReference **ppPropRefClone);

int Clone_Instance(CIMC_Instance *pInstance, CIMC_Instance **ppInstanceClone);

int Clone_NamedInstance(CIMC_NamedInstance *pNamedInst,
			CIMC_NamedInstance **ppNamedInstClone);

int Clone_ParamType(CIMC_ParamType *pParamType, CIMC_ParamType **ppParamTypeClone);

#endif // _CIMC_CLONE


