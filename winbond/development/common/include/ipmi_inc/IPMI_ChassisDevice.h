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
 ****************************************************************
 ****************************************************************
 * ipmi_chassis.h
 * IPMI chassis Request and Response structures
 *
 *  Author: Rama Bisa <ramab@ami.com>
 *
 ******************************************************************/
#ifndef IPMI_CHASSIS_DEVICE_H
#define IPMI_CHASSIS_DEVICE_H

#include "Types.h"

#pragma pack( 1 )

/*** Definitions and Macros ***/
#define MAX_BOOT_INIT_MAILBOX_BLOCKS      5
#define MAX_BOOT_INIT_MAILBOX_BLOCK_SIZE  16

#define CHASSIS_IDENTITY_STATE_INFO_SUPPORTED	0x40
#define CHASSIS_IDENTITY_INDEFINITE_ON 		0x20
#define CHASSIS_IDENTITY_TIMED_ON  		0x10
#define CHASSIS_IDENTITY_OFF 			0x00


/**
 * @struct ChassisCapabilities_T
 * @brief Chassis capabilities
 **/
typedef struct
{
    INT8U    CapabilitiesFlags;
    INT8U    FRUInfoAddr;
    INT8U    SDRDeviceAddr;
    INT8U    SELDeviceAddr;
    INT8U    SMDeviceAddr;
    INT8U    ChassBridgeFn;

} PACKED  ChassisCapabilities_T;

/**
 * @struct ChassisPowerState_T
 * @brief Chassis Power state
 **/
typedef struct
{
    INT8U                   PowerState;
    INT8U                   LastPowerEvent;
    INT8U                   MiscChassisState;
    INT8U                   FPBtnEnables;
} PACKED  ChassisPowerState_T;

/**
 * @struct AMI_BootOpt_T
 * @brief AMI specific Boot options
 **/
typedef struct
{
    INT8U       Data1;
    INT8U       Data2;
    
} PACKED  AMI_BootOpt_T;

/* GetChassisCapabilitiesRes_T */
typedef struct
{
    INT8U                   CompletionCode;
    ChassisCapabilities_T   ChassisCapabilities;
    
} PACKED  GetChassisCapabilitiesRes_T;

/* GetChassisStatusRes_T */
typedef struct
{
    INT8U                   CompletionCode;
    ChassisPowerState_T     ChassisPowerState;
    
} PACKED  GetChassisStatusRes_T;

/* ChassisControlReq_T */
typedef struct
{
    INT8U  ChassisControl;
    
} PACKED  ChassisControlReq_T;

/* ChassisControlRes_T */
typedef struct
{
    INT8U   CompletionCode;
    
} PACKED  ChassisControlRes_T;

/* ChassisIdentifyReq_T */
typedef struct
{
    INT8U IdentifyInterval;
    INT8U ForceIdentify;

} PACKED  ChassisIdentifyReq_T;

/* ChassisIdentifyRes_T */
typedef struct
{
    INT8U   CompletionCode;
    
} PACKED  ChassisIdentifyRes_T;

/* SetChassisCapabilitiesReq_T */
typedef struct
{
    ChassisCapabilities_T   ChassisCaps;
    
} PACKED  SetChassisCapabilitiesReq_T;

/* SetChassisCapabilitiesRes_T */
typedef struct
{
    INT8U   CompletionCode;
    
} PACKED  SetChassisCapabilitiesRes_T;

/* SetPowerRestorePolicyReq_T */
typedef struct
{
    INT8U   PowerRestorePolicy;
    
} PACKED  SetPowerRestorePolicyReq_T;

/* SetPowerRestorePolicyRes_T */
typedef struct
{
    INT8U  CompletionCode;
    INT8U  PowerRestorePolicy;
    
} PACKED  SetPowerRestorePolicyRes_T;

/* GetSystemRestartCauseRes_T */
typedef struct
{
    INT8U   CompletionCode;
    INT8U   SysRestartCause;
    INT8U   ChannelID;
    
} PACKED  GetSystemRestartCauseRes_T;

/* GetPOHCounterRes_T */
typedef struct
{   
    INT8U           CompletionCode;
    INT8U           MinutesPerCount;
    INT32U          POHCounterReading;
    
} PACKED  GetPOHCounterRes_T;

/* BootInfoAck_T */
typedef struct
{
    INT8U WriteMask;
    INT8U BootInitiatorAckData;
    
} PACKED  BootInfoAck_T;

/* BootFlags_T */
typedef struct
{
    INT8U    BootFlagsValid;
    INT8U    Data2;
    INT8U    Data3;
    INT8U    Data4;
    INT8U    Data5;
    
} PACKED  BootFlags_T;

/* BootInitiatorInfo_T */
typedef struct
{
    INT8U   BootSource;
    INT8U   SessionID [4];
    INT8U   BootInfoTimestamp [4];
    
} PACKED  BootInitiatorInfo_T;

/* BootInitiatorMailbox_T */
typedef struct 
{
    INT8U BlockData [MAX_BOOT_INIT_MAILBOX_BLOCK_SIZE];
    
} PACKED  BootInitiatorMailbox_T;

/* BootInitiatorMboxReq_T */
typedef struct
{
    INT8U   BlockSel;
    BootInitiatorMailbox_T  BootMBox;
    
} PACKED  BootInitiatorMboxReq_T;

/* BootOptParams_T */
typedef union 
{
    INT8U                   SetInProgress;
    INT8U                   ServicePartitionSelector; 
    INT8U                   ServicePartitionScan;
    INT8U                   BootFlagValidBitClearing;
    BootInfoAck_T           BootInfoAck;
    BootFlags_T             BootFlags;
    BootInitiatorInfo_T     BootInitiatorInfo;
    BootInitiatorMboxReq_T  BootMailBox;
    AMI_BootOpt_T           Oem;
    
} BootOptParams_T;

/* SetBootOptionsReq_T */
typedef struct
{
    INT8U               ParamValidCumParam;
    BootOptParams_T     BootParam;
    
} PACKED  SetBootOptionsReq_T;

/* SetBootOptionsRes_T */
typedef struct
{
    INT8U               CompletionCode;
    
} PACKED  SetBootOptionsRes_T;

/* BootOptions_T */
typedef struct
{
    INT8U                   ParameterValid;
	INT8U          			u8SetInProgress;    			/**< Set in progess variable */
    INT8U                   ServicePartitionSelector; 
    INT8U                   ServicePartitionScan;
    INT8U                   BootFlagValidBitClearing;
    BootInfoAck_T           BootInfoAck;
    BootFlags_T             BootFlags;
    BootInitiatorInfo_T     BootInitiatorInfo;
    BootInitiatorMailbox_T  BootMailBox[MAX_BOOT_INIT_MAILBOX_BLOCKS];
    AMI_BootOpt_T           Oem;
    
} PACKED  BootOptions_T;

/* GetBootOptionsReq_T */
typedef struct
{
    INT8U       ParamSel;
    INT8U       SetSel;
    INT8U       BlockSel;
    
} PACKED  GetBootOptionsReq_T;

/* GetBootOptParams_T */
typedef union
{
    INT8U                   SetInProgress;  
    INT8U                   ServicePartitionSelector; 
    INT8U                   ServicePartitionScan;
    INT8U                   BootFlagValidBitClearing;
    BootInfoAck_T           BootInfoAck;
    BootFlags_T             BootFlags;
    BootInitiatorInfo_T     BootInitiatorInfo;
    BootInitiatorMboxReq_T  BootMailBox;
    AMI_BootOpt_T           Oem;
    
} GetBootOptParams_T;

/* GetBootOptionsRes_T */
typedef struct 
{
    INT8U               CompletionCode;
    INT8U               ParamVersion;
    INT8U               ParameterValid;
    GetBootOptParams_T  BootParams;
    
} PACKED  GetBootOptionsRes_T;

/* SetFPBtnEnablesReq_T */
typedef struct
{
    INT8U   ButtonEnables;

} PACKED SetFPBtnEnablesReq_T;

/* SetFPBtnEnablesRes_T */
typedef struct
{
    INT8U   CompletionCode;

} PACKED SetFPBtnEnablesRes_T;

/* SetPowerCycleInteval Req */
typedef struct
{
    INT8U   PowerCycleInterval;
    
} PACKED  SetPowerCycleIntervalReq_T;

/* SetPowerRestorePolicyRes_T */
typedef struct
{
    INT8U  CompletionCode;
    
} PACKED  SetPowerCycleIntervalRes_T;

#pragma pack( )

#endif /* IPMI_CHASSIS_DEVICE*/
