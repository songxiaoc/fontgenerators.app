import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const files=['dist/index.html','dist/discord-colored-text-generator/index.html','dist/privacy/index.html','dist/terms/index.html','dist/sitemap.xml','dist/robots.txt'];
for (const f of files) { if (!existsSync(f)) throw new Error(`missing ${f}`); }
const assetDir='dist/assets';
if (!existsSync(assetDir) || !readdirSync(assetDir).some(f=>f.endsWith('.css')) || !readdirSync(assetDir).some(f=>f.endsWith('.js'))) throw new Error('missing built css/js assets');
const tool=readFileSync('dist/discord-colored-text-generator/index.html','utf8');
const home=readFileSync('dist/index.html','utf8');
const robots=readFileSync('dist/robots.txt','utf8');
const mustTool=['Discord Colored Text Generator','Copy for Discord','Unofficial tool; not made, endorsed, or sponsored by Discord','Discord ANSI uses a limited palette','FAQPage','WebApplication'];
for (const s of mustTool) if (!tool.includes(s)) throw new Error(`tool missing ${s}`);
for (const s of ['Font Generators for Discord, Social Bios, and Gaming Text','Start with Discord Colored Text Generator','WebSite']) if (!home.includes(s)) throw new Error(`home missing ${s}`);
if (!robots.includes('Disallow: /discord-font-generator/') || !robots.includes('Sitemap: https://fontgenerators.app/sitemap.xml')) throw new Error('robots missing noindex/ sitemap signals');
console.log('smoke ok: pages, SEO copy, schema, legal routes, sitemap/robots present');
