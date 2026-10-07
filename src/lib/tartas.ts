// Lo que se calcula a partir de las tartas de la carta: sus fotos ya
// resueltas, qué otras se enseñan al final de una ficha y si esa ficha va
// anotada.
//
// Sólo para el servidor: tira de `fotoDe`, que importa las imágenes. Lo que
// también necesita el navegador (precios, fechas, el mensaje del pedido) está
// en lib/pedido.ts.
import type { Tarta } from "@/config/catalogo";
import { fotoDe } from "@/lib/fotos";

/** Una tarta con sus dos fotos ya resueltas (`null` = no hay). */
export interface TartaConFotos {
  tarta: Tarta;
  /** La foto con fondo, la de la tarjeta. */
  foto: ImageMetadata | null;
  /** El recorte sin fondo, el de la ficha anotada. */
  recorte: ImageMetadata | null;
}

/**
 * Resuelve las fotos de una tarta. Se hace en quien pinta la lista y no en la
 * tarjeta: así `fotoDe` (un `import.meta.glob`, relativo al archivo que lo
 * escribe) vive en un solo sitio.
 */
export function conFotos(tarta: Tarta): TartaConFotos {
  return {
    tarta,
    foto: fotoDe(tarta.archivo),
    recorte: tarta.recorte ? fotoDe(tarta.recorte) : null,
  };
}

/**
 * Las demás tartas, empezando por la que va detrás de la de `indice`: se
 * mantiene el orden de la carta, sólo rota. Así la tira de la ficha no empieza
 * siempre por la primera tarta y la de al lado queda a mano, que es la que más
 * se compara.
 */
export function otrasTartas(tartas: Tarta[], indice: number): Tarta[] {
  return [...tartas.slice(indice + 1), ...tartas.slice(0, indice)];
}

/**
 * Si la ficha puede pintar las líneas: hace falta el recorte Y un punto en
 * TODOS los componentes. Si falta cualquiera, sale la ficha sin líneas: medio
 * anotada parecería rota.
 */
export function estaAnotada(tarta: Tarta): boolean {
  return (
    tarta.recorte !== undefined &&
    tarta.componentes.every((componente) => componente.punto !== undefined)
  );
}
