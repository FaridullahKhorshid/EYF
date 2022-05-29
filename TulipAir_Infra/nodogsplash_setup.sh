#!/bin/bash

apt install git libmicrohttpd-dev -y

cd ~
git clone https://github.com/nodogsplash/nodogsplash.git

cd ~/nodogsplash
make
sudo make install


sudo echo "
#
# Nodogsplash Configuration File
#

# Parameter: GatewayInterface
# Default: NONE
#
# GatewayInterface is not autodetected, has no default, and must be set here.
# Set GatewayInterface to the interface on your router
# that is to be managed by Nodogsplash.
# Typically br-lan for the wired and wireless lan.
#
GatewayInterface br-lan

# Parameter: WebRoot
# Default: /etc/nodogsplash/htdocs
#
# The local path where the splash page content resides.

# FirewallRuleSet: authenticated-users
#
# Control access for users after authentication.
# These rules are inserted at the beginning of the
# FORWARD chain of the router's filter table, and
# apply to packets that have come in to the router
# over the GatewayInterface from MAC addresses that
# have authenticated with Nodogsplash, and that are
# destined to be routed through the router.  The rules are
# considered in order, and the first rule that matches
# a packet applies to it.
# If there are any rules in this ruleset, an authenticated
# packet that does not match any rule is rejected.
# N.B.: This ruleset is completely independent of
# the preauthenticated-users ruleset.
#
FirewallRuleSet authenticated-users {

# You may want to open access to a machine on a local
# subnet that is otherwise blocked (for example, to
# serve a redirect page; see RedirectURL).  If so,
# allow that explicitly here, e.g:
#  FirewallRule allow tcp port 80 to 192.168.254.254

# Your router may have several interfaces, and you
# probably want to keep them private from the GatewayInterface.
# If so, you should block the entire subnets on those interfaces, e.g.:
#  FirewallRule block to 192.168.0.0/16
#  FirewallRule block to 10.0.0.0/8

# Typical ports you will probably want to open up include
# 53 udp and tcp for DNS,
# 80 for http,
# 443 for https,
# 22 for ssh:
#  FirewallRule allow tcp port 53	
#  FirewallRule allow udp port 53	
  FirewallRule allow tcp port 80
#  FirewallRule allow tcp port 443
#  FirewallRule allow tcp port 22
# Or for happy customers allow all
#  FirewallRule allow all
FirewallRule allow tcp port 8080 to 192.168.4.1
FirewallRule allow tcp port 80 to 192.168.4.1
FirewallRule allow tcp port 2050 to 192.168.4.1
#FirewallRule allow tcp port 80 to 17.253.53.203

# You might use ipset to easily allow/block range of ips, e.g.: 
# FirewallRule allow ipset WHITELISTED_IPS
# FirewallRule allow tcp port 80 ipset WHITELISTED_IPS
}
# end FirewallRuleSet authenticated-users

# FirewallRuleSet: preauthenticated-users
#
# Control access for users before authentication.
# These rules are inserted in the PREROUTING chain
# of the router's nat table, and in the
# FORWARD chain of the router's filter table.
# These rules apply to packets that have come in to the 
# router over the GatewayInterface from MAC addresses that
# are not on the BlockedMACList or TrustedMACList,
# are *not* authenticated with Nodogsplash.  The rules are
# considered in order, and the first rule that matches
# a packet applies to it. A packet that does not match 
# any rule here is rejected.
# N.B.: This ruleset is completely independent of
# the authenticated-users and users-to-router rulesets.
#
FirewallRuleSet preauthenticated-users {
# For preauthenticated users to resolve IP addresses in their
# initial request not using the router itself as a DNS server.
# Leave commented to help prevent DNS tunnelling
#  FirewallRule allow tcp port 53	
#  FirewallRule allow udp port 53
#
# For splash page content not hosted on the router, you
# will want to allow port 80 tcp to the remote host here.
# Doing so circumvents the usual capture and redirect of
# any port 80 request to this remote host.
# Note that the remote host's numerical IP address must be known
# and used here.  
#  FirewallRule allow tcp port 80 to 123.321.123.321
}
# end FirewallRuleSet preauthenticated-users


# FirewallRuleSet: users-to-router
#
# Control access to the router itself from the GatewayInterface.
# These rules are inserted at the beginning of the
# INPUT chain of the router's filter table, and
# apply to packets that have come in to the router
# over the GatewayInterface from MAC addresses that
# are not on the TrustedMACList, and are destined for
# the router itself.  The rules are
# considered in order, and the first rule that matches
# a packet applies to it. 
# If there are any rules in this ruleset, a
# packet that does not match any rule is rejected.
#
FirewallRuleSet users-to-router {
 # Nodogsplash automatically allows tcp to GatewayPort,
 # at GatewayAddress, to serve the splash page.
 # However you may want to open up other ports, e.g.
 # 53 for DNS and 67 for DHCP if the router itself is
 # providing these services.
    FirewallRule allow udp port 53	
    FirewallRule allow tcp port 53	
    FirewallRule allow udp port 67
 # You may want to allow ssh, http, and https to the router
 # for administration from the GatewayInterface.  If not,
 # comment these out.
   FirewallRule allow tcp port 22
   FirewallRule allow tcp port 80
   FirewallRule allow tcp port 443
   FirewallRule allow tcp port 8080 to 192.168.4.1
   FirewallRule allow tcp port 8080 to 192.168.2.10
   FirewallRule allow tcp port 5900
}
# end FirewallRuleSet users-to-router

# EmptyRuleSetPolicy directives
# The FirewallRuleSets that NoDogSplash permits are:
#
# authenticated-users
# preauthenticated-users
# users-to-router
# trusted-users
# trusted-users-to-router
#
# For each of these, an EmptyRuleSetPolicy can be specified.
# An EmptyRuleSet policy applies to a FirewallRuleSet if the
# FirewallRuleSet is missing from this configuration file,
# or if it exists but contains no FirewallRules.
#
# The possible values of an EmptyRuleSetPolicy are:
# allow  -- packets are accepted
# block  -- packets are rejected
# passthrough -- packets are passed through to pre-existing firewall rules
#
# Default EmptyRuleSetPolicies are set as follows:
# EmptyRuleSetPolicy authenticated-users passthrough
# EmptyRuleSetPolicy preauthenticated-users block
# EmptyRuleSetPolicy users-to-router block
# EmptyRuleSetPolicy trusted-users allow
# EmptyRuleSetPolicy trusted-users-to-router allow


# Parameter: GatewayName
# Default: NoDogSplash
#
# Set  GatewayName to the name of your gateway.  This value
# will be available as variable $gatewayname in the splash page source
# and in status output from ndsctl, but otherwise doesn't matter.
# If none is supplied, the value 'NoDogSplash' is used.
#
# GatewayName NoDogSplash

# Parameter: GatewayAddress
# Default: Discovered from GatewayInterface
#
# This should be autodetected on an OpenWRT system, but if not:
# Set GatewayAddress to the IP address of the router on
# the GatewayInterface.  This is the address that the Nodogsplash
# server listens on.
#
# GatewayAddress 192.168.1.1

# Parameter: StatusPage
# Default: status.html
#
# The page the client is show if the client is already authenticated but navigates to the captive portal.
#
# StatusPage status.html

# Parameter: SplashPage
# Default: splash.html
#
# The page the client is redirected to if not authenticated or whitelisted.
#
# SplashPage splash.html

# Parameter: RedirectURL
# Default: none
#
# After authentication, normally a user is redirected 
# to their initially requested page. 
# If RedirectURL is set, the user is redirected to this URL instead.
# 
# RedirectURL http://www.ilesansfil.org/

# Parameter: GatewayPort
# Default: 2050
#
# Nodogsplash's own http server uses GatewayAddress as its IP address.
# The port it listens to at that IP can be set here; default is 2050.
#
# GatewayPort 2050

# Parameter: MaxClients
# Default: 20
#
# Set MaxClients to the maximum number of users allowed to 
# connect at any time.  (Does not include users on the TrustedMACList,
# who do not authenticate.)
#
  MaxClients 250

# Parameter: SessionTimeout
# Default: 0
#
# Set the default session length in minutes. A value of 0 is for
# sessions without an end.
#

# Parameter: PreAuthIdleTimeout
# Default: 10
#
# Set PreAuthIdleTimeout to the desired number of minutes before
# an pre-authenticated user is automatically removed from the client list.
#

# Parameter: AuthIdleTimeout
# Default: 120
#
# Set AuthIdleTimeout to the desired number of minutes before
# an authenticated user is automatically 'deauthenticated'
# and removed from the client list.
#

# Parameter: CheckInterval
# Default: 30
#
# Interval in seconds (!) the timeouts of all clients are checked.
#

# Parameter: MACMechanism
# Default: block
#
# Either block or allow.
# If 'block', MAC addresses on BlockedMACList are blocked from
# authenticating, and all others are allowed.
# If 'allow', MAC addresses on AllowedMACList are allowed to
# authenticate, and all other (non-trusted) MAC's are blocked.
#
# MACMechanism block

# Parameter: BlockedMACList
# Default: none
#
# Comma-separated list of MAC addresses who will be completely blocked
# from the GatewayInterface. Ignored if MACMechanism is allow.
# N.B.: weak security, since MAC addresses are easy to spoof.
#
# BlockedMACList 00:00:DE:AD:BE:EF,00:00:C0:1D:F0:0D

# Parameter: AllowedMACList
# Default: none
#
# Comma-separated list of MAC addresses who will not be completely
# blocked from the GatewayInterface. Ignored if MACMechanism is block.
# N.B.: weak security, since MAC addresses are easy to spoof.
#
# AllowedMACList 00:00:12:34:56:78

# Parameter: TrustedMACList
# Default: none
#
# Comma-separated list of MAC addresses who are not subject to
# authentication, and are not restricted by any FirewallRuleSet.
# N.B.: weak security, since MAC addresses are easy to spoof.
#
# TrustedMACList 00:00:CA:FE:BA:BE, 00:00:C0:01:D0:0D

# Parameter: TrafficControl
# Default: no
#
# Set to yes (or true or 1), to enable traffic control in Nodogsplash.
#
# TrafficControl no

# Parameter: DownloadLimit
# Default: 0
#
# If TrafficControl is enabled, this sets the maximum download
# speed to the GatewayInterface, in kilobits per second.
# For example if you have an ADSL connection with 768 kbit
# download speed, and you want to allow about half of that
# bandwidth for the GatewayInterface, set this to 384.
# A value of 0 means no download limiting is done.
#
# DownloadLimit 384

# Parameter: UploadLimit
# Default: 0
#
# If TrafficControl is enabled, this sets the maximum upload
# speed from the GatewayInterface, in kilobits per second.
# For example if you have an ADSL connection with 128 kbit
# upload speed, and you want to allow about half of that
# bandwidth for the GatewayInterface, set this to 64.
# A value of 0 means no upload limiting is done.
#
# UploadLimit 64

# Parameter: GatewayIPRange
# Default: 0.0.0.0/0
#
# By setting this parameter, you can specify a range of IP addresses
# on the GatewayInterface that will be responded to and managed by
# Nodogsplash.  Addresses outside this range do not have their packets
# touched by Nodogsplash at all.
# Defaults to 0.0.0.0/0, that is, all addresses.
#
# GatewayIPRange 0.0.0.0/0

# Parameter: DebugLevel
# Default: 1
#
# Set the debug level:
# 0: errors only
# 1: errors, warnings, infos
# 2: errors, warnings, infos, verbose messages
# 3: errors, warnings, infos, verbose messages, debug messages
#
#  DebugLevel 1

# preauth '/usr/lib/nodogsplash/login.sh'
#
# or this one for Debian and other Linux distributions
# preauth '/etc/nodogsplash/login.sh'

# Parameter: BinAuth
#
# Enable BinAuth Support.
# If set, a program is called with several parameters on authentication (request) and deauthentication.
#
# Request for authentication:
#
# $<BinAuth> auth_client <client_mac> '<username>' '<password>'
#
# The username and password values may be empty strings and are URL encoded.
# The program is expected to output the number of seconds the client
# is to be authenticated. Zero or negative seconds will cause the authentification request
# to be rejected. The same goes for an exit code that is not 0.
# The output may contain a user specific download and upload limit in KBit/s:
# <seconds> <upload> <download>
#
# Called on authentication or deauthentication:
# $<BinAuth> <*auth|*deauth> <incoming_bytes> <outgoing_bytes> <session_start> <session_end>
#
# 'client_auth': Client authenticated via this script.
# 'client_deauth': Client deauthenticated by the client via splash page.
# 'idle_deauth': Client was deauthenticated because of inactivity.
# 'timeout_deauth': Client was deauthenticated because the session timed out.
# 'ndsctl_auth': Client was authenticated manually by the ndsctl tool.
# 'ndsctl_deauth': Client was deauthenticated by the ndsctl tool.
# 'shutdown_deauth': Client was deauthenticated by Nodogsplash terminating.
#
# Values session_start and session_start are in seconds since 1970 or 0 for unknown/unlimited.
#
# BinAuth /bin/myauth.sh

# Nodogsplash uses specific HEXADECIMAL values to mark packets used by iptables as a bitwise mask.
# This mask can conflict with the requirements of other packages such as mwan3, sqm etc
# Any values set here are interpreted as in hex format.
#
# Parameter: fw_mark_authenticated
# Default: 30000 (0011|0000|0000|0000|0000 binary)
#
# Parameter: fw_mark_trusted
# Default: 20000 (0010|0000|0000|0000|0000 binary)
#
# Parameter: fw_mark_blocked
# Default: 10000 (0001|0000|0000|0000|0000 binary)
#
GatewayInterface wlan0
GatewayAddress 192.168.4.1
MaxClients 250
AuthIdleTimeout 120" > /etc/nodogsplash/nodogsplash.conf

sudo echo '<!DOCTYPE html>
<html>

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>$gatewayname Hotspot Gateway.</title>
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Expires" content="0">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="/images/splash.jpg" type="image/x-icon">
	<style>
		body {
			background: #FEFAE0;
			background-attachment: fixed;
			background-size: 100% 100%;
			color: #BC6C25;
			font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif;
			font-weight: 100;
			-webkit-font-smoothing: antialiased;
			margin: 0px;
		}

		.page_wrapper {
			margin-top: 5%;
			display: table;
			width: 100%;
		}

		.content {
			margin: auto;
			width: 80%;
			display: flex;
			justify-content: center;
			text-align: center;
		}

		form {
			font-size: 20px;
			width: 60%;
			font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif;
			font-weight: 100;
			-webkit-font-smoothing: antialiased;
			text-align: center;
		}

		/*SUBMIT BUTTON*/
		input[type=submit] {
			display: block;
			font-size: 20px !important;
			padding: 16px;
			margin-top: 20px;
			border: 1px solid rgb(0, 0, 0);
			background: none;
			cursor: pointer;
			background-color: #BC6C25;
			transition: background 0.3s, color 0.3s;
			width: 100%;
			color: #fff;
			border-radius: 50px;
		}

		input[type=submit]:hover {
			background-color: #9e6029;
			color: #fff;
		}

		@media (max-width: 540px) {
			.content {
				margin-left: 10%;
				margin-right: 10%;
			}

			input[type=submit] {
				font-size: 15px !important;
				padding: 5px;
				margin-top: 10px;
			}

			form {
				width: 90%;
				font-size: 15px;
				margin: 0px auto;
			}

			h1 {
				font-size: 50px;
				line-height: 80px;
			}

			h2 {
				font-size: 30px;
				text-align: center !important;

			}
		}
	</style>
</head>

<body>

	<div class="page_wrapper">

		<!--Login section-->

		<div class="content">
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="200px" height="200px"
				viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">
				<image id="image0" width="200" height="200" x="0" y="0" href="data:image/png;base64,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
			OjAw0dmNjAAAAABJRU5ErkJggg==" />
			</svg>
		</div>

		<div class="content">
			<strong>
				Welkom bij Tulip Air! Klik op 'Doorgaan' om gebruik te kunnen maken van het entertainmentsysteem PFIS.
			</strong>
		</div>
		<br>

		<div class="content">

			<form method="get" action="$authaction">
				<label><input type="checkbox" required>Ik ga akkoord met de voorwaarden</label>
				<input type="hidden" name="tok" value="$tok">
				<input type="hidden" name="redir" value="$redir">
				<input type="submit" value="Doorgaan">
			</form>
		</div>
	</div>

</body>

</html>

' > /etc/nodogsplash/htdocs/splash.html


sudo nodogsplash
