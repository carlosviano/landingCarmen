// Turnstile en el navegador: carga el script de Cloudflare, pinta el widget de
// cada formulario y pide un token nuevo cuando el anterior se ha gastado.
// Sólo de navegador.
//
// Nada de Turnstile se carga hasta que alguien empieza a rellenar un
// formulario. Turnstile guarda un dato en el navegador (`cf.turnstile.u`,
// ver config/legal/cookies.ts): así sólo se lo lleva quien va a enviar una
// solicitud, que es para lo que hace falta, y no quien entra a ver las fotos.
//
// Se pinta a mano (`render=explicit`) y no dejando que Turnstile busque sus
// widgets: con el <ClientRouter /> no hay carga de página al volver a
// /eventos, y no vería el widget nuevo. Ver src/lib/pagina.ts.
//
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
const SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

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

let cargando: Promise<Turnstile> | undefined;

/** El script de Cloudflare, una sola vez por visita aunque haya cambios de pantalla. */
function cargarTurnstile(): Promise<Turnstile> {
  cargando ??= new Promise((resolver, rechazar) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.addEventListener("load", () => resolver(window.turnstile!));
    script.addEventListener("error", rechazar);
    document.head.append(script);
  });
  return cargando;
}

/**
 * Pinta el widget con el primer gesto en su formulario y lo quita al irse de
 * la pantalla. Nace `hidden` y sólo se enseña si Turnstile duda y necesita
 * que se pulse una casilla: vacío, en la rejilla del formulario, dejaría un
 * hueco de más.
 *
 * Si el script no llega (un bloqueador, sin conexión), no hay token: el envío
 * falla y el formulario lo dice, con el WhatsApp al lado.
 */
export function montarTurnstile(widget: HTMLElement, senal: AbortSignal) {
  const empezado = new AbortController();
  const pintar = async () => {
    empezado.abort();
    const turnstile = await cargarTurnstile();
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
  };

  // Con el ratón o el dedo (pointerdown, que también cuenta los <label> de
  // las pastillas) y con el teclado (focusin).
  const form = widget.closest("form")!;
  for (const gesto of ["pointerdown", "focusin"])
    form.addEventListener(gesto, () => void pintar().catch(() => {}), {
      signal: empezado.signal,
    });
}

/** El token es de un solo uso: tras cada envío, haya ido bien o no, otro. */
export function renovarToken(form: HTMLFormElement) {
  const widget = form.querySelector<HTMLElement>("[data-turnstile]");
  if (widget) window.turnstile?.reset(widget);
}
