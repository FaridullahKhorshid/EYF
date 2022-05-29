#!/bin/bash

APPLOCATION=/opt/TulipAir/services
TIME=$(date +"%d-%m-%T")
LOGFILE=/var/log/restore_$TIME.log

# restoring files

echo '
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

exit 0' > /etc/rc.local | tee -a $LOGFILE

sysctl -w net.ipv4.ip_forward=0 | tee -a $LOGFILE
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=0/' /etc/sysctl.d/99-sysctl.conf | tee -a $LOGFILE

# Remove security mission critical config files
chattr -i /etc/dnsmasq.conf | tee -a $LOGFILE
chattr -i $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.conf | tee -a $LOGFILE
chattr -i /etc/default/hostapd | tee -a $LOGFILE
chattr -i /etc/hostapd/hostapd.conf | tee -a $LOGFILE
chattr -i $APPLOCATION/hostapd/hostapd.conf | tee -a $LOGFILE
chattr -i $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.resolv | tee -a $LOGFILE
chattr -i /etc/ssh/sshd_config | tee -a $LOGFILE
chattr -i $APPLOCATION/iptables/tulip.ipv4.iptables | tee -a $LOGFILE

# Reverting certain config files
sed -i 's/PermitRootLogin no/#PermitRootLogin prohibit-password/' /etc/ssh/sshd_config | tee -a $LOGFILE
sed -i "s=DAEMON_CONF\=\"$APPLOCATION/hostapd/hostapd.conf\"=#DAEMON_CONF\=\"\"=" "/etc/default/hostapd" | tee -a $LOGFILE

# Removing old files
rm -rf /opt/TulipAir | tee -a $LOGFILE
apt-get remove dnsmasq hostapd -y | tee -a $LOGFILE
rm -f /etc/dnsmasq.old | tee -a $LOGFILE

reboot