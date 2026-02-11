// Configurazione Iniziale e Variabili Globali
let globalLocations = [];
let timeInterval = null;
let currentTimezone = 'UTC';

let lastWeatherData = {
    temp: 20,
    code: 0,
    isDay: 1
};

// Dati di fallback nel caso l'API CountriesNow non risponda
const fallbackLocations = [
    { country: "Italia", cities: ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Palermo", "Genova"] },
    { country: "Francia", cities: ["Parigi", "Lione", "Marsiglia", "Nizza"] },
    { country: "USA", cities: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"] },
    { country: "Regno Unito", cities: ["Londra", "Manchester", "Liverpool", "Edimburgo"] },
    { country: "Germania", cities: ["Berlino", "Monaco", "Amburgo", "Francoforte"] },
    { country: "Spagna", cities: ["Madrid", "Barcellona", "Valencia", "Siviglia"] },
    { country: "Giappone", cities: ["Tokyo", "Osaka", "Kyoto", "Sapporo"] }
];

// Riferimenti DOM
const scene = document.getElementById('scene');
const countrySelect = document.getElementById('countrySelect');
const citySelect = document.getElementById('citySelect');
const seasonSelect = document.getElementById('seasonSelect');
const precipitationLayer = document.getElementById('precipitation-layer');

// --- 1. Gestione Nazioni e Città ---

// Scarica la lista delle nazioni
async function fetchCountries() {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await response.json();
        
        if(!data.error) {
            globalLocations = data.data;
            initDropdowns(globalLocations);
        } else {
            throw new Error("Errore API Countries");
        }
    } catch (error) {
        console.warn("API Countries fallita, uso fallback", error);
        globalLocations = fallbackLocations;
        initDropdowns(globalLocations);
    }
}

// Inizializza il menu a tendina
function initDropdowns(data) {
    countrySelect.innerHTML = '<option value="" disabled selected>Seleziona Nazione</option>';
    data.sort((a, b) => a.country.localeCompare(b.country));

    data.forEach((item, index) => {
        const opt = document.createElement('option');
        opt.value = index; 
        opt.textContent = item.country;
        countrySelect.appendChild(opt);
    });

    // Prova a selezionare l'Italia di default
    const italyIndex = data.findIndex(c => c.country === "Italy" || c.country === "Italia");
    if(italyIndex !== -1) {
        countrySelect.value = italyIndex;
        populateCities();
        const cities = data[italyIndex].cities;
        const rome = cities.find(c => c === "Rome" || c === "Roma");
        if(rome) {
            citySelect.value = rome;
            getWeather();
        }
    }
}

function populateCities() {
    const index = countrySelect.value;
    citySelect.innerHTML = '<option value="" disabled selected>Seleziona Città</option>';
    
    if (index !== "" && globalLocations[index]) {
        const cities = globalLocations[index].cities;
        cities.sort();
        
        cities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }
}

// --- 2. Gestione Meteo ---

async function getWeather() {
    const countryIndex = countrySelect.value;
    const city = citySelect.value;
    const btn = document.getElementById('searchBtn');
    
    if(!city || countryIndex === "") return;
    
    const countryName = globalLocations[countryIndex].country;

    btn.textContent = "⏳";
    btn.disabled = true;
    
    try {
        // A. Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=it&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error("Località non trovata");

        const { latitude, longitude, name } = geoData.results[0];

        // B. Meteo Completo
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const current = weatherData.current;
        const daily = weatherData.daily;

        currentTimezone = weatherData.timezone;
        startClock();

        // Update UI
        document.getElementById('locationName').textContent = `${name}, ${countryName}`;
        document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
        document.getElementById('windSpeed').textContent = current.wind_speed_10m;
        document.getElementById('description').textContent = decodeWMOCode(current.weather_code);

        renderForecast(daily);

        lastWeatherData = {
            temp: current.temperature_2m,
            code: current.weather_code,
            isDay: current.is_day
        };
        
        updateScene(lastWeatherData.temp, lastWeatherData.code, lastWeatherData.isDay);

    } catch (error) {
        console.error(error);
        alert("Impossibile recuperare i dati meteo. Riprova.");
    }
    
    btn.textContent = "Vedi Meteo";
    btn.disabled = false;
}

// --- 3. Grafica e UI ---

function forceUpdateScene() {
    updateScene(lastWeatherData.temp, lastWeatherData.code, lastWeatherData.isDay);
}

function startClock() {
    if(timeInterval) clearInterval(timeInterval);
    updateTime(); 
    timeInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    const el = document.getElementById('localTime');
    try {
        const now = new Date();
        const options = { 
            timeZone: currentTimezone, 
            hour: '2-digit', 
            minute: '2-digit',
        };
        const timeString = new Intl.DateTimeFormat('it-IT', options).format(now);
        el.textContent = timeString;
    } catch (e) {
        el.textContent = "--:--";
    }
}

function renderForecast(daily) {
    const container = document.getElementById('forecastList');
    container.innerHTML = '';

    for(let i = 1; i <= 5; i++) {
        if(!daily.time[i]) break;

        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
        const code = daily.weather_code[i];
        const max = Math.round(daily.temperature_2m_max[i]);
        const min = Math.round(daily.temperature_2m_min[i]);
        const icon = getIconForCode(code);

        const card = document.createElement('div');
        card.className = 'forecast-item';
        card.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="icon">${icon}</div>
            <div class="temps">
                <span class="max">${max}°</span> <span class="min">${min}°</span>
            </div>
        `;
        container.appendChild(card);
    }
}

function updateScene(temp, code, isDay) {
    scene.className = 'viewport'; 
    precipitationLayer.innerHTML = ''; 
    precipitationLayer.style.display = 'none';

    // Gestione Stagione
    const manualSeason = seasonSelect.value;
    let season = manualSeason;
    
    if(season === 'auto') {
        season = getSeason();
    }
    
    scene.classList.add(`season-${season}`);

    // Gestione Meteo
    const wType = getWeatherType(code);
    
    if (wType === 'rainy' || wType === 'stormy') {
        scene.classList.add('is-rainy');
        createPrecipitation('rain');
    } else if (wType === 'snowy') {
        scene.classList.add('is-snowy');
        createPrecipitation('snow');
    }

    // Gestione Temperatura
    if (temp <= 0) document.documentElement.style.setProperty('--saturation', '40%');
    else if (temp < 10) document.documentElement.style.setProperty('--saturation', '70%');
    else document.documentElement.style.setProperty('--saturation', '100%');

    // Gestione Giorno/Notte
    if (isDay === 0) scene.classList.add('is-night');
}

function createPrecipitation(type) {
    precipitationLayer.style.display = 'block';
    const count = type === 'rain' ? 80 : 40;
    const containerClass = type === 'rain' ? 'rain' : 'snow';
    const wrapper = document.createElement('div');
    wrapper.className = containerClass;
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('i');
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = Math.random() * 1 + 0.5 + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        wrapper.appendChild(drop);
    }
    precipitationLayer.appendChild(wrapper);
}

// --- 4. Funzioni di Utilità (Helper) ---

function getSeason() {
    const m = new Date().getMonth();
    if (m >= 2 && m <= 4) return 'spring';
    if (m >= 5 && m <= 7) return 'summer';
    if (m >= 8 && m <= 10) return 'autumn';
    return 'winter';
}

function getWeatherType(code) {
    if (code === 0) return 'clear';
    if (code >= 1 && code <= 3) return 'cloudy';
    if (code >= 45 && code <= 48) return 'foggy';
    if ([51,53,55,61,63,65,80,81,82].includes(code)) return 'rainy';
    if ([71,73,75,85,86].includes(code)) return 'snowy';
    if (code >= 95) return 'stormy';
    return 'clear';
}

function getIconForCode(code) {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '☁️';
    if ([51,53,55,61,63,65].includes(code)) return '🌧️';
    if ([71,73,75].includes(code)) return '❄️';
    if (code >= 95) return '⛈️';
    return '🌤️';
}

function decodeWMOCode(code) {
    const map = {
        0: "Cielo Sereno", 1: "Poco nuvoloso", 2: "Nuvoloso", 3: "Coperto",
        45: "Nebbia", 51: "Pioggerella", 61: "Pioggia", 63: "Pioggia mod.",
        71: "Neve", 95: "Temporale"
    };
    return map[code] || "Variabile";
}

// Avvio applicazione
fetchCountries();