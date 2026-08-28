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
