// Language loader + DOM replacement (merges with English fallback)
(function () {
  const html = document.documentElement;
  const switcher = document.getElementById('langSwitcher');
  const formPicker = document.getElementById('subLang');

  let currentLang = null;
  let dict = {};
  let enDict = null; // cached English for fallback merge

  async function fetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
    return res.json();
  }

  async function loadLang(lang) {
    const code = (lang || 'en').toLowerCase().split('-')[0];

    // Always ensure we have English to merge against
    if (!enDict) {
      enDict = await fetchJson('js/i18n/en.json');
    }

    if (code === 'en') {
      return { ...enDict };
    }

    // Load target language and shallow-merge over English for missing keys
    const target = await fetchJson(`js/i18n/${code}.json`);
    return { ...enDict, ...target };
  }

  function applyText(node, key, value) {
    // 1) Attribute mapping support: data-i18n-attr="title,aria-label"
    const attrList = (node.getAttribute('data-i18n-attr') || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (attrList.length) {
      // If there are attribute targets, put the translation into them
      attrList.forEach(attr => node.setAttribute(attr, value));
    } else {
      // Default: replace text content
      node.textContent = value;
    }
  }

  function applyTranslations() {
    // All elements with a data-i18n key
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const value = dict[key];
      if (value == null) return; // leave original content if key missing
      applyText(el, key, value);
    });
  }

  async function setLanguage(lang) {
    const code = (lang || 'en').toLowerCase().split('-')[0];
    if (currentLang === code) return;

    try {
      dict = await loadLang(code);
      currentLang = code;

      // Update <html lang> for AT & SEO; flip direction + Bootstrap via dir.js
      html.lang = code;
      window.__dir?.applyDirByLang(code);

      // Update the UI strings
      applyTranslations();

      // Persist choice
      localStorage.setItem('site_lang', code);

      // Sync pickers if present
      if (switcher && switcher.value !== code) switcher.value = code;
      if (formPicker && formPicker.value !== code) formPicker.value = code;
    } catch (err) {
      console.error(err);
      // Hard fallback to English if the target fails
      if (code !== 'en') setLanguage('en');
    }
  }

  // Init on first paint (prefer saved choice, then <html lang>, else EN)
  setLanguage(localStorage.getItem('site_lang') || html.lang || 'en');

  // Events: topbar switcher and form language preview
  switcher?.addEventListener('change', (e) => setLanguage(e.target.value));
  formPicker?.addEventListener('change', (e) => {
    const v = e.target.value;
    if (v) setLanguage(v);
  });

  // Public API (handy for debugging in console)
  window.__i18n = { setLanguage };
})();