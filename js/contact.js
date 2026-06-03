(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form || !form.hasAttribute('data-ezlaunch')) return;

  const successPanel = document.getElementById('contact-success');
  const successText = document.getElementById('contact-success-text');
  const resetBtn = document.getElementById('contact-reset');
  const submitBtn = form.querySelector('.contact-submit');
  const EZLAUNCH_FORM_ACTION = /^https:\/\/app\.ezlaunch\.app\/api\/forms\//;

  function showSuccess() {
    const email = form.querySelector('[name="email"]')?.value?.trim();
    form.hidden = true;
    if (successPanel) successPanel.hidden = false;
    if (successText && email) {
      successText.textContent =
        "We've received your message and will get back to you within 24 hours at " + email + '.';
    }
  }

  function showForm() {
    form.hidden = false;
    if (successPanel) successPanel.hidden = true;
    form.reset();
    clearError();
  }

  function clearError() {
    const err = form.querySelector('.contact-form__error');
    if (err) err.remove();
  }

  function showError(message) {
    clearError();
    const el = document.createElement('p');
    el.className = 'contact-form__error';
    el.setAttribute('role', 'alert');
    el.textContent = message;
    submitBtn?.before(el);
  }

  function setSubmitting(busy) {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    const label = submitBtn.querySelector('.contact-submit__text');
    if (label) label.textContent = busy ? 'Sending…' : 'Send message';
  }

  function isSubmissionSuccess(response) {
    if (response.type === 'opaqueredirect') return true;
    if (response.status === 303 || response.status === 302) return true;
    return response.ok;
  }

  async function submitViaFetch(action) {
    const body = new FormData(form);
    const response = await fetch(action, {
      method: 'POST',
      body,
      redirect: 'manual',
      credentials: 'omit',
    });

    if (isSubmissionSuccess(response)) return;
    throw new Error('submit_failed');
  }

  form.addEventListener('submit', async (event) => {
    const action = form.getAttribute('action') || '';
    if (!EZLAUNCH_FORM_ACTION.test(action)) return;

    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    clearError();
    setSubmitting(true);

    try {
      await submitViaFetch(action);
      showSuccess();
    } catch {
      showError('Something went wrong. Please try again or email support@ezlaunch.app.');
    } finally {
      setSubmitting(false);
    }
  });

  ['ezlaunch:success', 'ezlaunch:form-success', 'ezlaunch-form-success'].forEach((eventName) => {
    form.addEventListener(eventName, showSuccess);
    document.addEventListener(eventName, showSuccess);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', showForm);
  }
})();
