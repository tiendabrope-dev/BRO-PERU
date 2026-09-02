import { supabase } from './supabase';

export async function obtenerPreciosAdmin() {
  const { data, error } =
    await supabase
      .from('bro_precios')
      .select(
        'clave,nombre,categoria,precio,activo'
      )
      .order('categoria')
      .order('clave');

  if (error) {
    throw new Error(
      'No se pudieron cargar los precios.'
    );
  }

  return data || [];
}

export async function actualizarPrecioAdmin(
  clave,
  precio
) {
  const nuevoPrecio =
    Number(precio);

  if (
    !Number.isFinite(nuevoPrecio) ||
    nuevoPrecio < 0
  ) {
    throw new Error(
      'Ingresa un precio válido.'
    );
  }

  const { data, error } =
    await supabase
      .from('bro_precios')
      .update({
        precio: nuevoPrecio,
      })
      .eq('clave', clave)
      .select(
        'clave,nombre,categoria,precio,activo'
      )
      .single();

  if (error) {
    console.error(error);

    throw new Error(
      'No se pudo guardar el precio.'
    );
  }

  return data;
}