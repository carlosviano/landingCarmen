// La portada: el hero, "Sobre mí", el carrusel y los dos escaparates (el
// díptico de tartas y la foto de eventos).

import { SERVICIOS, type Servicio } from "./site";

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
