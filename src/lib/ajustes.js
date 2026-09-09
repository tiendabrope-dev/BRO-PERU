import {
  supabase,
} from './supabase';

export const AJUSTES_POR_DEFECTO = {
  whatsappPedidos:
    '51931330058',

  yapePlinNumero:
    '926555219',

  yapePlinTitular:
    'DIEGO LOP* VAL*',
};

export async function obtenerAjustesPublicos() {
  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_ajustes'
    )
    .select(`
      whatsapp_pedidos,
      yape_plin_numero,
      yape_plin_titular
    `)
    .eq(
      'id',
      1
    )
    .maybeSingle();

  if (
    error ||
    !data
  ) {
    if (error) {
      console.error(
        'Error cargando ajustes públicos:',
        error
      );
    }

    return AJUSTES_POR_DEFECTO;
  }

  return {
    whatsappPedidos:
      data.whatsapp_pedidos ||
      AJUSTES_POR_DEFECTO.whatsappPedidos,

    yapePlinNumero:
      data.yape_plin_numero ||
      AJUSTES_POR_DEFECTO.yapePlinNumero,

    yapePlinTitular:
      data.yape_plin_titular ||
      AJUSTES_POR_DEFECTO.yapePlinTitular,
  };
}