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
  // TODO: plazo real. Va en el hero porque es la primera pregunta de quien
  // encarga una tarta, y porque un encargo sin plazo a la vista se lee como
  // "para hoy". Mientras siga entre corchetes, se ve que falta el dato.
  nota: "Todo por encargo · [PLAZO DE ANTELACIÓN]",
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

/** Una parte de la tarta, de las que se listan en "de qué está hecha". */
export interface ComponenteTarta {
  etiqueta: string;
  descripcionCorta: string;
}

/**
 * Las familias de la carta. Son las que se pintan como chips de filtro en la
 * rejilla, en este orden, así que añadir una aquí la añade al filtro sola.
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
   * Nombre del archivo en `src/assets/images/`, o `null` si esta tarta
   * todavía no tiene foto.
   *
   * `null` NO es un caso de error, es el estado normal de seis de las ocho:
   * la rejilla pinta en su lugar un marco de "foto pendiente" MARCADO, en vez
   * de una foto de banco que no es de Carmen. Con relleno de stock no se
   * puede juzgar el diseño ni se sabe qué falta.
   *
   * Se mete en un hueco 4:5 con `object-cover`, así que el motivo tiene que
   * aguantar un recorte centrado. Mismo encuadre que el carrusel de la
   * galería.
   */
  archivo: string | null;
  /** Describe la tarta, sin nombres ni pronombres, como el resto del sitio. */
  alt: string;
  /** Texto corto: "8–10 raciones", "Por unidad"... */
  raciones: string;
  /** Texto corto: "Nevera, 24 h", "Fuera de nevera, 2 días"... */
  conservacion: string;
  /**
   * Ya formateado y listo para pintar, con su moneda: es un texto, no un
   * número, porque no se suma ni se compara con nada. Va en color rust tanto
   * en la tarjeta como en la ficha.
   */
  precio: string;
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

// Todo lo del CTA de pedido en un solo sitio, porque está sin decidir: el
// destino puede acabar siendo un formulario, un carrito o el WhatsApp de
// ahora, y cambiarlo tiene que ser cambiar `enlace` y nada más.
//
// El precio ya NO vive aquí: es de cada tarta (`Tarta.precio`).
//
// TODO: antelación real. Va entre corchetes a propósito: se ve en pantalla y
// así no se publica sin querer.
export const PEDIDO = {
  antelacion: "[ANTELACIÓN]",
  /**
   * Texto del único CTA de la ficha. Nombra el destino a propósito: un botón
   * que te saca de la página tiene que decir a dónde te lleva.
   *
   * Va atado a `enlace`: si el destino deja de ser WhatsApp, esta etiqueta
   * miente y hay que cambiar las dos a la vez.
   */
  etiqueta: "Pedir por WhatsApp",
  /**
   * Adónde lleva el CTA. Hoy abre WhatsApp con el nombre de la tarta ya
   * escrito, que es lo que convierte el botón en un pedido y no en un
   * "escríbeme y ya veremos". Si mañana hay formulario o carrito, se cambia
   * esta función y la ficha no se toca.
   */
  enlace: (nombre: string) =>
    `${WHATSAPP_URL}?text=${encodeURIComponent(
      `Hola Carmen, quería pedir la tarta «${nombre}».`,
    )}`,
} as const;

// Las fotos son de Carmen y viven en `src/assets/images/`. Se nombran aquí y
// las resuelve `fotoDe()` (src/lib/fotos.ts), que revienta el build si el
// nombre no existe.
//
// Ya NO hay imágenes de banco. Antes las ocho tiraban de Unsplash por URL, y
// eso tenía dos problemas: no se podía juzgar el diseño con fotos que no eran
// las suyas, y la mitad de los nombres de la carta estaban escritos para que
// pegaran con el stock que les tocaba. Ahora sólo hay foto donde hay foto de
// verdad; las demás llevan `archivo: null` y salen con su marco marcado.
//
// Ver src/assets/README.md para cómo se hacen las que faltan.

// Los textos son verosímiles pero inventados, y los nombres están puestos para
// que peguen con la imagen de relleno que les toca. Al sustituir las fotos hay
// que repasarlos: ahora describen lo que se ve, no lo que hace Carmen.
export const CATALOGO: Catalogo = {
  // Antes decía "Edición limitada / Especial de temporada": era el marco de un
  // escaparate que enseñaba UNA tarta destacada. Ahora las dos vistas enseñan
  // las ocho a la vez, así que el antetítulo nombra la carta y no una edición.
  etiqueta: "Nuestra carta",
  titulo: "Ocho tartas de temporada",
  tituloPagina: "La carta",
  entradilla:
    "Ocho tartas fijas, todas por encargo. El tamaño, la conservación y la antelación de cada una están en su ficha.",
  filtroTodas: "Todas",
  tartas: [
    {
      id: "frutos-rojos-y-nata",
      nombre: "Frutos rojos y nata",
      categoria: "Frescas",
      // TODO: es de Carmen, pero de un encargo concreto. Repetir la toma
      // con el encuadre de las demás cuando se haga la sesión.
      archivo: "tarta_silueta_v2.png",
      alt: "Tarta cubierta de nata y coronada de fresas partidas.",
      raciones: "8–10 raciones",
      conservacion: "Nevera. Se come el mismo día",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[34 €]",
      componentes: [
        { etiqueta: "Nata de la sierra", descripcionCorta: "Montada al momento, sin estabilizar" },
        { etiqueta: "Fresón de temporada", descripcionCorta: "De Málaga mientras dura la campaña" },
        { etiqueta: "Bizcocho genovés", descripcionCorta: "Ligero, calado en su propio jugo" },
      ],
      descripcion:
        "La tarta de siempre, hecha con fruta que valga la pena. Fuera de campaña se cambia la fruta y se avisa.",
      pasos: [
        "Se monta el mismo día del evento: la nata va sin estabilizar y no aguanta horas de pie.",
        "El bizcocho se cala en su propio jugo, nunca en almíbar.",
        "El fresón se coloca a última hora, entero y sin brillo.",
      ],
    },
    {
      // Ojo: cambiar un `id` rompe los enlaces ya compartidos. Este se puede
      // porque el sitio no está publicado; a partir de que lo esté, no.
      id: "pavlova-de-melocoton",
      nombre: "Pavlova de melocotón",
      categoria: "Frescas",
      // TODO: es de Carmen, pero de un encargo concreto. Repetir la toma
      // con el encuadre de las demás cuando se haga la sesión.
      archivo: "tarta_cumple_kika_2026.jpeg",
      alt: "Merengue cubierto de nata y coronado de gajos de melocotón asado.",
      raciones: "8–10 raciones",
      conservacion: "Se come recién montada",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[32 €]",
      componentes: [
        { etiqueta: "Merengue seco", descripcionCorta: "Horneado la noche antes, crujiente por fuera" },
        { etiqueta: "Nata montada al momento", descripcionCorta: "Sin estabilizar, no aguanta de pie" },
        { etiqueta: "Melocotón asado", descripcionCorta: "Al horno con su jugo, nada de almíbar" },
      ],
      descripcion:
        "El merengue se reblandece en cuanto toca la nata, así que se monta a última hora. Fuera de campaña se cambia la fruta y se avisa.",
      pasos: [
        "El merengue se hornea la noche antes y se deja secar en el horno apagado.",
        "El melocotón se asa con su propio jugo, sin almíbar, y se deja enfriar.",
        "Se monta a última hora: el merengue no aguanta ni una hora bajo la nata.",
      ],
    },
    {
      id: "chocolate-y-flor-de-sal",
      nombre: "Chocolate y flor de sal",
      categoria: "Intensas",
      archivo: null,
      alt: "Tarta redonda con la cobertura de chocolate extendida a mano.",
      raciones: "10–12 raciones",
      conservacion: "Fuera de nevera, 2 días",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[38 €]",
      componentes: [
        { etiqueta: "Cobertura espejo", descripcionCorta: "Colada templada, se alisa sola" },
        { etiqueta: "Bizcocho húmedo", descripcionCorta: "De cacao puro, sin colorantes" },
        { etiqueta: "Flor de sal", descripcionCorta: "Escamas por encima, al terminar" },
        { etiqueta: "Aceite de oliva", descripcionCorta: "Arbequina, en lugar de mantequilla" },
      ],
      descripcion:
        "La más sobria de todas y la que menos azúcar lleva. La sal no se nota como sal: levanta el cacao y lo deja más largo.",
      pasos: [
        "El bizcocho lleva arbequina en lugar de mantequilla: queda más húmedo y más largo.",
        "La cobertura se cuela templada sobre la tarta fría y se alisa sola.",
        "Las escamas de sal van al terminar, nunca antes: se disolverían.",
      ],
    },
    {
      id: "corazon-de-fresa",
      nombre: "Corazón de fresa",
      categoria: "Frescas",
      archivo: null,
      alt: "Tarta con forma de corazón, la base a la vista y la superficie cubierta de fresas.",
      raciones: "8 raciones",
      conservacion: "Nevera, 24 h",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[30 €]",
      componentes: [
        { etiqueta: "Masa quebrada", descripcionCorta: "Con mantequilla fría, se deshace" },
        { etiqueta: "Fresa de temporada", descripcionCorta: "Cortada gruesa, se tiene que notar" },
      ],
      descripcion:
        "La que más se encarga para aniversarios, por la forma y porque no lleva nata: aguanta bien una mesa larga.",
      pasos: [
        "La masa se hornea a ciegas el día antes y se deja enfriar entera.",
        "La fresa se corta gruesa por la mañana, para que se note al morder.",
        "Sin nata: por eso aguanta una mesa larga sin perder la forma.",
      ],
    },
    {
      id: "hojaldre-de-almendra",
      nombre: "Hojaldre de almendra",
      categoria: "Clásicas",
      archivo: null,
      alt: "Tarta redonda de hojaldre dorado, con dibujos rayados en la superficie.",
      raciones: "8–10 raciones",
      conservacion: "Fuera de nevera. Mejor al día siguiente",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[28 €]",
      componentes: [
        { etiqueta: "Almendra marcona", descripcionCorta: "Molida con su piel, sin tostar" },
        { etiqueta: "Hojaldre de mantequilla", descripcionCorta: "Seis vueltas, hechas en dos días" },
        { etiqueta: "Ron añejo", descripcionCorta: "Una cucharada, solo para el fondo" },
      ],
      descripcion:
        "Seca por fuera y jugosa por dentro, de las pocas que mejoran al día siguiente. Se sirve tibia, nunca fría de nevera.",
      pasos: [
        "Seis vueltas de hojaldre, hechas en dos días.",
        "La almendra se muele con su piel y sin tostar, para que no amargue.",
        "Se hornea hasta que suena hueco y se sirve tibia.",
      ],
    },
    {
      id: "brazo-de-nata",
      nombre: "Brazo de nata",
      categoria: "Clásicas",
      archivo: null,
      alt: "Brazo de gitano enrollado, con el relleno de crema a la vista en el corte.",
      raciones: "8 raciones",
      conservacion: "Nevera, 24 h",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[26 €]",
      componentes: [
        { etiqueta: "Plancha de bizcocho", descripcionCorta: "Enrollada en caliente, sin grietas" },
        { etiqueta: "Nata ligera", descripcionCorta: "Poco montada, para que no pese" },
        { etiqueta: "Frambuesa liofilizada", descripcionCorta: "En polvo, es lo que tiñe la capa" },
      ],
      descripcion:
        "El color no lleva colorante: es frambuesa liofilizada molida. Se corta grueso, de dos dedos.",
      pasos: [
        "La plancha se enrolla en caliente, que es cuando aguanta la curva.",
        "La nata se monta poco, para que no pese.",
        "El rosa es frambuesa liofilizada molida: no lleva colorante.",
      ],
    },
    {
      id: "bollo-de-vainilla",
      nombre: "Bollo de vainilla",
      categoria: "Clásicas",
      archivo: null,
      alt: "Bollo redondo y dorado, con un hueco de crema en el centro.",
      raciones: "Por unidad",
      conservacion: "El mismo día",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[3,50 €]",
      componentes: [
        { etiqueta: "Vainilla de Madagascar", descripcionCorta: "Vaina raspada, se ven los granos" },
        { etiqueta: "Masa de brioche", descripcionCorta: "Levada despacio, toda la noche" },
      ],
      descripcion:
        "Lo más parecido a un desayuno que hay en la carta. Se come el mismo día: al siguiente ya no es lo mismo.",
      pasos: [
        "La masa leva toda la noche en frío: de ahí le viene la hebra.",
        "La vaina se raspa a mano y los granos se ven en la crema.",
        "Se hornea por la mañana y se come el mismo día.",
      ],
    },
    {
      id: "bundt-de-chocolate",
      nombre: "Bundt de chocolate",
      categoria: "Intensas",
      archivo: null,
      alt: "Bizcocho con agujero en el centro, bañado de chocolate.",
      raciones: "12–14 raciones",
      conservacion: "Fuera de nevera, 3 días",
      // TODO: precio real. Entre corchetes para que no se publique sin querer.
      precio: "[36 €]",
      componentes: [
        { etiqueta: "Ganache de cacao 70 %", descripcionCorta: "Batida templada, brillo natural" },
        { etiqueta: "Bizcocho de yogur", descripcionCorta: "Alto y tierno, se corta en frío" },
        { etiqueta: "Fideos de colores", descripcionCorta: "Solo si la tarta es para un niño" },
      ],
      descripcion:
        "La de los cumpleaños de casa: se corta en porciones grandes y se come con la mano.",
      pasos: [
        "El bizcocho lleva yogur: sube alto y se queda tierno.",
        "Se corta en frío para que el molde salga limpio.",
        "La ganache se bate templada y coge brillo sola.",
      ],
    },
  ],
};
