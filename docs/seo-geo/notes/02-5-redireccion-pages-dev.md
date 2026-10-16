# 02-5 · Cerrar la puerta de atrás: `pages.dev` → el dominio

- **Spec:** [02, SEO técnico base](../specs/02-seo-tecnico-base.md), paso 5
- **Fecha:** 2026-10-16
- **Rama:** `feat/seo-tecnico-base` (el cambio en sí no está en el código:
  se hizo en la cuenta de Cloudflare)

Palabras que conviene tener claras antes (en el [glosario](glosario.md)):
dominio, canonical, redirección (301), pages.dev, staging y producción.

## En una frase

Quien entre en `landingcarmen.pages.dev` (la copia de la web que Cloudflare
publica por su cuenta) ahora salta solo a `estimadacarmela.com`, a la misma
página, y Google entiende que la buena es la del dominio.

## El problema que había

Cloudflare, que es quien sirve la web, la publica **en dos sitios a la
vez**:

- `https://estimadacarmela.com`, el dominio de Carmen.
- `https://landingcarmen.pages.dev`, una dirección que Cloudflare le da a
  cada proyecto. `landingcarmen` es el nombre del proyecto en Cloudflare.

Las dos enseñaban exactamente lo mismo. Volviendo al cartero de la nota
[02-1](02-1-sitemap-canonical-robots.md): es como una casa con dos puertas
y dos números distintos. Si Google encuentra las dos, puede repartir la
importancia entre ellas o, peor, quedarse con la que no es.

En el paso 1 ya se puso un **canonical** en cada página: una nota que dice
«la dirección buena de esta página es la del dominio». Pero el canonical es
una **sugerencia**: Google suele hacerle caso, aunque no siempre. Y una
persona que llegue por la puerta de atrás se queda en ella.

## Lo que se ha hecho

Una **redirección 301** de la puerta de atrás a la de delante. 301 quiere
decir «me he mudado para siempre»: el navegador salta solo a la dirección
nueva, y Google pasa todo lo que sabía de la vieja a la nueva y deja de
mostrar la vieja.

Esto no se hace en el código de la web, sino en la **cuenta de
Cloudflare**, con una herramienta que se llama *Bulk Redirects*
(«redirecciones en bloque»). Tiene dos piezas:

### 1. La lista: qué se manda a dónde

Una lista llamada `pages_dev_a_dominio` con una sola línea:

| Desde | Hasta | Código |
|---|---|---|
| `landingcarmen.pages.dev/` | `https://estimadacarmela.com/` | 301 |

Y cuatro casillas, que es donde está lo delicado:

- **Mantener la ruta** (*subpath matching* y *preserve path suffix*): sí.
  Así `landingcarmen.pages.dev/catalogo/galleta/` lleva a
  `estimadacarmela.com/catalogo/galleta/`, no a la portada. Si no, todo
  el que llegara por la puerta de atrás acabaría en la portada, perdido.
- **Mantener lo que va detrás del `?`** (*preserve query string*): sí.
  Son datos que a veces llevan los enlaces (por ejemplo, de qué campaña
  viene una visita). Se pasan tal cual.
- **Incluir subdominios** (*include subdomains*): **no**. Esta es la
  importante. Los subdominios son lo que va delante del nombre:
  `staging.landingcarmen.pages.dev` (la copia donde Carmen revisa los
  cambios antes de publicarlos) y las copias de prueba de cada cambio. Si
  esta casilla estuviera marcada, también saltarían al dominio, y ya no
  habría forma de revisar nada antes de publicarlo.

### 2. La regla: encender la lista

Una lista sola no hace nada: hace falta una **regla** que diga «usa esta
lista». Es un interruptor. La cuenta no tenía ninguna regla de este tipo,
así que esta es la primera.

Si algún día la redirección diera problemas, basta con **apagar la regla**
en el panel de Cloudflare (*Rules → Bulk Redirects*) y todo vuelve a estar
como antes, al momento.

### Por qué las dos cosas, canonical y 301

Se podía haber dejado solo el canonical, o solo la 301. Se decidió poner
las dos (está en las decisiones de la spec):

- La **301** es la que manda de verdad, para personas y para Google.
- El **canonical** sale gratis (lo pone la web sola en cada página) y
  cubre lo que la 301 no toca: por ejemplo, si algún día alguien
  enlazara una copia de prueba, esa copia también dice «la buena es la del
  dominio».

## Cómo se ha comprobado

Se pidió cada dirección con `curl`, un programa que hace la misma petición
que un navegador pero enseña la respuesta en bruto, con su código:

| Dirección | Respuesta | Qué quiere decir |
|---|---|---|
| `landingcarmen.pages.dev/catalogo/?x=1` | 301 → `estimadacarmela.com/catalogo/?x=1` | Salta, con su ruta y su `?` |
| `landingcarmen.pages.dev/` | 301 → `estimadacarmela.com/` | La portada también |
| `staging.landingcarmen.pages.dev/` | 302 → pantalla de acceso de Cloudflare | Staging, intacto |
| `estimadacarmela.com/` | 200 | La web, normal |
| `www.estimadacarmela.com/` | 301 → `estimadacarmela.com/` | Lo de `www`, como estaba |

Lo de staging merece una explicación: no da 200 («aquí está la página»)
sino 302, que es una redirección **temporal** a una pantalla de
contraseña. Es porque staging está protegido con *Cloudflare Access*: solo
entra quien tiene permiso. Eso ya era así antes, y sigue igual, que es lo
que se quería ver.

## Lo que este paso NO arregla todavía

- Google tarda en enterarse. Si ya tenía apuntada alguna página de
  `pages.dev`, la irá cambiando por la del dominio a medida que vuelva a
  pasar, en días o semanas. No hay que hacer nada.
- Cuando la web esté dada de alta en **Google Search Console** (la
  herramienta de Google para dueños de webs), se podrá ver allí qué
  direcciones tiene apuntadas y confirmar que no queda ninguna de
  `pages.dev`.
