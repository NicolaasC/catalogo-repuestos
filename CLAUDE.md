# Conexión Scania · catálogo de repuestos

Sitio estático (HTML + JS sin framework) en Vercel con cotización por WhatsApp y Supabase.
Antes de cambiar algo visual, lee `DESIGN.md` y respétalo. Responde al usuario en español.

## Mapa
- `index.html` portada (buscador grande, categorías, destacados, confianza) · `catalogo.html` catálogo con vista rápida ·
  `privacidad.html` política Ley 1581 · `admin.html` panel privado: cotizaciones y productos (Supabase Auth).
- `config.js`: WhatsApp, Supabase (clave pública), datos legales y sección de confianza. Los destacados son la columna `destacado`.
- Productos: tabla `public.productos` en Supabase, gestionada por el dueño desde `/admin` (fotos en el bucket `productos`).
  El build genera `dist/productos.js` (`window.PRODUCTOS`) leyendo solo los `publicado = true`. No hay productos.js en el repo.
- `app.js` utilidades compartidas (card, buscador con sugerencias, zoom); `cotizacion.js/.css` lista de cotización.
- `zoom.js` + `vendor/` (PhotoSwipe 5.4.4, supabase-js 2.119.0) y `fonts/` alojados localmente: no se carga nada de terceros
  (la CSP de `vercel.json` lo exige; si agregas un dominio externo, actualízala).
- `tools/build.mjs` lee productos de Supabase y genera `dist/` con `/producto/<id>`, imágenes OG en JPG, sitemap y robots. `npm run build`.
- `supabase/schema.sql` refleja la base de datos (proyecto `catalogo-scania`, ref `xrfxqcmosfqayqcxlapc`).

## Reglas
- Rutas siempre absolutas (`/img/...`, `/catalogo`): las páginas de producto viven en `/producto/`.
- No pases imágenes por el contexto: el dueño sube fotos desde `/admin`; tú editas productos con SQL, nunca subiendo imágenes.
- Cualquier campo nuevo que pida datos personales requiere actualizar `privacidad.html` y `POLITICA` en `cotizacion.js`.
- Probar primero a 390px de ancho.

## Completar fichas por lotes (tarea recurrente)
El dueño sube foto + nombre (+ referencia si la sabe). Tú completas por lotes, gastando pocos tokens:
1. `select id,nombre,marca,referencia,ref_por_confirmar,categoria,compatible,descripcion,respuesta from productos
   where estado_ficha = 'pendiente' order by creado_en limit 20;` (MCP de Supabase, proyecto `xrfxqcmosfqayqcxlapc`).
2. Por cada uno, investiga con búsqueda web usando el texto (nombre, marca, referencia, `respuesta` del dueño).
   **No abras las fotos** salvo que el texto no alcance (p. ej. para leer una referencia en la etiqueta).
   Si `categoria = 'Por clasificar'`, asígnale una de las existentes (`select distinct categoria from productos`);
   crea una nueva solo si ninguna encaja.
3. Si confirmas los datos: `update productos set categoria=…, referencia=…, ref_por_confirmar=false, marca=…, compatible=…,
   descripcion=…, estado_ficha='completa', pregunta=null where id=…`. Descripción: 1 a 3 frases, español de Colombia,
   qué es, para qué sirve y cuándo se cambia (mira el tono de las fichas completas). Nunca inventes referencias.
4. Si es imposible confirmarlo solo: `estado_ficha='revisar'` y en `pregunta` una duda concreta y respondible
   (p. ej. "¿La etiqueta dice 1520998 o 1520989? ¿Es para motor DC13 o DC16?"). El dueño responde en el panel.
5. Al terminar, publica: crea un despliegue de producción de Vercel desde `main` (o pide al dueño que toque
   «Publicar cambios»). Resume al dueño cuántas fichas completaste y cuántas quedaron para revisar.
