# Fuentes

Carpeta vacía a propósito. **Ahora mismo el sitio no carga ninguna fuente
propia**: los titulares y la marca van con `font-serif`, la pila serif por
defecto de Tailwind. La decisión de tipografía está pendiente.

Cuando haya una elegida, aquí van los ficheros que Astro procesa (nunca en
`public/`: desde ahí Astro los copiaría al build además de procesarlos y
quedarían duplicados) y se reactiva el bloque `fonts` del apartado final.

## Estado de "The Seasons"

Fuente comercial de **My Creative Land** (© The Type Founders). Se vende en tres
licencias independientes:

| Licencia | Para qué | ¿Nos sirve? |
|---|---|---|
| Desktop | instalar la fuente, crear logos/imágenes/PDF | no |
| **Web** | alojarla en el sitio y pintar texto vivo con `@font-face` | **sí, es la que hace falta** |
| App | empotrarla en una app móvil | no |

La Web es una suscripción anual por tramos de páginas vistas al mes (el más bajo
son 10.000). Estilos sueltos desde ~$30; familia completa (10 estilos, Thin a
Extra Bold con cursivas) desde ~$198.
Tienda: https://store.typenetwork.com/foundry/mycreativeland/fonts/the-seasons

**Canva no cuenta.** Tener la fuente en Canva, sea de su biblioteca o subida al
Brand Kit, sólo autoriza a usarla *dentro* de Canva o en lo que se exporte de
Canva; no da derecho a servir el fichero desde este sitio, y Canva no permite
descargar los ficheros de su biblioteca. Sin licencia Web, la vía limpia es
exportar el rótulo desde Canva como imagen/SVG y usarlo de logo, no como texto.

## Alternativas sin licencia

Serif de alto contraste parecidas, gratis y servidas por Astro sin ficheros:
`Prata`, `Playfair Display`, `Bodoni Moda`, `Cormorant Garamond` (Light),
`Italiana`. Se usan cambiando `fontProviders.local()` por
`fontProviders.google()` y el `name`.

## Cómo volver a activarlo

Estaba montado y probado; se quitó sólo porque un corte declarado sin fichero
rompe el arranque (`UnknownFilesystemError` / `ENOENT`). Para recuperarlo:

**1.** Copia los `.woff2` aquí. Convierte los `.otf`/`.ttf` originales con
`npx woff2 TheSeasons-Regular.otf` (woff2 pesa un 30–50 % menos y lo soportan
todos los navegadores vivos). Un corte por fichero, y sólo los que se usen de
verdad: cada uno es una descarga extra para el visitante.

**2.** `astro.config.mjs`, importando `fontProviders` de `astro/config`:

```js
fonts: [
  {
    name: 'The Seasons',
    cssVariable: '--font-the-seasons',
    provider: fontProviders.local(),
    // Astro mide la fuente y genera un fallback de sistema ajustado a sus
    // métricas (optimizedFallbacks, activo por defecto): no salta el layout.
    fallbacks: ['Georgia', 'serif'],
    options: {
      variants: [
        // Una entrada por corte; declarar uno sin fichero rompe el arranque.
        { weight: 400, style: 'normal', src: ['./src/assets/fonts/TheSeasons-Regular.woff2'] },
        // { weight: 300, style: 'normal', src: ['./src/assets/fonts/TheSeasons-Light.woff2'] },
        // { weight: 400, style: 'italic', src: ['./src/assets/fonts/TheSeasons-Italic.woff2'] },
        // { weight: 700, style: 'normal', src: ['./src/assets/fonts/TheSeasons-Bold.woff2'] },
      ],
    },
  },
],
```

**3.** `src/layouts/Layout.astro`, en el `<head>` — inyecta los `@font-face` y
el `preload`:

```astro
import { Font } from "astro:assets";
...
<Font cssVariable="--font-the-seasons" preload />
```

**4.** `src/styles/global.css` — expone la variable como utilidad de Tailwind.
El `inline` es el patrón recomendado cuando el valor viene de una variable
definida fuera del tema:

```css
@theme inline {
  --font-display: var(--font-the-seasons);
}
```

**5.** Cambia `font-serif ... italic` por `font-display` donde toque
(`src/components/header/Brand.astro`). Sin cursiva mientras no se cargue el
corte italic real: el navegador la falsearía inclinando el regular.

Reinicia el dev server: no recoge cambios de `astro.config.mjs` en caliente.
