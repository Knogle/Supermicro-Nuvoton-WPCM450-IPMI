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
#ifndef _TYPECHECKING_H_
#define _TYPECHECKING_H_

#include "cmpidt.h"
#include "cmpift.h"
#include "cmpimacs.h"

#include "providerUtility.h"

/** Check whether the given Input Paramter is of uint8 type. 
	Type cast if string. **/
int GetUINT8Value(CMPIData data, uint8_t * pValue);

/** Check whether the given Input Paramter is of uint16 type. 
	Type cast if string. **/
int GetUINT16Value(CMPIData data, uint16_t * pValue);

/** Check whether the given Input Paramter is of uint32 type. 
	Type cast if string. **/
int GetUINT32Value(CMPIData data, uint32_t * pValue);

/** Check whether the given Input Paramter is of uint64 type. 
	Type cast if string. **/
int GetUINT64Value(CMPIData data, uint64_t * pValue);

/** Check whether the given Input Paramter is of int8 type. 
	Type cast if string. **/
int GetSINT8Value(CMPIData data, int8_t * pValue);

/** Check whether the given Input Paramter is of int16 type. 
	Type cast if string. **/
int GetSINT16Value(CMPIData data, int16_t * pValue);

/** Check whether the given Input Paramter is of int32 type. 
	Type cast if string. **/
int GetSINT32Value(CMPIData data, int32_t * pValue);

/** Check whether the given Input Paramter is of int64 type. 
	Type cast if string. **/
int GetSINT64Value(CMPIData data, int64_t * pValue);

/** Check whether the given Input Paramter is of boolean type. 
	Type cast if string. **/
int GetBoolValue(CMPIData data, uint8_t * pValue);

/** Check whether the given Input Paramter is of string type **/
int GetStringValue(CMPIData data, CMPIString ** pValue);

int GetDateTimeValue(const CMPIBroker * _broker, CMPIData data, CMPIDateTime ** pValue);

/** Check whether the given Input Paramter is of respective array type. 
	Caller needs to deallocate the memory for pValue on SUCCESS of this function **/
int GetUINT8AValue(CMPIData data, uint8_t ** pValue, int * nCount);

int GetUINT16AValue(CMPIData data, uint16_t ** pValue, int * nCount);

int GetUINT32AValue(CMPIData data, uint32_t ** pValue, int * nCount);

int GetUINT64AValue(CMPIData data, uint64_t ** pValue, int * nCount);

int GetSINT8AValue(CMPIData data, int8_t ** pValue, int * nCount);

int GetSINT16AValue(CMPIData data, int16_t ** pValue, int * nCount);

int GetSINT32AValue(CMPIData data, int32_t ** pValue, int * nCount);

int GetSINT64AValue(CMPIData data, int64_t ** pValue, int * nCount);

int GetStringAValue(CMPIData data, CMPIString *** pValue, int * nCount);

#endif

