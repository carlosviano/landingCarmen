// Abrir y cerrar un panel desplegable desde su botón: lo que comparten el
// calendario y el desplegable de opciones (src/lib/calendario.ts y
// src/lib/desplegable.ts).
//
// El botón lo abre y lo cierra, Escape lo cierra devolviendo el foco al
// botón, y un toque fuera lo cierra como cualquier desplegable. Qué hay
// DENTRO del panel y adónde va el foco al abrirlo es cosa de quien lo monta.

export interface Panel {
  abrir: () => void;
  /** Con `devolverFoco`, el foco vuelve al botón: para Escape y al elegir. */
  cerrar: (devolverFoco?: boolean) => void;
}

export interface OpcionesPanel {
  /** Se llama con el panel ya visible: para pintarlo y llevar el foco dentro. */
  alAbrir?: () => void;
}

export function montarPanel(
  boton: HTMLButtonElement,
  panel: HTMLElement,
  { alAbrir }: OpcionesPanel = {},
): Panel {
  const abierto = () => !panel.hidden;

  const abrir = () => {
    panel.hidden = false;
    boton.setAttribute("aria-expanded", "true");
    alAbrir?.();
  };

  const cerrar = (devolverFoco = false) => {
    panel.hidden = true;
    boton.setAttribute("aria-expanded", "false");
    if (devolverFoco) boton.focus();
  };

  boton.addEventListener("click", () => (abierto() ? cerrar() : abrir()));

  panel.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrar(true);
  });

  // En document, que sobrevive al cambio de pantalla (lib/pagina.ts): cuando
  // el panel ya no está en la página, el oyente se quita a sí mismo. Así no
  // hay que pasar la señal de la página por el calendario y el desplegable.
  const alPulsarFuera = (evento: MouseEvent) => {
    if (!panel.isConnected) {
      document.removeEventListener("click", alPulsarFuera);
      return;
    }
    const donde = evento.target as Node;
    if (abierto() && !panel.contains(donde) && !boton.contains(donde)) cerrar();
  };
  document.addEventListener("click", alPulsarFuera);

  return { abrir, cerrar };
}
