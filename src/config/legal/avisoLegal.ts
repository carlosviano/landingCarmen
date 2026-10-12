// /aviso-legal: quién está detrás de la web y en qué condiciones se usa.
//
// Lo exige el art. 10 de la LSSI (Ley 34/2002) a cualquier web de un
// negocio: nombre, NIF, domicilio, un correo de contacto directo y, si la
// actividad necesita una autorización administrativa previa, sus datos. Una
// pastelería la necesita (registro sanitario), así que va aquí también.
//
// Las condiciones de compra NO van aquí: están en /condiciones. Esto es sólo
// el uso de la web.

import { CONTACTO, TITULAR } from "../site";
import type { TextoLegal } from "@/lib/legal";

export const AVISO_LEGAL: TextoLegal = {
  antetitulo: "Aviso legal",
  titulo: "Aviso legal",
  intro:
    "Quién está detrás de esta web y las condiciones para usarla. Lo que vale para los pedidos está en las condiciones de venta.",
  actualizado: "[FECHA]",
  apartados: [
    {
      id: "titular",
      titulo: "Quién está detrás",
      contenido: [
        "Esta web es de Estimada Carmela, el obrador de repostería de:",
        {
          lista: [
            `Titular: ${TITULAR.nombre}, profesional autónoma.`,
            `NIF: ${TITULAR.nif}.`,
            `Domicilio: ${TITULAR.domicilio}.`,
            `Correo: ${TITULAR.email}.`,
            `WhatsApp: ${CONTACTO.whatsapp.visible}.`,
            `Registro sanitario: obrador inscrito con el número ${TITULAR.registroSanitario}.`,
          ],
        },
      ],
    },
    {
      id: "uso",
      titulo: "Uso de la web",
      contenido: [
        "La web es de libre acceso y sirve para conocer el obrador, consultar la carta, pedir presupuestos y hacer pedidos. Usarla supone aceptar este aviso.",
        "Te pedimos que la uses de buena fe: sin intentar dañarla ni acceder a partes que no son públicas, y sin enviar por los formularios datos de otras personas sin su permiso ni contenidos ilícitos.",
      ],
    },
    {
      id: "propiedad",
      titulo: "Fotos, textos y marca",
      contenido: [
        `Las fotos, los textos, el diseño de la web y el nombre y el logotipo de Estimada Carmela son de ${TITULAR.nombre} o se usan con permiso de quien tiene los derechos.`,
        "Puedes compartir los enlaces y mirar todo lo que quieras, pero no copiar, reproducir ni usar las fotos o los textos con fines comerciales sin permiso por escrito. Si quieres usar alguna foto, pregúntanos.",
      ],
    },
    {
      id: "enlaces",
      titulo: "Enlaces a otras webs",
      contenido: [
        "Algunos enlaces llevan a servicios de otros, como WhatsApp, Instagram o Google Maps. Lo que pasa allí depende de sus propias condiciones, y no somos responsables de su contenido.",
      ],
    },
    {
      id: "responsabilidad",
      titulo: "Responsabilidad",
      contenido: [
        "Procuramos que la información de la web sea correcta y esté al día, pero puede haber errores o cambios, sobre todo en la carta y los precios. Lo que vale para tu pedido es lo que se confirma por WhatsApp.",
        "Hacemos lo posible para que la web funcione siempre, pero puede haber cortes por mantenimiento o por causas que no dependen de nosotros.",
      ],
    },
    {
      id: "privacidad",
      titulo: "Privacidad y cookies",
      contenido: [
        [
          "Qué se hace con tus datos está en la ",
          { texto: "política de privacidad", href: "/privacidad" },
          ", y lo que guarda la web en tu navegador, en la ",
          { texto: "política de cookies", href: "/cookies" },
          ".",
        ],
      ],
    },
    {
      id: "ley",
      titulo: "Ley aplicable",
      contenido: [
        "Este aviso se rige por la ley española. Si eres consumidora, en caso de conflicto serán competentes los juzgados de tu domicilio.",
      ],
    },
  ],
};
