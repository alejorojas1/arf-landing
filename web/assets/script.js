// Cursor custom
(function(){
  var dot=document.querySelector('.cursor'), ring=document.querySelector('.cursor-r');
  if(!dot||window.matchMedia('(pointer:coarse)').matches) return;
  var rx=0,ry=0,x=0,y=0;
  document.addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;dot.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-50%)';});
  (function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.pain,.ba-card,.rev,.ba-slider,.mq-item').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.classList.add('grow');});
    el.addEventListener('mouseleave',function(){ring.classList.remove('grow');});
  });
})();

// Nav scrolled
var nav=document.getElementById('nav');
if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);});}

// Reveal on scroll
var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});

// Animated counters
function animate(el){
  var end=parseFloat(el.dataset.count), dec=parseInt(el.dataset.dec||'0'), t0=null, dur=1600;
  function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var e=1-Math.pow(1-p,3);var v=end*e;el.textContent=dec?v.toFixed(dec):Math.floor(v);if(p<1)requestAnimationFrame(step);else el.textContent=dec?end.toFixed(dec):end;}
  requestAnimationFrame(step);
}
var cio=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){animate(e.target);cio.unobserve(e.target);}});},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});

// Parallax blobs
var blobs=document.querySelectorAll('[data-par]');
window.addEventListener('scroll',function(){var y=window.scrollY;blobs.forEach(function(b){var s=parseFloat(b.dataset.par);b.style.transform='translateY('+(y*s)+'px)';});});
document.addEventListener('mousemove',function(e){var mx=(e.clientX/window.innerWidth-.5),my=(e.clientY/window.innerHeight-.5);document.querySelectorAll('.hero .blob').forEach(function(b,i){var f=(i+1)*14;b.style.marginLeft=(mx*f)+'px';b.style.marginTop=(my*f)+'px';});});

// Before/after slider
document.querySelectorAll('.ba-slider').forEach(function(s){
  function set(x){var r=s.getBoundingClientRect();var p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));s.style.setProperty('--pos',p+'%');}
  var drag=false;
  s.addEventListener('pointerdown',function(e){drag=true;if(s.setPointerCapture){s.setPointerCapture(e.pointerId);}set(e.clientX);});
  s.addEventListener('pointermove',function(e){if(drag)set(e.clientX);});
  s.addEventListener('pointerup',function(){drag=false;});
  s.addEventListener('pointercancel',function(){drag=false;});
});

// ---- Cargar fotos reales del panel del CRM (manifest en Supabase) ----
(function(){
  var landing = document.body.getAttribute('data-landing');
  if(!landing) return;
  var BASE = 'https://jamvwqtnaoottdgbztuw.supabase.co/storage/v1/object/public/professional-portfolio/landings/';
  fetch(BASE + landing + '/manifest.json?t=' + Date.now())
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(m){
      if(!m) return;
      // Foto principal (hero)
      if(m.hero){
        var hc = document.querySelector('.hero-card');
        if(hc){ hc.classList.remove('ph'); hc.innerHTML=''; hc.style.backgroundImage="url('"+m.hero+"')"; hc.style.backgroundSize='cover'; hc.style.backgroundPosition='center'; }
      }
      // Antes / después: se mapea por orden de tarjetas (caso 1 = 1ra tarjeta)
      var cards = document.querySelectorAll('.ba-card');
      (m.before_after||[]).forEach(function(row){
        var card = cards[(row.idx||1)-1];
        if(!card) return;
        var ant = card.querySelector('.ba-antes'), des = card.querySelector('.ba-despues');
        if(row.antes && ant){ ant.classList.remove('ph'); ant.style.backgroundImage="url('"+row.antes+"')"; }
        if(row.despues && des){ des.classList.remove('ph'); des.style.backgroundImage="url('"+row.despues+"')"; }
      });
      // Galería (la cinta): reconstruye con las fotos reales, duplicadas para el loop
      var gal = (m.gallery||[]).filter(function(g){ return g.url; });
      if(gal.length){
        var track = document.querySelector('.mq-track');
        if(track){
          var html='';
          for(var pass=0; pass<2; pass++){
            gal.forEach(function(g){ html += '<div class="mq-item" style="background-image:url(\''+g.url+'\');background-size:cover;background-position:center"></div>'; });
          }
          track.innerHTML = html;
        }
      }
    })
    .catch(function(){});
})();
