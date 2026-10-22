/* Sightseeing: Karten je Region (Tabs, Filter) und Detail-Popup
   ---------------------------------------------------------------
   Die Daten stehen in sights.js (SIGHTS). Karten sind anklickbar;
   ein <dialog> zeigt Zusammenfassung, praktische Infos, Bild und
   weiterführende Links.

   Das Bild wird zur Laufzeit über die Wikipedia-/Wikimedia-API
   geladen (CORS via origin=*). Schlägt das fehl, bleibt der
   Platzhalter stehen — das Popup funktioniert auch ohne Netz.

*/

(function () {
  "use strict";

  /* ---- Elemente ----------------------------------------------- */
  var modal = document.getElementById("sight-modal");
  var root = document.getElementById("browse");
  if (!modal || !root || typeof SIGHTS === "undefined") return;

  var elTag = document.getElementById("modal-tag");
  var elTitle = document.getElementById("sight-modal-title");
  var elSummary = document.getElementById("modal-summary");
  var elFacts = document.getElementById("modal-facts");
  var elNote = document.getElementById("modal-note");
  var elTodosHead = document.getElementById("modal-todos-head");
  var elTodos = document.getElementById("modal-todos");
  var elLinks = document.getElementById("modal-links");
  var elFigure = document.getElementById("modal-figure");
  var elCredit = document.getElementById("modal-credit");
  var btnClose = modal.querySelector(".modal-close");

  var imgCache = {};
  var currentId = null;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function wikiParts(spec) {
    var i = spec.indexOf(":");
    return { lang: spec.slice(0, i), title: spec.slice(i + 1) };
  }

  function wikiUrl(spec) {
    var w = wikiParts(spec);
    return "https://" + w.lang + ".wikipedia.org/wiki/" + encodeURIComponent(w.title.replace(/ /g, "_"));
  }

  /* ---- Links zusammenstellen ---------------------------------- */

  function buildLinks(s) {
    var links = (s.links || []).slice();

    links.push({
      label: "Google Maps",
      note: "Lage & Anfahrt",
      url: s.maps || ("https://www.google.com/maps/search/?api=1&query=" +
                      encodeURIComponent(s.coords[0] + "," + s.coords[1]))
    });

    if (s.wiki) {
      links.push({ label: "Wikipedia", note: wikiParts(s.wiki).title, url: wikiUrl(s.wiki) });
    }

    /* Nur wo keine recherchierte Zweitquelle vorliegt: Suche nach Reiseberichten */
    if ((s.links || []).length < 2) {
      links.push({
        label: "Reiseberichte",
        note: "Blogs & Erfahrungen suchen",
        url: "https://www.google.com/search?q=" +
             encodeURIComponent(s.title + " Reisebericht blog")
      });
    }

    return links;
  }

  /* ---- Bild von Wikipedia nachladen --------------------------- */

  function showPlaceholder() {
    elFigure.classList.add("is-placeholder");
    elFigure.style.backgroundImage = "";
    elCredit.innerHTML = "";
  }

  function loadImage(id, s) {
    if (!s.wiki) { showPlaceholder(); return; }
    if (imgCache[id] !== undefined) { applyImage(id, imgCache[id], s); return; }

    var w = wikiParts(s.wiki);
    var api = "https://" + w.lang + ".wikipedia.org/w/api.php" +
      "?action=query&format=json&origin=*&prop=pageimages&pithumbsize=1000" +
      "&titles=" + encodeURIComponent(w.title);

    showPlaceholder();

    fetch(api)
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); })
      .then(function (data) {
        var pages = (data.query && data.query.pages) || {};
        var src = null;
        Object.keys(pages).some(function (k) {
          if (pages[k].thumbnail && pages[k].thumbnail.source) { src = pages[k].thumbnail.source; return true; }
          return false;
        });
        imgCache[id] = src;
        applyImage(id, src, s);
      })
      .catch(function () {
        imgCache[id] = null;
        if (currentId === id) showPlaceholder();
      });
  }

  function applyImage(id, src, s) {
    if (currentId !== id) return;          // inzwischen wurde ein anderes Popup geöffnet
    if (!src) { showPlaceholder(); return; }
    elFigure.classList.remove("is-placeholder");
    elFigure.style.backgroundImage = 'url("' + src + '")';
    elCredit.innerHTML =
      'Bild: <a href="' + wikiUrl(s.wiki) + '" target="_blank" rel="noopener">Wikipedia / Wikimedia Commons</a>';
  }

  /* ---- Popup öffnen & schließen ------------------------------- */

  function open(id) {
    var s = SIGHTS[id];
    if (!s) return;
    currentId = id;

    elTag.textContent = s.tag || "";
    elTag.hidden = !s.tag;
    elTitle.textContent = s.title;
    elSummary.textContent = s.summary;

    elFacts.innerHTML = (s.facts || [])
      .map(function (f) {
        return "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>";
      })
      .join("");
    elFacts.hidden = !(s.facts && s.facts.length);

    /* Programmpunkte vor Ort, falls hinterlegt */
    elTodos.innerHTML = (s.todos || [])
      .map(function (t) {
        return "<li><strong>" + esc(t[0]) + "</strong><span>" + esc(t[1]) + "</span></li>";
      })
      .join("");
    elTodos.hidden = !(s.todos && s.todos.length);
    elTodosHead.hidden = elTodos.hidden;

    elNote.textContent = s.note || "";
    elNote.hidden = !s.note;

    elLinks.innerHTML = buildLinks(s)
      .map(function (l) {
        return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
               '<span class="l-label">' + esc(l.label) + "</span>" +
               '<span class="l-note">' + esc(l.note) + "</span></a></li>";
      })
      .join("");

    loadImage(id, s);

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");     // sehr alte Browser
    modal.scrollTop = 0;
  }

  function close() {
    currentId = null;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  /* Karten werden von Browse neu aufgebaut — daher delegiert */
  function teaser(text) {
    var first = text.split(/(?<=[.!?])\s/)[0];
    return first.length > 170 ? first.slice(0, 167).replace(/\s\S*$/, "") + " …" : first;
  }

  Browse.init({
    root: root,
    items: SIGHTS,
    card: function (id, s) {
      return '<article class="card card-clickable" id="' + esc(id) + '">' +
        '<span class="tag">' + esc(s.tag) + "</span>" +
        "<h3>" + esc(s.title) + "</h3>" +
        "<p>" + esc(teaser(s.summary)) + "</p>" +
        '<button type="button" class="card-more" data-sight="' + esc(id) + '">Mehr erfahren' +
        '<span class="sr-only"> über ' + esc(s.title) + "</span> →</button></article>";
    }
  });

  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-sight]");
    if (btn) open(btn.getAttribute("data-sight"));
  });

  btnClose.addEventListener("click", close);

  /* Klick auf den Hintergrund schließt (Backdrop zählt als Klick auf <dialog>) */
  modal.addEventListener("click", function (e) {
    if (e.target === modal) close();
  });

  modal.addEventListener("close", function () { currentId = null; });
})();
