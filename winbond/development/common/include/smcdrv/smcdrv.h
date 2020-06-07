#ifndef __SMCDRV__
#define __SMCDRV__

typedef struct 
{
	u32 reg32;
	u8  bValue;
	u16 wValue;
	u32 dValue;
}  __attribute__((packed)) smcdrv_data_t;

typedef smcdrv_data_t	smcdrv_ioctl_data;

typedef enum {
	GET_MODULE_PROPERTIES,
	ENABLE_PHY,
	READ_REG32,
	WRITE_REG32,
	READ_REG16,
	WRITE_REG16,
	READ_REG8,
	WRITE_REG8,
	GET_ETH0_LINK_STATUS,
	END_OF_FUNC_TABLE	
}eSmcdrvFunc;

#endif // __SMCDRV__
