import { supabase } from './supabase';

export async function iniciarSesionAdmin(
  email,
  password
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

  if (error) {
    throw new Error(
      'Correo o contraseña incorrectos.'
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