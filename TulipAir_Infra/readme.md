### Aannames

Dit script gaat uit van een paar zaken:
+ *wlan0* is de onboard wifi NIC
+ *Nieuwe situatie gaat uit van Wifi <-> Wifi routing*
+ *eth0* is de onboard RJ-45 (bekabeld) NIC *word niet meer gebruikt!*
+ *iptables-legacy* is aanwezig op het systeem

***

### Installatie 

Copy '*config_infra.sh*' naar je Raspberry PI. (Bijv. Filezilla)

De file moet executable worden anders zal het niet werken
+ *sudo chmod +x config_infra.sh*

Alles is nu klaar voor de installatie:
+ *sudo ./config_infra.sh*

***

###WiFi oplossing Raspberry Pi

Copy '*wifitowifi.sh of wifi2wifiRT.sh*' naar je Raspberry PI. (Bijv. Filezilla)

De file moet executable worden anders zal het niet werken
+ *sudo chmod +x wifitowifi.sh of wifi2wifiRT.sh*

Alles is nu klaar voor de installatie:
+ *sudo ./wifitowifi.sh of wifi2wifiRT.sh*


### Verbinden met de WiFi

Het netwerk heeft als naam (SSID):
+ TulipAir-Passenger
+ 2de pi is EnjoyYourFlightT4

Het wachtwoord voor *TulipAir-Passenger* en *EnjoyYourFlightT4*:
+ TulipAirPassenger
+ Wachtwoord wifi pi Welkom01

***

### Restore (Deze hoort bij de config_infra.sh)

Copy '*restore.sh*' naar je Raspberry PI. (Bijv. Filezilla)

De file moet executable worden anders zal het niet werken
+ *sudo chmod +x restore.sh*

Alles is nu klaar voor de installatie:
+ *sudo ./restore.sh*

De RPI zal *automatisch rebooten* aan het eind van het script.

***

### Upgrade firewall (Deze hoort bij de config_infra.sh)

Copy '*upgrade_firewall.sh*' -> */opt/TulipAir/services/iptables/*

De file moet executable worden anders zal het niet werken
+ *sudo chmod +x upgrade_firewall.sh*

Alles is nu klaar voor de installatie:
+ *sudo ./upgrade_firewall.sh*

***

### Iptables services aanmaken (Eenmalig) (Deze hoort bij de config_infra.sh)

Copy '*create_iptables_service.sh*' -> */opt/TulipAir/services/iptables/*

De file moet executable worden anders zal het niet werken
+ *sudo chmod +x create_iptables_service.sh*

Alles is nu klaar voor de installatie:
+ *sudo ./create_iptables_service.sh*


### Nodogsplash installatie 

Voer een git pull uit richting de pi in het map var/www/html/team04 

De file moet executable worden anders zal het niet werken
+ *sudo chmod +x ./nodogsplash_setup.sh

Alles is nu klaar voor de installatie;
+ *sudo ./nodogsplash_setup.sh
