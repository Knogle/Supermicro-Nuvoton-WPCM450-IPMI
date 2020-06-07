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
 * types.h
 * Commonly used types.
 *
 * Author: Govind Kothandapani <govindk@ami.com> 
 * 
 *****************************************************************/
#ifndef SP_TYPES_H
#define SP_TYPES_H

#include "Types.h"

#pragma pack( 1 )

/* SPRegs_T */
typedef struct
{
	u16 r0;
	u16 r1;
	u16 r2;
	u16 r3;
	u16 r4;
	u16 r5;
	u16 sp;
	u16 ip;

} PACKED  RegContext_T;

#pragma pack( )

typedef RegContext_T SPRegs_T;


/* Include OS specific types files. */
#ifdef WIN32
#include "types_w32.h"
#elif defined( LINUX )
#include "types_linux.h"
#elif defined( BSD )
#include "types_bsd.h"
#else
#error "OS not defined"
#endif

/* Include the common types. */
//CLEANUP-SP #include "types_cmn.h"

#endif  // TYPES_H
