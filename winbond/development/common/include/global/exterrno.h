#ifndef __ICC_ERRNO_H__
#define __ICC_ERRNO_H__



/*The main purpose of this errrno file is to sync properly with
existing Linux/Unix  error codes to acheive consistency.
For e.g: There are many cases in which standard error codes are required
and it is best to use them like EPERM. However in some cases, the standard error
numbers do not suffice. For e.g: One may wish to give a detailed error saying User
is not part of group
In order to gracefully extend the error codes ,we stick to using the same errno set
as stad errno.h and then have one place where everyone can extend these error codes
appropriately to add new errors.
Be very judicious about usage of errors and dont have multiple entries for the same kind of
error unless protocl requirements change the value*/

/**what about other protocols like SNMP etc?
Ok. The main cosideration is - Is some known cllaer interpreting
the error code?
If so use these errors as a standard base.
If the caller at the other end follows a protocol , there needs to be translation
For e.g: AN IPMI style function to get Sensor Readings should follow
IPMI error conventions when responding to the protocol
**/


/*********************All standard errors********************/
#include <errno.h>
/*********************All standard errors********************/


/******************General errors extended by us************/
/*this identifies all our extended errors to have bit 11 set*/
#define _ERR_PROTO_EXTEND     (0x400)
#define EXTENDED_ERROR(x)    ((x)| (_ERR_PROTO_EXTEND))


#define EVERSION             EXTENDED_ERROR(1)        /*will equate to 1025*/ /*version mismatch*/
#define EGENERAL             EXTENDED_ERROR(2)        /*will equate to 1026*/ /*general error*/
#define EAUTH                EXTENDED_ERROR(3)        /*authorization failed*/
#define ENEEDAUTH            EXTENDED_ERROR(4)        /*Authorization is needed and hasnt been obatined*/
#define ECANCEL              EXTENDED_ERROR(5)        /*operation was cancelled*/
#define EARGCOUNTLESS        EXTENDED_ERROR(6)        /*Argument count is less han that reqd for op*/
#define EARGCOUNTMORE        EXTENDED_ERROR(7)        /*arg count is more than that required for args*/
#define EHANDLE              EXTENDED_ERROR(8)        /*Invalid handle*/
#define ENULL                EXTENDED_ERROR(9)        /*??*/
#define ERDONLY              EXTENDED_ERROR(10)       /*write op on a readonly entity*/
#define EFILEOPEN            EXTENDED_ERROR(11)       /*error opening file*/
#define EFILEREAD            EXTENDED_ERROR(12)       /*error reading file*/
#define EFILEWRITE           EXTENDED_ERROR(13)       /*error writing file*/
#define ECHKSUM              EXTENDED_ERROR(14)       /*checksum error*/
#define ENOSUCHGRP           EXTENDED_ERROR(15)       /*no such group*/
#define ENOSUCHUSER          EXTENDED_ERROR(16)       /*no such user*/
#define ENOSUCHUSERINGRP     EXTENDED_ERROR(17)       /*no such user in group*/
#define EARGLENGTHBIG        EXTENDED_ERROR(18)       /*arg length is too big*/
#define EARGLENGTHSMALL      EXTENDED_ERROR(19)       /*arg length too small*/
#define EROOT                EXTENDED_ERROR(20)       /*user is root*/
#define EUNKNOWNSVC          EXTENDED_ERROR(21)       /*service is unrecognized*/
#define EUPLOADSIZE          EXTENDED_ERROR(22)       /*File upload size mismatch*/
#define EINVALIDINPUT        EXTENDED_ERROR(23)       /*Invalid input*/
#define EINVALIDPASSWD       EXTENDED_ERROR(24)       /*Invalid password*/
#define EINVALIDUSERCHARS    EXTENDED_ERROR(25)       /*Invalid chars in username*/
#define EINVALIDUSERSTART    EXTENDED_ERROR(26)       /*Username must start with alphabet*/
#define EINVALIDUSERLEN      EXTENDED_ERROR(27)       /*Invalid username length*/
#define EINVALIDNETMASK      EXTENDED_ERROR(28)       /*Invalid netmask*/
#define EINVALIDPORT         EXTENDED_ERROR(29)       /*Invalid port number*/
#define EINVALIDIP           EXTENDED_ERROR(30)       /*Invalid IP*/
#define EINVALIDEMAIL        EXTENDED_ERROR(31)       /*Invalid email address*/
#define EINVALIDGATEWAY      EXTENDED_ERROR(32)       /*Invalid gateway*/
#define EINVALIDDATE         EXTENDED_ERROR(33)       /*Invalid date/time*/
#define EINVALUSERDESCLEN    EXTENDED_ERROR(34)       /*User description is too long*/
#define EBMCNOTRESPONDING    EXTENDED_ERROR(35)       /*BMC is not responding*/
#define EI2CNOTRESPONDING    EXTENDED_ERROR(36)       /*I2C device is not responding*/
#define EPOWERCONTROLFAILED  EXTENDED_ERROR(37)       /*Failure on reboot/power on/off*/
#define EHOSTPOWERSTATUS     EXTENDED_ERROR(38)       /*Cannot determine host power status*/
#define EINVALIDUSERDESC     EXTENDED_ERROR(39)       /*Invalid user description*/
#define EIMGVERIFYFAIL	     EXTENDED_ERROR(40)       /*Image verification failure*/
#define EMTDOPEN		     EXTENDED_ERROR(41)       /*MTD device open failure*/
#define EIMGINFO		     EXTENDED_ERROR(42)       /*Get Image Info failure*/
#define EIMGNAMECOMP	     EXTENDED_ERROR(43)       /*Image name comparison failure*/
#define EFILESCAN            EXTENDED_ERROR(44)       /*error scanning file*/
#define EBLKREAD	         EXTENDED_ERROR(45)       /*error reading block*/
#define EIMGREAD	         EXTENDED_ERROR(46)       /*error reading image*/
#define EFMHSCAN	         EXTENDED_ERROR(47)       /*error scanning for FMH*/

#define  _ERR_PROTO_EXTEND_LAST_ERROR  EXTENDED_ERROR(47)

/*If you want oa dd string desscriptions for your errors that will be shown by
strerror_x then go to exterrno.c in libami and add your string to the end
of the global lookup table array*/

/*if you want to add a new extended error add it using the macros above
  and maintain consecutiveness**/
/******************General errors extended by us************/


/*****************Other Protocol specific errors**************/
/*create your own proto bit here
then define a macro that will or this proto bit given any error
num. Then define all your error codes using that macro*/
/*****************Other Protocol specific errors**************/



/******************Synonyms meant to be used as protocol specific names etc********************/
/*Now we change all CURI errors to be the same as standard errors or extended std errors*/
#define CURI_ESUCCESS        0x0000

/*  Set the error numbers by direct values instead of referring to std error definitions.
    Refering std error definitions will lead to problem when compiling in other operating
    systems, particularly while compiling LIBCURI & CURI Client in Windows platforms
*/
#define CURI_EPERM           1      /*  EPERM       */
#define CURI_EAGAIN          11     /*  EAGAIN      */
#define CURI_EBUSY           16     /*  EBUSY       */
#define CURI_EINTR           4      /*  EINTR       */
#define CURI_EINPROGRESS     115    /*  EINPROGRESS */
#define CURI_ESHUTDOWN       108    /*  ESHUTDOWN   */
#define CURI_EACCES          13     /*  EACCES      */
#define CURI_EEXIST          17     /*  EEXIST      */
#define CURI_ENOENT          2      /*  ENOENT      */
#define CURI_ENOMEM          12     /*  ENOMEM      */
#define CURI_ENOSPC          28     /*  ENOSPC      */
#define CURI_ENODEV          19     /*  ENODEV      */
#define CURI_EIO             5      /*  EIO         */
#define CURI_EFAULT          14     /*  EFAULT      */
#define CURI_ENFILE          23     /*  ENFILE      */
#define CURI_ETIME           62     /*  ETIME       */
#define CURI_EDEADLK         35     /*  EDEADLK     */
#define CURI_ERANGE          34     /*  ERANGE      */
#define CURI_EINVAL          22     /*  EINVAL      */
#define CURI_ENOBUFS         105    /*  ENOBUFS     */
#define CURI_EOPNOTSUPP      95     /*  EOPNOTSUPP  */
#define CURI_ENOTCONN        107    /*  ENOTCONN    */
#define CURI_ECHKSUM         ECHKSUM
#define CURI_EGENERAL        EGENERAL
#define CURI_EVERSION        EVERSION
#define CURI_EOVERFLOW       75     /*  EOVERFLOW   */
/******************Synonyms meant to be used as protocol specific names etc********************/




/***************************Function prototypes************************************************/
const char* strerror_x(int errnum);

/***************************Function prototypes************************************************/

#endif
