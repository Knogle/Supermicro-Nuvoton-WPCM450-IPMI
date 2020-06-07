#ifndef SESSION_CFG_H
#define SESSION_CFG_H

/*------------------------ Session Configuration -------------------------*/
#define ADVISER_DEFAULT_PORT			(7578)
#define ADVISER_PORT             		ADVISER_DEFAULT_PORT
//#define ADVISER_GET_DEFAULT_PORT(portnum)		( ((portnum) == (ADVISER_DEFAULT_PORT))?((ADVISER_DEFAULT_PORT)-1):(portnum) )
#define ADVISER_GET_DEFAULT_PORT(portnum)		( (portnum) + 999 )
#define CDSERVER_GET_DEFAULT_PORT(portnum)		( (portnum) + 999 )
#define FDSERVER_GET_DEFAULT_PORT(portnum)		( (portnum) + 999 )

#define HID_DEFAULT_INTERNAL_PORT		(8765)

#define		GET_CD_PORT(vmedia_portnum)					(vmedia_portnum)
#define		GET_FD_PORT(vmedia_portnum)					( (vmedia_portnum) + 3 )
#define		GET_SECURE_CD_PORT(vmedia_secure_portnum)	( vmedia_secure_portnum )
#define		GET_SECURE_FD_PORT(vmedia_secure_portnum)	( (vmedia_secure_portnum) + 3 )


#define MAX_SESSION								2
#define DEFAULT_SESSION_BANDWIDTH				(1000 * 1024 * 1024)
#define MAX_SCREEN_RESOLUTION 					((1280) * (1024))
#define MAX_BANDWIDTH							(100 * 1024 * 1024)
#define BANDWIDTH_1MBPS							(128 * 1024)

#define MAX_TOKEN_LEN					(16)
#define MAX_USRNAME_LEN					(32) /* without the terminating NULL */
#define MAX_ADV_PWD_LEN					(64)

#define TOKENCFG_MAX_USERNAME_LEN		(64)
#define TOKENCFG_MAX_CLIENTIP_LEN		(32)


#endif	/* SESSION_CFG_H */
