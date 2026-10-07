// Las reglas de los formularios de solicitud (eventos y tartas especiales):
// qué es una solicitud válida y cómo se escribe el mensaje de WhatsApp.
//
// Viven aquí y no en el componente por lo mismo que src/lib/pedido.ts: las
// usan las dos puntas. El servidor escribe el `href` de WhatsApp que sale del
// build, y el navegador valida y rehace ese `href` con lo rellenado. Cuando
// el formulario tenga adónde enviarse, quien lo reciba valida con este mismo
// esquema: escrito dos veces, el navegador y el servidor acabarían aceptando
// cosas distintas.
import { z } from "zod";
import { SOLICITUD_EVENTO } from "@/config/eventos";
import { ESPECIALES } from "@/config/personalizadas";
import { aISO, esLaborable, fechaLarga } from "@/lib/pedido";

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

/**
 * El primer día en que se puede recoger una tarta especial: se cuentan
 * `ESPECIALES.solicitud.diasAntelacion` días laborables, como en el pedido de
 * la carta. Se recoge en el obrador, que sólo abre de lunes a viernes.
 */
export function primeraFechaEspecial(hoy: Date = new Date()): string {
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let contados = 0;
  while (contados < ESPECIALES.solicitud.diasAntelacion) {
    fecha.setDate(fecha.getDate() + 1);
    if (esLaborable(fecha)) contados++;
  }
  return aISO(fecha);
}

/**
 * Una foto de inspiración, con el límite de peso de cada formulario. Suelta,
 * porque el selector de fotos la usa sola.
 */
export const esquemaFotoDe = (megasMaximo: number) =>
  z
    .file()
    .refine(
      (archivo) => archivo.type.startsWith("image/"),
      "Sólo se pueden añadir imágenes.",
    )
    .max(
      megasMaximo * BYTES_POR_MEGA,
      `Cada foto puede pesar ${megasMaximo} MB como mucho.`,
    );

/** La de eventos. */
export const esquemaFoto = esquemaFotoDe(SOLICITUD_EVENTO.fotos.megasMaximo);

const fotosHasta = ({
  maximo,
  megasMaximo,
}: {
  maximo: number;
  megasMaximo: number;
}) =>
  z
    .array(esquemaFotoDe(megasMaximo))
    .max(maximo, `Caben ${maximo} fotos como mucho.`);

// Lo que cierra los dos formularios: quién escribe y el consentimiento.
const contacto = {
  nombre: z
    .string()
    .trim()
    .min(1, OBLIGATORIO)
    .max(80, "80 caracteres como mucho."),
  telefono: z
    .string()
    .trim()
    .min(1, OBLIGATORIO)
    .refine(
      (telefono) =>
        /^\+?[\d\s().-]+$/.test(telefono) &&
        telefono.replace(/\D/g, "").length >= 9,
      "Escribe un teléfono válido, con al menos 9 cifras.",
    ),
  email: z
    .string()
    .trim()
    .min(1, OBLIGATORIO)
    .pipe(z.email("Este email no parece válido.")),
  privacidad: z.literal("on", {
    error:
      "Para enviar la solicitud tienes que aceptar la política de privacidad.",
  }),
};

/**
 * La solicitud entera. El orden de los campos es el del formulario, que es
 * también el orden en que se enseñan los errores y al que va el foco: el
 * primero que falla.
 */
export const esquemaSolicitud = z.object({
  tipo: z.enum(SOLICITUD_EVENTO.tipos, { error: "Elige qué vas a celebrar." }),
  fecha: z.iso
    .date({ error: "Elige la fecha del evento." })
    .refine(
      (iso) => iso >= primeraFechaEvento(),
      "Elige una fecha a partir de mañana.",
    ),
  invitados: z.enum(SOLICITUD_EVENTO.invitados, {
    error: "Elige cuántos invitados seréis, más o menos.",
  }),
  lugar: z
    .string()
    .trim()
    .max(120, "Con el nombre del sitio basta: 120 caracteres como mucho."),
  interes: z
    .string()
    .trim()
    .min(1, "Cuéntame qué tienes en mente, aunque sea en una frase.")
    .max(2000, "Es demasiado largo: 2000 caracteres como mucho."),
  fotos: fotosHasta(SOLICITUD_EVENTO.fotos),
  enlace: z.union([
    z.literal(""),
    z.url({
      protocol: /^https?$/,
      error: "Pega el enlace entero, empezando por https://",
    }),
  ]),
  ...contacto,
});

/** Lo que se puede marcar en "Diseño": cada diseño y "que me proponga". */
export const OPCIONES_DISENO = [
  ...ESPECIALES.disenos.map(({ slug, nombre }) => ({ valor: slug, nombre })),
  { valor: ESPECIALES.proponer.slug, nombre: ESPECIALES.proponer.opcion },
];

/** La solicitud de una tarta especial. Mismo criterio de orden que la de eventos. */
export const esquemaEspecial = z.object({
  // Obligatorio: quien no sabe cuál tiene "Que me proponga Carmela".
  diseno: z
    .string({ error: "Elige un diseño, o que te proponga uno." })
    .refine(
      (valor) => OPCIONES_DISENO.some((opcion) => opcion.valor === valor),
      "Elige uno de la lista.",
    ),
  ocasion: z.enum(ESPECIALES.solicitud.ocasiones, {
    error: "Elige qué vas a celebrar.",
  }),
  fecha: z.iso
    .date({ error: "Elige el día de recogida." })
    .refine(
      (iso) => iso >= primeraFechaEspecial(),
      "Elige un día a partir del primero que deja el calendario.",
    )
    .refine(
      (iso) => esLaborable(new Date(`${iso}T12:00`)),
      "Se recoge de lunes a viernes.",
    ),
  personas: z.enum(ESPECIALES.solicitud.personas, {
    error: "Elige cuántas personas seréis, más o menos.",
  }),
  idea: z
    .string()
    .trim()
    .max(2000, "Es demasiado largo: 2000 caracteres como mucho."),
  fotos: fotosHasta(ESPECIALES.solicitud.fotos),
  ...contacto,
});

export type Solicitud = z.infer<typeof esquemaSolicitud>;
export type SolicitudEspecial = z.infer<typeof esquemaEspecial>;
/** El primer error de cada campo que falla, por `name`. */
export type ErroresSolicitud = Partial<Record<string, string>>;

export type ResultadoSolicitud<T = Solicitud> =
  { ok: true; solicitud: T } | { ok: false; errores: ErroresSolicitud };

/** Valida una solicitud de evento. */
export const validarSolicitud = (datos: FormData) =>
  validarCon(esquemaSolicitud, datos);

/** Valida una solicitud de tarta especial. */
export const validarEspecial = (datos: FormData) =>
  validarCon(esquemaEspecial, datos);

/**
 * Valida lo que trae un formulario contra su esquema. Las claves que faltan
 * (un radio sin marcar, la casilla de privacidad) llegan como `undefined` y
 * las cuenta el esquema como cualquier otro error.
 */
function validarCon<E extends z.ZodObject>(
  esquema: E,
  datos: FormData,
): ResultadoSolicitud<z.infer<E>> {
  const campos = Object.keys(esquema.shape);
  const resultado = esquema.safeParse({
    ...Object.fromEntries(
      campos.map((campo) => [campo, datos.get(campo) ?? undefined]),
    ),
    // Un <input type="file"> sin nada elegido manda igual un archivo vacío.
    fotos: datos
      .getAll("fotos")
      .filter((foto) => foto instanceof File && foto.size > 0),
  });
  if (resultado.success) return { ok: true, solicitud: resultado.data };

  const { fieldErrors } = z.flattenError(resultado.error);
  const errores: ErroresSolicitud = {};
  for (const [campo, mensajes] of Object.entries(fieldErrors)) {
    errores[campo] = mensajes?.[0];
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
  if (datos.invitados)
    partes.push(`para ${datos.invitados.toLowerCase()} invitados`);
  if (datos.lugar?.trim()) partes.push(`en ${datos.lugar.trim()}`);

  return partes.length ? `${saludo}: ${partes.join(", ")}.` : `${saludo}.`;
}

export interface DatosEspecial {
  /** El `slug` del diseño, o el de "que me proponga". */
  diseno?: string;
  ocasion?: string;
  personas?: string;
  /** "2026-10-01", tal cual lo guarda el calendario. */
  fecha?: string;
}

/**
 * "Hola, te escribo desde la web por una tarta especial: La rosa, para un
 * cumpleaños, de 10 – 20 personas, a recoger el martes, 3 de noviembre."
 *
 * Igual que `mensajeEvento`: sin nada rellenado se queda en el saludo.
 */
export function mensajeEspecial(datos: DatosEspecial = {}): string {
  const saludo = "Hola, te escribo desde la web por una tarta especial";
  const partes: string[] = [];

  if (datos.diseno === ESPECIALES.proponer.slug)
    partes.push("que me propongas un diseño");
  else {
    const diseno = ESPECIALES.disenos.find((d) => d.slug === datos.diseno);
    if (diseno) partes.push(diseno.nombre);
  }
  if (datos.ocasion) partes.push(`para ${conArticulo(datos.ocasion)}`);
  if (datos.personas)
    partes.push(`de ${datos.personas.toLowerCase()} personas`);
  if (datos.fecha) partes.push(`a recoger el ${fechaLarga(datos.fecha)}`);

  return partes.length ? `${saludo}: ${partes.join(", ")}.` : `${saludo}.`;
}

// "Boda" → "una boda", "Cumpleaños" → "un cumpleaños". Las claves son las de
// SOLICITUD_EVENTO.tipos y ESPECIALES.solicitud.ocasiones; una nueva que no
// esté aquí sale en minúscula y sin artículo, que se sigue leyendo.
const CON_ARTICULO: Record<string, string> = {
  Boda: "una boda",
  Cumpleaños: "un cumpleaños",
  "Comunión o bautizo": "una comunión o bautizo",
  Aniversario: "un aniversario",
  Empresa: "un evento de empresa",
  "Otra celebración": "otra celebración",
};

function conArticulo(tipo: string): string {
  return CON_ARTICULO[tipo] ?? tipo.toLowerCase();
}
