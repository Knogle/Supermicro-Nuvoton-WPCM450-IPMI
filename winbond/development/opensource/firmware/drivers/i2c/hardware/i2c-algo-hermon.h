/* ------------------------------------------------------------------------- */
/* 									     */
/* i2c-algo-wb.h - definitions for all wbraday WB526 i2c adapters	         */
/* 									     */
/* ------------------------------------------------------------------------- */
/*   Copyright (C) 2006 American Megatrends Inc.

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.		     */
/* ------------------------------------------------------------------------- */


#ifndef _LINUX_I2C_ALGO_HERMON_H
#define _LINUX_I2C_ALGO_HERMON_H

#define TRANSFERSIZE 1024
#define MAX_FIFO_LEN 4


/* Sensible Dewbults */
#define DEFAULT_SLAVE       ( 0x11 )        /* Controller addr (7-bit) */
#define DEFAULT_TIMEOUT     ( 50 )   //(100)      /* Timeout/delay for bus activities */
#define DEFAULT_RETRIES     ( 3 )           /* Retries on send/receive */
#define DEFAULT_BB_RETRIES  ( 4 )  //(16)        /* Retries to get a free bus */


#define I2C_DATA_REG        ( 0x00 )
#define I2C_STATUS_REG      ( 0x02 )
#define I2C_CON_STATUS_REG     ( 0x04 )
#define I2C_CON1_REG      ( 0x06 )
#define I2C_SLAVE_ADDR1_REG  ( 0x08 )
#define I2C_CON2_REG      ( 0x0A )
#define I2C_SLAVE_ADDR2_REG  ( 0x0C )
#define I2C_CON3_REG      ( 0x0E )


#define WB_SIGNAL_RECEIVED  ( 0xffffffff )
#define BUS_COUNT           ( 6 )

#define I2C_BB (1<<1)

#define I2C_SLVSTP (1<<7)
#define I2C_SDAST  (1<<6)
#define I2C_BER    (1<<5)
#define I2C_NEGACK (1<<4)
#define I2C_STASTR (1<<3)
#define I2C_NMATCH (1<<2)
#define I2C_MASTER (1<<1)
#define I2C_XMIT   (1<<0)





struct i2c_algo_wb_data
{
    u32 ( *read_reg )( int, u32 );
    void ( *write_reg )( int, u32, u32 );
    void ( *reset )( int );
    void ( *set_slave )( int, int );
    u32 ( *wait_for_int )( int );

	int ( *get_recovery_info ) (int, bus_recovery_info_T*);
	int ( *set_recovery_info ) (int, bus_recovery_info_T*);
	
	int (*copy_data) (int Bus, bus_data_info_T*);
	int (*receive_bytes) (int Bus, bus_data_info_T*);
	int (*send_bytes) (int Bus, bus_data_info_T*);
};

int i2c_wb_add_bus( struct i2c_adapter * );
int i2c_wb_del_bus( struct i2c_adapter * );

#define MAX_I2C_MSG_SIZE			(512)
#define I2C_STATE_IDLE				(0)
#define I2C_STATE_SLAVE_SENT		(1)
#define I2C_STATE_DATA_SENT			(2)
#define I2C_STATE_REP_SLAVE_SENT	(3)
#define I2C_STATE_DATA_READ			(4)
#define I2C_STATE_STOP_SENT			(5)

#define I2C_STATE_START_SENT				(6)
#define I2C_STATE_MASTER_RECEIVE				(7)
#define I2C_STATE_START_RECEIVE_BYTES_SENT (8)
#define I2C_STATE_START_SEND_BYTES_SENT (9)



#define I2C_NO_ERROR				(0x00)
#define I2C_NACK_ERROR				(0x01)
#define I2C_AL_ERROR				(0x02)
#define I2C_BUS_ERROR				(0x04)
#define I2C_STOP_ERROR				(0x08)
#define I2C_TO_ERROR				(0x10)
#define I2C_ERROR_UNSPECIFIED		(0xFF)

typedef struct
{
	unsigned char WriteBuf [MAX_I2C_MSG_SIZE];
	int WriteCnt;
	int WriteIx;
	unsigned char ReadBuf [MAX_I2C_MSG_SIZE];
	int ReadCnt;
	int ReadIx;
	int State;
	int Error;
	int Status;
	unsigned char SlaveAddr;
}I2CBuf_T;


struct i2c_hermon_slave_data
{
	unsigned char Linear_SlaveRX_data[TRANSFERSIZE];
	int Linear_SlaveRX_len;
	int Linear_SlaveRX_index;

	unsigned char SlaveRX_data[MAX_FIFO_LEN][TRANSFERSIZE];
	int SlaveRX_len[MAX_FIFO_LEN];
	int SlaveRX_index[MAX_FIFO_LEN];
	
	int SlaveRX_Writer;
	int SlaveRX_Reader;
	int SlaveRX_Entries;
	spinlock_t data_lock;
};



extern I2CBuf_T	gI2CBuf [];

#endif /* _LINUX_I2C_ALGO_WB_H */
