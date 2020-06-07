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
 * sp_main.h
 * Softprocessor main header file
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_MAIN_H
#define SP_MAIN_H
#include "sp_types.h"
#include "sp_image.h"
#include "sp_ins.h"


/*--------------------- Global Variables -------------------------*/
extern instruction_t*	g_code_start;	/** Start of the soft processor code 		*/
extern u16				g_code_size;	/** Size of the soft processor code  		*/
extern u8*				g_data_start;	/** Start of the soft processor data area 	*/
extern u16				g_data_size;	/** Size of the soft processor data area	*/
extern u8*				g_gsym_start;	/** Start of the global code symbols		*/
extern u16				g_num_gsym;		/** Number of global code symbols			*/
extern u8*				g_gdsym_start;	/** Start of the global data symbols		*/
extern u16				g_num_gdsym;	/** Number of global data symbols			*/


extern u16				gp_regs [8];
extern u16				pred_regs [4];
extern u16				flags; 


extern int sp_init  (char* sp_bin);
extern int sp_load  (sp_image_t* p_img);
extern int sp_exec  (u16 offset, u16* gp_regs, u16* pred_regs, u16* p_flags, u16* p_stack, u16 stack_size);
extern int sp_exec_label (char* label, u16* gp_regs, u16* pred_regs, u16* p_flags, u16* p_stack, u16 stack_size);
extern int get_label_offset (char* label);
extern int get_Module_offset (char* label , u16** ModuleOffset );
extern int get_data_label_offset (char* label);
extern void sp_get_read_buffer (u8* buff, u8 len);
extern void sp_update_write_buffer (u8* buff, u8 len);

#endif //SP_MAIN_H
