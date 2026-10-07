import { supabase } from './supabase';

const BUCKET = 'mil-estilos-productos';

export async function listarProductosMilEstilos() {
  const { data, error } = await supabase
    .from('mil_estilos_productos')
    .select('*')
    .order('creado_en', { ascending: false });

  if (error) {
    throw new Error('No se pudieron cargar los productos.');
  }

  return data || [];
}

export async function subirImagenProductoMilEstilos(archivo) {
  const extension = (archivo.name.split('.').pop() || 'jpg').toLowerCase();
  const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;
  const ruta = `productos/${nombreArchivo}`;

  const { error: errorSubida } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, archivo, {
      cacheControl: '3600',
      upsert: false,
    });

  if (errorSubida) {
    throw new Error('No se pudo subir la imagen.');
  }

  const { data: datosPublicos } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(ruta);

  return datosPublicos.publicUrl;
}

// Crea un producto nuevo con su stock principal inicial.
// El stock inicial queda registrado como primer movimiento del historial,
// para que el stock_actual siempre salga de la suma de movimientos.
export async function crearProductoMilEstilos({
  nombre,
  precio,
  imagenUrl,
  stockInicial,
}) {
  const { data: producto, error: errorProducto } = await supabase
    .from('mil_estilos_productos')
    .insert({
      nombre: String(nombre || '').trim(),
      precio: Number(precio) || 0,
      imagen_url: imagenUrl || null,
      stock_actual: 0,
    })
    .select()
    .single();

  if (errorProducto) {
    throw new Error('No se pudo crear el producto.');
  }

  const cantidadInicial = Number(stockInicial) || 0;

  if (cantidadInicial > 0) {
    const { error: errorMovimiento } = await supabase
      .from('mil_estilos_movimientos_stock')
      .insert({
        producto_id: producto.id,
        tipo: 'entrada',
        cantidad: cantidadInicial,
        nota: 'Stock principal inicial',
      });

    if (errorMovimiento) {
      throw new Error('Producto creado, pero no se pudo registrar el stock inicial.');
    }
  }

  return producto;
}

// Único punto para aumentar o vender stock desde la pantalla de Stock.
// tipo: 'entrada' (aumentar) | 'venta_manual' (venta registrada a mano)
export async function registrarMovimientoStockMilEstilos({ productoId, tipo, cantidad, nota }) {
  const cantidadNumerica = Number(cantidad) || 0;

  if (cantidadNumerica <= 0) {
    throw new Error('La cantidad debe ser mayor a cero.');
  }

  const cantidadFinal = tipo === 'venta_manual' ? -cantidadNumerica : cantidadNumerica;

  const { error } = await supabase.from('mil_estilos_movimientos_stock').insert({
    producto_id: productoId,
    tipo,
    cantidad: cantidadFinal,
    nota: nota || null,
  });

  if (error) {
    throw new Error(error.message?.includes('Stock insuficiente')
      ? 'No hay suficiente stock para esa venta.'
      : 'No se pudo registrar el movimiento.');
  }
}

export async function listarMovimientosDeProductoMilEstilos(productoId) {
  const { data, error } = await supabase
    .from('mil_estilos_movimientos_stock')
    .select('*')
    .eq('producto_id', productoId)
    .order('creado_en', { ascending: false });

  if (error) {
    throw new Error('No se pudo cargar el historial de este producto.');
  }

  return data || [];
}

// Trae todos los movimientos de venta (manual + por pedido) para armar
// el resumen del Dashboard: total vendido por producto, ventas del mes, etc.
export async function listarMovimientosVentaMilEstilos() {
  const { data, error } = await supabase
    .from('mil_estilos_movimientos_stock')
    .select('*')
    .in('tipo', ['venta_manual', 'venta_pedido'])
    .order('creado_en', { ascending: false });

  if (error) {
    throw new Error('No se pudo cargar el resumen de ventas.');
  }

  return data || [];
}

// Edición directa — solo permitida desde el módulo de Configuración.
export async function actualizarProductoConfiguracionMilEstilos(productoId, cambios) {
  const payload = {};

  if (cambios.nombre !== undefined) payload.nombre = String(cambios.nombre).trim();
  if (cambios.precio !== undefined) payload.precio = Number(cambios.precio) || 0;
  if (cambios.stockActual !== undefined) payload.stock_actual = Number(cambios.stockActual) || 0;
  if (cambios.activo !== undefined) payload.activo = Boolean(cambios.activo);
  if (cambios.imagenUrl !== undefined) payload.imagen_url = cambios.imagenUrl;

  payload.actualizado_en = new Date().toISOString();

  const { error } = await supabase
    .from('mil_estilos_productos')
    .update(payload)
    .eq('id', productoId);

  if (error) {
    throw new Error('No se pudo guardar el cambio.');
  }
}

// Elimina el producto por completo, junto con todo su historial de
// movimientos (stock). Si el producto aparece en algún pedido pasado,
// ese pedido se conserva (ya guarda el nombre del producto aparte),
// solo se desvincula del producto borrado.
export async function eliminarProductoMilEstilos(productoId) {
  const { error: errorDesvincular } = await supabase
    .from('mil_estilos_pedido_items')
    .update({ producto_id: null })
    .eq('producto_id', productoId);

  if (errorDesvincular) {
    throw new Error('No se pudo preparar el borrado de este producto.');
  }

  const { error: errorProducto } = await supabase
    .from('mil_estilos_productos')
    .delete()
    .eq('id', productoId);

  if (errorProducto) {
    throw new Error('No se pudo eliminar el producto.');
  }
}
