import { supabase } from './supabase';

function generarCodigoPedido() {
  const fecha = new Date();
  const sello = fecha.toISOString().slice(2, 10).replace(/-/g, '');
  const aleatorio = Math.floor(Math.random() * 900 + 100);
  return `ME-${sello}-${aleatorio}`;
}

export async function listarPedidosMilEstilos() {
  const { data, error } = await supabase
    .from('mil_estilos_pedidos')
    .select('*, mil_estilos_pedido_items(*)')
    .order('creado_en', { ascending: false });

  if (error) {
    throw new Error('No se pudieron cargar los pedidos.');
  }

  return data || [];
}

export async function obtenerPedidoMilEstilos(pedidoId) {
  const { data, error } = await supabase
    .from('mil_estilos_pedidos')
    .select('*, mil_estilos_pedido_items(*)')
    .eq('id', pedidoId)
    .single();

  if (error) {
    throw new Error('No se pudo cargar el pedido.');
  }

  return data;
}

// items: [{ productoId, nombreProducto, cantidad, precioUnitario }]
export async function crearPedidoMilEstilos({ clienteNombre, clienteTelefono, metodoPago, items }) {
  if (!items || items.length === 0) {
    throw new Error('El pedido necesita al menos un producto.');
  }

  const subtotal = items.reduce(
    (acumulado, item) => acumulado + Number(item.cantidad) * Number(item.precioUnitario),
    0
  );

  const { data: pedido, error: errorPedido } = await supabase
    .from('mil_estilos_pedidos')
    .insert({
      codigo_pedido: generarCodigoPedido(),
      cliente_nombre: clienteNombre || null,
      cliente_telefono: clienteTelefono || null,
      metodo_pago: metodoPago || null,
      subtotal,
      total: subtotal,
    })
    .select()
    .single();

  if (errorPedido) {
    throw new Error('No se pudo crear el pedido.');
  }

  const filasItems = items.map((item) => ({
    pedido_id: pedido.id,
    producto_id: item.productoId || null,
    nombre_producto: item.nombreProducto,
    cantidad: Number(item.cantidad),
    precio_unitario: Number(item.precioUnitario),
    total_linea: Number(item.cantidad) * Number(item.precioUnitario),
  }));

  const { error: errorItems } = await supabase.from('mil_estilos_pedido_items').insert(filasItems);

  if (errorItems) {
    throw new Error('El pedido se creó, pero no se pudieron guardar los productos.');
  }

  return pedido;
}

// Marca el pedido como facturado y descuenta el stock automáticamente
// (todo ocurre dentro de la función de Supabase, en un solo paso atómico).
export async function facturarPedidoMilEstilos(pedidoId) {
  const { error } = await supabase.rpc('mil_estilos_facturar_pedido', {
    p_pedido_id: pedidoId,
  });

  if (error) {
    throw new Error(error.message || 'No se pudo facturar el pedido.');
  }
}

export async function marcarPedidoPagadoMilEstilos(pedidoId, pagado) {
  const { error } = await supabase
    .from('mil_estilos_pedidos')
    .update({ pagado: Boolean(pagado) })
    .eq('id', pedidoId);

  if (error) {
    throw new Error('No se pudo actualizar el pago del pedido.');
  }
}

export async function cancelarPedidoMilEstilos(pedidoId) {
  const { error } = await supabase
    .from('mil_estilos_pedidos')
    .update({ estado_pedido: 'cancelado' })
    .eq('id', pedidoId);

  if (error) {
    throw new Error('No se pudo cancelar el pedido.');
  }
}
