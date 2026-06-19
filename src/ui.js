export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

export function createToast(status) {
  let statusTimer = null;
  let statusFadeTimer = null;
  return function setStatus(message) {
    if (!status) return;
    status.textContent = message;
    status.dataset.toastVisible = 'true';
    window.clearTimeout(statusTimer);
    window.clearTimeout(statusFadeTimer);
    status.style.setProperty('transition', 'none', 'important');
    status.style.setProperty('visibility', 'visible', 'important');
    status.style.setProperty('opacity', '1', 'important');
    status.style.setProperty('transform', 'translate(-50%, 0)', 'important');
    statusTimer = window.setTimeout(() => {
      status.style.setProperty('transition', 'opacity .35s ease, transform .35s ease', 'important');
      delete status.dataset.toastVisible;
      status.style.removeProperty('opacity');
      status.style.removeProperty('transform');
      statusFadeTimer = window.setTimeout(() => {
        status.style.removeProperty('transition');
        status.style.removeProperty('visibility');
      }, 380);
    }, 2200);
  };
}

export function selectElementText(node) {
  if (!node) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  node.focus({ preventScroll: true });
}

function fallbackCopyText(value) {
  const previousFocus = document.activeElement;
  const selection = window.getSelection();
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.setAttribute('data-clarity-mask', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '2px';
  textarea.style.height = '2px';
  textarea.style.color = 'transparent';
  textarea.style.background = 'transparent';
  textarea.style.border = '0';
  textarea.style.padding = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let textareaCopied = false;
  try {
    textareaCopied = document.execCommand('copy');
  } finally {
    textarea.remove();
  }
  if (textareaCopied) {
    previousFocus?.focus?.({ preventScroll: true });
    return;
  }

  const editable = document.createElement('div');
  editable.contentEditable = 'true';
  editable.textContent = value;
  editable.setAttribute('aria-hidden', 'true');
  editable.setAttribute('data-clarity-mask', 'true');
  editable.style.position = 'fixed';
  editable.style.top = '0';
  editable.style.left = '0';
  editable.style.width = '2px';
  editable.style.height = '2px';
  editable.style.overflow = 'hidden';
  editable.style.color = 'transparent';
  editable.style.background = 'transparent';
  document.body.appendChild(editable);
  const range = document.createRange();
  range.selectNodeContents(editable);
  selection.removeAllRanges();
  selection.addRange(range);
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    selection.removeAllRanges();
    editable.remove();
    previousFocus?.focus?.({ preventScroll: true });
  }
  if (!copied) throw new Error('Fallback copy failed');
}

export async function copyText(value) {
  try {
    fallbackCopyText(value);
  } catch (err) {
    if (!navigator.clipboard?.writeText) throw err;
    await navigator.clipboard.writeText(value);
  }
}

export function downloadText(filename, value, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([value], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
