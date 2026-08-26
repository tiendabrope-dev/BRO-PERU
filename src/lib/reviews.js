import {
  supabase,
} from './supabase';

const BUCKET_REVIEWS =
  'review-fotos';

const DURACION_URL_FOTO =
  60 * 60;

function extensionDesdeArchivo(
  archivo
) {
  const tipo =
    archivo.type;

  if (
    tipo ===
    'image/png'
  ) {
    return 'png';
  }

  if (
    tipo ===
    'image/webp'
  ) {
    return 'webp';
  }

  return 'jpg';
}

function crearNombreArchivo(
  archivo
) {
  const extension =
    extensionDesdeArchivo(
      archivo
    );

  const identificador =
    typeof crypto !==
      'undefined' &&
    crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return (
    `pendientes/` +
    `${Date.now()}-` +
    `${identificador}.` +
    extension
  );
}

async function obtenerUrlTemporal(
  fotoPath
) {
  const {
    data,
    error,
  } =
    await supabase.storage
      .from(
        BUCKET_REVIEWS
      )
      .createSignedUrl(
        fotoPath,
        DURACION_URL_FOTO
      );

  if (error) {
    console.error(
      'No se pudo obtener la foto de la review:',
      error
    );

    return null;
  }

  return (
    data?.signedUrl ||
    null
  );
}

export async function
cargarReviewsAprobadas() {
  const {
    data,
    error,
  } =
    await supabase.rpc(
      'listar_reviews_bro'
    );

  if (error) {
    throw error;
  }

  const reviews =
    data || [];

  const reviewsConFoto =
    await Promise.all(
      reviews.map(
        async (
          review
        ) => {
          const fotoUrl =
            await obtenerUrlTemporal(
              review.foto_path
            );

          return {
            ...review,

            fotoUrl,
          };
        }
      )
    );

  return reviewsConFoto.filter(
    (review) =>
      Boolean(
        review.fotoUrl
      )
  );
}

export async function
enviarReviewBro({
  nombre,
  producto,
  rating,
  comentario,
  foto,
}) {
  if (
    !producto
  ) {
    throw new Error(
      'Selecciona un producto.'
    );
  }

  if (
    !foto
  ) {
    throw new Error(
      'Agrega una foto de tu cuadro.'
    );
  }

  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (
    !tiposPermitidos.includes(
      foto.type
    )
  ) {
    throw new Error(
      'La foto debe ser JPG, PNG o WEBP.'
    );
  }

  const maximo =
    5 * 1024 * 1024;

  if (
    foto.size > maximo
  ) {
    throw new Error(
      'La foto no puede superar los 5 MB.'
    );
  }

  const fotoPath =
    crearNombreArchivo(
      foto
    );

  const {
    error:
      errorFoto,
  } =
    await supabase.storage
      .from(
        BUCKET_REVIEWS
      )
      .upload(
        fotoPath,
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

  if (errorFoto) {
    throw new Error(
      errorFoto.message ||
        'No se pudo subir la foto.'
    );
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'enviar_review_bro',
      {
        p_producto_id:
          String(
            producto.id
          ),

        p_producto_nombre:
          producto.nombre,

        p_nombre:
          nombre.trim(),

        p_rating:
          Number(
            rating
          ),

        p_comentario:
          comentario.trim(),

        p_foto_path:
          fotoPath,
      }
    );

  if (error) {
    throw error;
  }

  return data;
}