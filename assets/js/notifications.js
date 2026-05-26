/* ============================================
   ARF SOFTWARE — Floating signup notifications
   Cada ~30s muestra un toast "X acaba de sumarse"
   ============================================ */

(function () {
  'use strict';

  const recentSignups = [
    { name: 'Dra. María González', city: 'Buenos Aires', timeAgo: '2 min', initials: 'MG', color: 'from-purple-500 to-pink-500' },
    { name: 'Dr. Pablo Rodríguez', city: 'Córdoba', timeAgo: '7 min', initials: 'PR', color: 'from-blue-500 to-cyan-500' },
    { name: 'Dra. Lucía Fernández', city: 'Rosario', timeAgo: '14 min', initials: 'LF', color: 'from-emerald-500 to-teal-500' },
    { name: 'Dra. Sofía Martín', city: 'Mendoza', timeAgo: '21 min', initials: 'SM', color: 'from-orange-500 to-red-500' },
    { name: 'Dr. Juan Pérez', city: 'Salta', timeAgo: '32 min', initials: 'JP', color: 'from-violet-500 to-fuchsia-500' },
    { name: 'Dra. Ana López', city: 'La Plata', timeAgo: '45 min', initials: 'AL', color: 'from-rose-500 to-pink-500' },
    { name: 'Dr. Diego Castro', city: 'San Juan', timeAgo: '1 h', initials: 'DC', color: 'from-indigo-500 to-purple-500' },
    { name: 'Dra. Valeria Romero', city: 'Tucumán', timeAgo: '1 h', initials: 'VR', color: 'from-amber-500 to-orange-500' },
    { name: 'Dr. Federico Acosta', city: 'Neuquén', timeAgo: '2 h', initials: 'FA', color: 'from-sky-500 to-blue-500' },
    { name: 'Dra. Camila Suárez', city: 'Bahía Blanca', timeAgo: '2 h', initials: 'CS', color: 'from-fuchsia-500 to-pink-500' },
  ];

  const container = document.getElementById('notif-container');
  if (!container) return;

  let lastIndex = -1;

  function pickRandom() {
    let idx;
    do {
      idx = Math.floor(Math.random() * recentSignups.length);
    } while (idx === lastIndex && recentSignups.length > 1);
    lastIndex = idx;
    return recentSignups[idx];
  }

  function showNotification() {
    const signup = pickRandom();
    const node = document.createElement('div');
    node.className = 'toast-notif';
    node.innerHTML = `
      <div class="toast-avatar bg-gradient-to-br ${signup.color}">${signup.initials}</div>
      <div class="toast-content">
        <div class="name">${signup.name}</div>
        <div class="meta">${signup.city} · hace ${signup.timeAgo}</div>
      </div>
      <div class="text-xs text-emerald-400 font-medium whitespace-nowrap">✓ Se sumó</div>
    `;
    container.appendChild(node);

    requestAnimationFrame(() => {
      node.classList.add('show');
    });

    setTimeout(() => {
      node.classList.remove('show');
      setTimeout(() => node.remove(), 600);
    }, 5000);
  }

  // First notification after 10s, then every 30-45s (random)
  setTimeout(() => {
    showNotification();
    function scheduleNext() {
      const delay = 30000 + Math.random() * 15000;
      setTimeout(() => {
        showNotification();
        scheduleNext();
      }, delay);
    }
    scheduleNext();
  }, 10000);
})();
