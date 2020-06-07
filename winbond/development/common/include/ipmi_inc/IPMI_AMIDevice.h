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
#ifndef IPMI_AMI_DEVICE_H_
#define IPMI_AMI_DEVICE_H_

#include "Types.h"

#include "fmhinfo.h"
#include "flashlib.h"

/*
 * User roles( for command auth. purposes). Currently used by AMISetLEDmode.
 */
typedef enum {
	REGULAR,
	ADMIN,
	POLICY
} user_role_t;

/*
 * LEDs
 */
typedef enum {
	OK2RM  = 0,
	SERVICE  = 1,
	ACT  = 2,
	LOCATE = 3
} LEDtype_t;

/*
 * LED modes
 */
typedef enum {
	LED_OFF  = 0,
	LED_ON = 1,
	LED_STANDBY_BLINK  = 2,
	LED_SLOW_BLINK  = 3,
	LED_FAST_BLINK  = 4
} LEDmode_t;

/* Define your IPMI request and response structures here */

#pragma pack(1)
/**
 * @struct AMICommandReq_T
 * @brief AMI command request structure
 **/
typedef struct
{
    /* define your structures here */
	INT8U	dummy;

} PACKED  AMITestCmdReq_T;

/**
 * @struct AMICommandRes_T
 * @brief AMI command response structure
 **/
typedef struct
{
    /* define your structures here */
	INT8U	dummy;

} PACKED  AMITestCmdRes_T;


//#define MAX_IPMI_UPLOAD_BLOCK   ( 64 * 1024 )
#define MAX_IPMI_UPLOAD_BLOCK   ( 100 )

/**
 * @struct AMISetSSHKeyReq_T
 * @brief AMI Set SSH Key command request structure
 **/
typedef struct
{
    /* UserID of the user whose ssh key we're uploading */
    INT8U   UserID;

    /* Zero-indexed block number for upload.  Set to 0xff for the last */
    /* block.                                                          */
    INT8U   KeyDataBlockNumber;

    /* Amount of data in this block.  Should be max block size for all */
    /* but the last block when the total key size is not a multiple of */
    /* the maximum block size.                                         */
    INT8U   DataLen;

    INT8U   Data[ MAX_IPMI_UPLOAD_BLOCK ];
} PACKED AMISetSSHKeyReq_T;


/**
 * @struct AMISetSSHKeyRes_T
 * @brief AMI Set SSH Key command response structure
 **/
typedef struct
{
    INT8U CompletionCode;
} PACKED AMISetSSHKeyRes_T;


/**
 * @struct AMIDelSSHKeyReq_T
 * @brief AMI Delete SSH Key command request structure
 **/
typedef struct
{
    /* UserID of the user whose ssh key we're deleting */
    INT8U   UserID;
} PACKED AMIDelSSHKeyReq_T;

/**
 * @struct AMIDelSSHKeyRes_T
 * @brief AMI Delete SSH Key command response structure
 **/
typedef struct
{
    INT8U CompletionCode;
} PACKED AMIDelSSHKeyRes_T;


/**
 * @struct AMIUpgradeBlockReq_T
 * @brief AMI Upgrade Block command request structure
 **/
typedef struct
{
    /* Block information */
    BI_t   blkInfo;
} PACKED AMIUpgradeBlockReq_T;

/**
 * @struct AMIUpgradeBlockRes_T
 * @brief AMI Upgrade Block command response structure
 **/
typedef struct
{
    INT8U CompletionCode;
} PACKED AMIUpgradeBlockRes_T;


/* Init Flash */
typedef struct
{
    FLASH_PARAMS params;
} PACKED AMIInitFlashReq_T;

typedef struct
{
    INT8U CompletionCode;
    FLASH_PARAMS params;
} PACKED AMIInitFlashRes_T;

/* Exit Flash */
typedef struct
{
    FLASH_PARAMS params;
} PACKED AMIExitFlashReq_T;

/* Exit Flash */
typedef struct
{
    FLASH_PARAMS params;
} PACKED AMIStartFirmwareUpdateReq_T;


typedef struct
{
    INT8U CompletionCode;
} PACKED AMIExitFlashRes_T;
/* Get Flash Layout */
typedef struct
{
    FLASH_LAYOUT FlashLayout;
} PACKED AMIGetFlashLayoutReq_T;

typedef struct
{
    INT8U CompletionCode;
    FLASH_LAYOUT FlashLayout;
} PACKED AMIGetFlashLayoutRes_T;

typedef struct
{
    INT8U CompletionCode;
} PACKED  AMIResetCardRes_T;

typedef struct
{
    INT8U CompletionCode;
} PACKED  AMIUpdateUbootRes_T;

typedef struct
{
    INT8U CompletionCode;
} PACKED  AMISetFirmwareUpdateModeRes_T;

typedef struct
{
    INT8U CompletionCode;
} PACKED  AMIStartFirmwareUpdateRes_T;

typedef struct
{
    FLASH_PARAMS params;
} PACKED AMIGetFirmwareUpdateStatusReq_T;


typedef struct
{
    INT8U EraseInProgress;
    INT8U CurrentSectorErased;
    INT8U TotalSectorstobeErased;
    INT8U WriteInProgress;
    INT8U CurrentSectorWritten;
    INT8U TotalSectorstobeWritten;
    INT8U EraseWriteCompleted;
    
} PACKED AMIFlashStatus_T;

typedef struct
{
    INT8U CompletionCode;
    STRUCTURED_FLASH_PROGRESS flprog;

} PACKED AMIGetFirmwareUpdateStatusRes_T;

typedef struct
{
	int TimeOut;
	int FlashProcessStarted;

} PACKED FlashTimerInfo_T;

typedef struct
{
    INT8U FanSpeed;      /* Fan speed in percentage */
} PACKED  AMISetFanSpeedReq_T;

typedef struct
{
    INT8U CompletionCode;
} PACKED  AMISetFanSpeedRes_T;

/**
 * @struct AMIGetLEDmodeReq_T
 * @brief AMI Get LED Mode command request structure
 **/
typedef struct
{
    INT8U   devAddr; /* value from the "Device Slave Address" field in, */
                     /* LED's Generic Device Locator record, in the SDR     */
    INT8U   led;
    INT8U   ctrlrAddr; /* Its controller's address; value from the          */
                       /* "Device Access Address" field. Zero if the LED is */
                       /* local.                               */
    INT8U   hwInfo;  /* the OEMField from the SDR record */
    INT8U   force;     /* TRUE - directly access the device, FALSE - go     */
                       /* thru its controller. Ignored if LED is local.     */
} PACKED  AMIGetLEDmodeReq_T;

/**
 * @struct AMIGetLEDmodeRes_T
 * @brief AMI Get LED Mode command response structure
 **/
typedef struct
{
    INT8U CompletionCode;
    INT8U mode;
} PACKED  AMIGetLEDmodeRes_T;

/**
 * @struct AMISetLEDmodeReq_T
 * @brief AMI Set LED Mode command request structure
 **/
typedef struct
{
    INT8U   devAddr; /* value from the "Device Slave Address" field in, */
                     /* LED's Generic Device Locator record, in the SDR     */
    INT8U   led;
    INT8U   ctrlrAddr; /* Its controller's address; value from the          */
                       /* "Device Access Address" field. Zero if the LED is */
                       /* local.                               */
    INT8U   hwInfo;  /* the OEMField from the SDR record */
    INT8U   mode;
    INT8U   force;     /* TRUE: directly access the device. FALSE: go thru  */
                       /* its controller. Ignored if LED is local.          */
    INT8U   role; /* This is used by BMC, for authorization purposes   */
} PACKED  AMISetLEDmodeReq_T;

/**
 * @struct AMISetLEDmodeRes_T
 * @brief AMI Set LED Mode command response structure
 **/
typedef struct
{
    INT8U CompletionCode;
} PACKED  AMISetLEDmodeRes_T;

#define FRUDATA_MAX_SIZE	0x80 /* 128 bytes */
#define FRUDATA_TYPE_DIMM	0x00
#define FRUDATA_TYPE_CPU	0x01
#define FRUDATA_TYPE_BIOS	0x02

/**
 * @struct FRUData_DIMM_T
 * @brief FRU Data for DIMM SPD information sent from BIOS in two blocks
 **/
typedef struct
{
    INT8U SPDData[128];		/* 128 bytes */
} PACKED  FRUData_DIMM_T;		/* 128 bytes total */

/**
 * @struct FRUData_CPU_T
 * @brief FRU Data for Processor information sent from BIOS
 **/
typedef struct
{
    INT32U ThermTrip;
    INT32U cpuid1_eax;
    INT32U cpuid_product_name[12];
} PACKED  FRUData_CPU_T;		/* 56 bytes total */

/**
 * @struct FRUData_BIOS_T
 * @brief FRU Data for BIOS information sent from BIOS
 **/
typedef struct
{
    INT8U PartNumber[16];	/* 16 bytes */
    INT8U PartVersion[16];	/* 16 bytes */
} PACKED  FRUData_BIOS_T;		/* 32 bytes total */

/**
 * @struct AMITransferFRUDataReq_T
 * @brief OEM request for transferring FRU data from BIOS
 */
typedef struct
{
    INT8U Type;                    /* identifier for this FRU data */
    INT8U Number;                  /* identifier for different datas of same type */
    INT8U DataLen;                 /* length of data block */
    INT8U Data[FRUDATA_MAX_SIZE];  /* data of data */
} PACKED  AMITransferFRUDataReq_T;

/**
 * @struct AMITransferFRUDataRes_T
 * @brief OEM response for transferring FRU data from BIOS
 */
typedef struct
{
    INT8U CompletionCode;
} PACKED  AMITransferFRUDataRes_T;


//<<KAMAL>> Added to Support SetSystemGUIDCmd ..//
/* SetSysGUIDReq_T */
typedef struct
{
    INT8U   Node[6];
    INT16U  ClockSeq;
    INT16U  TimeHigh;
    INT16U  TimeMid;
    INT32U  TimeLow;

} PACKED SetSysGUIDReq_T;

/**
 * @struct YafuHeader
 * @brief Flash info structure
 */
 typedef struct
{
    INT32U  Seqnum;
    INT16U  YafuCmd;
    INT16U  Datalen;
    INT32U  CRC32chksum;
} PACKED YafuHeader;
	
/**
 * @struct AMIYAFUNotAck
 * @brief Flash info structure
 */
typedef struct
{
   INT8U CompletionCode;
   YafuHeader NotAck;
   INT16U       ErrorCode;
}PACKED AMIYAFUNotAck;

/**
 * @struct ALT_FMH
 * @brief Flash info structure
 */

typedef struct
{
    INT16U EndSignature;
    INT8U   HeaderChkSum;
    INT8U   Reserved;
    INT32U LinkAddress;
    INT8U   Signature[8]; 	
} PACKED ALT_FMHead;



/**
 * @struct FMH
 * @brief Flash info structure
 */

	typedef struct
	{
		INT8U		FmhSignature[8];
		union
		{
			INT16U	FwVersion;
			INT8U	FwMinorVer;
			INT8U	FwMajorVer;
		} PACKED Fmh_Version;
		INT16U		FmhSize;
		INT32U		AllocatedSize;
		INT32U		FmhLocation;
		INT8U		FmhReserved[3];
		INT8U		HeaderChecksum;
		INT8U		ModuleName[8];
		union
		{
			INT16U	ModVersion;
			INT8U	ModMinorVer;
			INT8U	ModMajorVer;
		}PACKED Module_Version;
		INT16U		ModuleType;
		INT32U		ModuleLocation;
		INT32U		ModuleSize;
		INT16U		ModuleFlags;
		INT32U		ModuleLoadAddress;
		INT32U		ModuleChecksum;
		INT8U		ModuleReserved[8];
		INT16U		EndSignature;
	}PACKED  FlashMH;

/**
 * @struct AMIYAFUGetFlashInfoReq_T
 * @brief Flash info structure
 */
 
typedef struct
{
    YafuHeader FlashInfoReq;

} PACKED AMIYAFUGetFlashInfoReq_T;


typedef struct
{

   INT32U   FlashSize;
    INT32U  FlashAddress;
    INT32U  FlashEraseBlkSize;
    INT16U  FlashProductID;
    INT8U    FlashWidth;	
    INT8U    FMHCompliance;
    INT16U  Reserved;
    INT16U  NoEraseBlks;	 
	
}PACKED FlashDetails;


/**
 * @struct AMIYAFUGetFlashInfoRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U           CompletionCode;
    YafuHeader   FlashInfoRes;
    FlashDetails  FlashInfo;

} PACKED AMIYAFUGetFlashInfoRes_T;	

/**
 * @struct AMIYAFUGetFirmwareInfoReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader FirmwareinfoReq;

} PACKED AMIYAFUGetFirmwareInfoReq_T;	

/**
 * @struct FirmInfo
 * @brief Flash info structure
 */
typedef struct
{
    INT8U     FirmMajVersion;
    INT8U     FirmMinVersion;
    INT16U   FirmAuxVersion;	
    INT32U   FirmBuildNum;	
    INT32U   Reserved;
    INT8U     FirmwareName[8];	
    INT32U   FirmwareSize;
    INT32U   ProductID;
	
} PACKED FirmInfo;

/**
 * @struct AMIYAFUGetFirmwareInfoRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode;
    YafuHeader FirmwareinfoRes;	
    FirmInfo      FirmwareInfo;

} PACKED AMIYAFUGetFirmwareInfoRes_T;	


/**
 * @struct AMIYAFUGetFMHInfoRes_T
 * @brief Flash info structure
 */
typedef struct
{
     YafuHeader FMHReq;

} PACKED AMIYAFUGetFMHInfoReq_T;	

/**
 * @struct AMIYAFUGetFMHInfoRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader FMHRes;
    INT16U       Reserved;	
    INT16U       NumFMH; 	
              

} PACKED AMIYAFUGetFMHInfoRes_T;		

/**
 * @struct AMIYAFUGetStatusReq_T
 * @brief Flash info structure
 */
typedef struct
{
     YafuHeader GetStatusReq;

} PACKED AMIYAFUGetStatusReq_T;	


/**
 * @struct AMIYAFUGetStatusRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader GetStatusRes;
    INT16U       LastStatusCode;
    INT16U       YAFUState;
    INT16U         Mode;
    INT16U       Reserved;
    INT8U         Message[65];	   
	    
} PACKED AMIYAFUGetStatusRes_T;	

/**
 * @struct AMIYAFUActivateFlashModeReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader ActivateflashReq;
    INT16U       Mode;	

} PACKED AMIYAFUActivateFlashModeReq_T;	

/**
 * @struct AMIYAFUGetStatusRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader ActivateflashRes;
    INT8U         Delay;	
    	
}PACKED AMIYAFUActivateFlashModeRes_T;		

/**
 * @struct AMIYAFUAllocateMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader AllocmemReq;
    INT32U       Sizeofmemtoalloc;	

} PACKED AMIYAFUAllocateMemoryReq_T;	


/**
 * @struct AMIYAFUAllocateMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader AllocmemRes;
    INT32U       Addofallocmem; 	

}PACKED AMIYAFUAllocateMemoryRes_T;		


/**
 * @struct AMIYAFUFreeMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader FreememReq;
    INT32U       AddrtobeFreed;	

} PACKED AMIYAFUFreeMemoryReq_T;	

/**
 * @struct AMIYAFUFreeMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader FreememRes;
    INT8U         Status; 	

}PACKED AMIYAFUFreeMemoryRes_T;		

/**
 * @struct AMIYAFUReadFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader ReadFlashReq;
    INT32U       offsettoread;	
    INT8U         Readwidth;
    INT32U       Sizetoread;	 

} PACKED AMIYAFUReadFlashReq_T;	

/**
 * @struct AMIYAFUReadFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader ReadFlashRes;
    //INT8U         FlashContent[0x4000];	
	
}PACKED AMIYAFUReadFlashRes_T;		

/**
 * @struct AMIYAFUWriteFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader WriteFlashReq;
    INT32U offsettowrite;	
    INT8U   Writewidth;
    //INT8U   Buffer[0x4000];	
  	 

} PACKED AMIYAFUWriteFlashReq_T;	

/**
 * @struct AMIYAFUWriteFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader WriteFlashRes;
    INT16U SizeWritten; 	
}PACKED AMIYAFUWriteFlashRes_T;		

/**
 * @struct AMIYAFUErashFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader EraseFlashReq;
    INT32U Blknumtoerase;	
     	
} PACKED AMIYAFUErashFlashReq_T;


/**
 * @struct AMIYAFUErashFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader EraseFlashRes;
    INT8U   Status; 	

}PACKED AMIYAFUErashFlashRes_T;	

/**
 * @struct AMIYAFUProtectFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader ProtectFlashReq;
    INT32U Blknum;
    INT8U   Protect;			
     	
} PACKED AMIYAFUProtectFlashReq_T;

/**
 * @struct AMIYAFUProtectFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader ProtectFlashRes;	
    INT8U   Status; 	

}PACKED AMIYAFUProtectFlashRes_T;

/**
 * @struct AMIYAFUEraseCopyFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader EraseCpyFlashReq;
    INT32U Memoffset;
    INT32U Flashoffset;
    INT32U Sizetocopy;	
     	
} PACKED AMIYAFUEraseCopyFlashReq_T;

/**
 * @struct AMIYAFUEraseCopyFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader EraseCpyFlashRes;	
    INT32U Sizecopied; 	

}PACKED AMIYAFUEraseCopyFlashRes_T;

/**
 * @struct AMIYAFUGetECFStatusReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader GetECFStatusReq;
         	
} PACKED AMIYAFUGetECFStatusReq_T;

/**
 * @struct AMIYAFUGetECFStatusRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader GetECFStatusRes;
	INT32U Status;
	INT16U Progress;
}PACKED AMIYAFUGetECFStatusRes_T;

/**
 * @struct AMIYAFUVerifyFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader VerifyFlashReq;
    INT32U Memoffset;
    INT32U Flashoffset;
    INT32U Sizetoverify;	
     	
} PACKED AMIYAFUVerifyFlashReq_T;

/**
 * @struct AMIYAFUVerifyFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader VerifyFlashRes;	
    INT32U Offset; 	

}PACKED AMIYAFUVerifyFlashRes_T;

/**
 * @struct AMIYAFUGetVerifyStatusReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader GetVerifyStatusReq;
         	
} PACKED AMIYAFUGetVerifyStatusReq_T;

/**
 * @struct AMIYAFUGetVerifyStatusRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader GetVerifyStatusRes;
	INT32U Status;
	INT32U Offset; 	
	INT16U Progress;
}PACKED AMIYAFUGetVerifyStatusRes_T;

/**
 * @struct AMIYAFUReadMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader ReadMemReq;
    INT32U Memoffset;
    INT8U   ReadWidth;
    INT16U Sizetoread;	
     	
} PACKED AMIYAFUReadMemoryReq_T;

/**
 * @struct AMIYAFUReadMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader ReadMemRes;	
       
}PACKED AMIYAFUReadMemoryRes_T;

/**
 * @struct AMIYAFUWriteMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader WriteMemReq;
    INT32U Memoffset;
    INT8U   WriteWidth; 
         	
} PACKED AMIYAFUWriteMemoryReq_T;

/**
 * @struct AMIYAFUWriteMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader WriteMemRes;	
    INT16U SizeWritten;
       
}PACKED AMIYAFUWriteMemoryRes_T;

/**
 * @struct AMIYAFUCopyMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader CopyMemReq;
    INT32U MemoffsetSrc;
    INT32U MemoffsetDest;	
    INT32U Sizetocopy;	
         	
} PACKED AMIYAFUCopyMemoryReq_T;

/**
 * @struct AMIYAFUCopyMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader CopyMemRes;
    INT32U Sizecopied;
       
}PACKED AMIYAFUCopyMemoryRes_T;

/**
 * @struct AMIYAFUCompareMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader CmpMemReq;
    INT32U Memoffset1;
    INT32U Memoffset2;	
    INT32U SizetoCmp;	
         	
} PACKED AMIYAFUCompareMemoryReq_T;

/**
 * @struct AMIYAFUCompareMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader CmpMemRes;
    INT32U Offset;
       
}PACKED AMIYAFUCompareMemoryRes_T;

/**
 * @struct AMIYAFUClearMemoryReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader ClearMemReq;
    INT32U MemofftoClear;
    INT32U SizetoClear;	
         	
} PACKED AMIYAFUClearMemoryReq_T;

/**
 * @struct AMIYAFUClearMemoryRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U   CompletionCode; 
    YafuHeader ClearMemRes;
    INT32U SizeCleared;
       
}PACKED AMIYAFUClearMemoryRes_T;

/**
 * @struct AMIYAFUGetBootConfigReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader GetBootReq;
    INT8U         VarName[65];  	
             	
} PACKED AMIYAFUGetBootConfigReq_T;

/**
 * @struct AMIYAFUGetBootConfigRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader GetBootRes;
    INT8U         Status;	
   	
}PACKED AMIYAFUGetBootConfigRes_T;

/**
 * @struct AMIYAFUSetBootConfigReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader SetBootReq;
    INT8U         VarName[65];	
                	  
} PACKED AMIYAFUSetBootConfigReq_T;

/**
 * @struct AMIYAFUSetBootConfigRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader SetBootRes;
    INT8U         Status;	
    	
}PACKED AMIYAFUSetBootConfigRes_T;

/**
 * @struct AMIYAFUGetBootVarsReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader GetBootReq;
                  	  
} PACKED AMIYAFUGetBootVarsReq_T;

/**
 * @struct AMIYAFUGetBootVarsRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader GetBootRes;
    INT8U         VarCount;
    	
}PACKED AMIYAFUGetBootVarsRes_T;



/**
 * @struct AMIYAFUDeactivateFlashReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader DeactivateFlashReq;
               	  
} PACKED AMIYAFUDeactivateFlashReq_T;

/**
 * @struct AMIYAFUDeactivateFlashRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader DeactivateFlashRes;
    INT8U         Status;	
	    	
}PACKED AMIYAFUDeactivateFlashRes_T;

/**
 * @struct AMIYAFUResetDeviceReq_T
 * @brief Flash info structure
 */
typedef struct
{
    YafuHeader ResetReq;
    INT16U       WaitSec;	
               	  
} PACKED AMIYAFUResetDeviceReq_T;

/**
 * @struct AMIYAFUResetDeviceRes_T
 * @brief Flash info structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    YafuHeader ResetRes;
    INT8U         Status;	
	    	
}PACKED AMIYAFUResetDeviceRes_T;

#ifdef CFG_PROJ_IPMC_SUPPORT_YES
/**
 * @struct AMIHandleSwitchStatusReq_T
 * @brief Handle Switch Status structure
 */
typedef struct
{
	INT8U		  Operation; 
    INT8U         SetStatus; 
	    	
}PACKED AMIHandleSwitchStatusReq_T;

/**
 * @struct AMIHandleSwitchStatusRes_T
 * @brief Handle Switch Status structure
 */
typedef struct
{
    INT8U         CompletionCode; 
    INT8U         Status;	
	    	
}PACKED AMIHandleSwitchStatusRes_T;
#endif
#pragma pack()

#endif /* IPMI_AMI_H */

