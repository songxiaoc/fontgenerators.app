const APEX_HOST = 'fontgenerators.app';
const WWW_HOST = 'www.fontgenerators.app';

const CLEAN_PATHS = new Map([
  ['/ascii-art-generator/', '/ascii-art-generator'],
  ['/font-mixer/', '/font-mixer'],
  ['/username-generator/', '/username-generator'],
  ['/auto-font-changer/', '/auto-font-changer'],
  ['/auto-font-styler', '/auto-font-changer'],
  ['/auto-font-styler/', '/auto-font-changer'],
  ['/discord-colored-text-generator/', '/discord-colored-text-generator'],
  ['/privacy/', '/privacy'],
  ['/cookies/', '/cookies'],
  ['/terms', '/terms-of-service'],
  ['/terms/', '/terms-of-service'],
  ['/terms-of-service/', '/terms-of-service'],
]);

const APPROVED_PAGE_PATHS = new Set([
  '/',
  '/ascii-art-generator',
  '/font-mixer',
  '/username-generator',
  '/auto-font-changer',
  '/discord-colored-text-generator',
  '/privacy',
  '/cookies',
  '/terms-of-service',
]);

const STATIC_OR_ASSET_PATH = /\.[a-z0-9]+$/i;

const ENV_KEYS = {
  googleVerification: ['GSC_VERIFICATION', 'GOOGLE_SITE_VERIFICATION', 'GOOGLE_SEARCH_CONSOLE_VERIFICATION', 'VITE_GSC_VERIFICATION', 'VITE_GOOGLE_SITE_VERIFICATION'],
  ahrefsVerification: ['AHREFS_SITE_VERIFICATION', 'AHREFS_SITE_VERIFICATION_TOKEN', 'VITE_AHREFS_SITE_VERIFICATION'],
  gaId: ['GA_MEASUREMENT_ID', 'GOOGLE_ANALYTICS_ID', 'NEXT_PUBLIC_GA_ID', 'VITE_GA_MEASUREMENT_ID', 'VITE_GA_ID'],
  clarityId: ['CLARITY_PROJECT_ID', 'MICROSOFT_CLARITY_ID', 'VITE_CLARITY_PROJECT_ID'],
  plausibleDomain: ['PLAUSIBLE_DOMAIN', 'VITE_PLAUSIBLE_DOMAIN'],
  plausibleScriptSrc: ['PLAUSIBLE_SCRIPT_URL', 'VITE_PLAUSIBLE_SCRIPT_URL'],
  ahrefsAnalyticsKey: ['AHREFS_ANALYTICS_KEY', 'AHREFS_KEY', 'VITE_AHREFS_ANALYTICS_KEY'],
  ahrefsScriptSrc: ['AHREFS_SCRIPT_URL', 'VITE_AHREFS_SCRIPT_URL'],
};

function isStaticAssetPath(pathname) {
  return pathname.startsWith('/assets/') || pathname.startsWith('/cdn-cgi/') || STATIC_OR_ASSET_PATH.test(pathname);
}

function shouldBlockStaticFallback(pathname) {
  if (APPROVED_PAGE_PATHS.has(pathname)) return false;
  if (isStaticAssetPath(pathname)) return false;
  return true;
}

function notFoundResponse(pathname) {
  const escapedPath = pathname.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Page not found — FontGenerators.app</title>
</head>
<body>
  <main>
    <h1>Page not found</h1>
    <p>The route <code>${escapedPath}</code> is not part of the current FontGenerators.app MVP.</p>
    <p><a href="/">Go to the Font Generator</a></p>
  </main>
</body>
</html>`, {
    status: 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
      'cache-control': 'public, max-age=300',
    },
  });
}

function firstEnv(env, keys) {
  for (const key of keys) {
    const value = env?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function scriptSafeJson(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
}

function runtimeAnalyticsConfig(env, requestUrl) {
  const config = {
    gaId: firstEnv(env, ENV_KEYS.gaId),
    clarityId: firstEnv(env, ENV_KEYS.clarityId),
    plausibleDomain: firstEnv(env, ENV_KEYS.plausibleDomain),
    plausibleScriptSrc: firstEnv(env, ENV_KEYS.plausibleScriptSrc),
    ahrefsAnalyticsKey: firstEnv(env, ENV_KEYS.ahrefsAnalyticsKey),
    ahrefsScriptSrc: firstEnv(env, ENV_KEYS.ahrefsScriptSrc),
  };

  if (config.plausibleDomain === 'auto') config.plausibleDomain = requestUrl.hostname;

  return Object.fromEntries(Object.entries(config).filter(([, value]) => Boolean(value)));
}

function buildHeadInjection(env, requestUrl) {
  const snippets = [];
  const googleVerification = firstEnv(env, ENV_KEYS.googleVerification);
  const ahrefsVerification = firstEnv(env, ENV_KEYS.ahrefsVerification);
  const analyticsConfig = runtimeAnalyticsConfig(env, requestUrl);

  if (googleVerification) {
    snippets.push(`<meta name="google-site-verification" content="${escapeAttr(googleVerification)}">`);
  }
  if (ahrefsVerification) {
    snippets.push(`<meta name="ahrefs-site-verification" content="${escapeAttr(ahrefsVerification)}">`);
  }
  if (Object.keys(analyticsConfig).length) {
    snippets.push(`<script>window.FONTGENERATORS_ANALYTICS_CONFIG=${scriptSafeJson(analyticsConfig)};</script>`);
  }

  return snippets.length ? `\n${snippets.join('\n')}\n` : '';
}

function shouldInjectHtml(response) {
  if (response.status !== 200) return false;
  const contentType = response.headers.get('content-type') || '';
  return contentType.toLowerCase().includes('text/html');
}

function injectIntoHead(html, injection) {
  if (!injection || !html.includes('</head>')) return html;
  return html.replace('</head>', `${injection}</head>`);
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  let shouldRedirect = false;

  if (url.hostname === WWW_HOST) {
    url.hostname = APEX_HOST;
    shouldRedirect = true;
  }

  const cleanPath = CLEAN_PATHS.get(url.pathname);
  if (cleanPath) {
    url.pathname = cleanPath;
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return Response.redirect(url.toString(), 301);
  }

  if (shouldBlockStaticFallback(url.pathname)) {
    return notFoundResponse(url.pathname);
  }

  const response = await context.next();
  if (!APPROVED_PAGE_PATHS.has(url.pathname) || !shouldInjectHtml(response)) return response;

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(injectIntoHead(html, buildHeadInjection(context.env || {}, url)), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
