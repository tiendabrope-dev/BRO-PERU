import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  actualizarPromocionAdmin,
  crearPromocionAdmin,
  eliminarPromocionAdmin,
  obtenerPromocionesAdmin,
} from '../lib/adminPromociones';

function AdminPromociones() {
  const [
    promociones,
    setPromociones,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
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
    nuevoTexto,
    setNuevoTexto,
  ] = useState('');

  const activas =
    useMemo(
      () =>
        promociones.filter(
          (item) =>
            item.activo
        ).length,
      [
        promociones,
      ]
    );

  async function cargarPromociones() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerPromocionesAdmin();

      setPromociones(
        datos
      );
    } catch (
      errorCarga
    ) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar las promociones.'
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPromociones();
  }, []);

  function cambiarCampo(
    id,
    campo,
    valor
  ) {
    setPromociones(
      (actuales) =>
        actuales.map(
          (item) =>
            item.id ===
            id
              ? {
                  ...item,

                  [campo]:
                    valor,
                }
              : item
        )
    );

    setError('');
    setMensaje('');
  }

  async function crear() {
    const texto =
      nuevoTexto.trim();

    if (!texto) {
      setError(
        'Escribe una promoción.'
      );

      return;
    }

    const mayorOrden =
      promociones.reduce(
        (
          mayor,
          item
        ) =>
          Math.max(
            mayor,
            Number(
              item.orden ||
                0
            )
          ),
        0
      );

    setGuardando(
      'nuevo'
    );

    setError('');
    setMensaje('');

    try {
      const creada =
        await crearPromocionAdmin({
          texto,

          orden:
            mayorOrden +
            10,
        });

      setPromociones(
        (actuales) => [
          ...actuales,
          creada,
        ]
      );

      setNuevoTexto('');

      setMensaje(
        'Promoción creada correctamente.'
      );
    } catch (
      errorCrear
    ) {
      setError(
        errorCrear.message ||
          'No se pudo crear la promoción.'
      );
    } finally {
      setGuardando('');
    }
  }

  async function guardar(
    promocion
  ) {
    setGuardando(
      promocion.id
    );

    setError('');
    setMensaje('');

    try {
      const actualizada =
        await actualizarPromocionAdmin(
          promocion.id,
          {
            texto:
              promocion.texto,

            orden:
              Number(
                promocion.orden
              ),

            activo:
              promocion.activo,
          }
        );

      setPromociones(
        (actuales) =>
          actuales
            .map(
              (item) =>
                item.id ===
                actualizada.id
                  ? actualizada
                  : item
            )
            .sort(
              (
                a,
                b
              ) =>
                Number(
                  a.orden
                ) -
                Number(
                  b.orden
                )
            )
      );

      setMensaje(
        'Promoción guardada correctamente.'
      );
    } catch (
      errorGuardar
    ) {
      setError(
        errorGuardar.message ||
          'No se pudo guardar la promoción.'
      );
    } finally {
      setGuardando('');
    }
  }

  async function eliminar(
    promocion
  ) {
    const confirmar =
      window.confirm(
        `¿Eliminar "${promocion.texto}"?`
      );

    if (!confirmar) {
      return;
    }

    setGuardando(
      promocion.id
    );

    setError('');
    setMensaje('');

    try {
      await eliminarPromocionAdmin(
        promocion.id
      );

      setPromociones(
        (actuales) =>
          actuales.filter(
            (item) =>
              item.id !==
              promocion.id
          )
      );

      setMensaje(
        'Promoción eliminada.'
      );
    } catch (
      errorEliminar
    ) {
      setError(
        errorEliminar.message ||
          'No se pudo eliminar la promoción.'
      );
    } finally {
      setGuardando('');
    }
  }

  return (
    <section className="admin-promociones">

      <style>
        {`
          .admin-promociones {
            width: 100%;
          }

          .admin-promociones-head {
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 18px;
          }

          .admin-promociones-head-text > span {
            display: block;
            margin-bottom: 6px;
            color: #2d5a3d;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-promociones-head h2 {
            margin: 0 0 7px;
            color: #111;
            font-size: 30px;
          }

          .admin-promociones-head p {
            margin: 0;
            color: #767676;
            font-size: 13px;
          }

          .admin-promociones-refresh {
            min-height: 39px;
            padding: 0 15px;
            border: 1px solid #d8d2ca;
            border-radius: 7px;
            background: #fff;
            color: #111;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-promociones-resumen {
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-promociones-resumen span {
            padding: 7px 10px;
            border-radius: 999px;
            background: #e8f0ea;
            color: #2d5a3d;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-promociones-nueva {
            padding: 15px;
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            border: 1px solid #e2dcd4;
            border-radius: 9px;
            background: #fff;
          }

          .admin-promociones-nueva input {
            flex: 1;
            min-width: 0;
            height: 42px;
            padding: 0 12px;
            box-sizing: border-box;
            border: 1px solid #d8d2ca;
            border-radius: 6px;
            outline: none;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 12px;
          }

          .admin-promociones-nueva input:focus,
          .admin-promocion-texto:focus,
          .admin-promocion-orden:focus {
            border-color: #2d5a3d;
            box-shadow:
              0 0 0 3px
              rgba(45, 90, 61, .08);
          }

          .admin-promociones-nueva button {
            min-width: 100px;
            min-height: 42px;
            padding: 0 14px;
            border: 1px solid #2d5a3d;
            border-radius: 6px;
            background: #2d5a3d;
            color: #fff;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .06em;
          }

          .admin-promociones-nueva button:disabled,
          .admin-promocion-acciones button:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-promociones-lista {
            display: grid;
            gap: 10px;
          }

          .admin-promocion-card {
            padding: 15px;
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              85px
              95px
              auto;
            gap: 10px;
            align-items: center;
            border: 1px solid #e2dcd4;
            border-radius: 9px;
            background: #fff;
          }

          .admin-promocion-texto,
          .admin-promocion-orden {
            height: 40px;
            padding: 0 11px;
            box-sizing: border-box;
            border: 1px solid #d8d2ca;
            border-radius: 6px;
            outline: none;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 12px;
          }

          .admin-promocion-activa {
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: #555;
            font-size: 9px;
            font-weight: 900;
          }

          .admin-promocion-activa input {
            accent-color: #2d5a3d;
          }

          .admin-promocion-acciones {
            display: flex;
            gap: 6px;
          }

          .admin-promocion-acciones button {
            min-height: 36px;
            padding: 0 12px;
            border: 1px solid #d8d2ca;
            border-radius: 6px;
            background: #fff;
            color: #111;
            cursor: pointer;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .05em;
          }

          .admin-promocion-acciones .guardar {
            border-color: #2d5a3d;
            background: #2d5a3d;
            color: #fff;
          }

          .admin-promocion-acciones .eliminar {
            color: #b42318;
          }

          .admin-promociones-error,
          .admin-promociones-ok {
            margin-bottom: 14px;
            padding: 11px 13px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
          }

          .admin-promociones-error {
            background: #fff0f0;
            color: #b42318;
          }

          .admin-promociones-ok {
            background: #e8f0ea;
            color: #2d5a3d;
          }

          .admin-promociones-status {
            padding: 32px 20px;
            border: 1px solid #e2dcd4;
            border-radius: 9px;
            background: #fff;
            color: #777;
            text-align: center;
            font-size: 12px;
          }

          @media (
            max-width:
            760px
          ) {
            .admin-promociones-head {
              flex-direction: column;
            }

            .admin-promociones-refresh {
              width: 100%;
            }

            .admin-promociones-nueva {
              flex-direction: column;
            }

            .admin-promociones-nueva button {
              width: 100%;
            }

            .admin-promocion-card {
              grid-template-columns:
                minmax(0, 1fr)
                80px;
            }

            .admin-promocion-texto {
              grid-column:
                1 / -1;
            }

            .admin-promocion-activa {
              justify-content: flex-start;
            }

            .admin-promocion-acciones {
              grid-column:
                1 / -1;
            }

            .admin-promocion-acciones button {
              flex: 1;
            }
          }
        `}
      </style>

      <div className="admin-promociones-head">

        <div className="admin-promociones-head-text">
          <span>
            TIENDA
          </span>

          <h2>
            Promociones
          </h2>

          <p>
            Administra los mensajes del roll superior de BRO.
          </p>
        </div>

        <button
          type="button"
          className="admin-promociones-refresh"
          onClick={
            cargarPromociones
          }
          disabled={
            cargando
          }
        >
          ACTUALIZAR
        </button>

      </div>

      <div className="admin-promociones-resumen">

        <span>
          {activas} ACTIVAS
        </span>

        <span>
          {promociones.length} TOTAL
        </span>

      </div>

      {error && (
        <div className="admin-promociones-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="admin-promociones-ok">
          {mensaje}
        </div>
      )}

      <div className="admin-promociones-nueva">

        <input
          type="text"
          value={
            nuevoTexto
          }
          maxLength="120"
          placeholder="Nueva promoción..."
          onChange={(
            evento
          ) => {
            setNuevoTexto(
              evento.target.value
            );

            setError('');
            setMensaje('');
          }}
          onKeyDown={(
            evento
          ) => {
            if (
              evento.key ===
              'Enter'
            ) {
              crear();
            }
          }}
        />

        <button
          type="button"
          disabled={
            guardando ===
            'nuevo'
          }
          onClick={
            crear
          }
        >
          {guardando ===
          'nuevo'
            ? 'GUARDANDO...'
            : 'AÑADIR'}
        </button>

      </div>

      {cargando ? (
        <div className="admin-promociones-status">
          Cargando promociones...
        </div>
      ) : promociones.length ===
        0 ? (
        <div className="admin-promociones-status">
          No hay promociones registradas.
        </div>
      ) : (
        <div className="admin-promociones-lista">

          {promociones.map(
            (
              promocion
            ) => (
              <article
                key={
                  promocion.id
                }
                className="admin-promocion-card"
              >

                <input
                  type="text"
                  className="admin-promocion-texto"
                  value={
                    promocion.texto
                  }
                  maxLength="120"
                  aria-label="Texto de la promoción"
                  onChange={(
                    evento
                  ) =>
                    cambiarCampo(
                      promocion.id,
                      'texto',
                      evento.target.value
                    )
                  }
                />

                <input
                  type="number"
                  className="admin-promocion-orden"
                  min="0"
                  step="1"
                  value={
                    promocion.orden
                  }
                  aria-label="Orden de la promoción"
                  onChange={(
                    evento
                  ) =>
                    cambiarCampo(
                      promocion.id,
                      'orden',
                      evento.target.value
                    )
                  }
                />

                <label className="admin-promocion-activa">

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        promocion.activo
                      )
                    }
                    onChange={(
                      evento
                    ) =>
                      cambiarCampo(
                        promocion.id,
                        'activo',
                        evento.target.checked
                      )
                    }
                  />

                  ACTIVA

                </label>

                <div className="admin-promocion-acciones">

                  <button
                    type="button"
                    className="guardar"
                    disabled={
                      guardando ===
                      promocion.id
                    }
                    onClick={() =>
                      guardar(
                        promocion
                      )
                    }
                  >
                    {guardando ===
                    promocion.id
                      ? '...'
                      : 'GUARDAR'}
                  </button>

                  <button
                    type="button"
                    className="eliminar"
                    disabled={
                      guardando ===
                      promocion.id
                    }
                    onClick={() =>
                      eliminar(
                        promocion
                      )
                    }
                  >
                    ELIMINAR
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

export default AdminPromociones;