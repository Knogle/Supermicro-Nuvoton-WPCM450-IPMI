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
 * transport.h
 * Transport Functions
 *
 * Author: Gowtham Shanmukham <gowthams@ami.com> 
 * 
 *****************************************************************/
#include "sp_types.h"

int init_dbg_transport (void);
int read_dbg_request  (u8* p_req, u16* p_req_len, int timeout);
int write_dbg_response(u8* p_res, u16  res_len,   int timeout);
