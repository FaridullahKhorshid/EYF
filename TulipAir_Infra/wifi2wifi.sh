#!/bin/bash

sudo git clone https://github.com/gnab/rtl8812au.git




cd rtl8812au




sudo apt install -y bc git flex bison libssl-dev
sudo wget https://raw.githubusercontent.com/RPi-Distro/rpi-source/master/rpi-source -O /usr/local/bin/rpi-source && sudo chmod +x /usr/local/bin/rpi-source && /usr/local/bin/rpi-source -q --tag-update
rpi-source

sudo apt-get install raspberrypi-kernel-headers build-essential

sudo sed -i 's/CONFIG_PLATFORM_I386_PC = y/CONFIG_PLATFORM_I386_PC = n/g' Makefile

sudo sed -i 's/CONFIG_PLATFORM_ARM_RPI = n/CONFIG_PLATFORM_ARM_RPI = y/g' Makefile


sudo ./install.sh


sudo sed -i -e '$aauto wlan1' /etc/network/interfaces
sudo sed -i -e '$aallow-hotplug wlan1' /etc/network/interfaces
sudo sed -i -e '$aiface wlan1 inet manual' /etc/network/interfaces
sudo sed -i -e '$a wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf' /etc/network/interfaces

sudo apt install hostapd

sudo systemctl unmask hostapd
sudo systemctl enable hostapd

sudo apt install dnsmasq

sudo DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent

#sudo nano /etc/dhcpcd.conf

sudo sed -i -e '$ainterface wlan0' /etc/dhcpcd.conf
sudo sed -i -e '$astatic ip_address=192.168.4.1/24' /etc/dhcpcd.conf
sudo sed -i -e '$anohook wpa_supplicant' /etc/dhcpcd.conf

sudo touch /etc/sysctl.d/routed-ap.conf
sudo bash -c 'echo "# https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md" >> /etc/sysctl.d/routed-ap.conf'
sudo bash -c 'echo "# Enable IPv4 routing" >> /etc/sysctl.d/routed-ap.conf'
sudo bash -c 'echo "net.ipv4.ip_forward=1" >> /etc/sysctl.d/routed-ap.conf'


sudo iptables -t nat -A POSTROUTING -o wlan1 -j MASQUERADE

sudo netfilter-persistent save

sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
#sudo nano /etc/dnsmasq.conf
sudo touch /etc/dnsmasq.conf


sudo bash -c 'echo "interface=wlan0 # Listening interface" >> /etc/dnsmasq.conf'
sudo bash -c 'echo "dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h" >> /etc/dnsmasq.conf'
sudo bash -c 'echo "# Pool of IP addresses served via DHCP" >> /etc/dnsmasq.conf'
sudo bash -c 'echo "domain=wlan     # Local wireless DNS domain" >> /etc/dnsmasq.conf'
sudo bash -c 'echo "address=/gw.wlan/192.168.4.1" >> /etc/dnsmasq.conf'
sudo bash -c 'echo "# Alias for this router" >> /etc/dnsmasq.conf'

sudo rfkill unblock wlan


sudo touch /etc/hostapd/hostapd.conf

sudo bash -c 'echo "country_code=NL" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "interface=wlan0" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "ssid=EnjoyYourFlightT4" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "hw_mode=g" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "channel=7" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "macaddr_acl=0" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "auth_algs=1" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "ignore_broadcast_ssid=0" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "wpa=2" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "wpa_passphrase=Ditwachtwoordisnietgebruikersvriendelijk" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "wpa_key_mgmt=WPA-PSK" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "wpa_pairwise=TKIP" >> /etc/hostapd/hostapd.conf'
sudo bash -c 'echo "rsn_pairwise=CCMP" >> /etc/hostapd/hostapd.conf'

reboot
