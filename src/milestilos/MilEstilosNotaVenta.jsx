function MilEstilosNotaVenta({ pedido, onVolver }) {
  const items = pedido.mil_estilos_pedido_items || [];

  function imprimir() {
    window.print();
  }

  return (
    <div className="me-vista">
      <div className="me-nota-venta-acciones no-imprimir">
        <button className="me-boton" type="button" onClick={onVolver}>
          ← Volver
        </button>
        <button className="me-boton me-boton-primario" type="button" onClick={imprimir}>
          Imprimir
        </button>
      </div>

      <div className="me-nota-venta">
        <h2 className="me-nota-venta-titulo">Nota de venta</h2>
        <p className="me-nota-venta-codigo">{pedido.codigo_pedido}</p>
        <p className="me-nota">
          Fecha: {new Date(pedido.creado_en).toLocaleDateString('es-PE')}
        </p>

        {pedido.cliente_nombre ? <p className="me-nota">Cliente: {pedido.cliente_nombre}</p> : null}
        {pedido.cliente_telefono ? <p className="me-nota">Teléfono: {pedido.cliente_telefono}</p> : null}

        <table className="me-tabla-nota-venta">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre_producto}</td>
                <td>{item.cantidad}</td>
                <td>S/ {Number(item.precio_unitario).toFixed(2)}</td>
                <td>S/ {Number(item.total_linea).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="me-nota-venta-total">Total: S/ {Number(pedido.total).toFixed(2)}</p>

        {pedido.metodo_pago ? <p className="me-nota">Método de pago: {pedido.metodo_pago}</p> : null}
        <p className="me-nota">Estado: {pedido.estado_pedido} {pedido.pagado ? '· Pagado' : ''}</p>
      </div>
    </div>
  );
}

export default MilEstilosNotaVenta;
