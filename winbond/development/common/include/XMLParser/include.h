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

 * FileName    : include.h
 * Description : 
 * Author      : Manish. T
 		  
************************************************************************************************/

#ifndef INCLUDE_H_
#define INCLUDE_H_

#ifdef MEMWATCH
	#include "memwatch.h"
#endif

enum xmlboolean { xmlfalse, xmltrue };
typedef enum xmlboolean xmlbool;

#define xmlSUCCESS		xmltrue
#define xmlFAILURE		xmlfalse

#define xmlSTR_LEN		(1024 * 5)
#define xmlURI_LEN		256

#define xmlAssertFailure(c, s) \
			if (c) { \
				fprintf(stderr, s); \
				return xmlFAILURE; \
			}

#define strequal(s1, s2) (strcmp(s1, s2) == 0)

// frees & sets NULL
#define freeAndSet(p) if (p) { free(p); (p) = NULL; }

#ifdef WIN32
#	define snprintf _snprintf
#endif

#endif /*INCLUDE_H_*/
