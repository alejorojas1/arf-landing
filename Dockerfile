# Sirve la landing estatica (HTML + assets) con nginx.
# EasyPanel construye esta imagen y la publica; nginx escucha en el puerto 80.
FROM nginx:alpine

# Copiamos solo lo necesario al webroot de nginx.
COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
