/* i2c-algo-wb.c - i2c algorithm code for all Faraday based chips.		     */
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

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/delay.h>
#include <linux/slab.h>
#include <linux/init.h>
#include <linux/errno.h>
#include <linux/interrupt.h>
#include <linux/wait.h>
#include <asm/arch/platform.h>
#include <asm/uaccess.h>
#include <asm/irq.h>


#include "i2c-id.h"
#include "i2c.h"

#include "i2c-algo-hermon.h"

#define RESET_ON_RETRY
#define I2C_BUS_RECOVERY	1

#define write_reg( bus, value, offset ) adap->write_reg( bus, value, offset )
#define read_reg( bus, offset ) adap->read_reg( bus, offset )
#define get_recovery_info(bus, recovery_info) adap->get_recovery_info(bus, recovery_info)
#define set_recovery_info(bus, recovery_info) adap->set_recovery_info(bus, recovery_info)
#define copy_data(bus, bus_data_info) adap->copy_data(bus, bus_data_info)
#define receive_bytes(bus, bus_data_info) adap->receive_bytes(bus, bus_data_info)
#define send_bytes(bus, bus_data_info) adap->send_bytes(bus, bus_data_info)




//extern struct i2c_hermon_slave_data hermon_slave_data_ptr[BUS_COUNT];

struct i2c_hermon_slave_data hermon_slave_data[BUS_COUNT];
struct i2c_hermon_slave_data *hermon_slave_data_ptr = & hermon_slave_data [0];
EXPORT_SYMBOL(hermon_slave_data_ptr);


static int wb_i2c_recovery( struct i2c_adapter *i2c_adap);

static int wb_init( struct i2c_adapter *i2c_adap )
{
    	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
	int retries = DEFAULT_BB_RETRIES;
	unsigned char reg8;

	/* Disable the SMB and set SCL frequency*/
	write_reg( i2c_adap->nr, 0x00, I2C_CON2_REG);

	/* Enable the SMB and set SCL frequency*/  //Not sure how to derive but this will put it in 100 KHz
	write_reg( i2c_adap->nr, 0xFB, I2C_CON2_REG);
	write_reg( i2c_adap->nr, 0x00, I2C_CON3_REG);

	/* enable interrupt enable */
		reg8 = read_reg(i2c_adap->nr,I2C_CON1_REG);
		reg8 |= 0x44;
		write_reg(i2c_adap->nr,reg8,I2C_CON1_REG);

		//printk("wb_init con1-reg = %x\n",read_reg(i2c_adap->nr,I2C_CON1_REG));
	
	/* SMB synchronize with the bus activity */
   	while( ( read_reg( i2c_adap->nr, I2C_CON_STATUS_REG ) & I2C_BB ) && ( retries-- > 0 ) )
	{

		/* clear BER in control status reg */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER, I2C_STATUS_REG);

		/* clear BB */
		write_reg( i2c_adap->nr, 0x02, I2C_CON_STATUS_REG);

       		dev_warn( &i2c_adap->dev, "wb_init:Bus busy1\n" );
		mdelay( i2c_adap->timeout );
	}

    	/* If  bus busy, proceed to message handling */
    	if( retries <= 0 )
    	{
        	dev_warn( &i2c_adap->dev, "wb_init: Bus busy2\n" );
//        	return( -EIO );
			return( 0 );	// joe change it to force to load the i2c bus driver
    	}

    	return( 0 );
}

static void wb_reset( struct i2c_adapter *i2c_adap )
{
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;

    /* Do all the reset work in the adapter driver */
    adap->reset( i2c_adap->nr );
    
    /* Do the init again so we're in a good state */
    wb_init( i2c_adap );
}

 


static int wb_stop_bus( struct i2c_adapter *i2c_adap )
{
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
    int count = 3;


    /* Put a plain old stop on the bus.  This is mostly used to try
     * to get control of a misbehaving bus */
    write_reg( i2c_adap->nr, 0x02|read_reg(i2c_adap->nr, I2C_CON1_REG), I2C_CON1_REG );

	while ((0x02 & read_reg(i2c_adap->nr, I2C_CON1_REG)) && count )
	{
		udelay(50);
		count--;
	}
	
	if (0x02 & read_reg(i2c_adap->nr, I2C_CON1_REG))
	{
		printk(" STOP BIT STILL SET %x %x %x\n",  read_reg(i2c_adap->nr, I2C_CON1_REG), read_reg(i2c_adap->nr, I2C_CON_STATUS_REG), read_reg(i2c_adap->nr, I2C_STATUS_REG));
	} 

    return ( 0 );
}

 
static int wb_slave_xfer( struct i2c_adapter *i2c_adap,
                    char *buf, int num )
{

    
	int len=-1;
	unsigned long flags;
	int FifoPtr;
	
	/* Copy to user space buffer */
   	spin_lock_irqsave( &hermon_slave_data_ptr[i2c_adap->nr ].data_lock , flags);

	if (hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_Entries)
	{
		FifoPtr = hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_Reader;
		len = hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_len[FifoPtr];
		if (len > 0)
		{
			memcpy(buf,hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_data[FifoPtr],len);
			hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_len[FifoPtr] = 0;
		}
		else
		{
			len  = -1;
		}
		if ((++hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_Reader) == MAX_FIFO_LEN)
			hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_Reader = 0;
		hermon_slave_data_ptr[i2c_adap->nr].SlaveRX_Entries--;

	}

   	spin_unlock_irqrestore( &hermon_slave_data_ptr[i2c_adap->nr ].data_lock , flags);
	
	return (len==MAX_IPMB_MSG_SIZE)?0:len;

}
	




/* Transfer a series of messages, both sends and receives, with
   repeated starts between the messages */
static int wb_xfer( struct i2c_adapter *i2c_adap,
                    struct i2c_msg *msgs, int num )
 

{


    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
    int retval = 0;
    //int retries = DEFAULT_BB_RETRIES;
	bus_data_info_T bus_data_info;
	 
#ifdef DEBUG
	printk ("fa_xfer\n");
#endif
	//printk ("#########wb_xfer Bus No=%d\n",i2c_adap->nr);


 
 
	if (num == 1)
		{
			if (msgs[0].flags & I2C_M_RD)
			{
				bus_data_info.SlaveAddr = msgs [0].addr;
				bus_data_info.WriteCnt  = 0;
				bus_data_info.ReadCnt = msgs [0].len;
				if (0 == receive_bytes (i2c_adap->nr, &bus_data_info))
				{
					memcpy (msgs [0].buf, bus_data_info.ReadBuf, bus_data_info.ReadCnt);
					//for ( i= 0; i<bus_data_info.ReadCnt;i++)
						//printk("buf[%d] = %x\n", i, bus_data_info.ReadBuf[i]);
					retval = msgs [0].len;
				}
			}
			else
			{
				bus_data_info.SlaveAddr = msgs [0].addr;
				bus_data_info.WriteCnt  = msgs [0].len;
				memcpy (bus_data_info.WriteBuf, msgs [0].buf, msgs [0].len);
				bus_data_info.ReadCnt = 0;
				if (0 == send_bytes (i2c_adap->nr, &bus_data_info))
					retval = msgs [0].len;
			}
		return retval;
	}
	

	bus_data_info.SlaveAddr = msgs [0].addr;
	bus_data_info.WriteCnt  = msgs [0].len;
	memcpy (bus_data_info.WriteBuf, msgs [0].buf, msgs [0].len); 
	//bus_data_info.ReadCnt = 0;
	if ( num > 1)
	{
		bus_data_info.ReadCnt  = msgs [1].len;

		if (0 == copy_data (i2c_adap->nr, &bus_data_info))
		{
			memcpy (msgs [1].buf, bus_data_info.ReadBuf, bus_data_info.ReadCnt);
			retval = num;
		}
		else
		{
			retval = 0;
		}
	}
		
	 
	return retval;


}



#ifdef I2C_BUS_RECOVERY



static int
wb_disable_i2c_controller (struct i2c_adapter *i2c_adap)
{
	uint32_t temp;

	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;

 	temp = read_reg( i2c_adap->nr, I2C_CON2_REG);
	write_reg(i2c_adap->nr, temp& 0xFE, I2C_CON2_REG );

	return 0;
}


static int
wb_i2c_recovery( struct i2c_adapter *i2c_adap)
{
	//struct i2c_msg	i2c_msg;
	bus_recovery_info_T bus_recovery_info;
	//uint8_t buf [2];
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
	int pulse_period = 5;
	int SDAStatus;
	int SDRStatusCheckTimes = 10;
	bus_data_info_T bus_data_info;

	/*  obtain the user provided Bus recovery information */
	if (0 != (get_recovery_info (i2c_adap->nr,&bus_recovery_info)))	{
		dev_warn( &i2c_adap->dev, "wb_xfer: unable get bus recovery info\n");
		return (-EIO);
	}

	pulse_period = (int) (500000/bus_recovery_info.frequency);
//	printk (KERN_DEBUG "pulse_period = %x\n",pulse_period);

	
	while (SDRStatusCheckTimes)
	{
		/* Test SDA Line */
		SDAStatus = ((read_reg (i2c_adap->nr, I2C_CON_STATUS_REG)) & 0x10);
		if (0 != SDAStatus) { break; }
		else SDRStatusCheckTimes--;
		udelay (10);
	}
	
	// (SDRStatusCheckTimes ) { return 0; }

	if (bus_recovery_info.is_generate_clock_pulses_enabled)
	{ 
	
		dev_info(&i2c_adap->dev, "Generate Ck Pulses...\n");	
//		wb_disable_i2c_controller (i2c_adap);
		/* re-enable SMB to put it in non-addressed Slave mode */
//		write_reg(i2c_adap->nr, 0x11, I2C_CON1_REG);

		/* set START bit to issue a start condition */
//		write_reg(i2c_adap->nr, 0x01, I2C_CON1_REG);

		/* Check if MASTER is set */
		while ( 0x02 != (read_reg(i2c_adap->nr, I2C_STATUS_REG) & 0x02)&& bus_recovery_info.num_clock_pulses > 0)
		{
			bus_recovery_info.num_clock_pulses -= 1;

			/* check the data pin for low */
			if ((0x10) != (read_reg (i2c_adap->nr, I2C_CON_STATUS_REG) & 0x10))
			{ 
		//		dev_info (&i2c_adap->dev, "wb_xfer: clock or/and data pin is pulled low\n");
		//		dev_info (&i2c_adap->dev, "Bus recovery will be performed\n");

				/* issue a single SCL cycle */
				write_reg(i2c_adap->nr, 0x20, I2C_CON_STATUS_REG);

				udelay(5);
				/* check data pin for high */
				if (0x10 == (read_reg (i2c_adap->nr, I2C_CON_STATUS_REG) & 0x10)) 
				{
//					dev_info (&i2c_adap->dev, "I2C Bus Recovered\n");
					/* Clear BB to enable START to be excuted */
					write_reg(i2c_adap->nr, 0x02, I2C_CON_STATUS_REG);
					break;
				}
			}	
		}
		//wb_reset (i2c_adap);

//		wb_init(i2c_adap);
	}
		
	if (bus_recovery_info.is_force_stop_enabled)
	{
		wb_stop_bus( i2c_adap );
		//wb_disable_i2c_controller (i2c_adap);
		/* Generate a stop condition */
		//write_reg(i2c_adap->nr, 0x02, I2C_CON1_REG);
	}
	if (bus_recovery_info.is_smbus_reset_enabled)
	{
//		
#if 0
		dev_info (&i2c_adap->dev,  "Generate SMBUS Reset Command\n");
		i2c_msg.addr   = SMBUS_DEFAULT_ADDRESS;
		i2c_msg.flags  = 0;
		i2c_msg.len    = 1;
		buf [0]        = SMBUS_RESET_CMD;
		i2c_msg.buf = (char *)buf;
		wb_xfer(i2c_adap, &i2c_msg, 1);
#endif		
		bus_data_info.SlaveAddr = SMBUS_DEFAULT_ADDRESS;
		bus_data_info.WriteCnt	= 1;
		bus_data_info.WriteBuf [0] = SMBUS_RESET_CMD;
		bus_data_info.ReadCnt = 0;
		
		if (0 != copy_data (i2c_adap->nr, &bus_data_info))
		{
			printk ("I2C:Unable to send Reset Cmd\n");
		}
	}

	return 0;

}
#endif

/* Return bitfield describing our capabilities */
static u32 wb_func( struct i2c_adapter *adap )
{
    return( I2C_FUNC_I2C | I2C_FUNC_SMBUS_EMUL );
}


/* Algorithm level handling of ioctls and other control commands */
static int wb_control( struct i2c_adapter *i2c_adap, unsigned int cmd,
                       unsigned long arg )
{
#ifdef I2C_EXTENDED_CMDS
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
#endif    
    int retval = 0;

    switch( cmd )
    {
#ifdef I2C_EXTENDED_CMDS
        case I2C_SLAVEREAD:
            /* Unsupported (for now) */
            retval = -ENOTTY;
            break;

        case I2C_SLAVEWRITE:
            /* Unsupported (for now) */
            retval = -ENOTTY;
            break;

        case I2C_SET_HOST_ADDR:
            adap->set_slave( i2c_adap->nr, arg );
            break;

        case I2C_GET_HOST_ADDR:
            retval = read_reg( i2c_adap->nr, I2C_SLAVE_ADDR1_REG );
            break;

        case I2C_RESET:
            /* Reset the controller */
            wb_reset( i2c_adap );
            break;

        case I2C_GETREG:
            /* Get i2c register content where arg is the offset of i2c reg*/
            retval = read_reg( i2c_adap->nr, arg );
            break;

        case I2C_SETREG:
            /* Get i2c register content where arg is the offset of i2c reg*/
            write_reg( i2c_adap->nr, (arg & 0x00ff), (arg & 0xff00)>>8);
            break;


#ifdef I2C_BUS_RECOVERY
		case I2C_SET_REC_INFO:
		{
			bus_recovery_info_T	bus_recovery_info;

			if (copy_from_user(&bus_recovery_info, (void*)arg, sizeof(bus_recovery_info_T))) return -EFAULT;
			if (0 != set_recovery_info (i2c_adap->nr, &bus_recovery_info)) {
				dev_err (&i2c_adap->dev, "wb_cntrl:set rec info failed\n");
			}
			break;
		}
		case I2C_GET_REC_INFO:
		{
			bus_recovery_info_T	bus_recovery_info;
			printk ("chk1\n");
			if (0 != get_recovery_info (i2c_adap->nr, &bus_recovery_info)) {
				dev_err (&i2c_adap->dev, "wb_cntrl: get rec info failed\n");
			}
			if (copy_to_user((void*)arg, &bus_recovery_info, sizeof(bus_recovery_info_T))) return -EFAULT;
			break;
		}

		case I2C_CLOCK_OUT_DATA_PIN:
		{
			bus_recovery_info_T bus_recovery_info;
			//int pulse_period =5;

			if ((0x10) != (read_reg (i2c_adap->nr, I2C_CON_STATUS_REG) & 0x10)) 
			{
		//		dev_info (&i2c_adap->dev, "wb_xfer: clock or/and data pin is pulled low\n");
		//		dev_info (&i2c_adap->dev, "Bus recovery will be performed\n");
				if (0 != (get_recovery_info (i2c_adap->nr,&bus_recovery_info)))	
				{
					dev_warn( &i2c_adap->dev, "wb_xfer:unable get bus rec info\n");
					return (-EIO);
				}
				if (bus_recovery_info.is_generate_clock_pulses_enabled)
				{ 
	
					dev_info(&i2c_adap->dev, "Generate Clk Pulses\n");	
					wb_disable_i2c_controller (i2c_adap);
					/* re-enable SMB to put it in non-addressed Slave mode */
					write_reg(i2c_adap->nr, 0x11, I2C_CON1_REG);

					/* set START bit to issue a start condition */
					write_reg(i2c_adap->nr, 0x01, I2C_CON1_REG);

					/* Check if MASTER is set */
					while ( 0x02 != (read_reg(i2c_adap->nr, I2C_STATUS_REG) & 0x02)&& bus_recovery_info.num_clock_pulses > 0)
					{
						bus_recovery_info.num_clock_pulses -= 1;
						/* check the data pin for low */
						if ((0x10) != (read_reg (i2c_adap->nr, I2C_CON_STATUS_REG) & 0x10)) 
						{
		//					dev_info (&i2c_adap->dev, "wb_xfer: clock or/and data pin is pulled low\n");
		//					dev_info (&i2c_adap->dev, "Bus recovery will be performed\n");

							/* issue a single SCL cycle */
							write_reg(i2c_adap->nr, 0x20, I2C_CON_STATUS_REG);

							/* check data pin for high */
							if (0x10 == (read_reg (i2c_adap->nr, I2C_CON_STATUS_REG) & 0x10)) 
							{
//								dev_info (&i2c_adap->dev, "I2C Bus Recovered\n");
								/* Clear BB to enable START to be excuted */
								write_reg(i2c_adap->nr, 0x02, I2C_CON_STATUS_REG);
								break;
							}
						}
					}
				}
			
			
			}
		}
#endif /* I2C_BUS_RECOVERY */
#endif /* I2C_EXTENDED_CMDS */
        default:
            dev_err( &i2c_adap->dev, "algo_cntrl:Unknown cmd\n" );
            retval = -ENOTTY;
    	}

    return( retval );
}


/* -----exported algorithm data: -------------------------------------    */

static struct i2c_algorithm wb_algo =
{
    .master_xfer = wb_xfer,
    .functionality = wb_func,
    .algo_control = wb_control,
	.slave_recv = wb_slave_xfer,
#ifdef I2C_BUS_RECOVERY
	.i2c_recovery = wb_i2c_recovery,
#endif
};

int i2c_wb_add_bus( struct i2c_adapter *i2c_adap )
{
    int retval;

    /* Register new adapter */
    i2c_adap->algo = &wb_algo;

    /* Set some sensible dewbults */
    i2c_adap->timeout = DEFAULT_TIMEOUT;
    i2c_adap->retries = DEFAULT_RETRIES;

    /* Initialize the adapter */
    retval = wb_init( i2c_adap );
    if( !retval )
    {
        i2c_add_adapter( i2c_adap );
        dev_info( &i2c_adap->dev, "Hardware routines registered\n" );
    }
    else
        printk( KERN_ERR "Adapter initialization failed\n" );
    
    return( retval );
}


int i2c_wb_del_bus( struct i2c_adapter *i2c_adap )
{
    return( i2c_del_adapter( i2c_adap ) );
}


EXPORT_SYMBOL( i2c_wb_add_bus );
EXPORT_SYMBOL( i2c_wb_del_bus );

MODULE_AUTHOR( "Andrew McCallum <andrewm@ami.com>" );
MODULE_DESCRIPTION( "Winbond I2C Algorithm" );
MODULE_LICENSE( "GPL" );
