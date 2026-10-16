// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { cartaAlDia } from "./scripts/huella-carta.mjs";
import { LEGALES_PUBLICADOS } from "./src/config/site.ts";

// La carta en PDF (public/carta-estimada-carmela.pdf) no se genera en el
// build: la imprime `npm run carta` en local (ver AGENTS.md, «La carta en
// PDF»). Esto solo avisa si las tartas, los precios o el contacto han
// cambiado desde la última vez. Avisa y no falla: un cambio de precio no
// puede dejar la web sin publicar.
/** @type {import("astro").AstroIntegration} */
const avisoCartaPdf = {
  name: "aviso-carta-pdf",
  hooks: {
    "astro:build:start": async ({ logger }) => {
      if (!(await cartaAlDia()))
        logger.warn(
          "La carta en PDF está desactualizada: genérala con `npm run carta`.",
        );
    },
  },
};

// Lo que existe pero no es para Google: la pantalla de espera, la carta de
// imprimir (el PDF ya está enlazado) y los legales mientras sigan con
// corchetes (llevan noindex; entran solos al publicarlos). El 404 lo deja
// fuera la propia integración.
const FUERA_DEL_SITEMAP = new Set([
  "/proximamente/",
  "/catalogo/carta/",
  ...(LEGALES_PUBLICADOS
    ? []
    : ["/aviso-legal/", "/condiciones/", "/privacidad/", "/cookies/"]),
]);

// https://astro.build/config
export default defineConfig({
  // El dominio canónico, sin www (www hace una 301 hacia él). De aquí salen
  // el sitemap, el canonical del Layout y la línea Sitemap: de robots.txt.
  site: "https://estimadacarmela.com",

  integrations: [
    icon(),
    avisoCartaPdf,
    sitemap({
      filter: (url) => !FUERA_DEL_SITEMAP.has(new URL(url).pathname),
    }),
  ],

  // La web usa DOS fuentes y solo dos (el sistema entero está en
  // src/styles/global.css, "Tipografía"):
  //
  //   The Seasons  titulares y marca. Llega de Adobe Fonts por <link> en el
  //                Layout, NO por aquí: Adobe no permite descargar los ficheros.
  //   Karla        todo lo demás. Esta sí la descarga Astro en el build y la
  //                sirve el propio sitio: no hay petición a Google en visita.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Karla",
      cssVariable: "--font-karla",
      // 400 texto, 500 botones y datos, 600 antetítulos y leyendas. La cursiva
      // solo la usa la ficha (lo que va "dentro" de la tarta). Declarar un
      // corte no lo descarga: el navegador solo baja los que pinta.
      weights: [400, 500, 600],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      // Astro mide la fuente y ajusta el respaldo a sus métricas, así que al
      // cargar no salta el layout.
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],

  env: {
    schema: {
      // La clave PÚBLICA del widget de Turnstile de los formularios. Se fija
      // por entorno en el panel de Pages, como variable del build. Sin ella
      // vale la de pruebas de Cloudflare, que siempre pasa: en local no hace
      // falta nada, y en Cloudflare la Function la rechaza, porque allí el
      // secreto es el de verdad. La secreta es TURNSTILE_SECRET, de la
      // Function (functions/api/solicitud/[tipo].ts).
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
        default: "1x00000000000000000000AA",
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    // zod lo importan los scripts de los formularios (src/lib/solicitud.ts) y
    // el escaneo de arranque de Vite no lo ve: lo descubría en la primera
    // página con formulario, reoptimizaba, y desde ahí la barra de desarrollo
    // de Astro pedía su script con el hash viejo (504 "Outdated Optimize Dep"
    // en consola, en todas las pantallas, hasta reiniciar). Declarado aquí se
    // optimiza al arrancar y no hay segunda pasada. Sólo afecta a `astro dev`.
    optimizeDeps: { include: ["zod"] },
  },
});
