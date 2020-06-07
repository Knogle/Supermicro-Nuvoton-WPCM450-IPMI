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
 * sp_debug.c
 * Debug Functions
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_DEBUG_H
#define SP_DEBUG_H

#include "sp_types.h"
#include "Debug.h"


#ifdef SP_DEBUG

#define NUM_DEBUG_REGS	256

#define DBG_STACK_OVERFLOW()
#define DBG_INVALID_OPCODE(IP)
#define DBG_INV_OPCODE(IP)
#define DBG_STACK_OVERFLOW()
#define DBG_BREAK(P1)	on_breakpoint ()

#define DBG_BREAK_ON_CONDITION()			\
do											\
{											\
	if ((0 != (*p_flags & FLAGS_STEP)) ||	\
		(0 == check_dbg_regs (gp_regs [IP])))\
	{										\
		DBG_BREAK (gp_regs [IP]);			\
	}										\
} while (0)

#else /*#ifdef SP_DEBUG*/

#define DBG_STACK_OVERFLOW()
#define DBG_INVALID_OPCODE(IP)
#define DBG_INV_OPCODE(IP)
#define DBG_STACK_OVERFLOW()
#define DBG_BREAK(P1)

#define DBG_BREAK_ON_CONDITION()

#endif

#define GET_CODE_SIZE_REQ	0x01
#define GET_CODE_SIZE_RES	0x81
#define READ_CODE_MEM_REQ	0x02
#define READ_CODE_MEM_RES	0x82
#define READ_DATA_MEM_REQ	0x03
#define READ_DATA_MEM_RES	0x83
#define WRITE_DATA_MEM_REQ	0x04
#define WRITE_DATA_MEM_RES	0x84
#define READ_REG_REQ		0x05
#define READ_REG_RES		0x85
#define WRITE_REG_REQ		0x06
#define WRITE_REG_RES		0x86
#define STOP_REQ			0x07
#define STOP_RES			0x87
#define RESET_REQ			0x08
#define RESET_RES			0x88
#define STEP_REQ			0x09
#define STEP_RES			0x89
#define GO_REQ				0x0a
#define GO_RES				0x8a
#define IS_READY_REQ		0x0b
#define IS_READY_RES		0x8b
#define IS_RESET_REQ		0x0c
#define IS_RESET_RES		0x8c
#define CLEAR_RESET_REQ		0x0d
#define CLEAR_RESET_RES		0x8d
#define ADD_BREAK_PT_REQ	0x0e
#define ADD_BREAK_PT_RES	0x8e



#pragma pack (1)

#define MAX_BUF_SIZE	100

typedef struct
{
	u16	Cmd;

} PACKED GetCodeSizeReq_T;

typedef struct
{
	u16	Cmd;
	u16	Len;

} PACKED GetCodeSizeRes_T;


typedef struct
{
	u16	Cmd;

} PACKED  GetDataSizeReq_T;

typedef struct
{
	u16	Cmd;
	u16	Len;

} PACKED  GetDataSizeRes_T;

typedef struct
{
	u16	Cmd;
	u16	Offset;
	u16	len;

} PACKED  ReadCodeMemReq_T;

typedef struct
{
	u16	Cmd;
	u16	len;
	u8	Buf [MAX_BUF_SIZE];

}  PACKED ReadCodeMemRes_T;


typedef struct
{
	u16	Cmd;
	u16	Offset;
	u16	len;

}  PACKED ReadDataMemReq_T;

typedef struct
{
	u16	Cmd;
	u16	len;
	u8	Buf [MAX_BUF_SIZE];

}  PACKED ReadDataMemRes_T;


typedef struct
{
	u16	Cmd;
	u16	Offset;
	u16	len;
	u8	Buf [MAX_BUF_SIZE];

}  PACKED WriteDataMemReq_T;

typedef struct
{
	u16	Cmd;
	u16	len;

}  PACKED WriteDataMemRes_T;

typedef struct
{
	u16	Cmd;

} PACKED  ReadRegReq_T;

typedef struct
{
	u16	Cmd;
	u16	gp_regs [8];
	u16	pred_regs [4];

} PACKED  ReadRegRes_T;

typedef struct
{
	u16	Cmd;
	u16	gp_regs [8];
	u16	pred_regs [4];

} PACKED  WriteRegReq_T;

typedef struct
{
	u16	Cmd;

}  PACKED WriteRegRes_T;


typedef struct
{
	u16	Cmd;

}  PACKED  StopReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED StopRes_T;


typedef struct
{
	u16	Cmd;

} PACKED  StepReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED StepRes_T;


typedef struct
{
	u16	Cmd;

}  PACKED ResetReq_T;


typedef struct
{
	u16	Cmd;

} PACKED  ResetRes_T;


typedef struct
{
	u16	Cmd;

}  PACKED GoReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED GoRes_T;


typedef struct
{
	u16	Cmd;

} PACKED IsReadyReq_T;


typedef struct
{
	u16	Cmd;

} PACKED IsReadyRes_T;



typedef struct
{
	u16	Cmd;

} PACKED  IsResetReq_T;


typedef struct
{
	u16	Cmd;
	u16	IsReset;

}  PACKED IsResetRes_T;


typedef struct
{
	u16	Cmd;

}  PACKED ClearResetFlagReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED ClearResetFlagRes_T;


typedef struct
{
	u16	Cmd;
	u16	Addr;

}  PACKED AddBreakPtReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED AddBreakPtRes_T;

typedef struct
{
	u16	Cmd;
	u16	Addr;

}  PACKED RemoveBreakPtReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED RemoveBreakPtRes_T;

typedef struct
{
	u16	Cmd;

}  PACKED RemoveAllBreakPtReq_T;


typedef struct
{
	u16	Cmd;

}  PACKED RemoveAllBreakPtRes_T;


#define SP_MAX_REQUEST_SIZE	100
#define SP_MAX_RESPONSE_SIZE	100
#define GET_CODE_SIZE_REQ	0x01
#define GET_CODE_SIZE_RES	0x81
#define READ_CODE_MEM_REQ	0x02
#define READ_CODE_MEM_RES	0x82
#define READ_DATA_MEM_REQ	0x03
#define READ_DATA_MEM_RES	0x83
#define WRITE_DATA_MEM_REQ	0x04
#define WRITE_DATA_MEM_RES	0x84
#define READ_REG_REQ		0x05
#define READ_REG_RES		0x85
#define WRITE_REG_REQ		0x06
#define WRITE_REG_RES		0x86
#define STOP_REQ			0x07
#define STOP_RES			0x87
#define RESET_REQ			0x08
#define RESET_RES			0x88
#define STEP_REQ			0x09
#define STEP_RES			0x89
#define GO_REQ				0x0a
#define GO_RES				0x8a
#define IS_READY_REQ		0x0b
#define IS_READY_RES		0x8b
#define IS_RESET_REQ		0x0c
#define IS_RESET_RES		0x8c
#define CLEAR_RESET_REQ		0x0d
#define CLEAR_RESET_RES		0x8d
#define ADD_BREAK_PT_REQ	0x0e
#define ADD_BREAK_PT_RES	0x8e
#define REMOVE_BREAK_PT_REQ	0x0f
#define REMOVE_BREAK_PT_RES	0x8f
#define REMOVE_ALL_BREAK_PT_REQ	0x10
#define REMOVE_ALL_BREAK_PT_RES	0x90


#pragma pack ()

/**
 * init_dbg
**/
extern int init_dbg (void);

/**
 * on_breakpoint
**/
int on_breakpoint (void);

/**
 * read_code_memory
**/
int
get_code_size (u8* p_req, u16 req_len, u8* p_res, u16* res_len);

/**
 * read_code_memory
**/
int
read_code_memory (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * read_data_memory
**/
int
read_data_memory (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * write_data_memory
**/
int
write_data_memory (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * read_regs
**/
int
read_regs (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * write_regs
**/
int
write_regs (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * add_break_point
**/
int
add_break_point (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * remove_break_point
**/
int
remove_break_point (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * remove_all_break_point
**/
int
remove_all_break_point (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * step
**/
int
step (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * go
**/
int
go (u8* p_req, u16 req_len, u8* p_res, u16* res_len);

/**
 * stop
**/
int
stop (u8* p_req, u16 req_len, u8* p_res, u16* res_len);

/**
 * remove_break_point
**/
int
reset (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * is_ready
**/
int
is_ready (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * is_reset
**/
int
is_reset (u8* p_req, u16 req_len, u8* p_res, u16* res_len);

/**
 * clear_reset_flags
**/
int
clear_reset_flags (u8* p_req, u16 req_len, u8* p_res, u16* res_len);


/**
 * invalid_req
**/
int
invalid_req (u8* p_req, u16 req_len, u8* p_res, u16* res_len);

/**
 * check_dbg_regs
**/
extern int check_dbg_regs (u16 addr);


#ifdef SP_DEBUG

#define INIT_DBG()              init_dbg ()
#define INIT_DBG_TRANSPORT()    init_dbg_transport ()

#else /*#ifdef SP_DEBUG*/

#define INIT_DBG()
#define INIT_DBG_TRANSPORT()


#endif  /*##ifdef SP_DEBUG*/


#endif /*SP_DEBUG_H*/
