import {
  supabase,
} from './supabase';

export async function registrarVisitaBro() {
  const {
    data,
    error,
  } = await supabase.rpc(
    'incrementar_visitas_bro'
  );

  if (error) {
    console.error(
      'Error registrando visita:',
      error
    );

    return null;
  }

  const numero =
    Number(data);

  return Number.isFinite(
    numero
  )
    ? numero
    : null;
}
