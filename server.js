/**
 * Maavah Live - Web Application
 * Express.js + EJS + HTMX (v2.0.4)
 * Architecture & Design inspired by getartcraft.com
 * Location: Maavah Island, Laamu Atoll, Maldives (1.88° N, 73.24° E)
 */

const express = require('express');
const path = require('path');
const weatherService = require('./services/weatherService');
const feedService = require('./services/feedService');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper middleware to make current year & metadata available to all views
app.use((req, res, next) => {
  res.locals.siteTitle = 'MAAVAH LIVE — Civic & Maritime Meteorological Portal';
  res.locals.coordinates = '1.8800° N, 73.2400° E';
  res.locals.locationName = 'Maavah, Laamu Atoll, Maldives';
  res.locals.currentYear = new Date().getFullYear();
  next();
});

/**
 * Main Home Page Route
 * Renders full dashboard with real-time weather and community feeds
 */
app.get('/', async (req, res) => {
  try {
    const weather = await weatherService.getFullWeatherData();
    const activeSource = req.query.source || 'all';
    const searchQuery = req.query.q || '';
    const feeds = feedService.getFeeds(activeSource, searchQuery);
    const sources = feedService.getAllSources();

    res.render('index', {
      weather,
      feeds,
      sources,
      activeSource,
      searchQuery,
      unit: req.query.unit || 'C'
    });
  } catch (error) {
    console.error('Error rendering index:', error);
    res.status(500).render('error', {
      message: 'Failed to retrieve telemetry data. Please try again shortly.',
      error
    });
  }
});

/**
 * HTMX Route: Refresh Weather & Marine Cards
 * Endpoint: /api/weather-cards
 */
app.get('/api/weather-cards', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const weather = await weatherService.getFullWeatherData(force);
    const unit = req.query.unit || 'C';

    res.render('partials/weather-cards', {
      weather,
      unit
    });
  } catch (error) {
    console.error('Error refreshing weather cards:', error);
    res.status(500).send('<div class="hud-error">Unable to fetch latest Open-Meteo telemetry. Retrying automatically.</div>');
  }
});

/**
 * HTMX Route: Hourly & 7-Day Forecast Partial
 * Endpoint: /api/hourly-forecast
 */
app.get('/api/hourly-forecast', async (req, res) => {
  try {
    const weather = await weatherService.getFullWeatherData();
    res.render('partials/hourly-forecast', {
      weather,
      unit: req.query.unit || 'C'
    });
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    res.status(500).send('<div class="hud-error">Hourly forecast temporarily unavailable.</div>');
  }
});

/**
 * HTMX Route: Filter & Search Facebook Community Feeds
 * Endpoint: /feeds
 */
app.get('/feeds', (req, res) => {
  try {
    const source = req.query.source || 'all';
    const searchQuery = req.query.q || '';
    const feeds = feedService.getFeeds(source, searchQuery);
    const sources = feedService.getAllSources();

    res.render('partials/feed-list', {
      feeds,
      sources,
      activeSource: source,
      searchQuery
    });
  } catch (error) {
    console.error('Error filtering feeds:', error);
    res.status(500).send('<div class="hud-error">Failed to load feed items.</div>');
  }
});

/**
 * HTMX Route: Official Facebook Page Embeds
 * Endpoint: /facebook-embeds
 */
app.get('/facebook-embeds', (req, res) => {
  const sources = feedService.getAllSources();
  res.render('partials/official-fb-embeds', {
    sources
  });
});

/**
 * REST JSON Endpoint: Direct Weather Data
 */
app.get('/api/raw-weather', async (req, res) => {
  try {
    const data = await weatherService.getFullWeatherData(req.query.force === 'true');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`MAAVAH LIVE PORTAL RUNNING ON http://localhost:${PORT}`);
  console.log(`Open-Meteo Target: 1.88° N, 73.24° E (Maavah, Maldives)`);
  console.log(`HTMX v2.0.4 loaded | EJS Engine Initialized`);
  console.log(`===================================================`);
});
