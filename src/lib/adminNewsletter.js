import {
  supabase,
} from './supabase';

const SELECT_SUSCRIPTOR = `
  id,
  email,
  activo,
  creado_en,
  actualizado_en
`;

export async function obtenerSuscriptoresAdmin() {
  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_newsletter'
    )
    .select(
      SELECT_SUSCRIPTOR
    )
    .order(
      'creado_en',
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      'Error cargando suscriptores:',
      error
    );

    throw new Error(
      'No se pudieron cargar los suscriptores.'
    );
  }

  return data || [];
}