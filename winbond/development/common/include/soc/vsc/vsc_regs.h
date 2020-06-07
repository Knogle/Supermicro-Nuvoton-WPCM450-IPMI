#ifndef _VSC_REGS_H
#define _VSC_REGS_H

/*
  Register list of VSC
  -indexed in dword increments
  (define, index, address, description, min version, read/write-ability)
 
  VSC_REG_VR		0x0000	version				1	RO
  VSC_REG_SR		0x0004	status				1	RO
  VSC_REG_CR		0x0008	control				1	RW
  VSC_REG_MR		0x000C	mode				1	RW
  VSC_REG_ISR		0x0010	interrupt status		1	RO
  VSC_REG_IMR		0x0014	interrupt mask			1	RW
  VSC_REG_BPV		0x0018	black pixel value (framestart)	1	RO
  VSC_REG_MVT		0x001C  measured V total		1	RO - use secure read method
  VSC_REG_HO		0x0020	H offset			1	RW - shadowed
  VSC_REG_HL		0x0024	H length			1	RW - shadowed
  VSC_REG_VO		0x0028	V offset			1	RW - shadowed
  VSC_REG_VL		0x002C	V length			1	RW - shadowed
  VSC_REG_MHO		0x0030	measured H offset		1	RO - use secure read method
  VSC_REG_MHL		0x0034	measured H length		1	RO - use secure read method
  VSC_REG_MVO		0x0038	measured V offset		1	RO - use secure read method
  VSC_REG_MVL		0x003C	measured V length		1	RO - use secure read method
  VSC_REG_HHT		0x0040	Hsync high time			1	RO
  VSC_REG_HLT		0x0044	Hsync low time			1	RO
  VSC_REG_VHT		0x0048	Vsync high time			1	RO
  VSC_REG_VLT		0x004C	Vsync low time			1	RO
  VSC_REG_HSD		0x0050	horizontal sync delta		1	WO
  VSC_REG_VSD		0x0054	vertical sync delta		1	WO
  VSC_REG_VMA		0x0058	video memory access		1	RO
  VSC_REG_BTA		0x005C	block transfer address		1	WO
  VSC_REG_BTS		0x0060	block transfer size		1	WO
  VSC_REG_BTF		0x0064	block transfer field		1	WO
  VSC_REG_BCO		0x0068	block column offset		1	WO
  VSC_REG_BRO		0x006C	block row offset		1	WO
  VSC_REG_LFH		0x0070	line for H offset measurement	1	WO
  VSC_REG_BPT		0x0074	black pixel threshold		1	RW - shadowed
  VSC_REG_IRE		0x0078	image rescan error		1	RO
  VSC_REG_DTH		0x007C	diff threshold			1	WO
  VSC_REG_FTL		0x0080	FIFO fill threshold		2	RW
  VSC_REG_FFL		0x0084  FIFO fill level			2	RO
  VSC_REG_CCR		0x0088	compression control		2	RW
  VSC_REG_CST		0x008C	compression status		2	RO
  VSC_REG_DMABASE	0x0090	dma target address		2	RW
  VSC_REG_DMACOUNT	0x0094	dma transferred data		2	RO
  VSC_REG_DMALENGTH	0x0098  dma burst len			2	RW
  VSC_REG_DIF		0x009C	difference generator control	3	RW
  VSC_REG_SDR		0x00A0	SDRAM initialization word	3	RW
*/

#define VSC_REG_VR		(0x0000 / 4)
#define VSC_REG_SR		(0x0004	/ 4)
#define VSC_REG_CR		(0x0008	/ 4)
#define VSC_REG_MR		(0x000C	/ 4)
#define VSC_REG_ISR		(0x0010	/ 4)
#define VSC_REG_IMR		(0x0014	/ 4)
#define VSC_REG_BPV		(0x0018	/ 4)
#define	VSC_REG_MVT	        (0x001C	/ 4)
#define VSC_REG_HO		(0x0020	/ 4)
#define VSC_REG_HL		(0x0024	/ 4)
#define VSC_REG_VO		(0x0028	/ 4)
#define VSC_REG_VL		(0x002C	/ 4)
#define VSC_REG_MHO		(0x0030	/ 4)
#define VSC_REG_MHL		(0x0034	/ 4)
#define VSC_REG_MVO		(0x0038	/ 4)
#define VSC_REG_MVL		(0x003C	/ 4)
#define VSC_REG_HHT		(0x0040	/ 4)
#define VSC_REG_HLT		(0x0044	/ 4)
#define VSC_REG_VHT		(0x0048	/ 4)
#define VSC_REG_VLT		(0x004C	/ 4)
#define VSC_REG_HSD		(0x0050 / 4)
#define VSC_REG_VSD		(0x0054 / 4)
#define VSC_REG_VMA		(0x0058 / 4)
#define VSC_REG_BTA		(0x005C / 4)
#define VSC_REG_BTS		(0x0060 / 4)
#define VSC_REG_BTF		(0x0064 / 4)
#define VSC_REG_BCO		(0x0068 / 4)
#define VSC_REG_BRO		(0x006C / 4)
#define VSC_REG_LFH		(0x0070 / 4)
#define VSC_REG_BPT		(0x0074 / 4)
#define VSC_REG_IRE		(0x0078 / 4)
#define VSC_REG_DTH		(0x007C / 4)
#define VSC_REG_FTL		(0x0080	/ 4)
#define VSC_REG_FFL		(0x0084	/ 4)
#define VSC_REG_CCR		(0x0088	/ 4)
#define VSC_REG_CST		(0x008C	/ 4)
#define VSC_REG_DMABASE		(0x0090	/ 4)
#define VSC_REG_DMACOUNT	(0x0094	/ 4)
#define VSC_REG_DMALENGTH       (0x0098 / 4)
#define VSC_REG_DIF		(0x009C / 4)
#define VSC_REG_SDR		(0x00A0 / 4)

/*
 * size of the register mapping is
 * determined by the last reg address,
 * keep in sync!
 */
#define VSC_LAST_REG	VSC_REG_SDR


/*
 * Version Register (VR)
 */

/* [0:3]   - major version number */
#define VR_MAJOR_SHIFT			0
#define VR_MAJOR_MASK			(0x0F << VR_MAJOR_SHIFT)

/* [4:7]   - minor version number */
#define VR_MINOR_SHIFT			4
#define VR_MINOR_MASK			(0x0F << VR_MINOR_SHIFT)

/* [8:27]  - reserved */

/* [28]    - busmaster support */
#define VR_FEAT_DMA_SHIFT		28
#define VR_FEAT_DMA_MASK		(1 << VR_FEAT_DMA_SHIFT)

/* [29]    - DCT support */
#define VR_FEAT_DCT_SHIFT		29
#define VR_FEAT_DCT_MASK		(1 << VR_FEAT_DCT_SHIFT)

/* [30]    - downsampling support */
#define VR_FEAT_DOWNSAMPLE_SHIFT	30
#define VR_FEAT_DOWNSAMPLE_MASK		(1 << VR_FEAT_DOWNSAMPLE_SHIFT)

/* [31]    - LRLE engine support */
#define VR_FEAT_LRLE_SHIFT		31
#define VR_FEAT_LRLE_MASK		(1 << VR_FEAT_LRLE_SHIFT)


/*
 * Status Register  (SR)
 */

/* [0:2]   - current main state */
#define SR_STATE_SHIFT	0
#define SR_STATE_MASK	(0x07 << SR_STATE_SHIFT)

#define SR_IDLE		0x00
#define	SR_SAMPL	0x01
#define SR_PROC		0x02
#define SR_TRANS	0x03
#define SR_COPY		0x04
#define SR_DONE		0x05
#define SR_RESET	0x07

/* [3:31]  - reserved */


/*
 * Control Register - state machine path controls (CR)
 */

/* [0:2]   - path from idle */
#define CR_IDLE(x)	((x & 0x07))
#define CR_IDLE_IDLE	0x00
#define CR_IDLE_SAMPLE	0x01
#define CR_IDLE_PROC	0x02
#define CR_IDLE_TRANS	0x03
#define CR_IDLE_COPY	0x04

/* [3]     - path from sample */
#define CR_SAMPLE(x)	((x & 0x01) << 3)
#define CR_SAMPLE_DONE	0x00
#define CR_SAMPLE_PROC	0x01

/* [4]     - path from proc */
#define CR_PROC(x)	((x & 0x01) << 4)
#define CR_PROC_DONE	0x00
#define CR_PROC_SAMPLE	0x01

/* [5]     - path from trans */
#define CR_TRANS(x)	((x & 0x01) << 5)
#define CR_TRANS_DONE	0x00
#define CR_TRANS_SAMPLE	0x01

/* [6]     - path from copy */
#define CR_COPY(x)	((x & 0x01) << 6)
#define CR_COPY_DONE	0x00
#define CR_COPY_SAMPLE	0x01

/* [7:31]  - reserved */


/*
 * Mode Register Bits (MR)
 */

#define MR_MASK		0x0000FFFF

#define MR_CLKINV	0x00000001 /* GPIO for ADC alternate pixel sampling mode */
#define MR_VIDDISABLE   0x00000002 /* local video disable for video splitter */
#define MR_HSYNC_ADC	0x00000004 /* hsync input multiplexer (VGA/ADC) for irq, registers, sampling or only sampling */
#define MR_VSYNC_ADC	0x00000008 /* vsync input multiplexer (VGA/ADC) for irq, registers, sampling or only sampling */
#define MR_SMPLCLKEDGE	0x00000010 /* 1 pos.edge, 0 neg. edge of sample clock ('adc clk inv') */ 
#define MR_VSC_RESET	0x00000020 /* master reset */
#define MR_VFIFO_RESET	0x00000040 /* reset video FIFO in case of overflow / fifo error */
#define MR_DO_DMA	0x00000080 /* DMA/master mode enable */
#define MR_CLKENRESET	0x01000000

#define MR_MODE_SHIFT	8
#define MR_MODE_MASK	(0x0F << MR_MODE_SHIFT)
#define MR_MODE(x)	(x << MR_MODE_SHIFT)

#define MR_MODE_ADC1X	 0
#define MR_MODE_ADC2X	 1
#define MR_MODE_DVI1X	 2
#define MR_MODE_DVI2X	 3
#define MR_MODE_DDRDVI1X 4
#define MR_MODE_DDRDVI2X 5

/* delay from display enable to video active,
   0 - 15 clock cycles of delay */
#define DE_DELAY_SHIFT	 12
#define DE_DELAY_MASK	 (0x0F << DE_DELAY_SHIFT)
#define DE_DELAY(x)	 (x << DE_DELAY_SHIFT)

#define MR_TEST_PIC	 0x00010000 /* generate virtual test picture */
#define MR_TEST_PIC_ERR	 0x00020000 /* force error in test picture */
#define MR_SWAPLANES	 0x00040000 /* swap input pixels from ADC */

#define MR_SYNCSWITCH	 0x00080000 /* enable extended sync switching */
#define MR_HSHOW_ADC	 0x00100000 /* hsync input multiplexer (VGA/ADC) for registers */
#define MR_VSHOW_ADC	 0x00200000 /* vsync input multiplexer (VGA/ADC) for registers */
#define MR_HSIRQ_ADC	 0x00400000 /* hsync input multiplexer (VGA/ADC) for sync irq */
#define MR_VSIRQ_ADC	 0x00800000 /* vsync input multiplexer (VGA/ADC) for sync irq */

/* [24:31]  - reserved */

/*
 * Interrupt Status Register (ISR)
 */

#define ISR_MASK	0xFF

#define ISR_EOP		0x01
#define ISR_SFC		0x02
#define ISR_HM_END	0x04
#define ISR_HS_SLOW	0x08
#define ISR_VS_SLOW	0x10
#define ISR_FIFO_ERR    0x20
#define ISR_DTR         0x40
#define ISR_ADC_RES_OK  0x80

/* [7:31]  - reserved */


/*
 * Interrupt Mask Register (IMR)
 */

#define IMR_MASK	0xFF

#define IMR_EOP		0x01
#define IMR_SFC		0x02
#define IMR_HM_END	0x04
#define IMR_HS_SLOW	0x08
#define IMR_VS_SLOW	0x10
#define IMR_FIFO_ERR    0x20
#define IMR_DTR         0x40
#define IMR_ADC_RES_OK  0x80

/* [7:31]  - reserved */


/*
 * Black Pixel Value (BPV)
 */

#define BPV_SHIFT	0
#define BPV_BITS	16
#define BPV_MASK	(((1 << BPV_BITS) - 1) << BPV_SHIFT)

/* [16:31]  - reserved */


/*
 * Measured vertical total (MVT)
 */

#define MVT_SHIFT	0
#define MVT_BITS	11
#define MVT_MASK	(((1 << MVT_BITS) - 1) << MVT_SHIFT)

/* [11:31]  - reserved */


/*
 * FIFO Fill Level (FFL)
 */

#define FFL_SHIFT	0
#define FFL_BITS	10
#define FFL_MASK	(((1 << FFL_BITS) - 1) << FFL_SHIFT)

/* [10:31]  - reserved */


/*
 *  Compression Status (CST)
 */

#define CST_SHIFT	0
#define CST_BITS	8
#define CST_MASK	(((1 << CST_BITS) - 1) << CST_SHIFT)

/* [9:31]   - reserved */


/**********************************************
 * Compression control values
 **********************************************/

/*
 * When using LRLE encoding
 */

/* [0]     - pixel diff margin for red and blue channels */
#define CCR_LRLE_RMARGIN_RB_SHIFT	0
#define CCR_LRLE_RMARGIN_RB_MASK	(0x01 <<  CCR_LRLE_RMARGIN_RB_SHIFT)
#define CCR_LRLE_RMARGIN_RB(x)		(x << CCR_LRLE_RMARGIN_RB_SHIFT)

/* [1]     - pixel diff margin for green channel */
#define CCR_LRLE_RMARGIN_G_SHIFT	1
#define CCR_LRLE_RMARGIN_G_MASK		(0x01 <<  CCR_LRLE_RMARGIN_G_SHIFT)
#define CCR_LRLE_RMARGIN_G(x)		(x << CCR_LRLE_RMARGIN_G_SHIFT)

/* [2]     - green grey mode (instead of luminance) */
#define CCR_LRLE_GREY_GREEN_SHIFT	2
#define CCR_LRLE_GREY_GREEN_MASK	(0x01 <<  CCR_LRLE_GREY_GREEN_SHIFT)
#define CCR_LRLE_GREY_GREEN(x)		(x << CCR_LRLE_GREY_GREEN_SHIFT)

/* [3:7]   - run length limit in LRLE stage */
#define CCR_LRLE_RUNLIMIT_SHIFT 3
#define CCR_LRLE_RUNLIMIT_MASK	(0x1F <<  CCR_LRLE_RUNLIMIT_SHIFT)
#define CCR_LRLE_RUNLIMIT(x)	(x << CCR_LRLE_RUNLIMIT_SHIFT)

/* [8]     - enable line copies */
#define CCR_LRLE_LINECOPY_SHIFT 8
#define CCR_LRLE_LINECOPY_MASK	(0x01 <<  CCR_LRLE_LINECOPY_SHIFT)
#define CCR_LRLE_LINECOPY(x)	(x << CCR_LRLE_LINECOPY_SHIFT)

/* [9:12]  - grey compressor pixel diff margin */
#define CCR_LRLE_GMARGIN_SHIFT	9
#define CCR_LRLE_GMARGIN_MASK	(0x0F <<  CCR_LRLE_GMARGIN_SHIFT)
#define CCR_LRLE_GMARGIN(x)	(x << CCR_LRLE_GMARGIN_SHIFT)

/* [13]    - force grey compression */
#define CCR_LRLE_GREY_FORCE_SHIFT	13
#define CCR_LRLE_GREY_FORCE_MASK	(0x01 <<  CCR_LRLE_GREY_FORCE_SHIFT)
#define CCR_LRLE_GREY_FORCE(x)		(x << CCR_LRLE_GREY_FORCE_SHIFT)

/* [14]    - disable grey compression */
#define CCR_LRLE_GREY_DISABLE_SHIFT	14
#define CCR_LRLE_GREY_DISABLE_MASK	(0x01 <<  CCR_LRLE_GREY_DISABLE_SHIFT)
#define CCR_LRLE_GREY_DISABLE(x)	(x << CCR_LRLE_GREY_DISABLE_SHIFT)

/* [15:18] - color reduction mode */
#define CCR_LRLE_COLOR_SHIFT	15
#define CCR_LRLE_COLOR_MASK	(0x0F << CCR_LRLE_COLOR_SHIFT)
#define CCR_LRLE_COLOR(x)	(x << CCR_LRLE_COLOR_SHIFT)

#define LRLE_COLOR_1BIT_GREY	0x00
#define LRLE_COLOR_2BIT_GREY	0x01
#define LRLE_COLOR_3BIT_GREY	0x02
#define LRLE_COLOR_4BIT_GREY	0x03
#define LRLE_COLOR_5BIT_GREY	0x04
#define LRLE_COLOR_6BIT_GREY	0x05
#define LRLE_COLOR_7BIT_GREY	0x06
#define LRLE_COLOR_8BIT_GREY	0x07
#define LRLE_COLOR_15BIT_DIRECT	0x08
#define LRLE_COLOR_7BIT_DIRECT	0x09
#define LRLE_COLOR_4BIT_PALETTE	0x0A

/* [19]    - linecopy margin for red and blue channels */
#define CCR_LRLE_CMARGIN_RB_SHIFT	19
#define CCR_LRLE_CMARGIN_RB_MASK	(0x01 <<  CCR_LRLE_CMARGIN_RB_SHIFT)
#define CCR_LRLE_CMARGIN_RB(x)		(x << CCR_LRLE_CMARGIN_RB_SHIFT)

/* [20]    - linecopy margin for green channel */
#define CCR_LRLE_CMARGIN_G_SHIFT	20
#define CCR_LRLE_CMARGIN_G_MASK		(0x01 <<  CCR_LRLE_CMARGIN_G_SHIFT)
#define CCR_LRLE_CMARGIN_G(x)		(x << CCR_LRLE_CMARGIN_G_SHIFT)

/* [21:24] - reserved */

/* [25:29] - run length limit in reaccumulator stage */
#define CCR_LRLE_REACC_RUNLIMIT_SHIFT	25
#define CCR_LRLE_REACC_RUNLIMIT_MASK	(0x1F <<  CCR_LRLE_REACC_RUNLIMIT_SHIFT)
#define CCR_LRLE_REACC_RUNLIMIT(x)	(x << CCR_LRLE_REACC_RUNLIMIT_SHIFT)

/*
 * When using Downsampling encoding
 */

/* [0:1] - downsampling mode, how many pixels to interpolate */
#define CCR_DOWN_MODE_SHIFT             0
#define CCR_DOWN_MODE_MASK              (0x03 <<  CCR_DOWN_MODE_SHIFT)
#define CCR_DOWN_MODE(x)                ((x) << CCR_DOWN_MODE_SHIFT)

#define DOWN_MODE_1X1			0
#define DOWN_MODE_2X2			1
#define DOWN_MODE_4X4			2
#define DOWN_MODE_8X8			3

/*
 * Always available, regardless of the encoding
 */

/* [30-31] - compression algorithm */
#define CCR_VSC_ALGO_SHIFT	30
#define CCR_VSC_ALGO_MASK	(0x03 << CCR_VSC_ALGO_SHIFT)
#define CCR_VSC_ALGO(x)		(x << CCR_VSC_ALGO_SHIFT)

#define VSC_ALGO_NULL		0x00
#define VSC_ALGO_LRLE		0x01
#define VSC_ALGO_DOWNSAMPLE	0x02
#define VSC_ALGO_DCT		0x03 /* not implemented */

/**********************************************
 * SDRAM Initialization register
 **********************************************/

/* Mode Register 1 */
#define SDR_BURST_LEN_SHIFT	0
#define SDR_BURST_LEN_MASK	(0x07 << SDR_BURST_LEN_SHIFT)
#define SDR_BURST_LEN(x)	(x << SDR_BURST_LEN_SHIFT)

#define SDR_BURST_LEN_1		0
#define SDR_BURST_LEN_2		1
#define SDR_BURST_LEN_4		2
#define SDR_BURST_LEN_8		3
#define SDR_BURST_LEN_FULL	7

#define SDR_BURST_TYPE_SHIFT	3
#define SDR_BURST_TYPE_MASK	(0x01 << SDR_BURST_TYPE_SHIFT)
#define SDR_BURST_TYPE(x)	(x << SDR_BURST_TYPE_SHIFT)

#define SDR_BURST_TYPE_SEQUENTIAL	0
#define SDR_BURST_TYPE_INTERLEAVED	1

#define SDR_CAS_SHIFT		4
#define SDR_CAS_MASK		(0x07 << SDR_CAS_SHIFT)
#define SDR_CAS(x)		(x << SDR_CAS_SHIFT)

#define SDR_TEST_SHIFT		7
#define SDR_TEST_MASK		(0x03 << SDR_TEST_SHIFT)
#define SDR_TEST(x)		(x << SDR_TEST_SHIFT)

#define SDR_WBL_SHIFT		9
#define SDR_WBL_MASK		(0x01 << SDR_WBL_SHIFT)
#define SDR_WBL(x)		(x << SDR_WBL_SHIFT)

#define SDR_ENABLE_MODE2_SHIFT	12
#define SDR_ENABLE_MODE2_MASK	(0x01 << SDR_ENABLE_MODE2_SHIFT)
#define SDR_ENABLE_MODE2(x)	(x << SDR_ENABLE_MODE2_SHIFT)

/* Mode Register 2 */
#define SDR_2_PASR_SHIFT	0
#define SDR_2_PASR_MASK		(0x07 << SDR_2_PASR_SHIFT)
#define SDR_2_PASR(x)		(x << SDR_2_PASR_SHIFT)


/******************** AMI ADDITIONS	********************/

#define DEFAULT_COLOR_MODE 		LRLE_COLOR_15BIT_DIRECT






#endif /* _VSC_REGS_H */
