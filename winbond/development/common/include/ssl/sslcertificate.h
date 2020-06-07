/****************************************************************
 ****************************************************************
 **                                                            **
 **    (C)Copyright 2002-2003, American Megatrends Inc.        **
 **                                                            **
 **            All Rights Reserved.                            **
 **                                                            **
 **        6145-F, Northbelt Parkway, Norcross,                **
 **                                                            **
 **        Georgia - 30071, USA. Phone-(770)-246-8600.         **
 **                                                            **
 ****************************************************************
 ****************************************************************/
/****************************************************************
  $Header: $

  $Revision: $

  $Date: $
 *****************************************************************/
/*****************************************************************
 * File name    : sslcertificate.h
 * Author       : Anandh Mahalingam
 * Created      : Oct 16, 2003
 * SSL certificate declarations
 *****************************************************************/

#ifndef SSLCERTIFICATE_INCLUDED
#define SSLCERTIFICATE_INCLUDED


/*  Actual SSL certificate location */
/*  GoAhead can use this while starting to look for actual
    certificate files.
    CURI client and GoAhead can use this for uploading the
    certificate and key file to the card.
 */
#define DEFAULT_CERT_FILE   "/usr/local/www/certs/server.pem"
#define DEFAULT_KEY_FILE    "/usr/local/www/certs/privkey.pem"

#define CERT_BASE_LOCATION  "/etc/"
#define CONF_LOCATION  "/conf/"
#define ACTUAL_CERT_FILE    CERT_BASE_LOCATION "actualcert.pem"
#define ACTUAL_KEY_FILE     CERT_BASE_LOCATION "actualprivkey.pem"
#define ACTUAL_CA_FILE      CERT_BASE_LOCATION "actualcert.pem"
#define ACTUAL_CA_PATH      CERT_BASE_LOCATION
#define ACTUAL_AD_CA_FILE	    CERT_BASE_LOCATION "active_dir_ca_file.pem"

#define ACTUAL_CSR_FILE	    CONF_LOCATION "server.csr"

#define TEMP_ASCII_CERT		"/var/certtmp"
#define TEMP_ASCII_CAFILE		"/var/catmp"

#define CONF_CERT_FILE    CONF_LOCATION "actualcert.pem"
#define CONF_KEY_FILE     CONF_LOCATION "actualprivkey.pem"
#define CONF_AD_CA_FILE	  CONF_LOCATION "active_dir_ca_file.pem"

#define CSR_GEN_CONFIG_FILE	"/var/sslconf"


/* SSL encrypted file identifier  */
#define SSL_ENCRYPTED_IDENTIFIER  "ENCRYPTED"

/*  We expect the certificate and key file to be less than 8KB
    in size
 */
#define MAX_PERMITTED_CERT_SIZE     (8*1024)
#define MAX_PERMITTED_PRIVKEY_SIZE  (8*1024)


#endif  /*  SSLCERTIFICATE_INCLUDED */

 /************************* End of File ****************************/


