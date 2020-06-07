/****************************************************************
*****************************************************************
**                                                             **
**   Copyright (c) 2004-2005, AMERICAN MEGATRENDS Inc.         **
**                                                             **
**                    All Rights Reserved.                     **
**                                                             **
**            6145-F, Northbelt Parkway, Norcross,             **
**                                                             **
**         Georgia - 30071, USA, Phone-(770)-246-8600.         **
**                                                             **
*****************************************************************
*****************************************************************
*****************************************************************
 * Source Name : Porting_Common.h
 * Date        : 13/02/2008
 * Author      : Gokulakannan. S (gokulakannans@amiindia.co.in)
		 Aruna. V (arunav@amiindia.co.in)
*****************************************************************/

#ifndef __PORTING_COMMON_H__
#define __PORTING_COMMON_H__

#define CPL_MAX_STR_LEN		64
#define CPL_MIN_STR_LEN		16
#define CPL_MAX_PROP_LEN	256
#define CPL_MAX_LINE_LEN 	1024

#define CPL_RET_FAILURE 1
#define CPL_RET_SUCCESS 0



#define CPL_ENTER(func)  \
        char * _func = func; \
        if(_func != NULL) \
                CPL_DEBUG_MSG(0, "%s(%d) - Entering %s\n", __FILE__, __LINE__, _func);


#define CPL_RETURN(ret) { \
        if(_func != NULL) \
                CPL_DEBUG_MSG(0, "%s(%d) - Leaving  %s\n", __FILE__, __LINE__, _func); \
         _func = NULL; \
         return(ret); }

#ifdef DEBUG
#include <stdarg.h>



static inline void CPL_DEBUG_MSG(int level, char * str,...)
{
        va_list ap;
        int i;
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

static inline void CPL_DEBUG_MSG(int level, char * str,...)
{
        return;
}

#endif


#define CPL_TRUE 4
#define CPL_FALSE 5
/*!--------------------------------------------------------------
 * Structure Name : CLP_StringArray_T
 * Description    : This structure is used for maintaining string
		    arrays with its count.
 * Copyright (c) 2004-2005, AMERICAN MEGATRENDS INDIA (P) LTD.
   All rights reserved.
 *----------------------------------------------------------------
 */
typedef struct CPL_StringArray {
	char ** Name;
	int nCount;
} CPL_StringArray_T;


typedef enum {
	 CPL_SUCCESS                      =0,
     CPL_FAILURE                      =1,
     CPL_ACCESS_DENIED                =2,
     CPL_INVALID_NAMESPACE            =3,
     CPL_INVALID_PARAMETER            =4,
     CPL_INVALID_CLASS                =5,
     CPL_NOT_FOUND                    =6,
     CPL_NOT_SUPPORTED                =7,
     CPL_CLASS_HAS_CHILDREN           =8,
     CPL_CLASS_HAS_INSTANCES          =9,
     CPL_INVALID_SUPERCLASS           =10,
     CPL_ALREADY_EXISTS               =11,
     CPL_NO_SUCH_PROPERTY             =12,
     CPL_TYPE_MISMATCH                =13,
     CPL_QUERY_LANGUAGE_NOT_SUPPORTED =14,
     CPL_INVALID_QUERY                =15,
     CPL_METHOD_NOT_AVAILABLE         =16,
     CPL_METHOD_NOT_FOUND             =17,
     CPL_DO_NOT_UNLOAD                =50,
     CPL_NEVER_UNLOAD                 =51,
     CPL_INVALID_HANDLE               =60,
     CPL_INVALID_DATA_TYPE            =61,
     CPL_ERROR_SYSTEM                 =100,
     CPL_ERROR                        =200

} CPL_Status_T;

typedef enum {
	//! Use ADMINISTRATOR macro only for Modify Instance and for operation not stated in the privilege list.
	ADMINISTRATOR,
	EVENTLOG,
	USERMANAGEMENT,
	POWER, 
	BASICADAPTER,
	NETWORKADAPTER, 
	ADVANCEDADAPTER, 
	REMOTECONSOLE, 
	REMOTEDISK
} CPL_Authourization_T;


CPL_Status_T CPL_IsOperationSupported(char * userName, CPL_Authourization_T Flag);
CPL_Status_T CPL_GetSPSystemName(char *, int);
CPL_Status_T CPL_GetHostSystemName(char *, int);
char * CPL_GetNameSpace(const char * ClassName);

#endif
