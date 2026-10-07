// La pantalla de "estamos preparando la tienda" que se ve en producción hasta
// la apertura. Mientras `enProduccion` siga en true, `main` publica SOLO esta
// pantalla, en todas las rutas; staging, las previews y el local siguen viendo
// la web entera. Quién decide qué rama la ve: src/lib/proximamente.ts.
//
// Abrir la web es poner `enProduccion` a false en un PR y mergearlo a main.
// No se apaga sola el día de la fecha: el sitio es estático y nadie lo vuelve
// a construir a medianoche.

/** El h1. `destacado`, si lo hay, sale detrás y en rust. */
interface Titular {
  antes: string;
  destacado?: string;
}

export const PROXIMAMENTE = {
  enProduccion: true,
  titular: { antes: "Próximamente" } as Titular,
  entradilla:
    "Deseando estar en tus cumpleaños, celebraciones y eventos más especiales",
  apertura: {
    antetitulo: "Abrimos el",
    texto: "12 de octubre de 2026",
    // Para el datetime del <time>. Va aparte del texto para no tener que
    // parsear castellano.
    iso: "2026-10-12",
  },
  pie: "Alta pastelería por encargo · Málaga",
} as const;
