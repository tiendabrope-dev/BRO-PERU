import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';

function useProductosPublicos(
  catalogo
) {
  const [
    estados,
    setEstados,
  ] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargarEstados() {
      const { data, error } =
        await supabase
          .from('bro_productos')
          .select(
            'producto_id,activo'
          );

      if (!activo) {
        return;
      }

      if (error) {
        console.error(
          'No se pudieron cargar los estados de productos:',
          error
        );

        /*
          Si Supabase falla,
          mantenemos el catálogo visible
          para no tumbar la tienda.
        */
        setEstados(null);
        return;
      }

      const mapa = {};

      for (const producto of data || []) {
        mapa[
          String(
            producto.producto_id
          )
        ] = producto.activo;
      }

      setEstados(mapa);
    }

    cargarEstados();

    return () => {
      activo = false;
    };
  }, []);

  return useMemo(() => {
    /*
      Mientras carga Supabase,
      usamos el catálogo normal.
    */
    if (!estados) {
      return catalogo;
    }

    return catalogo.filter(
      (producto) =>
        estados[
          String(producto.id)
        ] !== false
    );
  }, [
    catalogo,
    estados,
  ]);
}

export default useProductosPublicos;