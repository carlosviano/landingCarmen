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

## Tipografía

Sin fuente propia por ahora: los titulares y la marca van con `font-serif`, la
pila serif por defecto de Tailwind. La elección está pendiente.

Hubo un montaje con **The Seasons** usando la API de fuentes de Astro (`fonts`
en astro.config.mjs + `<Font>` en el Layout + `@theme inline` en global.css) y
se retiró: es comercial y requiere licencia Web, que no tenemos. Un corte
declarado sin su fichero rompe el arranque con `UnknownFilesystemError`.

`src/assets/fonts/README.md` tiene el detalle de licencias, alternativas
gratuitas y los cuatro pasos para volver a activarlo.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
