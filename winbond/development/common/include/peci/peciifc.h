#ifndef __PECI_IFC_H__
#define __PECI_IFC_H__

/* Device Properties */
#define PECI_DEVICE_MAJOR	45
#define PECI_DEVNAME		"PECI"

/* IOCTL Command and structure */
#define PECI_ISSUE_CMD		_IOWR(PECI_DEVICE_MAJOR, 0, struct pecicmd *)
typedef struct pecicmd 
{
	unsigned char XmitFeedBack;  /* Save Xmit FeedBack with Read Data ? */	
	unsigned char Target;
	unsigned char WriteLen;
	unsigned char WriteData[20];
	unsigned char ReadLen;
	unsigned char ReadData[20];
	unsigned char TxFcsMatch;	    /* Does the Tx FCS Match caclulated FCS ?*/
	unsigned char RxFcsMatch;	    /* Does the Rx FCS Match caclulated FCS ?*/
} PECICMD;


#define PECI_CTL_FILE	"/dev/peci"

int issue_peci_cmd(PECICMD *pecicmd);

int get_peci_temp (int target, unsigned char *temp);

#endif
