
/*
 *******************************************************************************
 * File:		usb_ioctl.h
 * Purpose:		USB Ioctl Related Stuff
 * Note:		This file is shared between the driver & the 
 *			applications which want to communicate with the driver
 *******************************************************************************
 */
#ifndef USB_IOCTL_H
#define USB_IOCTL_H

/*Ioctls */
#define USB_GET_IUSB_DEVICES	_IOC(_IOC_READ, 'U',0x00,0x3FFF)

#define USB_KEYBD_DATA		_IOC(_IOC_WRITE,'U',0x11,0x3FFF)
#define USB_KEYBD_LED		_IOC(_IOC_READ ,'U',0x12,0x3FFF)
#define USB_KEYBD_EXIT		_IOC(_IOC_WRITE,'U',0x13,0x3FFF)

#define USB_MOUSE_DATA		_IOC(_IOC_WRITE,'U',0x21,0x3FFF)
#define MOUSE_ABS_TO_REL        _IOC(_IOC_WRITE,'U',0x22,0x3FFF)
#define MOUSE_REL_TO_ABS        _IOC(_IOC_WRITE,'U',0x23,0x3FFF)
#define MOUSE_GET_CURRENT_MODE  _IOC(_IOC_WRITE,'U',0x24,0x3FFF)
#define USB_GET_ADDRESS  	_IOC(_IOC_WRITE,'U',0x25,0x3FFF) 
#define USB_MOUSE_DATA4PS2	_IOC(_IOC_WRITE,'U',0x26,0x3FFF)

#define USB_CDROM_REQ		_IOC(_IOC_READ, 'U',0x31,0x3FFF)
#define USB_CDROM_RES		_IOC(_IOC_WRITE,'U',0x32,0x3FFF)
#define USB_CDROM_EXIT		_IOC(_IOC_WRITE,'U',0x33,0x3FFF)
#define USB_CDROM_ACTIVATE	_IOC(_IOC_WRITE,'U',0x34,0x3FFF)


#define USB_HDISK_REQ		_IOC(_IOC_READ, 'U',0x41,0x3FFF)
#define USB_HDISK_RES		_IOC(_IOC_WRITE,'U',0x42,0x3FFF)
#define USB_HDISK_EXIT		_IOC(_IOC_WRITE,'U',0x43,0x3FFF)
#define USB_HDISK_ACTIVATE	_IOC(_IOC_WRITE,'U',0x44,0x3FFF)

#define USB_FLOPPY_REQ		_IOC(_IOC_READ, 'U',0x51,0x3FFF)
#define USB_FLOPPY_RES		_IOC(_IOC_WRITE,'U',0x52,0x3FFF)
#define USB_FLOPPY_EXIT		_IOC(_IOC_WRITE,'U',0x53,0x3FFF)
#define USB_FLOPPY_ACTIVATE	_IOC(_IOC_WRITE,'U',0x54,0x3FFF)
#define USB_FLOPPY_EMULATE	_IOC(_IOC_WRITE,'U',0x55,0x3FFF)

#define USB_VENDOR_REQ		_IOC(_IOC_READ, 'U',0x61,0x3FFF)
#define USB_VENDOR_RES		_IOC(_IOC_WRITE,'U',0x62,0x3FFF)
#define USB_VENDOR_EXIT		_IOC(_IOC_WRITE,'U',0x63,0x3FFF)

#define USB_DYNAMIC_DEV_REQ	_IOC(_IOC_WRITE,'U',0x71,0x3FFF)
#define USB_DYNAMIC_DEV_RES	_IOC(_IOC_WRITE,'U',0x72,0x3FFF)
#define USB_DYNAMIC_DEV_EXIT _IOC(_IOC_WRITE,'U',0x73,0x3FFF)
#define USB_DYNAMIC_DEV_ACTIVATE	_IOC(_IOC_WRITE,'U',0x74,0x3FFF)
#define USB_DYNAMIC_DEV_ATTACH	_IOC(_IOC_WRITE,'U',0x75,0x3FFF)
#define USB_DYNAMIC_DEV_DETACH	_IOC(_IOC_WRITE,'U',0x76,0x3FFF)


#define USB_GLOBAL_DISCONNECT	_IOC(_IOC_WRITE,'U',0xE1,0x3FFF)		
#define USB_GLOBAL_RECONNECT	_IOC(_IOC_WRITE,'U',0xE2,0x3FFF)
#define USB_DEVICE_DISCONNECT	_IOC(_IOC_WRITE,'U',0xE3,0x3FFF)
#define USB_DEVICE_RECONNECT	_IOC(_IOC_WRITE,'U',0xE4,0x3FFF)

#define USB_REMOVE_DEVICE	_IOC(_IOC_WRITE,'U',0xE8,0x3FFF)
#define USB_ADD_DEVICE		_IOC(_IOC_WRITE,'U',0xE9,0x3FFF)

#define SEND_HEARTBEAT		_IOC(_IOC_WRITE,'H',0xF0,0x3FFF)




/* Values for HEARTBEAT Result */
#define HB_PULSE		0		
#define HB_NOPULSE		1
#define HB_MISSING_HEART	2	

#endif  /* USB_IOCTL_H */

/****************************************************************************/
