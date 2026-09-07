import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import usePreciosPublicos from '../hooks/usePreciosPublicos';
import { obtenerResenasProducto } from '../lib/resenas';

import '../styles/producto.css';

function formatearFechaResena(fecha) {
  if (!fecha) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ).format(
      new Date(`${fecha}T12:00:00`)
    );
  } catch {
    return fecha;
  }
}

function Producto({
  producto,
  onVolver,
  onAgregarAlCarrito,
}) {
  const { precios } =
    usePreciosPublicos();

  const [
    resenasProducto,
    setResenasProducto,
  ] = useState([]);

  const [
    cargandoResenas,
    setCargandoResenas,
  ] = useState(true);

  const [
    errorResenas,
    setErrorResenas,
  ] = useState('');

  const [size, setSize] =
    useState(null);

  const [frame, setFrame] =
    useState(null);

  const [
    wallpaper,
    setWallpaper,
  ] = useState(null);

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    imagenActiva,
    setImagenActiva,
  ] = useState(0);

  const imagenesProducto =
    useMemo(() => {
      if (
        Array.isArray(
          producto?.imagenes
        ) &&
        producto.imagenes.length >
          0
      ) {
        return producto.imagenes;
      }

      if (producto?.imagen) {
        return [
          producto.imagen,
        ];
      }

      return [];
    }, [producto]);

  useEffect(() => {
    if (!producto) {
      return;
    }

    setSize(
      producto.tamanos?.[0] ||
        null
    );

    setFrame(
      producto.marcos?.[0] ||
        null
    );

    setWallpaper(null);

    setQuantity(1);

    setImagenActiva(0);
  }, [producto]);

  useEffect(() => {
    let activo = true;

    async function cargarResenas() {
      if (!producto?.id) {
        if (activo) {
          setResenasProducto([]);
          setCargandoResenas(false);
          setErrorResenas('');
        }

        return;
      }

      setCargandoResenas(true);
      setErrorResenas('');

      try {
        const datos =
          await obtenerResenasProducto(
            producto.id
          );

        if (!activo) {
          return;
        }

        setResenasProducto(
          datos || []
        );
      } catch (errorCarga) {
        if (!activo) {
          return;
        }

        console.error(
          'No se pudieron cargar las reseñas públicas:',
          errorCarga
        );

        setResenasProducto([]);

        setErrorResenas(
          'No pudimos cargar las reseñas en este momento.'
        );
      } finally {
        if (activo) {
          setCargandoResenas(false);
        }
      }
    }

    cargarResenas();

    function recargarResenas() {
      cargarResenas();
    }

    window.addEventListener(
      'bro-resenas-actualizadas',
      recargarResenas
    );

    return () => {
      activo = false;

      window.removeEventListener(
        'bro-resenas-actualizadas',
        recargarResenas
      );
    };
  }, [
    producto?.id,
  ]);

  const precioActual =
    useMemo(() => {
      /*
        WALLPAPER

        Celular = S/ 7
        Laptop = S/ 15
      */
      if (wallpaper) {
        return Number(
          wallpaper.precio
        );
      }

      /*
        CUADRO

        A4 = S/ 15
        A3 = S/ 25
        A2 = S/ 30

        Marco = + S/ 25
      */

      if (!size) {
        return 0;
      }

      const precioTamano =
        precios.tamanos[
          size.id
        ] ??
        Number(
          size.precio || 0
        );

      const adicionalMarco =
        frame
          ? (
              precios.marcos[
                frame.id
              ] ??
              Number(
                frame.adicional ||
                  0
              )
            )
          : 0;

      return (
        precioTamano +
        adicionalMarco
      );
    }, [
      size,
      frame,
      wallpaper,
    ]);

  const esGuiaTamanos =
    imagenActiva === 1;

  const configuracionValida =
    Boolean(wallpaper) ||
    Boolean(
      size &&
      frame
    );

  function handleSizeSelect(
    selectedSize
  ) {
    setSize(
      selectedSize
    );

    setWallpaper(null);

    if (!frame) {
      setFrame(
        producto.marcos?.[0] ||
          null
      );
    }
  }

  function handleFrameSelect(
    selectedFrame
  ) {
    setFrame(
      selectedFrame
    );

    setWallpaper(null);

    if (!size) {
      setSize(
        producto.tamanos?.[0] ||
          null
      );
    }
  }

  function handleWallpaperSelect(
    selectedWallpaper
  ) {
    setWallpaper(
      selectedWallpaper
    );

    setSize(null);

    setFrame(null);
  }

  function handleQuantity(
    type
  ) {
    if (
      type === 'minus' &&
      quantity > 1
    ) {
      setQuantity(
        (actual) =>
          actual - 1
      );
    }

    if (
      type === 'plus'
    ) {
      setQuantity(
        (actual) =>
          actual + 1
      );
    }
  }

  function handleAddToCart() {
    if (
      !producto ||
      !configuracionValida
    ) {
      return;
    }

    const esWallpaper =
      Boolean(wallpaper);

    const idCarrito =
      esWallpaper
        ? `${producto.id}-wallpaper-${wallpaper.id}`
        : `${producto.id}-${size.id}-${frame.id}`;

    const varianteTexto =
      esWallpaper
        ? `Wallpaper · ${wallpaper.nombre}`
        : `${size.nombre} · ${frame.nombre}`;

    const productoConfigurado = {
      id:
        producto.id,

      idCarrito,

      slug:
        producto.slug,

      nombre:
        producto.nombre,

      imagen:
        imagenesProducto[0] ||
        producto.imagen,

      precio:
        precioActual,

      cantidad:
        quantity,

      varianteTexto,

      tipo:
        esWallpaper
          ? 'digital'
          : 'fisico',

      tamano:
        esWallpaper
          ? null
          : size.nombre,

      tamanoId:
        esWallpaper
          ? null
          : size.id,

      marco:
        esWallpaper
          ? null
          : frame.nombre,

      marcoId:
        esWallpaper
          ? null
          : frame.id,

      wallpaper:
        esWallpaper
          ? wallpaper.nombre
          : null,

      wallpaperId:
        esWallpaper
          ? wallpaper.id
          : null,
    };

    onAgregarAlCarrito(
      productoConfigurado
    );
  }

  if (!producto) {
    return (
      <main className="bro-product-not-found">
        <h1>
          PRODUCTO NO ENCONTRADO
        </h1>

        <button
          type="button"
          onClick={
            onVolver
          }
        >
          VOLVER AL INICIO
        </button>
      </main>
    );
  }

  /*
    ==========================================================
    RESUMEN DE RESEÑAS
    ==========================================================

    IMPORTANTE:

    useProductosPublicos ya entrega:

    producto.rating
    = promedio combinado de:
      - reseñas base / históricas
      - reseñas reales aprobadas

    producto.ratingCount
    = cantidad total combinada de:
      - reseñas base / históricas
      - reseñas reales aprobadas

    Por eso NO volvemos a sumar aquí
    resenasProducto. Esa lista se usa
    únicamente para mostrar las tarjetas
    de opiniones reales aprobadas.
  */

  const resumenResenas =
    useMemo(() => {
      const promedio =
        Math.max(
          0,
          Math.min(
            5,
            Number(
              producto.rating ||
                0
            )
          )
        );

      const total =
        Math.max(
          0,
          Number(
            producto.ratingCount ||
              0
          )
        );

      return {
        promedio,
        total,
      };
    }, [
      producto.rating,
      producto.ratingCount,
    ]);

  const rating =
    Math.max(
      0,
      Math.min(
        5,
        Math.round(
          resumenResenas.promedio
        )
      )
    );

  return (
    <main className="bro-product-page">
      <style>
        {`
          /*
            Solo ajustes móviles nuevos.

            No modificamos el diseño
            aprobado de escritorio.
          */

          @media (max-width:760px) {

            /*
              BADGE DE LA FICHA
            */

            .bro-product-page
            .bro-product-badge-detail {
              min-height:
                22px !important;

              padding:
                3px 8px
                !important;

              font-size:
                8px !important;

              line-height:
                1 !important;

              letter-spacing:
                .035em
                !important;
            }

            /*
              GUÍA DE TAMAÑOS

              La segunda imagen aprovecha
              prácticamente todo el ancho
              real del teléfono.
            */

            .bro-product-page
            .bro-product-main-image.guia {
              width:
                calc(
                  100vw - 10px
                )
                !important;

              max-width:
                460px
                !important;

              margin-left:
                0
                !important;

              margin-right:
                0
                !important;

              align-self:
                center
                !important;

              transform:
                none
                !important;

              overflow:
                visible
                !important;
            }

            .bro-product-page
            .bro-product-main-image.guia
            img {
              width:
                100%
                !important;

              max-width:
                none
                !important;

              height:
                auto
                !important;

              object-fit:
                contain
                !important;
            }
          }
        `}
      </style>

      <div className="bro-product-layout">

        {/* GALERÍA */}

        <section className="bro-product-gallery-column">
          <div className="bro-product-gallery">

            <div
              className={`bro-product-main-image ${
                esGuiaTamanos
                  ? 'guia'
                  : ''
              }`}
            >
              {imagenesProducto.length >
                0 && (
                <img
                  src={
                    imagenesProducto[
                      imagenActiva
                    ]
                  }
                  alt={`${producto.nombre} - Imagen ${
                    imagenActiva +
                    1
                  }`}
                />
              )}
            </div>

            {imagenesProducto.length >
              0 && (
              <div className="bro-product-thumbnails">
                {imagenesProducto.map(
                  (
                    imagen,
                    index
                  ) => (
                    <button
                      key={`${producto.id}-${index}`}
                      type="button"
                      className={`bro-product-thumbnail ${
                        index === 1
                          ? 'guia-thumb'
                          : ''
                      } ${
                        imagenActiva ===
                        index
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        setImagenActiva(
                          index
                        )
                      }
                      aria-label={`Ver imagen ${
                        index + 1
                      } de ${
                        producto.nombre
                      }`}
                    >
                      <img
                        src={
                          imagen
                        }
                        alt=""
                      />
                    </button>
                  )
                )}
              </div>
            )}

          </div>
        </section>

        {/* INFORMACIÓN */}

        <section className="bro-product-info-panel">

          <div className="bro-product-heading">

            {producto.badge && (
              <span className="bro-product-badge-detail">
                {
                  producto.badge
                }
              </span>
            )}

            <p className="bro-product-category-detail">
              {
                producto.categoria
              }
            </p>

            <h1 className="bro-product-title-detail">
              {
                producto.nombre
              }
            </h1>

            <div className="bro-product-rating-detail">

              <span className="bro-product-stars-detail">
                {Array.from({
                  length: 5,
                }).map(
                  (_, index) => (
                    <span
                      key={
                        index
                      }
                    >
                      {index <
                      rating
                        ? '★'
                        : '☆'}
                    </span>
                  )
                )}
              </span>

              <span className="bro-product-rating-count-detail">
                (
                {
                  resumenResenas.total
                }
                )
              </span>

            </div>

            <p className="bro-product-price-detail">
              S/{' '}
              {Number(
                precioActual
              ).toFixed(2)}
            </p>

          </div>

          {/* AVISO PERSONALIZADO */}

          {producto.slug ===
            'cuadro-personalizado' && (
            <div className="bro-product-custom-note">
              <strong>
                DISEÑO PERSONALIZADO:
              </strong>{' '}
              TRAS EL PEDIDO NOS
              CONTACTAREMOS PARA
              PEDIRTE LA FOTO DE TU
              AUTO.
            </div>
          )}

          <div className="bro-product-options">

            {/* TAMAÑO */}

            {producto.tamanos?.length >
              0 && (
              <div className="bro-product-option-group">

                <span className="bro-section-label">
                  TAMAÑO:
                </span>

                <div className="bro-option-row">
                  {producto.tamanos.map(
                    (
                      tamano
                    ) => (
                      <button
                        key={
                          tamano.id
                        }
                        type="button"
                        className={`bro-btn-option ${
                          size?.id ===
                          tamano.id
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          handleSizeSelect(
                            tamano
                          )
                        }
                      >
                        {
                          tamano.nombre
                        }
                      </button>
                    )
                  )}
                </div>

              </div>
            )}

            {/* MARCO */}

            {producto.marcos?.length >
              0 && (
              <div className="bro-product-option-group">

                <span className="bro-section-label">
                  MARCO:
                </span>

                <div className="bro-option-row">
                  {producto.marcos.map(
                    (
                      marco
                    ) => (
                      <button
                        key={
                          marco.id
                        }
                        type="button"
                        className={`bro-btn-option ${
                          frame?.id ===
                          marco.id
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          handleFrameSelect(
                            marco
                          )
                        }
                      >
                        {
                          marco.nombre
                        }
                      </button>
                    )
                  )}
                </div>

              </div>
            )}

            {/* WALLPAPER */}

            <div className="bro-product-option-group">

              <span className="bro-section-label">
                WALLPAPER:
              </span>

              <div className="bro-option-row">

                {precios.wallpapers.map(
                  (
                    opcionWallpaper
                  ) => (
                    <button
                      key={
                        opcionWallpaper.id
                      }
                      type="button"
                      className={`bro-btn-option ${
                        wallpaper?.id ===
                        opcionWallpaper.id
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        handleWallpaperSelect(
                          opcionWallpaper
                        )
                      }
                    >
                      {
                        opcionWallpaper.nombre
                      }
                    </button>
                  )
                )}

              </div>

            </div>

            {/* CANTIDAD */}

            <div className="bro-product-option-group">

              <span className="bro-section-label">
                CANTIDAD:
              </span>

              <div className="bro-product-quantity">

                <button
                  type="button"
                  onClick={() =>
                    handleQuantity(
                      'minus'
                    )
                  }
                  disabled={
                    quantity <= 1
                  }
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>

                <span>
                  {
                    quantity
                  }
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleQuantity(
                      'plus'
                    )
                  }
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>

              </div>

            </div>

            {/* CARRITO */}

            <button
              type="button"
              className="bro-product-add-cart"
              onClick={
                handleAddToCart
              }
              disabled={
                !configuracionValida
              }
            >
              AGREGAR AL CARRITO · S/{' '}
              {(
                precioActual *
                quantity
              ).toFixed(2)}
            </button>

          </div>

        </section>

      </div>

      <section
        className="bro-product-reviews"
        id="resenas"
      >
        <div className="bro-product-reviews-heading">
          <div>
            <span>
              OPINIONES
            </span>

            <h2>
              Reseñas de clientes
            </h2>

            <p>
              Experiencias compartidas por
              clientes de BRO.
            </p>
          </div>

          {resumenResenas.total >
            0 && (
            <div className="bro-product-reviews-summary">
              <strong>
                {resumenResenas.promedio.toFixed(
                  1
                )}
              </strong>

              <div>
                <span className="bro-product-reviews-summary-stars">
                  {Array.from({
                    length: 5,
                  }).map(
                    (
                      _,
                      index
                    ) => (
                      <span
                        key={
                          index
                        }
                      >
                        {index <
                        Math.round(
                          resumenResenas.promedio
                        )
                          ? '★'
                          : '☆'}
                      </span>
                    )
                  )}
                </span>

                <small>
                  {
                    resumenResenas.total
                  }{' '}
                  {resumenResenas.total ===
                  1
                    ? 'reseña'
                    : 'reseñas'}
                </small>
              </div>
            </div>
          )}
        </div>

        {cargandoResenas ? (
          <div className="bro-product-reviews-status">
            Cargando reseñas...
          </div>
        ) : errorResenas ? (
          <div className="bro-product-reviews-error">
            {errorResenas}
          </div>
        ) : resenasProducto.length ===
          0 ? (
          <div className="bro-product-reviews-empty">
            <strong>
              AÚN NO HAY OPINIONES DETALLADAS
            </strong>

            <span>
              Las nuevas opiniones con comentario
              aparecerán aquí después de ser
              aprobadas por BRO.
            </span>
          </div>
        ) : (
          <div className="bro-product-reviews-grid">
            {resenasProducto.map(
              (
                resena
              ) => (
                <article
                  key={
                    resena.id
                  }
                  className={`bro-product-review-card ${
                    resena.imagen_url
                      ? 'con-foto'
                      : 'solo-texto'
                  }`}
                >
                  {resena.imagen_url && (
                    <div className="bro-product-review-photo">
                      <img
                        src={
                          resena.imagen_url
                        }
                        alt={`Foto de la reseña de ${resena.nombre_cliente}`}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="bro-product-review-content">
                    <div className="bro-product-review-top">
                      <div>
                        <strong>
                          {
                            resena.nombre_cliente
                          }
                        </strong>

                        <span>
                          RESEÑA APROBADA
                        </span>
                      </div>

                      <time>
                        {
                          formatearFechaResena(
                            resena.fecha_resena
                          )
                        }
                      </time>
                    </div>

                    <div
                      className="bro-product-review-stars"
                      aria-label={`${resena.calificacion} de 5 estrellas`}
                    >
                      {Array.from({
                        length: 5,
                      }).map(
                        (
                          _,
                          index
                        ) => (
                          <span
                            key={
                              index
                            }
                          >
                            {index <
                            Number(
                              resena.calificacion
                            )
                              ? '★'
                              : '☆'}
                          </span>
                        )
                      )}
                    </div>

                    <p>
                      {
                        resena.comentario
                      }
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Producto;