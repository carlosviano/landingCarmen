// /privacidad: la política de privacidad (RGPD y LOPDGDD).
//
// El RGPD pide informar en dos capas: una corta donde se dan los datos y la
// completa a la que enlaza. Viven las dos aquí —`AVISO_FORMULARIO` es la
// corta, la pinta MarcoSolicitud.astro— para que no puedan contradecirse.
//
// Cuatro decisiones que no se ven a simple vista:
//
//  - La base de las solicitudes y los pedidos NO es el consentimiento sino el
//    art. 6.1.b (lo pide la propia clienta para encargar). Si fuera el
//    consentimiento, retirarlo obligaría a dejar de atender un pedido a medias.
//
//  - Las alergias son datos de salud (art. 9). El formulario las pide en el
//    texto libre y en WhatsApp salen solas, así que hace falta consentimiento
//    EXPLÍCITO: es lo que recoge ahora la casilla del formulario.
//
//  - El formulario todavía no envía (envio: null en eventos.ts y
//    personalizadas.ts). El texto da por hecho el montaje previsto: una Pages
//    Function de Cloudflare que lo reenvía al correo de Carmela. Si al final
//    se quitan los formularios, sobran el apartado "Solicitudes de
//    presupuesto", Cloudflare como encargado del formulario y AVISO_FORMULARIO.
//
//  - Facturas: seis años, por el Código de Comercio (art. 30), que es el más
//    largo de los plazos que obligan a una autónoma; los fiscales son cuatro.

import { TITULAR } from "../site";
import type { TextoLegal } from "@/lib/legal";

// TODO: datos de Carmela. Quién le da el correo (Gmail es Google Ireland,
// Outlook es Microsoft Ireland…) y si lleva las cuentas una gestoría.
const PROVEEDOR_CORREO =
  "[PROVEEDOR DE CORREO, p. ej. Google Ireland Ltd. (Gmail)]";
const GESTORIA = "[GESTORÍA, si la hay]";
const PLAZO_SOLICITUDES = "[PLAZO, p. ej. un año]";

export const PRIVACIDAD: TextoLegal = {
  antetitulo: "Privacidad",
  titulo: "Política de privacidad",
  intro:
    "Qué datos tuyos se tratan cuando pides un presupuesto, haces un pedido o visitas esta web, para qué, cuánto tiempo se guardan y cómo puedes decidir sobre ellos.",
  actualizado: "[FECHA]",
  apartados: [
    {
      id: "responsable",
      titulo: "Quién es la responsable",
      contenido: [
        `${TITULAR.nombre}, que trabaja como Estimada Carmela, con NIF ${TITULAR.nif} y domicilio en ${TITULAR.domicilio}.`,
        `Para cualquier cosa sobre tus datos: ${TITULAR.email}.`,
      ],
    },
    {
      id: "finalidades",
      titulo: "Qué datos, para qué y con qué base",
      contenido: [
        "Solicitudes de presupuesto. Los formularios de personalizadas y de eventos piden tu nombre, teléfono y email, y los datos del encargo: fecha, ocasión, número de personas, lugar, tu idea y, si las añades, fotos de inspiración y un enlace. Sirven para responderte y prepararte el presupuesto. La base es que lo pides tú: son los pasos previos a un posible contrato (artículo 6.1.b del RGPD).",
        "Pedidos. Si encargas, por WhatsApp o tras un presupuesto, se usan tu nombre, tu teléfono y los datos del pedido para prepararlo, confirmarlo y entregártelo. La base es el contrato (artículo 6.1.b).",
        "Alergias e intolerancias. Si nos cuentas alguna tuya o de quien vaya a comer la tarta, es un dato de salud. Sólo se usa para preparar tu pedido sin ese alérgeno y la base es tu consentimiento explícito (artículo 9.2.a): lo das al marcar la casilla del formulario o al contárnoslo por WhatsApp para tu pedido.",
        "Facturas y cuentas. Si pides factura o pagas por transferencia, tus datos de pago y fiscales se guardan porque lo exige la ley (artículo 6.1.c).",
        "Fotos de eventos. Si apareces de forma reconocible en una foto de un montaje, sólo se publica en la web o en redes si lo has autorizado por escrito. La base es ese consentimiento (artículo 6.1.a), y puedes retirarlo cuando quieras: la foto se quita.",
        "Visitas a la web. Al cargar la página, tu navegador manda tu dirección IP al servidor que la aloja (Cloudflare) y al que sirve la tipografía de los titulares (Adobe Fonts). No se usa para saber quién eres ni para hacer perfiles, sólo para servirte la página y protegerla de abusos. La base es el interés legítimo en que la web funcione y sea segura (artículo 6.1.f).",
        "Ningún dato se usa para mandarte publicidad, y no se toman decisiones automáticas sobre ti.",
      ],
    },
    {
      id: "obligatorios",
      titulo: "Qué datos son obligatorios",
      contenido: [
        "En los formularios, los campos marcados como obligatorios. Sin ellos no podemos responderte ni preparar el presupuesto. Lo demás es opcional.",
      ],
    },
    {
      id: "conservacion",
      titulo: "Cuánto tiempo se guardan",
      contenido: [
        {
          lista: [
            `Solicitudes que no acaban en pedido: ${PLAZO_SOLICITUDES} desde la última vez que hablamos, por si retomas el encargo. Después se borran.`,
            "Pedidos: mientras dure el encargo y, después, lo necesario para atender reclamaciones o garantías.",
            "Facturas y datos contables: seis años, el plazo que exigen las normas mercantiles y fiscales.",
            "Alergias: sólo mientras se prepara tu pedido.",
            "Fotos de eventos: mientras no retires tu autorización.",
          ],
        },
      ],
    },
    {
      id: "destinatarios",
      titulo: "Quién más ve tus datos",
      contenido: [
        "No se ceden a nadie, salvo cuando lo exige la ley (por ejemplo, a Hacienda).",
        "Para funcionar, la web y el obrador usan algunos servicios que tratan datos por encargo de Estimada Carmela, sólo para prestar su servicio y con contrato que los obliga a protegerlos:",
        {
          lista: [
            "Cloudflare, Inc.: aloja la web y hace llegar los formularios.",
            `${PROVEEDOR_CORREO}: el correo donde llegan las solicitudes.`,
            `${GESTORIA}: lleva la contabilidad y ve los datos de facturación.`,
          ],
        },
        "Si nos escribes por WhatsApp, la conversación pasa por WhatsApp, de Meta Platforms Ireland Ltd., que trata tus datos según sus propias condiciones, las que aceptaste al usar la aplicación. Adobe recibe tu IP al servir la tipografía, según su propia política de privacidad.",
      ],
    },
    {
      id: "transferencias",
      titulo: "Datos fuera de la Unión Europea",
      contenido: [
        "Cloudflare y Adobe son empresas de Estados Unidos y pueden tratar datos allí. Están adheridas al Marco de Privacidad de Datos UE-EE. UU., que la Comisión Europea reconoce como una protección equivalente a la europea.",
      ],
    },
    {
      id: "menores",
      titulo: "Menores",
      contenido: [
        "Para enviar una solicitud o hacer un pedido tienes que tener al menos 14 años (artículo 7 de la Ley Orgánica 3/2018). Si eres menor, pídele a una persona adulta que lo haga por ti.",
      ],
    },
    {
      id: "derechos",
      titulo: "Tus derechos",
      contenido: [
        "Puedes pedir en cualquier momento:",
        {
          lista: [
            "ver qué datos tuyos se tienen (acceso);",
            "corregirlos si están mal (rectificación);",
            "que se borren (supresión);",
            "que se dejen de usar mientras se resuelve una duda (limitación);",
            "que no se usen para algo concreto (oposición);",
            "recibirlos en un formato que puedas llevarte (portabilidad);",
            "retirar un consentimiento que hayas dado, sin que afecte a lo que se hizo antes.",
          ],
        },
        `Escribe a ${TITULAR.email} diciendo qué derecho quieres ejercer y con algún dato que permita reconocerte. Te responderemos en un mes como máximo.`,
        [
          "Si crees que tus datos no se han tratado bien, puedes reclamar ante la ",
          {
            texto: "Agencia Española de Protección de Datos",
            href: "https://www.aepd.es",
          },
          ".",
        ],
      ],
    },
    {
      id: "cambios",
      titulo: "Cambios en esta política",
      contenido: [
        "Si cambia algo de lo que dice esta página, se actualizará aquí con su fecha. Si el cambio afecta a algo que ya consentiste, te lo preguntaremos de nuevo.",
      ],
    },
  ],
};

/**
 * La primera capa, pegada a los formularios: quién, para qué, con qué base,
 * a quién se comunica y dónde ejercer los derechos. Lo demás, en /privacidad.
 */
export const AVISO_FORMULARIO = {
  casilla: {
    antes: "He leído la ",
    privacidad: "política de privacidad",
    entre: " y las ",
    condiciones: "condiciones de venta",
    despues:
      " y, si menciono alergias o intolerancias, consiento que se usen para preparar mi presupuesto.",
  },
  resumen: `Responsable: ${TITULAR.nombre} (Estimada Carmela). Finalidad: responder a tu solicitud y prepararte un presupuesto. Base: que lo pides tú y, para las alergias, tu consentimiento. Destinatarios: nadie, salvo obligación legal; Cloudflare y el proveedor de correo lo hacen llegar. Derechos: acceder, rectificar, suprimir y los demás, en ${TITULAR.email}.`,
} as const;
