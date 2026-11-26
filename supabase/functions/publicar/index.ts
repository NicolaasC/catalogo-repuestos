// Edge Function "publicar": la llama el botón "Publicar cambios" del panel /admin.
// Verifica que el usuario sea administrador y dispara el Deploy Hook de Vercel,
// que reconstruye el sitio leyendo los productos desde Supabase.
// Secreto requerido: VERCEL_DEPLOY_HOOK (se guarda en Supabase, nunca en el código).
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';

const ORIGENES = [/^https:\/\/(conexion-scania|catalogo-repuestos)[a-z0-9-]*\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

function cors(origen: string | null) {
  const ok = origen && ORIGENES.some(r => r.test(origen));
  return {
    'Access-Control-Allow-Origin': ok ? origen! : 'https://conexion-scania.vercel.app',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

Deno.serve(async (req) => {
  const h = cors(req.headers.get('Origin'));
  const json = (cuerpo: unknown, status = 200) =>
    new Response(JSON.stringify(cuerpo), { status, headers: { ...h, 'Content-Type': 'application/json' } });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: esAdmin, error } = await sb.rpc('es_admin');
  if (error || esAdmin !== true) return json({ error: 'No autorizado' }, 403);

  const hook = Deno.env.get('VERCEL_DEPLOY_HOOK');
  if (!hook) return json({ error: 'Falta configurar el secreto VERCEL_DEPLOY_HOOK en Supabase.' }, 500);

  const r = await fetch(hook, { method: 'POST' });
  if (!r.ok) return json({ error: `Vercel respondió ${r.status}` }, 502);
  await sb.from('publicaciones').insert({ origen: 'panel' });
  return json({ ok: true, mensaje: 'Publicando: el catálogo se actualiza en 1 a 2 minutos.' });
});
