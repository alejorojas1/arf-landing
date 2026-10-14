/* ARF — JS compartido de la home (/) y el turnero (/turno/). Oct 2026.
 * - nav con fondo al scrollear + animaciones de entrada
 * - Meta Pixel "Lead" en cada link de WhatsApp
 * - atribucion: utm/ref en el texto de WhatsApp y propagacion de utm a /turno/
 * - ARF.api(): cliente del turnero del CRM
 */
(function(){
  // Mismo dominio: el nginx de esta web proxea /api/public/turnero/ al CRM (sin CORS).
  var API = window.ARF_API || '/api/public/turnero';
  var WA = '5493815477474';

  var nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('light')) {
    window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 40); }, {passive:true});
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold: .12});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  // Atribucion (igual que la home anterior): codigo de campaña + ref por pageview.
  var params = new URLSearchParams(location.search);
  var code = params.get('utm_campaign') || params.get('utm_content') || params.get('utm_source') || '';
  var ref = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/g,'').slice(0,8).toUpperCase();
  window.__arfRef = ref;

  function waText(base){
    var msg = base || 'Hola! Quiero más información de lo que vi en la página';
    if (code) msg += ' [' + code + ']';
    msg += ' [ref:' + ref + ']';
    return msg;
  }
  function waUrl(base){ return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(waText(base)); }

  function decorate(root){
    (root || document).querySelectorAll('a[href*="wa.me"]').forEach(function(a){
      if (a.getAttribute('data-wa-msg') === null) a.setAttribute('href', waUrl());
    });
    if (location.search) {
      (root || document).querySelectorAll('a[href^="/turno/"]').forEach(function(a){
        var h = a.getAttribute('href');
        if (h.indexOf('utm_') > -1) return;
        var keep = new URLSearchParams();
        params.forEach(function(v, k){ if (k.indexOf('utm_') === 0 || k === 'fbclid') keep.set(k, v); });
        var q = keep.toString();
        if (q) a.setAttribute('href', h + (h.indexOf('?') > -1 ? '&' : '?') + q);
      });
    }
  }
  decorate();

  // Meta Pixel — "Lead" al tocar cualquier boton/enlace de WhatsApp
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (a && window.fbq) { fbq('track', 'Lead', {}, {eventID: ref}); }
  }, true);

  function api(path, opts){
    opts = opts || {};
    var init = {method: opts.method || 'GET', headers: {}};
    if (opts.body) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
    return fetch(API + path, init).then(function(r){
      return r.json().catch(function(){ return {}; }).then(function(j){
        if (!r.ok) { var err = new Error((j && j.detail) || 'Error'); err.status = r.status; throw err; }
        return j;
      });
    });
  }

  var _mot = null;
  window.ARF = {
    api: api,
    motivos: function(){
      if (!_mot) _mot = api('/motivos').catch(function(){ return null; });
      return _mot;
    },
    waUrl: waUrl,
    decorate: decorate,
    ref: ref,
    code: code
  };
})();
