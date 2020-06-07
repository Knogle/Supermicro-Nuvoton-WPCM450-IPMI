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
************************************************************************************************/
#ifndef _COMMON_H_
#define _COMMON_H_

#include <stdio.h>
#include <stdarg.h>
#include <unistd.h>
#include <stdint.h>
#include <ctype.h>
#include <limits.h>

#include "providerUtility.h"
#include "modifyInstanceHandler.h"
#include "StringConsts.h"
#include "typeChecking.h"
#include "CIMTemplate.h"

#define PROV_DEBUG
//static char * _func;

#define DECLPROVINIT(__initstruct, __provider) \
	Prov_Init_T __initstruct; \
	__initstruct.providerName = __provider; \
	__initstruct.lock = TRUE;

#define SETLOCKTYPE(__initstruct, locktype) \
	__initstruct.lock = locktype;

#define PROV_ENTER(func)  \
	char * _func = func; \
	if(_func != NULL) \
		_DEBUG_MSG(0, "%s(%d) [pid: %d] - Entering %s\n", __FILE__, __LINE__, getpid(), _func); 


#define PROV_RETURN(ret) { \
	if(_func != NULL) \
		_DEBUG_MSG(0, "%s(%d) [pid: %d] - Leaving  %s\n", __FILE__, __LINE__, getpid(), _func); \
	 _func = NULL; \
	 return(ret); }


#ifdef PROV_DEBUG
#include <stdarg.h>


static inline void _DEBUG_MSG(int level, char * str,...);
static inline void _DEBUG_MSG(int level, char * str,...);

static inline void _DEBUG_MSG(int level, char * str,...)
{
	va_list ap;
	int i;

	//! Use export DEBUG_PROVIDER=YES to enable debug.
        //! Use export DEBUG_PROVIDER=NO to disable debug.
        if(getenv("DEBUG_PROVIDER") != NULL) {
                if(!strcmp(getenv("DEBUG_PROVIDER"),"YES")) {
			for(i = 0; i < level; i++)
				printf("\t");
			va_start(ap, str);
			vprintf(str, ap);
			va_end(ap);
		}
	}
}

#else

static inline void _DEBUG_MSG(int level, char * str,...)
{
	return;
}

#endif

#endif
