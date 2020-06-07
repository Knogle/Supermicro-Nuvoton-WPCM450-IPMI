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
 * ChassisAPI.h
 * Chassis Access API.
 *
 *  Author: Govind Kothandapani <govindk@ami.com>
 *
 ******************************************************************/
#ifndef CHASSISAPI_H
#define CHASSISAPI_H
#include "Types.h"

/*-----------------------------------------------------------------
 * @fn API_ChassisPowerOff
 * @brief Powers off the chassis
 * @return 	0 	if success
 *			-1 	on error
 *-----------------------------------------------------------------*/
extern int API_ChassisPowerOff (void);

/*-----------------------------------------------------------------
 * @fn API_ChassisPowerOn
 * @brief Powers on the chassis
 * @return 	0 	if success
 *			-1 	on error
 *-----------------------------------------------------------------*/
extern int API_ChassisPowerOn (void);

/*-----------------------------------------------------------------
 * @fn API_ChassisPowerCycle
 * @brief Powers cycles the chassis
 * @return 	0 	if success
 *			-1 	on error
 *-----------------------------------------------------------------*/
extern int API_ChassisPowerCycle (void);

/*-----------------------------------------------------------------
 * @fn API_ChassisPowerReset
 * @brief Powers resets the chassis
 * @return 	0 	if success
 *			-1 	on error
 *-----------------------------------------------------------------*/
extern int API_ChassisPowerReset (void);

/*-----------------------------------------------------------------
 * @fn API_ChassisDiagInterrupt
 * @brief Generate diagnostic interrupt
 * @return 	0 	if success
 *			-1 	on error
 *-----------------------------------------------------------------*/
extern int API_ChassisDiagInterrupt (void);

/*-----------------------------------------------------------------
 * @fn API_ChassisSMIInterrupt
 * @brief Generate SMI Interrupt
 * @return 	0 	if success
 *			-1 	on error
 *-----------------------------------------------------------------*/
extern int API_ChassisSMIInterrupt (void);

/*-----------------------------------------------------------------
 * @fn API_ChassisPwrOnOffCount
 * @brief Provides the chassis Power On off count
 * @return 	number of occurences of power on & off. 	
 *-----------------------------------------------------------------*/
extern int API_ChassisPwrOnOffCount (void);

/*-----------------------------------------------------------------
 * @fn API_OnSetRestartCause
 * @brief Provides the hook to the API on the restart reason change.
 * @return 	0 if success. 	
 *-----------------------------------------------------------------*/
extern int API_OnSetRestartCause(INT8U u8SysRestartCause, INT8U u8MadeChange);

#endif	/* CHASSISAPI_H */

