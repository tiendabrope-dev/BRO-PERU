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
  const [precioSeleccionado, setPrecioSeleccionado] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [busquedaProducto, setBusquedaProducto] = useState('');

  const productoElegido = productos.find((p) => p.id === productoSeleccionado);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busquedaProducto.trim().toLowerCase())
  );

  function elegirProducto(producto) {
    setProductoSeleccionado(producto.id);
    setPrecioSeleccionado(String(producto.precio));
    setSelectorAbierto(false);
    setBusquedaProducto('');
  }

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

    const precioUnitario = precioSeleccionado === '' ? Number(producto.precio) : Number(precioSeleccionado);

    if (Number.isNaN(precioUnitario) || precioUnitario < 0) {
      setError('Precio inválido.');
      return;
    }

    setItems([
      ...items,
      {
        productoId: producto.id,
        nombreProducto: producto.nombre,
        color: producto.color || '',
        imagenUrl: producto.imagen_url || '',
        cantidad,
        precioUnitario,
      },
    ]);
    setProductoSeleccionado('');
    setCantidadSeleccionada('1');
    setPrecioSeleccionado('');
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

      <div className="me-fila-dos-columnas">
        <label className="me-etiqueta">
          Cliente
          <input className="me-input" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
        </label>

        <label className="me-etiqueta">
          Teléfono
          <input className="me-input" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} />
        </label>
      </div>

      <label className="me-etiqueta">
        Método de pago
        <input className="me-input" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} placeholder="Yape, efectivo, etc." />
      </label>

      <div className="me-selector-producto-grupo">
        <button
          type="button"
          className="me-selector-producto-boton"
          onClick={() => setSelectorAbierto(!selectorAbierto)}
        >
          {productoElegido ? (
            <>
              <span className="me-selector-foto">
                {productoElegido.imagen_url ? (
                  <img src={productoElegido.imagen_url} alt={productoElegido.nombre} />
                ) : (
                  <span className="me-foto-vacia">Sin foto</span>
                )}
              </span>
              <span className="me-selector-texto">
                {productoElegido.nombre}{productoElegido.color ? ` (${productoElegido.color})` : ''} — S/ {Number(productoElegido.precio).toFixed(2)} (stock: {productoElegido.stock_actual})
              </span>
            </>
          ) : (
            <span className="me-selector-texto">Elige un producto...</span>
          )}
        </button>

        {productoElegido ? (
          <div className="me-vista-previa-producto">
            <div className="me-vista-previa-foto">
              {productoElegido.imagen_url ? (
                <img src={productoElegido.imagen_url} alt={productoElegido.nombre} />
              ) : (
                <span className="me-foto-vacia">Sin foto</span>
              )}
            </div>
            <div className="me-vista-previa-info">
              <p className="me-vista-previa-nombre">
                {productoElegido.nombre}{productoElegido.color ? ` (${productoElegido.color})` : ''}
              </p>
              <p className="me-nota">
                S/ {Number(productoElegido.precio).toFixed(2)} · stock: {productoElegido.stock_actual}
              </p>
            </div>
          </div>
        ) : null}

        {selectorAbierto ? (
          <div className="me-selector-panel">
            <input
              className="me-input"
              type="text"
              placeholder="Buscar por nombre..."
              value={busquedaProducto}
              onChange={(evento) => setBusquedaProducto(evento.target.value)}
              autoFocus
            />
            <div className="me-selector-lista">
              {productosFiltrados.length === 0 ? (
                <p className="me-nota">Ningún producto coincide.</p>
              ) : (
                productosFiltrados.map((producto) => (
                  <button
                    type="button"
                    key={producto.id}
                    className="me-selector-opcion"
                    onClick={() => elegirProducto(producto)}
                  >
                    <span className="me-selector-foto">
                      {producto.imagen_url ? (
                        <img src={producto.imagen_url} alt={producto.nombre} />
                      ) : (
                        <span className="me-foto-vacia">Sin foto</span>
                      )}
                    </span>
                    <span className="me-selector-texto">
                      {producto.nombre}{producto.color ? ` (${producto.color})` : ''} — S/ {Number(producto.precio).toFixed(2)} (stock: {producto.stock_actual})
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="me-agregar-item">
        <input
          className="me-input me-input-cantidad"
          type="number"
          min="1"
          placeholder="Cant."
          value={cantidadSeleccionada}
          onChange={(e) => setCantidadSeleccionada(e.target.value)}
        />
        <input
          className="me-input me-input-precio"
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio (S/)"
          value={precioSeleccionado}
          onChange={(e) => setPrecioSeleccionado(e.target.value)}
        />
        <button className="me-boton me-boton-secundario" type="button" onClick={agregarItem}>
          Agregar
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="me-lista-items-pedido">
          {items.map((item, indice) => (
            <li key={`${item.productoId}-${indice}`}>
              <span className="me-selector-foto me-item-pedido-foto">
                {item.imagenUrl ? (
                  <img src={item.imagenUrl} alt={item.nombreProducto} />
                ) : (
                  <span className="me-foto-vacia">Sin foto</span>
                )}
              </span>
              <span className="me-item-pedido-texto">
                {item.cantidad} × {item.nombreProducto}{item.color ? ` (${item.color})` : ''} — S/ {(item.cantidad * item.precioUnitario).toFixed(2)}
              </span>
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
            {item.cantidad} × {item.nombre_producto}{item.color ? ` (${item.color})` : ''} — S/ {Number(item.total_linea).toFixed(2)}
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
      </div>

      <div className="me-barra-acciones">
        <FormularioNuevoPedido productos={productos} onCreado={cargarTodo} />
        {pedidos.length > 0 ? (
          <button className="me-boton" type="button" onClick={exportar} disabled={exportando}>
            {exportando ? 'Generando...' : '⬇ Exportar resumen a Excel'}
          </button>
        ) : null}
        {pedidos.length > 0 ? (
          <select
            className="me-input me-filtro-pedidos"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="facturado">Facturado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        ) : null}
      </div>

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
