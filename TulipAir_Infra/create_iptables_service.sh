#!/bin/bash
######################################
# Name:           Giovanni Steernberg
# Studentnumber:  500837100
# EYF-Team:       Team 4
# Date:           03/05/2021
# Edited:         -
# Version:        0.1
######################################

# Creating iptables service
echo "::: Creating iptables.service"
touch /etc/systemd/system/iptables.service

echo "[Unit]
Description=iptables
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/opt/TulipAir/services/iptables/tulip.ipv4.iptables

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/iptables.service

systemctl daemon-reload
systemctl enable iptables.service
systemctl start iptables.service