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

### Pantalla de «próximamente»

Hasta la apertura, **producción no publica la web: publica una pantalla de
espera** (la cocinera montando el toldo, con la fecha de apertura). Todo lo
demás sigue igual: staging, las previews de los PR y el local ven la web
completa, así que el desarrollo sigue su curso y `main` puede recibir merges
sin que se vea nada a medias.

Cómo funciona, en tres piezas:

- [`src/lib/proximamente.ts`](./src/lib/proximamente.ts) decide si el build
  va en modo «próximamente». Lo mismo que el `robots.txt`: mira
  `CF_PAGES_BRANCH`, y solo `main` lo activa.
- [`src/middleware.ts`](./src/middleware.ts) reescribe **todas** las rutas
  (portada, `/catalogo`, cada ficha) con el contenido de `/proximamente`. Es un
  rewrite en el build, no una redirección: las URL no cambian y en Cloudflare
  solo hay HTML estático.
- [`src/pages/proximamente.astro`](./src/pages/proximamente.astro) es la
  pantalla. Fuera de producción vive en `/proximamente` con `noindex`, para
  enseñársela a la clienta en staging.

Para verla en local tal como saldrá en producción:

```sh
PROXIMAMENTE=1 npm run dev
```

**Abrir la web** es poner `PROXIMAMENTE.enProduccion` a `false` en
[`src/config/proximamente.ts`](./src/config/proximamente.ts) y seguir el flujo de siempre
(PR → staging → main). No se apaga sola el día de la fecha: el sitio es
estático y nadie lo reconstruye a medianoche.

## Textos legales

Cuatro páginas, una por texto, enlazadas en el pie:

| Página         | Qué es                                  | Texto                                                                    |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| `/aviso-legal` | Quién está detrás (art. 10 LSSI)        | [`avisoLegal.ts`](./src/config/legal/avisoLegal.ts)                      |
| `/condiciones` | Condiciones de venta (TRLGDCU)          | [`condiciones.ts`](./src/config/legal/condiciones.ts)                    |
| `/privacidad`  | Política de privacidad (RGPD, LOPDGDD)  | [`privacidad.ts`](./src/config/legal/privacidad.ts)                      |
| `/cookies`     | Lo que se guarda en el navegador        | [`cookies.ts`](./src/config/legal/cookies.ts)                            |

Los textos son datos y los pinta una sola plantilla,
[`PaginaLegal.astro`](./src/components/legal/PaginaLegal.astro). Los datos
de la titular (nombre, NIF, email, registro sanitario) se escriben una vez,
en `TITULAR` de [`src/config/site.ts`](./src/config/site.ts). La primera capa
de privacidad que va junto a los formularios (`AVISO_FORMULARIO`) vive en
`privacidad.ts`, al lado de la política completa, para que no se
contradigan.

**No se abre la web con un corchete en estos textos.** Lo que va entre
corchetes (`[NIF]`, `[FECHA]`…) es un dato que falta de la clienta. Para ver
lo que queda:

```sh
grep -rno "\[[A-ZÁÉÍÓÚÑ][^]]*\]" src/config/legal src/config/site.ts
```

Al cambiar lo que dice un texto, cambia también su `actualizado`.

Tres cosas que los textos dan por hechas y que hay que mantener ciertas:

- **No hay cookies ni analítica.** Por eso no hay banner. Si entra cualquier
  cosa que guarde datos en el navegador sin que la visitante lo pida
  (analítica con cookies, un vídeo incrustado, un píxel de redes), hacen
  falta un banner y reescribir `cookies.ts` *antes* de publicarlo. Web
  Analytics de Cloudflare está apagado.
- **Los formularios llegan al correo por Cloudflare.** Si se quitan o
  cambia el servicio, hay que tocar `privacidad.ts`.
- **Las fichas muestran los alérgenos.** Lo dicen las condiciones y lo exige
  el Reglamento (UE) 1169/2011 para la venta a distancia. Salen del campo
  `alergenos` de cada tarta (`src/config/catalogo.ts`), que es obligatorio.
  Los da Carmen a partir de sus recetas: una tarta nueva o una receta que
  cambia necesita que ella los confirme antes de publicarse.

Las fotos en las que se reconoce a alguien necesitan su autorización por
escrito: la plantilla está en
[`docs/legal/consentimiento-imagen.md`](./docs/legal/consentimiento-imagen.md).

## Tipografía

Dos fuentes y ninguna más. El sistema completo (qué papel va con qué peso y
por qué) está comentado en [`src/styles/global.css`](./src/styles/global.css),
«Tipografía».

| Fuente          | Para qué                                           | De dónde llega                           |
| --------------- | -------------------------------------------------- | ---------------------------------------- |
| **The Seasons** | titulares, nombres de tarta, marca, firma          | Adobe Fonts, `<link>` en el Layout        |
| **Karla**       | texto, botones, datos, antetítulos                 | API de fuentes de Astro (se autoaloja)    |

En los componentes no se combinan pesos y trackings sueltos: se usa el papel
(`titular`, `titulo`, `antetitulo`, `leyenda`, `dato`, `accion`), y el tamaño
y el color van aparte.

The Seasons se sirve desde un proyecto web de Adobe Fonts
(`use.typekit.net/gwa1cko.css`) de una cuenta de Creative Cloud que **no es
de la clienta**. Tres consecuencias:

- La fuente la sirve Adobe. No se puede descargar ni copiar a `src/assets`
  (sería self-hosting, que la licencia de Adobe Fonts no cubre).
- Si esa suscripción se cancela o se borra el proyecto, **todos los
  titulares de la web** caen a Georgia. Antes de abrir conviene que el
  proyecto pase a una cuenta de la clienta.
- Qué estilos llegan lo decide el proyecto de Adobe, no el repo. Hoy trae
  Light, Regular y Bold con sus cursivas; la web usa Light (300) y Regular
  (400), rectas. Si se quita alguno allí, el navegador tira del más cercano.

**Sin cursiva de The Seasons.** Dibuja el punto de la i como un trazo
inclinado que en castellano se lee como tilde: la marca salía «Estímada
Carmela». La cursiva de Karla sí se puede usar.
