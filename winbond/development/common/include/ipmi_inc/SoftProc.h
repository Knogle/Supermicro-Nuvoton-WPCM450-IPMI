/****************************************************************
 ****************************************************************
 **                                                            **
 **    (C)Copyright 2005-2006, American Megatrends Inc.        **
 **                                                            **
 **            All Rights Reserved.                            **
 **                                                            **
 **        6145-F, Northbelt Parkway, Norcross,                **
 **                                                            **
 **        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 **                                                            **
 ****************************************************************
 ****************************************************************/
/*****************************************************************
 *
 * softprocessor.h
 * Softprocessor main header file
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SOFTPROCESSOR_H
#define SOFTPROCESSOR_H

#include "sp_types.h"
#include "sp_main.h"
#include "sp_api.h"
#include "sp_porting.h"

/**
 * @def GetRegContext
 * @brief Gives the pointer to the soft processor registers
**/
#define GetRegContext()		((_FAR_ RegContext_T*)gp_regs)


#define InitSoftProc(SP_BIN) sp_init (SP_BIN)

#endif //SOFTPROCESSOR_H
