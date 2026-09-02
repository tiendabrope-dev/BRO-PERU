import { supabase } from './supabase';

export async function obtenerProductosAdmin() {
  const { data, error } =
    await supabase
      .from('bro_productos')
      .select(`
        producto_id,
        slug,
        nombre,
        categoria,
        activo,
        actualizado_en
      `)
      .order('nombre', {
        ascending: true,
      });

  if (error) {
    console.error(
      'Error cargando productos:',
      error
    );

    throw new Error(
      'No se pudieron cargar los productos.'
    );
  }

  return data || [];
}

export async function cambiarEstadoProductoAdmin(
  productoId,
  activo
) {
  const { data, error } =
    await supabase
      .from('bro_productos')
      .update({
        activo: Boolean(activo),
      })
      .eq(
        'producto_id',
        String(productoId)
      )
      .select(`
        producto_id,
        slug,
        nombre,
        categoria,
        activo,
        actualizado_en
      `)
      .single();

  if (error) {
    console.error(
      'Error actualizando producto:',
      error
    );

    throw new Error(
      'No se pudo actualizar el producto.'
    );
  }

  return data;
}