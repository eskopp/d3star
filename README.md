# d3star

Statische Web-Seite: Ort und Datum eingeben, den Sternenhimmel von dort sehen
und mit Maus/Touch schwenken und zoomen.

## Aufbau

| Datei | Zweck |
|-------|-------|
| `index.html` | Seitengerüst und Eingabefelder |
| `app.js` | Geocoding (Nominatim) + Ansteuerung der Karte |
| `style.css` | Layout |
| `vendor/` | [d3-celestial](https://github.com/ofrohn/d3-celestial) 0.7.x + D3 (BSD) |
| `data/` | Stern-, DSO- und Sternbildkataloge (mitgeliefert, kein API-Call) |

Die Karte läuft komplett im Browser. Der einzige Netzaufruf ist die
Ortssuche über die [Nominatim](https://nominatim.org/)-API von OpenStreetMap.

## Lokal starten

Wegen `fetch` auf die JSON-Kataloge braucht es einen HTTP-Server, `file://`
reicht nicht:

```sh
python -m http.server 8000
# http://localhost:8000
```

## Deployment

Push auf `main` -> GitHub Actions (`deploy-pages.yml`) veröffentlicht das
Repo-Wurzelverzeichnis auf GitHub Pages.

## Bekannte Grenze

`datetime-local` liefert keine Zeitzone. Die Eingabe wird als Ortszeit des
Browsers interpretiert. Für einen Ort in einer anderen Zeitzone ist das
Sternfeld um den Zonenversatz verschoben. Für exakte Zeiten die Uhrzeit in
UTC bzw. mit passendem Offset eingeben.

## Lizenz

Eigener Code unter MIT (`LICENSE`). d3-celestial und D3 unter BSD-3-Clause
(`vendor/LICENSE-d3-celestial`).
