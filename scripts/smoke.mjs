import { readFileSync, existsSync, readdirSync } from 'node:fs';
const files=['dist/index.html','dist/discord-colored-text-generator.html','dist/privacy.html','dist/terms-of-service.html','dist/sitemap.xml','dist/robots.txt','dist/_redirects'];
for (const f of files) { if (!existsSync(f)) throw new Error(`missing ${f}`); }
const assetDir='dist/assets';
if (!existsSync(assetDir) || !readdirSync(assetDir).some(f=>f.endsWith('.css')) || !readdirSync(assetDir).some(f=>f.endsWith('.js'))) throw new Error('missing built css/js assets');
const tool=readFileSync('dist/discord-colored-text-generator.html','utf8');
const home=readFileSync('dist/index.html','utf8');
const privacy=readFileSync('dist/privacy.html','utf8');
const terms=readFileSync('dist/terms-of-service.html','utf8');
const homeJs=readFileSync('src/home.js','utf8');
const toolJs=readFileSync('src/tool.js','utf8');
const robots=readFileSync('dist/robots.txt','utf8');
const redirects=readFileSync('dist/_redirects','utf8');
const mustTool=['Discord Colored Text Generator','Copy for Discord','Unofficial tool; not made, endorsed, or sponsored by Discord','Discord ANSI uses a limited palette','FAQPage','WebApplication'];
for (const s of mustTool) if (!tool.includes(s)) throw new Error(`tool missing ${s}`);
const mustHome=['Font Generator for Copy-Paste Fancy Text Styles','Type once, copy many text styles','These are Unicode copy-paste text styles, not downloadable font files','Open Discord Colored Text Generator','WebSite','WebApplication','FAQPage'];
for (const s of mustHome) if (!home.includes(s)) throw new Error(`home missing ${s}`);
for (const s of ['data-category="Bold"','data-category="Cursive"','data-category="Fancy"','data-category="Aesthetic"','data-category="Symbols"','data-category="Discord"','data-category="Social/Gaming"']) if (!home.includes(s)) throw new Error(`home missing filter ${s}`);
for (const [name, html] of [['privacy', privacy], ['terms', terms]]) {
  if (!html.includes('class="legal-page paper-grid"') || !html.includes('class="legal-card"')) throw new Error(`${name} missing centered legal layout`);
  if (!html.includes('href="/terms-of-service"')) throw new Error(`${name} missing terms-of-service links`);
}
for (const html of [home, tool, privacy, terms]) {
  if (html.includes('href="/terms/"')) throw new Error('stale /terms/ link present');
  if (html.includes('href="/discord-colored-text-generator/"')) throw new Error('stale discord route slash link present');
}
if (tool.includes('https://fontgenerators.app/discord-colored-text-generator/')) throw new Error('stale discord canonical slash present');
if (!tool.includes('<h1 id="tool-label">Discord Colored Text Generator</h1>')) throw new Error('discord page H1 must use search-facing primary phrase');
if (tool.includes('Discord ANSI Generator - Light Lab')) throw new Error('discord page should not expose internal Light Lab H1 wording');
if (!tool.includes('Current ANSI codes')) throw new Error('discord page missing user-friendly ANSI codes label');
if (homeJs.includes('is-featured') || homeJs.includes('style-row${featured}')) throw new Error('homepage should not default-highlight a featured style row');
for (const s of ['toggleStyleControl', 'rangeEvery', 'setRangeStyle']) if (!toolJs.includes(s)) throw new Error(`tool missing toggle helper ${s}`);
if (toolJs.includes("[button.dataset.style]: true")) throw new Error('bold/underline controls must be toggles, not one-way true setters');
const styleIds = [...homeJs.matchAll(/\n\s*\['([^']+)'\s*,/g)].map(m => m[1]);
if (styleIds.length < 40) throw new Error(`home has only ${styleIds.length} style transforms`);
if (new Set(styleIds).size !== styleIds.length) throw new Error('duplicate homepage style ids');
for (const forbidden of ['free font downloads','download TTF','install fonts','works everywhere','upgrade to pro','subscription plan']) {
  if (home.toLowerCase().includes(forbidden.toLowerCase())) throw new Error(`home contains forbidden claim: ${forbidden}`);
}
if (!robots.includes('Disallow: /discord-font-generator/') || !robots.includes('Sitemap: https://fontgenerators.app/sitemap.xml')) throw new Error('robots missing noindex/ sitemap signals');
if (!redirects.includes('https://www.fontgenerators.app/* https://fontgenerators.app/:splat 301')) throw new Error('redirects missing www-to-apex canonicalization rule');
console.log(`smoke ok: pages, SEO/schema/legal routes present; homepage has ${styleIds.length} copyable style transforms`);
