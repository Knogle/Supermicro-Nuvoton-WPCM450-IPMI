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

 * FileName    : serialize.h
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef _SERIALIZE_H
#define _SERIALIZE_H

#include <setjmp.h>

#include "stack.h"

typedef struct _xmlMemSerializer {
	char *xmlText;
	unsigned int index;
	unsigned int currSize;
	unsigned int remaining;
	NSDecl *nsDecls;
	xmlStack *defaultNSNodes;
	jmp_buf env;
}xmlMemSerializer;

//extern xmlMemSerializer *createMemSerializer();

extern void freeMemSerializer(xmlMemSerializer *s);

extern char *writeXML(xmlMemSerializer *s, const xmlDoc *doc);

#endif

