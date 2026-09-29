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
    // Fraunces y Karla: SOLO para la pantalla de "próximamente". Karla es el
    // texto; Fraunces es el respaldo del titular, que va en The Seasons desde
    // Adobe Fonts (ver src/pages/proximamente.astro). Solo las carga la página
    // que pone su <Font>, así que el resto del sitio no descarga nada de más.
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: ['300 600'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Karla',
      cssVariable: '--font-karla',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});
