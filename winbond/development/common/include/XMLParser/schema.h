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

 * FileName    : schema.h
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef _SCHEMA_H
#define _SCHEMA_H

#include "tree.h"

#ifndef STR_LEN
#define STR_LEN		256
#endif
#define MAX_LEN		50
#define NUM_LEN		20

typedef enum TYPE_IMPL { PRIMITIVE, SIMPLE, COMPLEX } TYPE_IMPL;
typedef enum MAX_OCCURS { UNBOUNDED = -1 }MaxOccurs; 

typedef struct Type
{
	TYPE_IMPL typeImpl;
	char name[STR_LEN];
}Type;

typedef struct Element
{
	char name[STR_LEN];
	Type *type;
	MaxOccurs maxOccurs;
}Element;
 
typedef struct ComplexType
{
	TYPE_IMPL typeImpl;
	char name[STR_LEN];
	Element *elements[MAX_LEN];
	int elementsLength;
}ComplexType;

typedef struct Schema
{
	Type *types[MAX_LEN];
	int typesLength;

	Element *elements[MAX_LEN];
	int elementsLength;
}Schema;

extern Schema *parseSchema(xmlNode *schemaNode);
extern int freeSchema(Schema *schema);

#endif
