// Lo que se enseña cuando algo falla: la página 404, el aviso de que no se
// ha podido cargar una pantalla, el de que no ha salido un formulario y la
// ayuda para cuando WhatsApp no se abre.
//
// Las cuatro cosas persiguen lo mismo: que quien quiere encargar algo no se
// quede sin camino. Por eso ninguna es un callejón: la 404 lleva a los tres
// servicios, los avisos dejan reintentar, el del formulario pasa la
// solicitud entera a WhatsApp y la ayuda de WhatsApp da el mensaje ya
// escrito para copiarlo.

import { CONTACTO } from "./site";

// La 404. Las fotos y las leyendas de La carta y Personalizadas son las del
// escaparate de la portada (ESCAPARATE, en portada.ts); la de eventos, la de
// ESCAPARATE_EVENTOS. Aquí sólo va lo que es propio de esta página.
export const NO_ENCONTRADA = {
  titulo: "Página no encontrada",
  titular: "Esta página no existe",
  texto:
    "Puede que el enlace esté mal escrito o que la página ya no esté. Las tartas, en cambio, siguen aquí: elige por dónde seguir.",
  volver: "Volver al inicio",
  /** El escaparate de eventos no tiene leyenda corta: su pie es otro. */
  leyendaEventos: "Mesas dulces · bodas",
} as const;

// El aviso que sale cuando, al cambiar de pantalla, la página nueva no llega
// (sin cobertura, por lo normal). Ver AvisoCarga.astro.
export const AVISO_CARGA = {
  /** `destino` es "la carta", "Eventos"... o "la página" si no se sabe. */
  titulo: (destino: string) => `No hemos podido abrir ${destino}`,
  texto:
    "Parece que la conexión ha fallado. Vuelve a intentarlo en un momento.",
  reintentar: "Reintentar",
  cerrar: "Cerrar aviso",
} as const;

// El aviso de que una solicitud no ha podido enviarse (sin conexión, o el
// correo no ha salido). Ver formulario/FalloEnvio.astro.
export const FALLO_ENVIO = {
  titulo: "No se ha podido enviar tu solicitud",
  texto:
    "No se ha perdido nada de lo que has escrito. Vuelve a intentarlo o mándamela por WhatsApp: va ya escrita.",
  reintentar: "Reintentar",
  whatsapp: "Enviarla por WhatsApp",
} as const;

// La ayuda de WhatsApp (AyudaWhatsapp.astro). Sale DESPUÉS de pulsar un
// botón de WhatsApp, que se abre igual, por si no se ha abierto. A quien le
// funcionó la ve al volver y la cierra.
//
// En móvil y en escritorio cambia poco: en el móvil se puede llamar, y en el
// ordenador lo práctico es mandar el mensaje desde el móvil. Y va con o sin
// mensaje: los botones de pedir y de los formularios llevan el mensaje ya
// escrito; el icono de la cabecera o el de contacto, no.
export const AYUDA_WHATSAPP = {
  antetitulo: "¿No se abre WhatsApp?",
  titulo: {
    conMensaje: "Tu mensaje ya está escrito",
    sinMensaje: "Escríbenos por WhatsApp",
  },
  texto: {
    movil: {
      conMensaje: "Cópialo y pégalo en WhatsApp, o llámanos.",
      sinMensaje: "Guarda el número o llámanos.",
    },
    escritorio: {
      conMensaje:
        "Cópialo y envíanoslo desde WhatsApp en tu móvil. No se pierde nada de lo que has elegido.",
      sinMensaje: "Guarda el número y escríbenos desde tu móvil.",
    },
  },
  copiarMensaje: "Copiar mensaje",
  mensajeCopiado: "Mensaje copiado",
  /** Si el navegador no deja copiar: el mensaje queda seleccionado. */
  copiarAMano: "Selecciónalo y cópialo",
  numero: {
    etiqueta: "WhatsApp",
    visible: CONTACTO.whatsapp.visible,
    copiar: "Copiar número",
    copiado: "Número copiado",
  },
  llamar: {
    etiqueta: "Llamar",
    href: `tel:${CONTACTO.whatsapp.visible.replace(/\s/g, "")}`,
  },
  /** El enlace del pie, por si fue un fallo puntual. */
  abrir: "Probar a abrir WhatsApp otra vez",
  cerrar: "Cerrar",
  /** El enlace bajo los botones de pedir y de los formularios. */
  enlaceAyuda: "¿No se abre WhatsApp?",
} as const;
