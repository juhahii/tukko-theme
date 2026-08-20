(function () {
  'use strict';
  var KEY = 'tukko-consent';
  var cfgEl = document.getElementById('tukko-consent-config');
  if (!cfgEl) return;
  var cfg = {};
  try { cfg = JSON.parse(cfgEl.textContent || '{}'); } catch (e) { return; }
  var systems = cfg.systems || [];
  var banner = document.getElementById('cookie-banner');
  var settings = document.getElementById('cookie-settings');
  var loaded = {};

  function ids() {
    return systems.map(function (s) { return s.id; }).filter(Boolean).sort().join(',');
  }

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }

  function write(choices) {
    localStorage.setItem(KEY, JSON.stringify({
      v: 1,
      ids: ids(),
      ts: new Date().toISOString(),
      systems: choices
    }));
  }

  function defaultChoices(allOn) {
    var out = {};
    systems.forEach(function (s) {
      if (s.inBanner === false) return;
      out[s.id] = !!s.required || !!allOn;
    });
    return out;
  }

  function needsPrompt(stored) {
    if (!stored || !stored.systems) return true;
    if (stored.ids !== ids()) return true;
    return false;
  }

  function loadGa4(id) {
    if (!id || loaded['ga4:' + id]) return;
    loaded['ga4:' + id] = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    s.onload = function () {
      window.gtag('js', new Date());
      window.gtag('config', id);
    };
    document.head.appendChild(s);
  }

  function loadScript(src) {
    if (!src || loaded[src]) return;
    loaded[src] = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function apply(choices) {
    systems.forEach(function (s) {
      if (!choices[s.id]) return;
      if (s.type === 'ga4' && s.measurementId) loadGa4(s.measurementId);
      if (s.type === 'script' && s.scriptSrc) loadScript(s.scriptSrc);
      if (s.type === 'gtm' && s.measurementId) {
        if (loaded['gtm:' + s.measurementId]) return;
        loaded['gtm:' + s.measurementId] = true;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
        var t = document.createElement('script');
        t.async = true;
        t.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(s.measurementId);
        document.head.appendChild(t);
      }
    });
  }

  function syncChecks(choices) {
    document.querySelectorAll('#cookie-settings [data-system]').forEach(function (el) {
      if (el.disabled) { el.checked = true; return; }
      el.checked = !!choices[el.getAttribute('data-system')];
    });
  }

  function showBanner(on) {
    if (banner) banner.hidden = !on;
  }
  function showSettings(on) {
    if (settings) settings.hidden = !on;
  }

  function saveFromChecks() {
    var choices = defaultChoices(false);
    document.querySelectorAll('#cookie-settings [data-system]').forEach(function (el) {
      var id = el.getAttribute('data-system');
      choices[id] = el.disabled ? true : !!el.checked;
    });
    write(choices);
    apply(choices);
    showSettings(false);
    showBanner(false);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-consent]');
    if (!btn) return;
    var act = btn.getAttribute('data-consent');
    if (act === 'all') {
      var all = defaultChoices(true);
      write(all);
      apply(all);
      showBanner(false);
      showSettings(false);
    } else if (act === 'necessary') {
      var nec = defaultChoices(false);
      write(nec);
      apply(nec);
      showBanner(false);
      showSettings(false);
    } else if (act === 'customize') {
      syncChecks((read() && read().systems) || defaultChoices(false));
      showSettings(true);
    } else if (act === 'save') {
      saveFromChecks();
    } else if (act === 'close-settings') {
      showSettings(false);
    } else if (act === 'open') {
      showBanner(true);
    }
  });

  window.tukkoOpenConsent = function () {
    var stored = read();
    syncChecks((stored && stored.systems) || defaultChoices(false));
    showSettings(true);
  };

  var stored = read();
  if (needsPrompt(stored)) {
    showBanner(true);
  } else {
    apply(stored.systems);
  }
})();
