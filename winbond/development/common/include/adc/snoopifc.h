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
 *****************************************************************
 *
 * snoopifc.h
 * snoop library header file
 *
 * Author: Rama Rao Bisa <RamaB@ami.com>
 *
 *
 *****************************************************************/
#ifndef _SNOOP_IFC_H_
#define _SNOOP_IFC_H_

#ifdef __cplusplus
extern "C" {
#endif

#define MAX_SNOOP_BUF_SIZE		512
#define SNOOP_DEVICE   			"/dev/snoop"

/* Init the snoop port to required port */
extern int InitSnoopDevice (unsigned short snoop_port_num);

/* Read the snoop buffer */
extern int ReadSnoopBuffer (unsigned char* pBuf, unsigned int* pCnt);

/* Read the last byte of snoop buffer */
extern int ReadLastSnoopByte (unsigned char* pByte);

/* Close the snoop driver */
extern void CloseSnoopDevice (void);

#ifdef __cplusplus
}
#endif

#endif /* _SNOOP_IFC_H_ */
