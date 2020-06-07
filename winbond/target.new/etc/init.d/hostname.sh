#
# hostname.sh	Set hostname.
#
# Version:	@(#)hostname.sh  1.00  22-Jun-1998  miquels@cistron.nl
#
# chkconfig: S 40 0
#

# Set the Hostname 
echo -n "Hostname: "

if [ -f /etc/hostname ]
then
    hostname -F /etc/hostname
fi

# We dont want all machines to be named localhost. 
# if the hostname is set to localhost, create a 
# unique hostname using the product and MAC address 
if [ -x /usr/local/bin/defaulthost ]
then
	/usr/local/bin/defaulthost
else
	echo "ERROR: Executable defaulthost is missing. Cannot set default hostname"
fi

# Display the hostname
echo $(hostname)"."

