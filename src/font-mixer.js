import { resolveStyle, styles } from './font-styles.js';
import { copyText, createToast, escapeHtml, selectElementText } from './ui.js';

const el = {
  input: document.querySelector('#mixer-input'),
  preset: document.querySelector('#mixer-preset'),
  output: document.querySelector('#mixer-output'),
  tokenList: document.querySelector('#mixer-token-list'),
  styleList: document.querySelector('#mixer-style-list'),
  breakdown: document.querySelector('#mixer-breakdown'),
  status: document.querySelector('#copy-status'),
  copy: document.querySelector('#copy-mix'),
  shuffle: document.querySelector('#shuffle-mix'),
  clear: document.querySelector('#clear-mix'),
  manualMode: document.querySelector('#manual-mode'),
  shuffleMode: document.querySelector('#shuffle-mode')
};

const setStatus = createToast(el.status);
let shuffleOffset = 0;
let latestOutput = '';
let activeMode = 'manual';
let tokens = [];
const selectedWords = new Set();
const assignments = new Map([
  [0, 'fancy'],
  [1, 'classic'],
  [3, 'medieval-times']
]);

const pools = {
  balanced: ['classic', 'fancy', 'modern', 'aesthetic', 'circle-back', 'underhill', 'watch-out', 'swanky'],
  cursive: ['fancy', 'flower-crown', 'wavey', 'art-greco', 'fancy-bubbles', 'frizzle', 'wakka-wakka', 'deluxe-scholar'],
  gamer: ['classic', 'hooky', 'manga', 'galactic', 'night-sky', 'vogue', 'big-brother', 'watch-out'],
  tiny: ['silicon', 'mono', 'white-tie', 'black-tie', 'evening-dress', 'carriage-return', 'watch-out', 'up-top'],
  loud: ['fancy-and-loud', 'the-north', 'heart-king', 'double-bubble', 'starry-night', 'bode', 'hit', 'nut']
};

const manualStyleIds = ['classic', 'fancy', 'medieval-times', 'watch-out', 'circle-back', 'silicon', 'hooky', 'aesthetic'];
const fallbackPool = styles.slice(0, 18);
const hash = value => [...value].reduce((total, char) => ((total * 33) + char.charCodeAt(0)) >>> 0, 11);
const getStyle = id => resolveStyle(id) || styles.find(style => style.id === id) || null;
const poolStyles = key => (pools[key] || pools.balanced).map(getStyle).filter(Boolean);

function parseTokens(value) {
  let wordIndex = 0;
  return (value || 'Mix fonts by word').split(/(\s+)/).map(text => {
    if (!text.trim()) return { text, wordIndex: null };
    const token = { text, wordIndex };
    wordIndex += 1;
    return token;
  });
}

function getWordCount() {
  return tokens.filter(token => token.wordIndex !== null).length;
}

function pruneState() {
  const count = getWordCount();
  for (const index of [...selectedWords]) {
    if (index >= count) selectedWords.delete(index);
  }
  for (const index of [...assignments.keys()]) {
    if (index >= count) assignments.delete(index);
  }
}

function updateModeButtons() {
  el.manualMode?.setAttribute('aria-pressed', activeMode === 'manual' ? 'true' : 'false');
  el.shuffleMode?.setAttribute('aria-pressed', activeMode === 'shuffle' ? 'true' : 'false');
}

function styleForWord(index) {
  return getStyle(assignments.get(index));
}

function renderTokens() {
  el.tokenList.innerHTML = tokens
    .filter(token => token.wordIndex !== null)
    .map(token => {
      const style = styleForWord(token.wordIndex);
      const selected = selectedWords.has(token.wordIndex);
      return `<button type="button" class="word-token${style ? ' has-style' : ''}" data-word-index="${token.wordIndex}" aria-pressed="${selected ? 'true' : 'false'}">
        <span class="word-token__text">${escapeHtml(token.text)}</span>
        <span class="word-token__style">${escapeHtml(style?.name || 'Plain')}</span>
      </button>`;
    })
    .join('');
}

function renderBreakdown() {
  const words = tokens.filter(token => token.wordIndex !== null).slice(0, 12);
  el.breakdown.innerHTML = words.map(token => {
    const style = styleForWord(token.wordIndex);
    const output = style ? style.transform(token.text) : token.text;
    return `<article class="tool-result-card">
      <h3>${escapeHtml(style?.name || 'Plain text')}</h3>
      <output class="clarity-mask" data-clarity-mask="true">${escapeHtml(output)}</output>
    </article>`;
  }).join('');
}

function render() {
  tokens = parseTokens(el.input.value);
  pruneState();
  latestOutput = tokens.map(token => {
    if (token.wordIndex === null) return token.text;
    const style = styleForWord(token.wordIndex);
    return style ? style.transform(token.text) : token.text;
  }).join('');
  el.output.textContent = latestOutput;
  renderTokens();
  renderBreakdown();
  updateModeButtons();
}

function applyStyle(styleId) {
  const style = getStyle(styleId);
  if (!style) return;
  if (!selectedWords.size) {
    setStatus('Select one or more words first.');
    return;
  }
  for (const index of selectedWords) assignments.set(index, style.id);
  activeMode = 'manual';
  render();
  setStatus(`${style.name} applied to selected words.`);
  window.fgTrack?.('font_mixer_manual_style_applied', { style: style.id, words: selectedWords.size });
}

function shuffleMix() {
  const selected = poolStyles(el.preset.value);
  const pool = selected.length ? selected : fallbackPool;
  shuffleOffset += 1 + Math.floor(Math.random() * 7);
  assignments.clear();
  selectedWords.clear();
  for (const token of tokens.filter(item => item.wordIndex !== null)) {
    const style = pool[(hash(token.text) + token.wordIndex + shuffleOffset) % pool.length];
    if (style) assignments.set(token.wordIndex, style.id);
  }
  activeMode = 'shuffle';
  render();
  setStatus('Shuffle Mix applied.');
  window.fgTrack?.('font_mixer_shuffled', { preset: el.preset.value });
}

function clearMix() {
  assignments.clear();
  selectedWords.clear();
  activeMode = 'manual';
  render();
  setStatus('Manual styles cleared.');
}

async function copyMix() {
  try {
    await copyText(latestOutput);
    setStatus('Copied mixed font text.');
    window.fgTrack?.('font_mixer_copied', { mode: activeMode, preset: el.preset.value });
  } catch (err) {
    selectElementText(el.output);
    setStatus('Clipboard blocked by this browser. The mixed text is selected; press Ctrl+C to copy it.');
  }
}

el.input.addEventListener('input', () => {
  activeMode = 'manual';
  render();
});
el.preset.addEventListener('change', () => {
  if (activeMode === 'shuffle') shuffleMix();
});
el.tokenList.addEventListener('click', event => {
  const button = event.target.closest('[data-word-index]');
  if (!button) return;
  const index = Number(button.dataset.wordIndex);
  if (selectedWords.has(index)) selectedWords.delete(index);
  else selectedWords.add(index);
  activeMode = 'manual';
  render();
});
el.styleList.addEventListener('click', event => {
  const button = event.target.closest('[data-style-id]');
  if (!button) return;
  applyStyle(button.dataset.styleId);
});
el.manualMode.addEventListener('click', () => {
  activeMode = 'manual';
  render();
  setStatus('Manual Mix ready. Select words and choose a style.');
});
el.shuffleMode.addEventListener('click', shuffleMix);
el.shuffle.addEventListener('click', shuffleMix);
el.clear.addEventListener('click', clearMix);
el.copy.addEventListener('pointerdown', event => {
  event.preventDefault();
  copyMix();
});

render();
