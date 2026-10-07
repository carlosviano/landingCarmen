// Las clases de los controles de formulario de la web.
//
// Las comparten el pedido de la ficha de tarta y la solicitud de eventos, que
// tienen que parecer el mismo formulario: mismo marco, mismo rust al pasar
// por encima, mismo borde doble cuando algo falla. Salieron del pedido, que
// fue el primero; un control nuevo empieza por aquí, no por copiar clases.
//
// Van en un .ts y no como `@utility` en global.css porque llevan variantes
// (hover:, aria-invalid:, peer-checked:...) y Tailwind las lee igual de un
// .ts que de un .astro.

/** La etiqueta de un campo: "Fecha", "Tamaño"... */
export const ETIQUETA = "leyenda text-rust";

// Lo que comparten todos los controles con marco: el borde, el rust al pasar
// por encima y el borde doble con `aria-invalid`.
const MARCO =
  "border border-black/40 bg-transparent text-black transition-colors hover:border-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust aria-invalid:border-2 aria-invalid:border-rust motion-reduce:transition-none";

/** Campo de una línea: <input>, <select> o el botón del calendario. */
export const CAMPO = `${MARCO} flex h-11 w-full min-w-0 items-center rounded-full px-4 text-left placeholder:text-black/40 bajo:h-10`;

/** Texto largo. El mismo marco, con las esquinas de una tarjeta. */
export const AREA = `${MARCO} block min-h-36 w-full resize-y rounded-3xl px-4 py-3 leading-relaxed placeholder:text-black/40`;

/**
 * Radio o checkbox de verdad, transparente y encima de su pastilla: el clic y
 * el foco son suyos y el aspecto lo pone `PASTILLA` (que va justo después,
 * por los `peer-*`).
 */
export const OPCION_OCULTA =
  "peer absolute inset-0 m-0 cursor-pointer opacity-0";

/** El aspecto de una opción elegible: los tamaños de la tarta, el tipo de evento. */
export const PASTILLA =
  "rounded-2xl border border-black/40 text-[11px] tracking-[0.06em] text-black/70 transition-colors duration-200 hover:border-rust peer-checked:border-rust peer-checked:bg-rust peer-checked:text-linen/90 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rust peer-aria-invalid:border-rust motion-reduce:transition-none";

/** El botón principal de un formulario: el que pide o envía. */
export const BOTON =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-rust px-4 py-4 accion text-[11px] whitespace-nowrap text-linen shadow-lg shadow-black/25 transition-colors duration-300 hover:bg-rust-hondo disabled:pointer-events-none disabled:opacity-60 sm:px-6 sm:text-xs sm:tracking-[0.16em] motion-reduce:transition-none";

/**
 * El panel que se abre bajo un campo: el calendario y el desplegable. Va
 * `absolute`; quien lo usa añade de qué lado se ancla (`inset-x-0`...).
 */
export const PANEL =
  "absolute top-full z-20 mt-2 rounded-3xl border border-taupe/45 bg-linen shadow-xl shadow-black/15";

/** Una opción de la lista del desplegable. Elegida, en rust como el día del calendario. */
export const OPCION_LISTA =
  "group flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-left text-sm text-black hover:bg-rust/10 focus-visible:bg-rust/10 focus-visible:outline-none aria-selected:bg-rust aria-selected:text-linen";

/** Botón redondo de sólo icono: el +/− de la cantidad, las flechas del mes. */
export const BOTON_ICONO =
  "grid place-items-center rounded-full text-rust hover:bg-rust/8 disabled:opacity-30 disabled:hover:bg-transparent";

/** El mensaje bajo un campo que no vale. */
export const ERROR = "text-sm text-rust";
