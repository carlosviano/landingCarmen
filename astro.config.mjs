// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { cartaAlDia } from "./scripts/huella-carta.mjs";

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

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), avisoCartaPdf],

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

  vite: {
    plugins: [tailwindcss()],
  },
});
