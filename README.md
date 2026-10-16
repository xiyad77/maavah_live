# MAAVAH LIVE (ލ. މާވަށު ލައިވް)

> Real-time Civic, Meteorological & Maritime Hydrology Portal for Maavah Island, Laamu Atoll, Republic of Maldives.
> Location: `1.8800° N, 73.2400° E`

Built with **Express.js**, **EJS**, and **HTMX (v2.0.4)**. The user interface and visual identity are styled after the architectural minimalist light theme 

---

## Key Features

### 1. Real-Time Meteorological & Maritime Telemetry (Open-Meteo API)
- **Live Atmosphere**: Ambient temperature, "feels like" index, humidity, atmospheric surface pressure, precipitation rate, and WMO weather condition icons.
- **Wind Dynamics & Compass**: Wind speed in both **Knots** and **km/h**, peak wind gusts, and an interactive **360° Compass Dial** with a needle orienting in real time to the live wind vector.
- **Marine Swell & Waves**: Wave height, wave period, swell direction, and sea state classification.
- **Astronomical Tidal Hydrology**: Semi-diurnal harmonic tide calculations calibrated for Laamu Atoll, displaying:
  - Current water level in meters (MSL)
  - Tidal status (`Rising / Flood Tide` or `Falling / Ebb Tide`)
  - Next High Tide time and peak height
  - Next Low Tide time and trough height
  - 24-hour tidal height cycle curve
- **24-Hour & 7-Day Synoptic Forecast**: Hourly temperature and rain probability timeline + 7-day outlook table with daily highs, lows, rain accumulation, and sunrise/sunset timings.
- **HTMX Sync Button & Unit Switcher**: Instant data refresh and toggle between Celsius (`°C`) and Fahrenheit (`°F`).

### 2. Community Dispatches & Facebook Feeds
Includes curated community posts and official Facebook Page Plugin embeds for:
1. **Maavah Council** (`https://www.facebook.com/LaamuMaavahCouncil`)
2. **Maavashu School** (`https://www.facebook.com/MaavashuSchool`)
3. **Maavashu Health Center** (`https://www.facebook.com/MaavashuHealthCentr`)

Features:
- **Instant HTMX Tab Switching**: Filter between `All Updates`, `Maavah Council`, `Maavashu School`, and `Maavashu Health Center` without page reloads.
- **Live Search**: Instant keyword filtering with HTMX keyup delay.
- **Bilingual Dispatches**: Features English announcements alongside Dhivehi (Thaana script) snippets.
- **Official Embeds**: Direct embedded Facebook Page Plugin iframes and external navigation links.

### 3. Design System 
- **Light Theme Palette**: Warm architectural linen canvas (`#f2f1ee`), elevated card surfaces (`#faf9f7`), deep black typography (`#101014`), and crisp 1px borders (`rgba(16, 16, 20, 0.16)`).
- **Sticky HUD Nav (48px)**: Segmented navigation with 1px border dividers, monospace HUD items with hover inversion (`bg-invert-bg text-invert-fg`), live green pulsing indicator, and real-time Maldives Time clock (`MVT / UTC+5`).
- **Telemetry Ticker**: Marquee ticker banner streaming real-time readings across the top of the viewport.
- **Multi-Column Footer**: Coordinates, emergency hotlines (Ambulance 102, Health Center desk, Police desk), API links, and copyright.

---

## Running the Application

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Launch
```bash
# Install dependencies
npm install

# Start production server
npm start

# Or run development mode
npm run dev
```

Visit the application at:
```
http://localhost:3000
```
