/*
*******************************************************************************
 * File:		scsi.h
 * Purpose:		SCSI Related definitions for USB Mass Storage devices
                Again this file is used by the driver and then by usb
                firmware apps and also the remote side since all off them
                need an intricate understanding of scsi
******************************************************************************
 */

#ifndef SCSI_H
#define SCSI_H

#include "coreTypes.h"

#pragma pack (1)
/******** For CDROM TEST Later remove the following lines ***********/
#define CDROM_TEST 1
#define CDROM_TEST_BUFFER_SIZE	0x20000
#define SCSI_PASS_THROUGH_DIRECT_CMD 0xB1
//changed the above line to DIRECT_CMD because the exact same thing
//is a sturct definition in windows....
/********************************************************************/





/* SCSI Commands */
#define SCSI_FORMAT_UNIT					0x04
#define SCSI_INQUIRY						0x12
#define SCSI_MODE_SELECT					0x55
#define SCSI_MODE_SENSE						0x5A
#define SCSI_MEDIUM_REMOVAL					0x1E
#define SCSI_READ_10						0x28
#define SCSI_READ_12						0xA8
#define SCSI_READ_CAPACITY					0x25
#define SCSI_READ_FORMAT_CAPACITIES			0x23
#define SCSI_REQUEST_SENSE					0x03
#define SCSI_SEEK							0x2B
#define SCSI_START_STOP_UNIT				0x1B
#define SCSI_TEST_UNIT_READY				0x00
#define	SCSI_VERIFY							0x2F
#define SCSI_WRITE_10						0x2A
#define SCSI_WRITE_12						0xAA
#define SCSI_WRITE_AND_VERIFY				0x2E
#define SCSI_READ_TOC						0x43
#define SCSI_SEND_DIAGNOSTIC				0x1D



/***SCSI vendor specific commands for AMI****/
/**Group 7***/
#define ISAMICMD(x) ( ((x) & 0xE0) == 0xE0 )
#define SCSI_AMICMD_HEARTBEAT 				0xE0

#define SCSI_AMICMD_CURI_WRITE			 	0xE2
#define SCSI_AMICMD_CURI_READ				0xE3

#define SCSI_AMICMD_OSHBSTART				0xE5
#define SCSI_AMICMD_OSHB				0xE6
#define SCSI_AMICMD_OSHBSTOP				0xE7

#define SCSI_AMICMD_SUSPEND_HEALTH_MONITORING		0xE8
#define SCSI_AMICMD_RESUME_HEALTH_MONITORING		0xE9
#define SCSI_AMICMD_GET_HEALTH_MONITORING_STATUS	0xEA

#define SCSI_AMICMD_HOSTMOUSE			 	0xE1
#define SCSI_AMICMD_TESTHOSTMOUSE			0xEB

/*this command is used to identify the USB CCD exposed by G2**/
/*we send this form host agents to all drives . If this command
returns success with predefined data then we know it is a USB CDROM drive*/
#define SCSI_AMICMD_ID					0xEE


/* this definitions are used to identify whether the CMD is for
 * Command sector or Data sector */
#define SCSI_AMIDEF_CMD_SECTOR				0x01
#define SCSI_AMIDEF_DATA_SECTOR				0x02

/* SCSI Command Packets */
typedef struct
{
	uint8		OpCode;
	uint8		Lun;
	uint32		Lba;
	union
	{
		struct
		{
			uint8		Reserved6;
			uint16		Length;
			uint8		Reserved9[3];
		} Cmd10;
		struct Len32
		{
			uint32		Length32;
			uint8		Reserved10[2];
		} Cmd12;
	} CmdLen;
} SCSI_COMMAND_PACKET;

/* SCSI Inquiry Command Packet */
typedef struct
{
	uint8		OpCode;
	uint8		Lun;
	uint8		PageCode;
	uint8		Reserved3;
	uint8		AllocLen;
	uint8		Reserved5[7];
} SCSI_INQUIRY_COMMAND_PACKET;


/* SCSI Inquiry Packet */
typedef struct
{
	uint8		PeripheralType;
	uint8		RMB;
	uint8		ISO_ECMA_ANSI;				/* Should be set to 0 */
	uint8		ResponseDataFormat;			/* Should be set to 1 */
	uint8		AdditionalLength;			/* TotalSize - 5 */
	uint8		Reserved5[3];
	uint8		VendorInfo[8];
	uint8		ProductInfo[16];
	uint8		ProductRev[4];
	uint8		Padding[28];				/* See Notes at Bottom */
	uint8		ExtraPadding[191];			/* See Notes at Bottom */
} SCSI_INQUIRY_PACKET;

/* SCSI Request Sense Command Packet */
typedef struct
{
	uint8		OpCode;
	uint8		Lun;
	uint8		Reserved2;
	uint8		Reserved3;
	uint8		AllocLen;
	uint8		Reserved5[7];
} SCSI_REQUEST_SENSE_COMMAND_PACKET;

/* SCSI Request Sense */
typedef struct
{
	uint8		ErrorCode;
	uint8		Reserved1;
	uint8		SenseKey;					/* Lower 4 bits */
	uint8		Info[4];
	uint8		AdditionalLength;			/* TotalSize - 8 */
	uint8		VendorSpecific[4];
	uint8		SenseCode;
	uint8		SenseCodeQ;
	uint8		FRUCode;
	uint8		SenseKeySpecific[3];
	uint8		Padding[46];				/* See Notes at Bottom */
} SCSI_REQUEST_SENSE_PACKET;

/* SCSI Medium Removal Command Packet */
typedef struct
{
	uint8		OpCode;
	uint8		Lun;
	uint8		Reserved2;
	uint8		Reserved3;
	uint8		Prevent;
	uint8		Reserved5[7];
} SCSI_MEDIUM_REMOVAL_COMMAND_PACKET;


/* Defines for Peripheral Type */
# define PERIPHERAL_DIRECT			0x00		/* Hard disk, Floppy Disk */
# define PERIPHERAL_SEQUENTIAL		0x01		/* Tapes */
# define PERIPHERAL_WRITE_ONCE		0x04		/* WORM Optical Device */
# define PERIPHERAL_CDROM			0x05
# define PERIPHERAL_OPTICAL			0x06		/* Non-CD optical memory devices */
# define PERIPHERAL_UNKNOWN			0x1F		/* Unknown or no device type */

/* Defines for RMB */
# define MEDIUM_FIXED				0x00
# define MEDIUM_REMOVABLE			0x80


/* Notes:
	Some Host Software (like AMIBIOS 7), cannot handle the STALL condition generated when
	we send smaller (than the size requested) sized data packets. So all the variable size
	SCSI packets have extra padding so that we send the size equal to the size asked
	Extrapadding is added to work with Linux Enterprise Edition
*/

#pragma pack()
#endif
