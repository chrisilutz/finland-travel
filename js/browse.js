/* Browse: Tabs (Region) und Filter (Kategorie) für Kartenlisten
   ---------------------------------------------------------------
   Gemeinsam genutzt von Sightseeing und Essen. Die Region ergibt
   sich aus der geografischen Breite: nördlich von 62° Lappland,
   sonst Stockholm. Der aktive Tab steht im URL-Hash (#lappland,
   #stockholm), damit Links auf einen Tab möglich sind.
*/

var Browse = (function () {
  "use strict";

  var REGIONS = [
    { id: "lappland",  label: "Lappland & Mökki", test: function (c) { return c[0] >= 62; } },
    { id: "stockholm", label: "Stockholm",        test: function (c) { return c[0] < 62; } }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function init(opts) {
    var root = opts.root;
    var items = opts.items;
    var ids = Object.keys(items);

    var regions = REGIONS.filter(function (r) {
      return ids.some(function (id) { return r.test(items[id].coords); });
    });
    if (!regions.length) return;

    var state = { region: regions[0].id, tag: null };
    var fromHash = location.hash.replace("#", "");
    regions.forEach(function (r) { if (r.id === fromHash) state.region = r.id; });
    /* Hash kann auch eine Karte meinen (essen.html#pelikan): Tab wählen, hinscrollen */
    var target = null;
    if (items[fromHash]) {
      target = fromHash;
      regions.forEach(function (r) { if (r.test(items[fromHash].coords)) state.region = r.id; });
    }

    root.innerHTML =
      '<div class="tabs" role="tablist" aria-label="Region"></div>' +
      '<div class="chips" role="group" aria-label="Filter nach Kategorie"></div>' +
      '<p class="browse-count" aria-live="polite"></p>' +
      '<div class="grid" role="tabpanel"></div>';

    var elTabs = root.querySelector(".tabs");
    var elChips = root.querySelector(".chips");
    var elCount = root.querySelector(".browse-count");
    var elGrid = root.querySelector(".grid");

    function inRegion(id) {
      var r = regions.filter(function (x) { return x.id === state.region; })[0];
      return r.test(items[id].coords);
    }

    function draw() {
      var inReg = ids.filter(inRegion);

      elTabs.innerHTML = regions.map(function (r) {
        var n = ids.filter(function (id) { return r.test(items[id].coords); }).length;
        var on = r.id === state.region;
        return '<button type="button" role="tab" id="tab-' + r.id + '" data-region="' + r.id + '"' +
          ' aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '"' +
          (on ? ' class="active"' : "") + ">" + esc(r.label) +
          ' <span class="tab-n">' + n + "</span></button>";
      }).join("");
      elGrid.setAttribute("aria-labelledby", "tab-" + state.region);

      var tags = [];
      inReg.forEach(function (id) {
        if (tags.indexOf(items[id].tag) === -1) tags.push(items[id].tag);
      });
      if (state.tag && tags.indexOf(state.tag) === -1) state.tag = null;

      elChips.innerHTML = [null].concat(tags).map(function (t) {
        var on = t === state.tag;
        return '<button type="button" class="chip' + (on ? " active" : "") + '" aria-pressed="' + on + '"' +
          ' data-tag="' + (t === null ? "" : esc(t)) + '">' + (t === null ? "Alle" : esc(t)) + "</button>";
      }).join("");

      var shown = inReg.filter(function (id) { return !state.tag || items[id].tag === state.tag; });
      elCount.textContent = shown.length + (shown.length === 1 ? " Eintrag" : " Einträge");
      elGrid.innerHTML = shown.map(function (id) { return opts.card(id, items[id]); }).join("");
    }

    elTabs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-region]");
      if (!b) return;
      state.region = b.getAttribute("data-region");
      state.tag = null;
      history.replaceState(null, "", "#" + state.region);
      draw();
    });

    /* Pfeiltasten wechseln den Tab (WAI-ARIA Tabs) */
    elTabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = regions.map(function (r) { return r.id; }).indexOf(state.region);
      i = (i + (e.key === "ArrowRight" ? 1 : regions.length - 1)) % regions.length;
      state.region = regions[i].id;
      state.tag = null;
      draw();
      elTabs.querySelector(".active").focus();
    });

    elChips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-tag]");
      if (!b) return;
      state.tag = b.getAttribute("data-tag") || null;
      draw();
      var again = elChips.querySelector(".active");
      if (again) again.focus();
    });

    draw();

    if (target) {
      var card = root.querySelector('[id="' + target + '"]');
      if (card) {
        card.classList.add("flash");
        card.scrollIntoView({ block: "center" });
      }
    }
  }

  return { init: init, regions: REGIONS };
})();
