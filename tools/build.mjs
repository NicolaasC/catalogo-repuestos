// Construye el sitio en dist/:
//  - copia los archivos públicos,
//  - genera una página por producto en /producto/<id> (con vista previa para WhatsApp y Google),
//  - genera la imagen de vista previa (og/<id>.jpg), sitemap.xml y robots.txt.
// Uso: node tools/build.mjs   (Vercel lo ejecuta solo en cada despliegue)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import sharp from 'sharp';

const RAIZ = new URL('..', import.meta.url).pathname, DIST = join(RAIZ, 'dist');
const NO_PUBLICAR = new Set(['dist', 'tools', 'supabase', 'node_modules', '.git', '.github', '.vercel', 'fotos',
  'DESIGN.md', 'README.md', 'CLAUDE.md', 'package.json', 'package-lock.json', 'vercel.json', '.gitignore', '.vercelignore']);

// Lee config.js tal como lo lee el navegador.
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(readFileSync(join(RAIZ, 'config.js'), 'utf8'), ctx);
const C = ctx.window.CONFIG, SITIO = C.sitio.replace(/\/$/, '');

// Los productos viven en Supabase (se gestionan desde /admin). Solo se publican los marcados como publicados.
// Si Supabase no responde, el build falla a propósito: Vercel mantiene la versión anterior del sitio.
const CAMPOS = 'id,nombre,marca,referencia,categoria,compatible,descripcion,imagenes,destacado';
const r = await fetch(`${C.supabase.url}/rest/v1/productos?select=${CAMPOS}&publicado=eq.true&order=orden.asc,creado_en.desc`,
  { headers: { apikey: C.supabase.key } });
if (!r.ok) throw new Error(`No se pudieron leer los productos de Supabase (${r.status}): ${await r.text()}`);
const P = (await r.json()).map(p => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && !v.length))));
// Mientras Claude asigna la categoría, el producto se muestra en "Otros repuestos".
for (const p of P) if (p.categoria === 'Por clasificar') p.categoria = 'Otros repuestos';
if (!P.length) throw new Error('Supabase devolvió 0 productos publicados; no se publica un catálogo vacío.');
for (const p of P) if (!p.imagenes?.length) console.warn(`⚠ "${p.id}" no tiene fotos.`);

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ruta = u => /^(https?:|\/)/.test(u) ? u : '/' + u;
const fotos = p => (Array.isArray(p.imagenes) && p.imagenes.length ? p.imagenes : [p.imagen, p.imagen2]).filter(Boolean).map(ruta);
const SIN_FOTO = '/img/sin-foto.svg';
// Descarga una foto: las del repositorio están en disco, las subidas desde el panel están en Supabase Storage.
const leerFoto = async u => /^https?:/.test(u) ? Buffer.from(await (await fetch(u)).arrayBuffer()) : readFileSync(join(RAIZ, u));
const corto = (s, n) => (s = String(s || '')).length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'producto'), { recursive: true });
mkdirSync(join(DIST, 'og'), { recursive: true });
for (const f of readdirSync(RAIZ)) if (!NO_PUBLICAR.has(f) && !f.startsWith('.')) cpSync(join(RAIZ, f), join(DIST, f), { recursive: true });
// Mismo formato que usa el navegador: window.PRODUCTOS = [...]
writeFileSync(join(DIST, 'productos.js'), `// Generado por tools/build.mjs desde Supabase. No editar: usa el panel /admin.\nwindow.PRODUCTOS = ${JSON.stringify(P, null, 1)};\n`);

// ---------- Imagen de vista previa 1200×630 (JPG: WhatsApp no muestra AVIF) ----------
async function imagenOG(p){
  const u = fotos(p)[0]; if (!u) return;
  let foto;
  try { foto = await sharp(await leerFoto(u)).rotate().resize(820, 618, { fit: 'cover' }).jpeg().toBuffer(); }
  catch (e) { console.warn(`⚠ No se pudo procesar la foto de "${p.id}": ${e.message}`); return; }
  const franja = Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#101D32"/>
    <g transform="skewX(-25)">${[0, 1, 2, 3, 4].map(i => `<rect x="${980 + i * 34}" y="0" width="16" height="630" fill="#D62938" opacity=".85"/>`).join('')}</g>
    <rect y="618" width="1200" height="12" fill="#D62938"/></svg>`);
  await sharp(franja).composite([{ input: foto, left: 0, top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true }).toFile(join(DIST, 'og', p.id + '.jpg'));
}

// Vista previa genérica del sitio (para productos sin foto y páginas generales).
await sharp(Buffer.from(`<svg width="1200" height="630"><rect width="1200" height="630" fill="#101D32"/>
  <g transform="skewX(-25)">${[0, 1, 2, 3, 4].map(i => `<rect x="${980 + i * 34}" y="0" width="16" height="630" fill="#D62938" opacity=".85"/>`).join('')}</g>
  <rect y="618" width="1200" height="12" fill="#D62938"/></svg>`)).jpeg({ quality: 82 }).toFile(join(DIST, 'og', 'sitio.jpg'));

// ---------- Página del producto ----------
const nav = `<header class="top"><div class="wrap">
  <a class="brand" href="/" aria-label="${esc(C.nombre)}, inicio"><span class="b1">Conexión</span><span class="b2">Scania</span></a>
  <button class="menu-btn" aria-label="Menú"><span></span><span></span><span></span></button>
  <nav class="nav"><a href="/">Inicio</a><a href="/catalogo" class="on">Catálogo</a><a href="/#categorias">Categorías</a>
    <a href="#" data-cot-open>Mi cotización <b data-cot-count>0</b></a>
    <a class="btn btn-red" data-wa data-ico="_wa">Cotizar por WhatsApp</a></nav></div></header>`;

function pagina(p){
  const f = fotos(p), url = `${SITIO}/producto/${p.id}`;
  const titulo = `${p.nombre}${p.referencia ? ' · Ref. ' + p.referencia : ''} · ${C.nombre}`;
  const desc = corto(`${p.nombre}${p.marca ? ' ' + p.marca : ''}${p.referencia ? ', referencia ' + p.referencia : ''}. ${p.descripcion || ''} Cotiza por WhatsApp.`, 300);
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.descripcion || p.nombre,
    image: f.map(u => /^https?:/.test(u) ? u : SITIO + u), sku: p.referencia || p.id, category: p.categoria, url,
    ...(p.marca ? { brand: { '@type': 'Brand', name: p.marca } } : {}) };
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#101D32">
<meta property="og:type" content="product">
<meta property="og:site_name" content="${esc(C.nombre)}">
<meta property="og:title" content="${esc(p.nombre + (p.referencia ? ' · Ref. ' + p.referencia : ''))}">
<meta property="og:description" content="${esc(corto(p.descripcion || 'Repuesto para buses y camiones Scania. Cotiza por WhatsApp.', 200))}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(SITIO + (existsSync(join(DIST, 'og', p.id + '.jpg')) ? '/og/' + p.id + '.jpg' : '/og/sitio.jpg'))}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/cotizacion.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<style>
  .crumbs{font-size:13px;color:var(--gray);padding:22px 0 14px}
  .crumbs a:hover{color:#fff}
  .pp{display:grid;grid-template-columns:1.05fr 1fr;gap:36px;align-items:start;padding-bottom:56px}
  .gal{position:sticky;top:90px}
  .gal .main-w{position:relative;border-radius:16px;overflow:hidden;background:#0c1626;border:1px solid var(--line)}
  .gal .main{display:block;width:100%;aspect-ratio:1/1;object-fit:cover}
  .gal .thumbs{display:flex;gap:10px;margin-top:12px}
  .gal .thumbs button{width:76px;height:76px;padding:0;border:2px solid transparent;border-radius:10px;overflow:hidden;background:none;cursor:pointer;opacity:.6}
  .gal .thumbs button.on{border-color:var(--red);opacity:1}
  .gal .thumbs img{width:100%;height:100%;object-fit:cover;display:block}
  .info-p{display:flex;flex-direction:column;gap:16px}
  .info-p h1{font-family:var(--display);font-weight:800;text-transform:uppercase;font-size:clamp(36px,5vw,56px);line-height:.92}
  .info-p .desc{color:#d3d8df;font-size:16px}
  .spec{display:grid;grid-template-columns:auto 1fr;gap:9px 20px;font-size:15px;background:var(--navy2);border:1px solid var(--line);border-radius:12px;padding:16px 18px}
  .spec dt{color:var(--gray)} .spec dd{font-weight:500}
  .acts{display:flex;gap:10px;flex-wrap:wrap}
  .acts .btn{flex:1 1 220px;justify-content:center}
  .share{background:none;border:0;color:#c9ced6;font:inherit;font-size:14px;cursor:pointer;text-decoration:underline;text-underline-offset:3px;align-self:flex-start;padding:0}
  .share:hover{color:#fff}
  .rel-p{padding:8px 0 80px}
  .rel-p h2{font-family:var(--display);font-weight:800;text-transform:uppercase;font-size:30px;margin-bottom:18px}
  @media (max-width:820px){.pp{grid-template-columns:1fr;gap:22px}.gal{position:static}}
</style>
</head>
<body>
${nav}
<main class="wrap">
  <div class="crumbs"><a href="/">Inicio</a> › <a href="/catalogo">Catálogo</a> › <a href="/catalogo?cat=${encodeURIComponent(p.categoria)}">${esc(p.categoria)}</a> › ${esc(p.nombre)}</div>
  <div class="pp">
    <div class="gal">
      <div class="main-w"><img class="main zoomable" src="${esc(f[0] || SIN_FOTO)}" alt="${esc(p.nombre)}" data-i="0">
        <span class="zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>Toca para ampliar</span></div>
      ${f.length > 1 ? `<div class="thumbs">${f.map((u, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(u)}" alt=""></button>`).join('')}</div>` : ''}
    </div>
    <div class="info-p">
      <span class="tag">${esc(p.categoria)}</span>
      <h1>${esc(p.nombre)}</h1>
      <p class="desc">${esc(p.descripcion || 'Escríbenos para confirmar especificaciones, referencia y compatibilidad con tu vehículo.')}</p>
      <dl class="spec">
        ${p.marca ? `<dt>Marca</dt><dd>${esc(p.marca)}</dd>` : ''}
        ${p.referencia ? `<dt>Referencia</dt><dd>${esc(p.referencia)}</dd>` : ''}
        <dt>Compatible</dt><dd>${esc(p.compatible || 'Consúltanos según tu vehículo')}</dd>
        ${p.estado ? `<dt>Estado</dt><dd>${esc(p.estado)}</dd>` : ''}
      </dl>
      <div class="acts">
        <button type="button" class="btn btn-red" data-cot-add="${esc(p.id)}">Agregar a mi cotización</button>
        <a class="btn btn-wa" id="wa-p" target="_blank" rel="noopener" data-ico="_wa">Preguntar por WhatsApp</a>
      </div>
      <button type="button" class="share" id="share">Compartir este repuesto</button>
    </div>
  </div>
  <section class="rel-p" id="rel" hidden><h2>Otros repuestos de ${esc(p.categoria)}</h2><div class="grid" id="rel-g"></div></section>
</main>
<footer><div class="wrap"><div class="legal">© <span data-year></span> ${esc(C.nombre)}. Distribuidor independiente de repuestos; no es parte de Scania CV AB. Scania y las demás marcas mencionadas pertenecen a sus respectivos dueños y se usan solo para indicar compatibilidad. · <a href="/privacidad">Privacidad, cookies y términos</a></div></div></footer>
<a class="wa-float" data-wa data-ico="_wa" aria-label="WhatsApp"></a>
<script src="/config.js"></script>
<script src="/productos.js"></script>
<script src="/app.js"></script>
<script>
  const ID = ${JSON.stringify(p.id)}, { wa, msgProducto, card, fotos, zoom } = APP;
  const p = PRODUCTOS.find(x => x.id === ID), f = fotos(p), main = document.querySelector('.gal .main');
  document.getElementById('wa-p').href = wa(msgProducto(p));
  main.onclick = () => zoom(f, +main.dataset.i);
  document.querySelector('.gal').addEventListener('click', e => { const b = e.target.closest('.thumbs button'); if (!b) return;
    main.src = f[b.dataset.i]; main.dataset.i = b.dataset.i; document.querySelectorAll('.thumbs button').forEach(x => x.classList.toggle('on', x === b)); });
  document.getElementById('share').onclick = async e => {
    const datos = { title: p.nombre, text: p.nombre + (p.referencia ? ' · Ref. ' + p.referencia : ''), url: location.href };
    if (navigator.share) { try { await navigator.share(datos); } catch {} return; }
    try { await navigator.clipboard.writeText(location.href); e.target.textContent = '✓ Enlace copiado'; } catch { prompt('Copia el enlace:', location.href); }
  };
  const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
  if (rel.length) { document.getElementById('rel-g').innerHTML = rel.map(card).join(''); document.getElementById('rel').hidden = false; }
</script>
<script src="/cotizacion.js"></script>
</body>
</html>
`;
}

// Imágenes de vista previa en paralelo (de a 8) y luego las páginas.
for (let i = 0; i < P.length; i += 8) await Promise.all(P.slice(i, i + 8).map(imagenOG));
for (const p of P) writeFileSync(join(DIST, 'producto', p.id + '.html'), pagina(p));

// ---------- sitemap.xml y robots.txt ----------
const hoy = new Date().toISOString().slice(0, 10);
const urls = ['/', '/catalogo', '/privacidad', ...P.map(p => '/producto/' + p.id)];
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITIO}${u}</loc><lastmod>${hoy}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITIO}/sitemap.xml\n`);

const tam = d => readdirSync(d).reduce((t, f) => { const s = statSync(join(d, f)); return t + (s.isDirectory() ? tam(join(d, f)) : s.size); }, 0);
console.log(`✓ ${P.length} páginas de producto · dist/ ${(tam(DIST) / 1024 / 1024).toFixed(1)} MB`);
