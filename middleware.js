/*
  Este archivo (Vercel Edge Middleware) hace dos cosas independientes,
  cada una interceptando su propia ruta antes de que Vercel sirva la
  SPA. No se toca `vercel.json` para ninguna de las dos — Vercel
  detecta `middleware.js` en la raíz del repo automáticamente.

  1) Arreglo completo de "imagen real al compartir un producto".

  Por qué hace falta esto: BRO es una SPA (un solo index.html).
  Los bots de WhatsApp/Facebook/Twitter/etc. que generan la vista
  previa de un link NO ejecutan JavaScript — solo leen el HTML tal
  cual lo devuelve el servidor. Por eso, aunque `src/lib/seo.js` ya
  actualiza los meta tags en el navegador al entrar a un producto,
  esos bots seguían viendo siempre los mismos meta tags genéricos
  de `index.html` (con la imagen genérica agregada en una sesión
  anterior).

  Si detecta que la visita a `/producto/:slug` es uno de esos bots,
  responde con un HTML mínimo que ya trae el título, la descripción
  y la imagen REAL de ese producto en los meta tags — sin tocar nada
  de la app normal para visitantes reales, que siguen viendo la SPA
  de siempre.

  2) Sitemap dinámico de productos (`/sitemap.xml`).

  El `public/sitemap.xml` estático solo lista las páginas fijas del
  sitio (inicio, /cuadros, preguntas frecuentes, etc.) — nunca incluyó
  las páginas de cada producto (`/producto/:slug`), así que Google
  nunca se enteraba de esas URLs por ahí. Esta función intercepta
  `/sitemap.xml`, arma el XML con las mismas páginas fijas de siempre
  MÁS una entrada por cada producto activo (consultado en vivo a
  Supabase), así que un producto nuevo aparece solo, sin tocar código.
  `public/sitemap.xml` se deja intacto como respaldo estático, por si
  esta función fallara por cualquier motivo.
*/

export const config = {
  matcher: [
    '/producto/:slug*',
    '/sitemap.xml',
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

/*
  Páginas fijas del sitio — las mismas que ya
  vivían en public/sitemap.xml, hardcodeadas ahí
  a mano. Se mantienen igual acá para no perder
  ninguna al pasar a generación dinámica.
*/
const PAGINAS_FIJAS = [
  {
    ruta: '/',
    changefreq: 'daily',
    priority: '1.0',
  },
  {
    ruta: '/cuadros',
    changefreq: 'daily',
    priority: '0.9',
  },
  {
    ruta: '/preguntas-frecuentes',
    changefreq: 'monthly',
    priority: '0.4',
  },
  {
    ruta: '/afiliados',
    changefreq: 'monthly',
    priority: '0.3',
  },
  {
    ruta: '/cambios-devoluciones',
    changefreq: 'monthly',
    priority: '0.3',
  },
  {
    ruta: '/terminos-condiciones',
    changefreq: 'yearly',
    priority: '0.2',
  },
  {
    ruta: '/politica-privacidad',
    changefreq: 'yearly',
    priority: '0.2',
  },
];

async function generarSitemap() {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL;

  const supabaseKey =
    process.env
      .VITE_SUPABASE_PUBLISHABLE_KEY;

  let productos = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const respuesta = await fetch(
        `${supabaseUrl}/rest/v1/bro_productos` +
          `?activo=eq.true` +
          `&select=slug,actualizado_en`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (respuesta.ok) {
        const datos =
          await respuesta.json();

        productos = Array.isArray(
          datos
        )
          ? datos
          : [];
      }
    } catch (error) {
      /*
        Si Supabase falla, el sitemap
        sale igual con las páginas
        fijas — nunca debe tumbar la
        respuesta.
      */
    }
  }

  const urlsFijas = PAGINAS_FIJAS.map(
    (pagina) => `
  <url>
    <loc>${URL_BASE}${pagina.ruta}</loc>
    <changefreq>${pagina.changefreq}</changefreq>
    <priority>${pagina.priority}</priority>
  </url>`
  ).join('');

  const urlsProductos = productos
    .filter((producto) => producto.slug)
    .map((producto) => {
      const fecha =
        producto.actualizado_en
          ? `
    <lastmod>${String(
      producto.actualizado_en
    ).slice(0, 10)}</lastmod>`
          : '';

      return `
  <url>
    <loc>${URL_BASE}/producto/${encodeURIComponent(
        producto.slug
      )}</loc>${fecha}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsFijas}${urlsProductos}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type':
        'application/xml; charset=utf-8',
      'cache-control':
        'public, max-age=0, s-maxage=3600',
    },
  });
}

export default async function middleware(
  request
) {
  const url = new URL(
    request.url
  );

  if (
    url.pathname === '/sitemap.xml'
  ) {
    return generarSitemap();
  }

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
