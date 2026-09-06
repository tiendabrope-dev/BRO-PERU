import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '../lib/supabase';

function normalizarCategoria(
  categoria = ''
) {
  const valor =
    String(categoria)
      .toLowerCase()
      .trim();

  if (
    valor === 'cuadro' ||
    valor === 'cuadros'
  ) {
    return 'cuadros';
  }

  return valor;
}

function useProductosPublicos(
  catalogo = []
) {
  const [
    productosDb,
    setProductosDb,
  ] = useState(null);

  useEffect(() => {
    let montado = true;

    async function cargarProductos() {
      const { data, error } =
        await supabase
          .from('bro_productos')
          .select(`
            producto_id,
            slug,
            nombre,
            categoria,
            activo,
            imagen_url,
            cantidad_resenas,
            creado_en,
            actualizado_en
          `)
          .order('creado_en', {
            ascending: true,
          });

      if (!montado) {
        return;
      }

      if (error) {
        console.error(
          'No se pudieron cargar los productos públicos:',
          error
        );

        /*
          Si Supabase falla,
          conservamos el catálogo
          local para no tumbar BRO.
        */
        setProductosDb(null);

        return;
      }

      setProductosDb(
        data || []
      );
    }

    cargarProductos();

    function actualizarCatalogo() {
      cargarProductos();
    }

    window.addEventListener(
      'bro-productos-actualizados',
      actualizarCatalogo
    );

    return () => {
      montado = false;

      window.removeEventListener(
        'bro-productos-actualizados',
        actualizarCatalogo
      );
    };
  }, []);

  return useMemo(() => {
    /*
      Mientras Supabase carga
      o si ocurre un problema,
      utilizamos el catálogo
      original sin modificarlo.
    */
    if (!productosDb) {
      return catalogo;
    }

    /*
      Tomamos un cuadro existente
      como plantilla.

      De aquí salen:
      - segunda imagen BRO
      - tamaños
      - marcos
      - estructura base
    */
    const plantillaCuadro =
      catalogo.find(
        (producto) =>
          normalizarCategoria(
            producto.categoria
          ) === 'cuadros' &&
          Array.isArray(
            producto.imagenes
          ) &&
          producto.imagenes.length >
            1
      ) ||
      catalogo.find(
        (producto) =>
          normalizarCategoria(
            producto.categoria
          ) === 'cuadros'
      );

    const guiaTamanos =
      plantillaCuadro
        ?.imagenes?.[1] ||
      null;

    const tamanosPorDefecto =
      plantillaCuadro
        ?.tamanos ||
      [];

    const marcosPorDefecto =
      plantillaCuadro
        ?.marcos ||
      [];

    const precioDesdePorDefecto =
      plantillaCuadro
        ?.precioDesde ||
      15;

    const productosPorId =
      new Map();

    const productosPorSlug =
      new Map();

    for (
      const productoDb
      of productosDb
    ) {
      productosPorId.set(
        String(
          productoDb.producto_id
        ),
        productoDb
      );

      if (productoDb.slug) {
        productosPorSlug.set(
          productoDb.slug,
          productoDb
        );
      }
    }

    const idsUtilizados =
      new Set();

    /*
      ==================================
      PRODUCTOS QUE YA EXISTÍAN
      ==================================

      Conservan toda su estructura
      actual.

      Supabase solamente reemplaza:
      - nombre
      - slug
      - imagen principal
      - reseñas
      - activo / inactivo
    */
    const productosExistentes =
      catalogo.flatMap(
        (producto) => {
          const productoDb =
            productosPorId.get(
              String(
                producto.id
              )
            ) ||
            productosPorSlug.get(
              producto.slug
            );

          /*
            Si todavía no existe
            registro en Supabase,
            conservamos el producto.
          */
          if (!productoDb) {
            return [
              producto,
            ];
          }

          idsUtilizados.add(
            String(
              productoDb.producto_id
            )
          );

          if (
            productoDb.activo ===
            false
          ) {
            return [];
          }

          const imagenPrincipal =
            productoDb.imagen_url ||
            producto
              .imagenes?.[0] ||
            producto.imagen;

          const segundaImagen =
            producto
              .imagenes?.[1] ||
            guiaTamanos;

          const imagenes = [];

          if (imagenPrincipal) {
            imagenes.push(
              imagenPrincipal
            );
          }

          if (segundaImagen) {
            imagenes.push(
              segundaImagen
            );
          }

          return [
            {
              ...producto,

              slug:
                productoDb.slug ||
                producto.slug,

              nombre:
                productoDb.nombre ||
                producto.nombre,

              categoria:
                normalizarCategoria(
                  productoDb
                    .categoria ||
                    producto
                      .categoria
                ),

              imagen:
                imagenPrincipal,

              imagenes,

              ratingCount:
                Number(
                  productoDb
                    .cantidad_resenas ||
                    0
                ),
            },
          ];
        }
      );

    /*
      ==================================
      PRODUCTOS NUEVOS DEL ADMIN
      ==================================

      No existen en catalogo.js,
      por eso construimos su estructura
      automáticamente usando el cuadro
      existente como plantilla.
    */
    const productosNuevos =
      productosDb
        .filter(
          (productoDb) =>
            !idsUtilizados.has(
              String(
                productoDb
                  .producto_id
              )
            ) &&
            productoDb.activo !==
              false &&
            normalizarCategoria(
              productoDb.categoria
            ) === 'cuadros' &&
            Boolean(
              productoDb.imagen_url
            )
        )
        .map(
          (productoDb) => {
            const imagenes = [
              productoDb.imagen_url,
            ];

            if (guiaTamanos) {
              imagenes.push(
                guiaTamanos
              );
            }

            return {
              id:
                productoDb
                  .producto_id,

              slug:
                productoDb.slug,

              nombre:
                productoDb.nombre,

              tipo:
                'cuadro',

              categoria:
                'cuadros',

              precioDesde:
                precioDesdePorDefecto,

              imagen:
                productoDb
                  .imagen_url,

              imagenes,

              badge: '',

              rating: 5,

              ratingCount:
                Number(
                  productoDb
                    .cantidad_resenas ||
                    0
                ),

              tamanos:
                tamanosPorDefecto,

              marcos:
                marcosPorDefecto,
            };
          }
        );

    return [
      ...productosExistentes,
      ...productosNuevos,
    ];
  }, [
    catalogo,
    productosDb,
  ]);
}

export default useProductosPublicos;