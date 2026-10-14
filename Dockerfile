# Sirve las landings estaticas (HTML + assets) con nginx.
# EasyPanel construye esta imagen y la publica; nginx escucha en el puerto 80.
#
# Estructura del sitio (jul 2026):
#   /            -> landing de la CLINICA (carpeta web/, con index.html + assets + ortodoncia/ + protesis/ + img/ etc.)
#   /software    -> la landing del SOFTWARE de antes (index.html + assets/ que estan en la raiz de este repo)
FROM nginx:alpine

# --- Sitio de la CLINICA en la raiz ---
# Copia TODO el contenido de web/ al webroot: index.html, assets/, ortodoncia/,
# ortodoncia-ninos/, protesis/, img/, etc.
COPY web/ /usr/share/nginx/html/

# --- La landing del SOFTWARE queda bajo /software (mismos archivos de antes) ---
COPY index.html /usr/share/nginx/html/software/index.html
COPY assets /usr/share/nginx/html/software/assets

# --- nginx: default + proxy /api/public/turnero/ al CRM (turnero web, oct 2026) ---
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
