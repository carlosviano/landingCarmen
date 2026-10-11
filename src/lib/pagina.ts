// Montar los scripts de la página con las transiciones de Astro (el
// <ClientRouter /> de Layout.astro).
//
// Con el router, cambiar de pantalla NO recarga: Astro trae la página nueva,
// cambia el <body> y anima el paso. Eso rompe el supuesto de todos los
// <script> del sitio, que corrían una vez al cargar y buscaban sus piezas en
// el DOM: un script ya ejecutado no se vuelve a ejecutar, así que al llegar a
// otra pantalla sus botones se quedarían muertos.
//
// Por eso todo script de componente monta su trabajo con esto en vez de
// correr suelto:
//
//   alCargarPagina((senal) => {
//     for (const x of document.querySelectorAll("[data-x]")) { ... }
//   });
//
// Corre en la carga inicial y después de cada cambio de pantalla.
//
// `senal` se aborta al irse de la pantalla. Hay que pasarla a todo lo que se
// cuelgue de algo que SOBREVIVE al cambio (document, window, un matchMedia) o
// que no se suelta solo (un observer):
//
//   document.addEventListener("keydown", ..., { signal: senal });
//
// Sin ella, cada visita a la pantalla añadiría otro oyente igual, que además
// apuntaría a piezas que ya no están. Lo que se cuelga de elementos de la
// propia página no la necesita: se va con ellos.
export function alCargarPagina(montar: (senal: AbortSignal) => void): void {
  document.addEventListener("astro:page-load", () => {
    const control = new AbortController();
    document.addEventListener("astro:before-swap", () => control.abort(), {
      once: true,
    });
    montar(control.signal);
  });
}
