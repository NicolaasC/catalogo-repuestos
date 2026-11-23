// Funciones compartidas por las páginas.
(function(){
  const C = window.CONFIG || {};
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function wa(texto){
    const t = encodeURIComponent(texto || ('Hola, quiero información sobre repuestos de ' + (C.nombre || '') + '.'));
    const n = String(C.whatsapp || '').replace(/\D/g, '');
    return n ? `https://wa.me/${n}?text=${t}` : `https://wa.me/?text=${t}`;
  }
  function msgProducto(p){
    return `Hola, estoy interesado en cotizar el producto: ${p.nombre}.` +
      (p.referencia ? ` Referencia: ${p.referencia}.` : '') +
      ` ¿Me pueden confirmar disponibilidad y precio?`;
  }
  // Fotos del producto: usa "imagenes: [...]" si existe; si no, "imagen" (+ "imagen2" opcional).
  // Las rutas son absolutas para que funcionen también en /producto/<id>.
  const ruta = u => !u || /^(https?:|\/)/.test(u) ? u : '/' + u;
  const fotos = p => (Array.isArray(p.imagenes) && p.imagenes.length ? p.imagenes : [p.imagen, p.imagen2]).filter(Boolean).map(ruta);
  const urlProducto = p => '/producto/' + encodeURIComponent(p.id);
  const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONOS = {
    'Motor': I('<path d="M4 10h2V8h3V6h6v2h2l2 3h1v5h-1l-2 2H8l-2-2H4z"/><path d="M2 11v4M9 6V4h6v2"/>'),
    'Filtros': I('<ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14c0 1.1 2.7 2 6 2s6-.9 6-2V5"/><path d="M9 7.5v11M12 8v11M15 7.5v11"/>'),
    'Frenos y aire': I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>'),
    'Suspensión': I('<path d="M12 2v3M12 19v3M8 5h8M8 19h8M8 7l8 2-8 2 8 2-8 2 8 2"/>'),
    'Refrigeración': I('<path d="M10 14V4a2 2 0 1 1 4 0v10a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>'),
    'Embrague': I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M12 14v7M3 12h7M14 12h7M5.6 5.6l5 5M13.4 13.4l5 5M18.4 5.6l-5 5M10.6 13.4l-5 5"/>'),
    'Caja y retarder': I('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/><circle cx="12" cy="12" r="7"/>'),
    'Diferencial': I('<circle cx="9" cy="12" r="6"/><circle cx="9" cy="12" r="2"/><path d="M15 12h7M18 9v6"/>'),
    'Dirección': I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M3.5 10h6.6M13.9 10h6.6M12 14v7"/>'),
    'Ejes y bocines': I('<circle cx="5" cy="12" r="3"/><circle cx="19" cy="12" r="3"/><path d="M8 12h8"/>'),
    '_wa': '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
    '_fotos': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>'
  };
  const icono = c => ICONOS[c] || ICONOS['Caja y retarder'];

  function card(p){
    const f = fotos(p);
    return `<div class="card${f.length > 1 ? ' dos' : ''}" data-id="${esc(p.id)}">
      <a class="card-link" href="${esc(urlProducto(p))}">
        <div class="ph"><img src="${esc(f[0])}" alt="${esc(p.nombre)}" loading="lazy">${f[1] ? `<img class="alt" src="${esc(f[1])}" alt="" loading="lazy">
          <span class="nfotos">${ICONOS._fotos}${f.length}</span>` : ''}</div>
        <div class="info">
          <span class="tag">${esc(p.categoria)}</span>
          <h3>${esc(p.nombre)}</h3>
          <div class="meta">${esc([p.marca, p.referencia && ('Ref. ' + p.referencia)].filter(Boolean).join(' · ') || p.compatible)}</div>
        </div></a>
      <button type="button" class="card-add" data-cot-add="${esc(p.id)}" data-corto>Agregar</button>
    </div>`;
  }

  // ---------- Buscador con sugerencias (foto + referencia) ----------
  // Busca en nombre, referencia, marca y categoría; ignora tildes, puntos y guiones.
  function buscar(q, lista){
    const terms = norm(q).split(/\s+/).filter(Boolean); if (!terms.length) return [];
    const sinSignos = s => s.replace(/[.\s-]/g, '');
    return lista.map(p => {
      const nom = norm(p.nombre), ref = norm(p.referencia), todo = norm([p.nombre, p.marca, p.categoria, p.referencia, p.compatible, p.descripcion].join(' '));
      if (!terms.every(w => todo.includes(w) || sinSignos(todo).includes(sinSignos(w)))) return null;
      const w0 = terms[0];
      const puntos = (ref && sinSignos(ref).startsWith(sinSignos(w0)) ? 4 : 0) + (nom.startsWith(w0) ? 3 : 0) + (nom.includes(w0) ? 2 : 0);
      return { p, puntos };
    }).filter(Boolean).sort((a, b) => b.puntos - a.puntos).map(x => x.p);
  }
  function resaltar(txt, q){
    let h = esc(txt);
    norm(q).split(/\s+/).filter(w => w.length > 1).forEach(w => {
      const i = norm(txt).indexOf(w); if (i < 0) return;
      const ori = String(txt).substr(i, w.length);
      h = h.replace(esc(ori), '<mark>' + esc(ori) + '</mark>');
    });
    return h;
  }
  // opciones.alElegir(p, evento): si devuelve true, no se navega a la página del producto.
  // opciones.alBuscar(q): Enter sin elegir sugerencia (por defecto va al catálogo filtrado).
  function sugerir(input, opciones = {}){
    const P = window.PRODUCTOS || [];
    const box = document.createElement('div'); box.className = 'sug'; box.hidden = true; box.setAttribute('role', 'listbox');
    input.parentElement.style.position = 'relative'; input.parentElement.appendChild(box);
    input.setAttribute('autocomplete', 'off'); input.setAttribute('aria-autocomplete', 'list');
    let res = [], sel = -1;
    const pintar = () => {
      const q = input.value.trim(); res = q.length < 2 ? [] : buscar(q, P).slice(0, 6); sel = -1;
      box.hidden = !res.length && q.length < 2;
      box.innerHTML = res.map((p, i) => `<a href="${esc(urlProducto(p))}" data-i="${i}" role="option">
          <img src="${esc(fotos(p)[0])}" alt="" loading="lazy"><span><b>${resaltar(p.nombre, q)}</b>
          <small>${p.referencia ? 'Ref. ' + resaltar(p.referencia, q) + ' · ' : ''}${esc(p.marca || p.categoria)}</small></span></a>`).join('') +
        (q.length >= 2 ? `<a class="todo" href="/catalogo?q=${encodeURIComponent(q)}" data-todo>${res.length ? 'Ver todos los resultados' : 'Sin coincidencias: pregúntanos por WhatsApp'} →</a>` : '');
      if (q.length >= 2 && !res.length) box.querySelector('[data-todo]').href = wa('Hola, estoy buscando este repuesto: ' + q + '. ¿Lo tienen disponible?');
    };
    const marcar = () => box.querySelectorAll('[data-i]').forEach((a, i) => a.classList.toggle('on', i === sel));
    input.addEventListener('input', pintar);
    input.addEventListener('focus', () => { if (input.value.trim().length >= 2) pintar(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' && res.length){ e.preventDefault(); sel = (sel + 1) % res.length; marcar(); }
      else if (e.key === 'ArrowUp' && res.length){ e.preventDefault(); sel = (sel - 1 + res.length) % res.length; marcar(); }
      else if (e.key === 'Escape'){ box.hidden = true; }
      else if (e.key === 'Enter'){
        e.preventDefault(); box.hidden = true;
        if (sel >= 0) return elegir(res[sel], e);
        opciones.alBuscar ? opciones.alBuscar(input.value.trim()) : (location.href = '/catalogo?q=' + encodeURIComponent(input.value.trim()));
      }
    });
    function elegir(p, e){ box.hidden = true; if (!(opciones.alElegir && opciones.alElegir(p, e))) location.href = urlProducto(p); }
    box.addEventListener('mousedown', e => e.preventDefault()); // evita que el input pierda el foco antes del clic
    box.addEventListener('click', e => { const a = e.target.closest('[data-i]'); if (!a) return; e.preventDefault(); elegir(res[a.dataset.i], e); });
    document.addEventListener('click', e => { if (!input.parentElement.contains(e.target)) box.hidden = true; });
  }

  // ---------- Zoom de fotos (PhotoSwipe, cargado solo cuando se usa) ----------
  function zoom(lista, inicio = 0){ import('/zoom.js').then(m => m.abrir(lista, inicio)); }

  // Enlaces de WhatsApp genéricos y menú móvil
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa(); a.target = '_blank'; a.rel = 'noopener'; });
    document.querySelectorAll('[data-ico]').forEach(el => el.insertAdjacentHTML('afterbegin', ICONOS[el.dataset.ico] || ''));
    const b = document.querySelector('.menu-btn'), n = document.querySelector('.nav');
    if (b && n) b.onclick = () => n.classList.toggle('open');
    document.querySelectorAll('[data-year]').forEach(e => e.textContent = new Date().getFullYear());
    // La lista de cotización funciona en todas las páginas que muestran productos.
    if (!window.COT && window.PRODUCTOS){
      document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/cotizacion.css">');
      const s = document.createElement('script'); s.src = '/cotizacion.js'; document.body.appendChild(s);
    }
  });

  window.APP = { esc, wa, msgProducto, icono, card, fotos, ruta, urlProducto, norm, buscar, sugerir, zoom, ICONOS };
})();
