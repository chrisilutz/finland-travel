/* Buchungen & offizielle Links — reine Daten plus Darstellung
   ---------------------------------------------------------------
   Jede Gruppe hat Einträge mit
     what   Titel            small  Details (Datum, Zeit, Klasse …)
     ref    Referenz/Nummer  ok     true → grün als „bestätigt"
     url    externer Link    ext    Linktext
   Einträge ohne ref zeigen nur den Link.
*/

var LINKS = [
  {
    title: "Interrail-Pass",
    items: [
      { what: "Interrail Global Pass", small: "4 Reisetage innerhalb von 1 Monat · Reisetage siehe unten", url: "https://www.interrail.eu", ext: "interrail.eu" },
      { what: "Interrail-Tag 1 · 20.02.2027", small: "VR Tagzug Helsinki → Rovaniemi" },
      { what: "Interrail-Tag 2 · 25.02.2027", small: "VR Tagzug Rovaniemi → Turku Satama" },
      { what: "Interrail-Tag 3 · 01.03.2027", small: "SJ Night train Stockholm C → Malmö C (1. Klasse, privates Schlafabteil) — Abfahrt 23:16, Zählweise siehe Hinweis in der Agenda" },
      { what: "Interrail-Tag 4 · 02.03.2027", small: "Malmö C → København H → Hamburg Hbf → Würzburg Hbf" }
    ]
  },
  {
    title: "Unterkünfte",
    items: [
      { what: "Sokos Hotel Presidentti, Helsinki", small: "19.–20.02.2027 · Standard-Zweibettzimmer (ca. 21 m²) mit Frühstück · 123 € laut Angebot nicht erstattungsfähig und nicht änderbar · Zahlung an LOMA (Rechnung folgt)", url: "https://www.google.com/maps/search/?api=1&query=Sokos+Hotel+Presidentti+Helsinki", ext: "Google Maps" },
      { what: "Nordic Light Hotel, Stockholm", small: "26.02.–01.03.2027 · Standard-Zweibettzimmer (ca. 16 m²) mit Frühstück · 5.355 SEK (ca. 486 €) · Stornierung bis 23.02.2027 · Zahlung vor Ort im Hotel", url: "https://www.google.com/maps/search/?api=1&query=Nordic+Light+Hotel+Stockholm", ext: "Google Maps" },
      { what: "Lomarengas · Buchung", small: "20.–25.02.2027 · 5 Nächte · Mökki Pihlajanmarja, Kukasjärvi (Sodankylä)", ref: "#2168339", url: "https://www.lomarengas.fi/mokit/sodankyla-pihlajanmarja-15461", ext: "lomarengas.fi" },
      { what: "Lomarengas · Objekt", small: "Pihlajanmarja", ref: "15461 PIHLAJANMARJA" },
      { what: "Lomarengas · Kundennummer", ref: "1228585" }
    ]
  },
  {
    title: "Mietwagen",
    items: [
      { what: "Mietwagen ab/bis Bahnhof Rovaniemi (VW Golf-Klasse)", small: "Abholung Sa 20.02. ca. 16:30 · Rückgabe Do 25.02. ca. 08:00 · gebucht über LOMA beim Makler AutoEurope · Voucher-PDF in der Buchungsmail (Voucher 978172292)", url: "https://www.autoeurope.de", ext: "autoeurope.de" },
      { what: "Hinweise zur Abholung", small: "Kreditkarte für 500 € Kaution nötig · keine unnötigen Zusatzleistungen annehmen — die Selbstbeteiligung im Schadensfall wird über AutoEurope erstattet (Unfall-/Polizeibericht einreichen)" }
    ]
  },
  {
    title: "Reisebüro",
    items: [
      { what: "LOMA Reiseagentur (Ansprechpartner: Henrik)", small: "Hotels Helsinki und Stockholm sowie Mietwagen · Rechnung folgt per Mail", url: "mailto:reiseagentur@loma.de", ext: "reiseagentur@loma.de" }
    ]
  },
  {
    title: "Flug",
    items: [
      { what: "Lufthansa VL850: Frankfurt → Helsinki", small: "19.02.2027 · 13:25 → 16:50 Ortszeit · Economy Light, nur Handgepäck · Fluggast: Christian Lutz (Vera ist schon mit der Studierendengruppe in Helsinki)", ref: "9664W4", url: "https://www.lufthansa.com", ext: "lufthansa.com" }
    ]
  },
  {
    title: "Fähre & Nachtzug",
    items: [
      { what: "Viking Line: Nachtfähre Turku → Stockholm", small: "25.02.2027 · Abfahrt 20:55 Uhr · Schlafkabine · Interrail-Rabatt", url: "https://www.vikingline.com", ext: "vikingline.com" },
      { what: "SJ Night train: Stockholm C → Malmö C", small: "Mo 01.03.2027 · 23:16 → Di 02.03. 06:59 · 1. Klasse, privates Schlafabteil (Wagen 12, Plätze 16 und 18) · Bett gemacht, Dusche/WC, Frühstück, SJ Lounge · 2 Reisende: Vera Taube, Christian Lutz · erstattbar", ref: "WQXTRN7J", url: "https://www.sj.se", ext: "sj.se" }
    ]
  },
  {
    title: "Züge",
    items: [
      { what: "VR Finnland: Helsinki → Rovaniemi", small: "20.02.2027 · Tagzug", url: "https://www.vr.fi", ext: "vr.fi" },
      { what: "VR Finnland: Rovaniemi → Turku Satama", small: "25.02.2027 · Tagzug, Anschluss an die Fähre um 20:55", url: "https://www.vr.fi", ext: "vr.fi" },
      { what: "DSB: EuroCity Kopenhagen → Hamburg", small: "02.03.2027", url: "https://www.dsb.dk", ext: "dsb.dk" },
      { what: "Deutsche Bahn: ICE Hamburg → Würzburg Hbf", small: "02.03.2027", url: "https://www.bahn.de", ext: "bahn.de" }
    ]
  },
  {
    title: "Aktivitäten",
    items: [
      { what: "Amethystmine Lampivaara", small: "Führung & Pendolino-Ticket online buchen", url: "https://www.amethystmine.fi", ext: "amethystmine.fi" },
      { what: "Skiverleih Luosto", small: "Langlaufski für die Loipe zur Mine", url: "https://www.laplandhotels.com/FI/lapin-hotellit/luosto/lapland-ski-resort-luosto.html", ext: "laplandhotels.com" }
    ]
  }
];

(function () {
  "use strict";

  var root = document.getElementById("links-root");
  if (!root) return;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  root.innerHTML = LINKS.map(function (g) {
    return '<section class="link-group"><h2>' + esc(g.title) + '</h2><ul class="booking-list">' +
      g.items.map(function (i) {
        return '<li class="booking"><span class="what">' + esc(i.what) +
          (i.small ? "<small>" + esc(i.small) + "</small>" : "") + "</span>" +
          (i.ref ? '<span class="ref' + (i.ok ? " ref-ok" : "") + '">' + esc(i.ref) + "</span>" : "") +
          (i.url ? '<a class="ext" href="' + esc(i.url) + '" target="_blank" rel="noopener">' + esc(i.ext || i.url) + " →</a>" : "") +
          "</li>";
      }).join("") + "</ul></section>";
  }).join("");
})();
