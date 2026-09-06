import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  obtenerProductosAdmin,
} from '../lib/adminProductos';

import {
  cambiarEstadoResenaAdmin,
  crearResenaAdmin,
  eliminarResenaAdmin,
  obtenerResenasAdmin,
  subirImagenResenaAdmin,
} from '../lib/adminResenas';

import './admin-resenas.css';

const FORMULARIO_VACIO = {
  productoId: '',
  nombreCliente: '',
  calificacion: 5,
  comentario: '',
  fechaResena:
    new Date()
      .toISOString()
      .slice(
        0,
        10
      ),
  publicar: true,
};

function AdminResenas() {
  const [
    vista,
    setVista,
  ] = useState(
    'inicio'
  );

  const [
    productos,
    setProductos,
  ] = useState([]);

  const [
    resenas,
    setResenas,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    accionando,
    setAccionando,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
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

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState(
    'pendiente'
  );

  const [
    filtroTipo,
    setFiltroTipo,
  ] = useState(
    'todas'
  );

  useEffect(() => {
    cargarDatos();
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

  async function cargarDatos() {
    setCargando(
      true
    );

    setError('');

    try {
      const [
        datosProductos,
        datosResenas,
      ] =
        await Promise.all([
          obtenerProductosAdmin(),
          obtenerResenasAdmin(),
        ]);

      setProductos(
        datosProductos || []
      );

      setResenas(
        datosResenas || []
      );
    } catch (
      errorCarga
    ) {
      setError(
        errorCarga.message ||
          'No se pudo cargar el módulo de reseñas.'
      );
    } finally {
      setCargando(
        false
      );
    }
  }

  const productosDisponibles =
    useMemo(
      () =>
        productos.filter(
          (producto) =>
            producto.activo &&
            (
              producto.categoria ===
                'cuadro' ||
              producto.categoria ===
                'cuadros'
            )
        ),
      [
        productos,
      ]
    );

  const mapaProductos =
    useMemo(() => {
      return new Map(
        productos.map(
          (producto) => [
            String(
              producto.producto_id
            ),
            producto,
          ]
        )
      );
    }, [
      productos,
    ]);

  const resenasFiltradas =
    useMemo(() => {
      return resenas.filter(
        (resena) => {
          const cumpleEstado =
            filtroEstado ===
              'todas' ||
            resena.estado ===
              filtroEstado;

          const tieneFoto =
            Boolean(
              resena.imagen_url
            );

          const cumpleTipo =
            filtroTipo ===
              'todas' ||
            (
              filtroTipo ===
                'foto' &&
              tieneFoto
            ) ||
            (
              filtroTipo ===
                'texto' &&
              !tieneFoto
            );

          return (
            cumpleEstado &&
            cumpleTipo
          );
        }
      );
    }, [
      resenas,
      filtroEstado,
      filtroTipo,
    ]);

  const pendientes =
    resenas.filter(
      (resena) =>
        resena.estado ===
        'pendiente'
    ).length;

  function nombreProducto(
    productoId
  ) {
    return (
      mapaProductos.get(
        String(
          productoId
        )
      )?.nombre ||
      'Producto'
    );
  }

  function abrirInicio() {
    setVista(
      'inicio'
    );

    setError('');
    setMensaje('');
  }

  function abrirCrear() {
    setVista(
      'crear'
    );

    setError('');
    setMensaje('');

    setFormulario({
      ...FORMULARIO_VACIO,
      productoId:
        productosDisponibles[
          0
        ]?.producto_id ||
        '',
    });

    setArchivoImagen(
      null
    );

    setPreviewImagen(
      ''
    );
  }

  function abrirAprobar() {
    setVista(
      'aprobar'
    );

    setFiltroEstado(
      'pendiente'
    );

    setFiltroTipo(
      'todas'
    );

    setError('');
    setMensaje('');
  }

  function cambiarCampo(
    evento
  ) {
    const {
      name,
      value,
    } =
      evento.target;

    setFormulario(
      (actual) => ({
        ...actual,
        [name]:
          value,
      })
    );

    setError('');
  }

  function seleccionarEstrellas(
    cantidad
  ) {
    setFormulario(
      (actual) => ({
        ...actual,
        calificacion:
          cantidad,
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

    setArchivoImagen(
      archivo
    );

    setPreviewImagen(
      URL.createObjectURL(
        archivo
      )
    );

    setError('');
  }

  async function guardarResena(
    evento
  ) {
    evento.preventDefault();

    if (guardando) {
      return;
    }

    setGuardando(
      true
    );

    setError('');
    setMensaje('');

    try {
      let imagenUrl =
        '';

      if (
        archivoImagen
      ) {
        imagenUrl =
          await subirImagenResenaAdmin(
            archivoImagen
          );
      }

      const nueva =
        await crearResenaAdmin({
          productoId:
            formulario.productoId,

          nombreCliente:
            formulario.nombreCliente,

          calificacion:
            formulario.calificacion,

          comentario:
            formulario.comentario,

          imagenUrl,

          fechaResena:
            formulario.fechaResena,

          publicar:
            formulario.publicar,
        });

      setResenas(
        (actuales) => [
          nueva,
          ...actuales,
        ]
      );

      setFormulario({
        ...FORMULARIO_VACIO,

        productoId:
          productosDisponibles[
            0
          ]?.producto_id ||
          '',
      });

      setArchivoImagen(
        null
      );

      setPreviewImagen(
        ''
      );

      setMensaje(
        formulario.publicar
          ? 'Reseña creada y publicada correctamente.'
          : 'Reseña creada y guardada como oculta.'
      );
    } catch (
      errorGuardado
    ) {
      setError(
        errorGuardado.message ||
          'No se pudo guardar la reseña.'
      );
    } finally {
      setGuardando(
        false
      );
    }
  }

  async function cambiarEstado(
    resena,
    estado
  ) {
    if (accionando) {
      return;
    }

    setAccionando(
      resena.id
    );

    setError('');
    setMensaje('');

    try {
      const actualizada =
        await cambiarEstadoResenaAdmin(
          resena.id,
          estado
        );

      setResenas(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id ===
              actualizada.id
                ? actualizada
                : item
          )
      );

      const mensajes = {
        aprobada:
          'Reseña aprobada correctamente.',
        rechazada:
          'Reseña rechazada.',
        oculta:
          'Reseña ocultada.',
      };

      setMensaje(
        mensajes[
          estado
        ] ||
          'Reseña actualizada.'
      );
    } catch (
      errorEstado
    ) {
      setError(
        errorEstado.message ||
          'No se pudo actualizar la reseña.'
      );
    } finally {
      setAccionando(
        ''
      );
    }
  }

  async function eliminar(
    resena
  ) {
    const confirmar =
      window.confirm(
        '¿Eliminar esta reseña definitivamente?'
      );

    if (!confirmar) {
      return;
    }

    if (accionando) {
      return;
    }

    setAccionando(
      resena.id
    );

    setError('');
    setMensaje('');

    try {
      await eliminarResenaAdmin(
        resena.id
      );

      setResenas(
        (actuales) =>
          actuales.filter(
            (item) =>
              item.id !==
              resena.id
          )
      );

      setMensaje(
        'Reseña eliminada.'
      );
    } catch (
      errorEliminar
    ) {
      setError(
        errorEliminar.message ||
          'No se pudo eliminar la reseña.'
      );
    } finally {
      setAccionando(
        ''
      );
    }
  }

  if (cargando) {
    return (
      <section className="admin-resenas">
        <div className="admin-resenas-status">
          Cargando reseñas...
        </div>
      </section>
    );
  }

  if (
    vista === 'crear'
  ) {
    return (
      <section className="admin-resenas">
        <button
          type="button"
          className="admin-resenas-volver"
          onClick={
            abrirInicio
          }
        >
          ← VOLVER A RESEÑAS
        </button>

        <div className="admin-resenas-heading">
          <span>
            RESEÑAS
          </span>

          <h2>
            Crear reseña
          </h2>

          <p>
            Registra manualmente una
            opinión para un producto
            de BRO.
          </p>
        </div>

        {error && (
          <div className="admin-resenas-error">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="admin-resenas-exito">
            {mensaje}
          </div>
        )}

        <form
          className="admin-resenas-form"
          onSubmit={
            guardarResena
          }
        >
          <div className="admin-resenas-form-campos">

            <label>
              <span>
                PRODUCTO
              </span>

              <select
                name="productoId"
                value={
                  formulario.productoId
                }
                onChange={
                  cambiarCampo
                }
              >
                <option value="">
                  Selecciona un producto
                </option>

                {productosDisponibles.map(
                  (
                    producto
                  ) => (
                    <option
                      key={
                        producto.producto_id
                      }
                      value={
                        producto.producto_id
                      }
                    >
                      {producto.nombre}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                NOMBRE DEL CLIENTE
              </span>

              <input
                type="text"
                name="nombreCliente"
                value={
                  formulario.nombreCliente
                }
                onChange={
                  cambiarCampo
                }
                placeholder="Ej. Carlos M."
                maxLength="80"
              />
            </label>

            <div className="admin-resenas-calificacion">
              <span>
                CALIFICACIÓN
              </span>

              <div>
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (
                    estrella
                  ) => (
                    <button
                      key={
                        estrella
                      }
                      type="button"
                      className={
                        estrella <=
                        formulario.calificacion
                          ? 'activa'
                          : ''
                      }
                      onClick={() =>
                        seleccionarEstrellas(
                          estrella
                        )
                      }
                    >
                      ★
                    </button>
                  )
                )}
              </div>
            </div>

            <label>
              <span>
                FECHA
              </span>

              <input
                type="date"
                name="fechaResena"
                value={
                  formulario.fechaResena
                }
                onChange={
                  cambiarCampo
                }
              />
            </label>

            <label className="admin-resenas-comentario">
              <span>
                RESEÑA
              </span>

              <textarea
                name="comentario"
                value={
                  formulario.comentario
                }
                onChange={
                  cambiarCampo
                }
                placeholder="Escribe la opinión del cliente..."
                maxLength="1200"
                rows="6"
              />
            </label>

            <div className="admin-resenas-publicar">
              <div>
                <strong>
                  PUBLICAR AHORA
                </strong>

                <span>
                  Si está apagado, la
                  reseña quedará oculta.
                </span>
              </div>

              <button
                type="button"
                className={`admin-resenas-switch ${
                  formulario.publicar
                    ? 'on'
                    : ''
                }`}
                onClick={() =>
                  setFormulario(
                    (
                      actual
                    ) => ({
                      ...actual,

                      publicar:
                        !actual.publicar,
                    })
                  )
                }
              >
                <span />
              </button>
            </div>

          </div>

          <div className="admin-resenas-imagen">
            <div className="admin-resenas-preview">
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
                    FOTO OPCIONAL
                  </strong>

                  <span>
                    La reseña puede
                    publicarse sin imagen.
                  </span>
                </div>
              )}
            </div>

            <label className="admin-resenas-upload">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={
                  cambiarImagen
                }
              />

              <strong>
                {previewImagen
                  ? 'CAMBIAR FOTO'
                  : 'AGREGAR FOTO'}
              </strong>

              <span>
                Opcional · Máx. 8 MB
              </span>
            </label>
          </div>

          <div className="admin-resenas-form-actions">
            <button
              type="button"
              className="secundario"
              onClick={
                abrirInicio
              }
              disabled={
                guardando
              }
            >
              CANCELAR
            </button>

            <button
              type="submit"
              className="principal"
              disabled={
                guardando
              }
            >
              {guardando
                ? 'GUARDANDO...'
                : 'CREAR RESEÑA'}
            </button>
          </div>
        </form>
      </section>
    );
  }

  if (
    vista === 'aprobar'
  ) {
    return (
      <section className="admin-resenas">
        <button
          type="button"
          className="admin-resenas-volver"
          onClick={
            abrirInicio
          }
        >
          ← VOLVER A RESEÑAS
        </button>

        <div className="admin-resenas-heading">
          <span>
            MODERACIÓN
          </span>

          <h2>
            Aprobar reseñas
          </h2>

          <p>
            Revisa las opiniones antes
            de mostrarlas en BRO.
          </p>
        </div>

        {error && (
          <div className="admin-resenas-error">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="admin-resenas-exito">
            {mensaje}
          </div>
        )}

        <div className="admin-resenas-filtros">
          <div>
            {[
              [
                'pendiente',
                `PENDIENTES (${pendientes})`,
              ],
              [
                'aprobada',
                'APROBADAS',
              ],
              [
                'oculta',
                'OCULTAS',
              ],
              [
                'rechazada',
                'RECHAZADAS',
              ],
              [
                'todas',
                'TODAS',
              ],
            ].map(
              ([
                valor,
                texto,
              ]) => (
                <button
                  key={
                    valor
                  }
                  type="button"
                  className={
                    filtroEstado ===
                    valor
                      ? 'activo'
                      : ''
                  }
                  onClick={() =>
                    setFiltroEstado(
                      valor
                    )
                  }
                >
                  {texto}
                </button>
              )
            )}
          </div>

          <div>
            <button
              type="button"
              className={
                filtroTipo ===
                'todas'
                  ? 'activo'
                  : ''
              }
              onClick={() =>
                setFiltroTipo(
                  'todas'
                )
              }
            >
              TODAS
            </button>

            <button
              type="button"
              className={
                filtroTipo ===
                'foto'
                  ? 'activo'
                  : ''
              }
              onClick={() =>
                setFiltroTipo(
                  'foto'
                )
              }
            >
              CON FOTO
            </button>

            <button
              type="button"
              className={
                filtroTipo ===
                'texto'
                  ? 'activo'
                  : ''
              }
              onClick={() =>
                setFiltroTipo(
                  'texto'
                )
              }
            >
              SOLO TEXTO
            </button>
          </div>
        </div>

        <div className="admin-resenas-lista">
          {resenasFiltradas.length ===
          0 ? (
            <div className="admin-resenas-vacio">
              No hay reseñas en esta
              categoría.
            </div>
          ) : (
            resenasFiltradas.map(
              (resena) => (
                <article
                  key={
                    resena.id
                  }
                  className="admin-resena-card"
                >
                  {resena.imagen_url && (
                    <img
                      className="admin-resena-foto"
                      src={
                        resena.imagen_url
                      }
                      alt=""
                    />
                  )}

                  <div className="admin-resena-contenido">
                    <div className="admin-resena-superior">
                      <div>
                        <strong>
                          {
                            resena.nombre_cliente
                          }
                        </strong>

                        <span>
                          {
                            nombreProducto(
                              resena.producto_id
                            )
                          }
                        </span>
                      </div>

                      <span className={`admin-resena-estado ${resena.estado}`}>
                        {
                          resena.estado
                        }
                      </span>
                    </div>

                    <div className="admin-resena-estrellas">
                      {'★'.repeat(
                        resena.calificacion
                      )}
                      {'☆'.repeat(
                        5 -
                          resena.calificacion
                      )}
                    </div>

                    <p>
                      {
                        resena.comentario
                      }
                    </p>

                    <div className="admin-resena-meta">
                      <span>
                        {
                          resena.fecha_resena
                        }
                      </span>

                      <span>
                        {resena.imagen_url
                          ? 'CON FOTO'
                          : 'SOLO TEXTO'}
                      </span>

                      <span>
                        {resena.origen ===
                        'admin'
                          ? 'CREADA POR ADMIN'
                          : 'ENVIADA POR CLIENTE'}
                      </span>
                    </div>

                    <div className="admin-resena-acciones">
                      {resena.estado !==
                        'aprobada' && (
                        <button
                          type="button"
                          className="aprobar"
                          disabled={
                            accionando ===
                            resena.id
                          }
                          onClick={() =>
                            cambiarEstado(
                              resena,
                              'aprobada'
                            )
                          }
                        >
                          APROBAR
                        </button>
                      )}

                      {resena.estado ===
                        'aprobada' && (
                        <button
                          type="button"
                          disabled={
                            accionando ===
                            resena.id
                          }
                          onClick={() =>
                            cambiarEstado(
                              resena,
                              'oculta'
                            )
                          }
                        >
                          OCULTAR
                        </button>
                      )}

                      {resena.estado !==
                        'rechazada' && (
                        <button
                          type="button"
                          disabled={
                            accionando ===
                            resena.id
                          }
                          onClick={() =>
                            cambiarEstado(
                              resena,
                              'rechazada'
                            )
                          }
                        >
                          RECHAZAR
                        </button>
                      )}

                      <button
                        type="button"
                        className="eliminar"
                        disabled={
                          accionando ===
                          resena.id
                        }
                        onClick={() =>
                          eliminar(
                            resena
                          )
                        }
                      >
                        ELIMINAR
                      </button>
                    </div>
                  </div>
                </article>
              )
            )
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="admin-resenas">
      <div className="admin-resenas-heading">
        <span>
          OPINIONES
        </span>

        <h2>
          Reseñas
        </h2>

        <p>
          Crea reseñas o revisa las
          enviadas por tus clientes.
        </p>
      </div>

      {pendientes > 0 && (
        <div className="admin-resenas-pendientes">
          <strong>
            {pendientes}
          </strong>

          <span>
            {pendientes ===
            1
              ? 'reseña pendiente de aprobación'
              : 'reseñas pendientes de aprobación'}
          </span>
        </div>
      )}

      <div className="admin-resenas-opciones">

        <button
          type="button"
          className="admin-resenas-opcion"
          onClick={
            abrirCrear
          }
        >
          <div className="admin-resenas-opcion-icono">
            +
          </div>

          <div>
            <strong>
              CREAR RESEÑA
            </strong>

            <span>
              Registra manualmente una
              opinión para cualquier
              producto.
            </span>
          </div>

          <span className="admin-resenas-flecha">
            →
          </span>
        </button>

        <button
          type="button"
          className="admin-resenas-opcion"
          onClick={
            abrirAprobar
          }
        >
          <div className="admin-resenas-opcion-icono">
            ✓
          </div>

          <div>
            <strong>
              APROBAR RESEÑAS
            </strong>

            <span>
              Revisa, aprueba, rechaza
              u oculta opiniones.
            </span>
          </div>

          <span className="admin-resenas-flecha">
            →
          </span>
        </button>

      </div>

      <div className="admin-resenas-info">
        <strong>
          SISTEMA DE RESEÑAS BRO
        </strong>

        <span>
          Las reseñas pueden contener
          solo texto o incluir una imagen.
          La imagen nunca es obligatoria.
        </span>
      </div>
    </section>
  );
}

export default AdminResenas;