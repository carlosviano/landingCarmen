// Animaciones de entrada: lo marcado con `data-revelar` aparece la primera vez
// que entra en pantalla. Este archivo solo decide CUÁNDO (pone `data-visto`);
// el CÓMO está en global.css, "Animaciones de entrada".
//
// El estado oculto solo existe bajo `<html data-animar>`, que lo pone el
// script en línea del <head> de Layout.astro antes del primer pintado, y solo
// si no se ha pedido movimiento reducido. Sin JS, o con movimiento reducido,
// nada se esconde y esto ni arranca.
//
// Una sola vez por elemento: al revelarse deja de observarse y no se vuelve a
// esconder al subir. Repetir la entrada en cada pasada cansa y hace que la
// página parezca que se recarga.
//
// Cascada: lo que entra en pantalla a la vez (las tarjetas de una fila, el
// texto del hero al cargar) llega en el mismo lote del observer, en orden del
// DOM, y cada uno sale PASO_MS después del anterior. Así no hay que marcar
// grupos a mano, y en móvil, donde las tarjetas van apiladas y entran de una
// en una, no acumulan retrasos. Un `--retraso` puesto a mano en el marcado se
// respeta.

// Lo que tarda cada pieza de un lote en salir detrás de la anterior.
const PASO_MS = 90;
// A partir de la séptima del lote todas salen a la vez: una fila larga no
// puede tener al último esperando un segundo.
const TOPE = 6;

// Revela un lote en cascada.
const mostrar = (lote: HTMLElement[]) => {
  lote.forEach((pieza, indice) => {
    if (!pieza.style.getPropertyValue("--retraso")) {
      pieza.style.setProperty(
        "--retraso",
        `${Math.min(indice, TOPE) * PASO_MS}ms`,
      );
    }
    pieza.dataset.visto = "";
  });
};

const empezar = (senal: AbortSignal) => {
  const observador = new IntersectionObserver(
    (entradas) => {
      const llegan = entradas
        .filter((entrada) => entrada.isIntersecting)
        .map(({ target }) => target as HTMLElement);
      for (const pieza of llegan) observador.unobserve(pieza);
      mostrar(llegan);
    },
    // Salta cuando el borde de arriba pasa del 90 % de la pantalla y no al
    // asomar un píxel: si no, la animación se acaba antes de que se mire.
    // Umbral 0 y no un porcentaje: una pieza más alta que la pantalla nunca
    // llegaría a enseñar un 15 % de sí misma de golpe.
    { rootMargin: "0px 0px -10% 0px" },
  );
  // Al irse de la pantalla (ver lib/pagina.ts), lo que quedara sin ver.
  senal.addEventListener("abort", () => observador.disconnect());

  // Lo que ya está en pantalla al cargar sale entero, sin esperar al
  // observer: con el margen de abajo, lo que cae en el último 10 % (la franja
  // del hero) no saltaría hasta hacer scroll, y se quedaría un hueco vacío
  // justo en la primera pantalla.
  const alCargar: HTMLElement[] = [];
  for (const pieza of document.querySelectorAll<HTMLElement>(
    "[data-revelar]",
  )) {
    const { top, bottom } = pieza.getBoundingClientRect();
    if (top < innerHeight && bottom > 0) alCargar.push(pieza);
    else observador.observe(pieza);
  }
  mostrar(alCargar);
};

export function revelar(senal: AbortSignal) {
  if (!("animar" in document.documentElement.dataset)) return;

  // El modal de bienvenida (primera visita) tapa el hero: si la entrada
  // corriera debajo, al cerrarlo ya estaría todo quieto. Se espera a que se
  // cierre. Un fotograma de margen porque su script puede correr después de
  // este y abrirlo aún no le ha dado tiempo.
  requestAnimationFrame(() => {
    if (senal.aborted) return;
    const modal = document.querySelector<HTMLDialogElement>("dialog[open]");
    if (modal)
      modal.addEventListener("close", () => empezar(senal), { once: true });
    else empezar(senal);
  });
}
