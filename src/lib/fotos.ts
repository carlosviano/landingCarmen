// Resuelve un nombre de archivo de `src/assets/images/` al objeto de imagen
// que quiere el <Image> de Astro.
//
// Vive aquí suelto porque lo usan cuatro sitios (el escaparate de la portada,
// la banda de /catalogo, la rejilla y la ficha) y `import.meta.glob` es
// relativo AL ARCHIVO que lo escribe: repetido en cada componente, cada uno
// llevaba su propia ruta (`../assets`, `../../assets`) y bastaba mover un
// archivo de carpeta para romper una de ellas en silencio.
//
// Por qué se pasa el nombre en texto y no un `import` directo: los nombres
// viven en `src/config/site.ts`, que es contenido y no debe importar binarios.
// El precio de eso es que una errata no la caza TypeScript, así que la caza
// esta función: revienta el build con la lista de lo que sí hay, en vez de
// dejar un hueco en la página.

const archivos = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/*.{jpeg,jpg,png,webp,avif}",
  { eager: true },
);

/** Los nombres que hay ahora mismo, para los mensajes de error. */
const disponibles = () =>
  Object.keys(archivos)
    .map((ruta) => ruta.split("/").pop())
    .sort()
    .join(", ");

/**
 * La imagen que se llama `archivo`. Revienta si no existe.
 *
 * `null` NO es un error: es "esta tarta todavía no tiene foto", que es el
 * estado de seis de las ocho. Se propaga tal cual para que quien pinta decida
 * qué poner en su lugar.
 */
export function fotoDe(archivo: string | null): ImageMetadata | null {
  if (archivo === null) return null;

  const modulo = archivos[`../assets/images/${archivo}`];
  if (!modulo) {
    throw new Error(
      `No existe src/assets/images/${archivo}. Ahí dentro hay: ${disponibles()}`,
    );
  }
  return modulo.default;
}
