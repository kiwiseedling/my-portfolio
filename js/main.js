/* ═══════════════════════════════════════════════
   ELENA QIAN PORTFOLIO — main.js
   GSAP + ScrollTrigger animations
   ═══════════════════════════════════════════════ */

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

    tl.to('.hero-greeting',      { opacity: 1, y: 0, duration: 1.0 })
      .to('.hero-name',          { opacity: 1, y: 0, duration: 1.0 }, '-=0.75')
      .to('.hero-pronunciation', { opacity: 1,        duration: 0.6 }, '-=0.5')
      .to('.hero-sub',           { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');


    /* ── Scroll reveal: project cards ── */
    document.querySelectorAll('.project-card').forEach((el, i) => {
      el.classList.add('sr');
      ScrollTrigger.create({
        trigger: el,
        start:   'top 88%',
        once:    true,
        onEnter: () => setTimeout(() => el.classList.add('visible'), i * 100),
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
     5. SMOOTH ANCHOR SCROLL
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