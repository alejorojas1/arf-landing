/* ============================================
   ARF SOFTWARE — WhatsApp typing animation
   Loop infinito de conversación Juli ↔ Paciente
   - Renderiza en #juli-chat (full) y #hero-chat (mini)
   ============================================ */

(function () {
  'use strict';

  // Conversación principal — recordatorio automático de turno.
  // El consultorio manda el recordatorio, el paciente confirma con 1 toque.
  const conversation = [
    { from: 'juli', typing: 1500, text: 'Buenas! Como le va? Le recordamos su turno con la dra. Silva.', delay: 800 },
    {
      from: 'juli',
      text: '📅 Mañana jueves 22/05 · 18:00',
      buttons: ['✅ Confirmar', '🔄 Reagendar', '❌ Cancelar'],
      autoClick: 0, // simula que el paciente toca "Confirmar"
      delay: 1000
    },
    { from: 'patient', text: 'Confirmar ✅', delay: 1600 },
    { from: 'juli', typing: 1200, text: 'excelente! turno confirmado. la esperamos 🦷', delay: 1400 },
  ];

  // Versión compacta para el hero (más corta)
  const heroConversation = [
    { from: 'juli', typing: 1200, text: 'Buenas! Le recordamos su turno de mañana 10:00.', delay: 0 },
    {
      from: 'juli',
      text: '📅 Sáb 24/05 · 10:00',
      buttons: ['✅ Confirmar', '🔄 Reagendar'],
      autoClick: 0,
      delay: 1000
    },
    { from: 'patient', text: 'Confirmar ✅', delay: 1400 },
    { from: 'juli', typing: 1000, text: '✓ turno confirmado!', delay: 1200 },
  ];

  function createMessage(msg) {
    const div = document.createElement('div');
    div.className = msg.from === 'patient' ? 'chat-msg chat-msg-patient' : 'chat-msg chat-msg-juli';
    div.textContent = msg.text;

    if (msg.buttons && msg.buttons.length) {
      const btnWrap = document.createElement('div');
      btnWrap.className = 'chat-msg-buttons';
      msg.buttons.forEach((b, i) => {
        const btn = document.createElement('div');
        btn.className = 'chat-btn';
        btn.textContent = b;
        btnWrap.appendChild(btn);
      });
      div.appendChild(btnWrap);
    }

    return div;
  }

  function createTypingIndicator() {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    return t;
  }

  function showToast() {
    const toast = document.getElementById('juli-toast');
    if (!toast) return;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      toast.classList.remove('opacity-100');
    }, 2500);
  }

  async function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async function playConversation(container, script, opts = {}) {
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < script.length; i++) {
      const msg = script[i];
      await delay(msg.delay || 800);

      // Show typing indicator for Juli's messages
      if (msg.from === 'juli' && msg.typing) {
        const t = createTypingIndicator();
        container.appendChild(t);
        scrollToBottom(container);
        await delay(msg.typing);
        t.remove();
      }

      const msgEl = createMessage(msg);
      container.appendChild(msgEl);
      scrollToBottom(container);

      // Auto-click button simulation
      if (msg.buttons && typeof msg.autoClick === 'number') {
        await delay(1200);
        const btns = msgEl.querySelectorAll('.chat-btn');
        if (btns[msg.autoClick]) {
          btns[msg.autoClick].classList.add('clicked');
          if (opts.showToast) showToast();
        }
      }
    }
  }

  function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  async function loop(container, script, opts) {
    while (true) {
      await playConversation(container, script, opts);
      await delay(4000);
    }
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    const juliChat = document.getElementById('juli-chat');
    const heroChat = document.getElementById('hero-chat');

    if (juliChat) loop(juliChat, conversation, { showToast: true });
    if (heroChat) loop(heroChat, heroConversation, { showToast: false });
  });

  // If DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    const juliChat = document.getElementById('juli-chat');
    const heroChat = document.getElementById('hero-chat');
    if (juliChat) loop(juliChat, conversation, { showToast: true });
    if (heroChat) loop(heroChat, heroConversation, { showToast: false });
  }
})();
