/****************************************************************
 *
 * SMC.h
 * Supermicro BMC Command handlers
 * Date: 05/09/2008
 * Author: Farida Karjono 
 *
 *****************************************************************/
#ifndef SMC_H
#define SMC_H

#include "Types.h"

#define SMCCONFIG_SIZE	48
typedef struct
{
	UINT8	SolMode;		// Sol mode 1 or mode 3
	UINT8	BoardId[2];		// mother board id
	UINT8	HWMonitor;		// hw monitor chip number
	UINT8	NumLan;			// num of lan chip on mb
	UINT8	MBMac[6];		// mac addr
	UINT8	PowerUpDelay;	// pwr up delay
	UINT8	Reseved[36];	// reserverd
} PACKED SMCConfig_T; 

#endif  /* SMC_H */

