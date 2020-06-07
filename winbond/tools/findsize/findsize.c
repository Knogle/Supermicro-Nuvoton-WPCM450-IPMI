#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>
#include <malloc.h>

#include "iniparser.h"


static int  FindSize(char * ini_name, char *SectionName);
static int  FindEraseSize(char * ini_name);
static char CmdSection[256];
static char CmdCfgFile[256];


static
void
UsageHelp(char *Prog)
{
	printf("Usage is %s <Args>\n",Prog);
	printf("Args are :\n");
	printf("\t -C Config File Name\n");
	printf("\t -S JFFS2 Section Name\n");
	printf("\t -E \n");
	printf("\t -H Usage Help\n");
	printf("\n");
}

int 
main(int argc, char * argv[])
{
	int	status;
	char *arg;
	char *ProgName;
	int ret;
	int GetEraseBlock = 0;
	
	/* Skip Program Name */
	ProgName = argv[0];
	argc--;
	argv++;

	/* Initialize with empty values */
	CmdSection[0] = CmdCfgFile[0] = 0;
	
	while (argc--)
	{
		 arg = *argv++;
		 if (*arg != '-')
			exit(1);
		 
		 arg++;
		 switch (*arg)
		 {
			case 'h':
			case 'H':
				UsageHelp(ProgName);
				exit(0);
				break;
			case 'C':
				arg++;
				ret = sscanf(arg,"%s",CmdCfgFile);
				break;
			case 'S':
				arg++;
				ret = sscanf(arg,"%s",CmdSection);
				break;
			case 'E':
				GetEraseBlock = 1;
				break;
			default:
				exit(1);	
		}			 
		if (ret != 1)
			exit(1);	
	}


	if (GetEraseBlock == 1)
	{
		if (CmdCfgFile[0] != 0)
			status = FindEraseSize(CmdCfgFile);
		else
			status = FindEraseSize("genimage.ini");
	}
	else
	{
		if (CmdSection[0] == 0)
		{
			printf("Error: Missing Required -S Option\n");
			exit(1);	
		}
		if (CmdCfgFile[0] != 0)
			status = FindSize(CmdCfgFile,CmdSection);
		else
			status = FindSize("genimage.ini",CmdSection);
	}

	
	return status;
}

int 
FindEraseSize(char* ini_name)
{
	dictionary *d;			/* Dictionary */
	long BlockSize;			/* Size of each Flash Block */

	/*Load the ini File into dictionary*/	
	d = iniparser_load(ini_name);
	if (d==NULL) 
	{
		printf("Error:Cannot parse file [%s]\n", ini_name);
		return 1 ;
	}

	/* Get Block Size */	
	BlockSize = iniparser_getlong(d,"GLOBAL:BlockSize",0);
	if (BlockSize == 0)
	{
		printf("Error: Unable to get Block Size\n");
		iniparser_freedict(d);
		return 1;
	}	
	
	
	printf("%ld\n",BlockSize);
	
	iniparser_freedict(d);
	return 0;
}

int 
FindSize(char* ini_name, char *SecName)
{
	dictionary *d;			/* Dictionary */
	char Key[80];			/* To Form the Key to be passed to ini functions */
	long BlockSize;			/* Size of each Flash Block */
	unsigned long AllocSize;/* Total Allocation Size for this FMH */
	int UseFMH=1;


	/*Load the ini File into dictionary*/	
	d = iniparser_load(ini_name);
	if (d==NULL) 
	{
		printf("Error:Cannot parse file [%s]\n", ini_name);
		return 1 ;
	}

	UseFMH = iniparser_getlong(d,"GLOBAL:FMHEnable",1);

	/* Get Block Size */	
	BlockSize = iniparser_getlong(d,"GLOBAL:BlockSize",0);
	if (BlockSize == 0)
	{
		printf("Error: Unable to get Block Size\n");
		iniparser_freedict(d);
		return 1;
	}	
	
	/* Get Allocation Size */
	sprintf(Key,"%s:Alloc",SecName);
	AllocSize = iniparser_getlong(d,Key,0);
	if (AllocSize == 0)
	{
		printf("Error: Unable to get Allocation Size for %s\n",SecName);
		iniparser_freedict(d);
		return 1;
	}
	
	/* For JFFS/JFFS2, the remove block sise from Allocation Size */
	if (UseFMH)
		printf("%ld\n",AllocSize-BlockSize);
	else
		printf("%ld\n",AllocSize);
	
	iniparser_freedict(d);
	return 0;
}
