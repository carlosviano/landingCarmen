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

export const SITE = {
  nombre: "Estimada Carmela",
  direccion: "Encuéntranos en Calle Escultor Marín Higuero 6. Es1,pl1,pt7",
  mapa: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    DIRECCION_POSTAL,
  )}`,
} as const;

export const NAV: NavItem[] = [
  
  { label: "Eventos", href: "#eventos" },
  { label: "Catálogo", href: "#catalogo" },
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
