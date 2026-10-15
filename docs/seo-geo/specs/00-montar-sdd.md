# Spec 00: montar el SDD y fijar los datos del negocio

- **Estado:** en curso
- **Quién:** Carlos + asistente
- **Depende de:** nada

## Objetivo

Que exista `docs/seo-geo/` con el estado, los datos canónicos del negocio y
la plantilla, para poder cambiar de chat sin perder el contexto. Y que no
quede ningún dato contradictorio antes de crear la ficha de Google.

## Contexto / por qué

El SEO local y las IA se fían de un negocio cuando sus datos (NAP) coinciden
en todas partes. Antes de publicar nada fuera, los datos tienen que estar
fijados en un solo sitio.

## Decisiones

- 2026-10-15. Rama `docs/seo-geo` en un worktree aparte
  (`../landingCarmen-seo-geo`), porque `fix/telefono-anterior` tiene cambios
  sin commitear.
- 2026-10-15. Los nombres de las tartas son los de la web; los slugs no se
  tocan.

## Pasos

- [x] 1. Crear `ESTADO.md`, `DATOS-NEGOCIO.md`, `specs/_PLANTILLA.md` y esta spec.
- [x] 2. Carlos revisa `DATOS-NEGOCIO.md` y corrige lo que haga falta.
- [x] 3. Mergear el teléfono bueno (`fix/telefono-anterior`) a `main`.
- [ ] 4. Commit de `docs/seo-geo/` y merge a `main`, por PR en el navegador.

## Criterios de aceptación

- [x] La web de producción enseña `+34 674 99 58 11`.
- [x] `DATOS-NEGOCIO.md` revisado por Carlos, sin datos inventados.
- [ ] `docs/seo-geo/` está en `main`.

## Registro

- 2026-10-15. Hecho el paso 1. Al revisar se vio que `main` enseña
  `+34 600 90 71 34` y que el arreglo no está mergeado: queda como bloqueante
  de la spec 01.
- 2026-10-15. Carlos revisa los datos: línea 2 sin letra y precios correctos.
  El teléfono está mergeado en `main` (#50); comprobado en la web en vivo con
  curl. `www` hace una 301 al dominio sin www. Se trae `origin/main` a
  `docs/seo-geo` (avance directo). Queda el commit y el PR.
