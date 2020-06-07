
/******************************************************************************************

File : iusb.h

Purpose : iusb is the protoco for transporting usb over i(nternet?)
          as a result iusb.h is used right from the driver level
          upto the application level and to the remote side
          because all of them communicate by wrapping stuff 
          as iusb
          PLEASE DO NOT CHANGE THIS FILE WHEN YOU ARE HUNGRY OR SLEEPY.
          IT IS A MAJOR IMPACT FILE
******************************************************************************************/



#ifndef IUSB_H
#define IUSB_H

#include "scsi.h"


/* Note :All Length Fields used in IUSB are Little Endian */

#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif


/**
 * @struct  IUSB_HEADER packet format
 * @brief
**/
typedef struct
{
  u8      Signature [8];                  // signature "IUSB    "
  u8      Major;
  u8      Minor;
  u8      HeaderLen;                      // Header length
  u8      HeaderCheckSum;
  u32     DataPktLen;
  u8      ServerCaps;
  u8      DeviceType;
  u8      Protocol;
  u8      Direction;
  u8      DeviceNo;
  u8      InterfaceNo;
  u8      ClientData [2];
  u32     SeqNo;
  u8      Reserved [4];
} PACKED IUSB_HEADER;


/*************************iUSB Device Information **************************/
typedef struct
{
	uint8 DeviceType;
	uint8 DevNo;
	uint8 IfNum;
} PACKED  IUSB_DEVICE_INFO;

typedef struct
{
	IUSB_HEADER 		Header;
	uint8			DevCount;
	IUSB_DEVICE_INFO	DevInfo;	/* for each device */
} PACKED IUSB_DEVICE_LIST;

/******* Values for iUsb Signature and Major and Minor Numbers ***********/
#define IUSB_SIG			"IUSB    "
#define IUSB_MAJOR			1
#define IUSB_MINOR			0

/************************ Values for Protocol ****************************/
#define IUSB_PROTO_RESERVED		0x00
#define IUSB_PROTO_SCSI			0x01
#define IUSB_PROTO_FLOPPY		0x02
#define IUSB_PROTO_ATA			0x03
#define IUSB_PROTO_KEYBD_DATA	0x10	/* Keybd Data */
#define IUSB_PROTO_KEYBD_STATUS	0x11	/* Keybd Led Status */
#define IUSB_PROTO_MOUSE_DATA	0x20
#define IUSB_PROTO_MOUSE_ALIVE	0x21	/* Host Mouse Alive */


/************************ Values for DeviceType **************************/

/*
   Note: We use the SCSI-2 values for SCSI devices defined in the SCSI-2
         Specs. For non SCSI devices and those not defined in SCSI-2 Specs
         we follow our own values.
		 Each definition has the equivalent SCSI definition at the end of
		 line in a comment section.
*/

/* Defines for Lower 7 bits of Device Type */
#define IUSB_DEVICE_HARDDISK		0x00	/* PERIPHERAL_DIRECT		*/
#define IUSB_DEVICE_TAPE			0x01	/* PERIPHERAL_SEQUENCTIAL	*/
#define IUSB_DEVICE_02				0x02
#define IUSB_DEVICE_03				0x03
#define IUSB_DEVICE_WORM			0x04 	/* PERIPHERAL_WRITE_ONCE	*/
#define IUSB_DEVICE_CDROM			0x05	/* PERIPHERAL_CDROM			*/
#define IUSB_DEVICE_OPTICAL			0x06	/* PERIPHERAL_OPTICAL		*/
#define IUSB_DEVICE_UNKNOWN			0x1F	/* PERIPHERAL_UNKNOWN		*/
#define IUSB_DEVICE_FLOPPY			0x20
#define IUSB_DEVICE_CDRW			0x21
#define IUSB_DEVICE_KEYBD			0x30
#define IUSB_DEVICE_MOUSE			0x31
#define IUSB_DEVICE_HID				0x32	/* Keybd and Mouse Composite*/
#define IUSB_DEVICE_RESERVED		0x7F

/* Defines for High Bit of Device Type  */
# define IUSB_DEVICE_FIXED			0x00	/*	MEDIUM_FIXED			*/
# define IUSB_DEVICE_REMOVABLE		0x80	/*	MEDIUM_REMOVABLE		*/

/**************** Values for Direction Field of IUSB Header ****************/
#define TO_REMOTE	0x00
#define FROM_REMOTE	0x80



typedef struct
{
  IUSB_HEADER   Header;
  u8            DataLen;
  u8            Data;
} PACKED IUSB_HID_PACKET;




typedef struct
{
	uint8 		Event;
	uint8		dx;
	uint8		dy;
	uint16		AbsX;
	uint16		AbsY;
	uint16		ResX;
	uint16		ResY;
	uint8		IsValidData;
} PACKED HOST_MOUSE_PKT;

/*used by hidserver for playing back 
  absolute mouse directly on USB
  in this new mode absolute scaled coords
  are always sent by the remote console and this
  is played back driectly by the USB mouse itself.
*/
typedef struct 
{
    uint8 Event;
    uint16 ScaledX;
    uint16 ScaledY;
}
PACKED DIRECT_ABSOLUTE_USB_MOUSE_PKT;




#define FLEXIBLE_DISK_PAGE_CODE	(0x05)
typedef struct
{
	uint16 ModeDataLen;
#define MEDIUM_TYPE_DEFAULT	(0x00)
#define MEDIUM_TYPE_720KB	(0x1e)
#define MEDIUM_TYPE_125_MB	(0x93)
#define MEDIUM_TYPE_144_MB	(0x94)
	uint8 MediumTypeCode;
	uint8 WriteProtect; // bit(7):write protect, bit(6-5):reserved, bit(4):DPOFUA which should be zero, bit(3-0) reserved
	uint8 Reserved[4];
} PACKED MODE_SENSE_RESP_HDR;

typedef struct
{
	MODE_SENSE_RESP_HDR	ModeSenseRespHdr;
#define MAX_MODE_SENSE_RESP_DATA_LEN	(72)
#define FLEXIBLE_DISK_PAGE_LEN	(32)
	uint8	PageData[MAX_MODE_SENSE_RESP_DATA_LEN];
} PACKED MODE_SENSE_RESPONSE;

typedef struct
{
	uint8	PageCode;
	uint8	PageLength; //1Eh
	uint16	TransferRate;
	uint8	NumberofHeads;
	uint8	SectorsPerTrack;
	uint16	DataBytesPerSector;
	uint16	NumberofCylinders;
	uint8	Reserved1[9];
	uint8	MotorONDelay;
	uint8	MotorOFFDelay;
	uint8	Reserved2[7];
	uint16	MediumRotationRate;
	uint8	Reserved3;
	uint8	Reserved4;
} PACKED FLEXIBLE_DISK_PAGE;

/********* Scsi Status Packet Structure used in IUSB_SCSI_PACKET ***********/
typedef struct
{
	uint8 	OverallStatus;
	uint8	SenseKey;
	uint8	SenseCode;
	uint8	SenseCodeQ;
} PACKED SCSI_STATUS_PACKET;

/******************* IUSB Scsi Request/ResponsePacket ************************/
typedef struct
{
    IUSB_HEADER  Header;
	uint32	ReadLen;				/* Set by Initiator*/
	uint32 	TagNo;					/* Set by Initiator*/
	uint8	DataDir;				/* Set by Initiator (Read/Write) */
	SCSI_COMMAND_PACKET	CommandPkt;	/* Set by Initiator*/
	SCSI_STATUS_PACKET	StatusPkt;	/* Set by Target in Response Pkt*/
	uint32	DataLen;  				/* Set by Initiator and Target */
	uint8	Data;					/* Set by Initiator and Target */
} PACKED IUSB_SCSI_PACKET;

/* Values for DataDir in ScsiRequest Packet */
#define READ_DEVICE		0x01
#define WRITE_DEVICE	0x02

/*********************** Helper Functions **********************************/
void
FormiUsbHeader(IUSB_HEADER *Header, uint32 DataLen, uint8 DevNo, uint8 ifnum,
				uint8 DeviceType,uint8 Protocol);



#ifndef __GNUC__
#pragma pack()
#endif

#endif

