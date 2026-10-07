import { useEffect, useState } from 'react';
import { listarProductosMilEstilos, listarMovimientosVentaMilEstilos } from '../lib/milEstilosProductos';
import { listarPedidosMilEstilos } from '../lib/milEstilosPedidos';

const NOMBRE_USUARIA = 'Melisa';

function inicioDelMes() {
  const ahora = new Date();
  return new Date(ahora.getFullYear(), ahora.getMonth(), 1);
}

function MilEstilosDashboard() {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [movimientosVenta, setMovimientosVenta] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarTodo() {
    setCargando(true);
    setError('');

    try {
      const [listaProductos, listaPedidos, listaMovimientos] = await Promise.all([
        listarProductosMilEstilos(),
        listarPedidosMilEstilos(),
        listarMovimientosVentaMilEstilos(),
      ]);
      setProductos(listaProductos);
      setPedidos(listaPedidos);
      setMovimientosVenta(listaMovimientos);
    } catch (errorCarga) {
      setError(errorCarga.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  if (cargando) {
    return <p className="me-cargando">Cargando...</p>;
  }

  if (error) {
    return <p className="me-error">{error}</p>;
  }

  const productosActivos = productos.filter((p) => p.activo);
  const stockTotal = productosActivos.reduce((acumulado, p) => acumulado + Number(p.stock_actual), 0);

  const pedidosPendientes = pedidos.filter((p) => p.estado_pedido === 'pendiente');

  const desde = inicioDelMes();
  const ventasDelMes = pedidos
    .filter((p) => p.estado_pedido === 'facturado' && p.facturado_en && new Date(p.facturado_en) >= desde)
    .reduce((acumulado, p) => acumulado + Number(p.total), 0);

  const vendidoPorProducto = {};
  movimientosVenta.forEach((movimiento) => {
    const actual = vendidoPorProducto[movimiento.producto_id] || 0;
    vendidoPorProducto[movimiento.producto_id] = actual - Number(movimiento.cantidad);
  });

  const topVendidos = productos
    .map((producto) => ({
      producto,
      totalVendido: vendidoPorProducto[producto.id] || 0,
    }))
    .filter((fila) => fila.totalVendido > 0)
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .slice(0, 5);

  return (
    <div className="me-vista">
      <div className="me-encabezado-vista">
        <p className="me-saludo">¡Hola, {NOMBRE_USUARIA}! 👋</p>
      </div>

      <div className="me-tarjetas-resumen">
        <div className="me-tarjeta me-tarjeta-resumen">
          <p className="me-numero-resumen">S/ {ventasDelMes.toFixed(2)}</p>
          <p className="me-etiqueta-resumen">Ventas facturadas este mes</p>
        </div>
        <div className="me-tarjeta me-tarjeta-resumen">
          <p className="me-numero-resumen">{pedidosPendientes.length}</p>
          <p className="me-etiqueta-resumen">Pedidos pendientes</p>
        </div>
        <div className="me-tarjeta me-tarjeta-resumen">
          <p className="me-numero-resumen">{productosActivos.length}</p>
          <p className="me-etiqueta-resumen">Productos activos</p>
        </div>
        <div className="me-tarjeta me-tarjeta-resumen">
          <p className="me-numero-resumen">{stockTotal}</p>
          <p className="me-etiqueta-resumen">Unidades en stock</p>
        </div>
      </div>

      <div className="me-tarjeta">
        <h3 className="me-subtitulo">Más vendidos</h3>
        {topVendidos.length === 0 ? (
          <p className="me-nota">Todavía no hay ventas registradas.</p>
        ) : (
          <ul className="me-lista-historial">
            {topVendidos.map((fila) => (
              <li key={fila.producto.id}>
                {fila.producto.nombre} — {fila.totalVendido} vendidos
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MilEstilosDashboard;
