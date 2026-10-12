// Envía un correo con Cloudflare Email Service, por su API REST: las Pages
// Functions no admiten el binding `send_email`, que es sólo de Workers.
//
// https://developers.cloudflare.com/email-service/api/send-emails/rest-api/
//
// Envía siempre a una dirección verificada de la cuenta (la de Carmela, o la
// de quien pruebe en staging). Eso es lo que lo hace gratis, y sube el límite
// de tamaño de 5 a 25 MiB; las fotos ya llegan reducidas y caben en el más
// pequeño de los dos (ver src/lib/reducirFoto.ts).
import type { Correo } from "@/lib/correoSolicitud";

export interface Envio {
  de: { address: string; name: string };
  para: string;
  cuenta: string;
  token: string;
}

interface RespuestaApi {
  success: boolean;
  errors: { code: number; message: string }[];
  result: { permanent_bounces: string[] } | null;
}

export async function enviarCorreo(
  correo: Correo,
  { de, para, cuenta, token }: Envio,
): Promise<void> {
  const respuesta = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cuenta}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: de,
        to: para,
        reply_to: correo.responderA,
        subject: correo.asunto,
        text: correo.texto,
        html: correo.html,
        attachments: await Promise.all(correo.fotos.map(adjunto)),
      }),
    },
  );

  const { success, errors, result } = (await respuesta.json()) as RespuestaApi;
  if (!success)
    throw new Error(
      `Email Service ${respuesta.status}: ${JSON.stringify(errors)}`,
    );
  if (result?.permanent_bounces.length)
    throw new Error(`Email Service: rebotado en ${para}`);
}

async function adjunto(foto: File) {
  return {
    content: new Uint8Array(await foto.arrayBuffer()).toBase64(),
    filename: foto.name,
    type: foto.type,
    disposition: "attachment",
  };
}
