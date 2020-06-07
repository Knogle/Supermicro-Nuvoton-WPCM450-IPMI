#ifndef __VSC_OPERATIONS_H__
#define __VSC_OPERATIONS_H__
#include "videoctl.h"

void print_vsc_version(unsigned long ver_reg_value);
int VSCInit(int vsc_fd);
int VSCStop(int vsc_fd);
int Read_MHL_MVL(int vsc_fd, unsigned long *mhl, unsigned long *mvl);
int Write_HL_VL(int vsc_fd, unsigned long hl, unsigned long vl);
void set_fb_format_info(fb_format_info_t *, FPGA_Ioctl *);
int InitParams(int vsc_fd);
int capture_diff_image(int vsc_fd, RegDataRec *pReg, fb_format_info_t *fb_format, unsigned long *size);
int calculate_region(RegDataRec **pReg, fb_format_info_t *fb_format);
int	sample_initial(int vsc_fd);
int measure_picture(int vsc_fd);
int capture_full_image(int vsc_fd, fb_format_info_t	*fb_format, unsigned long *size);
//int	sample_diff();
//void	sample_diff();


#endif



