// /personalizadas: los diseños de Carmela y su formulario.

/**
 * Un diseño de Carmela: una tarta a medida que se adapta a cada ocasión (la
 * rosa, los volantes de la boda). No es una tarta de la carta con un nombre
 * encima: es un diseño que Carmela propone y ajusta en tamaño, colores y
 * sabores. Cada uno es una tarjeta de /personalizadas, en el orden de esta
 * lista, y una pastilla del campo "Diseño" del formulario.
 */
export interface DisenoEspecial {
  /**
   * Identificador: va en el enlace de la tarjeta (?diseno=<slug>) y en lo que
   * viaja con el formulario. Minúsculas y guiones, y estable: cuando haya
   * ficha por diseño será su URL (/personalizadas/<slug>).
   */
  slug: string;
  nombre: string;
  /** Para qué suele pedirse: "Cumpleaños · aniversarios". Sale en la tarjeta. */
  ocasiones: string;
  /**
   * Foto CON fondo, a sangre en el marco 4:5: nombre del archivo en
   * `src/assets/images/`, o `null` mientras no haya (la tarjeta pinta el marco
   * de "foto pendiente", como la carta).
   */
  archivo: string | null;
  /** Describe lo que se ve, sin nombres ni pronombres, como el resto del sitio. */
  alt: string;
  /** Como `Montaje.enfoque`: el punto de la foto que no se recorta. */
  enfoque?: string;
  /** Lo que cuenta la tarjeta bajo el nombre: cómo es y qué se adapta. Dos o tres líneas. */
  descripcion: string;
  /**
   * Más fotos del diseño, para dar referencias: salen en miniatura en la
   * tarjeta, DESPUÉS de la de `archivo`, y al pulsarlas se ven en grande.
   * Mismo formato que `archivo`; vacía si no hay más.
   */
  galeria: { archivo: string; alt: string }[];
}

// La página /personalizadas: los diseños de Carmela que se encargan a medida
// y se RECOGEN en el obrador. Esa es la frontera con Eventos, donde Carmela va
// al sitio y monta: si te la llevas tú, es una especial; si viene ella, es un
// evento. Por eso la franja del hero dice "La recoges" donde la de /eventos
// dice "Lo monto".
//
// Misma estructura que EVENTOS + SOLICITUD_EVENTO, en un solo objeto.
export const ESPECIALES = {
  etiquetaPagina: "Tartas especiales · Málaga",
  tituloPagina: "Una tarta pensada para lo que celebras",
  entradillaPagina:
    "Diseños míos que adapto a tu ocasión: tamaño, colores y sabores. Me cuentas qué celebras y te propongo uno.",
  // TODO: foto propia de la cabecera. Es la misma de los volantes y de la
  // portada mientras no lleguen las fotos nuevas.
  fotoCabecera: "tarta-boda-nati.jpeg",
  altCabecera:
    "Tarta de boda de varios pisos cubierta de volantes blancos de azúcar, en una terraza al sol.",
  enfoqueCabecera: "50% 40%",
  ctaCabecera: "Pedir presupuesto",
  pasos: [
    { titulo: "Me cuentas", detalle: "La ocasión, la fecha y cuántos seréis." },
    { titulo: "Te propongo", detalle: "Un diseño, sus sabores y el presupuesto." },
    { titulo: "La recoges", detalle: "En el obrador, lista para tu celebración." },
  ],
  etiquetaDisenos: "Diseños de Carmela",
  tituloDisenos: "Elige uno, o deja que te proponga",
  /** La columna derecha de cada tarjeta: no hay precio cerrado. */
  precio: "a presupuesto",
  // TODO: fotos nuevas de cada diseño. Las de ahora son las que ya había
  // (la rosa es la del hero de la portada; los volantes, la de la boda).
  disenos: [
    {
      slug: "la-rosa",
      nombre: "La rosa",
      ocasiones: "Cumpleaños · aniversarios",
      archivo: "pintando-tarta-rosa-hero.png",
      alt: "Tarta rosa con borde de merengue mientras se pinta a pincel su glaseado rojo.",
      enfoque: "28% 75%",
      // TODO: descripción real y fotos de detalle de la rosa.
      descripcion:
        "[Descripción del diseño: cómo es, qué lleva por fuera, para cuántas personas sale y qué se puede cambiar.]",
      galeria: [
        {
          archivo: "tartaRosa1.JPG",
          alt: "Glaseado rojo vertido con un biberón sobre la tarta rosa, en una rejilla del obrador.",
        },
        {
          archivo: "tartaRosa2.JPG",
          alt: "El glaseado rojo de la tarta rosa se extiende a pincel y cae por los bordes.",
        },
        {
          archivo: "tartaRosa3.JPG",
          alt: "La tarta cubierta de glaseado rojo en espiral, sobre la rejilla.",
        },
        {
          archivo: "tartaRosa4.JPG",
          alt: "La tarta terminada, de glaseado rojo en espiral, sobre una base dorada.",
        },
        {
          archivo: "tartaRosa5.JPG",
          alt: "La tarta terminada vista desde arriba, sobre una base dorada.",
        },
      ],
    },
    {
      slug: "volantes-de-azucar",
      nombre: "Volantes de azúcar",
      ocasiones: "Bodas · bautizos",
      archivo: "tarta-boda-nati.jpeg",
      alt: "Tarta de varios pisos cubierta de volantes blancos de azúcar.",
      enfoque: "50% 55%",
      // TODO: descripción real y fotos de detalle de los volantes.
      descripcion:
        "[Descripción del diseño: cómo es, qué lleva por fuera, para cuántas personas sale y qué se puede cambiar.]",
      galeria: [
        {
          archivo: "tartaPapelAzucar3.jpeg",
          alt: "La tarta de dos pisos en el obrador, con volantes blancos de papel de azúcar alrededor del piso de abajo.",
        },
        {
          archivo: "tartaPapelAzucar1.jpeg",
          alt: "Detalle de los volantes de papel de azúcar, curvados y translúcidos, junto al piso de arriba.",
        },
        {
          archivo: "tartaPapelAzucar2.jpeg",
          alt: "Primer plano de las láminas de papel de azúcar, finas y onduladas.",
        },
        {
          archivo: "tarta-boda-nati-con-nati.jpeg",
          alt: "La novia junto a la tarta de volantes blancos, en blanco y negro.",
        },
      ],
    },

  ] satisfies DisenoEspecial[],
  /** Los textos de cada tarjeta de diseño. */
  tarjeta: {
    /** El botón: lleva al formulario con el diseño marcado. */
    pedir: "Pedir esta tarta",
    /** Para el lector de pantalla en las miniaturas: "Foto 2 de 3". */
    foto: "Foto",
  },
  /**
   * La última tarjeta de la rejilla, en rust: para quien no sabe cuál elegir.
   * Lleva al formulario con "Que me proponga Carmela" marcado.
   */
  proponer: {
    slug: "que-me-proponga",
    leyenda: "¿No sabes cuál?",
    titulo: "Cuéntame qué celebras y te propongo uno",
    boton: "Que me proponga",
    nombre: "A tu medida",
    ocasiones: "Cualquier ocasión",
    /** La pastilla del campo "Diseño". */
    opcion: "Que me proponga Carmela",
  },
  /** Cierre de la rejilla, hacia /eventos: la frontera entre los dos servicios. */
  aEventos: "¿Prefieres que la lleve y la monte yo? Eso es un evento",

  // El formulario del final de la página. Mismos controles, mismo envío y
  // misma validación que SOLICITUD_EVENTO (ver src/lib/solicitud.ts); cambian
  // los campos: aquí hay diseño y fecha de RECOGIDA, y no hay lugar.
  solicitud: {
    etiqueta: "¿Tienes fecha?",
    titulo: "Pide tu tarta especial",
    texto:
      "Con estos datos te digo qué diseño encaja, en qué plazo y con qué presupuesto.",
    // TODO: plazo real de respuesta, el mismo que el de eventos.
    pasos: [
      {
        titulo: "Me envías la solicitud.",
        detalle: "El diseño, la ocasión, la fecha y cuántos seréis.",
      },
      {
        titulo: "Te respondo en [PLAZO].",
        detalle: "Con una propuesta y el presupuesto.",
      },
      {
        titulo: "Cerramos y la recoges.",
        detalle: "Sabores, tamaño y hora de recogida en el obrador.",
      },
    ],
    // TODO: antelación real. Entre corchetes en el texto; el número de abajo
    // es el que usa el calendario y es de relleno.
    nota: "Es una consulta, no una reserva: la fecha queda tuya cuando confirmamos. Pídela con [ANTELACIÓN] de antelación.",
    /**
     * Días LABORABLES de antelación para la fecha de recogida, contados como
     * los de PEDIDO. Se recoge en el obrador, así que sólo de lunes a viernes
     * (ver HORARIO).
     */
    diasAntelacion: 5,
    ocasiones: [
      "Cumpleaños",
      "Boda",
      "Comunión o bautizo",
      "Aniversario",
      "Otra celebración",
    ] as const,
    // TODO: confirmar los tramos con Carmen. Cada uno cambia el tamaño (y los
    // pisos) de la tarta, que es para lo que sirve el dato.
    personas: ["Hasta 10", "10 – 20", "20 – 40", "40 – 80", "Más de 80"] as const,
    placeholderIdea: "Colores, un tema, a quién quieres sorprender…",
    // TODO: máximo de fotos. Mismo límite que eventos hasta que se decida;
    // entre corchetes en la ayuda para que no se publique sin querer.
    fotos: { maximo: 4, megasMaximo: 8 },
    ayudaFotos:
      "Si tienes fotos de algo que te guste, súbelas: hasta [4], de 8 MB como mucho cada una.",
    aviso:
      "Esta solicitud es una consulta, no una reserva. Revisaremos tu petición y te confirmaremos la fecha y los detalles según nuestra disponibilidad.",
    boton: "Enviar solicitud",
    // Mismo destino que SOLICITUD_EVENTO.envio, y por lo mismo null.
    envio: null as string | null,
    whatsapp: {
      antes: "¿Prefieres hablar?",
      enlace: "Escríbeme por WhatsApp",
    },
  },
};
