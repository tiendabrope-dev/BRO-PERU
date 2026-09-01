import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import '../styles/producto.css';

function Producto({
  producto,
  onVolver,
  onAgregarAlCarrito,
}) {
  const [size, setSize] =
    useState(null);

  const [frame, setFrame] =
    useState(null);

  const [wallpaper, setWallpaper] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

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

  const precioActual =
    useMemo(() => {
      if (wallpaper) {
        return null;
      }

      const precioTamano =
        Number(
          size?.precio || 0
        );

      const adicionalMarco =
        Number(
          frame?.adicional || 0
        );

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

  function handleSizeSelect(
    selectedSize
  ) {
    setSize(selectedSize);

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
      !size ||
      !frame ||
      wallpaper
    ) {
      return;
    }

    const idCarrito =
      `${producto.id}` +
      `-${size.id}` +
      `-${frame.id}`;

    const varianteTexto =
      `${size.nombre} · ${frame.nombre}`;

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

      tamano:
        size.nombre,

      tamanoId:
        size.id,

      marco:
        frame.nombre,

      marcoId:
        frame.id,

      tipo:
        'fisico',
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

  const rating =
    Math.max(
      0,
      Math.min(
        5,
        Math.round(
          Number(
            producto.rating ||
              0
          )
        )
      )
    );

  return (
    <main className="bro-product-page">

      <div className="bro-product-layout">

        {/* =====================================
            GALERÍA
        ===================================== */}

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

        {/* =====================================
            INFORMACIÓN
        ===================================== */}

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
                  producto.ratingCount ||
                  0
                }
                )
              </span>

            </div>

            <p className="bro-product-price-detail">

              {precioActual !==
              null
                ? `S/ ${precioActual.toFixed(
                    2
                  )}`
                : 'WALLPAPER'}

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

          {/* =================================
              OPCIONES
          ================================= */}

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

                {[
                  'Celular',
                  'Laptop',
                ].map(
                  (
                    tipoWallpaper
                  ) => (
                    <button
                      key={
                        tipoWallpaper
                      }
                      type="button"
                      className={`bro-btn-option ${
                        wallpaper ===
                        tipoWallpaper
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        handleWallpaperSelect(
                          tipoWallpaper
                        )
                      }
                    >
                      {
                        tipoWallpaper
                      }
                    </button>
                  )
                )}

              </div>

              {wallpaper && (
                <div className="bro-wallpaper-message">

                  El precio de
                  Wallpaper todavía no
                  está configurado en el
                  catálogo.

                </div>
              )}

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
                Boolean(
                  wallpaper
                ) ||
                !size ||
                !frame
              }
            >
              {wallpaper
                ? 'PRECIO DE WALLPAPER PENDIENTE'
                : `AGREGAR AL CARRITO · S/ ${(
                    precioActual *
                    quantity
                  ).toFixed(
                    2
                  )}`}
            </button>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Producto;