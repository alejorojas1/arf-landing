# DEPLOY — ARF Software Landing

Guía paso a paso para subir la landing a producción y hacer cambios rápidos.

---

## 1. Deploy en Vercel (drag & drop — recomendado para empezar)

1. Ir a [https://vercel.com/new](https://vercel.com/new) y crear cuenta gratis con GitHub o email.
2. En el dashboard, click **"Add New… → Project"**.
3. Buscá la opción **"Deploy"** abajo del todo → **"Upload"** (o bien arrastrá la carpeta `LANDINGPAGE ARF SOFTWARE/` completa al área de drop).
4. Vercel detecta que es HTML estático y deploya en ~30 segundos.
5. Te da una URL tipo `https://landingpage-arf-software-xxxxx.vercel.app`.

**Tips Vercel:**
- Si querés autodeploy ante cambios → subí la carpeta a GitHub y conectá el repo.
- El dominio `.vercel.app` ya tiene HTTPS automático.

---

## 2. Deploy en Netlify (drag & drop)

1. Ir a [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Crear cuenta gratis.
3. Arrastrá la carpeta `LANDINGPAGE ARF SOFTWARE/` directo a la zona de drop.
4. Listo. Te da URL tipo `https://wonderful-arf-xxxxx.netlify.app`.

**Cambio de nombre:** `Site settings → Change site name` → algo como `arfsoftware`.

---

## 3. Deploy en Hostinger / cPanel (FTP)

1. Loguearte en el panel de Hostinger.
2. **File Manager → public_html/**.
3. Subir todos los archivos respetando estructura:
   ```
   public_html/
   ├── index.html
   └── assets/
       ├── css/
       └── js/
   ```
4. Asegurar permisos: archivos `644`, carpetas `755`.
5. Listo, accesible vía `https://tudominio.com`.

**Con FTP cliente (FileZilla / Cyberduck):**
- Host: `ftp.tudominio.com`
- Usuario / Password: los del hosting
- Puerto: 21 (o 22 SFTP)
- Subir contenido de `LANDINGPAGE ARF SOFTWARE/` a `/public_html/`.

---

## 4. Conectar dominio custom (ej. arfsoftware.com)

### En Vercel:
1. Project Settings → Domains → Add → `arfsoftware.com`.
2. Vercel te pide configurar 2 DNS records en tu registrador (NIC.ar, GoDaddy, etc.):
   - Tipo `A`: `@ → 76.76.21.21`
   - Tipo `CNAME`: `www → cname.vercel-dns.com`
3. Esperar propagación DNS (5 min – 24h).
4. SSL automático.

### En Netlify:
1. Domain Settings → Add custom domain.
2. Mismo flujo de DNS.

### En Hostinger:
- Si el dominio ya está en Hostinger, va automáticamente.
- Si está en otro registrador, apuntá los nameservers a los de Hostinger.

---

## 5. Cambios rápidos al contenido

### 5.1. Cambiar la fecha del countdown timer

Archivo: `assets/js/countdown.js`

Línea 9–17. Por defecto: 5 días desde el primer load. Para fijar una fecha exacta:

```js
endDate = new Date('2026-06-30T23:59:59');
localStorage.setItem(STORAGE_KEY, endDate.toISOString());
```

**⚠️ Para forzar reset del countdown** (en los visitantes que ya cachearon la fecha en `localStorage`): cambiá la key de almacenamiento:

```js
const STORAGE_KEY = 'arf_countdown_end_v2';
```

---

### 5.2. Cambiar el precio

Archivo: `index.html`. Buscá el comentario `<!-- PRICE -->`.

```html
<div class="font-display font-extrabold text-6xl ..."><!-- PRICE -->$24.50</div>
```

Y el precio "tachado" (sin descuento) un poco arriba:

```html
<div class="text-xl text-white/40 line-through">$49 USD</div>
```

---

### 5.3. Cambiar cupos restantes

Archivo: `index.html`. Buscá `<!-- CUPOS -->`.

```html
<span class="text-white/70"><!-- CUPOS --><span class="font-bold text-white">17</span> de 50 cupos restantes</span>
```

Cambiá el `17` por el valor actual.

También en el sticky bottom-right:

```html
<div class="font-semibold"><span id="sticky-cupos">17</span> cupos restantes</div>
```

Y la barra de progreso (líneas con `progress-fill`):

```js
// En assets/js/animations.js, buscar:
if (bar) bar.style.width = '66%';
// Calcular: (50 - cupos_restantes) / 50 * 100
```

---

### 5.4. Cambiar links de CTA

Todos los botones "Probar gratis" / "Empezar gratis" apuntan a:

```
https://crm.solucionesdentalesarf.com/auth/profesionales
```

Para cambiar global, hacé Find & Replace en `index.html` sobre esa URL.

Aparece en: nav (desktop + mobile), hero, pricing card, CTA final.

---

### 5.5. Cambiar testimonial

`index.html` sección 9. Buscá `Dra. Jimena Basualdo` y reemplazá quote + nombre + stats inline.

---

### 5.6. Cambiar mensajes de la conversación Juli

Archivo: `assets/js/whatsapp-typing.js`

Modificar los arrays `conversation` (chat completo en sección "Conocé a Juli") o `heroConversation` (mini chat del hero).

Cada mensaje tiene:
- `from`: `'patient'` o `'juli'`
- `text`: contenido del mensaje
- `typing`: ms de delay del "typing indicator" (solo Juli)
- `delay`: ms antes de aparecer el mensaje
- `buttons`: array de strings (opcional, solo Juli)
- `autoClick`: índice del botón a auto-clickear (opcional)

---

### 5.7. Agregar / cambiar testimonios sociales (toasts)

Archivo: `assets/js/notifications.js`

Array `recentSignups`. Cada entrada:

```js
{
  name: 'Dra. María González',
  city: 'Buenos Aires',
  timeAgo: '2 min',
  initials: 'MG',
  color: 'from-purple-500 to-pink-500'  // gradient Tailwind
}
```

---

## 6. Testear cambios localmente

### Opción A — Abrir directo
Doble click en `index.html`. Las animaciones funcionan; algunas APIs pueden quejarse en consola por CORS (no afecta visualmente).

### Opción B — Servidor local (recomendado)

```bash
# Desde la carpeta del proyecto:
python -m http.server 8000
```

Abrir [http://localhost:8000](http://localhost:8000).

### Forzar refresh (Hard reload)

- Windows / Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## 7. Optimizaciones opcionales post-deploy

### 7.1. Custom 404
Crear `404.html` en la raíz. Vercel y Netlify lo sirven automáticamente.

### 7.2. Analytics
Pegar el snippet de **Plausible** / **Google Analytics** / **Vercel Analytics** dentro del `<head>` de `index.html`.

```html
<!-- Plausible -->
<script defer data-domain="arfsoftware.com" src="https://plausible.io/js/script.js"></script>

<!-- Vercel Analytics -->
<script defer src="/_vercel/insights/script.js"></script>
```

### 7.3. Meta Pixel / Conversions API
Pegar el pixel de Meta dentro del `<head>` y disparar evento `Lead` al hacer click en CTA principal.

### 7.4. Open Graph / Twitter Card
Ya están los meta básicos. Agregar imagen (1200×630) si querés link previews ricos:

```html
<meta property="og:image" content="https://arfsoftware.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
```

Subir `og-image.png` a `assets/img/` y referenciarla.

### 7.5. Sitemap + robots.txt

`sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://arfsoftware.com/</loc></url>
</urlset>
```

`robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://arfsoftware.com/sitemap.xml
```

---

## 8. Checklist pre-launch

- [ ] Probada en Chrome, Firefox, Safari.
- [ ] Probada en móvil (375px), tablet (768px), desktop (1440px).
- [ ] Countdown timer cuenta hacia atrás correctamente.
- [ ] Notificaciones flotantes aparecen cada ~30s.
- [ ] WhatsApp mockup hace loop infinito.
- [ ] Hover en cards muestra tilt 3D.
- [ ] Todos los CTAs apuntan a `crm.solucionesdentalesarf.com/auth/profesionales`.
- [ ] Lighthouse > 85 en mobile (test desde Chrome DevTools).
- [ ] Sin errores en consola.
- [ ] Meta tags OG + favicon configurados.
- [ ] Analytics pegado.
- [ ] Dominio custom apuntado + HTTPS activo.

---

## 9. Troubleshooting

**Las animaciones no corren:**
Verificar que el CDN de GSAP cargue. Abrir DevTools → Network → buscar `gsap.min.js` (200 OK).

**Tailwind no se aplica:**
Verificar conexión al CDN `https://cdn.tailwindcss.com`. En producción seria, considerar generar build estático con Tailwind CLI.

**Countdown llegó a 00:00 y se quedó pegado:**
Es el comportamiento esperado. Actualizar `endDate` en `countdown.js` y rotar `STORAGE_KEY`.

**Las notificaciones no aparecen:**
Esperar 10s tras cargar la página (delay inicial). Después salen cada 30-45s aleatorio.

---

Cualquier duda: revisar README.md o consola del navegador.
