🐸 Google Meteo (Fan-Made) & Frogger Edition

Un'esperienza meteorologica immersiva che unisce dati in tempo reale, un'interfaccia "Atmospheric UI" e un minigioco arcade adattivo.

📋 Indice

Panoramica

Caratteristiche Principali

Tecnologie Utilizzate

Struttura del Progetto

Installazione e Uso

Meteo Frogger: Come Giocare

API Credits

Disclaimer

🔭 Panoramica

Google Meteo (Fan-Made) è una suite di applicazioni web progettate per trasformare la noiosa consultazione del meteo in un'esperienza visiva.

A differenza delle app tradizionali, questo progetto utilizza un approccio procedurale: l'interfaccia cambia colori, animazioni ed elementi grafici in base alle condizioni meteorologiche reali, all'ora del giorno e alla stagione. Il progetto include anche una versione personalizzata del classico gioco Frogger, dove la grafica e la difficoltà si adattano al meteo corrente della città selezionata.

✨ Caratteristiche Principali

🌦️ Atmospheric UI

Ciclo Giorno/Notte: Il cielo e gli elementi celesti (Sole/Luna) cambiano automaticamente in base all'orario locale e ai dati API.

Meteo Visivo: Pioggia, neve e nuvole sono renderizzate tramite particelle CSS/JS dinamiche.

Palette Stagionali: L'intero paesaggio cambia tonalità in base alla stagione (Verde per Primavera, Sabbia per Estate, Arancio per Autunno, Argento per Inverno).

🌍 Dati Globali

Supporto per tutte le nazioni e le principali città del mondo.

Previsioni a 5 giorni con icone dinamiche.

Grafici di temperatura dettagliati (tramite Chart.js).

🎮 Gamification (Frogger)

Un minigioco integrato sviluppato in Canvas.

Adaptive Environment: Se a Londra piove, nel gioco pioverà. Se a Oslo nevica, il prato di gioco sarà innevato.

Progressione: La velocità aumenta del 10% ogni 100 punti ottenuti.

🛠 Tecnologie Utilizzate

HTML5 - Struttura semantica.

CSS3 - Animazioni avanzate (@keyframes), Variabili CSS (:root), Flexbox/Grid.

JavaScript (Vanilla) - Logica di business, manipolazione DOM, Canvas API.

Chart.js - Per la visualizzazione dei dati analitici.

LocalStorage - Per la persistenza dello stato tra le pagine e il gioco.

📂 Struttura del Progetto

File

Descrizione

index.html

Landing Page. Intro animata con effetti pioggia e mascotte.

meteo.html

Hub Principale. Selezione località, visualizzazione scena dinamica e previsioni.

meteoAPI.js

Core Logic. Gestisce le chiamate API, la logica delle stagioni e il salvataggio dati.

pagina.html

Dettagli. Grafici approfonditi e dati orari.

frogger.html

Il Gioco. Motore di gioco arcade basato su Canvas con temi meteo adattivi.

🚀 Installazione e Uso

Poiché il progetto è basato su tecnologie web standard (statiche), non richiede compilazione o server backend complessi.

Clona il repository:

git clone [https://github.com/tuo-username/google-meteo-fanmade.git](https://github.com/tuo-username/google-meteo-fanmade.git)


Apri il progetto:
Naviga nella cartella e apri il file index.html con il tuo browser preferito (Chrome, Firefox, Edge).

Nota sui file JS:
Se esegui il progetto in locale, assicurati che meteoAPI.js sia nella stessa cartella dei file HTML.

🐸 Meteo Frogger: Come Giocare

Accedi al gioco tramite il pulsante "🎮 Gioca a Frogger" situato in basso a destra nella pagina principale (meteo.html).

Comandi

⬆️ Freccia Su: Salta in avanti.

⬇️ Freccia Giù: Salta indietro.

⬅️ Freccia Sinistra: Spostati a sinistra.

➡️ Freccia Destra: Spostati a destra.

Regole

Attraversa la strada evitando le auto (i camion sono lenti, le auto sportive veloci!).

Attraversa il fiume saltando sui tronchi (non cadere in acqua!).

Raggiungi il prato opposto per segnare punti e resettare la posizione.

Attenzione: Ogni 100 punti la velocità del gioco aumenta!

Debug Mode

Nel gioco è presente un pannello di controllo per testare le stagioni e il meteo senza dover cambiare città reali. Usa i bottoni in basso per forzare:

🌱 Prim 🏖️ Est 🍂 Aut ❄️ Inv (Cambio Palette)

☀️ 🌧️ 🌨️ (Cambio Meteo)

📡 API Credits

Questo progetto utilizza le seguenti API gratuite:

Open-Meteo: Per i dati meteorologici, geocoding e previsioni (Nessuna API Key richiesta).

CountriesNow: Per il database JSON di nazioni e città.

⚠️ Disclaimer

Questo è un progetto Fan-Made creato a scopo educativo e dimostrativo.
Non è affiliato, approvato o supportato da Google. La "Meteo Frog" è ispirata alla mascotte ufficiale di Google Weather.

Made with ❤️ and ☕ via HTML & JS.
