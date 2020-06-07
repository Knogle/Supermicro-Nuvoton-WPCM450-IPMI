/*****************************************************************
 *****************************************************************
 ***                                                            **
 ***    (C)Copyright 2005-2006, American Megatrends Inc.        **
 ***                                                            **
 ***            All Rights Reserved.                            **
 ***                                                            **
 ***        6145-F, Northbelt Parkway, Norcross,                **
 ***                                                            **
 ***        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 ***                                                            **
 *****************************************************************
 *****************************************************************
 ******************************************************************
 *
 * nvram.h
 * NVRAM Functions
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 *			Basavaraj Astekar	<basavaraja@ami.com>
 *			Ravinder Reddy		<bakkar@ami.com>
 ******************************************************************/
#ifndef NVRAM_H
#define NVRAM_H



#include "Types.h"
#include "IPMI_Main.h"
#include "NVRData.h"

#define PMCONFIG_FILE   NV_DIR_PATH "PMConfig.dat"
#define SDR_FILE        NV_DIR_PATH "SDR.dat"
#define SEL_FILE        NV_DIR_PATH "SEL.dat"


#define WRITE_NVR               1
#define READ_NVR                2

#define FLUSH_PMC               1
#define FLUSH_SDR               2
#define FLUSH_SEL               3
#define FLUSH_FRU               4


/**
 * @fn  InitSharedMemNVR
 * @brief Initialize Shared memory for NVRAM
 * @param none
 **/
extern int InitSharedMemNVR (void);


/**
 * @fn  GetNVRAddr
 * @brief Gets NVR address from RAM
 * @param NVRHandle   -  Handle for NVRAM
 **/
extern INT8U*  GetNVRAddr(INT32U NVRHandle); 


/**
 * @fn InitNVR
 * @brief Reads NVRam information from file
**/
extern int InitNVR (void);

 /**
 * @fn VerifyChksum
 * @brief Verify checksum of a block
 * @param Addr	- Start address of block
 * @param Size	- Size of block
**/
extern int	VerifyChksum ( _FAR_ INT32U* Addr , INT16U Size );

 /**
 * @fn VerifyChksum
 * @brief Calculates checksum of a block
 * @param Addr	- Start address of block
 * @param Size	- Size of block
**/
extern void CalChksum( _FAR_ INT32U* Offset, INT16U Size);


 /**
 * @fn ReadWriteNVR
 * @brief Reads/Writes the Non volatile informations to/from file
 * @param FileName - File to Write or Read from.
 * @param pData    - Pointer to data.
 * @param Offset   - Offset in the file to Write of Read from.
 * @param Size     - Size of data to read/write.
 * @param Flag     - Flag to perform write or read operation.
**/
extern int ReadWriteNVR (char *FileName, INT8U* pData, INT16U Offset, INT16U Size, INT8U Falg);


/**
 * @macro  ReFlushPMC : We have to re flush the  New PMconfiguration to NV Ram 
 **/
#define ReFlushPMC(RAMAddr, Size)         \
CalChksum ((INT32U*)GetNVRAddr(NVRH_PMCONFIG), sizeof(PMConfig_T)); \
ReadWriteNVR (PMCONFIG_FILE, (INT8U*)RAMAddr, 0, Size,WRITE_NVR);


/**
 * @macro  FlushPMC
 **/
#define FlushPMC(RAMAddr, Size)         \
CalChksum ((INT32U*)GetNVRAddr(NVRH_PMCONFIG), sizeof(PMConfig_T)); \
ReadWriteNVR (PMCONFIG_FILE, (INT8U*)RAMAddr, (INT8U*)RAMAddr - (INT8U*)GetNVRAddr(NVRH_PMCONFIG), Size,WRITE_NVR);


/**
 * @macro  FlushSDR
 **/
#define FlushSDR(RAMAddr, Size)         \
ReadWriteNVR (SDR_FILE, (INT8U*)RAMAddr, (INT8U*)RAMAddr - (INT8U*)GetNVRAddr(NVRH_SDR), Size,WRITE_NVR);

/**
 * @macro  FlushSEL
 **/
#define FlushSEL(RAMAddr, Size)         \
ReadWriteNVR (SEL_FILE, (INT8U*)RAMAddr, (INT8U*)RAMAddr - (INT8U*)GetNVRAddr(NVRH_SEL), Size,WRITE_NVR);

#endif /* NVRAM_H */

