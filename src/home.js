import { styleAliases, styles } from './font-styles.js';
import { copyText, createToast, escapeHtml, selectElementText } from './ui.js';

const input = document.querySelector('#font-input');
const search = document.querySelector('#style-search');
const results = document.querySelector('#style-results');
const count = document.querySelector('#style-count');
const status = document.querySelector('#copy-status');
const categoryButtons = [...document.querySelectorAll('[data-category]')];
let activeCategory = 'All';
const setStatus = createToast(status);
const favoriteStorageKey = 'fontgenerators.favoriteStyles.v1';
const svgIcon = {
  check: '<svg viewBox="0 0 24 24" focusable="false"><path d="m20 6-11 11-5-5"></path></svg>',
  copy: '<svg viewBox="0 0 24 24" focusable="false"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 4H6a2 2 0 0 0-2 2v10"></path></svg>',
  star: '<svg viewBox="0 0 24 24" focusable="false" class="is-filled"><path d="m12 3.6 2.55 5.17 5.7.83-4.12 4.01.97 5.67L12 16.6l-5.1 2.68.97-5.67L3.75 9.6l5.7-.83L12 3.6Z"></path></svg>',
  starBorder: '<svg viewBox="0 0 24 24" focusable="false"><path d="m12 3.6 2.55 5.17 5.7.83-4.12 4.01.97 5.67L12 16.6l-5.1 2.68.97-5.67L3.75 9.6l5.7-.83L12 3.6Z"></path></svg>'
};
function iconMarkup(name) {
  return `<span class="inline-icon" aria-hidden="true">${svgIcon[name]}</span>`;
}
function readFavoriteIds() {
  try {
    const stored = globalThis.localStorage?.getItem(favoriteStorageKey);
    const ids = stored ? JSON.parse(stored) : [];
    return Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : [];
  } catch (err) {
    return [];
  }
}
const favoriteIds = new Set(readFavoriteIds());
function saveFavoriteIds() {
  try {
    globalThis.localStorage?.setItem(favoriteStorageKey, JSON.stringify([...favoriteIds]));
  } catch (err) {
    setStatus('Favorites changed for this session, but browser storage is unavailable.');
  }
}

function matches(style, q){
  const aliasTokens = style.aliases?.flatMap(alias => [alias.name, alias.id, alias.category, ...alias.tags]) || [];
  const haystack = [style.name, style.category, ...style.tags, ...style.searchableTags, style.id, ...aliasTokens].join(' ').toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}
function render(){
  const text = input.value || 'Your Text';
  const q = search.value || '';
  const visible = styles.filter(style => {
    const categoryMatch = activeCategory === 'All' || (activeCategory === 'Favorites' ? favoriteIds.has(style.id) : style.category === activeCategory);
    return categoryMatch && matches(style, q);
  });
  const favoriteText = favoriteIds.size === 1 ? '1 FAVORITE' : `${favoriteIds.size} FAVORITES`;
  const aliasText = styleAliases.length === 1 ? '1 ALIAS HIDDEN' : `${styleAliases.length} ALIASES HIDDEN`;
  count.textContent = `${visible.length} STYLES SHOWN / ${styles.length} UNIQUE STYLES / ${aliasText} / ${favoriteText}`;
  results.innerHTML = visible.map((style) => {
    const output = style.transform(text);
    const favorite = favoriteIds.has(style.id);
    const aliasNote = style.aliasNames.length ? ` / ${style.aliasNames.length} aliases` : '';
    return `<article class="style-row" data-style-id="${style.id}">
      <div class="style-row-head">
        <div>
          <div class="style-title-line"><span class="style-encoding">${escapeHtml(style.name.toUpperCase())}</span></div>
          <div class="tagline">${escapeHtml(style.category)}${escapeHtml(aliasNote)}</div>
        </div>
      </div>
      <div class="style-actions">
        <button type="button" class="icon-action-btn${favorite ? ' is-on' : ''}" data-favorite="${style.id}" aria-pressed="${favorite}" aria-label="${favorite ? 'Remove' : 'Save'} ${escapeHtml(style.name)} favorite">${iconMarkup(favorite ? 'star' : 'starBorder')}</button>
        <button type="button" class="icon-copy" data-copy="${style.id}" aria-label="Copy ${escapeHtml(style.name)} style">${iconMarkup('copy')}</button>
      </div>
      <div class="style-output clarity-mask" data-clarity-mask="true" data-output tabindex="0" aria-label="${escapeHtml(style.name)} generated style preview">${escapeHtml(output)}</div>
    </article>`;
  }).join('') || `<p class="empty-state">${activeCategory === 'Favorites' ? 'No favorites yet. Star a style to keep it here.' : 'No styles match that filter. Try another category or search term.'}</p>`;
}
async function copyStyle(id){
  const style = styles.find(s => s.id === id);
  if (!style) return;
  const value = style.transform(input.value || 'Your Text');
  const row = document.querySelector(`[data-style-id="${id}"]`);
  const button = row?.querySelector('[data-copy]');
  const icon = button?.querySelector('.inline-icon');
  try {
    await copyText(value);
    row?.classList.add('copied');
    button?.classList.add('copied');
    if (icon) icon.innerHTML = svgIcon.check;
    setStatus(`Copied ${style.name}.`);
    window.fgTrack?.('font_style_copied', { style_id: style.id, category: style.category });
    setTimeout(() => {
      row?.classList.remove('copied');
      button?.classList.remove('copied');
      if (icon) icon.innerHTML = svgIcon.copy;
    }, 1500);
  } catch (err) {
    selectElementText(row?.querySelector('[data-output]'));
    setStatus('Clipboard blocked by this browser. The text is selected; press Ctrl+C to copy it.');
  }
}
function toggleFavorite(id) {
  if (favoriteIds.has(id)) favoriteIds.delete(id); else favoriteIds.add(id);
  saveFavoriteIds();
  render();
  const style = styles.find(s => s.id === id);
  if (style) setStatus(`${favoriteIds.has(id) ? 'Saved favorite' : 'Removed favorite'} ${style.name}.`);
}
input.addEventListener('input', render);
search.addEventListener('input', render);
categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(b => b.classList.toggle('active', b === button));
  render();
}));
results.addEventListener('pointerdown', e => {
  const copyButton = e.target.closest('[data-copy]');
  if (!copyButton) return;
  e.preventDefault();
  return copyStyle(copyButton.dataset.copy);
});
results.addEventListener('click', e => {
  const copyButton = e.target.closest('[data-copy]');
  if (copyButton) {
    if (e.detail === 0) return copyStyle(copyButton.dataset.copy);
    return;
  }
  const favoriteButton = e.target.closest('[data-favorite]');
  if (favoriteButton) return toggleFavorite(favoriteButton.dataset.favorite);
});
render();
