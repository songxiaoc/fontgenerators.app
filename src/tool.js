import { copyText, createToast, selectElementText } from './ui.js';

const colors = [
  { id: 'gray', label: 'Gray', fg: '30', bg: '40', hex: '#80848E', bgHex: '#4B5563' },
  { id: 'red', label: 'Red', fg: '31', bg: '41', hex: '#ED4245', bgHex: '#7F1D1D' },
  { id: 'green', label: 'Green', fg: '32', bg: '42', hex: '#57F287', bgHex: '#064E3B' },
  { id: 'yellow', label: 'Yellow', fg: '33', bg: '43', hex: '#FEE75C', bgHex: '#78350F' },
  { id: 'blue', label: 'Blue', fg: '34', bg: '44', hex: '#5865F2', bgHex: '#1E3A8A' },
  { id: 'magenta', label: 'Magenta', fg: '35', bg: '45', hex: '#EB459E', bgHex: '#831843' },
  { id: 'cyan', label: 'Cyan', fg: '36', bg: '46', hex: '#1ABC9C', bgHex: '#155E75' },
  { id: 'white', label: 'White', fg: '37', bg: '47', hex: '#FFFFFF', bgHex: '#E5E7EB' }
];
const rainbowColors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

const faq = [
  { q: 'How do I make colored text in Discord?', a: 'Use an ansi code block in a supported Discord client. Type your message in this generator, select the text you want to style, choose supported ANSI colors or styles, then copy the full fenced ansi block and paste it into Discord.' },
  { q: 'What is a Discord color text generator?', a: 'A Discord color text generator creates ANSI-formatted code blocks for Discord. Instead of typing escape codes manually, you choose colors in a visual editor and copy a ready-to-paste block.' },
  { q: 'How do I make rainbow colored text in Discord?', a: 'Use the Rainbow quick effect in this tool. Select the text you want to color, or leave nothing selected to apply it to the whole message, then copy the generated ansi code block for Discord.' },
  { q: 'Does Discord colored text work on mobile?', a: 'Mobile support may vary. Discord ANSI colored text generally works best in supported Discord desktop and web clients. Some mobile clients may show plain text or render styles differently.' },
  { q: 'Can I use custom hex colors in Discord text?', a: 'No. Discord ANSI text uses a limited palette, not arbitrary hex, RGB, or brand colors. This tool should only offer colors that map to supported ANSI codes.' },
  { q: 'Why is my Discord colored text not working?', a: 'Check that you pasted the full ansi code block, including the opening triple backticks, the ansi label, the generated escape sequences, and the closing triple backticks. Rendering can also vary by Discord client and version.' },
  { q: 'What colors work in Discord ANSI code blocks?', a: 'Discord ANSI color blocks support a limited set of foreground and background colors based on ANSI codes. Preview colors are approximate because Discord rendering can vary by client and version.' },
  { q: 'Is FontGenerators.app affiliated with Discord?', a: 'No. FontGenerators.app is an unofficial tool and is not made, endorsed, sponsored, or approved by Discord. Discord is a trademark of its respective owner.' },
  { q: 'Is this Discord colored text generator free?', a: 'Yes for the MVP. The tool is a free browser-based utility with no sign-in, checkout, pricing page, Pro plan, or subscription in v0.' },
  { q: 'Does FontGenerators.app save the text I type?', a: 'In this MVP, the editor runs in your browser and does not send your raw message text to a backend for processing. Do not paste sensitive or confidential text into any online tool.' }
];

const el = {
  msg: document.querySelector('#message'),
  fg: document.querySelector('#fg-controls'),
  bg: document.querySelector('#bg-controls'),
  preview: document.querySelector('#preview'),
  output: document.querySelector('#output'),
  status: document.querySelector('#copy-status')
};
const showStatus = createToast(el.status);
let spans = [];
let lastText = '';
let lastApplied = { foreground: null, background: null, bold: false, underline: false };
const blankStyle = () => ({ foreground: null, background: null, bold: false, underline: false });
const esc = s => s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function colorById(id) { return colors.find(c => c.id === id); }
function setStatus(message) { showStatus(message); }
function selected() {
  const a = el.msg.selectionStart;
  const b = el.msg.selectionEnd;
  return [Math.min(a, b), Math.max(a, b)];
}
function updatePressedStates() {
  document.querySelectorAll('[data-fg]').forEach(btn => btn.setAttribute('aria-pressed', String(lastApplied.foreground === btn.dataset.fg)));
  document.querySelectorAll('[data-bg]').forEach(btn => btn.setAttribute('aria-pressed', String(lastApplied.background === btn.dataset.bg)));
  document.querySelectorAll('[data-style]').forEach(btn => btn.setAttribute('aria-pressed', String(Boolean(lastApplied[btn.dataset.style]))));
  document.querySelectorAll('[data-preset]').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
}
function addButtons() {
  const formatButtons = document.querySelectorAll('[data-style]');
  formatButtons.forEach(button => {
    button.addEventListener('click', () => toggleStyleControl(button.dataset.style));
    button.setAttribute('aria-pressed', 'false');
  });
  document.querySelectorAll('[data-preset]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.preset === 'rainbow') applyRainbow();
    });
    button.setAttribute('aria-pressed', 'false');
  });

  colors.forEach(c => {
    const fg = document.createElement('button');
    fg.type = 'button';
    fg.className = `color-chip${c.id === 'white' ? ' is-white' : ''}`;
    fg.style.background = c.hex;
    fg.dataset.fg = c.id;
    fg.setAttribute('aria-label', `Apply ${c.label} text color`);
    fg.setAttribute('aria-pressed', 'false');
    fg.innerHTML = `<span class="sr-only">${c.label}</span>`;
    fg.addEventListener('click', () => toggleColorControl('foreground', c.id));
    el.fg.appendChild(fg);

    const bg = document.createElement('button');
    bg.type = 'button';
    bg.className = `color-chip${c.id === 'white' ? ' is-white' : ''}`;
    bg.style.background = c.bgHex;
    bg.dataset.bg = c.id;
    bg.setAttribute('aria-label', `Apply ${c.label} highlight color`);
    bg.setAttribute('aria-pressed', 'false');
    bg.innerHTML = `<span class="sr-only">${c.label}</span>`;
    bg.addEventListener('click', () => toggleColorControl('background', c.id));
    el.bg.appendChild(bg);
  });
}
function cloneStyle(st) {
  return { ...blankStyle(), ...st };
}
function rangeEvery(start, end, predicate) {
  if (start === end) return false;
  for (let i = start; i < end; i += 1) {
    if (!predicate(styleAt(i))) return false;
  }
  return true;
}
function stylesByCharacter(length = el.msg.value.length) {
  return Array.from({ length }, (_, i) => cloneStyle(styleAt(i)));
}
function compressStyleRuns(perCharStyles) {
  if (!perCharStyles.length) return [];
  const blankKey = key(blankStyle());
  const next = [];
  let runStart = 0;
  let previous = cloneStyle(perCharStyles[0]);
  for (let i = 1; i <= perCharStyles.length; i += 1) {
    const current = i < perCharStyles.length ? cloneStyle(perCharStyles[i]) : null;
    if (i === perCharStyles.length || key(current) !== key(previous)) {
      if (key(previous) !== blankKey) next.push({ start: runStart, end: i, ...previous });
      runStart = i;
      previous = current || blankStyle();
    }
  }
  return next;
}
function findTextEditRange(oldText, newText) {
  let start = 0;
  const oldLen = oldText.length;
  const newLen = newText.length;
  while (start < oldLen && start < newLen && oldText[start] === newText[start]) start += 1;

  let oldEnd = oldLen;
  let newEnd = newLen;
  while (oldEnd > start && newEnd > start && oldText[oldEnd - 1] === newText[newEnd - 1]) {
    oldEnd -= 1;
    newEnd -= 1;
  }
  return { start, oldEnd, newEnd };
}
function styleForInsertedText(oldStyles, start, oldEnd) {
  if (oldEnd > start && oldStyles[start]) return cloneStyle(oldStyles[start]);
  if (start > 0 && oldStyles[start - 1]) return cloneStyle(oldStyles[start - 1]);
  if (oldStyles[start]) return cloneStyle(oldStyles[start]);
  return cloneStyle(lastApplied);
}
function syncSpansAfterTextEdit(oldText, newText) {
  if (oldText === newText) return;
  const oldStyles = stylesByCharacter(oldText.length);
  const { start, oldEnd, newEnd } = findTextEditRange(oldText, newText);
  const nextStyles = [];
  const insertedStyle = styleForInsertedText(oldStyles, start, oldEnd);

  for (let i = 0; i < start; i += 1) {
    nextStyles[i] = cloneStyle(oldStyles[i]);
  }
  for (let i = start; i < newEnd; i += 1) {
    const oldIndex = start + (i - start);
    nextStyles[i] = oldIndex < oldEnd && oldStyles[oldIndex]
      ? cloneStyle(oldStyles[oldIndex])
      : cloneStyle(insertedStyle);
  }
  const offset = newEnd - oldEnd;
  for (let i = newEnd; i < newText.length; i += 1) {
    nextStyles[i] = cloneStyle(oldStyles[i - offset]);
  }

  spans = compressStyleRuns(nextStyles);
  normalize();
}
function setRangeStyle(start, end, patch) {
  const perCharStyles = stylesByCharacter();
  for (let i = start; i < end; i += 1) {
    perCharStyles[i] = { ...perCharStyles[i], ...patch };
  }
  spans = compressStyleRuns(perCharStyles);
  normalize();
  render();
}
function setRangePattern(start, end, colorIds) {
  const text = el.msg.value;
  const perCharStyles = stylesByCharacter();
  let offset = start;
  let colorIndex = 0;
  for (const glyph of Array.from(text.slice(start, end))) {
    const nextOffset = offset + glyph.length;
    const foreground = /\s/.test(glyph) ? null : colorIds[colorIndex % colorIds.length];
    for (let i = offset; i < nextOffset; i += 1) {
      perCharStyles[i] = { ...perCharStyles[i], foreground };
    }
    if (foreground) colorIndex += 1;
    offset = nextOffset;
  }
  spans = compressStyleRuns(perCharStyles);
  normalize();
  render();
}
function setActivePatch(patch) {
  lastApplied = { ...lastApplied, ...patch };
  updatePressedStates();
}
function applyRainbow() {
  if (!el.msg.value.trim()) {
    setStatus('Type a message before applying rainbow colors.');
    el.msg.focus();
    return;
  }
  let [start, end] = selected();
  const wholeMessage = start === end;
  if (wholeMessage) {
    start = 0;
    end = el.msg.value.length;
  }
  setRangePattern(start, end, rainbowColors);
  setActivePatch({ foreground: null });
  setStatus(`Applied rainbow colors to ${wholeMessage ? 'the full message' : 'selected text'}.`);
  el.msg.focus();
}
function toggleStyleControl(name) {
  const [start, end] = selected();
  const label = name === 'bold' ? 'Bold' : 'Underline';
  const nextValue = start === end
    ? !Boolean(lastApplied[name])
    : !rangeEvery(start, end, st => Boolean(st[name]));
  setActivePatch({ [name]: nextValue });
  if (start === end) {
    setStatus(`${label} ${nextValue ? 'enabled' : 'disabled'} for the next selection.`);
    el.msg.focus();
    return;
  }
  setRangeStyle(start, end, { [name]: nextValue });
  setStatus(`${nextValue ? 'Applied' : 'Removed'} ${label.toLowerCase()} on selected text.`);
  el.msg.focus();
}
function toggleColorControl(kind, id) {
  const [start, end] = selected();
  const color = colorById(id);
  const colorLabel = kind === 'foreground' ? 'text color' : 'highlight color';
  const nextValue = (start === end ? lastApplied[kind] === id : rangeEvery(start, end, st => st[kind] === id)) ? null : id;
  setActivePatch({ [kind]: nextValue });
  if (start === end) {
    setStatus(`${color.label} ${colorLabel} ${nextValue ? 'enabled' : 'cleared'} for the next selection.`);
    el.msg.focus();
    return;
  }
  setRangeStyle(start, end, { [kind]: nextValue });
  setStatus(`${nextValue ? 'Applied' : 'Removed'} ${color.label.toLowerCase()} ${colorLabel} on selected text.`);
  el.msg.focus();
}
function normalize() {
  const len = el.msg.value.length;
  spans = spans
    .map(s => ({ ...s, start: Math.max(0, Math.min(len, s.start)), end: Math.max(0, Math.min(len, s.end)) }))
    .filter(s => s.end > s.start);
}
function styleAt(i) {
  const out = blankStyle();
  for (const s of spans) {
    if (i >= s.start && i < s.end) {
      if (s.foreground) out.foreground = s.foreground;
      if (s.background) out.background = s.background;
      if (s.bold) out.bold = true;
      if (s.underline) out.underline = true;
    }
  }
  return out;
}
function key(st) { return [st.foreground || '', st.background || '', st.bold ? 'b' : '', st.underline ? 'u' : ''].join('|'); }
function ansiCodes(st) {
  const codes = [];
  if (st.bold) codes.push('1');
  if (st.underline) codes.push('4');
  if (st.foreground) codes.push(colorById(st.foreground).fg);
  if (st.background) codes.push(colorById(st.background).bg);
  return codes;
}
function buildAnsi() {
  const text = el.msg.value;
  if (!text) return '```ansi\n\n```';
  let out = '';
  let prev = key(blankStyle());
  for (let i = 0; i < text.length; i++) {
    const st = styleAt(i);
    const k = key(st);
    if (k !== prev) {
      if (prev !== key(blankStyle())) out += '\u001b[0m';
      const codes = ansiCodes(st);
      if (codes.length) out += '\u001b[' + codes.join(';') + 'm';
      prev = k;
    }
    out += text[i];
  }
  if (prev !== key(blankStyle())) out += '\u001b[0m';
  return '```ansi\n' + out + '\n```';
}
function renderPreview() {
  const text = el.msg.value;
  if (!text) {
    el.preview.innerHTML = '<span class="helper">Type a message before copying your Discord ansi block.</span>';
    return;
  }
  let html = '';
  let open = '';
  for (let i = 0; i < text.length; i++) {
    const st = styleAt(i);
    const cls = [st.foreground ? 'fg-' + st.foreground : '', st.background ? 'bg-' + st.background : '', st.bold ? 'bold' : '', st.underline ? 'underline' : ''].filter(Boolean).join(' ');
    if (cls !== open) {
      if (open) html += '</span>';
      if (cls) html += `<span class="${cls}">`;
      open = cls;
    }
    html += text[i] === '\n' ? '<br/>' : esc(text[i]);
  }
  if (open) html += '</span>';
  el.preview.innerHTML = html;
}
function render() {
  normalize();
  renderPreview();
  el.output.textContent = buildAnsi();
  lastText = el.msg.value;
}
function selectOutput() {
  selectElementText(el.output);
}
document.querySelector('#copy').addEventListener('click', async () => {
  if (!el.msg.value.trim()) {
    setStatus('Type a message before copying your Discord ansi block.');
    return;
  }
  setStatus('Preparing block...');
  try {
    await copyText(buildAnsi());
    setStatus('Copied for Discord.');
    window.fgTrack?.('discord_ansi_copied', { spans: spans.length });
  } catch (e) {
    setStatus('Copy failed. The generated block is selected so you can copy it manually.');
    selectOutput();
  }
});
document.querySelector('#clear-selected').addEventListener('click', () => {
  const [start, end] = selected();
  if (start === end) {
    setStatus('Select text first, then clear selected formatting.');
    return;
  }
  setRangeStyle(start, end, blankStyle());
  setStatus('Cleared selected formatting.');
});
document.querySelector('#clear-all').addEventListener('click', () => {
  spans = [];
  lastApplied = blankStyle();
  updatePressedStates();
  render();
  setStatus('Reset codes are included to help prevent colors from bleeding into the rest of your message.');
});
el.msg.addEventListener('input', () => {
  syncSpansAfterTextEdit(lastText, el.msg.value);
  render();
});
el.msg.addEventListener('select', () => setStatus('Select a word or line, then apply a color or style.'));
function lists() {
  document.querySelector('#fg-list').innerHTML = colors.map(c => `<li><span class="swatch" style="background:${c.hex}"></span><strong>${c.label}</strong> — ANSI ${c.fg}</li>`).join('');
  document.querySelector('#bg-list').innerHTML = colors.map(c => `<li><span class="swatch" style="background:${c.bgHex}"></span><strong>${c.label}</strong> — ANSI ${c.bg}</li>`).join('');
  document.querySelector('#faq-list').innerHTML = faq.map((f, i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
}
addButtons();
lists();
spans = [
  { start: 0, end: 9, foreground: 'red', background: null, bold: true, underline: false },
  { start: 10, end: 16, foreground: 'yellow', background: null, bold: false, underline: true },
  { start: 24, end: 33, foreground: 'cyan', background: null, bold: false, underline: false }
];
lastApplied = blankStyle();
updatePressedStates();
render();
