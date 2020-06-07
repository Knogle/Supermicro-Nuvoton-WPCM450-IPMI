#ifndef _LARA_COMMON_H
#define _LARA_COMMON_H

#include "pp_kernel_common.h"
//#include "common_debug.h"

/* ------------------------------------------------------------------------- *
 * global constants and macros used for all modules
 * ------------------------------------------------------------------------- */

#if defined(PRODUCT_KIMTESTERMST)
/* suppress VSC init, since FPGA is used as passthrough to USB HC */
#define LARA_PORT_COUNT			0
#else /* default */
#define LARA_PORT_COUNT			1
#endif

#if defined(PRODUCT_FLASHX4)
#define FLASH_PROG_IRQ2			27
#endif

#if defined (PRODUCT_KIMTESTERMST) && defined (PP_BOARD_LARA)
#define KIM_TESTER_GPIO_IRQ		29
#define KIM_TESTER_POWER_SLV_IRQ	31
#endif



#define ABS(x)		((x>0)?(x):(x * -1))

/* ------------------------------------------------------------------------- *
 * exported functions
 * ------------------------------------------------------------------------- */

extern void propchange_fire(unsigned short prop, unsigned short param);

#endif /* _LARA_COMMON_H */
