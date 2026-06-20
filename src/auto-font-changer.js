import { styles } from './font-styles.js';
import { copyText, createToast, escapeHtml, selectElementText } from './ui.js';

const el = {
  input: document.querySelector('#styler-input'),
  preset: document.querySelector('#styler-preset'),
  intensity: document.querySelector('#styler-intensity'),
  output: document.querySelector('#styler-output'),
  steps: document.querySelector('#styler-steps'),
  status: document.querySelector('#copy-status'),
  copy: document.querySelector('#copy-styled'),
  restyle: document.querySelector('#restyle-text')
};
const setStatus = createToast(el.status);
let latestOutput = '';
let offset = 0;
const byId = id => styles.find(style => style.id === id);

const presets = {
  bio: {
    label: 'Bio',
    joiner: '\n',
    styles: ['classic', 'aesthetic', 'fancy', 'silicon', 'watch-out'],
    templates: parts => [
      parts[0] || 'Creator',
      parts[1] || 'building small things',
      parts.slice(2).join(' ') || 'new drops weekly'
    ]
  },
  caption: {
    label: 'Caption',
    joiner: ' ',
    styles: ['fancy', 'modern', 'circle-back', 'underhill', 'flower-crown'],
    templates: parts => parts.length ? parts : ['new', 'favorite', 'moment']
  },
  marketing: {
    label: 'Marketing',
    joiner: '\n',
    styles: ['fancy-and-loud', 'classic', 'modern', 'aesthetic', 'watch-out'],
    templates: parts => [
      parts.slice(0, 3).join(' ') || 'Launch faster',
      parts.slice(3).join(' ') || 'copy-ready text for every channel',
      'copy paste ready'
    ]
  },
  discord: {
    label: 'Discord',
    joiner: '\n',
    styles: ['classic', 'hooky', 'silicon', 'night-sky', 'underhill'],
    templates: parts => [
      parts.slice(0, 2).join(' ') || 'server update',
      parts.slice(2).join(' ') || 'join the event tonight',
      'read the pins'
    ]
  },
  gaming: {
    label: 'Gaming',
    joiner: '  ',
    styles: ['hooky', 'manga', 'galactic', 'vogue', 'hit', 'nut'],
    templates: parts => parts.length ? parts : ['alex', 'plays', 'ranked']
  }
};

function words() {
  return (el.input.value || 'Alex Plays new season starts tonight')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function applyPreset() {
  const preset = presets[el.preset.value] || presets.bio;
  const intensity = Number(el.intensity.value);
  const parts = preset.templates(words()).filter(Boolean);
  const styled = parts.map((part, index) => {
    const styleIds = preset.styles.slice(0, Math.max(2, intensity + 2));
    const style = byId(styleIds[(index + offset) % styleIds.length]) || styles[index % styles.length];
    return { part, style, output: style.transform(part) };
  });
  latestOutput = styled.map(item => item.output).join(preset.joiner);
  el.output.textContent = latestOutput;
  el.steps.innerHTML = styled.map(item => `<article class="tool-result-card"><h3>${escapeHtml(item.style.name)}</h3><output class="clarity-mask" data-clarity-mask="true">${escapeHtml(item.output)}</output></article>`).join('');
}

async function copyStyled() {
  try {
    await copyText(latestOutput);
    setStatus(`Copied ${presets[el.preset.value].label} changed text.`);
    window.fgTrack?.('auto_font_changer_copied', { preset: el.preset.value });
  } catch (err) {
    selectElementText(el.output);
    setStatus('Clipboard blocked by this browser. The styled text is selected; press Ctrl+C to copy it.');
  }
}

[el.input, el.preset, el.intensity].forEach(node => node.addEventListener('input', applyPreset));
el.restyle.addEventListener('click', () => {
  offset += 1;
  applyPreset();
  setStatus('Applied a new automatic font change.');
});
el.copy.addEventListener('pointerdown', event => {
  event.preventDefault();
  copyStyled();
});
applyPreset();
