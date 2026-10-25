# Finnland & Schweden 2027 ❄️

Statische Travel-Website zur Reise vom **19. Februar bis 01. März 2027** —
Mökki in Lappland, Nachtfähre Turku → Stockholm, Stockholm und der SJ-Nachtzug
zurück nach Würzburg (Interrail Global Pass, 4 Reisetage).

Aufgebaut wie das Schwesterprojekt [scotland-travel](https://github.com/chrisilutz/scotland-travel):
Vanilla HTML/CSS/JS ohne Build-Step, Leaflet/OpenStreetMap, Open-Meteo, PWA mit Service Worker.
(Das Vorbild ist ein statisches Projekt, kein Nuxt/Tailwind — dieses Repo folgt dem Vorbild.)

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Hero, Countdown, Wetter am aktuellen Reiseort, Stationen |
| `agenda.html` | Tagesplan 19.02.–01.03. mit Interrail-Tagen, Fähre, Nachtzug |
| `map.html` | Leaflet-Karte: Route, Stationen, Sightseeing, Essen (Marker-Filter, Ausschnitte) |
| `sightseeing.html` | Sehenswürdigkeiten mit Region-Tabs, Kategorie-Filter und Detail-Popup |
| `essen.html` | Einkauf, Cafés, Restaurants mit Region-Tabs und Kategorie-Filter |
| `links.html` | Buchungsreferenzen und offizielle Links |

## Daten pflegen

| Datei | Inhalt |
|---|---|
| `js/sights.js` | `var SIGHTS` — Sehenswürdigkeiten (Popup-Inhalte, Marker) |
| `js/essen.js` | `var FOOD` — Essen, Einkauf, Kaffee |
| `js/links.js` | `var LINKS` — Buchungen und Links (Seite wird daraus gerendert) |
| `js/weather.js` | `STATIONS` — Datum → Wetterort |
| `js/map.js` | Stationen und Streckenverläufe (`corridor`) |

Die Region (Lappland / Stockholm) ergibt sich aus den Koordinaten (Breite ≥ 62° = Lappland).
Ein Hash wie `essen.html#pelikan` oder `sightseeing.html#stockholm` öffnet Tab bzw. Karte direkt.

## Offene Punkte (in der Agenda als „noch zu ergänzen“ markiert)

Anreise Würzburg → Frankfurt Flughafen, Flug für Vera (Lufthansa-Buchung 9664W4 gilt nur für Christian), Unterkunft in Helsinki und Stockholm, Transfer Rovaniemi ↔ Mökki,
Zugzeiten der VR-Tagzüge. Der Countdown zählt bis 19.02.2027, 13:25 Uhr (Abflug Frankfurt).

## Offline (PWA)

`sw.js` legt die Shell vorab ab. **Beim Ändern der Shell-Dateien `VERSION` in `sw.js` erhöhen.**

## Lokal ansehen

```bash
python3 -m http.server 8000
```

## Deployment

GitHub Pages über `.github/workflows/pages.yml` (Settings → Pages → Source: „GitHub Actions“);
alternativ `netlify.toml`. Alle Pfade sind relativ.
