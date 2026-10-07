import { useEffect, useState } from 'react';
import { listarProductosMilEstilos } from '../lib/milEstilosProductos';
import {
  listarPedidosMilEstilos,
  crearPedidoMilEstilos,
  facturarPedidoMilEstilos,
  marcarPedidoPagadoMilEstilos,
  cancelarPedidoMilEstilos,
} from '../lib/milEstilosPedidos';
import { exportarResumenVentasAExcel } from '../lib/milEstilosExportar';
import MilEstilosNotaVenta from './MilEstilosNotaVenta';

function FormularioNuevoPedido({ productos, onCreado }) {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [items, setItems] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState('1');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [abierto, setAbierto] = useState(false);

  function agregarItem() {
    const producto = productos.find((p) => p.id === productoSeleccionado);

    if (!producto) {
      setError('Elige un producto.');
      return;
    }

    const cantidad = Number(cantidadSeleccionada);

    if (!cantidad || cantidad <= 0) {
      setError('Cantidad inválida.');
      return;
    }

    setItems([
      ...items,
      {
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad,
        precioUnitario: producto.precio,
      },
    ]);
    setProductoSeleccionado('');
    setCantidadSeleccionada('1');
    setError('');
  }

  function quitarItem(indice) {
    setItems(items.filter((_, i) => i !== indice));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (items.length === 0) {
      setError('Agrega al menos un producto al pedido.');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      await crearPedidoMilEstilos({ clienteNombre, clienteTelefono, metodoPago, items });
      setClienteNombre('');
      setClienteTelefono('');
      setMetodoPago('');
      setItems([]);
      setAbierto(false);
      onCreado();
    } catch (errorCreacion) {
      setError(errorCreacion.message);
    } finally {
      setGuardando(false);
    }
  }

  if (!abierto) {
    return (
      <button className="me-boton me-boton-primario" type="button" onClick={() => setAbierto(true)}>
        + Nuevo pedido
      </button>
    );
  }

  const total = items.reduce((acumulado, item) => acumulado + item.cantidad * item.precioUnitario, 0);

  return (
    <form className="me-tarjeta me-form-nuevo-pedido" onSubmit={manejarEnvio}>
      <h3 className="me-subtitulo">Nuevo pedido</h3>

      <label className="me-etiqueta">
        Cliente
        <input className="me-input" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
      </label>

      <label className="me-etiqueta">
        Teléfono
        <input className="me-input" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} />
      </label>

      <label className="me-etiqueta">
        Método de pago
        <input className="me-input" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} placeholder="Yape, efectivo, etc." />
      </label>

      <div className="me-agregar-item">
        <select
          className="me-input"
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
        >
          <option value="">Elige un producto...</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre} — S/ {Number(producto.precio).toFixed(2)} (stock: {producto.stock_actual})
            </option>
          ))}
        </select>
        <input
          className="me-input me-input-cantidad"
          type="number"
          min="1"
          value={cantidadSeleccionada}
          onChange={(e) => setCantidadSeleccionada(e.target.value)}
        />
        <button className="me-boton me-boton-secundario" type="button" onClick={agregarItem}>
          Agregar
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="me-lista-items-pedido">
          {items.map((item, indice) => (
            <li key={`${item.productoId}-${indice}`}>
              {item.cantidad} × {item.nombreProducto} — S/ {(item.cantidad * item.precioUnitario).toFixed(2)}
              <button className="me-boton-quitar" type="button" onClick={() => quitarItem(indice)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {items.length > 0 ? <p className="me-nota"><strong>Total: S/ {total.toFixed(2)}</strong></p> : null}

      {error ? <p className="me-error">{error}</p> : null}

      <div className="me-acciones-formulario">
        <button className="me-boton me-boton-primario" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear pedido'}
        </button>
        <button className="me-boton" type="button" onClick={() => setAbierto(false)} disabled={guardando}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function FilaPedido({ pedido, onCambio, onVerNota }) {
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function facturar() {
    setProcesando(true);
    setMensaje('');

    try {
      await facturarPedidoMilEstilos(pedido.id);
      onCambio();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setProcesando(false);
    }
  }

  async function alternarPago() {
    setProcesando(true);
    setMensaje('');

    try {
      await marcarPedidoPagadoMilEstilos(pedido.id, !pedido.pagado);
      onCambio();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setProcesando(false);
    }
  }

  async function cancelar() {
    setProcesando(true);
    setMensaje('');

    try {
      await cancelarPedidoMilEstilos(pedido.id);
      onCambio();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setProcesando(false);
    }
  }

  const items = pedido.mil_estilos_pedido_items || [];

  return (
    <div className="me-tarjeta me-fila-pedido">
      <div className="me-encabezado-pedido">
        <p className="me-codigo-pedido">{pedido.codigo_pedido}</p>
        <span className={`me-etiqueta-estado me-estado-${pedido.estado_pedido}`}>
          {pedido.estado_pedido}
        </span>
        {pedido.pagado ? <span className="me-etiqueta-pagado">Pagado</span> : null}
      </div>

      <p className="me-nota">{pedido.cliente_nombre || 'Sin nombre'} {pedido.cliente_telefono ? `· ${pedido.cliente_telefono}` : ''}</p>

      <ul className="me-lista-items-pedido">
        {items.map((item) => (
          <li key={item.id}>
            {item.cantidad} × {item.nombre_producto} — S/ {Number(item.total_linea).toFixed(2)}
          </li>
        ))}
      </ul>

      <p className="me-nota"><strong>Total: S/ {Number(pedido.total).toFixed(2)}</strong></p>

      {mensaje ? <p className="me-error">{mensaje}</p> : null}

      <div className="me-acciones-formulario">
        {pedido.estado_pedido === 'pendiente' ? (
          <>
            <button className="me-boton me-boton-primario" type="button" onClick={facturar} disabled={procesando}>
              Facturar (descuenta stock)
            </button>
            <button className="me-boton" type="button" onClick={cancelar} disabled={procesando}>
              Cancelar pedido
            </button>
          </>
        ) : null}
        {pedido.estado_pedido === 'facturado' ? (
          <button className="me-boton me-boton-secundario" type="button" onClick={alternarPago} disabled={procesando}>
            {pedido.pagado ? 'Marcar como no pagado' : 'Marcar como pagado'}
          </button>
        ) : null}
        <button className="me-boton" type="button" onClick={() => onVerNota(pedido)}>
          Ver nota de venta
        </button>
      </div>
    </div>
  );
}

function MilEstilosPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pedidoParaNota, setPedidoParaNota] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [exportando, setExportando] = useState(false);

  async function cargarTodo() {
    setCargando(true);
    setError('');

    try {
      const [listaPedidos, listaProductos] = await Promise.all([
        listarPedidosMilEstilos(),
        listarProductosMilEstilos(),
      ]);
      setPedidos(listaPedidos);
      setProductos(listaProductos.filter((p) => p.activo));
    } catch (errorCarga) {
      setError(errorCarga.message);
    } finally {
      setCargando(false);
    }
  }

  async function exportar() {
    setExportando(true);

    try {
      await exportarResumenVentasAExcel(pedidos);
    } catch {
      setError('No se pudo generar el Excel.');
    } finally {
      setExportando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  if (pedidoParaNota) {
    return <MilEstilosNotaVenta pedido={pedidoParaNota} onVolver={() => setPedidoParaNota(null)} />;
  }

  const pedidosFiltrados =
    filtroEstado === 'todos' ? pedidos : pedidos.filter((pedido) => pedido.estado_pedido === filtroEstado);

  return (
    <div className="me-vista">
      <div className="me-encabezado-vista">
        <h2 className="me-titulo-vista">Pedidos</h2>
        <div className="me-acciones-formulario">
          {pedidos.length > 0 ? (
            <button className="me-boton" type="button" onClick={exportar} disabled={exportando}>
              {exportando ? 'Generando...' : '⬇ Exportar resumen a Excel'}
            </button>
          ) : null}
          <FormularioNuevoPedido productos={productos} onCreado={cargarTodo} />
        </div>
      </div>

      {pedidos.length > 0 ? (
        <div className="me-filtro-pedidos">
          <select
            className="me-input"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="facturado">Facturado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      ) : null}

      {error ? <p className="me-error">{error}</p> : null}

      {cargando ? (
        <p className="me-cargando">Cargando...</p>
      ) : pedidos.length === 0 ? (
        <p className="me-vacio">Todavía no hay pedidos.</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p className="me-vacio">Ningún pedido con ese estado.</p>
      ) : (
        <div className="me-lista-pedidos">
          {pedidosFiltrados.map((pedido) => (
            <FilaPedido key={pedido.id} pedido={pedido} onCambio={cargarTodo} onVerNota={setPedidoParaNota} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MilEstilosPedidos;
