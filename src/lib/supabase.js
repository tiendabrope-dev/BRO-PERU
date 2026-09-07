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
        SESIÓN BRO

        - Sobrevive a F5 / recarga.
        - Sobrevive mientras la pestaña
          siga abierta.
        - Al cerrar la pestaña o navegador,
          sessionStorage desaparece.
        - No queda una sesión permanente
          en localStorage.
      */
      persistSession: true,

      storage:
        window.sessionStorage,

      autoRefreshToken: true,

      detectSessionInUrl: false,
    },
  }
);