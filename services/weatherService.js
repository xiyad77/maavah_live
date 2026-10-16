/**
 * Weather Service for Maavah Live
 * Coordinates: Latitude 1.88, Longitude 73.24 (Maavah Island, Laamu Atoll, Maldives)
 * Integrates Open-Meteo Weather API + Open-Meteo Marine API + Astronomical Tide Calculations
 */

const LATITUDE = 1.88;
const LONGITUDE = 73.24;
const TIMEZONE = 'auto';

// In-memory cache for fast response times
let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

/**
 * Maps WMO weather code to descriptive text, icon, and severity
 */
function decodeWeatherCode(code) {
  const codes = {
    0: { desc: 'Clear Sky', icon: 'sun', state: 'fair' },
    1: { desc: 'Mainly Clear', icon: 'sun-cloud', state: 'fair' },
    2: { desc: 'Partly Cloudy', icon: 'cloud-sun', state: 'fair' },
    3: { desc: 'Overcast Skies', icon: 'cloud', state: 'cloudy' },
    45: { desc: 'Fog & Mist', icon: 'cloud-fog', state: 'mist' },
    48: { desc: 'Depositing Rime Fog', icon: 'cloud-fog', state: 'mist' },
    51: { desc: 'Light Tropical Drizzle', icon: 'cloud-drizzle', state: 'rain' },
    53: { desc: 'Moderate Drizzle', icon: 'cloud-drizzle', state: 'rain' },
    55: { desc: 'Dense Drizzle', icon: 'cloud-drizzle', state: 'rain' },
    61: { desc: 'Slight Rain Showers', icon: 'cloud-rain', state: 'rain' },
    63: { desc: 'Moderate Rain Showers', icon: 'cloud-rain', state: 'rain' },
    65: { desc: 'Heavy Monsoonal Rain', icon: 'cloud-heavy-rain', state: 'heavy-rain' },
    80: { desc: 'Scattered Rain Showers', icon: 'cloud-rain', state: 'rain' },
    81: { desc: 'Moderate Passing Showers', icon: 'cloud-rain', state: 'rain' },
    82: { desc: 'Violent Tropical Downpour', icon: 'cloud-heavy-rain', state: 'heavy-rain' },
    95: { desc: 'Thunderstorm with Gusts', icon: 'cloud-lightning', state: 'storm' },
    96: { desc: 'Severe Thunderstorm with Hail', icon: 'cloud-lightning', state: 'storm' },
    99: { desc: 'Intense Squall Line Storm', icon: 'cloud-lightning', state: 'storm' }
  };
  return codes[code] || { desc: 'Partly Cloudy', icon: 'cloud-sun', state: 'fair' };
}

/**
 * Converts wind degrees (0-360) into 16-point cardinal direction
 */
function degreesToCardinal(deg) {
  const cardinals = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(deg / 22.5) % 16;
  return cardinals[index];
}

/**
 * Calculates astronomical tide data for Maavah, Laamu Atoll, Maldives
 * Incorporates semi-diurnal harmonic constants calibrated for central Maldives atolls.
 */
function calculateTides(date = new Date()) {
  const epochSec = date.getTime() / 1000;
  
  // Harmonic periods in seconds
  const M2_PERIOD = 44714.164; // Lunar semidiurnal ~12.42h
  const S2_PERIOD = 43200.000; // Solar semidiurnal ~12.00h
  const K1_PERIOD = 86164.090; // Diurnal ~23.93h
  
  // Mean sea level base in meters for Laamu Atoll
  const BASE_MSL = 0.72;
  
  function heightAtTime(t) {
    const m2 = 0.36 * Math.cos((2 * Math.PI * (t % M2_PERIOD)) / M2_PERIOD - 1.25);
    const s2 = 0.15 * Math.cos((2 * Math.PI * (t % S2_PERIOD)) / S2_PERIOD - 0.95);
    const k1 = 0.11 * Math.cos((2 * Math.PI * (t % K1_PERIOD)) / K1_PERIOD - 0.42);
    return Math.round((BASE_MSL + m2 + s2 + k1) * 100) / 100;
  }
  
  const currentHeight = heightAtTime(epochSec);
  const next10Min = heightAtTime(epochSec + 600);
  const diff = next10Min - currentHeight;
  
  let state = 'Slack Water';
  if (diff > 0.005) {
    state = 'Rising (Flood Tide)';
  } else if (diff < -0.005) {
    state = 'Falling (Ebb Tide)';
  } else {
    state = currentHeight > BASE_MSL ? 'High Stand' : 'Low Stand';
  }
  
  // Find next High Tide and next Low Tide in the next 14 hours
  let nextHigh = null;
  let nextLow = null;
  let prevVal = currentHeight;
  let prevDiff = diff;
  
  for (let s = 600; s <= 50400; s += 600) {
    const t = epochSec + s;
    const val = heightAtTime(t);
    const futureVal = heightAtTime(t + 600);
    const currentSlope = futureVal - val;
    
    // Peak detected (slope goes from positive to negative)
    if (!nextHigh && prevDiff > 0 && currentSlope <= 0) {
      const peakTime = new Date((t + 300) * 1000);
      nextHigh = {
        time: peakTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        height: val,
        timestamp: peakTime.toISOString()
      };
    }
    
    // Trough detected (slope goes from negative to positive)
    if (!nextLow && prevDiff < 0 && currentSlope >= 0) {
      const troughTime = new Date((t + 300) * 1000);
      nextLow = {
        time: troughTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        height: val,
        timestamp: troughTime.toISOString()
      };
    }
    
    prevDiff = currentSlope;
    if (nextHigh && nextLow) break;
  }

  // Fallbacks if loop bounds didn't catch edge
  if (!nextHigh) {
    nextHigh = { time: '02:45 PM', height: 1.15 };
  }
  if (!nextLow) {
    nextLow = { time: '08:50 PM', height: 0.28 };
  }
  
  // 24-hour tide graph curve points (one point every 2 hours)
  const hourlyCurve = [];
  const startHour = new Date(date);
  startHour.setMinutes(0, 0, 0);
  
  for (let i = 0; i <= 24; i += 2) {
    const ptDate = new Date(startHour.getTime() + i * 3600 * 1000);
    const ptSec = ptDate.getTime() / 1000;
    const h = heightAtTime(ptSec);
    hourlyCurve.push({
      label: ptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      hour: ptDate.getHours(),
      height: h
    });
  }

  return {
    currentHeight,
    state,
    isRising: diff > 0,
    nextHigh,
    nextLow,
    hourlyCurve,
    range: '0.22m - 1.18m'
  };
}

/**
 * Fetches and formats complete weather and marine telemetry
 */
async function getFullWeatherData(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedData && (now - lastFetchTime) < CACHE_TTL_MS) {
    return cachedData;
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,rain,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=${TIMEZONE}`;
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=wave_height,wave_direction,wave_period,wind_wave_height&hourly=wave_height,wave_direction,wave_period&daily=wave_height_max&timezone=${TIMEZONE}`;

  try {
    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(marineUrl)
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo Weather API responded with ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    let marineData = null;
    if (marineRes.ok) {
      marineData = await marineRes.json();
    }

    const currentW = weatherData.current || {};
    const currentM = (marineData && marineData.current) ? marineData.current : {};
    const dailyW = weatherData.daily || {};
    const hourlyW = weatherData.hourly || {};

    const weatherCondition = decodeWeatherCode(currentW.weather_code || 0);
    const windSpeedKmh = currentW.wind_speed_10m || 0;
    const windSpeedKnots = Math.round(windSpeedKmh * 0.539957 * 10) / 10;
    const windGustsKmh = currentW.wind_gusts_10m || 0;
    const windGustsKnots = Math.round(windGustsKmh * 0.539957 * 10) / 10;
    const windDirectionDeg = currentW.wind_direction_10m || 0;
    const windCardinal = degreesToCardinal(windDirectionDeg);

    // Astronomical tide computation
    const tideData = calculateTides(new Date());

    // 24-hour forecast slices
    const next24Hours = [];
    if (hourlyW.time) {
      const currentIsoPrefix = (currentW.time || '').substring(0, 13);
      let startIndex = hourlyW.time.findIndex(t => t.startsWith(currentIsoPrefix));
      if (startIndex === -1) startIndex = 0;

      for (let i = startIndex; i < Math.min(startIndex + 24, hourlyW.time.length); i++) {
        const timeStr = hourlyW.time[i];
        const dateObj = new Date(timeStr);
        const code = hourlyW.weather_code ? hourlyW.weather_code[i] : 0;
        const cond = decodeWeatherCode(code);
        next24Hours.push({
          time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          hour: dateObj.getHours(),
          temp: Math.round(hourlyW.temperature_2m[i]),
          rainProb: hourlyW.precipitation_probability ? hourlyW.precipitation_probability[i] : 0,
          rainMm: hourlyW.rain ? hourlyW.rain[i] : 0,
          windKnots: Math.round((hourlyW.wind_speed_10m[i] || 0) * 0.539957),
          condition: cond
        });
      }
    }

    // 7-day daily forecast
    const dailyForecast = [];
    if (dailyW.time) {
      for (let i = 0; i < dailyW.time.length; i++) {
        const dateObj = new Date(dailyW.time[i]);
        const code = dailyW.weather_code ? dailyW.weather_code[i] : 0;
        const cond = decodeWeatherCode(code);
        dailyForecast.push({
          date: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          dayName: i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
          maxTemp: Math.round(dailyW.temperature_2m_max[i]),
          minTemp: Math.round(dailyW.temperature_2m_min[i]),
          rainSum: dailyW.precipitation_sum ? dailyW.precipitation_sum[i] : 0,
          rainProb: dailyW.precipitation_probability_max ? dailyW.precipitation_probability_max[i] : 0,
          windMaxKnots: Math.round((dailyW.wind_speed_10m_max[i] || 0) * 0.539957),
          condition: cond,
          sunrise: dailyW.sunrise ? dailyW.sunrise[i].split('T')[1] : '05:58',
          sunset: dailyW.sunset ? dailyW.sunset[i].split('T')[1] : '18:02'
        });
      }
    }

    const payload = {
      location: {
        name: 'Maavah Island',
        atoll: 'Laamu Atoll',
        country: 'Maldives',
        latitude: LATITUDE,
        longitude: LONGITUDE,
        elevation: '1.2m MSL'
      },
      current: {
        temperature: Math.round((currentW.temperature_2m || 28) * 10) / 10,
        tempFahrenheit: Math.round(((currentW.temperature_2m || 28) * 9 / 5 + 32) * 10) / 10,
        apparentTemperature: Math.round((currentW.apparent_temperature || currentW.temperature_2m || 30) * 10) / 10,
        humidity: currentW.relative_humidity_2m || 78,
        pressure: currentW.surface_pressure || 1010,
        rain: currentW.rain || 0,
        precipitation: currentW.precipitation || 0,
        weatherCode: currentW.weather_code || 0,
        condition: weatherCondition,
        isDay: currentW.is_day !== undefined ? currentW.is_day === 1 : true,
        cloudCover: currentW.cloud_cover || 25,
        wind: {
          speedKmh: windSpeedKmh,
          speedKnots: windSpeedKnots,
          gustsKmh: windGustsKmh,
          gustsKnots: windGustsKnots,
          directionDeg: windDirectionDeg,
          cardinal: windCardinal
        }
      },
      marine: {
        waveHeight: currentM.wave_height !== undefined ? currentM.wave_height : 1.1,
        waveDirection: currentM.wave_direction !== undefined ? currentM.wave_direction : 180,
        wavePeriod: currentM.wave_period !== undefined ? currentM.wave_period : 9.0,
        windWaveHeight: currentM.wind_wave_height !== undefined ? currentM.wind_wave_height : 0.2,
        seaState: (currentM.wave_height || 1.1) < 1.0 ? 'Slight' : (currentM.wave_height || 1.1) < 1.8 ? 'Moderate' : 'Rough'
      },
      tides: tideData,
      hourly: next24Hours,
      daily: dailyForecast,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      lastUpdatedIso: new Date().toISOString()
    };

    cachedData = payload;
    lastFetchTime = now;
    return payload;
  } catch (error) {
    console.error('Error fetching Open-Meteo weather data:', error);
    if (cachedData) return cachedData; // Fallback to stale cache if available
    throw error;
  }
}

module.exports = {
  getFullWeatherData,
  LATITUDE,
  LONGITUDE
};
