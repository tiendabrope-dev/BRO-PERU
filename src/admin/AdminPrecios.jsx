import {
  useEffect,
  useState,
} from 'react';

import {
  actualizarPrecioAdmin,
  obtenerPreciosAdmin,
} from '../lib/adminPrecios';

import './admin-precios.css';

function AdminPrecios() {
  const [precios, setPrecios] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const [error, setError] =
    useState('');

  useEffect(() => {
    cargarPrecios();
  }, []);

  async function cargarPrecios() {
    try {
      setError('');

      const datos =
        await obtenerPreciosAdmin();

      setPrecios(datos);
    } catch (errorCarga) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar los precios.'
      );
    } finally {
      setCargando(false);
    }
  }

  function cambiarPrecio(
    clave,
    valor
  ) {
    setPrecios(
      (actuales) =>
        actuales.map(
          (item) =>
            item.clave === clave
              ? {
                  ...item,
                  precio: valor,
                }
              : item
        )
    );
  }

  async function guardarPrecio(
    item
  ) {
    if (guardando) {
      return;
    }

    setMensaje('');
    setError('');
    setGuardando(item.clave);

    try {
      const actualizado =
        await actualizarPrecioAdmin(
          item.clave,
          item.precio
        );

      setPrecios(
        (actuales) =>
          actuales.map(
            (precio) =>
              precio.clave ===
              actualizado.clave
                ? actualizado
                : precio
          )
      );

      setMensaje(
        `${actualizado.nombre} actualizado correctamente.`
      );
    } catch (errorGuardado) {
      setError(
        errorGuardado.message ||
          'No se pudo guardar el precio.'
      );
    } finally {
      setGuardando('');
    }
  }

  if (cargando) {
    return (
      <div className="admin-precios-status">
        Cargando precios...
      </div>
    );
  }

  return (
    <section className="admin-precios">
      <div className="admin-precios-heading">
        <span>
          CONFIGURACIÓN
        </span>

        <h2>
          Precios
        </h2>

        <p>
          Modifica los precios oficiales
          utilizados por BRO.
        </p>
      </div>

      {mensaje && (
        <div className="admin-precios-success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="admin-precios-error">
          {error}
        </div>
      )}

      <div className="admin-precios-grid">
        {precios.map(
          (item) => (
            <article
              key={item.clave}
              className="admin-precio-card"
            >
              <div>
                <small>
                  {item.categoria}
                </small>

                <strong>
                  {item.nombre}
                </strong>
              </div>

              <div className="admin-precio-editor">
                <span>
                  S/
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.precio}
                  onChange={(event) =>
                    cambiarPrecio(
                      item.clave,
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  disabled={
                    guardando ===
                    item.clave
                  }
                  onClick={() =>
                    guardarPrecio(
                      item
                    )
                  }
                >
                  {guardando ===
                  item.clave
                    ? 'GUARDANDO...'
                    : 'GUARDAR'}
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

export default AdminPrecios;