/* The Bardouille Collection — shared interactions.
   With JavaScript disabled, the cards are simply cards. This is acceptable. */

(() => {
  'use strict';

  /* Expose JavaScript-only controls without breaking the no-JS version. */
  document.documentElement.classList.add('js');

  /* Colophon year — the citation stays current so nobody has to file errata */
  const year = document.getElementById('cite-year');
  if (year) year.textContent = new Date().getFullYear();

  /* The desk lamp. Pull the cord. */
  const cord = document.getElementById('lamp-cord');
  if (cord) {
    const store = {
      get() { try { return localStorage.getItem('lamp'); } catch { return null; } },
      set(v) { try { localStorage.setItem('lamp', v); } catch { /* the dark is fine */ } },
    };
    const apply = (off) => {
      document.body.dataset.lamp = off ? 'off' : 'on';
      cord.setAttribute('aria-pressed', String(off));
    };
    apply(store.get() === 'off');
    cord.addEventListener('click', () => {
      const off = document.body.dataset.lamp !== 'off';
      apply(off);
      store.set(off ? 'off' : 'on');
      cord.classList.remove('swinging');
      void cord.offsetWidth; /* restart the swing */
      cord.classList.add('swinging');
    });
  }

  /* The tab title notices when you leave. It does not take it personally. */
  const away = document.body.dataset.awayTitle;
  if (away) {
    const original = document.title;
    document.addEventListener('visibilitychange', () => {
      document.title = document.hidden ? away : original;
    });
  }

  /* Card 1 flips. State lives on aria-expanded; CSS does the rotating. */
  let toggleFlip = null;
  const scene = document.querySelector('.flip-scene');
  if (scene) {
    const frontBtn = scene.querySelector('.flip-front [data-flip]');
    const front = scene.querySelector('.flip-front');
    const back = scene.querySelector('.flip-back');
    const setFlipped = (flipped) => {
      frontBtn.setAttribute('aria-expanded', String(flipped));
      /* Class drives the rotation; :has() in CSS is merely the backup */
      scene.classList.toggle('is-flipped', flipped);
      back.toggleAttribute('inert', !flipped);
      back.setAttribute('aria-hidden', String(!flipped));
      front.toggleAttribute('inert', flipped);
      front.setAttribute('aria-hidden', String(flipped));
      const focusTarget = flipped ? back.querySelector('a, button') : frontBtn;
      focusTarget?.focus({ preventScroll: true });
    };
    toggleFlip = () => setFlipped(frontBtn.getAttribute('aria-expanded') !== 'true');
    scene.querySelectorAll('[data-flip]').forEach((btn) => btn.addEventListener('click', toggleFlip));
  }

  /* Drawer shortcuts: 1 flips, 2 and 3 open drawers */
  if (document.body.dataset.shortcuts === 'drawers') {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || e.isComposing) return;
      const tagName = e.target && 'tagName' in e.target ? e.target.tagName : '';
      if (e.target?.isContentEditable || /^(input|textarea|select)$/i.test(tagName)) return;
      if (e.key === '1' && toggleFlip) toggleFlip();
      else if (e.key === '2') location.href = 'projects.html';
      else if (e.key === '3') location.href = 'recruiter.html';
    });
  }

  /* Current status: randomized on load, re-randomized on observation */
  const slot = document.getElementById('status-slot');
  if (slot) {
    const statuses = [
      'writing, allegedly',
      'reading the same paragraph a fourth time',
      'renaming files (final_v2_ACTUAL)',
      'alphabetizing something that did not require it',
      'adding a footnote to a footnote',
      'making a playlist about it instead of doing it',
      'awaiting word from Reviewer 2',
      'citing a source for an argument nobody contested',
    ];
    const observe = () => {
      let next;
      do { next = statuses[Math.floor(Math.random() * statuses.length)]; }
      while (next === slot.textContent && statuses.length > 1);
      slot.textContent = next;
      slot.classList.remove('observed');
      void slot.offsetWidth; /* restart the settle-in animation */
      slot.classList.add('observed');
    };
    observe();
    const reroll = document.getElementById('status-reroll');
    if (reroll) reroll.addEventListener('click', observe);
  }

  /* Catalog search. The collection is small; the rigor is not. */
  const search = document.getElementById('catalog-search');
  if (search) {
    const cards = Array.from(document.querySelectorAll('.card-grid .proj'));
    const count = document.getElementById('holdings-count');
    const none = document.getElementById('no-results');
    /* Name each card so supporting browsers can morph the reflow */
    cards.forEach((card, i) => { card.style.viewTransitionName = `holding-${i + 1}`; });
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

    const apply = () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const hit = !q || card.textContent.toLowerCase().includes(q);
        card.hidden = !hit;
        if (hit) shown += 1;
      });
      if (none) none.hidden = shown !== 0;
      if (count) {
        count.textContent = q
          ? `n = ${shown} (of ${cards.length})`
          : `n = ${cards.length} (a census, not a sample)`;
      }
    };

    const update = () => {
      /* Animate the reflow only when the visible set actually changes */
      if (typeof document.startViewTransition === 'function' && !reduceMotion.matches) {
        const q = search.value.trim().toLowerCase();
        const willChange = cards.some(
          (card) => card.hidden === (!q || card.textContent.toLowerCase().includes(q)));
        if (willChange) { document.startViewTransition(apply); return; }
      }
      apply();
    };
    search.addEventListener('input', update);
    apply();
  }

  /* Print, for the recruiter who likes paper. Reasonable. */
  document.querySelectorAll('[data-print]').forEach((btn) =>
    btn.addEventListener('click', () => window.print()));

  /* Placeholder links do not scroll to the top; the card shakes and announces why. */
  const interactionFeedback = document.getElementById('interaction-feedback');
  document.querySelectorAll('.card a[href="#"]').forEach((a) => {
    a.removeAttribute('aria-disabled');
    a.removeAttribute('tabindex');
    a.setAttribute('title', 'not filed yet');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const card = a.closest('.card');
      if (!card) return;
      const label = card.querySelector('h2, h3')?.textContent.trim() || 'This link';
      if (interactionFeedback) interactionFeedback.textContent = `${label} is not filed yet.`;
      card.classList.remove('not-filed');
      void card.offsetWidth; /* restart the shake */
      card.classList.add('not-filed');
    });
  });
})();
