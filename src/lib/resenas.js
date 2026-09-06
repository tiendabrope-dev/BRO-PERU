import {
  supabase,
} from './supabase';

const SELECT_RESENA_PUBLICA = `
  id,
  producto_id,
  nombre_cliente,
  calificacion,
  comentario,
  imagen_url,
  fecha_resena,
  creado_en
`;

export async function obtenerResenasProducto(
  productoId
) {
  const id =
    String(
      productoId || ''
    ).trim();

  if (!id) {
    return [];
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        'bro_resenas'
      )
      .select(
        SELECT_RESENA_PUBLICA
      )
      .eq(
        'producto_id',
        id
      )
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

  return data || [];
}