/* Wetter am aktuellen Ort der Reise
   ------------------------------------------------------------------
   Datenquelle: Open-Meteo (open-meteo.com) — kostenlos, ohne
   Registrierung und ohne API-Schlüssel, CORS ist freigegeben. Damit
   bleibt die Seite statisch und ohne Geheimnisse im Quelltext.

   Der Ort ergibt sich aus dem Datum: für jeden Reisetag ist hinterlegt,
   wo wir sind. Außerhalb des Reisezeitraums steht das Mökki voreingestellt,
   umschalten geht über die Knöpfe.

   „Mein Standort" nutzt die Geolocation des Browsers. Die Koordinaten
   werden auf zwei Nachkommastellen gerundet (rund 1 km), bevor sie an
   Open-Meteo gehen — die genaue Position verlässt das Gerät nicht.
*/

(function () {
  "use strict";

  var body = document.getElementById("weather-body");
  var mapEl = document.getElementById("weather-map");
  if (!body) return;

  /* ---- Wo sind wir wann? ---- */
  var STATIONS = [
    { date: "2027-02-19", name: "Helsinki",           coords: [60.1699, 24.9384], note: "Flug VL850, Ankunft 16:50" },
    { date: "2027-02-20", name: "Rovaniemi",          coords: [66.5039, 25.7294], note: "Tagzug & Großeinkauf" },
    { date: "2027-02-21", name: "Kukasjärvi (Mökki)", coords: [66.8520, 25.3200], note: "Ankommen & Sauna" },
    { date: "2027-02-22", name: "Luosto",             coords: [67.1530, 26.9070], note: "Amethystmine & Loipe" },
    { date: "2027-02-23", name: "Sodankylä",          coords: [67.4160, 26.5930], note: "Alariesto-Galerie" },
    { date: "2027-02-24", name: "Kukasjärvi",         coords: [66.8520, 25.3200], note: "Eiswandern & Polarlichter" },
    { date: "2027-02-25", name: "Turku (Fähre)",      coords: [60.4353, 22.2242], note: "Tagzug & Nachtfähre" },
    { date: "2027-02-26", name: "Stockholm",          coords: [59.3293, 18.0686], note: "Ankunft mit der Fähre" },
    { date: "2027-02-27", name: "Stockholm",          coords: [59.3293, 18.0686], note: "Södermalm & Museen" },
    { date: "2027-02-28", name: "Stockholm",          coords: [59.3293, 18.0686], note: "Abreise mit dem Nachtzug" },
    { date: "2027-03-01", name: "Würzburg",           coords: [49.7913,  9.9534], note: "Heimreise" }
  ];

  /* Knöpfe: ein Ort pro Name, Reihenfolge der Reise; Kukasjärvi nur einmal */
  var BASES = [
    { name: "Helsinki",   coords: [60.1699, 24.9384] },
    { name: "Rovaniemi",  coords: [66.5039, 25.7294] },
    { name: "Mökki",      coords: [66.8520, 25.3200], full: "Kukasjärvi (Mökki)" },
    { name: "Luosto",     coords: [67.1530, 26.9070] },
    { name: "Sodankylä",  coords: [67.4160, 26.5930] },
    { name: "Turku",      coords: [60.4353, 22.2242], full: "Turku (Fähre)" },
    { name: "Stockholm",  coords: [59.3293, 18.0686] }
  ];

  /* ---- WMO-Wettercodes ---- */
  var WMO = {
    0:  ["Klar", "☀️"],
    1:  ["Überwiegend klar", "🌤️"],
    2:  ["Teilweise bewölkt", "⛅"],
    3:  ["Bedeckt", "☁️"],
    45: ["Nebel", "🌫️"],
    48: ["Reifnebel", "🌫️"],
    51: ["Leichter Nieselregen", "🌦️"],
    53: ["Nieselregen", "🌦️"],
    55: ["Dichter Nieselregen", "🌧️"],
    56: ["Gefrierender Niesel", "🌧️"],
    57: ["Gefrierender Niesel", "🌧️"],
    61: ["Leichter Regen", "🌦️"],
    63: ["Regen", "🌧️"],
    65: ["Starker Regen", "🌧️"],
    66: ["Gefrierender Regen", "🌧️"],
    67: ["Gefrierender Regen", "🌧️"],
    71: ["Leichter Schneefall", "🌨️"],
    73: ["Schneefall", "🌨️"],
    75: ["Starker Schneefall", "❄️"],
    77: ["Schneegriesel", "🌨️"],
    80: ["Leichte Regenschauer", "🌦️"],
    81: ["Regenschauer", "🌧️"],
    82: ["Heftige Regenschauer", "⛈️"],
    85: ["Schneeschauer", "🌨️"],
    86: ["Starke Schneeschauer", "❄️"],
    95: ["Gewitter", "⛈️"],
    96: ["Gewitter mit Hagel", "⛈️"],
    99: ["Gewitter mit Hagel", "⛈️"]
  };

  function describe(code) { return WMO[code] || ["Unbekannt", "🌡️"]; }

  /* ---- Hilfsfunktionen ---- */

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  }

  function currentTripDay() {
    var t = todayISO();
    for (var i = 0; i < STATIONS.length; i++) if (STATIONS[i].date === t) return STATIONS[i];
    return null;
  }

  /* Entfernung in km (Haversine) */
  function distance(a, b) {
    var R = 6371, rad = function (x) { return x * Math.PI / 180; };
    var dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
    var q = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(q));
  }

  function nearestStation(coords) {
    var best = null, bestD = Infinity;
    STATIONS.concat(BASES).forEach(function (s) {
      var d = distance(coords, s.coords);
      if (d < bestD) { bestD = d; best = s; }
    });
    return { station: best, km: bestD };
  }

  function num(v, digits) {
    return typeof v === "number" ? v.toFixed(digits || 0).replace(".", ",") : "–";
  }

  /* ---- Abruf ---- */

  function fetchWeather(coords) {
    /* Auf ~1 km runden: genauer muss es für Wetter nicht sein, und bei
       „Mein Standort" bleibt die exakte Position auf dem Gerät. */
    var lat = Math.round(coords[0] * 100) / 100;
    var lon = Math.round(coords[1] * 100) / 100;
    var url = "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + lat + "&longitude=" + lon +
      "&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m" +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=auto&forecast_days=1";
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  /* ---- Mini-Karte ----------------------------------------------------
     Leaflet mit OpenStreetMap, also ohne API-Schlüssel. Ist Leaflet nicht
     erreichbar, bleibt der Kartenbereich einfach weg — die Textangaben
     stehen weiterhin. */

  var miniMap = null, miniMarker = null, miniCircle = null;

  var pin = function () {
    return L.divIcon({
      className: "",
      html: '<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;' +
            'transform:rotate(-45deg);background:#173553;border:2px solid #eef4f9;' +
            'box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>',
      iconSize: [16, 16], iconAnchor: [8, 16]
    });
  };

  function ensureMap() {
    if (!mapEl || typeof L === "undefined") return null;
    if (miniMap) return miniMap;

    mapEl.hidden = false;
    miniMap = L.map(mapEl, {
      zoomControl: true,
      scrollWheelZoom: false,     // damit das Scrollen der Seite nicht hängen bleibt
      attributionControl: true
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(miniMap);
    return miniMap;
  }

  function updateMap() {
    var m = ensureMap();
    if (!m || !state.coords) return;

    if (miniMarker) { m.removeLayer(miniMarker); miniMarker = null; }
    if (miniCircle) { m.removeLayer(miniCircle); miniCircle = null; }

    if (state.isGeo) {
      /* Eigener Standort: Punkt mit Genauigkeitskreis */
      if (state.accuracy) {
        miniCircle = L.circle(state.coords, {
          radius: state.accuracy,
          color: "#2563a8", weight: 1, fillColor: "#2563a8", fillOpacity: 0.12
        }).addTo(m);
      }
      miniMarker = L.circleMarker(state.coords, {
        radius: 7, color: "#fff", weight: 3, fillColor: "#2563a8", fillOpacity: 1
      }).addTo(m);
    } else {
      miniMarker = L.marker(state.coords, { icon: pin() }).addTo(m);
    }

    m.setView(state.coords, state.isGeo ? 12 : 11);
    /* Der Container ist beim ersten Zeichnen oft noch ohne Maße. */
    setTimeout(function () { m.invalidateSize(); }, 0);
  }

  /* ---- Darstellung ---- */

  var state = { label: null, note: null, coords: null };

  function render(data) {
    var c = data.current || {};
    var d = data.daily || {};
    var w = describe(c.weather_code);

    /* Alter der Messung bestimmen: current.time ist Ortszeit, mit dem
       UTC-Versatz lässt sich daraus der echte Zeitpunkt errechnen. */
    var stamp = Date.parse(c.time + "Z") - (data.utc_offset_seconds || 0) * 1000;
    var ageMin = isNaN(stamp) ? null : Math.round((Date.now() - stamp) / 60000);
    var stale = ageMin !== null && ageMin > 90;

    body.innerHTML =
      '<div class="weather-head">' +
        '<span class="weather-place">' + state.label + "</span>" +
        (state.note ? '<span class="weather-note">' + state.note + "</span>" : "") +
      "</div>" +
      '<div class="weather-now">' +
        '<span class="weather-icon" aria-hidden="true">' + w[1] + "</span>" +
        '<span class="weather-temp">' + num(c.temperature_2m) + "°</span>" +
        '<span class="weather-desc">' + w[0] + "</span>" +
      "</div>" +
      '<dl class="weather-detail">' +
        "<dt>Gefühlt</dt><dd>" + num(c.apparent_temperature) + "°</dd>" +
        "<dt>Wind</dt><dd>" + num(c.wind_speed_10m) + " km/h</dd>" +
        "<dt>Heute</dt><dd>" + num(d.temperature_2m_min && d.temperature_2m_min[0]) + "° bis " +
          num(d.temperature_2m_max && d.temperature_2m_max[0]) + "°</dd>" +
        "<dt>Regenrisiko</dt><dd>" +
          num(d.precipitation_probability_max && d.precipitation_probability_max[0]) + " %</dd>" +
      "</dl>" +
      '<p class="weather-stamp">' +
        (stale
          ? "Letzter bekannter Stand — vermutlich offline"
          : "Stand: " + (c.time || "").slice(11, 16) + " Uhr Ortszeit") +
      "</p>";

    renderButtons();
    updateMap();
  }

  function renderError(msg) {
    body.innerHTML =
      '<div class="weather-head"><span class="weather-place">' + state.label + "</span></div>" +
      '<p class="weather-fail">' + msg + "</p>";
    renderButtons();
    updateMap();   /* Ort bleibt sichtbar, auch wenn das Wetter fehlt */
  }

  function renderButtons() {
    var row = document.createElement("div");
    row.className = "weather-switch";

    var today = currentTripDay();
    var options = [];
    if (today) options.push({ label: "Heute: " + today.name, target: today, note: today.note });

    BASES.forEach(function (b) { options.push({ label: b.name, target: { name: b.full || b.name, coords: b.coords } }); });

    options.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = o.label;
      if (state.label === o.target.name && !state.isGeo) b.className = "active";
      b.addEventListener("click", function () { show(o.target, o.note); });
      row.appendChild(b);
    });

    if ("geolocation" in navigator) {
      var g = document.createElement("button");
      g.type = "button";
      g.className = "geo" + (state.isGeo ? " active" : "");
      g.textContent = "📍 Mein Standort";
      g.addEventListener("click", function () { useGeolocation(g); });
      row.appendChild(g);
    }

    body.appendChild(row);
  }

  function show(place, note) {
    state = { label: place.name, note: note || place.note || null, coords: place.coords, isGeo: false };
    body.innerHTML = '<p class="weather-loading">Wetter wird geladen …</p>';
    fetchWeather(place.coords)
      .then(render)
      .catch(function () {
        renderError("Das Wetter konnte nicht geladen werden. Ohne Netz zeigt die Seite den zuletzt abgerufenen Stand.");
      });
  }

  function useGeolocation(btn) {
    btn.disabled = true;
    btn.textContent = "📍 wird ermittelt …";
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var coords = [pos.coords.latitude, pos.coords.longitude];
        var near = nearestStation(coords);
        state = {
          accuracy: pos.coords.accuracy,
          label: "Mein Standort",
          note: near.km < 3
            ? "bei " + near.station.name
            : num(near.km) + " km von " + near.station.name,
          coords: coords,
          isGeo: true
        };
        body.innerHTML = '<p class="weather-loading">Wetter wird geladen …</p>';
        fetchWeather(coords).then(render).catch(function () {
          renderError("Standort ermittelt, aber das Wetter ist gerade nicht abrufbar.");
        });
      },
      function (err) {
        btn.disabled = false;
        btn.textContent = "📍 Mein Standort";
        var msg = err.code === 1
          ? "Standortfreigabe abgelehnt."
          : "Standort konnte nicht ermittelt werden.";
        var p = body.querySelector(".weather-geo-error") || document.createElement("p");
        p.className = "weather-geo-error";
        p.textContent = msg;
        body.appendChild(p);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  /* ---- Start ---- */
  var start = currentTripDay();
  if (start) {
    show(start, start.note);
  } else {
    show({ name: "Kukasjärvi (Mökki)", coords: BASES[2].coords }, "Voreingestellt — Reisezeitraum liegt außerhalb von heute");
  }
})();
