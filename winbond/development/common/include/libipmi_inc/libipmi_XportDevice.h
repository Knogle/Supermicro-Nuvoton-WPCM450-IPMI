/**
 * @file   libipmi_XportDevice.h
 * @author Anurag Bhatia
 * @date   21-Sep-2004
 *
 * @brief  Contains exported APIs by LIBIPMI for
 *  		communicating with the BMC for NetFn type Transport.
 *
 */

#ifndef __LIBIPMI_XPORTDEVICE_H__
#define __LIBIPMI_XPORTDEVICE_H__

/* LIIPMI core header files */
#include "libipmi_session.h"
#include "libipmi_errorcodes.h"
#include "libipmiifc.h"

/* command specific header files */
#include "IPMIDefs.h"
#include "IPMI_DeviceConfig.h"
#include "IPMI_LANConfig.h" // For LAN configuration parameters union definition


#include "IPMI_SOLConfig.h"
#include "IPMI_SerialModem.h"


/* Handling for packing structs */
#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif

#ifdef  __cplusplus
extern "C" {
#endif

/*---------- IPMI Command direct routines ----------*/
/* LAN related functions */
LIBIPMI_API uint16 IPMICMD_GetLANConfig(IPMI20_SESSION_T *pSession,
				GetLanConfigReq_T* pGetLANConfigReqData,
				GetLanConfigRes_T* pGetLANConfigResData,
				int timeout);
LIBIPMI_API uint16 IPMICMD_SetLANConfig(IPMI20_SESSION_T *pSession,
				SetLanConfigReq_T* pSetLANConfigReqData,
				unsigned int ReqDataLen,
				SetLanConfigRes_T* pSetLANConfigResData,
				int timeout);


/*---------- LIBIPMI Higher level routines -----------*/
uint16 LIBIPMI_HL_SetLANAlertEntry(IPMI20_SESSION_T *pSession,
					uint8 DestSel,
					uint8* pDestAddr,uint8 channel,
					int timeout);
					
					
LIBIPMI_API uint16 IPMICMD_SetLANAlertEntryType(IPMI20_SESSION_T *pSession,
					uint8 DestSel,
					uint8 AlertType,uint8 Channel,
					int timeout);


uint16 LIBIPMI_HL_GetSNMPCommunity(IPMI20_SESSION_T *pSession,
                    uint8* pCommunityStr, uint8 Channel,
					int timeout);

uint16 LIBIPMI_HL_SetSNMPCommunity(IPMI20_SESSION_T *pSession,
                    uint8* CommunityStr,uint8 Channel,
					int timeout);


					
/********************SERIAL PORT RELATED************************************/


#define SOL_SERIAL_PORT 0x01
#define SERIAL_MODEM_PORT 0x02
#define DEFAULT_TIMEOUT 2
#pragma pack(1)
typedef struct
{
    GetSOLConfigRes_T Res;
    INT8U   BaudRate;

}  Wrapper_GetSOLConfigRes_T;



typedef struct
{
    SetSOLConfigReq_T Req;
    INT8U   BaudRate;

}  Wrapper_SetSOLConfigReq_T;

typedef struct
{

    struct
        {
        uint8   Reserved    : 4;
        uint8	DtrHangup   : 1;
        uint8	FlowControl : 2;
        
	
    } PACKED Control;

    struct 
    {
        uint8 BitRate	    : 4;
        uint8 Reserved	    : 4;
	

    }  PACKED BaudRate;

} PACKED Serial_Port_Settings_T;




typedef enum
{
    None_Parity,
    Odd_Parity,
    Even_Parity
} PARITY_TYPE;

typedef enum
{
    None_FlowControl,
    XonXoff_FlowControl,
    Hardware_FlowControl
} FLOW_CONTROL_TYPE;


typedef struct
{
    unsigned long BaudRate;
    unsigned char  DataBits;
    PARITY_TYPE Parity;
    unsigned char StopBits;
    FLOW_CONTROL_TYPE FlowControl;
    unsigned char DtrHangup;
    

} PACKED SERIAL_STRUCT;

typedef struct
{
    GetSerialModemConfigRes_T Res;
    Serial_Port_Settings_T serial;

}  PACKED Wrapper_GetSerialModemConfigRes_T;


typedef struct
{
    SetSerialModemConfigReq_T Req;
    Serial_Port_Settings_T serial;

}  Wrapper_SetSerialModemConfigReq_T;

#pragma pack()

/*---------- LIBIPMI Higher level routines -----------*/

uint16 IPMICMD_GetSerialCfg_SOL_Advanced( IPMI20_SESSION_T *pSession, INT8U* char_acc_interval,INT8U* char_send_threshold,int timeout );
uint16 IPMICMD_SetSerialCfg_SOL_Advanced( IPMI20_SESSION_T *pSession, INT8U char_acc_interval,INT8U char_send_threshold,int timeout );

uint16 LIBIPMI_HL_GetSerialCfg_Messaging(IPMI20_SESSION_T *pSession, \
					 SERIAL_STRUCT *serial, int timeout );

uint16 LIBIPMI_HL_SetSerialCfg_Messaging(IPMI20_SESSION_T *pSession,  \
					 SERIAL_STRUCT *serial, int timeout);

uint16 LIBIPMI_HL_GetSerialCfg_SOL(IPMI20_SESSION_T *pSession, \
					 SERIAL_STRUCT *serial, INT8U* Enabled,int timeout );

uint16 LIBIPMI_HL_SetSerialCfg_SOL(IPMI20_SESSION_T *pSession, \
                                   SERIAL_STRUCT *serial, INT8U Enabled,int timeout);


/** 
 * \breif Sets the Serial Port configurations of the serial ports, SOL, Modem/Serial 
 * 
 * @param pSession 
 * @param type SOL or Modem/Serial
 * @param serial 
 * @param timeout 
 * 
 * @return -1 on error 0 on success.
 */
uint16	LIBIPMI_HL_Generic_SetSerialConfig( IPMI20_SESSION_T *pSession, int type, \
						    SERIAL_STRUCT *serial, int timeout );

/** 
 * \brief Gets the Serial Port Configuration from the BMC.
 * 
 * @param pSession 
 * @param type SOL or Modem/Serial
 * @param serial 
 * @param timeout 
 * 
 * @return 
 */
uint16	LIBIPMI_HL_Generic_GetSerialConfig( IPMI20_SESSION_T *pSession, int type, \
					    SERIAL_STRUCT *serial, int timeout );

/********************SERIAL PORT RELATED************************************/

#ifdef  __cplusplus
}
#endif

#endif


