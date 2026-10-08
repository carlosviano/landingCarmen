// Anchos para el `widths` de las fotos grandes (heros, Sobre mí).
//
// Llegan hasta 2880 porque es lo que pide una foto a todo el ancho en un
// portátil retina (1440 CSS × 2) y también un iPhone a 3x con la foto
// recortada por `object-cover`. No cuesta nada pedirlos aunque la foto no
// llegue: Astro tira los anchos que superan el original y añade el del
// original en su lugar, así que nunca amplía. Y el día que se cambia una
// foto por otra más grande, se aprovecha sola sin tocar código.
//
// La otra mitad de que una foto se vea nítida es el `sizes`, y ahí es fácil
// equivocarse: tiene que decir el ancho al que se PINTA la foto, no el de
// su caja. Con `object-cover` no es lo mismo: si la caja es más alta, en
// proporción, que la foto, esta se amplía hasta llenarla de alto y se pinta
// más ancha que la caja. Con un `sizes` del ancho de la caja, el navegador
// baja una versión pequeña y la estira (por eso se veía borrosa Sobre mí).
// Para esos casos, `anchoCubierto` da el ancho real.
export const ANCHOS_GRANDES = [640, 960, 1280, 1600, 1920, 2400, 2880];

/**
 * El ancho al que se pinta, con `object-cover`, una foto en una caja de
 * `ancho` × `alto` (dos longitudes CSS), para meterlo en un `sizes`. Es el
 * mayor entre el ancho de la caja y el ancho de la foto llevada a ese alto.
 */
export function anchoCubierto(
  foto: ImageMetadata,
  ancho: string,
  alto: string,
): string {
  const proporcion = (foto.width / foto.height).toFixed(3);
  return `max(${ancho}, calc(${alto} * ${proporcion}))`;
}
