import { readFileSync, existsSync, readdirSync } from 'node:fs';

const files = [
  'dist/index.html',
  'dist/ascii-art-generator.html',
  'dist/font-mixer.html',
  'dist/username-generator.html',
  'dist/auto-font-styler.html',
  'dist/discord-colored-text-generator.html',
  'dist/privacy.html',
  'dist/cookies.html',
  'dist/terms-of-service.html',
  'dist/sitemap.xml',
  'dist/robots.txt',
  'dist/llms.txt',
  'dist/logo.png',
  'dist/favicon.png',
  'dist/_redirects',
  'functions/_middleware.js'
];
for (const f of files) { if (!existsSync(f)) throw new Error(`missing ${f}`); }
if (!existsSync('functions/_middleware.js')) throw new Error('missing Pages middleware for host canonicalization');
const assetDir = 'dist/assets';
if (!existsSync(assetDir) || !readdirSync(assetDir).some(f => f.endsWith('.css')) || !readdirSync(assetDir).some(f => f.endsWith('.js'))) throw new Error('missing built css/js assets');

const tool = readFileSync('dist/discord-colored-text-generator.html', 'utf8');
const home = readFileSync('dist/index.html', 'utf8');
const ascii = readFileSync('dist/ascii-art-generator.html', 'utf8');
const mixer = readFileSync('dist/font-mixer.html', 'utf8');
const username = readFileSync('dist/username-generator.html', 'utf8');
const styler = readFileSync('dist/auto-font-styler.html', 'utf8');
const privacy = readFileSync('dist/privacy.html', 'utf8');
const cookies = readFileSync('dist/cookies.html', 'utf8');
const terms = readFileSync('dist/terms-of-service.html', 'utf8');
const sourceHome = readFileSync('index.html', 'utf8');
const sourceAscii = readFileSync('ascii-art-generator.html', 'utf8');
const sourceMixer = readFileSync('font-mixer.html', 'utf8');
const sourceUsername = readFileSync('username-generator.html', 'utf8');
const sourceStyler = readFileSync('auto-font-styler.html', 'utf8');
const sourceTool = readFileSync('discord-colored-text-generator.html', 'utf8');
const sourcePrivacy = readFileSync('privacy.html', 'utf8');
const sourceCookies = readFileSync('cookies.html', 'utf8');
const sourceTerms = readFileSync('terms-of-service.html', 'utf8');
const homeJs = readFileSync('src/home.js', 'utf8');
const fontStylesJs = readFileSync('src/font-styles.js', 'utf8');
const uiJs = readFileSync('src/ui.js', 'utf8');
const asciiJs = readFileSync('src/ascii-art.js', 'utf8');
const mixerJs = readFileSync('src/font-mixer.js', 'utf8');
const usernameJs = readFileSync('src/username-generator.js', 'utf8');
const stylerJs = readFileSync('src/auto-font-styler.js', 'utf8');
const toolJs = readFileSync('src/tool.js', 'utf8');
const analyticsJs = readFileSync('src/analytics.js', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const robots = readFileSync('dist/robots.txt', 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const redirects = readFileSync('dist/_redirects', 'utf8');
const llms = readFileSync('dist/llms.txt', 'utf8');
const middleware = readFileSync('functions/_middleware.js', 'utf8');

const mustTool = ['Discord Colored Text Generator', 'Copy for Discord', 'Rainbow', 'Unofficial tool; not made, endorsed, or sponsored by Discord', 'Discord ANSI uses a limited palette', 'FAQPage', 'WebApplication', 'HowTo'];
for (const s of mustTool) if (!tool.includes(s)) throw new Error(`tool missing ${s}`);
const mustHome = ['Font Generator for Copy-Paste Fancy Text Styles', 'Type once, copy many text styles', 'These are Unicode copy-paste text styles, not downloadable font files', 'Open Discord Colored Text Generator', 'WebSite', 'WebApplication', 'FAQPage'];
for (const s of mustHome) if (!home.includes(s)) throw new Error(`home missing ${s}`);
for (const s of ['data-category="Favorites"', 'data-category="Bold"', 'data-category="Cursive"', 'data-category="Fancy"', 'data-category="Italic"', 'data-category="Stylish"', 'data-category="Cool"', 'data-category="Strikethrough"', 'data-category="Underline"', 'data-category="Cursed"', 'data-category="Big"']) if (!home.includes(s)) throw new Error(`home missing filter ${s}`);
for (const s of ['data-category="Discord"', 'data-category="WhatsApp"', 'data-category="Twitter"']) if (sourceHome.includes(s)) throw new Error(`home should not expose platform tags as category filters: ${s}`);
const toolPages = [
  ['ascii', ascii, sourceAscii, asciiJs, ['ASCII Art Generator', 'Browse styles', 'Popular ASCII art results', 'Banner3-D', 'Bubble', 'Digital', 'Download Image', '.txt', 'Markdown', 'WeChat', 'Image to ASCII', 'ascii-art.js']],
  ['mixer', mixer, sourceMixer, mixerJs, ['Font Mixer', 'Mix preset', 'Shuffle', 'font-mixer.js']],
  ['username', username, sourceUsername, usernameJs, ['Username Generator', 'Platform', 'Style vibe', 'username-generator.js']],
  ['styler', styler, sourceStyler, stylerJs, ['Auto Font Styler', 'Scenario', 'Style intensity', 'auto-font-styler.js']]
];
for (const [name, builtHtml, sourceHtml, sourceJs, expected] of toolPages) {
  for (const s of expected) if (!builtHtml.includes(s) && !sourceHtml.includes(s) && !sourceJs.includes(s)) throw new Error(`${name} tool missing ${s}`);
  if (!sourceHtml.includes('class="tool-page') || !sourceHtml.includes('class="tool-panel')) throw new Error(`${name} should use shared tool page CSS primitives`);
  if (!sourceHtml.includes('data-clarity-mask="true"')) throw new Error(`${name} inputs/outputs should be masked for Clarity`);
  if (!sourceJs.includes("from './ui.js'")) throw new Error(`${name} should reuse shared UI helpers`);
}
if ((asciiJs.match(/figlet\/fonts\//g) || []).length < 65) throw new Error('ASCII generator should expose at least 65 FIGlet font loaders');
for (const s of ["'Standard'", "'Banner'", "'Banner3-D'", "'Banner3'", "'Big'", "'Block'", "'Bubble'", "'Digital'", 'data-copy-ascii-card', 'data-download-ascii-card-png', 'data-download-ascii-card-txt']) {
  if (!asciiJs.includes(s)) throw new Error(`ASCII popular result cards missing ${s}`);
}
for (const s of ['id="ascii-output"', 'id="copy-ascii"', 'id="download-ascii-txt"', 'id="download-ascii-png"']) {
  if (sourceAscii.includes(s)) throw new Error(`ASCII control panel should not include removed top preview/action: ${s}`);
}
for (const s of ['Copy-paste text', 'TXT + PNG', 'Use the result cards below']) {
  if (sourceAscii.includes(s)) throw new Error(`ASCII control panel should stay compact and not include removed copy/badges: ${s}`);
}
if (!sourceAscii.includes('id="ascii-font"') || !asciiJs.includes('cardFonts = [...new Set([selectedFont, ...popularFonts])]')) throw new Error('ASCII selected FIGlet style should feed the lower result cards');
for (const s of ['latestOutput', 'copyOutput', 'el.output', 'el.copy', 'el.download']) {
  if (asciiJs.includes(s)) throw new Error(`ASCII script should be card-only and not reference removed top controls: ${s}`);
}
if (!sourceAscii.includes('class="ascii-results-section"') || sourceAscii.includes('<section class="tool-panel" aria-labelledby="ascii-results-title"')) throw new Error('ASCII popular results should not be wrapped by an outer visual panel');
if (!asciiJs.includes("card?.classList.add('copied')") || !asciiJs.includes("icon.textContent = 'check'")) throw new Error('ASCII card copy should use homepage-like copied state');
for (const s of ['copyText', 'createToast', 'downloadText', 'selectElementText']) if (!uiJs.includes(`export ${s === 'copyText' || s === 'downloadText' ? 'async ' : ''}function ${s}`) && !uiJs.includes(`export function ${s}`)) throw new Error(`shared UI helper missing ${s}`);
for (const s of ['.tool-page', '.tool-panel', '.tool-form-grid', '.tool-output', '.tool-result-card:hover', '.tool-result-card.copied', '.ascii-results-section', '.ascii-results-grid', '.ascii-card-output', '.ascii-compact-grid', '.ascii-option-grid', '.toast-line[data-toast-visible="true"]']) if (!styles.includes(s)) throw new Error(`shared CSS missing ${s}`);
for (const s of ['overflow-x: auto;', 'scrollbar-gutter: stable;', '.ascii-card-actions .button', 'min-width: 0;']) {
  if (!styles.includes(s)) throw new Error(`ASCII overflow guard CSS missing ${s}`);
}

for (const [name, html] of [['privacy', privacy], ['cookies', cookies], ['terms', terms]]) {
  if (!html.includes('class="legal-page paper-grid"') || !html.includes('class="legal-card"')) throw new Error(`${name} missing centered legal layout`);
  if (!html.includes('href="/terms-of-service"')) throw new Error(`${name} missing terms-of-service links`);
  if (!html.includes('href="/cookies"')) throw new Error(`${name} missing cookie policy link`);
}
if (!cookies.includes('<meta name="robots" content="noindex"')) throw new Error('cookies page should remain noindex');

for (const html of [home, ascii, mixer, username, styler, tool, privacy, cookies, terms]) {
  if (html.includes('href="/terms/"')) throw new Error('stale /terms/ link present');
  if (html.includes('href="/discord-colored-text-generator/"')) throw new Error('stale discord route slash link present');
  if (!html.includes('rel="icon" href="/favicon.png"')) throw new Error('page missing png favicon link');
  if (!html.includes('class="brand-mark" src="/logo.png"')) throw new Error('page missing logo brand mark');
  if (!html.includes('class="nav-toggle"') || !html.includes('id="primary-navigation"')) throw new Error('page missing mobile navigation toggle');
  if (html.includes('/> FontGenerators.app</a>')) throw new Error('visible brand label should omit .app');
  if (!html.includes('/> FontGenerators</a>')) throw new Error('visible brand label missing');
  if (html.includes('<span>Fg_</span>')) throw new Error('page should not use old text-only brand mark');
}
for (const [name, html] of [['home', sourceHome], ['ascii', sourceAscii], ['mixer', sourceMixer], ['username', sourceUsername], ['styler', sourceStyler], ['tool', sourceTool], ['privacy', sourcePrivacy], ['cookies', sourceCookies], ['terms', sourceTerms]]) {
  if (!html.includes('/src/analytics.js')) throw new Error(`${name} missing analytics module`);
  if (!html.includes('data-cookie-settings')) throw new Error(`${name} missing cookie settings control`);
}
if (sourceHome.includes('Free Browser-Based Font Generator') || sourceHome.includes('answer-block')) throw new Error('home should not include the removed hero eyebrow or AEO answer block');
if (sourceHome.includes('class="chips"') || homeJs.includes('style-new') || homeJs.includes('FONTB')) throw new Error('home should not include removed hero chips or temporary FontB badges');
if (!sourceHome.includes('Unicode styles in real time, <br />then copy')) throw new Error('home lede should use the requested two-line break with mobile-safe spacing');
if (!sourceHome.includes('How do I copy and paste fonts from this generator?') || !sourceHome.includes('Is fancy text accessible?')) throw new Error('home missing visible AEO FAQ additions');
if (!sourceHome.includes('data-clarity-mask="true"') || !homeJs.includes('data-clarity-mask="true"')) throw new Error('homepage generator surfaces must be masked for Clarity');
if (!homeJs.includes('fontgenerators.favoriteStyles.v1') || !homeJs.includes('localStorage') || !homeJs.includes("activeCategory === 'Favorites'")) throw new Error('homepage favorites should persist locally and expose a Favorites filter');
if (!uiJs.includes('function fallbackCopyText') || !uiJs.includes("document.execCommand('copy')") || !uiJs.includes('async function copyText') || !homeJs.includes("addEventListener('pointerdown'")) throw new Error('homepage copy should fall back when Clipboard API is blocked');
if (!sourceHome.includes('class="card-icon material-symbols-outlined"') || styles.includes('.bento article:before')) throw new Error('homepage info cards should render real icons, not empty pseudo-element blocks');
if (!styles.includes('.brand-mark') || !styles.includes('.brand.mini .brand-mark')) throw new Error('brand logo CSS missing');
if (!styles.includes('backdrop-filter: blur(28px) saturate(180%) contrast(112%)') || !styles.includes('-webkit-backdrop-filter: blur(28px) saturate(180%) contrast(112%)')) throw new Error('topbar glass effect CSS missing');
if (!styles.includes('.topbar::before') || !styles.includes('feTurbulence') || !styles.includes('mix-blend-mode: multiply')) throw new Error('topbar frosted texture layer missing');
if (!styles.includes('.nav-toggle') || !styles.includes('.topbar[data-nav-open="true"] nav') || !analyticsJs.includes('bindMobileNavigation') || !analyticsJs.includes('header.dataset.navOpen')) throw new Error('mobile topbar navigation should use a hamburger toggle menu');
if (!styles.includes('.icon-action-btn.is-on .material-symbols-outlined') || !styles.includes('"FILL" 1')) throw new Error('favorited star should use filled Material Symbols styling');
if (!styles.includes('.rainbow-control') || !styles.includes('linear-gradient(90deg, #f87171, #facc15, #34d399, #22d3ee, #60a5fa, #f472b6)')) throw new Error('discord rainbow preset styling missing');
if (!styles.includes('.palette-group .color-chip') || !styles.includes('width: 26px;') || !styles.includes('height: 26px;')) throw new Error('mobile Discord color chips should stay compact');
if (!styles.includes('.preview-grid') || !styles.includes('grid-template-columns: 1fr;')) throw new Error('discord preview/output should stack into two rows');
if (!styles.includes('.palette-group') || !styles.includes('.palette-label') || !styles.includes('.active-style-label') || !styles.includes('.active-style-pills')) throw new Error('discord color palette/status clarity CSS missing');
if (!styles.includes('#copy-status[data-toast-visible="true"]') || !styles.includes('.toast-line[data-toast-visible="true"]') || !styles.includes('visibility: hidden;') || !uiJs.includes("status.dataset.toastVisible = 'true'") || !uiJs.includes("setProperty('opacity', '1', 'important')") || !uiJs.includes("setProperty('visibility', 'visible', 'important')")) throw new Error('copy/favorite status should use a floating toast state');
if (!sourceTool.includes('ansi-code-table') || !sourceTool.includes('<code>30</code>') || !sourceTool.includes('<code>47</code>')) throw new Error('discord page missing visible ANSI code table');
if (!sourceTool.includes('data-clarity-mask="true"')) throw new Error('discord editor/output surfaces must be masked for Clarity');
if (!sourceTool.includes('data-preset="rainbow"') || !sourceTool.includes('31, 33, 32, 36, 34, and 35')) throw new Error('discord page missing rainbow ANSI preset UI/explanation');
if (sourceTool.includes('class="badge-row"') || sourceTool.includes('Limited ANSI palette')) throw new Error('discord main tool should not show low-value badge labels');
if (sourceTool.indexOf('class="action-row"') < 0 || sourceTool.indexOf('class="action-row"') > sourceTool.indexOf('class="preview-grid"')) throw new Error('discord action buttons should appear above preview/output results');
if (!sourceTool.includes('<main class="paper-grid">') || sourceTool.includes('class="tool-hero paper-grid"')) throw new Error('discord page background should span the full main, not only the tool card wrapper');
if (!styles.includes('width: min(100%, 1120px);')) throw new Error('discord tool card should use the compact shared tool width');
if (!analyticsJs.includes('FONTGENERATORS_ANALYTICS_CONFIG') || !analyticsJs.includes('VITE_GA_MEASUREMENT_ID') || !analyticsJs.includes('VITE_CLARITY_PROJECT_ID') || !analyticsJs.includes('VITE_PLAUSIBLE_DOMAIN') || !analyticsJs.includes('VITE_AHREFS_ANALYTICS_KEY')) throw new Error('analytics module missing provider configuration hooks');
for (const s of ['G-JX2VGXPG5J', 'x8r8lczazd', 'https://plausible.shipsolo.io/js/pa-31uX2txOmuueW8_OZSa78.js', 'kWGc53rLUFEQEds4myn9rg']) {
  if (!analyticsJs.includes(s)) throw new Error(`analytics module missing configured production ID/script: ${s}`);
}
const consentFn = analyticsJs.match(/function loadConsentAnalytics\(\) \{([\s\S]*?)\n\}/)?.[1] || '';
if (!consentFn || consentFn.includes('loadPlausible(')) throw new Error('Plausible must not be behind cookie consent');
if (!analyticsJs.match(/function init\(\) \{[\s\S]*loadPlausible\(\);[\s\S]*const consent = readConsent\(\)/)) throw new Error('Plausible must load before checking cookie consent');
if (!analyticsJs.match(/if \(typeof window\.plausible === 'function'\) window\.plausible\(name, \{ props: safeProps \}\);[\s\S]*if \(readConsent\(\) !== ACCEPTED\) return;/)) throw new Error('Plausible events should fire before cookie-gated analytics return');
if (!privacy.includes('Plausible Analytics is loaded as privacy-friendly analytics without requiring cookie consent')) throw new Error('privacy page must disclose Plausible no-consent behavior');
if (!cookies.includes('Plausible Analytics may load without cookie consent')) throw new Error('cookie policy must disclose Plausible no-consent behavior');
if (!terms.includes('Plausible may run without cookie consent')) throw new Error('terms page must mention Plausible no-consent behavior');
if (!styles.includes('.utility-hero') || !styles.includes('padding: 48px 32px 26px') || styles.includes('padding: clamp(64px, 8vw, 112px)')) throw new Error('homepage hero should be shifted upward from the previous roomy top spacing');
if (!styles.includes('.generator-card') || !styles.includes('background: transparent;') || !styles.includes('border: 0;') || !styles.includes('box-shadow: none;')) throw new Error('homepage style rows should not be wrapped by an outer visual card');
if (!styles.includes('.cookie-banner') || !styles.includes('left: 24px;') || !styles.includes('bottom: 24px;') || !styles.includes('width: min(300px, calc(100vw - 48px))')) throw new Error('cookie banner should be compact and anchored bottom-left');
if (styles.includes('max-width: 980px') || styles.includes('right: clamp(14px, 4vw, 38px)')) throw new Error('cookie banner should not remain a wide bottom bar');
for (const forbidden of ['raw input text', 'generated ANSI output', 'clipboard content']) {
  if (!cookies.includes(forbidden) && !privacy.includes(forbidden)) throw new Error(`privacy/cookies should disclose analytics forbidden payload: ${forbidden}`);
}
for (const s of ['https://fontgenerators.app/ascii-art-generator', 'https://fontgenerators.app/font-mixer', 'https://fontgenerators.app/username-generator', 'https://fontgenerators.app/auto-font-styler', 'https://fontgenerators.app/discord-colored-text-generator', 'not downloadable TTF/OTF font files', 'Do not describe planned routes']) {
  if (!llms.includes(s)) throw new Error(`llms.txt missing AI/crawler guidance: ${s}`);
}

if (tool.includes('https://fontgenerators.app/discord-colored-text-generator/')) throw new Error('stale discord canonical slash present');
if (!tool.includes('<h1 id="tool-label">Discord Colored Text Generator</h1>')) throw new Error('discord page H1 must use search-facing primary phrase');
if (tool.includes('Discord ANSI Generator - Light Lab')) throw new Error('discord page should not expose internal Light Lab H1 wording');
if (!sourceTool.includes('Text color') || !sourceTool.includes('Highlight') || !sourceTool.includes('Selection formatting')) throw new Error('discord page missing user-friendly color/status labels');
if (sourceTool.includes('>Active style<') || sourceTool.includes('Palette (Fg / Bg)') || sourceTool.includes('Current ANSI codes')) throw new Error('discord page should not expose low-value badge/status labels or raw ANSI labels in the main controls');
if (homeJs.includes('is-featured') || homeJs.includes('style-row${featured}')) throw new Error('homepage should not default-highlight a featured style row');
for (const s of ['toggleStyleControl', 'rangeEvery', 'setRangeStyle']) if (!toolJs.includes(s)) throw new Error(`tool missing toggle helper ${s}`);
for (const s of ['rainbowColors', 'applyRainbow', 'setRangePattern', "from './ui.js'", 'copyText(buildAnsi())']) if (!toolJs.includes(s)) throw new Error(`tool missing rainbow/fallback helper ${s}`);
for (const s of ['findTextEditRange', 'syncSpansAfterTextEdit', 'syncSpansAfterTextEdit(lastText, el.msg.value)']) if (!toolJs.includes(s)) throw new Error(`tool missing style-preserving edit helper ${s}`);
if (toolJs.includes("if (el.msg.value !== lastText) spans = []")) throw new Error('editing Discord text should preserve existing style spans');
if (toolJs.includes('[button.dataset.style]: true')) throw new Error('bold/underline controls must be toggles, not one-way true setters');
const { fontbStyles, resolveStyle, styleAliases, styleAliasGroups, styles: canonicalStyles, transformStyle } = await import('../src/font-styles.js');
const styleIds = fontbStyles.map(style => style.id);
if (styleIds.length < 140) throw new Error(`home has only ${styleIds.length} style transforms`);
if (new Set(styleIds).size !== styleIds.length) throw new Error('duplicate homepage style ids');
if (canonicalStyles.length < 50 || canonicalStyles.length > 90) throw new Error(`homepage should expose a curated unique style list, found ${canonicalStyles.length}`);
if (!styleAliases.length || !styleAliasGroups.length) throw new Error('style registry should retain duplicate outputs as aliases for search/lookup');
const canonicalIds = canonicalStyles.map(style => style.id);
if (new Set(canonicalIds).size !== canonicalIds.length) throw new Error('duplicate canonical homepage style ids');
const alphabetProbe = 'abcdefg hijklmn opqrst uvwxyz ABCDEFG HIJKLMN OPQRST UVWXYZ 0123456789';
const canonicalOutputs = canonicalStyles.map(style => style.transform(alphabetProbe));
if (new Set(canonicalOutputs).size !== canonicalOutputs.length) throw new Error('canonical homepage styles should not produce duplicate outputs for the alphabet probe');
const unassignedMathGlyphs = new Set([0x1d455,0x1d49d,0x1d4a0,0x1d4a1,0x1d4a3,0x1d4a4,0x1d4a7,0x1d4a8,0x1d4ad,0x1d4ba,0x1d4bc,0x1d4c4]);
function assertStyleOutputSupportsProbe(style, output, label) {
  if (!output || !output.trim()) throw new Error(`${label} ${style.id} produced empty output for A-Z/a-z/0-9 probe`);
  const bad = [...output].filter(ch => ch === '\ufffd' || unassignedMathGlyphs.has(ch.codePointAt(0)));
  if (bad.length) throw new Error(`${label} ${style.id} outputs unsupported glyph code points for A-Z/a-z/0-9 probe: ${bad.map(ch => `U+${ch.codePointAt(0).toString(16).toUpperCase()}`).join(', ')}`);
}
for (const style of fontbStyles) {
  assertStyleOutputSupportsProbe(style, transformStyle(style, alphabetProbe), 'raw style');
}
for (const style of canonicalStyles) {
  assertStyleOutputSupportsProbe(style, style.transform(alphabetProbe), 'canonical style');
}
for (const alias of styleAliases) {
  const resolved = resolveStyle(alias.id);
  if (!resolved || resolved.id !== alias.canonicalId) throw new Error(`style alias ${alias.id} should resolve to canonical ${alias.canonicalId}`);
}
for (const forbidden of ['free font downloads', 'download TTF', 'install fonts', 'works everywhere', 'upgrade to pro', 'subscription plan']) {
  if (home.toLowerCase().includes(forbidden.toLowerCase())) throw new Error(`home contains forbidden claim: ${forbidden}`);
}
if (!robots.includes('Disallow: /discord-font-generator/') || !robots.includes('Sitemap: https://fontgenerators.app/sitemap.xml')) throw new Error('robots missing noindex/ sitemap signals');
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const approvedSitemapLocs = ['https://fontgenerators.app/', 'https://fontgenerators.app/ascii-art-generator', 'https://fontgenerators.app/font-mixer', 'https://fontgenerators.app/username-generator', 'https://fontgenerators.app/auto-font-styler', 'https://fontgenerators.app/discord-colored-text-generator'];
if (sitemapLocs.length !== approvedSitemapLocs.length || !approvedSitemapLocs.every(loc => sitemapLocs.includes(loc))) throw new Error(`sitemap must contain only approved indexable pages; found ${sitemapLocs.join(', ')}`);
for (const forbidden of ['/pricing', '/refund', '/cookies', '/discord-font-generator', '/fancy-text-generator', '/discord-text-generator', '/privacy', '/terms-of-service']) {
  if (sitemap.includes(`https://fontgenerators.app${forbidden}`) && forbidden !== '/discord-colored-text-generator') throw new Error(`sitemap should not include non-indexable route ${forbidden}`);
}
if (redirects.includes('www.fontgenerators.app')) throw new Error('Cloudflare Pages _redirects cannot reliably enforce host-level www-to-apex redirects; Pages middleware handles host canonicalization instead');
for (const s of ['/ascii-art-generator/ /ascii-art-generator 301', '/font-mixer/ /font-mixer 301', '/username-generator/ /username-generator 301', '/auto-font-styler/ /auto-font-styler 301', '/discord-colored-text-generator/ /discord-colored-text-generator 301', '/privacy/ /privacy 301', '/cookies/ /cookies 301', '/terms-of-service/ /terms-of-service 301']) if (!redirects.includes(s)) throw new Error(`redirects missing clean URL fallback rule: ${s}`);
for (const s of ['www.fontgenerators.app', 'fontgenerators.app', 'Response.redirect', '/ascii-art-generator', '/font-mixer', '/username-generator', '/auto-font-styler', '/discord-colored-text-generator/', '/cookies/', '/terms-of-service/', 'GOOGLE_SITE_VERIFICATION', 'AHREFS_ANALYTICS_KEY']) {
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
for (const path of ['/ascii-art-generator', '/font-mixer', '/username-generator', '/auto-font-styler']) {
  const response = await middlewareSmoke(`https://fontgenerators.app${path}`);
  if (response.status !== 200 || await response.text() !== 'next ok') throw new Error(`middleware should pass approved clean route through: ${path}`);
  const slash = await middlewareSmoke(`https://fontgenerators.app${path}/`);
  if (slash.status !== 301 || slash.headers.get('location') !== `https://fontgenerators.app${path}`) throw new Error(`middleware should redirect slash route to clean route: ${path}`);
}
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
console.log(`smoke ok: pages, SEO/schema/legal/cookie/analytics routes present; homepage has ${canonicalStyles.length} unique styles from ${styleIds.length} raw definitions; ASCII/Mixer/Username/Auto Styler routes are live; held routes return 404 noindex`);
