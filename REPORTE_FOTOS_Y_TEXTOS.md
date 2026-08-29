# REPORTE — Fotos de landings + limpieza de textos (ago 2026)

## 1. FOTOS — causa raíz

**Cómo funciona el circuito (no hace falta redeploy tras cada carga):**
El CRM ("Fotos landings", `backend/app/routers/landing_media.py`) sube cada foto al bucket
público de Supabase `professional-portfolio`, ruta `landings/{landing}/{kind}-{idx}.ext`, y
reescribe un `landings/{landing}/manifest.json`. Cada página de la landing trae
`<body data-landing="…">` y un script que **al abrirse** hace `fetch` de ese manifest y pinta el
hero, los antes/después y la galería. Es en vivo: subís del CRM y aparece solo, sin tocar el repo.

**La raíz del problema:** la **home** (`web/index.html`, que es la landing "general") tenía el
markup de las fotos (`.hero-card`, `.ba-card`, `.mq-track`) pero **le faltaba `data-landing` y el
script que lee el manifest**. Resultado: las fotos que subiste a "general" (verificado: **hero +
24 de galería, ya están en el bucket**) nunca se mostraban. Las subpáginas (ortodoncia, prótesis,
ortodoncia-niños) sí tenían el loader, por eso a ellas sí les funcionaba.

**Estado real de cada landing (verificado contra el bucket):**
- **general (home):** hero + 24 galería en el bucket → ahora **se muestran** (fix aplicado).
- **protesis:** hero + 3 antes/después + 22 galería → OK, ya se mostraban.
- **ortodoncia-ninos:** hero + 3 antes/después + 7 galería → OK.
- **ortodoncia:** **NO hay manifest / no subiste fotos todavía** → la página muestra los recuadros
  vacíos (ya sin el cartelito "foto real"). **Acción tuya:** entrá al CRM → Fotos landings →
  ortodoncia y subí hero + antes/después + galería. Aparecen solas, sin redeploy.

**Fix:** agregué `data-landing="general"` al `<body>` de la home y el mismo loader inline que usan
las subpáginas. De acá en más, lo que subas a cualquier landing desde el CRM aparece en la web
automáticamente. **Solo este fix necesitó redeploy** (una vez); las cargas futuras no.

## 2. WebP / egress

Ya estaba resuelto: `landing_media.upload` sube con `upload_to_bucket(...)`, que por default
(`optimize_images=True`, sep 2026) convierte a **WebP q80, lado mayor ≤1200px** igual que el
portfolio. No hizo falta tocar backend — las fotos de landings ya se comprimen con el mismo criterio
anti-egress. (Nota menor: el nombre del objeto conserva la extensión original, ej. `hero-1.jpg`,
pero el contenido servido es WebP; no afecta el render ni el peso.)

## 3. TEXTOS — encontrados y corregidos

**Etiquetas de trabajo / placeholders (internas que se veían en producción):**
- **Las 4 páginas** — badge CSS `.ph::before{content:'foto real'}` que estampaba un cartelito
  "FOTO REAL" sobre cada recuadro sin foto. **Eliminado** (ahora `content:''`).
- **Home** — recuadro del hero decía *"Foto o video real del paciente sonriendo (o el UGC de
  HeyGen)"* → **"Sonrisas reales de nuestros pacientes"**.
- **Home** — comentario HTML interno *"Para cada caso: poné 2 fotos en una carpeta img/…"*
  → **eliminado**.
- **Home** — párrafo visible en la galería *"Poné acá fotos reales (con consentimiento)… Van en la
  carpeta img/ con nombres galeria-1.jpg…"* → **"Sonrisas de pacientes atendidos por los
  profesionales que trabajan con nosotros."**
- **Ortodoncia** — recuadro hero *"Foto real de un paciente con brackets sonriendo (o el UGC de
  HeyGen)"* → **"Sonrisas reales con ortodoncia"**.
- **Prótesis** — recuadro hero *"Foto real de un paciente con su prótesis sonriendo (o el UGC de
  HeyGen)"* → **"Sonrisas reales con prótesis"**.

**Servicios que ARF NO hace (implantes, blanqueamiento) — solo estaban en la HOME:**
- Meta description: *"Prótesis, ortodoncia, blanqueamiento, implantes y más"* → *"Prótesis,
  ortodoncia y ortodoncia para chicos"*.
- Hero (lead): misma lista con blanqueamiento/implantes → *"Prótesis y ortodoncia, para grandes y
  chicos"*.
- Card de dolores *"Me da vergüenza reírme"*: quité "y el blanqueamiento".
- Card de dolores *"Me falta un diente"*: *"Desde implantes hasta prótesis…"* → *"Con una prótesis a
  tu medida…"*.
- Grilla de Servicios: **eliminada la card "Implantes y coronas"**; la card "Blanqueamiento" se
  **reemplazó por "Placas de relajación"** (bruxismo, servicio real). Quedan 5: Prótesis, Ortodoncia,
  Placas de relajación, Arreglos y limpieza, Ortodoncia para chicos.
- Antes/después: la 3ra tarjeta decía "Blanqueamiento" → **"Ortodoncia para chicos"**.
- Sección "Lo que sentís": card blanqueamiento reescrita (quité "y el blanqueamiento"), card
  implantes → prótesis, y la card *"Tengo los dientes opacos/amarillos → El blanqueamiento…"* se
  **reemplazó** por *"Aprieto/rechino los dientes → Una placa de relajación…"*.
- FAQ "¿En cuánto tiempo veo resultados?": *"un blanqueamiento se nota enseguida…"* → *"una prótesis
  puede estar lista en pocas semanas…"*.
- Footer, columna Tratamientos: link "Blanqueamiento" → **"Placas de relajación"**.

**Verificado que NO había:** precios desactualizados, "Monteagudo", "CIMMA", "Dra./doctora", ni
carillas/cirugía en ninguna página. Las subpáginas (ortodoncia, ortodoncia-niños, prótesis) no
mencionaban servicios prohibidos; solo tenían el badge "foto real" (corregido).

## Páginas tocadas
`web/index.html` (home, la mayoría de los cambios), `web/ortodoncia/index.html`,
`web/ortodoncia-ninos/index.html`, `web/protesis/index.html`. Backend: sin cambios (WebP ya estaba).

## Deploy
Commit + push a `main` → EasyPanel reconstruye la imagen nginx (Dockerfile copia `web/` al webroot).
Tras el deploy: la home mostrará sus fotos; y para **ortodoncia**, subí las fotos desde el CRM.
