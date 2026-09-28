import {
  useEffect,
  useState,
} from 'react';

import {
  AJUSTES_POR_DEFECTO,
  obtenerAjustesPublicos,
} from '../lib/ajustes';

import './admin-nota-venta.css';

const ETIQUETAS_METODO_PAGO = {
  yape: 'Yape',
  plin: 'Plin',
  transferencia: 'Transferencia bancaria',
  efectivo: 'Efectivo / contraentrega',
};

function formatearMoneda(valor) {
  return `S/ ${Number(
    valor || 0
  ).toFixed(2)}`;
}

function AdminNotaVenta({
  pedido,
  items,
  onCerrar,
}) {
  const [ajustes, setAjustes] =
    useState(
      AJUSTES_POR_DEFECTO
    );

  useEffect(() => {
    let vigente = true;

    obtenerAjustesPublicos().then(
      (datos) => {
        if (vigente) {
          setAjustes(datos);
        }
      }
    );

    return () => {
      vigente = false;
    };
  }, []);

  function fecha(fechaPedido) {
    return new Intl.DateTimeFormat(
      'es-PE',
      {
        dateStyle: 'long',
      }
    ).format(
      new Date(fechaPedido)
    );
  }

  function imprimir() {
    const tituloOriginal = document.title;

    document.title = `BRO TIENDA - ${pedido.codigo_pedido}`;

    function restaurarTitulo() {
      document.title = tituloOriginal;

      window.removeEventListener(
        'afterprint',
        restaurarTitulo
      );
    }

    window.addEventListener(
      'afterprint',
      restaurarTitulo
    );

    window.print();
  }

  return (
    <div className="admin-nota-venta-overlay">
      <div className="admin-nota-venta-acciones">
        <button
          type="button"
          onClick={onCerrar}
          className="admin-nota-venta-cerrar"
        >
          ← Volver al pedido
        </button>

        <button
          type="button"
          onClick={imprimir}
          className="admin-nota-venta-imprimir"
        >
          Imprimir / Guardar como PDF
        </button>
      </div>

      <div className="admin-nota-venta-imprimible">
        <div className="admin-nota-venta-encabezado">
          <div className="admin-nota-venta-marca">
            <div className="admin-nota-venta-logo">
              BR<span>O</span>
            </div>

            <p>brotienda.com</p>

            <p>
              WhatsApp: {ajustes.whatsappPedidos}
            </p>
          </div>

          <div className="admin-nota-venta-titulo">
            <span>Nota de venta</span>

            <p>N.° {pedido.codigo_pedido}</p>

            <p>{fecha(pedido.creado_en)}</p>
          </div>
        </div>

        <div className="admin-nota-venta-aviso">
          Documento referencial — no válido como comprobante de pago (sin
          efecto tributario).
        </div>

        <div className="admin-nota-venta-datos">
          <div>
            <span>Cliente</span>

            <strong>{pedido.nombre_completo}</strong>

            <p>DNI: {pedido.dni}</p>

            <p>Tel: {pedido.telefono}</p>
          </div>

          <div>
            <span>Entrega</span>

            <p>
              {pedido.direccion ||
                pedido.tipo_servicio}
            </p>

            {pedido.distrito && (
              <p>{pedido.distrito}</p>
            )}

            <p>
              Pago:{' '}
              {ETIQUETAS_METODO_PAGO[
                pedido.metodo_pago
              ] || pedido.metodo_pago}
            </p>
          </div>
        </div>

        <table className="admin-nota-venta-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>P. unit.</th>
              <th>Importe</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>
                    {item.nombre_producto}
                  </strong>

                  {(item.variante_texto ||
                    item.tipo_producto) && (
                    <div className="admin-nota-venta-variante">
                      {item.variante_texto ||
                        item.tipo_producto}
                    </div>
                  )}
                </td>

                <td>{item.cantidad}</td>

                <td>
                  {formatearMoneda(
                    item.precio_unitario
                  )}
                </td>

                <td>
                  <strong>
                    {formatearMoneda(
                      item.total_linea
                    )}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-nota-venta-totales">
          <div>
            <span>Subtotal</span>
            <span>{formatearMoneda(pedido.subtotal)}</span>
          </div>

          <div>
            <span>Delivery</span>
            <span>{formatearMoneda(pedido.delivery)}</span>
          </div>

          {pedido.cupon_codigo && (
            <div className="admin-nota-venta-descuento">
              <span>Descuento ({pedido.cupon_codigo})</span>
              <span>
                − {formatearMoneda(pedido.descuento)}
              </span>
            </div>
          )}

          <div className="admin-nota-venta-total">
            <span>TOTAL</span>
            <span>{formatearMoneda(pedido.total)}</span>
          </div>
        </div>

        <div className="admin-nota-venta-pie">
          <strong>Gracias por tu compra en BRO ❤</strong>
          <p>Porque él se lo merece.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminNotaVenta;
