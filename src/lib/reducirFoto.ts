// Reduce una foto de inspiración en el navegador antes de que viaje con el
// formulario. Sólo de navegador.
//
// Las fotos acaban adjuntas en el correo a Carmela, y un correo tiene techo:
// 5 MiB con Cloudflare Email Service, y base64 los infla un tercio. Una foto
// de móvil pesa 2–5 MB; a 1600 px de lado se queda en 200–500 KB, se ve
// igual de bien para inspirarse, y las cuatro caben con holgura. De paso, la
// subida desde el móvil va cuatro veces más rápida.
const LADO_MAXIMO = 1600;
const CALIDAD = 0.82;

/**
 * La foto, en JPEG y a `LADO_MAXIMO` px como mucho. Si no se puede abrir (un
 * formato que el navegador no sabe pintar, como HEIC fuera de Safari) o no
 * gana nada, devuelve la original: la valida igual el esquema de la foto.
 */
export async function reducirFoto(foto: File): Promise<File> {
  try {
    const imagen = await createImageBitmap(foto);
    const escala = Math.min(
      1,
      LADO_MAXIMO / Math.max(imagen.width, imagen.height),
    );
    const ancho = Math.round(imagen.width * escala);
    const alto = Math.round(imagen.height * escala);

    const lienzo = new OffscreenCanvas(ancho, alto);
    const contexto = lienzo.getContext("2d")!;
    // JPEG no tiene transparencia: sin fondo, la de un PNG saldría negra.
    contexto.fillStyle = "#fff";
    contexto.fillRect(0, 0, ancho, alto);
    contexto.drawImage(imagen, 0, 0, ancho, alto);
    imagen.close();

    const reducida = await lienzo.convertToBlob({
      type: "image/jpeg",
      quality: CALIDAD,
    });
    if (reducida.size >= foto.size) return foto;

    const nombre = foto.name.replace(/\.[^.]*$/, "") + ".jpg";
    return new File([reducida], nombre, { type: reducida.type });
  } catch {
    return foto;
  }
}
