import { supabase } from './supabase';

const CLAVE_USUARIO_RECORDADO =
  'bro-usuario-recordado';

export function obtenerUsuarioRecordado() {
  if (
    typeof window ===
    'undefined'
  ) {
    return '';
  }

  try {
    return (
      localStorage.getItem(
        CLAVE_USUARIO_RECORDADO
      ) || ''
    );
  } catch {
    return '';
  }
}

export function guardarUsuarioRecordado(
  usuario
) {
  if (
    typeof window ===
    'undefined'
  ) {
    return;
  }

  try {
    localStorage.setItem(
      CLAVE_USUARIO_RECORDADO,
      String(
        usuario || ''
      ).trim()
    );
  } catch {
    /*
      Si el navegador bloquea
      localStorage, el acceso
      sigue funcionando.
    */
  }
}

export function olvidarUsuarioRecordado() {
  if (
    typeof window ===
    'undefined'
  ) {
    return;
  }

  try {
    localStorage.removeItem(
      CLAVE_USUARIO_RECORDADO
    );
  } catch {
    /* Sin acción. */
  }
}

export async function iniciarSesionAdmin(
  usuario,
  password
) {
  const identificador =
    String(
      usuario || ''
    ).trim();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: identificador,
      password,
    });

  if (error) {
    throw new Error(
      'Usuario o contraseña incorrectos.'
    );
  }

  return data.user;
}

export async function cerrarSesionAdmin() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error(
      'Error cerrando sesión:',
      error
    );
  }
}

export async function obtenerUsuarioActual() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user || null;
}

export async function verificarAdmin(
  userId
) {
  if (!userId) {
    return false;
  }

  const { data, error } =
    await supabase
      .from('bro_admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

  if (error) {
    console.error(
      'Error verificando administrador:',
      error
    );

    return false;
  }

  return Boolean(data);
}