/* ============================================
   ARF SOFTWARE — Count-up animation
   Anima cualquier elemento con [data-counter] al entrar al viewport
   ============================================ */

(function () {
  'use strict';

  function animateCounter(el, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString('es-AR');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('es-AR');
      }
    }
    requestAnimationFrame(step);
  }

  // IntersectionObserver to fire only when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        if (!isNaN(target) && !el.dataset.animated) {
          el.dataset.animated = '1';
          animateCounter(el, target, 1800);
        }
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-counter]').forEach((el) => {
    observer.observe(el);
  });
})();
