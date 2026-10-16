# 02-1 · Mapa, robots y «la de verdad»

- **Spec:** [02, SEO técnico base](../specs/02-seo-tecnico-base.md), paso 1
- **Fecha:** 2026-10-16
- **Commit:** `a8ed06d`, en la rama `feat/seo-tecnico-base`

Palabras que conviene tener claras antes (están en el
[glosario](glosario.md)): URL, dominio, rastrear, indexar, sitemap,
robots.txt, canonical, staging.

## En una frase

Le hemos dado a Google **un mapa** con las páginas que queremos que
apunte, le hemos dicho **dónde está ese mapa**, y cada página le dice
ahora **cuál es su dirección buena**.

## El problema que había

Imagina que Google es un cartero nuevo que tiene que apuntarse todas las
casas de un barrio. Antes de este cambio, con la web de Carmen le pasaban
tres cosas:

1. **No tenía mapa.** Tenía que ir puerta por puerta siguiendo los
   enlaces. Lo acabaría encontrando todo, pero más despacio y con riesgo de
   saltarse alguna.
2. **En la puerta no había cartel que dijera dónde estaba el mapa** (el
   robots.txt solo decía «se puede pasar»).
3. **La misma casa tenía varias direcciones.** La misma página se podía
   abrir desde `estimadacarmela.com`, desde la copia de staging y desde la
   dirección de Cloudflare que acaba en `.pages.dev`. El cartero veía tres
   casas iguales y no sabía cuál apuntar. Cuando Google duda así, a veces
   reparte la importancia entre las copias y ninguna sale tan arriba como
   debería.

## Lo que se ha hecho

### 1. Decirle a la web cuál es su dominio

Primero había que apuntar en algún sitio que la dirección buena de la web
es `https://estimadacarmela.com`. Se hace una sola vez, en el archivo de
configuración de la web (`astro.config.mjs`), y de ahí lo leen las otras
tres piezas:

```js
// El dominio canónico, sin www (www hace una 301 hacia él). De aquí salen
// el sitemap, el canonical del Layout y la línea Sitemap: de robots.txt.
site: "https://estimadacarmela.com",
```

- `site:` significa «el sitio es…». Lo de entre comillas es el dominio.
- Va **sin `www`**. Si alguien escribe `www.estimadacarmela.com`, Cloudflare
  ya le manda a la versión sin `www` (eso ya estaba hecho). Hay que elegir
  una y usar siempre la misma: se eligió sin `www` porque es más corta.

¿Por qué en un solo sitio? Porque si mañana cambiara el dominio, se
cambia esta línea y todo lo demás se arregla solo. Si estuviera escrito en
diez sitios, seguro que se olvidaría alguno.

### 2. El mapa (sitemap)

No se escribe a mano. Se ha instalado un complemento de Astro,
`@astrojs/sitemap`, que en cada build mira todas las páginas que ha
fabricado y escribe la lista solo. Así, cuando Carmen añada una tarta
nueva, la tarta entra en el mapa sin que nadie se acuerde de hacerlo.

Pero **no todas las páginas tienen que estar en el mapa**. Hay algunas que
existen y no queremos que Google enseñe:

| Página | Por qué fuera |
|---|---|
| `/proximamente/` | Era la pantalla de «abrimos pronto». Ya no se usa |
| `/catalogo/carta/` | Es la versión para imprimir la carta en PDF. Para la gente ya está el PDF |
| Los cuatro textos legales | Les faltan datos de Carmen (están con corchetes). Cuando estén, entran solos |
| La página de error (404) | La que sale cuando una dirección no existe. El complemento ya la quita solo |

Eso se le dice al complemento con un **filtro**: una lista de lo que se
queda fuera.

```js
const FUERA_DEL_SITEMAP = new Set([
  "/proximamente/",
  "/catalogo/carta/",
  ...(LEGALES_PUBLICADOS
    ? []
    : ["/aviso-legal/", "/condiciones/", "/privacidad/", "/cookies/"]),
]);
```

Leído en castellano:

- `FUERA_DEL_SITEMAP` es el nombre de la lista. Un `Set` es una lista en
  la que es muy rápido preguntar «¿está esto dentro?».
- Las dos primeras líneas son las que están fuera siempre.
- Lo de los legales se lee como una pregunta: «¿están publicados los
  legales (`LEGALES_PUBLICADOS`)? Si sí (`?`), no añadas nada (`[]`). Si no
  (`:`), añade los cuatro».

`LEGALES_PUBLICADOS` es un interruptor que ya existía en la web
(`src/config/site.ts`) y vale `false` (apagado). Es el mismo que esconde
los enlaces a los legales en el pie de la web. Al usar **el mismo
interruptor**, el día que se encienda los legales aparecen a la vez en el
pie y en el mapa, y no puede pasar que salgan en uno y no en el otro.

Y luego se le pasa el filtro al complemento:

```js
sitemap({
  filter: (url) => !FUERA_DEL_SITEMAP.has(new URL(url).pathname),
}),
```

«Para cada dirección (`url`), quédate con ella si **no** (`!`) está en la
lista de fuera». `pathname` es el trozo de la URL después del dominio
(`/catalogo/carta/`), que es lo que hay en la lista.

**Lo que sale.** Un archivo `sitemap-index.xml`, que es un índice que
apunta a `sitemap-0.xml`, que tiene la lista de verdad. Con la web de hoy
son 11 páginas:

```
https://estimadacarmela.com/
https://estimadacarmela.com/catalogo/
https://estimadacarmela.com/catalogo/choux-de-avellana/
https://estimadacarmela.com/catalogo/galleta/
https://estimadacarmela.com/catalogo/limon-y-merengue/
https://estimadacarmela.com/catalogo/nueces-de-macadamia/
https://estimadacarmela.com/catalogo/pavlova-de-melocoton/
https://estimadacarmela.com/catalogo/tarta-de-la-abuela/
https://estimadacarmela.com/catalogo/tartaleta-de-chocolate/
https://estimadacarmela.com/eventos/
https://estimadacarmela.com/personalizadas/
```

¿Por qué un índice y luego la lista, y no la lista directamente? Porque un
mapa tiene un máximo de 50.000 direcciones; si hubiera más, el complemento
haría `sitemap-1.xml`, `sitemap-2.xml`… y el índice las apuntaría todas.
Aquí sobra con uno, pero el formato es el estándar y a Google le da igual.

### 3. El cartel de la puerta (robots.txt)

El robots.txt de la web ya existía, y era listo: **cambia según quién lo
fabrique**.

- En la web de verdad (rama `main`) dice «se puede pasar».
- En staging, en las pruebas y en el ordenador de quien programa dice
  «prohibido el paso», para que Google no apunte la copia de pruebas.

Se ha hecho así a propósito: si algún día falla la forma de saber cuál es
la web de verdad, la web queda cerrada a Google (un problema que se nota y
se arregla), en vez de quedar abierta la de pruebas (un problema que no se
nota y que Google ya ha apuntado).

Lo único que se ha cambiado es añadir la línea del mapa en la versión de
la web de verdad:

```diff
   indexable: `User-agent: *
 Allow: /
+
+Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE)}
 `,
```

- `User-agent: *`: «esto vale para todos los robots» (`*` significa
  «cualquiera»).
- `Allow: /`: «podéis entrar en todo» (`/` es la web entera).
- `Sitemap: …`: «el mapa está aquí». El trozo `${…}` no es texto: es una
  instrucción que junta el dominio de la web (`import.meta.env.SITE`, el
  `site` del punto 1) con el nombre del archivo del mapa.

Lo que lee Google en la web de verdad:

```
User-agent: *
Allow: /

Sitemap: https://estimadacarmela.com/sitemap-index.xml
```

La versión de staging no se ha tocado: sigue diciendo `Disallow: /`
(«prohibido el paso») y sin mapa. No tendría sentido darle un mapa a quien
no puede entrar.

### 4. La dirección buena de cada página (canonical)

Todas las páginas de la web se fabrican sobre una plantilla común, el
**Layout** (`src/layouts/Layout.astro`): es como el papel con membrete
sobre el que se escriben todas las cartas. Lo que se pone en el Layout
sale en todas las páginas. Ahí se ha añadido el canonical:

```astro
// Siempre al dominio, aunque se sirva desde staging o desde *.pages.dev: así
// Google no cuenta esas copias como páginas aparte.
const urlCanonica = new URL(Astro.url.pathname, Astro.site);
```

```astro
{canonica && <link rel="canonical" href={urlCanonica} />}
```

- `Astro.url.pathname` es el camino de la página que se está fabricando
  (por ejemplo `/catalogo/galleta/`).
- `Astro.site` es el dominio del punto 1.
- `new URL(camino, dominio)` los junta: `https://estimadacarmela.com/catalogo/galleta/`.
- `<link rel="canonical" href="…">` es la etiqueta en sí. `rel` dice qué
  tipo de enlace es («canonical», el bueno) y `href` a dónde apunta.

El truco está en que el dominio va **escrito a fuego**. La página de la
galleta, la abras desde donde la abras (`estimadacarmela.com`, staging,
`.pages.dev`), lleva dentro la misma frase: «mi dirección buena es
`https://estimadacarmela.com/catalogo/galleta/`». Así, si Google se
encuentra una copia, sabe a cuál pertenece.

La etiqueta no se ve en la pantalla. Va en la cabeza de la página (el
`<head>`), que es la parte que el navegador lee pero no pinta. Se puede ver
en el navegador con clic derecho → «Ver código fuente».

**La excepción: la página de error.** `canonica &&` significa «pon la
etiqueta solo si `canonica` está encendido». Está encendido para todas
salvo para la página de «no existe» (404), que lo apaga:

```diff
-<Layout titulo={N.titulo} bienvenida={false}>
+<Layout titulo={N.titulo} bienvenida={false} canonica={false}>
```

¿Por qué? La página de error sale cuando alguien escribe una dirección que
no existe, la que sea. No tiene una dirección buena propia; ponerle una
sería decirle a Google «esta página de error es una página de verdad que
se llama `/404`», que es justo lo contrario de lo que es.

## Cómo se ha comprobado

Antes de guardar el cambio se fabricó la web y se miró lo que salía:

- `npm run check` (busca errores en el código): 0 errores, 0 avisos.
- `npm run build` (fabrica la web): termina bien y avisa de que ha creado
  el mapa.
- El mapa lleva las 11 páginas de arriba y ninguna de las que van fuera.
  Todas acaban en `/` (luego, en la nota del paso 2, se explica por qué
  importa).
- La portada, el catálogo, la galleta, eventos, próximamente y un legal
  llevan su canonical bien puesto; la página de error no lleva.
- El robots.txt: fabricado en el ordenador sale «prohibido el paso» (lo
  esperado: el ordenador no es la web de verdad). Se fabricó otra vez
  haciéndose pasar por la web de verdad y salió con `Allow: /` y la línea
  del mapa.

## Lo que este paso NO arregla todavía

- **Los enlaces internos sin barra final.** Varios botones de la web
  llevan a `/catalogo` en vez de a `/catalogo/`, y eso hace un salto de
  redirección cada vez. Es el paso 2.
- **La copia de `.pages.dev` sigue abierta.** El canonical ya le dice a
  Google que no es la buena, pero el canonical es una **sugerencia**: Google
  suele hacerle caso, no siempre. En el paso 5 se añade una redirección
  301, que es una **orden**: quien entre por `.pages.dev` acaba en
  `estimadacarmela.com` sí o sí.
- **Google aún no sabe que el mapa existe.** Lo encontrará solo en el
  robots.txt, pero en la spec 04 se le entrega en mano, en Search Console
  (el panel de Google para dueños de webs), y desde ahí se ve qué páginas
  ha apuntado y cuáles no.
- **Nada de esto se ve en la web de verdad hasta que se publique** (paso
  6: primero a staging para revisarlo, luego a `main`).
