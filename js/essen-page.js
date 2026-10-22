/* Essen: Karten aus FOOD (essen.js) mit Tabs und Filter */

(function () {
  "use strict";

  var root = document.getElementById("browse");
  if (!root || typeof FOOD === "undefined") return;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  Browse.init({
    root: root,
    items: FOOD,
    card: function (id, f) {
      var facts = (f.facts || []).map(function (x) {
        return "<dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd>";
      }).join("");
      var links = (f.links || []).map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) +
               " <small>" + esc(l.note) + "</small> ↗</a>";
      }).join("");
      return '<article class="card food-card" id="' + esc(id) + '">' +
        '<div class="food-badges"><span class="badge-meal">' + esc(f.tag) + "</span>" +
        '<span class="badge-city">' + esc(f.city) + "</span></div>" +
        "<h3>" + esc(f.title) + "</h3>" +
        "<p>" + esc(f.summary) + "</p>" +
        '<dl class="food-facts">' + facts + "</dl>" +
        '<div class="food-links">' + links +
        '<a href="' + esc(f.maps) + '" target="_blank" rel="noopener">Google Maps ↗</a></div></article>';
    }
  });
})();
