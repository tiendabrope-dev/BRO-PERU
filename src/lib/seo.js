/*
  BRO es una SPA (un solo index.html), así que sin esto todas las
  páginas del sitio (inicio, catálogo, cada producto, preguntas
  frecuentes, etc.) comparten el mismo <title> y meta description
  genéricos definidos en index.html — lo que perjudica cómo se ve
  cada página en los resultados de Google y no ayuda a posicionar
  cada producto por su propio nombre.

  Esta función actualiza esas etiquetas en el <head> cada vez que
  cambia la página que se está viendo. No reemplaza el trabajo de
  definir buenas palabras clave por sección (ver pendiente de SEO),
  pero deja el mecanismo técnico funcionando: cada página ahora
  puede tener su propio título/descripción reales.
*/

const URL_BASE = 'https://brotienda.com';

function actualizarAtributo(
  selector,
  atributo,
  valor
) {
  const elemento =
    document.querySelector(selector);

  if (elemento) {
    elemento.setAttribute(
      atributo,
      valor
    );
  }
}

export function actualizarSeoPagina({
  titulo,
  descripcion,
  ruta = '/',
}) {
  if (
    typeof document ===
    'undefined'
  ) {
    return;
  }

  const urlCompleta =
    ruta === '/'
      ? `${URL_BASE}/`
      : `${URL_BASE}${ruta}`;

  if (titulo) {
    document.title = titulo;

    actualizarAtributo(
      'meta[property="og:title"]',
      'content',
      titulo
    );

    actualizarAtributo(
      'meta[name="twitter:title"]',
      'content',
      titulo
    );
  }

  if (descripcion) {
    actualizarAtributo(
      'meta[name="description"]',
      'content',
      descripcion
    );

    actualizarAtributo(
      'meta[property="og:description"]',
      'content',
      descripcion
    );

    actualizarAtributo(
      'meta[name="twitter:description"]',
      'content',
      descripcion
    );
  }

  actualizarAtributo(
    'meta[property="og:url"]',
    'content',
    urlCompleta
  );

  actualizarAtributo(
    'link[rel="canonical"]',
    'href',
    urlCompleta
  );
}
