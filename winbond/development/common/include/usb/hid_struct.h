#ifndef __HID_STRUCT_H__
#define __HID_STRUCT_H__

#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif

// Keyboard report
typedef struct 
{
	BYTE	Modifiers;
	BYTE	Reserved;
	BYTE	Keys[6];
} PACKED USB_KEYBOARD_REPORT_T;

typedef struct 
{
	union {

		struct {
			unsigned int LCtrl  : 1;
			unsigned int LShift : 1;
			unsigned int LAlt	: 1;
			unsigned int LGui	: 1;
			unsigned int RCtrl  : 1;
			unsigned int RShift : 1;
			unsigned int RAlt	: 1;
			unsigned int RGui	: 1;
		} PACKED bmMod;

		BYTE	Mod;
	} PACKED bUn;

} PACKED USB_KEY_MODIFIERS_T;

// Mouse report
typedef struct
{
	BYTE	Event;
	WORD	X;
	WORD	Y;
	BYTE 	Scroll;
} PACKED USB_ABS_MOUSE_REPORT_T;

// Mouse report
typedef struct
{
	BYTE	Event;
	BYTE	X;
	BYTE	Y;
	BYTE 	Scroll;
} PACKED USB_REL_MOUSE_REPORT_T;

#define MAX_MOUSE_REPORT_SIZE	(((sizeof(USB_ABS_MOUSE_REPORT_T))>(sizeof(USB_REL_MOUSE_REPORT_T)))?(sizeof(USB_ABS_MOUSE_REPORT_T)):(sizeof(USB_REL_MOUSE_REPORT_T)))

#define MAX_KEYBD_REPORT_SIZE	(sizeof(USB_KEYBOARD_REPORT_T))

// Mouse events
#define EVT_MOUSEMOVE		0x00
#define EVT_LBUTTON			0x01
#define EVT_RBUTTON			0x02
#define EVT_MBUTTON			0x04

/* USB device numbers */
# define  KEYBD_DEVNUM		2
# define  KEYBD_IFNUM		0 
# define  MOUSE_DEVNUM		2
# define  MOUSE_IFNUM		1 

#define ENCRYPTION_ENABLED		(255)

#define NUMLOCK		(0x01)
#define CAPSLOCK	(0x02)
#define SCROLLLOCK	(0x04)

#ifdef __GNUC__
#undef PACKED 
#else
#undef PACKED
#pragma pack()
#endif


#endif



