import '../styles/carrito.css';

function Carrito({
  abierto,
  carrito,
  cantidadTotal,
  subtotal,
  onCerrar,
  onAumentar,
  onDisminuir,
  onEliminar,
  onVaciar,
  onCheckout,
}) {
  if (!abierto) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="cart-backdrop"
        onClick={onCerrar}
        aria-label="Cerrar carrito"
      />

      <aside className="cart-drawer">
        <div className="cart-header">
          <div>
            <p>
              Tu compra
            </p>

            <h2>
              CARRITO
              {cantidadTotal > 0 &&
                ` (${cantidadTotal})`}
            </h2>
          </div>

          <button
            type="button"
            className="cart-close"
            onClick={onCerrar}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="cart-empty">
            <h3>
              Tu carrito está vacío.
            </h3>

            <p>
              Encuentra algo que él
              sí va a querer.
            </p>

            <button
              type="button"
              className="button button-dark"
              onClick={onCerrar}
            >
              SEGUIR COMPRANDO
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {carrito.map(
                (item) => {
                  const claveItem =
                    item.idCarrito ||
                    item.id;

                  return (
                    <article
                      className="cart-item"
                      key={claveItem}
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                      />

                      <div className="cart-item-info">
                        <div className="cart-item-top">
                          <div>
                            <p>
                              BRO PERÚ
                            </p>

                            <h3>
                              {item.nombre}
                            </h3>

                            {item.varianteTexto && (
                              <span className="cart-item-variant">
                                {item.varianteTexto}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() =>
                              onEliminar(
                                claveItem
                              )
                            }
                            aria-label={`Eliminar ${item.nombre}`}
                          >
                            ×
                          </button>
                        </div>

                        <div className="cart-item-bottom">
                          <div className="quantity-control">
                            <button
                              type="button"
                              className="quantity-minus"
                              onClick={() =>
                                onDisminuir(
                                  claveItem
                                )
                              }
                              aria-label={`Disminuir cantidad de ${item.nombre}`}
                            >
                              −
                            </button>

                            <span>
                              {item.cantidad}
                            </span>

                            <button
                              type="button"
                              className="quantity-plus"
                              onClick={() =>
                                onAumentar(
                                  claveItem
                                )
                              }
                              aria-label={`Aumentar cantidad de ${item.nombre}`}
                            >
                              +
                            </button>
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
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            <div className="cart-footer">
              <button
                type="button"
                className="clear-cart"
                onClick={onVaciar}
              >
                Vaciar carrito
              </button>

              <div className="cart-subtotal">
                <span>
                  SUBTOTAL
                </span>

                <strong>
                  S/ {subtotal.toFixed(2)}
                </strong>
              </div>

              <p className="cart-delivery-note">
                El costo de delivery
                se calculará al finalizar
                el pedido.
              </p>

              <button
                type="button"
                className="checkout-button"
                onClick={onCheckout}
              >
                FINALIZAR PEDIDO
              </button>

              <button
                type="button"
                className="continue-shopping"
                onClick={onCerrar}
              >
                SEGUIR COMPRANDO
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default Carrito;