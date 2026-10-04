// El script del calendario de src/components/formulario/Calendario.astro.
//
// Lo comparten el pedido de la ficha de tarta y la solicitud de eventos. Lo
// único que cambia entre los dos es QUÉ días se pueden elegir (el pedido,
// sólo laborables con dos de antelación; un evento, cualquiera desde
// mañana), y eso entra por `OpcionesCalendario`: el resto —cómo se pinta y
// cómo se navega con el teclado— es uno solo. Abrir y cerrar es de
// src/lib/panel.ts, lo mismo que en el desplegable de opciones.
//
// Pinta en el navegador y no en el build: la primera fecha calculada al
// compilar se quedaría vieja al día siguiente de publicar.
import { montarPanel } from "@/lib/panel";
import { aISO, deISO, fechaCorta } from "@/lib/pedido";

export interface OpcionesCalendario {
  /**
   * El primer día que se puede elegir, en ISO. Es una función y no un valor
   * porque se vuelve a preguntar cada vez que se abre: una página abierta
   * desde ayer no puede seguir ofreciendo el día de hoy.
   */
  primera: () => string;
  /** Lo que se pide a un día además de no ser anterior a `primera`. */
  elegible?: (fecha: Date) => boolean;
  /** Se llama al elegir un día, con el panel ya cerrado. */
  alElegir?: (iso: string) => void;
}

export interface Calendario {
  /** Abre el panel y lleva el foco al día elegido (o al primero que valga). */
  abrir: () => void;
}

const DIA =
  "mx-auto grid size-10 place-items-center rounded-full text-sm tabular-nums text-black hover:bg-rust/10 disabled:text-black/25 disabled:line-through disabled:hover:bg-transparent aria-pressed:bg-rust aria-pressed:text-linen";

// Flechas: un día a los lados, una semana arriba y abajo.
const PASOS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/**
 * Monta el calendario que haya dentro de `raiz`. Busca sus piezas por los
 * `data-calendario-*` que pone el componente, así que `raiz` puede ser el
 * formulario entero.
 */
export function montarCalendario(
  raiz: ParentNode,
  { primera, elegible = () => true, alElegir }: OpcionesCalendario,
): Calendario {
  const boton = raiz.querySelector<HTMLButtonElement>("[data-calendario-boton]")!;
  const texto = raiz.querySelector<HTMLElement>("[data-calendario-texto]")!;
  const valor = raiz.querySelector<HTMLInputElement>("[data-calendario-valor]")!;
  const panel = raiz.querySelector<HTMLElement>("[data-calendario]")!;
  const titulo = panel.querySelector<HTMLElement>("[data-mes-titulo]")!;
  const dias = panel.querySelector<HTMLElement>("[data-dias]")!;
  const anterior = panel.querySelector<HTMLButtonElement>('[data-mes="-1"]')!;

  const textoInicial = texto.textContent ?? "";
  // El primer día del mes que se está viendo.
  let mes = new Date();

  const vale = (fecha: Date) => aISO(fecha) >= primera() && elegible(fecha);

  const pintar = () => {
    const primeroDelMes = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const minima = deISO(primera());
    titulo.textContent = primeroDelMes.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    // No se vuelve a meses en los que no queda ningún día elegible.
    anterior.disabled =
      primeroDelMes <= new Date(minima.getFullYear(), minima.getMonth(), 1);

    dias.replaceChildren();
    // getDay() empieza en domingo; la cuadrícula, en lunes.
    const hueco = (primeroDelMes.getDay() + 6) % 7;
    for (let i = 0; i < hueco; i++) dias.append(document.createElement("span"));

    const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= total; d++) {
      const fecha = new Date(mes.getFullYear(), mes.getMonth(), d);
      const iso = aISO(fecha);
      const dia = document.createElement("button");
      dia.type = "button";
      dia.textContent = String(d);
      dia.dataset.iso = iso;
      dia.disabled = !vale(fecha);
      dia.setAttribute(
        "aria-label",
        fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
      );
      if (iso === valor.value) dia.setAttribute("aria-pressed", "true");
      dia.className = DIA;
      dias.append(dia);
    }
  };

  const { abrir, cerrar } = montarPanel(boton, panel, {
    alAbrir: () => {
      // Se abre en el mes de la fecha elegida o, si no hay, en el de la primera.
      const base = deISO(valor.value || primera());
      mes = new Date(base.getFullYear(), base.getMonth(), 1);
      pintar();
      const foco =
        dias.querySelector<HTMLButtonElement>("[aria-pressed]") ??
        dias.querySelector<HTMLButtonElement>("button:not(:disabled)");
      foco?.focus();
    },
  });

  const elegir = (iso: string) => {
    valor.value = iso;
    texto.textContent = fechaCorta(iso);
    delete texto.dataset.vacio;
    // El <input> oculto no avisa solo: sin esto, quien escucha `change` en el
    // formulario (el WhatsApp, la validación) no se entera de la fecha.
    valor.dispatchEvent(new Event("change", { bubbles: true }));
  };

  // Un <input type="hidden"> no vuelve a vacío con el `reset` del
  // formulario: lo deja en lo último que se le puso.
  valor.form?.addEventListener("reset", () => {
    valor.value = "";
    texto.textContent = textoInicial;
    texto.dataset.vacio = "";
  });

  for (const flecha of panel.querySelectorAll<HTMLButtonElement>("[data-mes]")) {
    flecha.addEventListener("click", () => {
      mes = new Date(mes.getFullYear(), mes.getMonth() + Number(flecha.dataset.mes), 1);
      pintar();
    });
  }

  dias.addEventListener("click", (evento) => {
    const dia = (evento.target as HTMLElement).closest<HTMLButtonElement>("button[data-iso]");
    if (!dia || dia.disabled) return;
    elegir(dia.dataset.iso!);
    cerrar(true);
    alElegir?.(valor.value);
  });

  // Saltando a los días que se pueden elegir del mes que se ve.
  dias.addEventListener("keydown", (evento) => {
    const paso = PASOS[evento.key];
    const actual = (evento.target as HTMLElement).closest<HTMLButtonElement>("button[data-iso]");
    if (!paso || !actual) return;
    evento.preventDefault();
    const fecha = deISO(actual.dataset.iso!);
    for (let i = 0; i < 31; i++) {
      fecha.setDate(fecha.getDate() + paso);
      const destino = dias.querySelector<HTMLButtonElement>(`button[data-iso="${aISO(fecha)}"]`);
      if (!destino) return;
      if (!destino.disabled) return destino.focus();
    }
  });

  return { abrir };
}
