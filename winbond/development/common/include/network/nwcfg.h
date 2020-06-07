#ifndef _NWCFG_H
#define _NWCFG_H

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <Types.h>

#ifdef __GNUC__
#define PACKED __attribute__ ((packed))
#else
#define PACKED
#pragma pack( 1 )
#endif

/* External dependencies */
#define	PROC_NET_ROUTE_FILE	"/proc/net/route"

#define DHCPD_CONFIG_FILE   "/conf/dhcpc-config"
#define DHCPD_CONFIG_FILE_TEMP      "/var/dhcp-config.tmp"
#define RESOLV_CONF_FILE    "/conf/resolv.conf"
#define RESOLV_CONF_FILE_TEMP    "/var/resolv.conf.tmp"
#define IFUP_BIN_PATH		"/sbin/ifup"
#define IFDOWN_BIN_PATH		"/sbin/ifdown"
#define ZERO_IP			"0.0.0.0"
#define DEFAULT_GW_STR		"0.0.0.0"
/* /etc/network/interfaces file defines */
#define NETWORK_IF_FILE		"/etc/network/interfaces"
#define AUTO_LOCAL_STR		"auto lo\n"
#define AUTO_LOCAL_LOOPBACK_STR	"iface lo inet loopback\n"
#define AUTO_ETH_STR		"auto eth0\n"
#define AUTO_ETH_DHCP_STR	"iface eth0 inet dhcp\n"
#define AUTO_ETH_STATIC_STR	"iface eth0 inet static\n"
#define IF_STATIC_IP_STR	"address"
#define IF_STATIC_MASK_STR	"netmask"
#define IF_STATIC_BCAST_STR	"broadcast"
#define IF_STATIC_GW_STR	"gateway"
#define IF_STATIC_MTU_STRING    "mtu"
#define DEFAULT_GW_FLAGS	0x0003
#define DEV_FILE	"/proc/net/dev"
#define VLANINTERFACES_FILE 	"/conf/vlaninterfaces"
#define VLANID_FILE "/conf/vlanid"
#define VLAN_NETWORK_FILE "/etc/init.d/vlannetworking start0"
#define VLAN_NETWORK_REMOVE_FILE "/etc/init.d/vlannetworking stop0"
#define VLAN_NETWORK1_FILE "/etc/init.d/vlannetworking start1"
#define VLAN_NETWORK1_REMOVE_FILE "/etc/init.d/vlannetworking stop1"
#define VLAN_NETWORK_IP_CONFIGFILE "/etc/init.d/vlannetworking enableip"

#define MAX_MAC_LEN 	64
#define MAC_ADDR_LEN	6
#define IP_ADDR_LEN	4
#define MAX_STR_LENGTH  20
#define ROUTE_GW_LENGTH 100

/* Type of network configuration */
#define CFGMETHOD_STATIC	1
#define CFGMETHOD_DHCP		2

#define NWCFGTYPE_STATIC        0x1
#define NWCFGTYPE_DHCP          0x2
#define NWCFGTYPE_DHCPFIRST     0x4

/*Interface enable state*/
#define NW_INTERFACE_ENABLE     0x1
#define NW_INTERFACE_DISABLE    0x2
#define NW_INTERFACE_UNKNOWN 	0x3

#define NW_AUTO_NEG_ON  0x1
#define NW_AUTO_NEG_OFF 0x2

#define NW_DUPLEX_FULL 0x1
#define NW_DUPLEX_HALF 0x2

/*DNS-DHCP enable state*/
#define NW_DNSDhcp_ENABLED  0x1
#define NW_DNSDhcp_DISABLED 0x2

/*DNS-Manual enable state*/
#define DNS_MANUAL_ENABLE   0x1
#define DNS_MANUAL_DISABLE  0x2

/*
 * NWSET FLAG: See nwSetNWExtIPCfg API
 */
#define NWEXT_IPCFG_INTFSTATE   0x1
#define NWEXT_IPCFG_CFGMETHOD   0x2
#define NWEXT_IPCFG_IP        	0x4
#define NWEXT_IPCFG_MASK        0x8
#define NWEXT_IPCFG_GW        	0x10
#define NWEXT_IPCFG_FBIP        0x20
#define NWEXT_IPCFG_FBMASK      0x40
#define NWEXT_IPCFG_FBGW        0x80
#define NWEXT_IPCFG_ALL (NWEXT_IPCFG_INTFSTATE \
						 | NWEXT_IPCFG_CFGMETHOD \
						 | NWEXT_IPCFG_FBIP \
						 | NWEXT_IPCFG_FBMASK \
						 | NWEXT_IPCFG_FBGW \
						 | NWEXT_IPCFG_IP \
						 | NWEXT_IPCFG_MASK \
						 | NWEXT_IPCFG_GW)

/*  Return code for nwSetNWExtIPCfg:
 *  If the implementation does not support a particular flag,
 *  then it should return NWCFG_NOT_SUPPORTED_XXXX, where XXXX=IPORIGIN,
 *  example NWCFG_NOT_SUPPORTED_IPORIGIN if say the implementation does
 *  not support DHCP first, static option. The implementation may
 *  not support returning multiple NOT SUPPORTED logically or.ed.
 */
#define NWEXT_IPCFG_INTFSTATE_NOT_SUPP   NWEXT_IPCFG_INTFSTATE
#define NWEXT_IPCFG_CFGMETHOD_NOT_SUPP   NWEXT_IPCFG_CFGMETHOD
#define NWEXT_IPCFG_IP_NOT_SUPP        	 NWEXT_IPCFG_IP
#define NWEXT_IPCFG_MASK_NOT_SUPP        NWEXT_IPCFG_MASK
#define NWEXT_IPCFG_GW_NOT_SUPP        	 NWEXT_IPCFG_GW
#define NWEXT_IPCFG_FBIP_NOT_SUPP        NWEXT_IPCFG_FBIP
#define NWEXT_IPCFG_FBMASK_NOT_SUPP      NWEXT_IPCFG_FBMASK
#define NWEXT_IPCFG_FBGW_NOT_SUPP        NWEXT_IPCFG_FBGW

/*
 * ETHSET FLAG: See nwSetNWExtEthCfg API
 */
#define NWEXT_ETHCFG_LAMAC      0x1
#define NWEXT_ETHCFG_BURNEDMAC  0x2
#define NWEXT_ETHCFG_SPEED      0x4
#define NWEXT_ETHCFG_DUPLEX     0x8
#define NWEXT_ETHCFG_AUTONEG    0x10
#define NWEXT_ETHCFG_MTU        0x20
#define NWEXT_ETHCFG_WOL        0x40
#define NWEXT_ETHCFG_ALL (NWEXT_ETHCFG_LAMAC \
						 	| NWEXT_ETHCFG_BURNEDMAC \
						 	| NWEXT_ETHCFG_SPEED \
						 	| NWEXT_ETHCFG_DUPLEX \
						 	| NWEXT_ETHCFG_AUTONEG \
						 	| NWEXT_ETHCFG_MTU \
						 	| NWEXT_ETHCFG_WOL)

/*
 * Return code for nwSetNWExtEthCfg:
 */
#define NWEXT_ETHCFG_LAMAC_NOT_SUPP 	 NWEXT_ETHCFG_LAMAC
#define NWEXT_ETHCFG_BURNEDMAC_NOT_SUPP  NWEXT_ETHCFG_BURNEDMAC
#define NWEXT_ETHCFG_SPEED_NOT_SUPP	     NWEXT_ETHCFG_SPEED
#define NWEXT_ETHCFG_DUPLEX_NOT_SUPP     NWEXT_ETHCFG_DUPLEX
#define NWEXT_ETHCFG_AUTONEG_NOT_SUPP    NWEXT_ETHCFG_AUTONEG
#define NWEXT_ETHCFG_MTU_NOT_SUPP        NWEXT_ETHCFG_MTU
#define NWEXT_ETHCFG_WOL_NOT_SUPP        NWEXT_ETHCFG_WOL


/*Used to check the flag status*/
#define CHECK_FLAG(in,level) ((in&level) == level)

/*Used to set flag value*/
#define SET_FLAG(out,level) (out|=level)



#pragma pack (1)
typedef struct{
	unsigned char CfgMethod; /* This field can either be NWCFGTYPE_DHCP or NWCFGTYPE_STATIC */
	unsigned char MAC[6];
	unsigned char Local_MAC[6];
	unsigned char IPAddr[4];
	unsigned char Broadcast[4];
	unsigned char Mask[4];
	unsigned char Gateway[4];
	unsigned char  BackupGateway[4];
	  /* If interface is enabled, value is
     * NW_INTERFACE_ENABLE otherwise NW_INTERFACE_DISABLE
     */
    unsigned char enable;
	unsigned char IFName[10];
	unsigned short VLANID;
} PACKED NWCFG_STRUCT;
#pragma pack ()

typedef struct{
	NWCFG_STRUCT NwInfo[10];
	int IFCount;
} PACKED NWCFGS;

typedef struct
{
    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    unsigned long speed;

    /* This field can either be NW_DUPLEX_FULL or NW_DUPLEX_HALF */
    unsigned int duplex;

    /* This field can either be  NW_AUTO_NEG_ON or NW_AUTO_NEG_OFF,
     * Auto negotiation is applicable for both speed & duplex.
     */
    unsigned int autoneg;

    /*Max transmission unit*/
    unsigned long maxtxpkt;

    unsigned long wolsupported;
    unsigned long wolopts;

} PACKED ETHCFG_STRUCT;

typedef struct{
        ETHCFG_STRUCT EthInfo[10];
} PACKED ETHCFGS;


typedef struct{

    /* Name of the interface, example: eth0, eth1, ethernet,...*/
    char IFName[10];

    /*
     * This field can either be NWCFGTYPE_DHCP or
     * NWCFGTYPE_STATIC or NWCFGTYPE_DHCPFIRST
     */
    unsigned char CfgMethod;

    /*
     *  If interface is enabled, value is NW_INTERFACE_ENABLE
     *  otherwise NW_INTERFACE_DISABLE
     */
    unsigned char Enable;

    /*
     * Current IP Origin NWCFGTYPE_DHCP or NWCFGTYPE_STATIC
     */
    unsigned char IPOrigin;

    /*
     * IP assigned: If IPOrgin is DHCP, then this is DHCP IP,
     * if the IPOrigin is Static, then this is Static IP address
     */
    unsigned char IPAddr[4];
    unsigned char Mask[4];
    unsigned char Gateway[4];

    /*
     *  Manually configured Fall back (FB) IP
     */
    unsigned char FB_IPAddr[4];
    unsigned char FB_Mask[4];
    unsigned char FB_Gateway[4];

} PACKED NWEXT_IPCFG;


typedef struct
{
    /*Burned-in MAC address*/
    unsigned char BurnedMAC[6];

    /* Locally admin-MAC: Setting Local MAC to other than 00:00:00:00:00:00
     * makes it as current MAC. If a platform does not support. If this is
     * non-zero then this is current MAC while getting
     */
    unsigned char Local_MAC[6];

}PACKED NWEXT_MACCFG;


typedef struct
{

    /* MAC Configuration */
    NWEXT_MACCFG mac_cfg;

    /* Ethernet Configuration */
    ETHCFG_STRUCT eth_cfg;

} PACKED NWEXT_ETHCFG;



//#pragma pack ()

/* Functions to read/write current network status */
int nwReadNWCfg(NWCFG_STRUCT *cfg,INT8U EthIndex);
int nwReadNWCfgs(NWCFGS *cfg, ETHCFGS *ethcfg);
int nwGetEthInformation(ETHCFG_STRUCT *ethcfg, char * IFName);
int nwSetEthInformation(unsigned long speed, unsigned int duplex, char * IFName);
int nwWriteNWCfg(NWCFG_STRUCT *cfg,INT8U  EthIndex);
int nwWriteNWCfgNoUpDown(NWCFG_STRUCT *cfg);

int nwSetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
int nwGetBkupGWyAddr(unsigned char *ip,INT8U EthIndex);
/* One should pass the buffer of size MAX_MAC_LEN to the following function */
int nwGetMACAddr(char *MAC);
int nwSetMACAddr(char *MAC);
int nwSetGateway(INT8U* GwIP,INT8U EthIndex);
int nwDelExistingGateway(INT8U EthIndex);


//internally used structure!! But may come in from the IPMI stack!!

#define DNSCFG_MAX_DOMAIN_NAME_LEN 256 //wiht null
#define DNSCFG_MAX_RAC_NAME_LEN    64

typedef struct
{
    unsigned char DNSDhcpEnable;
    struct in_addr DNSServer1;
    struct in_addr DNSServer2;
	struct in_addr DNSServer3;
    unsigned char DNSRegisterRac;
    unsigned char DNSRacNameLength;
    unsigned char DNSRacName[DNSCFG_MAX_RAC_NAME_LEN]; //this can/ may be changed to be not fixed and instead variable.
                                    //but better to retain it as fixed
    unsigned char DNSDomainNameDhcpEnable;
    unsigned char DNSDomainNameLength;
    unsigned char DNSDomainName[DNSCFG_MAX_DOMAIN_NAME_LEN]; //this can/maybe changed to be not fixed 

}  PACKED DNS_CONFIG;

typedef struct
{
    unsigned char dnsEnable;
    unsigned char manualDNSDomain1Length;
	unsigned char manualDNSDomainName1[DNSCFG_MAX_DOMAIN_NAME_LEN];
	unsigned char manualDNSDomain2Length;
	unsigned char manualDNSDomainName2[DNSCFG_MAX_DOMAIN_NAME_LEN];
    struct in_addr manualDNSServer1;
    struct in_addr manualDNSServer2;
    struct in_addr manualDNSServer3;

} PACKED MANUAL_DNS_CONFIG;


//DNS related
int nwGetDNSConf(unsigned char* UseDHCPForDNS,unsigned char* UseDHCPForDomain,unsigned char* DoDDNS);
int nwSetDNSConf(unsigned char UseDHCPForDNS,unsigned char UseDHCPForDomain, unsigned char DoDDNS);
int nwGetResolvConf(char* DNS1,char*DNS2,char* domain,unsigned char* domainnamelen);
int nwSetResolvConf(char* dns1,char* dns2,char* domain);

int nwGetNWInformations(NWCFG_STRUCT *cfg,char *IFName);

int nwGetAllDNSCfg(DNS_CONFIG* dnscfg);
int nwSetAllDNSCfg(DNS_CONFIG* dnscfg);
int nwSetAllDNSCfgNoRestart(DNS_CONFIG* dnscfg);

int nwMakeIFDown(INT8U EthIndex);
int nwMakeIFUp(INT8U  EthIndex);
void InitNwCfgInfo();
extern void GetNwCfgInfo(void);
extern int GetNoofInterface(void);
int nwGetDHCPServerIP(char *dhcpServerIP);

/* Extended API for network*/
int nwSetExtEthInformation(ETHCFG_STRUCT *ethcf, char * IFName, int SetFlag);
int nwGetManualDNSCfg(MANUAL_DNS_CONFIG *dnscfg);
int nwSetManualDNSCfg(MANUAL_DNS_CONFIG *dnscfg);
int nwUpdateManualDNSEnable(unsigned char dnsEnable);
int nwGetNWExtIPCfg(NWEXT_IPCFG *cfg);
int nwSetNWExtIPCfg (NWEXT_IPCFG *cfg, int nwSetFlag);
int nwGetExtIPCaps(void);
int nwGetNWExtEthCfg(NWEXT_ETHCFG *cfg);
int nwSetNWExtEthCfg(NWEXT_ETHCFG *cfg, int nwSetFlag);
int nwGetExtEthCaps(void);
int nwGetCfgMethodCaps(void);
int nwGetNWInterfaceStatus(void);
int GetHostEthbyIPAddr(char *IPAddr);
int nwGetSrcMacAddr(INT8U* IpAddr,INT8U EthIndex,INT8U *MacAddr);
INT8U GetEthIndex(INT8U Channel);
int nwSetHostName(char *name);
int nwGetHostName(char *name);
int nwUpdateVLANInterfaces(void);
#endif /* _NW_CFG_H */

