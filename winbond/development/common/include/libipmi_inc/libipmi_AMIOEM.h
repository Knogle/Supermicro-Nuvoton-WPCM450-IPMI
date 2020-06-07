#ifndef LIBIPMI_AMIOEM_H_
#define LIBIPMI_AMIOEM_H_

/* LIBIPMI core header files */
#include "libipmi_session.h"
#include "libipmi_errorcodes.h"
#include "libipmiifc.h"

/* command specific header files */
#include "IPMI_AMIDevice.h"

#ifdef __cplusplus
extern "C" {
#endif

#if 0
/*---------- IPMI Command direct routines ----------*/
LIBIPMI_API uint16 IPMICMD_AMISetSSHKey( IPMI20_SESSION_T *pSession, AMISetSSHKeyReq_T *pSetSSHKeyReq,
                             AMISetSSHKeyRes_T *pSetSSHKeyRes, int timeout );
LIBIPMI_API uint16 IPMICMD_AMIDelSSHKey( IPMI20_SESSION_T *pSession, AMIDelSSHKeyReq_T *pDelSSHKeyReq,
                             AMIDelSSHKeyRes_T *pDelSSHKeyRes, int timeout );
#endif

LIBIPMI_API uint16 IPMICMD_AMIUpgradeBlock( IPMI20_SESSION_T *pSession,AMIUpgradeBlockReq_T *pUpgradeBlockReq,
                             AMIUpgradeBlockRes_T *pUpgradeBlockRes, int timeout );

LIBIPMI_API uint16 IPMICMD_AMIInitFlash( IPMI20_SESSION_T *pSession,
                             AMIInitFlashReq_T *pInitFlashReq,
                             AMIInitFlashRes_T *pInitFlashRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMIExitFlash( IPMI20_SESSION_T *pSession,
                             AMIExitFlashReq_T *pExitFlashReq,
                             AMIExitFlashRes_T *pExitFlashRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMIResetCard( IPMI20_SESSION_T *pSession,
                             uint8 *pResetCardReq,
                             AMIResetCardRes_T *pResetCardRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMIUpdateUboot( IPMI20_SESSION_T *pSession,
                             uint8 *pUpdateUbootReq,
                             AMIUpdateUbootRes_T *pUpdateUbootRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMISetFirmwareUpdateMode( IPMI20_SESSION_T *pSession,
                             uint8 *pSetFirmwareUpdateModeReq,
                             AMISetFirmwareUpdateModeRes_T *pSetFirmwareUpdateModeRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMIGetFirmwareUpdateStatus( IPMI20_SESSION_T *pSession,
                             AMIGetFirmwareUpdateStatusReq_T *pGetFirmwareUpdateStatusReq,
                             AMIGetFirmwareUpdateStatusRes_T *pGetFirmwareUpdateStatusRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMIStartFirmwareUpdate( IPMI20_SESSION_T *pSession,
                             AMIStartFirmwareUpdateReq_T *pStartFirmwareUpdateReq,
                             AMIStartFirmwareUpdateRes_T *pStartFirmwareUpdateRes,
                             int timeout );

LIBIPMI_API uint16 IPMICMD_AMIYAFUGetFlashInfo(IPMI20_SESSION_T *pSession,
	                    AMIYAFUGetFlashInfoReq_T* pAMIYAFUGetFlashInfoReq,
	                    AMIYAFUGetFlashInfoRes_T* pAMIYAFUGetFlashInfoRes,
	                    int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUGetFirmwareInfo(IPMI20_SESSION_T *pSession,
			   AMIYAFUGetFirmwareInfoReq_T* pAMIYAFUGetFirmwareInfoReq, 
			   AMIYAFUGetFirmwareInfoRes_T* pAMIYAFUGetFirmwareInfoRes,
			   int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUGetFMHInfo(IPMI20_SESSION_T *pSession,
                             AMIYAFUGetFMHInfoReq_T* pAMIYAFUGetFMHInfoReq,               
                             AMIYAFUGetFMHInfoRes_T* pAMIYAFUGetFMHInfoRes,
                             int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUGetStatus(IPMI20_SESSION_T *pSession,
	                      AMIYAFUGetStatusReq_T* pAMIYAFUGetStatusReq,
	                      AMIYAFUGetStatusRes_T* pAMIYAFUGetStatusRes,
	                      int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUActivateFlashMode(IPMI20_SESSION_T *pSession,
	                      AMIYAFUActivateFlashModeReq_T* pAMIYAFUActivateFlashReq,
	                      AMIYAFUActivateFlashModeRes_T* pAMIYAFUActivateFlashRes,
	                      int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUAllocateMemory(IPMI20_SESSION_T *pSession,
	                      AMIYAFUAllocateMemoryReq_T* pAMIYAFUAllocateMemoryReq,
	                      AMIYAFUAllocateMemoryRes_T* pAMIYAFUAllocateMemoryRes,
	                      int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUFreeMemory(IPMI20_SESSION_T *pSession,
	                      AMIYAFUFreeMemoryReq_T* pAMIYAFUFreeMemoryReq,
	                      AMIYAFUFreeMemoryRes_T* pAMIYAFUFreeMemoryRes,
	                      int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUReadFlash(IPMI20_SESSION_T *pSession,
	                      AMIYAFUReadFlashReq_T* pAMIYAFUReadFlashReq,
	                      AMIYAFUReadFlashRes_T* pAMIYAFUReadFlashRes,
	                      int timeout);
LIBIPMI_API uint16 IPMICMD_AMIYAFUWriteFlash(IPMI20_SESSION_T *pSession,
	                	 AMIYAFUWriteFlashReq_T* pAMIYAFUWriteFlashReq,
	                	 AMIYAFUWriteFlashRes_T* pAMIYAFUWriteFlashRes,
	                	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUEraseFlash(IPMI20_SESSION_T *pSession,
	                	 AMIYAFUErashFlashReq_T* pAMIYAFUEraseFlashReq,
	                	 AMIYAFUErashFlashRes_T* pAMIYAFUEraseFlashRes,
	                	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUProtectFlash(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUProtectFlashReq_T* pAMIYAFUProtectFlashReq,
	               	 AMIYAFUProtectFlashRes_T* pAMIYAFUProtectFlashRes,
	               	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUEraseCopyFlash(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUEraseCopyFlashReq_T* pAMIYAFUEraseCopyFlashReq,
	               	 AMIYAFUEraseCopyFlashRes_T* pAMIYAFUEraseCopyFlashRes,
	               	 int timeout);
LIBIPMI_API uint16 IPMICMD_AMIYAFUGetECFStatus(IPMI20_SESSION_T *pSession,
	               AMIYAFUGetECFStatusReq_T* pAMIYAFUGetECFStatusReq,
	               AMIYAFUGetECFStatusRes_T* pAMIYAFUGetECFStatusRes,
	               int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUVerifyFlash(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUVerifyFlashReq_T* pAMIYAFUVerifyFlashReq,
	               	 AMIYAFUVerifyFlashRes_T* pAMIYAFUVerfyFlashRes,
	               	 int timeout);
LIBIPMI_API uint16 IPMICMD_AMIYAFUGetVerifyStatus(IPMI20_SESSION_T *pSession,
	               AMIYAFUGetVerifyStatusReq_T* pAMIYAFUGetVerifyStatusReq,
	               AMIYAFUGetVerifyStatusRes_T* pAMIYAFUGetVerifyStatusRes,
	               int timeout);
LIBIPMI_API uint16 IPMICMD_AMIYAFUReadMemory(IPMI20_SESSION_T *pSession,
	                	 AMIYAFUReadMemoryReq_T* pAMIYAFUReadMemoryReq,
	                	 AMIYAFUReadMemoryRes_T* pAMIYAFUReadMemoryRes,
	                	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUWriteMemory(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUWriteMemoryReq_T* pAMIYAFUWriteMemoryReq,
	               	 AMIYAFUWriteMemoryRes_T* pAMIYAFUWriteMemoryRes,
	               	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUCopyMemory(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUCopyMemoryReq_T* pAMIYAFUCopyMemoryReq,
		               AMIYAFUCopyMemoryRes_T* pAMIYAFUCopyMemoryRes,
		               int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUCompareMemory(IPMI20_SESSION_T *pSession,
		               AMIYAFUCompareMemoryReq_T* pAMIYAFUCompareMemoryReq,
	                	 AMIYAFUCompareMemoryRes_T* pAMIYAFUCompareMemoryRes,
	                	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUClearMemory(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUClearMemoryReq_T* pAMIYAFUClearMemoryReq,
	               	 AMIYAFUClearMemoryRes_T* pAMIYAFUClearMemoryRes,
	               	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUGetBootConfig(IPMI20_SESSION_T *pSession,
	               AMIYAFUGetBootConfigReq_T* pAMIYAFUGetBootConfigReq,
	               AMIYAFUGetBootConfigRes_T* pAMIYAFUGetBootConfigRes,
	               int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUSetBootConfig(IPMI20_SESSION_T *pSession,
	               AMIYAFUSetBootConfigReq_T* pAMIYAFUSetBootConfigReq,
	               AMIYAFUSetBootConfigRes_T* pAMIYAFUSetBootConfigRes,
	               int timeout,uint32 ReqLen);

LIBIPMI_API uint16 IPMICMD_AMIYAFUGetAllBootVars(IPMI20_SESSION_T *pSession,
	               AMIYAFUGetBootVarsReq_T* pAMIYAFUGetBootVarsReq,
	               AMIYAFUGetBootVarsRes_T* pAMIYAFUGetBootVarsRes,
	               int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUDeactivateFlash(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUDeactivateFlashReq_T* pAMIYAFUDeactivateFlashReq,
	               	 AMIYAFUDeactivateFlashRes_T* pAMIYAFUDeactivateFlashRes,
	               	 int timeout);

LIBIPMI_API uint16 IPMICMD_AMIYAFUResetDevice(IPMI20_SESSION_T *pSession,
	               	 AMIYAFUResetDeviceReq_T* pAMIYAFUResetDeviceReq,
	               	 AMIYAFUResetDeviceRes_T* pAMIYAFUResetDeviceRes,
	               	 int timeout);

#ifdef CFG_PROJ_IPMC_SUPPORT_YES
LIBIPMI_API uint16	IPMCCMD_AMIHandleSwitchStatus( IPMI20_SESSION_T *pSession,
							AMIHandleSwitchStatusReq_T	*pHandleSwitchStatusReq,
							AMIHandleSwitchStatusRes_T *pHandleSwitchStatusRes,
							int timeout,uint32 ReqLen);
#endif

/*---------- LIBIPMI Higher level routines -----------*/
#if 0
LIBIPMI_API uint16 LIBIPMI_HL_SetSSHKey( IPMI20_SESSION_T *pSession, INT8U UID,
                             char *file_path, int timeout );
LIBIPMI_API uint16 LIBIPMI_HL_DelSSHKey( IPMI20_SESSION_T *pSession, INT8U UID, int timeout );
#endif

LIBIPMI_API uint16 LIBIPMI_HL_AMIUpgradeBlock( IPMI20_SESSION_T *pSession, BI_t *blk, int timeout );




#ifdef __cplusplus
}
#endif

#endif
