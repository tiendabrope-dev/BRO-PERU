import {
  useEffect,
  useState,
} from 'react';

import {
  cambiarEstadoProductoAdmin,
  obtenerProductosAdmin,
} from '../lib/adminProductos';

import './admin-productos.css';

function AdminProductos() {
  const [productos, setProductos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerProductosAdmin();

      setProductos(datos);
    } catch (errorCarga) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar los productos.'
      );
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(
    producto
  ) {
    if (guardando) {
      return;
    }

    setGuardando(
      producto.producto_id
    );

    setError('');

    try {
      const actualizado =
        await cambiarEstadoProductoAdmin(
          producto.producto_id,
          !producto.activo
        );

      setProductos(
        (actuales) =>
          actuales.map(
            (item) =>
              item.producto_id ===
              actualizado.producto_id
                ? actualizado
                : item
          )
      );
    } catch (errorCambio) {
      setError(
        errorCambio.message ||
          'No se pudo actualizar el producto.'
      );
    } finally {
      setGuardando('');
    }
  }

  if (cargando) {
    return (
      <div className="admin-productos-status">
        Cargando productos...
      </div>
    );
  }

  return (
    <section className="admin-productos">
      <div className="admin-productos-heading">
        <div>
          <span>
            CATÁLOGO
          </span>

          <h2>
            Productos
          </h2>

          <p>
            Activa o desactiva productos
            de la tienda.
          </p>
        </div>

        <strong>
          {productos.filter(
            (producto) =>
              producto.activo
          ).length}
          {' '}
          ACTIVOS
        </strong>
      </div>

      {error && (
        <div className="admin-productos-error">
          {error}
        </div>
      )}

      <div className="admin-productos-lista">
        {productos.map(
          (producto) => (
            <article
              key={
                producto.producto_id
              }
              className="admin-producto-card"
            >
              <div className="admin-producto-info">
                <small>
                  {producto.categoria}
                </small>

                <strong>
                  {producto.nombre}
                </strong>

                <span>
                  /producto/
                  {producto.slug}
                </span>
              </div>

              <div className="admin-producto-estado">
                <span
                  className={
                    producto.activo
                      ? 'activo'
                      : 'inactivo'
                  }
                >
                  {producto.activo
                    ? 'ACTIVO'
                    : 'INACTIVO'}
                </span>

                <button
                  type="button"
                  className={`admin-producto-switch ${
                    producto.activo
                      ? 'on'
                      : ''
                  }`}
                  disabled={
                    guardando ===
                    producto.producto_id
                  }
                  onClick={() =>
                    cambiarEstado(
                      producto
                    )
                  }
                  aria-label={
                    producto.activo
                      ? `Desactivar ${producto.nombre}`
                      : `Activar ${producto.nombre}`
                  }
                >
                  <span />
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

export default AdminProductos;