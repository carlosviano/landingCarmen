// /condiciones: las condiciones de venta.
//
// Las que mandan en un pedido: cómo se cierra, cuánto se paga y cuándo, qué
// pasa si se cancela y por qué no hay derecho de desistimiento. La web no
// cobra (todo se cierra por WhatsApp), pero vende a distancia, así que la ley
// de consumidores (TRLGDCU, RD Leg. 1/2007) pide tener esto escrito y a mano
// antes de que se haga el pedido.
//
// Se habla de "anticipo" y nunca de "señal" ni de "arras": en el Código Civil
// (art. 1454) las arras tienen sus propias consecuencias al cancelar, y aquí
// las consecuencias son las que dice el apartado de cancelaciones, ni más ni
// menos.
//
// TODO: los plazos de cancelación (48 horas, 7 y 30 días) son una propuesta
// pendiente de que la valide Carmela. Lo demás entre corchetes son datos
// suyos.

import { HORARIO, TITULAR, CONTACTO, DIRECCION } from "../site";
import { PEDIDO } from "../pedido";
import type { TextoLegal } from "@/lib/legal";

const horario = HORARIO.filter(({ horas }) => horas !== "Cerrado")
  .map(({ dias, horas }) => `${dias.toLowerCase()}, de ${horas}`)
  .join("; ");

export const CONDICIONES: TextoLegal = {
  antetitulo: "Condiciones de venta",
  titulo: "Condiciones de venta",
  intro:
    "Cómo se hace un pedido, cómo se paga, qué pasa si hay que cancelarlo y lo que conviene saber antes de encargar. Están escritas para que se entiendan; si algo no queda claro, pregúntalo antes de pedir.",
  actualizado: "[FECHA]",
  apartados: [
    {
      id: "quien-vende",
      titulo: "Quién vende",
      contenido: [
        `Estimada Carmela es el obrador de repostería de ${TITULAR.nombre}, con NIF ${TITULAR.nif}, en ${TITULAR.domicilio}, inscrito en el registro sanitario con el número ${TITULAR.registroSanitario}.`,
        [
          `Puedes escribir a ${TITULAR.email} o por WhatsApp al ${CONTACTO.whatsapp.visible}. El resto de datos están en el `,
          { texto: "aviso legal", href: "/aviso-legal" },
          ".",
        ],
        "Estas condiciones valen para las tres formas de encargar: las tartas de la carta, las personalizadas y los eventos. Lo que sólo afecta a una lo dice su apartado. Se aplican las que estén publicadas el día en que se confirma tu pedido.",
      ],
    },
    {
      id: "pedidos",
      titulo: "Cómo se hace un pedido",
      contenido: [
        "La web no vende por sí sola: los pedidos se hacen por WhatsApp. El botón de cada tarta abre la conversación con un mensaje ya escrito, y no se envía nada hasta que lo mandas tú.",
        "Tu mensaje es una petición, no un pedido cerrado. El pedido queda confirmado cuando te respondemos por WhatsApp con un resumen: qué tarta, tamaño, cantidad, precio, día de recogida y, si lo hay, el anticipo. Guarda ese mensaje: es la confirmación de tu pedido.",
        "Las personalizadas y los eventos empiezan con una solicitud de presupuesto, por el formulario de la web o por WhatsApp. Esa solicitud es una consulta, no una reserva: la fecha no queda apartada hasta que aceptas el presupuesto y pagas el anticipo.",
        "Si al revisar tu petición vemos que no podemos atenderla (la fecha está completa o no da tiempo), te lo decimos y no se cierra ningún pedido.",
      ],
    },
    {
      id: "precios",
      titulo: "Precios",
      contenido: [
        "El precio de cada tarta de la carta está en su ficha, según el tamaño, e incluye el IVA. No hay gastos de envío porque no se hacen envíos.",
        "Las personalizadas y los eventos van a presupuesto. El presupuesto dice el precio total con IVA, qué incluye y hasta cuándo vale: [N] días desde que te lo enviamos. Pasado ese plazo, puede cambiar.",
        "El precio de un pedido confirmado no cambia. Si en la web hubiera un error evidente en un precio, te avisaríamos antes de confirmar.",
      ],
    },
    {
      id: "plazos",
      titulo: "Plazos y fechas",
      contenido: [
        {
          lista: [
            `Carta: se pide con al menos ${PEDIDO.antelacion} de antelación y se recoge de lunes a viernes.`,
            "Personalizadas: se pide con al menos [N] días laborables de antelación y se recoge de lunes a viernes.",
            "Eventos: la fecha se confirma con el presupuesto. Con poca antelación puede no haber hueco.",
          ],
        },
        "El obrador cierra los festivos [FESTIVOS EN QUE CIERRA]. Esos días no se recogen pedidos.",
      ],
    },
    {
      id: "pago",
      titulo: "Pago",
      contenido: [
        {
          lista: [
            "Tartas de la carta: se pagan enteras al recogerlas.",
            "Tartas personalizadas: un anticipo del 50 % del presupuesto al confirmar el pedido, y el 50 % restante al recogerla.",
            "Eventos: un anticipo del 50 % del presupuesto al aceptarlo, y el resto el día del evento.",
          ],
        },
        "El anticipo es un pago a cuenta: se descuenta del total. Lo que pasa con él si se cancela el pedido lo dice el apartado de cancelaciones.",
        "Se puede pagar con [BIZUM / TRANSFERENCIA / EFECTIVO / TARJETA]. La web no cobra nada ni pide datos de pago.",
        "Si necesitas factura, pídela al hacer el pedido y danos tus datos fiscales.",
      ],
    },
    {
      id: "recogida",
      titulo: "Recogida",
      contenido: [
        `No hacemos envíos. Los pedidos de la carta y las personalizadas se recogen en el obrador, en ${DIRECCION.calle} (${DIRECCION.portal.toLowerCase()}), ${DIRECCION.ciudad}, el día acordado y en horario de apertura: ${horario}.`,
        "Puede recogerlo otra persona por ti: basta con que diga a nombre de quién está el pedido.",
        "Revisa la tarta al recogerla. Desde ese momento, el transporte y la conservación corren de tu cuenta. Al entregártela te diremos cómo guardarla y en cuánto tiempo consumirla.",
        "Si no vienes el día acordado y no nos has avisado, la tarta no puede guardarse para otro día, porque es un producto fresco. En las personalizadas, el anticipo no se devuelve. En la carta, la próxima vez podemos pedirte que pagues por adelantado.",
      ],
    },
    {
      id: "cancelaciones",
      titulo: "Si cancelas o cambias tu pedido",
      contenido: [
        "Puedes cancelar o cambiar tu pedido escribiéndonos por WhatsApp. Cuenta el día en que nos llega tu mensaje.",
        {
          lista: [
            "Carta: cancelar no tiene coste. Avísanos con al menos 48 horas: a partir de ahí la tarta ya está empezada.",
            "Personalizadas: si quedan 7 días naturales o más hasta la recogida, te devolvemos el anticipo entero. Si quedan menos, el anticipo no se devuelve: cubre el diseño, los ingredientes y materiales ya comprados y el tiempo que se ha reservado para tu tarta.",
            "Eventos: si quedan 30 días naturales o más hasta el evento, te devolvemos el anticipo entero. Si quedan menos, el anticipo no se devuelve, por la misma razón.",
          ],
        },
        "Los cambios de sabor, tamaño o fecha se aceptan si hay hueco y da tiempo. Si cambian el precio, te lo diremos antes. Si cambias la fecha con el mismo margen con el que podrías cancelar sin coste, el anticipo pasa al pedido nuevo.",
        "Cuando toque devolver dinero, lo haremos por el mismo medio con el que pagaste y en 14 días como máximo.",
      ],
    },
    {
      id: "si-no-podemos",
      titulo: "Si no podemos servir tu pedido",
      contenido: [
        "Si por enfermedad, una avería u otra causa no podemos preparar un pedido ya confirmado, te avisaremos en cuanto lo sepamos y podrás elegir: pasarlo a otra fecha o que te devolvamos todo lo que hayas pagado, en 14 días como máximo.",
      ],
    },
    {
      id: "desistimiento",
      titulo: "Derecho de desistimiento",
      contenido: [
        "La ley da 14 días para desistir de muchas compras a distancia, pero no de estas. El derecho de desistimiento no se aplica a los productos que pueden deteriorarse o caducar con rapidez, ni a los hechos según las indicaciones del cliente o claramente personalizados (artículo 103, letras c y d, de la Ley General para la Defensa de los Consumidores y Usuarios). Una tarta es las dos cosas.",
        "Lo que puedes hacer si cambias de idea es lo que dice el apartado de cancelaciones.",
      ],
    },
    {
      id: "alergenos",
      titulo: "Alérgenos",
      contenido: [
        "La ficha de cada tarta de la carta indica los alérgenos que lleva, de los catorce que la normativa europea obliga a declarar (Reglamento (UE) 1169/2011). En las personalizadas y los eventos, te los indicamos con el presupuesto.",
        "En el obrador se trabaja con todos ellos, así que cualquier tarta puede contener trazas de alérgenos que no lleva en su receta. No podemos garantizar una tarta libre de un alérgeno.",
        "Si tú o alguien que vaya a comerla tiene una alergia o intolerancia, dínoslo al hacer el pedido. Y si tienes dudas, pregunta antes de pedir.",
      ],
    },
    {
      id: "aspecto",
      titulo: "Fotos y aspecto",
      contenido: [
        "Cada tarta se hace a mano: puede variar un poco respecto a las fotos en forma, color o decoración, y la fruta de temporada depende de la que haya. Los sabores, el tamaño y lo que lleva son los que pediste.",
        "En las personalizadas, las fotos de inspiración que nos envíes son una referencia, no un modelo que se copia exacto. No reproducimos marcas, personajes ni otros diseños protegidos sin permiso de quien tenga los derechos.",
      ],
    },
    {
      id: "eventos",
      titulo: "Eventos",
      contenido: [
        "El presupuesto de un evento detalla qué se sirve, la hora del montaje, el precio y qué incluye: [TRANSPORTE, MONTAJE Y RECOGIDA DEL MATERIAL]. Lo que no aparezca en él no está incluido.",
        "Para montar necesitamos acceder al lugar a la hora acordada y [QUÉ TIENE QUE PONER EL LUGAR: ESPACIO, MESA, ENCHUFE…]. Si el acceso se retrasa o el lugar no reúne lo acordado por causas ajenas a nosotros, adaptaremos el montaje lo mejor posible.",
        "Una vez entregado el montaje, la conservación de los dulces durante el evento corre de tu cuenta o de la del lugar.",
        "[MATERIAL PRESTADO: CUÁNDO SE RECOGE Y QUÉ PASA SI SE ROMPE O SE PIERDE.]",
        [
          "Sólo publicamos fotos del montaje en las que se reconozca a alguien si esa persona lo ha autorizado por escrito. Más en la ",
          { texto: "política de privacidad", href: "/privacidad" },
          ".",
        ],
      ],
    },
    {
      id: "reclamaciones",
      titulo: "Reclamaciones",
      contenido: [
        `Si algo no está bien, dínoslo en cuanto puedas, mejor al recoger la tarta, por WhatsApp o en ${TITULAR.email}, con una foto si es posible. Te responderemos en un mes como máximo.`,
        "Estas condiciones no recortan tus derechos de garantía como consumidora.",
        [
          `Tienes a tu disposición hojas de quejas y reclamaciones de la Junta de Andalucía: en papel en el obrador (${TITULAR.domicilio}) y en formato electrónico. Puedes pedírnosla o presentarla a través de `,
          { texto: "Consumo Responde", href: "https://www.consumoresponde.es" },
          ", el servicio de consumo de la Junta.",
        ],
      ],
    },
    {
      id: "ley",
      titulo: "Ley aplicable",
      contenido: [
        "Estas condiciones se rigen por la ley española. Si surgiera un conflicto que no pudiéramos resolver hablando, serán competentes los juzgados de tu domicilio.",
      ],
    },
  ],
};
