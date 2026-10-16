# Notas: qué se ha hecho en la web para que Google la encuentre

Esta carpeta es un diario. Cada vez que se termina un paso del trabajo de
SEO (ver [../ESTADO.md](../ESTADO.md)), aquí queda escrito **qué se hizo,
por qué, y cómo funciona**, con palabras normales.

Está pensada para alguien que nunca ha tocado una web ni ha hecho
marketing. Si algo no se entiende, la culpa es de la nota, no de quien la
lee.

## Por dónde empezar

1. [Glosario](glosario.md): las palabras raras (SEO, URL, sitemap,
   canonical…) explicadas una a una. Léelo primero; las demás notas lo
   dan por leído.
2. Las notas de cada paso, en orden:

| Nota | De qué va |
|---|---|
| [01-1 · La ficha de Google](01-1-la-ficha-de-google.md) | Qué es la tarjeta de Estimada Carmela en Google Maps, cómo se creó, quién es su dueña y por qué hay que esperar a que Google la verifique |
| [02-1 · Mapa, robots y «la de verdad»](02-1-sitemap-canonical-robots.md) | Darle a Google un mapa de la web, decirle dónde está ese mapa y cuál es la dirección buena de cada página |
| [02-2 · Enlaces con barra final](02-2-enlaces-con-barra.md) | Que los botones de la web lleven directos a cada página, sin dar un rodeo |
| [02-3 · La dirección completa: «local 7»](02-3-direccion-local-7.md) | Que la web diga exactamente la misma dirección que la ficha de Google |
| [02-4 · El cartel de cada página en Google](02-4-titulos-y-descripciones.md) | Un título y una descripción propios para cada página, con las palabras que la gente busca y con «Málaga» |
| [02-5 · Cerrar la puerta de atrás](02-5-redireccion-pages-dev.md) | Que la copia de la web en `landingcarmen.pages.dev` mande a la gente y a Google al dominio de verdad |

## Cómo se leen los trozos de código

Algunas notas enseñan trozos del código de la web. No hace falta entender
programación para seguirlos:

- Lo que va detrás de `//` o entre `/* */` son **comentarios**: notas que
  los programadores dejan para otras personas. El ordenador las ignora.
- Cuando se enseña un cambio, las líneas que empiezan por `+` son las que
  se han **añadido** y las que empiezan por `-` las que se han **quitado**.
- Debajo de cada trozo hay una explicación línea a línea de lo importante.
