// Turnstile, el captcha invisible de Cloudflare. El widget del formulario
// (components/formulario/Turnstile.astro) mete en él un token de un solo uso;
// aquí se le pregunta a Cloudflare si ese token es de una persona.
//
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** El nombre del campo en el que el widget deja su token. */
export const CAMPO_TURNSTILE = "cf-turnstile-response";

export async function esHumano(
  token: unknown,
  secreto: string,
  ip: string | null,
): Promise<boolean> {
  if (typeof token !== "string" || !token) return false;

  const respuesta = await fetch(SITEVERIFY, {
    method: "POST",
    body: new URLSearchParams({
      secret: secreto,
      response: token,
      ...(ip && { remoteip: ip }),
    }),
  });
  const { success } = (await respuesta.json()) as { success: boolean };
  return success;
}
