// La forma de un texto legal (condiciones, privacidad, aviso legal, cookies).
//
// Los textos son datos en src/config/legal/ y los pinta una sola plantilla,
// components/legal/PaginaLegal.astro. Los enlaces van como datos y no como
// HTML dentro de la cadena: así no hace falta `set:html` y un texto no puede
// romper el marcado.

/** Un enlace dentro de un párrafo. */
export interface Enlace {
  texto: string;
  href: string;
}

/**
 * Un párrafo: texto suelto, o trozos de texto y enlaces que se pintan
 * seguidos. Los espacios entre trozos van dentro de las cadenas.
 */
export type Parrafo = string | (string | Enlace)[];

/** Un bloque de un apartado: un párrafo o una lista de puntos. */
export type Bloque = Parrafo | { lista: Parrafo[] };

export interface Apartado {
  /**
   * El ancla del apartado (/condiciones#cancelaciones). Estable: hay enlaces
   * a ella desde otras páginas, así que no se cambia con el título.
   */
  id: string;
  titulo: string;
  contenido: Bloque[];
}

export interface TextoLegal {
  /** Línea corta sobre el titular. */
  antetitulo: string;
  /** El h1, y también el <title> de la página. */
  titulo: string;
  /** Una o dos frases de qué es esto, en llano. */
  intro: string;
  apartados: Apartado[];
  /**
   * Fecha de la última versión, en texto ("8 de octubre de 2026"). Se cambia
   * a mano cada vez que cambia lo que dice el texto, no por erratas.
   */
  actualizado: string;
}

export const esLista = (bloque: Bloque): bloque is { lista: Parrafo[] } =>
  typeof bloque === "object" && !Array.isArray(bloque);

/** Un párrafo siempre como lista de trozos, para pintarlo con un solo bucle. */
export const trozos = (parrafo: Parrafo): (string | Enlace)[] =>
  typeof parrafo === "string" ? [parrafo] : parrafo;
