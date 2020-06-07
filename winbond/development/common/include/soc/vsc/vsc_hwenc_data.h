#ifndef _VSC_HWENC_DATA_H
#define _VSC_HWENC_DATA_H

/**
 * type describing rectangular
 * areas in the framebuffer
 */
typedef struct {
    u_int16_t x;
    u_int16_t y;
    u_int16_t w;
    u_int16_t h;
} vsc_rect_t;

#endif /* VSC_HWENC_DATA */
