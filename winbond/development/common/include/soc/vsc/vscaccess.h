#ifndef __VSC_ACCESS_H__
#define __VSC_ACCESS_H__

int OpenVSCDriver();
void CloseVSCDriver(int vsc_fd);

/*
flags:
VSC_REG_READ		0
VSC_REG_READ_SECURE	1
VSC_REG_READ_SHADOWED	2
*/
int ReadVSCReg(int vsc_fd, unsigned char RegNum, unsigned char flags, unsigned long *data);

/*
flags:
VSC_REG_WRITE	3
*/
int WriteVSCReg(int vsc_fd, unsigned char RegNum, unsigned char flags, unsigned long data);

/*
flags:
VSC_REG_WRITE_MASKED	4
VSC_REG_WRITE_MASKED_NOSHADOW	4
*/
int WriteVSCRegMasked(int vsc_fd, unsigned char RegNum, unsigned char flags, unsigned long data, unsigned long mask);
#endif


