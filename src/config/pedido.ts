// El pedido de una tarta de la carta desde su ficha.
//
// Va aparte del catálogo porque lo importa el <script> de Pedido.astro, que
// se manda al navegador: aquí sólo puede haber lo que el pedido necesita, nada
// de datos de páginas ni imágenes.

import { whatsappCon } from "./site";

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
  enlace: whatsappCon,
} as const;
