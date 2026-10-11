// El correo que le llega a Carmela con cada solicitud: lo redacta la Pages
// Function (functions/api/solicitud/[tipo].ts) a partir de una solicitud ya
// validada con los esquemas de src/lib/solicitud.ts.
//
// Sólo de servidor, pero puro: recibe datos y devuelve texto, sin saber
// quién lo envía ni cómo. Cambiar de proveedor de correo no toca este archivo.
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

/** Una línea del correo: "Fecha: sábado, 12 de junio". Sin valor, no sale. */
type Fila = readonly [etiqueta: string, valor: string];

export function correoEvento(solicitud: Solicitud): Correo {
  const fecha = fechaLarga(solicitud.fecha);
  return redactar(solicitud, {
    asunto: `Evento: ${solicitud.tipo}, ${fecha} · ${solicitud.nombre}`,
    filas: [
      ["Tipo de evento", solicitud.tipo],
      ["Fecha", fecha],
      ["Invitados", solicitud.invitados],
      ["Lugar", solicitud.lugar],
      ["Qué tiene en mente", solicitud.interes],
      ["Enlace", solicitud.enlace],
    ],
  });
}

export function correoEspecial(solicitud: SolicitudEspecial): Correo {
  const fecha = fechaLarga(solicitud.fecha);
  const diseno = OPCIONES_DISENO.find(
    (opcion) => opcion.valor === solicitud.diseno,
  )!.nombre;
  return redactar(solicitud, {
    asunto: `Tarta especial: ${diseno}, ${fecha} · ${solicitud.nombre}`,
    filas: [
      ["Diseño", diseno],
      ["Ocasión", solicitud.ocasion],
      ["Recogida", fecha],
      ["Personas", solicitud.personas],
      ["Su idea", solicitud.idea],
    ],
  });
}

/** Lo común: el contacto al final, las fotos adjuntas y las dos versiones. */
function redactar(
  solicitud: Solicitud | SolicitudEspecial,
  { asunto, filas }: { asunto: string; filas: Fila[] },
): Correo {
  const todas = [
    ...filas,
    ["Nombre", solicitud.nombre],
    ["Teléfono", solicitud.telefono],
    ["Email", solicitud.email],
    [
      "Fotos",
      solicitud.fotos.length ? `${solicitud.fotos.length}, adjuntas` : "",
    ],
  ].filter(([, valor]) => valor) as Fila[];

  return {
    asunto,
    texto: todas.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`).join("\n"),
    html: tabla(todas),
    responderA: solicitud.email,
    // Son File de verdad. El cast es para los tipos de Workers (functions/):
    // zod busca `File` en `globalThis`, y allí es una clase que no cuelga de
    // él, así que zod lo tipa como un File sin métodos.
    fotos: solicitud.fotos as File[],
  };
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
