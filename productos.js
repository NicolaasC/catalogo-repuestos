// Lista de productos del catálogo.
// Para agregar uno nuevo, copia un bloque { ... } y cambia sus datos.
window.PRODUCTOS = [
  {
    id: "bombona-trasera-firestone",
    nombre: "Bombona trasera Firestone",
    marca: "Firestone",
    categoria: "Suspensión",
    compatible: "Camiones Scania",
    descripcion: "Bombona (fuelle) de suspensión neumática para el eje trasero, con pistón metálico y espárrago de montaje.",
    imagen: "img/bombona-trasera-firestone.webp"
  },
  {
    id: "sensor-nivel-altura",
    nombre: "Sensor de nivel de altura",
    marca: "Scania",
    referencia: "1889797",
    categoria: "Suspensión",
    compatible: "Camiones Scania",
    descripcion: "Sensor de altura para la suspensión neumática. Mide la altura del chasis para que el sistema regule las bombonas.",
    imagen: "img/sensor-nivel-altura.webp"
  },
  {
    id: "kit-culata-compresor",
    nombre: "Kit culata compresor",
    categoria: "Frenos y aire",
    compatible: "Compresor de aire bicilíndrico, camiones Scania",
    descripcion: "Kit de reparación para la culata del compresor de aire: empaques de culata y de placa de válvulas, láminas de válvula, o-rings y kit de válvulas. Se usa cuando el compresor no carga o no sostiene la presión de aire.",
    imagen: "img/kit-culata-compresor.avif"
  },
  {
    id: "cilindro-freno-ahogo",
    nombre: "Cilindro freno de ahogo",
    marca: "Scania",
    categoria: "Frenos y aire",
    compatible: "Camiones Scania",
    descripcion: "Cilindro neumático que acciona la mariposa del freno de motor (freno de ahogo) en el escape.",
    imagen: "img/cilindro-freno-ahogo.avif"
  },
  {
    id: "retenedor-ciguenal-trasero",
    nombre: "Retenedor cigüeñal trasero",
    marca: "Elring",
    categoria: "Motor",
    compatible: "Motores Scania",
    descripcion: "Retenedor (sello) trasero del cigüeñal, lado volante. Evita fugas de aceite del motor hacia la campana del embrague.",
    imagen: "img/retenedor-ciguenal-trasero.avif"
  },
  {
    id: "balinera-reparticion",
    nombre: "Balinera repartición",
    marca: "FAG (Schaeffler)",
    categoria: "Motor",
    compatible: "Motores Scania",
    descripcion: "Rodamiento para la repartición del motor. Viene en caja FAG y en presentación con etiqueta Scania.",
    imagen: "img/balinera-reparticion.avif"
  },
  {
    id: "termostatos",
    nombre: "Termostatos",
    marca: "Scania",
    categoria: "Refrigeración",
    compatible: "Motores Scania",
    descripcion: "Termostato doble para el sistema de refrigeración. Regula el paso de refrigerante al radiador para mantener la temperatura de trabajo del motor.",
    imagen: "img/termostatos.avif"
  },
  {
    id: "tanque-auxiliar-refrigerante",
    nombre: "Tanque auxiliar de refrigerante",
    marca: "Reser Plastic",
    referencia: "000953",
    categoria: "Refrigeración",
    compatible: "Camiones Scania",
    descripcion: "Tanque de expansión (tanque auxiliar) del sistema de refrigeración, en polipropileno, con marca de nivel MAX. Va por encima del radiador y del motor, se conecta a ellos por las mangueras de respiro y alimenta la línea estática hacia la bomba de agua, lo que ayuda a evitar la cavitación.",
    imagen: "img/tanque-auxiliar-refrigerante.avif"
  },
  {
    id: "kit-embrague-seis-resortes",
    nombre: "Kit embrague seis resortes",
    categoria: "Embrague",
    compatible: "Camiones Scania",
    descripcion: "Kit de embrague completo: plato de presión (prensa), disco de embrague con amortiguador de seis resortes y balinera (collarín) de empuje. Se cambia en conjunto para que todas las piezas tengan el mismo desgaste y el embrague trabaje parejo.",
    imagen: "img/kit-embrague-seis-resortes.avif"
  },
  {
    id: "sombrilla-retarder",
    nombre: "Sombrilla retarder",
    marca: "Scania",
    referencia: "1790617",
    categoria: "Caja y retarder",
    compatible: "Cajas Scania con retarder (GR875R, GRS895R, GRS905R, GRS925R), series P/G/R/T y L/P/G/R/S",
    descripcion: "Pistón con anillo de la válvula del retarder (conocido como \"sombrilla\"). Reemplaza la referencia anterior 1507791.",
    imagen: "img/sombrilla-retarder.avif"
  },
  {
    id: "retenedor-transmision",
    nombre: "Retenedor transmisión",
    categoria: "Caja y retarder",
    compatible: "Camiones Scania",
    descripcion: "Retenedor (sello) de la transmisión para evitar fugas de aceite de la caja.",
    imagen: "img/retenedor-transmision.avif"
  },
  {
    id: "arandelas-satelites-planetarios",
    nombre: "Arandelas satélites y planetarios",
    marca: "Scania",
    referencia: "2107797",
    categoria: "Diferencial",
    compatible: "Diferenciales Scania RB662, R560, R660, R662, R665 y R680 (serie 4 y P/G/R/T)",
    descripcion: "Juego de arandelas de empuje (rasamiento) para los planetarios y satélites del diferencial.",
    imagen: "img/arandelas-satelites-planetarios.avif"
  },
  {
    id: "retenedor-ciguenal-delantero",
    nombre: "Retenedor cigüeñal delantero",
    marca: "Elring",
    referencia: "345.000",
    categoria: "Motor",
    compatible: "Motores Scania DC13 (OE Scania 1520998)",
    descripcion: "Retenedor delantero del cigüeñal de 135 x 153 x 13 mm, con labio de PTFE y cuerpo de caucho ACM. Sella el aceite en la parte frontal del motor, detrás de la polea/dámper.",
    imagen: "img/retenedor-ciguenal-delantero.avif"
  },
  {
    id: "compresor-aire-knorr",
    nombre: "Compresor de aire Knorr",
    marca: "Knorr-Bremse",
    categoria: "Frenos y aire",
    compatible: "Camiones Scania",
    descripcion: "Compresor de aire bicilíndrico que alimenta el sistema neumático del camión: frenos, suspensión de aire y accesorios. Unidad completa con culata y placa de válvulas.",
    imagen: "img/compresor-aire-knorr.avif"
  },
  {
    id: "correa-motor-10pk2425",
    nombre: "Correa de motor 10PK2425",
    marca: "Dayco",
    referencia: "10PK2425HD",
    categoria: "Motor",
    compatible: "Motores Scania",
    descripcion: "Correa poly-V (multicanal) heavy duty de 10 canales y 2.425 mm de largo. Mueve los accesorios del motor como alternador, bomba de agua y compresor de aire acondicionado. Fabricada en EPDM para soportar el calor y el torque de los motores diésel.",
    imagen: "img/correa-motor-10pk2425.avif"
  },
  {
    id: "kit-splinter",
    nombre: "Kit splinter",
    categoria: "Dirección",
    compatible: "Camiones Scania",
    descripcion: "Kit de pasador de mangueta (splinter / king pin) con sus bujes y rodamientos. Se cambia cuando la dirección tiene juego o la llanta delantera se desgasta disparejo.",
    imagen: "img/kit-splinter.avif"
  },
  {
    id: "refrigerante-motor",
    nombre: "Refrigerante motor",
    marca: "Fleetrite",
    categoria: "Refrigeración",
    compatible: "Motores diésel de servicio pesado",
    descripcion: "Refrigerante/anticongelante rojo de larga duración tipo NOAT (tecnología de ácidos orgánicos con nitrito), a base de etilenglicol. Galón de 3,78 L para motores diésel de servicio pesado. Protege contra la corrosión y la cavitación de las camisas.",
    imagen: "img/refrigerante-motor.avif"
  },
  {
    id: "empaque-carter-superior",
    nombre: "Empaque cárter superior",
    marca: "Elring",
    categoria: "Motor",
    compatible: "Motores Scania",
    descripcion: "Empaque del cárter superior (bastidor/ladder frame) en lámina metálica con sello de caucho vulcanizado. Va entre el bloque y el bastidor del cárter para evitar fugas de aceite.",
    imagen: "img/empaque-carter-superior.avif"
  },
  {
    id: "empaque-carter-inferior",
    nombre: "Empaque cárter inferior",
    marca: "Elring",
    categoria: "Motor",
    compatible: "Motores Scania",
    descripcion: "Empaque del cárter inferior (bandeja de aceite) en lámina metálica con sello de caucho. Sella la unión entre la bandeja y el motor para evitar fugas de aceite.",
    imagen: "img/empaque-carter-inferior.avif"
  },
  {
    id: "empaque-enfriador-aceite",
    nombre: "Empaque enfriador de aceite",
    marca: "Elring",
    categoria: "Motor",
    compatible: "Motores Scania",
    descripcion: "Empaque metálico con sellos de caucho para la tapa del enfriador de aceite. Separa los conductos de aceite y refrigerante para que no se mezclen.",
    imagen: "img/empaque-enfriador-aceite.avif"
  },
  {
    id: "kit-balineras-transmision",
    nombre: "Kit balineras transmisión",
    marca: "JTEKT (Koyo), Fersa y NTN",
    categoria: "Caja y retarder",
    compatible: "Cajas de cambios Scania",
    descripcion: "Juego de rodamientos para reparación de la caja de cambios: rodamientos de rodillos cónicos (entre ellos NTN 30312D y JTEKT JM720249E/10E) y de bolas.",
    imagen: "img/kit-balineras-transmision.avif"
  },
  {
    id: "rodamiento-bocin-trasero",
    nombre: "Rodamiento bocín trasero",
    marca: "FAG (Schaeffler)",
    categoria: "Ejes y bocines",
    compatible: "Eje trasero, camiones Scania",
    descripcion: "FAG Repair Insert Unit: unidad de rodamiento de rueda prearmada, sellada y engrasada de por vida para el bocín trasero. Se instala más rápido que los rodamientos sueltos.",
    imagen: "img/rodamiento-bocin-trasero.avif"
  },
  {
    id: "kit-filtro-aire",
    nombre: "Kit filtro de aire",
    marca: "MANN-FILTER",
    referencia: "C 26 1100 + CF 1650",
    categoria: "Filtros",
    compatible: "Scania con motores DC09 y DC13 (desde 2016), incluidos buses Scania e Irizar",
    descripcion: "Kit con el filtro de aire principal MANN C 26 1100 (251 x 170 x 533 mm) y su filtro de seguridad CF 1650. El filtro de seguridad va por dentro del principal y protege el motor aunque el principal se esté cambiando o se dañe. Referencias Scania del filtro de seguridad: 1510942 y 2734215.",
    imagen: "img/kit-filtro-aire.avif"
  },
  {
    id: "brazo-tensor-delantero",
    nombre: "Brazo tensor delantero",
    marca: "Vanderbilt",
    referencia: "2427669",
    categoria: "Suspensión",
    compatible: "Camiones Scania",
    descripcion: "Brazo (barra) de reacción con bujes de caucho en ambos extremos. Incluye su kit de tornillos y tuercas de montaje. Mantiene el eje en su posición al acelerar y frenar; cuando los bujes se gastan aparecen golpes y la dirección se siente suelta.",
    imagen: "img/brazo-tensor-delantero.avif"
  },
  {
    id: "plato-baja-sincronizador",
    nombre: "Plato de baja y sincronizador Scania",
    marca: "Euroricambi",
    referencia: "74.53.0713 (OE Scania 1925293)",
    categoria: "Caja y retarder",
    compatible: "Cajas de cambios Scania",
    descripcion: "Anillo sincronizador y plato (cono) del cambio de baja de la caja. Igualan la velocidad de los piñones antes de que enganchen para que el cambio entre suave. Se cambian cuando la baja raspa o no quiere entrar. Fabricados en Italia.",
    imagen: "img/plato-baja-sincronizador.avif"
  },
  {
    id: "tensor-correa-motor",
    nombre: "Tensor de correa de motor",
    referencia: "2089431",
    categoria: "Motor",
    compatible: "Scania series P/G/R/T y buses Scania (OE 2089431, 2129402, 1860734, 1734903)",
    descripcion: "Polea tensora/guía de 74 mm para la correa poly-V de los accesorios del motor, con su tornillo de montaje. Mantiene la correa tensa y alineada; si el rodamiento suena o la polea tiene juego, hay que cambiarla antes de que dañe la correa.",
    imagen: "img/tensor-correa-motor.avif"
  },
  {
    id: "kit-escualizacion-18-dientes",
    nombre: "Kit escualización 18 dientes",
    marca: "Euroricambi",
    referencia: "74.17.0563 / 0565 / 0566 / 0784",
    categoria: "Diferencial",
    compatible: "Diferenciales Scania (planetario OE 1779524, satélite OE 1545514, cruceta OE 1785126)",
    descripcion: "Kit para reparar el diferencial (escualizador): 2 planetarios de 18 dientes sin bloqueo, 4 satélites de 11 dientes, la cruceta y las arandelas de empuje. Fabricado en Italia.",
    imagen: "img/kit-escualizacion-18-dientes.avif"
  },
  {
    id: "kit-cauchos-estabilizadora",
    nombre: "Kit cauchos estabilizadora trasera y delantera",
    categoria: "Suspensión",
    compatible: "Camiones Scania",
    descripcion: "Juego de cauchos para las barras estabilizadoras delantera y trasera: bujes de la barra y cauchos cónicos de las bieletas. Quitan los golpes y el balanceo de la cabina en las curvas.",
    imagen: "img/kit-cauchos-estabilizadora.avif"
  },
  {
    id: "kit-filtro-aps",
    nombre: "Kit filtro APS completo",
    marca: "WABCO",
    referencia: "Filtro 432 410 228 2 · kits 9325109642 y 9325109552",
    categoria: "Frenos y aire",
    compatible: "Unidad APS (secador de aire) WABCO en camiones Scania",
    descripcion: "Kit completo para el APS: filtro secador WABCO (rosca 1 1/4\", 14 bar máx.) y kits de reparación originales WABCO para la unidad de procesamiento de aire, con resortes, o-rings, válvulas y racor. El APS seca el aire del compresor; un filtro saturado deja pasar agua y aceite a los frenos.",
    imagen: "img/kit-filtro-aps.avif"
  }
];
