/* ============================================
   Soluciones Dentales — Animations (GSAP + Lenis)
   Estilo premium tipo Stripe / Linear / Framer.
   Reglas: sutil, fluido, solo transform/opacity/filter.
   Respeta prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  const REDUCED = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- GSAP check -----
  if (!window.gsap) {
    console.warn('GSAP no disponible');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ----- Lenis smooth scroll + sync con ScrollTrigger -----
  let lenis = null;
  if (window.Lenis && !REDUCED) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    // Driver unico: el ticker de GSAP maneja Lenis -> todo sincronizado.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ============================================
     SPLIT TEXT — parte el H1 del hero en palabras
     (la palabra con gradiente queda intacta como 1 unidad)
     ============================================ */
  function splitWords(el) {
    if (!el) return [];
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    const words = [];
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        // text node -> envolver cada palabra
        node.textContent.split(/(\s+)/).forEach((chunk) => {
          if (chunk.trim() === '') {
            el.appendChild(document.createTextNode(chunk));
          } else {
            const s = document.createElement('span');
            s.className = 'reveal-word';
            s.textContent = chunk;
            el.appendChild(s);
            words.push(s);
          }
        });
      } else if (node.nodeType === 1) {
        // elemento (ej. el <span> con gradiente) -> se anima entero
        node.classList.add('reveal-word');
        el.appendChild(node);
        words.push(node);
      }
    });
    return words;
  }

  /* ============================================
     REDUCED MOTION — todo visible, sin animaciones
     ============================================ */
  if (REDUCED) {
    document.querySelectorAll('.reveal-ready').forEach((el) => {
      el.style.opacity = '1';
    });
    return;
  }

  /* ============================================
     HERO — entrada dramática con stagger por palabra
     ============================================ */
  const heroWords = splitWords(document.querySelector('.hero-h1'));

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
    .from(heroWords, {
      yPercent: 60,
      opacity: 0,
      rotateX: -35,
      transformPerspective: 700,
      transformOrigin: '50% 100%',
      duration: 0.85,
      stagger: 0.07,
    }, '-=0.2')
    .from('.hero-subtitle', { y: 28, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-ctas > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
    .from('.hero-stats > *', { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.3')
    .from('.hero-mockup', {
      rotateY: -32,
      z: -240,
      opacity: 0,
      transformPerspective: 1200,
      transformOrigin: 'center center',
      duration: 1.3,
      ease: 'power3.out',
    }, '-=1.1');

  /* ============================================
     SCROLL REVEALS — con carácter (blur-to-focus, scale, slide)
     ============================================ */
  // Helper: marca el estado inicial (clase anti-FOUC + gsap.set) y anima
  // al entrar al viewport. El `to` solo resetea las props presentes en
  // `fromVars` — nada de animar propiedades que no se tocaron.
  function reveal(targets, fromVars, opts) {
    opts = opts || {};
    gsap.utils.toArray(targets).forEach((el, i) => {
      el.classList.add('reveal-ready');
      gsap.set(el, fromVars);

      const toVars = {
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: opts.staggerEach
          ? (i % (opts.staggerMod || 9999)) * opts.staggerEach
          : 0,
        scrollTrigger: {
          trigger: el,
          start: opts.start || 'top 86%',
          toggleActions: 'play none none none',
        },
      };
      if ('x' in fromVars) toVars.x = 0;
      if ('y' in fromVars) toVars.y = 0;
      if ('scale' in fromVars) toVars.scale = 1;
      if ('filter' in fromVars) toVars.filter = 'blur(0px)';
      if ('rotateX' in fromVars) toVars.rotateX = 0;
      if ('rotateY' in fromVars) toVars.rotateY = 0;
      gsap.to(el, toVars);
    });
  }

  // H2 de secciones — blur-to-focus + slide + scale (lo más "premium")
  reveal('section h2', { y: 44, opacity: 0, scale: 0.97, filter: 'blur(10px)' },
    { start: 'top 88%' });

  // Bento cards — slide up + scale, stagger por fila de 3
  reveal('.bento-card', { y: 56, opacity: 0, scale: 0.94 },
    { staggerEach: 0.09, staggerMod: 3 });

  // Features secundarios
  reveal('#features-secundarios > div', { y: 40, opacity: 0, scale: 0.95 },
    { staggerEach: 0.08, staggerMod: 4 });

  // Problem items — slide lateral con stagger
  reveal('.problem-item', { x: -36, opacity: 0 },
    { staggerEach: 0.08, staggerMod: 99, start: 'top 90%' });

  // Timeline steps — slide up + scale
  reveal('.timeline-step', { y: 56, opacity: 0, scale: 0.97 },
    { start: 'top 85%' });

  // Comparison rows — slide lateral, stagger fino
  reveal('.comp-row', { x: -22, opacity: 0 },
    { staggerEach: 0.04, staggerMod: 99, start: 'top 93%' });

  /* ============================================
     PROGRESS BAR de pricing (escasez)
     ============================================ */
  ScrollTrigger.create({
    trigger: '.progress-fill',
    start: 'top 80%',
    onEnter: () => {
      const bar = document.querySelector('.progress-fill');
      if (bar) bar.style.width = '66%';
    },
  });

  /* ============================================
     TILT 3D pronunciado + glow que sigue el mouse
     ============================================ */
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    let frame = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      // glow sigue al cursor (CSS var)
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--glow-x', (px * 100) + '%');
        card.style.setProperty('--glow-y', (py * 100) + '%');
      });
      // tilt pronunciado ~14deg
      rotY((px - 0.5) * 14);
      rotX((0.5 - py) * 14);
    });

    card.addEventListener('mouseenter', () => {
      gsap.to(card, { z: 30, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    });
    card.addEventListener('mouseleave', () => {
      rotX(0);
      rotY(0);
      gsap.to(card, { z: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    });
  });

  /* ============================================
     PARALLAX — orbes y mockup del hero a distinta velocidad
     ============================================ */
  const heroSection = document.querySelector('.hero-h1')
    ? document.querySelector('.hero-h1').closest('section')
    : null;

  if (heroSection) {
    // Orbes: scroll parallax en Y (distinta velocidad c/u)
    const orbSpeeds = { '.orb-1': -140, '.orb-2': -80, '.orb-3': -200 };
    Object.keys(orbSpeeds).forEach((sel) => {
      if (!document.querySelector(sel)) return;
      gsap.to(sel, {
        y: orbSpeeds[sel],
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // Mockup del hero: parallax sutil (más lento que los orbes)
    if (document.querySelector('.hero-mockup')) {
      gsap.to('.hero-mockup', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }
  }

  // Float continuo de los orbes en X + breathing (no choca con el Y del scroll)
  gsap.to('.orb-1', { x: 70, scale: 1.08, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.orb-2', { x: -60, scale: 1.1, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.orb-3', { x: 45, scale: 1.06, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  /* ============================================
     MAGNETIC BUTTONS — los CTAs se atraen al cursor
     ============================================ */
  document.querySelectorAll('.btn-gradient, .magnetic').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
    const STRENGTH = 0.3;

    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * STRENGTH);
      yTo((e.clientY - r.top - r.height / 2) * STRENGTH);
    });
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
      gsap.to(btn, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    });
  });

  /* ============================================
     REFRESH — recalcula triggers cuando carga todo
     ============================================ */
  window.addEventListener('load', () => ScrollTrigger.refresh());

})();
