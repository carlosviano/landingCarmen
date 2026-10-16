# 02-2 · Enlaces con barra final

- **Spec:** [02, SEO técnico base](../specs/02-seo-tecnico-base.md), paso 2
- **Fecha:** 2026-10-16
- **Rama:** `feat/seo-tecnico-base`

Palabras que conviene tener claras antes (en el [glosario](glosario.md)):
URL, redirección (301, 308), barra final, canonical.

## En una frase

Los botones y enlaces de la web llevaban a direcciones **sin** la `/` del
final, y cada clic tenía que dar un rodeo; ahora llevan directamente a la
dirección buena.

## El problema que había

Cloudflare guarda cada página de la web como una carpeta. La página del
catálogo, por ejemplo, es la carpeta `catalogo/`, y por eso su dirección
buena es `/catalogo/`, **con barra**.

Si alguien pide `/catalogo` (sin barra), Cloudflare no le enseña la página:
le contesta «eso está en `/catalogo/`, ve allí» (una redirección **308**), y
el navegador hace una segunda petición. Es como llamar a una casa y que te
digan «es la puerta de al lado»: llegas, pero has llamado dos veces.

Y casi todos los enlaces de dentro de la web iban sin barra. Contando todas
las páginas, había más de 200 enlaces así: el menú (La carta, Personalizadas,
Eventos), las tarjetas de cada tarta, el botón de «Volver a la carta»…

¿Por qué importa?

- **Para la persona que visita:** cada rodeo es un pequeño rato de espera,
  sobre todo con el móvil y mala cobertura.
- **Para Google:** el robot sigue los enlaces de la web para recorrerla. Si
  todos los enlaces apuntan a una dirección que «se ha mudado», el robot
  pierde tiempo dando rodeos, y además la web le está mandando dos señales
  que no cuadran: los enlaces dicen `/catalogo`, el canonical (ver
  [02-1](02-1-sitemap-canonical-robots.md)) y el mapa dicen `/catalogo/`.
  Lo que queremos es que **todo diga lo mismo**.

## Lo que se ha hecho

Poner la `/` al final de todos los enlaces que van a una página de la web.
No se cambia ninguna página de sitio: solo cómo se escriben los enlaces.

### La mayoría estaban en un solo sitio

La web tiene un archivo con los datos generales (`src/config/site.ts`). Ahí
está la lista de los tres servicios, y de esa lista leen el menú, los
botones de la portada, la página de error y los escaparates. Cambiando tres
líneas se arreglaron casi todos los enlaces de golpe:

```diff
 export const SERVICIOS = {
-  carta: { nombre: "La carta", ruta: "/catalogo", ancla: "carta" },
+  carta: { nombre: "La carta", ruta: "/catalogo/", ancla: "carta" },
   ...
-    ruta: "/personalizadas",
+    ruta: "/personalizadas/",
   ...
-  eventos: { nombre: "Eventos", ruta: "/eventos", ancla: "eventos" },
+  eventos: { nombre: "Eventos", ruta: "/eventos/", ancla: "eventos" },
 } as const satisfies Record<string, Servicio>;
```

- `nombre` es cómo se llama el servicio en el menú.
- `ruta` es la dirección de su página. **Es lo único que ha cambiado.**
- `ancla` es el nombre de su trozo dentro de la portada (para bajar hasta
  él). No tiene que ver con esto y no se toca.

Esto es un buen ejemplo de por qué conviene tener los datos **en un solo
sitio**: si cada botón llevara su dirección escrita a mano, habría que
buscarlos uno a uno, y seguro que alguno se escaparía.

### Los que estaban escritos a mano

Otros enlaces sí estaban escritos directamente en su pieza de la web. Se
buscaron todos y se les puso la barra:

| Dónde | Antes | Ahora |
|---|---|---|
| Tarjeta de cada tarta en el catálogo | `/catalogo/galleta` | `/catalogo/galleta/` |
| Botón «Volver a la carta» | `/catalogo` | `/catalogo/` |
| Enlaces a las condiciones y la privacidad (pedido, formularios, alérgenos) | `/condiciones` | `/condiciones/` |
| Enlaces entre los textos legales | `/privacidad` | `/privacidad/` |

El de las tarjetas tiene un detalle curioso, porque no es una dirección
fija: se **monta** para cada tarta.

```diff
-  href={`/catalogo/${tarta.id}`}
+  href={`/catalogo/${tarta.id}/`}
```

`${tarta.id}` es un hueco que se rellena con el nombre corto de cada tarta
(`galleta`, `pavlova-de-melocoton`…). Poniendo la barra después del hueco,
salen bien las siete tartas de golpe, y también las que se añadan en el
futuro.

Uno lleva además un **ancla** (lo de después de `#`, que dice a qué parte
de la página bajar):

```diff
-          href="/condiciones#alergenos"
+          href="/condiciones/#alergenos"
```

La barra va **antes** de la `#`: la barra es parte de la dirección de la
página; el `#alergenos` es «y una vez allí, baja hasta los alérgenos».

### Lo que NO lleva barra

Los **archivos** no son carpetas, así que no llevan barra: el icono de la
pestaña (`/favicon.ico`), la carta en PDF (`/carta-estimada-carmela.pdf`),
las fuentes y los estilos. Se dejaron como estaban. Si se les pusiera
barra, dejarían de funcionar.

Tampoco se tocaron los enlaces a la portada que bajan a un trozo, como
`/#contacto`: la portada es `/`, que ya es una barra.

### Los legales escondidos

Los enlaces a los textos legales ahora mismo **no salen** en la web
(están escondidos hasta que tengan los datos de Carmen; ver 02-1). Aun así
se les ha puesto la barra, para que el día que se enciendan salgan ya
bien.

## Cómo se ha comprobado

No basta con buscar en el código: algunos enlaces se montan con piezas,
como el de las tarjetas, y no se ven enteros hasta que se fabrica la web.
Así que se fabricó la web y se listaron **todos** los enlaces de **todas**
las páginas fabricadas. Después del cambio, los únicos sin barra que quedan
son los archivos (icono, estilos, fuentes, PDF), que es lo correcto.

Además, `npm run check` (busca errores) da 0 errores y el formato del
código es el de siempre.

## Un aviso que sale y por qué no es un problema

Al fabricar la web sale este aviso:

```
La carta en PDF está desactualizada: genérala con `npm run carta`.
```

La web tiene una carta en PDF que se fabrica aparte, y para saber si está
al día apunta una especie de **huella** de los archivos de los que sale.
Uno de esos archivos es `site.ts`, que acabamos de tocar, así que la huella
ya no coincide y avisa.

Pero en este caso el PDF no cambiaría: la carta no imprime estas
direcciones. En el paso 3 se cambia la dirección del obrador («Primera
planta, local 7»), que **sí** sale en la carta, así que el PDF se vuelve a
fabricar entonces, una sola vez, con los dos cambios.

## Lo que este paso NO arregla todavía

- **Los enlaces que la gente ya ha compartido** sin barra (en WhatsApp, en
  Instagram) siguen funcionando: Cloudflare sigue haciendo el rodeo. Lo que
  ha cambiado es que la web ya no los crea ella misma.
- **La copia de `.pages.dev`** sigue abierta hasta el paso 5.
