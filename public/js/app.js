/**
 * Maavah Live - Client-side Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initWindCompass();
  initMobileNav();
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

  // Handle active class switching on tab clicks scoped to group
  document.querySelectorAll('.feed-tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = this.closest('.feed-tabs-hud');
      if (parent) {
        parent.querySelectorAll('.feed-tab-btn').forEach(b => b.classList.remove('active'));
      }
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

/**
 * Mobile Navigation Drawer & Hamburger Toggle Engine
 */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('nav-hamburger-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!hamburgerBtn || !drawer) return;

  const label = hamburgerBtn.querySelector('.hamburger-label');

  function openMenu() {
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (label) label.textContent = 'CLOSE';
    document.body.classList.add('mobile-nav-open');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (label) label.textContent = 'MENU';
    document.body.classList.remove('mobile-nav-open');
  }

  function toggleMenu() {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Automatically close menu when any internal anchor navigation link is clicked
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when sync telemetry button is clicked on mobile
  const syncBtn = drawer.querySelector('.mobile-sync-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      setTimeout(() => {
        closeMenu();
      }, 400);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
      hamburgerBtn.focus();
    }
  });

  // Auto-close on viewport resize larger than mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
