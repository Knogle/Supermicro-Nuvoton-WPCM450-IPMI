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
/** @file   DmiInfo.h
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
#ifndef _DMIINFO_H_
#define _DMIINFO_H_
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "coreTypes.h"
#include "SMBIOSInfo.h"


#define MAX_SIZE 			65535

#define SIZEOFNODE 			20
#define MAX_BUFSIZE			1024
#define MAX_XMLDATA			1024 * 2
#define MAX_STRUCTURES 		100
#define SMB_STRUCT_ALLOC_BCLOCKS 		50


#define TRUE				1
#define FALSE				0

#define _VAL32				0x000000ff
#define _VAL64				0x00000000000000ff
#define VALID_64BIT			0xffffffffffffffffLL
#define INVALID_64BIT		0x0000000000000000LL
#define QWORD				8
#define DWORD				4

#define TYPE0_SIZE 			0x17

enum
{
	ERR_SMBIOS_SUCCESS = 0,
	ERR_UNABLE_TO_LOAD_INPUTFILE,
	ERR_IN_READING_INPUT_FILE,
	ERR_IN_OUTPUT_FILENAME,
	ERR_UNABLE_TO_OPEN_OUTPUTFILE,
	ERR_UNABLE_TO_WRITE

} err_seldecoder_E;

typedef struct
{
	u8 type;
	void* 	p_smb_info;
}smb_info_T;


smb_info_T* decodeSMBIOS2C(char* rawsmbiosbuffer, unsigned buf_size, void (*fillTypeOemCallback)( unsigned char *token, int count, int Type, int Length, unsigned char **buffer ) );
//Return type changed from unsigned char to char
char* decodeSMBIOS2XML(unsigned char* rawsmbiosbuffer, unsigned buf_size, void (*fillTypeOemCallback)( unsigned char *token, int count, int Type, int Length, unsigned char **buffer ), void (*FormXMLStringOemCallback)( int Type, unsigned char *buffer ) );


void free_smbios_info (void** p);


int load_dmiinfo(char *inputFilePath, char *outputFilePath);

void FindString(unsigned char *token, int tokenNo, int count, int Length);

void ParseBitFields(unsigned long long bitField_64,int Offset, int Type, u8* buffer);

int  CreateXML(char* XmlData, int Type,int len, u8* buffer, void (*FormXMLStringOemCallback)( int Type, unsigned char *buffer ) );

void DirectToTypeN(unsigned char *token, int count, u8 Type, u8 Length,unsigned char** buffer, void (*fillTypeOemCallback)( unsigned char *token, int count, int Type, int Length, unsigned char **buffer ) );

void FillType0(unsigned char *token, int count, int Length, bios_info_T* Bios_Info );

void FillType1(unsigned char *token, int voidcount, int Length, system_info_T* System_Info);

void FillType2(unsigned char *token, int count, int Length, baseboard_info_T* BaseBoard_Info);

void FillType3(unsigned char *token, int count, int Length, systemenclosure_T* SystemEnclosure);

void FillType4(unsigned char *token, int count, int Length, processor_info_T* Processor_Info);

void FillType5(unsigned char *token, int count, int Length, memorycontroller_info_T* MemoryController_Info);

void FillType6(unsigned char *token, int count, int Length, memorymodule_info_T* MemoryModule_Info);

void FillType7(unsigned char *token, int count, int Length, cache_info_T* Cache_Info);

void FillType8(unsigned char *token, int count, int Length, portconnector_info_T* PortConnector_Info);

void FillType9(unsigned char *token, int count, int Length, systemslots_T* SystemSlots);

void FillType10(unsigned char *token, int count, int Length, onboarddevice_info_T* OnBoardDevice_Info);

void FillType11(unsigned char *token, int count, int Length, oemstring_T* OEMString );

void FillType12(unsigned char *token, int count, int Length, systemconfig_options_T* SystemConfig_Options);

void FillType13(unsigned char *token, int count, int Length, bios_lang_info_T* BIOS_Lang_Info);

void FillType14(unsigned char *token, int count, int Length, groupassociation_T* GroupAssociation);

void FillType15(unsigned char *token, int count, int Length, systemeventlog_T* SystemEventLog);

void FillType16(unsigned char *token, int count, int Length, physicalmemoryarray_T* PhysicalMemoryArray);

void FillType17(unsigned char *token, int count, int Length, memorydevice_T* MemoryDevice);

void FillType18(unsigned char *token, int count, int Length, memory_err_info_32bit_T* Memory_Err_Info_32Bit);

void FillType19(unsigned char *token, int count, int Length, memoryarraymappedaddr_T* MemoryArrayMappedAddr);

void FillType20(unsigned char *token, int count, int Length, memorydevicemappedaddr_T* MemoryDeviceMappedAddr);

void FillType21(unsigned char *token, int count, int Length, buildinpointingdevice_T* BuildInPointingDevice);

/*Modified by NBala
* #157918
*/
//void FillType22(int token[MAX_SIZE], int count, int Length, portablebattery_T* PortableBattery);
void FillType22(unsigned char *token, int count, int Length, portablebattery_T* PortableBattery);

void FillType23(unsigned char *token, int count, int Length, systemreset_T* SystemReset);

void FillType24(unsigned char *token, int count, int Length, hwsecurity_T* HWSecurity);

void FillType25(unsigned char *token, int count, int Length, systempowercontrol_T* SystemPowerControl);

void FillType26(unsigned char *token, int count, int Length, voltageprobe_T* VoltageProbe);

void FillType27(unsigned char *token, int count, int Length, coolingdevice_T* CoolingDevice);

void FillType28(unsigned char *token, int count, int Length, tempratureprobe_T* TempratureProbe);

void FillType29(unsigned char *token, int count, int Length, electricalcurrentprobe_T* ElectricalCurrentProbe);

void FillType30(unsigned char *token, int count, int Length, outofbandremoteaccess_T* OutOfBandRemoteAccess);

void FillType32(unsigned char *token, int count, int Length, systemboot_info_T* SystemBoot_Info);

void FillType33(unsigned char *token, int count, int Length, memory_err_info_64bit_T* Memory_Err_Info_64Bit);

void FillType34(unsigned char *token, int count, int Length, managementdevice_T* ManagementDevice);

void FillType35(unsigned char *token, int count, int Length, managementdevicecomponent_T* ManagementDeviceComponent);

void FillType36(unsigned char *token, int count, int Length, mngmt_dev_thresholddata_T* Mngmt_Dev_ThresholdData);

void FillType37(unsigned char *token, int count, int Length, memorychannel_T* MemoryChannel);

void FillType38(unsigned char *token, int count, int Length, ipmidevice_info_T* IPMIDevice_Info);

void FillType39(unsigned char *token, int count, int Length, systempowersupply_T* SystemPowerSupply);

void FormXMLString_Type0(bios_info_T* Bios_Info);

void FormXMLString_Type1(system_info_T* System_Info);

void FormXMLString_Type2(baseboard_info_T* BaseBoard_Info);

void FormXMLString_Type3(systemenclosure_T* SystemEnclosure);

void FormXMLString_Type4(processor_info_T* Processor_Info);

void FormXMLString_Type5(memorycontroller_info_T* MemoryController_Info);

void FormXMLString_Type6(memorymodule_info_T* MemoryModule_Info);

void FormXMLString_Type7(cache_info_T* Cache_Info);

void FormXMLString_Type8(portconnector_info_T* PortConnector_Info);

void FormXMLString_Type9(systemslots_T* SystemSlots);

void FormXMLString_Type10(onboarddevice_info_T* OnBoardDevice_Info);

void FormXMLString_Type11(oemstring_T* OEMString);

void FormXMLString_Type12(systemconfig_options_T* SystemConfig_Options);

void FormXMLString_Type13(bios_lang_info_T* BIOS_Lang_Info);

void FormXMLString_Type14(groupassociation_T* GroupAssociation);

void FormXMLString_Type15(systemeventlog_T* SystemEventLog);

void FormXMLString_Type16(physicalmemoryarray_T* PhysicalMemoryArray);

void FormXMLString_Type17(memorydevice_T* MemoryDevice);

void FormXMLString_Type18(memory_err_info_32bit_T* Memory_Err_Info_32Bit);

void FormXMLString_Type19(memoryarraymappedaddr_T* MemoryArrayMappedAddr);

void FormXMLString_Type20(memorydevicemappedaddr_T* MemoryDeviceMappedAddr);

void FormXMLString_Type21(buildinpointingdevice_T* BuildInPointingDevice);

void FormXMLString_Type22(portablebattery_T* PortableBattery);
void FormXMLString_Type23(systemreset_T* SystemReset);

void FormXMLString_Type24(hwsecurity_T* HWSecurity);

void FormXMLString_Type25(systempowercontrol_T* SystemPowerControl);

void FormXMLString_Type26(voltageprobe_T* VoltageProbe);

void FormXMLString_Type27(coolingdevice_T* CoolingDevice);

void FormXMLString_Type28(tempratureprobe_T* TempratureProbe);

void FormXMLString_Type29(electricalcurrentprobe_T* ElectricalCurrentProbe);

void FormXMLString_Type30(outofbandremoteaccess_T* OutOfBandRemoteAccess);

void FormXMLString_Type32(systemboot_info_T* SystemBoot_Info);

void FormXMLString_Type33(memory_err_info_64bit_T* Memory_Err_Info_64Bit);

void FormXMLString_Type34(managementdevice_T* ManagementDevice);

void FormXMLString_Type35(managementdevicecomponent_T* ManagementDeviceComponent);

void FormXMLString_Type36(mngmt_dev_thresholddata_T* Mngmt_Dev_ThresholdData);

void FormXMLString_Type37(memorychannel_T* MemoryChannel);

void FormXMLString_Type38(ipmidevice_info_T* IPMIDevice_Info);

void FormXMLString_Type39(systempowersupply_T* SystemPowerSupply);

int LoadDummyValue(int ReqType, int ReqType_Index);

void CopyBootConfigSettingInfo(int Index);

#endif //_DMIINFO_H_
