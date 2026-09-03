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

Quién entra y en qué orden se decide en `GALERIA`, dentro de `src/config/site.ts`; el
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

# El díptico de la portada

`tarta_cumple_kika_2026.jpeg` + `tarta_cumple_kika_2026_detalle.jpeg`

La sección de catálogo de la portada es un díptico a sangre: **la misma tarta
dos veces**, entera a la izquierda y de muy cerca a la derecha. Quién sale se
decide en `ESCAPARATE`, dentro de `src/config/site.ts`; el componente es
`src/sections/Catalogo.astro`.

El recurso vive de que sean **la misma toma**. El plano entero dice qué es y el
detalle dice cómo está hecha; con dos tartas distintas no funciona, se lee como
dos fotos puestas juntas. Así que al sustituirlas:

1. Se elige la mejor foto de producto que haya. Es lo primero que ve quien
   entra.
2. **El detalle se recorta DE esa misma foto**, no se busca otra. El que hay
   salió así, con `sips`:

   ```
   sips tarta_cumple_kika_2026.jpeg -c 1000 800 --cropOffset 200 175 --out /tmp/_det.jpeg
   sips /tmp/_det.jpeg -s format jpeg -s formatOptions 88 --out tarta_cumple_kika_2026_detalle.jpeg
   ```

   `-c` es alto y ancho; `--cropOffset` es arriba e izquierda. Los cuatro
   números salen de dónde está el motivo en la foto original y hay que
   recalcularlos para cada una.
3. Se recorta **generoso**: el detalle se sirve hasta 1200 px de ancho y Astro
   no reescala hacia arriba. Con menos de 800 px de recorte se verá blando en
   pantallas densas.

Estas dos sí pasan por el `<Image>` de Astro (viven en `src/assets/`, no son
URLs remotas), así que el build les saca sus webp y sus tamaños.

El detalle se usa **dos veces**: aquí y en la banda de cierre de `/catalogo`.
Es a propósito — repetir la foto es lo que hace que las dos pantallas se
reconozcan como parte de lo mismo.

---

# Las imágenes del catálogo

Quién es cada una se decide en `CATALOGO`, dentro de `src/config/site.ts`, con
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

## Sí pasan por `<Image>` de Astro

Al vivir en `src/assets/` (y no ser URLs remotas), el build les saca sus `webp`
en varios anchos: la pavlova baja de 112 kB a entre 17 y 64 kB según el hueco.
Esta carpeta era antes la única parte del sitio que no pasaba por `<Image>`;
ya no lo es.
