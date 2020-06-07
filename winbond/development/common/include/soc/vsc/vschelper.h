#ifndef __VSC_HELPER__
#define __VSC_HELPER__


#ifdef WIN32
typedef unsigned short  u_int16_t;
typedef unsigned int  u_int;
typedef unsigned long  u_int32_t;
typedef unsigned char u_char;
typedef unsigned char u_int8_t;
typedef unsigned long  u_long;
#endif

#ifdef __GNUC__
#define PACK __attribute__ ((packed))
#else
#define PACK
#pragma pack( 1 )
#endif

/********************************************
This file is shared between remote client
and video server
********************************************/

/**
 * Defines describing the framebuffer characteristics, don't change.
 *
 * \def PP_FB_TILE_WIDTH
 * \def PP_FB_TILE_HEIGHT
 * \def PP_FB_TILE_SIZE
 *
 * Size (in pixels) of the tiles the VSC is working on, this is the minimum
 * granularity for video contents.
 *
 * \def VSC_MAX_RES_X
 * \def VSC_MAX_RES_Y
 *
 * Maximum supported resolution of the VSC IP core.
 *
 * \def VSC_PIXEL_SIZE
 * \def VSC_PIXEL_BITS
 *
 * Raw VSC data size in bytes per pixel
 *
 * \def PP_FB_TILES_PER_LINE
 *
 * Theoretical limit of tiles per line, used when creating the diffmap
 *
 */

#define PP_FB_TILE_WIDTH		(16)
#define PP_FB_TILE_HEIGHT	(16)
#define PP_FB_TILE_SIZE		(PP_FB_TILE_WIDTH * PP_FB_TILE_HEIGHT)
#define VSC_MAX_RES_X		1280	//1600
#define VSC_MAX_RES_Y		1024 //1200 
#define VSC_PIXEL_SIZE		2
#define VSC_PIXEL_BITS		16
#define PP_FB_TILES_PER_LINE	(VSC_MAX_RES_X / PP_FB_TILE_WIDTH) //128
#define MAX_TILE_ROWS			(VSC_MAX_RES_Y/PP_FB_TILE_HEIGHT)

/**
 * \def VSC_DIFFMAP_SIZE
 *
 * Size of the VSC generated difference bitmap (in bytes), to be transferred
 * after a difference run to check for changed tiles.
 *
 * miba: For some reason DMA transfer sizes on the PPC have to be multiples of 32 byte
 * when the 32 byte DMA buffer is used (which is the case for us), otherwise a
 * DMA error occurs. Not really sure why, but working around this for now.
 */
#define	DIFFMAP_BLOCKS_PER_BYTE	(8)
#define	DIFFMAP_BYTES_PER_ROW	((PP_FB_TILES_PER_LINE/DIFFMAP_BLOCKS_PER_BYTE)+2)
/* Since the Diff map can only be read as doubleword, to read the diiftable for max pixle width, the table should be read as 12bytes  per row*/

#define VSC_DIFFMAP_SIZE	(MAX_TILE_ROWS * DIFFMAP_BYTES_PER_ROW)




typedef struct {
	unsigned char	tiles[MAX_TILE_ROWS][DIFFMAP_BYTES_PER_ROW];
	/* Add 1 more row inorder to align the buffer to 32 byte boundary */
	/* For more information on why we need to align, see VSC_DIFFMAP_SIZE in lara.h */
} DIFFMAP_IN_TILES;

typedef struct {
	union{
		DIFFMAP_IN_TILES	block; /* 2 dimension array*/
		unsigned char	rawbuf[MAX_TILE_ROWS* DIFFMAP_BYTES_PER_ROW]; /* single dimension array */
	};
}VSC_DIFFMAP_BUF_T;

typedef union{
	DIFFMAP_IN_TILES	block; /* 2 dimension array*/
	unsigned char	vsc_diffmap[MAX_TILE_ROWS* DIFFMAP_BYTES_PER_ROW]; /* single dimension array */
}VSC_DIFFMAP;

/*Image buffer to capture the Image to send*/

/**
 * Video rectangular 
**/

typedef struct
{
	u_int16_t	 	x;
	//unsigned short x;
	u_int16_t 		y;
	//unsigned short y;
	u_int16_t		 width;
	//unsigned short height;
	u_int16_t		 height;
	//unsigned short width;
	u_int32_t       ctype;
	
	u_int32_t		 size;
	//unsigned long size;
	
} PACK rect_hdr_t;


typedef struct {
	unsigned short rawbuf[VSC_MAX_RES_Y][VSC_MAX_RES_X];/*2 dimension array for 16bit */
} IMAGEBUF_IN_16BIT;

typedef struct {
	
	unsigned char	rawbuf[VSC_MAX_RES_Y][ VSC_MAX_RES_X*2]; /*2 dimension array for 8bit */
	
}IMAGEBUF_IN_8BIT;

typedef struct{

	rect_hdr_t	rect_hdr;
#if 0
	union{
	
		IMAGEBUF_IN_16BIT	block16; /* 2 dimension array for 16 bit color*/
		IMAGEBUF_IN_8BIT	block8; /* 2 dimension array for 8 bit color*/
		unsigned char	vsc_diffmap[VSC_MAX_RES_X* VSC_MAX_RES_Y*2]; /* single dimension array */
	};
#endif
	//unsigned char	vsc_diffmap[VSC_MAX_RES_X* VSC_MAX_RES_Y*2]; /* single dimension array */
	unsigned char	vsc_diffmap[VSC_MAX_RES_X* VSC_MAX_RES_Y*3]; /* single dimension array */

}PACK IMAGE_BUF_T;


#endif


