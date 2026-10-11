// Cómo se cuenta por escrito una solicitud ya validada con los esquemas de
// src/lib/solicitud.ts. De aquí salen dos cosas, con las mismas líneas:
//
// - El correo que le llega a Carmela. Lo redacta la Pages Function
//   (functions/api/solicitud/[tipo].ts).
// - El WhatsApp de respaldo, si ese envío falla. Lo arma el navegador
//   (src/lib/formularioSolicitud.ts), para que quien escribe no tenga que
//   repetir nada.
//
// Puro: recibe datos y devuelve texto, sin saber quién lo envía ni cómo.
// Cambiar de proveedor de correo no toca este archivo.
//
// Cada correo va en dos versiones, texto y HTML, con las mismas filas: hay
// clientes que sólo enseñan una, y el texto plano también cuenta para que no
// caiga en spam. El HTML es una tabla sin estilos propios, que es lo que
// Gmail pinta igual en todas partes.
import { fechaLarga } from "@/lib/pedido";
import {
  OPCIONES_DISENO,
  type Solicitud,
  type SolicitudEspecial,
} from "@/lib/solicitud";

export interface Correo {
  asunto: string;
  texto: string;
  html: string;
  /** El email de quien escribe: al darle a "Responder" le contesta a ella. */
  responderA: string;
  fotos: File[];
}

/** Una línea: "Fecha: sábado, 12 de junio". Sin valor, no sale. */
type Fila = readonly [etiqueta: string, valor: string];

/**
 * Lo propio de cada formulario. El contacto lo añade `conContacto`, y las
 * fotos cada salida a su manera (adjuntas en el correo, aparte en WhatsApp).
 */
interface Resumen {
  asunto: string;
  filas: Fila[];
}

function resumenEvento(solicitud: Solicitud): Resumen {
  const fecha = fechaLarga(solicitud.fecha);
  return {
    asunto: `Evento: ${solicitud.tipo}, ${fecha} · ${solicitud.nombre}`,
    filas: [
      ["Tipo de evento", solicitud.tipo],
      ["Fecha", fecha],
      ["Invitados", solicitud.invitados],
      ["Lugar", solicitud.lugar],
      ["Qué tiene en mente", solicitud.interes],
    ],
  };
}

function resumenEspecial(solicitud: SolicitudEspecial): Resumen {
  const fecha = fechaLarga(solicitud.fecha);
  const diseno = OPCIONES_DISENO.find(
    (opcion) => opcion.valor === solicitud.diseno,
  )!.nombre;
  return {
    asunto: `Tarta especial: ${diseno}, ${fecha} · ${solicitud.nombre}`,
    filas: [
      ["Diseño", diseno],
      ["Ocasión", solicitud.ocasion],
      ["Recogida", fecha],
      ["Personas", solicitud.personas],
      ["Su idea", solicitud.idea],
    ],
  };
}

export const correoEvento = (solicitud: Solicitud) =>
  correo(solicitud, resumenEvento(solicitud));

export const correoEspecial = (solicitud: SolicitudEspecial) =>
  correo(solicitud, resumenEspecial(solicitud));

export const respaldoEvento = (solicitud: Solicitud) =>
  respaldo(solicitud, resumenEvento(solicitud));

export const respaldoEspecial = (solicitud: SolicitudEspecial) =>
  respaldo(solicitud, resumenEspecial(solicitud));

type Cualquiera = Solicitud | SolicitudEspecial;

/** Las filas de un formulario con el contacto al final, sin las vacías. */
function conContacto(solicitud: Cualquiera, filas: Fila[]): Fila[] {
  return [
    ...filas,
    ["Nombre", solicitud.nombre],
    ["Teléfono", solicitud.telefono],
    ["Email", solicitud.email],
  ].filter(([, valor]) => valor) as Fila[];
}

const enTexto = (filas: readonly Fila[]) =>
  filas.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`).join("\n");

function correo(solicitud: Cualquiera, { asunto, filas }: Resumen): Correo {
  const fotos = solicitud.fotos.length;
  const todas = conContacto(solicitud, filas);
  if (fotos) todas.push(["Fotos", `${fotos}, adjuntas`]);

  return {
    asunto,
    texto: enTexto(todas),
    html: tabla(todas),
    responderA: solicitud.email,
    // Son File de verdad. El cast es para los tipos de Workers (functions/):
    // zod busca `File` en `globalThis`, y allí es una clase que no cuelga de
    // él, así que zod lo tipa como un File sin métodos.
    fotos: solicitud.fotos as File[],
  };
}

/**
 * La solicitud entera para WhatsApp, cuando el formulario no ha podido
 * enviarse. Las fotos no caben en un enlace de wa.me: se avisa de que van
 * aparte, en el chat.
 */
function respaldo(solicitud: Cualquiera, { filas }: Resumen): string {
  const fotos = solicitud.fotos.length;
  return [
    "Hola, he intentado enviarte esta solicitud desde la web y no ha salido:",
    enTexto(conContacto(solicitud, filas)),
    fotos === 1
      ? "Tengo una foto de inspiración: te la mando ahora por aquí."
      : fotos
        ? `Tengo ${fotos} fotos de inspiración: te las mando ahora por aquí.`
        : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function tabla(filas: readonly Fila[]): string {
  const celdas = filas
    .map(
      ([etiqueta, valor]) =>
        `<tr><th align="left" valign="top">${escapar(etiqueta)}</th>` +
        `<td style="white-space:pre-wrap">${escapar(valor)}</td></tr>`,
    )
    .join("");
  return `<table cellpadding="6">${celdas}</table>`;
}

// Todo lo que pinta el HTML lo ha escrito quien rellena el formulario.
function escapar(texto: string): string {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
