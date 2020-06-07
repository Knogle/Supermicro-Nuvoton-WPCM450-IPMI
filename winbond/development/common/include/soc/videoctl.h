# ifndef __AMI_VIDEOCTL_H_
# define __AMI_VIDEOCTL_H_

/* Character device IOCTL's */
#define FPGA_MAGIC  		'a'
#define FPGA_IOCCMD     	_IOWR(FPGA_MAGIC, 0,FPGA_Ioctl)

typedef enum FPGA_opcode
{
    FPGA_IOCTL_START_CAPTURE = 0,
    FPGA_IOCTL_STOP_CAPTURE,
    FPGA_IOCTL_GET_SCREEN,
    FPGA_IOCTL_DONE_SCREEN,
	FPGA_IOCTL_COMP_SCREEN,
	FPGA_IOCTL_COMP_TILES,
	FPGA_IOCTL_ENABLE_EDID_SCAN,
} FPGA_OpCode;

typedef enum
{
	FPGA_IOCTL_SUCCESS = 0,
	FPGA_IOCTL_INTERNAL_ERROR,
	FPGA_IOCTL_CAPTURE_ALREADY_ON,
	FPGA_IOCTL_CAPTURE_ALREADY_OFF,
	FPGA_IOCTL_SEQNO_MISMATCH,
	FPGA_IOCTL_NO_SCREENS,
	FPGA_IOCTL_NO_INPUT,
	FPGA_IOCTL_INVALID_INPUT,
	FPGA_IOCTL_NO_VIDEO_CHANGE,
	FPGA_IOCTL_BLANK_SCREEN,
	FPGA_IOCTL_HOST_POWERED_OFF,
	FPGA_IOCTL_FPGA_PROG_ERROR,

} FPGA_ErrCode;

typedef struct
{
	unsigned long  FrameSeqNo;
	unsigned short FrameWidth;
	unsigned short FrameHeight;
	unsigned short FrameBpp;
	unsigned short FrameHasDiffMap;
	unsigned long  FrameFull;
	unsigned short FrameValid;
	unsigned short LinePitch; //Current resolution's line pitch

} FRAME_INFO;
typedef struct
{
	void*  Format_Info;
	void*  Rect_Info;
	char*  Buff_addr;
	char*  Rle_buf;
	unsigned long Comp_Size;
} COMP_INFO;

#if 0
/* Soft compression types */
#define SOFT_COMPRESSION_NONE 		0x00
#define SOFT_COMPRESSION_MINILZO	0x01
#define SOFT_COMPRESSION_GZIP		0x02
#define SOFT_COMPRESSION_BZIP2		0x03
#endif
#define NO_COMPRESSION 0x00
#define RLE_8Bit		0x01
#define RLE_16Bit	0x02
#define RLE_32Bit	0x03

typedef struct
{
	FPGA_OpCode	OpCode;
	FPGA_ErrCode 	ErrCode;
  	union
	{
		struct
		{
			unsigned short FrameBpp;
		} Start_Capture;
		struct
		{
			unsigned long FrameSeqNo;
		} Done_Screen;
		FRAME_INFO Get_Screen;
		COMP_INFO Comp_Screen;

	};
} __attribute__((packed)) FPGA_Ioctl ;

#endif
