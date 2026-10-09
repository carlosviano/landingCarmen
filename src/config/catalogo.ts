// La carta: qué es una tarta (tipos) y las tartas que hay.

/**
 * Una parte de la tarta, de las que se listan en "qué lleva".
 *
 * En la ficha, cada componente puede llevar una línea que sale de su etiqueta
 * y llega a su sitio en la foto recortada (`Tarta.recorte`). Lo que dice
 * ADÓNDE llega son `punto` y `dentro`, y son datos de cada tarta, no
 * código: la ficha es una sola plantilla y pinta las líneas donde digan estos
 * números. Una tarta montada de otra manera lleva otros números, no otra
 * página.
 *
 * Los dos son opcionales. Si a un solo componente le falta el `punto`, la
 * ficha entera sale sin líneas (ver `estaAnotada` en src/lib/tartas.ts): una
 * ficha medio anotada parece rota.
 */
export interface ComponenteTarta {
  /**
   * El nombre en escritorio, CORTO: debajo va `descripcionCorta`. Lo que ya
   * dice el nombre de la tarta no se repite: en la de chocolate, "Glaseado" y
   * no "Glaseado de chocolate negro".
   */
  etiqueta: string;
  /**
   * Lo que cuenta de esa parte, bajo el nombre. Sólo en escritorio y en la
   * lista de las fichas sin recorte: en móvil la ficha anotada no pinta
   * descripciones (ver `etiquetaMovil`).
   */
  descripcionCorta: string;
  /**
   * El nombre en móvil, donde va sin descripción: más completo que
   * `etiqueta` ("Glaseado espejo de chocolate negro" y no "Glaseado"). Hasta
   * dos líneas. Sin él, en móvil sale `etiqueta`.
   */
  etiquetaMovil?: string;
  /**
   * Dónde acaba la línea, en % del recorte: x de izquierda a derecha, y de
   * arriba abajo. En porcentaje y no en píxeles para que siga apuntando al
   * mismo sitio a cualquier tamaño.
   *
   * Tres reglas para que todas las fichas se lean igual:
   *  - En móvil sólo se ve el 45 % izquierdo del lienzo (la tarta sangra por
   *    la derecha), así que x tiene que quedar por debajo de ~40.
   *  - Cada etiqueta va a la altura de su punto, así que entre dos puntos
   *    tiene que haber al menos ~10 de y o las etiquetas se pisan.
   *  - El punto cae SOBRE lo que nombra, nunca en el aire ni en el borde.
   */
  punto?: { x: number; y: number };
  /**
   * Está dentro y no se ve en la foto (una crema bajo el merengue). La línea
   * sale discontinua y el punto hueco, para no prometer algo que no se ve.
   */
  dentro?: boolean;
}

/** Un tamaño de encargo: para cuántos es y cuánto cuesta. */
export interface TamanoTarta {
  /**
   * Texto corto con guion largo: "4–6". La palabra "personas" la pone quien
   * pinta. Sin él (una tarta de tamaño único que no dice para cuántos es), la
   * tarjeta pone "Tamaño único" y el mensaje del pedido no habla de personas.
   */
  personas?: string;
  /**
   * En euros y como NÚMERO: el total del pedido lo multiplica por la cantidad.
   * Se pinta con `precioVisible()`, que lo pone entre corchetes mientras
   * `PRECIOS_PROVISIONALES` siga en true.
   */
  precio: number;
}

/**
 * Una tarta de la carta.
 *
 * Tuvo un `saborDestacado` ("Cacao amargo", "Fresón de temporada") que hacía
 * de antetítulo sobre el nombre, primero en el carrusel y después en la
 * tarjeta y la ficha. Se ha ido de los tres: era un segundo titular que
 * repetía al primero con otras palabras, y el ingrediente que nombraba ya
 * está —mejor explicado— en `componentes`.
 *
 * También tuvo `precio` y `raciones` sueltos. Ahora los dos salen de
 * `tamanos`, porque cada tamaño tiene su precio.
 */
export interface Tarta {
  /**
   * Identificador y trozo de URL: /catalogo/<id>. Minúsculas y guiones, y
   * estable: cambiarlo rompe los enlaces que ya se hayan compartido.
   */
  id: string;
  nombre: string;
  /**
   * Foto CON fondo, para la tarjeta de la carta: nombre del archivo en
   * `src/assets/images/`, o `null` si todavía no hay.
   *
   * Se mete en un hueco 4:5 con `object-cover`, así que el motivo tiene que
   * aguantar un recorte centrado. Sin ella, la tarjeta usa el recorte (si lo
   * hay) sobre el fondo, y si tampoco, el marco de "foto pendiente".
   */
  archivo: string | null;
  /**
   * Foto SIN fondo (PNG con transparencia) para la ficha, que es donde van
   * las líneas de `componentes`. Va aparte de `archivo` porque son dos fotos
   * distintas: esta no aguanta un `object-cover`, se lo comería.
   *
   * Todas en el MISMO LIENZO: 1200×1040, con la tarta a todo el ancho y
   * centrada en alto. Así todas salen del mismo tamaño y en la misma caja, en
   * la ficha y en la tarjeta, y un `punto` en % significa lo mismo en todas.
   * Se sacan de la foto sin fondo recortándola pegada a la tarta, escalándola
   * a 1200 de ancho y centrándola en el lienzo (ver src/assets/README.md).
   */
  recorte?: string;
  /** Describe la tarta, sin nombres ni pronombres, como el resto del sitio. */
  alt: string;
  /**
   * Los tamaños que se pueden encargar, de menor a mayor. El primero es el
   * que viene marcado. Con uno solo, la ficha no pinta el selector.
   */
  tamanos: [TamanoTarta, ...TamanoTarta[]];
  /** Texto corto: "Nevera, 24 h", "Fuera de nevera, 2 días"... */
  conservacion: string;
  /**
   * De 2 a 6. Con más, las líneas de la ficha se apelotonan. Con 5 o 6, las
   * descripciones de escritorio tienen que caber: comprobarlo a 1440 px.
   */
  componentes: ComponenteTarta[];
  /** La descripción de la ficha para buscadores y al compartir el enlace (no se pinta en la página). Dos o tres frases. */
  descripcion: string;
}

export interface Catalogo {
  /** Antetítulo en mayúsculas de /catalogo, encima del titular. */
  etiqueta: string;
  /** Titular de /catalogo. */
  tituloPagina: string;
  /** Entradilla de /catalogo. */
  entradilla: string;
  tartas: Tarta[];
}

// Las fotos son de Carmen y viven en `src/assets/images/`. Se nombran aquí y
// las resuelve `fotoDe()` (src/lib/fotos.ts), que revienta el build si el
// nombre no existe. Ver src/assets/README.md para cómo se hacen.
//
// Ahora mismo la carta tiene SIETE tartas, todas con recorte sin fondo.
// Las siete de la maqueta original (con sus textos inventados) se quitaron a
// la espera de fotos; están en el historial de git. Las fichas se irán añadiendo según lleguen los recortes.
export const CATALOGO: Catalogo = {
  etiqueta: "Nuestra carta",
  tituloPagina: "La carta",
  entradilla:
    "Todas por encargo. El tamaño, la conservación y la antelación de cada una están en su ficha.",
  tartas: [
    {
      // El id se queda con el nombre antiguo porque esta ficha ya está
      // publicada: cambiarlo rompería los enlaces compartidos.
      id: "limon-y-merengue",
      nombre: "Tartaleta de lima",
      // TODO: foto con fondo para la tarjeta. Mientras no haya, la tarjeta
      // pinta el recorte sobre el fondo.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "limon-ficha.png",
      alt: "Tartaleta redonda de base de sablé, cubierta de picos de merengue con ralladura de lima.",
      tamanos: [
        { personas: "4–6", precio: 25 },
        { personas: "8–10", precio: 42 },
      ],
      conservacion: "Nevera, 48 h",
      componentes: [
        {
          etiqueta: "Ralladura de lima",
          descripcionCorta: "Por encima del merengue, para aportar aroma",
          punto: { x: 22.5, y: 22 },
        },
        {
          etiqueta: "Merengue",
          etiquetaMovil: "Merengue suizo",
          descripcionCorta: "Merengue suizo escudillado en picos",
          punto: { x: 8, y: 36 },
        },
        {
          etiqueta: "Crema de lima",
          descripcionCorta: "Para aportar ese punto cremoso y sedoso",
          punto: { x: 6, y: 50 },
          dentro: true,
        },
        {
          etiqueta: "Gel de lima",
          descripcionCorta:
            "Muy poco, sobre la base: lo justo para aportar ese punto de acidez",
          punto: { x: 6, y: 64 },
          dentro: true,
        },
        {
          etiqueta: "Sablé de vainilla",
          etiquetaMovil: "Base de sablé de vainilla",
          descripcionCorta: "Base de sablé blanco, estilo tartaleta",
          punto: { x: 14, y: 77 },
        },
      ],
      descripcion:
        "Tartaleta de sablé de vainilla con gel y crema de lima, cubierta de merengue suizo y ralladura de lima.",
    },
    {
      id: "tartaleta-de-chocolate",
      nombre: "Tartaleta de chocolate negro 70,5%",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "chocolate-ficha.png",
      alt: "Tartaleta redonda de sablé de chocolate con una cúpula de chocolate glaseada y brillante, espolvoreada de cacao.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Nevera, 48 h",
      componentes: [
        {
          etiqueta: "Cacao espolvoreado",
          descripcionCorta: "Por encima, como toque final",
          punto: { x: 20, y: 20 },
        },
        {
          etiqueta: "Glaseado",
          etiquetaMovil: "Glaseado espejo de chocolate negro",
          descripcionCorta:
            "Glaseado espejo de chocolate negro 70,5%, para aportar brillo",
          punto: { x: 6, y: 35 },
        },
        {
          etiqueta: "Cúpula",
          etiquetaMovil: "Cúpula de chocolate negro",
          descripcionCorta: "Semiesfera de chocolate negro 70,5%",
          punto: { x: 10, y: 48 },
        },
        {
          etiqueta: "Cremoso",
          etiquetaMovil: "Cremoso de pastelera de chocolate",
          descripcionCorta:
            "De pastelera de chocolate: suaviza sin pasar desapercibido",
          punto: { x: 5, y: 60 },
          dentro: true,
        },
        {
          etiqueta: "Sal Maldon",
          descripcionCorta: "Un toque sobre el cremoso",
          punto: { x: 6, y: 72 },
          dentro: true,
        },
        {
          etiqueta: "Sablé de chocolate",
          etiquetaMovil: "Base de sablé de chocolate",
          descripcionCorta: "Base de sablé de chocolate, estilo tartaleta",
          punto: { x: 14, y: 84 },
        },
      ],
      descripcion:
        "Tartaleta de sablé de chocolate con cremoso de chocolate y un toque de sal Maldon, bajo una cúpula de chocolate negro al 70,5% con glaseado espejo y cacao espolvoreado.",
    },
    {
      id: "pavlova-de-melocoton",
      nombre: "Pavlova de melocotón",
      // TODO: foto con fondo para la tarjeta. Hay una de esta tarta
      // (tarta_cumple_kika_2026.jpeg, la del escaparate), pero con ella
      // sería la única tarjeta con foto y las demás con recorte.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "pavlova-ficha.png",
      alt: "Pavlova alta cubierta de picos redondos de merengue y coronada de gajos de melocotón asado, sobre una base dorada.",
      tamanos: [
        { personas: "4–6", precio: 25 },
        { personas: "8–10", precio: 42 },
      ],
      conservacion: "Se come recién montada",
      componentes: [
        {
          etiqueta: "Melocotón",
          etiquetaMovil: "Melocotón natural",
          descripcionCorta: "Fruta natural como decoración",
          punto: { x: 25, y: 25.5 },
        },
        {
          etiqueta: "Crema pastelera",
          etiquetaMovil: "Crema pastelera con chips de chocolate",
          descripcionCorta:
            "Con chips de chocolate: la suavidad de la crema con un toque crujiente",
          punto: { x: 33, y: 45 },
        },
        {
          etiqueta: "Chantilly",
          etiquetaMovil: "Chantilly de vainilla",
          descripcionCorta: "Crema de nata a la vainilla, en su justa medida",
          punto: { x: 16, y: 61 },
          dentro: true,
        },
        {
          etiqueta: "Merengue seco",
          etiquetaMovil: "Base de merengue seco",
          descripcionCorta: "Merengue seco al horno, como base",
          punto: { x: 9, y: 78 },
        },
      ],
      descripcion:
        "Merengue seco con chantilly de vainilla y crema pastelera con chips de chocolate, coronada de melocotón.",
    },
    {
      id: "tarta-de-la-abuela",
      nombre: "Tarta de la abuela",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "abuela-ficha.png",
      alt: "Tarta redonda cubierta de chocolate con leche, con la silueta de un muñeco de jengibre recortada en el centro y el borde de color galleta.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      // TODO: confirmar con Carmen. La de antes ("Fuera de nevera, 3 días")
      // era la de la galleta.
      conservacion: "Nevera, 48 h",
      // Arriba se ven el muñeco y el pistoleado; las tres capas de dentro se
      // marcan sobre el borde, que es lo que las tapa.
      componentes: [
        {
          etiqueta: "Muñeco de jengibre",
          etiquetaMovil: "Muñeco de jengibre de chocolate",
          descripcionCorta: "De chocolate, para transportarte a la infancia",
          punto: { x: 37, y: 30 },
        },
        {
          etiqueta: "Pistoleado",
          etiquetaMovil: "Pistoleado de chocolate con leche",
          descripcionCorta: "De chocolate con leche, por fuera",
          punto: { x: 12, y: 45 },
        },
        {
          etiqueta: "Mousse de galleta",
          etiquetaMovil: "Mousse con trocitos de galleta",
          descripcionCorta: "Con trocitos de galleta",
          punto: { x: 6, y: 58 },
          dentro: true,
        },
        {
          etiqueta: "Cremoso",
          etiquetaMovil: "Cremoso de chocolate con leche",
          descripcionCorta: "De chocolate con leche, en el interior",
          punto: { x: 8, y: 69 },
          dentro: true,
        },
        {
          etiqueta: "Bizcocho",
          etiquetaMovil: "Base de bizcocho",
          descripcionCorta: "La base",
          punto: { x: 14, y: 79 },
          dentro: true,
        },
      ],
      descripcion:
        "Mousse de galleta con trocitos, cremoso de chocolate con leche y bizcocho, con pistoleado de chocolate con leche y un muñeco de jengibre de chocolate.",
    },
    {
      id: "nueces-de-macadamia",
      nombre: "Tarta de nueces de macadamia",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`), sacado de
      // tarta-nueces-macadamia-nueva.png: foto real, sustituye a la anterior.
      recorte: "nueces-macadamia-ficha.png",
      alt: "Tarta redonda baja de superficie abombada, con un glaseado dorado y brillante, rodeada de un aro claro y jaspeado.",
      // Sólo se hace en el tamaño grande.
      tamanos: [{ personas: "8–10", precio: 47 }],
      conservacion: "Nevera, 48 h",
      // La tarta es baja (del 25 al 78 % del lienzo en alto) y lleva seis
      // capas, así que los puntos van más juntos que en las demás. Las capas
      // de dentro se marcan sobre el aro, que es lo que las tapa.
      componentes: [
        {
          etiqueta: "Glaseado dorado",
          etiquetaMovil: "Glaseado dorado con oro",
          descripcionCorta: "Con oro, para dar luz",
          punto: { x: 30, y: 27 },
        },
        {
          etiqueta: "Mousse",
          etiquetaMovil: "Mousse de chocolate blanco",
          descripcionCorta:
            "De chocolate blanco, para los no tan amantes del chocolate",
          punto: { x: 4, y: 37 },
          dentro: true,
        },
        {
          etiqueta: "Toffee",
          descripcionCorta: "Aporta ese toque de caramelo",
          punto: { x: 3, y: 47 },
          dentro: true,
        },
        {
          etiqueta: "Praliné",
          etiquetaMovil: "Praliné de macadamia",
          descripcionCorta:
            "De nueces de macadamia, que aportan el toque salado",
          punto: { x: 4, y: 57 },
          dentro: true,
        },
        {
          etiqueta: "Bizcocho",
          etiquetaMovil: "Doble bizcocho genovés",
          descripcionCorta: "Doble bizcocho genovés: dos capas",
          punto: { x: 7, y: 66.5 },
          dentro: true,
        },
        {
          etiqueta: "Borde",
          etiquetaMovil: "Borde de chocolate blanco con oro",
          descripcionCorta: "De chocolate blanco con oro, como decoración",
          punto: { x: 34, y: 76 },
        },
      ],
      descripcion:
        "Doble bizcocho genovés con praliné de macadamia, toffee y mousse de chocolate blanco, con glaseado dorado y un borde de chocolate blanco con oro.",
    },
    {
      id: "galleta",
      nombre: "Galleta",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "galleta-ficha.png",
      alt: "Galleta gigante redonda, dorada y con azúcar por encima, salpicada de pepitas de chocolate negro y con leche, sobre una base de cartón.",
      // Tamaño único, sin número de personas: la tarjeta dice "Tamaño único".
      tamanos: [{ precio: 16 }],
      conservacion: "Fuera de nevera, 3 días",
      componentes: [
        {
          etiqueta: "Tres chocolates",
          etiquetaMovil: "Tres tipos de chocolate",
          descripcionCorta:
            "Tres tipos de chocolate distintos, para que te recuerde de verdad al sabor de la galleta",
          punto: { x: 16, y: 35 },
        },
        {
          etiqueta: "Masa de galleta",
          etiquetaMovil: "Masa jugosa y crujiente",
          descripcionCorta: "Jugosa y crujiente a la vez",
          punto: { x: 9, y: 62 },
        },
      ],
      descripcion:
        "Pensada para que te recuerde de verdad al sabor de la galleta, con tres tipos de chocolate distintos. Jugosa y crujiente a la vez.",
    },
    {
      id: "choux-de-avellana",
      nombre: "Choux de avellana",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "paris-brest-ficha.png",
      alt: "Corona de pasta choux espolvoreada de azúcar glas, rellena de crema de avellana y decorada con avellanas caramelizadas.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Nevera, 24 h",
      componentes: [
        {
          etiqueta: "Avellana",
          etiquetaMovil: "Avellana caramelizada",
          descripcionCorta: "Caramelizada, como decoración",
          punto: { x: 33, y: 10 },
        },
        {
          etiqueta: "Craquelin",
          etiquetaMovil: "Craquelin crujiente",
          descripcionCorta: "Fina capa de azúcar crujiente",
          punto: { x: 20, y: 24 },
        },
        {
          etiqueta: "Crema de chocolate",
          descripcionCorta: "En la decoración y en el interior",
          punto: { x: 10, y: 44 },
        },
        {
          etiqueta: "Muselina",
          etiquetaMovil: "Muselina de avellana",
          descripcionCorta: "Crema de avellana y mantequilla batida",
          punto: { x: 6, y: 59 },
        },
        {
          etiqueta: "Praliné",
          etiquetaMovil: "Praliné de avellana",
          descripcionCorta:
            "De avellana: la combinación perfecta de avellana y caramelo",
          punto: { x: 8, y: 72 },
          dentro: true,
        },
        {
          etiqueta: "Pasta choux",
          descripcionCorta: "Una masa parecida a la del profiterol",
          punto: { x: 25, y: 85 },
        },
      ],
      descripcion:
        "Pasta choux con craquelin, rellena de muselina y praliné de avellana, con crema de chocolate y avellanas caramelizadas.",
    },
  ],
};
