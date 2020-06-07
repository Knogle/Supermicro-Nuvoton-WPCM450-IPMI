#ifndef _UBENV_H
#define _UBENV_H

#define MAX_UBOOT_VAR_LEN (32)

typedef struct UbEnv_tag
{
    char szVarName [ MAX_UBOOT_VAR_LEN ];
    char szValue [ MAX_UBOOT_VAR_LEN ];
} UbEnv_T;


/*---------------- UBoot-utility ---------------*/
int SetUBootEnv (UbEnv_T* pUb);
int PrintAllEnv (char* envBuf);
/* ---------------------------------------------*/

/*Functions to get/set a u-boot parameter */
int GetUBootParam (char*, char* );
int SetUBootParam (char*, char* );

#endif /* _UBENV_H */
