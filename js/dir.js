// LTR/RTL + Bootstrap CSS swap (safe and fast)
(function () {
  const RTL_LANGS = new Set(['ar','he','fa','ur','ps','ku','dv','ug','sd','syr']);
  const html = document.documentElement;
  const bootstrapLink = document.getElementById('bootstrap-css');
  const baseHref = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap';

  function applyDirByLang(langCode) {
    const code = (langCode || 'en').toLowerCase().split('-')[0];
    const dir = RTL_LANGS.has(code) ? 'rtl' : 'ltr';

    // Flip <html dir>
    if (html.getAttribute('dir') !== dir) html.setAttribute('dir', dir);

    // Swap Bootstrap LTR/RTL stylesheet if needed
    if (bootstrapLink) {
      const target = dir === 'rtl' ? `${baseHref}.rtl.min.css` : `${baseHref}.min.css`;
      if (bootstrapLink.href !== target) {
        bootstrapLink.href = target;
      }
    }

    // Helper class for any custom RTL tweaks
    document.body.classList.toggle('rtl', dir === 'rtl');
  }

  // Expose a tiny API for i18n.js to call
  window.__dir = { applyDirByLang };
})();