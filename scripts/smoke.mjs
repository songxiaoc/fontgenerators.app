import { readFileSync, existsSync, readdirSync } from 'node:fs';

const files = [
  'dist/index.html',
  'dist/ascii-art-generator.html',
  'dist/font-mixer.html',
  'dist/username-generator.html',
  'dist/auto-font-changer.html',
  'dist/brat-generator.html',
  'dist/brat-font.html',
  'dist/brat-green.html',
  'dist/discord-colored-text-generator.html',
  'dist/about.html',
  'dist/privacy.html',
  'dist/cookies.html',
  'dist/terms-of-service.html',
  'dist/sitemap.xml',
  'dist/robots.txt',
  'dist/llms.txt',
  'dist/logo.png',
  'dist/favicon.png',
  'dist/og/brat-generator.png',
  'dist/og/brat-font.png',
  'dist/og/brat-green.png',
  'dist/fonts/dm-sans-latin.woff2',
  'dist/fonts/dm-sans-latin-ext.woff2',
  'dist/_redirects',
  'public/fonts/dm-sans-latin.woff2',
  'public/fonts/dm-sans-latin-ext.woff2',
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
const changer = readFileSync('dist/auto-font-changer.html', 'utf8');
const brat = readFileSync('dist/brat-generator.html', 'utf8');
const bratFont = readFileSync('dist/brat-font.html', 'utf8');
const bratGreen = readFileSync('dist/brat-green.html', 'utf8');
const privacy = readFileSync('dist/privacy.html', 'utf8');
const cookies = readFileSync('dist/cookies.html', 'utf8');
const terms = readFileSync('dist/terms-of-service.html', 'utf8');
const about = readFileSync('dist/about.html', 'utf8');
const sourceHome = readFileSync('index.html', 'utf8');
const sourceAscii = readFileSync('ascii-art-generator.html', 'utf8');
const sourceMixer = readFileSync('font-mixer.html', 'utf8');
const sourceUsername = readFileSync('username-generator.html', 'utf8');
const sourceChanger = readFileSync('auto-font-changer.html', 'utf8');
const sourceBrat = readFileSync('brat-generator.html', 'utf8');
const sourceBratFont = readFileSync('brat-font.html', 'utf8');
const sourceBratGreen = readFileSync('brat-green.html', 'utf8');
const sourceTool = readFileSync('discord-colored-text-generator.html', 'utf8');
const sourceAbout = readFileSync('about.html', 'utf8');
const sourcePrivacy = readFileSync('privacy.html', 'utf8');
const sourceCookies = readFileSync('cookies.html', 'utf8');
const sourceTerms = readFileSync('terms-of-service.html', 'utf8');
const homeJs = readFileSync('src/home.js', 'utf8');
const fontStylesJs = readFileSync('src/font-styles.js', 'utf8');
const uiJs = readFileSync('src/ui.js', 'utf8');
const asciiJs = readFileSync('src/ascii-art.js', 'utf8');
const mixerJs = readFileSync('src/font-mixer.js', 'utf8');
const usernameJs = readFileSync('src/username-generator.js', 'utf8');
const changerJs = readFileSync('src/auto-font-changer.js', 'utf8');
const bratJs = readFileSync('src/brat-generator.js', 'utf8');
const bratGreenJs = readFileSync('src/brat-green.js', 'utf8');
const toolJs = readFileSync('src/tool.js', 'utf8');
const analyticsJs = readFileSync('src/analytics.js', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const robots = readFileSync('dist/robots.txt', 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const publicSitemap = readFileSync('public/sitemap.xml', 'utf8');
const rootSitemap = readFileSync('sitemap.xml', 'utf8');
const redirects = readFileSync('dist/_redirects', 'utf8');
const llms = readFileSync('dist/llms.txt', 'utf8');
const middleware = readFileSync('functions/_middleware.js', 'utf8');
const viteConfig = readFileSync('vite.config.js', 'utf8');

const seoPages = [
  ['home', home, 'font generator', 'copy paste fonts'],
  ['ascii', ascii, 'ascii art', 'ascii art generator'],
  ['mixer', mixer, 'font mixer', 'font mixer tool'],
  ['username', username, 'username generator', 'fancy username generator'],
  ['changer', changer, 'font changer', 'auto font changer'],
  ['tool', tool, 'colored text', 'discord colored text'],
  ['privacy', privacy, 'privacy policy', 'browser privacy policy'],
  ['cookies', cookies, 'cookie policy', 'analytics cookie policy'],
  ['terms', terms, 'service terms', 'terms of service']
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
}

function wordTokens(html) {
  return stripHtml(html).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean);
}

function countPhrase(tokens, phrase) {
  const parts = phrase.split(/\s+/);
  let count = 0;
  for (let i = 0; i <= tokens.length - parts.length; i++) {
    let matches = true;
    for (let j = 0; j < parts.length; j++) {
      if (tokens[i + j] !== parts[j]) {
        matches = false;
        break;
      }
    }
    if (matches) count++;
  }
  return count;
}

function assertSeoMetrics(name, html, twoWordKeyword, threeWordKeyword) {
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || '';
  const tokens = wordTokens(html);
  const twoWordDensity = (countPhrase(tokens, twoWordKeyword) / tokens.length) * 100;
  const threeWordDensity = (countPhrase(tokens, threeWordKeyword) / tokens.length) * 100;

  if (!title || title.length > 60) throw new Error(`${name} title must be present and <=60 characters; found ${title.length}`);
  if (/(?:\||-|–|—)\s*FontGenerators(?:\.app)?\s*$/i.test(title) || /FontGenerators\.app/i.test(title)) throw new Error(`${name} title should not append the brand name`);
  if (description.length < 140 || description.length > 160) throw new Error(`${name} description must be 140-160 characters; found ${description.length}`);
  if (tokens.length < 1000) throw new Error(`${name} should have at least 1000 visible words; found ${tokens.length}`);
  if (twoWordDensity < 3) throw new Error(`${name} "${twoWordKeyword}" density must be >=3%; found ${twoWordDensity.toFixed(2)}%`);
  if (threeWordDensity < 1) throw new Error(`${name} "${threeWordKeyword}" density must be >=1%; found ${threeWordDensity.toFixed(2)}%`);
}

function assertImageAlts(name, html) {
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = tag.match(/\salt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!alt) throw new Error(`${name} image missing alt text: ${tag.slice(0, 100)}`);
    const value = alt[1] ?? alt[2] ?? alt[3] ?? '';
    if (!value.trim()) throw new Error(`${name} image has empty alt text: ${tag.slice(0, 100)}`);
  }
}

for (const [name, html, twoWordKeyword, threeWordKeyword] of seoPages) {
  assertSeoMetrics(name, html, twoWordKeyword, threeWordKeyword);
  assertImageAlts(name, html);
}
// The Brat page uses intent/structure assertions below instead of the legacy
// mechanical keyword-density thresholds used by established long-form pages.
assertImageAlts('brat', brat);
assertImageAlts('brat font', bratFont);
assertImageAlts('brat green', bratGreen);
assertImageAlts('about', about);

for (const [name, content] of [
  ['home source', sourceHome],
  ['ascii source', sourceAscii],
  ['mixer source', sourceMixer],
  ['username source', sourceUsername],
  ['changer source', sourceChanger],
  ['brat source', sourceBrat],
  ['brat font source', sourceBratFont],
  ['brat green source', sourceBratGreen],
  ['tool source', sourceTool],
  ['about source', sourceAbout],
  ['home js', homeJs],
  ['ascii js', asciiJs],
  ['username js', usernameJs],
  ['brat js', bratJs],
  ['brat green js', bratGreenJs],
  ['built home', home],
  ['built ascii', ascii],
  ['built mixer', mixer],
  ['built username', username],
  ['built changer', changer],
  ['built brat', brat],
  ['built brat font', bratFont],
  ['built brat green', bratGreen],
  ['built about', about],
  ['built tool', tool]
]) {
  if (/<span\b(?=[^>]*material-symbols-outlined)[^>]*>\s*[a-z][a-z0-9_]*\s*<\/span>/i.test(content)) {
    throw new Error(`${name} should render Material Symbols from data-icon, not visible ligature text`);
  }
}

for (const [name, html] of [
  ['home', sourceHome],
  ['ascii', sourceAscii],
  ['mixer', sourceMixer],
  ['username', sourceUsername],
  ['changer', sourceChanger],
  ['brat', sourceBrat],
  ['brat font', sourceBratFont],
  ['brat green', sourceBratGreen],
  ['tool', sourceTool],
  ['about', sourceAbout],
  ['privacy', sourcePrivacy],
  ['cookies', sourceCookies],
  ['terms', sourceTerms]
]) {
  if (!html.includes('rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin')) throw new Error(`${name} should preload the self-hosted DM Sans latin subset`);
  if (html.includes('family=DM+Sans')) throw new Error(`${name} should not load DM Sans from Google Fonts`);
  if (html.includes('Space+Grotesk')) throw new Error(`${name} should not load Space Grotesk from Google Fonts`);
  if (html.includes('family=JetBrains+Mono') && !html.includes('family=JetBrains+Mono:wght@500;700&display=optional')) throw new Error(`${name} remaining Google text fonts should use display=optional`);
  if (html.includes('family=JetBrains+Mono') && html.includes('family=JetBrains+Mono:wght@500;700&display=swap')) throw new Error(`${name} remaining Google text fonts should not use display=swap`);
  if (html.includes('family=Noto+Sans+Math') && !html.includes('family=Noto+Sans+Math&display=optional')) throw new Error(`${name} math fallback font should use display=optional`);
  if (html.includes('family=Noto+Sans+Math&display=swap')) throw new Error(`${name} math fallback font should not use display=swap`);
  if (html.includes('Material+Symbols+Outlined') && !html.includes('Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=swap')) throw new Error(`${name} Material Symbols should keep display=swap so icons do not stay as ligature text`);
}
if (!styles.includes('src: url("/fonts/dm-sans-latin.woff2") format("woff2")') || !styles.includes('src: url("/fonts/dm-sans-latin-ext.woff2") format("woff2")') || !styles.includes('font-weight: 400 800;') || !styles.includes('font-display: swap;')) {
  throw new Error('global CSS should self-host DM Sans variable font subsets');
}
if (!styles.includes('--font-display: "DM Sans", system-ui, sans-serif;') || styles.includes('Space Grotesk')) throw new Error('display headings should use the self-hosted DM Sans family on first load');

const mustTool = ['Discord Colored Text Generator', 'Copy for Discord', 'Rainbow', 'Unofficial tool; not made, endorsed, or sponsored by Discord', 'Discord ANSI uses a limited palette', 'FAQPage', 'WebApplication', 'HowTo'];
for (const s of mustTool) if (!tool.includes(s)) throw new Error(`tool missing ${s}`);
const mustHome = ['Font Generator for Copy-Paste Fancy Text Styles', 'Type once, copy many text styles', 'These are Unicode copy-paste text styles, not downloadable font files', 'Open Discord Colored Text Generator', 'WebSite', 'WebApplication', 'FAQPage'];
for (const s of mustHome) if (!home.includes(s)) throw new Error(`home missing ${s}`);
function decodeBasicEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function getTagAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\b${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find(value => value !== undefined) || '';
}

function getMetaContent(html, attribute, value) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (getTagAttribute(tag, attribute).toLowerCase() === value.toLowerCase()) return decodeBasicEntities(getTagAttribute(tag, 'content'));
  }
  return '';
}

function getCanonical(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    if (getTagAttribute(tag, 'rel').toLowerCase() === 'canonical') return getTagAttribute(tag, 'href');
  }
  return '';
}

function getJsonLdNodes(name, html) {
  const nodes = [];
  function visit(value) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== 'object') return;
    nodes.push(value);
    Object.values(value).forEach(nested => {
      if (nested && typeof nested === 'object') visit(nested);
    });
  }
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      visit(JSON.parse(match[1]));
    } catch (error) {
      throw new Error(`${name} contains invalid JSON-LD: ${error.message}`);
    }
  }
  return nodes;
}

function hasSchemaType(nodes, expectedType) {
  return nodes.some(node => {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    return types.includes(expectedType);
  });
}

function getSchemaNodesByType(nodes, expectedType) {
  return nodes.filter(node => {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    return types.includes(expectedType);
  });
}

function getSingleSchemaNode(name, nodes, expectedType) {
  const matches = getSchemaNodesByType(nodes, expectedType);
  if (matches.length !== 1) throw new Error(`${name} must expose exactly one ${expectedType} node; found ${matches.length}`);
  return matches[0];
}

function assertExactStringSet(name, actual, expected) {
  if (!Array.isArray(actual) || actual.some(value => typeof value !== 'string')) {
    throw new Error(`${name} must be an array of strings`);
  }
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  if (actualSet.size !== actual.length) throw new Error(`${name} must not contain duplicate values`);
  const missing = expected.filter(value => !actualSet.has(value));
  const unexpected = actual.filter(value => !expectedSet.has(value));
  if (missing.length || unexpected.length || actual.length !== expected.length) {
    throw new Error(`${name} mismatch; missing: ${missing.join(', ') || 'none'}; unexpected: ${unexpected.join(', ') || 'none'}`);
  }
}

function getElementHtml(name, html, tagName) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'i'));
  if (!match) throw new Error(`${name} missing <${tagName}>`);
  return match[0];
}

function getSectionByClass(name, html, className) {
  for (const match of html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)) {
    const openingTag = match[0].match(/^<section\b[^>]*>/i)?.[0] || '';
    const classes = getTagAttribute(openingTag, 'class').split(/\s+/).filter(Boolean);
    if (classes.includes(className)) return match[0];
  }
  throw new Error(`${name} missing visible section .${className}`);
}

function getAnchors(html) {
  return [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(match => ({
    href: getTagAttribute(match[0].match(/^<a\b[^>]*>/i)?.[0] || '', 'href'),
    label: decodeBasicEntities(stripHtml(match[0]).trim().replace(/\s+/g, ' '))
  }));
}

function getLabeledTime(name, html, labelPattern) {
  const main = getElementHtml(name, html, 'main');
  const match = main.match(new RegExp(`${labelPattern}\\s*:?\\s*[\\s\\S]{0,48}?<time\\b[^>]*\\bdatetime=(?:"([^"]+)"|'([^']+)')`, 'i'));
  return match?.[1] ?? match?.[2] ?? '';
}

function assertIsoDate(name, value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${name} must be a valid YYYY-MM-DD date; found ${value || 'missing'}`);
  }
}

function getMarkdownSection(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const headingLine = `## ${heading}`;
  const start = lines.findIndex(line => line.trim() === headingLine);
  if (start < 0) throw new Error(`llms.txt missing ${headingLine} section`);
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index++) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n');
}

function getMarkdownLinks(markdown) {
  return [...markdown.matchAll(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g)].map(match => ({
    label: match[1].trim(),
    url: match[2]
  }));
}

function assertMarkdownLinkSection(sectionName, section, expectedLinks) {
  const actualLinks = getMarkdownLinks(section);
  const actualPairs = actualLinks.map(link => `${link.label}\t${link.url}`);
  const expectedPairs = expectedLinks.map(link => `${link.label}\t${link.url}`);
  assertExactStringSet(`llms.txt ${sectionName} links`, actualPairs, expectedPairs);
  return actualLinks;
}

function searchableText(value) {
  return decodeBasicEntities(String(value))
    .toLowerCase()
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/[^a-z0-9#]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function assertVisibleFaqMatchesSchema(name, html, nodes) {
  const faq = nodes.find(node => hasSchemaType([node], 'FAQPage'));
  if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length < 3) throw new Error(`${name} FAQPage must contain at least three visible questions`);
  const visible = searchableText(html);
  for (const question of faq.mainEntity) {
    if (question?.['@type'] !== 'Question' || !question.name || !question.acceptedAnswer?.text) throw new Error(`${name} FAQPage contains an incomplete Question`);
    if (!visible.includes(searchableText(question.name))) throw new Error(`${name} FAQ schema question is not visible on the page: ${question.name}`);
    if (!visible.includes(searchableText(question.acceptedAnswer.text))) throw new Error(`${name} FAQ schema answer is not visible on the page: ${question.name}`);
  }
}

const aboutNodes = getJsonLdNodes('about', about);
const aboutTitle = decodeBasicEntities(about.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '');
const aboutH1 = decodeBasicEntities(stripHtml(about.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').trim().replace(/\s+/g, ' '));
const aboutCanonical = 'https://fontgenerators.app/about';
if (aboutTitle !== 'About FontGenerators.app and Its Browser Tools') throw new Error(`about title mismatch: ${aboutTitle || 'missing'}`);
if (aboutH1 !== 'About FontGenerators.app') throw new Error(`about H1 mismatch: ${aboutH1 || 'missing'}`);
if (getCanonical(about) !== aboutCanonical) throw new Error('about canonical must use the clean production URL');
if (!getMetaContent(about, 'name', 'robots').includes('index, follow')) throw new Error('about page must remain indexable');
for (const type of ['Organization', 'WebSite', 'AboutPage']) if (!hasSchemaType(aboutNodes, type)) throw new Error(`about page missing ${type} structured data`);
const aboutPageSchema = getSingleSchemaNode('about', aboutNodes, 'AboutPage');
if (aboutPageSchema['@id'] !== `${aboutCanonical}#webpage` || aboutPageSchema.url !== aboutCanonical) throw new Error('about AboutPage @id and url must match its canonical');
if (aboutPageSchema.name !== aboutTitle) throw new Error('about AboutPage name must match its title');
if (aboutPageSchema.about?.['@id'] !== 'https://fontgenerators.app/#organization' || aboutPageSchema.author?.['@id'] !== 'https://fontgenerators.app/#organization' || aboutPageSchema.publisher?.['@id'] !== 'https://fontgenerators.app/#organization' || aboutPageSchema.isPartOf?.['@id'] !== 'https://fontgenerators.app/#website') throw new Error('about AboutPage must reference the shared Organization and WebSite entities');
if (!sourceAbout.includes('id="contact"') || !sourceAbout.includes('How factual claims are reviewed') || !sourceAbout.includes('contact<span class="email-at"')) throw new Error('about page must expose editorial policy and a visible contact section');
if (wordTokens(about).length < 350) throw new Error(`about page should provide substantive publisher and editorial information; found ${wordTokens(about).length} visible words`);

const bratPageContracts = [
  {
    name: 'brat generator',
    html: brat,
    source: sourceBrat,
    title: 'Brat Generator — Free Brat Text & Image Maker',
    description: 'Create brat-style text images with this free brat font generator. Customize colors, blur, alignment and size, then download PNG, JPEG or WebP—no signup.',
    h1: 'Brat Generator',
    canonical: 'https://fontgenerators.app/brat-generator',
    ogImage: 'https://fontgenerators.app/og/brat-generator.png',
    schemaTypes: ['Organization', 'WebSite', 'WebPage', 'WebApplication', 'HowTo', 'FAQPage'],
    pageId: 'https://fontgenerators.app/brat-generator#webpage',
    mainEntityType: 'WebApplication',
    mainEntityId: 'https://fontgenerators.app/brat-generator#app',
    links: ['/brat-font', '/brat-green']
  },
  {
    name: 'brat font',
    html: bratFont,
    source: sourceBratFont,
    title: 'What Is the Brat Font? Name, Canva, CapCut & Alternatives',
    description: 'What font does Brat use? See the Arial-based cover treatment, legal alternatives, Canva and CapCut workflows, and why no font file is needed.',
    h1: 'What Is the Brat Font?',
    canonical: 'https://fontgenerators.app/brat-font',
    ogImage: 'https://fontgenerators.app/og/brat-font.png',
    schemaTypes: ['WebPage', 'Article', 'BreadcrumbList', 'FAQPage'],
    pageId: 'https://fontgenerators.app/brat-font#webpage',
    mainEntityType: 'Article',
    mainEntityId: 'https://fontgenerators.app/brat-font#article',
    breadcrumbId: 'https://fontgenerators.app/brat-font#breadcrumb',
    links: ['/brat-generator', '/brat-green']
  },
  {
    name: 'brat green',
    html: bratGreen,
    source: sourceBratGreen,
    title: 'Brat Green Color Code — #8ACE00 Hex, RGB, HSL & CMYK',
    description: 'Copy the Brat green color code #8ACE00 in HEX, RGB, HSL and CMYK. Compare black and white text contrast, copy CSS, and open it in the image editor.',
    h1: 'Brat Green Color Code: #8ACE00',
    canonical: 'https://fontgenerators.app/brat-green',
    ogImage: 'https://fontgenerators.app/og/brat-green.png',
    schemaTypes: ['WebPage', 'WebApplication', 'BreadcrumbList', 'FAQPage'],
    pageId: 'https://fontgenerators.app/brat-green#webpage',
    mainEntityType: 'WebApplication',
    mainEntityId: 'https://fontgenerators.app/brat-green#app',
    breadcrumbId: 'https://fontgenerators.app/brat-green#breadcrumb',
    links: ['/brat-generator', '/brat-font']
  }
];

const bratStructuredDates = new Map();
for (const contract of bratPageContracts) {
  const title = decodeBasicEntities(contract.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '');
  const description = getMetaContent(contract.html, 'name', 'description');
  const robots = getMetaContent(contract.html, 'name', 'robots').toLowerCase();
  const h1Matches = [...contract.html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1 = decodeBasicEntities(stripHtml(h1Matches[0]?.[1] || '').trim().replace(/\s+/g, ' '));
  const nodes = getJsonLdNodes(contract.name, contract.html);
  const metadata = [
    title,
    ...[...contract.html.matchAll(/<meta\b[^>]*\bcontent=(?:"([^"]*)"|'([^']*)')[^>]*>/gi)].map(match => match[1] ?? match[2] ?? '')
  ].join(' ');

  if (title !== contract.title) throw new Error(`${contract.name} title mismatch: ${title || 'missing'}`);
  if (description !== contract.description) throw new Error(`${contract.name} meta description does not match the approved search-intent copy`);
  if (getCanonical(contract.html) !== contract.canonical) throw new Error(`${contract.name} canonical must be ${contract.canonical}`);
  if (h1Matches.length !== 1 || h1 !== contract.h1) throw new Error(`${contract.name} must expose exactly one H1 with approved text; found "${h1}"`);
  if (!robots.includes('index') || !robots.includes('follow') || robots.includes('noindex')) throw new Error(`${contract.name} robots meta must be index, follow`);
  if (getMetaContent(contract.html, 'property', 'og:url') !== contract.canonical) throw new Error(`${contract.name} og:url must match its canonical`);
  if (getMetaContent(contract.html, 'property', 'og:image') !== contract.ogImage) throw new Error(`${contract.name} must use its dedicated 1200x630 OG image`);
  if (getMetaContent(contract.html, 'property', 'og:image:width') !== '1200' || getMetaContent(contract.html, 'property', 'og:image:height') !== '630') throw new Error(`${contract.name} OG image metadata must declare 1200x630`);
  if (getMetaContent(contract.html, 'name', 'twitter:image') !== contract.ogImage) throw new Error(`${contract.name} Twitter image must match its dedicated OG image`);
  for (const type of contract.schemaTypes) if (!hasSchemaType(nodes, type)) throw new Error(`${contract.name} page missing ${type} structured data`);
  const page = getSingleSchemaNode(contract.name, nodes, 'WebPage');
  const mainEntity = getSingleSchemaNode(contract.name, nodes, contract.mainEntityType);
  if (page['@id'] !== contract.pageId || page.url !== contract.canonical || page.name !== contract.title) throw new Error(`${contract.name} WebPage @id, url, and name must match its canonical page identity`);
  if (page.mainEntity?.['@id'] !== contract.mainEntityId || mainEntity['@id'] !== contract.mainEntityId) throw new Error(`${contract.name} mainEntity must resolve to ${contract.mainEntityId}`);
  if (contract.mainEntityType === 'WebApplication' && mainEntity.url !== contract.canonical) throw new Error(`${contract.name} WebApplication url must match its canonical`);
  if (contract.mainEntityType === 'Article' && mainEntity.mainEntityOfPage?.['@id'] !== contract.pageId) throw new Error(`${contract.name} Article must point back to its WebPage`);
  if (contract.breadcrumbId) {
    const breadcrumb = getSingleSchemaNode(contract.name, nodes, 'BreadcrumbList');
    if (page.breadcrumb?.['@id'] !== contract.breadcrumbId || breadcrumb['@id'] !== contract.breadcrumbId) throw new Error(`${contract.name} breadcrumb @id must match the WebPage reference`);
  }
  for (const field of ['datePublished', 'dateModified']) assertIsoDate(`${contract.name} WebPage ${field}`, page[field]);
  if (page.datePublished > page.dateModified) throw new Error(`${contract.name} datePublished must not be after dateModified`);
  bratStructuredDates.set(contract.canonical, page.dateModified);
  assertVisibleFaqMatchesSchema(contract.name, contract.html, nodes);
  for (const path of contract.links) if (!contract.source.includes(`href="${path}"`)) throw new Error(`${contract.name} must link to ${path}`);
  if (/\b(?:official generator|exact replica)\b/i.test(metadata)) throw new Error(`${contract.name} search/social metadata contains a prohibited official/exact claim`);
}

const bratKeywordOwnershipContracts = [
  {
    name: 'brat generator',
    html: brat,
    primary: 'brat generator',
    secondary: ['brat font generator', 'brat text generator'],
    siblingPrimaries: ['brat font', 'brat green']
  },
  {
    name: 'brat font',
    html: bratFont,
    primary: 'brat font',
    secondary: ['what is the brat font', 'brat font name'],
    siblingPrimaries: ['brat generator', 'brat green']
  },
  {
    name: 'brat green',
    html: bratGreen,
    primary: 'brat green',
    secondary: ['brat green color code', 'brat color code'],
    siblingPrimaries: ['brat generator', 'brat font']
  }
];
for (const contract of bratKeywordOwnershipContracts) {
  const mainTokens = wordTokens(getElementHtml(contract.name, contract.html, 'main'));
  const primaryCount = countPhrase(mainTokens, contract.primary);
  const siblingCounts = contract.siblingPrimaries.map(phrase => [phrase, countPhrase(mainTokens, phrase)]);
  const strongestSibling = Math.max(...siblingCounts.map(([, count]) => count));
  if (primaryCount <= strongestSibling) {
    throw new Error(`${contract.name} primary phrase must remain the strongest Brat head term; ${contract.primary}=${primaryCount}, ${siblingCounts.map(([phrase, count]) => `${phrase}=${count}`).join(', ')}`);
  }
  for (const phrase of contract.secondary) {
    if (countPhrase(mainTokens, phrase) < 1) throw new Error(`${contract.name} missing assigned secondary phrase: ${phrase}`);
  }
  const title = decodeBasicEntities(contract.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').toLowerCase();
  for (const phrase of contract.siblingPrimaries) {
    if (title.includes(phrase)) throw new Error(`${contract.name} title must not target sibling primary phrase: ${phrase}`);
  }
}

const bratIdentityFields = bratPageContracts.map(contract => {
  const title = decodeBasicEntities(contract.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '');
  const h1 = decodeBasicEntities(stripHtml(contract.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').trim().replace(/\s+/g, ' '));
  return [title, h1, getCanonical(contract.html)];
}).flat();
if (new Set(bratIdentityFields).size !== bratIdentityFields.length) throw new Error('Brat topic-cluster pages must have unique title, H1, and canonical values');

const bratSchemaNodes = getJsonLdNodes('brat generator', brat);
const bratOrganizationSchema = bratSchemaNodes.find(node => hasSchemaType([node], 'Organization'));
const bratWebsiteSchema = bratSchemaNodes.find(node => hasSchemaType([node], 'WebSite'));
const bratWebPageSchema = bratSchemaNodes.find(node => hasSchemaType([node], 'WebPage'));
const bratApplicationSchema = bratSchemaNodes.find(node => hasSchemaType([node], 'WebApplication'));
if (bratOrganizationSchema?.['@id'] !== 'https://fontgenerators.app/#organization' || bratOrganizationSchema?.name !== 'FontGenerators.app' || bratOrganizationSchema?.alternateName !== 'FontGenerators') throw new Error('brat page must expose the stable FontGenerators.app Organization identity');
if (bratWebsiteSchema?.['@id'] !== 'https://fontgenerators.app/#website' || bratWebsiteSchema?.publisher?.['@id'] !== 'https://fontgenerators.app/#organization') throw new Error('brat page must expose the stable WebSite identity and publisher relation');
const visibleBratPublished = getLabeledTime('brat generator', brat, '\\bPublished\\b');
const visibleBratReviewed = getLabeledTime('brat generator', brat, '\\blast reviewed\\b');
assertIsoDate('brat generator visible published date', visibleBratPublished);
assertIsoDate('brat generator visible reviewed date', visibleBratReviewed);
if (bratWebPageSchema?.datePublished !== visibleBratPublished || bratWebPageSchema?.dateModified !== visibleBratReviewed || bratWebPageSchema?.lastReviewed !== visibleBratReviewed) throw new Error('brat WebPage dates must match the visible Published and last reviewed dates');
for (const field of ['author', 'publisher']) if (bratWebPageSchema?.[field]?.['@id'] !== 'https://fontgenerators.app/#organization') throw new Error(`brat WebPage ${field} must reference the stable Organization`);
if (bratWebPageSchema?.isPartOf?.['@id'] !== 'https://fontgenerators.app/#website') throw new Error('brat WebPage must reference the stable WebSite');
const bratCitations = [
  'https://abcdinamo.com/newsletter/the-dinamo-update-our-font-for-charli-xcxs-brat',
  'https://learn.microsoft.com/en-us/typography/font-list/arial-narrow',
  'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum'
];
assertExactStringSet('brat WebPage citations', bratWebPageSchema?.citation, bratCitations);
const bratSourcesSection = getSectionByClass('brat generator', brat, 'brat-sources');
const visibleBratSourceUrls = getAnchors(bratSourcesSection).map(anchor => anchor.href).filter(href => /^https:\/\//.test(href));
assertExactStringSet('brat visible source links', visibleBratSourceUrls, bratCitations);
if (!sourceBrat.includes('<meta name="author" content="FontGenerators.app"') || !getAnchors(bratSourcesSection).some(anchor => anchor.href === '/about' && anchor.label === 'FontGenerators.app')) throw new Error('brat page must expose visible organization authorship in its sources section');
if (!sourceBrat.includes('<table class="brat-comparison-table">') || !sourceBrat.includes('<caption>Brat Generator export and clipboard format comparison</caption>') || !sourceBrat.includes('<th scope="col">Method</th>') || !sourceBrat.includes('<th scope="row">PNG download</th>') || !sourceBrat.includes('<th scope="row">JPEG download</th>') || !sourceBrat.includes('<th scope="row">WebP download</th>')) throw new Error('brat page must expose an accessible, practical export-format comparison table');
const schemaPages = [['home', home], ['ascii', ascii], ['mixer', mixer], ['username', username], ['changer', changer], ['brat generator', brat], ['brat font', bratFont], ['brat green', bratGreen], ['tool', tool], ['about', about], ['privacy', privacy], ['cookies', cookies], ['terms', terms]];
for (const [name, html] of schemaPages) {
  for (const entityType of ['Organization', 'WebSite']) {
    for (const entity of getSchemaNodesByType(getJsonLdNodes(name, html), entityType)) {
      if (Object.hasOwn(entity, 'sameAs')) throw new Error(`${name} ${entityType} must not claim unverified sameAs profiles`);
    }
  }
}
for (const [name, html] of [['home', home], ['about', about], ['brat generator', brat]]) {
  const nodes = getJsonLdNodes(name, html);
  const organization = getSingleSchemaNode(name, nodes, 'Organization');
  const website = getSingleSchemaNode(name, nodes, 'WebSite');
  if (organization['@id'] !== 'https://fontgenerators.app/#organization' || organization.name !== 'FontGenerators.app' || organization.alternateName !== 'FontGenerators' || organization.url !== 'https://fontgenerators.app/') throw new Error(`${name} must define the stable Organization identity`);
  if (website['@id'] !== 'https://fontgenerators.app/#website' || website.name !== 'FontGenerators.app' || website.alternateName !== 'FontGenerators' || website.url !== 'https://fontgenerators.app/' || website.publisher?.['@id'] !== 'https://fontgenerators.app/#organization') throw new Error(`${name} must define the stable WebSite identity`);
}
for (const [name, html] of [['brat generator', brat], ['brat font', bratFont], ['brat green', bratGreen]]) {
  const page = getJsonLdNodes(name, html).find(node => hasSchemaType([node], 'WebPage'));
  if (page?.author?.['@id'] !== 'https://fontgenerators.app/#organization' || page?.publisher?.['@id'] !== 'https://fontgenerators.app/#organization' || page?.isPartOf?.['@id'] !== 'https://fontgenerators.app/#website') throw new Error(`${name} must reference the shared site and publisher entities`);
}
const visibleAboutReviewed = getLabeledTime('about', about, '\\blast reviewed\\b');
assertIsoDate('about visible reviewed date', visibleAboutReviewed);
if (aboutPageSchema.dateModified !== visibleAboutReviewed) throw new Error('about dateModified must match its visible last reviewed date');
for (const field of ['datePublished', 'dateModified']) assertIsoDate(`about AboutPage ${field}`, aboutPageSchema[field]);
if (aboutPageSchema.datePublished > aboutPageSchema.dateModified) throw new Error('about datePublished must not be after dateModified');
bratStructuredDates.set(aboutCanonical, aboutPageSchema.dateModified);
const bratFontNodes = getJsonLdNodes('brat font', bratFont);
const bratFontPageSchema = getSingleSchemaNode('brat font', bratFontNodes, 'WebPage');
const bratFontArticleSchema = getSingleSchemaNode('brat font', bratFontNodes, 'Article');
const visibleBratFontReviewed = getLabeledTime('brat font', bratFont, '\\blast reviewed\\b');
assertIsoDate('brat font visible reviewed date', visibleBratFontReviewed);
if (bratFontPageSchema.dateModified !== visibleBratFontReviewed || bratFontArticleSchema.dateModified !== visibleBratFontReviewed) throw new Error('brat font WebPage and Article dateModified must match the visible last reviewed date');

const bratFeatureList = JSON.stringify(bratApplicationSchema?.featureList || '');
for (const s of ['color', 'blur', 'pixelated', 'lowercase', 'alignment', 'size', 'PNG', 'JPEG', 'WebP', 'copy image']) {
  if (!bratFeatureList.toLowerCase().includes(s.toLowerCase())) throw new Error(`brat WebApplication featureList missing a current real feature: ${s}`);
}
for (const forbidden of ['Mirror', 'Flip Vertical', 'Noise', 'video generator']) {
  if (bratFeatureList.toLowerCase().includes(forbidden.toLowerCase())) throw new Error(`brat WebApplication featureList must not claim unsupported feature: ${forbidden}`);
}
for (const id of ['brat-text', 'brat-canvas', 'brat-background-presets', 'brat-background-color', 'brat-text-color', 'brat-alignment', 'brat-aspect', 'brat-square-size', 'brat-square-size-value', 'brat-text-size', 'brat-text-size-value', 'brat-blur', 'brat-blur-value', 'brat-lowercase', 'brat-pixelated', 'brat-format', 'brat-download', 'brat-copy', 'brat-reset', 'brat-status']) {
  if (!sourceBrat.includes(`id="${id}"`)) throw new Error(`brat page missing renderer DOM contract #${id}`);
}
if ((sourceBrat.match(/class="tool-field brat-color-field"/g) || []).length !== 2 || (sourceBrat.match(/Choose color/g) || []).length !== 2) {
  throw new Error('brat custom background and text color controls must expose full-row native color-picker affordances');
}
if (!bratJs.includes("querySelector('.brat-color-value')")) throw new Error('brat color controls must keep their visible hex values synchronized');
for (const control of ['data-brat-bg="#8ACE00"', 'data-brat-bg="#FFFFFF"', 'data-brat-bg="#111111"', 'data-brat-bg="#FB0080"', 'data-brat-bg="transparent"', 'data-brat-align="center"', 'data-brat-align="right"', 'data-brat-align="justify"', 'data-brat-aspect="1:1"', 'data-brat-aspect="9:16"', 'data-brat-aspect="16:9"', 'data-brat-format="png"', 'data-brat-format="jpeg"', 'data-brat-format="webp"']) {
  if (!sourceBrat.includes(control)) throw new Error(`brat page missing control contract ${control}`);
}
if (!sourceBrat.includes('/src/brat-generator.js') || !sourceBrat.includes('data-clarity-mask="true"')) throw new Error('brat page must load its renderer and mask user content surfaces');
for (const className of ['brat-size-card--square', 'brat-size-card--story', 'brat-size-card--wide']) {
  if (!sourceBrat.includes(className) || !styles.includes(`.${className}`)) throw new Error(`brat size examples must use semantic styling hook ${className}`);
}
if (!sourceBratGreen.includes('brat-green-faq') || !styles.includes('.brat-green-faq')) throw new Error('brat green FAQ must use a stable semantic styling hook');
if (!bratJs.includes('if (el.sizeBadge.textContent !== sizeLabel)') || !bratJs.includes("el.canvas.setAttribute('aria-label'") || !bratJs.includes('previewText')) throw new Error('brat canvas must expose useful preview context without repeatedly announcing an unchanged size');
if (wordTokens(brat).length < 800) throw new Error(`brat page should provide substantial intent-focused guidance; found ${wordTokens(brat).length} visible words`);
if (wordTokens(bratFont).length < 650) throw new Error(`brat font page should provide a substantial sourced answer; found ${wordTokens(bratFont).length} visible words`);
if (wordTokens(bratGreen).length < 500) throw new Error(`brat green page should provide a substantial usable color guide; found ${wordTokens(bratGreen).length} visible words`);
for (const s of ['Arial', 'Arial Narrow', 'ROM', '#8ACE00', 'Last reviewed', 'https://abcdinamo.com/newsletter/the-dinamo-update-our-font-for-charli-xcxs-brat', 'https://learn.microsoft.com/en-us/typography/font-list/arial-narrow', 'Canva', 'CapCut', 'copy and paste']) {
  if (!sourceBratFont.includes(s)) throw new Error(`brat font page missing sourced answer boundary: ${s}`);
}
for (const s of ['#8ACE00', 'rgb(138, 206, 0)', 'hsl(80, 100%, 40.4%)', '33, 0, 100, 19', '--brat-green: #8ACE00;', '10.91:1', '1.92:1', 'Canva', 'Figma', 'CSS', 'PowerPoint', 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum']) {
  if (!sourceBratGreen.includes(s)) throw new Error(`brat green page missing color utility/source contract: ${s}`);
}
if (!sourceBratGreen.includes('aria-live="polite"') || !sourceBratGreen.includes('/src/brat-green.js')) throw new Error('brat green copy tool must expose polite aria-live feedback and load its interaction module');
if (!bratGreenJs.includes('copyText') || !bratGreenJs.includes("addEventListener('click'")) throw new Error('brat green interaction must use the shared clipboard fallback and click handlers');
if (!sourceHome.includes('href="/brat-generator"') || !sourceHome.includes('Open Brat Generator')) throw new Error('homepage More text tools section must link prominently to Brat Generator');
for (const s of ['data-category="Favorites"', 'data-category="Bold"', 'data-category="Cursive"', 'data-category="Fancy"', 'data-category="Italic"', 'data-category="Stylish"', 'data-category="Cool"', 'data-category="Strikethrough"', 'data-category="Underline"', 'data-category="Cursed"', 'data-category="Big"']) if (!home.includes(s)) throw new Error(`home missing filter ${s}`);
for (const s of ['data-category="Discord"', 'data-category="WhatsApp"', 'data-category="Twitter"']) if (sourceHome.includes(s)) throw new Error(`home should not expose platform tags as category filters: ${s}`);
const toolPages = [
  ['ascii', ascii, sourceAscii, asciiJs, ['ASCII Art Generator', 'Browse styles', 'Popular ASCII art results', 'Banner3-D', 'Bubble', 'Digital', 'Download Image', '.txt', 'Markdown', 'WeChat', 'Image to ASCII', 'ascii-art.js']],
  ['mixer', mixer, sourceMixer, mixerJs, ['Font Mixer', 'Mix preset', 'Shuffle', 'font-mixer.js']],
  ['username', username, sourceUsername, usernameJs, ['Username Generator', 'Platform', 'Style vibe', 'username-generator.js']],
  ['changer', changer, sourceChanger, changerJs, ['Auto Font Changer', 'Scenario', 'Change intensity', 'auto-font-changer.js']]
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
if (!asciiJs.includes("card?.classList.add('copied')") || !asciiJs.includes("icon.dataset.icon = 'check'")) throw new Error('ASCII card copy should use homepage-like copied state');
for (const s of ['copyText', 'createToast', 'downloadText', 'selectElementText']) if (!uiJs.includes(`export ${s === 'copyText' || s === 'downloadText' ? 'async ' : ''}function ${s}`) && !uiJs.includes(`export function ${s}`)) throw new Error(`shared UI helper missing ${s}`);
for (const s of ['.tool-page', '.tool-panel', '.tool-form-grid', '.tool-output', '.tool-result-card:hover', '.tool-result-card.copied', '.ascii-results-section', '.ascii-results-grid', '.ascii-card-output', '.ascii-compact-grid', '.ascii-option-grid', '.toast-line[data-toast-visible="true"]']) if (!styles.includes(s)) throw new Error(`shared CSS missing ${s}`);
for (const s of ['overflow-x: auto;', 'scrollbar-gutter: stable;', '.ascii-card-actions .button', 'min-width: 0;']) {
  if (!styles.includes(s)) throw new Error(`ASCII overflow guard CSS missing ${s}`);
}

for (const [name, html] of [['about', about], ['privacy', privacy], ['cookies', cookies], ['terms', terms]]) {
  if (!html.includes('class="legal-page paper-grid"') || !html.includes('class="legal-card"')) throw new Error(`${name} missing centered legal layout`);
  if (!html.includes('href="/terms-of-service"')) throw new Error(`${name} missing terms-of-service links`);
  if (!html.includes('href="/cookies"')) throw new Error(`${name} missing cookie policy link`);
}
if (!cookies.includes('<meta name="robots" content="noindex"')) throw new Error('cookies page should remain noindex');

for (const [name, html] of [['home', home], ['ascii', ascii], ['mixer', mixer], ['username', username], ['changer', changer], ['brat', brat], ['brat font', bratFont], ['brat green', bratGreen], ['tool', tool], ['about', about], ['privacy', privacy], ['cookies', cookies], ['terms', terms]]) {
  if (html.includes('href="/terms/"')) throw new Error('stale /terms/ link present');
  if (html.includes('href="/discord-colored-text-generator/"')) throw new Error('stale discord route slash link present');
  if (html.includes('href="/brat-generator/"')) throw new Error('stale brat route slash link present');
  if (!html.includes('href="/brat-generator"')) throw new Error('page missing clean Brat Generator primary navigation link');
  const footerAnchors = getAnchors(getElementHtml(name, html, 'footer'));
  if (!footerAnchors.some(anchor => anchor.href === '/about' && anchor.label === 'About') || !footerAnchors.some(anchor => anchor.href === '/about#contact' && anchor.label === 'Contact')) throw new Error(`${name} footer must expose visible About and Contact links`);
  if (html.includes('mailto:') || html.includes('/cdn-cgi/l/email-protection')) throw new Error('page should not expose Cloudflare-obfuscated email links');
  if (html.includes('contact@fontgenerators.app')) throw new Error('page should not expose a contiguous email address');
  if (html.includes('alt=""')) throw new Error('page should not contain empty image alt attributes');
  if (!html.includes('rel="icon" href="/favicon.png"')) throw new Error('page missing png favicon link');
  if (!html.includes('class="brand-mark" src="/logo.png"')) throw new Error('page missing logo brand mark');
  if (!html.includes('alt="FontGenerators.app logo"')) throw new Error('page missing logo alt text');
  if (!html.includes('class="nav-toggle"') || !html.includes('id="primary-navigation"')) throw new Error('page missing mobile navigation toggle');
  if (html.includes('/> FontGenerators.app</a>')) throw new Error('visible brand label should omit .app');
  if (!html.includes('/> FontGenerators</a>')) throw new Error('visible brand label missing');
  if (html.includes('<span>Fg_</span>')) throw new Error('page should not use old text-only brand mark');
}
for (const [name, html] of [['home', home], ['ascii', ascii], ['mixer', mixer], ['username', username], ['changer', changer], ['brat', brat], ['brat font', bratFont], ['brat green', bratGreen], ['tool', tool], ['about', about], ['privacy', privacy], ['cookies', cookies], ['terms', terms]]) {
  for (const s of ['property="og:type"', 'property="og:url"', 'property="og:image"', 'property="og:image:alt"', 'name="twitter:card"', 'name="twitter:title"', 'name="twitter:description"', 'name="twitter:image"']) {
    if (!html.includes(s)) throw new Error(`${name} missing complete social metadata: ${s}`);
  }
}
for (const [name, html] of [['home', sourceHome], ['ascii', sourceAscii], ['mixer', sourceMixer], ['username', sourceUsername], ['changer', sourceChanger], ['brat', sourceBrat], ['brat font', sourceBratFont], ['brat green', sourceBratGreen], ['tool', sourceTool], ['about', sourceAbout], ['privacy', sourcePrivacy], ['cookies', sourceCookies], ['terms', sourceTerms]]) {
  if (!html.includes('/src/analytics.js')) throw new Error(`${name} missing analytics module`);
  if (!html.includes('data-cookie-settings')) throw new Error(`${name} missing cookie settings control`);
}
if (sourceHome.includes('Free Browser-Based Font Generator') || sourceHome.includes('answer-block')) throw new Error('home should not include the removed hero eyebrow or AEO answer block');
if (sourceHome.includes('class="chips"') || homeJs.includes('style-new') || homeJs.includes('FONTB')) throw new Error('home should not include removed hero chips or temporary FontB badges');
if (!sourceHome.includes('value="Make your profile text stand out"') || sourceHome.includes('value="Alex Plays"') || sourceHome.includes('value="font generator"')) throw new Error('homepage default text should use the current product-facing sample copy');
if (!sourceHome.includes('Unicode styles in real time, <br />then copy')) throw new Error('home lede should use the requested two-line break with mobile-safe spacing');
if (!sourceHome.includes('How do I copy and paste fonts from this generator?') || !sourceHome.includes('Is fancy text accessible?')) throw new Error('home missing visible AEO FAQ additions');
if (!sourceHome.includes('data-clarity-mask="true"') || !homeJs.includes('data-clarity-mask="true"')) throw new Error('homepage generator surfaces must be masked for Clarity');
if (!homeJs.includes('fontgenerators.favoriteStyles.v1') || !homeJs.includes('localStorage') || !homeJs.includes("activeCategory === 'Favorites'")) throw new Error('homepage favorites should persist locally and expose a Favorites filter');
if (!uiJs.includes('function fallbackCopyText') || !uiJs.includes("document.execCommand('copy')") || !uiJs.includes('async function copyText') || !homeJs.includes("addEventListener('pointerdown'")) throw new Error('homepage copy should fall back when Clipboard API is blocked');
if (!sourceHome.includes('class="filter-icon"') || !sourceHome.includes('class="card-icon"') || !sourceHome.includes('<svg viewBox="0 0 24 24"')) throw new Error('homepage icons should render inline svg controls');
if (sourceHome.includes('Material+Symbols+Outlined') || sourceHome.includes('card-icon material-symbols-outlined') || sourceHome.includes('data-icon="format_size"') || styles.includes('.bento article:before')) throw new Error('homepage icons should not depend on Material Symbols ligature text');
if (!styles.includes('.brand-mark') || !styles.includes('.brand.mini .brand-mark')) throw new Error('brand logo CSS missing');
if (!styles.includes('backdrop-filter: blur(28px) saturate(180%) contrast(112%)') || !styles.includes('-webkit-backdrop-filter: blur(28px) saturate(180%) contrast(112%)')) throw new Error('topbar glass effect CSS missing');
if (!styles.includes('.topbar::before') || !styles.includes('feTurbulence') || !styles.includes('mix-blend-mode: multiply')) throw new Error('topbar frosted texture layer missing');
if (!styles.includes('.nav-toggle') || !styles.includes('.topbar[data-nav-open="true"] nav') || !analyticsJs.includes('bindMobileNavigation') || !analyticsJs.includes('header.dataset.navOpen')) throw new Error('mobile topbar navigation should use a hamburger toggle menu');
if (!homeJs.includes('svgIcon') || homeJs.includes('material-symbols-outlined') || homeJs.includes('data-icon="content_copy"')) throw new Error('homepage copy/favorite controls should use inline svg icons, not visible ligature text');
if (!styles.includes('.inline-icon svg') || !styles.includes('.inline-icon svg.is-filled') || styles.includes('[data-category="Favorites"]::before')) throw new Error('homepage favorite/copy icons should use svg styling without text pseudo-elements');
if (!styles.includes('.rainbow-control') || !styles.includes('linear-gradient(90deg, #f87171, #facc15, #34d399, #22d3ee, #60a5fa, #f472b6)')) throw new Error('discord rainbow preset styling missing');
if (!styles.includes('.palette-group .color-chip') || !styles.includes('width: 26px;') || !styles.includes('height: 26px;')) throw new Error('mobile Discord color chips should stay compact');
if (!styles.includes('.preview-grid') || !styles.includes('grid-template-columns: 1fr;')) throw new Error('discord preview/output should stack into two rows');
if (!styles.includes('.palette-group') || !styles.includes('.palette-label')) throw new Error('discord color palette clarity CSS missing');
if (!styles.includes('#copy-status[data-toast-visible="true"]') || !styles.includes('.toast-line[data-toast-visible="true"]') || !uiJs.includes("status.dataset.toastVisible = 'true'") || !uiJs.includes("setProperty('opacity', '1', 'important')") || !uiJs.includes("setProperty('visibility', 'visible', 'important')")) throw new Error('copy/favorite status should use a floating toast state');
const statusLineRule = styles.match(/\.status-line\s*\{([\s\S]*?)\}/)?.[1] || '';
if (!statusLineRule.includes('visibility: visible;') || statusLineRule.includes('visibility: hidden;') || !statusLineRule.includes('opacity: 0;')) throw new Error('status live region must remain exposed to assistive technology while visually idle');
if (!styles.includes('body:has([data-cookie-banner]) .status-line') || !styles.includes('bottom: 140px;')) throw new Error('status toast must clear the cookie banner');
if (!styles.includes(':where(a, button, summary, [tabindex]):focus-visible') || !styles.includes('outline: 3px solid #0b5d35;')) throw new Error('interactive controls must expose a high-contrast keyboard focus ring');
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
const llmsCanonicalSection = getMarkdownSection(llms, 'Canonical pages');
const llmsLegalSection = getMarkdownSection(llms, 'Legal and policy pages');
const llmsBratSourcesSection = getMarkdownSection(llms, 'Brat topic sources');
const llmsUsageSection = getMarkdownSection(llms, 'Usage notes for AI assistants and crawlers');
const llmsCanonicalLinks = assertMarkdownLinkSection('Canonical pages', llmsCanonicalSection, [
  { label: 'Font Generator', url: 'https://fontgenerators.app/' },
  { label: 'ASCII Art Generator', url: 'https://fontgenerators.app/ascii-art-generator' },
  { label: 'Font Mixer', url: 'https://fontgenerators.app/font-mixer' },
  { label: 'Username Generator', url: 'https://fontgenerators.app/username-generator' },
  { label: 'Auto Font Changer', url: 'https://fontgenerators.app/auto-font-changer' },
  { label: 'Brat Generator', url: 'https://fontgenerators.app/brat-generator' },
  { label: 'What Is the Brat Font?', url: 'https://fontgenerators.app/brat-font' },
  { label: 'Brat Green Color Code', url: 'https://fontgenerators.app/brat-green' },
  { label: 'Discord Colored Text Generator', url: 'https://fontgenerators.app/discord-colored-text-generator' }
]);
const llmsLegalLinks = assertMarkdownLinkSection('Legal and policy pages', llmsLegalSection, [
  { label: 'About and Contact', url: 'https://fontgenerators.app/about' },
  { label: 'Privacy Policy', url: 'https://fontgenerators.app/privacy' },
  { label: 'Cookie Policy', url: 'https://fontgenerators.app/cookies' },
  { label: 'Terms of Service', url: 'https://fontgenerators.app/terms-of-service' }
]);
assertMarkdownLinkSection('Brat topic sources', llmsBratSourcesSection, [
  { label: "Dinamo — The Dinamo Update: Our Font for Charli XCX's Brat", url: bratCitations[0] },
  { label: 'Microsoft Typography — Arial Narrow', url: bratCitations[1] },
  { label: 'W3C WAI — Understanding Success Criterion 1.4.3', url: bratCitations[2] }
]);
for (const phrase of ['generated Brat images', 'independent fan-style utility', 'not downloadable TTF/OTF font files', '#8ACE00', 'mathematical conversions', 'Do not describe planned']) {
  if (!llmsUsageSection.includes(phrase) && !llms.includes(phrase)) throw new Error(`llms.txt missing AI/crawler guidance: ${phrase}`);
}
const heldLlmsPaths = ['/brat-font-generator', '/brat-text-generator', '/brat-color', '/brat-color-code', '/brat-video-generator', '/brat-lyric-generator', '/discord-font-generator', '/fancy-text-generator', '/discord-text-generator', '/pricing', '/refund'];
for (const path of heldLlmsPaths) {
  if (!llmsUsageSection.includes(`\`${path}\``)) throw new Error(`llms.txt Usage notes must identify held route ${path}`);
  for (const [sectionName, section] of [['Canonical pages', llmsCanonicalSection], ['Legal and policy pages', llmsLegalSection], ['Brat topic sources', llmsBratSourcesSection]]) {
    if (section.includes(path)) throw new Error(`llms.txt must not list held route ${path} in ${sectionName}`);
  }
}

if (tool.includes('https://fontgenerators.app/discord-colored-text-generator/')) throw new Error('stale discord canonical slash present');
if (!tool.includes('<h1 id="tool-label">Discord Colored Text Generator</h1>')) throw new Error('discord page H1 must use search-facing primary phrase');
if (tool.includes('Discord ANSI Generator - Light Lab')) throw new Error('discord page should not expose internal Light Lab H1 wording');
if (!sourceTool.includes('Text color') || !sourceTool.includes('Highlight')) throw new Error('discord page missing user-friendly color labels');
if (sourceTool.includes('Selection formatting') || sourceTool.includes('active-sequence') || sourceTool.includes('>Active style<') || sourceTool.includes('>Plain text<') || sourceTool.includes('Palette (Fg / Bg)') || sourceTool.includes('Current ANSI codes')) throw new Error('discord page should not expose low-value badge/status labels or raw ANSI labels in the main controls');
if (!sourceTool.includes('Make this server update stand out tonight.') || sourceTool.includes('Movie night starts') || sourceTool.includes('Bring snacks')) throw new Error('discord editor should use the current concise sample copy');
if (!styles.includes('grid-template-columns: minmax(340px, max-content) minmax(420px, 1fr);') || !styles.includes('flex-wrap: nowrap;')) throw new Error('discord desktop palette should keep color chips on one row');
if (!styles.match(/\.preview-box \{[\s\S]*?white-space: pre-wrap;/)) throw new Error('discord preview should preserve repeated spaces and line breaks');
if (toolJs.includes('renderActiveSequence') || toolJs.includes('active-sequence')) throw new Error('discord script should not maintain the removed active style summary');
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
const homeDefaultValue = sourceHome.match(/<input\b(?=[^>]*id="font-input")[^>]*\svalue="([^"]*)"/i)?.[1] || 'Your Text';
const renderedHomeText = `${stripHtml(home)} ${canonicalStyles.map(style => `${style.name} ${style.category} ${style.aliasNames.length ? `${style.aliasNames.length} aliases` : ''} ${style.transform(homeDefaultValue)}`).join(' ')}`;
const renderedHomeTokens = wordTokens(renderedHomeText);
const renderedHomeFontGeneratorDensity = (countPhrase(renderedHomeTokens, 'font generator') / renderedHomeTokens.length) * 100;
if (renderedHomeFontGeneratorDensity < 3) throw new Error(`rendered home "font generator" density must be >=3%; found ${renderedHomeFontGeneratorDensity.toFixed(2)}%`);
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
const approvedSitemapLocs = ['https://fontgenerators.app/', 'https://fontgenerators.app/ascii-art-generator', 'https://fontgenerators.app/font-mixer', 'https://fontgenerators.app/username-generator', 'https://fontgenerators.app/auto-font-changer', 'https://fontgenerators.app/brat-generator', 'https://fontgenerators.app/brat-font', 'https://fontgenerators.app/brat-green', 'https://fontgenerators.app/about', 'https://fontgenerators.app/discord-colored-text-generator', 'https://fontgenerators.app/privacy', 'https://fontgenerators.app/terms-of-service'];
assertExactStringSet('sitemap canonical URLs', sitemapLocs, approvedSitemapLocs);
const llmsIndexableUrls = [...llmsCanonicalLinks, ...llmsLegalLinks].map(link => link.url).filter(url => url !== 'https://fontgenerators.app/cookies');
assertExactStringSet('indexable llms.txt page URLs', llmsIndexableUrls, sitemapLocs);
if (rootSitemap !== publicSitemap || sitemap !== publicSitemap) throw new Error('root, public, and built sitemap.xml files must stay synchronized');
const sitemapLastmods = new Map([...sitemap.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)].map(match => [match[1], match[2]]));
const approvedSitemapLastmods = new Map(approvedSitemapLocs.map(loc => [
  loc,
  bratStructuredDates.has(loc)
    ? bratStructuredDates.get(loc)
    : loc === 'https://fontgenerators.app/privacy' || loc === 'https://fontgenerators.app/terms-of-service'
      ? '2026-07-27'
      : loc === 'https://fontgenerators.app/font-mixer'
        ? '2026-07-04'
        : '2026-06-29'
]));
for (const [loc, expectedLastmod] of approvedSitemapLastmods) {
  const actualLastmod = sitemapLastmods.get(loc);
  if (actualLastmod !== expectedLastmod) throw new Error(`sitemap lastmod for ${loc} must be ${expectedLastmod}; found ${actualLastmod || 'missing'}`);
}
for (const forbidden of ['/pricing', '/refund', '/cookies', '/auto-font-styler', '/brat-font-generator', '/brat-text-generator', '/brat-color', '/brat-color-code', '/brat-video-generator', '/brat-lyric-generator', '/discord-font-generator', '/fancy-text-generator', '/discord-text-generator']) {
  if (sitemap.includes(`https://fontgenerators.app${forbidden}`) && forbidden !== '/discord-colored-text-generator') throw new Error(`sitemap should not include non-indexable route ${forbidden}`);
}
if (redirects.includes('www.fontgenerators.app')) throw new Error('Cloudflare Pages _redirects cannot reliably enforce host-level www-to-apex redirects; Pages middleware handles host canonicalization instead');
const redirectLines = redirects.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
assertExactStringSet('Cloudflare _redirects rules', redirectLines, [
  '/ascii-art-generator/ /ascii-art-generator 301',
  '/font-mixer/ /font-mixer 301',
  '/username-generator/ /username-generator 301',
  '/auto-font-changer/ /auto-font-changer 301',
  '/brat-generator/ /brat-generator 301',
  '/brat-font/ /brat-font 301',
  '/brat-green/ /brat-green 301',
  '/about/ /about 301',
  '/auto-font-styler /auto-font-changer 301',
  '/auto-font-styler/ /auto-font-changer 301',
  '/discord-colored-text-generator/ /discord-colored-text-generator 301',
  '/privacy/ /privacy 301',
  '/cookies/ /cookies 301',
  '/terms /terms-of-service 301',
  '/terms/ /terms-of-service 301',
  '/terms-of-service/ /terms-of-service 301'
]);
for (const s of ["bratGenerator: resolve(__dirname, 'brat-generator.html')", "bratFont: resolve(__dirname, 'brat-font.html')", "bratGreen: resolve(__dirname, 'brat-green.html')", "about: resolve(__dirname, 'about.html')"]) {
  if (!viteConfig.includes(s)) throw new Error(`Vite MPA config missing page entry: ${s}`);
}
for (const s of ['www.fontgenerators.app', 'fontgenerators.app', 'Response.redirect', '/ascii-art-generator', '/font-mixer', '/username-generator', '/auto-font-changer', '/brat-generator', '/brat-font', '/brat-green', '/about', '/auto-font-styler', '/discord-colored-text-generator/', '/cookies/', '/terms-of-service/', 'GOOGLE_SITE_VERIFICATION', 'AHREFS_ANALYTICS_KEY']) {
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
for (const path of ['/ascii-art-generator', '/font-mixer', '/username-generator', '/auto-font-changer', '/brat-generator', '/brat-font', '/brat-green', '/about']) {
  const response = await middlewareSmoke(`https://fontgenerators.app${path}`);
  if (response.status !== 200 || await response.text() !== 'next ok') throw new Error(`middleware should pass approved clean route through: ${path}`);
  const slash = await middlewareSmoke(`https://fontgenerators.app${path}/`);
  if (slash.status !== 301 || slash.headers.get('location') !== `https://fontgenerators.app${path}`) throw new Error(`middleware should redirect slash route to clean route: ${path}`);
}
const legacyAutoStylerRedirect = await middlewareSmoke('https://fontgenerators.app/auto-font-styler?from=old');
if (legacyAutoStylerRedirect.status !== 301 || legacyAutoStylerRedirect.headers.get('location') !== 'https://fontgenerators.app/auto-font-changer?from=old') throw new Error('middleware should redirect legacy auto-font-styler route to auto-font-changer and preserve query');
const legacyAutoStylerSlashRedirect = await middlewareSmoke('https://fontgenerators.app/auto-font-styler/');
if (legacyAutoStylerSlashRedirect.status !== 301 || legacyAutoStylerSlashRedirect.headers.get('location') !== 'https://fontgenerators.app/auto-font-changer') throw new Error('middleware should redirect legacy auto-font-styler slash route to auto-font-changer');
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
const heldPaths = ['/pricing', '/pricing/', '/refund', '/refund/', '/brat-font-generator', '/brat-font-generator/', '/brat-text-generator', '/brat-color', '/brat-color-code', '/brat-video-generator', '/brat-lyric-generator', '/discord-font-generator', '/discord-font-generator/', '/fancy-text-generator', '/fancy-text-generator/', '/discord-text-generator', '/not-a-real-mvp-route'];
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
console.log(`smoke ok: pages, SEO/schema/legal/cookie/analytics routes present; homepage has ${canonicalStyles.length} unique styles from ${styleIds.length} raw definitions; ASCII/Mixer/Username/Auto Changer, the three-page Brat cluster, and About trust page are live; held routes return 404 noindex`);
