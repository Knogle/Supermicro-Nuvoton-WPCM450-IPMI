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
 * sp_log.h
 * Debug Functions
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_LOG_H
#define SP_LOG_H

#include "sp_types.h"
#include "Debug.h"

/**
 * log_update_opcode
**/
extern void log_update_opcode (int opcode);

/**
 * log_update_arg1_reg
**/
extern void log_update_arg1_reg (int regno);

/**
 * log_update_arg1_val
**/
extern void log_update_arg1_val (u32 val);

/**
 * log_update_arg1_reg
**/
extern void log_update_arg2_reg (int regno);

/**
 * log_update_arg1_val
**/
extern void log_update_arg2_val (u32 val);

/**
 * log_disp_ins
**/
extern void log_disp_ins (void);


#ifdef SP_LOG

#define LOG_OPCODE(op)  log_update_opcode(op)
#define LOG_ARG1_VAL(VAL) log_update_arg1_val((u32)VAL)
#define LOG_ARG1_REG(REGNO) log_update_arg1_reg(REGNO)
#define LOG_ARG2_VAL(VAL) log_update_arg2_val((u32)VAL)
#define LOG_ARG2_REG(REGNO) log_update_arg2_reg(REGNO)
#define LOG_DISP() log_disp_ins()

#else
#define LOG_OPCODE(op)  
#define LOG_ARG1_VAL(VAL) 
#define LOG_ARG1_REG(REGNO) 
#define LOG_ARG2_VAL(VAL) 
#define LOG_ARG2_REG(REGNO) 
#define LOG_DISP()

#endif


#endif /*SP_LOG_H*/
