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
 * adc_hw.c
 * ADC driver related 
 *
 * Author: Rama Rao Bisa <ramab@ami.com>
 *
 *****************************************************************/

#ifndef __ADC_H__
#define __ADC_H__


#define READ_ADC_CHANNEL		1
#define READ_ADC_REF_VOLATGE	2
#define READ_ADC_RESOLUTION		3

#define PACKED __attribute__ ((packed))

typedef struct
{
	uint8_t 	channel_num;
	uint16_t	channel_value;

} PACKED get_adc_value_t;

#endif /* !__ADC_H__ */
