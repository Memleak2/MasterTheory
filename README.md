# MasterTheory
A simple 3-tier responsive mobile-application where the architecture is inspired to the Steven Hawking Theories

 Questo progetto è semplicemente infrastruttura di un applicazione che fornisce eventi mondani per la regione Campania. 
 L'architettura in ogni suo punto è ispirata alle teorie del famoso fisico Steven Hawking, troviamo quindi riferimenti ai multimondi
 ,la teoria delle p-brane, le collisioni dei globuli di bok, orizzonte degli eventi , singolarità ecc.
 
 Panoramica generale introduttiva.
 
 Rapidamente mostrerò un esempio di funzionamento e qual'è la teoria relativa a cui si ispira.
 
 La struttura del server è chiamata ORION (la nebulosa), si tratta di un server node che comunica sia con i client che con il db di tipo 
 mongo il cui nome è (TEORIA-M).
 
 Il punto d'accesso del web service esposto da orion è chiamato "Hubble"(il nostro telescopio spaziale) e il suo endopoint è "Watch"
 quindi come prima associazione abbiamo Hubble--->Watch---->Orion :D
 
 Una prima teoria a cui si ispira il progetto è il famosissimo orizzonte degli eventi e il collasso alla singolarità di un buco nero:
 Questa teoria l'ho riprodotta con uno script server-side in python.Si occupa di prelevare dal db di produzione tutti gli elementi
 scaduti e riporti nel db locale chiamato "Gargantua" (un buco nero) utilizzando un metodo "Collapse" che sta proprio ad indicare
 il collasso del buco nero.
 
 Pubblicherò a breve una documentazione dettagliata sul funzionamento completo del progetto.
