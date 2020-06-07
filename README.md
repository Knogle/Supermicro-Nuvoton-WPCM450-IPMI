# Supermicro-Nuvoton-WPCM450-IPMI
Supermicro Nuvoton®, formerly known as Winbond® WPCM450 IPMI source code

Supermicros's / American Megatrends IPMI source tree taken from https://www.supermicro.com/wftp/GPL/AMI/SMC_winbond_opensrc_10090602.tar.gz
This code covers the IPMI/BMC part of Supermicro motherboards, using the WPCM450 BMC as well as ARM926EJS ARM CPU.
Providing support for HERMON board, using 

#
#--------------- OEM VERSION OF BUILDPROJECT ----------------------
#
# This is a strip down version of BuildProject to run as standalone
# All access to Source control is removed and functions which  wipe 
# entire source trees are removed.
#------------------------------------------------------------------


# Uncomment for Script debugging 
#set -e

########################################################################
# Build script Version:
#
# Whenever th script changes, Major.Minor is incremented
# by .1 and subminor is reset to 0
# Subminor is incremented when any of the configuration values
# changes and the script is not modified.
#
# BuildImage script's VERSION numbering is as follows:
# x.y.z:
#   x - Major change
#   y - Script change
#   z - Devkit change
#
#########################################################################
#
SCRIPT_DATE="10/25/2007"	# Build Script Modification Date 
SCRIPT_VERS="2.4.0"            	# Build Script Version
#
#


-Due to lack of information we tried the following things out.


## [2.4.0] - 2020-10-25
### Tested
Debian 4 i386 build required.
-Build basic default image, using ./BuildProject.oem winbond BUILD ./
-Add new uboot version, using git clone and replace "Makefile, mkconfig" by the old ones, maybe use "make olddefconfig" in order to write new .config
-Build image using ./genimage -Crom.ima -I/root/winbond/Build/Output -O/root/winbond/Build/Output

In order to provide further support, we'll try to port this version to be able to compile on a newer system.
Currently it's only possible to get a successful build on Debian 4 (i386).

Outputs might be quite confusing, so in case of a successfull build, you will get a similar output like this one.

Creating "/root/winbond.successful//Build/Output/rom.ima" ...
FlashSize = 0x1000000 BlockSize = 0x10000
boot: Alternate location @ 0xff80
FileSize = 0x1000000
Image checksum is 0xBA92402F
Flash Image created Successfully!

-----------------------------------------------
             Flash Memory Map
-----------------------------------------------
0x0000000 - 0x0050000 :     boot : Ver 1.0
0x0050000 - 0x0150000 :   params : Ver 1.0
0x0150000 - 0x0160000 : *******FREE*******
0x0160000 - 0x0750000 :     root : Ver 1.0
0x0750000 - 0x0D00000 : *******FREE*******
0x0D00000 - 0x0E50000 :  osimage : Ver 1.0
0x0E50000 - 0x0E70000 :      www : Ver 1.0
0x0E70000 - 0x0FF0000 : *******FREE*******
0x0FF0000 - 0x1000000 :   hermon : Ver 1.1
-----------------------------------------------
*************************************************
/root/winbond.successful//Build/Output/rom.ima created
*************************************************


