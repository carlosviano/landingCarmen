# 02-4 · El cartel de cada página en Google

- **Spec:** [02, SEO técnico base](../specs/02-seo-tecnico-base.md), paso 4
- **Fecha:** 2026-10-16
- **Rama:** `feat/seo-tecnico-base`

Palabras que conviene tener claras antes (en el [glosario](glosario.md)):
título, descripción, palabra clave, SEO local.

## En una frase

Cada página de la web tiene ahora su propio **título** y su propia
**descripción**, escritos para quien busca en Google, con las palabras que
la gente de verdad escribe y siempre con «Málaga».

## El problema que había

Cuando buscas algo en Google, cada resultado sale con dos cosas: una línea
azul grande, que es el **título**, y debajo dos líneas grises, que son la
**descripción**. Es el cartel de la página. La gente decide en un segundo
en cuál pincha, y Google también lo lee para saber de qué va cada página.

Antes de este cambio, los carteles eran estos:

| Página | Título que salía en Google | Descripción |
|---|---|---|
| Portada | Estimada Carmela | Estimada Carmela |
| La carta | La carta · Estimada Carmela | Todas por encargo. El tamaño y la antelación de cada una están en su ficha. |
| Personalizadas | Una tarta pensada para lo que celebras · Estimada Carmela | Diseños propios que adaptamos a tu ocasión… |
| Eventos | Para el día concreto que celebras · Estimada Carmela | Tartas de boda, dulces y postres emplatados… |

Tenían tres problemas:

1. **La portada no decía nada.** Ni qué vende, ni dónde. Quien no conoce
   el nombre no tiene ninguna pista para pinchar.
2. **Ninguno decía «Málaga».** Alguien que busca «tartas en Málaga»
   quiere ver «Málaga» en el resultado, y Google también lo mira para
   saber a quién enseñar la página.
3. **Usaban el titular de la página.** «Para el día concreto que
   celebras» queda precioso dentro de la web, cuando ya ves la foto de la
   boda. Pero en una lista de Google, sin foto, no dice qué hay detrás.

### Por qué no se cambia el titular y ya está

Porque el titular está bien para lo que sirve. Es lo primero que lees
**cuando ya has entrado**, y ahí tiene que emocionar. El título de Google
es lo que lees **antes de entrar**, entre otros nueve resultados, y ahí
tiene que decir qué es y dónde está. Son dos trabajos distintos, así que
cada página lleva ahora **los dos textos por separado**.

## Qué palabras se eligieron, y por qué

Antes de escribir nada se miró qué escribe la gente en Google (las
**palabras clave**). Lo que salió:

- **«Mesa dulce»** es, con mucha diferencia, lo que más se busca en España
  y en Andalucía para los dulces de un evento.
- **«Corner», «stand», «buffet» y «barra de postres» casi no se buscan en
  España.** Son palabras que se usan en el sector o en Latinoamérica, pero
  aquí la gente no las escribe. Por eso no están en ningún título: ocuparían
  el sitio de una palabra que sí se busca.
- **«Candy bar»** apenas se busca en Andalucía.
- Para bodas, lo que más se busca es **«tarta de boda»**.

Con eso, los carteles nuevos son estos:

| Página | Título (Google le añade « · Estimada Carmela») | Descripción |
|---|---|---|
| Portada | Alta pastelería por encargo en Málaga | Tartas de temporada, personalizadas y de boda, y mesa dulce para eventos. Obrador en El Palo, Málaga, con recogida de lunes a viernes. |
| La carta | La carta: tartas por encargo en Málaga | Tartas de temporada con precio cerrado, por encargo, con dos días laborables de antelación. Recogida en el obrador de El Palo, Málaga. |
| Personalizadas | Tartas personalizadas en Málaga | Diseños propios que adaptamos a tu ocasión: tamaño, colores y sabores. Nos cuentas qué celebras, te proponemos uno y la recoges en El Palo, Málaga. |
| Eventos | Mesas dulces y tartas de boda para eventos en Málaga | Tartas de boda, mesa dulce y postres para bodas, bautizos, empresas y celebraciones en Málaga. Lo montamos en el lugar del evento. Pide presupuesto. |
| Cada tarta | *(nombre de la tarta)* por encargo en Málaga | La descripción que ya tenía cada tarta |

Unas cuantas cosas que se cuidaron:

- **Todo lo que dicen es verdad y está apuntado.** El plazo, la recogida,
  El Palo… sale de [DATOS-NEGOCIO.md](../DATOS-NEGOCIO.md). En
  personalizadas no se pone plazo porque todavía no se sabe cuál es.
- **El título de eventos dice «para eventos»** y no solo «bodas», porque
  Carmen hace también bautizos, empresas y otras celebraciones. La lista
  completa va en la descripción, que tiene más sitio.
- **Largo.** Google enseña unos 60 caracteres de título y unos 155 de
  descripción, y lo que sobra lo corta con «…». Por eso lo importante va
  delante, y lo que puede perderse («· Estimada Carmela») va al final.
  En la «Tartaleta de chocolate negro 70,5%» el título es largo y Google
  cortará el final. Se aceptó así para no inventar otro nombre de la tarta.

## Lo que se ha hecho

### 1. Una cajita para el cartel de Google

En `src/config/site.ts` se ha definido qué lleva el cartel de una página.
Es una plantilla vacía, como un formulario con dos huecos:

```ts
export interface Seo {
  titulo: string;
  descripcion: string;
}
```

- `interface Seo`: el nombre del formulario. Se llama así por **SEO**.
- `titulo` y `descripcion`: los dos huecos. `string` quiere decir «un
  texto».

Lo bueno de tener la plantilla es que, si en alguna página falta uno de los
dos huecos, la web **no se deja fabricar** y avisa. Así no se escapa una
página sin descripción.

### 2. Cada página rellena su cartel

Cada página tiene su archivo de textos en `src/config/`. A cada uno se le
ha añadido un trozo `seo`. Por ejemplo, el de eventos (`eventos.ts`):

```ts
  // "Mesa dulce" es lo que más se busca; "corner", "stand" o "buffet" no
  // tienen búsquedas en España. "Para eventos" dice que no es solo de bodas.
  seo: {
    titulo: "Mesas dulces y tartas de boda para eventos en Málaga",
    descripcion:
      "Tartas de boda, mesa dulce y postres para bodas, bautizos, empresas y celebraciones en Málaga. Lo montamos en el lugar del evento. Pide presupuesto.",
  },
```

- Las dos líneas de `//` de arriba explican **por qué** se eligieron esas
  palabras, para que nadie ponga «corners» más adelante sin saberlo.
- `seo: { … }`: el cartel de Google de esta página, con sus dos huecos
  rellenos.
- El titular de la página (`tituloPagina`) sigue en el mismo archivo y
  **no ha cambiado**: lo que ves al entrar es igual que antes.

La portada no tenía archivo propio para esto, así que su cartel va en
`portada.ts`, con el nombre `SEO_PORTADA`.

### 3. Las tartas: una regla en vez de siete textos

Hay siete tartas, y habrá más. En vez de escribir siete títulos a mano, en
`catalogo.ts` hay una **regla** que construye el título a partir del
nombre:

```ts
  tituloSeoTarta: (nombre) => `${nombre} por encargo en Málaga`,
```

- `(nombre) =>`: «dame el nombre de una tarta y te devuelvo su título».
- `${nombre}`: aquí se pega el nombre de la tarta.

Así, «Galleta XL» se convierte en «Galleta XL por encargo en Málaga». Una
tarta nueva tiene su título bueno sin que nadie se acuerde de escribirlo.
La descripción de cada tarta ya existía (es la frase que cuenta qué lleva),
así que se usa esa.

### 4. La página usa el cartel, no el titular

Por último, cada página le pasa a la plantilla general de la web (el
`Layout`, que es lo que escribe el `<title>` y la descripción) su trozo
`seo`. Por ejemplo, en `eventos.astro`:

```diff
-<Layout titulo={EVENTOS.tituloPagina} descripcion={EVENTOS.entradillaPagina}>
+<Layout titulo={EVENTOS.seo.titulo} descripcion={EVENTOS.seo.descripcion}>
```

- La línea con `-` es la de antes: usaba el titular y la entradilla de la
  página.
- La línea con `+` es la nueva: usa el cartel de Google.
- El `Layout` le añade al final « · Estimada Carmela», igual que antes.

### 5. Otra vez la carta en PDF

Como en el paso 3 (ver [02-3](02-3-direccion-local-7.md)), `site.ts` y
`catalogo.ts` cuentan para la **huella** de la carta en PDF. La carta no
cambia por dentro, porque no imprime nada de esto, pero se ha vuelto a
fabricar con `npm run carta` para guardar la huella nueva y que no salga el
aviso de «carta desactualizada».

## Cómo se ha comprobado

- Se fabricó la web y se miró, página por página, el título y la
  descripción que salen. Las once páginas que Google puede apuntar
  (portada, carta, las siete tartas, personalizadas y eventos) tienen cada
  una **los suyos, distintos de los de las demás**.
- Las descripciones nuevas miden entre 134 y 148 caracteres. Solo una de
  las de las tartas se pasa: la de la tartaleta de chocolate, con 168.
  Google cortará el final («…y cacao espolvoreado»), que es lo que menos
  importa.
- `npm run check`: 0 errores. El formato del código, el de siempre.

## Lo que este paso NO arregla todavía

- **Los textos legales** siguen con «Estimada Carmela» como descripción.
  Ahora están escondidos para Google (ver «Noindex» en el glosario), así
  que no importa. Cuando se publiquen, conviene darles la suya.
- **Al compartir un enlace** por WhatsApp o Instagram sale una tarjetita
  con foto, título y texto. Eso usa otras etiquetas, las de la spec 03
  (Open Graph). Usarán estos mismos textos.
- Google **no siempre** usa la descripción que le damos: si cree que otro
  trozo de la página contesta mejor a lo que alguien ha buscado, enseña
  ese. Lo normal es que use la nuestra.
