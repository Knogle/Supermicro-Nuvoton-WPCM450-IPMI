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
 *
 * IPMI_AMI.h
 * AMI specific IPMI Commands
 *
 * Author: Basavaraj Astekar <basavaraja@ami.com>
 *
 *****************************************************************/
#ifndef IPMI_AMI_H_
#define IPMI_AMI_H_

/* AMI Net function group command numbers */

/* define your command numbers here */

// SMC command
#define CMD_SMC_SMB_RELEASE 								0x02
#define CMD_SMC_CLEAR_CHASSIS_INTRUSION 		0x03
#define CMD_SMC_GRACEFUL_POWER 						0x04
#define CMD_SMC_SMB_REQUEST									0x05
#define CMD_SMC_WRITE_FRU_CAP							0x06
#define CMD_SMC_GET_SMB_STATUS							0x07
#define CMD_SMC_GET_UID_STATUS							0x0c
#define CMD_SMC_ENABLE_UID									0x0d
#define CMD_SMC_DISABLE_UID									0x0e
#define CMD_SMC_GET_CHASSIS_INT							0x0f
#define CMD_SMC_LEVEL_TRIG_UID							0x13
#define CMD_SMC_SET_HW_INFO								0x20
#define CMD_SMC_GET_HW_INFO								0x21
#define CMD_SMC_4_SD3_GET_WORD							0x23	// joe
#define CMD_SMC_SET_SNOOP_PORT							0x29
#define CMD_SMC_GET_SNOOP_BYTE							0x2a
#define CMD_SMC_4_SD3												0x2c			// joe
#define CMD_SMC_RESET_TO_FACTORY_DEFAULT  0x40
#define CMD_SMC_SET_GPIOA4									0x60
#define CMD_SMC_WINBOND_OEM								0x70
#define CMD_SMC_POWER_SUPPLY_ME							0xe2
#define CMD_SMC_ME_POWER_STATE							0xe3

// ----------------------------------------------

#define CMD_AMI_TEST_CMD			    ( 0x00 )
#define CMD_AMI_SET_SSH_KEY			    ( 0x01 )
#define CMD_AMI_DEL_SSH_KEY			    ( 0x02 )

#define CMD_AMI_GET_HEALTH_STATUS	    ( 0x10 )
#define CMD_AMI_UPGRADE_BLOCK		    ( 0x11 )
#define CMD_AMI_INIT_FLASH			    ( 0x12 )
#define CMD_AMI_EXIT_FLASH			    ( 0x13 )

#define CMD_AMI_RESET_CARD			    ( 0x14 )
#define CMD_AMI_START_FW_UPDATE         ( 0x15 )
#define CMD_AMI_UPDATE_UBOOT            ( 0x16 )
#define CMD_AMI_GET_FW_UPDATE_STATUS    ( 0x17 )
#define CMD_AMI_SET_FW_UPDATE_MODE      ( 0x18 )



//#define CMD_AMI_TRANSFER_FRUDATA		( 0x16 )
#define CMD_AMI_GET_FLASH_LAYOUT		( 0x17 )

#define CMD_AMI_SET_FAN_SPEED			( 0x20 )
#define CMD_AMI_GET_LED_MODE			( 0x21 )
#define CMD_AMI_SET_LED_MODE			( 0x22 )
#define CMD_SET_DEFAULT_CFG         ( 0x23 )

#define CMD_IPMI_FLASHER_MODE                   ( 0x30 )
#define CMD_IPMI_FLASHER_PREPARE                ( 0x31 )
#define CMD_IPMI_FLASHER_LOAD                   ( 0x32 )
#define CMD_IPMI_FLASHER_VERIFY                 ( 0x33 )
#define CMD_IPMI_FLASHER_START                  ( 0x34 )
#define CMD_IPMI_FLASHER_PROGRESS               ( 0x35 )
#define CMD_IPMI_FLASHER_RESET                  ( 0x36 )

#define CMD_SET_SMTP_CONFIG_PARAMS              ( 0x37 )
#define CMD_GET_SMTP_CONFIG_PARAMS              ( 0x38 )
	 /* Commands *///<<KAMAL>>Added to support SetSystemGUID ../
#define CMD_SET_SYSTEM_GUID                ( 0x41 )

#define CMD_AMI_YAFU_COMMON_NAK (0X00FF)
#define CMD_AMI_YAFU_GET_FLASH_INFO  (0x0001) 
#define CMD_AMI_YAFU_GET_FIRMWARE_INFO (0x0002)
#define CMD_AMI_YAFU_GET_FMH_INFO (0x0003)
#define CMD_AMI_YAFU_GET_STATUS (0x0004)
#define CMD_AMI_YAFU_ACTIVATE_FLASH (0x0010)
#define CMD_AMI_YAFU_ALLOCATE_MEMORY (0x0020)
#define CMD_AMI_YAFU_FREE_MEMORY (0x0021)
#define CMD_AMI_YAFU_READ_FLASH (0x0022)
#define CMD_AMI_YAFU_WRITE_FLASH (0x0023)
#define CMD_AMI_YAFU_ERASE_FLASH (0x0024)
#define CMD_AMI_YAFU_PROTECT_FLASH (0x0025)
#define CMD_AMI_YAFU_ERASE_COPY_FLASH (0x0026)
#define CMD_AMI_YAFU_VERIFY_FLASH (0x0027)
#define CMD_AMI_YAFU_GET_ECF_STATUS (0x0028)
#define CMD_AMI_YAFU_GET_VERIFY_STATUS (0x0029)
#define CMD_AMI_YAFU_READ_MEMORY (0x0030)
#define CMD_AMI_YAFU_WRITE_MEMORY (0x0031)
#define CMD_AMI_YAFU_COPY_MEMORY (0x0032)
#define CMD_AMI_YAFU_COMPARE_MEMORY (0x0033)
#define CMD_AMI_YAFU_CLEAR_MEMORY (0x0034)
#define CMD_AMI_YAFU_GET_BOOT_CONFIG (0x0040)
#define CMD_AMI_YAFU_SET_BOOT_CONFIG (0x0041)
#define CMD_AMI_YAFU_GET_BOOT_VARS (0x0042)
#define CMD_AMI_YAFU_DEACTIVATE_FLASH_MODE (0x0050)
#define CMD_AMI_YAFU_RESET_DEVICE (0x0051)


#ifdef CFG_PROJ_IPMC_SUPPORT_YES
#define CMD_AMI_HANDLE_SWITCH_STATUS (0x0061)
#endif
#ifdef CFG_PROJ_SHMC_TEST_SUPPORT_YES
/* SDR Test Commands */
#define CMD_AMI_TEST_SDR            (0x01)

/* Power Test Commands */
#define CMD_AMI_GET_PWR_CONSUMPTION (0X03)
#define CMD_AMI_GET_FEED_TO_FRU_MAP (0x04)
#define CMD_AMI_GET_FEED_PROPERTIES (0x05)
#define CMD_AMI_GET_FRU_ACTV_PWR_PROPERTIES (0x06)

/* Fan Test Commands */
#define CMD_AMI_GET_FAN_LOCATION (0x07)
#define CMD_AMI_GET_FAN_STATE (0x08)

/* FRU State Maintenance Test Commands */
#define CMD_AMI_GET_FRU_STATE (0x09)
#endif
#endif /* IPMI_AMI_H */

