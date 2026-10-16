# Glosario

Las palabras que salen en las notas, de la más básica a la más concreta.
Cada una se apoya en las de antes.

## Lo básico

### Web, página y dominio

Una **web** es un conjunto de **páginas**. La de Estimada Carmela tiene
unas cuantas: la portada, el catálogo, una página por cada tarta, la de
eventos, la de personalizadas…

El **dominio** es el nombre de la web, lo que se escribe en el navegador:
`estimadacarmela.com`. Es como la dirección de una casa: hay que
alquilarlo (se paga cada año) y nadie más puede usarlo mientras sea tuyo.

### URL

La **URL** es la dirección completa de UNA página concreta. Si el dominio
es la calle y el número, la URL es además el piso y la puerta:

```
https://estimadacarmela.com/catalogo/galleta/
└─┬──┘   └───────┬────────┘└───────┬───────┘
 cómo        el dominio      qué página
hablar                       dentro de la web
```

- `https://` es el idioma en que habla el navegador con la web. La `s`
  significa «segura»: lo que viaja va cifrado, como en un sobre cerrado.
- Lo de después del dominio es el **camino** hasta la página. Aquí: en la
  sección `catalogo`, la tarta `galleta`.

### Servidor y hosting

Las páginas tienen que estar guardadas en un ordenador que esté encendido
siempre y conectado a internet, para que cualquiera pueda pedírselas a
cualquier hora. Ese ordenador es el **servidor**, y el servicio de
alquilarlo es el **hosting**. Esta web está en **Cloudflare Pages**.

### Código y build

La web no se escribe página a página a mano. Se escribe un **código** (unas
instrucciones) que dice cómo es cada página, y un programa (aquí se llama
**Astro**) lo lee y **fabrica** todas las páginas de golpe. A esa
fabricación se le llama **build**. Lo que sale del build (la carpeta
`dist/`) es lo que se sube al servidor.

Esto importa porque muchas cosas de las notas no se hacen «en una página»,
sino en el código que fabrica todas: se cambia una vez y se arreglan todas.

## Google y cómo funciona

### Buscador

**Google** (y **Bing**, que es el de Microsoft y el que usan por debajo
algunas inteligencias artificiales) es un **buscador**: tú escribes
«tartas por encargo en Málaga» y te da una lista de páginas.

Google no busca en internet en el momento en que tú le preguntas: sería
lentísimo. Lo que hace es tener **una copia apuntada de antes** de
muchísimas páginas, y busca en su copia. Para tener esa copia hace dos
cosas:

### Rastrear

**Rastrear** es visitar páginas para leerlas. Google tiene un programa (se
le llama **robot**, **bot**, **araña** o **crawler**) que va de página en
página siguiendo los enlaces, como alguien que va por una biblioteca
abriendo libros y pasando a los que se citan dentro.

### Indexar

**Indexar** es apuntar la página en la copia de Google (su **índice**),
para que pueda salir en las búsquedas. Una página que Google no ha
indexado **no existe** para quien busca, aunque esté en internet.

Rastrear no es lo mismo que indexar: Google puede leer una página y
decidir no apuntarla (porque está repetida, porque está vacía o porque la
web le pide que no lo haga).

### SEO

**SEO** son las siglas en inglés de «optimización para buscadores». Es
todo lo que se hace para que Google **encuentre** la web, la **entienda** y
la ponga **arriba** cuando alguien busca algo relacionado. Hay dos partes:

- **SEO técnico**: que la web esté bien construida para que el robot no se
  líe. Es lo que se hace en la spec 02. No se ve, pero si falla, lo demás
  no sirve.
- **Contenido**: que lo que pone la web conteste lo que la gente busca.

**SEO local** es el SEO de un negocio que está en un sitio y vende cerca:
lo importante no es salir el primero en toda España, sino cuando alguien
de Málaga busca tartas.

### GEO

Aquí **GEO** no es «geografía»: son las siglas de «optimización para
motores generativos». Es lo mismo que el SEO, pero pensando en las
inteligencias artificiales (ChatGPT, Gemini, el resumen que pone Google
arriba del todo…). Cuando alguien les pregunta «¿dónde encargo una tarta
en Málaga?», contestan con lo que han leído de webs. El GEO busca que lean
la de Carmen y la entiendan bien.

## Las piezas técnicas de la spec 02

### Sitemap

Un **sitemap** («mapa del sitio») es una lista con las URLs de todas las
páginas que quieres que Google apunte. Es un archivo que está en la propia
web, escrito para máquinas, no para personas.

Sin mapa, el robot tiene que ir descubriendo páginas siguiendo enlaces, y
alguna se le puede escapar. Con mapa, se las das todas en una lista.

### robots.txt

**robots.txt** es un archivo de texto que está siempre en el mismo sitio
(`estimadacarmela.com/robots.txt`) y que es lo **primero** que lee el
robot de Google al llegar. Es como el cartel de la puerta de una tienda:
«se puede pasar», «prohibido el paso», «el mapa está aquí».

### Canonical

A veces la misma página se puede abrir desde **varias URLs**. Para
Google, cada URL es una página distinta, así que ve la misma página
repetida varias veces y no sabe cuál enseñar. A esto se le llama
**contenido duplicado**.

El **canonical** es una etiqueta escondida dentro de la página que dice:
«da igual por dónde hayas llegado; mi dirección buena es esta». Google
junta entonces todas las copias en una sola.

### Redirección (301, 308)

Una **redirección** es cuando pides una URL y el servidor te contesta
«eso está en otra dirección, ve allí», y el navegador va solo. Es como el
cartel de «nos hemos mudado a la calle de enfrente».

El número es el código con el que lo dice el servidor:

- **301** y **308**: «me he mudado para siempre». Google pasa la
  importancia de la dirección vieja a la nueva.
- (Hay otros, como el 302, que significan «es temporal»; no los usamos.)

Las redirecciones funcionan, pero cada una es un viaje de más: el
navegador pide, le dicen «ve a otra», y pide otra vez. Para los enlaces
de la propia web, mejor que apunten directamente a la dirección buena.

### Barra final

Es la `/` del final de una URL: `/catalogo/` en vez de `/catalogo`. Parece
una tontería, pero para Google son **dos URLs distintas**. Esta web, por
cómo la sirve Cloudflare, usa siempre la versión **con barra**; la otra
redirige (308) a ella.

### Staging y producción

**Producción** es la web de verdad, la que ve todo el mundo en
`estimadacarmela.com`. **Staging** es una copia de pruebas en otra
dirección, donde Carmen revisa los cambios antes de que salgan. No
queremos que Google apunte staging: tendría precios a medio poner y,
además, sería una copia repetida de la web.

### pages.dev

Cloudflare, además del dominio de verdad, sirve cada web en una dirección
suya que acaba en `.pages.dev`. Es la misma web con otro nombre: otra
copia repetida que hay que controlar.

### Noindex

Es una etiqueta escondida en una página que le dice a Google: «puedes
leerme, pero no me apuntes». La llevan, por ejemplo, los textos legales
mientras les falten datos.

### Título y descripción

Son el **cartel de una página en Google**. El **título** es la línea azul
grande de cada resultado (en el código, la etiqueta `<title>`; también es
lo que sale en la pestaña del navegador). La **descripción** son las dos
líneas grises de debajo (en el código, `<meta name="description">`). No se
ven dentro de la página: los lee Google y los enseña a quien busca. Google
corta el título hacia los 60 caracteres y la descripción hacia los 155.

### Palabra clave

Lo que la gente **escribe en Google** cuando busca algo: «tarta de boda
Málaga», «mesa dulce». Para elegir las palabras de un título se mira
cuánto se busca cada una. Una palabra muy bonita que nadie escribe no trae
a nadie.

## La ficha de Google

### Ficha de Google (Google Business Profile)

Es la **tarjeta de un negocio dentro de Google**: nombre, dirección,
teléfono, horario, fotos y opiniones. Sale en Google Maps y al lado de
los resultados cuando alguien busca el negocio. No forma parte de la web:
se rellena aparte, en un panel de Google. Su nombre oficial es *Google
Business Profile* (antes, *Google My Business*).

### Mapa de resultados

El **mapita con tres negocios** que Google enseña arriba cuando alguien
busca algo con sitio, como «pastelería en El Palo» o «tartas cerca de
mí». Sale de las fichas, no de las webs. Salir ahí es casi lo más
importante del SEO local.

### NAP

Las siglas en inglés de **Nombre, Dirección y Teléfono** (*Name, Address,
Phone*). Son los datos que Google compara entre la ficha, la web,
Instagram y cualquier directorio para saber que todos hablan del mismo
negocio. Por eso tienen que estar escritos **exactamente igual** en todas
partes: los de esta web están en `DATOS-NEGOCIO.md`.

### Categoría

La etiqueta que le dice a Google **qué es** el negocio. Hay una
**principal** (aquí, «Pastelería»), que es la que más cuenta, y se pueden
añadir **secundarias**. Hay que elegirlas de la lista que da Google, no
se pueden inventar.

### Verificación

La prueba de que el negocio **existe de verdad** y de que quien hace la
ficha tiene que ver con él: un código por correo, un SMS, una llamada o
un vídeo del local. Hasta que Google no la da por buena, la ficha no sale
del todo. Mientras está «procesando» es mejor no cambiar el nombre, la
dirección ni la categoría principal.

### Propietario y administrador

Las personas que pueden entrar a cambiar la ficha. El **propietario
principal** es el dueño del todo (solo hay uno); los **propietarios**
pueden casi todo; los **administradores** pueden cambiar datos y contestar
opiniones, pero no decidir quién manda.

### Pin

La **chincheta** que marca en el mapa dónde está el negocio. Tiene que
estar justo sobre el edificio: si se mueve, la gente que va en coche
llega a otro sitio.

### Zona de servicio y ficha híbrida

La **zona de servicio** es el sitio adonde el negocio va a trabajar a casa
del cliente (aquí, la provincia de Málaga, para montar mesas dulces). Una
**ficha híbrida** enseña a la vez la dirección, porque la gente va a
recoger, y la zona de servicio, porque el negocio también se desplaza.

### Duplicado

Dos fichas para el **mismo negocio**. Es malo: Google reparte la
confianza entre las dos, o las castiga. Hay que buscarlas y quitarlas.
