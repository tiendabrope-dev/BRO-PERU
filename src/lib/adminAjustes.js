import {
  supabase,
} from './supabase';

const SELECT_AJUSTES = `
  id,
  whatsapp_pedidos,
  yape_plin_numero,
  yape_plin_titular,
  actualizado_en
`;

function limpiarTexto(
  texto
) {
  return String(
    texto || ''
  ).trim();
}

function validarWhatsapp(
  numero
) {
  const limpio =
    limpiarTexto(
      numero
    ).replace(
      /\D/g,
      ''
    );

  if (
    !/^\d{9,15}$/.test(
      limpio
    )
  ) {
    throw new Error(
      'El WhatsApp debe tener solo números, con código de país (9 a 15 dígitos).'
    );
  }

  return limpio;
}

function validarNumeroPago(
  numero
) {
  const limpio =
    limpiarTexto(
      numero
    ).replace(
      /\D/g,
      ''
    );

  if (
    !/^\d{6,12}$/.test(
      limpio
    )
  ) {
    throw new Error(
      'El número de Yape/Plin debe tener solo números (6 a 12 dígitos).'
    );
  }

  return limpio;
}

function validarTitular(
  titular
) {
  const limpio =
    limpiarTexto(
      titular
    );

  if (!limpio) {
    throw new Error(
      'Ingresa el titular de Yape/Plin.'
    );
  }

  if (
    limpio.length >
    80
  ) {
    throw new Error(
      'El titular no puede superar los 80 caracteres.'
    );
  }

  return limpio;
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
      'bro-ajustes-actualizados'
    )
  );
}

export async function obtenerAjustesAdmin() {
  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_ajustes'
    )
    .select(
      SELECT_AJUSTES
    )
    .eq(
      'id',
      1
    )
    .single();

  if (error) {
    console.error(
      'Error cargando ajustes:',
      error
    );

    throw new Error(
      'No se pudieron cargar los ajustes.'
    );
  }

  return data;
}

export async function actualizarAjustesAdmin({
  whatsappPedidos,
  yapePlinNumero,
  yapePlinTitular,
}) {
  const whatsappLimpio =
    validarWhatsapp(
      whatsappPedidos
    );

  const numeroPagoLimpio =
    validarNumeroPago(
      yapePlinNumero
    );

  const titularLimpio =
    validarTitular(
      yapePlinTitular
    );

  const {
    data,
    error,
  } = await supabase
    .from(
      'bro_ajustes'
    )
    .update({
      whatsapp_pedidos:
        whatsappLimpio,

      yape_plin_numero:
        numeroPagoLimpio,

      yape_plin_titular:
        titularLimpio,

      actualizado_en:
        new Date()
          .toISOString(),
    })
    .eq(
      'id',
      1
    )
    .select(
      SELECT_AJUSTES
    )
    .single();

  if (error) {
    console.error(
      'Error actualizando ajustes:',
      error
    );

    throw new Error(
      'No se pudieron guardar los ajustes.'
    );
  }

  notificarCambio();

  return data;
}