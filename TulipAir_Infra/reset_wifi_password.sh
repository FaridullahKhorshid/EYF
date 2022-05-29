#!/bin/bash
######################################
# Name:           Giovanni Steernberg
# Studentnumber:  500837100
# EYF-Team:       Team 4
# Date:           22/05/2021
# Edited:         22/05/2021
# Version:        1.0
######################################

# Variables
NEWPWD=$(openssl rand -base64 12)
CURRENTPWD=$(cat /etc/hostapd/hostapd.conf | grep -i 'wpa_passphrase' | cut -d= -f2)

# Generating random passphrase for TuplipAir-Passenger wifi

if [ -r /etc/hostapd/hostapd.conf ]
  then
    sudo sed -i "s/wpa_passphrase=$CURRENTPWD/wpa_passphrase=$NEWPWD/" "/etc/hostapd/hostapd.conf"
    echo "Your new passphrase = $NEWPWD"
    sudo systemctl restart hostapd.service
else
  echo 'There is no such file "/etc/hostapd/hostapd.conf"'
fi