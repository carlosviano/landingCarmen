// Datos globales del sitio: marca, dirección, contacto, redes, los tres
// servicios y el menú. Lo de cada página o sección vive en su propio archivo
// de esta carpeta (portada, catalogo, pedido, eventos, personalizadas,
// bienvenida, proximamente), para no tener que abrir un componente cada vez
// que cambia un texto o un enlace, ni un archivo de mil líneas para cambiar
// uno.

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

// Quién está detrás de la web a efectos legales: Carmela, como autónoma. Lo
// leen el aviso legal, las condiciones, la privacidad y el aviso junto a los
// formularios, así que se escribe una vez y aquí.
//
// TODO: datos reales. Mientras quede uno entre corchetes no se publica (ver
// README, "Textos legales").
export const TITULAR = {
  /** Nombre y apellidos, como en el alta de autónomos. */
  nombre: "[NOMBRE Y APELLIDOS]",
  nif: "[NIF]",
  /** El correo para reclamaciones y derechos de privacidad. */
  email: "[EMAIL DE CONTACTO]",
  /** Número de inscripción del obrador en el registro sanitario. */
  registroSanitario: "[Nº REGISTRO SANITARIO]",
  /** El domicilio es el del obrador, en una línea. */
  domicilio: `${DIRECCION.calle}, ${DIRECCION.portal.toLowerCase()}, ${DIRECCION.cp} ${DIRECCION.ciudad}`,
} as const;

// Las páginas legales, para el pie. Entran aquí cuando su texto existe: un
// enlace a una página que no está es peor que no tenerlo.
export const LEGAL: NavItem[] = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Condiciones", href: "/condiciones" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Cookies", href: "/cookies" },
];

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

/**
 * WhatsApp con un mensaje ya escrito. Lo usan los formularios de solicitud y
 * el pedido de la carta (`PEDIDO.enlace`).
 */
export const whatsappCon = (texto: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}`;
