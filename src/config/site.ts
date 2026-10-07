// Datos del sitio. Todo lo que es contenido y no maquetación vive aquí, para
// no tener que abrir un componente cada vez que cambia un texto o un enlace.

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Nombre de icono de Iconify, p. ej. "simple-icons:instagram". */
  icon: string;
}

/** La dirección partida en piezas, para poder escribirla de varias formas. */
export interface Direccion {
  /** Calle y número: la línea que se lee de lejos. */
  calle: string;
  /** La planta: lo que hace falta para dar con la puerta una vez dentro. */
  portal: string;
  cp: string;
  ciudad: string;
}

/** Un tramo del horario de apertura: qué días y en qué horas. */
export interface FranjaHorario {
  dias: string;
  horas: string;
}

// --- Datos en crudo ---------------------------------------------------------
// Los usan varios sitios (cabecera, pie y la sección de contacto), así que
// viven sueltos aquí arriba y todo lo demás se deriva de ellos. Editar solo
// estas constantes: los enlaces se recalculan solos.

// La dirección va partida y no en una sola cadena. Antes era el renglón
// "Calle Escultor Marín Higuero 6. Es1,pl1,pt7", que en el pie no se leía:
// escalera, planta y puerta abreviadas y pegadas a la calle parecen una
// errata más que una dirección. Con las piezas sueltas cada sitio la compone
// como le conviene —el pie en bloque, el panel móvil en una línea corta y
// Contacto con la calle de titular— y siguen saliendo todas de aquí.
export const DIRECCION: Direccion = {
  calle: "Escultor Marín Higuero, 6",
  portal: "Primera planta",
  cp: "29017",
  ciudad: "Málaga",
};

// Lo que se busca en Google Maps. Lleva el CP y la ciudad a propósito: son los
// que descartan la otra calle del mismo nombre (ver la nota de COORDENADAS).
const DIRECCION_POSTAL = `Calle ${DIRECCION.calle}, ${DIRECCION.cp} ${DIRECCION.ciudad}`;

// TODO: número real. Se escribe tal cual se quiere ver en pantalla; el enlace
// de wa.me se saca de aquí quitando todo lo que no sea dígito.
const WHATSAPP_VISIBLE = "+34 600 00 00 00";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_VISIBLE.replace(/\D/g, "")}`;

// TODO: confirmar que es esta calle. Coordenadas del portal resueltas contra
// Nominatim (OpenStreetMap). Ojo: existe otra "Calle Escultor Marín Higuero"
// en Arriate, también en Málaga, pero allí no hay número 6.
//
// Ya no se usan para pintar nada: el mapa es una imagen estática. Se quedan
// como referencia de dónde está centrada, que hace falta para regenerarla si
// cambia la dirección (src/assets/README.md explica cómo).
const COORDENADAS = { lat: 36.7212034, lon: -4.3645263 };

export const SITE = {
  nombre: "Estimada Carmela",
  // Antetítulo de la dirección en el pie.
  //
  // Nota: el resto del sitio habla en primera persona ("Sobre mí") y esto en
  // plural. Conviene unificar el trato.
  encuentranos: "Encuéntranos",
  // La dirección en un renglón, para donde solo cabe uno (el panel móvil). Sin
  // el portal: ahí no hay sitio, y quien va a ir se abre el mapa o baja al pie.
  direccion: `${DIRECCION.calle} · ${DIRECCION.ciudad}`,
  mapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    DIRECCION_POSTAL,
  )}`,
} as const;

/** Una de las tres cosas que se encargan. */
export interface Servicio {
  /** Cómo se llama en el menú y en el botón que lleva a su página. */
  nombre: string;
  /** Su página propia. */
  ruta: string;
  /** El id de su sección en la portada, sin "#". */
  ancla: string;
}

// Las tres formas de encargar, en el orden en que salen en la portada. De aquí
// leen el menú, los enlaces del hero y los dos escaparates, así que renombrar
// un servicio o moverle la página es cambiar una línea.
//
// "La carta" y no "Catálogo": es como se llama la página (/catalogo se queda
// como URL para no romper enlaces ya compartidos).
export const SERVICIOS = {
  carta: { nombre: "La carta", ruta: "/catalogo", ancla: "carta" },
  // Las tartas a medida que diseña Carmela y se recogen en el obrador
  // (ver ESPECIALES).
  personalizadas: {
    nombre: "Personalizadas",
    ruta: "/personalizadas",
    ancla: "personalizadas",
  },
  eventos: { nombre: "Eventos", ruta: "/eventos", ancla: "eventos" },
} as const satisfies Record<string, Servicio>;

// Los servicios van primero y en el orden de la portada: el menú se lee de
// izquierda a derecha igual que la página de arriba abajo.
export const NAV: NavItem[] = [
  ...Object.values(SERVICIOS).map(({ nombre, ruta }) => ({
    label: nombre,
    href: ruta,
  })),
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

// TODO: enlaces reales de redes.
export const SOCIAL: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: "simple-icons:instagram",
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: "simple-icons:whatsapp",
  },
];

export const HORARIO: FranjaHorario[] = [
  { dias: "Lunes a viernes", horas: "09:00 – 18:00" },
  // Fines de semana cerrado: coincide con PEDIDO, que sólo entrega de lunes a
  // viernes. Si algún día abre el sábado, hay que cambiar las dos cosas.
  { dias: "Sábados y domingos", horas: "Cerrado" },
];

export const CONTACTO = {
  // La ciudad va suelta del resto de la dirección porque en la tarjeta se
  // pinta aparte, como antetítulo encima de la calle.
  ciudad: DIRECCION.ciudad,
  // Titular grande: calle y número y nada más. Es lo único que se lee de lejos.
  titular: DIRECCION.calle,
  // Lo que no cabe en el titular pero hace falta para dar con el portal.
  detalle: `${DIRECCION.portal} — ${DIRECCION.cp}`,
  whatsapp: {
    visible: WHATSAPP_VISIBLE,
    href: WHATSAPP_URL,
  },
  // Centro de la imagen del mapa. No se usa para pintar, pero es el dato que
  // hace falta para regenerarla (ver src/assets/README.md).
  coordenadas: COORDENADAS,
  // Adónde lleva pulsar el mapa: al mapa "de verdad", con navegación paso a
  // paso. La imagen que se ve es estática y no navega a ninguna parte sola.
  mapa: SITE.mapa,
} as const;

// Hero. Lleva un botón por servicio, a su página: es el camino más corto a
// encargar (ver la nota en Hero.astro). El pedido de la carta se hace desde
// la ficha de cada tarta (ver PEDIDO), con el WhatsApp ya estructurado.
//
// El titular no es un eslogan inventado, es de Carmen: sale del último párrafo
// de SOBRE_MI ("estética y sabor pesan lo mismo"). Y las credenciales son las
// cuatro casas que ya cuenta ahí. No son adorno: son la prueba de que lo que
// promete el titular se sostiene, y es lo único que un visitante que llega de
// Instagram puede comprobar sin bajar.
//
// La entradilla nombra los tres SERVICIOS, uno por cada botón que el hero
// pinta debajo: quien llega tiene que saber sin bajar que hay carta, tartas a
// medida y eventos.
export const HERO = {
  antetitulo: "Alta pastelería · Málaga",
  titular: "La estética y el sabor pesan lo mismo",
  entradilla:
    "Tartas de temporada, tartas a tu medida y mesas dulces para tus celebraciones. Cada pieza se hace una a una, para el día concreto que celebras.",
  // Va en el hero porque es la primera pregunta de quien encarga una tarta,
  // y porque un encargo sin plazo a la vista se lee como "para hoy".
  // La leyenda sobre los botones: dice que se pide desde ahí.
  encarga: "Haz tu encargo",
  nota: "Todo por encargo · con dos días laborables de antelación",
  credenciales: ["Escuela Torreblanca", "Marbella Club", "Saddle", "DSTAgE"],
  // Sin nombres ni pronombres, igual que el resto de los alt: describe lo que
  // se ve y nada más.
  fotoAlt:
    "Pintando a pincel el glaseado rojo de una tarta rosa con borde de merengue, sobre una rejilla del obrador.",
} as const;

// Texto de Carmen, condensado. El original es bastante más largo y aquí no
// cabe: en esa sección el texto va dentro de la banda roja, y la banda mide lo
// que la foto menos el saliente, así que pasarse no lo hace scroll, lo hace
// desbordar. Antes de añadir un párrafo, leer la nota de SobreMi.astro.
//
// Lo que se ha quedado fuera y no debería perderse del todo: el paso por el
// Marbella Club como tal, la frase de que la pastelería es "compartir,
// celebrar, regalar, sorprender", y el detalle de que Paco Torreblanca es
// referente mundial. Encajan bien en una página aparte o en el pie.
//
// Los párrafos van sueltos, sin subtitular: son tres tiempos de un relato en
// primera persona, no tres apartados. Si algún día vuelven los subtitulares,
// están en el historial de git (iban en un `bloques` con titulo y texto).
export const SOBRE_MI = {
  titulo: "Sobre mí",
  parrafos: [
    "Estudié ADE y trabajé en una consultora, hasta que me decidí por lo que de verdad me apasionaba: me formé en alta pastelería en la Escuela Torreblanca.",
    "Después llegaron Marbella Club y restaurantes con estrella Michelin como Saddle y DSTAgE. Ahí aprendí el valor de la precisión, del producto y del cuidado por cada detalle.",
    "La pastelería es una forma de expresar cariño. De ahí nace Estimada Carmela: alta pastelería de Málaga para ocasiones en las que estética y sabor pesan lo mismo.",
  ],
  firma: "Espero que disfrutéis de recibirlo tanto como yo disfruto creándolo.",
  // Sin nombre ni pronombres en el alt: describe lo que se ve y nada más, que
  // es lo que necesita quien no puede ver la foto.
  fotoAlt: "Emplatando un postre con pinzas, pieza a pieza, en el obrador.",
} as const;

/** Una foto del carrusel: qué archivo es y qué se ve en ella. */
export interface FotoGaleria {
  /**
   * Nombre del archivo con extensión, tal cual está en `src/assets/images/`.
   * No es una ruta: la carpeta la pone `Galeria.astro`. Si el nombre no existe,
   * el build para con un error que lista los archivos que sí hay, así que una
   * errata aquí se ve en el momento y no como un hueco en la página.
   */
  archivo: string;
  alt: string;
}

/** La tira de fotos del carrusel: cómo se llama y qué lleva dentro. */
export interface Galeria {
  titulo: string;
  fotos: FotoGaleria[];
}

// Las fotos del carrusel, en el orden en que se ven.
//
// Añadir una es dejar el archivo en `src/assets/images/` y poner su línea aquí.
// No hace falta recortarla ni igualarla a las demás: el carrusel las mete todas
// en el mismo hueco 4:5 con `object-cover`, así que lo único que importa es que
// el motivo aguante un recorte centrado (ver la nota de Galeria.astro).
//
// Dos avisos sobre lo que hay puesto ahora, que es de relleno:
//
//   - `mapa-local.png` es lo único de `src/assets/images/` que se ha quedado
//     fuera a propósito: es la captura del mapa de Contacto, no una foto.
//   - `sobre-mi.jpg` sí está, pero es la MISMA foto que se ve en la sección de
//     justo encima. Está para que la tira no se quede en dos: en cuanto haya
//     fotos de verdad, esa línea fuera.
//
// Los alt describen lo que se ve y nada más, sin nombres ni pronombres, igual
// que el de SOBRE_MI: es lo que necesita quien no puede ver la foto.
export const GALERIA: Galeria = {
  // No se pinta: el diseño no lleva titular visible, pero ni el esquema del
  // documento ni un lector de pantalla pueden quedarse sin saber qué es esta
  // tira. Mismo caso que el h2 en sr-only de Contacto.
  titulo: "Galería",
  fotos: [
    {
      archivo: "trabajando2.jpeg",
      alt: "A color,Carmen preparando uno de sus postres con la manga pastelera.",
    },
    {
      archivo: "trabajando.jpeg",
      alt: "En blanco y negro, colocando con pinzas la decoración sobre dos bocados de chocolate.",
    },
    {
      archivo: "sobre-mi.jpg",
      alt: "Emplatando un postre con pinzas, pieza a pieza, en el obrador.",
    },
    {
      archivo: "tarta_cumple_kika_2026.jpeg",
      alt: "Tarta redonda de cumpleaños estilo Paulova",
    },
    {
      archivo: "mesa_cumple_nati.jpeg",
      alt: "Tarta redonda de cumpleaños estilo Paulova",
    }
  ],
};

// --- Eventos -----------------------------------------------------------

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

/**
 * Una foto de escaparate de la portada: qué archivo es, qué se ve y por dónde
 * se recorta.
 */
export interface FotoEscaparate {
  /** Nombre del archivo en `src/assets/images/`. */
  archivo: string;
  /** Describe lo que se ve, sin nombres ni pronombres, como el resto del sitio. */
  alt: string;
  /**
   * Punto que no se puede recortar, como `object-position` en CSS ("50% 62%").
   * Mismo criterio que `Montaje.enfoque`: depende del encuadre de cada foto.
   */
  enfoque: string;
}

/**
 * La foto de la sección de eventos de la portada: UN montaje y un único
 * enlace, a /eventos. Solo eventos: las tartas tienen su propio escaparate
 * (`ESCAPARATE`), y mezclarlas aquí era justo lo que confundía.
 *
 * No se deriva de `EVENTOS.montajes` por lo mismo que el escaparate del
 * catálogo no depende de `CATALOGO.tartas`: aquí se elige la mejor foto, no
 * la primera de la lista.
 */
export interface EscaparateEventos extends FotoEscaparate {
  /** Pie en `dato` bajo la foto: qué montaje es. */
  pie: string;
  /** Texto del botón. El destino es siempre `SERVICIOS.eventos`. */
  cta: string;
}

// TODO: cuando haya una foto HORIZONTAL de una mesa, va aquí. Esta es vertical
// (1200×1600) y la portada la recorta a 3:1 en escritorio, así que de ella
// solo se ve una franja.
export const ESCAPARATE_EVENTOS: EscaparateEventos = {
  archivo: "mesaEventosHome.jpg",
  alt: "Mesa larga con mantel negro, musgo y ramas de eucalipto entre bocados dulces servidos en piezas individuales.",
  enfoque: "50% 62%",
  pie: "Mesa dulce sobre musgo y eucalipto · cumpleaños",
  cta: "Ver todos los eventos",
};

// --- Solicitud de evento ----------------------------------------------------

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
  // La leyenda sobre los botones: dice que se pide desde ahí.
  encarga: "Haz tu encargo",
  nota: "Todo por encargo · con dos días laborables de antelación",
};

// --- Tartas especiales ------------------------------------------------------

/**
 * Un diseño de Carmela: una tarta a medida que se adapta a cada ocasión (la
 * rosa, los volantes de la boda). No es una tarta de la carta con un nombre
 * encima: es un diseño que Carmela propone y ajusta en tamaño, colores y
 * sabores. Cada uno es una tarjeta de /personalizadas, en el orden de esta
 * lista, y una pastilla del campo "Diseño" del formulario.
 */
export interface DisenoEspecial {
  /**
   * Identificador: va en el enlace de la tarjeta (?diseno=<slug>) y en lo que
   * viaja con el formulario. Minúsculas y guiones, y estable: cuando haya
   * ficha por diseño será su URL (/personalizadas/<slug>).
   */
  slug: string;
  nombre: string;
  /** Para qué suele pedirse: "Cumpleaños · aniversarios". Sale en la tarjeta. */
  ocasiones: string;
  /**
   * Foto CON fondo, a sangre en el marco 4:5: nombre del archivo en
   * `src/assets/images/`, o `null` mientras no haya (la tarjeta pinta el marco
   * de "foto pendiente", como la carta).
   */
  archivo: string | null;
  /** Describe lo que se ve, sin nombres ni pronombres, como el resto del sitio. */
  alt: string;
  /** Como `Montaje.enfoque`: el punto de la foto que no se recorta. */
  enfoque?: string;
  /** Lo que cuenta la tarjeta bajo el nombre: cómo es y qué se adapta. Dos o tres líneas. */
  descripcion: string;
  /**
   * Más fotos del diseño, para dar referencias: salen en miniatura en la
   * tarjeta, DESPUÉS de la de `archivo`, y al pulsarlas se ven en grande.
   * Mismo formato que `archivo`; vacía si no hay más.
   */
  galeria: { archivo: string; alt: string }[];
}

// La página /personalizadas: los diseños de Carmela que se encargan a medida
// y se RECOGEN en el obrador. Esa es la frontera con Eventos, donde Carmela va
// al sitio y monta: si te la llevas tú, es una especial; si viene ella, es un
// evento. Por eso la franja del hero dice "La recoges" donde la de /eventos
// dice "Lo monto".
//
// Misma estructura que EVENTOS + SOLICITUD_EVENTO, en un solo objeto.
export const ESPECIALES = {
  etiquetaPagina: "Tartas especiales · Málaga",
  tituloPagina: "Una tarta pensada para lo que celebras",
  entradillaPagina:
    "Diseños míos que adapto a tu ocasión: tamaño, colores y sabores. Me cuentas qué celebras y te propongo uno.",
  // TODO: foto propia de la cabecera. Es la misma de los volantes y de la
  // portada mientras no lleguen las fotos nuevas.
  fotoCabecera: "tarta-boda-nati.jpeg",
  altCabecera:
    "Tarta de boda de varios pisos cubierta de volantes blancos de azúcar, en una terraza al sol.",
  enfoqueCabecera: "50% 40%",
  ctaCabecera: "Pedir presupuesto",
  pasos: [
    { titulo: "Me cuentas", detalle: "La ocasión, la fecha y cuántos seréis." },
    { titulo: "Te propongo", detalle: "Un diseño, sus sabores y el presupuesto." },
    { titulo: "La recoges", detalle: "En el obrador, lista para tu celebración." },
  ],
  etiquetaDisenos: "Diseños de Carmela",
  tituloDisenos: "Elige uno, o deja que te proponga",
  /** La columna derecha de cada tarjeta: no hay precio cerrado. */
  precio: "a presupuesto",
  // TODO: fotos nuevas de cada diseño. Las de ahora son las que ya había
  // (la rosa es la del hero de la portada; los volantes, la de la boda).
  disenos: [
    {
      slug: "la-rosa",
      nombre: "La rosa",
      ocasiones: "Cumpleaños · aniversarios",
      archivo: "pintando-tarta-rosa-hero.png",
      alt: "Tarta rosa con borde de merengue mientras se pinta a pincel su glaseado rojo.",
      enfoque: "28% 75%",
      // TODO: descripción real y fotos de detalle de la rosa.
      descripcion:
        "[Descripción del diseño: cómo es, qué lleva por fuera, para cuántas personas sale y qué se puede cambiar.]",
      galeria: [
        {
          archivo: "tartaRosa1.JPG",
          alt: "Glaseado rojo vertido con un biberón sobre la tarta rosa, en una rejilla del obrador.",
        },
        {
          archivo: "tartaRosa2.JPG",
          alt: "El glaseado rojo de la tarta rosa se extiende a pincel y cae por los bordes.",
        },
        {
          archivo: "tartaRosa3.JPG",
          alt: "La tarta cubierta de glaseado rojo en espiral, sobre la rejilla.",
        },
        {
          archivo: "tartaRosa4.JPG",
          alt: "La tarta terminada, de glaseado rojo en espiral, sobre una base dorada.",
        },
        {
          archivo: "tartaRosa5.JPG",
          alt: "La tarta terminada vista desde arriba, sobre una base dorada.",
        },
      ],
    },
    {
      slug: "volantes-de-azucar",
      nombre: "Volantes de azúcar",
      ocasiones: "Bodas · bautizos",
      archivo: "tarta-boda-nati.jpeg",
      alt: "Tarta de varios pisos cubierta de volantes blancos de azúcar.",
      enfoque: "50% 55%",
      // TODO: descripción real y fotos de detalle de los volantes.
      descripcion:
        "[Descripción del diseño: cómo es, qué lleva por fuera, para cuántas personas sale y qué se puede cambiar.]",
      galeria: [
        {
          archivo: "tartaPapelAzucar3.jpeg",
          alt: "La tarta de dos pisos en el obrador, con volantes blancos de papel de azúcar alrededor del piso de abajo.",
        },
        {
          archivo: "tartaPapelAzucar1.jpeg",
          alt: "Detalle de los volantes de papel de azúcar, curvados y translúcidos, junto al piso de arriba.",
        },
        {
          archivo: "tartaPapelAzucar2.jpeg",
          alt: "Primer plano de las láminas de papel de azúcar, finas y onduladas.",
        },
        {
          archivo: "tarta-boda-nati-con-nati.jpeg",
          alt: "La novia junto a la tarta de volantes blancos, en blanco y negro.",
        },
      ],
    },

  ] satisfies DisenoEspecial[],
  /** Los textos de cada tarjeta de diseño. */
  tarjeta: {
    /** El botón: lleva al formulario con el diseño marcado. */
    pedir: "Pedir esta tarta",
    /** Para el lector de pantalla en las miniaturas: "Foto 2 de 3". */
    foto: "Foto",
  },
  /**
   * La última tarjeta de la rejilla, en rust: para quien no sabe cuál elegir.
   * Lleva al formulario con "Que me proponga Carmela" marcado.
   */
  proponer: {
    slug: "que-me-proponga",
    leyenda: "¿No sabes cuál?",
    titulo: "Cuéntame qué celebras y te propongo uno",
    boton: "Que me proponga",
    nombre: "A tu medida",
    ocasiones: "Cualquier ocasión",
    /** La pastilla del campo "Diseño". */
    opcion: "Que me proponga Carmela",
  },
  /** Cierre de la rejilla, hacia /eventos: la frontera entre los dos servicios. */
  aEventos: "¿Prefieres que la lleve y la monte yo? Eso es un evento",

  // El formulario del final de la página. Mismos controles, mismo envío y
  // misma validación que SOLICITUD_EVENTO (ver src/lib/solicitud.ts); cambian
  // los campos: aquí hay diseño y fecha de RECOGIDA, y no hay lugar.
  solicitud: {
    etiqueta: "¿Tienes fecha?",
    titulo: "Pide tu tarta especial",
    texto:
      "Con estos datos te digo qué diseño encaja, en qué plazo y con qué presupuesto.",
    // TODO: plazo real de respuesta, el mismo que el de eventos.
    pasos: [
      {
        titulo: "Me envías la solicitud.",
        detalle: "El diseño, la ocasión, la fecha y cuántos seréis.",
      },
      {
        titulo: "Te respondo en [PLAZO].",
        detalle: "Con una propuesta y el presupuesto.",
      },
      {
        titulo: "Cerramos y la recoges.",
        detalle: "Sabores, tamaño y hora de recogida en el obrador.",
      },
    ],
    // TODO: antelación real. Entre corchetes en el texto; el número de abajo
    // es el que usa el calendario y es de relleno.
    nota: "Es una consulta, no una reserva: la fecha queda tuya cuando confirmamos. Pídela con [ANTELACIÓN] de antelación.",
    /**
     * Días LABORABLES de antelación para la fecha de recogida, contados como
     * los de PEDIDO. Se recoge en el obrador, así que sólo de lunes a viernes
     * (ver HORARIO).
     */
    diasAntelacion: 5,
    ocasiones: [
      "Cumpleaños",
      "Boda",
      "Comunión o bautizo",
      "Aniversario",
      "Otra celebración",
    ] as const,
    // TODO: confirmar los tramos con Carmen. Cada uno cambia el tamaño (y los
    // pisos) de la tarta, que es para lo que sirve el dato.
    personas: ["Hasta 10", "10 – 20", "20 – 40", "40 – 80", "Más de 80"] as const,
    placeholderIdea: "Colores, un tema, a quién quieres sorprender…",
    // TODO: máximo de fotos. Mismo límite que eventos hasta que se decida;
    // entre corchetes en la ayuda para que no se publique sin querer.
    fotos: { maximo: 4, megasMaximo: 8 },
    ayudaFotos:
      "Si tienes fotos de algo que te guste, súbelas: hasta [4], de 8 MB como mucho cada una.",
    aviso:
      "Esta solicitud es una consulta, no una reserva. Revisaremos tu petición y te confirmaremos la fecha y los detalles según nuestra disponibilidad.",
    boton: "Enviar solicitud",
    // Mismo destino que SOLICITUD_EVENTO.envio, y por lo mismo null.
    envio: null as string | null,
    whatsapp: {
      antes: "¿Prefieres hablar?",
      enlace: "Escríbeme por WhatsApp",
    },
  },
};

/** WhatsApp con un mensaje ya escrito. Lo usan los formularios de solicitud. */
export const whatsappCon = (texto: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}`;

// --- Escaparate de portada --------------------------------------------------

/**
 * Una mitad del díptico: una forma de encargar una tarta, con su foto.
 *
 * El botón no tiene texto propio: lleva el nombre del servicio, para que diga
 * lo mismo que el menú.
 */
export interface EntradaEscaparate extends FotoEscaparate {
  servicio: Servicio;
  /** La línea sobre el botón: lo que distingue esta forma de encargar de la otra. */
  leyenda: string;
}

/**
 * El díptico de la sección de tartas de la portada: las dos formas de encargar
 * una, una por mitad. Es una tupla de dos y no una lista porque el díptico
 * solo funciona con dos: con una o con tres deja de ser un díptico.
 */
export interface Escaparate {
  /** El h2 de la sección. No se pinta (va en `sr-only`), ver Catalogo.astro. */
  titulo: string;
  entradas: [EntradaEscaparate, EntradaEscaparate];
}

// TODO: la pavlova no está en la carta. Hace falta una foto CON fondo de una
// tarta de la carta (de Limón y merengue solo hay el recorte sin fondo, que no
// aguanta un object-cover).
export const ESCAPARATE: Escaparate = {
  titulo: "Tartas por encargo",
  entradas: [
    {
      servicio: SERVICIOS.carta,
      archivo: "tarta_cumple_kika_2026.jpeg",
      alt: "Pavlova coronada de gajos de melocotón asado, vista desde arriba sobre una base dorada.",
      enfoque: "50% 46%",
      leyenda: "Temporada · precio cerrado",
    },
    {
      servicio: SERVICIOS.personalizadas,
      archivo: "tarta-boda-nati.jpeg",
      alt: "Tarta de boda de varios pisos cubierta de volantes blancos de azúcar.",
      enfoque: "50% 55%",
      leyenda: "A medida · bodas, cumpleaños",
    },
  ],
};

// --- Catálogo ---------------------------------------------------------------

/**
 * Una parte de la tarta, de las que se listan en "qué lleva".
 *
 * En la ficha, cada componente puede llevar una línea que sale de su etiqueta
 * y llega a su sitio en la foto recortada (`Tarta.recorte`). Lo que dice
 * ADÓNDE llega son `punto` y `dentro`, y son datos de cada tarta, no
 * código: la ficha es una sola plantilla y pinta las líneas donde digan estos
 * números. Una tarta montada de otra manera lleva otros números, no otra
 * página.
 *
 * Los dos son opcionales. Si a un solo componente le falta el `punto`, la
 * ficha entera sale sin líneas (ver `estaAnotada` en src/lib/pedido.ts): una
 * ficha medio anotada parece rota.
 */
export interface ComponenteTarta {
  etiqueta: string;
  descripcionCorta: string;
  /**
   * Dónde acaba la línea, en % del recorte: x de izquierda a derecha, y de
   * arriba abajo. En porcentaje y no en píxeles para que siga apuntando al
   * mismo sitio a cualquier tamaño.
   *
   * Tres reglas para que todas las fichas se lean igual:
   *  - En móvil sólo se ve el 45 % izquierdo del lienzo (la tarta sangra por
   *    la derecha), así que x tiene que quedar por debajo de ~40.
   *  - Cada etiqueta va a la altura de su punto, así que entre dos puntos
   *    tiene que haber al menos ~14 de y o las etiquetas se pisan en móvil.
   *  - El punto cae SOBRE lo que nombra, nunca en el aire ni en el borde.
   */
  punto?: { x: number; y: number };
  /**
   * Está dentro y no se ve en la foto (una crema bajo el merengue). La línea
   * sale discontinua y el punto hueco, para no prometer algo que no se ve.
   */
  dentro?: boolean;
}

/** Un tamaño de encargo: para cuántos es y cuánto cuesta. */
export interface TamanoTarta {
  /** Texto corto con guion largo: "4–6". La palabra "personas" la pone quien pinta. */
  personas: string;
  /**
   * En euros y como NÚMERO: el total del pedido lo multiplica por la cantidad.
   * Se pinta con `precioVisible()`, que lo pone entre corchetes mientras
   * `PRECIOS_PROVISIONALES` siga en true.
   */
  precio: number;
}

/**
 * Una tarta de la carta.
 *
 * Tuvo un `saborDestacado` ("Cacao amargo", "Fresón de temporada") que hacía
 * de antetítulo sobre el nombre, primero en el carrusel y después en la
 * tarjeta y la ficha. Se ha ido de los tres: era un segundo titular que
 * repetía al primero con otras palabras, y el ingrediente que nombraba ya
 * está —mejor explicado— en `componentes`.
 *
 * También tuvo `precio` y `raciones` sueltos. Ahora los dos salen de
 * `tamanos`, porque cada tamaño tiene su precio.
 */
export interface Tarta {
  /**
   * Identificador y trozo de URL: /catalogo/<id>. Minúsculas y guiones, y
   * estable: cambiarlo rompe los enlaces que ya se hayan compartido.
   */
  id: string;
  nombre: string;
  /**
   * Foto CON fondo, para la tarjeta de la carta: nombre del archivo en
   * `src/assets/images/`, o `null` si todavía no hay.
   *
   * Se mete en un hueco 4:5 con `object-cover`, así que el motivo tiene que
   * aguantar un recorte centrado. Sin ella, la tarjeta usa el recorte (si lo
   * hay) sobre el fondo, y si tampoco, el marco de "foto pendiente".
   */
  archivo: string | null;
  /**
   * Foto SIN fondo (PNG con transparencia) para la ficha, que es donde van
   * las líneas de `componentes`. Va aparte de `archivo` porque son dos fotos
   * distintas: esta no aguanta un `object-cover`, se lo comería.
   *
   * Todas en el MISMO LIENZO: 1200×1040, con la tarta a todo el ancho y
   * centrada en alto. Así todas salen del mismo tamaño y en la misma caja, en
   * la ficha y en la tarjeta, y un `punto` en % significa lo mismo en todas.
   * Se sacan de la foto sin fondo recortándola pegada a la tarta, escalándola
   * a 1200 de ancho y centrándola en el lienzo (ver src/assets/README.md).
   */
  recorte?: string;
  /** Describe la tarta, sin nombres ni pronombres, como el resto del sitio. */
  alt: string;
  /**
   * Los tamaños que se pueden encargar, de menor a mayor. El primero es el
   * que viene marcado. Con uno solo, la ficha no pinta el selector.
   */
  tamanos: [TamanoTarta, ...TamanoTarta[]];
  /** Texto corto: "Nevera, 24 h", "Fuera de nevera, 2 días"... */
  conservacion: string;
  /** De 2 a 4. Por encima de 4 las líneas de la ficha se apelotonan. */
  componentes: ComponenteTarta[];
  /** La descripción de la ficha para buscadores y al compartir el enlace (no se pinta en la página). Dos o tres frases. */
  descripcion: string;
}

export interface Catalogo {
  /** Antetítulo en mayúsculas, encima del titular. Lo comparten las dos vistas. */
  etiqueta: string;
  /** Titular de la sección de portada. */
  titulo: string;
  /** Titular de /catalogo. */
  tituloPagina: string;
  /** Entradilla de /catalogo. */
  entradilla: string;
  tartas: Tarta[];
}

// En true, todos los precios de la web salen entre corchetes ("[28 €]"), para
// que se vea que son de relleno y no se publiquen sin querer. Desde octubre de
// 2026 son los de la clienta, así que va en false; vuelve a true si alguna
// tarta entra con un precio inventado.
export const PRECIOS_PROVISIONALES = false;

// Todo lo del CTA de pedido en un solo sitio: el destino puede acabar siendo
// un formulario, un carrito o el WhatsApp de ahora, y cambiarlo tiene que ser
// cambiar `enlace` y nada más.
//
// El precio NO vive aquí: es de cada tamaño de cada tarta (`Tarta.tamanos`).
export const PEDIDO = {
  /**
   * Días LABORABLES de antelación. Sólo se entrega de lunes a viernes, así
   * que un encargo hecho el viernes o el fin de semana sale como pronto el
   * martes. La fecha mínima la calcula el navegador (src/lib/pedido.ts), no
   * el build: la web es estática y un mínimo fijado al compilar se quedaría
   * viejo al día siguiente.
   *
   * TODO: festivos. Hoy sólo se descartan sábados y domingos.
   */
  diasAntelacion: 2,
  /** El mismo plazo, en texto, para los sitios donde se cuenta. */
  antelacion: "dos días laborables",
  /**
   * Texto del único CTA de la ficha. Nombra el destino a propósito: un botón
   * que te saca de la página tiene que decir a dónde te lleva.
   *
   * Va atado a `enlace`: si el destino deja de ser WhatsApp, esta etiqueta
   * miente y hay que cambiar las dos a la vez.
   */
  etiqueta: "Pedir por WhatsApp",
  /**
   * Adónde lleva el CTA: WhatsApp con el mensaje ya escrito. Sin JS se llama
   * sólo con el nombre (es el `href` que sale del build); con JS, la ficha lo
   * vuelve a llamar con tamaño, cantidad y fecha cada vez que cambian.
   *
   * Lo pueden llamar las dos puntas —el servidor y el script de la ficha—,
   * así que no puede depender de nada que sólo exista en una de ellas.
   */
  enlace: (texto: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}`,
} as const;

// Las fotos son de Carmen y viven en `src/assets/images/`. Se nombran aquí y
// las resuelve `fotoDe()` (src/lib/fotos.ts), que revienta el build si el
// nombre no existe. Ver src/assets/README.md para cómo se hacen.
//
// Ahora mismo la carta tiene SEIS tartas: las que tienen recorte sin fondo.
// Las siete de la maqueta original (con sus textos inventados) se quitaron a
// la espera de fotos; están en el historial de git. Las fichas se irán
// añadiendo según lleguen los recortes.
export const CATALOGO: Catalogo = {
  etiqueta: "Nuestra carta",
  titulo: "Tartas de temporada",
  tituloPagina: "La carta",
  entradilla:
    "Todas por encargo. El tamaño, la conservación y la antelación de cada una están en su ficha.",
  tartas: [
    {
      // El id se queda con el nombre antiguo porque esta ficha ya está
      // publicada: cambiarlo rompería los enlaces compartidos.
      id: "limon-y-merengue",
      nombre: "Tartaleta de limón",
      // TODO: foto con fondo para la tarjeta. Mientras no haya, la tarjeta
      // pinta el recorte sobre el fondo.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "limon-ficha.png",
      alt: "Tarta redonda de base de galleta gruesa, cubierta de picos de merengue con ralladura de lima.",
      tamanos: [
        { personas: "4–6", precio: 25 },
        { personas: "8–10", precio: 42 },
      ],
      conservacion: "Nevera, 48 h",
      componentes: [
        {
          etiqueta: "Ralladura de lima",
          descripcionCorta: "Por encima del merengue",
          punto: { x: 22.5, y: 23 },
        },
        {
          etiqueta: "Merengue",
          descripcionCorta: "En picos, sobre el limón",
          punto: { x: 8, y: 45 },
        },
        {
          etiqueta: "Tartaleta de limón",
          descripcionCorta: "La base, rellena de limón",
          punto: { x: 14, y: 72 },
        },
      ],
      descripcion:
        "Tartaleta de limón cubierta de merengue y terminada con ralladura de lima.",
    },
    {
      id: "tartaleta-de-chocolate",
      nombre: "Tartaleta de chocolate negro 70,5 %",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "chocolate-ficha.png",
      alt: "Tarta redonda de base de cacao, rellena de chocolate brillante hasta el borde y espolvoreada de cacao en polvo.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Nevera, 48 h",
      componentes: [
        {
          etiqueta: "Cacao espolvoreado",
          descripcionCorta: "Por encima",
          punto: { x: 22, y: 24 },
        },
        {
          etiqueta: "Mousse de chocolate negro",
          descripcionCorta: "La capa de arriba",
          punto: { x: 8, y: 42 },
        },
        {
          etiqueta: "Cremoso de chocolate negro",
          descripcionCorta: "Por dentro, bajo la mousse",
          punto: { x: 12, y: 57 },
          dentro: true,
        },
        {
          etiqueta: "Tartaleta de chocolate negro",
          descripcionCorta: "La base",
          punto: { x: 12, y: 78 },
        },
      ],
      descripcion:
        "Tartaleta de chocolate negro al 70,5 % con cremoso y mousse de chocolate negro, espolvoreada de cacao.",
    },
    {
      id: "pavlova-de-melocoton",
      nombre: "Pavlova de melocotón",
      // TODO: foto con fondo para la tarjeta. Hay una de esta tarta
      // (tarta_cumple_kika_2026.jpeg, la del escaparate), pero con ella
      // sería la única tarjeta con foto y las demás con recorte.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "pavlova-ficha.png",
      alt: "Pavlova alta cubierta de picos redondos de merengue y coronada de gajos de melocotón asado, sobre una base dorada.",
      tamanos: [
        { personas: "4–6", precio: 25 },
        { personas: "8–10", precio: 42 },
      ],
      conservacion: "Se come recién montada",
      componentes: [
        {
          etiqueta: "Melocotón",
          descripcionCorta: "Por encima",
          punto: { x: 25, y: 25.5 },
        },
        {
          etiqueta: "Crema pastelera",
          descripcionCorta: "Con chips de chocolate",
          punto: { x: 33, y: 45 },
        },
        {
          etiqueta: "Bizcocho",
          descripcionCorta: "Por dentro",
          punto: { x: 16, y: 61 },
          dentro: true,
        },
        {
          etiqueta: "Merengue seco",
          descripcionCorta: "Por fuera",
          punto: { x: 9, y: 78 },
        },
      ],
      descripcion:
        "Merengue seco, bizcocho y crema pastelera con chips de chocolate, coronada de melocotón.",
    },
    {
      id: "tarta-de-la-abuela",
      nombre: "Tarta de la abuela",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "galleta-ficha.png",
      alt: "Galleta gigante redonda, dorada y con azúcar por encima, salpicada de pepitas de chocolate negro y con leche, sobre una base de cartón.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Fuera de nevera, 3 días",
      componentes: [
        {
          etiqueta: "Cremoso de chocolate",
          descripcionCorta: "Por encima",
          punto: { x: 16, y: 34 },
        },
        {
          etiqueta: "Mousse de galleta",
          descripcionCorta: "El cuerpo de la tarta",
          punto: { x: 13, y: 62 },
        },
      ],
      descripcion: "Mousse de galleta con cremoso de chocolate.",
    },
    {
      id: "nueces-de-macadamia",
      nombre: "Tarta de nueces de macadamia",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`), sacado de
      // tarta-nueces-macadamia-nueva.png: foto real, sustituye a la anterior.
      recorte: "nueces-macadamia-ficha.png",
      alt: "Tarta redonda baja de superficie abombada, con un glaseado dorado y brillante, rodeada de un aro claro y jaspeado.",
      // Sólo se hace en el tamaño grande.
      tamanos: [{ personas: "8–10", precio: 47 }],
      conservacion: "Nevera, 48 h",
      // Las nueces no se ven en la foto, así que van con el toffee y no con
      // un punto propio: tres puntos separados caben en la tarta, cuatro se
      // pisarían.
      componentes: [
        {
          etiqueta: "Toffee",
          descripcionCorta: "Con nueces de macadamia",
          punto: { x: 24, y: 29 },
        },
        {
          etiqueta: "Vainilla",
          descripcionCorta: "Bajo el toffee",
          punto: { x: 6, y: 43 },
        },
        {
          etiqueta: "Borde de chocolate blanco",
          descripcionCorta: "Por fuera",
          punto: { x: 13, y: 65 },
        },
      ],
      descripcion:
        "Toffee, vainilla y nueces de macadamia, dentro de un borde de chocolate blanco.",
    },
    {
      id: "choux-de-avellana",
      nombre: "Choux de avellana",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "paris-brest-ficha.png",
      alt: "Corona de pasta choux espolvoreada de azúcar glas, rellena de crema de avellana y decorada con avellanas caramelizadas.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Nevera, 24 h",
      componentes: [
        {
          etiqueta: "Masa de profiterol",
          descripcionCorta: "Rellena de praliné",
          punto: { x: 20, y: 20 },
        },
        {
          etiqueta: "Mousse de avellana",
          descripcionCorta: "Entre las dos coronas",
          punto: { x: 19, y: 72 },
        },
      ],
      descripcion: "Masa de profiterol rellena de praliné, con mousse de avellana.",
    },
  ],
};

// --- Modal de bienvenida ----------------------------------------------------

/** Un punto de "Así trabajamos": icono, titular y una línea de detalle. */
export interface PuntoBienvenida {
  /** Nombre de icono de Iconify, p. ej. "lucide:clock". */
  icono: string;
  titulo: string;
  detalle: string;
  /**
   * Lo que se lee en móvil, en una sola línea. Allí no hay sitio para
   * titular más detalle, así que cada punto se queda en esto. Si falta, sale
   * `titulo`.
   */
  corto?: string;
  /** El detalle también se ve en móvil. Sólo la dirección lo necesita. */
  detalleEnMovil?: boolean;
}

// El modal que ve quien entra por primera vez. Cuenta lo que cambia cómo se
// encarga (que no hay envíos, cuándo se recoge, con cuánto plazo y dónde) y
// nada más: es lo que alguien que llega de Instagram no sabe y le hace falta
// antes de pedir.
//
// El horario, el plazo y la dirección salen de las constantes de arriba: si
// cambian allí, cambian aquí solos.
const LABORABLES = HORARIO[0];

export const BIENVENIDA = {
  antetitulo: "Bienvenida",
  titulo: "Así trabajamos",
  // Va sobre la ilustración, sólo en escritorio: en móvil la imagen es una
  // franja y la nota taparía justo el toldo.
  pista: {
    antes: "Busca el ",
    resaltado: "toldo rojo",
    despues: " en la primera planta, encima del bajo comercial.",
  },
  fotoAlt:
    "Ilustración de la fachada: un toldo rojo con el nombre Estimada Carmela sobre el ventanal de la primera planta, con el rótulo Pastelería.",
  puntos: [
    {
      icono: "lucide:shopping-bag",
      titulo: "Solo recogida",
      detalle: "No hacemos envíos: los pedidos se recogen en el obrador.",
    },
    {
      icono: "lucide:clock",
      titulo: "Horario de recogida",
      detalle: `${LABORABLES.dias}, ${LABORABLES.horas}`,
      // Sin "Recogida de" delante: con la fuente del sistema parte en dos
      // líneas a 390px, y el punto de arriba ya dice que es recogida.
      corto: `${LABORABLES.dias}, ${LABORABLES.horas}`,
    },
    {
      icono: "lucide:calendar",
      titulo: `${PEDIDO.antelacion[0].toUpperCase()}${PEDIDO.antelacion.slice(1)} de antelación`,
      detalle: "Todo se hace por encargo. Un pedido del viernes sale el martes.",
    },
    {
      icono: "lucide:map-pin",
      titulo: `${CONTACTO.titular} · ${CONTACTO.ciudad}`,
      detalle: CONTACTO.detalle,
      detalleEnMovil: true,
    },
  ] satisfies PuntoBienvenida[],
  boton: "Entendido",
} as const;

// --- Próximamente -----------------------------------------------------------

// La pantalla de "estamos preparando la tienda" que se ve en producción hasta
// la apertura. Mientras `enProduccion` siga en true, `main` publica SOLO esta
// pantalla, en todas las rutas; staging, las previews y el local siguen viendo
// la web entera. Quién decide qué rama la ve: src/lib/proximamente.ts.
//
// Abrir la web es poner `enProduccion` a false en un PR y mergearlo a main.
// No se apaga sola el día de la fecha: el sitio es estático y nadie lo vuelve
// a construir a medianoche.
export const PROXIMAMENTE = {
  enProduccion: true,
  titular: { antes: "Próximamente"},
  entradilla:
    "Deseando estar en tus cumpleaños, celebraciones y eventos más especiales",
  apertura: {
    antetitulo: "Abrimos el",
    texto: "12 de octubre de 2026",
    // Para el datetime del <time>. Va aparte del texto para no tener que
    // parsear castellano.
    iso: "2026-10-12",
  },
  pie: "Alta pastelería por encargo · Málaga",
} as const;
