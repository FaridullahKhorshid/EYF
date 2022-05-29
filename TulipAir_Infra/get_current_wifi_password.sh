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
CURRENTPWD=$(cat /etc/hostapd/hostapd.conf | grep -i 'wpa_passphrase' | cut -d= -f2)

if [ -r /etc/hostapd/hostapd.conf ]
  then echo $CURRENTPWD
else
  echo 'There is no such file "/etc/hostapd/hostapd.conf"'
fi