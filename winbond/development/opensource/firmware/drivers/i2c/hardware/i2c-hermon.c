/* i2c-algo-wb.c - i2c adapter code for the HERMON100.		     */
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
#include <linux/interrupt.h>
#include <linux/wait.h>
#include <asm/arch/platform.h>
#include <asm/io.h>
#include <asm/irq.h>
#include <linux/version.h>

#include "i2c-id.h"
#include "i2c.h"
#include "i2c-algo-hermon.h"
#include <asm/soc-wpcm450/hwmap.h>

#define I2C_BUS_RECOVERY	1

#define HERMON_I2C_REGS_SIZE  ( 0x100 )
//#define BUS_COUNT           ( 6 )
#define I2C_ID              ( 1 )
#define HERMON_WAIT_TIMEOUT   ( 3 )
#define DEFAULT_SLAVE_0     ( 0x10 )
#define DEFAULT_SLAVE_1     ( 0x10 )
#define DEFAULT_SLAVE_2     ( 0x10 )
#define DEFAULT_SLAVE_3     ( 0x10 )
#define DEFAULT_SLAVE_4     ( 0x10 )
#define DEFAULT_SLAVE_5     ( 0x10 )



#ifdef I2C_BUS_RECOVERY

#define DEFAULT_NUM_PULSES		32
#define DEFAULT_PULSE_PERIOD	5
#define DEFAULT_FREQ			100000
#define ENABLE_SMBUS_RESET		1
#define DISABLE_SMBUS_RESET		0
#define ENABLE_CLOCK_PULSE		1
#define DISABLE_CLOCK_PULSE		0
#define ENABLE_FORCE_STOP		1
#define DISABLE_FORCE_STOP		0

#endif

/* Driver wide variables */

/* Spin locks used to control access to the op_status variables */
static spinlock_t status_lock[ BUS_COUNT ];

/* Last status of each bus read from the interrupt handler */
//static volatile u32 op_status[ BUS_COUNT ];

/* Wait queues for waiting on the interrupt handler */
static wait_queue_head_t hermon_wait[ BUS_COUNT ];
static struct i2c_adapter wb_hermon_ops[ BUS_COUNT ];

static void *i2c_hermon_io_base[ BUS_COUNT ];
static int wait_timeout = HERMON_WAIT_TIMEOUT;
static int poll_delay = 100;
static int polled = 0;
//static int polled = 1;

/** Dewbult values in these arrays are for the HERMON100 **/
static u32 raw_io_base[ BUS_COUNT ] =
{
#if (BUS_COUNT >= 1)
    WPCM_I2C_0_BASE,
#endif
#if (BUS_COUNT >= 2)
    WPCM_I2C_1_BASE,
#endif
#if (BUS_COUNT >= 3)
    WPCM_I2C_2_BASE,
#endif
#if (BUS_COUNT >= 4)
    WPCM_I2C_3_BASE,
#endif
#if (BUS_COUNT >= 5)
    WPCM_I2C_4_BASE,
#endif
#if (BUS_COUNT >= 6)
    WPCM_I2C_5_BASE,
#endif
};

static int irq[ BUS_COUNT ] =
{
#if (BUS_COUNT>= 1)
	IRQ_I2C_0_1_2,
#endif
#if (BUS_COUNT>= 2)
	IRQ_I2C_0_1_2,
#endif
#if (BUS_COUNT>= 3)
	IRQ_I2C_0_1_2,
#endif
#if (BUS_COUNT>= 4)
	IRQ_I2C_3,
#endif
#if (BUS_COUNT>= 5)
	IRQ_I2C_4,
#endif
#if (BUS_COUNT>= 6)
	IRQ_I2C_5,
#endif
};

static int slave_addr[ BUS_COUNT ] =
{
#if (BUS_COUNT >= 1)
	DEFAULT_SLAVE_0,
#endif
#if (BUS_COUNT >= 2)
	DEFAULT_SLAVE_1,
#endif
#if (BUS_COUNT >= 3)
	DEFAULT_SLAVE_2,
#endif
#if (BUS_COUNT >= 4)
	DEFAULT_SLAVE_3,
#endif
#if (BUS_COUNT >= 5)
	DEFAULT_SLAVE_4,
#endif
#if (BUS_COUNT >= 6)
	DEFAULT_SLAVE_5,
#endif
};
static int step [BUS_COUNT];

#ifdef I2C_BUS_RECOVERY
static bus_recovery_info_T m_bus_recovery_info [BUS_COUNT] =
{
#if (BUS_COUNT >= 1)
	{ DISABLE_SMBUS_RESET, ENABLE_CLOCK_PULSE, DISABLE_FORCE_STOP, DEFAULT_NUM_PULSES,DEFAULT_FREQ },
#endif
#if (BUS_COUNT >= 2)
	{ DISABLE_SMBUS_RESET, ENABLE_CLOCK_PULSE, DISABLE_FORCE_STOP, DEFAULT_NUM_PULSES,DEFAULT_FREQ },
#endif
#if (BUS_COUNT >= 3)
	{ DISABLE_SMBUS_RESET, ENABLE_CLOCK_PULSE, DISABLE_FORCE_STOP, DEFAULT_NUM_PULSES,DEFAULT_FREQ },
#endif
#if (BUS_COUNT >= 4)
	{ DISABLE_SMBUS_RESET, ENABLE_CLOCK_PULSE, DISABLE_FORCE_STOP, DEFAULT_NUM_PULSES,DEFAULT_FREQ },
#endif
#if (BUS_COUNT >= 5)
	{ DISABLE_SMBUS_RESET, ENABLE_CLOCK_PULSE, DISABLE_FORCE_STOP, DEFAULT_NUM_PULSES,DEFAULT_FREQ },
#endif
#if (BUS_COUNT >= 6)
	{ DISABLE_SMBUS_RESET, ENABLE_CLOCK_PULSE, DISABLE_FORCE_STOP, DEFAULT_NUM_PULSES,DEFAULT_FREQ },
#endif
};
#endif

static int bus_count = BUS_COUNT;
module_param_array( slave_addr, int, &bus_count, S_IRUGO );
MODULE_PARM_DESC( slave_addr, "Slave addresses of the busses this driver controls."
                  "  Separate the slave addresses with commas" );
module_param_array( raw_io_base, ulong, &bus_count, S_IRUGO );
MODULE_PARM_DESC( raw_io_base, "I/O base addresses of the busses this driver controls."
                  "  Separate the I/O base addresses with commas" );
module_param_array( irq, int, &bus_count, S_IRUGO );
MODULE_PARM_DESC( irq, "IRQs of the busses this driver controls."
                  "  Separate the IRQs with commas" );
module_param( wait_timeout, int, S_IRUGO );
MODULE_PARM_DESC( wait_timeout, "Seconds to wait before giving up waiting for an interrupt" );
module_param( poll_delay, int, S_IRUGO );
MODULE_PARM_DESC( poll_delay, "Delay in microseconds between polls in polled mode" );
module_param( polled, bool, S_IRUGO );
MODULE_PARM_DESC( polled, "Set 1 to run the driver in polled mode" );

/* Forward declarations */
static int init_irq_123(void);
static int init_irq(void);
static void remove_irq_123(void);
static void remove_irq(void);

static void i2c_hermon_reset( int bus );
static void i2c_hermon_set_slave( int bus, int slave );
static void i2c_hermon_exit( void );
static u32 i2c_hermon_read_reg( int bus, u32 offset );
static void i2c_hermon_write_reg( int bus, u32 value, u32 offset );
#if (LINUX_VERSION_CODE >=  KERNEL_VERSION(2,6,24))
static irqreturn_t hermon_handler( int this_irq, void *dev_id);
#else
static irqreturn_t hermon_handler( int this_irq, void *dev_id,
                                struct pt_regs *regs );
#endif
static u32 i2c_hermon_wait_for_int( int bus );
#ifdef I2C_BUS_RECOVERY
static int i2c_hermon_get_recovery_info (int bus, bus_recovery_info_T* info);
static int i2c_hermon_set_recovery_info (int bus, bus_recovery_info_T* info);
#endif

static int i2c_hermon_copy_data (int bus, bus_data_info_T* info);
void i2c_hermon_init_interanl_slave_data (int bus);
static int i2cRX_slave_process(int bus);

static int i2c_hermon_receive_bytes (int bus, bus_data_info_T* info);
static int i2c_hermon_send_bytes (int bus, bus_data_info_T* info);
static int i2cRXFULL_slave_process(int bus,u8 data);
static void i2cSTOPDET_slave_process(int bus);





I2CBuf_T	gI2CBuf [BUS_COUNT];

//struct i2c_hermon_slave_data hermon_slave_data_ptr[BUS_COUNT];
extern struct i2c_hermon_slave_data *hermon_slave_data_ptr;


static struct i2c_algo_wb_data wb_hermon_data =
{
    .read_reg       = i2c_hermon_read_reg,
    .write_reg      = i2c_hermon_write_reg,
    .reset          = i2c_hermon_reset,
    .set_slave      = i2c_hermon_set_slave,
    .wait_for_int   = i2c_hermon_wait_for_int,
#ifdef I2C_BUS_RECOVERY
	.get_recovery_info = i2c_hermon_get_recovery_info,
	.set_recovery_info = i2c_hermon_set_recovery_info,
#endif
	.copy_data		 = i2c_hermon_copy_data,
	.receive_bytes = i2c_hermon_receive_bytes,
	.send_bytes = i2c_hermon_send_bytes ,

};

#ifdef DEBUG
static void
display_registers (int bus)
{
  
	printk ("   I2C_CONTROL1_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_CON1_REG));
	printk ("   I2C_CONTROL2_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_CON2_REG));
	printk ("    I2C_STATUS_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_STATUS_REG));
	printk ("    I2C_CONTROL_STATUS_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_CON_STATUS_REG));
	//printk ("      I2C_DATA_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_DATA_REG));
	//printk ("I2C_SLAVE_ADDR1_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_SLAVE_ADDR1_REG));
	//printk ("I2C_SLAVE_ADDR2_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_SLAVE_ADDR2_REG));
	//printk ("     I2C_SETUP_REG of Bus%d = 0x%x\n", bus, wb_hermon_data.read_reg(bus, I2C_CON3_REG));

}
#endif

static int init_irq_123(void)
{
	

            /* Request irq */
	if (bus_count == 1)
	{
        	if( request_irq( irq[ 0 ], hermon_handler, 0, "i2c_hermon", NULL ) < 0 )
            	{
                	printk( KERN_ERR "Request for irq %d failed\n", irq[ 0 ] );
                	release_mem_region( raw_io_base[ 0 ], HERMON_I2C_REGS_SIZE );
                	iounmap( i2c_hermon_io_base[0 ] );
                	i2c_hermon_io_base[ 0 ] = NULL;
                	return( -ENODEV );
            	}
	}

	if (bus_count == 2)
	{
        	if( request_irq( irq[ 0 ], hermon_handler, 0, "i2c_hermon", NULL ) < 0 )
            	{
                	printk( KERN_ERR "Request for irq %d and %d failed\n", irq[ 0 ],irq[1] );
                	release_mem_region( raw_io_base[ 0 ], HERMON_I2C_REGS_SIZE );
                	release_mem_region( raw_io_base[ 1 ], HERMON_I2C_REGS_SIZE );
                	iounmap( i2c_hermon_io_base[0 ] );
                	iounmap( i2c_hermon_io_base[1 ] );
                	i2c_hermon_io_base[ 0 ] = NULL;
                	i2c_hermon_io_base[ 1 ] = NULL;
                	return( -ENODEV );
            	}
	}

	if (bus_count >= 3)
	{
	#if (LINUX_VERSION_CODE >=  KERNEL_VERSION(2,6,24))
        	if( request_irq( irq[ 0 ], hermon_handler, IRQF_DISABLED, "i2c_hermon", NULL ) < 0 )
	#else			
		if( request_irq( irq[ 0 ], hermon_handler, SA_INTERRUPT, "i2c_hermon", NULL ) < 0 )
	#endif			
            	{
                	printk( KERN_ERR "Request for irq %d and %d and %d failed\n", irq[ 0 ],irq[1],irq[2] );
                	release_mem_region( raw_io_base[ 0 ], HERMON_I2C_REGS_SIZE );
                	release_mem_region( raw_io_base[ 1 ], HERMON_I2C_REGS_SIZE );
                	release_mem_region( raw_io_base[ 2 ], HERMON_I2C_REGS_SIZE );
                	iounmap( i2c_hermon_io_base[0 ] );
                	iounmap( i2c_hermon_io_base[1 ] );
                	iounmap( i2c_hermon_io_base[2 ] );
                	i2c_hermon_io_base[ 0 ] = NULL;
                	i2c_hermon_io_base[ 1 ] = NULL;
                	i2c_hermon_io_base[ 2 ] = NULL;
                	return( -ENODEV );
            	}
	}
	return 0;
}

static int init_irq(void)
{
	
    int i;
	
	//	return 0;
        /* No need to request irqs in polled mode */
    if( !polled )
    {

	if (bus_count <= 3)
		init_irq_123();
	if (bus_count >= 4)			
	{
		init_irq_123();
		for (i=3; i<bus_count; i++)
#if (LINUX_VERSION_CODE >=  KERNEL_VERSION(2,6,24))
        	if( request_irq( irq[ i ], hermon_handler, IRQF_DISABLED, "i2c-hermon", NULL ) < 0 )
#else				
        	if( request_irq( irq[ i ], hermon_handler, SA_INTERRUPT, "i2c-hermon", NULL ) < 0 )
#endif				
            	{
                	printk( KERN_ERR "Request for irq %d failed\n", irq[ i ] );
                	release_mem_region( raw_io_base[ i ], HERMON_I2C_REGS_SIZE );
                	iounmap( i2c_hermon_io_base[ i ] );
                	i2c_hermon_io_base[ i ] = NULL;
             	return( -ENODEV );
            	}
	}
   }

	return 0;
}

void i2c_hermon_init_interanl_slave_data (int bus)
{
	/* Initialize locks, and variables */
	int i;
	
	spin_lock_init( & hermon_slave_data_ptr[bus].data_lock);
	hermon_slave_data_ptr[bus].Linear_SlaveRX_len = 0;
	hermon_slave_data_ptr[bus].Linear_SlaveRX_index = 0;

	for(i=0;i<MAX_FIFO_LEN;i++)
	{
		hermon_slave_data_ptr[bus].SlaveRX_len[i] = 0;
		hermon_slave_data_ptr[bus].SlaveRX_index[i] = 0;
	}
	hermon_slave_data_ptr[bus].SlaveRX_Writer = 0;
	hermon_slave_data_ptr[bus].SlaveRX_Reader = 0;
	hermon_slave_data_ptr[bus].SlaveRX_Entries = 0;
	
}

static int __init i2c_hermon_init( void )
{
    int i;
	//unsigned int reg32;
	unsigned long reg32;
    //uint32_t rev_info, feature_info;
    
	for (i = 0; i< bus_count; i++ )
			i2c_hermon_init_interanl_slave_data(i);
	

	init_irq();

	
    for( i = 0; i < bus_count; i++ )
    {
        /* Initialize locks, queues and variables */
        spin_lock_init( &status_lock[ i ] );
        init_waitqueue_head( &hermon_wait[ i ] ); 
        //op_status[ i ] = 0;

        /* Set up i2c_adapter structs */
        wb_hermon_ops[ i ].owner = THIS_MODULE;
        wb_hermon_ops[ i ].class = I2C_CLASS_HWMON;
        wb_hermon_ops[ i ].id = I2C_ID;
        wb_hermon_ops[ i ].algo_data = &wb_hermon_data;
	wb_hermon_ops[ i ].nr = i;
        sprintf( wb_hermon_ops[ i ].name, "i2c-hermon-%d", i );
            
        /* Map I/O memory */
        if( request_mem_region( raw_io_base[ i ], HERMON_I2C_REGS_SIZE, "i2c-hermon" ) != NULL )
            i2c_hermon_io_base[ i ] = ioremap( raw_io_base[ i ], HERMON_I2C_REGS_SIZE );
        else
        {
            //release_mem_region( raw_io_base[ i ], HERMON_I2C_REGS_SIZE );
            i2c_hermon_io_base[ i ] = NULL;
        }

        /* Make sure we actually mapped memory */
        if( i2c_hermon_io_base[ i ] == NULL )
        {
            printk( KERN_ERR "Cannot map I/O memory for bus: %d\n", i );
            return( -ENODEV );
        }

	/* Set Muxing to SMBus pins */
	reg32 = *(unsigned long*)(WPCM_GCR_VA_BASE + 0x0C);
	*( unsigned long* )(WPCM_GCR_VA_BASE +0x0C) = reg32 |0x000001C7;
	
	//printk("MFL1 = 0x%lx\n", *(unsigned long *)(WPCM_GCR_VA_BASE + 0x0C));	

	/* Clear all interrupts */
	*( unsigned long *)(WPCM_AIC_VA_BASE + 0x12C) = 0xFFFFFFFF;

	/* Diable all interrupts */
	*( unsigned long *)(WPCM_AIC_VA_BASE + 0x124) = 0xFFFFFFFE;

	/* Enable SMB interrupts */
	reg32 = *(unsigned long *)(WPCM_AIC_VA_BASE + 0x120);
	*( unsigned long *)(WPCM_AIC_VA_BASE + 0x120) = reg32 | 0x2C800000;


	/* Interrupt Group Enable for SMB channel 0,1,2 */
	reg32 = *(unsigned long*)(WPCM_AIC_VA_BASE + 0x0084);
	*( unsigned long* )(WPCM_AIC_VA_BASE +0x84) = reg32 |0x4C000000;

	//printk("reg12C = 0x%lx\n", *(unsigned long *)(WPCM_AIC_VA_BASE + 0x12C));	
	//printk("reg124 = 0x%lx\n", *(unsigned long *)(WPCM_AIC_VA_BASE + 0x124));	
	//printk("reg120 = 0x%lx\n", *(unsigned long *)(WPCM_AIC_VA_BASE + 0x120));	
	//printk("group = 0x%lx\n", *(unsigned long *)(WPCM_AIC_VA_BASE + 0x84));	

	i2c_hermon_reset( i );
	
    /* Set the default slave address */
      i2c_hermon_write_reg( i, slave_addr[ i ], I2C_SLAVE_ADDR1_REG );


    /* Add the bus via the algorithm code */
     if( i2c_wb_add_bus( &wb_hermon_ops[ i ] ) != 0 )
     {
         printk( KERN_ERR "Cannot add bus %d to algorithm layer\n", i );
          return( -ENODEV );
     }
	printk( KERN_INFO "Registered bus id: %s\n", wb_hermon_ops[ i ].dev.bus_id );
#ifdef DEBUG
	display_registers (i);
#endif
    }
    
    return( 0 );
}


static void i2c_hermon_reset( int bus )
{

	//unsigned long flags = 0;
	unsigned char reg8;

   	 
	/*Disable the SMB module */
	reg8 = i2c_hermon_read_reg(bus,I2C_CON2_REG);
	reg8 &= 0xfe;
	i2c_hermon_write_reg(bus,reg8,I2C_CON2_REG);


	/* Disable slave address */
	reg8 = i2c_hermon_read_reg(bus,I2C_SLAVE_ADDR1_REG);
//	reg8 &= 0xef;
	reg8 &= 0x7f;
	i2c_hermon_write_reg(bus,reg8,I2C_SLAVE_ADDR1_REG);
	
	/* Enable the SMB module */
	reg8 = i2c_hermon_read_reg(bus,I2C_CON2_REG);
	reg8 |= 0xf1;
	i2c_hermon_write_reg(bus,reg8,I2C_CON2_REG);
	
	
	/* Issue STOP event */
	reg8 = i2c_hermon_read_reg(bus,I2C_CON1_REG);
	reg8 |= 0x02;
	i2c_hermon_write_reg(bus,reg8,I2C_CON1_REG);
		

	/* Set the slave address and Slave address Enable again */
//	i2c_hermon_write_reg( bus, slave_addr[bus], I2C_SLAVE_ADDR1_REG );
	i2c_hermon_write_reg( bus, 0x80 | (slave_addr[bus] >> 1), I2C_SLAVE_ADDR1_REG );
//	printk("slave addr=%x\n", 0x80 | (slave_addr[bus] >> 1));

#if 0
    /* Reinitialize spin locks, variables, and wait queues */
    spin_lock_init( &status_lock[ bus ] );
    spin_lock_irqsave( &status_lock[ bus ], flags );
    op_status[ bus ] = 0;
    spin_unlock_irqrestore( &status_lock[ bus ], flags );
#endif	



    init_waitqueue_head( &hermon_wait[ bus ] );

	i2c_hermon_init_interanl_slave_data(bus);

	
 	
	printk("I2C Reset \n");
    return;

}

#if 0
static int
i2c_hermon_reinit (int BusNum)
{
	
	unsigned char reg8;
	
	/* Disable the SMB and set SCL frequency*/
	i2c_hermon_write_reg( BusNum, 0x00, I2C_CON2_REG);

	/* Enable the SMB and set SCL frequency*/  //Not sure how to derive but this will put it in 86 KHz
	i2c_hermon_write_reg( BusNum, 0xfb, I2C_CON2_REG);
	i2c_hermon_write_reg( BusNum, 0x00, I2C_CON3_REG);

	
	/* enable interrupt enable */
	reg8 = i2c_hermon_read_reg(BusNum,I2C_CON1_REG);
	reg8 |= 0x44;
	i2c_hermon_write_reg(BusNum,reg8,I2C_CON1_REG);
	
	return 0;

}
#endif

static void i2c_hermon_set_slave( int bus, int slave )
{
    /* Save the slave address for future uses */
    //slave_addr[ bus ] = slave >> 1;
    slave_addr[ bus ] = slave ;

	/* Slave address enable and address*/
    i2c_hermon_write_reg( bus, 0x80 | (slave >> 1), I2C_SLAVE_ADDR1_REG );
    //i2c_hermon_write_reg( bus, 0x80 |slave , I2C_SLAVE_ADDR1_REG );
}


static void remove_irq_123(void)
{
//	disable_irq(irq[0]);
	free_irq(irq[0],NULL);

	return;
}


static void remove_irq(void)
{
	int i;
//   		return; 
        if( !polled )
        {
		if (bus_count <= 3)
			remove_irq_123();
		if (bus_count >= 4)	
		{
			remove_irq_123();

            		/* Disable the irq */
			for (i=3; i<bus_count; i++)
			{
            		//	disable_irq( irq[ i ] );
            			free_irq( irq[ i ], NULL );
			}
        	}
	}

	return;
}

static void i2c_hermon_exit( void )
{
    int i;

	remove_irq();

    for( i = 0; i < bus_count; i++ )
    {
        i2c_wb_del_bus( &wb_hermon_ops[ i ] );

        /* Unmap memory region */
        iounmap( i2c_hermon_io_base[ i ] );
        release_mem_region( raw_io_base[ i ], HERMON_I2C_REGS_SIZE );
#if 0
        if( !polled )
        {
            /* Disable the irq */
            disable_irq( irq[ i ] );
            free_irq( irq[ i ], NULL );
        }
#endif

    }
}

#ifdef I2C_BUS_RECOVERY
static int
i2c_hermon_set_recovery_info (int bus, bus_recovery_info_T* info)
{
	if (bus >= BUS_COUNT) return -1;
	memcpy (&m_bus_recovery_info [bus], info, sizeof (bus_recovery_info_T));
#if 0
	printk (KERN_DEBUG "is_smbus_reset_enabled           = %x\n", info->is_smbus_reset_enabled);
	printk (KERN_DEBUG "is_generate_clock_pulses_enabled = %x\n", info->is_generate_clock_pulses_enabled);
	printk (KERN_DEBUG "is_force_stop_enabled            = %x\n", info->is_force_stop_enabled);
	printk (KERN_DEBUG "num_clock_pulses                 = %d\n", info->num_clock_pulses);
	printk (KERN_DEBUG "frequency                        = %d\n", info->frequency);
#endif
	return 0;	
}


static int
i2c_hermon_get_recovery_info (int bus, bus_recovery_info_T* info)
{
	if (bus >= BUS_COUNT) return -1;
	memcpy (info, &m_bus_recovery_info [bus], sizeof (bus_recovery_info_T));
#if 0
	printk (KERN_DEBUG "is_smbus_reset_enabled           = %x\n", m_bus_recovery_info [bus].is_smbus_reset_enabled);
	printk (KERN_DEBUG "is_generate_clock_pulses_enabled = %x\n", m_bus_recovery_info [bus].is_generate_clock_pulses_enabled);
	printk (KERN_DEBUG "is_force_stop_enabled            = %x\n", m_bus_recovery_info [bus].is_force_stop_enabled);
	printk (KERN_DEBUG "num_clock_pulses                 = %d\n", m_bus_recovery_info [bus].num_clock_pulses);
	printk (KERN_DEBUG "frequency                        = %d\n", m_bus_recovery_info [bus].frequency);
#endif

	return 0;	
}

#endif


static int i2c_hermon_receive_bytes (int bus, bus_data_info_T* bus_data_info)
{

	memcpy (gI2CBuf [bus].WriteBuf, bus_data_info->WriteBuf, bus_data_info->WriteCnt);

	gI2CBuf [bus].WriteCnt  = bus_data_info->WriteCnt;
	gI2CBuf [bus].ReadCnt   = bus_data_info->ReadCnt;
	gI2CBuf [bus].SlaveAddr = bus_data_info->SlaveAddr;
	
	step [bus] = 0;
	
	gI2CBuf [bus].State = I2C_STATE_START_RECEIVE_BYTES_SENT;

	/* Turn on START bit */
	i2c_hermon_write_reg( bus, 0x01|i2c_hermon_read_reg(bus, I2C_CON1_REG) ,I2C_CON1_REG );
	
	if (0 == i2c_hermon_wait_for_int (bus))
	{
		memcpy (bus_data_info->ReadBuf, gI2CBuf [bus].ReadBuf, gI2CBuf [bus].ReadCnt);
		return 0;
	}
	return -1;
}

static int i2c_hermon_send_bytes (int bus, bus_data_info_T* bus_data_info)
{
	memcpy (gI2CBuf [bus].WriteBuf, bus_data_info->WriteBuf, bus_data_info->WriteCnt);

	gI2CBuf [bus].WriteCnt  = bus_data_info->WriteCnt;
	gI2CBuf [bus].ReadCnt   = bus_data_info->ReadCnt;
	gI2CBuf [bus].SlaveAddr = bus_data_info->SlaveAddr;
	
	step [bus] = 0;
	
	gI2CBuf [bus].State = I2C_STATE_START_SEND_BYTES_SENT;

	/* Turn on START bit */
	i2c_hermon_write_reg( bus, 0x01|i2c_hermon_read_reg(bus, I2C_CON1_REG) ,I2C_CON1_REG );
	
	if (0 == i2c_hermon_wait_for_int (bus))
	{
		return 0;
	}
	return -1;
}


static int i2c_hermon_copy_data (int bus, bus_data_info_T* bus_data_info)
{

	//int Retries = 1;
	//int master = 0;
	//int retries = DEFAULT_BB_RETRIES;
	

	memcpy (gI2CBuf [bus].WriteBuf, bus_data_info->WriteBuf, bus_data_info->WriteCnt);

	gI2CBuf [bus].WriteCnt  = bus_data_info->WriteCnt;
	gI2CBuf [bus].ReadCnt   = bus_data_info->ReadCnt;
	gI2CBuf [bus].SlaveAddr = bus_data_info->SlaveAddr;
	//printk("!!!!!!!!!!!!!!In HERMON Copy data\n");

	step [bus] = 0;
	
	gI2CBuf [bus].State = I2C_STATE_START_SENT;
		
	/* Turn on START bit */
	i2c_hermon_write_reg( bus, 0x01|i2c_hermon_read_reg(bus, I2C_CON1_REG) ,I2C_CON1_REG );
		
	if (0 == i2c_hermon_wait_for_int (bus))
	{
		if (gI2CBuf [bus].ReadCnt)
		{
			memcpy (bus_data_info->ReadBuf, gI2CBuf [bus].ReadBuf, gI2CBuf [bus].ReadCnt);
				//printk(" read cnt\n");
		}

		
			
		return 0;
	}


	return -1;
}

static u32 i2c_hermon_read_reg( int bus, u32 offset )
{
    return( ioread8( i2c_hermon_io_base[ bus ] + offset ) );
}


static void i2c_hermon_write_reg( int bus, u32 value, u32 offset )
{
    iowrite8( value, i2c_hermon_io_base[ bus ] + offset );
}



static u32 i2c_hermon_wait_for_int( int bus )
{
	u32 retval = 0;
	//unsigned char reg8;
	
	//printk("~~~~~~~~~~~~~~Waiting for interrupt\n");

	if (step [bus] != 1)
	{
		//wait_event_interruptible_timeout (hermon_wait[bus], step [bus] == 1, (1*HZ));
		wait_event_timeout (hermon_wait[bus], step[bus] == 1, (2*HZ));
	}
	
    step [bus] = 0; 
	
	
	if (I2C_NO_ERROR == gI2CBuf [bus].Error)
	{
		
		
		retval = 0;
	}
	else if (I2C_NACK_ERROR == gI2CBuf [bus].Error)
	{
		
		//printk("\nNACK_ERROR I2C-Ste=%d,Sts=%x\n",gI2CBuf [bus].State,gI2CBuf [bus].Status);

		
		/* stop the bus */
		i2c_hermon_write_reg (bus, 0x02|i2c_hermon_read_reg(bus, I2C_CON1_REG), I2C_CON1_REG );

		/* This is for Stop Condition to finish on the bus */
		udelay (50); 
		gI2CBuf [bus].Error = I2C_NO_ERROR;
		retval = -1;
	}
	else if (I2C_BUS_ERROR == gI2CBuf [bus].Error)
	{
		
		//printk("\nBUS_ERROR I2C-Ste=%d,Sts=%x\n",gI2CBuf [bus].State,gI2CBuf [bus].Status);
 
		gI2CBuf [bus].Error = I2C_NO_ERROR;
		retval = -1;
	}
	else
	{
		
		//printk("\nOTHER_ERROR I2C-Ste=%d,Sts=%x\n",gI2CBuf [bus].State,gI2CBuf [bus].Status);
		/* Reset and Reinit I2C Port as some unusual error occurred */
		//i2c_hermon_reset (bus);
		//i2c_hermon_reinit (bus);
		/* Reset The bus status */
		gI2CBuf [bus].Error = I2C_NO_ERROR;
		
		
		
		retval = -1;
	}

	return retval;

}

static int i2cRX_slave_process(int bus)
{
	uint32_t status;
	unsigned char tbuf;
	 
	
	
    status = gI2CBuf [bus].Status;
	if ( status & I2C_NMATCH)	
    {
    		tbuf = i2c_hermon_read_reg( bus, I2C_DATA_REG );
			
			i2cRXFULL_slave_process(bus,tbuf);
			
			gI2CBuf[bus].Status &= (~I2C_NMATCH);
			/* clear NMATCH in status reg */
			i2c_hermon_write_reg(bus,I2C_NMATCH,I2C_STATUS_REG);
			
	 		
	}


		 
	if ((status & I2C_SDAST)&& (!(status &I2C_XMIT)))
	{

			
		tbuf = i2c_hermon_read_reg( bus, I2C_DATA_REG );
		gI2CBuf[bus].Status &= (~I2C_SDAST);		
		i2cRXFULL_slave_process(bus,tbuf);		

	}
		 
	if ((status & I2C_SLVSTP))
    {
        	
		gI2CBuf[bus].Status &= (~I2C_SLVSTP);
		
		i2cSTOPDET_slave_process(bus);
			/* clear SLVSTP in status reg */
		i2c_hermon_write_reg(bus,I2C_SLVSTP,I2C_STATUS_REG);
			

			 
	}
	
	return 0;

}

int
ProcessI2CInterrupt (int BusNum)
{

	//printk("I2C-State=%d,Status=%x\n",gI2CBuf [BusNum].State,gI2CBuf [BusNum].Status);

	/* If  the interrupt is for slave mode */
	
	if ((gI2CBuf [BusNum].Status & 0x02)  == 0)
	{
		 
		i2cRX_slave_process(BusNum);
		return -1;
	}


	//master mode but missed out slave stop, handle here
	if (gI2CBuf [BusNum].Status & 0x80)
	{
		i2cRX_slave_process(BusNum);
	}

	// Continue with the master process
	{	
	
    	switch (gI2CBuf [BusNum].State)
    	{
		case I2C_STATE_IDLE: 

			gI2CBuf [BusNum].Error = I2C_ERROR_UNSPECIFIED;
		
			return 0;


		case I2C_STATE_START_RECEIVE_BYTES_SENT:
			
			if ((gI2CBuf [BusNum].Status & I2C_SDAST))
			{	
				/* enable stall after address send */
				i2c_hermon_write_reg( BusNum, 0x80|i2c_hermon_read_reg(BusNum, I2C_CON1_REG), I2C_CON1_REG);
				/* send slave address */
				i2c_hermon_write_reg( BusNum, ( gI2CBuf [BusNum].SlaveAddr << 1 ) |0x01, I2C_DATA_REG );
					gI2CBuf [BusNum].State = I2C_STATE_MASTER_RECEIVE;
			}
			break;
			
		case I2C_STATE_START_SEND_BYTES_SENT:
			
			if ((gI2CBuf [BusNum].Status & I2C_SDAST))
			{	
				
				/* enable stall after address send */
				i2c_hermon_write_reg( BusNum, 0x80|i2c_hermon_read_reg(BusNum, I2C_CON1_REG), I2C_CON1_REG);
				/* send slave address */
				i2c_hermon_write_reg( BusNum, ( gI2CBuf [BusNum].SlaveAddr << 1 )&0xfe, I2C_DATA_REG );
					gI2CBuf [BusNum].State = I2C_STATE_SLAVE_SENT;
			}
			break;

		case I2C_STATE_MASTER_RECEIVE:
			
			
			if (!(gI2CBuf [BusNum].Status & I2C_SDAST)&& !(gI2CBuf [BusNum].Status & I2C_STASTR)) 
			{ 
				gI2CBuf [BusNum].Error = I2C_TO_ERROR; 	
				return 0;
			}
			
			
			/*Clear Stall after Start*/
			i2c_hermon_write_reg (BusNum, 0x08, I2C_STATUS_REG);
			/* Clear STASTRE bit */
			i2c_hermon_write_reg (BusNum, i2c_hermon_read_reg(BusNum,I2C_CON1_REG) & 0x7f, I2C_CON1_REG);

			gI2CBuf [BusNum].ReadIx = 0;
			if ((gI2CBuf [BusNum].ReadIx + 1) >= gI2CBuf [BusNum].ReadCnt)
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_STOP_SENT;
			
				/* Send the ACK after this byte */
				i2c_hermon_write_reg( BusNum, i2c_hermon_read_reg(BusNum, I2C_CON1_REG) | 0x10, I2C_CON1_REG );
			
			}
			else
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_DATA_READ;
				
			}
			
			break;
			

		case I2C_STATE_START_SENT:
			
			if ((gI2CBuf [BusNum].Status & I2C_SDAST))
			{
				/* enable stall after address send */
				i2c_hermon_write_reg( BusNum, 0x80|i2c_hermon_read_reg(BusNum, I2C_CON1_REG), I2C_CON1_REG);

				/* send slave address */
				i2c_hermon_write_reg( BusNum, ( gI2CBuf [BusNum].SlaveAddr << 1 )&0xfe, I2C_DATA_REG );
					gI2CBuf [BusNum].State = I2C_STATE_SLAVE_SENT;
				
				
			}
			break;
			
		
			
		case I2C_STATE_SLAVE_SENT:
				 
			if (!(gI2CBuf [BusNum].Status & I2C_SDAST)&& !(gI2CBuf [BusNum].Status & I2C_STASTR)) 
			{ 
				
				gI2CBuf [BusNum].Error = I2C_TO_ERROR; 	
				return 0;
			}
			
        
			gI2CBuf [BusNum].State 	 = I2C_STATE_DATA_SENT;
			gI2CBuf [BusNum].WriteIx = 0;
			/*Clear Stall after Start*/
			i2c_hermon_write_reg (BusNum, 0x08, I2C_STATUS_REG);

			
			i2c_hermon_write_reg (BusNum, gI2CBuf [BusNum].WriteBuf [gI2CBuf [BusNum].WriteIx], I2C_DATA_REG);
		
			if (((gI2CBuf [BusNum].WriteIx + 1) >= gI2CBuf [BusNum].WriteCnt) && (0 == gI2CBuf [BusNum].ReadCnt))
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_STOP_SENT;
				
        	}
			gI2CBuf [BusNum].WriteIx++;
			break;

		case I2C_STATE_STOP_SENT: 
			
        	if (gI2CBuf [BusNum].Status & I2C_NEGACK)				
			{
				if (0 == gI2CBuf [BusNum].ReadCnt)
				{
					gI2CBuf [BusNum].Error = I2C_NACK_ERROR;
					
					i2c_hermon_write_reg( BusNum, 0x10 ,I2C_STATUS_REG );
				}
				else
				{
				
					/*Stop the BUS*/
					i2c_hermon_write_reg (BusNum, 0x02|i2c_hermon_read_reg(BusNum, I2C_CON1_REG), I2C_CON1_REG );
				
					gI2CBuf [BusNum].ReadBuf [gI2CBuf [BusNum].ReadIx] = i2c_hermon_read_reg (BusNum, I2C_DATA_REG);
					gI2CBuf [BusNum].ReadIx++;
					gI2CBuf [BusNum].Error = I2C_NO_ERROR;
				}
				return 0;
			} 

			else
			{ 
			
				/*Stop the BUS*/
				i2c_hermon_write_reg (BusNum, 0x02|i2c_hermon_read_reg(BusNum, I2C_CON1_REG), I2C_CON1_REG );
			
				if (0 != gI2CBuf [BusNum].ReadCnt)
				{
				/*Note:We can have one more check here to check the SDAST status*/
			
			
					gI2CBuf [BusNum].ReadBuf [gI2CBuf [BusNum].ReadIx] = i2c_hermon_read_reg (BusNum, I2C_DATA_REG);
					gI2CBuf [BusNum].ReadIx++;
					//gI2CBuf [BusNum].Error = I2C_NO_ERROR;
		
				}

				
				gI2CBuf [BusNum].Error = I2C_NO_ERROR;


				return 0;
			}


		case I2C_STATE_DATA_SENT: 

			if (!(gI2CBuf [BusNum].Status & I2C_SDAST)) 	
			{ 
				gI2CBuf [BusNum].Error = I2C_TO_ERROR; 	
				return 0;
			}
			
			if (gI2CBuf [BusNum].WriteCnt == gI2CBuf [BusNum].WriteIx && (gI2CBuf [BusNum].ReadCnt != 0) )
			{
				 
				gI2CBuf [BusNum].State 	= I2C_STATE_REP_SLAVE_SENT;
				/*Set START condition*/
				i2c_hermon_write_reg( BusNum, 0x01|i2c_hermon_read_reg(BusNum, I2C_CON1_REG) ,I2C_CON1_REG );
				/*Read the DATA reg*/
				i2c_hermon_read_reg (BusNum, I2C_DATA_REG);

			
				/* if not clear to send */
				if ((gI2CBuf [BusNum].Status& 0x40) != I2C_SDAST)
				{
					gI2CBuf [BusNum].Error =	I2C_TO_ERROR;
					return 0;
				}
			
			
				/* enable stall after address send */
				i2c_hermon_write_reg( BusNum, 0x80|i2c_hermon_read_reg(BusNum, I2C_CON1_REG), I2C_CON1_REG);
				i2c_hermon_write_reg (BusNum, ((gI2CBuf [BusNum].SlaveAddr << 1) | 0x01), I2C_DATA_REG );
				/* Create Start and transmit target address */
				break; //return -1;
			}
			gI2CBuf [BusNum].State 	 = I2C_STATE_DATA_SENT;
			
			i2c_hermon_write_reg (BusNum, gI2CBuf [BusNum].WriteBuf [gI2CBuf [BusNum].WriteIx], I2C_DATA_REG);
			if (((gI2CBuf [BusNum].WriteIx + 1) >= gI2CBuf [BusNum].WriteCnt) && (0 == gI2CBuf [BusNum].ReadCnt))
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_STOP_SENT;
				/* Send the stop after this byte */
				 
			}
			gI2CBuf [BusNum].WriteIx++;
			break;

		case I2C_STATE_REP_SLAVE_SENT:
			
			if (!(gI2CBuf [BusNum].Status & I2C_SDAST)&& !(gI2CBuf [BusNum].Status & I2C_STASTR)) 
			{
				gI2CBuf [BusNum].Error = I2C_TO_ERROR; 
				return 0; 
			}
			
			
			/*Clear Stall after Start*/
			i2c_hermon_write_reg (BusNum, 0x08, I2C_STATUS_REG);
			/* Clear STASTRE bit */
			i2c_hermon_write_reg (BusNum, i2c_hermon_read_reg(BusNum,I2C_CON1_REG) & 0x7f, I2C_CON1_REG); 	

		
			gI2CBuf [BusNum].ReadIx = 0;
			if ((gI2CBuf [BusNum].ReadIx + 1) >= gI2CBuf [BusNum].ReadCnt)
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_STOP_SENT;
			
				/* Send the ACK after this byte */
				i2c_hermon_write_reg( BusNum, i2c_hermon_read_reg(BusNum, I2C_CON1_REG) | 0x10, I2C_CON1_REG );
			
			}
			else
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_DATA_READ;
				
			}
			break;

		case I2C_STATE_DATA_READ:
			
			if (!(gI2CBuf [BusNum].Status & I2C_SDAST)) 		
			{ 
			gI2CBuf [BusNum].Error = I2C_TO_ERROR; 	
			return 0; 
			}
			
		

       	 	gI2CBuf [BusNum].ReadBuf [gI2CBuf [BusNum].ReadIx] = i2c_hermon_read_reg (BusNum, I2C_DATA_REG);

			gI2CBuf [BusNum].ReadIx++;

			if ((gI2CBuf [BusNum].ReadIx + 1) >= gI2CBuf [BusNum].ReadCnt)
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_STOP_SENT;
			
				/* Send the ACK after this byte */
				i2c_hermon_write_reg( BusNum, i2c_hermon_read_reg(BusNum, I2C_CON1_REG) | 0x10, I2C_CON1_REG );
				
			}
			else
			{
				gI2CBuf [BusNum].State 	= I2C_STATE_DATA_READ;
				
			}
			break;
		}
	}


	return -1;
	
}
static int 
i2cRXFULL_slave_process(int bus,u8 data)
{
	unsigned long flags;
	
	spin_lock_irqsave( &status_lock[ bus ], flags );
	//local_irq_disable();
	
	if (hermon_slave_data_ptr[bus].Linear_SlaveRX_index >= TRANSFERSIZE)
		printk("FATAL ERROR: Buffer Overflow in I2C%d. Should not happen. Report to AMI\n",bus);
	else
	{
		hermon_slave_data_ptr[bus].Linear_SlaveRX_data[hermon_slave_data_ptr[bus].Linear_SlaveRX_index] = data;
		hermon_slave_data_ptr[bus].Linear_SlaveRX_index++;
	}
	spin_unlock_irqrestore( &status_lock[ bus ], flags );

	return 0;
}

static void 
i2cSTOPDET_slave_process(int bus)
{
	int FifoPtr;
	unsigned char *DataBuffer;
	unsigned long length = 0;
	unsigned long flags;
	
	//int i;
	spin_lock( &hermon_slave_data_ptr[bus].data_lock );		
	spin_lock_irqsave( &status_lock[ bus ], flags );
	//local_irq_disable();

	if (hermon_slave_data_ptr[bus].SlaveRX_Entries == MAX_FIFO_LEN)

	{
		hermon_slave_data_ptr[bus].Linear_SlaveRX_index = 0;
		printk("I2C%d: Fifo is full, losing data\n",bus);

		/* Return back */
		spin_unlock( &hermon_slave_data_ptr[bus].data_lock );
		spin_unlock_irqrestore( &status_lock[ bus ], flags );
		return;
	}

	FifoPtr = hermon_slave_data_ptr[bus].SlaveRX_Writer;

	hermon_slave_data_ptr[bus].SlaveRX_index[FifoPtr] = 0;

	DataBuffer = hermon_slave_data_ptr[bus].SlaveRX_data[FifoPtr];
	length = hermon_slave_data_ptr[bus].Linear_SlaveRX_index;


	/* Read the Length and copy to buffer */
	if(length)
		memcpy(&DataBuffer[0],hermon_slave_data_ptr[bus].Linear_SlaveRX_data,length);
	hermon_slave_data_ptr[bus].SlaveRX_index[FifoPtr] = hermon_slave_data_ptr[bus].SlaveRX_len[FifoPtr]= length;
	hermon_slave_data_ptr[bus].Linear_SlaveRX_index = 0;

	/* The following happens when emtpy packet (START, followed by a STOP) is detected*/
	if (hermon_slave_data_ptr[bus].SlaveRX_len[FifoPtr]  == 1)
	{
		hermon_slave_data_ptr[bus].SlaveRX_len[FifoPtr] = 0;
		hermon_slave_data_ptr[bus].SlaveRX_index[FifoPtr] = 0;
	}
	else
	{
		if ((++hermon_slave_data_ptr[bus].SlaveRX_Writer) == MAX_FIFO_LEN)
			hermon_slave_data_ptr[bus].SlaveRX_Writer = 0;
		hermon_slave_data_ptr[bus].SlaveRX_Entries++;

	}
	spin_unlock( &hermon_slave_data_ptr[bus].data_lock );
	spin_unlock_irqrestore( &status_lock[ bus ], flags );
	return;
}

#if (LINUX_VERSION_CODE >=  KERNEL_VERSION(2,6,24))
static irqreturn_t hermon_handler( int this_irq, void *dev_id)
#else
static irqreturn_t hermon_handler( int this_irq, void *dev_id,
                                 struct pt_regs *regs )
#endif
{
    int bus;
	unsigned int vectNum = 0;
	int RetVal;
	//unsigned char reg8;

		
	/* Determine the bus for this interrupt */
	for( bus = 0; bus < bus_count; bus++ )
	{	
        	if( irq[ bus ] == this_irq && bus >= 3)
            		break;
		else if(irq[bus]== this_irq && bus < 3)
		{
			/* if bus is line 0 */
			if(( *(unsigned long *)(WPCM_AIC_VA_BASE + 0x0088)& 0x04000000))
			{
				bus = 0;
				vectNum = 26; 
            			break;
			}
			/* if bus is line 1 */
			if(( *(unsigned long *)(WPCM_AIC_VA_BASE + 0x0088)& 0x08000000))
			{
				bus = 1; 
				vectNum = 26; 
            			break;
			}
			/* if bus is line 2 */
			if(( *(unsigned long *)(WPCM_AIC_VA_BASE + 0x0088)& 0x40000000))
			{
				bus = 2; 
				vectNum = 26; 
            			break;
			}
		}
	}

	if(bus == 3)
		vectNum = 23;
  
	if(bus == 4)
		vectNum = 27;
    
	if(bus == 5)
		vectNum = 29;

	/* Clear  interrupts */
	//*( unsigned long *)(WPCM_AIC_VA_BASE + 0x12C) = 1<<vectNum; //Check

	
	/* Read bus status */

	gI2CBuf [bus].Status = i2c_hermon_read_reg( bus, I2C_STATUS_REG );

	if (gI2CBuf [bus].Status == 0)
	{

			printk("I2C channel %d Interrupt handler: Spurious Interrupt\n", bus);
			return IRQ_HANDLED;
    }
	
//	gI2CBuf[bus].Status &= 0xFC;
	gI2CBuf [bus].Error = I2C_NO_ERROR;
	
	if (gI2CBuf [bus].Status & 0x10)
	{
		
				
		/* This is for Stop Condition to finish on the bus */
		i2c_hermon_write_reg (bus, 0x02|i2c_hermon_read_reg(bus, I2C_CON1_REG), I2C_CON1_REG );
		
		/* Clean NACK */
		i2c_hermon_write_reg( bus, 0x10 ,I2C_STATUS_REG );
		gI2CBuf[bus].Status &= 0xEF;
		gI2CBuf [bus].Error |= I2C_NACK_ERROR;
		
		
		
	}

	
	if (gI2CBuf [bus].Status & 0x20)
	{
		
		/* Clean Bus Error */
		i2c_hermon_write_reg( bus, 0x20 ,I2C_STATUS_REG );
		gI2CBuf[bus].Status &= 0xDF;
		gI2CBuf [bus].Error |= I2C_BUS_ERROR;
	}

	

		
	RetVal = ProcessI2CInterrupt (bus);
	if (0 == RetVal)
	{
		step [bus] = 1;
		
		/* Wake up people waiting for the interrupt */
		
		//wake_up_interruptible (&hermon_wait[ bus ]);
		wake_up(&hermon_wait[ bus ]);
	}
	
	 /* write any value to permit service of pending */
	*( unsigned long *)(WPCM_AIC_VA_BASE + 0x130) = 1;
	
	return( IRQ_HANDLED );
}


module_init( i2c_hermon_init );
module_exit( i2c_hermon_exit );
