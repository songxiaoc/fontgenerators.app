import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fontPages } from '../src/font-page-config.js';
import { effectPageDetailsA } from '../src/font-page-details-effects-a.js';
import { effectPageDetailsB } from '../src/font-page-details-effects-b.js';
import { platformPageDetails } from '../src/font-page-details-platforms.js';
import { resolveStyle, transformZalgoText } from '../src/font-styles.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const origin = 'https://fontgenerator.best';
const publishedOn = '2026-09-24';
const checkOnly = process.argv.includes('--check');
let changed = 0;

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const escapeXml = escapeHtml;
const safeJson = value => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('&', '\\u0026');
const list = values => values.map(value => `<li>${escapeHtml(value)}</li>`).join('');
const read = path => readFileSync(resolve(root, path), 'utf8');
function write(path, content) {
  const target = resolve(root, path);
  let previous = '';
  try { previous = readFileSync(target, 'utf8'); } catch { /* New generated page. */ }
  if (previous === content) return;
  changed++;
  if (checkOnly) throw new Error(`${path} is out of date; run npm run build`);
  writeFileSync(target, content, 'utf8');
}
function replaceBetween(path, start, end, generated) {
  const current = read(path);
  const startAt = current.indexOf(start);
  const endAt = current.indexOf(end, startAt + start.length);
  if (startAt < 0 || endAt < 0) throw new Error(`Missing generated section markers in ${path}`);
  write(path, `${current.slice(0, startAt + start.length)}\n${generated}\n${current.slice(endAt)}`);
}
function selectedStyles(page) {
  const seen = new Set();
  return page.styleIds.map(id => {
    const style = resolveStyle(id);
    if (!style) throw new Error(`Unknown style ${id} on ${page.slug}`);
    return style;
  }).filter(style => {
    if (seen.has(style.id)) return false;
    seen.add(style.id);
    return true;
  });
}
const copySvg = '<svg viewBox="0 0 24 24" focusable="false"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 4H6a2 2 0 0 0-2 2v10"></path></svg>';
const starSvg = '<svg viewBox="0 0 24 24" focusable="false"><path d="m12 3.6 2.55 5.17 5.7.83-4.12 4.01.97 5.67L12 16.6l-5.1 2.68.97-5.67L3.75 9.6l5.7-.83L12 3.6Z"></path></svg>';
const pageDetails = { ...effectPageDetailsA, ...effectPageDetailsB, ...platformPageDetails };
function renderDetailSections(page) {
  const sections = pageDetails[page.slug]?.sections;
  if (!Array.isArray(sections) || sections.length < 4) throw new Error(`Missing detail sections for ${page.slug}`);
  return sections.map(section => {
    if (!section.heading || !Array.isArray(section.paragraphs) || !section.paragraphs.length) {
      throw new Error(`Incomplete detail section on ${page.slug}`);
    }
    const paragraphs = section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
    const bullets = section.bullets?.length ? `<ul>${list(section.bullets)}</ul>` : '';
    return `<section class="content-band seo-content font-detail-section"><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${bullets}</section>`;
  }).join('\n    ');
}
const styleOutput = (page, style) => page.slug === 'zalgo-text-generator'
  ? transformZalgoText(page.sample, 3)
  : style.transform(page.sample);
function staticRows(page, styles) {
  return styles.slice(0, 5).map(style => `<article class="style-row" data-style-id="${escapeHtml(style.id)}">
          <div class="style-row-head"><span class="style-encoding">${escapeHtml(style.name.toUpperCase())}</span></div>
          <div class="style-actions">
            <button type="button" class="icon-action-btn" data-favorite="${escapeHtml(style.id)}" aria-pressed="false" aria-label="Save ${escapeHtml(style.name)} favorite"><span class="inline-icon" aria-hidden="true">${starSvg}</span></button>
            <button type="button" class="icon-copy" data-copy="${escapeHtml(style.id)}" aria-label="Copy ${escapeHtml(style.name)} style"><span class="inline-icon" aria-hidden="true">${copySvg}</span></button>
          </div>
          <div class="style-output clarity-mask" data-clarity-mask="true" data-output tabindex="0" aria-label="${escapeHtml(style.name)} generated style preview">${escapeHtml(styleOutput(page, style))}</div>
        </article>`).join('\n        ');
}
function relatedPages(page) {
  const siblings = fontPages.filter(candidate => candidate.kind === page.kind);
  const currentIndex = siblings.findIndex(candidate => candidate.slug === page.slug);
  return Array.from({ length: Math.min(4, siblings.length - 1) }, (_, offset) => siblings[(currentIndex + offset + 1) % siblings.length]);
}
function renderPage(page) {
  const canonical = `${origin}/${page.slug}`;
  const styles = selectedStyles(page);
  if (!styles.length) throw new Error(`No styles on ${page.slug}`);
  const breadcrumb = {
    '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: page.name, item: canonical }
    ]
  };
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, inLanguage: 'en', datePublished: publishedOn, dateModified: publishedOn, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#app` }, isPartOf: { '@id': `${origin}/#website` } },
      { '@type': 'WebApplication', '@id': `${canonical}#app`, name: page.name, url: canonical, description: page.description, applicationCategory: 'UtilityApplication', operatingSystem: 'Web', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      breadcrumb
    ]
  };
  const firstStyle = styles[0];
  const platformPreview = page.kind === 'platform' ? `<div class="font-platform-preview" aria-label="${escapeHtml(page.previewLabel)}"><span class="label-caps">${escapeHtml(page.previewLabel)}</span><p id="platform-preview" class="style-output clarity-mask" data-clarity-mask="true">${escapeHtml(firstStyle.transform(page.sample))}</p><p class="helper">${escapeHtml(page.previewHint)}</p></div>` : '';
  const intensity = page.slug === 'zalgo-text-generator' ? `<div class="font-intensity-control"><label class="label-caps" for="zalgo-intensity">Zalgo intensity</label><input id="zalgo-intensity" type="range" min="1" max="8" value="3" aria-label="Zalgo intensity" /><p class="helper">Move the slider for a lighter or heavier effect.</p></div>` : '';
  const toolExtras = [intensity, platformPreview].filter(Boolean).map(item => `      ${item}\n`).join('');
  const faq = page.faq.map(({ question, answer }, index) => `<details${index === 0 ? ' open' : ''}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('\n    ');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#FDFBF7" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=optional" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Math&display=optional" rel="stylesheet" />
  <link rel="stylesheet" href="/src/styles.css" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <meta name="author" content="FontGenerator.best" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${escapeHtml(page.title)}" />
  <meta property="og:description" content="${escapeHtml(page.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="FontGenerator.best" />
  <meta property="og:image" content="${origin}/logo.png" />
  <meta property="og:image:alt" content="FontGenerator.best logo" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(page.title)}" />
  <meta name="twitter:description" content="${escapeHtml(page.description)}" />
  <meta name="twitter:image" content="${origin}/logo.png" />
  <script type="application/ld+json">${safeJson(schema)}</script>
</head>
<body class="font-topic-page" data-font-page-slug="${escapeHtml(page.slug)}">
  <header class="topbar"><a class="brand" href="/" aria-label="FontGenerator.best home"><img class="brand-mark" src="/logo.png" alt="FontGenerator.best logo" width="28" height="28" /> FontGenerator</a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation"><span></span><span></span><span></span></button><nav id="primary-navigation" aria-label="Primary navigation"><a href="/">Font Generator</a><a href="/#font-topics">Font Styles</a><a href="/gothic-font">Gothic</a><a href="/font-mixer">Font Mixer</a></nav></header>
  <main>
    <section class="utility-hero paper-grid"><div class="hero-center"><h1>${escapeHtml(page.name)}</h1><p class="lede">${escapeHtml(page.lead)}</p></div></section>
    <section id="generator" class="generator-shell" aria-labelledby="generator-title"><div class="generator-card">
      <div class="generator-controls"><div><label class="label-caps" for="font-input">Your text</label><input id="font-input" class="clarity-mask" data-clarity-mask="true" value="${escapeHtml(page.sample)}" autocomplete="off" spellcheck="false" /></div><div><label class="label-caps" for="style-search">Search these styles</label><input id="style-search" class="clarity-mask" data-clarity-mask="true" placeholder="Search by style name" autocomplete="off" /></div></div>
${toolExtras}      <div class="generator-meta"><h2 id="generator-title">${escapeHtml(page.resultsHeading ?? `Preview ${page.name} styles`)}</h2><span id="style-count">Showing ${Math.min(5, styles.length)} of ${styles.length} styles</span></div>
      <p class="trust-note">These results are characters you can copy, rather than fonts to install. Check how they look after you paste them.</p>
      <div id="style-results" class="style-grid clarity-mask" data-clarity-mask="true" aria-live="polite">${staticRows(page, styles)}</div>
      <p id="copy-status" class="status-line" aria-live="polite"></p>
    </div></section>
    <section class="content-band seo-content"><h2>${escapeHtml(page.introHeading)}</h2><p>${escapeHtml(page.intro)}</p><h3>${escapeHtml(page.useCasesHeading ?? 'Where to use it')}</h3><ul>${list(page.useCases)}</ul></section>
    <section class="content-band seo-content"><h2>${escapeHtml(page.howToHeading ?? `How to use ${page.name}`)}</h2><ol class="seo-steps">${list(page.howTo)}</ol><h3>${escapeHtml(page.notesHeading ?? 'Before you paste')}</h3><ul>${list(page.notes)}</ul></section>
    ${renderDetailSections(page)}
    <section class="content-band faq-section"><h2>${escapeHtml(page.faqHeading ?? `${page.name} questions`)}</h2>${faq}</section>
    <section class="content-band" data-related-tools><h2>${escapeHtml(page.relatedHeading ?? `More tools related to ${page.name}`)}</h2><ul>${relatedPages(page).map(related => `<li><a href="/${escapeHtml(related.slug)}">${escapeHtml(related.name)}</a></li>`).join('')}<li><a href="/gothic-font">Gothic Font Generator</a></li><li><a href="/">All copy and paste fonts</a></li></ul></section>
  </main>
  <footer class="site-footer"><div><a class="brand mini" href="/" aria-label="FontGenerator.best home"><img class="brand-mark" src="/logo.png" alt="FontGenerator.best logo" width="24" height="24" /> FontGenerator</a><p>FontGenerator is an independent text toolkit. Platform names describe possible places to paste text; no platform sponsors or endorses this tool.</p><p class="footer-contact">Contact: <span class="email-address" aria-label="contact at fontgenerator dot best">contact<span class="email-at" aria-hidden="true"></span>fontgenerator.best</span></p></div><nav aria-label="Site and legal links"><a href="/about">About</a><a href="/privacy">Privacy Policy</a><a href="/cookies">Cookie Policy</a><a href="/terms-of-service">Terms of Use</a><button type="button" class="footer-link-button" data-cookie-settings>Cookie Settings</button></nav></footer>
  <script type="module" src="/src/analytics.js"></script>
  <script type="module" src="/src/font-page.js"></script>
</body>
</html>
`;
}

if (fontPages.length !== 23 || new Set(fontPages.map(page => page.slug)).size !== 23) {
  throw new Error('Font page config must contain exactly 23 unique pages');
}
for (const page of fontPages) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug)) throw new Error(`Invalid page slug: ${page.slug}`);
  write(`${page.slug}.html`, renderPage(page));
}
const effectPages = fontPages.filter(page => page.kind !== 'platform');
const platformPages = fontPages.filter(page => page.kind === 'platform');
if (effectPages.length !== 17 || platformPages.length !== 6) throw new Error('Expected 17 effects and 6 platform pages');
const homepageSection = `<section id="font-topics" class="content-band"><h2>Browse Font Styles and Platforms</h2><p>Open a focused generator to compare styles for a specific look or place to paste.</p><h3>Text effects</h3><ul>${effectPages.map(page => `<li><a href="/${page.slug}">${escapeHtml(page.name)}</a></li>`).join('')}</ul><h3>Platform ideas</h3><ul>${platformPages.map(page => `<li><a href="/${page.slug}">${escapeHtml(page.name)}</a></li>`).join('')}</ul></section>`;
const homepageStart = '<!-- FONT TOPIC LINKS START -->';
const homepageEnd = '<!-- FONT TOPIC LINKS END -->';
const homepage = read('index.html');
if (!homepage.includes(homepageStart)) {
  const anchor = '<section class="content-band"><h2>Compatibility and Readability</h2>';
  if (!homepage.includes(anchor)) throw new Error('Homepage insertion anchor missing');
  write('index.html', homepage.replace(anchor, `${homepageStart}\n${homepageSection}\n${homepageEnd}\n${anchor}`));
} else {
  replaceBetween('index.html', homepageStart, homepageEnd, homepageSection);
}
replaceBetween('public/sitemap.xml', '<!-- FONT PAGE URLS START -->', '<!-- FONT PAGE URLS END -->', fontPages.map(page => `  <url><loc>${origin}/${page.slug}</loc><lastmod>${publishedOn}</lastmod></url>`).join('\n'));
replaceBetween('public/_redirects', '# FONT PAGE REDIRECTS START', '# FONT PAGE REDIRECTS END', fontPages.map(page => `/${page.slug}/ /${page.slug} 301`).join('\n'));
replaceBetween('public/llms.txt', '<!-- FONT PAGE LINKS START -->', '<!-- FONT PAGE LINKS END -->', [
  '## Focused font generators',
  ...effectPages.map(page => `- [${page.name}](${origin}/${page.slug}) - ${page.lead}`),
  '',
  '## Platform font tools',
  ...platformPages.map(page => `- [${page.name}](${origin}/${page.slug}) - ${page.lead}`)
].join('\n'));
write('functions/font-page-slugs.js', `// Generated from src/font-page-config.js by scripts/generate-font-pages.mjs.\nexport const fontPageSlugs = ${JSON.stringify(fontPages.map(page => page.slug), null, 2)};\n`);
write('sitemap.xml', read('public/sitemap.xml'));
write('robots.txt', read('public/robots.txt'));
console.log(`${checkOnly ? 'Checked' : 'Generated'} ${fontPages.length} font pages and supporting route metadata${changed ? ` (${changed} files changed)` : ''}.`);
