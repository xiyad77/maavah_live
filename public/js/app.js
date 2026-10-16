/**
 * Maavah Live - Client-side Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initWindCompass();
  setupHtmxEvents();
});

/**
 * Maldives Local Time Clock (UTC+5)
 */
function initClock() {
  const clockEl = document.getElementById('live-mvt-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Format in Maldives Time
    const options = {
      timeZone: 'Indian/Maldives',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    try {
      clockEl.textContent = new Intl.DateTimeFormat('en-GB', options).format(now) + ' MVT';
    } catch (e) {
      clockEl.textContent = now.toTimeString().split(' ')[0] + ' UTC';
    }
  }

  update();
  setInterval(update, 1000);
}

/**
 * Orientates wind compass needle based on data-angle attribute
 */
function initWindCompass() {
  const needle = document.querySelector('.compass-needle');
  if (needle && needle.dataset.angle) {
    const deg = parseFloat(needle.dataset.angle) || 0;
    needle.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
  }
}

/**
 * HTMX Event Listeners for smooth transitions & re-initialization
 */
function setupHtmxEvents() {
  document.body.addEventListener('htmx:afterSwap', (evt) => {
    // Re-initialize compass needle when weather cards are swapped
    initWindCompass();

    // Re-init Facebook SDK parser if embeds container was loaded
    if (window.FB && typeof window.FB.XFBML.parse === 'function') {
      window.FB.XFBML.parse();
    }
  });

  // Handle active class switching on feed tab clicks
  document.querySelectorAll('.feed-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.feed-tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/**
 * Unit Switcher (°C / °F)
 */
window.toggleUnit = function(targetUnit) {
  const url = new URL(window.location.href);
  url.searchParams.set('unit', targetUnit);
  window.location.href = url.toString();
};
