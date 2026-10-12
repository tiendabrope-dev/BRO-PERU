import { useEffect, useState } from 'react';
import {
  listarProductosMilEstilos,
  subirImagenProductoMilEstilos,
  crearProductoMilEstilos,
  registrarMovimientoStockMilEstilos,
} from '../lib/milEstilosProductos';
import { exportarStockAExcel } from '../lib/milEstilosExportar';

const UMBRAL_STOCK_BAJO = 3;

function FilaProducto({ producto, onMovimiento }) {
  const [cantidad, setCantidad] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [procesando, setProcesando] = useState(false);

  async function ejecutar(tipo) {
    const cantidadNumerica = Number(cantidad);

    if (!cantidadNumerica || cantidadNumerica <= 0) {
      setMensaje('Ingresa una cantidad válida.');
      return;
    }

    setProcesando(true);
    setMensaje('');

    try {
      await registrarMovimientoStockMilEstilos({
        productoId: producto.id,
        tipo,
        cantidad: cantidadNumerica,
      });
      setCantidad('');
      onMovimiento();
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setProcesando(false);
    }
  }

  const stockBajo = Number(producto.stock_actual) <= UMBRAL_STOCK_BAJO;

  return (
    <div className={`me-fila-producto ${stockBajo ? 'me-fila-stock-bajo' : ''}`}>
      <div className="me-foto-producto">
        {producto.imagen_url ? (
          <img src={producto.imagen_url} alt={producto.nombre} />
        ) : (
          <div className="me-foto-vacia">Sin foto</div>
        )}
      </div>

      <div className="me-info-producto">
        <p className="me-nombre-producto">{producto.nombre}</p>
        <p className="me-precio-producto">S/ {Number(producto.precio).toFixed(2)}</p>
        <p className={stockBajo ? 'me-texto-alerta' : 'me-stock-actual'}>
          Stock actual: {producto.stock_actual}
          {stockBajo ? ' · bajo' : ''}
        </p>
      </div>

      <div className="me-acciones-stock">
        <input
          className="me-input me-input-cantidad"
          type="number"
          min="1"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(evento) => setCantidad(evento.target.value)}
          disabled={procesando}
        />
        <button
          className="me-boton me-boton-secundario"
          type="button"
          onClick={() => ejecutar('entrada')}
          disabled={procesando}
        >
          + Aumentar
        </button>
      </div>

      {mensaje ? <p className="me-error">{mensaje}</p> : null}
    </div>
  );
}

function FormularioNuevoProducto({ onCreado }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stockInicial, setStockInicial] = useState('');
  const [color, setColor] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [abierto, setAbierto] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('Ponle un nombre al producto.');
      return;
    }

    setGuardando(true);

    try {
      let imagenUrl = null;

      if (archivo) {
        imagenUrl = await subirImagenProductoMilEstilos(archivo);
      }

      await crearProductoMilEstilos({
        nombre,
        precio,
        imagenUrl,
        stockInicial,
        color,
        precioCosto,
      });

      setNombre('');
      setPrecio('');
      setStockInicial('');
      setColor('');
      setPrecioCosto('');
      setArchivo(null);
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
        + Nuevo producto
      </button>
    );
  }

  return (
    <form className="me-tarjeta me-form-nuevo-producto" onSubmit={manejarEnvio}>
      <h3 className="me-subtitulo">Nuevo producto</h3>

      <label className="me-etiqueta">
        Nombre / modelo
        <input
          className="me-input"
          type="text"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
          required
        />
      </label>

      <label className="me-etiqueta">
        Precio (S/)
        <input
          className="me-input"
          type="number"
          step="0.01"
          min="0"
          value={precio}
          onChange={(evento) => setPrecio(evento.target.value)}
          required
        />
      </label>

      <label className="me-etiqueta">
        Stock principal (cantidad inicial)
        <input
          className="me-input"
          type="number"
          min="0"
          value={stockInicial}
          onChange={(evento) => setStockInicial(evento.target.value)}
          required
        />
      </label>

      <label className="me-etiqueta">
        Foto
        <input
          className="me-input"
          type="file"
          accept="image/*"
          onChange={(evento) => setArchivo(evento.target.files?.[0] || null)}
        />
      </label>

      <div className="me-datos-internos">
        <p className="me-etiqueta-interno">Datos internos (no se ven al crear un pedido)</p>

        <label className="me-etiqueta">
          Color
          <input
            className="me-input"
            type="text"
            value={color}
            onChange={(evento) => setColor(evento.target.value)}
            placeholder="Ej: negro"
          />
        </label>

        <label className="me-etiqueta">
          Precio costo (S/)
          <input
            className="me-input"
            type="number"
            step="0.01"
            min="0"
            value={precioCosto}
            onChange={(evento) => setPrecioCosto(evento.target.value)}
            placeholder="Lo que te cuesta a ti"
          />
        </label>
      </div>

      {error ? <p className="me-error">{error}</p> : null}

      <div className="me-acciones-formulario">
        <button className="me-boton me-boton-primario" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear producto'}
        </button>
        <button
          className="me-boton"
          type="button"
          onClick={() => setAbierto(false)}
          disabled={guardando}
        >
          Cancelar
        </button>
      </div>

      <p className="me-nota">
        Una vez creado, este stock principal no se puede editar aquí. Solo se puede
        Aumentar. Para corregirlo directamente, usa Configuración.
      </p>
    </form>
  );
}

function MilEstilosStock() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [exportando, setExportando] = useState(false);

  async function exportar() {
    setExportando(true);

    try {
      await exportarStockAExcel(productos);
    } catch {
      setError('No se pudo generar el Excel.');
    } finally {
      setExportando(false);
    }
  }

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

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <div className="me-vista">
      <div className="me-encabezado-vista">
        <h2 className="me-titulo-vista">Stock</h2>
      </div>

      <div className="me-barra-acciones">
        <FormularioNuevoProducto onCreado={cargarProductos} />
        {productos.length > 0 ? (
          <button className="me-boton" type="button" onClick={exportar} disabled={exportando}>
            {exportando ? 'Generando...' : '⬇ Exportar a Excel'}
          </button>
        ) : null}
        {productos.length > 0 ? (
          <input
            className="me-input me-input-busqueda"
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        ) : null}
      </div>

      {error ? <p className="me-error">{error}</p> : null}

      {cargando ? (
        <p className="me-cargando">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="me-vacio">Todavía no hay productos. Crea el primero arriba.</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="me-vacio">Ningún producto coincide con la búsqueda.</p>
      ) : (
        <div className="me-lista-productos">
          {productosFiltrados.map((producto) => (
            <FilaProducto key={producto.id} producto={producto} onMovimiento={cargarProductos} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MilEstilosStock;
