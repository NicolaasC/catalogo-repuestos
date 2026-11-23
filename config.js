// Datos generales de la marca. Cambia aquí y se actualiza todo el sitio.
window.CONFIG = {
  nombre: "Conexión Scania",
  lema: "Tu equipo en movimiento.",
  subtitulo: "Repuestos para buses y camiones",
  // Número de WhatsApp con código de país, solo dígitos. Ej: "573001234567".
  // Mientras esté vacío, el botón abre WhatsApp para que el cliente elija a quién enviar.
  whatsapp: "573205530354",
  // Productos que aparecen en la página de inicio (por id).
  destacados: [
    "kit-filtro-aps", "compresor-aire-knorr", "kit-embrague-seis-resortes",
    "kit-filtro-aire", "sombrilla-retarder", "kit-escualizacion-18-dientes"
  ],
  // Dirección pública del sitio (para enlaces al compartir y para Google).
  sitio: "https://catalogo-repuestos-eight.vercel.app",
  // Sección "Por qué cotizar con nosotros" de la página de inicio.
  // ⚠ BORRADOR: confirma o corrige cada punto antes de publicar. Si dejas la lista vacía [], la sección no aparece.
  confianza: [
    { titulo: "Respuesta rápida", texto: "Respondemos tu cotización por WhatsApp el mismo día hábil." },
    { titulo: "Envíos a toda Colombia", texto: "Despachamos por transportadora a cualquier ciudad del país." },
    { titulo: "Pagos seguros", texto: "Transferencia bancaria o consignación. Te enviamos factura." },
    { titulo: "Garantía", texto: "Todos los repuestos tienen garantía por defectos de fábrica." }
  ],
  // Supabase: Project Settings → API. Usa la "Project URL" y la clave pública
  // ("publishable" o "anon"). NUNCA pongas aquí la clave "secret" / "service_role".
  // Si se dejan vacías, la cotización igual se envía por WhatsApp pero no se guarda.
  supabase: {
    url: "https://xrfxqcmosfqayqcxlapc.supabase.co",
    key: "sb_publishable_3wy8pnUwI7KDAH4i70YdEA_TWfhI3jR"
  },
  // Datos del responsable del tratamiento de datos (Ley 1581 de 2012).
  // Se muestran en privacidad.html. Complétalos antes de publicar.
  legal: {
    responsable: "",   // Nombre completo o razón social
    documento: "",     // C.C. o NIT
    direccion: "",
    ciudad: "",
    correo: "",        // Correo para consultas y reclamos sobre datos
    telefono: "",
    vigencia: "23 de noviembre de 2026"
  }
};
