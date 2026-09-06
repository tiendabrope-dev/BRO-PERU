import {
  useEffect,
  useState,
} from 'react';

import {
  actualizarProductoAdmin,
  cambiarEstadoProductoAdmin,
  crearProductoAdmin,
  generarIdProducto,
  generarSlugProducto,
  obtenerProductosAdmin,
  subirImagenProductoAdmin,
} from '../lib/adminProductos';

import {
  productos as productosCatalogo,
} from '../data/catalogo';

import './admin-productos.css';

const FORMULARIO_VACIO = {
  nombre: '',
  slug: '',
  cantidadResenas: '0',
  activo: true,
  imagenUrl: '',
};

function obtenerImagenProducto(
  producto
) {
  if (
    producto?.imagen_url
  ) {
    return producto.imagen_url;
  }

  const productoLocal =
    productosCatalogo.find(
      (item) =>
        String(item.id) ===
          String(
            producto?.producto_id
          ) ||
        item.slug ===
          producto?.slug
    );

  return (
    productoLocal
      ?.imagenes?.[0] ||
    productoLocal
      ?.imagen ||
    ''
  );
}

function notificarActualizacionProductos() {
  window.dispatchEvent(
    new Event(
      'bro-productos-actualizados'
    )
  );
}

function AdminProductos() {
  const [
    productos,
    setProductos,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardandoEstado,
    setGuardandoEstado,
  ] = useState('');

  const [
    guardandoFormulario,
    setGuardandoFormulario,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
  ] = useState('');

  const [
    formularioAbierto,
    setFormularioAbierto,
  ] = useState(false);

  const [
    modoFormulario,
    setModoFormulario,
  ] = useState('nuevo');

  const [
    productoIdFormulario,
    setProductoIdFormulario,
  ] = useState('');

  const [
    formulario,
    setFormulario,
  ] = useState(
    FORMULARIO_VACIO
  );

  const [
    archivoImagen,
    setArchivoImagen,
  ] = useState(null);

  const [
    previewImagen,
    setPreviewImagen,
  ] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    return () => {
      if (
        previewImagen &&
        previewImagen.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          previewImagen
        );
      }
    };
  }, [
    previewImagen,
  ]);

  async function cargarProductos() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerProductosAdmin();

      setProductos(
        datos
      );
    } catch (
      errorCarga
    ) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar los productos.'
      );
    } finally {
      setCargando(false);
    }
  }

  function ordenarProductos(
    lista
  ) {
    return [
      ...lista,
    ].sort(
      (
        a,
        b
      ) =>
        String(
          a.nombre || ''
        ).localeCompare(
          String(
            b.nombre || ''
          ),
          'es'
        )
    );
  }

  function abrirNuevoProducto() {
    setError('');
    setMensaje('');

    setModoFormulario(
      'nuevo'
    );

    setProductoIdFormulario(
      generarIdProducto()
    );

    setFormulario({
      ...FORMULARIO_VACIO,
    });

    setArchivoImagen(
      null
    );

    setPreviewImagen(
      ''
    );

    setFormularioAbierto(
      true
    );
  }

  function abrirEditarProducto(
    producto
  ) {
    setError('');
    setMensaje('');

    setModoFormulario(
      'editar'
    );

    setProductoIdFormulario(
      producto.producto_id
    );

    setFormulario({
      nombre:
        producto.nombre ||
        '',

      slug:
        producto.slug ||
        '',

      cantidadResenas:
        String(
          producto
            .cantidad_resenas ||
            0
        ),

      activo:
        Boolean(
          producto.activo
        ),

      /*
        IMPORTANTE:

        Aquí conservamos únicamente
        la URL que realmente existe
        en Supabase.

        La imagen del catálogo local
        solamente se usa como preview.
      */
      imagenUrl:
        producto.imagen_url ||
        '',
    });

    setArchivoImagen(
      null
    );

    setPreviewImagen(
      obtenerImagenProducto(
        producto
      )
    );

    setFormularioAbierto(
      true
    );
  }

  function cerrarFormulario(
    forzar = false
  ) {
    if (
      guardandoFormulario &&
      !forzar
    ) {
      return;
    }

    setFormularioAbierto(
      false
    );

    setModoFormulario(
      'nuevo'
    );

    setProductoIdFormulario(
      ''
    );

    setFormulario({
      ...FORMULARIO_VACIO,
    });

    setArchivoImagen(
      null
    );

    setPreviewImagen(
      ''
    );
  }

  function cambiarNombre(
    evento
  ) {
    const nombre =
      evento.target.value;

    setFormulario(
      (actual) => ({
        ...actual,

        nombre,

        slug:
          generarSlugProducto(
            nombre
          ),
      })
    );
  }

  function cambiarResenas(
    evento
  ) {
    const valor =
      evento.target.value
        .replace(
          /\D/g,
          ''
        )
        .slice(
          0,
          7
        );

    setFormulario(
      (actual) => ({
        ...actual,

        cantidadResenas:
          valor,
      })
    );
  }

  function cambiarActivo() {
    setFormulario(
      (actual) => ({
        ...actual,

        activo:
          !actual.activo,
      })
    );
  }

  function cambiarImagen(
    evento
  ) {
    const archivo =
      evento.target
        .files?.[0];

    if (!archivo) {
      return;
    }

    setError('');
    setMensaje('');

    setArchivoImagen(
      archivo
    );

    const preview =
      URL.createObjectURL(
        archivo
      );

    setPreviewImagen(
      preview
    );
  }

  async function guardarProducto(
    evento
  ) {
    evento.preventDefault();

    if (
      guardandoFormulario
    ) {
      return;
    }

    setError('');
    setMensaje('');

    const nombre =
      formulario.nombre
        .trim();

    if (!nombre) {
      setError(
        'Ingresa el nombre del producto.'
      );

      return;
    }

    if (
      modoFormulario ===
        'nuevo' &&
      !archivoImagen
    ) {
      setError(
        'Selecciona una imagen para el cuadro.'
      );

      return;
    }

    setGuardandoFormulario(
      true
    );

    try {
      let imagenUrl =
        formulario.imagenUrl;

      if (
        archivoImagen
      ) {
        imagenUrl =
          await subirImagenProductoAdmin(
            archivoImagen,
            productoIdFormulario
          );
      }

      let productoGuardado;

      if (
        modoFormulario ===
        'nuevo'
      ) {
        productoGuardado =
          await crearProductoAdmin({
            productoId:
              productoIdFormulario,

            nombre,

            slug:
              formulario.slug,

            imagenUrl,

            cantidadResenas:
              formulario
                .cantidadResenas,

            activo:
              formulario.activo,
          });

        setProductos(
          (actuales) =>
            ordenarProductos([
              ...actuales,
              productoGuardado,
            ])
        );

        setMensaje(
          'Cuadro creado correctamente.'
        );
      } else {
        productoGuardado =
          await actualizarProductoAdmin(
            productoIdFormulario,
            {
              nombre,

              slug:
                formulario.slug,

              imagenUrl,

              cantidadResenas:
                formulario
                  .cantidadResenas,

              activo:
                formulario.activo,
            }
          );

        setProductos(
          (actuales) =>
            ordenarProductos(
              actuales.map(
                (producto) =>
                  producto
                    .producto_id ===
                  productoGuardado
                    .producto_id
                    ? productoGuardado
                    : producto
              )
            )
        );

        setMensaje(
          'Producto actualizado correctamente.'
        );
      }

      notificarActualizacionProductos();

      cerrarFormulario(
        true
      );
    } catch (
      errorGuardado
    ) {
      setError(
        errorGuardado.message ||
          'No se pudo guardar el producto.'
      );
    } finally {
      setGuardandoFormulario(
        false
      );
    }
  }

  async function cambiarEstado(
    producto
  ) {
    if (
      guardandoEstado
    ) {
      return;
    }

    setGuardandoEstado(
      producto.producto_id
    );

    setError('');
    setMensaje('');

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

      notificarActualizacionProductos();
    } catch (
      errorCambio
    ) {
      setError(
        errorCambio.message ||
          'No se pudo actualizar el producto.'
      );
    } finally {
      setGuardandoEstado(
        ''
      );
    }
  }

  const productosCuadros =
    productos.filter(
      (producto) =>
        producto.categoria ===
          'cuadro' ||
        producto.categoria ===
          'cuadros'
    );

  const productosActivos =
    productosCuadros.filter(
      (producto) =>
        producto.activo
    ).length;

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
            Administra los productos
            disponibles en BRO.
          </p>
        </div>

        <div className="admin-productos-heading-actions">
          <strong>
            {productosActivos}
            {' '}
            ACTIVOS
          </strong>

          <button
            type="button"
            className="admin-productos-nuevo"
            onClick={
              abrirNuevoProducto
            }
          >
            + NUEVO CUADRO
          </button>
        </div>
      </div>

      <div className="admin-productos-tabs">
        <button
          type="button"
          className="activo"
        >
          CUADROS
        </button>

        <button
          type="button"
          disabled
        >
          CASES

          <small>
            PRÓXIMAMENTE
          </small>
        </button>

        <button
          type="button"
          disabled
        >
          POLOS

          <small>
            PRÓXIMAMENTE
          </small>
        </button>
      </div>

      {error && (
        <div className="admin-productos-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="admin-productos-exito">
          {mensaje}
        </div>
      )}

      <div className="admin-productos-precios-info">
        <strong>
          PRECIOS COMPARTIDOS
        </strong>

        <span>
          Todos los cuadros utilizan
          automáticamente los precios
          A4, A3, A2 y Marco definidos
          en Admin → Precios.
        </span>
      </div>

      {cargando ? (
        <div className="admin-productos-status">
          Cargando productos...
        </div>
      ) : (
        <div className="admin-productos-lista">
          {productosCuadros.length ===
          0 ? (
            <div className="admin-productos-vacio">
              Todavía no hay cuadros
              registrados.
            </div>
          ) : (
            productosCuadros.map(
              (producto) => {
                const imagenProducto =
                  obtenerImagenProducto(
                    producto
                  );

                return (
                  <article
                    key={
                      producto
                        .producto_id
                    }
                    className="admin-producto-card"
                  >
                    <div className="admin-producto-imagen">
                      {imagenProducto ? (
                        <img
                          src={
                            imagenProducto
                          }
                          alt={
                            producto
                              .nombre
                          }
                        />
                      ) : (
                        <span>
                          SIN
                          <br />
                          IMAGEN
                        </span>
                      )}
                    </div>

                    <div className="admin-producto-info">
                      <small>
                        CUADRO
                      </small>

                      <strong>
                        {
                          producto
                            .nombre
                        }
                      </strong>

                      <span>
                        /producto/
                        {
                          producto
                            .slug
                        }
                      </span>

                      <div className="admin-producto-meta">
                        <span>
                          ★{' '}
                          {producto
                            .cantidad_resenas ||
                            0}
                          {' '}
                          reseñas
                        </span>

                        {!imagenProducto && (
                          <span className="sin-imagen">
                            Imagen pendiente
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="admin-producto-acciones">
                      <button
                        type="button"
                        className="admin-producto-editar"
                        onClick={() =>
                          abrirEditarProducto(
                            producto
                          )
                        }
                      >
                        EDITAR
                      </button>

                      <div className="admin-producto-estado">
                        <span
                          className={
                            producto
                              .activo
                              ? 'activo'
                              : 'inactivo'
                          }
                        >
                          {producto
                            .activo
                            ? 'ACTIVO'
                            : 'INACTIVO'}
                        </span>

                        <button
                          type="button"
                          className={`admin-producto-switch ${
                            producto
                              .activo
                              ? 'on'
                              : ''
                          }`}
                          disabled={
                            guardandoEstado ===
                            producto
                              .producto_id
                          }
                          onClick={() =>
                            cambiarEstado(
                              producto
                            )
                          }
                          aria-label={
                            producto
                              .activo
                              ? `Desactivar ${producto.nombre}`
                              : `Activar ${producto.nombre}`
                          }
                        >
                          <span />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )
          )}
        </div>
      )}

      {formularioAbierto && (
        <div
          className="admin-producto-modal"
          onMouseDown={() =>
            cerrarFormulario()
          }
        >
          <div
            className="admin-producto-editor"
            onMouseDown={(
              evento
            ) =>
              evento.stopPropagation()
            }
          >
            <div className="admin-producto-editor-heading">
              <div>
                <span>
                  {modoFormulario ===
                  'nuevo'
                    ? 'NUEVO PRODUCTO'
                    : 'EDITAR PRODUCTO'}
                </span>

                <h3>
                  {modoFormulario ===
                  'nuevo'
                    ? 'Nuevo cuadro'
                    : formulario.nombre}
                </h3>
              </div>

              <button
                type="button"
                className="admin-producto-editor-cerrar"
                onClick={() =>
                  cerrarFormulario()
                }
                disabled={
                  guardandoFormulario
                }
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <form
              className="admin-producto-form"
              onSubmit={
                guardarProducto
              }
            >
              <div className="admin-producto-form-column">

                <label>
                  <span>
                    NOMBRE DEL CUADRO
                  </span>

                  <input
                    type="text"
                    value={
                      formulario.nombre
                    }
                    onChange={
                      cambiarNombre
                    }
                    placeholder="Ej. Porsche 911 GT3 RS"
                    maxLength="120"
                    autoFocus
                  />
                </label>

                <label>
                  <span>
                    URL DEL PRODUCTO
                  </span>

                  <div className="admin-producto-slug">
                    <small>
                      /producto/
                    </small>

                    <input
                      type="text"
                      value={
                        formulario.slug
                      }
                      readOnly
                      tabIndex="-1"
                    />
                  </div>

                  <small className="admin-producto-ayuda">
                    Se genera
                    automáticamente a partir
                    del nombre.
                  </small>
                </label>

                <label>
                  <span>
                    CANTIDAD DE RESEÑAS
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      formulario
                        .cantidadResenas
                    }
                    onChange={
                      cambiarResenas
                    }
                    placeholder="0"
                  />

                  <small className="admin-producto-ayuda">
                    Solo se mostrará la
                    cantidad de reseñas.
                  </small>
                </label>

                <div className="admin-producto-form-estado">
                  <div>
                    <strong>
                      PRODUCTO ACTIVO
                    </strong>

                    <span>
                      Visible y disponible
                      para comprar.
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`admin-producto-switch ${
                      formulario.activo
                        ? 'on'
                        : ''
                    }`}
                    onClick={
                      cambiarActivo
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="admin-producto-precio-note">
                  <strong>
                    PRECIO AUTOMÁTICO
                  </strong>

                  <span>
                    Este cuadro utilizará
                    los precios configurados
                    en Admin → Precios.
                  </span>
                </div>

              </div>

              <div className="admin-producto-imagen-editor">
                <div className="admin-producto-preview">
                  {previewImagen ? (
                    <img
                      src={
                        previewImagen
                      }
                      alt="Vista previa"
                    />
                  ) : (
                    <div>
                      <strong>
                        IMAGEN DEL CUADRO
                      </strong>

                      <span>
                        Sube una imagen
                        para visualizarla
                        aquí.
                      </span>
                    </div>
                  )}
                </div>

                <label className="admin-producto-upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={
                      cambiarImagen
                    }
                  />

                  <strong>
                    {previewImagen
                      ? 'CAMBIAR IMAGEN'
                      : 'SUBIR IMAGEN'}
                  </strong>

                  <span>
                    JPG, PNG, WEBP o AVIF
                    · Máximo 10 MB
                  </span>
                </label>
              </div>

              <div className="admin-producto-form-actions">
                <button
                  type="button"
                  className="secundario"
                  onClick={() =>
                    cerrarFormulario()
                  }
                  disabled={
                    guardandoFormulario
                  }
                >
                  CANCELAR
                </button>

                <button
                  type="submit"
                  className="principal"
                  disabled={
                    guardandoFormulario
                  }
                >
                  {guardandoFormulario
                    ? 'GUARDANDO...'
                    : modoFormulario ===
                        'nuevo'
                      ? 'CREAR CUADRO'
                      : 'GUARDAR CAMBIOS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}

export default AdminProductos;