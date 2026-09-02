import {
  useEffect,
  useState,
} from 'react';

import {
  actualizarEstadoPagoAdmin,
  actualizarEstadoPedidoAdmin,
  obtenerPedidoAdmin,
} from '../lib/adminPedidos';

function AdminPedidoDetalle({
  pedidoId,
  onVolver,
}) {
  const [pedido, setPedido] =
    useState(null);

  const [items, setItems] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function cargar() {
      try {
        setError('');

        const datos =
          await obtenerPedidoAdmin(
            pedidoId
          );

        setPedido(datos.pedido);
        setItems(datos.items);
      } catch (errorCarga) {
        setError(
          errorCarga.message
        );
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [pedidoId]);

  async function cambiarPedido(
    estado
  ) {
    setGuardando('pedido');

    try {
      const actualizado =
        await actualizarEstadoPedidoAdmin(
          pedido.id,
          estado
        );

      setPedido(actualizado);
    } catch (errorCambio) {
      setError(
        errorCambio.message
      );
    } finally {
      setGuardando('');
    }
  }

  async function cambiarPago(
    estado
  ) {
    setGuardando('pago');

    try {
      const actualizado =
        await actualizarEstadoPagoAdmin(
          pedido.id,
          estado
        );

      setPedido(actualizado);
    } catch (errorCambio) {
      setError(
        errorCambio.message
      );
    } finally {
      setGuardando('');
    }
  }

  function fecha(fechaPedido) {
    return new Intl.DateTimeFormat(
      'es-PE',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    ).format(
      new Date(fechaPedido)
    );
  }

  if (cargando) {
    return (
      <div className="admin-pedidos-status">
        Cargando pedido...
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="admin-pedidos-error">
        No se encontró el pedido.
      </div>
    );
  }

  return (
    <section className="admin-pedido-detalle">
      <button
        type="button"
        className="admin-pedido-volver"
        onClick={onVolver}
      >
        ← VOLVER A PEDIDOS
      </button>

      <div className="admin-pedido-detalle-header">
        <div>
          <span>
            PEDIDO
          </span>

          <h2>
            {pedido.codigo_pedido}
          </h2>

          <p>
            {fecha(
              pedido.creado_en
            )}
          </p>
        </div>

        <strong className="admin-pedido-detalle-total">
          S/ {Number(
            pedido.total
          ).toFixed(2)}
        </strong>
      </div>

      {error && (
        <div className="admin-pedidos-error">
          {error}
        </div>
      )}

      <div className="admin-pedido-detalle-grid">
        <article className="admin-pedido-panel">
          <h3>
            Cliente
          </h3>

          <p>
            <strong>
              {pedido.nombre_completo}
            </strong>
          </p>

          <p>
            DNI: {pedido.dni}
          </p>

          <p>
            Tel: {pedido.telefono}
          </p>
        </article>

        <article className="admin-pedido-panel">
          <h3>
            Entrega
          </h3>

          <p>
            {pedido.tipo_servicio}
          </p>

          {pedido.direccion && (
            <p>
              {pedido.direccion}
            </p>
          )}

          {pedido.distrito && (
            <p>
              {pedido.distrito}
            </p>
          )}

          {pedido.referencia && (
            <p>
              Ref: {pedido.referencia}
            </p>
          )}
        </article>

        <article className="admin-pedido-panel">
          <h3>
            Estado pedido
          </h3>

          <select
            value={
              pedido.estado_pedido
            }
            disabled={
              guardando ===
              'pedido'
            }
            onChange={(event) =>
              cambiarPedido(
                event.target.value
              )
            }
          >
            <option value="nuevo">
              Nuevo
            </option>

            <option value="confirmado">
              Confirmado
            </option>

            <option value="preparando">
              Preparando
            </option>

            <option value="enviado">
              Enviado
            </option>

            <option value="entregado">
              Entregado
            </option>

            <option value="cancelado">
              Cancelado
            </option>
          </select>
        </article>

        <article className="admin-pedido-panel">
          <h3>
            Estado pago
          </h3>

          <select
            value={
              pedido.estado_pago
            }
            disabled={
              guardando ===
              'pago'
            }
            onChange={(event) =>
              cambiarPago(
                event.target.value
              )
            }
          >
            <option value="no_pagado">
              No pagado
            </option>

            <option value="pagado">
              Pagado
            </option>
          </select>

          <p>
            Método: {pedido.metodo_pago}
          </p>
        </article>
      </div>

      <article className="admin-pedido-productos">
        <h3>
          Productos
        </h3>

        {items.map((item) => (
          <div
            className="admin-pedido-item"
            key={item.id}
          >
            <div>
              <strong>
                {item.nombre_producto}
              </strong>

              <span>
                {item.variante_texto ||
                  item.tipo_producto}
              </span>

              <small>
                Cantidad: {item.cantidad}
              </small>
            </div>

            <strong>
              S/ {Number(
                item.total_linea
              ).toFixed(2)}
            </strong>
          </div>
        ))}
      </article>

      <article className="admin-pedido-totales">
        <div>
          <span>
            Subtotal
          </span>

          <strong>
            S/ {Number(
              pedido.subtotal
            ).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>
            Delivery
          </span>

          <strong>
            S/ {Number(
              pedido.delivery
            ).toFixed(2)}
          </strong>
        </div>

        <div className="total">
          <span>
            Total
          </span>

          <strong>
            S/ {Number(
              pedido.total
            ).toFixed(2)}
          </strong>
        </div>
      </article>
    </section>
  );
}

export default AdminPedidoDetalle;