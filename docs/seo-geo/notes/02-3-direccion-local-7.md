# 02-3 · La dirección completa: «local 7»

- **Spec:** [02, SEO técnico base](../specs/02-seo-tecnico-base.md), paso 3
- **Fecha:** 2026-10-16
- **Rama:** `feat/seo-tecnico-base`

Palabras que conviene tener claras antes (en el [glosario](glosario.md)):
SEO local, NAP.

## En una frase

La web decía que el obrador está en la «Primera planta», y ahora dice
«Primera planta, **local 7**», igual que la ficha de Google.

## El problema que había

En la primera planta del edificio hay varios locales. Justo al lado del de
Carmen, en el local 8, hay otro negocio que **ya tiene su propia ficha en
Google**. Con solo «Primera planta»:

- Una persona que va a recoger una tarta no sabe a qué puerta llamar.
- Google ve dos negocios en el mismo sitio y puede confundirlos, o pensar
  que la ficha de Carmen es una copia de la del vecino.

Además, en la ficha de Google (spec 01) la dirección ya se puso con
«local 7». La web y la ficha decían cosas **distintas**, y para Google eso
es una mala señal.

### Por qué importa que digan lo mismo

En SEO local hay una regla muy sencilla que se llama **NAP** (ver el
glosario): el **nombre**, la **dirección** y el **teléfono** del negocio
tienen que estar escritos **exactamente igual** en todas partes: la web,
la ficha de Google, Instagram, cualquier guía…

Google junta todo lo que encuentra sobre un negocio para decidir si se fía
de él. Si en un sitio pone «Primera planta» y en otro «Primera planta,
local 7», no tiene claro si son el mismo sitio. Cuantas más veces lo
encuentre igual, más seguro está de que el negocio existe y está ahí, y
mejor lo coloca cuando alguien busca cerca.

## Lo que se ha hecho

### 1. Añadir el local a la dirección

La dirección está escrita **una sola vez**, en `src/config/site.ts`,
partida en trozos:

```diff
 export const DIRECCION: Direccion = {
   calle: "Escultor Marín Higuero, 6",
-  portal: "Primera planta",
+  // Con el local: el de al lado (el 8) tiene su propia ficha en Google, y sin
+  // el número no hay forma de saber cuál es.
+  portal: "Primera planta, local 7",
   cp: "29017",
   ciudad: "Málaga",
 };
```

- `calle`: la calle y el número del edificio.
- `portal`: lo que hace falta para llegar a la puerta una vez estás en el
  edificio. **Es lo único que ha cambiado.**
- `cp` y `ciudad`: el código postal y la ciudad.

El comentario de encima (`//`) explica **por qué** hace falta el local,
para que nadie lo quite pensando que sobra.

¿Por qué en trozos y no toda junta? Porque cada parte de la web la enseña
de una forma: el pie de página en bloque, el menú del móvil en una línea
corta, la tarjeta de contacto con la calle en grande… Todas leen los
mismos trozos, así que al cambiar esta línea se ha cambiado la dirección
**en todos los sitios a la vez**:

| Dónde sale | Cómo queda |
|---|---|
| El pie y el menú del móvil | Primera planta, local 7 |
| La tarjeta de contacto de la portada | Primera planta, local 7 — 29017 |
| El aviso legal (domicilio de Carmen) | …, primera planta, local 7, 29017 Málaga |
| Las condiciones (dónde se recoge) | … (primera planta, local 7), Málaga |

En los textos legales sale en minúsculas («primera planta») porque va en
mitad de una frase. No hace falta escribirla dos veces: el código la pasa a
minúsculas solo.

### 2. Quitar una duda que ya no lo es

Al lado de la dirección están las **coordenadas** del obrador: los dos
números que dicen el punto exacto en el mapa (latitud y longitud). Tenían
una nota de «TODO» (en inglés, «por hacer»), que es como los programadores
marcan algo pendiente:

```diff
-// TODO: confirmar que es esta calle. Coordenadas del portal resueltas contra
-// Nominatim (OpenStreetMap). Ojo: existe otra "Calle Escultor Marín Higuero"
-// en Arriate, también en Málaga, pero allí no hay número 6.
+// Coordenadas del portal resueltas contra Nominatim (OpenStreetMap), y
+// confirmadas. Ojo: existe otra "Calle Escultor Marín Higuero"
+// en Arriate, también en Málaga, pero allí no hay número 6.
```

La duda era si las coordenadas eran de la calle buena, porque hay **otra
calle con el mismo nombre** en Arriate, un pueblo de la provincia. Se
comprobó (está apuntado en `ESTADO.md`): son las buenas. Se quita el
«por hacer» y se deja apuntado que están confirmadas. El aviso de Arriate se queda, porque es útil para
cualquiera que vuelva a buscar la dirección.

### 3. Volver a fabricar la carta en PDF

La web tiene una carta en PDF para descargar o imprimir. No se fabrica sola
cada vez: se fabrica a mano con `npm run carta`, y se guarda junto con una
**huella**, un código corto que se calcula a partir de los archivos de los
que sale la carta (las tartas, los precios, el contacto…).

```diff
 {
-  "huella": "34bf98ffc6d3ec3d"
+  "huella": "29062bd6f800bed5"
 }
```

Funciona como el precinto de un bote: si alguien cambia uno de esos
archivos, la huella que se calcula ya no coincide con la guardada, y la
web avisa de que «la carta está desactualizada». En GitHub, además, una
comprobación automática marca el cambio en rojo hasta que se arregle.

`site.ts` es uno de esos archivos, así que había que volver a fabricar la
carta. En este caso la carta no cambia por dentro: solo imprime la calle y
la ciudad, no la planta. Pero se vuelve a fabricar igualmente, para que la
huella nueva quede guardada y el aviso desaparezca. El PDF nuevo pesa
prácticamente lo mismo que el anterior (0,9 MB, 26 bytes de diferencia,
que es la fecha en que se fabricó).

Un detalle: el primer intento de fabricarla falló con «No ha llegado a
tiempo: las fuentes y las fotos de la carta». La carta se fabrica abriendo
la página en un navegador invisible y esperando a que carguen las letras
(que vienen de Adobe, por internet) y las fotos. Esa vez tardaron más de lo
que el programa espera, y se rindió. Al segundo intento salió bien. Si
vuelve a pasar, basta con repetirlo.

## Cómo se ha comprobado

- Se fabricó la web y se buscó la dirección en las páginas: sale «local 7»
  en el pie, en el contacto, en el aviso legal y en las condiciones (tabla
  de arriba).
- El aviso de «carta desactualizada» ya no sale al fabricar la web.
- `npm run check`: 0 errores. El formato del código, el de siempre.

## Lo que este paso NO arregla todavía

- La dirección también tendrá que ir igual en los **datos para máquinas**
  (spec 05, JSON-LD) y fuera de la web: Instagram, Bing, Apple Maps
  (spec 08). Saldrá de este mismo `site.ts`, así que ya irá bien.
- **El mapa** de la web es una foto fija centrada en las coordenadas. Como
  las coordenadas no cambian, el mapa tampoco.
