/* Interaktive Reisekarte (Leaflet.js / OpenStreetMap)
   Marker: Stationen (fest), Sehenswürdigkeiten (SIGHTS) und Essen (FOOD);
   die Daten stehen in sights.js und essen.js. */

(function () {
  "use strict";

  var mapEl = document.getElementById("map");
  if (!mapEl) return;

  /* Fallback, falls das Leaflet-CDN nicht erreichbar ist */
  if (typeof L === "undefined") {
    mapEl.innerHTML =
      '<div class="map-fallback">' +
      "<p><strong>Die Karte konnte nicht geladen werden.</strong></p>" +
      '<p>Leaflet ist gerade nicht erreichbar — die Stationen stehen auch in der ' +
      '<a href="agenda.html">Agenda</a>.</p></div>';
    return;
  }

  function esc(v) {
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---- Stationen (Verkehr & Unterkunft) ---- */
  var stations = {
    wuerzburg: { coords: [49.8016, 9.9358], name: "Würzburg Hbf",
      desc: "Start am Fr 19.02. und Ziel am Di 02.03. — mit dem ICE aus Hamburg." },
    helsinki: { coords: [60.1719, 24.9414], name: "Helsinki",
      desc: "Ankunft mit VL850 am 19.02. um 16:50 Uhr; am 20.02. mit dem VR-Tagzug nach Rovaniemi (Interrail-Tag 1)." },
    sokos: { coords: [60.1709, 24.9416], name: "Sokos Hotel Presidentti",
      desc: "Eteläinen Rautatiekatu 4 · Übernachtung 19.–20.02. mit Frühstück, nicht erstattungsfähig · Lage auf der Karte ungefähr.",
      link: "https://www.google.com/maps/search/?api=1&query=Original+Sokos+Hotel+Presidentti+Eteläinen+Rautatiekatu+4+Helsinki" },
    rovaniemi: { coords: [66.4990, 25.7100], name: "Rovaniemi",
      desc: "Ankunft des Tagzugs am 20.02. gegen 16:00, Green-Motion-Mietwagen am Bahnhof (Ratakatu 5) um 16:30, Großeinkauf bei Prisma. Rückgabe am 25.02. um 08:00. Am 25.02. Abfahrt nach Turku (Interrail-Tag 2)." },
    moekki: { coords: [66.8520, 25.3200], name: "Mökki Pihlajanmarja",
      desc: "Lomarengas #2168339 · 20.–25.02.2027 · 5 Nächte mit holzbefeuerter Strandsauna am Kukasjärvi.",
      link: "https://www.lomarengas.fi/mokit/sodankyla-pihlajanmarja-15461" },
    turku: { coords: [60.4353, 22.2242], name: "Turku Satama",
      desc: "Viking Line Nachtfähre nach Stockholm, Abfahrt 25.02. um 20:55 Uhr (Schlafkabine).",
      link: "https://www.vikingline.com" },
    nordiclight: { coords: [59.3313, 18.0585], name: "Nordic Light Hotel",
      desc: "Vasaplan 7, am Hauptbahnhof · 26.02.–01.03. mit Frühstück · Check-in 15:00–00:00 · Bezahlung vor Ort · kostenlos stornierbar bis 24.02. 23:59 Uhr.",
      link: "https://www.google.com/maps/search/?api=1&query=Nordic+Light+Hotel+Vasaplan+7+Stockholm" },
    stockholm: { coords: [59.3303, 18.0586], name: "Stockholm Central",
      desc: "Fähre am 26.02. morgens, vier Tage Stadt. Abfahrt des SJ Night trains am Mo 01.03. um 23:16 Uhr (Buchung WQXTRN7J)." },
    malmoe: { coords: [55.6093, 13.0007], name: "Malmö Central",
      desc: "Ankunft des Night trains am Di 02.03. um 06:59 Uhr; Frühstück im Zug bis 09:00 Uhr." },
    kopenhagen: { coords: [55.6727, 12.5648], name: "København H",
      desc: "Über die Öresundbrücke — weiter mit dem EuroCity nach Hamburg." },
    frankfurt: { coords: [50.0379, 8.5622], name: "Frankfurt Flughafen (FRA)",
      desc: "Lufthansa VL850 nach Helsinki, Abflug 19.02. um 13:25 Uhr, Terminal 1 · Buchung 9664W4." },
    hamburg: { coords: [53.5530, 10.0067], name: "Hamburg Hbf",
      desc: "Umstieg auf den ICE nach Würzburg Hbf." }
  };

  /* ---- Streckenkorridore -------------------------------------------------
     Stützpunkte an Bahnhöfen, Häfen und Straßenpunkten. Genauigkeit:
     Ortsebene — keine exakte Gleis- oder Fahrwassergeometrie.             */

  var corridor = {
    /* Lufthansa VL850: Frankfurt (FRA) → Helsinki (HEL), Luftlinie */
    flight: [[50.0379, 8.5622], [60.3172, 24.9633]],

    /* Anreise Würzburg → Frankfurt Flughafen (Verbindung noch offen) */
    wuerzburgFrankfurt: [[49.8016, 9.9358], [49.9800, 9.1440], [50.0530, 8.5700]],

    /* VR Tagzug: Hauptbahn Helsinki – Tampere – Seinäjoki – Oulu – Kemi */
    helsinkiRovaniemi: [
      [60.1719, 24.9414],  // Helsinki
      [60.7370, 24.7740],  // Riihimäki
      [61.4980, 23.7730],  // Tampere
      [62.7890, 22.8380],  // Seinäjoki
      [63.8380, 23.1310],  // Kokkola
      [65.0130, 25.4720],  // Oulu
      [65.7360, 24.5640],  // Kemi
      [66.4990, 25.7100]   // Rovaniemi
    ],

    /* Rückweg am 25.02.: dieselbe Hauptbahn bis Tampere, dann über Toijala nach Turku */
    rovaniemiTurku: [
      [66.4990, 25.7100],  // Rovaniemi
      [65.7360, 24.5640],  // Kemi
      [65.0130, 25.4720],  // Oulu
      [63.8380, 23.1310],  // Kokkola
      [62.7890, 22.8380],  // Seinäjoki
      [61.4980, 23.7730],  // Tampere
      [61.1720, 23.8650],  // Toijala
      [60.4520, 22.2530],  // Turku
      [60.4353, 22.2242]   // Turku Satama
    ],

    /* Viking Line durch den Schärengarten und südlich von Åland */
    ferryTurkuStockholm: [
      [60.4353, 22.2242],  // Turku Satama
      [60.3900, 21.9500],
      [60.2400, 21.3000],
      [60.0900, 20.5000],  // südlich von Åland
      [59.9600, 19.6500],
      [59.7500, 19.1500],
      [59.5500, 18.8500],
      [59.4300, 18.5200],  // Stockholmer Schären
      [59.3500, 18.1100]   // Värtahamnen
    ],

    /* SJ Night train über die Södra stambanan */
    stockholmMalmoe: [
      [59.3303, 18.0586],  // Stockholm C
      [59.1950, 17.6260],  // Södertälje
      [59.0000, 16.2060],  // Katrineholm
      [58.5920, 16.1860],  // Norrköping
      [58.4160, 15.6250],  // Linköping
      [57.6530, 14.6960],  // Nässjö
      [56.8990, 14.5560],  // Alvesta
      [56.1580, 13.7660],  // Hässleholm
      [55.7060, 13.1860],  // Lund
      [55.6093, 13.0007]   // Malmö C
    ],

    /* Öresundbrücke */
    malmoeKopenhagen: [
      [55.6093, 13.0007],  // Malmö C
      [55.5640, 12.9760],  // Hyllie
      [55.5700, 12.8300],  // Öresundbrücke
      [55.6300, 12.6500],  // Kastrup
      [55.6727, 12.5648]   // København H
    ],

    /* EuroCity über Fünen und Jütland (Fehmarnbelt-Tunnel noch nicht in Betrieb) */
    kopenhagenHamburg: [
      [55.6727, 12.5648],  // København H
      [55.3900, 10.3860],  // Odense
      [55.5650,  9.7520],  // Fredericia
      [55.4910,  9.4690],  // Kolding
      [54.8200,  9.3600],  // Padborg
      [54.7740,  9.4370],  // Flensburg
      [54.0740,  9.9850],  // Neumünster
      [53.5530, 10.0067]   // Hamburg Hbf
    ],

    /* ICE Hamburg – Hannover – Göttingen – Kassel – Fulda – Würzburg */
    hamburgWuerzburg: [
      [53.5530, 10.0067],  // Hamburg Hbf
      [52.3760,  9.7410],  // Hannover Hbf
      [51.5360,  9.9260],  // Göttingen
      [51.3130,  9.4470],  // Kassel-Wilhelmshöhe
      [50.5550,  9.6840],  // Fulda
      [49.8016,  9.9358]   // Würzburg Hbf
    ],

    /* Autofahrten ab dem Mökki — Verlauf schematisch */
    moekkiRovaniemi: [[66.8520, 25.3200], [66.7500, 25.4500], [66.6000, 25.6000], [66.4990, 25.7100]],
    moekkiUnarin:    [[66.8520, 25.3200], [66.8920, 25.4310]],
    moekkiKierinki:  [[66.8520, 25.3200], [66.9200, 25.4000], [66.9742, 25.4735]],
    moekkiLuosto:    [[66.8520, 25.3200], [67.0200, 26.1500], [67.1530, 26.9070]],
    moekkiSodankyla: [[66.8520, 25.3200], [67.1000, 26.0000], [67.4165, 26.5932]]
  };

  function reverse(pts) { return pts.slice().reverse(); }

  /* ---- Karte ---- */
  var map = L.map(mapEl, { scrollWheelZoom: true });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
  }).addTo(map);

  /* ---- Routen-Segmente ----
     Zug blau · Nachtzug dunkel · Fähre türkis · Flug gepunktet · Autofahrt grün gestrichelt */
  var styles = {
    train:     { color: "#2563a8", weight: 4, opacity: 0.9 },
    sleeper:   { color: "#16283c", weight: 4, opacity: 0.9 },
    ferry:     { color: "#0e9bb0", weight: 4, opacity: 0.95 },
    flight:    { color: "#9db8e0", weight: 3, opacity: 0.95, dashArray: "2 8" },
    excursion: { color: "#4a90c2", weight: 3, opacity: 0.9, dashArray: "8 8" }
  };

  var segments = [
    { type: "train",     label: "Würzburg → Frankfurt Flughafen (19.02.)",       pts: corridor.wuerzburgFrankfurt },
    { type: "flight",    label: "Lufthansa VL850: Frankfurt → Helsinki (19.02.)", pts: corridor.flight },
    { type: "train",     label: "VR Tagzug: Helsinki → Rovaniemi (20.02.)",      pts: corridor.helsinkiRovaniemi },
    { type: "excursion", label: "Mökki ↔ Rovaniemi",                             pts: corridor.moekkiRovaniemi },
    { type: "excursion", label: "Mökki → Unarinköngäs",                          pts: corridor.moekkiUnarin },
    { type: "excursion", label: "Mökki → Kierinki",                              pts: corridor.moekkiKierinki },
    { type: "excursion", label: "Mökki → Luosto / Lampivaara",                   pts: corridor.moekkiLuosto },
    { type: "excursion", label: "Mökki → Sodankylä",                             pts: corridor.moekkiSodankyla },
    { type: "train",     label: "VR Tagzug: Rovaniemi → Turku (25.02.)",         pts: corridor.rovaniemiTurku },
    { type: "ferry",     label: "Viking Line: Turku → Stockholm (25.02.)",       pts: corridor.ferryTurkuStockholm },
    { type: "sleeper",   label: "SJ Night train: Stockholm → Malmö (01.03.)",         pts: corridor.stockholmMalmoe },
    { type: "train",     label: "Malmö → København H (02.03.)",                  pts: corridor.malmoeKopenhagen },
    { type: "train",     label: "EuroCity: København → Hamburg",                 pts: corridor.kopenhagenHamburg },
    { type: "train",     label: "ICE: Hamburg → Würzburg",                       pts: corridor.hamburgWuerzburg }
  ];

  segments.forEach(function (seg) {
    L.polyline(seg.pts, styles[seg.type]).addTo(map).bindTooltip(seg.label, { sticky: true });
  });

  /* ---- Marker (über den Linien), in drei schaltbaren Gruppen ---- */
  var GROUPS = {
    station: { label: "Stationen",          color: "#173553", layer: L.layerGroup() },
    sight:   { label: "Sehenswürdigkeiten", color: "#0e9bb0", layer: L.layerGroup() },
    food:    { label: "Essen & Kaffee",     color: "#d98a3d", layer: L.layerGroup() }
  };

  function pin(color) {
    return L.divIcon({
      className: "",
      html:
        '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);' +
        "background:" + color + ';border:2px solid #eef4f9;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 18],
      popupAnchor: [0, -18]
    });
  }

  function addMarker(group, coords, name, desc, link, linkLabel, extra) {
    var html =
      '<div class="popup-title">' + esc(name) + "</div>" +
      (extra ? '<div class="popup-tag">' + esc(extra) + "</div>" : "") +
      '<div class="popup-desc">' + esc(desc) + "</div>" +
      (link
        ? '<a class="popup-link" href="' + esc(link) + '" target="_blank" rel="noopener">' + linkLabel + " →</a>"
        : "");
    L.marker(coords, { icon: pin(GROUPS[group].color), title: name })
      .bindPopup(html)
      .addTo(GROUPS[group].layer);
  }

  function short(text) {
    var first = text.split(/(?<=[.!?])\s/)[0];
    return first.length > 180 ? first.slice(0, 177).replace(/\s\S*$/, "") + " …" : first;
  }

  Object.keys(stations).forEach(function (k) {
    var s = stations[k];
    addMarker("station", s.coords, s.name, s.desc, s.link, "Website öffnen");
  });
  if (typeof SIGHTS !== "undefined") {
    Object.keys(SIGHTS).forEach(function (k) {
      var s = SIGHTS[k];
      addMarker("sight", s.coords, s.title, short(s.summary), "sightseeing.html#" + (s.coords[0] >= 62 ? "lappland" : "stockholm"), "Im Sightseeing ansehen", s.tag);
    });
  }
  if (typeof FOOD !== "undefined") {
    Object.keys(FOOD).forEach(function (k) {
      var f = FOOD[k];
      addMarker("food", f.coords, f.title, short(f.summary), f.maps, "Google Maps", f.tag + " · " + f.city);
    });
  }
  Object.keys(GROUPS).forEach(function (g) { GROUPS[g].layer.addTo(map); });

  /* ---- Filter (Markergruppen) und Ausschnitte ---- */
  var bar = document.getElementById("map-controls");
  var VIEWS = {
    all:       { label: "Gesamte Reise", pts: function () { return Object.keys(stations).map(function (k) { return stations[k].coords; }); } },
    lappland:  { label: "Lappland",      pts: function () { return [[66.35, 25.2], [67.5, 27.2]]; } },
    stockholm: { label: "Stockholm",     pts: function () { return [[59.30, 18.02], [59.36, 18.14]]; } }
  };

  function fit(view) {
    map.fitBounds(L.latLngBounds(VIEWS[view].pts()).pad(view === "all" ? 0.08 : 0.15));
  }

  if (bar) {
    bar.innerHTML =
      '<div class="chips" role="group" aria-label="Ausschnitt">' +
      Object.keys(VIEWS).map(function (v) {
        return '<button type="button" class="chip" data-view="' + v + '">' + VIEWS[v].label + "</button>";
      }).join("") + "</div>" +
      '<div class="chips" role="group" aria-label="Marker ein- oder ausblenden">' +
      Object.keys(GROUPS).map(function (g) {
        return '<button type="button" class="chip active" aria-pressed="true" data-group="' + g + '">' +
          '<span class="dot" style="background:' + GROUPS[g].color + '"></span>' + GROUPS[g].label + "</button>";
      }).join("") + "</div>";

    bar.addEventListener("click", function (e) {
      var v = e.target.closest("[data-view]");
      if (v) { fit(v.getAttribute("data-view")); return; }
      var b = e.target.closest("[data-group]");
      if (!b) return;
      var g = GROUPS[b.getAttribute("data-group")];
      var on = !map.hasLayer(g.layer);
      if (on) g.layer.addTo(map); else map.removeLayer(g.layer);
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---- Startausschnitt: gesamte Reise (oder #lappland / #stockholm) ---- */
  var startView = location.hash.replace("#", "");
  fit(VIEWS[startView] ? startView : "all");

  /* ---- Eigener Standort ----
     Rein lokal: die Position wird nur auf der Karte angezeigt und nirgends
     hingeschickt. */
  var meMarker = null, meCircle = null;

  var LocateControl = L.Control.extend({
    options: { position: "topleft" },
    onAdd: function () {
      var wrap = L.DomUtil.create("div", "leaflet-bar leaflet-control locate-control");
      var link = L.DomUtil.create("a", "", wrap);
      link.href = "#";
      link.title = "Meinen Standort anzeigen";
      link.setAttribute("role", "button");
      link.innerHTML = "◎";
      L.DomEvent.on(link, "click", function (e) {
        L.DomEvent.stop(e);
        link.classList.add("busy");
        map.locate({ setView: true, maxZoom: 13, enableHighAccuracy: false, timeout: 10000 });
      });
      L.DomEvent.disableClickPropagation(wrap);
      return wrap;
    }
  });
  map.addControl(new LocateControl());

  map.on("locationfound", function (e) {
    var busy = document.querySelector(".locate-control a");
    if (busy) busy.classList.remove("busy");

    if (meMarker) map.removeLayer(meMarker);
    if (meCircle) map.removeLayer(meCircle);

    meCircle = L.circle(e.latlng, {
      radius: e.accuracy,
      color: "#2b6aa3", weight: 1, fillColor: "#2b6aa3", fillOpacity: 0.12
    }).addTo(map);

    meMarker = L.circleMarker(e.latlng, {
      radius: 7, color: "#fff", weight: 3, fillColor: "#2b6aa3", fillOpacity: 1
    }).addTo(map).bindPopup(
      '<div class="popup-title">Mein Standort</div>' +
      '<div class="popup-desc">Genauigkeit ca. ' + Math.round(e.accuracy) + " m</div>"
    ).openPopup();
  });

  map.on("locationerror", function () {
    var busy = document.querySelector(".locate-control a");
    if (busy) busy.classList.remove("busy");
    L.popup()
      .setLatLng(map.getCenter())
      .setContent('<div class="popup-desc">Standort konnte nicht ermittelt werden.</div>')
      .openOn(map);
  });
})();
