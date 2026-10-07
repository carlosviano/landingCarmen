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
    videoPendiente: string;
  };
  montajes: Montaje[];
}

export const EVENTOS: Eventos = {
  etiqueta: "Eventos",
  titulo: "Cada celebración, una mesa distinta",
  entradilla:
    "Mesas dulces, tartas y postres para el día que celebras. El montaje se piensa con la fecha, el sitio y los invitados delante, así que no sale dos veces igual.",
  etiquetaPagina: "Eventos · Málaga",
  tituloPagina: "Para el día concreto que celebras",
  entradillaPagina:
    "Tartas de boda, mesas dulces y postres emplatados por encargo, montados en el sitio y a su hora.",
  // TODO: confirmar que se puede publicar: se le ve la cara a la novia.
  fotoCabecera: "tarta-boda-nati-con-nati.jpeg",
  altCabecera:
    "En blanco y negro, una novia se ríe inclinada junto a su tarta de boda, cubierta de pétalos blancos.",
  ctaCabecera: "Pedir presupuesto",
  pasos: [
    { titulo: "Me cuentas", detalle: "Fecha, sitio, invitados y la idea." },
    { titulo: "Te propongo", detalle: "Piezas, sabores y presupuesto." },
    { titulo: "Lo monto", detalle: "El mismo día, en el sitio y a su hora." },
  ],
  etiquetaMontajes: "Montajes ya servidos",
  tituloMontajes: "Cada celebración, una mesa distinta",
  masMontajes: "Hay más proyectos en Instagram",
  cinta: {
    verMas: "Ver más",
    verMenos: "Ver menos",
    etiqueta: "Más del montaje",
    cta: "Quiero algo parecido",
    cerrar: "Cerrar",
    videoPendiente: "Vídeo pendiente",
  },
  montajes: [
    {
      tipoEvento: "Cumpleaños",
      titulo: "Mesa dulce sobre musgo y eucalipto",
      descripcion:
        "Un montaje largo sobre mantel negro, con el verde haciendo de estructura: musgo, eucalipto y paniculata sostienen la línea y los dulces se apoyan en ella. Cada bocado va en su propia pieza, con su cucharilla, para cogerlo de pie y sin tener que cortar nada.",
      archivo: "mesa_cumple_nati.jpeg",
      alt: "Mesa larga con mantel negro, musgo y ramas de eucalipto entre bocados dulces servidos en piezas individuales.",
      mes: "[MES 2026]",
      lugar: "Málaga",
      enfoque: "50% 62%",
      // TODO: confirmar con la clienta qué fotos son de este montaje: las del
      // obrador están puestas para ver la cinta llena.
      galeria: [
        {
          tipo: "foto",
          archivo: "mesa_cumple_nati.jpeg",
          alt: "Detalle de la mesa dulce: bocados entre musgo y ramas de eucalipto.",
          pie: "La mesa, de punta a punta",
          enfoque: "15% 30%",
        },
        {
          tipo: "foto",
          archivo: "trabajando.jpeg",
          alt: "En blanco y negro, piezas pequeñas rematadas a mano sobre la encimera del obrador.",
          pie: "La víspera, en el obrador",
          enfoque: "50% 40%",
        },
        { tipo: "video", pie: "El montaje" },
        {
          tipo: "foto",
          archivo: "trabajando2.jpeg",
          alt: "Una mano sostiene un bocado verde mientras la otra lo remata con la manga pastelera.",
          pie: "Bocado a bocado",
        },
      ],
    },
    {
      tipoEvento: "Cumpleaños",
      titulo: "Pavlova de melocotón",
      descripcion:
        "Merengue, nata montada a mano y melocotón en gajos colocado uno a uno hasta cerrar la corona. Se monta el mismo día de la fiesta: ni la fruta ni el merengue aguantan una noche de nevera sin perder el punto.",
      archivo: "tarta_cumple_kika_2026.jpeg",
      alt: "Tarta redonda de merengue y nata coronada con gajos de melocotón, sobre una bandeja dorada.",
      mes: "[MES 2026]",
      lugar: "Málaga",
      enfoque: "50% 55%",
      galeria: [
        {
          tipo: "foto",
          archivo: "tarta_cumple_kika_2026_detalle.jpeg",
          alt: "Detalle de los gajos de melocotón colocados sobre la nata.",
          pie: "Gajo a gajo",
        },
        { tipo: "video", pie: "Cerrando la corona" },
        {
          tipo: "foto",
          archivo: "tarta_cumple_kika_2026.jpeg",
          alt: "La pavlova terminada sobre su bandeja dorada.",
          pie: "Lista para salir",
          enfoque: "50% 90%",
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
      titulo: "Te respondo en [PLAZO].",
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
  invitados: ["Menos de 25", "25 – 50", "50 – 100", "100 – 200", "Más de 200"] as const,
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
  nota: "Todo por encargo · con dos días laborables de antelación",
};
