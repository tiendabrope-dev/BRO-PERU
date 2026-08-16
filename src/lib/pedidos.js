import { supabase } from './supabase';

export async function crearPedidoBro({
  formulario,
  carrito,
}) {
  if (!carrito || carrito.length === 0) {
    throw new Error(
      'El carrito no puede estar vacío.'
    );
  }

  const items = carrito.map((item) => ({
    id: String(item.id),
    nombre: item.nombre,
    cantidad: Number(item.cantidad),
    precio: Number(item.precio),
  }));

  const esDomicilio =
    formulario.servicio === 'domicilio';

  const { data, error } = await supabase.rpc(
    'crear_pedido_bro',
    {
      p_nombre_completo:
        formulario.nombre.trim(),

      p_dni:
        formulario.dni.trim(),

      p_telefono:
        formulario.telefono.trim(),

      p_tipo_servicio:
        formulario.servicio,

      p_direccion: esDomicilio
        ? formulario.direccion.trim()
        : null,

      p_distrito: esDomicilio
        ? formulario.distrito.trim()
        : null,

      p_referencia:
        formulario.referencia.trim() || null,

      p_metodo_pago:
        formulario.metodoPago,

      p_items: items,
    }
  );

  if (error) {
    console.error(
      'Error creando pedido:',
      error
    );

    throw new Error(
      error.message ||
        'No se pudo crear el pedido.'
    );
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Supabase no devolvió los datos del pedido.'
    );
  }

  return data[0];
}