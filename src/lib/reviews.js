import {
  supabase,
} from './supabase';

const BUCKET_REVIEWS =
  'bro-resenas';

function extensionDesdeArchivo(
  archivo
) {
  const tipo =
    archivo?.type;

  if (
    tipo === 'image/png'
  ) {
    return 'png';
  }

  if (
    tipo === 'image/webp'
  ) {
    return 'webp';
  }

  if (
    tipo === 'image/avif'
  ) {
    return 'avif';
  }

  return 'jpg';
}

function crearIdentificador() {
  if (
    typeof crypto !==
      'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function crearNombreArchivo(
  archivo
) {
  const extension =
    extensionDesdeArchivo(
      archivo
    );

  return (
    `clientes/` +
    `${crearIdentificador()}/` +
    `${Date.now()}.${extension}`
  );
}

async function subirFotoReview(
  foto
) {
  /*
    FOTO OPCIONAL.

    Si el cliente no manda foto,
    devolvemos null y continuamos
    normalmente.
  */
  if (!foto) {
    return null;
  }

  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ];

  if (
    !tiposPermitidos.includes(
      foto.type
    )
  ) {
    throw new Error(
      'La foto debe ser JPG, PNG, WEBP o AVIF.'
    );
  }

  const maximo =
    8 * 1024 * 1024;

  if (
    foto.size >
    maximo
  ) {
    throw new Error(
      'La foto no puede superar los 8 MB.'
    );
  }

  const ruta =
    crearNombreArchivo(
      foto
    );

  const {
    error,
  } =
    await supabase.storage
      .from(
        BUCKET_REVIEWS
      )
      .upload(
        ruta,
        foto,
        {
          cacheControl:
            '3600',

          upsert:
            false,

          contentType:
            foto.type,
        }
      );

  if (error) {
    throw new Error(
      error.message ||
        'No se pudo subir la foto.'
    );
  }

  const {
    data,
  } =
    supabase.storage
      .from(
        BUCKET_REVIEWS
      )
      .getPublicUrl(
        ruta
      );

  return (
    data?.publicUrl ||
    null
  );
}

export async function
cargarReviewsAprobadas() {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        'bro_resenas'
      )
      .select(`
        id,
        producto_id,
        nombre_cliente,
        calificacion,
        comentario,
        imagen_url,
        fecha_resena,
        creado_en
      `)
      .eq(
        'estado',
        'aprobada'
      )
      .order(
        'fecha_resena',
        {
          ascending: false,
        }
      )
      .order(
        'creado_en',
        {
          ascending: false,
        }
      );

  if (error) {
    throw new Error(
      error.message ||
        'No se pudieron cargar las reseñas.'
    );
  }

  /*
    Normalizamos para no romper
    el componente actual.
  */
  return (
    data || []
  ).map(
    (review) => ({
      id:
        review.id,

      producto_id:
        review.producto_id,

      nombre:
        review.nombre_cliente,

      rating:
        Number(
          review.calificacion ||
            0
        ),

      comentario:
        review.comentario,

      fotoUrl:
        review.imagen_url ||
        null,

      fecha:
        review.fecha_resena,

      verificada:
        false,
    })
  );
}

export async function
enviarReviewBro({
  nombre,
  producto,
  rating,
  comentario,
  foto = null,
}) {
  if (!producto?.id) {
    throw new Error(
      'Selecciona un producto.'
    );
  }

  const nombreLimpio =
    String(
      nombre || ''
    ).trim();

  if (
    nombreLimpio.length <
    2
  ) {
    throw new Error(
      'Ingresa tu nombre.'
    );
  }

  const estrellas =
    Number(
      rating
    );

  if (
    !Number.isInteger(
      estrellas
    ) ||
    estrellas < 1 ||
    estrellas > 5
  ) {
    throw new Error(
      'Selecciona una puntuación de 1 a 5 estrellas.'
    );
  }

  const texto =
    String(
      comentario || ''
    ).trim();

  if (
    texto.length <
    5
  ) {
    throw new Error(
      'Cuéntanos brevemente tu experiencia.'
    );
  }

  /*
    Solo subimos foto cuando existe.
  */
  const imagenUrl =
    await subirFotoReview(
      foto
    );

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'enviar_resena_bro',
      {
        p_producto_id:
          String(
            producto.id
          ),

        p_nombre_cliente:
          nombreLimpio,

        p_calificacion:
          estrellas,

        p_comentario:
          texto,

        p_imagen_url:
          imagenUrl,
      }
    );

  if (error) {
    throw new Error(
      error.message ||
        'No se pudo enviar la reseña.'
    );
  }

  return data;
}