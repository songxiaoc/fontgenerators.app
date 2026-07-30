import { resolveStyle } from './font-styles.js';
import { copyText, createToast, selectElementText } from './ui.js';

const input = document.querySelector('#gothic-input');
const clearButton = document.querySelector('#clear-gothic');
const count = document.querySelector('#gothic-character-count');
const results = document.querySelector('#gothic-results');
const status = document.querySelector('#gothic-copy-status');
const setStatus = createToast(status);

const classicStyle = resolveStyle('medieval-times');
const boldStyle = resolveStyle('the-north');
const serifStyle = resolveStyle('classic');
const doubleStruckStyle = resolveStyle('hooky');
const smallCapsStyle = resolveStyle('french-fry');

if (!classicStyle || !boldStyle || !serifStyle || !doubleStruckStyle || !smallCapsStyle) {
  throw new Error('Gothic Font Generator requires the existing shared style mappings.');
}

function addLetterSpacing(value) {
  return value
    .split(/(\s+)/u)
    .map(part => /\s/u.test(part) ? part : Array.from(part).join('\u2009'))
    .join('');
}

function addGrungeOverlay(value) {
  return Array.from(value)
    .map(character => /[A-Za-z]/u.test(character) ? `${boldStyle.transform(character)}\u0338` : character)
    .join('');
}

const variants = [
  {
    id: 'classic-fraktur',
    name: 'Classic Fraktur',
    transform: value => classicStyle.transform(value),
  },
  {
    id: 'bold-fraktur',
    name: 'Bold Fraktur',
    transform: value => boldStyle.transform(value),
  },
  {
    id: 'spaced-gothic',
    name: 'Spaced Gothic',
    transform: value => addLetterSpacing(classicStyle.transform(value)),
  },
  {
    id: 'gothic-brackets',
    name: 'Gothic Brackets',
    transform: value => `⟦ ${classicStyle.transform(value)} ⟧`,
  },
  {
    id: 'gothic-stars',
    name: 'Gothic Stars',
    transform: value => `✦ ${boldStyle.transform(value)} ✦`,
  },
  {
    id: 'gothic-moon',
    name: 'Gothic Moon',
    transform: value => `☾ ${classicStyle.transform(value)} ☽`,
  },
  {
    id: 'gothic-cross',
    name: 'Gothic Cross',
    transform: value => `✝ ${classicStyle.transform(value)} ✝`,
  },
  {
    id: 'gothic-skull',
    name: 'Gothic Skull',
    transform: value => `☠ ${classicStyle.transform(value)} ☠`,
  },
  {
    id: 'gothic-bat',
    name: 'Gothic Bat',
    transform: value => `🦇 ${classicStyle.transform(value)} 🦇`,
  },
  {
    id: 'gothic-sword',
    name: 'Gothic Sword',
    transform: value => `⚔ ${boldStyle.transform(value)} ⚔`,
  },
  {
    id: 'gothic-spiderweb',
    name: 'Gothic Spiderweb',
    transform: value => `🕸 ${classicStyle.transform(value)} 🕸`,
  },
  {
    id: 'royal-gothic',
    name: 'Royal Gothic',
    transform: value => `♛ ${boldStyle.transform(value)} ♚`,
  },
  {
    id: 'gothic-serif',
    name: 'Gothic Serif',
    transform: value => serifStyle.transform(value),
  },
  {
    id: 'double-struck-gothic',
    name: 'Double Struck Gothic',
    transform: value => doubleStruckStyle.transform(value),
  },
  {
    id: 'small-caps-gothic',
    name: 'Small Caps Gothic',
    transform: value => smallCapsStyle.transform(value),
  },
  {
    id: 'grunge-gothic',
    name: 'Grunge Gothic',
    transform: value => addGrungeOverlay(value),
  },
];

function variantById(id) {
  return variants.find(variant => variant.id === id);
}

function updateCharacterCount(value) {
  const length = Array.from(value).length;
  count.textContent = `${length} ${length === 1 ? 'character' : 'characters'}`;
}

function setCopyButtonState(button, disabled) {
  button.disabled = disabled;
  button.setAttribute('aria-disabled', String(disabled));
}

function render() {
  const value = input.value;
  const empty = value.length === 0;
  updateCharacterCount(value);

  for (const variant of variants) {
    const row = results.querySelector(`[data-gothic-style="${variant.id}"]`);
    const output = row?.querySelector('[data-output]');
    const copyButton = row?.querySelector('[data-copy-style]');
    if (!row || !output || !copyButton) continue;

    output.textContent = empty ? 'Type text above to generate this style.' : variant.transform(value);
    row.classList.toggle('is-empty', empty);
    setCopyButtonState(copyButton, empty);
  }
}

function restoreCopyState(row, button) {
  const icon = button.querySelector('[data-icon]');
  row.classList.remove('copied');
  button.classList.remove('copied');
  if (icon) icon.dataset.icon = 'content_copy';
}

async function copyVariant(id) {
  const variant = variantById(id);
  if (!variant || !input.value) return;

  const row = results.querySelector(`[data-gothic-style="${id}"]`);
  const output = row?.querySelector('[data-output]');
  const button = row?.querySelector('[data-copy-style]');
  const icon = button?.querySelector('[data-icon]');
  const value = variant.transform(input.value);

  try {
    await copyText(value);
    row?.classList.add('copied');
    button?.classList.add('copied');
    if (icon) icon.dataset.icon = 'check';
    setStatus(`Copied ${variant.name}.`);
    window.fgTrack?.('gothic_style_copied', { style_id: variant.id });
    window.setTimeout(() => {
      if (row && button) restoreCopyState(row, button);
    }, 1600);
  } catch (error) {
    selectElementText(output);
    setStatus(`Clipboard access was blocked. ${variant.name} is selected so you can copy it manually.`);
  }
}

input.addEventListener('input', render);

clearButton.addEventListener('click', () => {
  input.value = '';
  render();
  setStatus('Text cleared. Type something to create Gothic text.');
  input.focus();
});

results.addEventListener('click', event => {
  const button = event.target.closest('[data-copy-style]');
  if (!button || button.disabled) return;
  copyVariant(button.dataset.copyStyle);
});

render();
