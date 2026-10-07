// Utilidades de la carta. Son las dos cuentas que hacen falta para pintar la
// rejilla y que no son maquetación: partir la descripción y convertir el
// nombre de una categoría en algo que quepa en un atributo.
//
// Viven aquí y no dentro de un componente porque las usan LAS DOS PUNTAS: el
// servidor las llama al pintar los chips y las tarjetas, y el script del
// cliente necesita el mismo `slug` para que el `data-categoria` de una tarjeta
// case con el `data-filtro` de su chip. Duplicada, la primera errata de
// acentos dejaría el filtro sin resultados y sin error.

/**
 * Valor de `data-filtro` del chip que no filtra nada.
 *
 * Es un centinela fijo y no el slug de su etiqueta a propósito: la etiqueta es
 * texto editable en `site.ts` (`CATALOGO.filtroTodas`), y si el slug saliera de
 * ella, cambiarla por "Ver todas" dejaría el chip pidiendo la categoría
 * "ver-todas", que no existe, y la rejilla se vaciaría. Con un centinela, el
 * texto se puede cambiar sin tocar la lógica.
 *
 * No choca con ninguna categoría real: ninguna se llama "Todas".
 */
export const FILTRO_TODAS = "todas";

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

/**
 * Nombre de categoría → valor de atributo: "Clásicas" pasa a "clasicas".
 *
 * Quita los acentos por descomposición Unicode (NFD separa la letra de su
 * tilde, y U+0300–U+036F son justo las tildes sueltas). Hace falta
 * porque el valor viaja en un `data-` y se compara con `===` en el cliente:
 * un "clásicas" con tilde funcionaría, pero un acento mal copiado a mano en
 * cualquiera de las dos puntas rompería la comparación en silencio.
 */
export function slugCategoria(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}
