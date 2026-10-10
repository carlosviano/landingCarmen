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
  etiqueta: string;
  descripcionCorta: string;
  /**
   * Dónde acaba la línea, en % del recorte: x de izquierda a derecha, y de
   * arriba abajo. En porcentaje y no en píxeles para que siga apuntando al
   * mismo sitio a cualquier tamaño.
   *
   * Tres reglas para que todas las fichas se lean igual:
   *  - En móvil sólo se ve el 45 % izquierdo del lienzo (la tarta sangra por
   *    la derecha), así que x tiene que quedar por debajo de ~40.
   *  - Cada etiqueta va a la altura de su punto, así que entre dos puntos
   *    tiene que haber al menos ~14 de y o las etiquetas se pisan en móvil.
   *  - El punto cae SOBRE lo que nombra, nunca en el aire ni en el borde.
   */
  punto?: { x: number; y: number };
  /**
   * Está dentro y no se ve en la foto (una crema bajo el merengue). La línea
   * sale discontinua y el punto hueco, para no prometer algo que no se ve.
   */
  dentro?: boolean;
}

/**
 * Los catorce alérgenos que el Reglamento (UE) 1169/2011 obliga a declarar
 * (anexo II), en el orden del anexo. La ficha los pinta SIEMPRE en este orden,
 * no en el que se escriban en cada tarta: así "Leche" cae en el mismo sitio en
 * todas y quien busca uno lo encuentra sin leer la lista entera.
 *
 * El texto es el que ve el cliente. Nombres cortos y de uso común, los de los
 * carteles de alérgenos de hostelería.
 */
export const ALERGENOS = {
  gluten: "Gluten",
  crustaceos: "Crustáceos",
  huevo: "Huevo",
  pescado: "Pescado",
  cacahuetes: "Cacahuetes",
  soja: "Soja",
  leche: "Leche",
  "frutos-de-cascara": "Frutos de cáscara",
  apio: "Apio",
  mostaza: "Mostaza",
  sesamo: "Sésamo",
  sulfitos: "Sulfitos",
  altramuces: "Altramuces",
  moluscos: "Moluscos",
} as const;

export type Alergeno = keyof typeof ALERGENOS;

/** Un tamaño de encargo: para cuántos es y cuánto cuesta. */
export interface TamanoTarta {
  /** Texto corto con guion largo: "4–6". La palabra "personas" la pone quien pinta. */
  personas: string;
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
  /** De 2 a 4. Por encima de 4 las líneas de la ficha se apelotonan. */
  componentes: ComponenteTarta[];
  /**
   * Los alérgenos que lleva la RECETA, de los catorce de `ALERGENOS`. Las
   * trazas no van aquí: el obrador trabaja con todos y eso lo dice la ficha
   * para todas las tartas (ver "Alérgenos" en src/config/legal/condiciones.ts).
   *
   * Obligatorio a propósito, también cuando no lleva ninguno (`[]`): una
   * tarta nueva sin alérgenos declarados no compila, en vez de salir con la
   * ficha muda. Es un dato legal (venta a distancia): lo da Carmen, no se
   * deduce de los componentes.
   */
  alergenos: Alergeno[];
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
// Ahora mismo la carta tiene SEIS tartas: las que tienen recorte sin fondo.
// Las siete de la maqueta original (con sus textos inventados) se quitaron a
// la espera de fotos; están en el historial de git. Las fichas se irán
// añadiendo según lleguen los recortes.
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
      nombre: "Tartaleta de limón",
      // TODO: foto con fondo para la tarjeta. Mientras no haya, la tarjeta
      // pinta el recorte sobre el fondo.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "limon-ficha.png",
      alt: "Tarta redonda de base de galleta gruesa, cubierta de picos de merengue con ralladura de lima.",
      tamanos: [
        { personas: "4–6", precio: 25 },
        { personas: "8–10", precio: 42 },
      ],
      conservacion: "Nevera, 48 h",
      // POR CONFIRMAR con Carmen: deducido de los componentes, no de la receta.
      alergenos: ["gluten", "huevo", "leche"],
      componentes: [
        {
          etiqueta: "Ralladura de lima",
          descripcionCorta: "Por encima del merengue",
          punto: { x: 22.5, y: 23 },
        },
        {
          etiqueta: "Merengue",
          descripcionCorta: "En picos, sobre el limón",
          punto: { x: 8, y: 45 },
        },
        {
          etiqueta: "Tartaleta de limón",
          descripcionCorta: "La base, rellena de limón",
          punto: { x: 14, y: 72 },
        },
      ],
      descripcion:
        "Tartaleta de limón cubierta de merengue y terminada con ralladura de lima.",
    },
    {
      id: "tartaleta-de-chocolate",
      nombre: "Tartaleta de chocolate negro 70,5%",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "chocolate-ficha.png",
      alt: "Tarta redonda de base de cacao, rellena de chocolate brillante hasta el borde y espolvoreada de cacao en polvo.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Nevera, 48 h",
      // POR CONFIRMAR con Carmen: deducido de los componentes, no de la receta.
      alergenos: ["gluten", "huevo", "soja", "leche"],
      componentes: [
        {
          etiqueta: "Cacao espolvoreado",
          descripcionCorta: "Por encima",
          punto: { x: 22, y: 24 },
        },
        {
          etiqueta: "Mousse de chocolate negro",
          descripcionCorta: "La capa de arriba",
          punto: { x: 8, y: 42 },
        },
        {
          etiqueta: "Cremoso de chocolate negro",
          descripcionCorta: "Por dentro, bajo la mousse",
          punto: { x: 12, y: 57 },
          dentro: true,
        },
        {
          etiqueta: "Tartaleta de chocolate negro",
          descripcionCorta: "La base",
          punto: { x: 12, y: 78 },
        },
      ],
      descripcion:
        "Tartaleta de chocolate negro al 70,5% con cremoso y mousse de chocolate negro, espolvoreada de cacao.",
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
      // POR CONFIRMAR con Carmen: deducido de los componentes, no de la receta.
      alergenos: ["gluten", "huevo", "soja", "leche"],
      componentes: [
        {
          etiqueta: "Melocotón",
          descripcionCorta: "Por encima",
          punto: { x: 25, y: 25.5 },
        },
        {
          etiqueta: "Crema pastelera",
          descripcionCorta: "Con chips de chocolate",
          punto: { x: 33, y: 45 },
        },
        {
          etiqueta: "Bizcocho",
          descripcionCorta: "Por dentro",
          punto: { x: 16, y: 61 },
          dentro: true,
        },
        {
          etiqueta: "Merengue seco",
          descripcionCorta: "Por fuera",
          punto: { x: 9, y: 78 },
        },
      ],
      descripcion:
        "Merengue seco, bizcocho y crema pastelera con chips de chocolate, coronada de melocotón.",
    },
    {
      id: "tarta-de-la-abuela",
      nombre: "Tarta de la abuela",
      // TODO: foto con fondo para la tarjeta.
      archivo: null,
      // En el lienzo común (ver `Tarta.recorte`).
      recorte: "galleta-ficha.png",
      alt: "Galleta gigante redonda, dorada y con azúcar por encima, salpicada de pepitas de chocolate negro y con leche, sobre una base de cartón.",
      tamanos: [
        { personas: "4–6", precio: 27 },
        { personas: "8–10", precio: 45 },
      ],
      conservacion: "Fuera de nevera, 3 días",
      // POR CONFIRMAR con Carmen: deducido de los componentes, no de la receta.
      alergenos: ["gluten", "huevo", "soja", "leche"],
      componentes: [
        {
          etiqueta: "Cremoso de chocolate",
          descripcionCorta: "Por encima",
          punto: { x: 16, y: 34 },
        },
        {
          etiqueta: "Mousse de galleta",
          descripcionCorta: "El cuerpo de la tarta",
          punto: { x: 13, y: 62 },
        },
      ],
      descripcion: "Mousse de galleta con cremoso de chocolate.",
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
      // Las nueces no se ven en la foto, así que van con el toffee y no con
      // un punto propio: tres puntos separados caben en la tarta, cuatro se
      // pisarían.
      // POR CONFIRMAR con Carmen: deducido de los componentes, no de la receta.
      alergenos: ["gluten", "huevo", "soja", "leche", "frutos-de-cascara"],
      componentes: [
        {
          etiqueta: "Toffee",
          descripcionCorta: "Con nueces de macadamia",
          punto: { x: 24, y: 29 },
        },
        {
          etiqueta: "Vainilla",
          descripcionCorta: "Bajo el toffee",
          punto: { x: 6, y: 43 },
        },
        {
          etiqueta: "Borde de chocolate blanco",
          descripcionCorta: "Por fuera",
          punto: { x: 13, y: 65 },
        },
      ],
      descripcion:
        "Toffee, vainilla y nueces de macadamia, dentro de un borde de chocolate blanco.",
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
      // POR CONFIRMAR con Carmen: deducido de los componentes, no de la receta.
      alergenos: ["gluten", "huevo", "leche", "frutos-de-cascara"],
      componentes: [
        {
          etiqueta: "Masa de profiterol",
          descripcionCorta: "Rellena de praliné",
          punto: { x: 20, y: 20 },
        },
        {
          etiqueta: "Mousse de avellana",
          descripcionCorta: "Entre las dos coronas",
          punto: { x: 19, y: 72 },
        },
      ],
      descripcion:
        "Masa de profiterol rellena de praliné, con mousse de avellana.",
    },
  ],
};
