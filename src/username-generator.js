import { styles } from './font-styles.js';
import { copyText, createToast, escapeHtml, selectElementText } from './ui.js';

const el = {
  base: document.querySelector('#username-base'),
  platform: document.querySelector('#username-platform'),
  vibe: document.querySelector('#username-vibe'),
  count: document.querySelector('#username-count'),
  results: document.querySelector('#username-results'),
  status: document.querySelector('#copy-status'),
  generate: document.querySelector('#generate-usernames')
};
const setStatus = createToast(el.status);

const platforms = {
  instagram: { separators: ['.', '_', ''], max: 24, tags: ['Instagram', 'Fancy', 'Stylish'] },
  tiktok: { separators: ['.', '_', ''], max: 24, tags: ['TikTok', 'Cool', 'Bold'] },
  discord: { separators: ['', '_', '.'], max: 32, tags: ['Discord', 'Bold', 'Fancy'] },
  gaming: { separators: ['_', '', 'x'], max: 16, tags: ['Big', 'Cool', 'Discord'] },
  general: { separators: ['_', '.', ''], max: 28, tags: ['Fancy', 'Bold', 'Cool'] }
};
const vibes = {
  clean: ['classic', 'modern', 'silicon', 'mono', 'watch-out'],
  fancy: ['fancy', 'flower-crown', 'frizzle', 'swanky', 'fancy-and-loud'],
  gamer: ['hooky', 'manga', 'galactic', 'night-sky', 'vogue'],
  cute: ['circle-back', 'fancy-bubbles', 'heart-king', 'pinky-out', 'meow'],
  dark: ['the-north', 'medieval-times', 'bold-fraktur', 'lonely-mountain', 'joker-boy']
};
const words = ['plays', 'verse', 'mode', 'pixel', 'nova', 'quest', 'byte', 'club', 'zone', 'vibes', 'hq', 'daily'];
const prefixes = ['its', 'hey', 'the', 'real', 'not', 'xo', ''];
const byId = id => styles.find(style => style.id === id);
const hash = value => [...value].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 17);

function cleanBase(value) {
  return (value || 'Alex')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);
}

function stylePool(platform, vibe) {
  const ids = vibes[vibe] || vibes.clean;
  const preferred = ids.map(byId).filter(Boolean);
  const byTag = styles.filter(style => platform.tags.some(tag => style.tags.includes(tag))).slice(0, 20);
  return [...preferred, ...byTag].filter((style, index, list) => list.findIndex(item => item.id === style.id) === index);
}

function rawCandidates(parts, platform) {
  const base = parts.join('');
  const spaced = parts.join(platform.separators[0]);
  const seed = hash(parts.join('-') + el.platform.value + el.vibe.value);
  return Array.from({ length: 36 }, (_, index) => {
    const word = words[(seed + index * 5) % words.length];
    const prefix = prefixes[(seed + index * 3) % prefixes.length];
    const sep = platform.separators[index % platform.separators.length];
    const suffix = index % 4 === 0 ? String((seed + index) % 99).padStart(2, '0') : '';
    const shape = [
      `${base}${sep}${word}${suffix}`,
      `${prefix}${sep}${base}${suffix}`,
      `${spaced}${sep}${word}`,
      `${word}${sep}${base}`,
      `${base}${suffix}`
    ][index % 5];
    return shape.replace(/^\W+|\W+$/g, '').slice(0, platform.max);
  });
}

function render() {
  const platform = platforms[el.platform.value] || platforms.general;
  const parts = cleanBase(el.base.value);
  const pool = stylePool(platform, el.vibe.value);
  const candidates = rawCandidates(parts, platform)
    .filter((value, index, list) => value && list.indexOf(value) === index)
    .slice(0, Number(el.count.value));
  el.results.innerHTML = candidates.map((candidate, index) => {
    const style = pool[index % pool.length] || styles[index % styles.length];
    const output = style.transform(candidate);
    return `<article class="tool-result-card" data-username-card><h3>${escapeHtml(style.name)}</h3><div class="tool-card-actions"><button type="button" class="icon-copy" data-copy-username="${escapeHtml(output)}" aria-label="Copy ${escapeHtml(candidate)}"><span class="material-symbols-outlined">content_copy</span></button></div><output class="clarity-mask" data-clarity-mask="true" tabindex="0">${escapeHtml(output)}</output></article>`;
  }).join('');
}

async function copyUsername(button) {
  const value = button.dataset.copyUsername || '';
  try {
    await copyText(value);
    button.classList.add('copied');
    button.querySelector('.material-symbols-outlined').textContent = 'check';
    setStatus('Copied username.');
    window.setTimeout(() => {
      button.classList.remove('copied');
      button.querySelector('.material-symbols-outlined').textContent = 'content_copy';
    }, 1400);
  } catch (err) {
    selectElementText(button.closest('[data-username-card]')?.querySelector('output'));
    setStatus('Clipboard blocked by this browser. The username is selected; press Ctrl+C to copy it.');
  }
}

[el.base, el.platform, el.vibe, el.count].forEach(node => node.addEventListener('input', render));
el.generate.addEventListener('click', () => {
  render();
  setStatus('Generated fresh username ideas.');
});
el.results.addEventListener('pointerdown', event => {
  const button = event.target.closest('[data-copy-username]');
  if (!button) return;
  event.preventDefault();
  copyUsername(button);
});
render();
