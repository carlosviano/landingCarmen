// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],

  // Prata: la alternativa libre a The Seasons que ya estaba elegida en
  // src/assets/fonts/README.md. Serif de alto contraste, un solo corte (400).
  // Astro la descarga en el build y la sirve desde el propio sitio, así que no
  // hay petición a Google en tiempo de ejecución.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Prata',
      cssVariable: '--font-prata',
      weights: [400],
      subsets: ['latin', 'latin-ext'],
      // Astro mide la fuente y ajusta el respaldo a sus métricas, así que al
      // cargar no salta el layout.
      fallbacks: ['Georgia', 'serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
