/*
  Arreglo completo de "imagen real al compartir un producto".

  Por qué hace falta esto: BRO es una SPA (un solo index.html).
  Los bots de WhatsApp/Facebook/Twitter/etc. que generan la vista
  previa de un link NO ejecutan JavaScript — solo leen el HTML tal
  cual lo devuelve el servidor. Por eso, aunque `src/lib/seo.js` ya
  actualiza los meta tags en el navegador al entrar a un producto,
  esos bots seguían viendo siempre los mismos meta tags genéricos
  de `index.html` (con la imagen genérica agregada en una sesión
  anterior).

  Esta función (Vercel Edge Middleware) se ejecuta ANTES de servir
  cualquier página. Si detecta que la visita es uno de esos bots Y
  la URL es de un producto (`/producto/:slug`), responde con un HTML
  mínimo que ya trae el título, la descripción y la imagen REAL de
  ese producto en los meta tags — sin tocar nada de la app normal
  para visitantes reales, que siguen viendo la SPA de siempre.
*/

export const config = {
  matcher: [
    '/producto/:slug*',
  ],
};

const PATRONES_BOTS = [
  'facebookexternalhit',
  'facebookcatalog',
  'whatsapp',
  'twitterbot',
  'linkedinbot',
  'telegrambot',
  'slackbot',
  'discordbot',
  'pinterest',
  'redditbot',
  'vkshare',
  'skypeuripreview',
  'w3c_validator',
];

const URL_BASE = 'https://brotienda.com';

function esBotDeVistaPrevia(userAgent) {
  const ua = String(
    userAgent || ''
  ).toLowerCase();

  return PATRONES_BOTS.some(
    (patron) => ua.includes(patron)
  );
}

function escaparHtml(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function middleware(
  request
) {
  const userAgent =
    request.headers.get(
      'user-agent'
    ) || '';

  /*
    Un visitante normal (o cualquier
    bot que no reconocemos) sigue el
    flujo normal de siempre: la SPA.
  */
  if (
    !esBotDeVistaPrevia(userAgent)
  ) {
    return;
  }

  const url = new URL(
    request.url
  );

  const slug = decodeURIComponent(
    url.pathname
      .replace(
        '/producto/',
        ''
      )
      .replace(/\/$/, '')
  );

  const supabaseUrl =
    process.env
      .VITE_SUPABASE_URL;

  const supabaseKey =
    process.env
      .VITE_SUPABASE_PUBLISHABLE_KEY;

  if (
    !slug ||
    !supabaseUrl ||
    !supabaseKey
  ) {
    return;
  }

  try {
    const respuesta = await fetch(
      `${supabaseUrl}/rest/v1/bro_productos` +
        `?slug=eq.${encodeURIComponent(slug)}` +
        `&activo=eq.true` +
        `&select=nombre,imagen_url,slug`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!respuesta.ok) {
      return;
    }

    const datos =
      await respuesta.json();

    const producto =
      Array.isArray(datos)
        ? datos[0]
        : null;

    /*
      Sin el producto en Supabase (o
      inactivo) dejamos que la SPA
      normal maneje el caso —
      probablemente sea un slug viejo
      que todavía vive solo en el
      catálogo local.
    */
    if (
      !producto ||
      !producto.imagen_url
    ) {
      return;
    }

    const titulo = `BRO Perú - ${producto.nombre}`;

    const descripcion = `${producto.nombre} - Cuadro personalizado BRO Perú, el regalo ideal para él.`;

    const urlProducto = `${URL_BASE}/producto/${producto.slug}`;

    const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${escaparHtml(
      titulo
    )}</title>
<meta name="description" content="${escaparHtml(
      descripcion
    )}" />
<link rel="canonical" href="${urlProducto}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="BRO Perú" />
<meta property="og:title" content="${escaparHtml(
      titulo
    )}" />
<meta property="og:description" content="${escaparHtml(
      descripcion
    )}" />
<meta property="og:image" content="${escaparHtml(
      producto.imagen_url
    )}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="1200" />
<meta property="og:url" content="${urlProducto}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escaparHtml(
      titulo
    )}" />
<meta name="twitter:description" content="${escaparHtml(
      descripcion
    )}" />
<meta name="twitter:image" content="${escaparHtml(
      producto.imagen_url
    )}" />
<meta http-equiv="refresh" content="0; url=${urlProducto}" />
</head>
<body>
Redirigiendo a ${escaparHtml(
      titulo
    )}...
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'content-type':
          'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    /*
      Si algo falla (Supabase caído,
      etc.) nunca debe tumbar la
      página para un visitante real
      ni para el bot — simplemente
      dejamos que siga el flujo
      normal de la SPA.
    */
    return;
  }
}
