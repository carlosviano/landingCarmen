import { defineMiddleware } from "astro:middleware";
import { modoProximamente } from "@/lib/proximamente";

// Con el modo "próximamente" activo, TODAS las rutas se construyen con el
// contenido de /proximamente: la portada, /catalogo y cada ficha. No basta con
// cambiar la portada, porque /catalogo seguiría publicada para quien tenga el
// enlace (o para Google), con los precios entre corchetes.
//
// Es un rewrite y no una redirección: la URL no cambia, así que un enlace a
// una ficha que alguien guarde hoy sigue valiendo el día que se abra.
//
// El middleware corre en el build para las páginas estáticas, así que esto no
// cuesta nada en tiempo de ejecución: lo que se sube a Cloudflare ya son los
// HTML de "próximamente".
const RUTA = "/proximamente";

// robots.txt no se toca: sigue decidiendo por rama él solo.
const SIN_TOCAR = new Set([RUTA, "/robots.txt"]);

export const onRequest = defineMiddleware((context, next) => {
  const ruta = context.url.pathname.replace(/\/$/, "") || "/";
  if (!modoProximamente() || SIN_TOCAR.has(ruta)) return next();
  return next(RUTA);
});
