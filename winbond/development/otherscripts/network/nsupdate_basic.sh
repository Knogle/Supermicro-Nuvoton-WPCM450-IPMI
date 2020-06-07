#!/bin/sh

#This is the DDNS update script
#args for this script are as follows
# 1 - option can be 'dereg' or 'reg'
# 2 - the name for dereg or reg
# 3 - The domain name for eg or dereg
# 3 - the IP address to use in case of register

NSUPDATE_TEMP_FILE="/tmp/nsupdate_temp"
NSUPDATE_TIMEOUT=10
NSUPDATE_BINARY=/usr/local/bin/nsupdate

echo "We are in nsupdate"



case $1 in
      deregister)
      if [ -z "$2" ] || [ -z "$3" ]; then
    	    echo "Need IP and Name for deregistering"
       else
         echo "deregistering $2"
         echo "update delete $2 A" > $NSUPDATE_TEMP_FILE
         echo "send" >> $NSUPDATE_TEMP_FILE
         #we have to also delete the reverse lookup here of the form update delete rever.ip.x.y.index2event-addr.arpa PTR
         reversedip=`echo $3 | awk 'BEGIN { FS = "."; OFS = "." } ; { print $4, $3, $2, $1 }'`
         echo "reversed ip is " $reversedip
         echo "update delete $reversedip.in-addr.arpa PTR" >> $NSUPDATE_TEMP_FILE
         echo "send" >> $NSUPDATE_TEMP_FILE
         $NSUPDATE_BINARY  -v $NSUPDATE_TEMP_FILE
    	fi
         ;;
      register)
      	if [ -z "$2" ] || [ -z "$3" ]; then
    	    echo "Need IP and Name for registering"
	else
    	    if [ -z "$4" ]; then
    		echo -n "Using default TTL of one day"
		TTL=86400
	    else
    		TTL=$4
	    fi
	    echo "update delete $2 A" > $NSUPDATE_TEMP_FILE
       echo "send" >> $NSUPDATE_TEMP_FILE
       #we probably dont need to delete reverse llokup here since it is already deleted in dergeister and anyways how do we get the old ip?
       #we may not always have the old ip either
       echo "update add $2 $TTL A $3" >> $NSUPDATE_TEMP_FILE
       echo "send" >> $NSUPDATE_TEMP_FILE
       #now add the reverse lookup entry
       reversedip=`echo $3 | awk 'BEGIN { FS = "."; OFS = "." } ; { print $4, $3, $2, $1 }'`
       echo "reversed ip is " $reversedip
       echo "update add $reversedip.in-addr.arpa $TTL PTR $2" >> $NSUPDATE_TEMP_FILE
       echo "send" >> $NSUPDATE_TEMP_FILE
	    $NSUPDATE_BINARY  -v $NSUPDATE_TEMP_FILE
	fi
        ;;
      default)
  	 echo "please enter enough args"
	 ;;

esac



 

