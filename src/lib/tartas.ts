// Utilidades de la carta que no son maquetación.
//
// Aquí vivían también `slugCategoria` y `PARAM_FAMILIA`, del filtro por
// familias de /catalogo. Se fueron con el filtro (ver Carta.astro).

/**
 * La primera frase de un párrafo, para la media línea de la tarjeta.
 *
 * Se corta por el punto y se DEVUELVE con él: en la tarjeta se lee como una
 * frase acabada y no como un texto truncado. Si no hay punto —o la frase es
 * más larga que la tarjeta— devuelve el texto tal cual y del recorte se
 * encarga el CSS (`line-clamp-2`), que sabe cuántas líneas caben de verdad.
 *
 * No intenta ser un tokenizador: el punto de "8 p.m." lo partiría mal. Con
 * ocho descripciones escritas a mano no compensa; si algún día el texto lo
 * pone otra persona, esto se convierte en un campo aparte en `site.ts`.
 */
export function primeraFrase(texto: string): string {
  const corte = texto.indexOf(". ");
  return corte === -1 ? texto : texto.slice(0, corte + 1);
}
