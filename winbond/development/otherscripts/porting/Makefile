#this makefile just installs all other files that are not part
#of any module.
#For e.g: Startup scripts etc are installed form here


ifndef TOPDIR
TOPDIR  := $(shell cd ../../..; pwd)
endif
include $(TOPDIR)/development/rules/Rules.make.other
-include $(TOPDIR)/$(BUILD_DIR)/projdef.mk


ifndef WWWDIR
WWWDIR := $(TOPDIR)/development/proprietary/www
endif

all: install

install: startups devicenodes nfsadjustments misc sshmunge flashtime svninfo websdate ldapfiles etcfiles network cim vlan

#install startup scripts here
startups:

	$(INSTALL) -m 757 -d $(target_root)/usr/local/www/certs
	$(INSTALL) -m 757 -d $(target_root)/usr/local/bin 
	$(INSTALL) -m 757 -d $(target_root)/usr/local/lib
	$(INSTALL) -m 757 -d $(target_root)/usr/lib
	$(INSTALL) -m 757 -d $(target_root)/lib/security
	$(INSTALL) -m 757 -d $(target_confdir) 
	$(INSTALL) -m 757 -d $(target_initddir) 
	$(INSTALL) -m 757 -d $(target_rc3dir)
	$(INSTALL) -m 757 -d $(target_rc7dir)
	$(INSTALL) -m 757 -d $(target_rcSdir)
	$(INSTALL) -m 757 -d $(target_devdir)
	$(INSTALL) -m 777 -d $(target_etcdir)
	$(INSTALL) -m 757 -d $(target_etcdir)/ssh
	$(INSTALL) -m 757 -d $(target_etcdir)/pam.d

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../usb/cdserver $(target_initddir)
	cd $(target_rc3dir)
	ln -sf ../init.d/cdserver $(target_rc3dir)/S30cdserver
	
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../usb/fdserver $(target_initddir)
	cd $(target_rc3dir)
	ln -sf ../init.d/fdserver $(target_rc3dir)/S30fdserver

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  adviserd $(target_initddir)
	cd $(target_rc3dir)
	ln -sf ../init.d/adviserd $(target_rc3dir)/S45adviserd
	
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ipmi/ipmistack $(target_initddir)
	cd $(target_rc3dir)
	ln -sf ../init.d/ipmistack $(target_rc3dir)/S36ipmistack

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/flasher  $(target_initddir)
	cd $(target_rc3dir)
	ln -sf ../init.d/flasher $(target_rc3dir)/S80flasher

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ntpdate $(target_initddir)

ifdef USE_SSH
ifeq ($(USE_SSH),DROPBEAR)
		$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ssh/ssh_dropbear $(target_initddir)/ssh
		cd $(target_rc3dir)
		ln -sf ../init.d/ssh $(target_rc3dir)/S20ssh

		$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ssh/ssh_dropbear_bg $(target_initddir)/ssh_bg
endif
else
		$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ssh/ssh $(target_initddir)
		cd $(target_rc3dir)
		ln -sf ../init.d/ssh $(target_rc3dir)/S20ssh

		$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ssh/ssh_bg $(target_initddir)
endif



	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../upnp/upnp  $(target_initddir)
	cd $(target_rc3dir)
	ln -sf ../init.d/upnp $(target_rc3dir)/S30upnp
	
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) inittab $(target_etcdir)/inittab
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../etc/webgo $(target_initddir)
	mkdir -p $(target_usrsbindir)
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ./stunnel4 $(target_usrsbindir)/stunnel4


network: startups
ifeq ($(NETWORK),BOTH)
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) interfaces.both $(targetnew_etcdir)/network/interfaces
else
ifeq ($(NETWORK),ETH1)
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) interfaces.eth1 $(targetnew_etcdir)/network/interfaces
else
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) interfaces.eth0 $(targetnew_etcdir)/network/interfaces
endif
endif
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/nsupdate_basic.sh $(targetnew_etcdir)/nsupdate_basic.sh
        
	#also $(INSTALL) the ifupdown scripts
	mkdir -p $(targetnew_etcdir)/network/if-pre-up.d
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/pre-up-script-eth0 $(targetnew_etcdir)/network/if-pre-up.d/

	mkdir -p $(targetnew_etcdir)/network/if-up.d/
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/up-script-eth0 $(targetnew_etcdir)/network/if-up.d/

	mkdir -p $(targetnew_etcdir)/network/if-down.d
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/down-script-eth0 $(targetnew_etcdir)/network/if-down.d

	mkdir -p $(targetnew_etcdir)/network/if-post-down.d
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/post-down-script-eth0 $(targetnew_etcdir)/network/if-post-down.d
	

	mkdir -p $(TARGETNEWDIR)/usr/share/udhcpc
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/udhcpc-script $(TARGETNEWDIR)/usr/share/udhcpc/default.script
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/dhcpc-config $(target_confdir)/dhcpc-config
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../network/resolv.conf $(targetnew_etcdir)/resolv.conf

etcfiles: startups
	#install our version of sshd_config with the AllowGroups line removed
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../login/sshd_config $(targetnew_etcdir)


sshmunge: startups

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../login/sshd_config $(target_etcdir)/ssh/sshd_config
ifdef USE_SSH
ifeq ($(USE_SSH),DROPBEAR)

	rm -rf	$(target_etcdir)/etc/ssh/ssh_host_rsa_key
	rm -rf	$(target_etcdir)/etc/ssh/ssh_host_dsa_key
	chmod  	400 $(TARGETDIR)/var/run/sshd
	mkdir -p $(target_etcdir)/dropbear
	ln -sf /conf/dropbear_rsa_host_key $(target_etcdir)/dropbear/dropbear_rsa_host_key
	mkdir -p $(target_usrbindir)/dropbear
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ssh/dropbearmulti $(target_usrsbindir)/dropbearmulti
	ln -sf /usr/sbin/dropbearmulti $(target_usrsbindir)/dropbear
	ln -sf /usr/sbin/dropbearmulti $(target_root)/usr/bin/dropbearkey
endif
endif

devicenodes: startups
#the - before each causes make to ignore errors if file already exists we get a mknod error
	cd $(target_devdir);if ! [ -e usb ]; then mknod usb c 100 0;fi
	cd $(target_devdir);if ! [ -e gpio0 ]; then mknod gpio0 c 101 0;fi
	cd $(target_devdir);if ! [ -e pwmtach ]; then mknod pwmtach c 46 0;fi
	cd $(target_devdir);if ! [ -e i2c0 ]; then mknod i2c0 c 89 0;fi
	cd $(target_devdir);if ! [ -e i2c1 ]; then mknod i2c1 c 89 1;fi
	cd $(target_devdir);if ! [ -e i2c2 ]; then mknod i2c2 c 89 2;fi
	cd $(target_devdir);if ! [ -e i2c3 ]; then mknod i2c3 c 89 3;fi
	cd $(target_devdir);if ! [ -e i2c4 ]; then mknod i2c4 c 89 4;fi
	cd $(target_devdir);if ! [ -e i2clan ]; then mknod i2clan c 89 5;fi
	cd $(target_devdir);if ! [ -e fpga ]; then mknod fpga c 15 0;fi
	cd $(target_devdir);if ! [ -e lpc ]; then mknod lpc c 42 0;fi
	cd $(target_devdir);if ! [ -e kcs1 ]; then mknod kcs1 c 42 1;fi
	cd $(target_devdir);if ! [ -e kcs2 ]; then mknod kcs2 c 42 2;fi
	cd $(target_devdir);if ! [ -e kcs3 ]; then mknod kcs3 c 42 3;fi
	cd $(target_devdir);if ! [ -e port80 ]; then mknod port80 c 43 0;fi
	cd $(target_devdir);if ! [ -e prev80 ]; then mknod prev80 c 43 1;fi
	cd $(target_devdir);if ! [ -e peci ]; then mknod peci c 45 0;fi
	cd $(target_devdir);if ! [ -e adc ]; then mknod adc c 251 0;fi
	cd $(target_devdir);if ! [ -e ttyS4 ]; then mknod ttyS4 c 4 68;fi
	cd $(target_devdir);if ! [ -e ttyS5 ]; then mknod ttyS5 c 4 69;fi

flashtime: startups

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/cpConf $(target_bindir)
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/mkMiniMe $(target_bindir)

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  forcekill $(target_initddir)
	cd $(target_rc7dir)
	ln -sf ../init.d/forcekill $(target_rc7dir)/K90forcekill

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/prepfl $(target_initddir)
	cd $(target_rc7dir)
	ln -sf ../init.d/prepfl $(target_rc7dir)/S50prepfl

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/stopgc $(target_initddir)
	cd $(target_rc7dir)
	ln -sf ../init.d/stopgc $(target_rc7dir)/S51stopgc

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/initcomplete $(target_initddir)
	cd $(target_rc7dir)
	ln -sf ../init.d/initcomplete $(target_rc7dir)/S52initcomplete

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../flash/flumount $(target_initddir)
	cd $(target_rc7dir)
	ln -sf ../init.d/flumount $(target_rc7dir)/S40flumount

	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../etc/fstab.flash $(targetnew_etcdir)/fstab

copywww: startups
	#create a copy of www in nfs target
	#cp -r -u -v $(WWWDIR) $(target_root)/usr/local
ifndef NO_NFS_WWW
	cd $(WWWDIR);for i in `find . | grep -v "/.svn"`; do if ! [ -d $$i ]; then cp -uv $$i $(target_root)/usr/local/www/$$i; else mkdir -p $(target_root)/usr/local/www/$$i;  fi; echo -n "."; done
endif


nfsadjustments: startups copywww

	mkdir -p $(target_root)/var/lock/etc
	mkdir -p $(target_root)/var/etc
	mkdir -p $(target_root)/conf
	mkdir -p $(target_root)/var/pipe

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../etc/fstab $(target_etcdir)
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../etc/ld.so.conf $(target_etcdir)

#	rcs that does ldconfig
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../etc/rcS_flash $(targetnew_etcdir)/init.d/rcS
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../etc/rcS_nfs $(target_etcdir)/init.d/rcS

#	 cd $(target_etcdir)/ssh;chmod 600 ssh_host_dsa_key && chmod 600 ssh_host_rsa_key

ldapfiles: startups
	mkdir -p $(target_root)/conf	#to allow make -j
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ldap/ldap.conf.disabled $(target_root)/conf
	ln -sf ../conf/ldap.conf $(target_etcdir)/ldap.conf
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ldap/login $(target_root)/etc/pam.d
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../ldap/nsswitch.conf $(target_root)/etc

misc: startups
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIME_STAMP) modules $(target_etcdir)/modules

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../etc/module-init-tools $(targetnew_etcdir)/init.d

ifdef USE_SSH
ifeq ($(USE_SSH),DROPBEAR)
		$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../login/sshd_dropbear_pam $(targetnew_etcdir)/pam.d/sshd
		mkdir -p $(target_usrsbindir)
		mkdir -p $(target_root)/usr/bin
		$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../ssh/dropbearmulti $(target_usrsbindir)/dropbearmulti
endif
else
		#$(INSTALL) the PAM file for ssh that does ldap
		$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../login/sshd_pam $(targetnew_etcdir)/pam.d/sshd
endif

#$(INSTALL) the date in UTC seconds to actuall www that goes into flash
#this is used by goahead to set modification time for web pages
websdate: startups
	date +%s > $(WWWDIR)/gdate

	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../stunnel/kvm_servers $(target_initddir)
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../stunnel/vmedia_servers $(target_initddir)
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) ../stunnel/all-redir-servers $(target_initddir)
svninfo: startups

	 $(INSTALL) -m 666  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)   $(TOPDIR)/development/BUILDNO $(target_etcdir)/svnrevision
	 date >> $(target_etcdir)/svnrevision

cim:
ifeq ($(USE_CIM),YES)
	$(INSTALL) -m 757 -d $(target_root)/$(CIM_ROOT_DIR)
# OEM Specfic
	$(INSTALL) -m 757 -d $(target_root)/$(CIM_ROOT_DIR)/usr/local/var/lib/sfcb/registration/repository/root/cimv2
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIME_STAMP) ../cim/classSchemas.gz $(target_root)/$(CIM_ROOT_DIR)/usr/local/var/lib/sfcb/registration/repository/root/cimv2/classSchemas.gz
	$(INSTALL) -m 757 -d $(target_root)/$(CIM_ROOT_DIR)/usr/local/var/lib/sfcb/registration/repository/root/interop
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIME_STAMP) ../cim/classSchemas.interop.gz $(target_root)/$(CIM_ROOT_DIR)/usr/local/var/lib/sfcb/registration/repository/root/interop/classSchemas.gz

	$(INSTALL) -m 757 -d $(target_root)/$(CIM_ROOT_DIR)/usr/local/etc/sfcb
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIME_STAMP) ../cim/sfcb.cfg  $(target_root)/$(CIM_ROOT_DIR)/usr/local/etc/sfcb/sfcb.cfg

	$(INSTALL) -m 757 -d $(target_root)/$(CIM_ROOT_DIR)/etc/Providers
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIME_STAMP) ../cim/IPMI_Conf.ini $(target_root)/$(CIM_ROOT_DIR)/etc/Providers/IPMI_Conf.ini
	$(INSTALL) -m 757 -d $(target_root)/etc
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIME_STAMP) ../cim/Binary.txt $(target_root)/etc/Binary.txt

	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../cim/cim_sfcb $(target_initddir)
	cd $(target_rcSdir)
	ln -sf ../init.d/cim_sfcb $(target_rcSdir)/S37cim_sfcb
endif


vlan: startups
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../network/vlannetworking $(target_initddir)
	$(INSTALL)  $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP)  ../network/vlanconfig $(target_initddir)
	ln -sf ../init.d/vlannetworking $(target_rcSdir)/S41vlannetworking
	ln -sf ../init.d/vlanconfig $(target_rcSdir)/S35vlanconfig

	echo "iface eth0.$(VLAN_ID) inet static" > vlaninterfaces
	echo "address 0.0.0.0" >> vlaninterfaces
	echo "netmask 255.255.248.0" >> vlaninterfaces
ifeq ($(ENABLE_VLAN_SUPPORT),YES)
	echo $(VLAN_ID) > vlanid
else
	echo 0 > vlanid
endif
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) vlaninterfaces $(target_confdir)/vlaninterfaces
	$(INSTALL) $(ONLY_IF_NEW) $(PRESERVE_SOURCE_TIMESTAMP) vlanid $(target_confdir)/vlanid
clean:

