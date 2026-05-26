# ARF Software — Landing Page

Landing page premium standalone (HTML + CSS + JS sin frameworks) para vender ARF Software a dentistas.

## Qué es

Producto: **ARF Software** — CRM dental con bot de WhatsApp ("Juli") que atiende 24/7.

Propuesta de valor: *"La secretaria virtual que confirma turnos por WhatsApp mientras vos atendés."*

## Stack

- HTML5 single-page
- Tailwind CSS via CDN (config inline en el `<head>` de `index.html`)
- GSAP 3 + ScrollTrigger para animaciones
- Lenis para smooth scroll
- Lucide icons
- Plus Jakarta Sans + Inter (Google Fonts)

**Sin npm. Sin build. Sin framework.** Se sube como está.

## Estructura

```
LANDINGPAGE ARF SOFTWARE/
├── index.html                  ← Single page con 13 secciones
├── assets/
│   ├── css/
│   │   └── styles.css          ← CSS custom complementario
│   ├── js/
│   │   ├── animations.js       ← GSAP + Lenis + tilt 3D + parallax
│   │   ├── countdown.js        ← Timer de promoción (persiste en localStorage)
│   │   ├── notifications.js    ← Toasts "X acaba de sumarse"
│   │   ├── counter.js          ← Count-up animado en stats
│   │   └── whatsapp-typing.js  ← Conversación Juli en loop
│   └── img/                    ← (vacío — todos los visuales son HTML/CSS)
├── README.md
└── DEPLOY.md
```

## Cómo abrir en local

### Opción 1 — Doble click

Abrir `index.html` directamente en el navegador. Funciona porque todas las dependencias se cargan desde CDN.

### Opción 2 — Servidor local (recomendado, evita warnings de CORS)

```bash
# Python 3
python -m http.server 8000

# Node (si tenés npx)
npx serve

# PHP
php -S localhost:8000
```

Luego abrir [http://localhost:8000](http://localhost:8000).

## Las 13 secciones

1. **Nav sticky** con scroll progress bar
2. **Hero** asimétrico (texto 60% / dashboard mockup 3D 40%)
3. **Trusted by** — avatars de dentistas
4. **Problema** — storytelling con inbox saturado
5. **La solución — Juli** — phone mockup con chat en loop
6. **Features** — bento grid asimétrico (6 cards)
7. **Comparativa** — tabla ARF vs otras plataformas vs WhatsApp solo
8. **Cómo funciona** — timeline vertical 3 pasos
9. **Testimonial** — Dra. Jimena Basualdo + stats
10. **Pricing + countdown timer** real funcionando
11. **FAQ** — 8 preguntas con acordeón
12. **CTA final** full bleed
13. **Footer**

## Reglas de contenido

- **Nunca** mencionar competidores por nombre (no decir AgendaPro, Doctoralia, Calendly, etc.). Solo *"otras plataformas de agenda"* / *"WhatsApp solo"*.
- Dark mode obligatorio (paleta púrpura ARF: `#7C1FD6` → `#B600FF`).
- CTAs apuntan a: `https://crm.solucionesdentalesarf.com/auth/profesionales`

## Performance

- Lighthouse target: **> 85 en mobile**.
- Sin dependencias rotas: todo el CDN debe cargar.
- Fuentes con `display=swap` para evitar FOIT.
- Animaciones con `will-change` y `requestAnimationFrame` para 60fps.

## Cómo modificar contenido

Ver `DEPLOY.md` para detalle de:
- Cambiar el countdown timer.
- Cambiar el precio.
- Cambiar cupos restantes.
- Cambiar links de CTA.
- Conectar dominio custom.

## Browser support

Chrome 90+, Safari 14+, Firefox 88+, Edge 90+.

Mobile: iOS Safari 14+, Chrome Android.

## Licencia

Propietaria — ARF Software (Soluciones Dentales ARF).
