#!/bin/bash
IP=$1
iptables -D ndsAUT -s $IP -j ACCEPT