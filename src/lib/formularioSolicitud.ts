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
// envía: el envío lo hace esto, y sólo cuando hay adónde (`envio`).
import { whatsappCon } from "@/config/site";
import { montarCalendario } from "@/lib/calendario";
import { montarDesplegable } from "@/lib/desplegable";
import type { ErroresSolicitud } from "@/lib/solicitud";

export interface OpcionesSolicitud {
  validar: (datos: FormData) => { ok: true } | { ok: false; errores: ErroresSolicitud };
  /** El texto del WhatsApp con lo rellenado. `texto(name)` lee un campo. */
  mensaje: (texto: (nombre: string) => string | undefined) => string;
  /** Los días que deja elegir el calendario, como en `montarCalendario`. */
  calendario: Parameters<typeof montarCalendario>[1];
  /** Adónde se manda (POST multipart). `null`: valida pero no envía, y lo dice. */
  envio: string | null;
  /** Lo que se lee al recibirse: es lo único que cambia entre formularios. */
  enviado: string;
}

const MENSAJES = {
  sinConectar:
    "El envío del formulario todavía no está conectado. Mientras tanto, escríbeme por WhatsApp.",
  enviando: "Enviando…",
  fallo: "No se ha podido enviar. Vuelve a probar en un momento o escríbeme por WhatsApp.",
};

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
function soloDe(errores: ErroresSolicitud, campos: ReadonlySet<string>): ErroresSolicitud {
  return Object.fromEntries(
    Object.entries(errores).filter(([campo]) => campos.has(campo)),
  );
}

/** Lleva el foco al primer campo que falla, que es también lo que lo enseña. */
function enfocarPrimerError(form: HTMLFormElement) {
  form.querySelector<HTMLElement>("[aria-invalid]")?.focus();
}

export function montarSolicitud(form: HTMLFormElement, opciones: OpcionesSolicitud): void {
  const estado = form.querySelector<HTMLElement>("[data-estado]")!;
  const boton = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const whatsapp = form.querySelector<HTMLAnchorElement>("[data-whatsapp]")!;

  montarCalendario(form, opciones.calendario);
  form.querySelectorAll<HTMLElement>("[data-desplegable]").forEach(montarDesplegable);

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
    revisar();
  };
  form.addEventListener("input", alCambiar);
  form.addEventListener("change", alCambiar);

  // Al salir de un campo de texto con algo escrito, su error se ve ya.
  form.addEventListener("focusout", (evento) => {
    const control = evento.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) return;
    const campo = control.closest<HTMLElement>("[data-campo]")?.dataset.campo;
    if (!campo || !control.value.trim()) return;
    tocados.add(campo);
    revisar();
  });

  const enviar = async (datos: FormData, destino: string) => {
    boton.disabled = true;
    estado.textContent = MENSAJES.enviando;
    try {
      const respuesta = await fetch(destino, { method: "POST", body: datos });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      form.reset();
      intentado = false;
      tocados.clear();
      estado.textContent = opciones.enviado;
    } catch {
      estado.textContent = MENSAJES.fallo;
    } finally {
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

    if (!opciones.envio) {
      estado.textContent = MENSAJES.sinConectar;
      return;
    }
    void enviar(new FormData(form), opciones.envio);
  });
}
