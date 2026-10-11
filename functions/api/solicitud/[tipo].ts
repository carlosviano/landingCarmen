// POST /api/solicitud/evento y /api/solicitud/especial: lo que recibe los
// formularios de /eventos y /personalizadas y se los manda a Carmela.
//
// Es una Pages Function: Cloudflare Pages la publica junto al sitio estático
// de Astro sin que Astro se entere, y sólo se ejecuta en estas rutas. El resto
// de la web sigue siendo HTML ya construido.
//
// Tres pasos, y el primero que falla corta: que lo envíe una persona
// (Turnstile), que la solicitud sea válida (los mismos esquemas de zod con
// los que valida el navegador) y que el correo salga.
//
// Las variables se ponen en el panel de Pages, por entorno (Settings →
// Variables and Secrets), y en local en `.dev.vars` (ver README, «Formularios»).
import {
  correoEspecial,
  correoEvento,
  type Correo,
} from "@/lib/correoSolicitud";
import {
  validarEspecial,
  validarSolicitud,
  type ResultadoSolicitud,
} from "@/lib/solicitud";
import { enviarCorreo } from "../../_lib/enviarCorreo";
import { CAMPO_TURNSTILE, esHumano } from "../../_lib/turnstile";

interface Entorno {
  CLOUDFLARE_ACCOUNT_ID: string;
  /** Secreto. Token de API con permiso para enviar con Email Service. */
  CLOUDFLARE_EMAIL_TOKEN: string;
  TURNSTILE_SECRET: string;
  /** Adónde llegan. Tiene que estar verificada en Email Routing. */
  CORREO_DESTINO: string;
  /** "1" en local: el correo se escribe en la consola y no se envía. */
  CORREO_EN_CONSOLA?: string;
}

const REMITENTE = {
  address: "formulario@estimadacarmela.com",
  name: "Web de Estimada Carmela",
};

/** Valida lo recibido y, si vale, lo redacta. `null`: no es una solicitud válida. */
const redactorDe =
  <T>(
    validar: (datos: FormData) => ResultadoSolicitud<T>,
    redactar: (solicitud: T) => Correo,
  ) =>
  (datos: FormData): Correo | null => {
    const resultado = validar(datos);
    return resultado.ok ? redactar(resultado.solicitud) : null;
  };

const REDACTORES: Partial<Record<string, (datos: FormData) => Correo | null>> =
  {
    evento: redactorDe(validarSolicitud, correoEvento),
    especial: redactorDe(validarEspecial, correoEspecial),
  };

export const onRequestPost: PagesFunction<Entorno, "tipo"> = async ({
  request,
  env,
  params,
}) => {
  const redactar = REDACTORES[String(params.tipo)];
  if (!redactar) return new Response(null, { status: 404 });

  const datos = await request.formData();

  const humano = await esHumano(
    datos.get(CAMPO_TURNSTILE),
    env.TURNSTILE_SECRET,
    request.headers.get("CF-Connecting-IP"),
  );
  if (!humano) return new Response(null, { status: 403 });

  // El navegador ya valida con el mismo esquema: esto sólo lo rechaza a quien
  // se lo salta.
  const correo = redactar(datos);
  if (!correo) return new Response(null, { status: 422 });

  if (env.CORREO_EN_CONSOLA === "1") {
    console.log({ ...correo, fotos: correo.fotos.map((foto) => foto.name) });
    return new Response(null, { status: 204 });
  }

  try {
    await enviarCorreo(correo, {
      de: REMITENTE,
      para: env.CORREO_DESTINO,
      cuenta: env.CLOUDFLARE_ACCOUNT_ID,
      token: env.CLOUDFLARE_EMAIL_TOKEN,
    });
  } catch (error) {
    // Sale en los logs de la Function, en el panel de Pages.
    console.error(error);
    return new Response(null, { status: 502 });
  }
  return new Response(null, { status: 204 });
};
