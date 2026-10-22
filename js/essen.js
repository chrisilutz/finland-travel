/* Essen, Einkaufen & Kaffee — reine Daten
   ---------------------------------------------------------------
   Gepflegt wird hier; essen-page.js rendert die Karten, map.js die Marker.
   Schema wie SIGHTS, zusätzlich city (Ort) statt wiki.
*/

var FOOD = {
  /* ---------------- Lappland & Mökki ---------------- */

  "prisma-rovaniemi": {
    title: "Prisma Rovaniemi",
    tag: "Supermarkt",
    city: "Rovaniemi",
    coords: [66.4950, 25.7130],
    maps: "https://maps.google.com/?q=Prisma+Rovaniemi+Teollisuustie+2",
    summary:
      "Riesiger finnischer Hypermarkt unweit des Bahnhofs Rovaniemi. Unbedingt direkt nach der Zugankunft für den " +
      "Großeinkauf der 5 Mökki-Tage ansteuern. Großartige Auswahl an finnischen Pflanzenprotein-Spezialitäten " +
      "(Härkis aus Ackerbohnen, Nyhtökaura Pulled Oats), Hafermilch (Valio Oddlygood, Oatly) und Saunabedarf.",
    facts: [
      ["Typ", "Hypermarket für den Großeinkauf"],
      ["Lage", "Teollisuustie 2, 96320 Rovaniemi"],
      ["Highlights", "Härkis, Nyhtökaura, Leipäjuusto, Ruisleipä"]
    ],
    links: [
      { label: "Marktseite", note: "s-kaupat.fi", url: "https://www.s-kaupat.fi/myymala/prisma-rovaniemi" }
    ]
  },

  "kieringin-kauppa": {
    title: "Kieringin Kyläkauppa",
    tag: "Dorfladen",
    city: "Kierinki",
    coords: [66.9742, 25.4735],
    maps: "https://maps.google.com/?q=Kieringin+Kyl%C3%A4kauppa",
    summary:
      "Der nächste Laden zum Mökki (16 km). Perfekt für den Nachschub an Butter, Hafermilch, Brot und frischem " +
      "Gebäck. Integriertes Café für eine gemütliche Kaffeepause in historischem Ambiente.",
    facts: [
      ["Typ", "Dorfladen & Café"],
      ["Lage", "Kieringintie 14, 97310 Kierinki"],
      ["Distanz", "16 km vom Mökki"]
    ],
    links: [
      { label: "Webseite", note: "kieringinkylakauppa.fi", url: "https://kieringinkylakauppa.fi" }
    ]
  },

  "lampivaara-cafe": {
    title: "Lampivaara Café",
    tag: "Café",
    city: "Luosto",
    coords: [67.1480, 26.9020],
    maps: "https://maps.google.com/?q=Lampivaaran+latukahvila",
    summary:
      "Uriges Blockhaus-Loipencafé am Fuße des Amethystberges im Nationalpark Pyhä-Luosto. Bekannt für frisch " +
      "gebackene finnische Zimtschnecken (Korvapuusti), herzhafte Suppen und heißen Blaubeersaft (Mustikkamehu). " +
      "Hier startet auch der Pendolino zur Mine.",
    facts: [
      ["Typ", "Loipencafé & Treffpunkt Amethystmine"],
      ["Spezialität", "Heißer Blaubeersaft & Korvapuusti"]
    ],
    links: [
      { label: "Café Info", note: "amethystmine.fi", url: "https://www.amethystmine.fi" }
    ]
  },


  /* ---------------- Stockholm ---------------- */

  "drop-coffee": {
    title: "Drop Coffee Roasters",
    tag: "Specialty Coffee",
    city: "Stockholm (Södermalm)",
    coords: [59.3178, 18.0620],
    maps: "https://maps.google.com/?q=Drop+Coffee+Wollmar+Yxkullsgatan+10+Stockholm",
    summary:
      "Mehrfach international prämierte schwedische Spezialitätenrösterei am Mariatorget. Fokus auf herausragende, " +
      "helle Röstungen aus direktem Handel, meisterhaft zubereitete Hand-Filterkaffees (Kalita Wave, V60) und " +
      "präzise Espressi.",
    facts: [
      ["Lage", "Wollmar Yxkullsgatan 10 (nahe Mariatorget)"],
      ["Typ", "Specialty Coffee Roastery & Café"]
    ],
    links: [
      { label: "Drop Coffee Webshop", note: "dropcoffee.com", url: "https://www.dropcoffee.com" }
    ]
  },

  "st-paul-bageri": {
    title: "St. Paul Bageri",
    tag: "Bäckerei",
    city: "Stockholm (Södermalm)",
    coords: [59.3176, 18.0664],
    maps: "https://maps.google.com/?q=St.+Paul+Bageri+Sankt+Paulsgatan+24+Stockholm",
    summary:
      "Handwerkliche Bäckerei in einer wunderschön restaurierten Jugendstil-Apotheke auf Södermalm. Erstklassiges " +
      "Sauerteigbrot, üppig belegte Frühstücksbrötchen und die wahrscheinlich besten Kardamomknoten " +
      "(Kardemummabullar) der Stadt.",
    facts: [
      ["Lage", "Sankt Paulsgatan 24, Södermalm"],
      ["Typ", "Artisan Bakery & Frühstück"]
    ],
    links: [
      { label: "Bäckerei Seite", note: "stpaulbageri.se", url: "https://stpaulbageri.se" }
    ]
  },

  "cafe-pascal": {
    title: "Café Pascal",
    tag: "Frühstück",
    city: "Stockholm (Södermalm)",
    coords: [59.3134, 18.0838],
    maps: "https://maps.google.com/?q=Caf%C3%A9+Pascal+Sk%C3%A5negatan+76+Stockholm",
    summary:
      "Eines der beliebtesten Frühstückscafés Schwedens im Viertel SoFo. Großartige hausgemachte Röstungen, " +
      "Avocado-Stullen, Egg Florentine, Sauerteig-Sandwiches und frische Zimtschnecken in lebendiger Atmosphäre.",
    facts: [
      ["Lage", "Skånegatan 76 (SoFo, Södermalm)"],
      ["Typ", "Frühstück, Brunch & Kaffee"]
    ],
    links: [
      { label: "Café Pascal", note: "cafepascal.se", url: "https://cafepascal.se" }
    ]
  },

  "hermans-vegetariskt": {
    title: "Hermans Vegetariska",
    tag: "Restaurant",
    city: "Stockholm (Södermalm)",
    coords: [59.3170, 18.0890],
    maps: "https://maps.google.com/?q=Hermans+Fj%C3%A4llgatan+Stockholm",
    summary:
      "Stockholms vegetarische Institution auf den Klippen von Fjällgatan. Großes, abwechslungsreiches warmes und " +
      "kaltes vegetarisch-veganes Buffet mit hausgebackenem Brot, Currys und Gratins – gepaart mit spektakulärem " +
      "Panoramablick über Djurgården und den Stockholmer Hafen.",
    facts: [
      ["Küche", "100 % Vegetarisch / Vegan Buffet"],
      ["Lage", "Fjällgatan 23B, Södermalm"]
    ],
    links: [
      { label: "Hermans", note: "hermans.se", url: "https://hermans.se" }
    ]
  },

  "pelikan": {
    title: "Restaurang Pelikan",
    tag: "Traditionell",
    city: "Stockholm (Södermalm)",
    coords: [59.3120, 18.0772],
    maps: "https://maps.google.com/?q=Restaurang+Pelikan+Stockholm",
    summary:
      "Uralte schwedische Bierhalle aus dem frühen 20. Jahrhundert mit monumentalen Holzvertäfelungen und " +
      "Jugendstildecken. Perfekt für den traditionellen Abend vor der Nachtzugfahrt: serviert authentische " +
      "Husmanskost (schwedische Hausmannskost), Köttbullar und hervorragende vegetarische Alternativen.",
    facts: [
      ["Küche", "Schwedische Hausmannskost (Husmanskost)"],
      ["Lage", "Blekingegatan 40, Södermalm"]
    ],
    links: [
      { label: "Pelikan", note: "pelikan.se", url: "https://www.pelikan.se" }
    ]
  }

};
