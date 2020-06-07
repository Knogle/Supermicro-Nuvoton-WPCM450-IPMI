#ifndef __VMEDIA_TOKEN_H__
#define __VMEDIA_TOKEN_H__

#include "coreTypes.h"

// error codes
#define VMEDIA_E_SUCCESS	(0x00) // success
#define VMEDIA_E_LOCK		(0x01) // error while acquiring locks for desired operation
#define VMEDIA_E_IN_USE		(0x02) // vMedia is already in use by someother user
#define VMEDIA_E_STORE		(0x03) // error while accessing the vmedia token store for setting or resetting the tokens

int set_cdrom_redir(char*, char*, uint8*);
int	reset_cdrom_redir(char *, unsigned long *racsession_id, unsigned char *is_floppy_in_use);
int set_floppy_redir(char *, char*, uint8 *);
int	reset_floppy_redir(char *, unsigned long *racsession_id, unsigned char *is_cdrom_in_use);
int set_vmedia_racsession_id(unsigned long racsession_id);

#endif



