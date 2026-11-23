# Conexión Scania · Catálogo de repuestos

Catálogo web de repuestos para buses y camiones Scania con lista de cotización que se envía por WhatsApp y se guarda en Supabase.

- **Sitio:** https://catalogo-repuestos-eight.vercel.app
- **Diseño:** ver [`DESIGN.md`](DESIGN.md) (formato google-labs-code/design.md).
- **Base de datos:** [`supabase/schema.sql`](supabase/schema.sql) (proyecto `catalogo-scania`).

## Archivos principales
| Archivo | Qué es |
|---|---|
| `config.js` | Número de WhatsApp, Supabase, datos legales y destacados |
| `productos.js` | Lista de productos (nombre, referencia, fotos…) |
| `img/` | Fotos en AVIF/WebP |
| `tools/optimizar-imagenes.mjs` | Convierte fotos a AVIF sin usar IA |

## Agregar fotos
```bash
npm install sharp
node tools/optimizar-imagenes.mjs fotos img
```
Nombra las fotos con el id del producto (`kit-filtro-aps.jpg`, `kit-filtro-aps-2.jpg`).
