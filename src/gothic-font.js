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

if (!classicStyle || !boldStyle) {
  throw new Error('Gothic Font Generator requires the existing Fraktur style mappings.');
}

function addLetterSpacing(value) {
  return value
    .split(/(\s+)/u)
    .map(part => /\s/u.test(part) ? part : Array.from(part).join('\u2009'))
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
