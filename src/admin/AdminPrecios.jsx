import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  actualizarPrecioAdmin,
  crearPrecioAdmin,
  obtenerPreciosAdmin,
} from '../lib/adminPrecios';

import './admin-precios.css';

const OPCIONES_CATEGORIA_PRECIO = [
  { valor: 'cuadros', etiqueta: 'Cuadros' },
  { valor: 'productos', etiqueta: 'Productos' },
  { valor: 'ropa', etiqueta: 'Ropa' },
  { valor: 'entrega', etiqueta: 'Entrega' },
];

const FORMULARIO_VACIO = {
  clave: '',
  nombre: '',
  categoria: 'cuadros',
  precio: '',
};

function AdminPrecios() {
  const [precios, setPrecios] =
    useState([]);

  const [categoriaActiva, setCategoriaActiva] =
    useState('cuadros');

  const [mostrarNuevo, setMostrarNuevo] =
    useState(false);

  const [formulario, setFormulario] =
    useState(FORMULARIO_VACIO);

  const [creando, setCreando] =
    useState(false);

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

  const preciosFiltrados =
    useMemo(() => {
      return precios.filter(
        (item) =>
          (item.categoria ||
            'cuadros') ===
          categoriaActiva
      );
    }, [
      precios,
      categoriaActiva,
    ]);

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

  function abrirNuevoPrecio() {
    setFormulario({
      ...FORMULARIO_VACIO,
      categoria: categoriaActiva,
    });

    setMensaje('');
    setError('');
    setMostrarNuevo(true);
  }

  function cerrarNuevoPrecio() {
    setMostrarNuevo(false);
    setFormulario(FORMULARIO_VACIO);
  }

  async function crearPrecio(
    evento
  ) {
    evento.preventDefault();

    if (creando) {
      return;
    }

    setMensaje('');
    setError('');
    setCreando(true);

    try {
      const nuevo =
        await crearPrecioAdmin(
          formulario
        );

      setPrecios(
        (actuales) => [
          ...actuales,
          nuevo,
        ]
      );

      setCategoriaActiva(
        nuevo.categoria
      );

      setMensaje(
        `${nuevo.nombre} creado correctamente.`
      );

      cerrarNuevoPrecio();
    } catch (errorCreacion) {
      setError(
        errorCreacion.message ||
          'No se pudo crear el precio.'
      );
    } finally {
      setCreando(false);
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

      <div className="admin-precios-tabs">
        {OPCIONES_CATEGORIA_PRECIO.map(
          (opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={
                categoriaActiva ===
                opcion.valor
                  ? 'activo'
                  : ''
              }
              onClick={() =>
                setCategoriaActiva(
                  opcion.valor
                )
              }
            >
              {opcion.etiqueta.toUpperCase()}
            </button>
          )
        )}
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

      {!mostrarNuevo && (
        <button
          type="button"
          className="admin-precios-nuevo-boton"
          onClick={
            abrirNuevoPrecio
          }
        >
          + NUEVO PRECIO EN{' '}
          {
            OPCIONES_CATEGORIA_PRECIO.find(
              (opcion) =>
                opcion.valor ===
                categoriaActiva
            )?.etiqueta.toUpperCase()
          }
        </button>
      )}

      {mostrarNuevo && (
        <form
          className="admin-precios-nuevo-form"
          onSubmit={
            crearPrecio
          }
        >
          <div>
            <label>
              NOMBRE
            </label>

            <input
              type="text"
              placeholder="Ej. Polo talla M"
              value={
                formulario.nombre
              }
              onChange={(event) =>
                setFormulario(
                  (actual) => ({
                    ...actual,
                    nombre:
                      event.target
                        .value,
                  })
                )
              }
              required
            />
          </div>

          <div>
            <label>
              CLAVE (identificador único)
            </label>

            <input
              type="text"
              placeholder="Ej. polo_m"
              value={
                formulario.clave
              }
              onChange={(event) =>
                setFormulario(
                  (actual) => ({
                    ...actual,
                    clave:
                      event.target
                        .value,
                  })
                )
              }
              required
            />
          </div>

          <div>
            <label>
              CATEGORÍA
            </label>

            <select
              value={
                formulario.categoria
              }
              onChange={(event) =>
                setFormulario(
                  (actual) => ({
                    ...actual,
                    categoria:
                      event.target
                        .value,
                  })
                )
              }
            >
              {OPCIONES_CATEGORIA_PRECIO.map(
                (opcion) => (
                  <option
                    key={opcion.valor}
                    value={
                      opcion.valor
                    }
                  >
                    {opcion.etiqueta}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label>
              PRECIO (S/)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={
                formulario.precio
              }
              onChange={(event) =>
                setFormulario(
                  (actual) => ({
                    ...actual,
                    precio:
                      event.target
                        .value,
                  })
                )
              }
              required
            />
          </div>

          <div className="admin-precios-nuevo-acciones">
            <button
              type="button"
              className="cancelar"
              onClick={
                cerrarNuevoPrecio
              }
            >
              CANCELAR
            </button>

            <button
              type="submit"
              disabled={
                creando
              }
            >
              {creando
                ? 'CREANDO...'
                : 'CREAR PRECIO'}
            </button>
          </div>
        </form>
      )}

      {preciosFiltrados.length === 0 ? (
        <div className="admin-precios-vacio">
          Todavía no hay precios en esta
          categoría.
        </div>
      ) : (
        <div className="admin-precios-grid">
          {preciosFiltrados.map(
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
      )}
    </section>
  );
}

export default AdminPrecios;
