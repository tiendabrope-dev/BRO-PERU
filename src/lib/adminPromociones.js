import {
  supabase,
} from './supabase';

const SELECT_PROMOCION = `
  id,
  texto,
  orden,
  activo,
  creado_en,
  actualizado_en
`;

function limpiarTexto(
  texto
) {
  return String(
    texto || ''
  ).trim();
}

function validarTexto(
  texto
) {
  const limpio =
    limpiarTexto(
      texto
    );

  if (!limpio) {
    throw new Error(
      'El mensaje no puede estar vacío.'
    );
  }

  if (
    limpio.length >
    120
  ) {
    throw new Error(
      'El mensaje no puede superar los 120 caracteres.'
    );
  }

  return limpio;
}

function validarOrden(
  orden
) {
  const numero =
    Number(
      orden
    );

  if (
    !Number.isInteger(
      numero
    ) ||
    numero < 0
  ) {
    throw new Error(
      'El orden debe ser un número entero válido.'
    );
  }

  return numero;
}

function notificarCambio() {
  if (
    typeof window ===
    'undefined'
  ) {
    return;
  }

  window.dispatchEvent(
    new Event(
      'bro-promociones-actualizadas'
    )
  );
}

export async function obtenerPromocionesAdmin() {
  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_promociones'
    )
    .select(
      SELECT_PROMOCION
    )
    .order(
      'orden',
      {
        ascending: true,
      }
    )
    .order(
      'creado_en',
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      'Error cargando promociones:',
      error
    );

    throw new Error(
      'No se pudieron cargar las promociones.'
    );
  }

  return data || [];
}

export async function crearPromocionAdmin({
  texto,
  orden,
}) {
  const textoLimpio =
    validarTexto(
      texto
    );

  const ordenLimpio =
    validarOrden(
      orden
    );

  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_promociones'
    )
    .insert({
      texto:
        textoLimpio,

      orden:
        ordenLimpio,

      activo:
        true,
    })
    .select(
      SELECT_PROMOCION
    )
    .single();

  if (error) {
    console.error(
      'Error creando promoción:',
      error
    );

    throw new Error(
      'No se pudo crear la promoción.'
    );
  }

  notificarCambio();

  return data;
}

export async function actualizarPromocionAdmin(
  id,
  {
    texto,
    orden,
    activo,
  }
) {
  if (!id) {
    throw new Error(
      'Promoción inválida.'
    );
  }

  const textoLimpio =
    validarTexto(
      texto
    );

  const ordenLimpio =
    validarOrden(
      orden
    );

  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_promociones'
    )
    .update({
      texto:
        textoLimpio,

      orden:
        ordenLimpio,

      activo:
        Boolean(
          activo
        ),

      actualizado_en:
        new Date()
          .toISOString(),
    })
    .eq(
      'id',
      id
    )
    .select(
      SELECT_PROMOCION
    )
    .single();

  if (error) {
    console.error(
      'Error actualizando promoción:',
      error
    );

    throw new Error(
      'No se pudo guardar la promoción.'
    );
  }

  notificarCambio();

  return data;
}

export async function eliminarPromocionAdmin(
  id
) {
  if (!id) {
    throw new Error(
      'Promoción inválida.'
    );
  }

  const {
    error,
  } = await supabase
    .from(
      'bro_promociones'
    )
    .delete()
    .eq(
      'id',
      id
    );

  if (error) {
    console.error(
      'Error eliminando promoción:',
      error
    );

    throw new Error(
      'No se pudo eliminar la promoción.'
    );
  }

  notificarCambio();

  return true;
}