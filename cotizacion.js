// Lista de cotización: el cliente agrega repuestos, deja sus datos y se envía por WhatsApp.
// Si CONFIG.supabase está configurado, la solicitud también se guarda en la tabla "cotizaciones".
(function(){
  const C = window.CONFIG || {}, P = window.PRODUCTOS || [], { esc, wa, ICONOS, fotos } = window.APP;
  const KEY = 'cs_cotizacion_v1', ULTIMA = 'cs_ultima_cotizacion_v1', AVISO = 'cs_aviso_almacenamiento_v1', POLITICA = 'v1.1-2026-11-23';
  const store = {
    get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  let items = store.get(KEY, []).filter(i => P.some(p => p.id === i.id));
  const prod = id => P.find(p => p.id === id);
  const total = () => items.reduce((n, i) => n + i.cantidad, 0);
  const guardar = () => { store.set(KEY, items); pintar(); };

  // ---------- UI ----------
  document.body.insertAdjacentHTML('beforeend', `
    <button class="cot-fab" type="button" data-cot-open hidden aria-label="Ver mi cotización">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6l1 2h3v15H5V6h3z"/><path d="M9 11h6M9 15h4"/></svg>
      Mi cotización <b data-cot-count>0</b>
    </button>
    <div class="cot-back" hidden></div>
    <aside class="cot" role="dialog" aria-modal="true" aria-labelledby="cot-t" hidden>
      <header><h2 id="cot-t">Mi cotización</h2><button type="button" class="cot-x" aria-label="Cerrar">×</button></header>
      <div class="cot-body">
        <ul class="cot-list"></ul>
        <div class="cot-empty"><p>Aún no has agregado repuestos. Toca <b>“+ Agregar”</b> en cualquier repuesto del catálogo, o escribe abajo lo que necesitas si no lo encuentras.</p>
          <button type="button" class="btn cot-repetir" hidden></button></div>
        <form class="cot-form" novalidate>
          <h3>Tus datos</h3>
          <label>Nombre completo *<input name="nombre" required minlength="2" maxlength="120" autocomplete="name"></label>
          <label>Celular / WhatsApp *<input name="telefono" type="tel" required minlength="7" maxlength="20" autocomplete="tel" inputmode="tel"></label>
          <div class="cot-2">
            <label>Ciudad *<input name="ciudad" required maxlength="80" autocomplete="address-level2"></label>
            <label>Empresa <span>(opcional)</span><input name="empresa" maxlength="120" autocomplete="organization"></label>
          </div>
          <label>Correo <span>(opcional)</span><input name="email" type="email" maxlength="160" autocomplete="email"></label>
          <label>Vehículo <span>(modelo, año o VIN, opcional)</span><input name="vehiculo" maxlength="120"></label>
          <label>¿Necesitas algo que no está en el catálogo? <span>(opcional)</span><textarea name="otros" rows="2" maxlength="1000" placeholder="Ej: Bomba de agua Scania R440, ref. 1234567"></textarea>
            <small class="cot-otros-ayuda">Escribe el nombre, la referencia o el modelo del vehículo.</small></label>
          <label>Comentarios <span>(opcional)</span><textarea name="comentario" rows="2" maxlength="1000"></textarea></label>
          <input class="cot-hp" name="sitio_web" tabindex="-1" autocomplete="off" aria-hidden="true">
          <label class="cot-ok"><input type="checkbox" name="acepta" required>
            <span>Autorizo de forma previa, expresa e informada a ${esc((C.legal && C.legal.responsable) || C.nombre)} para tratar mis datos personales con el fin de responder esta solicitud de cotización y hacerle seguimiento, conforme a la <a href="/privacidad" target="_blank">Política de tratamiento de datos</a> (Ley 1581 de 2012). *</span></label>
          <p class="cot-err" role="alert"></p>
          <button class="btn btn-wa cot-send" type="submit">${ICONOS._wa}Enviar cotización por WhatsApp</button>
          <p class="cot-note">Se abrirá WhatsApp con tu solicitud lista para enviar. Los precios y la disponibilidad se confirman en la respuesta.</p>
        </form>
      </div>
    </aside>
    <div class="cot-aviso" hidden><p>Usamos el almacenamiento de tu navegador solo para recordar tu lista de cotización. No usamos cookies publicitarias ni de seguimiento. <a href="/privacidad#cookies">Más información</a></p><button type="button" class="btn btn-red">Entendido</button></div>`);

  const $ = s => document.querySelector(s);
  const panel = $('.cot'), back = $('.cot-back'), list = $('.cot-list'), form = $('.cot-form'), err = $('.cot-err'), fab = $('.cot-fab');

  function pintar(){
    const n = total();
    document.querySelectorAll('[data-cot-count]').forEach(e => e.textContent = n);
    fab.hidden = n === 0;
    $('.cot-empty').hidden = n > 0;
    const ult = store.get(ULTIMA, []).filter(i => P.some(p => p.id === i.id)), rep = $('.cot-repetir');
    rep.hidden = n > 0 || !ult.length;
    rep.textContent = `↻ Repetir mi última cotización (${ult.length} ${ult.length === 1 ? 'repuesto' : 'repuestos'})`;
    list.innerHTML = items.map(i => { const p = prod(i.id); return `
      <li data-id="${esc(i.id)}"><img src="${esc(fotos(p)[0])}" alt="" loading="lazy">
        <div><b>${esc(p.nombre)}</b><small>${esc([p.marca, p.referencia && 'Ref. ' + p.referencia].filter(Boolean).join(' · '))}</small></div>
        <div class="cot-qty"><button type="button" data-d="-1" aria-label="Menos">−</button><span>${i.cantidad}</span><button type="button" data-d="1" aria-label="Más">+</button></div>
        <button type="button" class="cot-rm" aria-label="Quitar ${esc(p.nombre)}">×</button></li>`; }).join('');
    document.querySelectorAll('[data-cot-add]').forEach(b => {
      const dentro = items.some(i => i.id === b.dataset.cotAdd);
      b.classList.toggle('on', dentro);
      b.textContent = 'corto' in b.dataset ? (dentro ? '✓ Agregado' : 'Agregar')
        : (dentro ? '✓ En tu cotización · Ver lista' : 'Agregar a mi cotización');
    });
  }
  function abrir(){ panel.hidden = back.hidden = false; document.body.style.overflow = 'hidden'; panel.querySelector('.cot-x').focus(); }
  function cerrar(){ panel.hidden = back.hidden = true; document.body.style.overflow = ''; }

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-cot-add]');
    if (add){
      e.preventDefault();
      if (!items.some(i => i.id === add.dataset.cotAdd)){
        items.push({ id: add.dataset.cotAdd, cantidad: 1 }); guardar();
        fab.classList.remove('pulso'); void fab.offsetWidth; fab.classList.add('pulso');
      }
      else { const d = document.getElementById('dlg'); if (d && d.open) d.close(); abrir(); }
      return;
    }
    if (e.target.closest('[data-cot-open]')){ e.preventDefault(); const d = document.getElementById('dlg'); if (d && d.open) d.close(); abrir(); }
  });
  $('.cot-repetir').onclick = () => { items = store.get(ULTIMA, []).filter(i => P.some(p => p.id === i.id)); guardar(); };
  back.onclick = cerrar; panel.querySelector('.cot-x').onclick = cerrar;
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) cerrar(); });
  list.onclick = e => {
    const li = e.target.closest('li'); if (!li) return;
    const it = items.find(i => i.id === li.dataset.id);
    if (e.target.closest('.cot-rm')) items = items.filter(i => i !== it);
    else if (e.target.dataset.d) it.cantidad = Math.max(1, Math.min(999, it.cantidad + Number(e.target.dataset.d)));
    else return;
    guardar();
  };
  // Los botones "Agregar" que aparecen después (ficha del producto) se actualizan solos.
  new MutationObserver(() => { if (document.querySelector('[data-cot-add]:not([data-pintado])')){
    document.querySelectorAll('[data-cot-add]').forEach(b => b.dataset.pintado = 1); pintar(); } })
    .observe(document.body, { childList: true, subtree: true });

  // ---------- Envío ----------
  async function guardarEnSupabase(fila){
    const s = C.supabase || {};
    if (!s.url || !s.key) return false;
    const h = { apikey: s.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
    if (s.key.startsWith('eyJ')) h.Authorization = 'Bearer ' + s.key; // clave "anon" antigua (JWT)
    const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6000);
    try {
      const r = await fetch(s.url.replace(/\/$/, '') + '/rest/v1/cotizaciones', { method: 'POST', headers: h, body: JSON.stringify(fila), signal: ctrl.signal });
      if (!r.ok) console.warn('Supabase', r.status, await r.text());
      return r.ok;
    } catch (x) { console.warn('Supabase', x); return false; } finally { clearTimeout(t); }
  }

  form.onsubmit = async e => {
    e.preventDefault(); err.textContent = '';
    const f = Object.fromEntries(new FormData(form)); Object.keys(f).forEach(k => f[k] = String(f[k]).trim());
    if (f.sitio_web) return; // bot
    if (!items.length && f.otros.length < 3){
      err.textContent = 'Agrega al menos un repuesto del catálogo o escribe lo que necesitas.'; form.otros.focus(); return;
    }
    if (!form.checkValidity() || !/^[+\d][\d\s().-]{6,19}$/.test(f.telefono)){
      const soloFalta = [...form.querySelectorAll(':invalid')].every(x => x.name === 'acepta') && /^[+\d][\d\s().-]{6,19}$/.test(f.telefono);
      err.textContent = soloFalta ? 'Para enviar la solicitud debes aceptar la política de tratamiento de datos.' : 'Revisa los campos obligatorios (*) y el número de celular.';
      form.querySelector(':invalid')?.focus(); return;
    }
    const btn = form.querySelector('.cot-send'); btn.disabled = true;
    const id = (crypto.randomUUID ? crypto.randomUUID() : null);
    const codigo = (id || Date.now().toString(36)).replace(/-/g, '').slice(0, 6).toUpperCase();
    const productos = items.map(i => { const p = prod(i.id); return { id: p.id, nombre: p.nombre, referencia: p.referencia || null, marca: p.marca || null, cantidad: i.cantidad }; });
    const fila = { nombre: f.nombre, telefono: f.telefono, ciudad: f.ciudad, empresa: f.empresa || null, email: f.email || null,
      vehiculo: f.vehiculo || null, comentario: f.comentario || null, otros_repuestos: f.otros || null, productos, codigo,
      acepta_tratamiento: true, version_politica: POLITICA, origen: location.hostname };
    if (id) fila.id = id;
    await guardarEnSupabase(fila);

    const lineas = productos.map((p, n) => `${n + 1}. ${p.nombre}${p.referencia ? ' (Ref. ' + p.referencia + ')' : ''} — Cant: ${p.cantidad}`);
    const msg = [`Hola, quiero solicitar una cotización (N.º ${codigo}):`, '', ...lineas,
      f.otros ? (lineas.length ? '\n' : '') + `Repuestos que no están en el catálogo: ${f.otros}` : null, '',
      `Nombre: ${f.nombre}`, f.empresa ? `Empresa: ${f.empresa}` : null, `Ciudad: ${f.ciudad}`, `Celular: ${f.telefono}`,
      f.email ? `Correo: ${f.email}` : null, f.vehiculo ? `Vehículo: ${f.vehiculo}` : null, f.comentario ? `Comentarios: ${f.comentario}` : null
    ].filter(x => x !== null).join('\n');

    if (items.length) store.set(ULTIMA, items);
    items = []; guardar(); form.reset(); btn.disabled = false; cerrar();
    location.href = wa(msg);
  };

  // ---------- Aviso de almacenamiento ----------
  const aviso = $('.cot-aviso');
  if (!store.get(AVISO, false)){ aviso.hidden = false; aviso.querySelector('button').onclick = () => { store.set(AVISO, true); aviso.hidden = true; }; }

  document.body.classList.add('con-cot');
  window.COT = { abrir, cerrar };
  pintar();
})();
