import { fontPageBySlug } from './font-page-config.js';
import { resolveStyle, transformZalgoText } from './font-styles.js';
import { copyText, createToast, escapeHtml, selectElementText } from './ui.js';

const page = fontPageBySlug.get(document.body.dataset.fontPageSlug);
const input = document.querySelector('#font-input');
const search = document.querySelector('#style-search');
const results = document.querySelector('#style-results');
const count = document.querySelector('#style-count');
const status = document.querySelector('#copy-status');
const preview = document.querySelector('#platform-preview');
const intensity = document.querySelector('#zalgo-intensity');
const intensityValue = document.querySelector('#zalgo-intensity-value');
const setStatus = createToast(status);
const favoriteStorageKey = 'fontgenerators.favoriteStyles.v1';

const icons = {
  check: '<svg viewBox="0 0 24 24" focusable="false"><path d="m20 6-11 11-5-5"></path></svg>',
  copy: '<svg viewBox="0 0 24 24" focusable="false"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 4H6a2 2 0 0 0-2 2v10"></path></svg>',
  star: '<svg viewBox="0 0 24 24" focusable="false" class="is-filled"><path d="m12 3.6 2.55 5.17 5.7.83-4.12 4.01.97 5.67L12 16.6l-5.1 2.68.97-5.67L3.75 9.6Z"></path></svg>',
  starBorder: '<svg viewBox="0 0 24 24" focusable="false"><path d="m12 3.6 2.55 5.17 5.7.83-4.12 4.01.97 5.67L12 16.6l-5.1 2.68.97-5.67L3.75 9.6l5.7-.83L12 3.6Z"></path></svg>'
};

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(favoriteStorageKey) || '[]');
    return new Set(Array.isArray(stored) ? stored.filter(id => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

const favorites = readFavorites();
const pageStyles = [...new Map((page?.styleIds || []).map(id => resolveStyle(id)).filter(Boolean).map(style => [style.id, style])).values()];

function outputFor(style, text) {
  return style.id === 'zalgo' && intensity ? transformZalgoText(text, intensity.value) : style.transform(text);
}

function matches(style, query) {
  const terms = [style.name, style.id, style.category, ...style.searchableTags, ...style.aliasNames].join(' ').toLowerCase();
  return terms.includes(query);
}

function render() {
  const text = input.value || page.sample;
  const query = search?.value.trim().toLowerCase() || '';
  const visible = pageStyles.filter(style => !query || matches(style, query));
  count.textContent = `${visible.length} OF ${pageStyles.length} STYLES`;
  if (intensityValue && intensity) intensityValue.textContent = intensity.value;
  if (preview) preview.textContent = visible[0] ? outputFor(visible[0], text) : text;
  results.innerHTML = visible.map(style => {
    const isFavorite = favorites.has(style.id);
    return `<article class="style-row" data-style-id="${escapeHtml(style.id)}">
      <div class="style-row-head"><div class="style-title-line"><span class="style-encoding">${escapeHtml(style.name.toUpperCase())}</span></div></div>
      <div class="style-actions">
        <button type="button" class="icon-action-btn${isFavorite ? ' is-on' : ''}" data-favorite="${escapeHtml(style.id)}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? 'Remove' : 'Save'} ${escapeHtml(style.name)} favorite"><span class="inline-icon" aria-hidden="true">${icons[isFavorite ? 'star' : 'starBorder']}</span></button>
        <button type="button" class="icon-copy" data-copy="${escapeHtml(style.id)}" aria-label="Copy ${escapeHtml(style.name)} style"><span class="inline-icon" aria-hidden="true">${icons.copy}</span></button>
      </div>
      <div class="style-output clarity-mask" data-clarity-mask="true" data-output tabindex="0" aria-label="${escapeHtml(style.name)} generated style preview">${escapeHtml(outputFor(style, text))}</div>
    </article>`;
  }).join('') || '<p class="empty-state">No styles match that search. Try another word.</p>';
}

async function copyStyle(id) {
  const style = pageStyles.find(item => item.id === id);
  if (!style) return;
  const row = [...results.querySelectorAll('[data-style-id]')].find(item => item.dataset.styleId === id);
  const button = row?.querySelector('[data-copy]');
  try {
    await copyText(outputFor(style, input.value || page.sample));
    row?.classList.add('copied');
    button?.classList.add('copied');
    const icon = button?.querySelector('.inline-icon');
    if (icon) icon.innerHTML = icons.check;
    setStatus(`Copied ${style.name}.`);
    window.fgTrack?.('font_style_copied', { style_id: style.id, category: style.category, page: page.slug });
    setTimeout(() => {
      row?.classList.remove('copied');
      button?.classList.remove('copied');
      if (icon) icon.innerHTML = icons.copy;
    }, 1500);
  } catch {
    selectElementText(row?.querySelector('[data-output]'));
    setStatus('Clipboard blocked. The text is selected; press Ctrl+C to copy it.');
  }
}

function toggleFavorite(id) {
  const style = pageStyles.find(item => item.id === id);
  if (!style) return;
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  try {
    localStorage.setItem(favoriteStorageKey, JSON.stringify([...favorites]));
  } catch {
    setStatus('Favorites changed for this session, but browser storage is unavailable.');
  }
  render();
  setStatus(`${favorites.has(id) ? 'Saved favorite' : 'Removed favorite'} ${style.name}.`);
}

if (page && input && results && count) {
  input.addEventListener('input', render);
  search?.addEventListener('input', render);
  intensity?.addEventListener('input', render);
  results.addEventListener('pointerdown', event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    event.preventDefault();
    copyStyle(button.dataset.copy);
  });
  results.addEventListener('click', event => {
    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      if (event.detail === 0) copyStyle(copyButton.dataset.copy);
      return;
    }
    const favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
  });
  render();
}
