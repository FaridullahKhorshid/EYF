![Tulip Air](public/images/logo-nav.png )

# Tulip Air Project
***
### Setup project
***

### Je kunt het project clonen door de volgende commando uit te voeren:

+ git clone https://gitlab.fdmci.hva.nl/eyf/2021/team04.git
### Voer de volgende commando's uit om het project op te kunnen starten:

+ npm install
+ npm start

#### Om de database te updaten dien je de volgende commando uit te voeren

+ Database update : **npx sequelize-cli db:seed:all**

#### Als de port al reeds in gebruik is dien je de onderstaande commando uit te voeren:

+ om een 'running' port uit te schakelen: **npx kill-port 8080**
  

***
### Setup .env file
***
+ Maak een **.env** bestand aan in de root map van het project
+ Voeg de volgende database configuratie toe aan de **.env** bestand
    + DB_USER = ***Database gebruiker***
    + DB_PASS = ***Database login wachtwoord***
    + DB_NAME = ***Database naam***
    + DB_HOST = ***Database Host*** vaak is dit **localhost**
***
### Setup van een usb (voor het gebruik van muziek en films)
***
+ Formatteer usb naar de E drive als dat nog niet het geval is en maak een map **eyf** aan.
+ Mappen structuur voor muziek bestanden
  + Maak binnen het mapje **eyf** een **music** map aan
  + In de map **music** kan er een map worden gemaakt per artiest bijv. **boef**
  + Nu kan er bij elke map van een artiest, album mappen worden aangemaakt bijv. **quarantaine_sessie** worden toegvoegd
  + Binnen de album mappen kunnen muziek bestanden worden toegevoegd. Bestand type moet mp3 zijn.


+ Mappen structuur voor film bestanden
  + Maak binnen het mapje **eyf** een **films** map aan
  + Maak binnen het mapje **eyf** een **poster** map aan
  + In de map **films** dient de .mp4 bestand toegevoegd te worden
  + In de map **poster** wordt de .png bestand toegevoegd
  + Binnen de **films** map kunnen de film bestanden worden toegevoegd. De bestandtype moet mp4 zijn. 

> **_NOTE:_** alle spatie in benaming moet worden vervangen door een onderscore ( _ ).
> 
> Voorbeeld muziek:
> Quarantaine sessie => quarantaine_sessie 
> Ali b => ali_b
> Voorbeeld films:
> Venom 2 => Venom_2
> Marvel Studios Avengers Endgame => Marvel_Studios_Avengers_Endgame
