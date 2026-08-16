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
  if (!abierto) {
    return null;
  }

  return (
    <>
      <div
        className="checkout-backdrop"
        onClick={onCerrar}
      />

      <section className="checkout-page">
        <div className="checkout-topbar">
          <button
            type="button"
            className="checkout-back-button"
            onClick={onVolverCarrito}
            disabled={guardandoPedido}
          >
            ← VOLVER AL CARRITO
          </button>

          <div className="brand checkout-logo">
            BR<span>O</span>
          </div>

          <button
            type="button"
            className="checkout-close"
            onClick={onCerrar}
            disabled={guardandoPedido}
          >
            ×
          </button>
        </div>

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={onConfirmarPedido}
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
                Completa tus datos para preparar tu
                pedido BRO.
              </p>
            </div>

            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>01</span>

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
                    value={formulario.nombre}
                    onChange={onActualizarCampo}
                    disabled={guardandoPedido}
                  />
                </label>

                <label className="checkout-field">
                  <span>
                    DNI
                  </span>

                  <input
                    type="text"
                    name="dni"
                    value={formulario.dni}
                    onChange={onActualizarCampo}
                    maxLength={8}
                    inputMode="numeric"
                    disabled={guardandoPedido}
                  />
                </label>

                <label className="checkout-field">
                  <span>
                    TELÉFONO
                  </span>

                  <input
                    type="text"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={onActualizarCampo}
                    maxLength={9}
                    inputMode="numeric"
                    disabled={guardandoPedido}
                  />
                </label>
              </div>
            </div>

            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>02</span>

                <h2>
                  TIPO DE SERVICIO
                </h2>
              </div>

              <div className="checkout-options">
                <label
                  className={
                    formulario.servicio === 'contraentrega'
                      ? 'checkout-option active'
                      : 'checkout-option'
                  }
                >
                  <input
                    type="radio"
                    name="servicio"
                    value="contraentrega"
                    checked={
                      formulario.servicio === 'contraentrega'
                    }
                    onChange={onActualizarCampo}
                    disabled={guardandoPedido}
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
                    formulario.servicio === 'domicilio'
                      ? 'checkout-option active'
                      : 'checkout-option'
                  }
                >
                  <input
                    type="radio"
                    name="servicio"
                    value="domicilio"
                    checked={
                      formulario.servicio === 'domicilio'
                    }
                    onChange={onActualizarCampo}
                    disabled={guardandoPedido}
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

              {formulario.servicio === 'domicilio' && (
                <div className="checkout-fields address-fields">
                  <label className="checkout-field full">
                    <span>
                      DIRECCIÓN
                    </span>

                    <input
                      type="text"
                      name="direccion"
                      value={formulario.direccion}
                      onChange={onActualizarCampo}
                      disabled={guardandoPedido}
                    />
                  </label>

                  <label className="checkout-field">
                    <span>
                      DISTRITO
                    </span>

                    <input
                      type="text"
                      name="distrito"
                      value={formulario.distrito}
                      onChange={onActualizarCampo}
                      disabled={guardandoPedido}
                    />
                  </label>

                  <label className="checkout-field">
                    <span>
                      REFERENCIA
                    </span>

                    <input
                      type="text"
                      name="referencia"
                      value={formulario.referencia}
                      onChange={onActualizarCampo}
                      disabled={guardandoPedido}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>03</span>

                <h2>
                  MÉTODO DE PAGO
                </h2>
              </div>

              <div className="payment-options">
                {[
                  ['yape', 'YAPE'],
                  ['plin', 'PLIN'],
                  ['tarjetas', 'TARJETAS'],
                  ['efectivo', 'CONTRAENTREGA / EFECTIVO'],
                ].map(([valor, etiqueta]) => (
                  <label
                    key={valor}
                    className={
                      formulario.metodoPago === valor
                        ? 'payment-option active'
                        : 'payment-option'
                    }
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={valor}
                      checked={
                        formulario.metodoPago === valor
                      }
                      onChange={onActualizarCampo}
                      disabled={guardandoPedido}
                    />

                    <strong>
                      {etiqueta}
                    </strong>
                  </label>
                ))}
              </div>

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
            </div>

            {errorCheckout && (
              <div className="checkout-error">
                {errorCheckout}
              </div>
            )}

            <button
              type="submit"
              className="checkout-confirm-button"
              disabled={guardandoPedido}
            >
              {guardandoPedido
                ? 'CREANDO PEDIDO...'
                : 'CONFIRMAR PEDIDO'}
            </button>
          </form>

          <aside className="checkout-summary">
            <div className="checkout-summary-inner">
              <p className="eyebrow dark">
                TU PEDIDO
              </p>

              <h2>
                RESUMEN
              </h2>

              <div className="checkout-summary-products">
                {carrito.map((item) => {
                  const claveItem =
                    item.idCarrito ||
                    item.id;

                  return (
                    <div
                      className="checkout-summary-product"
                      key={claveItem}
                    >
                      <div className="checkout-summary-image">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                        />

                        <span>
                          {item.cantidad}
                        </span>
                      </div>

                      <div>
                        <h3>
                          {item.nombre}
                        </h3>

                        {item.varianteTexto && (
                          <p className="checkout-summary-variant">
                            {item.varianteTexto}
                          </p>
                        )}

                        <p>
                          {item.cantidad}
                          {' × S/ '}
                          {Number(
                            item.precio
                          ).toFixed(2)}
                        </p>
                      </div>

                      <strong>
                        S/{' '}
                        {(
                          Number(
                            item.precio
                          ) *
                          item.cantidad
                        ).toFixed(2)}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-totals">
                <div>
                  <span>
                    SUBTOTAL
                  </span>

                  <strong>
                    S/ {subtotal.toFixed(2)}
                  </strong>
                </div>

                <div>
                  <span>
                    DELIVERY
                  </span>

                  <strong>
                    S/ {costoDelivery.toFixed(2)}
                  </strong>
                </div>

                <div className="checkout-total-final">
                  <span>
                    TOTAL
                  </span>

                  <strong>
                    S/ {total.toFixed(2)}
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
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Checkout;