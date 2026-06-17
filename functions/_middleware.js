const APEX_HOST = 'fontgenerators.app';
const WWW_HOST = 'www.fontgenerators.app';

const CLEAN_PATHS = new Map([
  ['/discord-colored-text-generator/', '/discord-colored-text-generator'],
  ['/privacy/', '/privacy'],
  ['/terms', '/terms-of-service'],
  ['/terms/', '/terms-of-service'],
  ['/terms-of-service/', '/terms-of-service'],
]);

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

  return context.next();
}
