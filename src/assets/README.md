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
