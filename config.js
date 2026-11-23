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
