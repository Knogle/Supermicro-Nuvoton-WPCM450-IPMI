#ifndef _HOSTNAME_H
#define _HOSTNAME_H

#define HOSTNAME_CFG_FILE	"/etc/hostname"
#define HOSTS_CFG_FILE		"/etc/hosts"

#define MAX_HOSTNAME_LEN	256

/* One MUST pass a pointer to a string of length MAX_HOSTNAME_LEN to the 
   following function */
int GetHostName(char *name);

int SetHostName(char *name);

int SetDefaultHostName(void);

int GetRequestedHostName(char *name);

#endif
