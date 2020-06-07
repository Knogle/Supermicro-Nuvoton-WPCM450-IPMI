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



//extern struct i2c_hermon_slave_data hermon_slave_data_ptr[BUS_COUNT];

struct i2c_hermon_slave_data hermon_slave_data[BUS_COUNT];
struct i2c_hermon_slave_data *hermon_slave_data_ptr = & hermon_slave_data [0];
EXPORT_SYMBOL(hermon_slave_data_ptr);


static int wb_i2c_recovery( struct i2c_adapter *i2c_adap);

static int wb_init( struct i2c_adapter *i2c_adap )
{
    	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
	int retries = DEFAULT_BB_RETRIES;

	/* Disable the SMB and set SCL frequency*/
	write_reg( i2c_adap->nr, 0x00, I2C_CON2_REG);

	/* Enable the SMB and set SCL frequency*/  //Not sure how to derive but this will put it in 86 KHz
	//write_reg( i2c_adap->nr, 0x31, I2C_CON2_REG);
	//write_reg( i2c_adap->nr, 0x1, I2C_CON3_REG);

	/* Enable the SMB and set SCL frequency*/  //Not sure how to derive but this will put it in 100 KHz
	write_reg( i2c_adap->nr, 0xFB, I2C_CON2_REG);
	write_reg( i2c_adap->nr, 0x00, I2C_CON3_REG);
	
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

#if 0
static int wait_for_int( struct i2c_adapter *i2c_adap )
{
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
    return( adap->wait_for_int( i2c_adap->nr ) );
}
#endif


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

   #if 0 
    /* Wait for interrupt */
    status = wait_for_int( i2c_adap );
    if( !( status & I2C_SLVSTP ) )
    {
        dev_err( &i2c_adap->dev, "wb_stop_bus: Uh-oh, can't stop the bus\n" );
        return( -EREMOTEIO );
    }
	#endif

    return ( 0 );
}

#if 0
static void wb_recover( struct i2c_adapter *i2c_adap )
{
    wb_i2c_recovery(i2c_adap);

     /* Reset the Bus */
    wb_reset( i2c_adap );
}


static int wb_clear_stall_after_start(struct i2c_adapter *i2c_adap)
{
	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
	// Remove the Stall after start bit

	/* Clear STASTR bit */
	write_reg (i2c_adap->nr, read_reg(i2c_adap->nr, I2C_STATUS_REG)|0x08, I2C_STATUS_REG);

	return 0;	
}


static int wb_send_bytes( struct i2c_adapter *i2c_adap,
                          struct i2c_msg msg, int messages_left )
{
	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
	int i;
	int status;
	int last_byte = 0;


	//printk("++++++++ send bytes ++++++++++\n");

	wb_clear_stall_after_start(i2c_adap);
	
	for( i = 0; i < msg.len; i++ )
	{

		/* write to the data register */
		write_reg( i2c_adap->nr, msg.buf[ i ], I2C_DATA_REG );
		/* turn on interrupt */
		write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

		status = wait_for_int( i2c_adap );

		/* Check for signal pending */
		if( status == WB_SIGNAL_RECEIVED )
		{
			wb_stop_bus(i2c_adap);
			dev_info( &i2c_adap->dev, "wb_send_bytes: Signal pending\n" );
			return( -ERESTARTSYS );
		}

		if( status & I2C_NEGACK )
		{
			wb_stop_bus(i2c_adap);
			/* clear NEGACK in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_NEGACK,I2C_STATUS_REG);        
			/* Got NACK */
			dev_err( &i2c_adap->dev, "wb_send_bytes: NACK on data transmission\n" );
			return( -EREMOTEIO );
		}

		if( status & I2C_BER )
		{
			wb_stop_bus(i2c_adap);
			/* clear BER in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);            	/* Got Arbitration Lost */
			dev_err( &i2c_adap->dev, "wb_send_bytes: Arbitration Lost on data transmission\n" );
			return( -EREMOTEIO );
		}

		if( status == 0 )
		{
			wb_stop_bus(i2c_adap);
			dev_err( &i2c_adap->dev, "wb_send_bytes: Timed out on data transmission\n" );
			return( -EREMOTEIO );
		}

		/* Finally, check for Data Transmitted */
		if( !( status & I2C_SDAST ) && (last_byte == 0))
		{
			wb_stop_bus(i2c_adap);
			dev_err( &i2c_adap->dev, "wb_send_bytes: Interrupted for unknown "
				"reason, status is: 0x%08x\n", status );
			return( -EREMOTEIO );
		}
		if( ( i + 1 >= msg.len ) && ( messages_left == 0 ) )
		{
			/* Send the stop after this byte */
			write_reg( i2c_adap->nr, read_reg(i2c_adap->nr, I2C_CON1_REG) | 0x02, I2C_CON1_REG );
			last_byte = 1;
		}	
	}
    return( 0 );
}


static int wb_receive_bytes( struct i2c_adapter *i2c_adap,
                             struct i2c_msg msg, int messages_left )
{
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
    int i;
    int status;
    int last_byte = 0;

	//printk("++++++++ receive bytes ++++++++++\n");
	wb_clear_stall_after_start(i2c_adap);
	/* Clear STASTRE bit */
	write_reg (i2c_adap->nr, read_reg(i2c_adap->nr,I2C_CON1_REG) & 0x7f, I2C_CON1_REG); 		

	/* Receive loop */
	for( i = 0; i < msg.len; i++ )
	{

		if( ( i + 1 >= msg.len ) && ( messages_left == 0 ) )
		{
			/* Send the ACK after this byte */
			write_reg( i2c_adap->nr, read_reg(i2c_adap->nr, I2C_CON1_REG) | 0x10, I2C_CON1_REG );
		}
	
		/* turn on interrupt */
		write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

		/* Wait for interrupt */
		status = wait_for_int( i2c_adap );

		/* Check for signal pending */
		if( status == WB_SIGNAL_RECEIVED )
		{
			wb_stop_bus(i2c_adap);
			dev_info( &i2c_adap->dev, "wb_receive_bytes: Signal pending\n" );
			return( -ERESTARTSYS );
		}
        
		/* Getting a NACK is only an error if this is not
		* the last byte received. */
		if( ( status & I2C_NEGACK ) && !( i + 1 >= msg.len ) )
		{
			wb_stop_bus(i2c_adap);
			/* clear NEGACK in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_NEGACK,I2C_STATUS_REG);
			/* Got NACK on normal byte read */
			dev_err( &i2c_adap->dev, "wb_receive_bytes: Inappropriate NACK on data read\n" );
			return( -EREMOTEIO );
        }

		if( status & I2C_BER )
		{
			wb_stop_bus(i2c_adap);
			/* clear BER in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);
			/* Got Arbitration Lost */
			dev_err( &i2c_adap->dev, "wb_receive_bytes: Arbitration Lost on data read\n" );
			return( -EREMOTEIO );
        }

        if( status == 0 )
        {
			wb_stop_bus(i2c_adap);
			dev_err( &i2c_adap->dev, "wb_receive_bytes: Timed out receiving data\n" );
			dev_err( &i2c_adap->dev, "wb_receive_bytes: Got status: 0x%08x\n", status );
			return( -EREMOTEIO );
		}

		/* Check for data received */
		if( !( status & I2C_SDAST ) && (last_byte == 0))
		{
			wb_stop_bus(i2c_adap);
			dev_err( &i2c_adap->dev, "wb_receive_bytes: Interrupted for unknown "
					"reason (no DT/DR), status is: 0x%08x\n", status );
			return( -EREMOTEIO );
		}
        
		if( ( i + 1 >= msg.len ) && ( messages_left == 0 ) )
		{
			/* Send the stop after this byte */
			write_reg( i2c_adap->nr, read_reg(i2c_adap->nr, I2C_CON1_REG) | 0x02, I2C_CON1_REG );
			last_byte = 1;
		}
		
		/* Read byte into buffer */
		msg.buf[ i ] = read_reg( i2c_adap->nr, I2C_DATA_REG );
	
	}
	return( 0 );
}


static int send_slave_addr( struct i2c_adapter *i2c_adap, int addr, int flags )
{
	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
	u32 status;

	
	//printk("++++++++ send slave address ++++++++++\n");
	/* Check for 10-bit slave addresses (unsupported) */
	if( flags & I2C_M_TEN )
		return( -ENOTTY );

	/* if not clear to send */
	if ((read_reg( i2c_adap->nr, I2C_STATUS_REG)& 0x40) != I2C_SDAST)
		return( -EREMOTEIO );

	/* enable stall after address send */
	write_reg( i2c_adap->nr, 0x80|read_reg(i2c_adap->nr, I2C_CON1_REG), I2C_CON1_REG);

	/* Set target slave address and direction bit */
	if( flags & I2C_M_RD )
		write_reg( i2c_adap->nr, ( addr << 1 ) | 0x01, I2C_DATA_REG );
	else
		write_reg( i2c_adap->nr, ( addr << 1 )&0xfe, I2C_DATA_REG );

	/* turn on interrupt */
//	write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

	udelay(100);

	/* turn on interrupt */
	write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

	
	/* Wait for interrupt */
	status = wait_for_int( i2c_adap );

	/* Check for signal pending */
	if( status == WB_SIGNAL_RECEIVED )
	{
		wb_clear_stall_after_start(i2c_adap);	
		wb_stop_bus(i2c_adap);
		/* Disable interrupt enable */
		write_reg( i2c_adap->nr, (0xFB & read_reg(i2c_adap->nr,I2C_CON1_REG)), I2C_CON1_REG );			
		dev_err( &i2c_adap->dev, "send_slave_addr: Signal pending\n" );
		return( -ERESTARTSYS );
	}

	/* Check for NACK */
	if( status & I2C_NEGACK )
	{

		wb_clear_stall_after_start(i2c_adap);	
		wb_stop_bus(i2c_adap);
		/* clear NEGACK in status reg */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_NEGACK,I2C_STATUS_REG);
		/* Got NACK */
		dev_err( &i2c_adap->dev, "send_slave_addr: NACK on slave address transmission 0x%x\n", addr );
		return( -EREMOTEIO );
	}

	/* Check for lost arbitration */
	if( status & I2C_BER )
	{
		wb_clear_stall_after_start(i2c_adap);	
		wb_stop_bus(i2c_adap);
		/* clear BER in status reg */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);
		/* Got Arbitration Lost */
		dev_err( &i2c_adap->dev, "send_slave_addr: Arbitration lost on slave address transmission\n" );
		return( -EREMOTEIO );
	}

	/* Check for timeout */
	if( status == 0 )
    {
		wb_clear_stall_after_start(i2c_adap);	
		wb_stop_bus(i2c_adap);
		dev_err( &i2c_adap->dev, "send_slave_addr: Timed out sending slave address\n" );
		dev_err( &i2c_adap->dev, "send_slave_addr: Got status: 0x%08x\n", status );
		return( -EREMOTEIO );
	}

	/* Finally, check for Data Transmitted */
	if( !( status & I2C_SDAST ) && !(status & I2C_STASTR))
	{
		wb_clear_stall_after_start(i2c_adap);	
		wb_stop_bus(i2c_adap);
		dev_err( &i2c_adap->dev, "send_slave_addr: No data transmitted!\n" );
		return( -EREMOTEIO );
	}
    
	return( 0 );
}
#endif
static int wb_slave_xfer( struct i2c_adapter *i2c_adap,
                    char *buf, int num )
{

    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
   // int i = 0;
  //  int retval = 0;
	int len = 0;
//	unsigned char reg8;
    //int retries = DEFAULT_BB_RETRIES;
//	uint32_t	status;
	unsigned long flags;
//	volatile uint32_t	temp;
//	unsigned char reg8;


	//printk("++++++++ slave receive ++++++++++\n");

	/* Enable the SMB and set SCL frequency*/
	write_reg( i2c_adap->nr, 0xf1, I2C_CON2_REG);

	/* turn on INTEN NMINTE interrupt */
    write_reg( i2c_adap->nr, 0x44|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

	/* Copy to user space buffer */

	spin_lock_irqsave( &hermon_slave_data[i2c_adap->nr].data_lock, flags);
	if (hermon_slave_data[i2c_adap->nr].slave_stop_flag == 1) 
	{

		memcpy(buf, hermon_slave_data[i2c_adap->nr].SlaveRX_data,hermon_slave_data[i2c_adap->nr].SlaveRX_len);

		len = hermon_slave_data[i2c_adap->nr].SlaveRX_len;
		hermon_slave_data[i2c_adap->nr].slave_stop_flag = 0;
		hermon_slave_data[i2c_adap->nr].SlaveRX_index = 0;
	}

	
	spin_unlock_irqrestore( &hermon_slave_data[i2c_adap->nr].data_lock, flags);

	return (len == MAX_IPMB_MSG_SIZE)? 0:len;

}
	
#if 0
	printk(" 22slave_xfer: sta-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_STATUS_REG));
	printk(" 22slave_xfer: con sta-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_CON_STATUS_REG));
	printk(" 22slave_xfer: con1-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_CON1_REG));
	printk(" 22slave_xfer: con2-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_CON2_REG));
	printk(" 22slave_xfer: con3-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_CON3_REG));
	printk(" 22slave_xfer: addr1-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_SLAVE_ADDR1_REG));
	printk(" 22slave_xfer: addr2-reg = 0x%x\n",read_reg(i2c_adap->nr,I2C_SLAVE_ADDR2_REG));
#endif

#if 0
	while (1)
	{

		/* turn on INTEN NMINTE interrupt */
    		write_reg( i2c_adap->nr, 0x44|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

		/* Wait for slave address match interrupt */
		status = wait_for_int(i2c_adap);
		
		/* Check for signal pending */
		if( status == WB_SIGNAL_RECEIVED )
		{
			dev_info( &i2c_adap->dev, "wb_slave_xfer: Signal pending\n" );
			return( -ERESTARTSYS );
		}
		/* Check for lost arbitration */
		if( status & I2C_BER )
		{
			/* Got Arbitration Lost */
			dev_err( &i2c_adap->dev, "wb_slave_xfer: Arbitration lost on slave address receiving\n" );
			/* clear BER in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);
			return( -EREMOTEIO );
		}
	

		if (0 == status)
		{
			return 0;
		}

		if ( status & I2C_NMATCH)	
		{

			*(buf + i) = read_reg( i2c_adap->nr, I2C_DATA_REG );
			//printk(" 11while buf[%d] = 0x%x\n", i,*(buf + i));
			i++;

			/* clear NMATCH in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_NMATCH,I2C_STATUS_REG);
			break;
		}			
	}


	while (i < MAX_IPMB_MSG_SIZE)
	{
		/* turn on interrupt */
    		write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

		status = wait_for_int(i2c_adap);
		//printk(" 222slave recieive status = 0x%x\n",status);		

	   	/* Check for signal pending */
		if( status == WB_SIGNAL_RECEIVED )
		{
			dev_info( &i2c_adap->dev, "wb_slave_xfer: Signal pending\n" );
			return( -ERESTARTSYS );
		}

		/* Check for lost arbitration */
		if( status & I2C_BER )
		{
			/* Got Arbitration Lost */
			dev_err( &i2c_adap->dev, "wb_slave_xfer: Arbitration lost on slave data receiving \n" );
			/* clear BER in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);
			return( -EREMOTEIO );
		}
	
		
		if (0 == status)
		{
			return -1;
		}

		if (status & I2C_SDAST )
		{
			*(buf + i) = read_reg( i2c_adap->nr, I2C_DATA_REG );
			//printk(" 22while buf[%d] = 0x%x\n", i,*(buf + i));
			i++;
		}
		if (status & I2C_SLVSTP)
		{
			dev_info( &i2c_adap->dev, "wb_slave_xfer: stop condition received\n" );
			/* clear SLVSTP in status reg */
			write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_SLVSTP,I2C_STATUS_REG);
			//printk(" st reg = 0x%x\n", read_reg(i2c_adap->nr, I2C_STATUS_REG));

			retval = i;
			break;
		}

	}
	retval = (i == MAX_IPMB_MSG_SIZE) ? 0 : retval;

	return retval;
}
#endif

#if 1

/* Transfer a series of messages, both sends and receives, with
   repeated starts between the messages */
static int wb_xfer( struct i2c_adapter *i2c_adap,
                    struct i2c_msg *msgs, int num )
{
    struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
    int retval = 0;
    int retries = DEFAULT_BB_RETRIES;
	bus_data_info_T bus_data_info;
	unsigned char reg8;

	unsigned long start_time, end_time;

	start_time = jiffies;

	wb_i2c_recovery (i2c_adap);

#ifdef DEBUG
	printk ("fa_xfer\n");
#endif
	//printk ("fa_xfer Bus No=%d\n",i2c_adap->nr);

	/* clear BER in control status reg */
	write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER, I2C_STATUS_REG);

	/* clear BB */
	write_reg( i2c_adap->nr, 0x02|read_reg(i2c_adap->nr,I2C_CON_STATUS_REG),I2C_CON_STATUS_REG );

	while( ( read_reg( i2c_adap->nr, I2C_CON_STATUS_REG ) & I2C_BB )
				&& ( retries-- > 0 ) )
	{

		dev_warn( &i2c_adap->dev, "wb_xfer: Bus busy %x, %x, %x, \n", read_reg(i2c_adap->nr,I2C_STATUS_REG), read_reg(i2c_adap->nr,I2C_CON_STATUS_REG), read_reg(i2c_adap->nr,I2C_CON1_REG));

		/* clear BER in control status reg */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER, I2C_STATUS_REG);

		/* clear BB in control status reg */
		write_reg(i2c_adap->nr, (read_reg(i2c_adap->nr, I2C_CON_STATUS_REG)|I2C_BB), I2C_CON_STATUS_REG);
		mdelay( i2c_adap->timeout );
		 
	}

    /* If not bus busy, proceed to message handling */
    if( retries <= 0 )
    {
		dev_warn( &i2c_adap->dev, "wb_xfer: Bus busy\n" );
		/* abort data */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|(I2C_STASTR 
					|I2C_NEGACK | I2C_BER), I2C_STATUS_REG);

		/* clear BB in control status reg */
		write_reg(i2c_adap->nr, (read_reg(i2c_adap->nr, I2C_CON_STATUS_REG)|I2C_BB) & 0xFE, I2C_CON_STATUS_REG);

		wb_reset(  i2c_adap );
		return( -EIO );
    }
	/* clear BER and NEGACK */
	write_reg( i2c_adap->nr, 0x30|read_reg(i2c_adap->nr,I2C_STATUS_REG),I2C_STATUS_REG );

	/* clear BB */
	write_reg( i2c_adap->nr, 0x02|read_reg(i2c_adap->nr,I2C_CON_STATUS_REG),I2C_CON_STATUS_REG );

	/* Disable Interrupt Enable */
	reg8 = read_reg( i2c_adap->nr, I2C_CON1_REG );
	reg8 &= 0xFB;
	write_reg( i2c_adap->nr, reg8 ,I2C_CON1_REG );

	bus_data_info.SlaveAddr = msgs [0].addr;
	bus_data_info.WriteCnt  = msgs [0].len;
	memcpy (bus_data_info.WriteBuf, msgs [0].buf, msgs [0].len);
	bus_data_info.ReadCnt = 0;
	if (num > 1)
	{
		bus_data_info.ReadCnt  = msgs [1].len;
	}

	if (0 == copy_data (i2c_adap->nr, &bus_data_info))
	{
		memcpy (msgs [1].buf, bus_data_info.ReadBuf, bus_data_info.ReadCnt);
		retval = num;
	}
	else
	{
		retval = 0;
	}
	end_time = jiffies;
    //printk("Time Taken=%ld", end_time-start_time); 
	return retval;

}

#else


/* Transfer a series of messages, both sends and receives, with
   repeated starts between the messages */
static int wb_xfer( struct i2c_adapter *i2c_adap,
                    struct i2c_msg *msgs, int num )
{
	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;
    	int i= 0,master;
    	int retval = 0;
    	int retries = DEFAULT_BB_RETRIES;
    u32 status;
	int rev_last_byte = 0;
	int send_last_byte = 0;
	unsigned char reg8;

	//uint32_t temp;

#ifdef DEBUG
	printk ("wb_xfer\n");
#endif

	wb_i2c_recovery(i2c_adap);

	/* clear BER in control status reg */
	write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER, I2C_STATUS_REG);

	/* clear BB */
	write_reg( i2c_adap->nr, 0x02|read_reg(i2c_adap->nr,I2C_CON_STATUS_REG),I2C_CON_STATUS_REG );

    	/* Check for bus busy or bus error*/
   	//while(( ( read_reg( i2c_adap->nr, I2C_CON_STATUS_REG ) & I2C_BB ) || read_reg(i2c_adap->nr,I2C_STATUS_REG)& I2C_BER)
	//	&& ( retries-- > 0 ) )
	while( ( read_reg( i2c_adap->nr, I2C_CON_STATUS_REG ) & I2C_BB )
				&& ( retries-- > 0 ) )
	{

		dev_warn( &i2c_adap->dev, "wb_xfer: Bus Error or bus busy %x, %x, %x, \n", read_reg(i2c_adap->nr,I2C_STATUS_REG), read_reg(i2c_adap->nr,I2C_CON_STATUS_REG), read_reg(i2c_adap->nr,I2C_CON1_REG));

		/* clear BER in control status reg */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER, I2C_STATUS_REG);

		/* clear BB in control status reg */
		write_reg(i2c_adap->nr, (read_reg(i2c_adap->nr, I2C_CON_STATUS_REG)|I2C_BB), I2C_CON_STATUS_REG);
		mdelay( i2c_adap->timeout );
		 
	}

	/* If not bus busy, proceed to message handling */
    	if( retries <= 0 )
	{
		dev_warn( &i2c_adap->dev, "wb_xfer: Bus busy, cannot gain bus access\n" );
		/* abort data */
		write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|(I2C_STASTR 
					|I2C_NEGACK | I2C_BER), I2C_STATUS_REG);

		/* clear BB in control status reg */
		write_reg(i2c_adap->nr, (read_reg(i2c_adap->nr, I2C_CON_STATUS_REG)|I2C_BB) & 0xFE, I2C_CON_STATUS_REG);

		wb_reset(  i2c_adap );
		return( -EIO );
	}
	
	/* clear BER and NEGACK */
	write_reg( i2c_adap->nr, 0x30|read_reg(i2c_adap->nr,I2C_STATUS_REG),I2C_STATUS_REG );

	/* clear BB */
	write_reg( i2c_adap->nr, 0x02|read_reg(i2c_adap->nr,I2C_CON_STATUS_REG),I2C_CON_STATUS_REG );

	/* Disable Interrupt Enable */
	reg8 = read_reg( i2c_adap->nr, I2C_CON1_REG );
	reg8 &= 0xFB;
	write_reg( i2c_adap->nr, reg8 ,I2C_CON1_REG );

	/* Turn on START bit */
	write_reg( i2c_adap->nr, 0x01|read_reg(i2c_adap->nr, I2C_CON1_REG) ,I2C_CON1_REG );

	master = 0;
	retries = DEFAULT_BB_RETRIES;
	while( (!master)  && retries)
	{
		if(((read_reg(i2c_adap->nr, I2C_STATUS_REG)&0x02)  == I2C_MASTER) &&
			(read_reg(i2c_adap->nr, I2C_STATUS_REG)&0x40) ==I2C_SDAST)
		{
			master = 1;
		}
		retries--;
		udelay(50);
	}

	if (retries <= 0)
	{
		/* Turn off START bit */
		write_reg( i2c_adap->nr, 0xFE & read_reg(i2c_adap->nr, I2C_CON1_REG) ,I2C_CON1_REG );
		dev_info( &i2c_adap->dev, "wb_send_bytes Unable to issue start \n" );
		return( -ERESTARTSYS );
	}


	/* Loop across all the messages */
	if (num == 1)
	{		
		for (i=0; i<num; i++)
		{
			retval = send_slave_addr( i2c_adap, msgs[ i ].addr, msgs[ i ].flags );
			if( retval < 0 )
			{
				/* Make sure to leave the bus in a happy state */
				wb_recover( i2c_adap );
				continue;
			}

			/* Send or receive the requested bytes */
			if( msgs[ i ].flags & I2C_M_RD )
				retval = wb_receive_bytes( i2c_adap, msgs[ i ], num - ( i + 1 ) );
			else
				retval = wb_send_bytes( i2c_adap, msgs[ i ], num - ( i + 1 ) );

			if( retval < 0 )
			{
				/* Make sure to leave the bus in a happy state */
				wb_recover( i2c_adap );
				return retval;
			}
		}
	}
	if (num == 2) //restart condition
	{
	
		#if 0
		printk(" msgs[0].addr = 0x%x\n",msgs[0].addr );	
		printk(" msgs[1].addr = 0x%x\n",msgs[1].addr );	
		printk(" msgs[0].flags = 0x%x\n",msgs[0].flags );	
		printk(" msgs[1].flags = 0x%x\n",msgs[1].flags );	
		printk(" msgs[0].len= 0x%x\n",msgs[0].len );	
		printk(" msgs[1].len = 0x%x\n",msgs[1].len );	
		#endif

		retval = send_slave_addr( i2c_adap, msgs[ 0 ].addr, msgs[ 0 ].flags );
		if( retval < 0 )
		{
			/* Make sure to leave the bus in a happy state */
			wb_recover( i2c_adap );
			return( -EREMOTEIO );	
		}
			
		wb_clear_stall_after_start(i2c_adap);			

		for( i = 0; i < msgs[0].len; i++ )
		{

			/* write to the data register */
			write_reg( i2c_adap->nr, msgs[0].buf[ i ], I2C_DATA_REG );

			/* turn on interrupt */
			write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );


			/* Wait for interrupt */
			status = wait_for_int( i2c_adap );

			/* Check for signal pending */
			if( status == WB_SIGNAL_RECEIVED )
			{
				wb_stop_bus( i2c_adap );
				/* Disable interrupt enable */
				write_reg( i2c_adap->nr, (0xFB & read_reg(i2c_adap->nr,I2C_CON1_REG)), I2C_CON1_REG );			
				dev_info( &i2c_adap->dev, "wb_send_bytes num 2: Signal pending\n" );
				wb_recover( i2c_adap );				
				return( -ERESTARTSYS );
			}

			if( status & I2C_NEGACK )
			{
				wb_stop_bus( i2c_adap );				
				/* clear NEGACK in status reg */				
				write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_NEGACK,I2C_STATUS_REG);
				/* Got NACK */
				dev_err( &i2c_adap->dev, "wb_send_bytes NUM 2: NACK on data transmission %x, %x\n",  read_reg(i2c_adap->nr, I2C_CON1_REG), read_reg(i2c_adap->nr, I2C_STATUS_REG) );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			if( status & I2C_BER )
			{
				wb_stop_bus( i2c_adap );
				/* clear BER in status reg */
				write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);
				/* Got Arbitration Lost */
				dev_err( &i2c_adap->dev, "wb_send_bytes num 2: Arbitration Lost on data transmission\n" );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			if( status == 0 )
			{
				wb_stop_bus( i2c_adap );
				dev_err( &i2c_adap->dev, "wb_send_bytes: Timed out on data transmission\n" );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			if( ( i + 1 >= msgs[0].len )  )
			{
				send_last_byte = 1;
			}

			/* Finally, check for Data Transmitted */
			if( !( status & I2C_SDAST ) && (send_last_byte == 0))
			{
				wb_stop_bus( i2c_adap );
				dev_err( &i2c_adap->dev, "wb_send_bytes num 2: Interrupted for unknown "
    		  		"reason, status is: 0x%08x\n", status );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			#if 0
			if( ( i + 1 >= msgs[0].len )  )
			{
				/* Send the stop after this byte */
				write_reg( i2c_adap->nr, read_reg(i2c_adap->nr, I2C_CON1_REG) | 0x02, I2C_CON1_REG );
				last_byte = 1;
			}
			#endif	

		}

		/* set START bit in CTL1 register */
	 	write_reg( i2c_adap->nr, 0x01|read_reg(i2c_adap->nr, I2C_CON1_REG) ,I2C_CON1_REG );

		retval = send_slave_addr( i2c_adap, msgs[ 1 ].addr, msgs[ 1 ].flags );
		if (retval < 0)
		{
			/* Make sure to leave the bus in a happy state */
			wb_recover( i2c_adap );
			return( -EREMOTEIO );			
		}

    	
		wb_clear_stall_after_start(i2c_adap);
		/* Clear STASTRE bit */
		write_reg (i2c_adap->nr, read_reg(i2c_adap->nr,I2C_CON1_REG) & 0x7f, I2C_CON1_REG); 	
	

		/* Receive loop */
		for( i = 0; i < msgs[1].len; i++ )
		{

			if( ( i + 1 >= msgs[1].len )  )
			{
		 		/* Send the ACK after this byte */
				write_reg( i2c_adap->nr, read_reg(i2c_adap->nr, I2C_CON1_REG) | 0x10, I2C_CON1_REG );
			}

			/* turn on interrupt */
			write_reg( i2c_adap->nr, 0x04|read_reg(i2c_adap->nr,I2C_CON1_REG), I2C_CON1_REG );

			/* Wait for interrupt */
			status = wait_for_int( i2c_adap );

			/* Check for signal pending */
			if( status == WB_SIGNAL_RECEIVED )
			{
				wb_stop_bus( i2c_adap );
				/* Disable interrupt enable */
				write_reg( i2c_adap->nr, (0xFB & read_reg(i2c_adap->nr,I2C_CON1_REG)), I2C_CON1_REG );			
				dev_info( &i2c_adap->dev, "wb_receive_bytes num 2: Signal pending\n" );
				wb_recover( i2c_adap );				
				return( -ERESTARTSYS );
			}
        
			/* Getting a NACK is only an error if this is not the last byte received */
			if( ( status & I2C_NEGACK ) && !( i + 1 >= msgs[1].len ) )
			{
				wb_stop_bus( i2c_adap );
				/* clear NEGACK in status reg */
				write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_NEGACK,I2C_STATUS_REG);
				/* Got NACK on normal byte read */
				dev_err( &i2c_adap->dev, "wb_receive_bytes num 2: Inappropriate NACK on data read\n" );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			if( status & I2C_BER )
			{
				wb_stop_bus( i2c_adap );
				/* clear BER in status reg */
				write_reg(i2c_adap->nr,read_reg(i2c_adap->nr, I2C_STATUS_REG)|I2C_BER,I2C_STATUS_REG);
				/* Got Arbitration Lost */
				dev_err( &i2c_adap->dev, "wb_receive_bytes num 2: Arbitration Lost on data read\n" );
				wb_recover( i2c_adap );					
				return( -EREMOTEIO );
			}


			if( status == 0 )
			{
				wb_stop_bus( i2c_adap );
				dev_err( &i2c_adap->dev, "wb_receive_bytes num 2: Timed out receiving data\n" );
				dev_err( &i2c_adap->dev, "wb_receive_bytes num 2: Got status: 0x%08x\n", status );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			/* Check for data received */
			if( !( status & I2C_SDAST ) && (rev_last_byte == 0))
			{
				wb_stop_bus( i2c_adap );
				dev_err( &i2c_adap->dev, "wb_receive_bytes num 2: Interrupted for unknown "
				 	"reason (no DT/DR), status is: 0x%08x\n", status );
				wb_recover( i2c_adap );				
				return( -EREMOTEIO );
			}

			// If it is a last byte, set the stop bit, before reading the data from I2C_DATA_REG. 
			if( ( i + 1 >= msgs[1].len )  )
			{
				/* Send the stop after this byte */
				write_reg( i2c_adap->nr, 0x02|read_reg(i2c_adap->nr,I2C_CON1_REG),I2C_CON1_REG );
	   			rev_last_byte = 1;
			}

			/* Read byte into buffer */
			msgs[1].buf[ i ] = read_reg( i2c_adap->nr, I2C_DATA_REG );
			//printk("msgs[1].buf[%d] = 0x%x\n",i,msgs[1].buf[i]);
		}
	return (num);
	}
	return( retval == 0 ? i : retval );
}
#endif
#ifdef I2C_BUS_RECOVERY

#if 0
static int 
wb_create_stop_with_GPIOs (struct i2c_adapter *i2c_adap)
{
	struct i2c_algo_wb_data *adap = i2c_adap->algo_data;

	/* make Data Low */
	write_reg(i2c_adap->nr, WB_DATA_LOW, I2C_CONTROL_REG );
	
	/* make SCL high */
	write_reg(i2c_adap->nr, WB_CLOCK_HIGH, I2C_CONTROL_REG );

	/* make Data High */
	write_reg(i2c_adap->nr, WB_DATA_LOW, I2C_CONTROL_REG );
	
	udelay (5);
	
	return 0;
}
#endif

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
	
	if (SDRStatusCheckTimes ) { return 0; }

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
