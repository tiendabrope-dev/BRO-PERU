import { useEffect, useMemo, useState } from 'react';

import {
  actualizarCuponAdmin,
  crearCuponAdmin,
  eliminarCuponAdmin,
  obtenerCuponesAdmin,
} from '../lib/adminCupones';

const OPCIONES_TIPO_USO = [
  { valor: 'ilimitado', etiqueta: 'Ilimitado (varios clientes, varias veces)' },
  { valor: 'un_uso_por_cliente', etiqueta: 'Una vez por cliente' },
  { valor: 'un_solo_uso_total', etiqueta: 'Un solo uso (se agota)' },
];

function AdminCupones() {
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevoTipoUso, setNuevoTipoUso] = useState('ilimitado');

  const activos = useMemo(
    () => cupones.filter((item) => item.activo).length,
    [cupones]
  );

  async function cargarCupones() {
    setCargando(true);
    setError('');

    try {
      const datos = await obtenerCuponesAdmin();

      setCupones(datos);
    } catch (errorCarga) {
      setError(errorCarga.message || 'No se pudieron cargar los cupones.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCupones();
  }, []);

  function cambiarCampo(id, campo, valor) {
    setCupones((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );

    setError('');
    setMensaje('');
  }

  async function crear() {
    const codigo = nuevoCodigo.trim();
    const monto = nuevoMonto;

    if (!codigo) {
      setError('Escribe un código de cupón.');
      return;
    }

    if (!monto) {
      setError('Escribe el monto de descuento.');
      return;
    }

    setGuardando('nuevo');
    setError('');
    setMensaje('');

    try {
      const creado = await crearCuponAdmin({
        codigo,
        monto_descuento: monto,
        tipo_uso: nuevoTipoUso,
      });

      setCupones((actuales) => [creado, ...actuales]);

      setNuevoCodigo('');
      setNuevoMonto('');
      setNuevoTipoUso('ilimitado');

      setMensaje('Cupón creado correctamente.');
    } catch (errorCrear) {
      setError(errorCrear.message || 'No se pudo crear el cupón.');
    } finally {
      setGuardando('');
    }
  }

  async function guardar(cupon) {
    setGuardando(cupon.id);
    setError('');
    setMensaje('');

    try {
      const actualizado = await actualizarCuponAdmin(cupon.id, {
        codigo: cupon.codigo,
        monto_descuento: cupon.monto_descuento,
        tipo_uso: cupon.tipo_uso,
        activo: cupon.activo,
      });

      setCupones((actuales) =>
        actuales.map((item) => (item.id === actualizado.id ? actualizado : item))
      );

      setMensaje('Cupón guardado correctamente.');
    } catch (errorGuardar) {
      setError(errorGuardar.message || 'No se pudo guardar el cupón.');
    } finally {
      setGuardando('');
    }
  }

  async function eliminar(cupon) {
    const confirmar = window.confirm(`¿Eliminar el cupón "${cupon.codigo}"?`);

    if (!confirmar) {
      return;
    }

    setGuardando(cupon.id);
    setError('');
    setMensaje('');

    try {
      await eliminarCuponAdmin(cupon.id);

      setCupones((actuales) => actuales.filter((item) => item.id !== cupon.id));

      setMensaje('Cupón eliminado.');
    } catch (errorEliminar) {
      setError(errorEliminar.message || 'No se pudo eliminar el cupón.');
    } finally {
      setGuardando('');
    }
  }

  return (
    <section className="admin-cupones">
      <style>
        {`
          .admin-cupones {
            width: 100%;
          }

          .admin-cupones-head {
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 18px;
          }

          .admin-cupones-head-text > span {
            display: block;
            margin-bottom: 6px;
            color: var(--bro-verde);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-cupones-head h2 {
            margin: 0 0 7px;
            color: var(--bro-texto);
            font-size: 30px;
          }

          .admin-cupones-head p {
            margin: 0;
            color: var(--bro-texto-tenue);
            font-size: 13px;
          }

          .admin-cupones-refresh {
            min-height: 39px;
            padding: 0 15px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 7px;
            background: var(--bro-panel);
            color: var(--bro-texto);
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-cupones-resumen {
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-cupones-resumen span {
            padding: 7px 10px;
            border-radius: 999px;
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-cupones-nueva {
            padding: 15px;
            margin-bottom: 18px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
          }

          .admin-cupones-nueva input,
          .admin-cupones-nueva select {
            height: 42px;
            padding: 0 12px;
            box-sizing: border-box;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 6px;
            outline: none;
            background: var(--bro-panel);
            color: var(--bro-texto);
            font: inherit;
            font-size: 12px;
          }

          .admin-cupones-nueva .codigo {
            width: 160px;
          }

          .admin-cupones-nueva .monto {
            width: 110px;
          }

          .admin-cupones-nueva .tipo-uso {
            flex: 1;
            min-width: 200px;
          }

          .admin-cupones-nueva input:focus,
          .admin-cupones-nueva select:focus,
          .admin-cupon-codigo:focus,
          .admin-cupon-monto:focus,
          .admin-cupon-tipo-uso:focus {
            border-color: var(--bro-verde);
            box-shadow: 0 0 0 3px rgba(45, 90, 61, .08);
          }

          .admin-cupones-nueva button {
            min-width: 100px;
            min-height: 42px;
            padding: 0 14px;
            border: 1px solid var(--bro-verde);
            border-radius: 6px;
            background: var(--bro-verde);
            color: #fff;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .06em;
          }

          .admin-cupones-nueva button:disabled,
          .admin-cupon-acciones button:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-cupones-lista {
            display: grid;
            gap: 10px;
          }

          .admin-cupon-card {
            padding: 15px;
            display: grid;
            grid-template-columns: 150px 100px minmax(190px, 1fr) 90px auto;
            gap: 10px;
            align-items: center;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
          }

          .admin-cupon-codigo,
          .admin-cupon-monto,
          .admin-cupon-tipo-uso {
            height: 40px;
            padding: 0 11px;
            box-sizing: border-box;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 6px;
            outline: none;
            background: var(--bro-panel);
            color: var(--bro-texto);
            font: inherit;
            font-size: 12px;
          }

          .admin-cupon-codigo {
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: .02em;
          }

          .admin-cupon-activo {
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: var(--bro-texto-tenue);
            font-size: 9px;
            font-weight: 900;
          }

          .admin-cupon-activo input {
            accent-color: var(--bro-verde);
          }

          .admin-cupon-acciones {
            display: flex;
            gap: 6px;
          }

          .admin-cupon-acciones button {
            min-height: 36px;
            padding: 0 12px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 6px;
            background: var(--bro-panel);
            color: var(--bro-texto);
            cursor: pointer;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .05em;
          }

          .admin-cupon-acciones .guardar {
            border-color: var(--bro-verde);
            background: var(--bro-verde);
            color: #fff;
          }

          .admin-cupon-acciones .eliminar {
            color: #b42318;
          }

          .admin-cupones-error,
          .admin-cupones-ok {
            margin-bottom: 14px;
            padding: 11px 13px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
          }

          .admin-cupones-error {
            background: #fff0f0;
            color: #b42318;
          }

          .admin-cupones-ok {
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
          }

          .admin-cupones-status {
            padding: 32px 20px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
            color: var(--bro-texto-tenue);
            text-align: center;
            font-size: 12px;
          }

          @media (max-width: 760px) {
            .admin-cupones-head {
              flex-direction: column;
            }

            .admin-cupones-refresh {
              width: 100%;
            }

            .admin-cupones-nueva {
              flex-direction: column;
            }

            .admin-cupones-nueva .codigo,
            .admin-cupones-nueva .monto,
            .admin-cupones-nueva .tipo-uso {
              width: 100%;
            }

            .admin-cupones-nueva button {
              width: 100%;
            }

            .admin-cupon-card {
              grid-template-columns: minmax(0, 1fr);
            }

            .admin-cupon-activo {
              justify-content: flex-start;
            }

            .admin-cupon-acciones button {
              flex: 1;
            }
          }
        `}
      </style>

      <div className="admin-cupones-head">
        <div className="admin-cupones-head-text">
          <span>TIENDA</span>

          <h2>Cupones</h2>

          <p>Crea y administra códigos de descuento.</p>
        </div>

        <button
          type="button"
          className="admin-cupones-refresh"
          onClick={cargarCupones}
          disabled={cargando}
        >
          ACTUALIZAR
        </button>
      </div>

      <div className="admin-cupones-resumen">
        <span>{activos} ACTIVOS</span>
        <span>{cupones.length} TOTAL</span>
      </div>

      {error && <div className="admin-cupones-error">{error}</div>}

      {mensaje && <div className="admin-cupones-ok">{mensaje}</div>}

      <div className="admin-cupones-nueva">
        <input
          type="text"
          className="codigo"
          value={nuevoCodigo}
          maxLength="30"
          placeholder="CÓDIGO"
          onChange={(evento) => {
            setNuevoCodigo(evento.target.value.toUpperCase());
            setError('');
            setMensaje('');
          }}
        />

        <input
          type="number"
          className="monto"
          min="0.10"
          step="0.10"
          value={nuevoMonto}
          placeholder="S/ monto"
          onChange={(evento) => {
            setNuevoMonto(evento.target.value);
            setError('');
            setMensaje('');
          }}
        />

        <select
          className="tipo-uso"
          value={nuevoTipoUso}
          onChange={(evento) => setNuevoTipoUso(evento.target.value)}
        >
          {OPCIONES_TIPO_USO.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={guardando === 'nuevo'}
          onClick={crear}
        >
          {guardando === 'nuevo' ? 'GUARDANDO...' : 'AÑADIR'}
        </button>
      </div>

      {cargando ? (
        <div className="admin-cupones-status">Cargando cupones...</div>
      ) : cupones.length === 0 ? (
        <div className="admin-cupones-status">No hay cupones registrados.</div>
      ) : (
        <div className="admin-cupones-lista">
          {cupones.map((cupon) => (
            <article key={cupon.id} className="admin-cupon-card">
              <input
                type="text"
                className="admin-cupon-codigo"
                value={cupon.codigo}
                maxLength="30"
                aria-label="Código del cupón"
                onChange={(evento) =>
                  cambiarCampo(cupon.id, 'codigo', evento.target.value.toUpperCase())
                }
              />

              <input
                type="number"
                className="admin-cupon-monto"
                min="0.10"
                step="0.10"
                value={cupon.monto_descuento}
                aria-label="Monto de descuento"
                onChange={(evento) =>
                  cambiarCampo(cupon.id, 'monto_descuento', evento.target.value)
                }
              />

              <select
                className="admin-cupon-tipo-uso"
                value={cupon.tipo_uso}
                aria-label="Tipo de uso"
                onChange={(evento) =>
                  cambiarCampo(cupon.id, 'tipo_uso', evento.target.value)
                }
              >
                {OPCIONES_TIPO_USO.map((opcion) => (
                  <option key={opcion.valor} value={opcion.valor}>
                    {opcion.etiqueta}
                  </option>
                ))}
              </select>

              <label className="admin-cupon-activo">
                <input
                  type="checkbox"
                  checked={Boolean(cupon.activo)}
                  onChange={(evento) =>
                    cambiarCampo(cupon.id, 'activo', evento.target.checked)
                  }
                />
                ACTIVO
              </label>

              <div className="admin-cupon-acciones">
                <button
                  type="button"
                  className="guardar"
                  disabled={guardando === cupon.id}
                  onClick={() => guardar(cupon)}
                >
                  {guardando === cupon.id ? '...' : 'GUARDAR'}
                </button>

                <button
                  type="button"
                  className="eliminar"
                  disabled={guardando === cupon.id}
                  onClick={() => eliminar(cupon)}
                >
                  ELIMINAR
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminCupones;
