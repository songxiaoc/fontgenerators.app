const APEX_HOST = 'fontgenerators.app';
const WWW_HOST = 'www.fontgenerators.app';

export function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === WWW_HOST) {
    url.hostname = APEX_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
