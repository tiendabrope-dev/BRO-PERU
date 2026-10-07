import { useEffect, useState } from 'react';
import {
  listarProductosMilEstilos,
  actualizarProductoConfiguracionMilEstilos,
  listarMovimientosDeProductoMilEstilos,
  subirImagenProductoMilEstilos,
  eliminarProductoMilEstilos,
} from '../lib/milEstilosProductos';

function FilaConfiguracion({ producto, onGuardado, onEliminado }) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio);
  const [stockActual, setStockActual] = useState(producto.stock_actual);
  const [activo, setActivo] = useState(producto.activo);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [verHistorial, setVerHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  async function guardar() {
    setGuardando(true);
    setMensaje('');

    try {
      let imagenUrl;

      if (nuevaFoto) {
        imagenUrl = await subirImagenProductoMilEstilos(nuevaFoto);
      }

      await actualizarProductoConfiguracionMilEstilos(producto.id, {
        nombre,
        precio,
        stockActual,
        activo,
        ...(imagenUrl ? { imagenUrl } : {}),
      });
      setNuevaFoto(null);
      setMensaje('Guardado.');
      onGuardado();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function alternarHistorial() {
    if (!verHistorial) {
      try {
        const movimientos = await listarMovimientosDeProductoMilEstilos(producto.id);
        setHistorial(movimientos);
      } catch (error) {
        setMensaje(error.message);
      }
    }
    setVerHistorial(!verHistorial);
  }

  async function eliminar() {
    setEliminando(true);
    setMensaje('');

    try {
      await eliminarProductoMilEstilos(producto.id);
      onEliminado();
    } catch (error) {
      setMensaje(error.message);
      setEliminando(false);
    }
  }

  const totalVendido = historial
    .filter((movimiento) => movimiento.cantidad < 0)
    .reduce((acumulado, movimiento) => acumulado - movimiento.cantidad, 0);

  return (
    <div className="me-tarjeta me-fila-configuracion">
      <div className="me-foto-producto">
        {producto.imagen_url ? (
          <img src={producto.imagen_url} alt={nombre} />
        ) : (
          <div className="me-foto-vacia">Sin foto</div>
        )}
      </div>

      <div className="me-campos-configuracion">
        <label className="me-etiqueta">
          Nombre
          <input className="me-input" value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
        </label>

        <label className="me-etiqueta">
          Precio (S/)
          <input
            className="me-input"
            type="number"
            step="0.01"
            value={precio}
            onChange={(evento) => setPrecio(evento.target.value)}
          />
        </label>

        <label className="me-etiqueta">
          Stock actual (edición directa)
          <input
            className="me-input"
            type="number"
            value={stockActual}
            onChange={(evento) => setStockActual(evento.target.value)}
          />
        </label>

        <label className="me-etiqueta me-etiqueta-checkbox">
          <input type="checkbox" checked={activo} onChange={(evento) => setActivo(evento.target.checked)} />
          Activo
        </label>

        <label className="me-etiqueta">
          Cambiar foto
          <input
            className="me-input"
            type="file"
            accept="image/*"
            onChange={(evento) => setNuevaFoto(evento.target.files?.[0] || null)}
          />
        </label>

        <div className="me-acciones-formulario">
          <button className="me-boton me-boton-primario" type="button" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button className="me-boton" type="button" onClick={alternarHistorial}>
            {verHistorial ? 'Ocultar historial' : 'Ver historial de ventas'}
          </button>
        </div>

        {mensaje ? <p className="me-nota">{mensaje}</p> : null}

        {verHistorial ? (
          <div className="me-historial">
            <p className="me-nota"><strong>Total vendido:</strong> {totalVendido} unidades</p>
            {historial.length === 0 ? (
              <p className="me-nota">Sin movimientos todavía.</p>
            ) : (
              <ul className="me-lista-historial">
                {historial.map((movimiento) => (
                  <li key={movimiento.id}>
                    {new Date(movimiento.creado_en).toLocaleDateString('es-PE')} —{' '}
                    {movimiento.tipo === 'entrada' ? 'Entrada' : movimiento.tipo === 'venta_manual' ? 'Venta manual' : movimiento.tipo === 'venta_pedido' ? 'Venta por pedido' : 'Ajuste'}
                    : {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <div className="me-zona-peligro">
          {!confirmarBorrado ? (
            <button
              className="me-boton me-boton-peligro"
              type="button"
              onClick={() => setConfirmarBorrado(true)}
            >
              Eliminar producto
            </button>
          ) : (
            <div className="me-confirmar-borrado">
              <p className="me-texto-alerta">
                Esto borra el producto y todo su historial de stock para siempre. ¿Seguro?
              </p>
              <div className="me-acciones-formulario">
                <button
                  className="me-boton me-boton-peligro"
                  type="button"
                  onClick={eliminar}
                  disabled={eliminando}
                >
                  {eliminando ? 'Eliminando...' : 'Sí, eliminar definitivamente'}
                </button>
                <button
                  className="me-boton"
                  type="button"
                  onClick={() => setConfirmarBorrado(false)}
                  disabled={eliminando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MilEstilosConfiguracion() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarProductos() {
    setCargando(true);
    setError('');

    try {
      const lista = await listarProductosMilEstilos();
      setProductos(lista);
    } catch (errorCarga) {
      setError(errorCarga.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="me-vista">
      <div className="me-encabezado-vista">
        <h2 className="me-titulo-vista">Configuración</h2>
      </div>

      <div className="me-tarjeta">
        <h3 className="me-subtitulo">Productos</h3>
        <p className="me-nota">
          Aquí sí se puede editar directamente precio, stock y datos del producto, y también
          eliminar un producto por completo (junto con su historial). En Stock solo se puede
          Aumentar.
        </p>
      </div>

      {error ? <p className="me-error">{error}</p> : null}

      {cargando ? (
        <p className="me-cargando">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="me-vacio">Todavía no hay productos.</p>
      ) : (
        <div className="me-lista-productos">
          {productos.map((producto) => (
            <FilaConfiguracion
              key={producto.id}
              producto={producto}
              onGuardado={cargarProductos}
              onEliminado={cargarProductos}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MilEstilosConfiguracion;
