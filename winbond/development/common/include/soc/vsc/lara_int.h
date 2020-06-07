/***************************************************************************** 
 * lara_int.h
 *
 * Copyright (c) 2002-2003 Peppercon AG, sand@peppercon.com
 *
 * Contains internal definitions for the lara kernel modules
 *
 ****************************************************************************/

#ifndef _LARA_INT_H
#define _LARA_INT_H

#ifdef __KERNEL__

#include <linux/version.h>
#include "lara.h"

/*********************************************
 * IRQ configuration
 *********************************************/


/*********************************************
 * Register, Misc defines
 *********************************************/

#define EBC0_CFGADDR 0x012 /*R/W External Bus Controller Address Register*/
#define EBC0_CFGDATA 0x013 /*R/W External Bus Controller Data Register*/

#define HFC_VENDOR_ID   0x1397

#define EBC0_B0CR	0x00
#define EBC0_B1CR	0x01
#define EBC0_B2CR	0x02
#define EBC0_B3CR	0x03
#define EBC0_B4CR	0x04
#define EBC0_B5CR	0x05
#define EBC0_B6CR	0x06
#define EBC0_B7CR	0x07

#define EBC0_B0AP	0x10
#define EBC0_B1AP	0x11
#define EBC0_B2AP	0x12
#define EBC0_B3AP	0x13
#define EBC0_B4AP	0x14
#define EBC0_B5AP	0x15
#define EBC0_B6AP	0x16
#define EBC0_B7AP	0x17

#define EBC0_BEAR 	0x20 /*R Peripheral Bus Error Address Register 16-29*/
#define EBC0_BESR0 	0x21 /*R/W Peripheral Bus Error Status Register 0 16-30*/
#define EBC0_BESR1 	0x22 /*R/W Peripheral Bus Error Status Register 1 16-31*/
#define EBC0_CFG 	0x23 /*R/W EBC Configuration Register 16-23*/

#ifdef SUCCESS
#  undef  SUCCESS
#endif
#define SUCCESS 0

#endif /* __KERNEL__ */

#endif /* _LARA_INT_H */
