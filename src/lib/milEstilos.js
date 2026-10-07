import { supabase } from './supabase';

export async function iniciarSesionMilEstilos(usuario, password) {
  const identificador = String(usuario || '').trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: identificador,
    password,
  });

  if (error) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  return data.user;
}

export async function cerrarSesionMilEstilos() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error cerrando sesión (Mil Estilos):', error);
  }
}

export async function obtenerUsuarioActualMilEstilos() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user || null;
}

export async function verificarAdminMilEstilos(userId) {
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase
    .from('mil_estilos_admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error verificando administrador (Mil Estilos):', error);
    return false;
  }

  return Boolean(data);
}
