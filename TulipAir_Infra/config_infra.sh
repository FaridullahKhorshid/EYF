#!/bin/bash
######################################
# Name:           Giovanni Steernberg
# Studentnumber:  500837100
# EYF-Team:       Team 4
# Date:           10/03/2021
# Edited:         25/03/2021
# Version:        1.3
######################################

# Declaring variables
TIME=$(date +"%d-%m-%T")
APPLOCATION=/opt/TulipAir/services
LOGFILE=/var/log/config_infra_$TIME.log
BSSID=$(ifconfig wlan0 | grep -Po -m1 '(\w{2}:\w{2}:\w{2}:\w{2}:\w{2}:\w{2})')

# Creating folder structure
echo "::: Creating folder structure" | tee -a $LOGFILE
mkdir -p $APPLOCATION/dnsmasq/{conf.d,lists,logs} | tee -a $LOGFILE
mkdir $APPLOCATION/hostapd | tee -a $LOGFILE
mkdir $APPLOCATION/iptables | tee -a $LOGFILE
touch $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.conf | tee -a $LOGFILE
touch $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.resolv | tee -a $LOGFILE
touch $APPLOCATION/dnsmasq/lists/tulip.leases.dnsmasq | tee -a $LOGFILE
touch $APPLOCATION/dnsmasq/logs/tulip.dnsmasq.log | tee -a $LOGFILE
touch $APPLOCATION/hostapd/hostapd.conf | tee -a $LOGFILE
touch $APPLOCATION/iptables/tulip.ipv4.iptables | tee -a $LOGFILE

# Installing required software
echo "::: Installing required software"  | tee -a $LOGFILE
apt-get install dnsmasq hostapd -y | tee -a $LOGFILE

# IP forwarding on running system and making it permanent
echo "::: Enabling IP forwarding" | tee -a $LOGFILE
sysctl -w net.ipv4.ip_forward=1 | tee -a $LOGFILE
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.d/99-sysctl.conf | tee -a $LOGFILE

# Setting up iptables scripts
echo "::: Creating iptables script" | tee -a $LOGFILE
echo "
iptables-legacy -t nat -A POSTROUTING -o eth0 -j MASQUERADE
iptables-legacy -A FORWARD -i wlan0 -o eth0 -j ACCEPT
iptables-legacy -A FORWARD -i eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT
" > $APPLOCATION/iptables/tulip.ipv4.iptables | tee -a $LOGFILE

# Making the script executable
echo "::: Making the iptables script executable" | tee -a $LOGFILE
chmod +x $APPLOCATION/iptables/tulip.ipv4.iptables | tee -a $LOGFILE

# Setting up DNSmasq
echo "::: Configuring DNSmasq" | tee -a $LOGFILE
mv /etc/dnsmasq.conf /etc/dnsmasq.old | tee -a $LOGFILE
touch /etc/dnsmasq.conf | tee -a $LOGFILE
echo conf-file=$APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.conf >> /etc/dnsmasq.conf | tee -a $LOGFILE

echo "
# Never forward plain names (without a dot or domain part)
domain-needed

# Never forward addresses in the non-routed address spaces.
bogus-priv

# Change this line if you want dns to get its upstream servers from
# somewhere other that /etc/resolv.conf
resolv-file=/opt/TulipAir/services/dnsmasq/conf.d/tulip.dnsmasq.resolv
strict-order

# Local domain(s) specified
local=/tulipair.lan/

# The RPI is listening to specific interfaces
interface=wlan0

# Per interface there is a specific range active
dhcp-range=wlan0,172.30.1.10,172.30.1.250,4h

# Add domain name to hostnames
expand-hosts

# Domain name
domain=tulipair.lan

# DHCP options per interface
dhcp-option=wlan0,option:dns-server,172.30.1.1

# DHCP leases
dhcp-leasefile=/opt/TulipAir/services/dnsmasq/lists/tulip.leases.dnsmasq

# Logging
log-facility=/opt/TulipAir/services/dnsmasq/logs/tulip.dnsmasq.log
log-queries
log-dhcp" > $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.conf | tee -a $LOGFILE

echo "
nameserver 127.0.0.1
nameserver 9.9.9.9 " > $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.resolv | tee -a $LOGFILE

# Setting up hostapd
echo "::: Configuring hostapd" | tee -a $LOGFILE
sed -i "s+#DAEMON_CONF=+DAEMON_CONF=\"$APPLOCATION/hostapd/hostapd.conf\"+" "/etc/default/hostapd" | tee -a $LOGFILE
echo "
# Default settings
country_code=NL
interface=wlan0
ieee80211d=1
ieee80211n=1
driver=nl80211
# hw_mode 'a' means 5GHz, 'g' means 2.4GHz
hw_mode=g
# Channel on 0 means AP will search for best channel with least interferences
channel=6
# QoS support, required for full speed on n/ac/ax
wmm_enabled=1

# AP Settings for passengers
ssid=TulipAir-Passenger
bssid=$BSSID
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=TulipAirPassenger
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP" > $APPLOCATION/hostapd/hostapd.conf | tee -a $LOGFILE

# SSH remote access
echo "::: SSH remote access" | tee -a $LOGFILE
sed -i 's/#Port 22/Port 22/' /etc/ssh/sshd_config | tee -a $LOGFILE
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config | tee -a $LOGFILE

# Setting up static ip config for wlan0
echo "::: Static ip configration for wlan0" | tee -a $LOGFILE
echo "

# TulipAir AP
interface wlan0
static ip_address=172.30.1.1/24
static routers=172.30.1.1
static domain_name_servers=172.30.1.1
" >> /etc/dhcpcd.conf | tee -a $LOGFILE

# Making the Firewall changes
echo "::: Firewall changes for running system" | tee -a $LOGFILE
iptables-legacy -t nat -A POSTROUTING -o eth0 -j MASQUERADE | tee -a $LOGFILE
iptables-legacy -A FORWARD -i wlan0 -o eth0 -j ACCEPT | tee -a $LOGFILE
iptables-legacy -A FORWARD -i eth0 -m state --state RELATED,ESTABLISHED -j ACCEPT | tee -a $LOGFILE

# Making sure firewall changes are done at boot
echo "::: Making the firewall configuration reboot resilient" | tee -a $LOGFILE
sed -i 's=exit 0=if [ -r /opt/TulipAir/services/iptables/tulip.ipv4.iptables ]; then\n sudo /opt/TulipAir/services/iptables/tulip.ipv4.iptables \nfi\n\nexit 0=' /etc/rc.local

# securing mission critical config files
echo "::: Making files resilient to changes" | tee -a $LOGFILE
chattr +i /etc/dnsmasq.conf | tee -a $LOGFILE
chattr +i $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.conf | tee -a $LOGFILE
chattr +i /etc/default/hostapd | tee -a $LOGFILE
chattr +i /etc/hostapd/hostapd.conf | tee -a $LOGFILE
chattr +i $APPLOCATION/hostapd/hostapd.conf | tee -a $LOGFILE
chattr +i $APPLOCATION/dnsmasq/conf.d/tulip.dnsmasq.resolv | tee -a $LOGFILE
chattr +i /etc/ssh/sshd_config | tee -a $LOGFILE
chattr +i $APPLOCATION/iptables/tulip.ipv4.iptables | tee -a $LOGFILE

# Enabling radio broadcasting
echo "::: Enable radio broadcast" | tee -a $LOGFILE
rfkill unblock wlan | tee -a $LOGFILE

# Enabling services
echo "::: Enable services" | tee -a $LOGFILE
systemctl unmask hostapd | tee -a $LOGFILE
systemctl enable dnsmasq hostapd | tee -a $LOGFILE
systemctl restart dnsmasq hostapd | tee -a $LOGFILE

# Rebooting the system, this is needed to properly start
reboot | tee -a $LOGFILE