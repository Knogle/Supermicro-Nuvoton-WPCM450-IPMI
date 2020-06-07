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
 * sp_image.h
 * Softprocessor image structure
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_IMAGE_H
#define SP_IMAGE_H
#include "sp_types.h"

/**
 * @brief Softprocessor image structure 
**/
typedef struct
{
	u8			signature [4];
	u16			version;
	u16			code_offset;
	u16			code_size;
	u16			data_offset;
	u16			data_size;
	u16			gsym_offset;
	u16			num_gsym;
	u16			gdsym_offset;
	u16			num_gdsym;

} sp_image_t;


#endif	/* SP_IMAGE_H */
