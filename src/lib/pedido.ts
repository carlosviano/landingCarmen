// Las cuentas del pedido de la ficha: qué fecha es la primera que se puede
// elegir, cómo se escribe el mensaje de WhatsApp y cómo se pinta un precio.
//
// Viven aquí y no en el componente porque las usan LAS DOS PUNTAS: el
// servidor, para el `href` y el total que salen del build (lo que ve quien no
// tiene JS), y el script del cliente, para rehacerlos al cambiar el
// formulario. Escritas dos veces, el mensaje del build y el del navegador
// acabarían diciendo cosas distintas.
import { PEDIDO, PRECIOS_PROVISIONALES } from "@/config/pedido";

/** Lunes a viernes. Es lo único que se entrega: fines de semana, no. */
export function esLaborable(fecha: Date): boolean {
  const dia = fecha.getDay();
  return dia !== 0 && dia !== 6;
}

/**
 * La primera fecha de entrega posible desde `hoy`: se cuentan
 * `PEDIDO.diasAntelacion` días laborables hacia delante, y el último de ellos
 * es la fecha. Con dos: el lunes da miércoles, el viernes da martes, y el
 * sábado y el domingo también dan martes.
 */
export function fechaMinima(hoy: Date = new Date()): Date {
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let contados = 0;
  while (contados < PEDIDO.diasAntelacion) {
    fecha.setDate(fecha.getDate() + 1);
    if (esLaborable(fecha)) contados++;
  }
  return fecha;
}

/**
 * Fecha → "2026-10-01", el formato de `<input type="date">`. A mano y no con
 * `toISOString()`, que pasa a UTC y de madrugada devuelve el día anterior.
 */
export function aISO(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** "2026-10-01" → fecha local. `new Date("2026-10-01")` la leería en UTC. */
export function deISO(iso: string): Date {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio!, mes! - 1, dia!);
}

/** "jueves, 1 de octubre": como se diría en el mensaje. */
export function fechaLarga(iso: string): string {
  return deISO(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** "mié, 30 sept": la que cabe en el botón del calendario en un móvil. */
export function fechaCorta(iso: string): string {
  return deISO(iso).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Por qué una fecha no vale, o `null` si vale. El calendario ya apaga los días
 * que no valen, pero la regla vive aquí: es lo que para el pedido si la fecha
 * falta o se ha quedado vieja (la ficha abierta desde ayer).
 */
export function problemaFecha(iso: string, hoy: Date = new Date()): string | null {
  if (!iso) return "Elige una fecha de entrega para poder pedirla.";
  const minima = aISO(fechaMinima(hoy));
  if (iso < minima) {
    return `Hacen falta ${PEDIDO.antelacion} de antelación: a partir del ${fechaLarga(minima)}.`;
  }
  if (!esLaborable(deISO(iso))) {
    return "Sólo se entrega de lunes a viernes. Elige otro día.";
  }
  return null;
}

/**
 * Euros → texto: "28 €". Entre corchetes mientras los precios sean de relleno
 * (`PRECIOS_PROVISIONALES`), igual que el resto de datos pendientes del sitio.
 */
export function precioVisible(euros: number): string {
  const texto = `${euros.toLocaleString("es-ES")} €`;
  return PRECIOS_PROVISIONALES ? `[${texto}]` : texto;
}

export interface DetallePedido {
  personas?: string;
  cantidad?: number;
  /** "2026-10-01". */
  fecha?: string;
}

/**
 * El mensaje que se abre en WhatsApp. Sólo con el nombre es el de siempre; con
 * el detalle, dice tamaño, cantidad y fecha. La cantidad es orientativa: la
 * confirma Carmen hablando con el cliente, así que no tiene máximo.
 */
export function mensajePedido(nombre: string, detalle: DetallePedido = {}): string {
  const { personas, cantidad = 1, fecha } = detalle;
  if (!personas && !fecha) return `Hola Carmen, quería pedir la tarta «${nombre}».`;

  const cuantas = cantidad === 1 ? "una tarta" : `${cantidad} tartas`;
  const para = personas ? ` para ${personas} personas` : "";
  const cuando = fecha ? `, para el ${fechaLarga(fecha)}` : "";
  return `Hola Carmen, quería pedir ${cuantas} «${nombre}»${para}${cuando}.`;
}
