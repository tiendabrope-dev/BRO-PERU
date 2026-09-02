import { supabase } from './supabase';

const CAMPOS_PEDIDO = `
  id,
  numero_pedido,
  codigo_pedido,
  origen,
  nombre_completo,
  dni,
  telefono,
  tipo_servicio,
  direccion,
  distrito,
  referencia,
  subtotal,
  delivery,
  total,
  metodo_pago,
  estado_pago,
  estado_pedido,
  whatsapp_enviado,
  notion_sincronizado,
  email_enviado,
  creado_en,
  actualizado_en
`;

export async function obtenerPedidosAdmin() {
  const { data, error } =
    await supabase
      .from('pedidos')
      .select(CAMPOS_PEDIDO)
      .order('creado_en', {
        ascending: false,
      })
      .limit(200);

  if (error) {
    console.error(
      'Error cargando pedidos:',
      error
    );

    throw new Error(
      'No se pudieron cargar los pedidos.'
    );
  }

  return data || [];
}

export async function obtenerPedidoAdmin(
  pedidoId
) {
  const { data: pedido, error: errorPedido } =
    await supabase
      .from('pedidos')
      .select(CAMPOS_PEDIDO)
      .eq('id', pedidoId)
      .single();

  if (errorPedido) {
    console.error(
      'Error cargando pedido:',
      errorPedido
    );

    throw new Error(
      'No se pudo cargar el pedido.'
    );
  }

  const { data: items, error: errorItems } =
    await supabase
      .from('pedido_items')
      .select(`
        id,
        pedido_id,
        producto_referencia,
        nombre_producto,
        cantidad,
        precio_unitario,
        total_linea,
        variante_referencia,
        variante_texto,
        tamano,
        tamano_id,
        marco,
        marco_id,
        tipo_producto,
        wallpaper,
        wallpaper_id,
        creado_en
      `)
      .eq('pedido_id', pedidoId)
      .order('creado_en', {
        ascending: true,
      });

  if (errorItems) {
    console.error(
      'Error cargando productos:',
      errorItems
    );

    throw new Error(
      'No se pudieron cargar los productos.'
    );
  }

  return {
    pedido,
    items: items || [],
  };
}

export async function actualizarEstadoPedidoAdmin(
  pedidoId,
  estado
) {
  const permitidos = [
    'nuevo',
    'confirmado',
    'preparando',
    'enviado',
    'entregado',
    'cancelado',
  ];

  if (!permitidos.includes(estado)) {
    throw new Error(
      'Estado de pedido inválido.'
    );
  }

  const { data, error } =
    await supabase
      .from('pedidos')
      .update({
        estado_pedido: estado,
      })
      .eq('id', pedidoId)
      .select(CAMPOS_PEDIDO)
      .single();

  if (error) {
    console.error(
      'Error actualizando pedido:',
      error
    );

    throw new Error(
      'No se pudo actualizar el estado.'
    );
  }

  return data;
}

export async function actualizarEstadoPagoAdmin(
  pedidoId,
  estado
) {
  const permitidos = [
    'no_pagado',
    'pagado',
  ];

  if (!permitidos.includes(estado)) {
    throw new Error(
      'Estado de pago inválido.'
    );
  }

  const { data, error } =
    await supabase
      .from('pedidos')
      .update({
        estado_pago: estado,
      })
      .eq('id', pedidoId)
      .select(CAMPOS_PEDIDO)
      .single();

  if (error) {
    console.error(
      'Error actualizando pago:',
      error
    );

    throw new Error(
      'No se pudo actualizar el pago.'
    );
  }

  return data;
}