// Turnstile en el navegador: pinta el widget de cada formulario y pide un
// token nuevo cuando el anterior se ha gastado. Sólo de navegador.
//
// Se pinta a mano (`render=explicit`) y no dejando que Turnstile busque sus
// widgets al cargar: con el <ClientRouter /> su script se ejecuta una sola
// vez por visita, así que al volver a /eventos sin recargar no vería el
// widget nuevo, no habría token y el envío fallaría. Ver src/lib/pagina.ts.
//
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

interface Turnstile {
  render(widget: HTMLElement, opciones: Record<string, unknown>): string;
  reset(widget: HTMLElement): void;
  remove(id: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

// El script de Cloudflare (Turnstile.astro) va `async`: puede llegar antes o
// después que este, así que se mira si ya está y, si no, se espera a su
// `load`. Con un callback `onload` en su URL, cuando llega antes no lo
// encuentra y lo avisa en la consola.
const listo = new Promise<Turnstile>((resolver) => {
  if (window.turnstile) return resolver(window.turnstile);
  document
    .querySelector(
      "script[src^='https://challenges.cloudflare.com/turnstile/']",
    )!
    .addEventListener("load", () => resolver(window.turnstile!), {
      once: true,
    });
});

/**
 * Pinta el widget y lo quita al irse de la pantalla. Nace `hidden` y sólo se
 * enseña si Turnstile duda y necesita que se pulse una casilla: vacío, en la
 * rejilla del formulario, dejaría un hueco de más.
 */
export function montarTurnstile(widget: HTMLElement, senal: AbortSignal) {
  void listo.then((turnstile) => {
    if (senal.aborted) return;
    const id = turnstile.render(widget, {
      sitekey: widget.dataset.sitekey,
      language: "es",
      appearance: "interaction-only",
      size: "flexible",
      "before-interactive-callback": () => {
        widget.hidden = false;
      },
    });
    senal.addEventListener("abort", () => turnstile.remove(id));
  });
}

/** El token es de un solo uso: tras cada envío, haya ido bien o no, otro. */
export function renovarToken(form: HTMLFormElement) {
  const widget = form.querySelector<HTMLElement>("[data-turnstile]");
  if (widget) window.turnstile?.reset(widget);
}
