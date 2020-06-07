/***************************************************************
****************************************************************
**                                                            **
**  (C)Copyright 2002 - 2003, American Megatrends Inc.        **
**                                                            **
**            All Rights Reserved.                            **
**                                                            **
**      6145 - F, Northbelt Parkway, Norcross,		          **
**                                                            **
**     Georgia - 30071, USA. Phone -(770) - 246 - 8600.	      **
**                                                            **
****************************************************************
****************************************************************
****************************************************************
/ $Header: $
/
/ $Revision: $
/
/ $Date: May 10'2007
/
****************************************************************
****************************************************************/
/** @file   SMBIOSInfo.h
 *  @author <sandhyar@ami.com>
 *  @brief  Declarations of SMBIOS function calls

 *
 *  Revision History
 *  ----------------
 *
 * $Log: $
 	Modified by Sandhya on 10 May'2007

 *
 ****************************************************************/
#ifndef _SMBIOS_INFO_H_
#define _SMBIOS_INFO_H_

#include <coreTypes.h>
#define MAX_LOG  100

/*
*	Note: Each text string is limited to 64 significant characters due to system MIF limitations
*	-Section 3.1.3 //
*/

#define MAX_STR_LEN	 256 

/* Defect Id 157952
*  To avoid over writting
*  Characteristics, CharacteristicsExt1 members are
*   INCREASED FROM 256 TO ACCOMODATE MORE STRINGS
*/
#define MAX_CHAR_STR 32
#define MAX_CHAREXT1_STR 8
#define MAX_CHAREXT2_STR 3

typedef struct
{
	char			VendorName [MAX_STR_LEN];
	char			Version [MAX_STR_LEN];
	unsigned int 	StartingAddress;
	char			ReleaseDate [32];
	unsigned int	ROMSize;
	unsigned long	SystemBIOSMajorRelease;
	unsigned long 	SystemBIOSMinorRelease;
	unsigned long	EmbeddedControllerFirmwareMajorRelease;
	unsigned long	EmbeddedControllerFirmwareMinorRelease;
	char			Characteristics[MAX_CHAR_STR][MAX_STR_LEN];
	char			CharacteristicsExt1 [MAX_CHAREXT1_STR][MAX_STR_LEN];
	char			CharacteristicsExt2 [MAX_CHAREXT2_STR][MAX_STR_LEN];

} bios_info_T;

typedef struct
{
	char	Manufacturer[256];
	char	ProductName[256];
	char	Version[256];
	char	SerialNo[256];
	char	UUID[64];
	char	WakeUpType[64];
	char	SKUNo[256];
	char	Family[256];
}system_info_T;

/*Modified  
*  For Defect Id 157918
*  ChassisLocation, ChassisHandle, NoofContainedObjHandles, 
*   ContainedObjectHandles Members added
*/
typedef struct
{
	char		Manufacturer[256];
	char		ProductName[256];
	char		Version[256];
	char		SerialNo[256];
	char		AssetTag[256];
	char		FeaturesFlag[256];
	char		ChassisLocation[256];
	WORD	ChassisHandle;
	char		BoardType[64];
	BYTE	NoofContainedObjHandles;
	WORD	ContainedObjectHandles[256];
}baseboard_info_T;

typedef struct
{
	unsigned int	TypeSelect;
	char	BaseBoardType[256];
	char	SMBIOSStructureType[256];
}ContainedElementType_T;


/*	Defect Id 157954
* 	New members added acc to spec 2.5
*  	Serial Number, Asset Tag, OEM-defined, Height, 
*	Number of Power Cords, Contained Element Count, 
*	Contained Element Record Length
*/

typedef struct
{
	BYTE	ContainedElementType;
	BYTE	ContainedElementMinimum;
	BYTE	ContainedElementMaximum;
	
}ContainedElements_T;

typedef struct
{
	char	ChassisLock[25];
	char	ChassisType[MAX_STR_LEN];
} system_chassis_type_T;

typedef struct
{
	char		Manufacturer[MAX_STR_LEN];
	system_chassis_type_T SystemChassisType;
	char		Version[MAX_STR_LEN];
	char		SerialNo[MAX_STR_LEN];
	char		AssertTagNo[MAX_STR_LEN];
	char		BootUpState[25];
	char		PowerSupplyState[25];
	char		ThermalState[25];
	char		SecurityStatus[25];
	unsigned long	OEM_Defined;
	BYTE	Height;
	BYTE	NoOfPowerCords;
	BYTE	ContainedElementCount;
	BYTE	ContainedElementRecordLength;
	ContainedElements_T ContainedElements[MAX_STR_LEN];
}systemenclosure_T;


/*	Defect Id 157956
* 	New members added acc to spec 2.5
*  	CoreCount, CoreEnabled, ThreadCount, ProcessorCharacteristics
*/

#define MAX_PC_LEN 16

typedef struct
{
	char			SocketDesignation[MAX_STR_LEN];
	char			ProcessorType[MAX_STR_LEN];
	char			ProcessorFamily[MAX_STR_LEN];
	char			Manufacturer[MAX_STR_LEN];
	char			ProcessorID[16];
	char			ProcessorVersion[MAX_STR_LEN];
	char			Voltage[MAX_STR_LEN];
	unsigned int 		ExternalClock;
	unsigned int 		MaxSpeed;
	unsigned int 		CurrentSpeed;
	char			Status[MAX_STR_LEN];
	char			ProcessorUpgrade[MAX_STR_LEN];
	char			L1CacheHandle[25];
	char			L2CacheHandle[25];
	char			L3CacheHandle[25];
	char			SerialNo[25];
	char			AssertTag[25];
	char			PartNo[25];
	char			CoreCount[25];
	char			CoreEnabled[25];
	char			ThreadCount[25];
	char			ProcessorCharacteristics[MAX_PC_LEN][25];
}processor_info_T;

typedef struct
{
	char			ErrorDetectingMethod[25];
	char			ErrorCorrectingCapability[50];
	char			SupportedInterLeave[256];
	char			CurrentInterLeave[256];
	unsigned int		MaxMemoryModuleSize;
	char			SupportedSpeed[256];
	char			SupportedMemoryType[256];
	char			MemoryModuleVoltage[25];
	int			NoOfAssociatedMemorySlots;
	unsigned long		MemoryModuleConfigHandle[255];
	char			EnabledErrorCorrectingCapabilities[256];
}memorycontroller_info_T;

typedef struct
{
	char	InstalledSize[50];
	char	Installed_NoOfBanks[25];
}memory_installed_T;

typedef struct
{
	char	EnabledMemory_Size[50];
	char	EnabledMemory_NoOfBanks[25];
}memory_enabled_T;

typedef struct
{
	char			SocketDesignation[256];
	char			BankConnections[256];
	unsigned int		CurrentSpeed;
	char			CurrentMemoryType[256];
	memory_installed_T InstalledMem;
	memory_enabled_T EnabledMem;
	char			Memory_ErrorStatus[256];
}memorymodule_info_T;

typedef struct
{
	char	CacheLevel[25];
	char	CacheSocketed[25];
	char	Location[25];
	char	Enabled[25];
	char	OperationMode[25];
}cacheconfiguration_T;

typedef struct
{
	char			Granularity[25];
	unsigned long	Size;
}maxcachesize_T;

typedef struct
{
	char	Inst_Granularity[25];
	unsigned long	Inst_Size;
}installedcache_T;

/*	Defect Id 157918
* 	Maximum string Length Limited
*/

typedef struct
{
    char			SocketDesignation[MAX_STR_LEN];
	cacheconfiguration_T CacheConfig;
	maxcachesize_T MaxSize;
	installedcache_T Inst_Cache;
	char			SupportedSRAMType[MAX_STR_LEN];
	char			CurrentSRAMType[MAX_STR_LEN];
	unsigned long	CacheSpeed;
	char			ErrorCorrectionType[MAX_STR_LEN];
	char			SystemCacheType[MAX_STR_LEN];
	char			Associativity[MAX_STR_LEN];
}cache_info_T;

typedef struct
{
 	char	InternalReferenceDesignator[64];
	char	InternalConnectorType[64];
	char	ExternalReferenceDesignator[64];
	char	ExternalConnectorType[64];
	char	PortType[64];
}portconnector_info_T;

typedef struct
{
	char			SlotDesignation[64];
	char			SlotType[25];
	char			SlotDataBusWidth[25];
	char			CurrentUsage[25];
	char			SlotLength[25];
	unsigned long	SlotID;
	char			SlotCharacteristics1[128];
	char			SlotCharacteristics2[128];
}systemslots_T;

typedef struct
{
	char	Status[25];
	char	DeviceType[25];
}onboarddevicetype_T;

/* Modified 
* For Defect Id 157918
*  To provide access to multiple string access
*  Maximum no of strings limited to 25, increase if necessary
*/
typedef struct
{
	int	NoOfDevices;
	onboarddevicetype_T Device[25];
	char	DescriptionString[25][256];
}onboarddevice_info_T;

/* 	Defect Id 157912
* 	New member added to provide access to string SysConStrings
*/

#define MAX_OEM_STR_COUNT		16
#define MAX_OEM_STR_LEN		64

typedef struct
{
	unsigned long	Count;
	char OemStrings[MAX_OEM_STR_COUNT][MAX_OEM_STR_LEN];
}oemstring_T;

/* 	Defect Id 157913
* 	New member added to provide access to string SysConStrings
*/

#define MAX_SYSCON_STR_COUNT		16
#define MAX_SYSCON_STR_LEN		64

typedef struct
{
	unsigned long	Count;
	char SysConStrings[MAX_SYSCON_STR_COUNT][MAX_SYSCON_STR_LEN];
}systemconfig_options_T;

typedef struct  {
	int		NoOfLanguage;
	char		Name[10][64];
}supportedlanguage_T;

typedef struct
{
	supportedlanguage_T Language;
 	char			Flags[100];
	char			CurrentLanguage[64];
}bios_lang_info_T;

typedef struct {
	char			Type[25];
	unsigned long	Handle;
}itemdetails_T;

typedef struct
{
	char	GroupName[256];
	itemdetails_T Item[42];
	int		ItemCount;
}groupassociation_T;

typedef struct
{
	char	LogType[50];
	char	VariableDataFormat[50];
}supportedeventlog_T;

typedef struct
{
    unsigned long		LogAreaLength;
	unsigned long		LogHeaderStartOffset;
	unsigned long		LogDataStartOffset;
	char				AccessMethod[50];
	char				LogStatus[100];
	unsigned long long	LogChangeToken;
	unsigned long long	AccessMethodAddress;
	char				LogHeaderFormat[50];
	int					NoOfSupportedLogType;
	unsigned long		LogTypeLength;
	supportedeventlog_T EventLog[MAX_LOG];
}systemeventlog_T;

typedef struct
{
    char			Location[64];
	char			Use[25];
	char			ErrorCorrection[25];
	char			MaximumCapacity[25];
	char			ErrorInformationHandle[50];
	unsigned long	NoOfDevices;
}physicalmemoryarray_T;

typedef struct
{
	char	Granularity[25];
	char	Size[50];	//Changed to 50 from 25 Aug 27 2007
}memorysize_T;

/* Modified 
*  For Defect Id 157918
*  Size of DeviceLocator, BankLocator, Manufacturer, SerialNo, AssetTag, PartNo 
*  are reduced from 256 to 64
*/
typedef struct
{
 	WORD		PhysicalMemoryArrayHandle;
	char			MemoryErrorInformationHandle[MAX_STR_LEN];
	WORD		TotalWidth;
	WORD		DataWidth;
	memorysize_T MemSize;
	char			FormFactor[25];
	BYTE		DeviceSet;
	char			DeviceLocator[MAX_STR_LEN];
	char			BankLocator[MAX_STR_LEN];
	char			MemoryType[25];
	char			TypeDetail[50];
	char			Speed[25];
	char			Manufacturer[MAX_STR_LEN];
	char			SerialNo[MAX_STR_LEN];
	char			AssetTag[MAX_STR_LEN];
	char			PartNo[MAX_STR_LEN];
}memorydevice_T;

typedef struct
{
 	char				ErrorType[35];
	char				ErrorGranularity[35];
	char				ErrorOperation[20];
	char				VendorSyndrome[25];
	char				MemoryArrayErrorAddress[25];
	char				DeviceErrorAddress[25];
	char				ErrorResolution[25];
}memory_err_info_32bit_T;

typedef struct
{
    unsigned long long	StartingAddress;
	unsigned long long	EndingAddress;
	unsigned long		MemoryArrayHandle;
	unsigned long		PartitionWidth;
}memoryarraymappedaddr_T;

typedef struct
{
 	unsigned long long	StartingAddress;
	unsigned long long	EndingAddress;
	unsigned long		MemoryDeviceHandle;
	unsigned long		MemoryArrayHandle;
	int					PartitionRowPosition;
	int					InterLeavePosition;
	int					InterLeavedDataDepth;
}memorydevicemappedaddr_T;

typedef struct
{
	char		Type[25];
	char		Interface[30];
	int		NoOfButtons;
}buildinpointingdevice_T;


/* Modified 
* For Defect Id 157918
*/
typedef struct
{
	char			Location[25];
	char			Manufacturer[256];
	char			ManufactDate[32];
	char			SerialNo[256];
	char			DeviceName[256];
	char			DeviceChemistry[256];
	char			DesignCapacity[25];
	char			DesignVoltage[25];
	char			SBDSVerNumber[32];
	char		 	MaximumError[32];
	int			SBDSSerialNo;
	int			SBDSManuDate;
	char			SBDSDeviceChemistry[32];
	int			DesignCapacityMul;
	unsigned long OEMSpecific;
}portablebattery_T;

typedef struct
{
	char	Status[25];
	char	BootOption[25];
	char	BootOptionLimit[25];
	char	HasWatchDogTimer[25];
}resetcapabilities_T;

typedef struct
{
	resetcapabilities_T Capabilities;
	BYTE	ResetCount;
	BYTE	ResetLimit;
	BYTE	TimeInterval;
	BYTE	TimeOut;
}systemreset_T;

typedef struct
{
	char	PowerOnPasswordStatus[25];
	char	KeyBoardPasswordStatus[25];
	char	AdministratorPasswordStatus[25];
	char	FrontPanelResetStatus[25];
}hwsecurity_T;

typedef struct
{
	int		NextScheduledPowerOnMonth;
	int		NextScheduledPowerOnDayOfMonth;
	int		NextScheduledPowerOnHour;
	int		NextScheduledPowerOnMinute;
	int		NextScheduledPowerOnSecond;
}systempowercontrol_T;

typedef struct
{
	char	Location[50];
	char	Status[50];
}locationandstatus_T;

/* Modified 
* For Defect Id 157918
*/
typedef struct
{
	char					Description[MAX_STR_LEN];
	locationandstatus_T 	VProbe;
	char 				MaximumValue[25];
	char					MinimumValue[25];
	char					Resolution[25];
	char					Tolerance[25];
	char					Accuracy[25];
	DWORD				OEMDefined;
	char					NominalValue[25];
}voltageprobe_T;

typedef struct
{
	char	DeviceType[50];
	char	Status[50];
}coolingdevicedetails_T;

typedef struct
{
	char					TempratureProbeHandle[50];
	coolingdevicedetails_T 	DeviceDetail;
	int						CoolingUnitGroup;
	unsigned long			NominalSpeed;
}coolingdevice_T;

typedef struct
{
	char	Location[50];
	char	Status[50];
}tempprobe_locationandstatus_T;

typedef struct
{
    char			Description[256];
    tempprobe_locationandstatus_T TempratureProbeDetails;
	char 				MaximumValue[25];
	char					MinimumValue[25];
	char					Resolution[25];
	char					Tolerance[25];
	char					Accuracy[25];
	DWORD				OEMDefined;
	char					NominalValue[25];
}tempratureprobe_T;

typedef struct
{
	char	Location[50];
	char	Status[50];
}currentprobe_locationandstatus_T;

typedef struct
{
    char			Description[256];
    currentprobe_locationandstatus_T CurrentProbeDetails;
	char		MaximumValue[25];
	char		MinimumValue[25];
	char		Resolution[25];
	char		Tolerance[25];
	char		Accuracy[25];
	unsigned long	OEMDefined;	
	char		NominalValue[25];
}electricalcurrentprobe_T;

typedef struct
{
	char	OutBoundConnectionEnabled[25];
	char	InBoundConnectionEnabled[25];
}connections_T;

typedef struct
{
	char	ManufacturerName[256];
	connections_T Con;
}outofbandremoteaccess_T;

typedef struct
{
	char	BootStatus[100];
	char	AdditionalData[256];

}systemboot_info_T;

typedef struct
{
	char	ErrorType[25];
    char	ErrorGranularity[25];
	char	ErrorOperation[25];
    unsigned long long	VendorSyndrome;
	unsigned long long	MemoryArrayErrorAddress;
	unsigned long long	DeviceErrorAddress;
	unsigned long long	ErrorResolution;
}memory_err_info_64bit_T;

typedef struct
{
	char				Description[256];
    char				Type[50];
	unsigned long long	Address;
	char				AddressType[25];
}managementdevice_T;

typedef struct
{
	char			Description[256];
	unsigned long	ManagementDeviceHandle;
	unsigned long	ComponentHandle;
	char		ThresholdHandle[25];
}managementdevicecomponent_T;

typedef struct
{
	unsigned long	LowerThresholdNonCritical;
	unsigned long	UpperThresholdNonCritical;
	unsigned long	LowerThresholdCritical;
	unsigned long	UpperThresholdCritical;
	unsigned long	LowerThresholdNonRecoverable;
	unsigned long	UpperThresholdNonRecoverable;
}mngmt_dev_thresholddata_T;

/* Modified by NBAla
*  
*/
typedef struct
{
	char			ChannelType[25];
	unsigned long	MaxChannelLoad;
	unsigned long	MemoryDeviceCount;
	unsigned long	Memory1DeviceLoad;
	unsigned long	MemoryDevice1Handle;
	unsigned long	MemoryDeviceNLoad[20];
	unsigned long	MemoryDeviceNHandle[20];
}memorychannel_T;

typedef struct	{
	unsigned long long	Address;
	char				MappedMemory[25];
}baseaddress_T;

/* #Defect Id 157918
*   changed member 'NVStorageAddressDevice' into string
*/
typedef struct
{
	char			InterfaceType[256];
	char			IPMISpecRevision[25];
	unsigned long	I2CSlaveAddress;
	char			NVStorageAddressDevice[30];
	baseaddress_T Addr;
}ipmidevice_info_T;

typedef struct
{
	char	DMTFPowerSupplyType[50];
	char	Status[25];
	char	InputVoltageSwitching[50];
	char	PowerSupplyUnplugged[25];
	char	PowerSupplyPresent[25];
	char	HotReplacable[25];
}powersupplycharacteristics_T;

typedef struct
{
	unsigned long	PowerUnitGroup;
	char			Location[256];
	char			DeviceName[256];
	char			Manufacturer[256];
	char			SerialNo[256];
	char			AssetTagNo[256];
	char			ModelPartNo[256];
	char			RevisionLevel[256];
	char			MaxPowerCapacity[25];
	powersupplycharacteristics_T Characteristics;
	unsigned long	InputVotageProbeHandle;
	unsigned long	CoolingDeviceHandle;
	unsigned long	InputCurrentProbeHandle;
} systempowersupply_T;



#endif //_SMBIOS_INFO_H_
