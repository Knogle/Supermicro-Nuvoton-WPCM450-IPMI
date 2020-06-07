#ifndef AMI_COMPRESS_H
#define AMI_COMPRESS_H

/* Soft compression types */
#define SOFT_COMPRESSION_NONE 			0x00
#define SOFT_COMPRESSION_MINILZO		0x01
#define SOFT_COMPRESSION_GZIP			0x02
#define SOFT_COMPRESSION_BZIP2			0x03
#define SOFT_COMPRESSION_QLZW			0x04
#define SOFT_COMPRESSION_QLZW_MINILZO	0x05

#define SOFT_COMPRESSION_RLE				0x06
#define SOFT_COMPRESSION_RLE_QLZW		0x07

int InitCompression(void);
unsigned long DoCompression(char *InBuf, unsigned long InSize, char *OutBuf, unsigned long OutSize);

#endif /* AMI_COMPRESS_H */
