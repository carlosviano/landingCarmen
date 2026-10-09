// /eventos: la página, sus montajes y el formulario de solicitud.

/**
 * Un montaje ya servido: qué se hizo, para qué celebración y cómo. Cada uno
 * es una tarjeta de /eventos, en el orden de esta lista.
 */
export interface Montaje {
  /**
   * Antetítulo de la tarjeta: el tipo de celebración. Entre corchetes hasta
   * que se sepa de qué evento real es cada foto (mismo criterio que el
   * precio de `Tarta`: se ve en pantalla y así no se publica sin querer).
   */
  tipoEvento: string;
  titulo: string;
  descripcion: string;
  /** Nombre del archivo en `src/assets/images/`. A diferencia de `Tarta.archivo`
   * no puede ser `null`: un montaje sin foto no cuenta nada, así que no se
   * publica hasta tener una. */
  archivo: string;
  alt: string;
  /** "[MES 2026]" hasta que se fechen los montajes de verdad. */
  mes: string;
  lugar: string;
  /**
   * Punto de la foto que no se puede recortar, como `object-position` en CSS
   * ("50% 62%"). Va suelto de `archivo` porque depende del encuadre de CADA
   * foto y no se puede derivar de nada; sin él, el recorte por defecto
   * (centro) basta.
   */
  enfoque?: string;
  /**
   * Lo que sale en la cinta de "Ver más" bajo la tarjeta, en este orden. Sin
   * galería (o vacía) la tarjeta no lleva el botón. Cuatro como máximo: en
   * escritorio es una fila fija de cuatro y con más el build se para.
   */
  galeria?: PiezaMontaje[];
}

/**
 * Una pieza de la cinta de un montaje. Los vídeos todavía no existen: una
 * pieza `video` se pinta como hueco gris con el icono de play, para ver la
 * cinta con su mezcla final. Cuando haya vídeos de verdad, aquí irá su archivo.
 */
export type PiezaMontaje =
  | {
      tipo: "foto";
      /** Nombre del archivo en `src/assets/images/`. */
      archivo: string;
      alt: string;
      /** Pie corto bajo la foto. */
      pie?: string;
      /** Como `Montaje.enfoque`: el punto de la foto que no se recorta. */
      enfoque?: string;
    }
  | { tipo: "video"; pie?: string };

export interface Eventos {
  // Portada: sección "eventos" de la home.
  etiqueta: string;
  titulo: string;
  entradilla: string;
  // /eventos: la página con la lista completa.
  etiquetaPagina: string;
  tituloPagina: string;
  entradillaPagina: string;
  /** Foto a sangre de la cabecera de /eventos. Nombre en `src/assets/images/`. */
  fotoCabecera: string;
  altCabecera: string;
  /** El botón de la cabecera de /eventos: baja al formulario. */
  ctaCabecera: string;
  /** Los tres pasos de la franja rust bajo la cabecera de /eventos. */
  pasos: { titulo: string; detalle: string }[];
  /** Antetítulo y titular encima de las tarjetas de /eventos. */
  etiquetaMontajes: string;
  tituloMontajes: string;
  /** Enlace de cierre de la lista, hacia el perfil de Instagram. */
  masMontajes: string;
  /** Los textos de la cinta "Ver más" bajo cada tarjeta (`Montaje.galeria`). */
  cinta: {
    verMas: string;
    verMenos: string;
    /** Leyenda sobre la cinta abierta. */
    etiqueta: string;
    /** Cierre de la cinta: baja al formulario, como el botón de la cabecera. */
    cta: string;
    cerrar: string;
    /** Rótulo del hueco gris mientras no haya vídeos de verdad. */
    videoPendiente?: string;
  };
  montajes: Montaje[];
}

export const EVENTOS: Eventos = {
  etiqueta: "Eventos",
  titulo: "Momentos para celebrar...",
  entradilla:
    "Nos encargamos de endulzar esas celebraciones tan especiales, creando cada propuesta a medida para la ocasión. El lugar, la hora, las personas y cada pequeño detalle se tienen en cuenta para que todo encaje y tú solo tengas que disfrutar. ",
  etiquetaPagina: "Eventos · Málaga",
  tituloPagina: "Para el día concreto que celebras",
  entradillaPagina:
    "Tartas de boda, dulces y postres emplatados por encargo. Diseñados para cada celebración y preparados en el lugar y momento elegido.", // TODO: confirmar que se puede publicar: se le ve la cara a la novia.
  fotoCabecera: "tarta-boda-nati-con-nati.jpeg",
  altCabecera:
    "En blanco y negro, una novia se ríe inclinada junto a su tarta de boda, cubierta de pétalos blancos.",
  ctaCabecera: "Pedir presupuesto",
  pasos: [
    { titulo: "La idea", detalle: "Fecha, sitio, invitados..." },
    { titulo: "La propuesta", detalle: "Piezas, sabores y presupuesto." },
    {
      titulo: "La puesta en escena",
      detalle: "El mismo día, en el sitio y a su hora.",
    },
  ],
  etiquetaMontajes: "Montajes ya servidos",
  tituloMontajes: "Celebraciones hechas realidad",
  masMontajes: "Hay más proyectos en Instagram",
  cinta: {
    verMas: "Ver más",
    verMenos: "Ver menos",
    etiqueta: "Más del montaje",
    cta: "Quiero algo parecido",
    cerrar: "Cerrar",
  },
  montajes: [
    {
      tipoEvento: "Pedidas",
      titulo: "Pequeños bocados sobre musgo y eucalipto",
      descripcion:
        "Un montaje de fondo oscuro en el que el musgo y el eucalipto aportaban estructura y profundidad, dejando que los espejos fueran los protagonistas.  Estos, además de aportar un elemento distintivo a la propuesta, se convierten en pequeños platos de cóctel para disfrutar de cada bocado de forma individual.",
      archivo: "mesa_cumple_nati.jpeg",
      alt: "Mesa larga con mantel negro, musgo y ramas de eucalipto entre bocados dulces servidos en piezas individuales.",
      mes: "Junio 2026",
      lugar: "Málaga",
      enfoque: "50% 62%",
      galeria: [
        {
          tipo: "foto",
          archivo: "mesaPedida2.jpg",
          alt: "La mesa vacía antes del servicio: un lecho de musgo con flores blancas y eucalipto sobre mantel oscuro, rodeado de espejos cuadrados.",
          pie: "El montaje, antes de los dulces",
          enfoque: "50% 60%",
        },
        {
          tipo: "foto",
          archivo: "mesaPedida3.jpg",
          alt: "Detalle de los espejos cuadrados repartidos sobre el mantel, junto al musgo, las flores blancas y las ramas de eucalipto.",
          pie: "Los espejos, platos de cóctel",
          enfoque: "50% 50%",
        },
        {
          tipo: "foto",
          archivo: "mesaPedida1.jpg",
          alt: "Una flor de zanahoria silvestre se alza sobre el musgo y el eucalipto, reflejada en el espejo largo del fondo.",
          pie: "Musgo, eucalipto y flor silvestre",
          enfoque: "50% 45%",
        },
        {
          tipo: "foto",
          archivo: "mesaPedida4.jpg",
          alt: "La mesa ya servida: cada bocado sobre su espejo, con pétalos de caléndula, y al fondo los últimos retoques.",
          pie: "Bocado a bocado, ya servida",
          enfoque: "50% 55%",
        },
      ],
    },
    {
      tipoEvento: "Bodas",
      titulo: "Tarta de boda",
      descripcion:
        "Una tarta de boda inspirada en la silueta de un vestido de gran volumen. Sus formas, capas y movimiento trasladan la elegancia del diseño textil a una pieza dulce, pensada para convertirse en parte de la celebración.",
      archivo: "tartaPapelAzucar1.jpeg",
      alt: "tarta de boda inspirada en la silueta de un vestido de gran volumen. Sus formas, capas y movimiento trasladan la elegancia del diseño textil a una pieza dulce",
      mes: "Septiembre 2026",
      lugar: "Málaga",
      enfoque: "50% 55%",
      galeria: [
        {
          tipo: "foto",
          archivo: "tartaPapelAzucar3.jpeg",
          alt: "Tarta de boda inspirada en la silueta de un vestido de gran volumen en el obrador",
          pie: "Piezas y estructura en el obrador",
          enfoque: "50% 90%",
        },
        {
          tipo: "foto",
          archivo: "tartaPapelAzucar2.jpeg",
          alt: "Volantes de azucar de la tarta de boda",
          pie: "Volantes de azucar",
          enfoque: "50% 90%",
        },
        {
          tipo: "foto",
          archivo: "tarta-boda-nati.jpeg",
          alt: "La tarta de boda ya montada con muñecos de los novios encima en la celebracion",
          pie: "En la celebracion",
          enfoque: "50% 90%",
        },
        {
          tipo: "foto",
          archivo: "tarta-boda-nati-con-nati.jpeg",
          alt: "En blanco y negro, la novia se ríe inclinada junto a su tarta de boda, a juego con el volumen de su vestido.",
          pie: "La novia junto a su tarta",
          enfoque: "60% 50%",
        },
      ],
    },
  ],
};

// El formulario del final de /eventos. Sustituye al WhatsApp suelto de antes:
// un evento necesita fecha, sitio e invitados para poder presupuestarse, y
// por WhatsApp llegaban a trozos. WhatsApp se queda como vía secundaria, con
// el mensaje ya empezado (ver `mensajeEvento` en src/lib/solicitud.ts).
//
// Las opciones de los desplegables y los chips se pintan tal cual, en este
// orden: cambiar una es cambiarla aquí.
export const SOLICITUD_EVENTO = {
  etiqueta: "¿Tienes fecha?",
  titulo: "Cuéntame qué celebras",
  texto:
    "Con estos datos te digo qué se puede montar, en qué plazo y con qué presupuesto. Cuanto más concretes, más afinada sale la propuesta.",
  // TODO: plazo real de respuesta. Entre corchetes para que no se publique
  // sin querer, mismo criterio que los precios.
  pasos: [
    {
      titulo: "Me envías la solicitud.",
      detalle: "Fecha, sitio, invitados y lo que tienes en la cabeza.",
    },
    {
      titulo: "Te respondo en menos de 7 días.",
      detalle: "Con una propuesta y un presupuesto orientativo.",
    },
    {
      titulo: "Cerramos el montaje.",
      detalle: "Ajustamos sabores, piezas y la hora de montaje.",
    },
  ],
  tipos: [
    "Boda",
    "Cumpleaños",
    "Comunión o bautizo",
    "Empresa",
    "Otra celebración",
  ] as const,
  // Cinco tramos: cada uno cambia el tipo de montaje (una tarta, una mesa
  // dulce, varias mesas), que es para lo que sirve el dato. El número exacto
  // se cierra después, hablando.
  // TODO: confirmar con Carmen el techo que puede asumir.
  invitados: [
    "Menos de 25",
    "25 – 50",
    "50 – 100",
    "100 – 200",
    "Más de 200",
  ] as const,
  placeholderInteres:
    "Cuéntame qué tienes en mente: qué te gustaría servir, el estilo de la celebración, colores, alergias… cualquier detalle que te importe.",
  // Fotos de inspiración. Cuatro como mucho y de hasta 8 MB cada una: una
  // foto de iPhone pesa 2–5 MB, y más de cuatro ya no inspiran, dispersan.
  fotos: { maximo: 4, megasMaximo: 8 },
  // Justo encima del botón: que nadie lea "enviar" como "reservar", y menos
  // quien escribe para un evento de un día para otro.
  aviso:
    "Esta solicitud es una consulta, no una reserva. Revisaremos tu petición y te confirmaremos la fecha y los detalles según nuestra disponibilidad, por lo que no podemos garantizar eventos con muy poca antelación.",
  boton: "Enviar solicitud",
  // Adónde se manda el formulario (POST multipart, con las fotos dentro).
  // TODO: conectar. Mientras sea null el formulario valida pero no envía, y
  // lo dice en pantalla: así nadie cree haber mandado algo que no ha llegado.
  envio: null as string | null,
  whatsapp: {
    antes: "¿Prefieres hablar?",
    enlace: "Escríbeme por WhatsApp",
  },
  // Bajo los pasos del marco (MarcoSolicitud).
  nota: "Todo por encargo",
};
