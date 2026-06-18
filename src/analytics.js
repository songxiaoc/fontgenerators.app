const CONSENT_KEY = 'fontgenerators_cookie_consent_v1';
const ACCEPTED = 'accepted';
const DECLINED = 'declined';
const DEFAULT_PLAUSIBLE_SRC = 'https://plausible.io/js/script.js';
const DEFAULT_AHREFS_SRC = 'https://analytics.ahrefs.com/analytics.js';

const clean = (value) => String(value || '').trim();

const viteConfig = {
  gaId: clean(import.meta.env.VITE_GA_MEASUREMENT_ID || import.meta.env.VITE_GA_ID),
  clarityId: clean(import.meta.env.VITE_CLARITY_PROJECT_ID),
  plausibleDomain: clean(import.meta.env.VITE_PLAUSIBLE_DOMAIN),
  plausibleScriptSrc: clean(import.meta.env.VITE_PLAUSIBLE_SCRIPT_URL),
  ahrefsAnalyticsKey: clean(import.meta.env.VITE_AHREFS_ANALYTICS_KEY),
  ahrefsScriptSrc: clean(import.meta.env.VITE_AHREFS_SCRIPT_URL),
};

const runtimeConfig = window.FONTGENERATORS_ANALYTICS_CONFIG || {};
const config = {
  gaId: clean(runtimeConfig.gaId || viteConfig.gaId),
  clarityId: clean(runtimeConfig.clarityId || viteConfig.clarityId),
  plausibleDomain: clean(runtimeConfig.plausibleDomain || viteConfig.plausibleDomain),
  plausibleScriptSrc: clean(runtimeConfig.plausibleScriptSrc || viteConfig.plausibleScriptSrc || DEFAULT_PLAUSIBLE_SRC),
  ahrefsAnalyticsKey: clean(runtimeConfig.ahrefsAnalyticsKey || viteConfig.ahrefsAnalyticsKey),
  ahrefsScriptSrc: clean(runtimeConfig.ahrefsScriptSrc || viteConfig.ahrefsScriptSrc || DEFAULT_AHREFS_SRC),
};

function readConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch (error) {
    return null;
  }
}

function writeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch (error) {
    // If storage is unavailable, keep the session functional and only rely on this page load.
  }
}

function loadScript(id, src, attrs = {}) {
  if (!src || document.getElementById(id)) return null;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null && value !== '') script.setAttribute(key, value);
  }
  document.head.appendChild(script);
  return script;
}

function loadGoogleAnalytics() {
  if (!config.gaId) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  window.gtag('js', new Date());
  window.gtag('config', config.gaId, {
    anonymize_ip: true,
    send_page_view: true,
    transport_type: 'beacon'
  });
  loadScript('fg-ga4-script', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaId)}`);
}

function loadClarity() {
  if (!config.clarityId || window.clarity) return;
  window.clarity = function clarity(){ (window.clarity.q = window.clarity.q || []).push(arguments); };
  loadScript('fg-clarity-script', `https://www.clarity.ms/tag/${encodeURIComponent(config.clarityId)}`);
}

function loadPlausible() {
  if (!config.plausibleDomain) return;
  window.plausible = window.plausible || function plausible(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
  loadScript('fg-plausible-script', config.plausibleScriptSrc, {
    defer: 'defer',
    'data-domain': config.plausibleDomain
  });
}

function loadAhrefsAnalytics() {
  if (!config.ahrefsAnalyticsKey) return;
  loadScript('fg-ahrefs-analytics-script', config.ahrefsScriptSrc, {
    'data-key': config.ahrefsAnalyticsKey
  });
}

function loadAnalytics() {
  loadGoogleAnalytics();
  loadClarity();
  loadPlausible();
  loadAhrefsAnalytics();
}

const unsafePropPattern = /(text|message|output|clipboard|selection|selected|ansi|content|input|value|raw)/i;

function safeEventName(name) {
  return String(name || 'event')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48) || 'event';
}

function safeEventProps(props = {}) {
  const safe = {};
  for (const [key, value] of Object.entries(props)) {
    if (unsafePropPattern.test(key)) continue;
    if (!['string', 'number', 'boolean'].includes(typeof value)) continue;
    safe[key.slice(0, 40)] = typeof value === 'string' ? value.slice(0, 80) : value;
  }
  return safe;
}

window.fgTrack = function fgTrack(eventName, props = {}) {
  if (readConsent() !== ACCEPTED) return;
  const name = safeEventName(eventName);
  const safeProps = safeEventProps(props);
  if (typeof window.gtag === 'function') window.gtag('event', name, safeProps);
  if (typeof window.plausible === 'function') window.plausible(name, { props: safeProps });
  if (typeof window.clarity === 'function') window.clarity('event', name);
};

function removeBanner() {
  document.querySelector('[data-cookie-banner]')?.remove();
}

function renderBanner({ force = false } = {}) {
  if (!force && readConsent()) return;
  if (document.querySelector('[data-cookie-banner]')) return;
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('data-cookie-banner', 'true');
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML = `
    <div class="cookie-banner__copy">
      <strong>Cookie notice</strong>
      <p>We use cookies and optional analytics, when enabled, to improve your experience. We do not send generator text, ANSI output, or clipboard content to analytics. <a href="/cookies">Learn more</a>.</p>
    </div>
    <div class="cookie-banner__actions">
      <button type="button" class="button secondary" data-cookie-decline>Decline</button>
      <button type="button" class="button primary" data-cookie-accept>Accept analytics</button>
    </div>`;
  document.body.appendChild(banner);
}

function bindCookieControls() {
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-cookie-settings]')) {
      event.preventDefault();
      renderBanner({ force: true });
      return;
    }
    if (event.target.closest('[data-cookie-accept]')) {
      writeConsent(ACCEPTED);
      removeBanner();
      loadAnalytics();
      return;
    }
    if (event.target.closest('[data-cookie-decline]')) {
      writeConsent(DECLINED);
      removeBanner();
    }
  });
}

function init() {
  bindCookieControls();
  const consent = readConsent();
  if (consent === ACCEPTED) loadAnalytics();
  if (!consent) renderBanner();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
