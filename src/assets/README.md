# mapa-local.png

Captura estática del mapa del local. Sustituye al iframe de OpenStreetMap que
había antes, por tres motivos: el iframe secuestraba el scroll (bajar por la
página se convertía en un desplazamiento enorme del mapa, sobre todo en móvil),
obligaba a WebGL con su propio respaldo, y metía peticiones a terceros.

Nada de esto se descarga en tiempo de ejecución: la imagen se sirve desde el
propio sitio y Astro la optimiza en el build.

## Se pinta como fondo CSS, no como `<img>`

En `Contacto.astro` el mapa entra por `background-image` con `background-size:
cover`, a partir de dos tamaños generados con `getImage()`.

**Ojo: no es que el `<img>` estuviera roto.** Se llegó a esto persiguiendo una
franja blanca bajo el mapa que al final resultó ser **caché del navegador**. La
versión con `<img absolute inset-0 h-full>` no reprodujo el hueco en ninguno de
los navegadores que se probaron (Chromium 147 y 151, y Safari), ni siquiera
forzando la columna de texto a ser 300px más alta que el mapa.

Se mantiene el fondo porque `cover` cubre la caja sin depender de cómo se
resuelva una altura en porcentaje, que era la única parte frágil de la versión
con `<img>`. A cambio se pierde el `srcset`: de ahí los dos tamaños a mano (780
para móvil, 1300 para dos columnas y pantallas densas). Volver a `<Image>` es
una opción perfectamente legítima si se prefiere la entrega responsive completa.

## Licencia

Los datos son © colaboradores de OpenStreetMap, bajo ODbL. La atribución es
obligatoria y está puesta en la esquina del mapa, en `Contacto.astro`. Si algún
día se recorta esa esquina, hay que llevar el crédito a otro sitio visible.

Se lee gracias a un halo blanco por `text-shadow`, no a una caja de fondo. Con
fondo opaco parecía que la imagen no llegaba al borde de abajo: una esquina
blanca sobre el gris del mar se lee como un recorte, no como una etiqueta.

---

# sobre-mi.jpg

La foto del obrador de la sección "Sobre mí". 1066 × 1600 (2:3).

- en móvil se ve entera: el hueco lleva `aspect-[2/3]`, el mismo formato
- en escritorio manda la altura (`lg:h-[38rem]`) y `object-cover` recorta por
  los lados, así que el motivo tiene que aguantar un encuadre casi cuadrado
  centrado. Si se cambia por una foto con el sujeto descentrado, ajustar
  `object-center` en `SobreMi.astro`

Para sustituirla basta con sobrescribir el archivo con el mismo nombre y
extensión: `SobreMi.astro` la importa por ruta. Si cambia la extensión, hay que
cambiar también el import; y si la nueva es más ancha de 1066 px, subir el
array `widths` hasta su ancho real (Astro no reescala hacia arriba, así que
pedir más de lo que hay no da nitidez extra).

---

# Las fotos del carrusel

Quién entra y en qué orden se decide en `GALERIA`, dentro de `src/config/portada.ts`; el
componente es `src/sections/Galeria.astro`.

**Para añadir una: dejar el archivo aquí y poner su línea en `GALERIA`.** No
hace falta recortarla ni ajustarla al tamaño de las demás. Todas caen en el
mismo hueco 4:5 con `object-cover`, que las escala hasta llenarlo y recorta lo
que sobra por el lado largo, sin deformar nada.

Lo único que sí hay que mirar en la foto nueva:

- **el motivo tiene que estar centrado**, porque el recorte va desde el centro.
  Una foto con el sujeto pegado a un borde perderá justo ese borde. Si pasa,
  hay un `object-center` en `Galeria.astro` que se puede cambiar por
  `object-top` y compañía, pero es para todas a la vez, no por foto.
- **al menos 1000 px de ancho.** Es el mayor de los `widths` que pide el
  componente, y Astro no reescala hacia arriba: con una foto más pequeña no
  falla nada, simplemente se sirve lo que haya y se verá blanda en pantallas
  densas. Por encima de 1000 sobra: se descarta en el build.
- **el fondo se ve si la foto tiene transparencia.** `tarta_silueta_v2.png`
  la tiene en las esquinas, y por eso el hueco lleva `bg-taupe/15` debajo. Es
  también el color que se ve mientras la foto carga.

Dos que no están y no es olvido: `mapa-local.png` es la captura del mapa, no
una foto de producto; y `sobre-mi.jpg` es la misma que preside la sección de
justo encima, así que se ve dos veces en la misma pantalla. Está de relleno
para que la tira no se quede en dos fotos y debería salir en cuanto haya
material de verdad.

---

# Los escaparates de la portada

Dos secciones de la portada enseñan fotos sueltas elegidas a mano, no sacadas
de ninguna lista. Las dos se deciden en `src/config/portada.ts` y las resuelve
`fotoDe()`, así que una errata en el nombre revienta el build.

**El díptico de tartas** (`ESCAPARATE`, `src/sections/Catalogo.astro`). Dos
mitades a sangre, una por forma de encargar: la carta
(`tarta_cumple_kika_2026.jpeg`) y las personalizadas (`tarta-boda-nati.jpeg`).
Cada mitad se recorta con `object-cover` a un hueco casi cuadrado en escritorio
y apaisado en móvil, así que el motivo tiene que aguantar un recorte por arriba
y por abajo. Si no cae en el centro, se corrige con `enfoque` (un
`object-position`), no recortando el archivo.

Al cambiarlas: el botón va centrado sobre la foto, con un velo oscuro detrás.
Funciona mejor una foto con el motivo centrado y algo de fondo alrededor que
un primer plano que llene el cuadro, porque el botón taparía justo lo que se
quiere enseñar.

Pendiente: la pavlova no está en la carta. En cuanto haya una foto **con
fondo** de una tarta de la carta, va en la mitad de la carta (de Limón y
merengue solo hay el recorte sin fondo, que no aguanta un `object-cover`).

**La mesa de eventos** (`ESCAPARATE_EVENTOS`, `src/sections/Eventos.astro`).
Una foto a todo el ancho que en escritorio se recorta a 3:1. Ahora es
`mesa_cumple_nati.jpeg`, que es vertical, así que de ella solo se ve una
franja. Lo ideal es una foto **horizontal** de una mesa entera. Ojo: no puede
ser la misma que la del Hero, que va justo encima.

Todas pasan por `Foto.astro` (viven en `src/assets/`, no son URLs remotas),
así que el build les saca sus AVIF y webp y sus tamaños.

---

# Las imágenes del catálogo

Quién es cada una se decide en `CATALOGO`, dentro de `src/config/catalogo.ts`, con
el campo `archivo`. Las resuelve `fotoDe()` (`src/lib/fotos.ts`), que **revienta
el build** con la lista de lo que sí hay si el nombre no existe — así una
errata se ve en el momento y no como un hueco en la página.

**Ya no hay imágenes de banco.** Antes las ocho tiraban de Unsplash por URL.
Eso tenía dos problemas: no se podía juzgar el diseño con fotos que no eran de
Carmen, y la mitad de los nombres de la carta estaban escritos para que pegaran
con el stock que les tocaba. Al pasar a fotos propias, `mil-hojas-de-frambuesa`
se convirtió en `pavlova-de-melocoton`, que es lo que la foto enseña de verdad.

## `archivo: null` es un estado, no un error

Seis de las ocho no tienen foto todavía y llevan `archivo: null`. La rejilla y
la ficha pintan en su lugar un **marco de "FOTO PENDIENTE" marcado**, con el
tono alternando entre `taupe/15` y `sand/55` para que seis huecos no se lean
como seis errores idénticos.

Es deliberado que se vea. Un relleno de stock deja la página "llena" pero
esconde lo que falta; esto lo dice.

## Las dos que sí hay

| `archivo` | Quién es | Dónde sale |
|---|---|---|
| `tarta_silueta_v2.png` | Fresas y nata | Carta 01 |
| `tarta_cumple_kika_2026.jpeg` | Pavlova de melocotón | Carta 02, y el escaparate de la portada |

Las dos son de encargos concretos, así que el encuadre no coincide con el de
las demás. Llevan su `TODO`: cuando se haga la sesión, repetirlas con el mismo
encuadre que el resto.

## Cómo se hacen las que faltan

Fotografiar cada tarta **sobre fondo blanco liso y bien iluminada**, y dejar el
archivo aquí; luego poner su nombre en el `archivo` de su tarta y el marco de
"foto pendiente" desaparece solo.

Detalles que se notan en pantalla:

- **el encuadre tiene que ser parecido entre las ocho.** El hueco mide lo mismo
  para todas (`aspect-[4/5]`, `object-cover`), así que una foto muy apaisada y
  otra muy vertical se ven de tamaños distintos aunque ocupen el mismo sitio.
- **el motivo, centrado**, porque el recorte va desde el centro.
- **al menos 640 px de ancho** para la rejilla y 900 para la ficha: son los
  mayores `widths` que se piden, y Astro no reescala hacia arriba.
- **el fondo se ve si la foto tiene transparencia.** `tarta_silueta_v2.png` la
  tiene en las esquinas, y por eso el hueco lleva `bg-taupe/15` debajo. Es
  también el color que se ve mientras la foto carga.
- **la sombra la pone el CSS**, no hace falta que la foto la traiga pintada.

## Los recortes de la ficha (`*-ficha.png`)

La ficha anotada usa una foto SIN fondo (`recorte` de cada tarta), y las seis
comparten **el mismo lienzo: 1200×1040, transparente, con la tarta a todo el
ancho y centrada en alto**. Por eso todas salen del mismo tamaño y en la misma
caja, y por eso los `punto` en % de `catalogo.ts` se pueden comparar entre tartas.

Para una tarta nueva, desde su PNG sin fondo (en ángulo como las demás):

1. recortarlo pegado a la tarta (la caja de lo que no es transparente),
2. escalarlo a 1200 de ancho,
3. pegarlo centrado en alto en un lienzo transparente de 1200×1040.

Si la tarta es más alta que el lienzo (más de 1040 una vez a 1200 de ancho),
hay que subir el alto del lienzo de TODAS, no encoger esa: si no, vuelve a
salir de otro tamaño. Hoy la más alta es la pavlova, con 1032.

Con el lienzo hecho, los puntos se buscan sobre la foto con una rejilla en %,
con las reglas de `ComponenteTarta.punto`.

## Sí pasan por `Foto.astro`

Al vivir en `src/assets/` (y no ser URLs remotas), el build les saca sus AVIF
y webp en varios anchos: la pavlova baja de 112 kB a entre 17 y 64 kB según el
hueco, y menos en AVIF. Esta carpeta era antes la única parte del sitio que no
pasaba por el pipeline de imágenes de Astro; ya no lo es.

---

# AVIF con webp de respaldo: `src/components/Foto.astro`

Las fotos del sitio no usan el `<Image>` de Astro sino `Foto`, que es un
`<Picture>` con `formats={["avif", "webp"]}`: cada navegador coge el primero
que entiende. Astro no tiene un ajuste global para cambiar el formato de
`<Image>`, de ahí el componente. Admite los mismos props que `<Image>`.

Medido al cambiar (octubre de 2026), en bytes de imagen descargados por página:
entre un 34 y un 49 % menos (la carta, de 570 a 289 kB en móvil). A ojo, en
recortes al 100 %, no se distingue del webp.

Dos detalles:

- el `<picture>` va con `display: contents`, así que no pinta caja y el `<img>`
  se coloca igual que antes. Se comprobó midiendo todas las imágenes de cinco
  páginas a 430 y 1440 px: posiciones idénticas.
- AVIF tarda más en generarse: un build en frío pasa de unos segundos a ~35 s.
  Astro guarda las imágenes en caché entre builds.

La excepción es el mapa de contacto, que va como fondo CSS con `getImage()` y
sigue en webp.
