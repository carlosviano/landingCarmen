// Genera public/carta-estimada-carmela.pdf: imprime /catalogo/carta con un
// Chrome sin ventana. Se lanza con `npm run carta`, que antes hace el build.
// Ver «La carta en PDF» en AGENTS.md.
//
// Lo imprime un navegador y no una librería de PDF por la tipografía: The
// Seasons la sirve Adobe solo a navegadores, y así la carta sale con las
// mismas letras, la misma ficha anotada y el mismo CSS que la web.
//
// Pasos: sirve dist/ con un servidor mínimo (no `astro preview`: Astro deja
// uno solo por proyecto y lo manda a segundo plano), abre Chrome (o Brave, o Edge) por
// el protocolo de DevTools, espera a las fuentes y las fotos, imprime y
// guarda, junto al PDF, la huella de lo que lleva (ver huella-carta.mjs).
import { spawn } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";
import { setTimeout as esperar } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { ARCHIVO_HUELLA, huellaCarta } from "./huella-carta.mjs";

const RAIZ = fileURLToPath(new URL("../", import.meta.url));
const SALIDA = join(RAIZ, "public/carta-estimada-carmela.pdf");
const DIST = join(RAIZ, "dist");

// Lo justo para servir lo que pide la carta.
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

// `CHROME=/ruta/al/navegador` para usar otro.
const NAVEGADORES = [
  process.env.CHROME,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

let navegadorProceso;
let servidor;
let perfil;

async function hasta(comprobar, que, ms = 20_000) {
  const limite = Date.now() + ms;
  while (Date.now() < limite) {
    const valor = await comprobar().catch(() => null);
    if (valor) return valor;
    await esperar(200);
  }
  throw new Error(`No ha llegado a tiempo: ${que}`);
}

/** Una conexión al protocolo de DevTools: `enviar(metodo, params)`. */
async function conectar(url) {
  const ws = new WebSocket(url);
  await new Promise((ok, mal) => {
    ws.onopen = ok;
    ws.onerror = mal;
  });
  let id = 0;
  const pendientes = new Map();
  ws.onmessage = ({ data }) => {
    const mensaje = JSON.parse(data);
    const pendiente = pendientes.get(mensaje.id);
    if (!pendiente) return;
    pendientes.delete(mensaje.id);
    if (mensaje.error) pendiente.mal(new Error(mensaje.error.message));
    else pendiente.ok(mensaje.result);
  };
  const enviar = (method, params = {}) =>
    new Promise((ok, mal) => {
      pendientes.set(++id, { ok, mal });
      ws.send(JSON.stringify({ id, method, params }));
    });
  return { enviar, cerrar: () => ws.close() };
}

try {
  const navegador = NAVEGADORES.find((ruta) => existsSync(ruta));
  if (!navegador) {
    throw new Error(
      "No encuentro Chrome, Brave ni Edge. Instala uno o indica cuál con CHROME=/ruta/al/navegador.",
    );
  }

  // dist/ tal cual, en un puerto libre que elige el sistema.
  servidor = createServer(async (peticion, respuesta) => {
    const { pathname } = new URL(peticion.url, "http://localhost");
    let ruta = normalize(join(DIST, decodeURIComponent(pathname)));
    if (!ruta.startsWith(DIST)) return respuesta.writeHead(403).end();
    if ((await stat(ruta).catch(() => null))?.isDirectory())
      ruta = join(ruta, "index.html");
    if (!existsSync(ruta)) return respuesta.writeHead(404).end();
    respuesta.writeHead(200, {
      "Content-Type": TIPOS[extname(ruta)] ?? "application/octet-stream",
    });
    createReadStream(ruta).pipe(respuesta);
  });
  await new Promise((ok) => servidor.listen(0, "127.0.0.1", ok));
  const pagina = `http://127.0.0.1:${servidor.address().port}/catalogo/carta/`;
  if (!(await fetch(pagina)).ok)
    throw new Error("No está /catalogo/carta en dist/: ¿ha fallado el build?");

  // Perfil de usar y tirar: nada de caché ni de extensiones del de verdad.
  perfil = await mkdtemp(join(tmpdir(), "carta-pdf-"));
  navegadorProceso = spawn(
    navegador,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${perfil}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  // Con el puerto 0 el navegador elige uno libre y lo apunta en su perfil.
  const puerto = await hasta(
    async () =>
      (await readFile(join(perfil, "DevToolsActivePort"), "utf8")).split(
        "\n",
      )[0],
    "el puerto de DevTools del navegador",
  );
  const pestanas = await hasta(
    async () => (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json(),
    "la pestaña del navegador",
  );
  const pestana = pestanas.find((p) => p.type === "page");
  const { enviar, cerrar } = await conectar(pestana.webSocketDebuggerUrl);

  await enviar("Page.enable");
  await enviar("Page.navigate", { url: pagina });
  // Fuentes (The Seasons llega de Adobe) y todas las fotos decodificadas.
  await hasta(
    async () =>
      (
        await enviar("Runtime.evaluate", {
          expression: `document.readyState === "complete" &&
            document.fonts.status === "loaded" &&
            [...document.images].every((img) => img.complete && img.naturalWidth > 0)`,
          returnByValue: true,
        })
      ).result.value,
    "las fuentes y las fotos de la carta",
    30_000,
  );

  const { data } = await enviar("Page.printToPDF", {
    preferCSSPageSize: true,
    printBackground: true,
  });
  cerrar();

  const pdf = Buffer.from(data, "base64");
  await writeFile(SALIDA, pdf);
  await writeFile(
    ARCHIVO_HUELLA,
    `${JSON.stringify({ huella: await huellaCarta() }, null, 2)}\n`,
  );
  console.log(
    `Carta en PDF: public/carta-estimada-carmela.pdf (${(pdf.length / 1024 / 1024).toFixed(1)} MB)`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  navegadorProceso?.kill();
  servidor?.close();
  // El navegador tarda un momento en soltar el perfil.
  await esperar(500);
  if (perfil) await rm(perfil, { recursive: true, force: true });
}
