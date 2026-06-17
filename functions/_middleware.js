const APEX_HOST = 'fontgenerators.app';
const WWW_HOST = 'www.fontgenerators.app';

const CLEAN_PATHS = new Map([
  ['/discord-colored-text-generator/', '/discord-colored-text-generator'],
  ['/privacy/', '/privacy'],
  ['/terms', '/terms-of-service'],
  ['/terms/', '/terms-of-service'],
  ['/terms-of-service/', '/terms-of-service'],
]);

const APPROVED_PAGE_PATHS = new Set([
  '/',
  '/discord-colored-text-generator',
  '/privacy',
  '/terms-of-service',
]);

const STATIC_OR_ASSET_PATH = /\.[a-z0-9]+$/i;

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

export function onRequest(context) {
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

  return context.next();
}
