import { createToast } from './ui.js';

const DEFAULTS = Object.freeze({
  background: '#8ACE00',
  textColor: '#111111',
  alignment: 'center',
  aspect: '1:1',
  squareSize: 1080,
  textSize: 100,
  blur: 1.5,
  lowercase: true,
  pixelated: false,
  format: 'png'
});

const BACKGROUND_TEXT_COLORS = Object.freeze({
  '#8ACE00': '#111111',
  '#FFFFFF': '#111111',
  '#111111': '#FFFFFF',
  '#FB0080': '#111111',
  transparent: '#111111'
});

const MIME_TYPES = Object.freeze({
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp'
});

const FILE_EXTENSIONS = Object.freeze({
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp'
});

const el = {
  text: document.querySelector('#brat-text'),
  canvas: document.querySelector('#brat-canvas'),
  canvasFrame: document.querySelector('.brat-canvas-frame'),
  sizeBadge: document.querySelector('.brat-size-badge'),
  backgroundPresets: document.querySelector('#brat-background-presets'),
  backgroundColor: document.querySelector('#brat-background-color'),
  textColor: document.querySelector('#brat-text-color'),
  alignment: document.querySelector('#brat-alignment'),
  aspect: document.querySelector('#brat-aspect'),
  squareSize: document.querySelector('#brat-square-size'),
  squareSizeValue: document.querySelector('#brat-square-size-value'),
  textSize: document.querySelector('#brat-text-size'),
  textSizeValue: document.querySelector('#brat-text-size-value'),
  blur: document.querySelector('#brat-blur'),
  blurValue: document.querySelector('#brat-blur-value'),
  lowercase: document.querySelector('#brat-lowercase'),
  pixelated: document.querySelector('#brat-pixelated'),
  format: document.querySelector('#brat-format'),
  download: document.querySelector('#brat-download'),
  copy: document.querySelector('#brat-copy'),
  reset: document.querySelector('#brat-reset'),
  status: document.querySelector('#brat-status')
};

const setStatus = createToast(el.status);
const state = { ...DEFAULTS };
let renderFrame = 0;

function imageDimensions() {
  if (state.aspect === '9:16') return { width: 1080, height: 1920 };
  if (state.aspect === '16:9') return { width: 1920, height: 1080 };
  const size = Math.max(512, Math.min(2048, Number(state.squareSize) || DEFAULTS.squareSize));
  return { width: size, height: size };
}

function normalizedText() {
  const value = String(el.text?.value || '').replace(/\r\n?/g, '\n').slice(0, 240);
  return state.lowercase ? value.toLocaleLowerCase() : value;
}

function canvasFont(size) {
  return `400 ${Math.max(1, size)}px "Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif`;
}

function breakLongToken(ctx, token, maxLogicalWidth) {
  if (ctx.measureText(token).width <= maxLogicalWidth) return [token];
  const parts = [];
  let current = '';
  for (const character of Array.from(token)) {
    const candidate = `${current}${character}`;
    if (current && ctx.measureText(candidate).width > maxLogicalWidth) {
      parts.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }
  if (current) parts.push(current);
  return parts.length ? parts : [''];
}

function wrapParagraph(ctx, paragraph, maxLogicalWidth) {
  if (!paragraph.length) return [''];
  const rawWords = paragraph.trim().split(/\s+/).filter(Boolean);
  if (!rawWords.length) return [''];
  const words = rawWords.flatMap(word => breakLongToken(ctx, word, maxLogicalWidth));
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxLogicalWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function makeLayout(ctx, text, fontSize, width, height) {
  const horizontalScale = 0.72;
  const maxWidth = width * 0.82;
  const maxHeight = height * 0.74;
  const maxLogicalWidth = maxWidth / horizontalScale;
  ctx.font = canvasFont(fontSize);
  const lines = text
    .split('\n')
    .flatMap(paragraph => wrapParagraph(ctx, paragraph, maxLogicalWidth));
  const lineHeight = fontSize * 1.08;
  const measuredWidths = lines.map(line => ctx.measureText(line || ' ').width * horizontalScale);
  const totalHeight = Math.max(lineHeight, lines.length * lineHeight);
  return {
    fontSize,
    horizontalScale,
    lineHeight,
    lines,
    measuredWidths,
    totalHeight,
    maxWidth,
    maxHeight,
    fits: totalHeight <= maxHeight && measuredWidths.every(lineWidth => lineWidth <= maxWidth + .5)
  };
}

function fitText(ctx, text, width, height) {
  const desired = Math.max(14, Math.min(width, height) * .22 * (state.textSize / 100));
  let layout = makeLayout(ctx, text, desired, width, height);
  if (layout.fits) return layout;

  let low = Math.max(10, Math.min(width, height) * .025);
  let high = desired;
  let best = makeLayout(ctx, text, low, width, height);
  for (let pass = 0; pass < 18; pass += 1) {
    const candidateSize = (low + high) / 2;
    const candidate = makeLayout(ctx, text, candidateSize, width, height);
    if (candidate.fits) {
      best = candidate;
      low = candidateSize;
    } else {
      high = candidateSize;
    }
  }
  return best;
}

function drawJustifiedLine(ctx, line, logicalLeft, logicalWidth, y, isFinalLine) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || isFinalLine) {
    ctx.textAlign = 'center';
    ctx.fillText(line, logicalLeft + (logicalWidth / 2), y);
    return;
  }
  const wordsWidth = words.reduce((total, word) => total + ctx.measureText(word).width, 0);
  const gap = Math.max(0, (logicalWidth - wordsWidth) / (words.length - 1));
  let x = logicalLeft;
  ctx.textAlign = 'left';
  for (const word of words) {
    ctx.fillText(word, x, y);
    x += ctx.measureText(word).width + gap;
  }
}

function drawComposition(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  if (state.background !== 'transparent') {
    ctx.fillStyle = state.background;
    ctx.fillRect(0, 0, width, height);
  }

  const text = normalizedText();
  if (!text.trim()) return;

  const layout = fitText(ctx, text, width, height);
  const logicalWidth = layout.maxWidth / layout.horizontalScale;
  const logicalLeft = ((width - layout.maxWidth) / 2) / layout.horizontalScale;
  const startY = (height - layout.totalHeight) / 2;
  const blur = Math.max(0, state.blur) * (width / 1080);

  ctx.save();
  ctx.scale(layout.horizontalScale, 1);
  ctx.font = canvasFont(layout.fontSize);
  ctx.fillStyle = state.textColor;
  ctx.textBaseline = 'top';
  ctx.filter = blur > .02 ? `blur(${blur}px)` : 'none';

  layout.lines.forEach((line, index) => {
    const y = startY + (index * layout.lineHeight);
    if (state.alignment === 'right') {
      ctx.textAlign = 'right';
      ctx.fillText(line, logicalLeft + logicalWidth, y);
      return;
    }
    if (state.alignment === 'justify') {
      drawJustifiedLine(ctx, line, logicalLeft, logicalWidth, y, index === layout.lines.length - 1);
      return;
    }
    ctx.textAlign = 'center';
    ctx.fillText(line, logicalLeft + (logicalWidth / 2), y);
  });
  ctx.restore();
}

function paintCanvas(canvas, width, height) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas is unavailable in this browser.');

  if (!state.pixelated) {
    drawComposition(ctx, width, height);
    return;
  }

  const pixelRatio = .24;
  const lowWidth = Math.max(1, Math.round(width * pixelRatio));
  const lowHeight = Math.max(1, Math.round(height * pixelRatio));
  const lowCanvas = document.createElement('canvas');
  lowCanvas.width = lowWidth;
  lowCanvas.height = lowHeight;
  const lowCtx = lowCanvas.getContext('2d', { alpha: true });
  if (!lowCtx) throw new Error('Canvas is unavailable in this browser.');

  drawComposition(lowCtx, lowWidth, lowHeight);

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(lowCanvas, 0, 0, width, height);
}

function scheduleRender() {
  window.cancelAnimationFrame(renderFrame);
  renderFrame = window.requestAnimationFrame(() => {
    const { width, height } = imageDimensions();
    paintCanvas(el.canvas, width, height);
    if (height > width) {
      el.canvas.style.width = 'auto';
      el.canvas.style.height = '100%';
    } else if (width > height) {
      el.canvas.style.width = '100%';
      el.canvas.style.height = 'auto';
    } else {
      el.canvas.style.width = '100%';
      el.canvas.style.height = '100%';
    }
    const sizeLabel = `${width} × ${height}`;
    if (el.sizeBadge.textContent !== sizeLabel) el.sizeBadge.textContent = sizeLabel;
    const previewText = normalizedText().trim().replace(/\s+/g, ' ').slice(0, 80) || 'empty text';
    const backgroundLabel = state.background === 'transparent' ? 'transparent background' : `${state.background} background`;
    el.canvas.setAttribute('aria-label', `Brat-style preview of “${previewText}” on ${backgroundLabel}, ${width} by ${height} pixels`);
  });
}

function setPressed(container, selector, value, attribute) {
  container?.querySelectorAll(selector).forEach(button => {
    const active = button.getAttribute(attribute) === value;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function updateColorLabel(input) {
  const picker = input?.closest('.brat-color-input');
  const value = picker?.querySelector('.brat-color-value');
  if (!picker || !value) return;
  value.textContent = input.value.toUpperCase();
}

function updateControls() {
  setPressed(el.backgroundPresets, '[data-brat-bg]', state.background, 'data-brat-bg');
  setPressed(el.alignment, '[data-brat-align]', state.alignment, 'data-brat-align');
  setPressed(el.aspect, '[data-brat-aspect]', state.aspect, 'data-brat-aspect');
  setPressed(el.format, '[data-brat-format]', state.format, 'data-brat-format');
  el.backgroundColor.value = state.background === 'transparent' ? DEFAULTS.background : state.background;
  el.textColor.value = state.textColor;
  el.squareSize.value = String(state.squareSize);
  el.squareSize.disabled = state.aspect !== '1:1';
  el.squareSize.closest('.brat-range-field')?.toggleAttribute('data-disabled', state.aspect !== '1:1');
  el.textSize.value = String(state.textSize);
  el.blur.value = String(state.blur);
  el.lowercase.checked = state.lowercase;
  el.pixelated.checked = state.pixelated;
  el.squareSizeValue.textContent = `${state.squareSize} px`;
  el.textSizeValue.textContent = state.textSize === 100 ? 'Auto' : `${state.textSize}%`;
  el.blurValue.textContent = `${Number(state.blur).toFixed(1)} px`;
  updateColorLabel(el.backgroundColor);
  updateColorLabel(el.textColor);
}

function setFormat(format, { notify = false } = {}) {
  if (state.background === 'transparent' && format === 'jpeg') {
    state.format = 'png';
    updateControls();
    if (notify) setStatus('JPEG cannot keep transparency. PNG remains selected.');
    return false;
  }
  state.format = format;
  updateControls();
  return true;
}

function setBackground(background) {
  state.background = background;
  state.textColor = BACKGROUND_TEXT_COLORS[background] || state.textColor;
  if (background === 'transparent' && state.format === 'jpeg') {
    state.format = 'png';
    setStatus('Transparent background selected. Format changed to PNG.');
  }
  updateControls();
  scheduleRender();
}

function canvasBlob(canvas, type, quality = .92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('This browser could not create the image file.'));
    }, type, quality);
  });
}

function outputFilename(extension) {
  const slug = normalizedText()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'brat-image';
  return `${slug}-brat.${extension}`;
}

async function makeExportBlob(format = state.format) {
  const { width, height } = imageDimensions();
  const canvas = document.createElement('canvas');
  paintCanvas(canvas, width, height);
  const requestedType = MIME_TYPES[format] || MIME_TYPES.png;
  return canvasBlob(canvas, requestedType);
}

function track(eventName, result, extra = {}) {
  window.fgTrack?.(eventName, {
    result,
    format: state.format,
    aspect: state.aspect,
    preset: Object.hasOwn(BACKGROUND_TEXT_COLORS, state.background) ? state.background : 'custom',
    ...extra
  });
}

async function downloadImage() {
  if (!normalizedText().trim()) {
    el.text.focus();
    setStatus('Type some text before downloading.');
    track('brat_export', 'empty');
    return;
  }
  el.download.disabled = true;
  try {
    const blob = await makeExportBlob();
    const actualExtension = FILE_EXTENSIONS[blob.type] || state.format;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFilename(actualExtension);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`Downloaded ${actualExtension.toUpperCase()} image.`);
    track('brat_export', 'success', { delivered_format: actualExtension });
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Image download failed.');
    track('brat_export', 'failed');
  } finally {
    el.download.disabled = false;
  }
}

async function copyImage() {
  if (!normalizedText().trim()) {
    el.text.focus();
    setStatus('Type some text before copying.');
    track('brat_copy', 'empty');
    return;
  }
  if (!navigator.clipboard?.write || typeof window.ClipboardItem !== 'function') {
    setStatus('Image copy is not available here. Download PNG instead.');
    track('brat_copy', 'unsupported');
    return;
  }
  el.copy.disabled = true;
  try {
    const blob = await makeExportBlob('png');
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    setStatus('Copied PNG image.');
    track('brat_copy', 'success');
  } catch (error) {
    setStatus('This browser blocked image copying. Download PNG instead.');
    track('brat_copy', 'blocked');
  } finally {
    el.copy.disabled = false;
  }
}

function resetGenerator() {
  Object.assign(state, DEFAULTS);
  el.text.value = 'brat';
  updateControls();
  scheduleRender();
  setStatus('Generator reset.');
  track('brat_reset', 'success');
}

function bindControls() {
  el.text.addEventListener('input', scheduleRender);
  el.backgroundPresets.addEventListener('click', event => {
    const button = event.target.closest('[data-brat-bg]');
    if (button) setBackground(button.dataset.bratBg);
  });
  el.backgroundColor.addEventListener('input', () => {
    state.background = el.backgroundColor.value.toUpperCase();
    updateControls();
    scheduleRender();
  });
  el.textColor.addEventListener('input', () => {
    state.textColor = el.textColor.value.toUpperCase();
    updateControls();
    scheduleRender();
  });
  el.alignment.addEventListener('click', event => {
    const button = event.target.closest('[data-brat-align]');
    if (!button) return;
    state.alignment = button.dataset.bratAlign;
    updateControls();
    scheduleRender();
  });
  el.aspect.addEventListener('click', event => {
    const button = event.target.closest('[data-brat-aspect]');
    if (!button) return;
    state.aspect = button.dataset.bratAspect;
    updateControls();
    scheduleRender();
  });
  el.squareSize.addEventListener('input', () => {
    state.squareSize = Number(el.squareSize.value);
    updateControls();
    scheduleRender();
  });
  el.textSize.addEventListener('input', () => {
    state.textSize = Number(el.textSize.value);
    updateControls();
    scheduleRender();
  });
  el.blur.addEventListener('input', () => {
    state.blur = Number(el.blur.value);
    updateControls();
    scheduleRender();
  });
  el.lowercase.addEventListener('change', () => {
    state.lowercase = el.lowercase.checked;
    scheduleRender();
  });
  el.pixelated.addEventListener('change', () => {
    state.pixelated = el.pixelated.checked;
    scheduleRender();
  });
  el.format.addEventListener('click', event => {
    const button = event.target.closest('[data-brat-format]');
    if (button && setFormat(button.dataset.bratFormat, { notify: true })) scheduleRender();
  });
  el.download.addEventListener('click', downloadImage);
  el.copy.addEventListener('click', copyImage);
  el.reset.addEventListener('click', resetGenerator);
}

async function init() {
  bindControls();
  updateControls();
  if (!navigator.clipboard?.write || typeof window.ClipboardItem !== 'function') {
    el.copy.title = 'Image copying is unavailable in this browser. Download PNG instead.';
  }
  try {
    await document.fonts?.ready;
  } finally {
    scheduleRender();
  }
}

init();
