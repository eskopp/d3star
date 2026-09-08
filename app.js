/* d3star — enter a place and a date, look at the sky from there. */

"use strict";

var mapEl = document.getElementById("celestial-map");
var placeEl = document.getElementById("place");
var dateEl = document.getElementById("datetime");
var statusEl = document.getElementById("status");
var formEl = document.getElementById("controls");

var config = {
  width: mapEl.clientWidth,
  projection: "airy",
  transform: "horizontal",   // alt-az dome: the sky as seen from the ground
  background: { fill: "#05070d", stroke: "#0a0f1c", opacity: 1 },
  datapath: "data/",
  interactive: true,          // drag to pan, wheel to zoom
  controls: true,             // on-canvas zoom buttons
  disableAnimations: false,
  location: false,            // we drive location/date ourselves
  formFields: { location: false, general: true, stars: true, dsos: true,
                constellations: true, lines: true, other: true, download: true },
  stars: { limit: 6, colors: true, designation: true, propername: true,
           propernameLimit: 2.5, size: 7 },
  dsos: { show: true, limit: 6, names: true, nameLimit: 4 },
  constellations: { names: true, namesType: "iau", lines: true, bounds: false },
  mw: { show: true },
  planets: { show: true, names: true, namesType: "desig" },
  horizon: { show: true, stroke: "#3a4a6a", fill: "#0a0f1c", opacity: 0.7 },
  daylight: { show: true }
};

function setStatus(msg, isError) {
  statusEl.textContent = msg || "";
  statusEl.classList.toggle("error", !!isError);
}

/* --- date helpers --------------------------------------------------------- */

function toInputValue(d) {
  var pad = function (n) { return String(n).padStart(2, "0"); };
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
         "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

/* The datetime-local value carries no zone. We read it as the browser's
   local time. For a location in another zone the star field is still
   correct to within the zone offset; good enough here, documented in README. */
function parseInput(value) {
  var d = value ? new Date(value) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

/* --- geocoding ---------------------------------------------------------- */

function geocode(query) {
  var url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
            encodeURIComponent(query);
  return fetch(url, { headers: { "Accept-Language": "en" } })
    .then(function (r) {
      if (!r.ok) throw new Error("Geocoding failed (" + r.status + ")");
      return r.json();
    })
    .then(function (list) {
      if (!list.length) throw new Error("Place not found: " + query);
      return {
        lat: parseFloat(list[0].lat),
        lon: parseFloat(list[0].lon),
        label: list[0].display_name
      };
    });
}

/* --- render ------------------------------------------------------------- */

function render(lat, lon, date) {
  Celestial.skyview({ location: [lat, lon], date: date });
}

function apply(query, date) {
  setStatus("Looking up place …");
  return geocode(query).then(function (loc) {
    setStatus(loc.label);
    placeEl.value = query;
    render(loc.lat, loc.lon, date);
    syncUrl(query, date);
    return loc;
  }).catch(function (err) {
    setStatus(err.message, true);
  });
}

/* --- shareable URL ---------------------------------------------------- */

function syncUrl(query, date) {
  var p = new URLSearchParams();
  p.set("place", query);
  p.set("date", toInputValue(date));
  history.replaceState(null, "", "?" + p.toString());
}

function readUrl() {
  var p = new URLSearchParams(location.search);
  return { place: p.get("place"), date: p.get("date") };
}

/* --- wire up ----------------------------------------------------------- */

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  var query = placeEl.value.trim();
  if (!query) { setStatus("Please enter a place.", true); return; }
  apply(query, parseInput(dateEl.value));
});

window.addEventListener("resize", function () {
  Celestial.resize({ width: mapEl.clientWidth });
});

var initial = readUrl();
dateEl.value = initial.date || toInputValue(new Date());
placeEl.value = initial.place || "Ilmenau";

Celestial.display(config);

// First paint once the base map is ready.
apply(placeEl.value, parseInput(dateEl.value));
