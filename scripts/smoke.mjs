import { readFileSync, existsSync, readdirSync } from 'node:fs';
const files=['dist/index.html','dist/discord-colored-text-generator/index.html','dist/privacy/index.html','dist/terms/index.html','dist/sitemap.xml','dist/robots.txt'];
for (const f of files) { if (!existsSync(f)) throw new Error(`missing ${f}`); }
const assetDir='dist/assets';
if (!existsSync(assetDir) || !readdirSync(assetDir).some(f=>f.endsWith('.css')) || !readdirSync(assetDir).some(f=>f.endsWith('.js'))) throw new Error('missing built css/js assets');
const tool=readFileSync('dist/discord-colored-text-generator/index.html','utf8');
const home=readFileSync('dist/index.html','utf8');
const homeJs=readFileSync('src/home.js','utf8');
const robots=readFileSync('dist/robots.txt','utf8');
const mustTool=['Discord Colored Text Generator','Copy for Discord','Unofficial tool; not made, endorsed, or sponsored by Discord','Discord ANSI uses a limited palette','FAQPage','WebApplication'];
for (const s of mustTool) if (!tool.includes(s)) throw new Error(`tool missing ${s}`);
const mustHome=['Font Generator for Copy-Paste Fancy Text Styles','Type once, copy many text styles','These are Unicode copy-paste text styles, not downloadable font files','Open Discord Colored Text Generator','WebSite','WebApplication','FAQPage'];
for (const s of mustHome) if (!home.includes(s)) throw new Error(`home missing ${s}`);
for (const s of ['data-category="Bold"','data-category="Cursive"','data-category="Fancy"','data-category="Aesthetic"','data-category="Symbols"','data-category="Discord"','data-category="Social/Gaming"']) if (!home.includes(s)) throw new Error(`home missing filter ${s}`);
const styleIds = [...homeJs.matchAll(/\n\s*\['([^']+)'\s*,/g)].map(m => m[1]);
if (styleIds.length < 40) throw new Error(`home has only ${styleIds.length} style transforms`);
if (new Set(styleIds).size !== styleIds.length) throw new Error('duplicate homepage style ids');
for (const forbidden of ['free font downloads','download TTF','install fonts','works everywhere','upgrade to pro','subscription plan']) {
  if (home.toLowerCase().includes(forbidden.toLowerCase())) throw new Error(`home contains forbidden claim: ${forbidden}`);
}
if (!robots.includes('Disallow: /discord-font-generator/') || !robots.includes('Sitemap: https://fontgenerators.app/sitemap.xml')) throw new Error('robots missing noindex/ sitemap signals');
console.log(`smoke ok: pages, SEO/schema/legal routes present; homepage has ${styleIds.length} copyable style transforms`);
