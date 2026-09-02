import { supabase } from './supabase';

export async function crearPedidoBro({
  formulario,
  carrito,
}) {
  if (
    !carrito ||
    carrito.length === 0
  ) {
    throw new Error(
      'El carrito no puede estar vacío.'
    );
  }

  const items =
    carrito.map((item) => ({
      id:
        String(item.id),

      id_carrito:
        item.idCarrito
          ? String(item.idCarrito)
          : null,

      nombre:
        item.nombre,

      variante_texto:
        item.varianteTexto ||
        null,

      tamano:
        item.tamano ||
        null,

      tamano_id:
        item.tamanoId ||
        null,

      marco:
        item.marco ||
        null,

      marco_id:
        item.marcoId ||
        null,

      wallpaper:
        item.wallpaper ||
        null,

      wallpaper_id:
        item.wallpaperId ||
        null,

      tipo:
        item.tipo ||
        null,

      cantidad:
        Number(
          item.cantidad
        ),

      /*
        Este precio todavía viaja por compatibilidad
        con el frontend.

        IMPORTANTE:
        Supabase dejará de confiar en este valor.
        El precio oficial será recalculado en servidor.
      */
      precio:
        Number(
          item.precio
        ),
    }));

  const esDomicilio =
    formulario.servicio ===
    'domicilio';

  const {
    data,
    error,
  } = await supabase.rpc(
    'crear_pedido_bro',
    {
      p_nombre_completo:
        formulario.nombre.trim(),

      p_dni:
        formulario.dni.trim(),

      p_telefono:
        formulario.telefono.trim(),

      p_tipo_servicio:
        formulario.servicio ===
        'digital'
          ? 'contraentrega'
          : formulario.servicio,

      p_direccion:
        esDomicilio
          ? formulario.direccion.trim()
          : null,

      p_distrito:
        esDomicilio
          ? formulario.distrito.trim()
          : null,

      p_referencia:
        formulario.referencia.trim() ||
        null,

      p_metodo_pago:
        formulario.metodoPago,

      p_items:
        items,
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

  if (
    !data ||
    data.length === 0
  ) {
    throw new Error(
      'Supabase no devolvió los datos del pedido.'
    );
  }

  return data[0];
}