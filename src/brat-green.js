import { copyText, createToast, selectElementText } from './ui.js';

const status = document.querySelector('#brat-green-copy-status');
const copyButtons = Array.from(document.querySelectorAll('[data-copy-value]'));
const setStatus = createToast(status);
const restoreTimers = new WeakMap();

function restoreButton(button) {
  const text = button.querySelector('[data-copy-button-text]');
  const label = button.dataset.copyLabel || 'value';
  button.classList.remove('copied');
  button.removeAttribute('data-copy-state');
  button.setAttribute('aria-label', `Copy ${label}`);
  if (text) text.textContent = button.dataset.copyDefaultText || `Copy ${label}`;
}

function scheduleRestore(button) {
  const previousTimer = restoreTimers.get(button);
  window.clearTimeout(previousTimer);
  const timer = window.setTimeout(() => restoreButton(button), 1800);
  restoreTimers.set(button, timer);
}

async function handleCopy(button) {
  const value = button.dataset.copyValue || '';
  const label = button.dataset.copyLabel || 'value';
  const text = button.querySelector('[data-copy-button-text]');

  if (!value) {
    setStatus('No value is available to copy.');
    return;
  }

  button.disabled = true;
  try {
    await copyText(value);
    button.classList.add('copied');
    button.dataset.copyState = 'copied';
    button.setAttribute('aria-label', `Copied ${label}: ${value}`);
    if (text) text.textContent = 'Copied';
    setStatus(`Copied ${label}: ${value}`);
    scheduleRestore(button);
  } catch (error) {
    const describedId = button.getAttribute('aria-describedby');
    const valueNode = describedId ? document.getElementById(describedId) : null;
    selectElementText(valueNode);
    setStatus(`Couldn’t copy ${label}. The value is selected so you can copy it manually.`);
  } finally {
    button.disabled = false;
  }
}

copyButtons.forEach((button) => {
  const text = button.querySelector('[data-copy-button-text]');
  if (text) button.dataset.copyDefaultText = text.textContent;
  button.addEventListener('click', () => handleCopy(button));
});
