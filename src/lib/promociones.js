import {
  supabase,
} from './supabase';

export async function obtenerPromocionesPublicas() {
  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_promociones'
    )
    .select(`
      id,
      texto,
      orden,
      creado_en
    `)
    .eq(
      'activo',
      true
    )
    .order(
      'orden',
      {
        ascending: true,
      }
    )
    .order(
      'creado_en',
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      'Error cargando promociones públicas:',
      error
    );

    throw new Error(
      'No se pudieron cargar las promociones.'
    );
  }

  return data || [];
}