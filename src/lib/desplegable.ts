// El script del desplegable de src/components/formulario/Desplegable.astro.
//
// Abrir y cerrar es de src/lib/panel.ts, lo mismo que en el calendario. Aquí
// sólo va lo de la lista: llevar el foco a la opción elegida al abrir,
// moverse con las flechas y apuntar lo elegido en el <input> oculto.
import { montarPanel } from "@/lib/panel";

// Teclas de la lista: a qué opción saltan, contando desde la que tiene el foco.
const SALTOS: Record<string, (actual: number, total: number) => number> = {
  ArrowDown: (actual, total) => Math.min(actual + 1, total - 1),
  ArrowUp: (actual) => Math.max(actual - 1, 0),
  Home: () => 0,
  End: (_, total) => total - 1,
};

/** Monta el desplegable cuyo contenedor (`[data-desplegable]`) es `raiz`. */
export function montarDesplegable(raiz: HTMLElement): void {
  const boton = raiz.querySelector<HTMLButtonElement>("[data-desplegable-boton]")!;
  const texto = raiz.querySelector<HTMLElement>("[data-desplegable-texto]")!;
  const valor = raiz.querySelector<HTMLInputElement>("[data-desplegable-valor]")!;
  const lista = raiz.querySelector<HTMLElement>("[data-desplegable-lista]")!;
  const opciones = [...lista.querySelectorAll<HTMLButtonElement>("[role=option]")];

  const textoInicial = texto.textContent ?? "";

  const { cerrar } = montarPanel(boton, lista, {
    alAbrir: () => {
      const elegida = opciones.find((o) => o.getAttribute("aria-selected") === "true");
      (elegida ?? opciones[0])?.focus();
    },
  });

  const marcar = (elegida: string) => {
    for (const opcion of opciones) {
      opcion.setAttribute("aria-selected", String(opcion.dataset.valor === elegida));
    }
  };

  for (const opcion of opciones) {
    opcion.addEventListener("click", () => {
      valor.value = opcion.dataset.valor!;
      texto.textContent = opcion.dataset.valor!;
      delete texto.dataset.vacio;
      marcar(valor.value);
      cerrar(true);
      // El <input> oculto no avisa solo: sin esto, quien escucha `change` en
      // el formulario (el WhatsApp, la validación) no se entera.
      valor.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  lista.addEventListener("keydown", (evento) => {
    const saltar = SALTOS[evento.key];
    if (!saltar) return;
    evento.preventDefault();
    const actual = opciones.indexOf(document.activeElement as HTMLButtonElement);
    opciones[saltar(actual, opciones.length)]?.focus();
  });

  // Un <input type="hidden"> no vuelve a vacío con el `reset` del formulario.
  valor.form?.addEventListener("reset", () => {
    valor.value = "";
    texto.textContent = textoInicial;
    texto.dataset.vacio = "";
    marcar("");
  });
}
