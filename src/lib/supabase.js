import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      /*
        SEGURIDAD BRO

        La sesión vive únicamente
        mientras la aplicación está
        abierta.

        Al cerrar, recargar o abandonar
        completamente la página, no se
        conserva una sesión autenticada
        en localStorage.
      */
      persistSession: false,

      autoRefreshToken: true,

      detectSessionInUrl: false,
    },
  }
);