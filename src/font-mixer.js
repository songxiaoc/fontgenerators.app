import { styles } from './font-styles.js';
import { copyText, createToast, escapeHtml, selectElementText } from './ui.js';

const el = {
  input: document.querySelector('#mixer-input'),
  preset: document.querySelector('#mixer-preset'),
  output: document.querySelector('#mixer-output'),
  breakdown: document.querySelector('#mixer-breakdown'),
  status: document.querySelector('#copy-status'),
  copy: document.querySelector('#copy-mix'),
  shuffle: document.querySelector('#shuffle-mix')
};
const setStatus = createToast(el.status);
let shuffleOffset = 0;
let latestOutput = '';

const pools = {
  balanced: ['classic', 'fancy', 'modern', 'aesthetic', 'circle-back', 'underhill', 'watch-out', 'swanky'],
  cursive: ['fancy', 'flower-crown', 'wavey', 'art-greco', 'fancy-bubbles', 'frizzle', 'wakka-wakka', 'deluxe-scholar'],
  gamer: ['classic', 'hooky', 'manga', 'galactic', 'night-sky', 'vogue', 'big-brother', 'watch-out'],
  tiny: ['silicon', 'mono', 'white-tie', 'black-tie', 'evening-dress', 'carriage-return', 'watch-out', 'up-top'],
  loud: ['fancy-and-loud', 'the-north', 'heart-king', 'double-bubble', 'starry-night', 'bode', 'hit', 'nut']
};
const fallbackPool = styles.slice(0, 18);
const byId = id => styles.find(style => style.id === id);
const poolStyles = key => (pools[key] || pools.balanced).map(byId).filter(Boolean);
const hash = value => [...value].reduce((total, char) => ((total * 33) + char.charCodeAt(0)) >>> 0, 11);

function pickStyle(word, index) {
  const selected = poolStyles(el.preset.value);
  const pool = selected.length ? selected : fallbackPool;
  return pool[(hash(word) + index + shuffleOffset) % pool.length];
}

function render() {
  const raw = el.input.value || 'Mix fonts by word';
  const tokens = raw.split(/(\s+)/);
  let wordIndex = 0;
  const pieces = tokens.map(token => {
    if (!token.trim()) return token;
    const style = pickStyle(token, wordIndex);
    wordIndex += 1;
    return style.transform(token);
  });
  latestOutput = pieces.join('');
  el.output.textContent = latestOutput;

  wordIndex = 0;
  el.breakdown.innerHTML = tokens
    .filter(token => token.trim())
    .slice(0, 10)
    .map(token => {
      const style = pickStyle(token, wordIndex);
      wordIndex += 1;
      return `<article class="tool-result-card"><h3>${escapeHtml(style.name)}</h3><output class="clarity-mask" data-clarity-mask="true">${escapeHtml(style.transform(token))}</output></article>`;
    })
    .join('');
}

async function copyMix() {
  try {
    await copyText(latestOutput);
    setStatus('Copied mixed font text.');
    window.fgTrack?.('font_mixer_copied', { preset: el.preset.value });
  } catch (err) {
    selectElementText(el.output);
    setStatus('Clipboard blocked by this browser. The mixed text is selected; press Ctrl+C to copy it.');
  }
}

el.input.addEventListener('input', render);
el.preset.addEventListener('change', render);
el.shuffle.addEventListener('click', () => {
  shuffleOffset += 1 + Math.floor(Math.random() * 7);
  render();
  setStatus('Mixed styles shuffled.');
});
el.copy.addEventListener('pointerdown', event => {
  event.preventDefault();
  copyMix();
});
render();
