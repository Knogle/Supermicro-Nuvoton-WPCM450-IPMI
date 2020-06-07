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
 ****************************************************************/


/* @(#)migrate.h
 */

#ifndef _MIGRATE_H
#define _MIGRATE_H 1

#pragma pack (1)


/**
 * @struct PMConfig_T
 * PM Configiguration information.
**/
typedef struct
{
    INT8U               NVRAMSignature [PMCONFIG_SIGNATURE];
    INT8U		Version;
    INT32U              CheckSum;
    INT8U               FWUpgradeFlag;
    WDTConfig_T         WDTConfig;
    ChannelInfo_T       ChannelInfo [MAX_NUM_CHANNELS];
    UserInfo_T          UserInfo [MAX_NUM_USERS];
    INT8U               CurrentNoUser;
    INT32U              POHCounterReading;
    PEFConfig_T         PEFConfig;
    ChassisConfig_T     ChassisConfig;
    LANConfig_T         LANConfig[MAX_LAN_CHANNELS];
    SMConfig_T          SMConfig;
    RMCPPlus_T          RMCPPlus[MAX_LAN_CHANNELS];
 	

    /* Byte used for checking pretimeout action */
    INT8U               PreTimeoutActionTaken;

    /* Bridge Management Information */
    BridgeMgmtSHM_T     BridgeMgmt;

    /* SOL Redirection Flag  */
    INT8U               SOLRFlag;

    /* SOL Configuration  data */
    SOLConfig_T         SOLConfig[MAX_LAN_CHANNELS];

    /* Firmware firewall configurability table */
    FFCmdConfigTbl_T    FFCmdConfigTbl [MAX_FF_CMD_CFGS];
   /* SEL Time UTC Offset information */
   INT16U   SELTimeUTCOffset;
   INT32U    SDREraseTime ;

   /* Get / Set System Info Parameters information */
   SystemInfoConfig_T   SystemInfoConfig;


#if OEM_CONFIG_DATA_SUPPORTED == 1
    /* OEM configuration data area */
    INT8U               OEMConfigData [MAX_OEM_CONFIG_DATA_SIZE];
#endif

     /* AMI Specific configuration information */ 	
     AMIConfig_T   AMICfg;

     /*  OEM Configuration information */ 
     OEMConfig_T  OemConfig; 

} PACKED  OLDPMConfig_T;

#pragma pack ()

#endif /* _MIGRATE_H */

