// Falla si la carta en PDF no está al día con las tartas, los precios y el
// contacto. Lo lanza la comprobación de GitHub en cada PR
// (.github/workflows/carta-pdf.yml), y se puede lanzar a mano:
//
//   node scripts/comprobar-carta.mjs
//
// No genera nada: solo compara la huella guardada por `npm run carta` con la
// de los archivos de ahora (ver huella-carta.mjs). Por eso no necesita ni
// `npm install` ni navegador, y en GitHub tarda segundos.
import { cartaAlDia } from "./huella-carta.mjs";

if (await cartaAlDia()) {
  console.log("La carta en PDF está al día.");
} else {
  // El formato `::error` lo pinta GitHub como anotación en el PR.
  console.log(
    "::error file=public/carta-estimada-carmela.pdf::La carta en PDF está desactualizada. Genérala con `npm run carta` y commitea el PDF y src/config/carta-pdf.json.",
  );
  process.exitCode = 1;
}
