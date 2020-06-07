#ifndef __LIB_MMAP_H__
#define __LIB_MMAP_H__
void *InitMmap(void);
void ExitMmap(void *handle);
void UnMapMemory(void *handle);
void *MapMemory(void *handle,unsigned long addr,unsigned long *len);

int mmap_write32(unsigned long addr, unsigned long data);
int mmap_read32(unsigned long addr, unsigned long *data);

int mmap_write16(unsigned long addr, unsigned short data);
int mmap_read16(unsigned long addr, unsigned short *data);

int mmap_write8(unsigned long addr, unsigned char data);
int mmap_read8(unsigned long addr, unsigned char *data);

#endif
