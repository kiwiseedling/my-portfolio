/* ═══════════════════════════════════════════════
   ELENA QIAN PORTFOLIO — main.js
   GSAP + ScrollTrigger animations
   ═══════════════════════════════════════════════ */


/* ─────────────────────────────────────────────
   GREETING STAR — follow mouse with parallax
───────────────────────────────────────────── */
(function() {
  const star = document.querySelector('.hero-greeting-star');
  if (!star) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    const rect = star.getBoundingClientRect();
    const ox = rect.left + rect.width  / 2;
    const oy = rect.top  + rect.height / 2;
    tx = (e.clientX - ox) * 0.18;
    ty = (e.clientY - oy) * 0.18;
  }, { passive: true });
  function animate() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    star.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─────────────────────────────────────────────
   SKETCH — tilt left-side-down on scroll
   (runs immediately, no loader dependency)
───────────────────────────────────────────── */
(function() {
  const sketch = document.querySelector('.hero-sketch');
  if (!sketch) return;
  window.addEventListener('scroll', () => {
    const maxTilt   = 22;
    const maxScroll = window.innerHeight * 0.85;
    const tilt = Math.min(window.scrollY / maxScroll * maxTilt, maxTilt);
    // translateX(-50%) keeps it centered; rotate tilts left side down
    sketch.style.transform = `translateX(-50%) rotate(-${tilt}deg)`;
  }, { passive: true });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. LOADER
     Wait 1.4s minimum so the cat + "loading..."
     animation plays, then fade it out.
  ───────────────────────────────────────────── */
  function dismissLoader() {
    document.body.classList.add('loaded');
    initAnimations();
  }

  // If page loads fast, still show loader for 1.4s
  let pageLoaded = false;
  let timerDone  = false;

  window.addEventListener('load', () => {
    pageLoaded = true;
    if (timerDone) dismissLoader();
  });

  setTimeout(() => {
    timerDone = true;
    if (pageLoaded) dismissLoader();
  }, 1400);


  /* ─────────────────────────────────────────────
     2. NAV — frosted glass on scroll
  ───────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });




  /* ─────────────────────────────────────────────
     3. ALL ANIMATIONS (run after loader leaves)
  ───────────────────────────────────────────── */
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* ── Hero entrance ── */
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-greeting',      { opacity: 1, xPercent: -50, yPercent: -50, duration: 1.0 })
      .to('.hero-name',          { opacity: 1, y: 0, duration: 1.0 }, '-=0.75')
      .to('.hero-pronunciation', { opacity: 1,        duration: 0.6 }, '-=0.5')
      .to('.hero-sub',           { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');


    /* ── Scroll reveal: project cards ── */
    const enterConfigs = [
      { x: '-18px', rot: '-1.2deg' },
      { x:   '0px', rot:  '0.5deg' },
      { x:  '18px', rot: '-0.8deg' },
    ];
    document.querySelectorAll('.project-card--ghost').forEach((el, i) => {
      const cfg = enterConfigs[i] || { x: '0px', rot: '0deg' };
      el.style.setProperty('--enter-x', cfg.x);
      el.style.setProperty('--enter-rot', cfg.rot);
      el.classList.add('pc-enter');
      ScrollTrigger.create({
        trigger: el,
        start:   'top 86%',
        once:    true,
        onEnter: () => setTimeout(() => el.classList.add('pc-visible'), i * 140),
      });
    });

    /* ── Scroll reveal: oldie cards ── */
    document.querySelectorAll('.oldie-card').forEach((el, i) => {
      el.classList.add('sr');
      ScrollTrigger.create({
        trigger: el,
        start:   'top 90%',
        once:    true,
        onEnter: () => setTimeout(() => el.classList.add('visible'), i * 90),
      });
    });

    /* ── Scroll reveal: experience rows ── */
    document.querySelectorAll('.exp-item').forEach((el, i) => {
      el.classList.add('sr');
      ScrollTrigger.create({
        trigger: el,
        start:   'top 90%',
        once:    true,
        onEnter: () => setTimeout(() => el.classList.add('visible'), i * 80),
      });
    });

    /* ── Plantment: animate stat pills on scroll enter ── */
    const plantStats = document.querySelector('.plant-stats');
    if (plantStats) {
      ScrollTrigger.create({
        trigger: plantStats,
        start:   'top 88%',
        once:    true,
        onEnter: () => plantStats.classList.add('animated'),
      });
    }

    /* ── Plantment: image reveal on scroll enter ── */
    const plantCardImg = document.querySelector('.plant-card-img');
    if (plantCardImg) {
      ScrollTrigger.create({
        trigger: plantCardImg,
        start:   'top 96%',
        once:    true,
        onEnter: () => plantCardImg.classList.add('visible'),
      });
    }

    /* ── Scroll reveal: chart overlay (fades in + out) ── */
    document.querySelectorAll('.cs-chart').forEach(el => {
      ScrollTrigger.create({
        trigger:      el,
        start:        'top 92%',
        end:          'bottom 8%',
        onEnter:      () => el.classList.add('visible'),
        onLeave:      () => el.classList.remove('visible'),
        onEnterBack:  () => el.classList.add('visible'),
        onLeaveBack:  () => el.classList.remove('visible'),
      });
    });

    /* ── Scroll reveal: section headings ── */
    document.querySelectorAll('.section-title, .oldies-label, .footer-heading').forEach(el => {
      el.classList.add('sr');
      ScrollTrigger.create({
        trigger: el,
        start:   'top 88%',
        once:    true,
        onEnter: () => el.classList.add('visible'),
      });
    });


    /* ── Image parallax on featured project cards ── */
    document.querySelectorAll('.project-card').forEach(card => {
      const img = card.querySelector('.project-img, .project-img-placeholder');
      if (!img) return;
      gsap.to(img, {
        yPercent: -7,
        ease:     'none',
        scrollTrigger: {
          trigger: card,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   true,
        },
      });
    });


    /* ── CTA border: SVG stroke-dashoffset drawing animation ── */
    const NS = 'http://www.w3.org/2000/svg';

    document.querySelectorAll('.cs-cta').forEach((btn, i) => {
      const b   = btn.getBoundingClientRect();
      const W   = Math.round(b.width);
      const H   = Math.round(b.height);
      const rx  = 3;
      // perimeter of rounded rect (straight sides + quarter-circle corners)
      const peri = 2 * (W + H) - 8 * rx + 2 * Math.PI * rx;
      const gid  = 'cta-g' + i;

      // Build SVG
      const svg = document.createElementNS(NS, 'svg');
      svg.classList.add('cta-border-svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('width',   W + 4);
      svg.setAttribute('height',  H + 4);
      svg.setAttribute('viewBox', `0 0 ${W + 4} ${H + 4}`);

      // Gradient — userSpaceOnUse so we can animate it in pixel coords
      const defs = document.createElementNS(NS, 'defs');
      const grad = document.createElementNS(NS, 'linearGradient');
      grad.setAttribute('id', gid);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      grad.setAttribute('x1', '0');   grad.setAttribute('y1', '0');
      grad.setAttribute('x2', String(W)); grad.setAttribute('y2', '0');

      // purple → blue → purple so the loop is seamless
      [['0%','#a78bfa'], ['40%','#60a5fa'], ['70%','#c4b5fd'], ['100%','#a78bfa']].forEach(([o, c]) => {
        const s = document.createElementNS(NS, 'stop');
        s.setAttribute('offset', o);
        s.setAttribute('stop-color', c);
        grad.appendChild(s);
      });

      // SMIL: continuously translate the gradient across the button width
      const anim = document.createElementNS(NS, 'animateTransform');
      anim.setAttribute('attributeName', 'gradientTransform');
      anim.setAttribute('type',          'translate');
      anim.setAttribute('from',          `0 0`);
      anim.setAttribute('to',            `${W} 0`);
      anim.setAttribute('dur',           '2s');
      anim.setAttribute('repeatCount',   'indefinite');
      grad.appendChild(anim);

      defs.appendChild(grad);
      svg.appendChild(defs);

      // Rect stroke
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', '2'); rect.setAttribute('y', '2');
      rect.setAttribute('width',  W); rect.setAttribute('height', H);
      rect.setAttribute('rx', rx);   rect.setAttribute('ry', rx);
      rect.setAttribute('fill', 'none');
      rect.setAttribute('stroke', `url(#${gid})`);
      rect.setAttribute('stroke-width', '2');
      rect.setAttribute('stroke-linecap', 'round');
      rect.setAttribute('stroke-dasharray',  peri);
      rect.setAttribute('stroke-dashoffset', peri);
      rect.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      svg.appendChild(rect);
      btn.appendChild(svg);

      // Trigger on parent card hover
      const card = btn.closest('.cs-card');
      if (!card) return;
      card.addEventListener('mouseenter', () => { rect.style.strokeDashoffset = '0'; });
      card.addEventListener('mouseleave', () => { rect.style.strokeDashoffset = peri; });
    });


  } // end initAnimations


  /* ─────────────────────────────────────────────
     4. ILLUSTRATION PARALLAX
     Each .illus-parallax wrapper has data-depth (0–1).
     On mousemove: translate(dx * depth * 90, dy * depth * 90)
     .hero-content shifts at depth 0.04 for subtle foreground.
     CSS `transition: transform 0.14s ease-out` gives the
     floaty lag — increase that value for a dreamier feel.
  ───────────────────────────────────────────── */
  const parallaxLayers = document.querySelectorAll('[data-depth]');

  if (parallaxLayers.length) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // −1 → 1
      const dy = (e.clientY - cy) / cy;

      parallaxLayers.forEach(el => {
        const depth = parseFloat(el.dataset.depth);
        const x = dx * depth * 90;
        const y = dy * depth * 90;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }


  /* ─────────────────────────────────────────────
     5. BEAR FOLLOWER
     Smoothly follows the cursor; tilts & scales on scroll.
  ───────────────────────────────────────────── */
  const bear = document.querySelector('.bear-follower');

  // Only run on non-touch devices
  if (bear && !('ontouchstart' in window)) {
    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let bearX  = mouseX;
    let bearY  = mouseY;
    let scrollVel   = 0;
    let lastScrollY = window.scrollY;
    let isVisible   = false;

    // Hide until mouse moves for the first time
    bear.style.opacity = '0';

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        bear.style.opacity   = '1';
        bear.style.transition = 'opacity 0.4s';
        isVisible = true;
      }
    });

    window.addEventListener('scroll', () => {
      scrollVel   = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    }, { passive: true });

    (function animateBear() {
      // Lerp bear toward cursor
      bearX += (mouseX - bearX) * 0.1;
      bearY += (mouseY - bearY) * 0.1;

      const tilt  = Math.max(-25, Math.min(25, scrollVel * 2));
      const scale = 1 + Math.min(Math.abs(scrollVel) * 0.015, 0.4);
      scrollVel  *= 0.88; // decay

      bear.style.left      = bearX + 'px';
      bear.style.top       = bearY + 'px';
      bear.style.transform = `translate(-50%, -50%) rotate(${tilt}deg) scale(${scale})`;

      requestAnimationFrame(animateBear);
    }());
  }


  /* ─────────────────────────────────────────────
     5. PROJECT CARD IMAGE TILT ON HOVER
     Pivots on the vertical axis (rotateY) based
     on mouse X relative to the image center.
     Only activates within PROXIMITY px of the
     image — fades in smoothly with distance.
  ───────────────────────────────────────────── */
  const CS_PROXIMITY = 160; // px from image edge to start tilting

  document.querySelectorAll('.cs-card').forEach(card => {
    const img = card.querySelector('.cs-img');
    if (!img) return;

    card.addEventListener('mousemove', e => {
      const r = img.getBoundingClientRect();

      // Distance from mouse to nearest point on the image rect
      const nearX = Math.max(r.left, Math.min(e.clientX, r.right));
      const nearY = Math.max(r.top,  Math.min(e.clientY, r.bottom));
      const dist  = Math.hypot(e.clientX - nearX, e.clientY - nearY);

      if (dist > CS_PROXIMITY) {
        img.style.transition = 'transform 0.4s ease';
        img.style.transform  = 'rotateY(0deg)';
        return;
      }

      // Strength 0 (edge of proximity) → 1 (on the image)
      const strength = 1 - dist / CS_PROXIMITY;

      // Horizontal: -1 (left of image) → 0 (center) → 1 (right)
      const dx   = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const tilt = dx * 10 * strength; // max ±10 degrees

      img.style.transition = 'transform 0.12s ease';
      img.style.transform  = `rotateY(${tilt}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      img.style.transform  = 'rotateY(0deg)';
    });
  });


  /* ─────────────────────────────────────────────
     6. SMOOTH ANCHOR SCROLL
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
