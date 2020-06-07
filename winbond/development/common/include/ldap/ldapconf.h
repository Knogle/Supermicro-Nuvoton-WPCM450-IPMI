#ifndef _LDAP_H
#define _LDAP_H

#define		CFG_LDAP_ENABLE		1
#define		CFG_LDAP_DISABLE	0		

/* Role values */
#define		CFG_LDAP_ROLE_ADMIN		0
#define		CFG_LDAP_ROLE_OPERATOR		1

#define		DEFAULT_LDAP_PORT			389
/* LDAP configuration file */
#define		LDAP_CONFIG_FILE			"/conf/ldap.conf"
#define		LDAP_CONFIG_FILE_DISABLED		"/conf/ldap.conf.disabled"

/* config file key strings */
#define	LDAP_CFG_STR_IP_ADDRESS		"host"
#define	LDAP_CFG_STR_SEARCH_BASE	"base"
#define	LDAP_CFG_STR_BINDDN		"binddn"
#define	LDAP_CFG_STR_BINDPWD		"bindpw"
#define	LDAP_CFG_STR_BINDPWD		"bindpw"
#define LDAP_CFG_PORT_NUM		"port"
#define LDAP_CFG_PAM_PWD		"pam_password"
#define LDAP_CFG_NSS_RECONNECT_TRIES	"nss_reconnect_tries"

#pragma pack (1)
typedef struct {
	unsigned char Enable;
	unsigned short PortNum;
	unsigned char IPAddr[32];
	unsigned char Password[32];
	unsigned char BindDN[64];
	unsigned char SearchBase[64];
	unsigned char DefaultRole;
} LDAPCONFIG;
#pragma pack ()

int setldapconfig(LDAPCONFIG *);
int getldapconfig(LDAPCONFIG *);

#endif /* _LDAP_H */
