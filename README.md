# Estimada Carmela

Landing estática del obrador de tartas **Estimada Carmela** (Málaga), hecha con
[Astro](https://astro.build) 7 y Tailwind 4.

Convenciones de código, tipografía y notas de desarrollo: **[AGENTS.md](./AGENTS.md)**.

## Requisitos

Node **>= 22.12** (lo exige Astro 7). La versión está fijada en `.nvmrc`:

```sh
nvm use
npm install
```

## Comandos

| Comando            | Qué hace                                        |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Dev server en `localhost:4321`                  |
| `npm run build`    | Build local a `./dist/` (pasa por `nvm use`)    |
| `npm run build:ci` | Build sin nvm. **Lo usa Cloudflare, no tú**     |
| `npm run preview`  | Sirve `./dist/` para verlo antes de publicar    |

La diferencia entre `build` y `build:ci` está explicada en
[AGENTS.md](./AGENTS.md#el-build-de-ci-buildci). Resumen: en local nvm fija la
versión de Node; en Cloudflare la fija el `.nvmrc` y el envoltorio de nvm
sobra, porque en ese runner nvm no existe.

## Despliegue

El hosting es **Cloudflare Pages**, con el repo de GitHub conectado: cada push
a una rama vigilada dispara un build y lo publica solo.

<details>
<summary>Por qué Cloudflare y no Netlify o Vercel</summary>

Este sitio va a llevar un CMS que publica al guardar, así que **cada cambio de
contenido es un deploy**. Eso descarta los planes gratuitos que cobran por
publicación:

- **Netlify**: el plan gratis son 300 créditos/mes y cada deploy de producción
  cuesta 15, o sea ~20 publicaciones al mes. Se agota en una tarde de
  correcciones.
- **Vercel**: el plan Hobby prohíbe el uso comercial, y esto es la web de un
  negocio.
- **Cloudflare Pages**: ancho de banda de assets estáticos ilimitado incluso en
  el plan gratis, y 500 builds/mes. Da margen de sobra.

Decisión tomada; no hace falta reabrirla.
</details>

### Los dos entornos

| Entorno    | Rama      | URL                                | Quién entra                  |
| ---------- | --------- | ---------------------------------- | ---------------------------- |
| Producción | `main`    | `<proyecto>.pages.dev` (+ dominio) | Todo el mundo                |
| Staging    | `staging` | `staging.<proyecto>.pages.dev`     | Carlos y la clienta          |

**La URL de staging es fija y no caduca.** Cloudflare crea un alias con el
nombre de la rama y lo reapunta al último commit de esa rama en cada build, así
que la clienta guarda ese enlace en favoritos una vez y siempre ve lo último.
Los nombres de rama se pasan a minúsculas y lo que no sea alfanumérico se
convierte en guion (`feat/algo` → `feat-algo.<proyecto>.pages.dev`).

Además de esas dos, **cada rama que se sube genera su propia preview** con URL
propia (`<hash>.<proyecto>.pages.dev`), que sirve para revisar un PR concreto.

### Configuración del panel

Estos son los valores con los que está dado de alta el proyecto. Se configuran
en el panel de Cloudflare, no viven en el repo:

| Ajuste              | Valor              |
| ------------------- | ------------------ |
| Framework preset    | Astro              |
| Build command       | `npm run build:ci` |
| Build output directory | `dist`          |
| Root directory      | *(vacío)*          |
| Production branch   | `main`             |

No hace falta fijar `NODE_VERSION` a mano: Pages lee el `.nvmrc`.

### Que staging y las previews no salgan en Google

Dos capas, y la que de verdad protege es la primera:

1. **Cloudflare Access sobre los preview deployments.** Por defecto las URL de
   preview de Pages son **públicas y permanentes**, y ahí es donde está el
   trabajo a medias: precios entre corchetes, `[PLAZO DE ANTELACIÓN]`, fotos de
   relleno. Con la access policy activada hay que autenticarse para entrar, así
   que ni un buscador ni nadie con el enlace lo ve. Cubre las previews y el
   alias de `staging`; **no** cubre `<proyecto>.pages.dev` ni el dominio
   propio, que son producción y tienen que ser públicos.

2. **`robots.txt` distinto según la rama**, generado en el build por
   [`src/pages/robots.txt.ts`](./src/pages/robots.txt.ts). Cloudflare inyecta
   `CF_PAGES_BRANCH` con el nombre de la rama que se despliega; el endpoint
   sirve `Allow: /` **solo** si esa rama es exactamente `main`, y `Disallow: /`
   en cualquier otro caso —staging, previews y builds locales, donde la
   variable no existe—.

   La regla va en negativo a propósito: si algún día falla la detección de la
   rama, el fallo deja el sitio sin indexar, y eso se arregla; lo contrario
   publica en Google una tarta con el precio entre corchetes, y eso ya no.

Se comprueba mirando `https://<url>/robots.txt` después de un deploy.

### Cabeceras

[`public/_headers`](./public/_headers) lleva las cabeceras de seguridad
básicas (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
y una CSP mínima). Pages copia ese fichero a la raíz del sitio y lo interpreta;
no llega al visitante. Es estático y no puede depender de la rama: lo que
cambia por entorno es el `robots.txt`.

El fichero explica por qué la CSP **no** trae `script-src` ni `style-src`
todavía, y qué hay que tocar para poder cerrarla.

## Flujo de trabajo

```
feat/lo-que-sea  →  PR a main  →  merge a staging  →  merge a main
     (preview)       (revisión)      (la clienta)      (publicado)
```

1. **Rama de trabajo** desde `main`: `git switch -c feat/lo-que-sea`. Al
   subirla, Cloudflare publica su preview y la deja como check en el PR.
2. **PR contra `main`** para revisar el código.
3. **A `staging`** cuando el cambio esté listo para que lo vea la clienta:
   `git switch staging && git merge feat/lo-que-sea && git push`. En un par de
   minutos su enlace de favoritos muestra lo nuevo.
4. **A `main`** cuando la clienta dé el visto bueno. Ese merge es la
   publicación.

`staging` es una rama de integración: recibe merges y nunca se rebasa. Si se va
de madre respecto a `main`, se rehace desde `main`.

### Volver atrás

Un deploy malo en producción se revierte desde el panel de Cloudflare
(**Deployments** → el deploy bueno → **Rollback**), que es instantáneo y no
necesita build. Después hay que arreglar `main` de verdad, porque el siguiente
push vuelve a publicar.
