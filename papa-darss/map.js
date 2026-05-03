// Darß map — Leaflet with watercolor tiles + comic pin overlays.
//
// Tiles: Stadia Maps' Stamen Watercolor. Free anonymous use for low-
// traffic / personal pages; if Stadia drops the tiles or rate-limits,
// the OpenStreetMap fallback below kicks in automatically.
//
// The map is rendered non-interactive (no zoom/drag/scroll) so it
// reads as an illustration, not a UI widget.

(function () {
  if (typeof L === "undefined") return;
  var el = document.getElementById("darss-map");
  if (!el) return;

  // Center of the Darß peninsula, roughly between Prerow and the lighthouse.
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
    attributionControl: true,
  });

  // Try Stamen Watercolor (via Stadia). If it fails, fall back to OSM.
  var watercolor = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    {
      maxZoom: 16,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> · ' +
        '&copy; <a href="https://stamen.com/">Stamen Design</a> · ' +
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }
  );
  var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  });

  // Optimistic: try watercolor first, swap to OSM on tile error.
  watercolor.on("tileerror", function () {
    if (map.hasLayer(watercolor)) {
      map.removeLayer(watercolor);
      osm.addTo(map);
    }
  });
  watercolor.addTo(map);

  // Comic pins
  var pins = [
    { name: "Weststrand",         coords: [54.4640, 12.5180], cls: "" },
    { name: "Leuchtturm",         coords: [54.4720, 12.5340], cls: "is-orange" },
    { name: "Prerow",             coords: [54.4400, 12.5800], cls: "is-blue" },
    { name: "Darßwald",           coords: [54.4550, 12.5550], cls: "is-green" },
  ];
  pins.forEach(function (p) {
    var icon = L.divIcon({
      className: "",
      html:
        '<span class="map-pin ' + p.cls + '">' + p.name + "</span>",
      iconSize: [120, 28],
      iconAnchor: [60, 28],
    });
    L.marker(p.coords, { icon: icon, interactive: false }).addTo(map);
  });
})();
