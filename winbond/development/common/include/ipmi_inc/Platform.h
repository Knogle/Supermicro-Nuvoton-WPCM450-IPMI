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
 * PlatformPort.h
 * Platform porting functions and defines.
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 ******************************************************************/
#ifndef PLATFORM_PORT_H
#define PLATFORM_PORT_H

#include "Types.h"
#include "OSPort.h"

/* Platform detection */
#if defined(__i386__) || defined(__amd64__) || defined(__x86_64__)
  #define PLATFORM_X86				1
  #define BYTEORDER_LITTLEENDIAN	1
#elif defined(__PPC__)
  #define PLATFORM_PPC				1
  #define BYTEORDER_BIGENDIAN		1
#elif defined(__mips__)
  #define PLATFORM_MIPS			1
  #define BYTEORDER_BIGENDIAN		1
#elif defined(__arm__)
  #define PLATFORM_ARM			1
  #define BYTEORDER_LITTLEENDIAN	1
#else
  #define PLATFORM_UNKNOWN			1
  #define BYTEORDER_UNKNOWN			1
#endif

#define IS_PLATFORM_X86()			PLATFORM_X86
#define IS_PLATFORM_PPC()			PLATFORM_PPC
#define IS_PLATFORM_ARM()			PLATFORM_ARM
#define IS_PLATFORM_MIPS()			PLATFORM_MIPS

/**
 * @def htoipmi_u32
 * @brief Converts unsigned 32 bit data from Host format to IPMI format.
 * @param Val 32bit value to be converted.
 **/
#if IS_PLATFORM_X86() || IS_PLATFORM_ARM()
#define htoipmi_u32(Val)    (Val)
#elif IS_PLATFORM_PPC() || IS_PLATFORM_MIPS()
#define htoipmi_u32(Val)    ipmitoh_u32(Val)
#endif
                            
/**
 * @def ipmitoh_u32
 * @brief Converts unsigned 32 bit data from IPMI format to Host format.
 * @param Val 32bit value to be converted.
 **/
#if IS_PLATFORM_X86() || IS_PLATFORM_ARM()
#define ipmitoh_u32(Val)    (Val)
#elif IS_PLATFORM_PPC() || IS_PLATFORM_MIPS()
#define ipmitoh_u32(Val)    (((Val & 0xFF000000) >> 24)| \
                             ((Val & 0x00FF0000) >> 8) | \
                             ((Val & 0x0000FF00) << 8) | \
                             ((Val & 0x000000FF) << 24 ))
#endif

/**
 * @def htoipmi_u16
 * @brief Converts unsigned 16 bit data from Host format to IPMI format.
 * @param Val 16bit value to be converted.
 **/
#if IS_PLATFORM_X86() || IS_PLATFORM_ARM()
#define htoipmi_u16(Val)    (Val)
#elif IS_PLATFORM_PPC() || IS_PLATFORM_MIPS()
#define htoipmi_u16(Val)   ipmitoh_u16(Val)
#endif

/**
 * @def htoipmi_u16
 * @brief Converts unsigned 16 bit data from IPMI format to Host format.
 * @param Val 16bit value to be converted.
 **/
#if IS_PLATFORM_X86() || IS_PLATFORM_ARM()
#define ipmitoh_u16(Val)    (Val)
#elif IS_PLATFORM_PPC() || IS_PLATFORM_MIPS()
#define ipmitoh_u16(Val)   (INT16U)(((INT16U)(Val) & 0xFF00) >> 8 | ((INT16U)(Val) & 0x00FF) << 8)
#endif

/*** Extern Declarations ***/

/*** Functions Prototypes ***/
/**
 * @brief Initialises the Platform.
 * @return 0 if success else -1
 **/
extern int Platform_Init (void);

/**
 * @brief Platform setup performed after shared memory initialized.
 * @return 0 if success else -1
 **/
extern int Platform_Init_SharedMem (void);

/**
 * @brief Platform setup performed after IPMI stack running.
 * @return 0 if success else -1
 **/
extern int Platform_Init_Done (void);

/**
 * @brief Warm resets the BMC.
 **/
extern void Platform_WarmReset (void);

/**
 * @brief Cold resets the BMC.
 **/
extern void Platform_ColdReset (void);

/**
 * @brief Powers up the Host.
 **/
extern void Platform_HostPowerUp (void);

/**
 * @brief Powers Off the Host.
 **/
extern void Platform_HostPowerOff (void);

/**
 * @brief Powers on the Host.
 * @return 0 if success else -1.
 **/
extern BOOL Platform_HostPowerOn (void);

/**
 * @brief Power cycles the Host.
 **/
extern void Platform_HostPowerCycle (void);

/**
 * @brief Soft Shutdowns the Host.
 **/
extern void Platform_HostSoftShutDown (void);

/**
 * @brief Resets the Host.
 **/
extern void Platform_HostColdReset (void);

/**
 * @brief Generates the Diagnodtic (NMI) interrupt.
 **/
extern void Platform_HostDiagInt (void);

/**
 * @brief Identifies the platform
 **/
extern void Platform_Identify (INT32U Timeout, int Force);

extern void UpdateACPIStateChange (int CurrentState);

extern void GetPrevACPIState(INT8U* pu8PrevState);


#endif  /* PLATFORM_PORT_H */
