# d3star

Static web page: enter a place and a date, see the night sky from there and
pan and zoom it with mouse or touch.

## Layout

| File | Purpose |
|------|---------|
| `index.html` | Page skeleton and input fields |
| `app.js` | Geocoding (Nominatim) + driving the map |
| `style.css` | Layout |
| `vendor/` | [d3-celestial](https://github.com/ofrohn/d3-celestial) 0.7.x + D3 (BSD) |
| `data/` | Star, DSO and constellation catalogs (bundled, no API call) |

The map runs entirely in the browser. The only network request is the place
lookup via OpenStreetMap's [Nominatim](https://nominatim.org/) API.

## Running locally

Because the JSON catalogs are loaded with `fetch`, an HTTP server is needed;
`file://` does not work:

```sh
python -m http.server 8000
# http://localhost:8000
```

## Deployment

A push to `main` -> GitHub Actions (`deploy-pages.yml`) publishes the repo
root directory to GitHub Pages.

## Known limitation

`datetime-local` carries no time zone. The input is read as the browser's
local time. For a place in a different time zone the star field is off by the
zone offset. For exact times, enter the time in UTC or with the matching
offset.

## License

Own code under MIT (`LICENSE`). d3-celestial and D3 under BSD-3-Clause
(`vendor/LICENSE-d3-celestial`).
