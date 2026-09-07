import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  obtenerSuscriptoresAdmin,
} from '../lib/adminNewsletter';

function formatearFecha(
  fecha
) {
  if (!fecha) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat(
      'es-PE',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    ).format(
      new Date(fecha)
    );
  } catch {
    return fecha;
  }
}

async function copiarTexto(
  texto
) {
  if (!texto) {
    return false;
  }

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        texto
      );

      return true;
    }

    const area =
      document.createElement(
        'textarea'
      );

    area.value =
      texto;

    area.style.position =
      'fixed';

    area.style.opacity =
      '0';

    document.body.appendChild(
      area
    );

    area.focus();
    area.select();

    const resultado =
      document.execCommand(
        'copy'
      );

    document.body.removeChild(
      area
    );

    return resultado;
  } catch {
    return false;
  }
}

function AdminSuscriptores() {
  const [
    suscriptores,
    setSuscriptores,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
  ] = useState('');

  const [
    busqueda,
    setBusqueda,
  ] = useState('');

  useEffect(() => {
    cargarSuscriptores();
  }, []);

  async function cargarSuscriptores() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerSuscriptoresAdmin();

      setSuscriptores(
        datos
      );
    } catch (
      errorCarga
    ) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar los suscriptores.'
      );
    } finally {
      setCargando(false);
    }
  }

  const filtrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      if (!texto) {
        return suscriptores;
      }

      return suscriptores.filter(
        (suscriptor) =>
          String(
            suscriptor.email ||
              ''
          )
            .toLowerCase()
            .includes(
              texto
            )
      );
    }, [
      suscriptores,
      busqueda,
    ]);

  const total =
    suscriptores.length;

  const activos =
    suscriptores.filter(
      (suscriptor) =>
        suscriptor.activo !==
        false
    ).length;

  const inactivos =
    total -
    activos;

  async function copiarCorreo(
    correo
  ) {
    const copiado =
      await copiarTexto(
        correo
      );

    if (copiado) {
      setMensaje(
        'Correo copiado.'
      );
    } else {
      setError(
        'No se pudo copiar el correo.'
      );
    }

    setTimeout(() => {
      setMensaje('');
    }, 2000);
  }

  async function copiarActivos() {
    const correos =
      suscriptores
        .filter(
          (suscriptor) =>
            suscriptor.activo !==
            false
        )
        .map(
          (suscriptor) =>
            suscriptor.email
        )
        .filter(Boolean)
        .join(', ');

    if (!correos) {
      setError(
        'No hay correos activos para copiar.'
      );

      return;
    }

    const copiado =
      await copiarTexto(
        correos
      );

    if (copiado) {
      setMensaje(
        `${activos} correos activos copiados.`
      );
    } else {
      setError(
        'No se pudieron copiar los correos.'
      );
    }

    setTimeout(() => {
      setMensaje('');
    }, 2500);
  }

  async function copiarFiltrados() {
    const correos =
      filtrados
        .map(
          (suscriptor) =>
            suscriptor.email
        )
        .filter(Boolean)
        .join(', ');

    if (!correos) {
      setError(
        'No hay correos para copiar.'
      );

      return;
    }

    const copiado =
      await copiarTexto(
        correos
      );

    if (copiado) {
      setMensaje(
        `${filtrados.length} correos copiados.`
      );
    } else {
      setError(
        'No se pudieron copiar los correos.'
      );
    }

    setTimeout(() => {
      setMensaje('');
    }, 2500);
  }

  return (
    <section className="admin-suscriptores">

      <style>
        {`
          .admin-suscriptores {
            width: 100%;
          }

          .admin-suscriptores-heading {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 24px;
            margin-bottom: 28px;
          }

          .admin-suscriptores-heading > div:first-child > span {
            display: block;
            margin-bottom: 7px;
            color: #2d5a3d;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-suscriptores-heading h2 {
            margin: 0 0 7px;
            color: #111;
            font-size: 30px;
          }

          .admin-suscriptores-heading p {
            margin: 0;
            color: #767676;
            font-size: 13px;
          }

          .admin-suscriptores-heading-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .admin-suscriptores-heading-actions button {
            min-height: 39px;
            padding: 0 15px;
            border: 1px solid #d8d2c9;
            border-radius: 7px;
            background: #fff;
            color: #111;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-suscriptores-heading-actions button.principal {
            border-color: #2d5a3d;
            background: #2d5a3d;
            color: #fff;
          }

          .admin-suscriptores-resumen {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 22px;
          }

          .admin-suscriptores-stat {
            padding: 18px;
            border: 1px solid #e3ddd5;
            border-radius: 9px;
            background: #fff;
          }

          .admin-suscriptores-stat span {
            display: block;
            margin-bottom: 5px;
            color: #8c867e;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .11em;
          }

          .admin-suscriptores-stat strong {
            color: #111;
            font-size: 27px;
            line-height: 1;
          }

          .admin-suscriptores-toolbar {
            margin-bottom: 18px;
          }

          .admin-suscriptores-toolbar input {
            width: 100%;
            height: 44px;
            padding: 0 14px;
            box-sizing: border-box;
            border: 1px solid #d8d2c9;
            border-radius: 7px;
            outline: 0;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 13px;
          }

          .admin-suscriptores-toolbar input:focus {
            border-color: #2d5a3d;
            box-shadow:
              0 0 0 3px
              rgba(45, 90, 61, .08);
          }

          .admin-suscriptores-lista {
            overflow: hidden;
            border: 1px solid #e3ddd5;
            border-radius: 9px;
            background: #fff;
          }

          .admin-suscriptor-fila {
            min-height: 66px;
            padding: 11px 15px;
            display: grid;
            grid-template-columns:
              minmax(0, 1.5fr)
              120px
              165px
              80px;
            gap: 14px;
            align-items: center;
            border-bottom:
              1px solid #eee9e2;
          }

          .admin-suscriptor-fila:last-child {
            border-bottom: 0;
          }

          .admin-suscriptor-email {
            min-width: 0;
          }

          .admin-suscriptor-email strong {
            display: block;
            overflow: hidden;
            color: #111;
            font-size: 13px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .admin-suscriptor-email small {
            display: block;
            margin-top: 3px;
            color: #aaa39a;
            font-size: 9px;
          }

          .admin-suscriptor-estado {
            width: max-content;
            padding: 5px 8px;
            border-radius: 999px;
            background: #e8f0ea;
            color: #2d5a3d;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-suscriptor-estado.inactivo {
            background: #f0eeee;
            color: #8a8580;
          }

          .admin-suscriptor-fecha {
            color: #767676;
            font-size: 10px;
          }

          .admin-suscriptor-copiar {
            min-height: 32px;
            border: 1px solid #ddd7cf;
            border-radius: 6px;
            background: #fff;
            color: #111;
            cursor: pointer;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .07em;
          }

          .admin-suscriptores-status,
          .admin-suscriptores-vacio {
            padding: 30px 20px;
            color: #817b74;
            text-align: center;
            font-size: 12px;
          }

          .admin-suscriptores-error,
          .admin-suscriptores-exito {
            margin-bottom: 16px;
            padding: 11px 13px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
          }

          .admin-suscriptores-error {
            background: #fff0f0;
            color: #b42318;
          }

          .admin-suscriptores-exito {
            background: #e8f0ea;
            color: #2d5a3d;
          }

          @media (max-width: 760px) {
            .admin-suscriptores-heading {
              flex-direction: column;
            }

            .admin-suscriptores-heading-actions {
              width: 100%;
              justify-content: stretch;
            }

            .admin-suscriptores-heading-actions button {
              flex: 1;
            }

            .admin-suscriptores-resumen {
              grid-template-columns:
                repeat(3, minmax(0, 1fr));
              gap: 7px;
            }

            .admin-suscriptores-stat {
              padding: 13px 10px;
            }

            .admin-suscriptores-stat span {
              font-size: 7px;
            }

            .admin-suscriptores-stat strong {
              font-size: 21px;
            }

            .admin-suscriptor-fila {
              padding: 14px;
              grid-template-columns:
                minmax(0, 1fr)
                auto;
              gap: 9px;
            }

            .admin-suscriptor-email {
              grid-column:
                1 / 2;
            }

            .admin-suscriptor-estado {
              grid-column:
                2 / 3;
              grid-row:
                1;
            }

            .admin-suscriptor-fecha {
              grid-column:
                1 / 2;
            }

            .admin-suscriptor-copiar {
              grid-column:
                2 / 3;
            }
          }
        `}
      </style>

      <div className="admin-suscriptores-heading">

        <div>
          <span>
            NEWSLETTER
          </span>

          <h2>
            Suscriptores
          </h2>

          <p>
            Correos registrados desde la tienda BRO.
          </p>
        </div>

        <div className="admin-suscriptores-heading-actions">

          <button
            type="button"
            onClick={
              cargarSuscriptores
            }
          >
            ACTUALIZAR
          </button>

          <button
            type="button"
            onClick={
              copiarFiltrados
            }
          >
            COPIAR FILTRADOS
          </button>

          <button
            type="button"
            className="principal"
            onClick={
              copiarActivos
            }
          >
            COPIAR ACTIVOS
          </button>

        </div>

      </div>

      <div className="admin-suscriptores-resumen">

        <article className="admin-suscriptores-stat">
          <span>
            TOTAL
          </span>

          <strong>
            {total}
          </strong>
        </article>

        <article className="admin-suscriptores-stat">
          <span>
            ACTIVOS
          </span>

          <strong>
            {activos}
          </strong>
        </article>

        <article className="admin-suscriptores-stat">
          <span>
            INACTIVOS
          </span>

          <strong>
            {inactivos}
          </strong>
        </article>

      </div>

      {error && (
        <div className="admin-suscriptores-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="admin-suscriptores-exito">
          {mensaje}
        </div>
      )}

      <div className="admin-suscriptores-toolbar">

        <input
          type="search"
          value={
            busqueda
          }
          onChange={(
            evento
          ) => {
            setBusqueda(
              evento.target.value
            );

            setError('');
          }}
          placeholder="Buscar correo..."
        />

      </div>

      <div className="admin-suscriptores-lista">

        {cargando ? (
          <div className="admin-suscriptores-status">
            Cargando suscriptores...
          </div>
        ) : filtrados.length ===
          0 ? (
          <div className="admin-suscriptores-vacio">
            No se encontraron suscriptores.
          </div>
        ) : (
          filtrados.map(
            (
              suscriptor
            ) => (
              <article
                key={
                  suscriptor.id
                }
                className="admin-suscriptor-fila"
              >

                <div className="admin-suscriptor-email">
                  <strong>
                    {
                      suscriptor.email
                    }
                  </strong>

                  <small>
                    BRO NEWSLETTER
                  </small>
                </div>

                <span
                  className={`admin-suscriptor-estado ${
                    suscriptor.activo ===
                    false
                      ? 'inactivo'
                      : ''
                  }`}
                >
                  {suscriptor.activo ===
                  false
                    ? 'INACTIVO'
                    : 'ACTIVO'}
                </span>

                <span className="admin-suscriptor-fecha">
                  {formatearFecha(
                    suscriptor.creado_en
                  )}
                </span>

                <button
                  type="button"
                  className="admin-suscriptor-copiar"
                  onClick={() =>
                    copiarCorreo(
                      suscriptor.email
                    )
                  }
                >
                  COPIAR
                </button>

              </article>
            )
          )
        )}

      </div>

    </section>
  );
}

export default AdminSuscriptores;
