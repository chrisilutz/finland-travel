/* Sehenswürdigkeiten & Aktivitäten — reine Daten
   ---------------------------------------------------------------
   Gepflegt wird hier; sightseeing.js und map.js lesen SIGHTS.
   Die Region (Lappland / Stockholm) ergibt sich aus den Koordinaten.

   title/tag/coords   Anzeige und Kartenmarker
   wiki:              "sprache:Artikel" für das Bild aus Wikipedia
   maps:              Google-Maps-Link; ohne Angabe aus coords erzeugt
   summary/facts      Text und praktische Angaben im Popup
   links:             recherchierte Quellen (label, note, url)
*/

var SIGHTS = {
  /* ---------------- Lappland & Mökki ---------------- */

  "kukasjaervi": {
    title: "Kukasjärvi & Mökki Pihlajanmarja",
    tag: "Natur",
    coords: [66.8520, 25.3200],
    wiki: "fi:Kukasjärvi",
    maps: "https://maps.google.com/?q=Kukasj%C3%A4rvi+Meltaus",
    summary:
      "Der See Kukasjärvi liegt in völliger Ruhe im Südwesten von Sodankylä unweit der Ortschaft Meltaus. Im " +
      "Februar ist der See meterdick zugefroren und bietet beste Bedingungen für Schneeschuhwanderungen, Langlauf " +
      "direkt ab der Haustür und ungestörte Nordlichtbeobachtung ohne künstliche Lichtverschmutzung. Das Mökki " +
      "Pihlajanmarja verfügt über eine traditionelle holzbefeuerte Strandsauna.",
    facts: [
      ["Lage", "ca. 100 km nördlich von Rovaniemi"],
      ["Aktivitäten", "Sauna, Eiswandern, Polarlichter"]
    ],
    links: [
      { label: "Lomarengas Objekt", note: "lomarengas.fi", url: "https://www.lomarengas.fi/mokit/sodankyla-pihlajanmarja-15461" }
    ]
  },

  "unarinkoengaes": {
    title: "Unarinköngäs Stromschnelle",
    tag: "Natur",
    coords: [66.8920, 25.4310],
    wiki: "fi:Meltausjoki",
    maps: "https://maps.google.com/?q=Unarink%C3%B6ng%C3%A4s+Sodankyl%C3%A4",
    summary:
      "Die Stromschnelle Unarinköngäs am Fluss Meltausjoki ist eine der markantesten Naturschönheiten der Region. " +
      "Im tiefsten Winter formt das tosend fließende Wasser bizarre Eisskulpturen und gefrorene Gischtkaskaden. " +
      "Direkt an der Stromschnelle gibt es eine Schutzhütte (Laavu) mit offener Feuerstelle für ein winterliches " +
      "Lagerfeuer.",
    facts: [
      ["Distanz", "ca. 15 km nordöstlich vom Mökki"],
      ["Ausstattung", "Laavu (Schutzhütte) & Feuerstelle"]
    ],
    links: [
      { label: "Toureninfo", note: "nationalparks.fi", url: "https://www.luontoon.fi" }
    ]
  },

  "kierinki-village": {
    title: "Kierinki Village & Dorfladen",
    tag: "Kultur",
    coords: [66.9742, 25.4735],
    wiki: "fi:Kierinki",
    maps: "https://maps.google.com/?q=Kieringin+Kyl%C3%A4kauppa",
    summary:
      "Kierinki ist ein denkmalgeschütztes Holzdorf in Lappland, das den Krieg unzerstört überstanden hat. Das " +
      "Dorfzentrum bildet der historische Dorfladen (Kieringin Kyläkauppa) mit gemütlichem Café, Galerie und " +
      "regionalen Spezialitäten. Perfekter Zwischenstopp für Kaffee, Gebäck und Grundnahrungsmittel.",
    facts: [
      ["Distanz", "ca. 16 km nördlich vom Mökki"],
      ["Besonderheit", "Historische lappländische Holzarchitektur"]
    ],
    links: [
      { label: "Offizielle Seite", note: "kierinkivillage.fi", url: "https://kierinkivillage.fi" }
    ]
  },

  "alariesto-gallery": {
    title: "Museum-Galerie Andreas Alariesto & Holzkirche",
    tag: "Museum",
    coords: [67.4165, 26.5932],
    wiki: "en:Andreas_Alariesto",
    maps: "https://maps.google.com/?q=Museum-Gallery+Alariesto+Sodankyl%C3%A4",
    summary:
      "Die Galerie im Zentrum von Sodankylä präsentiert das Lebenswerk des Künstlers Andreas Alariesto, des " +
      "bedeutendsten Vertreters naiver Malerei Lapplands. Seine detailreichen Bilder dokumentieren das " +
      "traditionelle Leben der Samen, Rentierzucht, Mythen und das Überleben in der arktischen Natur. Gleich " +
      "daneben steht die Sodankylän vanha kirkko von 1689 – eine der ältesten erhaltenen Holzkirchen Finnlands.",
    facts: [
      ["Lage", "Sodankylä Zentrum (ca. 75 km vom Mökki)"],
      ["Schwerpunkt", "Samische Kultur, Naive Kunst, 17. Jh. Holzbau"]
    ],
    links: [
      { label: "Museum Sodankylä", note: "sodankyla.fi", url: "https://www.sodankyla.fi/kulttuuri-ja-vapaa-aika/museot/alariesto/" }
    ]
  },

  "lampivaara-amethyst": {
    title: "Lampivaara Amethystmine & Nationalpark Luosto",
    tag: "Highlight",
    coords: [67.1528, 26.9069],
    wiki: "en:Pyhä-Luosto_National_Park",
    maps: "https://maps.google.com/?q=Lampivaara+Amethyst+Mine+Luosto",
    summary:
      "Die Amethystmine auf dem Fjell Lampivaara ist die einzige für Besucher zugängliche Edelsteinmine Europas. " +
      "Vom Skizentrum Luosto führt eine 5 km lange Waldloipe sanft ansteigend zum urigen Lampivaara Café. Von dort " +
      "geht es mit der Pistenraupen-Kabine (Amethyst Pendolino) auf den Berggipfel. Im beheizten Ausgrabungsstollen " +
      "darf jeder Besucher selbst nach violetten Amethysten schürfen und einen faustgroßen Stein als Andenken " +
      "behalten.",
    facts: [
      ["Anfahrt", "ca. 105 km vom Mökki nach Luosto, dann Loipe/Pendolino"],
      ["Aktivität", "Kombination aus Skilanglauf & Mine"],
      ["Souvenir", "1 selbst gefundener Amethyst inklusive"]
    ],
    links: [
      { label: "Amethystmine Buchung", note: "amethystmine.fi", url: "https://www.amethystmine.fi" },
      { label: "Skiverleih Luosto", note: "laplandhotels.com", url: "https://www.laplandhotels.com/FI/lapin-hotellit/luosto/lapland-ski-resort-luosto.html" }
    ]
  },


  /* ---------------- Stockholm ---------------- */

  "moderna-museet": {
    title: "Moderna Museet & ArchDes",
    tag: "Museum",
    coords: [59.3260, 18.0847],
    wiki: "en:Moderna_Museet",
    maps: "https://maps.google.com/?q=Moderna+Museet+Stockholm",
    summary:
      "Auf der ruhigen Museumsinsel Skeppsholmen gelegen, zählt das Moderna Museet zu den weltweit führenden " +
      "Häusern für Kunst des 20. und 21. Jahrhunderts mit Hauptwerken von Picasso, Matisse, Dalí und Niki de Saint " +
      "Phalle. Direkt angebaut ist das ArchDes, Schwedens nationales Zentrum für Architektur und urbanes Design. " +
      "Das Museumsrestaurant bietet einen weiten Blick über das Hafenbecken.",
    facts: [
      ["Lage", "Insel Skeppsholmen"],
      ["Highlights", "Klassische Moderne, Skandinavisches Design, Skulpturengarten"]
    ],
    links: [
      { label: "Moderna Museet", note: "modernamuseet.se", url: "https://www.modernamuseet.se/stockholm/en/" },
      { label: "ArchDes", note: "archdes.se", url: "https://archdes.se/en/" }
    ]
  },

  "vasa-museum": {
    title: "Vasa-Museum (Vasamuseet)",
    tag: "Museum",
    coords: [59.3280, 18.0914],
    wiki: "en:Vasa_(ship)",
    maps: "https://maps.google.com/?q=Vasa+Museum+Stockholm",
    summary:
      "Die Vasa ist das weltweit einzige erhaltene Schiff des 17. Jahrhunderts. Das königliche Kriegsschiff sank " +
      "1628 schon nach wenigen hundert Metern auf seiner Jungfernfahrt im Stockholmer Hafen und wurde 1961 nach 333 " +
      "Jahren auf dem Meeresgrund nahezu unversehrt geborgen. Über 95 Prozent der Holzteile und hunderte " +
      "Schnitzereien sind original.",
    facts: [
      ["Lage", "Insel Djurgården (erreichbar per SL-Fähre 82)"],
      ["Besonderheit", "Weltweit intaktestes Holzschiff des 17. Jh."]
    ],
    links: [
      { label: "Vasamuseet", note: "vasamuseet.se", url: "https://www.vasamuseet.se/de" }
    ]
  },

  "stockholms-stadsmuseum": {
    title: "Stockholms Stadsmuseum",
    tag: "Geschichte",
    coords: [59.3197, 18.0706],
    wiki: "en:Stockholm_City_Museum",
    maps: "https://maps.google.com/?q=Stockholms+Stadsmuseum",
    summary:
      "Direkt am Knotenpunkt Slussen im barocken Rathaus von 1680 untergebracht. Das Stadtmuseum erzählt die " +
      "Wandlung Stockholms vom rauen mittelalterlichen Handelsstützpunkt über das industrielle Zeitalter bis zur " +
      "modernen Metropole. Der Eintritt zur Hauptausstellung ist kostenlos.",
    facts: [
      ["Eintritt", "Dauerausstellung kostenlos"],
      ["Lage", "Ryssgården / Slussen, Södermalm"]
    ],
    links: [
      { label: "Offizielle Seite", note: "stadsmuseet.stockholm.se", url: "https://stadsmuseet.stockholm.se/" }
    ]
  },

  "monteliusvaegen": {
    title: "Monteliusvägen & Södermalm Panoramaweg",
    tag: "Aussicht",
    coords: [59.3211, 18.0583],
    wiki: "sv:Monteliusvägen",
    maps: "https://maps.google.com/?q=Monteliusv%C3%A4gen+Stockholm",
    summary:
      "Ein 500 Meter langer hölzerner Fußweg auf den Klippen des nördlichen Södermalm. Er bietet die schönste " +
      "Panoramaaussicht auf den Riddarfjärden, das Stockholmer Stadshuset (Rathaus) und die Dächer von Gamla Stan.",
    facts: [
      ["Zugang", "Kostenlos, jederzeit begehbar"],
      ["Tipp", "Morgens oder zur goldenen Stunde vor Sonnenuntergang"]
    ],
    links: [
      { label: "Stadtführer", note: "visitstockholm.com", url: "https://www.visitstockholm.com" }
    ]
  },

  "fotografiska": {
    title: "Fotografiska Stockholm",
    tag: "Museum",
    coords: [59.3179, 18.0858],
    wiki: "en:Fotografiska",
    maps: "https://maps.google.com/?q=Fotografiska+Stockholm",
    summary:
      "Eines der weltweit renommiertesten Zentren für zeitgenössische Fotografie, untergebracht in einem ehemaligen " +
      "Jugendstil-Zollgebäude direkt am Stadsgårdskajen. Großartige wechselnde Ausstellungen und ein Bistro im " +
      "obersten Stockwerk mit verglaster Front auf das Wasser.",
    facts: [
      ["Öffnungszeiten", "Täglich bis 23:00 Uhr geöffnet"],
      ["Lage", "Stadsgårdshamnen, Södermalm"]
    ],
    links: [
      { label: "Fotografiska", note: "fotografiska.com", url: "https://stockholm.fotografiska.com/en" }
    ]
  }

};
