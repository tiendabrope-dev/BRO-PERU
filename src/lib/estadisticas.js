import { supabase } from './supabase';

export function formatearSoles(
  valor
) {
  return (
    'S/ ' +
    Math.round(
      valor || 0
    ).toLocaleString(
      'es-PE'
    )
  );
}

const ESTADOS_PENDIENTES = [
  'nuevo',
  'confirmado',
  'preparando',
  'enviado',
];

function pedidoCuentaComoIngreso(
  pedido
) {
  return (
    pedido.estado_pago ===
      'pagado' &&
    pedido.estado_pedido !==
      'cancelado'
  );
}

/*
  Resumen rápido para las tarjetas del inicio del admin:
  pedidos de este mes, ingresos de este mes (solo pagados
  y no cancelados) y pedidos pendientes de atender (en
  cualquier estado que no sea entregado/cancelado).
*/
export function calcularResumenMes(
  pedidos
) {
  const hoy = new Date();

  const anio =
    hoy.getFullYear();

  const mes =
    hoy.getMonth();

  let pedidosMes = 0;
  let ingresosMes = 0;
  let pendientes = 0;

  for (const pedido of pedidos ||
    []) {
    if (
      pedido.creado_en
    ) {
      const fecha =
        new Date(
          pedido.creado_en
        );

      if (
        fecha.getFullYear() ===
          anio &&
        fecha.getMonth() ===
          mes
      ) {
        pedidosMes += 1;

        if (
          pedidoCuentaComoIngreso(
            pedido
          )
        ) {
          ingresosMes +=
            Number(
              pedido.total
            ) || 0;
        }
      }
    }

    if (
      ESTADOS_PENDIENTES.includes(
        pedido.estado_pedido
      )
    ) {
      pendientes += 1;
    }
  }

  return {
    pedidosMes,
    ingresosMes,
    pendientes,
  };
}

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
