(function () {
  'use strict';

  const DEPLOY_URL = 'https://app.ezlaunch.app/api/preview/deploy';
  // Must match PREVIEW_MAX_BYTES in the app (app/api/preview/deploy → 413 above it).
  const MAX_BYTES = 50 * 1024 * 1024;

  const root = document.getElementById('hero-preview');
  const input = document.getElementById('hero-preview-input');
  const dropzone = document.getElementById('hero-preview-dropzone');
  const filenameEl = document.getElementById('hero-preview-filename');
  const errorEl = document.getElementById('hero-preview-error');

  if (!root || !input || !dropzone) return;

  const frame = dropzone.closest('.hero-preview__frame');
  const borderSvg = frame && frame.querySelector('.hero-preview__border');
  const borderTrack = borderSvg && borderSvg.querySelector('.hero-preview__border-track');
  const borderGlow = borderSvg && borderSvg.querySelector('.hero-preview__border-glow');
  const BORDER_RADIUS = 16;
  const STROKE_INSET = 1;

  function roundRectPath(width, height, radius, inset) {
    const x = inset;
    const y = inset;
    const w = width - inset * 2;
    const h = height - inset * 2;
    const r = Math.min(radius, w / 2, h / 2);
    return [
      `M ${x + r} ${y}`,
      `H ${x + w - r}`,
      `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
      `V ${y + h - r}`,
      `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
      `H ${x + r}`,
      `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
      `V ${y + r}`,
      `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
      'Z',
    ].join(' ');
  }

  function updateBorderPath() {
    if (!frame || !borderSvg || !borderTrack || !borderGlow) return;
    const width = frame.offsetWidth;
    const height = frame.offsetHeight;
    if (!width || !height) return;
    const d = roundRectPath(width, height, BORDER_RADIUS, STROKE_INSET);
    borderTrack.setAttribute('d', d);
    borderGlow.setAttribute('d', d);
    borderSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  if (frame) {
    updateBorderPath();
    window.addEventListener('resize', updateBorderPath);
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(updateBorderPath).observe(frame);
    }
  }

  const ERROR_MESSAGES = {
    400: "That ZIP doesn't look valid. Make sure it contains an index.html at the root.",
    403: "Preview isn't available from this page. Visit ezlaunch.app and try again.",
    413: 'That ZIP is too large for a free preview. Keep it under 50 MB — sign up to publish bigger sites.',
    429: 'Too many preview uploads from your network. Wait 10 minutes and try again.',
    500: 'Our preview service is temporarily unavailable. Please try again in a few minutes.',
    503: 'Our preview service is temporarily unavailable. Please try again in a few minutes.',
    network: "Couldn't reach the server. Check your connection and try again.",
  };

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function isZipFile(file) {
    return /\.zip$/i.test(file.name);
  }

  function validateFile(file) {
    if (!file) return 'Please choose a .zip file.';
    if (!isZipFile(file)) return 'Only .zip files are supported.';
    if (file.size > MAX_BYTES) return ERROR_MESSAGES[413];
    return null;
  }

  function setState(state) {
    root.dataset.state = state;
    dropzone.setAttribute('aria-busy', state === 'uploading' ? 'true' : 'false');
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    setState('error');
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  function isUploading() {
    return root.dataset.state === 'uploading';
  }

  async function deployZip(file) {
    const body = new FormData();
    body.append('file', file);

    let res;
    try {
      res = await fetch(DEPLOY_URL, {
        method: 'POST',
        body,
        credentials: 'omit',
      });
    } catch (_) {
      showError(ERROR_MESSAGES.network);
      return;
    }

    if (res.ok) {
      let data;
      try {
        data = await res.json();
      } catch (_) {
        showError(ERROR_MESSAGES.network);
        return;
      }

      if (data && data.preview_url) {
        window.location.assign(data.preview_url);
        return;
      }

      showError(ERROR_MESSAGES.network);
      return;
    }

    // 429 carries which limit was hit (10-minute burst or daily) and a
    // Retry-After; prefer the server's wording over the generic fallback.
    if (res.status === 429) {
      let serverMessage = '';
      try {
        const data = await res.json();
        if (data && typeof data.error === 'string') serverMessage = data.error;
      } catch (_) {}
      const retryAfter = parseInt(res.headers.get('Retry-After') || '', 10);
      if (!serverMessage && retryAfter > 0) {
        const minutes = Math.max(1, Math.ceil(retryAfter / 60));
        serverMessage = 'Too many preview uploads from your network. Try again in ' + minutes + ' minute' + (minutes === 1 ? '' : 's') + '.';
      }
      showError(serverMessage || ERROR_MESSAGES[429]);
      return;
    }

    const message = ERROR_MESSAGES[res.status] || ERROR_MESSAGES[500];
    showError(message);
  }

  async function handleFile(file) {
    if (isUploading()) return;

    clearError();

    const validationError = validateFile(file);
    if (validationError) {
      showError(validationError);
      input.value = '';
      return;
    }

    if (filenameEl) {
      filenameEl.textContent = file.name + ' · ' + formatSize(file.size);
    }

    setState('uploading');
    await deployZip(file);
    input.value = '';

    if (root.dataset.state === 'uploading') {
      setState('idle');
    }
  }

  dropzone.addEventListener('click', () => {
    if (isUploading()) return;
    input.click();
  });

  dropzone.addEventListener('keydown', (event) => {
    if (isUploading()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      input.click();
    }
  });

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (file) handleFile(file);
  });

  ['dragenter', 'dragover'].forEach((type) => {
    dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      if (isUploading()) return;
      dropzone.classList.add('is-dragover');
    });
  });

  dropzone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    if (!dropzone.contains(event.relatedTarget)) {
      dropzone.classList.remove('is-dragover');
    }
  });

  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('is-dragover');
    if (isUploading()) return;

    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) handleFile(file);
  });
})();
