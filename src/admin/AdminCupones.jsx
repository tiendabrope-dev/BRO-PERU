import { useEffect, useMemo, useState } from 'react';

import {
  actualizarCuponAdmin,
  crearCuponAdmin,
  eliminarCuponAdmin,
  obtenerCuponesAdmin,
  obtenerMetricasCuponesAdmin,
} from '../lib/adminCupones';

const OPCIONES_TIPO_USO = [
  { valor: 'ilimitado', etiqueta: 'Ilimitado (varios clientes, varias veces)' },
  { valor: 'un_uso_por_cliente', etiqueta: 'Una vez por cliente' },
  { valor: 'un_solo_uso_total', etiqueta: 'Un solo uso (se agota)' },
];

const OPCIONES_CATEGORIA = [
  { valor: 'general', etiqueta: 'General' },
  { valor: 'trabajador', etiqueta: 'Trabajador' },
  { valor: 'influencer', etiqueta: 'Influencer' },
];

const ETIQUETA_CATEGORIA = {
  general: 'General',
  trabajador: 'Trabajador',
  influencer: 'Influencer',
};

function formatearSoles(monto) {
  const numero = Number(monto) || 0;

  return `S/ ${numero.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatearFecha(fechaISO) {
  if (!fechaISO) {
    return '—';
  }

  try {
    return new Date(fechaISO).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function AdminCupones() {
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevoTipoUso, setNuevoTipoUso] = useState('ilimitado');
  const [nuevaCategoria, setNuevaCategoria] = useState('general');

  const [metricas, setMetricas] = useState([]);
  const [cargandoMetricas, setCargandoMetricas] = useState(true);
  const [errorMetricas, setErrorMetricas] = useState('');

  const activos = useMemo(
    () => cupones.filter((item) => item.activo).length,
    [cupones]
  );

  const resumenPorCategoria = useMemo(() => {
    const base = {
      general: { vecesUsado: 0, descontado: 0, generado: 0 },
      trabajador: { vecesUsado: 0, descontado: 0, generado: 0 },
      influencer: { vecesUsado: 0, descontado: 0, generado: 0 },
    };

    metricas.forEach((fila) => {
      const grupo = base[fila.categoria] || base.general;

      grupo.vecesUsado += Number(fila.veces_usado) || 0;
      grupo.descontado += Number(fila.soles_descontados) || 0;
      grupo.generado += Number(fila.ventas_generadas) || 0;
    });

    return base;
  }, [metricas]);

  const resumenGeneral = useMemo(() => {
    const totalDescontado = metricas.reduce(
      (acumulado, fila) => acumulado + (Number(fila.soles_descontados) || 0),
      0
    );

    const totalVendido = metricas.reduce(
      (acumulado, fila) => acumulado + (Number(fila.ventas_generadas) || 0),
      0
    );

    const masUsado = metricas.reduce((mejor, fila) => {
      if (!mejor || (Number(fila.veces_usado) || 0) > (Number(mejor.veces_usado) || 0)) {
        return fila;
      }

      return mejor;
    }, null);

    return { totalDescontado, totalVendido, masUsado };
  }, [metricas]);

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

  async function cargarMetricas() {
    setCargandoMetricas(true);
    setErrorMetricas('');

    try {
      const datos = await obtenerMetricasCuponesAdmin();

      setMetricas(datos);
    } catch (errorCarga) {
      setErrorMetricas(
        errorCarga.message || 'No se pudieron cargar las métricas.'
      );
    } finally {
      setCargandoMetricas(false);
    }
  }

  useEffect(() => {
    cargarCupones();
    cargarMetricas();
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
        categoria: nuevaCategoria,
      });

      setCupones((actuales) => [creado, ...actuales]);

      setNuevoCodigo('');
      setNuevoMonto('');
      setNuevoTipoUso('ilimitado');
      setNuevaCategoria('general');

      setMensaje('Cupón creado correctamente.');

      cargarMetricas();
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
        categoria: cupon.categoria,
        activo: cupon.activo,
      });

      setCupones((actuales) =>
        actuales.map((item) => (item.id === actualizado.id ? actualizado : item))
      );

      setMensaje('Cupón guardado correctamente.');

      cargarMetricas();
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

          .admin-cupones-nueva .categoria {
            width: 150px;
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
            grid-template-columns: 140px 90px minmax(170px, 1fr) 120px 90px auto;
            gap: 10px;
            align-items: center;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
          }

          .admin-cupon-codigo,
          .admin-cupon-monto,
          .admin-cupon-tipo-uso,
          .admin-cupon-categoria {
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

          /* ==================================================
             MÉTRICAS
          ================================================== */

          .admin-cupones-metricas {
            margin-top: 34px;
          }

          .admin-cupones-metricas-titulo {
            margin: 0 0 14px;
            color: var(--bro-texto);
            font-size: 18px;
            font-weight: 800;
          }

          .admin-metricas-resumen-general {
            margin-bottom: 16px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }

          .admin-metricas-tarjeta {
            padding: 14px 16px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 10px;
            background: var(--bro-panel);
          }

          .admin-metricas-tarjeta span {
            display: block;
            margin-bottom: 6px;
            color: var(--bro-texto-tenue);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.06em;
          }

          .admin-metricas-tarjeta strong {
            display: block;
            color: var(--bro-texto);
            font-size: 18px;
          }

          .admin-metricas-categorias {
            margin-bottom: 22px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }

          .admin-metricas-categoria {
            padding: 14px 16px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 10px;
            background: var(--bro-verde-palido);
          }

          .admin-metricas-categoria h4 {
            margin: 0 0 10px;
            color: var(--bro-verde-fuerte);
            font-size: 12px;
            font-weight: 900;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .admin-metricas-categoria p {
            margin: 0 0 4px;
            color: var(--bro-texto);
            font-size: 12px;
          }

          .admin-metricas-categoria p:last-child {
            margin-bottom: 0;
          }

          .admin-metricas-tabla-wrap {
            overflow-x: auto;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 10px;
          }

          .admin-metricas-tabla {
            width: 100%;
            min-width: 720px;
            border-collapse: collapse;
            background: var(--bro-panel);
          }

          .admin-metricas-tabla th,
          .admin-metricas-tabla td {
            padding: 10px 12px;
            border-bottom: 1px solid var(--bro-borde-fuerte);
            text-align: left;
            font-size: 12px;
            color: var(--bro-texto);
            white-space: nowrap;
          }

          .admin-metricas-tabla th {
            color: var(--bro-texto-tenue);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }

          .admin-metricas-tabla tr:last-child td {
            border-bottom: 0;
          }

          .admin-metricas-badge {
            padding: 3px 8px;
            border-radius: 999px;
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
            font-size: 10px;
            font-weight: 800;
          }

          .admin-metricas-badge.inactivo {
            background: var(--bro-icono-fondo);
            color: var(--bro-texto-tenue);
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
            .admin-cupones-nueva .tipo-uso,
            .admin-cupones-nueva .categoria {
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

            .admin-metricas-resumen-general,
            .admin-metricas-categorias {
              grid-template-columns: minmax(0, 1fr);
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

        <select
          className="categoria"
          value={nuevaCategoria}
          onChange={(evento) => setNuevaCategoria(evento.target.value)}
        >
          {OPCIONES_CATEGORIA.map((opcion) => (
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

              <select
                className="admin-cupon-categoria"
                value={cupon.categoria || 'general'}
                aria-label="Categoría del cupón"
                onChange={(evento) =>
                  cambiarCampo(cupon.id, 'categoria', evento.target.value)
                }
              >
                {OPCIONES_CATEGORIA.map((opcion) => (
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

      <div className="admin-cupones-metricas">
        <h3 className="admin-cupones-metricas-titulo">
          Métricas de uso
        </h3>

        {errorMetricas && (
          <div className="admin-cupones-error">{errorMetricas}</div>
        )}

        {cargandoMetricas ? (
          <div className="admin-cupones-status">
            Cargando métricas...
          </div>
        ) : metricas.length === 0 ? (
          <div className="admin-cupones-status">
            Todavía no hay usos de cupones registrados.
          </div>
        ) : (
          <>
            <div className="admin-metricas-resumen-general">
              <div className="admin-metricas-tarjeta">
                <span>TOTAL DESCONTADO</span>
                <strong>
                  {formatearSoles(resumenGeneral.totalDescontado)}
                </strong>
              </div>

              <div className="admin-metricas-tarjeta">
                <span>VENTAS GENERADAS CON CUPÓN</span>
                <strong>
                  {formatearSoles(resumenGeneral.totalVendido)}
                </strong>
              </div>

              <div className="admin-metricas-tarjeta">
                <span>CUPÓN MÁS USADO</span>
                <strong>
                  {resumenGeneral.masUsado &&
                  Number(resumenGeneral.masUsado.veces_usado) > 0
                    ? `${resumenGeneral.masUsado.codigo} (${resumenGeneral.masUsado.veces_usado})`
                    : '—'}
                </strong>
              </div>
            </div>

            <div className="admin-metricas-categorias">
              {OPCIONES_CATEGORIA.map((opcion) => {
                const datos =
                  resumenPorCategoria[opcion.valor] || {
                    vecesUsado: 0,
                    descontado: 0,
                    generado: 0,
                  };

                return (
                  <div
                    key={opcion.valor}
                    className="admin-metricas-categoria"
                  >
                    <h4>{opcion.etiqueta}</h4>

                    <p>Veces usado: {datos.vecesUsado}</p>
                    <p>
                      Descontado: {formatearSoles(datos.descontado)}
                    </p>
                    <p>
                      Ventas generadas:{' '}
                      {formatearSoles(datos.generado)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="admin-metricas-tabla-wrap">
              <table className="admin-metricas-tabla">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Veces usado</th>
                    <th>Descontado</th>
                    <th>Ventas generadas</th>
                    <th>Ticket promedio</th>
                    <th>Último uso</th>
                  </tr>
                </thead>

                <tbody>
                  {metricas.map((fila) => {
                    const vecesUsado = Number(fila.veces_usado) || 0;

                    const ventasGeneradas =
                      Number(fila.ventas_generadas) || 0;

                    const ticketPromedio =
                      vecesUsado > 0
                        ? ventasGeneradas / vecesUsado
                        : 0;

                    return (
                      <tr key={fila.cupon_id}>
                        <td>{fila.codigo}</td>

                        <td>
                          {ETIQUETA_CATEGORIA[fila.categoria] ||
                            'General'}
                        </td>

                        <td>
                          <span
                            className={`admin-metricas-badge${
                              fila.activo ? '' : ' inactivo'
                            }`}
                          >
                            {fila.activo ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </td>

                        <td>{vecesUsado}</td>

                        <td>
                          {formatearSoles(fila.soles_descontados)}
                        </td>

                        <td>{formatearSoles(ventasGeneradas)}</td>

                        <td>
                          {vecesUsado > 0
                            ? formatearSoles(ticketPromedio)
                            : '—'}
                        </td>

                        <td>{formatearFecha(fila.ultimo_uso)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default AdminCupones;
