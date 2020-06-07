
#ifndef __WEBIFC_H__
#define __WEBIFC_H__

#include <dbgout.h>
#include <authenticate.h>
#include <extpriv.h>


/*define commonly set goahead compile flags here so that we
  get these things to compile properly*/
#ifndef UEMF
#define UEMF
#endif
#ifndef WEBS
#define WEBS
#endif
#ifndef WEBS_SSL_SUPPORT
#define WEBS_SSL_SUPPORT
#endif
#ifndef OPENSSL
#define OPENSSL
#endif
#ifndef MEGARAC_G3_ENABLE_FILEUPLOAD
#define MEGARAC_G3_ENABLE_FILEUPLOAD
#endif
#include <webs.h>



/******************Function prototypes for web interface handlers***********************/

typedef int (WEBIFC_HAPIFN_TYPE)(SESSION_HANDLE hSession,int eid, webs_t wp, int argc, char_t **arg);
typedef WEBIFC_HAPIFN_TYPE* P_WEBIFC_HAPIFN_TYPE;
#define WEBIFC_HAPIFN_DEFINE(FuncName)  int FuncName (SESSION_HANDLE hSession,int eid, webs_t wp, int argc, char_t **arg)




/***************************************************************************************/ 



/******************Stuff used opaquely from within webifc funcs*************************/

/***webpage handler and function names***/
#define WEBPAGE_HANDLE               wp
#define WEBPAGE_WRITE_FUNC           websWrite
#define WEBPAGE_WRITE_FUNC_VARARGS   websWriteVARARGS


/****Wrapper macros for functions******/

#define WEBPAGE_WRITE(fmt,x...)      WEBPAGE_WRITE_FUNC(WEBPAGE_HANDLE,fmt,##x)
#define WEBPAGE_WRITE_VARARGS(fmt,x) WEBPAGE_WRITE_FUNC_VARARGS(WEBPAGE_HANDLE,fmt,x)

/***************************************/




/**********Internal helper macros********/

//these macros form the standard JSON variable and the standard structure inside the json variable
#define FORM_WEBPAGE_JSONVAR_NAME(varname) "WEBVAR_JSONVAR_" #varname
#define FORM_WEBPAGE_STRUCT_NAME(structname)  "WEBVAR_STRUCTNAME_" #structname

/****************************************/





/**************************Macros used by webifc funcs****************************/


/****JSON Record declaration macros*****/

//..used by WEBIFC funcs to decalre their JSON records*******/
#define WEBPAGE_DECLARE_JSON_RECORD(jsonvarname) \
                                             unsigned char* INTERNAL_JSON_FIELD_REF_##jsonvarname[] = 



#define JSONFIELD(FieldName,FieldType)     "'" #FieldName "'"  " : "  FieldType 
#define JSONFIELD_TYPE_STR                "'%s'"
#define JSONFIELD_TYPE_INT                "%d"
#define JSONFIELD_TYPE_INT8S 			  "%d"
#define JSONFIELD_TYPE_INT16S			  "%d"
#define JSONFIELD_TYPE_INT32S			  "%d"


#define JSONFIELD_TYPE_INTU				  "%u"
#define JSONFIELD_TYPE_INT8U			  "%u"
#define JSONFIELD_TYPE_INT16U			  "%u"
#define JSONFIELD_TYPE_INT32U			  "%u"


/****************************************/


//delcares the error status..subsequent writes of error status just set the val of already declared var
//#define WEBPAGE_DECLARE_ERROR_STATUS() WEBPAGE_WRITE("var HAPI_STATUS=%d;\n",0)

//this macro defines the beginning of a webpage write
#define WEBPAGE_WRITE_BEGIN()  WEBPAGE_WRITE("//Dynamic Data Begin\n");
                     

//ends a webpage write
#define WEBPAGE_WRITE_END()    WEBPAGE_WRITE("//Dynamic data end\n");


/* Here 'var' is removed in G4 to make the WEBVAR_JSON_xxx variable global to the webpage */
//this macro starts writing the JSON object
#define WEBPAGE_WRITE_JSON_BEGIN(jsonvarname)        WEBPAGE_WRITE(" %s = \n { \n %s : \n [ \n", \
                                                 FORM_WEBPAGE_JSONVAR_NAME(jsonvarname), FORM_WEBPAGE_STRUCT_NAME(jsonvarname) );
//this macro ends the json object
//any JSON object ending is always coordinated by error code
#define WEBPAGE_WRITE_JSON_END(jsonvarname,errorcode)          WEBPAGE_WRITE(" {} ],  \n HAPI_STATUS:%d }; \n",errorcode); \
                                                           do{} while(INTERNAL_JSON_FIELD_REF_##jsonvarname == 0);

//this macro writes one JSON record as specified in the record delaration
#define WEBPAGE_WRITE_JSON_RECORD(jsonvarname,args...)          internal_fn_webpage_write_JSON_record(WEBPAGE_HANDLE, \
                                                                INTERNAL_JSON_FIELD_REF_##jsonvarname, \
                                                                sizeof(INTERNAL_JSON_FIELD_REF_##jsonvarname)/sizeof(char*), \
                                                                ##args )


//this macro rewrites an already written JSON record
//it takes index of the record to be overwritten
#define WEBPAGE_REWRITE_JSON_RECORD(jsonvarname,index,args...)  internal_fn_webpage_rewrite_JSON_record(WEBPAGE_HANDLE, \
                                                                FORM_WEBPAGE_JSONVAR_NAME(jsonvarname), \
                                                                FORM_WEBPAGE_STRUCT_NAME(jsonvarname), \
                                                                index, \
                                                                INTERNAL_JSON_FIELD_REF_##jsonvarname, \
                                                                sizeof(INTERNAL_JSON_FIELD_REF_##jsonvarname)/sizeof(char*), \
                                                                ##args )


//sets the error status of the webifc functions operation.
//#define WEBPAGE_WRITE_ERROR_STATUS(errorcode)  WEBPAGE_WRITE("HAPI_STATUS = %d",errorcode);




/****************Webpage information setters related macros and functions*************************/
#define VARTYPE_STR char_t*
#define VARTYPE_INT int

#define WP_VAR_DECLARE(varname,vartype)           vartype varname
#define WP_GET_VAR_STR(varname)                   websGetVarWrap(WEBPAGE_HANDLE,#varname,NULL)
#define WP_GET_VAR_INT(varname)                   websGetVarInt(WEBPAGE_HANDLE,#varname,&varname)

/*************************************************************************************************/


/*************Permission checkers******************/
//we redo the permission checkers here just to 
//have a wrapper and mkae the fact that session 
//is inside wp transparent
#define WEBIFC_HAS_PERMS_WRITE() HAS_PERMS_WRITE(WEBPAGE_HANDLE->hSession)
#define WEBIFC_HAS_PERMS_READ()  HAS_PERMS_READ(WEBPAGE_HANDLE->hSession)
#define WEBIFC_IS_ADMIN()        IS_ADMIN(WEBPAGE_HANDLE->hSession)

#define WEBIFC_HAPIERR_INSUFF_EXTPRIV	 (0x8899)
#define WEBIFC_HAS_EXT_PRIV(privtocheck) HAS_EXT_PRIV(WEBPAGE_HANDLE->pWEBIPMISession->ExtraPrivileges,(privtocheck))

/***************************************************************************************/ 


#endif
