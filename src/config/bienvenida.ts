// El modal de bienvenida.

import { PEDIDO } from "./pedido";
import { CONTACTO, HORARIO } from "./site";

/** Un punto de "Así trabajamos": icono, titular y una línea de detalle. */
export interface PuntoBienvenida {
  /** Nombre de icono de Iconify, p. ej. "lucide:clock". */
  icono: string;
  titulo: string;
  detalle: string;
  /**
   * Lo que se lee en móvil, en una sola línea. Allí no hay sitio para
   * titular más detalle, así que cada punto se queda en esto. Si falta, sale
   * `titulo`.
   */
  corto?: string;
  /** El detalle también se ve en móvil. Sólo la dirección lo necesita. */
  detalleEnMovil?: boolean;
}

// El modal que ve quien entra por primera vez. Cuenta lo que cambia cómo se
// encarga (que no hay envíos, cuándo se recoge, con cuánto plazo y dónde) y
// nada más: es lo que alguien que llega de Instagram no sabe y le hace falta
// antes de pedir.
//
// El horario, el plazo y la dirección salen de las constantes de arriba: si
// cambian allí, cambian aquí solos.
const LABORABLES = HORARIO[0];

export const BIENVENIDA = {
  antetitulo: "Bienvenida",
  titulo: "Así trabajamos",
  // Va sobre la ilustración, sólo en escritorio: en móvil la imagen es una
  // franja y la nota taparía justo el toldo.
  pista: {
    antes: "Busca el ",
    resaltado: "toldo rojo",
    despues: " en la primera planta, encima del bajo comercial.",
  },
  fotoAlt:
    "Ilustración de la fachada: un toldo rojo con el nombre Estimada Carmela sobre el ventanal de la primera planta, con el rótulo Pastelería.",
  puntos: [
    {
      icono: "lucide:shopping-bag",
      titulo: "Solo recogida",
      detalle: "No hacemos envíos: los pedidos se recogen en el obrador.",
    },
    {
      icono: "lucide:clock",
      titulo: "Horario de recogida",
      detalle: `${LABORABLES.dias}, ${LABORABLES.horas}`,
      // Sin "Recogida de" delante: con la fuente del sistema parte en dos
      // líneas a 390px, y el punto de arriba ya dice que es recogida.
      corto: `${LABORABLES.dias}, ${LABORABLES.horas}`,
    },
    {
      icono: "lucide:calendar",
      titulo: `${PEDIDO.antelacion[0].toUpperCase()}${PEDIDO.antelacion.slice(1)} de antelación`,
      detalle: "Todo se hace por encargo. Un pedido del viernes sale el martes.",
    },
    {
      icono: "lucide:map-pin",
      titulo: `${CONTACTO.titular} · ${CONTACTO.ciudad}`,
      detalle: CONTACTO.detalle,
      detalleEnMovil: true,
    },
  ] satisfies PuntoBienvenida[],
  boton: "Entendido",
} as const;
