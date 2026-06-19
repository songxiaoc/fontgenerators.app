import figlet from 'figlet';
import { copyText, createToast, downloadText, escapeHtml, selectElementText } from './ui.js';

const fontLoaders = {
  '1Row': () => import('figlet/fonts/1Row'),
  '3-D': () => import('figlet/fonts/3-D'),
  '3D Diagonal': () => import('figlet/fonts/3D Diagonal'),
  '3D-ASCII': () => import('figlet/fonts/3D-ASCII'),
  '3x5': () => import('figlet/fonts/3x5'),
  '4Max': () => import('figlet/fonts/4Max'),
  '5 Line Oblique': () => import('figlet/fonts/5 Line Oblique'),
  'Acrobatic': () => import('figlet/fonts/Acrobatic'),
  'Alligator': () => import('figlet/fonts/Alligator'),
  'Alligator2': () => import('figlet/fonts/Alligator2'),
  'Alpha': () => import('figlet/fonts/Alpha'),
  'Alphabet': () => import('figlet/fonts/Alphabet'),
  'AMC 3 Line': () => import('figlet/fonts/AMC 3 Line'),
  'AMC 3 Liv1': () => import('figlet/fonts/AMC 3 Liv1'),
  'AMC AAA01': () => import('figlet/fonts/AMC AAA01'),
  'AMC Neko': () => import('figlet/fonts/AMC Neko'),
  'AMC Razor': () => import('figlet/fonts/AMC Razor'),
  'AMC Razor2': () => import('figlet/fonts/AMC Razor2'),
  'AMC Slash': () => import('figlet/fonts/AMC Slash'),
  'AMC Slider': () => import('figlet/fonts/AMC Slider'),
  'AMC Thin': () => import('figlet/fonts/AMC Thin'),
  'AMC Tubes': () => import('figlet/fonts/AMC Tubes'),
  'AMC Untitled': () => import('figlet/fonts/AMC Untitled'),
  'ANSI Compact': () => import('figlet/fonts/ANSI Compact'),
  'ANSI Regular': () => import('figlet/fonts/ANSI Regular'),
  'ANSI Shadow': () => import('figlet/fonts/ANSI Shadow'),
  'Arrows': () => import('figlet/fonts/Arrows'),
  'ASCII New Roman': () => import('figlet/fonts/ASCII New Roman'),
  'Avatar': () => import('figlet/fonts/Avatar'),
  'B1FF': () => import('figlet/fonts/B1FF'),
  'Banner': () => import('figlet/fonts/Banner'),
  'Banner3-D': () => import('figlet/fonts/Banner3-D'),
  'Banner3': () => import('figlet/fonts/Banner3'),
  'Banner4': () => import('figlet/fonts/Banner4'),
  'Barbwire': () => import('figlet/fonts/Barbwire'),
  'Basic': () => import('figlet/fonts/Basic'),
  'Bear': () => import('figlet/fonts/Bear'),
  'Bell': () => import('figlet/fonts/Bell'),
  'Benjamin': () => import('figlet/fonts/Benjamin'),
  'Big': () => import('figlet/fonts/Big'),
  'Big Chief': () => import('figlet/fonts/Big Chief'),
  'Big Money-ne': () => import('figlet/fonts/Big Money-ne'),
  'Big Money-nw': () => import('figlet/fonts/Big Money-nw'),
  'Big Money-se': () => import('figlet/fonts/Big Money-se'),
  'Big Money-sw': () => import('figlet/fonts/Big Money-sw'),
  'Bigfig': () => import('figlet/fonts/Bigfig'),
  'Binary': () => import('figlet/fonts/Binary'),
  'Block': () => import('figlet/fonts/Block'),
  'Blocks': () => import('figlet/fonts/Blocks'),
  'Bloody': () => import('figlet/fonts/Bloody'),
  'BlurVision ASCII': () => import('figlet/fonts/BlurVision ASCII'),
  'Bolger': () => import('figlet/fonts/Bolger'),
  'Braced': () => import('figlet/fonts/Braced'),
  'Bright': () => import('figlet/fonts/Bright'),
  'Broadway': () => import('figlet/fonts/Broadway'),
  'Broadway KB': () => import('figlet/fonts/Broadway KB'),
  'Bubble': () => import('figlet/fonts/Bubble'),
  'Bulbhead': () => import('figlet/fonts/Bulbhead'),
  'Caligraphy': () => import('figlet/fonts/Caligraphy'),
  'Caligraphy2': () => import('figlet/fonts/Caligraphy2'),
  'Calvin S': () => import('figlet/fonts/Calvin S'),
  'Cards': () => import('figlet/fonts/Cards'),
  'Catwalk': () => import('figlet/fonts/Catwalk'),
  'Chiseled': () => import('figlet/fonts/Chiseled'),
  'Chunky': () => import('figlet/fonts/Chunky'),
  'Circle': () => import('figlet/fonts/Circle'),
  'Classy': () => import('figlet/fonts/Classy'),
  'Coder Mini': () => import('figlet/fonts/Coder Mini'),
  'Coinstak': () => import('figlet/fonts/Coinstak'),
  'Cola': () => import('figlet/fonts/Cola'),
  'Colossal': () => import('figlet/fonts/Colossal'),
  'Computer': () => import('figlet/fonts/Computer'),
  'Digital': () => import('figlet/fonts/Digital'),
  'Doom': () => import('figlet/fonts/Doom'),
  'Epic': () => import('figlet/fonts/Epic'),
  'Ghost': () => import('figlet/fonts/Ghost'),
  'Graffiti': () => import('figlet/fonts/Graffiti'),
  'Isometric1': () => import('figlet/fonts/Isometric1'),
  'Larry 3D': () => import('figlet/fonts/Larry 3D'),
  'Lean': () => import('figlet/fonts/Lean'),
  'Mini': () => import('figlet/fonts/Mini'),
  'Ogre': () => import('figlet/fonts/Ogre'),
  'Puffy': () => import('figlet/fonts/Puffy'),
  'Rectangles': () => import('figlet/fonts/Rectangles'),
  'Shadow': () => import('figlet/fonts/Shadow'),
  'Slant': () => import('figlet/fonts/Slant'),
  'Small': () => import('figlet/fonts/Small'),
  'Speed': () => import('figlet/fonts/Speed'),
  'Standard': () => import('figlet/fonts/Standard'),
  'Star Wars': () => import('figlet/fonts/Star Wars'),
  'Train': () => import('figlet/fonts/Train'),
  'Univers': () => import('figlet/fonts/Univers')
};

const fontNames = Object.keys(fontLoaders);
const popularFonts = ['Standard', 'Banner', 'Banner3-D', 'Banner3', 'Big', 'Block', 'Bubble', 'Digital', 'Doom', 'Epic', 'Graffiti', 'Slant'];
const loadedFonts = new Set();
const el = {
  input: document.querySelector('#ascii-input'),
  font: document.querySelector('#ascii-font'),
  layout: document.querySelector('#ascii-layout'),
  width: document.querySelector('#ascii-width'),
  widthValue: document.querySelector('#ascii-width-value'),
  results: document.querySelector('#ascii-results'),
  resultsCount: document.querySelector('#ascii-results-count'),
  count: document.querySelector('#ascii-font-count'),
  status: document.querySelector('#copy-status')
};
const setStatus = createToast(el.status);
const popularOutputs = new Map();
let renderToken = 0;

figlet.defaults({ fetchFontIfMissing: false });
el.font.innerHTML = fontNames.map(name => `<option value="${name}">${name}</option>`).join('');
el.font.value = 'Standard';
el.count.textContent = `${fontNames.length} FIGlet styles available`;

async function ensureFont(name) {
  if (loadedFonts.has(name)) return;
  const mod = await fontLoaders[name]();
  figlet.parseFont(name, mod.default);
  loadedFonts.add(name);
}

async function makeAscii(text, font, width, layout) {
  await ensureFont(font);
  return figlet.textSync(text, {
    font,
    horizontalLayout: layout,
    verticalLayout: 'default',
    width
  });
}

async function render() {
  const token = ++renderToken;
  const text = (el.input.value || 'ASCII Art').slice(0, 80);
  const width = Number(el.width.value);
  const selectedFont = el.font.value || 'Standard';
  const cardFonts = [...new Set([selectedFont, ...popularFonts])];
  el.widthValue.textContent = `${width} columns`;
  el.results.innerHTML = cardFonts.map(fontName => `<article class="tool-result-card ascii-result-card"><h3>${escapeHtml(fontName)}</h3><pre class="ascii-card-output">Rendering...</pre></article>`).join('');
  el.resultsCount.textContent = selectedFont === 'Standard' ? `${popularFonts.length} popular styles` : `${cardFonts.length} styles, selected style first`;
  renderPopularCards(token, text, width, el.layout.value, cardFonts);
}

function asciiFilename(extension) {
  const slug = (el.input.value || 'ascii-art')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 42) || 'ascii-art';
  return `${slug}.${extension}`;
}

function downloadPngFromOutput(value, filename, message = 'Downloaded ASCII art PNG.') {
  if (!value) return;
  const lines = value.split('\n');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = 16;
  const lineHeight = 18;
  ctx.font = `${fontSize}px "JetBrains Mono", Consolas, monospace`;
  const width = Math.ceil(Math.max(...lines.map(line => ctx.measureText(line || ' ').width)) + 36);
  const height = Math.max(48, (lines.length * lineHeight) + 36);
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#0f172a';
  ctx.font = `${fontSize}px "JetBrains Mono", Consolas, monospace`;
  ctx.textBaseline = 'top';
  lines.forEach((line, index) => ctx.fillText(line, 18, 18 + (index * lineHeight)));
  canvas.toBlob(blob => {
    if (!blob) return setStatus('PNG export failed in this browser.');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(message);
  }, 'image/png');
}

async function renderPopularCards(token, text, width, layout, cardFonts) {
  popularOutputs.clear();
  const rendered = await Promise.all(cardFonts.map(async fontName => {
    try {
      const output = await makeAscii(text, fontName, width, layout);
      popularOutputs.set(fontName, output);
      return { fontName, output };
    } catch (err) {
      return { fontName, output: 'This style could not render that text.' };
    }
  }));
  if (token !== renderToken) return;
  el.results.innerHTML = rendered.map(({ fontName, output }) => `<article class="tool-result-card ascii-result-card" data-ascii-font="${escapeHtml(fontName)}">
    <h3>${escapeHtml(fontName)}</h3>
    <pre class="ascii-card-output clarity-mask" data-clarity-mask="true" tabindex="0">${escapeHtml(output)}</pre>
    <div class="tool-actions ascii-card-actions">
      <button type="button" class="button secondary" data-copy-ascii-card="${escapeHtml(fontName)}"><span class="material-symbols-outlined">content_copy</span>Copy</button>
      <button type="button" class="button secondary" data-download-ascii-card-png="${escapeHtml(fontName)}"><span class="material-symbols-outlined">download</span>Download Image</button>
      <button type="button" class="button secondary" data-download-ascii-card-txt="${escapeHtml(fontName)}"><span class="material-symbols-outlined">description</span>.txt</button>
    </div>
  </article>`).join('');
}

['input', 'change'].forEach(eventName => {
  el.input.addEventListener(eventName, render);
  el.font.addEventListener(eventName, render);
  el.layout.addEventListener(eventName, render);
  el.width.addEventListener(eventName, render);
});
el.results.addEventListener('pointerdown', async event => {
  const copyButton = event.target.closest('[data-copy-ascii-card]');
  if (!copyButton) return;
  event.preventDefault();
  const fontName = copyButton.dataset.copyAsciiCard;
  const output = popularOutputs.get(fontName);
  if (!output) return;
  const card = copyButton.closest('[data-ascii-font]');
  const icon = copyButton.querySelector('.material-symbols-outlined');
  try {
    await copyText(output);
    card?.classList.add('copied');
    copyButton.classList.add('copied');
    if (icon) icon.textContent = 'check';
    setStatus(`Copied ${fontName} ASCII art.`);
    window.fgTrack?.('ascii_art_card_copied', { font: fontName });
    window.setTimeout(() => {
      card?.classList.remove('copied');
      copyButton.classList.remove('copied');
      if (icon) icon.textContent = 'content_copy';
    }, 1500);
  } catch (err) {
    selectElementText(card?.querySelector('.ascii-card-output'));
    setStatus('Clipboard blocked by this browser. The ASCII art is selected; press Ctrl+C to copy it.');
  }
});
el.results.addEventListener('click', event => {
  const pngButton = event.target.closest('[data-download-ascii-card-png]');
  const txtButton = event.target.closest('[data-download-ascii-card-txt]');
  const fontName = pngButton?.dataset.downloadAsciiCardPng || txtButton?.dataset.downloadAsciiCardTxt;
  if (!fontName) return;
  const output = popularOutputs.get(fontName);
  if (!output) return;
  const base = asciiFilename('').replace(/\.$/, '');
  const suffix = fontName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (pngButton) {
    downloadPngFromOutput(output, `${base}-${suffix}.png`, `Downloaded ${fontName} ASCII art PNG.`);
  } else {
    downloadText(`${base}-${suffix}.txt`, output);
    setStatus(`Downloaded ${fontName} ASCII art text file.`);
  }
});
render();
