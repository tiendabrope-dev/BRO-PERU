import {
  useEffect,
  useRef,
  useState,
} from 'react';

function Checkout({
  abierto,
  carrito,
  subtotal,
  costoDelivery,
  total,
  formulario,
  errorCheckout,
  guardandoPedido,
  onCerrar,
  onVolverCarrito,
  onActualizarCampo,
  onConfirmarPedido,
}) {
  const [paso, setPaso] =
    useState(1);

  const [
    errorPaso,
    setErrorPaso,
  ] = useState('');

  const formularioRef =
    useRef(null);

  useEffect(() => {
    if (abierto) {
      setPaso(1);
      setErrorPaso('');
    }
  }, [abierto]);

  if (!abierto) {
    return null;
  }

  const esYapeOPlin =
    formulario.metodoPago ===
      'yape' ||
    formulario.metodoPago ===
      'plin';

  const esTransferencia =
    formulario.metodoPago ===
    'transferencia';

  const esEfectivo =
    formulario.metodoPago ===
    'efectivo';

  function manejarCambioCampo(
    evento
  ) {
    setErrorPaso('');

    onActualizarCampo(
      evento
    );
  }

  function validarPasoActual() {
    if (paso === 1) {
      const nombre =
        formulario.nombre.trim();

      const documento =
        formulario.dni.trim();

      const telefono =
        formulario.telefono
          .trim()
          .replace(
            /[\s()-]/g,
            ''
          );

      if (
        nombre.length < 2
      ) {
        return 'Ingresa tu nombre completo.';
      }

      if (
        !/^[A-Za-z0-9-]{5,20}$/.test(
          documento
        )
      ) {
        return 'Ingresa un documento válido de 5 a 20 caracteres.';
      }

      if (
        !/^\+?\d{9,15}$/.test(
          telefono
        )
      ) {
        return 'Ingresa un teléfono válido de 9 a 15 dígitos.';
      }
    }

    if (paso === 2) {
      if (
        !formulario.servicio
      ) {
        return 'Selecciona un tipo de servicio.';
      }

      if (
        formulario.servicio ===
        'domicilio'
      ) {
        if (
          formulario.direccion
            .trim()
            .length < 3
        ) {
          return 'Ingresa la dirección de entrega.';
        }

        if (
          formulario.distrito
            .trim()
            .length < 2
        ) {
          return 'Ingresa el distrito.';
        }
      }
    }

    if (
      paso === 3 &&
      !formulario.metodoPago
    ) {
      return 'Selecciona un método de pago.';
    }

    return '';
  }

  function avanzarPaso() {
    const error =
      validarPasoActual();

    if (error) {
      setErrorPaso(
        error
      );

      return;
    }

    setErrorPaso('');

    setPaso(
      (actual) =>
        Math.min(
          actual + 1,
          3
        )
    );
  }

  function retrocederPaso() {
    setErrorPaso('');

    setPaso(
      (actual) =>
        Math.max(
          actual - 1,
          1
        )
    );
  }

  function seleccionarPaso(
    numero
  ) {
    /*
      Las pestañas superiores
      no sirven para adelantarse.

      Solo permiten regresar.
    */

    if (
      numero < paso &&
      !guardandoPedido
    ) {
      setErrorPaso('');

      setPaso(
        numero
      );
    }
  }

  function manejarSubmit(
    evento
  ) {
    evento.preventDefault();

    if (paso < 3) {
      avanzarPaso();
      return;
    }

    const error =
      validarPasoActual();

    if (error) {
      setErrorPaso(
        error
      );

      return;
    }

    setErrorPaso('');

    onConfirmarPedido(
      evento
    );
  }

  function bajarADatos() {
    formularioRef.current
      ?.scrollIntoView({
        behavior:
          'smooth',

        block:
          'start',
      });
  }

  return (
    <>
      <style>
        {`
          /*
            Indicador de scroll del checkout.

            Escritorio:
            oculto.

            Móvil:
            aparece debajo del resumen.
          */

          .checkout-mobile-scroll-cue {
            display:
              none;
          }

          @media (max-width:760px) {

            .checkout-form {
              scroll-margin-top:
                72px;
            }

            .checkout-mobile-scroll-cue {
              width:
                100%;

              margin:
                20px 0
                0;

              padding:
                15px 0
                2px;

              display:
                flex;

              flex-direction:
                column;

              align-items:
                center;

              justify-content:
                center;

              gap:
                6px;

              border:
                0;

              border-top:
                1px solid
                #ece9e4;

              background:
                transparent;

              color:
                #2D5A3D;

              cursor:
                pointer;
            }

            .checkout-mobile-scroll-cue
            span {
              font-family:
                'DM Sans',
                sans-serif;

              font-size:
                8px;

              font-weight:
                700;

              line-height:
                1;

              letter-spacing:
                .13em;

              text-transform:
                uppercase;
            }

            .checkout-mobile-scroll-cue
            strong {
              display:
                block;

              font-family:
                'DM Sans',
                sans-serif;

              font-size:
                25px;

              font-weight:
                500;

              line-height:
                1;

              animation:
                broCheckoutArrow
                1.4s ease-in-out
                infinite;
            }

            @keyframes broCheckoutArrow {
              0%,
              100% {
                transform:
                  translateY(0);
              }

              50% {
                transform:
                  translateY(5px);
              }
            }

            @media (
              prefers-reduced-motion:
              reduce
            ) {
              .checkout-mobile-scroll-cue
              strong {
                animation:
                  none;
              }
            }
          }
        `}
      </style>

      <div
        className="checkout-backdrop"
        onClick={
          onCerrar
        }
      />

      <section className="checkout-page">

        <div className="checkout-topbar">

          <button
            type="button"
            className="checkout-back-button"
            onClick={
              onVolverCarrito
            }
            disabled={
              guardandoPedido
            }
          >
            ← VOLVER AL CARRITO
          </button>

          <div className="brand checkout-logo">
            BR<span>O</span>
          </div>

          <button
            type="button"
            className="checkout-close"
            onClick={
              onCerrar
            }
            disabled={
              guardandoPedido
            }
            aria-label="Cerrar checkout"
          >
            ×
          </button>

        </div>

        <div className="checkout-layout">

          <form
            ref={
              formularioRef
            }
            className="checkout-form"
            onSubmit={
              manejarSubmit
            }
          >

            <div className="checkout-title">

              <p className="eyebrow dark">
                FINALIZA TU PEDIDO
              </p>

              <h1>
                DATOS DE
                <br />
                ENTREGA.
              </h1>

              <p>
                Completa tu compra
                en 3 pasos.
              </p>

            </div>

            <div className="checkout-stepper">

              {[
                [
                  1,
                  'DATOS',
                ],
                [
                  2,
                  'ENTREGA',
                ],
                [
                  3,
                  'PAGO',
                ],
              ].map(
                ([
                  numero,
                  etiqueta,
                ]) => (
                  <button
                    type="button"
                    key={
                      numero
                    }
                    className={
                      paso ===
                      numero
                        ? 'checkout-step active'
                        : numero <
                            paso
                          ? 'checkout-step completed'
                          : 'checkout-step'
                    }
                    onClick={() =>
                      seleccionarPaso(
                        numero
                      )
                    }
                    disabled={
                      guardandoPedido ||
                      numero >=
                        paso
                    }
                  >
                    <span>
                      {
                        numero
                      }
                    </span>

                    <strong>
                      {
                        etiqueta
                      }
                    </strong>
                  </button>
                )
              )}

            </div>

            {/* PASO 1 */}

            {paso === 1 && (
              <div className="checkout-block checkout-step-panel">

                <div className="checkout-block-title">
                  <span>
                    01
                  </span>

                  <h2>
                    DATOS DEL CLIENTE
                  </h2>
                </div>

                <div className="checkout-fields">

                  <label className="checkout-field full">
                    <span>
                      NOMBRE COMPLETO
                    </span>

                    <input
                      type="text"
                      name="nombre"
                      value={
                        formulario.nombre
                      }
                      onChange={
                        manejarCambioCampo
                      }
                      autoComplete="name"
                      disabled={
                        guardandoPedido
                      }
                    />
                  </label>

                  <label className="checkout-field">
                    <span>
                      DOCUMENTO DE IDENTIDAD
                    </span>

                    <input
                      type="text"
                      name="dni"
                      value={
                        formulario.dni
                      }
                      onChange={
                        manejarCambioCampo
                      }
                      minLength={
                        5
                      }
                      maxLength={
                        20
                      }
                      placeholder="DNI / CE / PASAPORTE"
                      autoComplete="off"
                      disabled={
                        guardandoPedido
                      }
                    />
                  </label>

                  <label className="checkout-field">
                    <span>
                      TELÉFONO
                    </span>

                    <input
                      type="tel"
                      name="telefono"
                      value={
                        formulario.telefono
                      }
                      onChange={
                        manejarCambioCampo
                      }
                      maxLength={
                        18
                      }
                      inputMode="tel"
                      placeholder="Ej. 926555219"
                      autoComplete="tel"
                      disabled={
                        guardandoPedido
                      }
                    />
                  </label>

                </div>

                {errorPaso && (
                  <div className="checkout-error checkout-step-error">
                    {
                      errorPaso
                    }
                  </div>
                )}

                <div className="checkout-step-actions end">
                  <button
                    type="button"
                    className="checkout-step-next"
                    onClick={
                      avanzarPaso
                    }
                    disabled={
                      guardandoPedido
                    }
                  >
                    CONTINUAR →
                  </button>
                </div>

              </div>
            )}

            {/* PASO 2 */}

            {paso === 2 && (
              <div className="checkout-block checkout-step-panel">

                <div className="checkout-block-title">
                  <span>
                    02
                  </span>

                  <h2>
                    TIPO DE SERVICIO
                  </h2>
                </div>

                <div className="checkout-options">

                  <label
                    className={
                      formulario.servicio ===
                      'contraentrega'
                        ? 'checkout-option active'
                        : 'checkout-option'
                    }
                  >
                    <input
                      type="radio"
                      name="servicio"
                      value="contraentrega"
                      checked={
                        formulario.servicio ===
                        'contraentrega'
                      }
                      onChange={
                        manejarCambioCampo
                      }
                      disabled={
                        guardandoPedido
                      }
                    />

                    <div>
                      <strong>
                        CONTRAENTREGA
                      </strong>

                      <span>
                        Coordina la entrega.
                      </span>
                    </div>
                  </label>

                  <label
                    className={
                      formulario.servicio ===
                      'domicilio'
                        ? 'checkout-option active'
                        : 'checkout-option'
                    }
                  >
                    <input
                      type="radio"
                      name="servicio"
                      value="domicilio"
                      checked={
                        formulario.servicio ===
                        'domicilio'
                      }
                      onChange={
                        manejarCambioCampo
                      }
                      disabled={
                        guardandoPedido
                      }
                    />

                    <div>
                      <strong>
                        DOMICILIO
                      </strong>

                      <span>
                        Delivery S/15.00.
                      </span>
                    </div>
                  </label>

                </div>

                {formulario.servicio ===
                  'domicilio' && (
                  <div className="checkout-fields address-fields">

                    <label className="checkout-field full">
                      <span>
                        DIRECCIÓN
                      </span>

                      <input
                        type="text"
                        name="direccion"
                        value={
                          formulario.direccion
                        }
                        onChange={
                          manejarCambioCampo
                        }
                        disabled={
                          guardandoPedido
                        }
                      />
                    </label>

                    <label className="checkout-field">
                      <span>
                        DISTRITO
                      </span>

                      <input
                        type="text"
                        name="distrito"
                        value={
                          formulario.distrito
                        }
                        onChange={
                          manejarCambioCampo
                        }
                        disabled={
                          guardandoPedido
                        }
                      />
                    </label>

                    <label className="checkout-field">
                      <span>
                        REFERENCIA
                      </span>

                      <input
                        type="text"
                        name="referencia"
                        value={
                          formulario.referencia
                        }
                        onChange={
                          manejarCambioCampo
                        }
                        disabled={
                          guardandoPedido
                        }
                      />
                    </label>

                  </div>
                )}

                {errorPaso && (
                  <div className="checkout-error checkout-step-error">
                    {
                      errorPaso
                    }
                  </div>
                )}

                <div className="checkout-step-actions">

                  <button
                    type="button"
                    className="checkout-step-back"
                    onClick={
                      retrocederPaso
                    }
                    disabled={
                      guardandoPedido
                    }
                  >
                    ← ATRÁS
                  </button>

                  <button
                    type="button"
                    className="checkout-step-next"
                    onClick={
                      avanzarPaso
                    }
                    disabled={
                      guardandoPedido
                    }
                  >
                    CONTINUAR →
                  </button>

                </div>

              </div>
            )}

            {/* PASO 3 */}

            {paso === 3 && (
              <div className="checkout-block checkout-step-panel">

                <div className="checkout-block-title">
                  <span>
                    03
                  </span>

                  <h2>
                    MÉTODO DE PAGO
                  </h2>
                </div>

                <div className="payment-options">

                  {[
                    [
                      'yape',
                      'YAPE',
                    ],
                    [
                      'plin',
                      'PLIN',
                    ],
                    [
                      'transferencia',
                      'TRANSFERENCIA BANCARIA',
                    ],
                    [
                      'efectivo',
                      'CONTRAENTREGA / EFECTIVO',
                    ],
                  ].map(
                    ([
                      valor,
                      etiqueta,
                    ]) => (
                      <label
                        key={
                          valor
                        }
                        className={
                          formulario.metodoPago ===
                          valor
                            ? 'payment-option active'
                            : 'payment-option'
                        }
                      >
                        <input
                          type="radio"
                          name="metodoPago"
                          value={
                            valor
                          }
                          checked={
                            formulario.metodoPago ===
                            valor
                          }
                          onChange={
                            manejarCambioCampo
                          }
                          disabled={
                            guardandoPedido
                          }
                        />

                        <strong>
                          {
                            etiqueta
                          }
                        </strong>
                      </label>
                    )
                  )}

                </div>

                {esYapeOPlin && (
                  <div className="payment-info-box">

                    <span>
                      NÚMERO PARA YAPE / PLIN
                    </span>

                    <strong>
                      926 555 219
                    </strong>

                    <p>
                      DIEGO LOP* VAL*
                    </p>

                  </div>
                )}

                {esTransferencia && (
                  <div className="payment-info-box">

                    <span>
                      TRANSFERENCIA BANCARIA
                    </span>

                    <strong>
                      DATOS POR WHATSAPP
                    </strong>

                    <p>
                      Al confirmar tu
                      pedido te enviaremos
                      los datos bancarios
                      para realizar la
                      transferencia.
                    </p>

                  </div>
                )}

                {esEfectivo && (
                  <div className="payment-info-box">

                    <span>
                      PAGO EN EFECTIVO
                    </span>

                    <strong>
                      PAGO AL RECIBIR
                    </strong>

                    <p>
                      Puedes realizar el
                      pago en efectivo al
                      momento de recibir
                      tu pedido.
                    </p>

                  </div>
                )}

                {errorPaso && (
                  <div className="checkout-error checkout-step-error">
                    {
                      errorPaso
                    }
                  </div>
                )}

                {errorCheckout && (
                  <div className="checkout-error">
                    {
                      errorCheckout
                    }
                  </div>
                )}

                <div className="checkout-step-actions">

                  <button
                    type="button"
                    className="checkout-step-back"
                    onClick={
                      retrocederPaso
                    }
                    disabled={
                      guardandoPedido
                    }
                  >
                    ← ATRÁS
                  </button>

                  <button
                    type="submit"
                    className="checkout-confirm-button checkout-step-confirm"
                    disabled={
                      guardandoPedido
                    }
                  >
                    {guardandoPedido
                      ? 'CREANDO PEDIDO...'
                      : 'CONFIRMAR PEDIDO'}
                  </button>

                </div>

              </div>
            )}

          </form>

          {/* RESUMEN */}

          <aside className="checkout-summary">

            <div className="checkout-summary-inner">

              <p className="eyebrow dark">
                TU PEDIDO
              </p>

              <h2>
                RESUMEN
              </h2>

              <div className="checkout-summary-products">

                {carrito.map(
                  (item) => {
                    const claveItem =
                      item.idCarrito ||
                      item.id;

                    return (
                      <div
                        className="checkout-summary-product"
                        key={
                          claveItem
                        }
                      >
                        <div className="checkout-summary-image">
                          <img
                            src={
                              item.imagen
                            }
                            alt={
                              item.nombre
                            }
                          />

                          <span>
                            {
                              item.cantidad
                            }
                          </span>
                        </div>

                        <div>
                          <h3>
                            {
                              item.nombre
                            }
                          </h3>

                          {item.varianteTexto && (
                            <p className="checkout-summary-variant">
                              {
                                item.varianteTexto
                              }
                            </p>
                          )}

                          <p>
                            {
                              item.cantidad
                            }
                            {' × S/ '}
                            {Number(
                              item.precio
                            ).toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <strong>
                          S/{' '}
                          {(
                            Number(
                              item.precio
                            ) *
                            item.cantidad
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </div>
                    );
                  }
                )}

              </div>

              <div className="checkout-totals">

                <div>
                  <span>
                    SUBTOTAL
                  </span>

                  <strong>
                    S/{' '}
                    {subtotal.toFixed(
                      2
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    DELIVERY
                  </span>

                  <strong>
                    S/{' '}
                    {costoDelivery.toFixed(
                      2
                    )}
                  </strong>
                </div>

                <div className="checkout-total-final">
                  <span>
                    TOTAL
                  </span>

                  <strong>
                    S/{' '}
                    {total.toFixed(
                      2
                    )}
                  </strong>
                </div>

              </div>

              <div className="checkout-payment-status">
                <span>
                  ESTADO DEL PAGO
                </span>

                <strong>
                  NO PAGADO
                </strong>
              </div>

              {/* SOLO MÓVIL */}

              <button
                type="button"
                className="checkout-mobile-scroll-cue"
                onClick={
                  bajarADatos
                }
                aria-label="Continuar hacia los datos del pedido"
              >
                <span>
                  CONTINÚA CON TUS DATOS
                </span>

                <strong>
                  ↓
                </strong>
              </button>

            </div>

          </aside>

        </div>

      </section>
    </>
  );
}

export default Checkout;