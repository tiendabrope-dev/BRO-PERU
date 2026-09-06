import {
  supabase,
} from './supabase';

const SELECT_RESENA = `
  id,
  producto_id,
  nombre_cliente,
  calificacion,
  comentario,
  imagen_url,
  fecha_resena,
  estado,
  origen,
  creado_en,
  actualizado_en
`;

const ESTADOS_VALIDOS = [
  'pendiente',
  'aprobada',
  'rechazada',
  'oculta',
];

function extensionImagen(
  archivo
) {
  const nombre =
    String(
      archivo?.name || ''
    );

  const extension =
    nombre
      .split('.')
      .pop()
      ?.toLowerCase();

  if (
    [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'avif',
    ].includes(extension)
  ) {
    return extension ===
      'jpeg'
      ? 'jpg'
      : extension;
  }

  if (
    archivo?.type ===
    'image/png'
  ) {
    return 'png';
  }

  if (
    archivo?.type ===
    'image/webp'
  ) {
    return 'webp';
  }

  if (
    archivo?.type ===
    'image/avif'
  ) {
    return 'avif';
  }

  return 'jpg';
}

export function generarIdArchivoResena() {
  if (
    typeof crypto !==
      'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return crypto.randomUUID();
  }

  return `bro-resena-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export async function obtenerResenasAdmin() {
  const {
    data,
    error,
  } =
    await supabase
      .from('bro_resenas')
      .select(
        SELECT_RESENA
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

  return data || [];
}

export async function subirImagenResenaAdmin(
  archivo
) {
  if (!archivo) {
    return '';
  }

  if (
    !String(
      archivo.type || ''
    ).startsWith(
      'image/'
    )
  ) {
    throw new Error(
      'El archivo seleccionado no es una imagen.'
    );
  }

  const limite =
    8 * 1024 * 1024;

  if (
    archivo.size >
    limite
  ) {
    throw new Error(
      'La imagen no puede superar los 8 MB.'
    );
  }

  const idArchivo =
    generarIdArchivoResena();

  const extension =
    extensionImagen(
      archivo
    );

  const ruta =
    `admin/${idArchivo}/${Date.now()}.${extension}`;

  const {
    error,
  } =
    await supabase.storage
      .from(
        'bro-resenas'
      )
      .upload(
        ruta,
        archivo,
        {
          cacheControl:
            '3600',

          upsert:
            false,

          contentType:
            archivo.type,
        }
      );

  if (error) {
    throw new Error(
      error.message ||
        'No se pudo subir la imagen.'
    );
  }

  const {
    data,
  } =
    supabase.storage
      .from(
        'bro-resenas'
      )
      .getPublicUrl(
        ruta
      );

  return (
    data
      ?.publicUrl ||
    ''
  );
}

export async function crearResenaAdmin({
  productoId,
  nombreCliente,
  calificacion,
  comentario,
  imagenUrl = '',
  fechaResena,
  publicar = true,
}) {
  const producto =
    String(
      productoId || ''
    ).trim();

  const nombre =
    String(
      nombreCliente || ''
    ).trim();

  const texto =
    String(
      comentario || ''
    ).trim();

  const estrellas =
    Number(
      calificacion
    );

  if (!producto) {
    throw new Error(
      'Selecciona un producto.'
    );
  }

  if (!nombre) {
    throw new Error(
      'Ingresa el nombre del cliente.'
    );
  }

  if (
    !Number.isInteger(
      estrellas
    ) ||
    estrellas < 1 ||
    estrellas > 5
  ) {
    throw new Error(
      'Selecciona una calificación de 1 a 5 estrellas.'
    );
  }

  if (!texto) {
    throw new Error(
      'Ingresa el comentario de la reseña.'
    );
  }

  const ahora =
    new Date()
      .toISOString();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        'bro_resenas'
      )
      .insert({
        producto_id:
          producto,

        nombre_cliente:
          nombre,

        calificacion:
          estrellas,

        comentario:
          texto,

        imagen_url:
          imagenUrl ||
          null,

        fecha_resena:
          fechaResena ||
          new Date()
            .toISOString()
            .slice(
              0,
              10
            ),

        estado:
          publicar
            ? 'aprobada'
            : 'oculta',

        origen:
          'admin',

        actualizado_en:
          ahora,
      })
      .select(
        SELECT_RESENA
      )
      .single();

  if (error) {
    throw new Error(
      error.message ||
        'No se pudo crear la reseña.'
    );
  }

  return data;
}

export async function cambiarEstadoResenaAdmin(
  resenaId,
  estado
) {
  if (
    !ESTADOS_VALIDOS.includes(
      estado
    )
  ) {
    throw new Error(
      'Estado de reseña no válido.'
    );
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        'bro_resenas'
      )
      .update({
        estado,

        actualizado_en:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        resenaId
      )
      .select(
        SELECT_RESENA
      )
      .single();

  if (error) {
    throw new Error(
      error.message ||
        'No se pudo actualizar la reseña.'
    );
  }

  return data;
}

export async function eliminarResenaAdmin(
  resenaId
) {
  const {
    error,
  } =
    await supabase
      .from(
        'bro_resenas'
      )
      .delete()
      .eq(
        'id',
        resenaId
      );

  if (error) {
    throw new Error(
      error.message ||
        'No se pudo eliminar la reseña.'
    );
  }

  return true;
}