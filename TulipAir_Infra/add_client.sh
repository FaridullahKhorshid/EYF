#!/bin/bash
IP=$1
iptables -I ndsAUT -s $IP -j ACCEPT
sleep 1h
iptables -D ndsAUT -s $IP -j ACCEPT
echo $IP;