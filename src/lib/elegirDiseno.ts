// Llevar al formulario de /personalizadas con un diseño ya marcado, sin
// recargar la página.
//
// Las tarjetas enlazan a `?diseno=<slug>#solicitud`, que sin JS es lo que
// vale. Pero seguir ese enlace es navegar: la página se recarga, arranca
// arriba del todo y SALTA al formulario. Con JS esto hace lo mismo sin salir
// de la página: marca el radio, apunta el diseño en la URL (para que una
// recarga lo conserve) y baja al formulario con el scroll suave del <html>.

/** Marca `slug` en el campo "Diseño" y baja al formulario. */
export function elegirDiseno(slug: string): void {
  const form = document.querySelector<HTMLFormElement>('[data-solicitud="especial"]');
  const radio = form?.querySelector<HTMLInputElement>(
    `input[name="diseno"][value="${CSS.escape(slug)}"]`,
  );
  if (!form || !radio) return;

  radio.checked = true;
  // Para que `montarSolicitud` rehaga el WhatsApp y quite el error del campo.
  form.dispatchEvent(new Event("change"));

  const url = new URL(location.href);
  url.searchParams.set("diseno", slug);
  url.hash = "solicitud";
  history.replaceState(history.state, "", url);

  document.getElementById("solicitud")?.scrollIntoView();
  // El foco, en lo que se acaba de marcar, sin cortar el scroll.
  radio.focus({ preventScroll: true });
}

/**
 * Engancha `alPulsar` al clic de un enlace, salvo que se abra aparte
 * (cmd/ctrl/shift o botón central): ahí el enlace sigue siendo un enlace.
 */
export function alPulsarEnlace(enlace: HTMLAnchorElement, alPulsar: () => void): void {
  enlace.addEventListener("click", (evento) => {
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
      return;
    }
    evento.preventDefault();
    alPulsar();
  });
}
