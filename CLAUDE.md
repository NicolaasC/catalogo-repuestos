# Conexión Scania · catálogo de repuestos

Sitio estático (HTML + JS sin framework) en Vercel con cotización por WhatsApp y Supabase.
Antes de cambiar algo visual, lee `DESIGN.md` y respétalo. Responde al usuario en español.

## Mapa
- `index.html` portada (buscador grande, categorías, destacados, confianza) · `catalogo.html` catálogo con vista rápida ·
  `privacidad.html` política Ley 1581 · `admin.html` panel privado de cotizaciones (Supabase Auth).
- `config.js`: WhatsApp, Supabase (clave pública), datos legales, destacados, sección de confianza.
- `productos.js`: `window.PRODUCTOS`. Campos: id, nombre, marca, referencia, categoria, compatible, descripcion,
  imagen, e `imagenes: [...]` opcional para varias fotos.
- `app.js` utilidades compartidas (card, buscador con sugerencias, zoom); `cotizacion.js/.css` lista de cotización.
- `zoom.js` + `vendor/` (PhotoSwipe 5.4.4, supabase-js 2.119.0) y `fonts/` alojados localmente: no se carga nada de terceros
  (la CSP de `vercel.json` lo exige; si agregas un dominio externo, actualízala).
- `tools/build.mjs` genera `dist/` con `/producto/<id>`, imágenes OG en JPG, sitemap y robots. `npm run build`.
- `supabase/schema.sql` refleja la base de datos (proyecto `catalogo-scania`, ref `xrfxqcmosfqayqcxlapc`).

## Reglas
- Rutas siempre absolutas (`/img/...`, `/catalogo`): las páginas de producto viven en `/producto/`.
- No pases imágenes por el contexto: usa `tools/optimizar-imagenes.mjs` y edita solo `productos.js`.
- Cualquier campo nuevo que pida datos personales requiere actualizar `privacidad.html` y `POLITICA` en `cotizacion.js`.
- Probar primero a 390px de ancho.
