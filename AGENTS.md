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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
