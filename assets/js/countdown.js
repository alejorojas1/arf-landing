/* ============================================
   ARF SOFTWARE — Countdown Timer
   Fecha objetivo: +5 días desde el primer load
   Persiste en localStorage para que no se resetee al recargar
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'arf_countdown_end';

  let endDate;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && !isNaN(new Date(stored).getTime()) && new Date(stored) > new Date()) {
    endDate = new Date(stored);
  } else {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    localStorage.setItem(STORAGE_KEY, endDate.toISOString());
  }

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
    container: document.getElementById('countdown'),
    stickyTime: document.getElementById('sticky-time'),
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      if (els.container) {
        els.container.innerHTML = '<div class="text-arf-purple-light text-xl font-bold">Promoción terminada</div>';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.mins) els.mins.textContent = pad(mins);
    if (els.secs) els.secs.textContent = pad(secs);

    if (els.stickyTime) {
      els.stickyTime.textContent = `${pad(days)}d ${pad(hours)}h`;
    }
  }

  update();
  setInterval(update, 1000);
})();
