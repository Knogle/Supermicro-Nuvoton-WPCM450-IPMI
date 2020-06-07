#ifndef __SOLSSH_H_
#define __SOLSSH_H_


typedef enum
{
	None_Parity,
	Odd_Parity,
	Even_Parity
} PARITY_TYPE;

typedef enum
{
	None_FlowControl,
	XonXoff_FlowControl,
	Hardware_FlowControl
} FLOW_CONTROL_TYPE;

#define SOL_FIELD_MAX_LENGTH	16
typedef struct
{
	unsigned long BaudRate;
	unsigned char  DataBits;
	PARITY_TYPE Parity;
	unsigned char StopBits;
	FLOW_CONTROL_TYPE FlowControl;
	unsigned char NewLine;
} SOLCFG_STRUCT;

int GetSOLCfg(SOLCFG_STRUCT *cfg);
int SetSOLCfg(SOLCFG_STRUCT *cfg);


#define SOLCFG_FILE	"/etc/solcfg.conf"

#endif
