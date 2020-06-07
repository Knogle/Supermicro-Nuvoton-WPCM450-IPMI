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
 * sp_ins.h
 * Softprocessor instruction structure
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_INS_H
#define SP_INS_H
#include "sp_types.h"

/**------- Definitions ------------------------------------------**/
#define NUM_OPCODE	52

/**
 * instruction_t
**/
typedef u16	instruction_t;

/**
 * FETCH_INS
**/
#define FETCH_INS(IP_REG, INS)						\
do													\
{													\
	INS 	= SPTOH16 (*((u16*)((u8*) g_code_start + IP_REG)));	\
	IP_REG += sizeof (instruction_t);				\
} while (0)


/**
 * FETCH_INS_WORD
**/
#define FETCH_INS_WORD(IP_REG, VAL)				\
do												\
{												\
	VAL = SPTOH16 (*((u16*)((u8*) g_code_start + IP_REG)));	\
  	IP_REG += sizeof (u16);						\
} while (0)


/**
 * FETCH_INS_DWORD
**/
#define FETCH_INS_DWORD(IP_REG, VAL)					\
do														\
{														\
	VAL = SPTOH32 (*((u32*)((u8*)g_code_start + IP_REG)));	\
  	IP_REG += sizeof (u32);								\
} while (0)


/**
 * EXTRACT_INS_FIELDS
**/
#define EXTRACT_INS_FIELDS(INS, OPCODE, PRED_QUAL, PRED_REG_NUM, OP1, OP2, OP_32)	\
do                                              \
{                                               \
    register instruction_t  __ins = INS;        \
                                                \
    OP2         = (u8)(__ins & 0x7);            \
    __ins     >>= 3;                            \
    OP1         = (u8)(__ins & 0x7);            \
    __ins     >>= 3;                            \
    PRED_REG_NUM= (u8)(__ins & 0x3);            \
    __ins     >>= 2;                            \
    PRED_QUAL   = (u8)(__ins & 0x1);            \
    __ins     >>= 1;                            \
    OP_32       = (u8)(__ins & 0x1);            \
    __ins     >>= 1;                            \
    OPCODE      = (u8)(__ins);                  \
												\
} while (0)


/**
 * @brief Instruction execution context
**/
typedef struct
{
	u16*	gp_regs;
	u16*	pred_regs;
	u16*    p_flags;
	u16*	p_stack;
	u8		op1;
	u8		op2;
	u16*	p_arg1_16;
	u16*	p_arg2_16;
	u32*	p_arg1_32;
	u32*	p_arg2_32;
	u16		stack_size;

} ins_context_t;

/**
 * Instruction return code
**/
#define EXEC_STOP	0xff

/**
 * Flags
**/
#define FLAGS_STEP	0x0001



/**
 * Registers
**/
#define SP	0x06
#define IP	0x07

/**
 * Instruction Table 
**/
typedef int (*p_ins_exec_t) (ins_context_t* ic);

extern p_ins_exec_t g_ins_tbl [NUM_OPCODE];

#endif	/* SP_INS_H */

