import {
  useEffect,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';

const PRECIOS_RESPALDO = {
  tamanos: {
    a4: 15,
    a3: 25,
    a2: 30,
  },

  marcos: {
    'sin-marco': 0,
    'con-marco': 25,
  },

  wallpapers: [
    {
      id: 'celular',
      nombre: 'Celular',
      precio: 7,
    },
    {
      id: 'laptop',
      nombre: 'Laptop',
      precio: 15,
    },
  ],

  delivery: 15,
};

function usePreciosPublicos() {
  const [precios, setPrecios] =
    useState(PRECIOS_RESPALDO);

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    let montado = true;

    async function cargarPrecios() {
      try {
        const { data, error } =
          await supabase
            .from('bro_precios')
            .select(
              'clave,precio,activo'
            )
            .eq('activo', true);

        if (error) {
          throw error;
        }

        if (!montado) {
          return;
        }

        const mapa = {};

        for (const item of data || []) {
          mapa[item.clave] =
            Number(item.precio);
        }

        setPrecios({
          tamanos: {
            a4:
              mapa.cuadro_a4 ??
              PRECIOS_RESPALDO
                .tamanos.a4,

            a3:
              mapa.cuadro_a3 ??
              PRECIOS_RESPALDO
                .tamanos.a3,

            a2:
              mapa.cuadro_a2 ??
              PRECIOS_RESPALDO
                .tamanos.a2,
          },

          marcos: {
            'sin-marco': 0,

            'con-marco':
              mapa.marco ??
              PRECIOS_RESPALDO
                .marcos[
                  'con-marco'
                ],
          },

          wallpapers: [
            {
              id: 'celular',
              nombre: 'Celular',
              precio:
                mapa.wallpaper_celular ??
                PRECIOS_RESPALDO
                  .wallpapers[0]
                  .precio,
            },
            {
              id: 'laptop',
              nombre: 'Laptop',
              precio:
                mapa.wallpaper_laptop ??
                PRECIOS_RESPALDO
                  .wallpapers[1]
                  .precio,
            },
          ],

          delivery:
            mapa.delivery ??
            PRECIOS_RESPALDO
              .delivery,
        });
      } catch (error) {
        console.error(
          'No se pudieron cargar los precios públicos:',
          error
        );

        /*
          La tienda sigue funcionando
          con los precios de respaldo.
        */
      } finally {
        if (montado) {
          setCargando(false);
        }
      }
    }

    cargarPrecios();

    return () => {
      montado = false;
    };
  }, []);

  return {
    precios,
    cargando,
  };
}

export default usePreciosPublicos;