## Node

El proyecto exige Node >= 22.12 (Astro 7). La versión está fijada en `.nvmrc`:

```
nvm use
```

Sin esto Astro se niega a arrancar con un error seco de versión.

## Development

```
npm run dev
```

El script (`package.json`) sourcea nvm, hace `nvm use` para leer el `.nvmrc` y
solo entonces arranca `astro dev`. Así `npm run dev` corre siempre con la versión
de Node de este proyecto sin depender de que hayas hecho `nvm use` a mano ni de
ningún hook global del shell. `npm run build` y `npm run preview` hacen lo mismo.

Requiere tener `nvm` instalado (respeta `$NVM_DIR`, con fallback a `~/.nvm`). Si
falta la versión del `.nvmrc`, instálala con `nvm install` dentro de la carpeta.

Ojo: el dev server no recoge cambios de `astro.config.mjs` en caliente. Si
tocas la config, reinícialo.

### El build de CI: `build:ci`

Hay dos scripts de build y no son intercambiables:

| Script             | Comando             | Quién lo usa     |
| ------------------ | ------------------- | ---------------- |
| `npm run build`    | nvm + `astro build` | Tú, en local     |
| `npm run build:ci` | `astro build`       | Cloudflare Pages |

`build:ci` existe porque en el runner de Cloudflare **no hay nvm**: el
`source .../nvm.sh` del script local falla y se lleva el build por delante. Así
que `build:ci` llama a `astro build` directamente, sin envoltorio.

Eso no se salta el requisito de versión de Node, solo lo resuelve en otro
sitio: Cloudflare Pages lee el `.nvmrc` del repo y arranca el contenedor con
esa versión ya puesta, así que cuando corre `build:ci` el Node correcto es el
que hay. En local ese trabajo lo hace `nvm use`, y por eso el script local
sigue sourceando nvm: es intencionado, no un resto.

Regla práctica: **en local usa siempre `npm run build`**. `build:ci` sin `nvm
use` delante corre con el Node que tengas suelto en el shell, que puede ser
más viejo que el `.nvmrc` y reventar con el error de versión de Astro.

El montaje de Cloudflare (ramas, entornos, robots.txt por rama) está en el
README.

### Comprobar y formatear

```
npm run check         # astro check: tipos de .ts y .astro
npm run format        # prettier --write, con los plugins de Astro y Tailwind
npm run format:check  # lo mismo, sin escribir
```

Prettier ordena también las clases de Tailwind (lee `src/styles/global.css`
para conocer las utilidades propias). Los `.md` quedan fuera.

## Datos y código

- Los textos y datos viven en `src/config/`, un archivo por página o sección
  (`site.ts` es lo global). Sin `index.ts` que lo reexporte todo: el
  `<script>` de Pedido importa `config/pedido.ts` y se manda al navegador.
- Lógica pura en `src/lib/`. `lib/tartas.ts` es sólo de servidor (importa
  imágenes); lo que necesita también el navegador va en `lib/pedido.ts`.
- Componentes por dominio en `src/components/<dominio>/`.
- Fotos con `Foto.astro` (AVIF con webp de respaldo), nunca con el `<Image>`
  de Astro directamente. Ver `src/assets/README.md`.

## Tipografía

Dos fuentes: **The Seasons** (titulares, desde Adobe Fonts por `<link>` en el
Layout) y **Karla** (todo lo demás, por la API de fuentes de Astro). Ninguna
otra: `global.css` borra las pilas de Tailwind con `--font-*: initial`, así
que `font-serif` y `font-mono` no existen.

Para texto nuevo usa los papeles de `global.css` en vez de combinar clases:

| Papel        | Para qué                               | Fuente / peso               |
| ------------ | -------------------------------------- | --------------------------- |
| `titular`    | h1                                     | The Seasons 300             |
| `titulo`     | h2, h3, nombres de tarta, marca        | The Seasons 400             |
| `antetitulo` | línea sobre un titular                 | Karla 600, xs, 0.25em, MAY. |
| `leyenda`    | etiquetas dentro de una pieza          | Karla 600, 10px, 0.3em, MAY.|
| `dato`       | metadatos en línea                     | Karla 400, 0.18em, MAY.     |
| `accion`     | botones, navegación, chips             | Karla 500, 0.1em, MAY.      |

El texto corrido no lleva clase: `html` ya va en Karla 400. Nunca cursiva
de The Seasons (la i parece acentuada) ni negrita.

El detalle, la licencia de Adobe y qué pasa si se cae el kit: README,
«Tipografía».

## Hero

Toda página que abra con un hero lo monta dentro de `src/components/Hero.astro`
(portada y /eventos ya lo hacen). El componente es el MARCO, no el diseño: fija
las proporciones —en todos los tamaños, móvil primero (referencia: iPhone 14
Pro Max, 430×932), banda y franja llenan la pantalla bajo la cabecera; la
franja mide `lg:h-20` (`py-6` en móvil) y su contenido va en la retícula de
`max-w-7xl px-6`— y deja a cada página el fondo (`claseBanda`, `claseFranja`)
y lo que va dentro: la banda por el slot por defecto, la franja por
`slot="franja"` y lo que tenga que pintarse a todo el ancho de la franja (unas
ondas) por `slot="fondo-franja"`. No le pongas alturas propias a un hero desde
fuera: si las proporciones tienen que cambiar, cambian en el componente y para
todas las páginas.

## Animaciones de entrada

Lo que tenga que aparecer al hacer scroll lleva `data-revelar` (sube y se
funde), `data-revelar="foto"` en el contenedor de una foto (cortina) o, en un
titular, `<TextoRevelado texto={...} />` dentro del h1/h2 (palabra a palabra).
Sin librerías: `lib/revelar.ts` decide cuándo y `global.css` («Animaciones de
entrada») el cómo. Una foto que pueda estar en pantalla al cargar (heros, las
tarjetas de /catalogo) va con `data-revelar="zoom"`, nunca con cortina: es el
LCP y la cortina lo retrasa hasta 2s. No se animan formularios, cabecera ni
páginas legales.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
