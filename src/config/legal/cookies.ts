// /cookies: qué guarda la web en el navegador y qué terceros intervienen.
//
// El art. 22.2 de la LSSI pide consentimiento para guardar o leer cosas en el
// dispositivo de quien visita (cookies y también localStorage), salvo lo
// técnico o lo que pide la propia persona. Hoy la web sólo guarda un dato, y
// es de esos, así que NO hace falta banner. Si algún día entra analítica con
// cookies, un vídeo incrustado o un píxel de redes, eso cambia: hará falta
// banner y reescribir esta página antes de publicarlo.
//
// La clave es la de components/Bienvenida.astro (VISTO). Si cambia allí,
// cambia aquí.

import type { TextoLegal } from "@/lib/legal";

export const COOKIES: TextoLegal = {
  antetitulo: "Cookies",
  titulo: "Política de cookies",
  intro:
    "Esta web no usa cookies para seguirte ni para mostrarte publicidad, y por eso no te pide permiso nada más entrar. Aquí está, en detalle, lo poco que guarda.",
  actualizado: "[FECHA]",
  apartados: [
    {
      id: "que-son",
      titulo: "Qué son",
      contenido: [
        "Las cookies, y otros sistemas parecidos como el almacenamiento local del navegador, son pequeños datos que una web guarda en tu dispositivo para recordar algo la próxima vez que entras.",
      ],
    },
    {
      id: "que-guarda",
      titulo: "Qué guarda esta web",
      contenido: [
        "Ninguna cookie. Sólo un dato en el almacenamiento local de tu navegador:",
        {
          lista: [
            "«bienvenida-vista-v1»: recuerda que ya has cerrado el aviso de bienvenida, para no enseñártelo cada vez. Se guarda cuando lo cierras, no caduca y no contiene ningún dato sobre ti.",
          ],
        },
        "Es un dato técnico que sirve para algo que tú has pedido (cerrar el aviso), así que la ley no exige pedirte consentimiento para guardarlo (artículo 22.2 de la Ley 34/2002).",
      ],
    },
    {
      id: "terceros",
      titulo: "Servicios de otros",
      contenido: [
        "Para cargar la página intervienen dos servicios externos. Ninguno de los dos instala cookies publicitarias ni de seguimiento:",
        {
          lista: [
            "Adobe Fonts sirve la tipografía de los titulares. Tu navegador le pide la fuente y Adobe recibe tu dirección IP y la página desde la que se pide, y cuenta las visitas para calcular su licencia. No instala cookies.",
            "Cloudflare aloja la web. Puede instalar una cookie técnica de seguridad si detecta tráfico sospechoso, para distinguir a las personas de los programas automáticos.",
          ],
        },
        "Los enlaces a WhatsApp, Instagram o Google Maps no cargan nada hasta que los pulsas. A partir de ahí estás en su web, con sus propias cookies y condiciones.",
      ],
    },
    {
      id: "borrar",
      titulo: "Cómo borrarlo",
      contenido: [
        "Puedes borrar el dato de la bienvenida, y cualquier cookie, desde los ajustes de privacidad de tu navegador (en «Borrar datos de navegación» o similar). Si lo borras, volverás a ver el aviso de bienvenida la próxima vez.",
      ],
    },
    {
      id: "mas",
      titulo: "Más información",
      contenido: [
        [
          "Qué se hace con tus datos personales está en la ",
          { texto: "política de privacidad", href: "/privacidad" },
          ". Si esta web empieza a usar cookies que necesiten tu permiso, te lo pediremos antes de instalarlas y lo contaremos aquí.",
        ],
      ],
    },
  ],
};
