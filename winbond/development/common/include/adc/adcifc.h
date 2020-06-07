/*****************************-*- ********-*-********************************/
/* Filename:    adcifc.h                                                    */
/* Description: Library interface to adc access                             */
/*****************************************************************************/

#ifndef ADCIFC_H
#define ADCIFC_H

#ifdef __cplusplus
extern "C" {
#endif

#include "adc.h"

#define ADC_CTL_FILE   "/dev/adc"

/** \file adcifc.h
 *  \brief Public headers for the adc interface library
 *  
 *  This library contains friendly function call interfaces for getting 
 *  adc channel data.  It hides all the details of playing with
 *  adc through the adc manager (opening the device file, calling ioctl,
 *  etc.)
*/

extern  int get_adc_val( int channel , unsigned short *data);

#ifdef __cplusplus
}
#endif

#endif //ADCIFC_H
