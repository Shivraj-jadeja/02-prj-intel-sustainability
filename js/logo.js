// Intel header SVG animation (with reduced motion + safe fallback)
window.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const Intel = {
    ovalBorder:'#oval-border', iDot:'#rect', i:'#path10',
    n:'#path18', t:'#path14', e:'#path16', l:'#path8', copy:'#text2177'
  };

  const showStatic = () => {
    for (const sel of Object.values(Intel)) {
      const el = document.querySelector(sel);
      if (el) el.style.opacity = 1;
    }
  };

  if (reduce || typeof anime === 'undefined') {
    showStatic();
    return;
  }

  try {
    const tl = anime.timeline({
      duration: 1000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    tl.add({ targets: Intel.iDot, scale: [0,2,1,3,2,1], duration: 2000 })
      .add({ targets: Intel.i, opacity: [0,1] }, '-=800')
      .add({ targets: Intel.n, opacity: [0,1] }, '-=700')
      .add({ targets: Intel.t, opacity: [0,1] }, '-=600')
      .add({ targets: Intel.e, opacity: [0,1] }, '-=500')
      .add({ targets: Intel.l, opacity: [0,1] }, '-=400')
      .add({ targets: Intel.ovalBorder, opacity: [0,1] }, '-=300')
      .add({ targets: Intel.copy, opacity: [0,1] }, '-=300');
  } catch {
    showStatic();
  }
});