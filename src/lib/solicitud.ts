// Las reglas del formulario de eventos: qué es una solicitud válida y cómo se
// escribe el mensaje de WhatsApp.
//
// Viven aquí y no en el componente por lo mismo que src/lib/pedido.ts: las
// usan las dos puntas. El servidor escribe el `href` de WhatsApp que sale del
// build, y el navegador valida y rehace ese `href` con lo rellenado. Cuando
// el formulario tenga adónde enviarse, quien lo reciba valida con este mismo
// esquema: escrito dos veces, el navegador y el servidor acabarían aceptando
// cosas distintas.
import { z } from "zod";
import { SOLICITUD_EVENTO } from "@/config/site";
import { aISO, fechaLarga } from "@/lib/pedido";

const OBLIGATORIO = "Este campo es obligatorio.";
const BYTES_POR_MEGA = 1024 * 1024;

/**
 * El primer día que se puede pedir: mañana. Lo de los dos días laborables es
 * de los pedidos sueltos; un evento se habla, y el plazo real lo da Carmen al
 * contestar. Los fines de semana valen: es cuando se casa la gente.
 */
export function primeraFechaEvento(hoy: Date = new Date()): string {
  const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  return aISO(manana);
}

/** Una foto de inspiración. Suelta, porque el selector de fotos la usa sola. */
export const esquemaFoto = z
  .file()
  .refine((archivo) => archivo.type.startsWith("image/"), "Sólo se pueden añadir imágenes.")
  .max(
    SOLICITUD_EVENTO.fotos.megasMaximo * BYTES_POR_MEGA,
    `Cada foto puede pesar ${SOLICITUD_EVENTO.fotos.megasMaximo} MB como mucho.`,
  );

/**
 * La solicitud entera. El orden de los campos es el del formulario, que es
 * también el orden en que se enseñan los errores y al que va el foco: el
 * primero que falla.
 */
export const esquemaSolicitud = z.object({
  tipo: z.enum(SOLICITUD_EVENTO.tipos, { error: "Elige qué vas a celebrar." }),
  fecha: z.iso
    .date({ error: "Elige la fecha del evento." })
    .refine((iso) => iso >= primeraFechaEvento(), "Elige una fecha a partir de mañana."),
  invitados: z.enum(SOLICITUD_EVENTO.invitados, { error: "Elige cuántos invitados seréis, más o menos." }),
  lugar: z.string().trim().max(120, "Con el nombre del sitio basta: 120 caracteres como mucho."),
  interes: z
    .string()
    .trim()
    .min(1, "Cuéntame qué tienes en mente, aunque sea en una frase.")
    .max(2000, "Es demasiado largo: 2000 caracteres como mucho."),
  fotos: z
    .array(esquemaFoto)
    .max(SOLICITUD_EVENTO.fotos.maximo, `Caben ${SOLICITUD_EVENTO.fotos.maximo} fotos como mucho.`),
  enlace: z.union([
    z.literal(""),
    z.url({ protocol: /^https?$/, error: "Pega el enlace entero, empezando por https://" }),
  ]),
  nombre: z.string().trim().min(1, OBLIGATORIO).max(80, "80 caracteres como mucho."),
  telefono: z
    .string()
    .trim()
    .min(1, OBLIGATORIO)
    .refine(
      (telefono) => /^\+?[\d\s().-]+$/.test(telefono) && telefono.replace(/\D/g, "").length >= 9,
      "Escribe un teléfono válido, con al menos 9 cifras.",
    ),
  email: z.string().trim().min(1, OBLIGATORIO).pipe(z.email("Este email no parece válido.")),
  privacidad: z.literal("on", {
    error: "Para enviar la solicitud tienes que aceptar la política de privacidad.",
  }),
});

export type Solicitud = z.infer<typeof esquemaSolicitud>;
export type CampoSolicitud = keyof Solicitud;
/** El primer error de cada campo que falla. */
export type ErroresSolicitud = Partial<Record<CampoSolicitud, string>>;

export type ResultadoSolicitud =
  | { ok: true; solicitud: Solicitud }
  | { ok: false; errores: ErroresSolicitud };

/**
 * Valida lo que trae el formulario. Las claves que faltan (un radio sin
 * marcar, la casilla de privacidad) llegan como `undefined` y las cuenta el
 * esquema como cualquier otro error.
 */
export function validarSolicitud(datos: FormData): ResultadoSolicitud {
  const campos = Object.keys(esquemaSolicitud.shape);
  const resultado = esquemaSolicitud.safeParse({
    ...Object.fromEntries(campos.map((campo) => [campo, datos.get(campo) ?? undefined])),
    // Un <input type="file"> sin nada elegido manda igual un archivo vacío.
    fotos: datos.getAll("fotos").filter((foto) => foto instanceof File && foto.size > 0),
  });
  if (resultado.success) return { ok: true, solicitud: resultado.data };

  const { fieldErrors } = z.flattenError(resultado.error);
  const errores: ErroresSolicitud = {};
  for (const [campo, mensajes] of Object.entries(fieldErrors)) {
    errores[campo as CampoSolicitud] = mensajes?.[0];
  }
  return { ok: false, errores };
}

// --- WhatsApp ---------------------------------------------------------------

export interface DatosEvento {
  tipo?: string;
  /** "2026-10-01", tal cual lo guarda el calendario. */
  fecha?: string;
  invitados?: string;
  lugar?: string;
}

/**
 * "Hola, te escribo desde la web por un evento: una boda, el sábado, 12 de
 * junio, para 50 – 100 invitados, en Málaga."
 *
 * Sin nada rellenado se queda en el saludo, que es lo que invita a seguir
 * escribiendo.
 */
export function mensajeEvento(datos: DatosEvento = {}): string {
  const saludo = "Hola, te escribo desde la web por un evento";
  const partes: string[] = [];

  if (datos.tipo) partes.push(conArticulo(datos.tipo));
  if (datos.fecha) partes.push(`el ${fechaLarga(datos.fecha)}`);
  if (datos.invitados) partes.push(`para ${datos.invitados.toLowerCase()} invitados`);
  if (datos.lugar?.trim()) partes.push(`en ${datos.lugar.trim()}`);

  return partes.length ? `${saludo}: ${partes.join(", ")}.` : `${saludo}.`;
}

// "Boda" → "una boda", "Cumpleaños" → "un cumpleaños". Las claves son las de
// SOLICITUD_EVENTO.tipos; una nueva que no esté aquí sale en minúscula y sin
// artículo, que se sigue leyendo.
const CON_ARTICULO: Record<string, string> = {
  Boda: "una boda",
  Cumpleaños: "un cumpleaños",
  "Comunión o bautizo": "una comunión o bautizo",
  Empresa: "un evento de empresa",
  "Otra celebración": "otra celebración",
};

function conArticulo(tipo: string): string {
  return CON_ARTICULO[tipo] ?? tipo.toLowerCase();
}
