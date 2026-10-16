# Spec 02: SEO técnico base en la web

- **Estado:** en curso
- **Quién:** asistente o Carlos (código); Carlos (panel de Cloudflare)
- **Depende de:** spec 00

## Objetivo

Que Google y Bing tengan una sola versión de cada página:
`https://estimadacarmela.com/...`, con barra final, con canonical y con un
sitemap que solo lista lo indexable. Y que el título y la descripción de cada
página digan qué es y dónde está.

## Contexto / por qué

Situación de partida, comprobada el 2026-10-15 con curl y leyendo el código:

- `astro.config.mjs` no tiene `site` ni sitemap
  (`/sitemap-index.xml` da 404).
- `src/pages/robots.txt.ts` sirve `Allow: /` en `main`, sin línea
  `Sitemap:`.
- `Layout.astro` no tiene canonical. El `<title>` es
  `titulo · Estimada Carmela`, y la portada sale con «Estimada Carmela» como
  título y como description.
- Cloudflare sirve las páginas con barra final (`/catalogo/`): sin barra
  hace un **308**. Varios enlaces internos van sin barra
  (`SERVICIOS.*.ruta` en `site.ts`, `TarjetaTarta.astro`,
  `[tarta].astro`, `Pedido.astro` y `MarcoSolicitud.astro`), así que cada
  clic da un salto de redirección.
- `www` → dominio sin www: ya hace una 301. El `<proyecto>.pages.dev` de
  producción sirve la misma web sin redirigir (contenido duplicado).
- `DIRECCION.portal` dice «Primera planta» y le falta «, local 7» (lo pide
  la spec 01).

## Decisiones

- 2026-10-15. Dominio canónico: `https://estimadacarmela.com`, sin www.
- 2026-10-15. Las URLs canónicas llevan barra final, que es lo que sirve
  Cloudflare con `build.format: "directory"`, el formato por defecto. No se
  cambia el formato del build: se ponen barras en los enlaces internos.
- 2026-10-15. Fuera del sitemap: `/404`, `/proximamente`, `/catalogo/carta`
  y los cuatro legales mientras `LEGALES_PUBLICADOS` sea `false`. El filtro
  lee esa constante de `site.ts`, así que los legales entran solos al
  publicarlos.
- 2026-10-15. Para `*.pages.dev` se usan **las dos cosas**: canonical al
  dominio (sale gratis del Layout) y una 301 con Bulk Redirects de Cloudflare.
  La 301 solo para el host de producción; staging y las previews siguen como
  están.

## Pasos

- [x] 1. `site` + `@astrojs/sitemap` con filtro, canonical en el Layout y
      `Sitemap:` en robots.txt.
- [x] 2. Enlaces internos con barra final.
- [x] 3. `DIRECCION.portal` → «Primera planta, local 7». Quitar el `TODO`
      de las coordenadas. Regenerar el PDF de la carta si cambia la dirección
      que sale en él.
- [ ] 4. Títulos y descripciones nuevos para cada página indexable.
- [ ] 5. 301 de `<proyecto>.pages.dev` → `https://estimadacarmela.com` con
      Bulk Redirects (panel de Cloudflare, con aprobación de Carlos).
- [ ] 6. PR a `staging`, revisión, y de ahí a `main`.

## Notas de implementación

- **Paso 1.**
  - `npm i @astrojs/sitemap`.
  - En `astro.config.mjs`: `site: "https://estimadacarmela.com"` y
    `sitemap({ filter })`. El filtro compara `new URL(url).pathname` con
    una lista que lleva `/proximamente/` y `/catalogo/carta/`, y además los
    cuatro legales si `LEGALES_PUBLICADOS` (importado de
    `./src/config/site.ts`) es `false`.
  - En `Layout.astro`:
    `const canonica = new URL(Astro.url.pathname, Astro.site)` y
    `<link rel="canonical" href={canonica} />` junto a la description.
  - En `robots.txt.ts`: el cuerpo indexable añade
    `Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE)}`.
- **Paso 2.** Buscar `href` y `ruta` internos sin barra final, p. ej. con
  `grep -rnoE 'href=\{?["`]/[a-z][^"`#]*["`]' src`. No se tocan los
  archivos con extensión (favicon, PDF).
- **Comprobar en `dist/`:**
  - `sitemap-0.xml` solo lleva URLs indexables, todas con barra final.
  - `catalogo/galleta/index.html` tiene el canonical al dominio.
  - `robots.txt` sale con `Disallow: /`. Es lo esperado: en local no existe
    `CF_PAGES_BRANCH`.

## Criterios de aceptación

- [ ] `https://estimadacarmela.com/sitemap-index.xml` responde 200 y lista
      solo páginas indexables, todas con barra final.
- [ ] `https://estimadacarmela.com/robots.txt` incluye
      `Sitemap: https://estimadacarmela.com/sitemap-index.xml`; staging sigue
      con `Disallow: /`.
- [ ] Cada página indexable lleva
      `<link rel="canonical" href="https://estimadacarmela.com/.../">`.
- [ ] Ningún enlace interno da 308.
- [ ] `curl -I https://<proyecto>.pages.dev/catalogo/` → 301 a
      `https://estimadacarmela.com/catalogo/`.
- [ ] `npm run check` y `npm run build` limpios.

## Registro

- 2026-10-15. Spec creada con lo que había al empezar (ver Contexto).
- 2026-10-16. Paso 1 hecho en `feat/seo-tecnico-base` (`a8ed06d`). Además
  de lo previsto, el Layout tiene una prop `canonica` (por defecto `true`)
  y el 404 la apaga, para no publicar un canonical a `/404`. Comprobado en
  `dist/`: sitemap con 11 URLs, todas con barra; canonical bien en las
  páginas; `robots.txt` con `Sitemap:` en un build con
  `CF_PAGES_BRANCH=main`. Nota: [02-1](../notes/02-1-sitemap-canonical-robots.md).
- 2026-10-16. Paso 2 hecho. `SERVICIOS.*.ruta` y `LEGAL` en `site.ts`, los
  `href` de `config/legal/`, `TarjetaTarta`, `[tarta].astro`, `Pedido`,
  `MarcoSolicitud` y `Alergenos` (`/condiciones/#alergenos`). En `dist/`
  ya solo quedan sin barra los archivos (favicon, CSS, fuentes, PDF). Las
  comparaciones de ruta (`middleware.ts`, `AvisoCarga`, el `<head>` del
  Layout) ya quitaban la barra final, así que no cambian. El build avisa de
  que el PDF de la carta está desactualizado porque `site.ts` entra en la
  huella; el PDF no imprime rutas, así que se regenera en el paso 3 con la
  dirección. Nota: [02-2](../notes/02-2-enlaces-con-barra.md).
- 2026-10-16. Paso 3 hecho. `DIRECCION.portal` = «Primera planta, local 7»
  (sale en el pie, el panel móvil, Contacto, aviso legal y condiciones);
  `TODO` de las coordenadas quitado. La carta no imprime el portal, pero
  `site.ts` entra en la huella: PDF regenerado (mismo tamaño) y huella
  `29062bd6f800bed5`. El primer `npm run carta` falló por tiempo esperando
  las fuentes; al repetirlo salió. Nota: [02-3](../notes/02-3-direccion-local-7.md).
