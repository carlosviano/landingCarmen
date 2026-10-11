// Lo que hace funcionar un formulario de solicitud en el navegador: el de
// /eventos y el de /personalizadas. El marcado es el de
// components/formulario/MarcoSolicitud.astro más los campos de cada uno; lo
// que cambia entre los dos (esquema, mensaje de WhatsApp, qué días vale el
// calendario, adónde se envía) entra por `OpcionesSolicitud`.
//
// Validación: `novalidate` en el <form> y el esquema de zod de
// src/lib/solicitud.ts. Cada error sale debajo de su campo, y se enseña en dos
// momentos: al salir de un campo que ya tiene algo escrito (un email mal
// puesto se ve en el acto, sin esperar a enviar) y, al enviar, todos. Desde
// que un campo enseña su error se revalida con cada cambio, para que el aviso
// se vaya en cuanto se arregla. Sin JS el formulario se ve entero pero no se
// envía: el envío lo hace esto, a la Pages Function de `envio`
// (functions/api/solicitud/[tipo].ts).
import { whatsappCon } from "@/config/site";
import { montarCalendario } from "@/lib/calendario";
import { montarDesplegable } from "@/lib/desplegable";
import type { ErroresSolicitud, ResultadoSolicitud } from "@/lib/solicitud";
import { renovarToken } from "@/lib/turnstile";

export interface OpcionesSolicitud<T> {
  validar: (datos: FormData) => ResultadoSolicitud<T>;
  /** El texto del WhatsApp con lo rellenado. `texto(name)` lee un campo. */
  mensaje: (texto: (nombre: string) => string | undefined) => string;
  /** Los días que deja elegir el calendario, como en `montarCalendario`. */
  calendario: Parameters<typeof montarCalendario>[1];
  /** Adónde se manda (POST multipart, con las fotos y el token de Turnstile). */
  envio: string;
  /** Lo que se lee al recibirse: es lo único que cambia entre formularios. */
  enviado: string;
  /** La solicitud entera para WhatsApp, por si el envío falla (FalloEnvio.astro). */
  respaldo: (solicitud: T) => string;
}

const ENVIANDO = "Enviando…";

// Lo que se marca como inválido de cada campo: el control que se ve. No el
// <input> oculto del calendario o del desplegable (se marca su botón), ni el
// de las fotos (su zona ya es la etiqueta).
const CONTROLES =
  "input:not([type=hidden]):not([type=file]), textarea, [data-calendario-boton], [data-desplegable-boton]";

/** Escribe el error de cada campo bajo él y marca sus controles. */
function pintarErrores(form: HTMLFormElement, errores: ErroresSolicitud) {
  for (const campo of form.querySelectorAll<HTMLElement>("[data-campo]")) {
    const mensaje = errores[campo.dataset.campo!];
    const hueco = campo.querySelector<HTMLElement>("[data-error]")!;
    hueco.textContent = mensaje ?? "";
    hueco.hidden = !mensaje;

    for (const control of campo.querySelectorAll<HTMLElement>(CONTROLES)) {
      if (mensaje) {
        control.setAttribute("aria-invalid", "true");
        control.setAttribute("aria-errormessage", hueco.id);
      } else {
        control.removeAttribute("aria-invalid");
        control.removeAttribute("aria-errormessage");
      }
    }
  }
}

/** Sólo los errores de `campos`. */
function soloDe(
  errores: ErroresSolicitud,
  campos: ReadonlySet<string>,
): ErroresSolicitud {
  return Object.fromEntries(
    Object.entries(errores).filter(([campo]) => campos.has(campo)),
  );
}

/** Lleva el foco al primer campo que falla, que es también lo que lo enseña. */
function enfocarPrimerError(form: HTMLFormElement) {
  form.querySelector<HTMLElement>("[aria-invalid]")?.focus();
}

export function montarSolicitud<T>(
  form: HTMLFormElement,
  opciones: OpcionesSolicitud<T>,
): void {
  const estado = form.querySelector<HTMLElement>("[data-estado]")!;
  const boton = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const whatsapp = form.querySelector<HTMLAnchorElement>("[data-whatsapp]")!;
  const fallo = form.querySelector<HTMLElement>("[data-fallo]")!;
  const reintentar = fallo.querySelector<HTMLElement>(
    "[data-fallo-reintentar]",
  )!;
  const falloWhatsapp = fallo.querySelector<HTMLAnchorElement>(
    "[data-fallo-whatsapp]",
  )!;
  reintentar.addEventListener("click", () => form.requestSubmit());

  montarCalendario(form, opciones.calendario);
  form
    .querySelectorAll<HTMLElement>("[data-desplegable]")
    .forEach(montarDesplegable);

  // Qué errores se enseñan. Hasta el primer intento de envío, sólo los de
  // los campos `tocados`: los que se han dejado con algo escrito. Nadie
  // quiere ver "obligatorio" en un campo al que todavía no ha llegado.
  let intentado = false;
  const tocados = new Set<string>();

  const revisar = () => {
    const resultado = opciones.validar(new FormData(form));
    const errores = resultado.ok ? {} : resultado.errores;
    pintarErrores(form, intentado ? errores : soloDe(errores, tocados));
    return resultado;
  };

  const texto = (nombre: string) => {
    const valor = new FormData(form).get(nombre);
    return typeof valor === "string" ? valor : undefined;
  };

  const alCambiar = () => {
    whatsapp.href = whatsappCon(opciones.mensaje(texto));
    // Lo que cambie después de un fallo ya no está en el WhatsApp del aviso:
    // se envía con el próximo intento.
    fallo.hidden = true;
    revisar();
  };
  form.addEventListener("input", alCambiar);
  form.addEventListener("change", alCambiar);

  // Al salir de un campo de texto con algo escrito, su error se ve ya.
  form.addEventListener("focusout", (evento) => {
    const control = evento.target;
    if (!(
      control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement
    ))
      return;
    const campo = control.closest<HTMLElement>("[data-campo]")?.dataset.campo;
    if (!campo || !control.value.trim()) return;
    tocados.add(campo);
    revisar();
  });

  const enviar = async (datos: FormData, solicitud: T) => {
    boton.disabled = true;
    fallo.hidden = true;
    estado.textContent = ENVIANDO;
    try {
      const respuesta = await fetch(opciones.envio, {
        method: "POST",
        body: datos,
      });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      form.reset();
      intentado = false;
      tocados.clear();
      estado.textContent = opciones.enviado;
    } catch {
      // Sea cual sea el motivo, lo mismo: nada se ha perdido, y dos salidas.
      estado.textContent = "";
      falloWhatsapp.href = whatsappCon(opciones.respaldo(solicitud));
      fallo.hidden = false;
      reintentar.focus();
    } finally {
      renovarToken(form);
      boton.disabled = false;
    }
  };

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    intentado = true;

    const resultado = revisar();
    if (!resultado.ok) {
      estado.textContent = "";
      enfocarPrimerError(form);
      return;
    }

    void enviar(new FormData(form), resultado.solicitud);
  });
}
