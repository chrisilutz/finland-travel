/* Gemeinsames JS: Mobile-Navigation, Countdown, Service Worker */

(function () {
  "use strict";

  /* ---- Service Worker: Offline-Nutzung & Installation ----
     Relativer Pfad, damit der Scope auch unter einem Unterverzeichnis
     stimmt (GitHub Pages liefert unter /finland-travel/ aus). */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* Kein Grund, die Seite zu stören — sie funktioniert auch ohne. */
      });
    });
  }

  /* ---- Installieren-Button ----
     Erscheint nur, wenn der Browser die Installation anbietet. Safari auf
     iOS feuert kein beforeinstallprompt — dort geht es über Teilen →
     „Zum Home-Bildschirm". */
  var installEvent = null;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installEvent = e;
    showInstallButton();
  });

  window.addEventListener("appinstalled", function () {
    installEvent = null;
    var btn = document.querySelector(".install-btn");
    if (btn) btn.remove();
  });

  function showInstallButton() {
    var footer = document.querySelector(".footer-inner");
    if (!footer || footer.querySelector(".install-btn")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "install-btn";
    btn.textContent = "App installieren";
    btn.addEventListener("click", function () {
      if (!installEvent) return;
      installEvent.prompt();
      installEvent.userChoice.then(function () {
        installEvent = null;
        btn.remove();
      });
    });
    footer.appendChild(btn);
  }

  /* ---- Mobile-Nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Countdown bis zur Abreise: Fr 19.02.2027 (Flug nach Helsinki; Uhrzeit noch offen → 00:00) ---- */
  var el = document.getElementById("countdown");
  if (!el) return;

  var target = new Date("2027-02-19T00:00:00+01:00").getTime();
  var units = [
    { key: "d", label: "Tage" },
    { key: "h", label: "Std." },
    { key: "m", label: "Min." },
    { key: "s", label: "Sek." }
  ];

  el.innerHTML = units
    .map(function (u) {
      return (
        '<div class="unit"><div class="num" data-unit="' + u.key + '">–</div>' +
        '<div class="lbl">' + u.label + "</div></div>"
      );
    })
    .join("");

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      el.innerHTML = '<div class="unit" style="min-width:auto;padding:0.9rem 1.6rem;">' +
        '<div class="num">Hyvää matkaa! ❄️</div></div>';
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    var vals = {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60
    };
    units.forEach(function (u) {
      var n = el.querySelector('[data-unit="' + u.key + '"]');
      if (n) n.textContent = u.key === "d" ? vals.d : pad(vals[u.key]);
    });
  }

  tick();
  var timer = setInterval(tick, 1000);
})();
