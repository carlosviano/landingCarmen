# Datos del negocio (NAP canónico)

Se copian **exactamente igual** en Google Business Profile, Bing Places,
Apple Business Connect, Instagram, directorios y JSON-LD. Para Google y para
las IA, un dato que cambia de un sitio a otro es otro negocio.

La fuente de verdad en el código es `src/config/site.ts` y
`src/config/catalogo.ts`. Si cambia un dato, se cambia allí, aquí y en
todas las fichas.

`[POR CONFIRMAR]` = todavía no se publica en ningún sitio.

## Identidad

| Campo | Valor |
|---|---|
| Nombre | Estimada Carmela |
| Lema | Cuando la estética y el sabor van de la mano |
| Qué es | Alta pastelería por encargo en Málaga (obrador, no tienda a pie de calle) |
| Titular | Carmen, autónoma (nombre completo: Carmen Alcantara Nieto, está en `TITULAR` de `site.ts`) |

## Dirección y ubicación

| Campo | Valor |
|---|---|
| Línea 1 | Calle Escultor Marín Higuero, 6 |
| Línea 2 | Primera planta, local 7 |
| Código postal | 29017 |
| Ciudad | Málaga |
| Provincia | Málaga |
| País | España |
| Zona | El Palo (Málaga este) |
| Coordenadas | 36.7212034, -4.3645263 (confirmadas) |
| Ojo | Hay otra calle Escultor Marín Higuero en **Arriate**. Comprobar siempre el CP 29017 y el pin. |

## Contacto

| Campo | Valor |
|---|---|
| Teléfono / WhatsApp | +34 674 99 58 11 |
| Email | contacto@estimadacarmela.com |
| Web | https://estimadacarmela.com/ (sin www; `www` hace una 301 hacia aquí) |
| Instagram | https://www.instagram.com/estimadacarmela/ |

## Horario

| Día | Horas |
|---|---|
| Lunes a jueves | 09:00–14:00 y 17:00–19:30 |
| Viernes | 09:00–18:30 |
| Sábado y domingo | Cerrado |

## Servicios

1. **La carta:** tartas de temporada con precio cerrado.
2. **Tartas personalizadas:** diseños a medida que se recogen en el obrador.
3. **Eventos:** mesas dulces y pastelería para bodas, empresas y celebraciones.

En los eventos, Carmen monta la mesa dulce en el lugar del evento (zona
que cubre: `[POR CONFIRMAR]`).

Cómo se encarga: todo por encargo, con dos días laborables de antelación.
WhatsApp o formulario. Recogida en el obrador, solo de lunes a viernes.

## La carta (de `src/config/catalogo.ts`)

| Tarta | URL | Tamaños y precios |
|---|---|---|
| Tartaleta de lima | /catalogo/limon-y-merengue | 4–6 p. 25 € · 8–10 p. 42 € |
| Tartaleta de chocolate negro 70,5% | /catalogo/tartaleta-de-chocolate | 4–6 p. 27 € · 8–10 p. 45 € |
| Pavlova de melocotón | /catalogo/pavlova-de-melocoton | 4–6 p. 25 € · 8–10 p. 42 € |
| Tarta de la abuela | /catalogo/tarta-de-la-abuela | 4–6 p. 27 € · 8–10 p. 45 € |
| Tarta de nueces de macadamia | /catalogo/nueces-de-macadamia | 8–10 p. 45 € |
| Galleta XL | /catalogo/galleta | Tamaño único 16 € |
| Paris-Brest | /catalogo/choux-de-avellana | 4–6 p. 27 € · 8–10 p. 45 € |

## Carmen (para «Sobre Carmen», `Person` y prensa)

Datos que ha dado Carlos. Antes de publicarlos fuera de la web hay que
confirmar los nombres exactos y las fechas:

- Formada en la Escuela Torreblanca (Paco Torreblanca).
- Ha trabajado en Marbella Club y en los restaurantes con estrella Michelin
  Saddle y DSTAgE (Madrid).
- Antes estudió ADE y trabajó en consultoría.

## Categorías de Google Business Profile

`[POR CONFIRMAR en la spec 01]`
