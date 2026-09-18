import { supabase } from './supabase';

/*
  ESTADÍSTICAS DEL PANEL ADMIN (landing /cuenta/inicio)

  Trae los pedidos con los campos mínimos necesarios para
  armar el calendario y el gráfico de ingresos, sin traer
  todo lo demás (datos de contacto, dirección, etc.) que
  no hace falta para estadísticas.

  No se creó ninguna tabla nueva en Supabase — esto lee
  directo de la tabla "pedidos" que ya existe, con el mismo
  acceso/RLS que ya usa el resto del panel admin.
*/
export async function obtenerPedidosParaEstadisticasAdmin() {
  const { data, error } =
    await supabase
      .from('pedidos')
      .select(
        'creado_en, total, estado_pedido, estado_pago'
      )
      .order('creado_en', {
        ascending: true,
      });

  if (error) {
    console.error(
      'Error cargando estadísticas de pedidos:',
      error
    );

    throw new Error(
      'No se pudieron cargar las estadísticas de pedidos.'
    );
  }

  return data || [];
}
