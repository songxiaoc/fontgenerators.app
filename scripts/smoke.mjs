import { readFileSync, existsSync, readdirSync } from 'node:fs';

const files = [
  'dist/index.html',
  'dist/discord-colored-text-generator.html',
  'dist/privacy.html',
  'dist/cookies.html',
  'dist/terms-of-service.html',
  'dist/sitemap.xml',
  'dist/robots.txt',
  'dist/llms.txt',
  'dist/_redirects',
  'functions/_middleware.js'
];
for (const f of files) { if (!existsSync(f)) throw new Error(`missing ${f}`); }
if (!existsSync('functions/_middleware.js')) throw new Error('missing Pages middleware for host canonicalization');
const assetDir = 'dist/assets';
if (!existsSync(assetDir) || !readdirSync(assetDir).some(f => f.endsWith('.css')) || !readdirSync(assetDir).some(f => f.endsWith('.js'))) throw new Error('missing built css/js assets');

const tool = readFileSync('dist/discord-colored-text-generator.html', 'utf8');
const home = readFileSync('dist/index.html', 'utf8');
const privacy = readFileSync('dist/privacy.html', 'utf8');
const cookies = readFileSync('dist/cookies.html', 'utf8');
const terms = readFileSync('dist/terms-of-service.html', 'utf8');
const sourceHome = readFileSync('index.html', 'utf8');
const sourceTool = readFileSync('discord-colored-text-generator.html', 'utf8');
const sourcePrivacy = readFileSync('privacy.html', 'utf8');
const sourceCookies = readFileSync('cookies.html', 'utf8');
const sourceTerms = readFileSync('terms-of-service.html', 'utf8');
const homeJs = readFileSync('src/home.js', 'utf8');
const toolJs = readFileSync('src/tool.js', 'utf8');
const analyticsJs = readFileSync('src/analytics.js', 'utf8');
const robots = readFileSync('dist/robots.txt', 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const redirects = readFileSync('dist/_redirects', 'utf8');
const llms = readFileSync('dist/llms.txt', 'utf8');
const middleware = readFileSync('functions/_middleware.js', 'utf8');

const mustTool = ['Discord Colored Text Generator', 'Copy for Discord', 'Unofficial tool; not made, endorsed, or sponsored by Discord', 'Discord ANSI uses a limited palette', 'FAQPage', 'WebApplication'];
for (const s of mustTool) if (!tool.includes(s)) throw new Error(`tool missing ${s}`);
const mustHome = ['Font Generator for Copy-Paste Fancy Text Styles', 'Type once, copy many text styles', 'These are Unicode copy-paste text styles, not downloadable font files', 'Open Discord Colored Text Generator', 'WebSite', 'WebApplication', 'FAQPage'];
for (const s of mustHome) if (!home.includes(s)) throw new Error(`home missing ${s}`);
for (const s of ['data-category="Bold"', 'data-category="Cursive"', 'data-category="Fancy"', 'data-category="Aesthetic"', 'data-category="Symbols"', 'data-category="Discord"', 'data-category="Social/Gaming"']) if (!home.includes(s)) throw new Error(`home missing filter ${s}`);

for (const [name, html] of [['privacy', privacy], ['cookies', cookies], ['terms', terms]]) {
  if (!html.includes('class="legal-page paper-grid"') || !html.includes('class="legal-card"')) throw new Error(`${name} missing centered legal layout`);
  if (!html.includes('href="/terms-of-service"')) throw new Error(`${name} missing terms-of-service links`);
  if (!html.includes('href="/cookies"')) throw new Error(`${name} missing cookie policy link`);
}
if (!cookies.includes('<meta name="robots" content="noindex"')) throw new Error('cookies page should remain noindex');

for (const html of [home, tool, privacy, cookies, terms]) {
  if (html.includes('href="/terms/"')) throw new Error('stale /terms/ link present');
  if (html.includes('href="/discord-colored-text-generator/"')) throw new Error('stale discord route slash link present');
}
for (const [name, html] of [['home', sourceHome], ['tool', sourceTool], ['privacy', sourcePrivacy], ['cookies', sourceCookies], ['terms', sourceTerms]]) {
  if (!html.includes('/src/analytics.js')) throw new Error(`${name} missing analytics module`);
  if (!html.includes('data-cookie-settings')) throw new Error(`${name} missing cookie settings control`);
}
if (!sourceHome.includes('answer-block')) throw new Error('home missing compact AEO answer block');
if (!sourceHome.includes('How do I copy and paste fonts from this generator?') || !sourceHome.includes('Is fancy text accessible?')) throw new Error('home missing visible AEO FAQ additions');
if (!sourceHome.includes('data-clarity-mask="true"') || !homeJs.includes('data-clarity-mask="true"')) throw new Error('homepage generator surfaces must be masked for Clarity');
if (!sourceTool.includes('ansi-code-table') || !sourceTool.includes('<code>30</code>') || !sourceTool.includes('<code>47</code>')) throw new Error('discord page missing visible ANSI code table');
if (!sourceTool.includes('data-clarity-mask="true"')) throw new Error('discord editor/output surfaces must be masked for Clarity');
if (!analyticsJs.includes('FONTGENERATORS_ANALYTICS_CONFIG') || !analyticsJs.includes('VITE_GA_MEASUREMENT_ID') || !analyticsJs.includes('VITE_CLARITY_PROJECT_ID') || !analyticsJs.includes('VITE_PLAUSIBLE_DOMAIN') || !analyticsJs.includes('VITE_AHREFS_ANALYTICS_KEY')) throw new Error('analytics module missing provider configuration hooks');
for (const forbidden of ['raw input text', 'generated ANSI output', 'clipboard content']) {
  if (!cookies.includes(forbidden) && !privacy.includes(forbidden)) throw new Error(`privacy/cookies should disclose analytics forbidden payload: ${forbidden}`);
}
if (!llms.includes('https://fontgenerators.app/discord-colored-text-generator') || !llms.includes('not downloadable TTF/OTF font files') || !llms.includes('Do not describe planned routes')) throw new Error('llms.txt missing AI/crawler guidance');

if (tool.includes('https://fontgenerators.app/discord-colored-text-generator/')) throw new Error('stale discord canonical slash present');
if (!tool.includes('<h1 id="tool-label">Discord Colored Text Generator</h1>')) throw new Error('discord page H1 must use search-facing primary phrase');
if (tool.includes('Discord ANSI Generator - Light Lab')) throw new Error('discord page should not expose internal Light Lab H1 wording');
if (!tool.includes('Current ANSI codes')) throw new Error('discord page missing user-friendly ANSI codes label');
if (homeJs.includes('is-featured') || homeJs.includes('style-row${featured}')) throw new Error('homepage should not default-highlight a featured style row');
for (const s of ['toggleStyleControl', 'rangeEvery', 'setRangeStyle']) if (!toolJs.includes(s)) throw new Error(`tool missing toggle helper ${s}`);
if (toolJs.includes('[button.dataset.style]: true')) throw new Error('bold/underline controls must be toggles, not one-way true setters');
const styleIds = [...homeJs.matchAll(/\n\s*\['([^']+)'\s*,/g)].map(m => m[1]);
if (styleIds.length < 40) throw new Error(`home has only ${styleIds.length} style transforms`);
if (new Set(styleIds).size !== styleIds.length) throw new Error('duplicate homepage style ids');
for (const forbidden of ['free font downloads', 'download TTF', 'install fonts', 'works everywhere', 'upgrade to pro', 'subscription plan']) {
  if (home.toLowerCase().includes(forbidden.toLowerCase())) throw new Error(`home contains forbidden claim: ${forbidden}`);
}
if (!robots.includes('Disallow: /discord-font-generator/') || !robots.includes('Sitemap: https://fontgenerators.app/sitemap.xml')) throw new Error('robots missing noindex/ sitemap signals');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const approvedSitemapLocs = ['https://fontgenerators.app/', 'https://fontgenerators.app/discord-colored-text-generator'];
if (sitemapLocs.length !== approvedSitemapLocs.length || !approvedSitemapLocs.every(loc => sitemapLocs.includes(loc))) throw new Error(`sitemap must contain only approved indexable pages; found ${sitemapLocs.join(', ')}`);
for (const forbidden of ['/pricing', '/refund', '/cookies', '/discord-font-generator', '/fancy-text-generator', '/discord-text-generator', '/privacy', '/terms-of-service']) {
  if (sitemap.includes(`https://fontgenerators.app${forbidden}`) && forbidden !== '/discord-colored-text-generator') throw new Error(`sitemap should not include non-indexable route ${forbidden}`);
}
if (redirects.includes('www.fontgenerators.app')) throw new Error('Cloudflare Pages _redirects cannot reliably enforce host-level www-to-apex redirects; Pages middleware handles host canonicalization instead');
for (const s of ['/discord-colored-text-generator/ /discord-colored-text-generator 301', '/privacy/ /privacy 301', '/cookies/ /cookies 301', '/terms-of-service/ /terms-of-service 301']) if (!redirects.includes(s)) throw new Error(`redirects missing clean URL fallback rule: ${s}`);
for (const s of ['www.fontgenerators.app', 'fontgenerators.app', 'Response.redirect', '/discord-colored-text-generator/', '/cookies/', '/terms-of-service/', 'GOOGLE_SITE_VERIFICATION', 'AHREFS_ANALYTICS_KEY']) {
  if (!middleware.includes(s)) throw new Error(`canonical/analytics middleware missing ${s}`);
}

const { onRequest } = await import('../functions/_middleware.js');
async function middlewareSmoke(url, options = {}) {
  return onRequest({
    request: new Request(url),
    env: options.env || {},
    next: options.next || (() => new Response('next ok', { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } }))
  });
}
const wwwRedirect = await middlewareSmoke('https://www.fontgenerators.app/discord-colored-text-generator/?utm_source=test');
if (wwwRedirect.status !== 301 || wwwRedirect.headers.get('location') !== 'https://fontgenerators.app/discord-colored-text-generator?utm_source=test') throw new Error('middleware must 301 www legacy tool URL to apex clean URL and preserve query');
const slashRedirect = await middlewareSmoke('https://fontgenerators.app/terms/');
if (slashRedirect.status !== 301 || slashRedirect.headers.get('location') !== 'https://fontgenerators.app/terms-of-service') throw new Error('middleware must preserve legacy clean-route redirects');
const cookieSlashRedirect = await middlewareSmoke('https://fontgenerators.app/cookies/');
if (cookieSlashRedirect.status !== 301 || cookieSlashRedirect.headers.get('location') !== 'https://fontgenerators.app/cookies') throw new Error('middleware must redirect cookie slash route to clean route');
const passThrough = await middlewareSmoke('https://fontgenerators.app/');
if (passThrough.status !== 200 || await passThrough.text() !== 'next ok') throw new Error('middleware should pass canonical apex clean routes through');
const approvedToolPassThrough = await middlewareSmoke('https://fontgenerators.app/discord-colored-text-generator');
if (approvedToolPassThrough.status !== 200 || await approvedToolPassThrough.text() !== 'next ok') throw new Error('middleware should pass approved clean Discord route through');
const approvedCookiesPassThrough = await middlewareSmoke('https://fontgenerators.app/cookies');
if (approvedCookiesPassThrough.status !== 200 || await approvedCookiesPassThrough.text() !== 'next ok') throw new Error('middleware should pass approved clean cookie route through');
const injectedResponse = await middlewareSmoke('https://fontgenerators.app/', {
  env: {
    GOOGLE_SITE_VERIFICATION: 'gsc-test-token',
    AHREFS_SITE_VERIFICATION: 'ahrefs-test-token',
    GA_MEASUREMENT_ID: 'G-TEST123',
    CLARITY_PROJECT_ID: 'clarity-test',
    PLAUSIBLE_DOMAIN: 'fontgenerators.app',
    AHREFS_ANALYTICS_KEY: 'ahrefs-analytics-test'
  },
  next: () => new Response('<!doctype html><html><head><title>Home</title></head><body>ok</body></html>', { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } })
});
const injectedHtml = await injectedResponse.text();
for (const s of ['google-site-verification', 'gsc-test-token', 'ahrefs-site-verification', 'ahrefs-test-token', 'FONTGENERATORS_ANALYTICS_CONFIG', 'G-TEST123', 'clarity-test', 'ahrefs-analytics-test']) {
  if (!injectedHtml.includes(s)) throw new Error(`middleware injection missing ${s}`);
}
const heldPaths = ['/pricing', '/pricing/', '/refund', '/refund/', '/discord-font-generator', '/discord-font-generator/', '/fancy-text-generator', '/fancy-text-generator/', '/discord-text-generator', '/not-a-real-mvp-route'];
for (const path of heldPaths) {
  const response = await middlewareSmoke(`https://fontgenerators.app${path}`);
  const body = await response.text();
  if (response.status !== 404) throw new Error(`held/non-MVP path ${path} should return 404, got ${response.status}`);
  if (!response.headers.get('x-robots-tag')?.includes('noindex')) throw new Error(`held/non-MVP path ${path} should send x-robots-tag noindex`);
  if (!body.includes('<meta name="robots" content="noindex, nofollow">')) throw new Error(`held/non-MVP path ${path} should include noindex meta`);
  if (body.includes('Font Generator for Copy-Paste Fancy Text Styles')) throw new Error(`held/non-MVP path ${path} returned homepage duplicate HTML`);
}
const staticPassThrough = await middlewareSmoke('https://fontgenerators.app/assets/home-test.js');
if (staticPassThrough.status !== 200 || await staticPassThrough.text() !== 'next ok') throw new Error('middleware should pass static asset requests through');
const llmsPassThrough = await middlewareSmoke('https://fontgenerators.app/llms.txt');
if (llmsPassThrough.status !== 200 || await llmsPassThrough.text() !== 'next ok') throw new Error('middleware should pass llms.txt through');
console.log(`smoke ok: pages, SEO/schema/legal/cookie/analytics routes present; homepage has ${styleIds.length} copyable style transforms; held routes return 404 noindex`);
