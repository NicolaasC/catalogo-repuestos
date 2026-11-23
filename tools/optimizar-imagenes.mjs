// Convierte las fotos de repuestos a AVIF livianas, listas para el catálogo.
// No usa IA ni consume tokens: corre en tu computador.
//
// Uso:
//   1. Pon las fotos originales (jpg, png, heic, webp…) en la carpeta  fotos/
//      nombrándolas con el id del producto, ej:  kit-filtro-aps.jpg
//   2. npm install sharp        (solo la primera vez)
//   3. node tools/optimizar-imagenes.mjs
//   → Quedan en src/img/<id>.avif (máx. 1000 px, ~40-120 KB cada una)
//     y se imprime la línea `imagen: "img/<id>.avif"` para pegar en productos.js.

import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ENTRADA = process.argv[2] || 'fotos';
const SALIDA = process.argv[3] || 'src/img';
const OK = /\.(jpe?g|png|webp|avif|heic|heif|tiff?)$/i;

const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

await mkdir(SALIDA, { recursive: true });
const archivos = (await readdir(ENTRADA)).filter(f => OK.test(f));
if (!archivos.length) { console.log(`No hay fotos en ${ENTRADA}/`); process.exit(0); }

for (const f of archivos) {
  const id = slug(path.parse(f).name);
  const destino = path.join(SALIDA, id + '.avif');
  const info = await sharp(path.join(ENTRADA, f))
    .rotate()                                            // respeta la orientación del celular
    .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 55, effort: 6 })
    .toFile(destino);
  console.log(`✓ ${f} → ${destino} (${Math.round(info.size / 1024)} KB)   imagen: "img/${id}.avif"`);
}
