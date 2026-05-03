// Darß map — Leaflet with Carto Voyager tiles + comic-style CSS filter.
//
// Why Carto Voyager (not OSM directly):
//   OSM's public tile server has a strict usage policy and tends to
//   rate-limit/block requests originating from non-standard hostnames
//   (local IPs, file://, etc.) — exactly the dev case here. Carto's
//   CDN is much more permissive, free, no API key, used by thousands
//   of embedded maps. If Carto ever fails, fall back to OSM via the
//   tileerror handler.
//
// Comic feel comes from the CSS filter on .darss-map (saturate +
// contrast + hue shift). Map is rendered non-interactive.

(function () {
  if (typeof L === "undefined") return;
  var el = document.getElementById("darss-map");
  if (!el) return;

  var center = [54.4500, 12.5500];
  var zoom = 11;

  var map = L.map(el, {
    center: center,
    zoom: zoom,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false,
    attributionControl: false,
  });

  var carto = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      subdomains: "abcd",
      maxZoom: 18,
      attribution: "© OSM © CARTO",
    }
  );
  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap",
  });

  var swapped = false;
  carto.on("tileerror", function () {
    if (swapped) return;
    swapped = true;
    map.removeLayer(carto);
    osm.addTo(map);
  });
  carto.addTo(map);

  var pins = [
    { name: "Weststrand", coords: [54.4640, 12.5180], cls: "" },
    { name: "Leuchtturm", coords: [54.4720, 12.5340], cls: "is-orange" },
    { name: "Prerow",     coords: [54.4400, 12.5800], cls: "is-blue" },
    { name: "Darßwald",   coords: [54.4550, 12.5550], cls: "is-green" },
  ];
  pins.forEach(function (p) {
    var icon = L.divIcon({
      className: "",
      html: '<span class="map-pin ' + p.cls + '">' + p.name + "</span>",
      iconSize: [120, 28],
      iconAnchor: [60, 28],
    });
    L.marker(p.coords, { icon: icon, interactive: false }).addTo(map);
  });
})();
