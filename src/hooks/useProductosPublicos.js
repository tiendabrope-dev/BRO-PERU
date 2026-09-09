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

function obtenerNumeroValido(
  valor,
  fallback = 0
) {
  const numero =
    Number(valor);

  return Number.isFinite(
    numero
  )
    ? numero
    : fallback;
}

function obtenerPromedioBase({
  promedioDb,
  cantidadBase,
  promedioCatalogo,
}) {
  if (
    cantidadBase <= 0
  ) {
    return 0;
  }

  const db =
    Number(promedioDb);

  if (
    Number.isFinite(db) &&
    db >= 0 &&
    db <= 5
  ) {
    return db;
  }

  const catalogo =
    Number(
      promedioCatalogo
    );

  if (
    Number.isFinite(catalogo) &&
    catalogo >= 0 &&
    catalogo <= 5
  ) {
    return catalogo;
  }

  /*
    Compatibilidad con los productos
    antiguos que todavía no tenían
    promedio_resenas_base.
  */
  return 5;
}

function construirEstadisticasReales(
  resenas = []
) {
  const mapa =
    new Map();

  for (
    const resena
    of resenas
  ) {
    const id =
      String(
        resena.producto_id ||
        ''
      );

    if (!id) {
      continue;
    }

    const estrellas =
      obtenerNumeroValido(
        resena.calificacion,
        0
      );

    const actual =
      mapa.get(id) || {
        cantidad: 0,
        suma: 0,
      };

    actual.cantidad += 1;
    actual.suma +=
      estrellas;

    mapa.set(
      id,
      actual
    );
  }

  return mapa;
}

function combinarEstadisticas({
  cantidadBase,
  promedioBase,
  estadisticaReal,
}) {
  const base =
    Math.max(
      0,
      Math.trunc(
        obtenerNumeroValido(
          cantidadBase,
          0
        )
      )
    );

  const reales =
    Math.max(
      0,
      Math.trunc(
        obtenerNumeroValido(
          estadisticaReal
            ?.cantidad,
          0
        )
      )
    );

  const sumaReal =
    obtenerNumeroValido(
      estadisticaReal
        ?.suma,
      0
    );

  const total =
    base +
    reales;

  if (total === 0) {
    return {
      cantidadTotal: 0,
      promedioTotal: 0,
      cantidadReal: 0,
    };
  }

  const sumaBase =
    base *
    obtenerNumeroValido(
      promedioBase,
      0
    );

  const promedioTotal =
    (
      sumaBase +
      sumaReal
    ) /
    total;

  return {
    cantidadTotal:
      total,

    promedioTotal:
      Math.round(
        promedioTotal *
        100
      ) / 100,

    cantidadReal:
      reales,
  };
}

function useProductosPublicos(
  catalogo = []
) {
  const [
    productosDb,
    setProductosDb,
  ] = useState(null);

  const [
    resenasDb,
    setResenasDb,
  ] = useState([]);

  const [
    seccionesDb,
    setSeccionesDb,
  ] = useState([]);

  const [
    asignacionesDb,
    setAsignacionesDb,
  ] = useState([]);

  useEffect(() => {
    let montado = true;

    async function cargarProductos() {
      const [
        respuestaProductos,
        respuestaResenas,
        respuestaSecciones,
        respuestaAsignaciones,
      ] = await Promise.all([
        supabase
          .from('bro_productos')
          .select(`
            producto_id,
            slug,
            nombre,
            categoria,
            activo,
            imagen_url,
            cantidad_resenas,
            promedio_resenas_base,
            creado_en,
            actualizado_en
          `)
          .order('creado_en', {
            ascending: true,
          }),

        /*
          RLS solo permite que el público
          vea las reseñas aprobadas.

          El filtro explícito mantiene la
          intención clara incluso si luego
          cambian las políticas.
        */
        supabase
          .from('bro_resenas')
          .select(`
            producto_id,
            calificacion
          `)
          .eq(
            'estado',
            'aprobada'
          ),

        /*
          Secciones destacadas
          (Más Vendidos, etc.).

          Solo las activas, en el
          orden que definió el admin.
        */
        supabase
          .from('bro_secciones')
          .select(`
            id,
            orden
          `)
          .eq(
            'activo',
            true
          )
          .order('orden', {
            ascending: true,
          })
          .order('creado_en', {
            ascending: true,
          }),

        /*
          Qué productos pertenecen
          a cada sección.
        */
        supabase
          .from('bro_producto_secciones')
          .select(`
            producto_id,
            seccion_id
          `),
      ]);

      if (!montado) {
        return;
      }

      if (
        respuestaProductos.error
      ) {
        console.error(
          'No se pudieron cargar los productos públicos:',
          respuestaProductos.error
        );

        /*
          Si Supabase falla,
          conservamos el catálogo
          local para no tumbar BRO.
        */
        setProductosDb(null);
        setResenasDb([]);
        setSeccionesDb([]);
        setAsignacionesDb([]);

        return;
      }

      if (
        respuestaResenas.error
      ) {
        console.error(
          'No se pudieron cargar las reseñas públicas:',
          respuestaResenas.error
        );

        /*
          Los productos siguen funcionando.
          Simplemente se muestran sus valores
          base hasta que pueda cargarse la
          información de reseñas reales.
        */
        setResenasDb([]);
      } else {
        setResenasDb(
          respuestaResenas.data ||
          []
        );
      }

      if (
        respuestaSecciones.error
      ) {
        console.error(
          'No se pudieron cargar las secciones públicas:',
          respuestaSecciones.error
        );

        /*
          Sin secciones disponibles,
          los carruseles vuelven a su
          comportamiento anterior
          (no filtran por curación).
        */
        setSeccionesDb([]);
      } else {
        setSeccionesDb(
          respuestaSecciones.data ||
          []
        );
      }

      if (
        respuestaAsignaciones.error
      ) {
        console.error(
          'No se pudieron cargar las asignaciones de secciones:',
          respuestaAsignaciones.error
        );

        setAsignacionesDb([]);
      } else {
        setAsignacionesDb(
          respuestaAsignaciones.data ||
          []
        );
      }

      setProductosDb(
        respuestaProductos.data ||
        []
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

    /*
      Cuando Admin aprueba, oculta,
      rechaza o crea una reseña,
      podemos disparar este evento para
      refrescar los totales sin recargar.
    */
    window.addEventListener(
      'bro-resenas-actualizadas',
      actualizarCatalogo
    );

    /*
      Cuando Admin crea, edita,
      reordena o elimina una sección.
    */
    window.addEventListener(
      'bro-secciones-actualizadas',
      actualizarCatalogo
    );

    return () => {
      montado = false;

      window.removeEventListener(
        'bro-productos-actualizados',
        actualizarCatalogo
      );

      window.removeEventListener(
        'bro-resenas-actualizadas',
        actualizarCatalogo
      );

      window.removeEventListener(
        'bro-secciones-actualizadas',
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

    const estadisticasReales =
      construirEstadisticasReales(
        resenasDb
      );

    /*
      ==================================
      SECCIÓN PRINCIPAL
      ==================================

      Por ahora, el carrusel de
      "Más Vendidos" del Home muestra
      la primera sección activa
      (menor orden).

      Si no hay ninguna sección
      activa (o falló la carga),
      idsSeccionPrincipal queda en
      null y los carruseles vuelven
      a mostrar todos los cuadros,
      igual que antes de Secciones.
    */
    const seccionPrincipal =
      seccionesDb[0] ||
      null;

    const idsSeccionPrincipal =
      seccionPrincipal
        ? new Set(
            asignacionesDb
              .filter(
                (fila) =>
                  fila.seccion_id ===
                  seccionPrincipal.id
              )
              .map(
                (fila) =>
                  String(
                    fila.producto_id
                  )
              )
          )
        : null;

    function estaEnSeccionPrincipal(
      productoId
    ) {
      if (
        !idsSeccionPrincipal
      ) {
        return true;
      }

      return idsSeccionPrincipal.has(
        productoId
      );
    }

    const idsUtilizados =
      new Set();

    /*
      ==================================
      PRODUCTOS QUE YA EXISTÍAN
      ==================================

      Conservan toda su estructura
      actual.

      Supabase reemplaza:
      - nombre
      - slug
      - imagen principal
      - reseñas base
      - promedio base
      - activo / inactivo

      Las reseñas aprobadas reales
      se suman automáticamente.
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
              {
                ...producto,

                enSeccionPrincipal:
                  estaEnSeccionPrincipal(
                    String(
                      producto.id
                    )
                  ),
              },
            ];
          }

          const productoId =
            String(
              productoDb
                .producto_id
            );

          idsUtilizados.add(
            productoId
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

          const cantidadBase =
            Math.max(
              0,
              Number.parseInt(
                productoDb
                  .cantidad_resenas,
                10
              ) || 0
            );

          const promedioBase =
            obtenerPromedioBase({
              promedioDb:
                productoDb
                  .promedio_resenas_base,

              cantidadBase,

              promedioCatalogo:
                producto.rating,
            });

          const combinada =
            combinarEstadisticas({
              cantidadBase,
              promedioBase,
              estadisticaReal:
                estadisticasReales.get(
                  productoId
                ),
            });

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

              /*
                rating y ratingCount son
                los valores finales que
                consume la tienda.
              */
              rating:
                combinada
                  .promedioTotal,

              ratingCount:
                combinada
                  .cantidadTotal,

              /*
                También exponemos el
                desglose para Producto.jsx
                y futuras pantallas.
              */
              ratingBase:
                promedioBase,

              ratingCountBase:
                cantidadBase,

              ratingCountReal:
                combinada
                  .cantidadReal,

              enSeccionPrincipal:
                estaEnSeccionPrincipal(
                  productoId
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
            const productoId =
              String(
                productoDb
                  .producto_id
              );

            const imagenes = [
              productoDb.imagen_url,
            ];

            if (guiaTamanos) {
              imagenes.push(
                guiaTamanos
              );
            }

            const cantidadBase =
              Math.max(
                0,
                Number.parseInt(
                  productoDb
                    .cantidad_resenas,
                  10
                ) || 0
              );

            const promedioBase =
              obtenerPromedioBase({
                promedioDb:
                  productoDb
                    .promedio_resenas_base,

                cantidadBase,

                promedioCatalogo:
                  5,
              });

            const combinada =
              combinarEstadisticas({
                cantidadBase,
                promedioBase,
                estadisticaReal:
                  estadisticasReales.get(
                    productoId
                  ),
              });

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

              rating:
                combinada
                  .promedioTotal,

              ratingCount:
                combinada
                  .cantidadTotal,

              ratingBase:
                promedioBase,

              ratingCountBase:
                cantidadBase,

              ratingCountReal:
                combinada
                  .cantidadReal,

              tamanos:
                tamanosPorDefecto,

              marcos:
                marcosPorDefecto,

              enSeccionPrincipal:
                estaEnSeccionPrincipal(
                  productoId
                ),
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
    resenasDb,
    seccionesDb,
    asignacionesDb,
  ]);
}

export default useProductosPublicos;