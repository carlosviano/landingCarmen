// La huella de lo que sale en la carta en PDF: un hash de los archivos de los
// que sale su contenido. `npm run carta` la guarda al generar el PDF y el
// build la recalcula (astro.config.mjs) para avisar si el PDF se ha quedado
// viejo. Ver «La carta en PDF» en AGENTS.md.
//
// Solo contenido: tartas, precios, contacto, cómo pedir y la propia hoja.
// global.css no entra a propósito: retocar un estilo de la web no cambia
// nada de lo que dice la carta, y avisar en cada cambio de CSS haría que el
// aviso se ignorara.
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";

const raiz = new URL("../", import.meta.url);

const ARCHIVOS = [
  "src/config/catalogo.ts",
  "src/config/pedido.ts",
  "src/config/site.ts",
  "src/config/bienvenida.ts",
  "src/lib/pedido.ts",
  "src/pages/catalogo/carta.astro",
  "src/components/catalogo/FichaAnotada.astro",
  "src/layouts/LayoutImpresion.astro",
];

/** Donde `npm run carta` deja la huella del último PDF. */
export const ARCHIVO_HUELLA = new URL("src/config/carta-pdf.json", raiz);

export async function huellaCarta() {
  // Los recortes de las fichas: una foto nueva cambia la carta igual que un
  // precio.
  const imagenes = (await readdir(new URL("src/assets/images/", raiz)))
    .filter((nombre) => nombre.endsWith("-ficha.png"))
    .sort()
    .map((nombre) => `src/assets/images/${nombre}`);

  const hash = createHash("sha256");
  for (const ruta of [...ARCHIVOS, ...imagenes]) {
    hash.update(ruta);
    hash.update(await readFile(new URL(ruta, raiz)));
  }
  return hash.digest("hex").slice(0, 16);
}

/** `true` si el PDF publicado salió de los archivos tal como están ahora. */
export async function cartaAlDia() {
  try {
    const { huella } = JSON.parse(await readFile(ARCHIVO_HUELLA, "utf8"));
    return huella === (await huellaCarta());
  } catch {
    return false;
  }
}
