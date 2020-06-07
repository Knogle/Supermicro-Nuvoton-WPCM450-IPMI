/**
 * Video_pkt.h
 * Intelligent Video Transfer Protocol packet structure
**/

#ifndef VIDEO_PKT_H
#define VIDEO_PKT_H

//#include "types.h"
#include "sessioncfg.h"
//#include "sessionreqhdlr.h"

#ifdef __GNUC__
#define PACK __attribute__ ((packed))
#else
#define PACK
#pragma pack( 1 )
#endif


/*--------------------------------------------------------------
	List of Commands used between the
	Client & the Adaptive Video Server (ADVISER)
----------------------------------------------------------------*/
#define ADVISER_LOGIN              					(0x01)
#define DUMMY_LOGIN									(0x02)
#define ADVISER_VIDEO_FRAGMENT						(0x03)
#define ADVISER_HID_PKT								(0x04)
#define ADVISER_REFRESH_VIDEO_SCREEN				(0x05)
#define ADVISER_PAUSE_REDIRECTION					(0x06)
#define ADVISER_RESUME_REDIRECTION					(0x07)
#define ADVISER_BLANK_SCREEN						(0x08)
#define ADVISER_STOP_SESSION_IMMEDIATE				(0x9)
#define ADVISER_GET_USB_MOUSE_MODE					(0xa)
#define ADVISER_SET_COLOR_MODE						(0xb)
#define ADVISER_USER_AUTH							(0xc)
#define ADVISER_SESS_REQ							(0xd)
#define ADVISER_SESS_APPROVAL						(0xe)
#define ADVISER_SYNC_KEYBD_LED						(0xf)

/**
	The following status codes are applicable only
	for the command ADVISER_STOP_SESSION_IMMEDIATE.
*/
#define STATUS_SESS_CLOSE_UNKNOWN					(0x00)
#define STATUS_SESS_CLOSE_MAX_SESS_REACHED			(0x01)
#define STATUS_SESS_CLOSE_CONF_FILE_CHANGED			(0x02)
#define STATUS_SESS_CLOSE_WRONG_PORT				(0x03)
#define STATUS_SESS_CLOSE_REDIR_DISABLED			(0x04)
#define STATUS_SESS_CLOSE_AUTH_FAILED				(0x05)
#define STATUS_SESS_CLOSE_PERM_DENIED				(0x06)


/*
 * Status codes for status field in ivtp_hdr_t
**/
#define	STATUS_SUCCESS				(0x00)
#define STATUS_HOST_POWERED_OFF		(0x01)


/**
 * IVTP packet header
**/
typedef struct
{
	u8		type;				/**< Type of the packet **/
	u32		pkt_size;			/**< Size of the remaining portion of the packet */
	u16		status;				/**< status field. used for sending response	 */

} PACK ivtp_hdr_t;

/**
 * Video fragment
**/
typedef struct
{
	ivtp_hdr_t		hdr;			/**< packet header		 							*/
	u16				frag_num;		/**< Fragment number, MSB set for the last fragment */

} PACK video_frag_hdr_t;

/**
 * Frame header
**/
typedef struct
{
	u32				size;				/**< Size of the frame	*/
	u16				res_x;
	u16				res_y;
	u8				color_mode;

} PACK frame_hdr_t;

/**
 * Refresh Video Screen
**/
typedef struct
{
	ivtp_hdr_t		hdr;

} PACK refresh_video_screen_t;


/**
 * Pauses the video redirection
**/
typedef struct
{
	ivtp_hdr_t		hdr;

} pause_redirection_t;


/**
 * Resume redirection
**/
typedef struct
{
	ivtp_hdr_t		hdr;

} resume_redirection_t;

/**
 * Set USB mouse mode
**/
typedef struct
{
	ivtp_hdr_t		hdr;
	u8			mouse_mode;

} PACK usb_mouse_mode_t;


typedef struct
{
	ivtp_hdr_t	hdr;
	u8			color_mode;
} PACK color_mode_t;

typedef struct
{
#define AUTH_SESSION_TOKEN		(0x00) //default
	ivtp_hdr_t	hdr;
	u8		flags;
	union {
		struct _user_creds {

			char	username[MAX_USRNAME_LEN+1];
			char	password[MAX_ADV_PWD_LEN+1];
		} PACK user_creds;
		struct _token_creds {
			char	session_token[MAX_TOKEN_LEN+1];
		} PACK token_creds;
	} PACK authtype;
} PACK auth_t;

typedef struct
{
	ivtp_hdr_t	hdr;
}PACK sess_approval_t; 


/**
 * KEYBD LED SYNC PACKET
**/
typedef struct
{
	ivtp_hdr_t		hdr;
	u8				modifiers;
	u8				ledstatus;
} PACK led_sync_t;


#ifdef __GNUC__
#undef PACK
#else
#undef PACK
#pragma pack()
#endif

#endif	/* VIDEO_PKT_H */

