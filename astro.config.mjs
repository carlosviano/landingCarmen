// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],

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
      name: 'Karla',
      cssVariable: '--font-karla',
      // 400 texto, 500 botones y datos, 600 antetítulos y leyendas. La cursiva
      // solo la usa la ficha (lo que va "dentro" de la tarta). Declarar un
      // corte no lo descarga: el navegador solo baja los que pinta.
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      // Astro mide la fuente y ajusta el respaldo a sus métricas, así que al
      // cargar no salta el layout.
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
