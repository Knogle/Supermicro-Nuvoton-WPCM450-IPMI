#ifndef _PP_KERNEL_COMMON_H
#define _PP_KERNEL_COMMON_H

/* Property changes are transmitted as long,
 *    high word = signal number (below)
 *       low word  = parameter (optional, else 0)
 *
 * NOTE: Do not use a definition relative to SIGRTMAX since this value
 * 	 might differ between user and kernel space!
 */
#define SIGPROPCHG 53
typedef enum {
    /* must be the first! */
    PP_PROP_NONE,

    PP_PROP_PWR_ON,
    PP_PROP_PWR_OFF,
    PP_PROP_RST,
    PP_PROP_KVM_PORT_SWITCHED,
    PP_PROP_VIDEO_MODE_CHANGED,
    PP_PROP_VIDEO_SETTINGS_UPDATE,
    PP_PROP_AUTO_AUTO_ADJUSTMENT_DONE,
    PP_PROP_USB_DEV_STATE_CHANGED,
    PP_PROP_SWITCH_PRESSED,
    PP_PROP_CONFIGFS_CHANGED,
    PP_PROP_KVM_UNIT_ADD_OR_REMOVE,
    PP_PROP_KBD_LED_STATE_CHANGED,

    /* must be the last! */
    PP_PROP_COUNT
} pp_propchange_t;

/* state of the "set defaults" flag from boot code */
#define DEFAULTS_NONE			0
#define DEFAULTS_JUMPER			1
#define DEFAULTS_COMMAND		2

/* state of the "set defaults" flag from boot code */
#define DEFAULTS_NONE			0
#define DEFAULTS_JUMPER			1
#define DEFAULTS_COMMAND		2

/*
 * tile region data structures, used by kernel module
 * and the RFB library
 */

/**
 * Single rectangle the region data structures
 * consists of.
 * Pixel coordinates of top/left and bottom/right
 * corners. (0,0) is top/left, first address of
 * the framebuffer.
 */
typedef struct {
    short x1, y1, x2, y2;
} BoxRec, *BoxPtr;

/**
 * Region data, used if there is more than one
 * rectangle in a region.
 */
typedef struct _RegData {
    long size;          // number of rects memory is allocated for
    long numRects;      // actual number of rects in the region
    /* BoxRec rects[size];   in memory but not explicitly declared */    
} RegDataRec, *RegDataPtr;

/**
 * The Main Region structure
 * 
 * If there is only a single rect in the region the
 * 'data' pointer is empty and the 'extents' defines the rect.
 * If there are more rects, 'data' points to a valid
 * RegDataRec structure consisting of the rects and
 * 'extents' is the bounding box, the rect surrounding
 * the union of all rectangles.
 */
typedef struct _Region {
    BoxRec extents;      // if single rect, the rect itself, else bounding box
    RegDataPtr data;     // pointer to region data if more than one rect
} RegionRec, *RegionPtr;

#endif /* _PP_KERNEL_COMMON_H */

