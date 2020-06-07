# *****************************************************************************
# Generic Linux Files needed to bring up the system
# *****************************************************************************

#
#Standard Executables
#
./bin/mount
./bin/umount
./bin/grep
./bin/egrep
./bin/readlink
./bin/sed
./bin/netstat
./sbin/init
./sbin/getty
./sbin/syslogd
./sbin/klogd
./sbin/start-stop-daemon
./sbin/killall5
./sbin/halt
./sbin/shutdown
./usr/bin/find
./usr/bin/logger
./usr/bin/gawk
./usr/sbin/logrotate
./usr/sbin/cron
./usr/sbin/ntpdate
./usr/sbin/stunnel4
./usr/sbin/dropbearmulti

./sbin/mii-tool
./sbin/iptables
#./usr/sbin/in.telnetd

./etc/ssh/moduli
./usr/sbin/sshd
#./usr/bin/ssh-keygen
./etc/init.d/ssh
./etc/init.d/ssh_bg
./etc/ssh/sshd_config
#./etc/init.d/sshkey

#
# Device MAKEDEV utility
#
./sbin/MAKEDEV

#
#Startup Scripts
#
./etc/inittab
./etc/init.d/rc
./etc/init.d/bootclean.sh
./etc/init.d/sysklogd
./etc/init.d/module-init-tools
./etc/init.d/mountall.sh
./etc/init.d/ifupdown
./etc/init.d/networking
./etc/init.d/vlannetworking
#./etc/init.d/vlanconfig
./etc/init.d/bootmisc.sh
./etc/init.d/sendsigs
./etc/init.d/umountnfs.sh
./etc/init.d/reboot
./etc/init.d/halt
./etc/init.d/single

# if you remove cron remove libgcc_s also
./etc/init.d/cron


#
# /etc stuff
#
./etc/default/devpts
./etc/modules
./etc/network/options
./etc/login.defs
./etc/pam.conf
./etc/services
./etc/protocols
./etc/host.conf
./etc/nsswitch.conf
./etc/pam.d/login
./etc/pam.d/cron
./etc/pam.d/common-auth
./etc/pam.d/common-account
./etc/pam.d/common-password
./etc/pam.d/common-session
./etc/pam.d/other
./etc/pam.d/samba


#
# Standard Libraries 
#
./lib/ld-2.3.2.so
./lib/libc-2.3.2.so
./lib/ld-2.3.2.so
./lib/libdl-2.3.2.so
./lib/libgcc_s.so.1
./lib/libcrypt-2.3.2.so
./lib/libpam.so.0.76
./lib/security/pam_unix.so
./lib/security/pam_limits.so
./lib/security/pam_env.so
./lib/security/pam_nologin.so
./lib/libm-2.3.2.so
./lib/libblkid.so.1.0
./lib/libpopt.so.0.0.0
./lib/libuuid.so.1.2
./lib/libpthread-0.10.so

#The following three neeed to resolve name
./lib/libnss_files-2.3.2.so
./lib/libnss_dns-2.3.2.so
./lib/libnss_ldap-2.3.2.so
./lib/libresolv-2.3.2.so

./usr/lib/libz.so.1.2.2
./usr/lib/libcrypto.so.0.9.7
./lib/libwrap.so.0.7.6
./lib/libnsl-2.3.2.so
./lib/libutil-2.3.2.so
./usr/lib/libssl.so.0.9.7
./usr/lib/libjpeg.so.62.0.0

#
#  LDAP Libraries
#

./usr/lib/libldap_r.so.2
./usr/lib/liblber.so.2
./usr/lib/libsasl2.so.2
./usr/lib/libgnutls.so.11
./usr/lib/libtasn1.so.2
./usr/lib/libgcrypt.so.11
./usr/lib/libgpg-error.so.0


# *****************************************************************************
# Ractrends Common Files
# *****************************************************************************
#
# IPMI Stack Files
#
./usr/local/bin/IPMIMain
./usr/local/bin/LAN
./usr/local/bin/MsgHndlr
./usr/local/bin/KCS
./usr/local/bin/Timer
#./usr/local/bin/Serial
./usr/local/bin/SOL
./usr/local/bin/USB
#./usr/local/bin/Terminal
#./usr/local/bin/ChassisCtrl
#./usr/local/bin/ChassisTimer
./usr/local/bin/IPMB
./usr/local/lib/libPDKAPI.so.1.0
./usr/local/lib/libPDK.so.1.0
./usr/local/lib/libPDKFlash.so.1.0
./usr/local/lib/libPDKCmd.so.1.0
#./usr/local/lib/libSTACKCommon.so.1.0
./usr/local/lib/libipmihalapi.so.1.0
./usr/local/lib/libipmihalhw.so.1.0
./usr/local/lib/libPAR.so.1.0	
./usr/local/lib/libsmtp.so.1.0
./usr/local/lib/libpamipmi.so.1.0
./etc/init.d/ipmistack

#
# Flasher 
#
./usr/local/bin/flasher
./etc/init.d/flasher

#
# Smash related files
#
#./etc/Commands.conf
#./usr/local/bin/smash
#./etc/smashclp.bnf

#
# WSMAN Releted Files
#
#./usr/local/lib/libOEMTestTarget.so.1.0
#./usr/local/lib/libOEMTestCommand.so.1.0
#./usr/local/lib/libDOMParser.so.1.0
#./usr/local/lib/libwsman.so.1.0
#./usr/local/lib/libLan.so.1.0
#./usr/local/lib/libLog.so.1.0
#./usr/local/lib/libSensor.so.1.0
#./usr/local/lib/libSystem.so.1.0
#./usr/local/lib/libUser.so.1.0
#./usr/local/lib/libWSDL1.1.so.1.0

#
# Redirection Releated files
#
./usr/local/bin/cdserver
./usr/local/bin/fdserver
./usr/local/lib/libhidconf.so.1.0
#./usr/local/lib/libredircfg.so.1.0
./usr/local/lib/liblogin.so.1.0
./usr/local/lib/libminilzo.so.1.0
./etc/init.d/webgo
./etc/init.d/cdserver
./etc/init.d/fdserver
#./etc/init.d/adviserd
./etc/init.d/kvm_servers
#./etc/init.d/vmedia_servers
./usr/local/bin/adviserd
./etc/init.d/ntpdate

#
# WEB Interface files
#
./usr/local/lib/libifc_ipmi.so.1.0
./usr/local/lib/libifc_flasher.so.1.0
./usr/local/lib/libifc_misc.so.1.0
./usr/local/lib/libifc_login.so.1.0
./etc/pam.d/webauthldap
./lib/security/pam_ldap.so
./usr/local/bin/webgo
./usr/local/lib/libldap-2.3.so.0
./usr/local/lib/liblber-2.3.so.0
./etc/init.d/ntpdate

# 
# General Purpose libraries
# 
./usr/local/lib/libami.so.1.0
./usr/local/lib/libuserm.so.1.0
./usr/local/lib/libipmi.so.1.0
./usr/local/lib/libgpio.so.1.0
./usr/local/lib/libi2c.so.1.0
./usr/local/lib/libpwmtach.so.1.0
./usr/local/lib/libsensors.so.1.0
./usr/local/lib/libldapauth.so.1.0
./usr/local/lib/libadc.so.1.0
./usr/local/lib/libmmap.so.1.0
./usr/local/lib/libpeci.so.1.0
./usr/local/lib/libmisc.so.1.0
./usr/local/lib/libsnoop.so.1.0

#
# Misc files
#
./usr/local/bin/defaulthost
./usr/local/bin/i2c-test
./usr/local/bin/gpiotool
./usr/local/bin/pwmtachtool
./usr/local/bin/adcapp
./usr/local/bin/snoop
./usr/local/bin/smcapp

#
# Ractrends Common Flasher related scripts
#
./usr/local/bin/cpConf
./usr/local/bin/mkMiniMe
./etc/init.d/prepfl
./etc/init.d/stopgc
./etc/init.d/forcekill
./etc/init.d/initcomplete
./etc/init.d/flumount



#----------------------------------------------
# Driver Modules
#
./lib/modules/2.6.24-ami/misc/helper.ko
./lib/modules/2.6.24-ami/misc/i2c-core.ko
./lib/modules/2.6.24-ami/misc/i2c-algo-hermon.ko
./lib/modules/2.6.24-ami/misc/i2c-dev.ko
./lib/modules/2.6.24-ami/misc/i2c-hermon.ko
./lib/modules/2.6.24-ami/misc/kcs.ko
#./lib/modules/2.6.24-ami/misc/gpio.ko
./lib/modules/2.6.24-ami/misc/peci.ko
#./lib/modules/2.6.24-ami/misc/pwmtach.ko
#./lib/modules/2.6.24-ami/misc/miscctrl.ko
./lib/modules/2.6.24-ami/misc/adc.ko

./lib/modules/2.6.24-ami/misc/usbe.ko
./lib/modules/2.6.24-ami/misc/videocap.ko
./lib/modules/2.6.24-ami/misc/gpio.ko
./lib/modules/2.6.24-ami/misc/pwmtach.ko
./lib/modules/2.6.24-ami/misc/smcdrv.ko
./lib/modules/2.6.24-ami/misc/ncsi.ko
./lib/modules/2.6.24-ami/misc/wdt.ko

#
# Project Specific files
#
./usr/local/bin/bioscode
./usr/local/bin/peciapp


#--------------------------------------------------------------------------
#			  CIM Based SMASH WSMAN
#-----------------------------------------------------------------------



#CIM Application files
./usr/local/cim/usr/local/bin/cimdiscovery 									1	P3
./usr/local/cim/usr/local/bin/smashclp									1	P3
#./etc/smash-cim.ini										1	P3
./usr/local/cim/etc/dmi1.bin											1	P3
#ini file for libPetToPem 
./usr/local/cim/PetToPem.ini										1	P3

# CIM Library files
./usr/local/cim/usr/local/lib/libwsman.so.1.0									1	P3
./usr/local/cim/usr/local/lib/libXMLParser.so.1.0 								1	P3
./usr/local/cim/usr/local/lib/libCIM-Client.so.1.0 								1	P3
./usr/local/cim/usr/local/lib/liblocalcimclient.so.1.0							1	P3
./usr/local/cim/usr/local/lib/libinihandler.so.1.0 								1	P3
./usr/local/cim/usr/local/lib/libiniparser.so.1.0								1	P3
./usr/local/cim/usr/local/lib/libdmiinfo.so.1.0 								1	P3
./usr/local/cim/usr/local/lib/libCimPermission.so.1.0								1	P3
./usr/local/cim/usr/local/lib/libAuthentication.so.1.0								1	P3
./usr/local/cim/usr/local/lib/libPetToPem.so.1.0								1	P3
./usr/local/cim/usr/local/lib/librtlog.so.1.0								1	P3

# SFCB Libraries 
./usr/local/cim/usr/local/lib/libsfcBasicAuthentication.so.0.0.0						1	P3
./usr/local/cim/usr/local/lib/libsfcBrokerCore.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcCertificateAuthentication.so.0.0.0					1	P3
./usr/local/cim/usr/local/lib/libcimcClientSfcbLocal.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcCimXmlCodec.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcClassProviderGz.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcClassProviderMem.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcClassProvider.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcFileRepository.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcHttpAdapter.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcIndCIMXMLHandler.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcInternalProvider.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcInteropProvider.so.0.0.0							1	P3
./usr/local/cim/usr/local/lib/libsfcInteropServerProvider.so.0.0.0						1	P3
./usr/local/cim/usr/local/lib/libsfcObjectImplSwapI32toP32.so.0.0.0						1	P3
./usr/local/cim/usr/local/lib/libsfcQualifierProvider.so.0.0.0						1	P3
./usr/local/cim/usr/local/lib/libsfcUtil.so.0.0.0								1	P3

#www files - for wsman cimbinding
./usr/local/cim/usr/local/www/cim/cimenum.html  						1   P3
./usr/local/cim/usr/local/www/cim/cimenum.js						 	1	P3	
./usr/local/cim/usr/local/www/cim/cimprofile.html						1	P3
./usr/local/cim/usr/local/www/cim/cimprofile.js							1	P3

./usr/local/cim/usr/local/www/cim/images/ami.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/corner_lr.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_bottom.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_ul_small.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner_gray.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/ami_logo.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/corner_ul.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_bottom_grey.gif		1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_ur.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner_gray.jpg			1	P3
./usr/local/cim/usr/local/www/cim/images/assocclass16.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/corner_ur.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_left.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_ur_small.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner_green.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/blueball.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/filler.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_ll.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/profileclass_obj.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner_green.jpg			1	P3
./usr/local/cim/usr/local/www/cim/images/border_bottom.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/grey_bg.gif					1	P3	
./usr/local/cim/usr/local/www/cim/images/page_edge_ll_grey.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/project.gif					1	P3	
./usr/local/cim/usr/local/www/cim/images/top_banner_lightGray.gif		1	P3
./usr/local/cim/usr/local/www/cim/images/border_left.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/head_bg.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_lr.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/spacer.gif						1	P3		
./usr/local/cim/usr/local/www/cim/images/top_banner_lightGray.jpg		1	P3
./usr/local/cim/usr/local/www/cim/images/border_right.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/help.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_lr_grey.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/table_bg.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/top_bg.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/border_top.gif					1	P3	
./usr/local/cim/usr/local/www/cim/images/image.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_right.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/tinylogo.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/treeview.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/bottom.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/instance_obj.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_top.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner_blue.gif			1	P3
./usr/local/cim/usr/local/www/cim/images/user.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/class_obj.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/logo.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_top_small.gif		1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner_blue.jpg			1	P3
./usr/local/cim/usr/local/www/cim/images/walk_assoc_obj.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/corner_ll.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/logout.gif						1	P3
./usr/local/cim/usr/local/www/cim/images/page_edge_ul.gif				1	P3
./usr/local/cim/usr/local/www/cim/images/top_banner.gif					1	P3
./usr/local/cim/usr/local/www/cim/images/water.jpg						1	P3

./usr/local/cim/usr/local/www/cim/styles/style_blue.css					1	P3
./usr/local/cim/usr/local/www/cim/styles/style.css						1	P3
./usr/local/cim/usr/local/www/cim/styles/style_gray.css					1	P3
./usr/local/cim/usr/local/www/cim/styles/style_green.css				1	P3
./usr/local/cim/usr/local/www/cim/styles/style_lightGray.css			1	P3
		
./usr/local/cim/usr/local/www/cim/wsman/catalog.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/debug.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/eventing.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/resource.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/soap.js							1	P3
./usr/local/cim/usr/local/www/cim/wsman/WSDLOperation.js				1	P3
./usr/local/cim/usr/local/www/cim/wsman/XML.js							1	P3
./usr/local/cim/usr/local/www/cim/wsman/debug.html						1	P3
./usr/local/cim/usr/local/www/cim/wsman/Enumeration.js					1	P3
./usr/local/cim/usr/local/www/cim/wsman/network.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/schema.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/wsdl.js							1	P3
./usr/local/cim/usr/local/www/cim/wsman/wsman.js						1	P3
./usr/local/cim/usr/local/www/cim/wsman/xml_json.js						1	P3

#Profiles advertised using wsman-binding
./usr/local/cim/usr/local/www/cim/Profiles/FanProfile.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/LogProfile.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/NetworkProfile.xml					1	P3
./usr/local/cim/usr/local/www/cim/Profiles/PowerStateManagementProfile.xml		1	P3
./usr/local/cim/usr/local/www/cim/Profiles/SensorProfile.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/BaseServerprofile.xml					1	P3	
./usr/local/cim/usr/local/www/cim/Profiles/BootControlProfile.xml				1	P3
./usr/local/cim/usr/local/www/cim/Profiles/ChassisManagerProfile.xml			1	P3
./usr/local/cim/usr/local/www/cim/Profiles/DHCPClient.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/DNSClientProfile.xml					1	P3
./usr/local/cim/usr/local/www/cim/Profiles/IndicationsProfile.xml				1	P3
./usr/local/cim/usr/local/www/cim/Profiles/IndicatorLED.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/IPInterface.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/PhysicalAssetProfile.xml				1	P3
./usr/local/cim/usr/local/www/cim/Profiles/PlatformWatchdogServiceProfile.xml	1	P3
./usr/local/cim/usr/local/www/cim/Profiles/powersupply.xml						1	P3
./usr/local/cim/usr/local/www/cim/Profiles/RoleBasedAuthorizationProfile.xml	1	P3
./usr/local/cim/usr/local/www/cim/Profiles/SimpleIdentityManagementProfile.xml	1	P3
./usr/local/cim/usr/local/www/cim/Profiles/SMASHCollectionsProfile.xml			1	P3
./usr/local/cim/usr/local/www/cim/Profiles/SoftwareInventoryProfile.xml			1	P3
./usr/local/cim/usr/local/www/cim/Profiles/SoftwareUpdateProfile.xml			1	P3
./usr/local/cim/usr/local/www/cim/Profiles/SSHServiceProfile.xml				1	P3
./usr/local/cim/usr/local/www/cim/Profiles/TelnetServiceProfile.xml				1	P3
./usr/local/cim/usr/local/www/cim/Profiles/TextConsoleRedirectionProfile.xml	1	P3



#SFCB FILES
./usr/local/cim/usr/local/sbin/sfcbd										1	P3
./usr/local/cim/usr/local/etc/sfcb/sfcb.cfg									1	P3
./usr/local/cim/usr/local/var/lib/sfcb/registration/providerRegister						1	P3
./usr/local/cim/usr/local/var/lib/sfcb/registration/repository/root/cimv2/classSchemas.gz			1	P3
./usr/local/cim/usr/local/var/lib/sfcb/registration/repository/root/interop/classSchemas.gz			1	P3

# Startup Files for CIMDiscovery and SFCB
./etc/init.d/cim_sfcb									
./etc/Binary.txt											

# Standard files need for CIM 
./usr/lib/libcurl.so.3.0.0
