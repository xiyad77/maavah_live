/**
 * Maavah Live - Production Build & Validation Script
 * Verifies code syntax, validates templates, and checks required static assets.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===================================================');
console.log('MAAVAH LIVE PORTAL — PRODUCTION BUILD & VERIFICATION');
console.log('===================================================');

const requiredFiles = [
  'server.js',
  'services/weatherService.js',
  'services/feedService.js',
  'services/businessService.js',
  'public/css/style.css',
  'public/js/app.js',
  'views/index.ejs',
  'views/error.ejs',
  'views/partials/header.ejs',
  'views/partials/footer.ejs',
  'views/partials/weather-cards.ejs',
  'views/partials/hourly-forecast.ejs',
  'views/partials/feed-list.ejs',
  'views/partials/official-fb-embeds.ejs',
  'views/partials/business-contacts.ejs',
  'views/partials/business-list.ejs'
];

const jsFilesToValidate = [
  'server.js',
  'services/weatherService.js',
  'services/feedService.js',
  'services/businessService.js',
  'public/js/app.js'
];

let hasErrors = false;

// 1. Verify existence of required project files
console.log('\n[1/3] Verifying project structure & required assets...');
requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.error(`  ✗ Missing critical file: ${file}`);
    hasErrors = true;
  }
});

// 2. Perform syntax validation on JavaScript source files
console.log('\n[2/3] Validating JavaScript syntax...');
jsFilesToValidate.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  try {
    execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
    console.log(`  ✓ Syntax check passed: ${file}`);
  } catch (err) {
    console.error(`  ✗ Syntax error in ${file}:`, err.message);
    hasErrors = true;
  }
});

// 3. Test load services and verify data integrity
console.log('\n[3/3] Checking data services integrity...');
try {
  const feedService = require('./services/feedService');
  const businessService = require('./services/businessService');

  const feeds = feedService.getFeeds();
  const sources = feedService.getAllSources();
  const sourceCount = Object.keys(sources).length;
  const businesses = businessService.getAllBusinesses();
  const categories = businessService.getCategories();

  console.log(`  ✓ Feed Service: Loaded ${sourceCount} official sources and ${feeds.length} community posts.`);
  console.log(`  ✓ Business Service: Loaded ${categories.length} categories and ${businesses.length} registered businesses.`);
} catch (err) {
  console.error('  ✗ Error loading services:', err.message);
  hasErrors = true;
}

console.log('\n---------------------------------------------------');
if (hasErrors) {
  console.error('BUILD FAILED: One or more validation checks failed.');
  process.exit(1);
} else {
  console.log('BUILD SUCCESS: All validation checks passed successfully.');
  console.log('Target Ready: Maavah Live Portal is ready for production deployment.');
  console.log('---------------------------------------------------\n');
  process.exit(0);
}
