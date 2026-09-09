import { supabase } from './supabase';

import { generarSlugProducto } from './adminProductos';

const SELECT_SECCION = `
  id,
  nombre,
  slug,
  orden,
  activo,
  creado_en,
  actualizado_en
`;

function notificarCambio() {
  if (
    typeof window ===
    'undefined'
  ) {
    return;
  }

  window.dispatchEvent(
    new Event(
      'bro-secciones-actualizadas'
    )
  );
}

function limpiarNombre(
  nombre
) {
  const limpio =
    String(
      nombre || ''
    ).trim();

  if (!limpio) {
    throw new Error(
      'Ingresa el nombre de la sección.'
    );
  }

  if (
    limpio.length >
    60
  ) {
    throw new Error(
      'El nombre no puede superar los 60 caracteres.'
    );
  }

  return limpio;
}

export async function obtenerSeccionesAdmin() {
  const { data, error } =
    await supabase
      .from('bro_secciones')
      .select(
        SELECT_SECCION
      )
      .order('orden', {
        ascending: true,
      })
      .order('creado_en', {
        ascending: true,
      });

  if (error) {
    console.error(
      'Error cargando secciones:',
      error
    );

    throw new Error(
      'No se pudieron cargar las secciones.'
    );
  }

  return data || [];
}

export async function crearSeccionAdmin({
  nombre,
  orden,
}) {
  const nombreLimpio =
    limpiarNombre(
      nombre
    );

  const slug =
    generarSlugProducto(
      nombreLimpio
    );

  if (!slug) {
    throw new Error(
      'No se pudo generar el identificador de la sección.'
    );
  }

  const { data, error } =
    await supabase
      .from('bro_secciones')
      .insert({
        nombre:
          nombreLimpio,

        slug,

        orden:
          Number(orden) ||
          0,

        activo: true,
      })
      .select(
        SELECT_SECCION
      )
      .single();

  if (error) {
    console.error(
      'Error creando sección:',
      error
    );

    if (
      error.code ===
      '23505'
    ) {
      throw new Error(
        'Ya existe una sección con ese nombre.'
      );
    }

    throw new Error(
      'No se pudo crear la sección.'
    );
  }

  notificarCambio();

  return data;
}

export async function actualizarSeccionAdmin(
  id,
  {
    nombre,
    orden,
    activo,
  }
) {
  if (!id) {
    throw new Error(
      'Sección inválida.'
    );
  }

  const nombreLimpio =
    limpiarNombre(
      nombre
    );

  const slug =
    generarSlugProducto(
      nombreLimpio
    );

  const { data, error } =
    await supabase
      .from('bro_secciones')
      .update({
        nombre:
          nombreLimpio,

        slug,

        orden:
          Number(orden) ||
          0,

        activo:
          Boolean(activo),

        actualizado_en:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        id
      )
      .select(
        SELECT_SECCION
      )
      .single();

  if (error) {
    console.error(
      'Error actualizando sección:',
      error
    );

    if (
      error.code ===
      '23505'
    ) {
      throw new Error(
        'Ya existe otra sección con ese nombre.'
      );
    }

    throw new Error(
      'No se pudo guardar la sección.'
    );
  }

  notificarCambio();

  return data;
}

export async function eliminarSeccionAdmin(
  id
) {
  if (!id) {
    throw new Error(
      'Sección inválida.'
    );
  }

  const { error } =
    await supabase
      .from('bro_secciones')
      .delete()
      .eq(
        'id',
        id
      );

  if (error) {
    console.error(
      'Error eliminando sección:',
      error
    );

    throw new Error(
      'No se pudo eliminar la sección.'
    );
  }

  notificarCambio();

  return true;
}

export async function obtenerAsignacionesSeccionesAdmin() {
  const { data, error } =
    await supabase
      .from('bro_producto_secciones')
      .select(
        'producto_id, seccion_id'
      );

  if (error) {
    console.error(
      'Error cargando asignaciones de secciones:',
      error
    );

    throw new Error(
      'No se pudieron cargar las asignaciones de secciones.'
    );
  }

  return data || [];
}

export async function asignarProductoASeccionAdmin(
  productoId,
  seccionId
) {
  if (
    !productoId ||
    !seccionId
  ) {
    throw new Error(
      'Producto o sección inválidos.'
    );
  }

  const { error } =
    await supabase
      .from('bro_producto_secciones')
      .insert({
        producto_id:
          String(
            productoId
          ),

        seccion_id:
          seccionId,
      });

  if (error) {
    console.error(
      'Error asignando producto a la sección:',
      error
    );

    throw new Error(
      'No se pudo agregar el producto a la sección.'
    );
  }

  return true;
}

export async function quitarProductoDeSeccionAdmin(
  productoId,
  seccionId
) {
  if (
    !productoId ||
    !seccionId
  ) {
    throw new Error(
      'Producto o sección inválidos.'
    );
  }

  const { error } =
    await supabase
      .from('bro_producto_secciones')
      .delete()
      .eq(
        'producto_id',
        String(
          productoId
        )
      )
      .eq(
        'seccion_id',
        seccionId
      );

  if (error) {
    console.error(
      'Error quitando producto de la sección:',
      error
    );

    throw new Error(
      'No se pudo quitar el producto de la sección.'
    );
  }

  return true;
}
