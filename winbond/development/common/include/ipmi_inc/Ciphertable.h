/****************************************************/
/* This file contain the cipher suite table 					*/
/*													*/
/*   													*/
/****************************************************/


#ifndef __CIPHERTABLE_H__
#define __CIPHERTABLE_H__
#define MAX_CIPHER_SUITES_BYTES     80

#define N0_OF_CIPHER_SUITE_SUPPORTED  9

/*** Global Variables ***/
const unsigned char  g_CipherRec [MAX_CIPHER_SUITES_BYTES] =
{
    /* Standard records */
/*- Start -- ID --- Auth --- Intgr - Conf-*/
    0xC0,   0x00,   0x00,   0x40,   0x80,
    0xC0,   0x01,   0x01,   0x40,   0x80,
    0xC0,   0x02,   0x01,   0x41,   0x80,
    0xC0,   0x03,   0x01,   0x41,   0x81,
    0xC0,   0x06,   0x02,   0x40,   0x80,
    0xC0,   0x07,   0x02,   0x42,   0x80,
    0xC0,   0x08,   0x02,   0x42,   0x81,
    0xC0,   0x0B,   0x02,   0x43,   0x80,
    0xC0,   0x0C,   0x02,   0x43,   0x81,
/*- Start --OEM-ID -- OEM-IANA - Auth --- Intgr - Conf-*/
};

#endif

