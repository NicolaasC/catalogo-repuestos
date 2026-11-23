---
version: alpha
name: Conexión Scania
description: Catálogo de repuestos para buses y camiones Scania con cotización por WhatsApp.
colors:
  primary: "#D62938"
  primary-hover: "#EF3B4A"
  surface: "#101D32"
  surface-raised: "#16263F"
  surface-high: "#1F3352"
  surface-deep: "#0B1524"
  on-surface: "#F4F5F7"
  on-surface-muted: "#929BA8"
  body-text: "#C3C9D2"
  whatsapp: "#25D366"
  on-whatsapp: "#0B2A17"
  error: "#FF8A8A"
typography:
  headline-display:
    fontFamily: Barlow Condensed
    fontSize: 104px
    fontWeight: 800
    lineHeight: 0.88
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 52px
    fontWeight: 800
    lineHeight: 0.95
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 22px
    fontWeight: 800
    lineHeight: 1.02
  label-lg:
    fontFamily: Barlow Condensed
    fontSize: 16px
    fontWeight: 700
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    letterSpacing: 0.12em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 8px
  md: 10px
  lg: 14px
  xl: 18px
  full: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 18px
  lg: 24px
  xl: 48px
  section: 88px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 13px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.on-whatsapp}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: 13px
  card-product:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
  card-product-meta:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
  text-lead:
    textColor: "{colors.body-text}"
    typography: "{typography.body-lg}"
  category-tile-hover:
    backgroundColor: "{colors.surface-high}"
  footer:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.on-surface-muted}"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 13px
---

## Overview

Industrial y confiable, como la cabina de un camión de noche: fondo azul marino
profundo, titulares condensados en mayúscula y cursiva, y un rojo de señalización
que solo aparece donde hay que actuar. El sitio es un catálogo B2B para mecánicos,
dueños de flota y transportadores en Colombia: deben encontrar la referencia
rápido, desde el celular y a veces con mala señal.

## Colors

- **Primary (#D62938):** rojo de señalización. Solo para la acción principal
  (agregar a la cotización, enviar), la línea bajo el nombre de marca y acentos.
- **Surface (#101D32):** azul marino base de todas las páginas. El sitio es solo oscuro.
- **Surface raised (#16263F):** tarjetas, campos y paneles sobre el fondo.
- **WhatsApp (#25D366):** exclusivo para botones que abren WhatsApp. Nunca para otra cosa.
- **Muted (#929BA8):** referencias, marcas y textos secundarios.

## Typography

- **Barlow Condensed** (600–800, cursiva en titulares grandes), siempre en
  MAYÚSCULA: titulares, nombres de producto y botones.
- **Inter** (400–600): todo el texto de lectura, formularios y datos técnicos.
- Las referencias de repuestos (ej. "Ref. 1889797") van en Inter, nunca en mayúscula condensada.

## Layout

- Contenedor máximo de 1200px con márgenes laterales de 24px (14px en celular).
- Catálogo en cuadrícula: mínimo 220px por tarjeta en computador y 2 columnas fijas en celular.
- Encabezado fijo de 72px; la barra de búsqueda del catálogo queda fija debajo.

## Elevation & Depth

Profundidad con capas de azul (surface → raised → high), bordes de 1px muy
sutiles (rgba(244,245,247,.10)) y sombras negras suaves solo al pasar el mouse.
Movimiento: 150ms en botones, 180ms para levantar tarjetas (-4px) y 400ms para el
zoom suave de fotos (1.04). Nada de animaciones largas ni automáticas.

## Shapes

Esquinas de 14px en tarjetas, 8–10px en botones y campos, y píldoras en filtros.
Las bandas diagonales rojas (115°) son el motivo gráfico de la marca; úsalas con moderación.

## Components

- **Tarjeta de producto:** foto arriba (4:5; 1:1 en celular), franja roja de 3px,
  categoría en rojo pequeño, nombre en Barlow y botón "+ Agregar" de borde rojo.
- **Ficha:** diálogo con foto y miniaturas a la izquierda, datos técnicos en tabla
  y dos acciones: "Agregar a mi cotización" (rojo) y "Preguntar por WhatsApp" (verde).
- **Mi cotización:** panel lateral derecho; botón flotante rojo abajo a la izquierda
  (el de WhatsApp va abajo a la derecha).

## Voice & Content Strategy

Español de Colombia, trato de "tú", directo y técnico. Hablamos de "repuestos",
"referencia" y "cotización", nunca de "comprar" ni de precios: el sitio no vende,
cotiza. Las marcas de terceros solo se nombran para indicar compatibilidad.

## Do's and Don'ts

- Do usar el rojo solo para una acción principal por vista.
- Do mostrar siempre la referencia del repuesto cuando exista.
- Do probar todo a 390px de ancho primero: la mayoría de clientes usan celular.
- Don't usar el logo ni la tipografía oficial de Scania: somos distribuidor independiente.
- Don't agregar fondos claros, gradientes de colores nuevos ni más de dos familias tipográficas.
- Don't pedir datos personales sin la casilla de autorización (Ley 1581).
