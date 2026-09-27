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

/** Un tramo del horario de apertura: qué días y en qué horas. */
export interface FranjaHorario {
  dias: string;
  horas: string;
}

// --- Datos en crudo ---------------------------------------------------------
// Los usan varios sitios (cabecera, pie y la sección de contacto), así que
// viven sueltos aquí arriba y todo lo demás se deriva de ellos. Editar solo
// estas constantes: los enlaces se recalculan solos.

// Nota: el resto del sitio habla en primera persona ("Sobre mí") y esto en
// plural ("Encuéntranos"). Conviene unificar el trato.
const DIRECCION_POSTAL = "Calle Escultor Marín Higuero 6. Es1,pl1,pt7";

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
  direccion: "Encuéntranos en Calle Escultor Marín Higuero 6. Es1,pl1,pt7",
  mapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    DIRECCION_POSTAL,
  )}`,
} as const;

export const NAV: NavItem[] = [
  
  { label: "Eventos", href: "#eventos" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" }
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

// TODO: horario real.
export const HORARIO: FranjaHorario[] = [
  { dias: "Lunes a viernes", horas: "09:00 – 18:00" },
  { dias: "Sábados", horas: "10:00 – 14:00" },
  { dias: "Domingos", horas: "Cerrado" },
];

export const CONTACTO = {
  // La ciudad va suelta del resto de la dirección porque en la tarjeta se
  // pinta aparte, como antetítulo encima de la calle.
  ciudad: "Málaga",
  // Titular grande: calle y número y nada más. Es lo único que se lee de lejos.
  titular: "Escultor Marín Higuero, 6",
  // Lo que no cabe en el titular pero hace falta para dar con el portal.
  detalle: "Esc. 1 · Planta 1 · Puerta 7 — 29017",
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

// Hero. Una sola acción principal (WhatsApp) y un enlace secundario al
// catálogo: dos botones con el mismo peso aquí arriba no dejan ganar a ninguno.
//
// El titular no es un eslogan inventado, es de Carmen: sale del último párrafo
// de SOBRE_MI ("estética y sabor pesan lo mismo"). Y las credenciales son las
// cuatro casas que ya cuenta ahí. No son adorno: son la prueba de que lo que
// promete el titular se sostiene, y es lo único que un visitante que llega de
// Instagram puede comprobar sin bajar.
export const HERO = {
  antetitulo: "Alta pastelería · Málaga",
  titular: "La estética y el sabor pesan lo mismo",
  entradilla:
    "Tartas, postres y mesas dulces por encargo. Cada pieza se hace una a una, para el día concreto que celebras.",
  // A WhatsApp y no a #contacto: el botón dice "encargar", así que tiene que
  // abrir la conversación, no llevar a una tarjeta con un horario. Ojo: el
  // número sigue siendo el de relleno de WHATSAPP_VISIBLE.
  accion: { label: "Encargar por WhatsApp", href: WHATSAPP_URL },
  secundario: { label: "Ver el catálogo", href: "#catalogo" },
  // Va en el hero porque es la primera pregunta de quien encarga una tarta,
  // y porque un encargo sin plazo a la vista se lee como "para hoy".
  nota: "Todo por encargo · con dos días laborables de antelación",
  credenciales: ["Escuela Torreblanca", "Marbella Club", "Saddle", "DSTAgE"],
  // Sin nombres ni pronombres, igual que el resto de los alt: describe lo que
  // se ve y nada más.
  fotoAlt:
    "Rellenando con manga pastelera un bocado de bizcocho verde sostenido en la mano.",
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

// --- Escaparate de portada --------------------------------------------------

/**
 * El díptico de la sección de catálogo de la portada: UNA tarta, dos veces —
 * entera a un lado y de muy cerca al otro.
 *
 * Las dos fotos salen de la misma toma a propósito: el plano entero dice qué
 * es y el detalle dice cómo está hecha. Si fueran dos tartas distintas el
 * recurso se cae, así que al sustituirlas hay que recortar el detalle DE la
 * foto entera, no buscar otra.
 */
export interface Escaparate {
  /** Plano entero. Archivo tal cual está en `src/assets/images/`. */
  archivoEntera: string;
  /** El mismo pastel recortado de cerca. Ver la nota de src/assets/README.md. */
  archivoDetalle: string;
  /** Describe lo que se ve, sin nombres ni pronombres, como el resto del sitio. */
  altEntera: string;
  altDetalle: string;
  /** Texto del único enlace de la sección. */
  cta: string;
}

// TODO: sustituir por la tarta que se quiera destacar. Es la primera cosa que
// ve quien entra, así que conviene que sea la mejor foto que haya.
export const ESCAPARATE: Escaparate = {
  archivoEntera: "tarta_cumple_kika_2026.jpeg",
  archivoDetalle: "tarta_cumple_kika_2026_detalle.jpeg",
  altEntera:
    "Pavlova coronada de gajos de melocotón asado, vista desde arriba sobre una base dorada.",
  altDetalle:
    "Detalle de los gajos de melocotón asado brillantes sobre los picos de merengue.",
  cta: "Ver la carta",
} as const;

// --- Catálogo ---------------------------------------------------------------

/**
 * Una parte de la tarta, de las que se listan en "qué lleva".
 *
 * En la ficha, cada componente puede llevar una línea que sale de su etiqueta
 * y llega a su sitio en la foto recortada (`Tarta.recorte`). Lo que dice
 * ADÓNDE llega son `punto`, `franja` y `dentro`, y son datos de cada tarta, no
 * código: la ficha es una sola plantilla y pinta las líneas donde digan estos
 * números. Una tarta montada de otra manera lleva otros números, no otra
 * página.
 *
 * Los tres son opcionales. Si a un solo componente le falta el `punto`, la
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
   * En móvil sólo se ve la mitad izquierda de la tarta (sangra por la
   * derecha), así que x tiene que quedar por debajo de ~40.
   */
  punto?: { x: number; y: number };
  /**
   * De qué altura a qué altura va la capa, en % del alto del recorte. Pinta
   * la llave de móvil. Sólo tiene sentido en capas: una ralladura o una
   * decoración van sin franja, sólo con punto.
   */
  franja?: [desde: number, hasta: number];
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
 * Las familias de la carta. Son las que se pintan como chips de filtro en la
 * rejilla, en este orden, así que añadir una aquí la añade al filtro sola.
 * Una familia sin tartas no se pinta.
 */
export const CATEGORIAS = ["Clásicas", "Intensas", "Frescas"] as const;

export type CategoriaTarta = (typeof CATEGORIAS)[number];

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
  /** Familia a la que pertenece. Es por lo que filtran los chips de la carta. */
  categoria: CategoriaTarta;
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
   * Recortada PEGADA a la tarta, sin margen transparente: los porcentajes de
   * `punto` y `franja` son del archivo entero, y el margen los descuadraría.
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
  /** Párrafo de la ficha y de la portada. Dos o tres frases. */
  descripcion: string;
  /** Los tres pasos de "cómo se hace". Una frase cada uno. */
  pasos: [string, string, string];
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
  /** Chip que no filtra nada y viene activo. Va primero, delante de CATEGORIAS. */
  filtroTodas: string;
  tartas: Tarta[];
}

// TODO: precios reales. Mientras esto siga en true, todos los precios de la
// web salen entre corchetes ("[28 €]"), para que se vea que son de relleno y
// no se publiquen sin querer. Cuando estén todos, a false.
export const PRECIOS_PROVISIONALES = true;

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
// Ahora mismo la carta tiene UNA tarta: la única de la que hay recorte sin
// fondo. Las otras siete (con sus textos inventados) se quitaron a la espera
// de fotos; están en el historial de git, en el commit anterior a este cambio.
// Las fichas se irán añadiendo según lleguen los recortes.
export const CATALOGO: Catalogo = {
  etiqueta: "Nuestra carta",
  titulo: "Tartas de temporada",
  tituloPagina: "La carta",
  entradilla:
    "Todas por encargo. El tamaño, la conservación y la antelación de cada una están en su ficha.",
  filtroTodas: "Todas",
  tartas: [
    {
      id: "limon-y-merengue",
      nombre: "Limón y merengue",
      categoria: "Frescas",
      // TODO: foto con fondo para la tarjeta. Mientras no haya, la tarjeta
      // pinta el recorte sobre el fondo.
      archivo: null,
      // Recortado del original (tarta-limon-sin-fondo.png, 1536×1024) a la
      // tarta: 1400×775 desde x 80, y 150. Los puntos de abajo son de ESTE.
      recorte: "tarta-limon-recorte.png",
      alt: "Tarta redonda de base de galleta gruesa, cubierta de picos de merengue con ralladura de lima.",
      // TODO: precios reales.
      tamanos: [
        { personas: "4–6", precio: 28 },
        { personas: "8–10", precio: 38 },
      ],
      conservacion: "Nevera, 48 h",
      // TODO: textos reales. Los de esta tarta son de relleno, escritos para
      // la maqueta de la ficha.
      componentes: [
        {
          etiqueta: "Ralladura de lima",
          descripcionCorta: "Rallada al servir, no antes",
          punto: { x: 24.9, y: 15.2 },
        },
        {
          etiqueta: "Merengue italiano",
          descripcionCorta: "Picos a manga, uno a uno",
          punto: { x: 8.6, y: 38.7 },
          franja: [22, 50.5],
        },
        {
          etiqueta: "Crema de limón",
          descripcionCorta: "Por dentro, bajo el merengue",
          punto: { x: 6.4, y: 56.8 },
          franja: [51.5, 59.5],
          dentro: true,
        },
        {
          etiqueta: "Base de sablé",
          descripcionCorta: "Gruesa, de mantequilla y almendra",
          punto: { x: 8.6, y: 76.1 },
          franja: [60.5, 97],
        },
      ],
      descripcion:
        "Ácida, con el merengue justo para calmarla. El sablé es grueso a propósito: aguanta la crema sin reblandecerse y cruje hasta el último trozo.",
      pasos: [
        "El sablé se hornea el día antes, grueso, y se enfría en el molde.",
        "La crema se cuece al baño maría y se vierte templada sobre la base.",
        "El merengue se escudilla pico a pico justo antes de entregar.",
      ],
    },
  ],
};
