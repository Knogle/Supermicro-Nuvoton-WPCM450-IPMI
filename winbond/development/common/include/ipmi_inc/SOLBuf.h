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
 * SOLBuf.h
 * SOL Buffer handler
 *
 * Author: Govind Kothandapani <govindk@ami.com>
 *       : Gowtham Shanmukham<gowthams@ami.com>
 *
 *****************************************************************/
#ifndef SOLBUF_H
#define SOLBUF_H
#include "Types.h"

#define SOL_SEND_BUF	0x00
#define SOL_RECV_BUF	0x01

extern INT8U InitSOLBuf  		(int send_buf_size, int recv_buf_size);
extern INT8U ClearSOLBuf 		(void);
extern int   GetSOLBufSize 		(int buf_ix);
extern int   AddToSOLBuf 		(int buf_ix, _FAR_ INT8U* p_buf, int size);
extern int	 RemoveFromSOLBuf 	(int buf_ix, int size);
extern int	 ReadFromSOLBuf     (int buf_ix, int offset, int size, _FAR_ INT8U* p_buf);

#endif	/* SOLBUF_H */
