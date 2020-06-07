#!/bin/sh

#---------------------------------------------------------------------------------
#		Purpose: create catalog of files in flash filesystem 
#			 and show origins
#
#		Author: sk
#
#		Date:Sep 12 07	
#	
#---------------------------------------------------------------------------------

#--------------------------------------------------------------------------------
#
# Copy the srcbase package to target. This contains all sources from debian that
# we started with. Right now this is old-stable in debian.org
#
# Make sure target/pkg etc. is upto date	
#
# Copy the Build.blade/Output to target/flashroot. The script looks into each
# binary file in that direcrtory to determine which debian package it came from
# It also tracks the corresponsing source package and copyright file

#INSTRUCTIONS:
# Boot target device to NFS
# Copy the flash files root filesystem to /target/flashroot (i.e in the target device it will be /flashroot)
# Copy the srcbase.tgz file to /target
# untar srcbase.tgz (either on dev machine or on device doesnt matter)
# RUN THIS SCRIPT ON THE DEVICE

#--------------------------------------------------------------------------------


# -----------------------------------------------------------
# This function will tell us if files.* files have a comment 
# or blank line and need to be skipped
#
# $1 is the line in the file
# Return code of 1  indicates the file should be skipped 
#-----------------------------------------------------------

FLASHROOT=/flashroot
SOURCEROOT=/srcbase

EASYEXCEL=0

#BR="<BR>"
#BO="<b>"
#BC="</b>"

#go look at all files
#we only look at regular files, not directories or links or device nodes
#of those we skip defconfig directory, the conf directory

HTMECHO()
{
    echo  $1 $BR " "
}

HTMHR()
{
    #echo "<hr>"
    echo " "
}

HTMEASYEXCELDELIM()
{
    if [ $EASYEXCEL == 1 ]
    then
	echo -n " { "
    else
    	echo " "
    fi
}

HTMECHOIFEXCEL()
{
    if [ $EASYEXCEL == 1 ]
    then
	echo -n $1
    fi
}

HTMECHOIFNOTEXCEL()
{
    if [ $EASYEXCEL != 1 ]
    then
	echo -n $1
    fi
}


CheckExtension()
{
    case $1 in
    	*ko)
    	    HTMECHO "DRIVER MODULE"
	    HTMECHO "MANUAL ENTRY REQUIRED"
	    ;;
    esac
}


FindCopyRight()
{
    #navigate to /usr/share/copyrights and get it
    #HTMEASYEXCELDELIM
    if [ -e /usr/share/doc/$packagename/copyright ]
    then
    	HTMECHO "COPYRIGHT FILE EXISTENCE: Copyright File Exists"
	HTMECHOIFNOTEXCEL "COPYRIGHT FILE LOCATION: "
	HTMECHO "target/usr/share/doc/$packagename/copyright"
    else
    	HTMECHO "COPYRIGHT FILE EXISTENCE: ERROR DOES NOT EXIST"
	HTMECHO "MANUAL ENTRY REQUIRED"
    fi    
   HTMEASYEXCELDELIM
}


FindPackageDetails()
{
    BASEDEBIAN=0
    #we grep for everything that doesnt contain diversion. SOme pakcages (module-init-tools) show a diversion
    packagenameraw=`dpkg -S $1 2>/dev/null | grep -v "diversion"` 
    if [ $? == 0 ]
    then
    	
        packagename=`echo $packagenameraw | awk -F : '{print $1}'`
	versionchk=`dpkg-query -W --showformat="\\${Version}" $packagename | awk -F : '{print $NF}'` 
        pkgchk=`dpkg-query -W --showformat="\\${Package}\n" $packagename`
        archchk=`dpkg-query -W --showformat="\\${Architecture}" $packagename`
	packagefilename=${pkgchk}_${versionchk}_${archchk}.deb
        #strip any colon from package filename (sometimes version can have : like in libcap1)

	
	#check if package exists in the pkg directory
        HTMECHO "PACKAGE TYPE:  Unmodified Debian Binary from debian.org"

	HTMEASYEXCELDELIM
	 
	
	HTMECHO "------------------------------------------------------------"
	HTMECHO "BINARY PACKAGE DETAILS"
        HTMECHO "------------------------------------------------------------"
	 
	HTMECHO "BINARY PACKAGE NAME: $packagefilename"
	
	
	BASEDEBIAN=1
	if [ -e /pkg/debs/$packagefilename ]
	then
	    HTMECHO "BINARY PACKAGE EXISTENCE: Binary Exists in target/pkg/debs"
	    HTMECHO "BINARY PACKAGE LOCATION: /target/pkg/debs/$packagefilename"
	     
	else
            HTMECHO "BINARY PACKAGE EXISTENCE: ERROR DOES NOT EXIST!!!!"
	    HTMECHO "MANUAL ENTRY REQUIRED"
	     
	fi
	#HTMECHO "------------------------------------------------------------"
	 

    else
    	# we will check if this is a AMI module..likely to be if in usr/local
	#first check if this a .ko file which means it is a driver

        case $1 in
            */usr/local*)
    		HTMECHO "PACKAGE TYPE: AMI Created/Modified"
                HTMECHO "MANUAL ENTRY REQUIRED"
		 
                ;;
	    *)
    		#here we try to resolve unknown origin from a knowledge base
		UNKNOWN=1
		HTMECHO "PACKAGE TYPE: Unknown Origin"
                HTMECHO "Script Notes: "
		 
		CheckExtension $1
		
		;;
    	esac
    fi

    HTMEASYEXCELDELIM

    if [ $BASEDEBIAN == 1 ]
    then
    	BASEDEBIAN_SRCEXISTS=1

	HTMECHO " "
	HTMECHO "------------------------------------------------------------"
	HTMECHO "SOURCE PACKAGE DETAILS"
        HTMECHO "------------------------------------------------------------"
	 

	#chk if source exists
	sourcepkgname="${pkgchk}*"

        sourcefiles=`ls $SOURCEROOT/$sourcepkgname 2>/dev/null`
        if [ $? == 0 ]
	then
            HTMECHO "SOURCE PACKAGE EXISTENCE: Source Package Exists"
	     
            HTMECHO "SOURCE PACKAGE FILES: "
	     
	    HTMECHO "--------------------"
	     
	    for ff in $sourcefiles
	    do
		HTMECHO $ff 
		
	    done
            HTMECHO "------------------------------------------------------------"
	     

	else
    	    #now check if some package provides this binary by looking at its dsc
           tmppkgnameraw=`grep $packagename $SOURCEROOT/*.dsc | grep "Binary" | awk -F : '{print $1}'`
	   tmppkgname=`basename $tmppkgnameraw`
           if [ "$tmppkgname" != "" ]
	    then
  		HTMECHO "SOURCE PACKAGE EXISTENCE: Source Package Exists"
		 
                basesrcname=${tmppkgname%_*}*
                sourcefiles=`ls $SOURCEROOT/$basesrcname 2>/dev/null`
		HTMECHO "SOURCE FILES: "
		 
		HTMECHO "--------------"
		 
		for ff in $sourcefiles
		do
    		    HTMECHO $ff 
		    
		     
		done
            else
		HTMECHO "ERROR: SOURCE DOES NOT EXIST"
		HTMECHO "MANUAL ENTRY REQUIRED"
		 
		BASEDEBIAN_SRCEXISTS=0
	    fi
    	    HTMECHO "------------------------------------------------------------"
	    HTMECHO " "
	    HTMECHO " "
	fi

	if [ $BASEDEBIAN_SRCEXISTS == 1 ]
	then
	    HTMECHO " "
	    HTMECHO "------------------------------------------------------------"
	    HTMECHO "COPYRIGHT LOCATION"
	    HTMECHO "------------------------------------------------------------"
	    FindCopyRight $packagename
	    HTMECHO "------------------------------------------------------------"
	fi

    fi

    

}


LookAtFlashRoot()
{
    cd $FLASHROOT
    for i in `find . -type f`
    
    do
	itemname=$i
	itembasename=`basename $itemname`
	itemrelname=${itemname#*.}
	itemtype=`file $itemname`

        case $itemtype in
	    *ELF*)   
    		#HTMECHO "BINARY NAME"
		#HTMEASYEXCELDELIM
		#HTMECHO "PACKAGE TYPE"
		#HTMEASYEXCELDELIM
		#HTMECHO "BINARY PACKAGE DETAILS"
		#HTMEASYEXCELDELIM
		#HTMECHO "SOURCE PACKAGE DETAILS"
		#HTMEASYEXCELDELIM
		#HTMECHO "COPYRIGHT FILE LOCATION"
                #echo " "
    		#HTMECHO " "
		echo "*******************************************************************************************"
		HTMECHO " "
		HTMECHO "FILE NAME: $itemrelname"
		#HTMECHO "$itemrelname"
                #HTMECHO "Type: $itemtype"
		FindPackageDetails $itemrelname
		HTMECHO " "
		echo "*******************************************************************************************"
		HTMECHO " "
		echo " "
		;;
	esac
        #pkgname=`dpkg -S $itembasename`
    done
    cd -
}


DebugPerPackage()
{
    echo "*******************************************************************************************"
    #HTMECHO "FILE NAME : $1"
    HTMECHO "$1"
    
    FindPackageDetails $1
    
    echo "*******************************************************************************************"
    
    
}

if [ -e $SOURCEROOT ]
then
    echo -n ""
else
    echo "ERROR: SOURCE BASE DOES NOT EXIST. PLEASE UNTAR SRCBASE.TGZ to /srcbase"
    exit 1
fi
if [ -e $FLASHROOT ]
then
    echo -n ""
else
    echo "ERROR: FLASH ROOT FILESYSTEM DOES NOT EXIST. PLEASE COPY FLASH ROOT FILESYSTEM FROM Build/Output/root to /flashroot"
    exit 2
fi
LookAtFlashRoot
#DebugPerPackage $1

