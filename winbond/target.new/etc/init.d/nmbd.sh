#!/bin/sh
# /etc/init.d/nmbd : Netbios Name Service
#
# chkconfig: 2345 25 25
#
APP_NAME=nmbd


PATH=/bin:/usr/bin:/sbin:/usr/sbin

APP_PATH=/usr/sbin/$APP_NAME


test -f $APP_PATH || exit 0


# Options for start/restart the daemons
#


#


case "$1" in
  start)
    echo -n "Starting Netbios Name Service : $APP_NAME"
    start-stop-daemon --start --quiet --exec $APP_PATH
    echo "."
    ;;
  stop)
    echo -n "Stopping Netbios Name Service : $APP_NAME"
    start-stop-daemon --stop --quiet --exec $APP_PATH
    echo "."
    ;;
    reload)
    	echo -n "Reloading Netbios Name Service : $APP_NAME"
	start-stop-daemon --stop --quiet --exec $APP_PATH --signal 1
	echo "."
	;;
    force-reload)
	$0 reload
	;;
    restart)
    	echo -n "Restarting Netbios Name Service : $APP_NAME"
	start-stop-daemon --stop --quiet --oknodo --exec $APP_PATH
	start-stop-daemon --start --quiet --exec $APP_PATH
	echo "."
	;;
   *)
    echo "Usage: /etc/init.d/$APP_NAME {start|stop|reload|restart|force-reload}"
    exit 1
esac

exit 0
