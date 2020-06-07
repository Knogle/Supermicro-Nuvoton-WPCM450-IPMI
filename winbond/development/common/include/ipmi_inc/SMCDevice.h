/****************************************************************
 *
 * SMCDevice.h
 * Supermicro BMC Command handlers
 * Date: 05/09/2008
 * Author: Farida Karjono 
 *
 *****************************************************************/
#ifndef SMC_DEVICE_H
#define SMC_DEVICE_H

#include "Types.h"
#include "adviser_cfg.h"
#include "vmedia_cfg.h"

// joe --- begin
#define	SD3_SET_BYTE	0
#define	SD3_GET_BYTE	1

typedef struct
{
	UINT8 CompletionCode;
	UINT8 data[2];
	
} PACKED SMCSD3GetWordResData_T; 

typedef struct
{
	INT8U BusId;	
	INT8U SlaveAddr;
	INT8U ReadORWrite;
	INT8U Offset;
} PACKED SMCSD3GetWordReqData_T; 

typedef struct
{
	INT8U SubCmd;	
	INT8U data;
} PACKED CommonDataReq_T;

// joe --- end
/**
 * @defgroup acf SMC Device commands
 * @ingroup acf
 * IPMI SMC-specific Command Handlers for
 * @{
 **/
 
#define SMC_SLAVE_ADDRESS  0x2f   // x7sb3: 0x2d,  h8dmt: 0x2f,  x8st3: 0x2e
#define SMC_SLAVE_ADDRESS2  SMC_SLAVE_ADDRESS     // only H8DMT-IBX is different = 0x2d
#define SMC_CLEAR_CHASSIS_OFFSET  0x4d   // x7sb3: 0x46, h8dmt: 0x49,  x8st3 & x8dt3 & x8dah: 0x4d
#define SMC_SWITCH_BANK_OFFSET 0x00  // 0x00; x7sb3(w83627): 0x4e

typedef struct
{
	UINT8 CompletionCode;
	UINT16 data;
	
} PACKED SMCSetPSAddRes_T; 


typedef struct
{
	UINT8 CompletionCode;
	UINT8 data[2];
	
} PACKED SMCGetPSWattageRes_T; 

typedef struct
{
	UINT8 CompletionCode;
	UINT8 data[10];
	
} PACKED SMCGetHwInfo_T; 

typedef struct
{
	UINT8 CompletionCode;
	UINT8 data;
	
} PACKED SMCResData_T; 

typedef struct
{
	INT8U SubCmd;	
	INT8U Username[MAX_USERNAME_LEN];
	INT8U ClientIP[MAX_USERNAME_LEN];
	
} PACKED SMCReqData_T; 

typedef struct 
{
    UINT8 Param;

} PACKED SMCGPIOA4Data_T;

typedef struct 
{
    UINT16 Param;

} PACKED SMCStoreData_T;


typedef struct 
{
	UINT8 SubCmd;
	UINT8 BankIdx;
	UINT8 OffsetVal;
	UINT8 data;

} PACKED SMCBankReqData_T;


typedef struct
{
	unsigned char CompletionCode;
	AdviserCfg_T AdviserData;
	VMediaCfg_T VMediaData; 
	UINT32 privileges;
	char	stoken[17];
	
} PACKED JavaParam_T;


// [Farida] added
typedef struct 
{
	UINT8 SubCmd;
	UINT8 PS1;
	UINT8 PS2;
	UINT8 PS3;
	UINT8 PS4;

} PACKED PowerSupplyReq_T;

typedef struct 
{
	UINT8 CompletionCode;
	UINT8 slaveAdd[4];
} PACKED PowerSupplyRes_T;


// 0x02
extern int SMCSMBRelease ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 

// 0x03
extern int SMCClearChassisIntrusion ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 

// 0x04
extern int SMCGracefulPower ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 

// 0x05
extern int SMCSMBRequest ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 

// 0x06
extern int SMCWriteFruCap ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 

// 0x07
extern int SMCGetSMBStatus ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x0d
extern int SMCGetUIDStatus ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x0d
extern int SMCEnableUID ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x0e
extern int SMCDisableUID ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x0f
extern int SMCGetChassisInt ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x13
extern int SMCLevelTrigUID ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x20
extern int SMCSetHWInfo ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x21
extern int SMCGetHWInfo ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x23
extern int SMC4SD3GetWord ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x29
extern int SMCSetSnoopPort ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x2a
extern int SMCGetSnoopByte ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x2c
extern int SMC4SD3 ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x40
extern int SMCResetToFactory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x60
extern int SMCSetGPIOA4 ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0x70
extern int SMCWinbondOEM ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 

// 0xe2
extern int SMCGetPowerConsumption ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

// 0xe3
extern int SMCMEPowerStateChange ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
	
#endif  /* SMC_DEVICE_H */

