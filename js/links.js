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
      { what: "Interrail-Tag 3 · 28.02.2027", small: "SJ Nattåg Stockholm C → Malmö C (1. Klasse Schlafwagen)" },
      { what: "Interrail-Tag 4 · 01.03.2027", small: "Malmö C → København H → Hamburg Hbf → Würzburg Hbf" }
    ]
  },
  {
    title: "Unterkunft: Mökki",
    items: [
      { what: "Lomarengas · Buchung", small: "20.–25.02.2027 · 5 Nächte · Mökki Pihlajanmarja, Kukasjärvi (Sodankylä)", ref: "#2168339", url: "https://www.lomarengas.fi/mokit/sodankyla-pihlajanmarja-15461", ext: "lomarengas.fi" },
      { what: "Lomarengas · Objekt", small: "Pihlajanmarja", ref: "15461 PIHLAJANMARJA" },
      { what: "Lomarengas · Kundennummer", ref: "1228585" }
    ]
  },
  {
    title: "Fähre & Nachtzug",
    items: [
      { what: "Viking Line: Nachtfähre Turku → Stockholm", small: "25.02.2027 · Abfahrt 20:55 Uhr · Schlafkabine · Interrail-Rabatt", url: "https://www.vikingline.com", ext: "vikingline.com" },
      { what: "SJ Nattåg: Stockholm C → Malmö C", small: "28.02.2027 · 23:00 Uhr · 1. Klasse Schlafwagenabteil (1 klass Sovvagn) · inkl. Hotel-Frühstücksbuffet im Clarion Hotel Malmö Live / Scandic Kramer", url: "https://www.sj.se", ext: "sj.se" }
    ]
  },
  {
    title: "Züge",
    items: [
      { what: "VR Finnland: Helsinki → Rovaniemi", small: "20.02.2027 · Tagzug", url: "https://www.vr.fi", ext: "vr.fi" },
      { what: "VR Finnland: Rovaniemi → Turku Satama", small: "25.02.2027 · Tagzug, Anschluss an die Fähre um 20:55", url: "https://www.vr.fi", ext: "vr.fi" },
      { what: "DSB: EuroCity Kopenhagen → Hamburg", small: "01.03.2027", url: "https://www.dsb.dk", ext: "dsb.dk" },
      { what: "Deutsche Bahn: ICE Hamburg → Würzburg Hbf", small: "01.03.2027", url: "https://www.bahn.de", ext: "bahn.de" }
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
