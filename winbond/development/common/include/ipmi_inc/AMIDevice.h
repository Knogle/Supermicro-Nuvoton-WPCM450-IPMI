/****************************************************************
 ****************************************************************
 **                                                            **
 **    (C)Copyright 2005-2006, American Megatrends Inc.        **
 **                                                            **
 **            All Rights Reserved.                            **
 **                                                            **
 **        6145-F, Northbelt Parkway, Norcross,                **
 **                                                            **
 **        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 **                                                            **
 ****************************************************************
 *****************************************************************
 *
 * AMICommands.h
 * AMI specific Commands
 *
 * Author: Basavaraj Astekar <basavaraja@ami.com>
 *
 *****************************************************************/
#ifndef AMI_DEVICE_H
#define AMI_DEVICE_H

#include "Types.h"

/**
 * @defgroup acf AMI Device commands
 * @ingroup acf
 * IPMI AMI-specific Command Handlers for
 * @{
 **/

#define SSH_TEMP_FILE   "/tmp/ssh_temp_key"
#define MAX_BOOTVAR_LENGTH 400
#define MAX_BOOTVAL_LENGTH 400 
#define MAX_FMHLENGTH 1024

/*** Function Prototypes ***/
extern int AMITestCmd (_NEAR_ INT8U* pReq,   INT32U ReqLen, _NEAR_ INT8U* pRes);

extern int AMISetSSHKey( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIDelSSHKey( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

extern int AMIGetHealthStatus ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIUpgradeBlock ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIUpgradeBlock2 ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIInitFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIExitFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIStartFirmwareUpdate ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIGetFirmwareUpdateStatus ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIResetCard ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIGetFlashLayout( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

extern int AMISetFanSpeed ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIGetLEDmode ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMISetLEDmode ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );

extern int AMITransferFRUData ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern void FlashTimerTask (void);
//<<KAMAL>>Added to support SetSystem GUID,SetFPButtonEnables,SetDefaultCfg //
extern int  AMISetSystemGUID       (_NEAR_ INT8U* pReq, INT32U ReqLen, _NEAR_ INT8U* pRes);
extern int AMISetFPButtonEnables (_NEAR_ INT8U* pReq, INT32U ReqLen, _NEAR_ INT8U* pRes);
extern int AMISetDefaultCfg   (_NEAR_ INT8U* pReq, INT32U ReqLen, _NEAR_ INT8U* pRes);
/** @} */

extern int AMIYAFUGetFlashInfo ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUGetFirmwareInfo ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUGetFMHInfo ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUGetStatus ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUActivateFlashMode ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIYAFUAllocateMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUFreeMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUReadFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUWriteFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIYAFUEraseFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUProtectFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUEraseCopyFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
//extern int AMIYAFUGetECFStatus( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
//extern int AMIYAFUGetVerifyStatus  ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIYAFUVerifyFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUReadMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUWriteMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIYAFUCopyMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUCompareMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes );
extern int AMIYAFUClearMemory ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUGetBootConfig ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUSetBootConfig ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUGetBootVars ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUDeactivateFlash ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
extern int AMIYAFUResetDevice ( _NEAR_ INT8U *pReq, INT32U ReqLen, _NEAR_ INT8U *pRes ); 
#ifdef CFG_PROJ_IPMC_SUPPORT_YES
extern int AMIHandleSwitchStatus(_NEAR_ INT8U *pReq,INT32U ReqLen,_NEAR_ INT8U *pRes); 
#endif

int GetUBootParam (char*, char* );
int SetUBootParam (char*, char* );
int GetAllUBootParam();
#endif  /* AMI_CMDS_H */

