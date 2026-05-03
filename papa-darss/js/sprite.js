// sprite.js — load the SVG icon sprite once and inject it into the
// document body so <use href="#i-…"> references resolve. Faster than
// per-icon external <use href="sprite.svg#i-…"> fetches.

(function () {
  fetch("/papa-darss/assets/sprite.svg")
    .then(function (r) { return r.ok ? r.text() : ""; })
    .then(function (svg) {
      if (!svg) return;
      var div = document.createElement("div");
      div.className = "sprite";
      div.innerHTML = svg;
      document.body.insertBefore(div, document.body.firstChild);
    })
    .catch(function () { /* graceful no-op if it fails */ });
})();
