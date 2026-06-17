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

const faq = [
  { q: 'How do I make colored text in Discord?', a: 'Use an ansi code block in a supported Discord client. Type your message in this generator, select the text you want to style, choose supported ANSI colors or styles, then copy the full fenced ansi block and paste it into Discord.' },
  { q: 'What is a Discord color text generator?', a: 'A Discord color text generator creates ANSI-formatted code blocks for Discord. Instead of typing escape codes manually, you choose colors in a visual editor and copy a ready-to-paste block.' },
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
  status: document.querySelector('#copy-status'),
  active: document.querySelector('#active-sequence')
};
let spans = [];
let lastText = '';
let lastApplied = { foreground: 'green', background: null, bold: true, underline: false };
const blankStyle = () => ({ foreground: null, background: null, bold: false, underline: false });
const esc = s => s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function colorById(id) { return colors.find(c => c.id === id); }
function setStatus(message) { el.status.textContent = message; }
function selected() {
  const a = el.msg.selectionStart;
  const b = el.msg.selectionEnd;
  return [Math.min(a, b), Math.max(a, b)];
}
function updatePressedStates() {
  document.querySelectorAll('[data-fg]').forEach(btn => btn.setAttribute('aria-pressed', String(lastApplied.foreground === btn.dataset.fg)));
  document.querySelectorAll('[data-bg]').forEach(btn => btn.setAttribute('aria-pressed', String(lastApplied.background === btn.dataset.bg)));
  document.querySelectorAll('[data-style]').forEach(btn => btn.setAttribute('aria-pressed', String(Boolean(lastApplied[btn.dataset.style]))));
}
function renderActiveSequence() {
  if (!el.active) return;
  const codes = ansiCodes(lastApplied);
  el.active.innerHTML = codes.length
    ? `<code>[${codes.join(';')}m</code><span>selected text</span><code>[0m</code>`
    : '<code>[0m</code><span>plain selected text</span>';
}
function addButtons() {
  const formatButtons = document.querySelectorAll('[data-style]');
  formatButtons.forEach(button => {
    button.addEventListener('click', () => apply({ [button.dataset.style]: true }));
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
    fg.addEventListener('click', () => apply({ foreground: c.id }));
    el.fg.appendChild(fg);

    const bg = document.createElement('button');
    bg.type = 'button';
    bg.className = `color-chip${c.id === 'white' ? ' is-white' : ''}`;
    bg.style.background = c.bgHex;
    bg.dataset.bg = c.id;
    bg.setAttribute('aria-label', `Apply ${c.label} background color`);
    bg.setAttribute('aria-pressed', 'false');
    bg.innerHTML = `<span class="sr-only">${c.label}</span>`;
    bg.addEventListener('click', () => apply({ background: c.id }));
    el.bg.appendChild(bg);
  });
}
function apply(style) {
  const [start, end] = selected();
  const merged = { ...blankStyle(), ...style };
  lastApplied = { ...lastApplied, ...style };
  if (style.foreground) lastApplied.background = lastApplied.background ?? null;
  if (style.background) lastApplied.foreground = lastApplied.foreground ?? null;
  updatePressedStates();
  renderActiveSequence();
  if (start === end) {
    setStatus('Select text first, then apply a color or style.');
    el.msg.focus();
    return;
  }
  spans.push({ start, end, ...merged });
  normalize();
  render();
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
  const range = document.createRange();
  range.selectNodeContents(el.output);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  el.output.focus();
}
document.querySelector('#copy').addEventListener('click', async () => {
  if (!el.msg.value.trim()) {
    setStatus('Type a message before copying your Discord ansi block.');
    return;
  }
  setStatus('Preparing block...');
  try {
    await navigator.clipboard.writeText(buildAnsi());
    setStatus('Copied for Discord.');
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
  spans = spans.filter(s => s.end <= start || s.start >= end);
  render();
  setStatus('Cleared selected formatting.');
});
document.querySelector('#clear-all').addEventListener('click', () => {
  spans = [];
  lastApplied = blankStyle();
  updatePressedStates();
  renderActiveSequence();
  render();
  setStatus('Reset codes are included to help prevent colors from bleeding into the rest of your message.');
});
el.msg.addEventListener('input', () => {
  if (el.msg.value !== lastText) spans = [];
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
  { start: 0, end: 11, foreground: 'red', background: null, bold: true, underline: false },
  { start: 22, end: 26, foreground: 'yellow', background: null, bold: false, underline: true },
  { start: 27, end: 39, foreground: 'cyan', background: null, bold: false, underline: false }
];
lastApplied = { foreground: 'red', background: null, bold: true, underline: false };
updatePressedStates();
renderActiveSequence();
render();
