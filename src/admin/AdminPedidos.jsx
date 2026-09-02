import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  obtenerPedidosAdmin,
} from '../lib/adminPedidos';

import './admin-pedidos.css';

function AdminPedidos({
  onAbrirPedido,
}) {
  const [pedidos, setPedidos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState('');

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerPedidosAdmin();

      setPedidos(datos);
    } catch (errorCarga) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar los pedidos.'
      );
    } finally {
      setCargando(false);
    }
  }

  const pedidosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      if (!texto) {
        return pedidos;
      }

      return pedidos.filter(
        (pedido) => {
          const contenido = [
            pedido.codigo_pedido,
            pedido.nombre_completo,
            pedido.dni,
            pedido.telefono,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return contenido.includes(
            texto
          );
        }
      );
    }, [
      pedidos,
      busqueda,
    ]);

  function formatearFecha(fecha) {
    if (!fecha) {
      return '-';
    }

    return new Intl.DateTimeFormat(
      'es-PE',
      {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    ).format(
      new Date(fecha)
    );
  }

  function textoEstado(estado) {
    const textos = {
      nuevo: 'Nuevo',
      confirmado: 'Confirmado',
      preparando: 'Preparando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };

    return textos[estado] || estado;
  }

  function textoServicio(tipo) {
    const textos = {
      domicilio: 'Domicilio',
      contraentrega: 'Contraentrega',
      digital: 'Digital',
    };

    return textos[tipo] || tipo;
  }

  if (cargando) {
    return (
      <div className="admin-pedidos-status">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <section className="admin-pedidos">
      <div className="admin-pedidos-heading">
        <div>
          <span>
            VENTAS
          </span>

          <h2>
            Pedidos
          </h2>

          <p>
            Gestiona los pedidos realizados
            en BRO.
          </p>
        </div>

        <button
          type="button"
          onClick={cargarPedidos}
        >
          ACTUALIZAR
        </button>
      </div>

      <div className="admin-pedidos-toolbar">
        <input
          type="search"
          placeholder="Buscar pedido, cliente, DNI o teléfono..."
          value={busqueda}
          onChange={(event) =>
            setBusqueda(
              event.target.value
            )
          }
        />

        <strong>
          {pedidosFiltrados.length}
          {' '}
          PEDIDOS
        </strong>
      </div>

      {error && (
        <div className="admin-pedidos-error">
          {error}
        </div>
      )}

      {pedidosFiltrados.length === 0 ? (
        <div className="admin-pedidos-vacio">
          No encontramos pedidos.
        </div>
      ) : (
        <div className="admin-pedidos-lista">
          {pedidosFiltrados.map(
            (pedido) => (
              <button
                type="button"
                className="admin-pedido-card"
                key={pedido.id}
                onClick={() =>
                  onAbrirPedido?.(
                    pedido.id
                  )
                }
              >
                <div className="admin-pedido-principal">
                  <strong>
                    {pedido.codigo_pedido}
                  </strong>

                  <span>
                    {pedido.nombre_completo}
                  </span>

                  <small>
                    {formatearFecha(
                      pedido.creado_en
                    )}
                  </small>
                </div>

                <div className="admin-pedido-servicio">
                  <small>
                    ENTREGA
                  </small>

                  <strong>
                    {textoServicio(
                      pedido.tipo_servicio
                    )}
                  </strong>
                </div>

                <div className="admin-pedido-total">
                  <small>
                    TOTAL
                  </small>

                  <strong>
                    S/{' '}
                    {Number(
                      pedido.total
                    ).toFixed(2)}
                  </strong>
                </div>

                <div className="admin-pedido-estados">
                  <span
                    className={`admin-estado pedido-${pedido.estado_pedido}`}
                  >
                    {textoEstado(
                      pedido.estado_pedido
                    )}
                  </span>

                  <span
                    className={`admin-estado pago-${pedido.estado_pago}`}
                  >
                    {pedido.estado_pago ===
                    'pagado'
                      ? 'Pagado'
                      : 'No pagado'}
                  </span>
                </div>

                <span className="admin-pedido-flecha">
                  →
                </span>
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default AdminPedidos;