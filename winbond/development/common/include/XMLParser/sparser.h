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

 * FileName    : sparser.h
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef SPARSER_H_
#define SPARSER_H_

#include <setjmp.h>

#include "tree.h"
#include "xml_buffer.h"

#define ERROR_TEXT_LEN		256

typedef struct {
	xmlDoc *doc;	// doc node of currently parsed text
	xmlNode *node; 	// currently parsed node; parse_error will free this in case of error
	xmlNode *attrNode; // currently parsed attrNode; 
	xml_buffer *buffer; // currently parsed char storing buffer

	//NSDecl *nsDecls;
	xmlStack *nodeStack;
	xmlStack *defaultNSStack;

	const char *xmlText;	// xml text currently being parsed
	unsigned int xmlTextLen;			// its length
	int index;	// current index of XML text

	char errText[ERROR_TEXT_LEN]; // error text

	jmp_buf env;		// environment variable to store current stack state to
	
}xmlParser;

extern xmlDoc *parseText(xmlParser *p, const char* str);

extern char *getErrorText(xmlParser *p);

extern int freeXMLParser(xmlParser *p);

int setNodeName(xmlNode *node);

#endif // SPARSER_H
