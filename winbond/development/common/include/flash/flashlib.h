/********************************************************/
/* Filename:    flashlib.h                              */
/* Author:      Baskar Parthiban                        */
/* Created:     09/24/2003                              */
/* Modified:    09/25/2003                              */
/* Description: Utility library functions for           */
/*              controlling flasher program for         */
/*              upgrading IBM firmware                  */
/********************************************************/

#ifndef _FLASH_LIB_H_
#define _FLASH_LIB_H_

#include "flshdefs.h"

#define GENERAL_ERROR               1
#define NOT_PREPARED_ERROR          2
#define NOT_VERIFIED_ERROR          3
#define ALREADY_PREPARED_ERROR      4
#define ALREADY_VERIFIED_ERROR      5
#define INI_FILE_NOT_FOUND          6
#define NULL_POINTER_RECD           6

/**File contains all functions for structured flash progressing***/
/*********Defines to be used for structured flash progress********************/
#define MAX_TARGET_MODS 16+1 //+1 is because report parsing puts a section called FLASH that is used to determine full flash selection

/*if you do a flash progress of an uinque action always use it with a #define here*/
/*if it is the name of a module just use the module name directly without any qualifications
for e.g.: If you are progressing status on a module upgrade of module boot just use boot
this #defines are for those for which there are no module names but they are 
other things like full flash or preserving config*/

/**************************************************************************/

//states for flash progress of various modules
#define FLSTATE_DOING     0
#define FLSTATE_TOBEDONE  1
#define FLSTATE_COMPLETE  2
#define FLSTATE_SKIPPED   3
#define FLSTATE_ERROR     4

#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif


/*********Data structures for structured flash progress********************/
typedef struct _StructuredFlashProgress
{
    char SubAction[60]; //currently doing what step of the action- erasing,writing etc
    char Progress[30]; //progress indicator..can be strings like so much percent done etc.
    int  State; //set by modules to indicate that everything is complete for this module
} PACKED STRUCTURED_FLASH_PROGRESS;

#ifndef __GNUC__
#pragma pack()
#endif

int PrepareYafuFlashArea(void);

/*  Prototypes for flasher library functions    */
/*  Function:   PrepareFlashArea
    Purpose:    Called by a process that wishes to initiate the firmware 
                upgrade process.  Caller could be goahead webserver, 
                curiserver or any other module.  When called, this function
                signals the flasher process, which starts preparing the flash
                area.  For preparation details consult apps/flasher/
    Params:     None
    Returns:    Error codes as follows
                EXIT_SUCCESS if successful
                GENERAL_ERROR if error
                ALREADY_PREPARED_ERROR if already prepared
                */
int PrepareFlashArea (void);


/*  Prototypes for flasher library functions    */
/*  Function:   PrepareFlashArea_USB
    Purpose:    Called by a process that wishes to initiate the firmware 
                upgrade process.  Caller could be goahead webserver, 
                curiserver or any other module.  When called, this function
                signals the flasher process, which starts preparing the flash
                area.  For preparation details consult apps/flasher/
    Params:     None
    Returns:    Error codes as follows
                EXIT_SUCCESS if successful
                GENERAL_ERROR if error
                ALREADY_PREPARED_ERROR if already prepared
                */
int PrepareFlashArea_USB (void);

/*  Function:   VerifyFirmwareImage
    Purpose:    Signals flasher to verify the uploaded image file. Location
                of image file is presumed to be known by both parties. At the
                end of this process, flasher process would have created a 
                "report.ini" at a predetermined location.  The caller of this
                function should process the report.ini.  For flashing details,
                consult apps/flasher
    Params:     None
    Returns:    Error codes as follows
                EXIT_SUCCESS if successful
                GENERAL_ERROR if error
                NOT_PREPARED_ERROR if PrepareFlashArea did not succeed or
                                    was not called
                ALREADY_VERIFIED_ERROR if VerifyImage already called
                */
int VerifyFirmwareImage (ImageVerificationInfo *ImgCmpInfo);

/*  Function:   StartImageFlash
    Purpose:    Signals flasher to flash the uploaded image file based on the
                settings/preferences saved in "flasher.ini".  The caller of
                this function should have processed "report.ini" and converted
                it to "flasher.ini".  This function also checks for presence
                of "flasher.ini" and fails if it is not found. For flashing 
                details, consult apps/flasher
    Params:     None
    Returns:    Error codes as follows
                EXIT_SUCCESS if successful
                GENERAL_ERROR if error
                NOT_VERIFIED_ERROR if VerifyFirmwareImage did not succeed or
                                    was not called
                */
int StartImageFlash (unsigned char PreserveCfg);

int StartImageFlashOptions (unsigned char PreserveCfg, unsigned char UpdateUboot);

/*  Function:   RestartDeviceWithNewFirmware
    Purpose:    This function simply reboots the linux system.  It uses
                the glibc routine 'reboot' (man 2 reboot) and works
                only if the calling program has root privileges
    Params:     None
    Returns:    Never returns to caller
                */
int RestartDeviceWithNewFirmware (void);

/*  Function:   AbortFlash
    Purpose:    This function should be called if, for any reason, the
                flashing process has to be aborted.  This simply calls
                reboot (man 2 reboot) to reset the device
    Params:     None
    Returns:    Never returns to caller
                */
int AbortFlash (void);

/*  Function:   IsCardInFlashMode
    Purpose:    This function checks if we are in flash mode by stating
				the /var/flasher.initcomplete file
    Params:     None
    Returns:    1
    */
int IsCardInFlashMode();

int GetFlashProgress(STRUCTURED_FLASH_PROGRESS* flprog);

#endif  /*  _FLASH_LIB_H_ */
