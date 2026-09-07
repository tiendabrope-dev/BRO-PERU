import {
  supabase,
} from './supabase';

function normalizarCorreo(
  correo
) {
  return String(
    correo || ''
  )
    .trim()
    .toLowerCase();
}

function correoValido(
  correo
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo
  );
}

export async function suscribirNewsletterBro(
  correo
) {
  const correoLimpio =
    normalizarCorreo(
      correo
    );

  if (!correoLimpio) {
    throw new Error(
      'Ingresa tu correo.'
    );
  }

  if (
    correoLimpio.length >
    180
  ) {
    throw new Error(
      'El correo es demasiado largo.'
    );
  }

  if (
    !correoValido(
      correoLimpio
    )
  ) {
    throw new Error(
      'Ingresa un correo válido.'
    );
  }

  const {
    error,
  } = await supabase.rpc(
    'suscribir_newsletter_bro',
    {
      p_email:
        correoLimpio,
    }
  );

  if (error) {
    console.error(
      'Error registrando newsletter:',
      error
    );

    throw new Error(
      'No pudimos registrar tu correo. Intenta nuevamente.'
    );
  }

  return true;
}