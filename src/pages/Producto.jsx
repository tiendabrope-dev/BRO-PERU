import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

function Producto({
  producto,
  onVolver,
  onAgregarAlCarrito,
}) {
  const [
    size,
    setSize,
  ] = useState(null);

  const [
    frame,
    setFrame,
  ] = useState(null);

  const [
    wallpaper,
    setWallpaper,
  ] = useState(null);

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  /*
    Cada vez que cambiamos de producto,
    seleccionamos por defecto la primera
    medida y el primer tipo de marco.
  */
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
  }, [producto]);

  /*
    PRECIO DEL PRODUCTO FÍSICO

    Ejemplo:
    A4 = S/15
    Con marco = +S/15
    Total = S/30
  */
  const precioActual =
    useMemo(() => {
      if (
        wallpaper
      ) {
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

  /*
    LÓGICA DE BLOQUEO MUTUO

    Si selecciona tamaño o marco,
    se desactiva Wallpaper.
  */
  const handleSizeSelect = (
    selectedSize
  ) => {
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
  };

  const handleFrameSelect = (
    selectedFrame
  ) => {
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
  };

  /*
    Si selecciona Wallpaper,
    se desactivan tamaño y marco.

    Todavía NO permitimos agregar
    Wallpaper al carrito porque
    falta definir sus precios
    comerciales en catalogo.js.
  */
  const handleWallpaperSelect = (
    selectedWallpaper
  ) => {
    setWallpaper(
      selectedWallpaper
    );

    setSize(null);
    setFrame(null);
  };

  const handleQuantity = (
    type
  ) => {
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
  };

  /*
    AGREGAR PRODUCTO FÍSICO
    AL CARRITO
  */
  const handleAddToCart = () => {
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
      id: producto.id,

      idCarrito,

      slug:
        producto.slug,

      nombre:
        producto.nombre,

      imagen:
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
  };

  if (!producto) {
    return (
      <main
        style={{
          minHeight: '100vh',
          padding:
            '240px 20px 80px',
          textAlign: 'center',
          fontFamily:
            "'DM Sans', sans-serif",
        }}
      >
        <h1
          style={{
            fontFamily:
              "'Syne', sans-serif",
            fontSize: '36px',
            fontWeight: '800',
            color: '#111111',
          }}
        >
          PRODUCTO NO ENCONTRADO
        </h1>

        <button
          type="button"
          onClick={onVolver}
          style={{
            marginTop: '25px',
            padding:
              '14px 24px',
            background:
              '#111111',
            color:
              '#ffffff',
            border:
              'none',
            borderRadius:
              '6px',
            cursor:
              'pointer',
            fontWeight:
              '700',
          }}
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
    <div
      className="bro-product-page"
      style={{
        maxWidth: '1250px',
        margin: '0 auto',
        padding:
          '240px 20px 80px 20px',
        display: 'flex',
        gap: '50px',
        flexWrap: 'wrap',
        fontFamily:
          "'DM Sans', sans-serif",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@500;600;700&display=swap');

          .bro-btn-option {
            padding: 10px 22px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            border: 1px solid #d1d1d1;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            background-color: #ffffff;
            color: #111111;
          }

          .bro-btn-option:hover {
            border-color: #111111;
          }

          .bro-btn-option.active {
            background-color: #111111;
            color: #ffffff;
            border-color: #111111;
          }

          .bro-btn-option:disabled {
            cursor: not-allowed;
            opacity: 0.55;
          }

          .bro-section-label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            margin-bottom: 10px;
            color: #111111;
            text-transform: uppercase;
          }

          .bro-product-add-cart {
            width: 100%;
            min-height: 56px;
            margin-top: 8px;
            padding: 0 24px;
            border: none;
            border-radius: 6px;
            background: #111111;
            color: #ffffff;
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.12em;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .bro-product-add-cart:hover {
            background: #2d5a3d;
          }

          .bro-product-add-cart:disabled {
            background: #c8c8c8;
            color: #ffffff;
            cursor: not-allowed;
          }

          .bro-wallpaper-message {
            margin-top: 10px;
            padding: 12px 14px;
            border-radius: 6px;
            background: #f4f1ec;
            color: #666666;
            font-size: 12px;
            line-height: 1.5;
          }

          @media (max-width: 760px) {
            .bro-product-page {
              padding-top: 190px !important;
              gap: 30px !important;
            }
          }
        `}
      </style>

      {/* COLUMNA IZQUIERDA */}
      <div
        style={{
          flex:
            '1 1 500px',
          display:
            'flex',
          alignItems:
            'flex-start',
          justifyContent:
            'center',
        }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor:
              '#ffffff',
            display: 'flex',
            justifyContent:
              'center',
            alignItems:
              'center',
          }}
        >
          <img
            src={
              producto.imagen
            }
            alt={
              producto.nombre
            }
            style={{
              width: '100%',
              maxWidth:
                '480px',
              height:
                'auto',
              objectFit:
                'contain',
            }}
          />
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div
        style={{
          flex:
            '1 1 450px',
          display:
            'flex',
          flexDirection:
            'column',
        }}
      >
        <div
          style={{
            marginBottom:
              '10px',
          }}
        >
          {producto.badge && (
            <span
              style={{
                backgroundColor:
                  '#111111',
                color:
                  '#ffffff',
                padding:
                  '5px 14px',
                borderRadius:
                  '20px',
                fontSize:
                  '11px',
                fontWeight:
                  '700',
                letterSpacing:
                  '0.05em',
              }}
            >
              {producto.badge}
            </span>
          )}

          <p
            style={{
              color:
                '#4a7a5e',
              fontWeight:
                '700',
              fontSize:
                '13px',
              letterSpacing:
                '0.1em',
              marginTop:
                '12px',
              textTransform:
                'uppercase',
            }}
          >
            {producto.categoria}
          </p>
        </div>

        <h1
          style={{
            fontFamily:
              "'Syne', sans-serif",
            fontSize:
              '42px',
            fontWeight:
              '800',
            lineHeight:
              '1.15',
            textTransform:
              'uppercase',
            margin:
              '15px 0 10px 0',
            color:
              '#111111',
          }}
        >
          {producto.nombre}
        </h1>

        <div
          style={{
            color:
              '#e9b000',
            fontSize:
              '16px',
            marginBottom:
              '10px',
          }}
        >
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

          <span
            style={{
              marginLeft:
                '6px',
              fontSize:
                '13px',
              color:
                '#888888',
            }}
          >
            (
            {producto.ratingCount ||
              0}
            )
          </span>
        </div>

        <p
          style={{
            fontSize:
              '26px',
            fontWeight:
              '700',
            margin:
              '0 0 20px 0',
            color:
              '#111111',
          }}
        >
          {precioActual !== null
            ? `S/ ${precioActual.toFixed(
                2
              )}`
            : 'WALLPAPER'}
        </p>

        {producto.slug ===
          'cuadro-personalizado' && (
          <div
            style={{
              backgroundColor:
                '#e54b4b',
              color:
                '#ffffff',
              padding:
                '16px 20px',
              borderRadius:
                '6px',
              textAlign:
                'center',
              fontWeight:
                '700',
              fontSize:
                '13px',
              lineHeight:
                '1.4',
              marginBottom:
                '30px',
            }}
          >
            DISEÑO PERSONALIZADO:
            TRAS EL PEDIDO NOS
            <br />
            CONTACTAREMOS PARA
            PEDIRTE LA FOTO DE TU
            AUTO.
          </div>
        )}

        {/* OPCIONES */}
        <div
          style={{
            display:
              'flex',
            flexDirection:
              'column',
            gap:
              '22px',
          }}
        >
          {/* TAMAÑO */}
          {producto.tamanos?.length >
            0 && (
            <div>
              <label
                className="bro-section-label"
              >
                TAMAÑO:
              </label>

              <div
                style={{
                  display:
                    'flex',
                  gap:
                    '10px',
                  flexWrap:
                    'wrap',
                }}
              >
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
            <div>
              <label
                className="bro-section-label"
              >
                MARCO:
              </label>

              <div
                style={{
                  display:
                    'flex',
                  gap:
                    '10px',
                  flexWrap:
                    'wrap',
                }}
              >
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
          <div>
            <label
              className="bro-section-label"
            >
              WALLPAPER:
            </label>

            <div
              style={{
                display:
                  'flex',
                gap:
                  '10px',
                flexWrap:
                  'wrap',
              }}
            >
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
              <div
                className="bro-wallpaper-message"
              >
                El precio de
                Wallpaper todavía no
                está configurado en el
                catálogo. Primero
                definiremos el precio
                de Celular y Laptop.
              </div>
            )}
          </div>

          {/* CANTIDAD */}
          <div>
            <label
              className="bro-section-label"
            >
              CANTIDAD:
            </label>

            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                border:
                  '1px solid #d1d1d1',
                borderRadius:
                  '6px',
                width:
                  'fit-content',
                overflow:
                  'hidden',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  handleQuantity(
                    'minus'
                  )
                }
                style={{
                  border:
                    'none',
                  background:
                    'none',
                  padding:
                    '10px 16px',
                  cursor:
                    'pointer',
                  fontSize:
                    '16px',
                  fontWeight:
                    'bold',
                }}
              >
                −
              </button>

              <span
                style={{
                  padding:
                    '10px 12px',
                  fontWeight:
                    '600',
                  minWidth:
                    '30px',
                  textAlign:
                    'center',
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleQuantity(
                    'plus'
                  )
                }
                style={{
                  border:
                    'none',
                  background:
                    'none',
                  padding:
                    '10px 16px',
                  cursor:
                    'pointer',
                  fontSize:
                    '16px',
                  fontWeight:
                    'bold',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* AGREGAR AL CARRITO */}
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
      </div>
    </div>
  );
}

export default Producto;