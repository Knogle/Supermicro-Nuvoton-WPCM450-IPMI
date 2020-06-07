/**
 * \file lara.h
 * This file contains definitions and the device driver interface
 * for VSC1/2 based devices.
 *
 * Copyright (c) 2004-2006 Peppercon AG
 */

#ifndef _LINUX_LARA_H
#define _LINUX_LARA_H

#include "pp_kernel_common.h"
#include "vsc_hwenc_data.h"
#include "vsc_regs.h"
#include "vschelper.h"
//#include "gpio_hilevel_functions.h"

/**
 * amount of physically continuous memory for all clients
 * (in case of hw encoding) or the framebuffer (old KIMs)
 */
//#define CAPTURE_BUFFER_SIZE	0x281000   /* 1024*1280 (Video Buffer)	+ 4K for diff */
#define CAPTURE_BUFFER_SIZE	0x401000   /* 1024*4096(including pitch) (Video Buffer)  + 4K for diff */
//#define DIFF_TABLE_OFFSET   0x280000
#define DIFF_TABLE_OFFSET   0x400000
	
#define COMP_BUFF_OFFSET 0x281000
#define FB_FORMAT_INFO_OFFSET 0x501010	/*CAPTURE_BUFFER_SIZE+1280*1024*2(COMP Buffer)+16*/
#define RECT_TABLE_OFFSET  FB_FORMAT_INFO_OFFSET+0X18 /*24=fb_format_info size*/
#define INTERNAL_RAM_ADDR 0x00000500


/**
 * Framebuffer color format information
 */
typedef struct {
    u_int bpp;		///< bits per pixel, memory amount which is used by one pixel
    u_int depth;	///< how many bits of 'bpp' are used for color information
    u_int red_bits;	///< how many bits are used for red band
    u_int green_bits;	///< how many bits are used for green band
    u_int blue_bits;	///< how many bits are used for blue band
} fb_color_info_t;

/**
 * Frame buffer format information
 */
typedef struct {
    u_int16_t g_w;          ///< visible screen width in pixels
    u_int16_t g_wb;		///< visible screen width in bytes
    u_int16_t g_h;		///< visible screen height
    u_int16_t g_w_pd;       ///< padded screen width (hextile increments)
    u_int16_t g_wb_pd;	///< padded screen width in bytes (hextile increments)
    u_int16_t g_h_pd;       ///< padded screen height (hextile increments)
    u_int16_t tiles_w;      ///< number of horizontal hextiles
    u_int16_t tiles_h;      ///< number of vertical hextiles 
    u_int16_t bpp;		///< bits per pixel, memory amount which is used by one pixel
    u_int16_t ex_pitch; //<No of dummy bytes in a line>
    u_int16_t is_unsupported;	///< we have an unsupported mode which can't be displayed
    u_int16_t dummy;
} fb_format_info_t;


/**
 * PCI base address configuration for PPC and HFC
 */
typedef struct {
    u_int32_t ppc_pcibar2;
    u_int32_t hfc_pcibar1;
} pci_config_t;

/**
 * Defined to read and write VSC registers directly from user space
 *
 * \def VSC_REG_READ
 * Standard read method
 *
 * \def VSC_REG_READ_SECURE
 * Secure read method. Some registers may change during a read
 * cycle, so they need to be read twice to check if they did, in that
 * case the read operation will be repeated.
 * Concerning registers are marked in vsc_regs.h
 *
 * \def VSC_REG_READ_SHADOWED
 * Some registers are shadowed, i.e. cannot read back from the VSC.
 * User this read method to get the shadow value.
 * Concerning registers are marked in vsc_regs.h
 *
 * \def VSC_REG_WRITE
 * Standard read method
 *
 * \def VSC_REG_WRITE_MASKED
 * Masked write method, only affects part of the bits in the register.
 */
#define VSC_REG_READ		0
#define VSC_REG_READ_SECURE	1
#define VSC_REG_READ_SHADOWED	2
#define VSC_REG_WRITE		3
#define VSC_REG_WRITE_MASKED	4
#define VSC_REG_WRITE_MASKED_NOSHADOW	5

/**
 * VSC register operations data structure, to access registers
 * directly from user space
 */
typedef struct {
    u_int8_t  op;	///< register operation
    u_int8_t  reg;	///< register number
    u_int32_t data;	///< transfered register content, in/output
    u_int32_t mask;	///< mask for VSC_REG_WRITE_MASKED operation
} vsc_regop_t;

/**
 * Check for a sync change IRQ from the VSC
 */
typedef struct {
    u_int8_t do_wait; ///< if 1, sleep while waiting for an IRQ, if 0 return in any case
    u_int8_t got_irq; ///< return value, 1 if an IRQ occured
} sync_wait_t;

/**
 * Check for a sync change IRQ from the VSC
 *
 * \def VSC_MAX_MEASURES
 * Maximum number of horizontal offset/length measurements based
 * on the black level of the picture
 */
#define VSC_MAX_MEASURES	(VSC_MAX_RES_Y)
typedef struct {
    u_int16_t ofsY;	///< vertical offset
    u_int16_t totalY;	///< total vertical length of the frame (offset + active length)
    u_int16_t x_count;	///< numer of lines measured (horizontally)
    u_int16_t ofsX[VSC_MAX_MEASURES]; ///< horizontal offset per line
    u_int16_t lenX[VSC_MAX_MEASURES]; ///< horizontal active length per line
} vsc_measures_t;

/**
 * Sync input measurements using the VSC itself.
 *
 * When using the VSC without an according ADC doing the sync signal detection,
 * the VSC is able to provide the information if H- and or V-sync overflows,
 * which then can be used t detect the sync.
 */
typedef struct {
    u_int8_t hs_slow; ///< h-sync is missing (vsc counter overflow)
    u_int8_t vs_slow; ///< v-sync is missing (vsc counter overflow)
} vsc_sync_speed_t;

/**
 * VSC/grab encoding descriptor
 * fixed configuration for the hw encoder which enables usage of predefined
 * encodings with all parameters set to certain predefined values
 */
typedef struct vsc_encoding_desc_s {
    u_char algo;			///< the encoding algorithmus
    
    /* lrle specific encoding settings */
    u_char lrle_r_margin_rb;		///< pixel diff margin for red and blue channels
    u_char lrle_r_margin_g;		///< pixel diff margin for green channel
    u_char lrle_c_margin_rb;		///< linecopy margin for red and blue channels
    u_char lrle_c_margin_g;		///< linecopy margin for green channel
    u_char lrle_g_margin;		///< grey compressor pixel diff margin
    u_char lrle_runlimit;		///< run length limit in LRLE stage
    u_char lrle_linecopy;		///< enable line copies
    u_char lrle_grey_force;		///< force grey compression
    u_char lrle_grey_disable;		///< disable grey compression
    u_char lrle_grey_green;		///< green grey mode
    u_char lrle_runlimit_reacc;		///< run length limit in reaccumulator stage
    u_char lrle_color;			///< color reduction mode

    /* downsampling specific encoding settings */
    u_char down_mode;			///< downsampling mode (scaling)
} vsc_encoding_desc_t;

#define VSC_FETCH_CTRL_DIRECT_FB		0x01	///< direct to fb (VSC1)
#define VSC_FETCH_CTRL_ADD_HDR			0x02	///< add header before each rect

/**
 * Possible errors occuring during the grabber calls.
 * not generated in the kernel, only defined here
 * in preparation for higher levels
 *
 * \def VSC_FETCH_ERROR_NO_ERROR
 * \def VSC_FETCH_ERROR_NO_SIGNAL
 * \def VSC_FETCH_ERROR_NOT_AVAILABLE
 * \def VSC_FETCH_ERROR_UNKNOWN_MODE
 * \def VSC_FETCH_ERROR_TIMEOUT
 * \def VSC_FETCH_ERROR_INTERNAL_ERROR
 * \def VSC_FETCH_ERROR_DEBUGGING_ERROR
 * \def VSC_FETCH_ERROR_REALLOC_IN_PROGRESS
 * \def VSC_FETCH_ERROR_EMPTY_REQUEST
 * \def VSC_FETCH_ERROR_MODE_CHANGE
 */
 
#define VSC_FETCH_ERROR_NO_ERROR		0x00
#define VSC_FETCH_ERROR_NO_SIGNAL		0x01
#define VSC_FETCH_ERROR_NOT_AVAILABLE		0x02
#define VSC_FETCH_ERROR_UNKNOWN_MODE		0x03
#define VSC_FETCH_ERROR_TIMEOUT			0x04
#define VSC_FETCH_ERROR_INTERNAL_ERROR		0x05
#define VSC_FETCH_ERROR_DEBUGGING_ERROR		0x06
#define VSC_FETCH_ERROR_REALLOC_IN_PROGRESS	0x07
#define VSC_FETCH_ERROR_EMPTY_REQUEST		0x08
#define VSC_FETCH_ERROR_MODE_CHANGE		0x09

/**
 * header added before each rectangle transferred from the vsc
 */
typedef struct {
    vsc_rect_t r;		///< rectangle coordinates
    u_int32_t  encoding;	///< encoding description
    u_int32_t  size;		///< 'real', unpadded size, data will be 4byte-padded
} vsc_update_rect_hdr_t;

/**
 * VSC fetch descriptor for the grabber, determines how to get
 * the encoded video data block/region from the chip
 */
typedef struct {
    /* general control */
    u_char ctrl;
    
    /* input data */
    RegionRec* reg;		///< region to transfer
    u_int32_t mem_offset;	///< dest offset into the mem pool

    vsc_encoding_desc_t enc;    ///< encoding descriptor
    u_int32_t enc_tag;		///< encoding tag from requestor
    
    /* return values */
    u_long size;		///< transferred bytes
    u_char error;		///< type of error during transfer
} vsc_fetch_descriptor_t;

/**
 * clock information, passed from bootcode,
 * architecture dependent
 */
typedef struct {
    unsigned int cpu; ///< CPU freq in Hz
    union {
	struct {
	    unsigned int plb; ///< PLB Bus speed, in Hz
	    unsigned int pci; ///< PCI Bus speed, in Hz
	} ppc;
	struct {
	    unsigned int ahb; ///< AHB bus speed (Hz)
	    unsigned int apb; ///< APB bus speed (Hz)
	} arm;
    } arch;
} clock_info_t;

/**
 * VSC grabber operation IOCTLs
 *
 * TODO(miba)
 * the IOCTL defines here are currently used mixed between lara_common.o
 * and lara_vsc.o which is not nice, separate them to includes
 *
 * \def PPIOCVSCREGOP
 * Execute a VSC register operation, i.e. read/write registers. See also
 * vsc_regop_t
 *
 * \def PPIOCVSCGETSYNCIRQ
 * Check and/or wait if a sync change irq occured. See also
 * sync_wait_t.
 *
 * \def PPIOCVSCMEASUREPICTURE
 * Measure the size of the current video input frame (offset and length
 * of the active area). See also vsc_measures_t.
 *
 * \def PPIOCVSCAUTOADJUSTSTEP
 * Do a single autoadjustment step (test a single clock/phase):
 * first sampling -> copy -> second sampling -> processing.
 *
 * \def PPIOCVSCSAMPLE
 * \def PPIOCVSCSAMPLEANDDIFF
 * Start a VSC sampling and/or processing run, i.e. comparision
 * of front and back buffer in VSC. See also vsc_fetch_descriptor_t.
 *
 * \def PPIOCVSCACTIVATE
 * On FPGA based devices this IOCTL enables access to VSC and
 * its register, before this is isses the VSC must not be touched.
 * 
 * \def PPIOCVSCFETCHTILES
 * Request a number of encoded rectangles from the VSC and store
 * them in the buffer memory.
 *
 * \def PPIOCVSCGETSYNCSPEED
 * Check if a H- or V-sync overflow occured since the last run of
 * PPIOCVSCRSTSYNCSPEED. See also vsc_sync_speed_t.
 *
 * \def PPIOCVSCRSTSYNCSPEED
 * Reset the sync speed overflow counter to be able to check
 * for an overlow with PPIOCVSCGETSYNCSPEED later.
 *
 * \def PPIOCVSCGETCLOCK
 * Get bus clock information to calculate sync frequencies correctly
 * from the clock period counts measured by the VSC.
 *
 * \def PPIOCVSCGETADCRESOK
 * Determine if the clock domain with on the VSC input side has
 * successfully left the reset state (i.e. there was a pixel clock once).
 *
 */

#define FPGA_IOCTL  _IO('a', 0)
#if 0
#define ERICIOCGETPOSTCODE		_IOR ('e', 12, u_int8_t)
#define ERICIOCWAITFORISDNRESTARTCOND	_IOW ('e', 14, u_short)
#define ERICIOCGETPCICONFIG	        _IOR ('e', 15, pci_config_t)
#define ERICIOCSETPCICONFIG		_IOW ('e', 16, pci_config_t)
#define ERICIOCHAVEISDN			_IOR ('e', 17, int)
#define ERICIOCPROPCHANGESIGNAL		_IOW ('e', 21, int)
#define ERICIOCKMEISPRESENT		_IOR ('e', 22, int)
#define ERICIOCRESETISDN		_IO  ('e', 23)
#define ERICIOCGETISDNPCISTATUS		_IOR ('e', 24, u_short)
#define ERICIOCCHECKSERIALDEBUG		_IOR ('e', 25, int)
#define ERICIOCCHECKDEFAULTS		_IOR ('e', 29, int)
#define ERICIOCGETVGACHIPID		_IOR ('e', 31, int)
#define ERICIOCFPGAWRITEBYTE		_IOW ('e', 33, u_int8_t)
#define ERICIOCGETHARDWAREREVISION	_IOR ('e', 36, u_int8_t)
#define ERICIOCGETVIDEOHSYNC            _IOW ('e', 40, int)
#define ERICIOCGETVIDEOVSYNC            _IOW ('e', 41, int)
/* 43-47 unused/deprecated */
#define ERICIOCCHECKCONFIGMODE		_IOR ('e', 48, int)
#define ERICIOCCHECKCABLEKME		_IOR ('e', 50, int)

#define PPIOCCLAIMGRABBER		_IO  ('e', 51)
#define PPIOCRELEASEGRABBER		_IO  ('e', 52)
#define PPIOCVSCREGOP			_IOWR('e', 53, vsc_regop_t)
#define PPIOCVSCGETSYNCIRQ		_IOWR('e', 54, sync_wait_t)
#define PPIOCVSCMEASUREPICTURE		_IOWR('e', 55, vsc_measures_t)
#define PPIOCVSCAUTOADJUSTSTEP		_IO  ('e', 56)
#define PPIOCVSCSAMPLEANDDIFF		_IOWR('e', 57, u_int32_t*)
#define PPIOCVSCACTIVATE		_IO  ('e', 58)
#define PPIOCVSCFETCHTILES		_IOW ('e', 59, vsc_fetch_descriptor_t)
#define PPIOCVSCGETSYNCSPEED		_IOR ('e', 60, vsc_sync_speed_t)
#define PPIOCVSCRSTSYNCSPEED		_IO  ('e', 61)
#define PPIOCGETCLOCKINFO		_IOWR('e', 62, clock_info_t)

/* 63-66 unused/deprecated */
#define PPIOCSTATUSLEDBLINKING		_IOW ('e', 67, unsigned char)
#define PPIOCSETFBFORMATINFO		_IOW ('e', 68, fb_format_info_t)
#define PPIOCVSCSAMPLE			_IO  ('e', 69)
#define PPIOCGETCLOCKVALUE              _IOWR('e', 70, u_int64_t)
#define PPIOCVSCGETCLOCK		_IOR ('e', 71, int)
#define PPIOCVSCGETADCRESOK		_IOR ('e', 72, u_char)
#define PPIOCVSCFIFORESET               _IO  ('e', 73)
#define PPIOCVSCMASTERRESET             _IO  ('e', 74)
#define PPIOCVSCFIFORESETCLEAR          _IO  ('e', 75)
#endif

#endif /* _LINUX_LARA_H */
