# SEO local, Google Business Profile y GEO: estado

Índice vivo del trabajo. Para retomarlo en un chat nuevo basta con: «Haz el
paso X de la spec NN».

- Datos del negocio tal y como se publican en todas partes: [DATOS-NEGOCIO.md](DATOS-NEGOCIO.md)
- Plantilla para specs nuevas: [specs/_PLANTILLA.md](specs/_PLANTILLA.md)
- Notas explicadas para quien no sabe de webs ni de marketing: [notes/](notes/README.md)

## Cómo trabajar (para cualquier asistente)

1. Lee este archivo, `DATOS-NEGOCIO.md` y la spec que te pidan. No hace falta
   leer más specs.
2. **No inventes ningún dato del negocio**: precios, formación, plazos,
   zonas, alérgenos, reseñas. Si falta uno, pregúntalo. Todo lo que se
   publique sale de `DATOS-NEGOCIO.md` o de `src/config/`.
3. Un paso por mensaje. Lo que haga Carmen va redactado para reenviárselo tal
   cual, sin jerga.
4. Código: rama nueva desde `main`, siguiendo `AGENTS.md`. Antes de enseñarlo,
   `npm run check` y `npm run build`. **Nunca commit sin enseñar el diff**, y
   commits sin `Co-Authored-By`. Los PR se abren en el navegador (no hay `gh`).
5. Paneles externos (Cloudflare, Google, Bing): explica qué cambia y espera el
   OK antes de tocar nada.
6. Al acabar un paso, actualiza los checks y el «Registro» de la spec, y la
   tabla y «En curso» de este archivo.
7. Y escribe su nota en `notes/` (`<spec>-<paso>-<tema>.md`, enlazada en
   `notes/README.md`): qué se hizo, por qué, y trozos del código
   explicados, para alguien que nunca ha hecho una web ni marketing, con
   palabras que entienda un niño de 12 años. Las palabras nuevas, al
   `notes/glosario.md`.

## En curso

**Spec 01**: Google Business Profile → [specs/01-google-business-profile.md](specs/01-google-business-profile.md)
Ficha creada; Google está procesando la verificación desde el 2026-10-15.
Pasos 1–4 hechos (nota en [notes/01-1](notes/01-1-la-ficha-de-google.md)); el paso 5
está preparado en la spec, para pegarlo cuando la ficha salga «Verificada».
Mientras tanto se avanza con la **spec 02** → [specs/02-seo-tecnico-base.md](specs/02-seo-tecnico-base.md),
en la rama `feat/seo-tecnico-base` (worktree `../landingCarmen-seo-tecnico`).
Pasos 1 a 3 hechos; sigue el paso 4 (títulos y descripciones).

## Bloqueantes

- [x] ~~Teléfono en producción~~: mergeado en `main` (#50) y comprobado en
      la web en vivo el 2026-10-15.
- [x] ~~La web dice «Primera planta» sin el local~~: «local 7» añadido en
      `feat/seo-tecnico-base` (spec 02, paso 3); sale a producción con el PR.
- [ ] `staging` va por detrás de `main` y sigue con el teléfono antiguo:
      hay que ponerla al día con `main`.

## Fases

| Spec | Tarea | Fase | Quién | Estado |
|---|---|---|---|---|
| 00 | Montar SDD y fijar los datos del negocio | Semana 1 | Carlos + asistente | hecho |
| 01 | Google Business Profile: crear y verificar | Semana 1 | Carmen + Carlos | en curso: verificación «procesando»; paso 5 preparado |
| 02 | Web: `site`, sitemap, canonical, robots `Sitemap:`, 301 de pages.dev, titles y descriptions | Semana 1 | Carlos/asistente | en curso |
| 03 | Open Graph y Twitter cards | Semana 1 | Carlos/asistente | pendiente |
| 04 | Search Console (dominio por DNS) y Bing Webmaster Tools | Semana 1 | Carlos | pendiente |
| 05 | JSON-LD desde `src/config` (Bakery, Person, WebSite, Product/Offer, Breadcrumb) | Mes 1 | Carlos/asistente | pendiente |
| 06 | GBP completo: productos, servicios, atributos, fotos, primera publicación | Mes 1 | Carmen + Carlos | pendiente |
| 07 | Reseñas: enlace, cuándo pedirlas, respuestas | Mes 1 | Carmen | pendiente |
| 08 | NAP fuera de la web: Instagram, Bing Places, Apple Business Connect | Mes 1 | Carlos + Carmen | pendiente |
| 09 | Contenido citable: preguntas frecuentes (FAQPage), «Sobre Carmen», alérgenos | Mes 1 | Carlos/asistente | pendiente |
| 10 | `llms.txt` | Mes 1 | Carlos/asistente | pendiente |
| 11 | Menciones externas: Torreblanca, bodas.net/Zankyou, prensa local, guías | Meses 2–3 | Carlos + Carmen | pendiente |
| 12 | Páginas por ocasión (solo con contenido y fotos reales) | Meses 2–3 | Carlos/asistente | pendiente |
| 13 | Rutina mensual de GBP para Carmen | Meses 2–3 | Carmen | pendiente |
| 14 | Medición: GSC, Cloudflare Web Analytics, panel mensual de IA | Meses 2–3 | Carlos | pendiente |
| 15 | Volver a evaluar herramientas de pago (OpenSEO/DataForSEO) | Mes 3 | Carlos | pendiente |

## Decisiones tomadas

- **2026-10-15.** Los specs viven en el repo, en `docs/seo-geo/`, rama
  `docs/seo-geo` (worktree `../landingCarmen-seo-geo`), separados del resto
  del trabajo.
- **2026-10-15.** Los nombres de las tartas que se publican fuera son el
  `nombre` de `src/config/catalogo.ts` (el de la web). Los `id` son slugs y no
  se tocan, para que las URLs no cambien.
- **2026-10-15.** Nada de herramientas SEO de pago hasta el mes 3 (spec 15).
  Con un dominio nuevo y un negocio local, lo gratis basta: GSC, Bing y el
  panel manual de IA.
- **2026-10-15.** Dominio canónico: `https://estimadacarmela.com/`, sin www.
  `www` ya hace una 301 hacia él (comprobado con curl).

## Datos confirmados

- Coordenadas 36.7212034, -4.3645263: correctas. Se puede quitar el `TODO`
  de `site.ts`.
- La pantalla de «próximamente» está desactivada en producción y la web está
  abierta (comprobado).
- No hay ninguna ficha de Google creada: la ficha se hace desde cero.
- La línea 2 de la dirección es «Primera planta, local 7». El local de al
  lado (local 8) tiene ficha propia, así que el número de local hace falta
  para distinguirlos.
- Carmen monta las mesas dulces en el lugar del evento, así que la ficha es
  híbrida: dirección visible más zona de servicio.
- Los precios y tamaños de la carta de `DATOS-NEGOCIO.md` son correctos.

## Datos pendientes de pedir (cuando toque)

Si se puede ir al obrador sin cita dentro del horario · si Carmen quiere la
dirección visible en Google · cuenta de Google de Carmen · formas de pago ·
si hay entrega o solo recogida · plazo de personalizadas y eventos · zona que
cubre en eventos · alérgenos y trazas · fotos disponibles · nombres y fechas
exactos de su formación y experiencia.
