(() => {
  'use strict';

  document.documentElement.dataset.booted = '1';

  const PANELS = ['home', 'work', 'services', 'experience', 'blog', 'about', 'contact'];
  const TITLES = {
    home: 'Clifford Otieno (Doc-Scripter) | IT Consultancy, Business Intelligence, Applied AI Systems & Business Automation | Kenya',
    work: 'Previous Work | Doc-Scripter | Live Websites for Kenyan Businesses',
    services: 'Services | Doc-Scripter | Websites, WordPress, SEO, BI & Automation',
    experience: 'Experience | Doc-Scripter | Professional Experience',
    blog: 'Blog | Doc-Scripter | Notes on Building Software',
    about: 'About Clifford Otieno | Doc-Scripter',
    contact: 'Contact | Doc-Scripter | Get a Free Quote'
  };
  const EMAIL = 'Clifford242526@gmail.com';
  const WA_BASE = 'https://wa.me/254741194375?text=';
  const LABELS = { home: 'Home', work: 'Previous Work', services: 'Services', experience: 'Experience', blog: 'Blog', about: 'About', contact: 'Contact' };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panels = Object.fromEntries(PANELS.map(id => [id, document.getElementById(id)]));
  const routeStatus = document.getElementById('route-status');
  const skipLink = document.querySelector('.skip-link');
  let current = null;

  /* ---------- Router ---------- */
  /* ---------- Scroll-reveal ---------- */
  // Each .reveal element animates in when it scrolls into view. A waiting
  // element carries .pending (hidden by CSS), a revealed one carries .in.
  // Nothing may stay .pending, so every arm also arms a failsafe timer.
  const REVEAL_STEP = 70;
  const REVEAL_MAX_DELAY = 420;
  const REVEAL_FAILSAFE = 1500;
  const revealTimers = new WeakMap(); // panel -> failsafe timeout id
  const revealSeq = new WeakMap();    // panel -> next stagger index
  let revealIO = null;
  let ioFired = false;

  if ('IntersectionObserver' in window && !reduced.matches) {
    revealIO = new IntersectionObserver(batch => {
      batch.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const panel = el.closest('.panel');
        // A panel that is not active keeps its elements observed and pending
        // so they can still be revealed when that panel is visited later.
        if (!panel || !panel.classList.contains('is-active')) return;
        ioFired = true;
        revealIO.unobserve(el);
        revealNow(panel, el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  }

  // Stagger index of an element inside its panel. Kept on the element so the
  // delay stays stable across panel visits and late injected cards.
  function revealIndex(panel, el) {
    const attr = el.getAttribute('data-reveal-index');
    if (attr !== null) {
      const n = parseInt(attr, 10);
      if (!isNaN(n) && n >= 0) return n;
    }
    const next = revealSeq.get(panel) || 0;
    revealSeq.set(panel, next + 1);
    el.setAttribute('data-reveal-index', String(next));
    return next;
  }

  function revealDelay(panel, el) {
    return Math.min(revealIndex(panel, el) * REVEAL_STEP, REVEAL_MAX_DELAY) + 'ms';
  }

  // Reveal an element for good: drop the pending state, set the stagger
  // delay and switch the rise animation on.
  function revealNow(panel, el) {
    el.classList.remove('pending');
    el.style.setProperty('--d', reduced.matches ? '0ms' : revealDelay(panel, el));
    el.classList.add('in');
  }

  // Keyboard focus must never land on an element that is still hidden, so a
  // focused pending element is revealed on the spot.
  document.addEventListener('focusin', e => {
    const el = e.target && e.target.closest ? e.target.closest('.reveal.pending') : null;
    if (!el) return;
    const panel = el.closest('.panel');
    if (panel) revealNow(panel, el);
  });

  function clearFailsafe(panel) {
    const id = revealTimers.get(panel);
    if (id !== undefined) {
      clearTimeout(id);
      revealTimers.delete(panel);
    }
  }

  // Safety net for a starved observer or a frozen animation timeline: reveal
  // whatever is still pending, and drop the animation on anything that is
  // still painted at opacity 0, so content can never stay invisible.
  function scheduleFailsafe(panel) {
    clearFailsafe(panel);
    const id = setTimeout(() => {
      revealTimers.delete(panel);

      if (revealIO && !ioFired) {
        // Starved observer: install a scroll fallback on the panel itself
        // (.js .panel is the scroll container, not the window)
        panel.addEventListener('scroll', function revealOnScroll() {
          const rect = panel.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          panel.querySelectorAll('.reveal.pending').forEach(el => {
            const elRect = el.getBoundingClientRect();
            if (elRect.top >= 0 && elRect.top < viewportHeight) {
              revealNow(panel, el);
              revealIO?.unobserve(el);
              panel.removeEventListener('scroll', revealOnScroll);
            }
          });
        }, { passive: true });
      }

      panel.querySelectorAll('.reveal').forEach(el => {
        const elRect = el.getBoundingClientRect();
        const isOnScreen = elRect.top >= 0 && elRect.top < window.innerHeight;

        if (!el.classList.contains('in') && !isOnScreen) {
          // Element is off-screen and not yet revealed - leave it pending and observed
          return;
        }

        if (el.classList.contains('in') && getComputedStyle(el).opacity === '0') {
          // Element is marked .in but frozen at opacity 0: unblock by setting
          // animation: none and opacity: 1 inline. The inline animation override
          // will be removed on the next reveal attempt.
          el.style.setProperty('animation', 'none');
          el.style.setProperty('opacity', '1');
          revealNow(panel, el);
          return;
        }

        if (!el.classList.contains('in')) {
          // Element is either on screen or has .in already - only reveal on-screen
          // elements in the failsafe so off-screen ones stay pending for IntersectionObserver.
          if (isOnScreen) {
            if (revealIO) revealIO.unobserve(el);
            revealNow(panel, el);
          }
          return;
        }

        // Element already has .in and is not frozen - it is either on-screen or
        // should remain pending until the user scrolls it into view.
        if (isOnScreen) {
          // Already revealed and visible on screen - nothing to do.
        }
      });
    }, REVEAL_FAILSAFE);
    revealTimers.set(panel, id);
  }

  // Arm a set of reveal elements. Already revealed elements are left alone
  // so revisiting a panel does not flicker, pending ones are observed again
  // from scratch and a failsafe timer guards against a silent observer.
  function armRevealEls(panel, els) {
    if (!els.length) return;
    if (!revealIO || reduced.matches) {
      clearFailsafe(panel);
      els.forEach(el => revealNow(panel, el));
      return;
    }
    els.forEach(el => {
      if (el.classList.contains('in')) return;
      el.style.setProperty('--d', revealDelay(panel, el));
      el.classList.add('pending');
      revealIO.unobserve(el);
      revealIO.observe(el);
    });
    scheduleFailsafe(panel);
  }

  function armReveals(panel) {
    armRevealEls(panel, panel.querySelectorAll('.reveal'));
  }

  function focusHeading(id) {
    const heading = panels[id].querySelector('h1, h2');
    if (heading) heading.focus({ preventScroll: true });
  }

  function setActive(id, focus) {
    document.querySelectorAll('[data-panel]').forEach(a => {
      if (a.dataset.panel === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.title = TITLES[id];
    routeStatus.textContent = 'Section: ' + LABELS[id];
    closeSheet();
    if (current === id) { if (focus) focusHeading(id); return; }

    const prev = current ? panels[current] : null;
    current = id;
    const next = panels[id];
    if (prev) { prev.classList.remove('is-active'); prev.inert = true; clearFailsafe(prev); }
    next.inert = false;
    next.scrollTop = 0;
    next.classList.add('is-active');

    armReveals(next);

    if (id === 'home') runCounters();
    if (id === 'blog') loadBlog();
    if (focus) focusHeading(id);
  }

  function route(focus) {
    const hash = location.hash.replace(/^#/, '').toLowerCase();
    const id = PANELS.includes(hash) ? hash : null;
    if (!id) {
      if (hash) history.replaceState(null, '', '#home');
      setActive('home', focus);
      return;
    }
    setActive(id, focus);
  }

  window.addEventListener('hashchange', () => route(true));

  skipLink.addEventListener('click', e => {
    e.preventDefault();
    const heading = current && panels[current].querySelector('h1, h2');
    if (heading) heading.focus();
  });

  window.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && t.closest && t.closest('a, button, summary, input, select, textarea')) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = PANELS.indexOf(current);
    const n = e.key === 'ArrowRight' ? (i + 1) % PANELS.length : (i - 1 + PANELS.length) % PANELS.length;
    location.hash = PANELS[n];
  });

  /* ---------- Mobile menu sheet ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const sheet = document.getElementById('menu-sheet');
  function closeSheet() {
    if (!sheet.hidden && sheet.contains(document.activeElement)) menuBtn.focus();
    sheet.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }
  menuBtn.addEventListener('click', () => {
    const willOpen = sheet.hidden;
    sheet.hidden = !willOpen;
    menuBtn.setAttribute('aria-expanded', String(willOpen));
    menuBtn.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
    if (willOpen) sheet.querySelector('a').focus();
  });
  document.addEventListener('click', e => {
    if (!sheet.hidden && !sheet.contains(e.target) && !menuBtn.contains(e.target)) closeSheet();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  /* ---------- Marquee pause control ---------- */
  const marquee = document.querySelector('.marquee');
  const marqueeToggle = document.getElementById('marquee-toggle');
  marqueeToggle.addEventListener('click', () => {
    const paused = marquee.classList.toggle('is-paused');
    marqueeToggle.textContent = paused ? 'Play' : 'Pause';
    marqueeToggle.setAttribute('aria-label', paused ? 'Play the scrolling tools list' : 'Pause the scrolling tools list');
  });

  /* ---------- Stat counters ---------- */
  let countersDone = false;
  function runCounters() {
    if (countersDone) return;
    countersDone = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduced.matches) { el.textContent = target + suffix; return; }

      // Write the final truthful value first as a safety net so the element
      // is never permanently stuck at 0 if rAF starves.
      el.textContent = target + suffix;

      const dur = 900;
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      // Safety net: force the final value if the animation did not complete
      // within the allotted duration.
      setTimeout(() => {
        el.textContent = target + suffix;
      }, dur + 250);
    });
  }

  /* ---------- Blog auto-pull (DEV.to) ---------- */
  const BLOG_API = 'https://dev.to/api/articles?username=clifford_otieno&per_page=12';
  const CACHE_KEY = 'ds-blog-v1';
  const blogStatus = document.getElementById('blog-status');
  let blogState = 'idle';

  async function loadBlog() {
    if (blogState === 'done' || blogState === 'loading') return;
    blogState = 'loading';
    const grid = document.getElementById('blog-grid');
    const skeleton = document.getElementById('blog-skeleton');
    const fallback = document.getElementById('blog-fallback');
    blogStatus.textContent = 'Loading articles…';
    skeleton.hidden = false;
    fallback.hidden = true;

    let articles = null;
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.t < 3600000 && Array.isArray(parsed.data) && parsed.data.length) {
          articles = parsed.data;
        }
      }
    } catch (err) { /* cache unavailable */ }

    if (!articles) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 9000);
        try {
          const res = await fetch(BLOG_API, { signal: ctrl.signal });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const data = await res.json();
          if (!Array.isArray(data) || !data.length) throw new Error('empty feed');
          articles = data;
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch (err) { /* storage full/blocked */ }
        } finally {
          clearTimeout(timer);
        }
      } catch (err) {
        articles = null;
      }
    }

    skeleton.hidden = true;
    if (!articles) {
      blogStatus.textContent = 'Could not reach DEV.to. Showing recent saved articles.';
      fallback.hidden = false;
      blogState = 'idle';
      return;
    }

    grid.textContent = '';
    const frag = document.createDocumentFragment();
    const blogPanel = grid.closest('.panel');
    const baseIndex = revealSeq.get(blogPanel) || 0;
    let cardIndex = baseIndex;
    for (const a of articles) {
      const card = document.createElement('article');
      card.className = 'blog-card reveal';
      card.setAttribute('data-reveal-index', String(cardIndex++));
      if (a.cover_image) {
        const img = document.createElement('img');
        img.className = 'blog-cover';
        img.src = a.cover_image;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = 640; img.height = 360;
        img.addEventListener('error', () => {
          img.remove();
        });
        card.appendChild(img);
      }
      const body = document.createElement('div');
      body.className = 'blog-body';
      const meta = document.createElement('p');
      meta.className = 'blog-meta';
      const date = new Date(a.published_at);
      const dateStr = isNaN(date) ? '' : date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      meta.textContent = 'DEV.to · ' + dateStr + ' · ' + (a.reading_time_minutes || '?') + ' min read';
      const heading = document.createElement('h2');
      const titleLink = document.createElement('a');
      titleLink.href = a.url;
      titleLink.target = '_blank';
      titleLink.rel = 'noopener';
      titleLink.textContent = a.title;
      heading.appendChild(titleLink);
      const desc = document.createElement('p');
      desc.textContent = a.description || '';
      body.append(meta, heading, desc);
      if (Array.isArray(a.tag_list) && a.tag_list.length) {
        const tags = document.createElement('div');
        tags.className = 'blog-tags';
        for (const t of a.tag_list.slice(0, 3)) {
          const s = document.createElement('span');
          s.className = 'blog-tag';
          s.textContent = '#' + t;
          tags.appendChild(s);
        }
        body.appendChild(tags);
      }
      const read = document.createElement('a');
      read.className = 'text-link';
      read.href = a.url;
      read.target = '_blank';
      read.rel = 'noopener';
      read.textContent = 'Read on DEV.to ↗';
      body.appendChild(read);
      card.appendChild(body);
      frag.appendChild(card);
    }
    grid.appendChild(frag);
    // The cards arrive after the panel was armed, so arm them on their own.
    if (blogPanel) {
      const active = blogPanel.classList.contains('is-active');
      if (active || !revealIO || reduced.matches) {
        armRevealEls(blogPanel, grid.querySelectorAll('.blog-card.reveal'));
      }
    }
    blogStatus.textContent = '';
    blogState = 'done';
  }

  /* ---------- Enquiry form composer ---------- */
  const form = document.getElementById('enquiry-form');
  const fName = document.getElementById('f-name');
  const fBusiness = document.getElementById('f-business');
  const fService = document.getElementById('f-service');
  const fBudget = document.getElementById('f-budget');
  const fMessage = document.getElementById('f-message');
  const formNote = document.getElementById('form-note');
  const waSend = document.getElementById('wa-send');
  const copyBtn = document.getElementById('copy-email');

  function compose() {
    const name = fName.value.trim();
    const business = fBusiness.value.trim();
    const service = fService.value;
    const budget = fBudget.value;
    const message = fMessage.value.trim();
    const subject = service + ' enquiry from ' + name;
    const lines = [
      'Hi Clifford,', '',
      'Name: ' + name,
      business ? 'Business: ' + business : null,
      'Service: ' + service,
      budget ? 'Budget: ' + budget : null,
      '', message, '',
      'Sent from doc-scripter.github.io'
    ].filter(l => l !== null);
    return { subject, body: lines.join('\n'), valid: Boolean(name && message) };
  }

  function validate() {
    const c = compose();
    const nameBad = !fName.value.trim();
    const msgBad = !fMessage.value.trim();
    fName.closest('.field').classList.toggle('invalid', nameBad);
    fMessage.closest('.field').classList.toggle('invalid', msgBad);
    fName.setAttribute('aria-invalid', String(nameBad));
    fMessage.setAttribute('aria-invalid', String(msgBad));
    document.getElementById('f-name-error').hidden = !nameBad;
    document.getElementById('f-message-error').hidden = !msgBad;
    if (!c.valid) (nameBad ? fName : fMessage).focus();
    return c;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const c = validate();
    if (!c.valid) return;
    formNote.textContent = 'Your email app should open with everything pre-filled. Just press send. If it didn’t open, use the WhatsApp button or email me directly.';
    formNote.hidden = false;
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(c.subject) + '&body=' + encodeURIComponent(c.body);
  });

  waSend.addEventListener('click', () => {
    const c = validate();
    if (!c.valid) return;
    formNote.textContent = 'WhatsApp should open with your message pre-filled. Just press send.';
    formNote.hidden = false;
    window.open(WA_BASE + encodeURIComponent(c.subject + '\n\n' + c.body), '_blank', 'noopener');
  });

  [fName, fMessage].forEach(el => el.addEventListener('input', () => {
    el.closest('.field').classList.remove('invalid');
    el.setAttribute('aria-invalid', 'false');
    document.getElementById(el === fName ? 'f-name-error' : 'f-message-error').hidden = true;
  }));

  let copyResetTimer = 0;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
    }, 2000);
  });

  /* ---------- Init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  route(false);
})();