import { PROXIMAMENTE } from "@/config/proximamente";

// Decide si este build publica la pantalla de "próximamente" en lugar de la
// web. Lo mismo que el robots.txt (src/pages/robots.txt.ts): Cloudflare Pages
// inyecta `CF_PAGES_BRANCH` en el build, el sitio es estático y esto se
// resuelve una vez al construir.
//
// Solo `main` la enseña. Staging, las previews de los PR y el local no tienen
// esa rama (o no tienen la variable), así que siguen viendo la web completa y
// el desarrollo no se entera de que existe.
//
// `PROXIMAMENTE=1` / `PROXIMAMENTE=0` en el entorno se salta la regla en los
// dos sentidos. Sirve para verlo en local tal como saldrá en producción:
//
//   PROXIMAMENTE=1 npm run dev
const RAMA_PRODUCCION = "main";

export function modoProximamente(): boolean {
  const forzado = process.env.PROXIMAMENTE;
  if (forzado === "1") return true;
  if (forzado === "0") return false;

  return (
    PROXIMAMENTE.enProduccion &&
    process.env.CF_PAGES_BRANCH === RAMA_PRODUCCION
  );
}
