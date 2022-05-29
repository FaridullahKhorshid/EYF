#!/bin/bash
######################################
# Name:           Giovanni Steernberg
# Studentnumber:  500837100
# EYF-Team:       Team 4
# Date:           03/05/2021
# Edited:         22/05/2021
# Version:        1.1
######################################

# Declaring variables
TIME=$(date +"%d-%m-%T")
APPLOCATION=$(pwd)
LOGFILE=/var/log/upgrade_firewall_$TIME.log

# Removing mutation security from file(s), creating backup from old config
# and updating with new settings

# Flushing iptables
iptables --flush

if [ $APPLOCATION/tulip.ipv4.iptables ]
  then
    echo "::: Removing mutation security from file(s)" | tee -a $LOGFILE
    chattr -i $APPLOCATION/tulip.ipv4.iptables | tee -a $LOGFILE
    echo "::: Making a backup of the old file"  | tee -a $LOGFILE
    cp -v $APPLOCATION/tulip.ipv4.iptables $APPLOCATION/old.tulip.ipv4.iptables
    echo "::: Adding new settings to the config file" | tee -a $LOGFILE
    echo "
    iptables -t nat -A PREROUTING -p tcp -i wlan0 --dport 80 -j DNAT --to-destination 192.168.2.10:8080
    iptables -A INPUT -i wlan0 -p tcp --dport 22 -j ACCEPT
    iptables -A INPUT -i wlan0 -p tcp --dport 80 -j ACCEPT
    iptables -A INPUT -i wlan0 -p tcp --dport 5900 -j ACCEPT
    iptables -A INPUT -i wlan0 -p udp --dport 53 -j ACCEPT
    iptables -A INPUT -i wlan0 -p udp --dport 67 -j ACCEPT
    iptables -A INPUT -i wlan1 -p tcp --dport 5900 -j ACCEPT
    iptables -A INPUT -i wlan1 -p tcp --dport 22 -j ACCEPT
    iptables -A INPUT -i wlan1 -p udp --sport 53 -j ACCEPT
    iptables -A INPUT -i lo -j ACCEPT
    iptables -A INPUT -j DROP
    iptables -A INPUT -i wlan0 -p tcp --dport 443 -j ACCEPT
    iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE
    iptables -A FORWARD -i wlan1 -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -t nat -I OUTPUT -p tcp -o lo --dport 80 -j REDIRECT --to-ports 8080" > $APPLOCATION/tulip.ipv4.iptables | tee -a $LOGFILE
else
  echo "::: Firewall changes for running system" | tee -a $LOGFILE
  touch $APPLOCATION/tulip.ipv4.iptables | tee -a $LOGFILE
  echo "::: Adding new settings to the config file" | tee -a $LOGFILE
  echo "
  iptables -t nat -A PREROUTING -p tcp -i wlan0 --dport 80 -j DNAT --to-destination 192.168.2.10:8080
  iptables -A INPUT -i wlan0 -p tcp --dport 22 -j ACCEPT
  iptables -A INPUT -i wlan0 -p tcp --dport 80 -j ACCEPT
  iptables -A INPUT -i wlan0 -p tcp --dport 5900 -j ACCEPT
  iptables -A INPUT -i wlan0 -p udp --dport 53 -j ACCEPT
  iptables -A INPUT -i wlan0 -p udp --dport 67 -j ACCEPT
  iptables -A INPUT -i wlan1 -p tcp --dport 5900 -j ACCEPT
  iptables -A INPUT -i wlan1 -p tcp --dport 22 -j ACCEPT
  iptables -A INPUT -i wlan1 -p udp --sport 53 -j ACCEPT
  iptables -A INPUT -i lo -j ACCEPT
  iptables -A INPUT -j DROP
  iptables -A INPUT -i wlan0 -p tcp --dport 443 -j ACCEPT
  iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE
  iptables -A FORWARD -i wlan1 -m state --state RELATED,ESTABLISHED -j ACCEPT
  iptables -t nat -I OUTPUT -p tcp -o lo --dport 80 -j REDIRECT --to-ports 8080" > $APPLOCATION/tulip.ipv4.iptables | tee -a $LOGFILE
fi
# adding immutable attribute to the config file
echo "::: Adding mutation security from file(s)" | tee -a $LOGFILE
chattr +i $APPLOCATION/tulip.ipv4.iptables | tee -a $LOGFILE

echo "::: Setting new config to use" | tee -a $LOGFILE
$APPLOCATION/tulip.ipv4.iptables

echo "::: Printing current config" | tee -a $LOGFILE
iptables -L | tee -a $LOGFILE
