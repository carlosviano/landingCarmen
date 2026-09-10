import type { APIRoute } from "astro";

// robots.txt distinto según la rama que se esté desplegando, para que el
// trabajo a medias que ve la clienta en staging no acabe en Google.
//
// Cloudflare Pages inyecta `CF_PAGES_BRANCH` en el build con el nombre de la
// rama del despliegue (documentado en la tabla de variables de entorno de
// "Build configuration"). El sitio es estático, así que esto se evalúa una vez
// al construir y lo que se publica es un fichero de texto ya resuelto: no hay
// nada que decidir en tiempo de ejecución.
const RAMA_PRODUCCION = "main";

// Se permite indexar SOLO si la rama es exactamente la de producción. Todo lo
// demás —staging, las previews de los PR y cualquier build local, donde la
// variable no existe— sale con `Disallow: /`.
//
// La regla es a la inversa a propósito: si mañana falla la detección de la
// rama, el fallo deja el sitio sin indexar, que se arregla; lo contrario
// publica en Google una tarta con el precio entre corchetes, que ya no.
const CUERPO = {
  indexable: `User-agent: *
Allow: /
`,
  bloqueado: `# Rama de staging o preview: no es el sitio público.
User-agent: *
Disallow: /
`,
} as const;

export const GET: APIRoute = () => {
  const rama = process.env.CF_PAGES_BRANCH;
  const esProduccion = rama === RAMA_PRODUCCION;

  return new Response(esProduccion ? CUERPO.indexable : CUERPO.bloqueado, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
