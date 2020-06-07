TOPNAV={
	items:[
		{label:"STR_TOPNAV_SYSTEM_INFORMATION", level:0, func:"", page:"sys_info.html", nav:"SYSINFO_LEFTNAV", enabled:1, userprops:{}},
		{label:"STR_TOPNAV_SERVER_HEALTH", level:0, func:"", page:"welcome_serverhealth.html", nav:"SRVR_HEALTH_LEFTNAV", enabled:1, userprops:{}},
		{label:"STR_TOPNAV_CONFIGURATION", level:0, func:"", page:"welcome_configuration.html", nav:"CONFIG_LEFTNAV", enabled:1, userprops:{}},
		{label:"STR_TOPNAV_REMOTE_CONTROL", level:0, func:"", page:"welcome_remotecontrol.html", nav:"RMCNTRL_LEFTNAV", enabled:1, userprops:{}},
		{label:"STR_TOPNAV_MAINTENANCE", level:0, func:"", page:"welcome_maintenance.html", nav:"MAINTENANCE_LEFTNAV", enabled:1, userprops:{}},
		{label:"STR_TOPNAV_MISC", level:0, func:"", page:"welcome_miscellaneous.html", nav:"MISC_LEFTNAV", enabled:1, userprops:{}},
		{label:"STR_TOPNAV_LANGUAGE", level:0, func:"", page:"language.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_LANG_PTITLE', "pdesc":'STR_LANG_PDESC'}}
	]
};
SYSINFO_LEFTNAV={
	items:[
		{label:"STR_SYSINFO_LEFTNAV_SYSTEM_INFORMATION", level:0, func:"", page:"/page/sys_info.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/sysinfo.jpg', "ptitle":'STR_SI_SYSTEM_INFO_PTITLE', "pdesc":'STR_SI_SYSTEM_INFO_PDESC', "level":0, "id":'SYS_INFO', "pid":null}}
	]
};
SRVR_HEALTH_LEFTNAV={
	items:[
		{label:"STR_SRVR_HEALTH_LEFTNAV_SERVER_HEALTH", level:0, func:"", page:"/page/server_health.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/monitor.jpg', "ptitle":'STR_SRVR_HLTH_PTITLE', "pdesc":'STR_SRVR_HLTH_PDESC', "level":0, "id":'SRVR_HLTH', "pid":null}},
		{label:"STR_SRVR_HEALTH_LEFTNAV_SENSOR_READINGS", level:0, func:"", page:"/page/sensor_reading.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/monitor.jpg', "ptitle":'STR_SH_SENSOR_READING_PTITLE', "pdesc":'STR_SH_SENSOR_READING_PDESC', "level":1, "id":'SNSR_RDNG', "pid":'SRVR_HLTH'}},
		{label:"STR_SRVR_HEALTH_LEFTNAV_EVENT_LOG", level:0, func:"", page:"/page/monitoring_events.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/monitor.jpg', "ptitle":'STR_SH_EVENT_LOG_PTITLE', "pdesc":'STR_SH_EVENT_LOG_PDESC', "level":1, "id":'EVNT_LOG', "pid":'SRVR_HLTH'}}
	]
};
CONFIG_LEFTNAV={
	items:[
		{label:"STR_CONFIG_LEFTNAV_CONFIGURE", level:0, func:"", page:"/page/config_nav.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_CONF_PTITLE', "pdesc":'STR_CONF_PDESC', "level":0, "id":'CONFIGURE', "pid":null}},
		{label:"STR_CONFIG_LEFTNAV_ALERTS", level:0, func:"", page:"/page/configure_alerts.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/alerts.jpg', "ptitle":'STR_CFG_CONF_ALERT_PTITLE', "pdesc":'STR_CFG_CONF_ALERT_PDESC', "level":1, "id":'ALERTS', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_DATE_AND_TIME", level:0, func:"", page:"/page/date_time.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_CFG_DATE_TIME_PTITLE', "pdesc":'STR_CFG_DATE_TIME_PDESC', "level":1, "id":'DATE_TIME', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_LDAP", level:0, func:"", page:"/page/configure_ldap.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/alerts.jpg', "ptitle":'STR_CFG_LDAP_PTITLE', "pdesc":'STR_CFG_LDAP_PDESC', "level":1, "id":'LDAP', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_ACTIVE_DIRECTORY", level:0, func:"", page:"/page/configure_active_directory.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/alerts.jpg', "ptitle":'STR_CFG_AD_PTITLE', "pdesc":'STR_CFG_AD_PDESC', "level":1, "id":'AD', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_MOUSE_MODE", level:0, func:"", page:"/page/configure_mouse_mode.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_CFG_CONF_MOUSEMODE_PTITLE', "pdesc":'STR_CFG_CONF_MOUSEMODE_PDESC', "level":1, "id":'MOUSEMODE', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_NETWORK", level:0, func:"", page:"/page/configure_network.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_CFG_CONF_NW_PTITLE', "pdesc":'STR_CFG_CONF_NW_PDESC', "level":1, "id":'NETWORK', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_REMOTE_SESSION", level:0, func:"", page:"/page/configure_remotesession.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_CFG_CONF_RMTSESS_PTITLE', "pdesc":'STR_CFG_CONF_RMTSESS_PDESC', "level":1, "id":'RMTSESSION', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_SMTP", level:0, func:"", page:"/page/configure_smtp.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/alerts.jpg', "ptitle":'STR_CFG_CONF_SMTP_PTITLE', "pdesc":'STR_CFG_CONF_SMTP_PDESC', "level":1, "id":'SMTP', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_SSL", level:0, func:"", page:"/page/upload_ssl_certificate.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_CFG_UPLOAD_SSL_PTITLE', "pdesc":'STR_CFG_UPLOAD_SSL_PDESC', "level":1, "id":'SSL', "pid":'CONFIGURE'}},
		{label:"STR_CONFIG_LEFTNAV_USERS", level:0, func:"", page:"/page/configure_user.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/users.jpg', "ptitle":'STR_CFG_CONF_USER_PTITLE', "pdesc":'STR_CFG_CONF_USER_PDESC', "level":1, "id":'USERS', "pid":'CONFIGURE'}}
	]
};
RMCNTRL_LEFTNAV={
	items:[
		{label:"STR_RMCNTRL_LEFTNAV_REMOTE_CONTROL", level:0, func:"", page:"/page/remote_control.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/monitor.jpg', "ptitle":'STR_RMCNTRL_REDIRECT_PTITLE', "pdesc":'STR_RMCNTRL_REDIRECT_PDESC', "level":0, "id":'RMMGMT', "parent":null}},
		{label:"STR_RMCNTRL_LEFTNAV_CONSOLE_REDIRECTION", level:0, func:"", page:"/page/launch_redirection.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/monitor.jpg', "ptitle":'STR_RMCNTRL_REDIRECT_PTITLE', "pdesc":'STR_RMCNTRL_REDIRECT_PDESC', "level":1, "id":'LAUNCH_REDIR', "pid":'RMMGMT'}},
		{label:"STR_MISC_LEFTNAV_LAUNCH_SOL", level:0, func:"", page:"/page/launch_sol.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_LAUNCH_SOL_PTITLE', "pdesc":'STR_LAUNCH_SOL_PDESC', "level":1, "id":'LAUNCH_SOL', "pid":'MISC'}},
		{label:"STR_RMCNTRL_LEFTNAV_SERVER_POWER_CONTROL", level:0, func:"", page:"/page/server_power_control.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_RMCNTRL_POWER_CNTRL_PTITLE', "pdesc":'STR_RMCNTRL_POWER_CNTRL_PDESC', "level":1, "id":'PWRCTRL', "pid":'RMMGMT'}}
	]
};

MAINTENANCE_LEFTNAV={
	items:[
		{label:"STR_MAINTENACE_LEFTNAV_OPTION", level:0, func:"", page:"/page/config_maintenance.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_MAINT_PTITLE', "pdesc":'STR_MAINT_PDESC', "level":0, "id":'MAINTENACE', "pid":null}},
		{label:"STR_MAINTENACE_LEFTNAV_FW_UPDATE", level:0, func:"", page:"/page/UI_firmware_update.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_FW_UPDATE_PTITLE', "pdesc":'STR_FW_UPDATE_PDESC', "level":1, "id":'FW_UPDATE', "pid":'MAINTENACE'}},
		{label:"STR_MAINTENACE_LEFTNAV_UNIT_RESET", level:0, func:"", page:"/page/unit_reset.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_UNIT_RESET_PTITLE', "pdesc":'STR_UNIT_RESET_PDESC', "level":1, "id":'UNIT_RESET', "pid":'MAINTENACE'}}
	]
};

MISC_LEFTNAV={
	items:[
		{label:"STR_MISC_LEFTNAV_OPTION", level:0, func:"", page:"/page/config_misc.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_MISC_PTITLE', "pdesc":'STR_MISC_PDESC', "level":0, "id":'MISC', "pid":null}},
		{label:"STR_MISC_LEFTNAV_POST_SNOOPING", level:0, func:"", page:"/page/post_snooping.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_POST_SNOOPING_PTITLE', "pdesc":'STR_POST_SNOOPING_PDESC', "level":1, "id":'POST_SNOOPING', "pid":'MISC'}},
		{label:"STR_MISC_LEFTNAV_UID", level:0, func:"", page:"/page/uid.html", nav:"", enabled:1, userprops:{"icon":'/res/icons/config.jpg', "ptitle":'STR_UID_PTITLE', "pdesc":'STR_UID_PDESC', "level":1, "id":'UID', "pid":'MISC'}}
	]
};