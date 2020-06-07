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

 * FileName    : CIMC_Parser.h
 * Description : 
 * Author      : Yogeswaran. T
		 Hari .v
 
************************************************************************************************/

#ifndef _CIMC_PARSER
#define _CIMC_PARSER

//#define NODE_NAME_LEN 	128
//#define NODE_VALUE_LEN 	256

//XML Parser include files
#include "tree.h"
#include "include.h"
#include "sparser.h"

typedef struct stack
{
	void * address;
	char name[NODE_NAME_LEN];
	
}Stack;

CIMC_CIM * parseXML(char *cimResponse);
int recursiveParseCIM(xmlNode *CIMnode);
int Push(Stack element);
void * Pop(char *name);
int printStack(void);
void  removeParent(char *name);

#endif
