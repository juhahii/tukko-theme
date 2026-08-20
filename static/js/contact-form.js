(function () {
  'use strict';

  function encode(form) {
    var fd = new FormData(form);
    var params = new URLSearchParams();
    fd.forEach(function (value, key) {
      params.append(key, value);
    });
    return params.toString();
  }

  function bind(box) {
    var form = box.querySelector('form.contact-form');
    var success = box.querySelector('.contact-form-success');
    var error = box.querySelector('.contact-form-error');
    var button = form && form.querySelector('button[type="submit"]');
    if (!form || !success || !button) return;

    var idleLabel = button.getAttribute('data-label') || button.textContent;
    var busyLabel = button.getAttribute('data-busy') || 'Lähetetään…';

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (error) error.hidden = true;
      button.disabled = true;
      button.textContent = busyLabel;
      form.setAttribute('aria-busy', 'true');

      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(form)
      }).then(function (res) {
        if (!res.ok) throw new Error('submit failed');
        form.hidden = true;
        success.hidden = false;
        box.classList.add('is-success');
        success.focus();
      }).catch(function () {
        if (error) error.hidden = false;
        button.disabled = false;
        button.textContent = idleLabel;
        form.removeAttribute('aria-busy');
      });
    });
  }

  document.querySelectorAll('[data-contact-form]').forEach(bind);
})();
